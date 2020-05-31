const $modal= document.querySelector(".conteiner-modal");
const $novo = document.querySelector("#novo");
const $fechar = document.querySelector("#fechar");
const $salvar= document.querySelector("#salvar");
const $nome = document.querySelector("#nome")
const $numero = document.querySelector("#numero")
const $cep = document.querySelector("#cep")
const $email = document.querySelector("#email")
const $estado = document.querySelector("#estado")
const $celular = document.querySelector("#celular")
const $endereco = document.querySelector("#endereco")
const $bairro = document.querySelector("#bairro")
const $cidade = document.querySelector("#cidade")
let codigoAtual;

const $registros = document.querySelector("#registros")


let banco = []

const lerBD = () => {
    const jsonBanco = JSON.parse( localStorage.getItem("BD") )
    banco = jsonBanco ? jsonBanco : [];
}

const gravarBD = () =>{
    const jsonBanco = JSON.stringify (banco)
    localStorage.setItem( "BD", jsonBanco)
}   

const limparTabela = () => {
    // $registros = document.querySelector("#registros")
    while ($registros.firstChild) {
        $registros.removeChild($registros.firstChild);
    }
}

const exibirTabela = () => {
    // $registros = document.querySelector("#registros");
    lerBD();
    limparTabela();

    banco.map(registro => {

        $tr = document.createElement("tr"); //criando uma linha
        $tr.innerHTML = `
            <td>${registro.codigo}</td>
            <td>${registro.nome}</td>
            <td>${registro.email}</td>
            <td>${registro.celular}</td>
            <td>${registro.cidade}</td>
            <td class="acoes">
                <button class="botao" id="editar-${registro.codigo}">Editar</button>
                <button class="botao" id="excluir-${registro.codigo}">Excluir</button>
            </td>

        `
        $registros.insertBefore($tr, null);
    });

}


const adicionarRegistro = (registro) => {

    const ultimoIndice = banco.length - 1;
    let novoCodigo;
    if( ultimoIndice == -1 ){
        novoCodigo = 1
    }else{
        novoCodigo = parseInt(banco[ultimoIndice].codigo) + 1
    }

    registro.codigo = novoCodigo.toString(); //atribui um novo código ao proximo registro
    banco.push(registro);
    gravarBD();
}

const removerRegistro = (codigo) => {

    const indice = banco.findIndex(registro => registro.codigo == codigo) //findIndex vai percorrer o array e comparar se o código digitado ou selecionado é igual ao seu codigo
    banco.splice(indice, 1)
    gravarBD()
}

const atualizarRegistro = (codigo, registro) => {
    const indice = banco.findIndex(registroAtualizado => registroAtualizado.codigo == codigo);
    banco.splice(indice, 1, registro)
    gravarBD()
}

const lerRegistro = (codigo) => {
    lerBD();
    return banco.filter (rs => rs.codigo == codigo)
}


const pipe = (...fns) => arg => fns.reduce ((val, fn) => fn (val), arg )

const limparCampos = () =>{
    const $campos = Array.from(document.querySelectorAll("input"));
    $campos.map(campo => campo.value = "")
}

const salvarDados = () => {

    const novoRegistro = {
        nome: $nome.value,
        email: $email.value,
        celular: $celular.value,
        endereco: $endereco.value,
        numero: $numero.value,
        bairro: $bairro.value,
        cidade: $cidade.value,
        estado: $estado.value,
        cep: $cep.value
    }
    if( $salvar.textContent == "Salvar"){
        adicionarRegistro(novoRegistro)
    }else{
        novoRegistro.codigo = codigoAtual;
        atualizarRegistro( codigoAtual, novoRegistro)
    }
    // banco.push(novoRegistro)
}

const limitarCaracteres = () => {
    $nome.maxLength = 60;
    $email.maxLength = 60;
    $celular.maxLength = 14;
    $endereco.maxLength = 60;
    $numero.maxLength = 4;
    $bairro.maxLength = 40;
    $cidade.maxLength = 40;
    $estado.maxLength = 2;
    $cep.maxLength = 9;
}

const removerErro = (campo) => campo.classList.remove("erroCampo");

const abrirModal = (el) =>  el.classList.add("exibirModal")

const fecharModal = (el) => el.classList.remove("exibirModal")

const validarCampos = () =>{
    //função inperativa
    /*const $campos = document.querySelectorAll("input")
    const ultimoCampo = $campos.length -1;
    for (let i = 0; i <= ultimoCampo; i++){
        if($campos[i].value == false){
            return false
        }
    }
    return true;*/

    // FUNÇÃO DECLARATIVA
    const $campos = Array.from(document.querySelectorAll("input"));

    const camposVazios = $campos.filter((campo) => campo.value == false)

    camposVazios.map(campos => campos.classList.add("erroCampo"))

    return camposVazios.length == 0;
}

const filtrarTexto = (txt) => txt.replace( /[^A-Za-zÀ-ÿ ]/g, "");

const filtrarNumero = (txt) => txt.replace(/[^0-9]/g, "");

const filtrarEmail = (txt) => txt.replace(/[^@-Za-z0-9_.-]/g, "");

const filtrarEndereco = txt => txt.replace(/[^A-Za-zÀ-ÿ0-9. ]/g, "");

const filtrarBairro = txt => txt.replace(/[^A-Za-zÀ-ÿ ]/g, "")

const filtrarEstado = txt => txt.replace(/[^A-Z]/g, "")

const maiuscula = texto => texto.toUpperCase().trim();
const mascaraEstado = pipe(filtrarTexto,maiuscula)

const mascaraCelular = texto => filtrarNumero(texto)
                                .replace(/(.)/,"($1")
                                .replace(/(.{3})(.)/,"$1)$2")
                                .replace(/(.{9})(.)/,"$1-$2");


const preencherCampos = (endereco) => {
    $endereco.value = endereco.logradouro;
    $bairro.value = endereco.bairro;
    $cidade.value = endereco.cidade;
    $estado.value = endereco.estado;
}


const encontrarEndereco = cep => {
    if(cep.length == 9){

        // const url = `https://viacep.com.br/ws/${cep}/json/`
        // const viacep = fetch (url)
        //         .then (response => (response.json()))
        //         .then (response => preencherCampos(response))
        
        const url = `https://api.postmon.com.br/v1/cep/${cep}`
        const postmon = fetch (url)
                 .then (response => (response.json()))
                 .then (response => preencherCampos(response))
    }
};


const salvarAluno = () => {
    if (validarCampos()){
        salvarDados();
        exibirTabela();
        limparCampos();
    }else{
        alert("Verifique os campos")
    }
}


/*const mascaraNumero = () =>{
    let texto = $numero.value;    //
    texto = formatarNumero(texto);
    $numero.value = texto;
}*/

//const mascaraNome = () => {
    // let texto = $nome.value;
    // texto = formatarTexto(texto);
        //texto = "oi"
    // $nome.value = texto;
//}



//const mascaraNome = txt => (filtrarTexto(txt)) 
const mascaraNome = pipe (filtrarTexto)


const addHifenCep = (numeros) => numeros.replace(/(.{5})(.)/,"$1-$2");
const mascaraCep = pipe (filtrarNumero,addHifenCep)
//const mascaraCep = texto => addHifenCep(filtrarNumero(texto))

    // let texto = campo.value;
    
    // campo.maxLength = 9;
    // texto = texto.replace (/[^0-9]/g, "")
    //              .replace (/(.{5})(.)/,"$1-$2")
    
    // campo.value = texto;
    // removerErro(campo);



    // texto = filtrarNumero(texto);
    // texto = addHifenCep(texto);
    // return texto;






limitarCaracteres()


const fechar = () =>{
    fecharModal($modal);
    limparCampos();
}

exibirTabela()

const identificarAcao = (e) => {

    const [ acao, codigo ] = e.target.id.split("-")

    // const acao = e.target.id.replace ( /-[0-9]*/, "");
    // const codigo = e.target.id.replace (acao+"-", "")

    if( acao == "excluir"){
        removerRegistro ( codigo )

    }else if(acao == "editar"){
        const dados =  (lerRegistro( codigo ));
        $nome.value = dados[0].nome;
        $email.value = dados[0].email;
        $celular.value = dados[0].celular;
        $endereco.value = dados[0].endereco;
        $numero.value = dados[0].numero;
        $bairro.value = dados[0].bairro;
        $cidade.value = dados[0].cidade;
        $estado.value = dados[0].estado;
        $cep.value = dados[0].cep;
        $salvar.textContent = "Atualizar"
        codigoAtual = codigo
        abrirModal($modal)
    }
    exibirTabela();
}

const novoCadastro = () => {
    limparCampos();
    $salvar.textContent = "Salvar"
    abrirModal($modal);
}




exibirTabela();
$novo.addEventListener("click", novoCadastro)
// $novo.addEventListener("click", () => abrirModal($modal));
// $fechar.addEventListener("click", () => fecharModal($modal))
$fechar.addEventListener("click", fechar)
$salvar.addEventListener("click", salvarAluno)
$nome.addEventListener("keyup",() => $nome.value = filtrarTexto($nome.value) )
$numero.addEventListener("keyup", () => $numero.value = filtrarNumero($numero.value))
$email.addEventListener("keyup", () => $email.value = filtrarEmail($email.value))
$cep.addEventListener("keyup", () => $cep.value = mascaraCep($cep.value));
$endereco.addEventListener("keyup", () => $endereco.value = filtrarEndereco($endereco.value))
$bairro.addEventListener("keyup", () => $bairro.value = filtrarBairro($bairro.value))
$estado.addEventListener("keyup", () => $estado.value = mascaraEstado($estado.value))
$celular.addEventListener("keyup", () => $celular.value = mascaraCelular($celular.value))
$cep.addEventListener("keypress", () => encontrarEndereco($cep.value));


$registros.addEventListener("click", identificarAcao)