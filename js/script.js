

const fileInput = document.querySelector("input[type=file]");
const output = document.querySelector(".output");

fileInput.addEventListener("change", async function () {
    const file =  fileInput.files[0];

    if (file) {
        let texto = await file.text();        
        readModel(texto);

        console.dir(file)
        console.log(Object.keys(file))
    }
});


function  readModel (modelo) {
    /*função de identificação de caracteres*/

    let posicaoAtual = 0;
    let inicio = modelo.indexOf("{{", posicaoAtual);    
    let fim = modelo.indexOf("}}", posicaoAtual)
    let count = 0;
    let listaVars = [];

    while (inicio != -1) {
        let comeco = inicio + 2;
        
        fim = modelo.indexOf("}}", inicio)    
        
        let variavel = modelo.slice(comeco, fim);

        listaVars.push(variavel);

        console.log("Lista de Variaveis lidas: "+listaVars)
        count = count + 1;

        posicaoAtual = fim + 2;

        inicio = modelo.indexOf("{{", posicaoAtual)

    } 

    renderFields(listaVars);

}


function renderFields (lista) { //função de renderizaçao de campos 

    // criar novo elemento
    let area = document.querySelector(".form-dynamic");
    area.innerHTML = "";// limpa campos sempre quando novo modelo é inserido

    for (let i = 0; i < lista.length ;i++) {

        const INPUT = document.createElement("input");
        INPUT.name = lista[i];
        INPUT.id = lista[i];
        INPUT.placeholder = lista[i];
        INPUT.required = true;

        area.appendChild(INPUT);
       
    }

    

}

function collectData () { // coleta dados que o usuario inseriu

    let DADOS = new Object();

    DADOS = {
        
        nome: "",
        cpf:"",
        idade:""
        
    }

    let formDynamic = document.querySelector(".form-dynamic");
    let listaInputs = formDynamic.childNodes;
    let listaDados = Object.keys(DADOS);
    let listaValores = [];
    console.log(formDynamic)

    for (let i = 0; i < listaInputs.length; i++) {
        console.log(listaInputs[i].name);
        let valorDigitado = listaInputs[i].value;
        listaValores.push(valorDigitado);
        DADOS[listaDados[i]] = valorDigitado;
    }

    console.log(DADOS);
    console.log(listaValores);
}