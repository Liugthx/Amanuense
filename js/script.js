

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


}
