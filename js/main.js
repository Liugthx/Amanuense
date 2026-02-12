let Locador = {
    nome: 'Guilherme',
    cpf: '445.768.168-70',
    rg: '522.014.72-0',
    profissao: 'Programador',
    email: 'guifirmo181@gmail.com'
}


let texto = `Meu nome é {{nomeLocador1}}, de CPF: {{cpfLocador1}} de RG: {{rgLocador1}}. Solteiro, {{profisaoLocador1}} de email: {{emailLocador1}}
`
console.log(texto)

// como eu procuro em uma string o simbolo {{}} ?
for (let i = 0; i < texto.length; i++) {
   // console.log(texto[i])
    let silabas = texto[i];
    if (silabas == "{") {
        var variaveis = new Array();
        variaveis = silabas;
        
    } else if (silabas == "}") break //para a execução

}
console.log(variaveis)




