// animação da página

const loginContainer = document.getElementById('login-container')

const moveOverlay = () => loginContainer.classList.toggle('move')

document.getElementById('open-register').addEventListener('click', moveOverlay)
document.getElementById('open-login').addEventListener('click', moveOverlay)

document.getElementById('open-register-mobile').addEventListener('click', moveOverlay)
document.getElementById('open-login-mobile').addEventListener('click', moveOverlay)

// captura do form de cadastro
const formCadastroHtml = document.getElementById('formCadastro')
let nomeCadastroHtml = document.getElementById('nomeCadastro')
let emailCadastroHtml = document.getElementById('emailCadastro')
let passwordCadastro = document.getElementById('passwordCadastro')
const toastNotificacao = document.getElementById('toastNotificacaoIndex')

formCadastroHtml.addEventListener('submit', (event) => {
    event.preventDefault()

     criarUsuario();
  
})


// captura do form de login

const formLoginHtml = document.getElementById('formLogin')
let emailLoginHtml = document.getElementById('emailLogin')
let passwordLoginHtml = document.getElementById('passwordLogin')

formLoginHtml.addEventListener('submit', (ev)=>{
    ev.preventDefault()
    fazerLogin()
})

// funções
function criarUsuario(){
    let listaUsuariosCadastrados  = buscarUsuariosStorage()

    let verificarUsuario = listaUsuariosCadastrados .some((valor)=> valor.email === emailCadastroHtml.value)

    if(verificarUsuario){
        toastAlertIndex('danger', 'Tente outro E-mail, pois esse já está cadastrado. 😐')
        return
        
    }

    let novoUsuario = {
        nome: nomeCadastroHtml.value,
        email:emailCadastroHtml.value,
        senha:passwordCadastro.value,
        recados:[]
    }

    listaUsuariosCadastrados.push(novoUsuario)
    salvarUsuarioStorage(listaUsuariosCadastrados)
    formCadastroHtml.reset()
    toastAlertIndex('success','Cadastro realizado com sucesso.👌')
    console.log(listaUsuariosCadastrados);

}
function  fazerLogin(){
    let usuarios = buscarUsuariosStorage()
    let usuarioEncontrado = usuarios.find((usuario)=> usuario.email === emailLoginHtml.value && usuario.senha === passwordLoginHtml.value)

    if(usuarioEncontrado){
        toastAlertIndex('success','Login feito com sucesso.👌')
        setTimeout(() => {
            localStorage.setItem('usuarioLogadoRecado', JSON.stringify(usuarioEncontrado))
     
            location.href = 'home.html';
        }, 1000)

       
        // console.log(usuarioEncontrado.nome);
    }else{
        toastAlertIndex('danger','Dados incorretos tente novamente.😑')
    }
}

function buscarUsuariosStorage(){
    return JSON.parse(localStorage.getItem('usuariosNoStorage') || '[]')
}

function salvarUsuarioStorage(listaDados) {
    localStorage.setItem('usuariosNoStorage', JSON.stringify(listaDados));
}

function toastAlertIndex(modo, mensagem) {

    const toast = document.createElement('div');
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('class', 'toast align-items-center border-0 show');
    toast.classList.add(`text-bg-${modo}`);

    const content = document.createElement('div');
    content.setAttribute('class', 'd-flex');

    const toastBody = document.createElement('div')
    toastBody.setAttribute('class', 'toast-body')
    toastBody.innerHTML = `${mensagem}`

    const butttonDismiss = document.createElement('button')
    butttonDismiss.setAttribute('type', 'button')
    butttonDismiss.setAttribute('class', 'btn-close btn-close-white me-2 m-auto')
    butttonDismiss.setAttribute('data-bs-dismiss', 'toast')
    butttonDismiss.setAttribute('aria-label', 'Fechar notificação')

    content.appendChild(toastBody)
    content.appendChild(butttonDismiss)
    toast.appendChild(content);

    toastNotificacao.appendChild(toast)

    setTimeout(() => {
        toastNotificacao.children[0].remove()
    }, 5000)

}