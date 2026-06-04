let modeloGlobal = "";
const fileInput = document.querySelector("#file-upload");
const output = document.querySelector(".output");
const btnExportar = document.querySelector("#btn-exportar");
let DADOS = {};

fileInput.addEventListener("change", async function () {
  const file = fileInput.files[0];

  if (file) {
    let texto = await file.text();
    modeloGlobal = texto;

    // Limpa os dados antigos antes de ler o novo modelo
    DADOS = {};
    readModel(texto);

    // Ativa o botão de exportar
    btnExportar.disabled = false;
  }
});

function readModel(modelo) {
  let posicaoAtual = 0;
  let inicio = modelo.indexOf("{{", posicaoAtual);
  let listaVars = [];

  while (inicio != -1) {
    let comeco = inicio + 2;
    let fim = modelo.indexOf("}}", inicio);
    let variavel = modelo.slice(comeco, fim).trim();

    if (!listaVars.includes(variavel)) {
      listaVars.push(variavel);
    }

    posicaoAtual = fim + 2;
    inicio = modelo.indexOf("{{", posicaoAtual);
  }

  DADOS = buildDynamicObject(listaVars);
  renderFields(listaVars);
  loadDocument(); // Faz uma primeira renderização mesmo com campos vazios
}

function buildDynamicObject(listaVars) {
  let objetoConstruido = {};
  for (let i = 0; i < listaVars.length; i++) {
    let caminho = listaVars[i];
    let partes = caminho.split(".");

    let grupo = partes[0];
    let campo = partes[1];

    if (!objetoConstruido[grupo]) {
      objetoConstruido[grupo] = {};
    }
    objetoConstruido[grupo][campo] = "";
  }
  return objetoConstruido;
}

function renderFields(lista) {
  let area = document.querySelector(".form-dynamic");
  area.innerHTML = "";

  for (let i = 0; i < lista.length; i++) {
    const INPUT = document.createElement("input");
    INPUT.name = lista[i];
    INPUT.id = lista[i];

    let labelAmigavel = lista[i].replace(".", " ");
    labelAmigavel =
      labelAmigavel.charAt(0).toUpperCase() + labelAmigavel.slice(1);

    INPUT.placeholder = labelAmigavel;
    INPUT.required = true;

    INPUT.addEventListener("input", function () {
      loadDocument();
    });

    area.appendChild(INPUT);
  }
}

function collectData() {
  let formDynamic = document.querySelector(".form-dynamic");
  let listaInputs = formDynamic.children;

  for (let i = 0; i < listaInputs.length; i++) {
    let caminho = listaInputs[i].name;
    let partes = caminho.split(".");
    let grupo = partes[0];
    let campo = partes[1];
    let valorDigitado = listaInputs[i].value;

    DADOS[grupo][campo] = valorDigitado;
  }
  return DADOS;
}

function generateDocument(modelo, dados) {
  let resultado = modelo;
  let grupos = Object.keys(dados);

  for (let i = 0; i < grupos.length; i++) {
    let grupo = grupos[i];
    let campos = Object.keys(dados[grupo]);

    for (let j = 0; j < campos.length; j++) {
      let campo = campos[j];
      let valor = dados[grupo][campo];
      let placeholder = "{{" + grupo + "." + campo + "}}";

      resultado = resultado.replaceAll(placeholder, valor);
    }
  }
  return resultado;
}

function loadDocument() {
  let dados = collectData();
  let result = generateDocument(modeloGlobal, dados);
  output.textContent = result;
}

// ==========================================
// FUNÇÃO PARA EXPORTAR EM ARQUIVO .DOCX (WORD)
// ==========================================
btnExportar.addEventListener("click", function () {
  // Pega o texto atualizado da pré-visualização
  let textoContrato = output.textContent;

  // Divide o texto por quebras de linha para criar parágrafos separados no Word
  let linhas = textoContrato.split("\n");

  // Transforma cada linha de texto em um componente de parágrafo da biblioteca 'docx'
  let paragrafosWord = linhas.map((linha) => {
    return new docx.Paragraph({
      children: [
        new docx.TextRun({
          text: linha,
          font: "Times New Roman",
          size: 24, // Tamanho 24 na biblioteca equivale ao tamanho 12 no Word
        }),
      ],
      spacing: {
        after: 200, // Adiciona um espaçamento confortável após cada parágrafo
        line: 360, // Espaçamento entre linhas de 1.5
      },
    });
  });

  // Cria a estrutura do documento Word
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: paragrafosWord,
      },
    ],
  });

  // Gera o arquivo e inicia o download no navegador do usuário
  docx.Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Contrato_Gerado.docx");
  });
});
