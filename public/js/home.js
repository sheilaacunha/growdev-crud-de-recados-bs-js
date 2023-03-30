// captura dos dados

const modalRecados = new bootstrap.Modal("#modalRecados");
const modalApagar = new bootstrap.Modal('#modalApagar')
const modalEditar = new bootstrap.Modal('#modalEditar')

const nomeUsuarioLogadoHtml = document.getElementById('nomeUsuarioLogado')

const formRecadosHtml = document.getElementById('formRecados')
const formEditarHtml = document.getElementById('formEditar')

const inputDescricaoHtml = document.getElementById('inputDescricao')
const inputDetalhamentoHtml = document.getElementById('inputDetalhamento')

const descricaoEditada = document.getElementById('descricaoEditada')
const detalhamentoEditado = document.getElementById('detalhamentoEditado')

const cardRecadosHtml = document.getElementById('cardRecados')
const toastNotificacao = document.getElementById('toastNotificacao')

const btnSairHtml = document.getElementById('btnSair')

let idEditar = -1

const usuarioLogado = buscarUsuarioLogado()

document.addEventListener('DOMContentLoaded', () => {

    if (!usuarioLogado) {

        toastAlert('danger', 'Voce precisa estar logado para acessar essa página!!!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000)

    }
    // nome do usuario na página
    nomeUsuarioLogadoHtml.innerHTML = usuarioLogado.nome

    usuarioLogado.recados.forEach((recado) => recadosNoHtml(recado))
})

formRecadosHtml.addEventListener('submit', (event) => {
    event.preventDefault()
    // chamar a validação deste formulario
    if (!formRecadosHtml.checkValidity()) {
        formRecadosHtml.classList.add('was-validated')
        return
    }
    criarRecados()
})

formEditarHtml.addEventListener('submit', (ev) => {
    ev.preventDefault()

    // if (!formEditarHtml.checkValidity()) {
    //     formEditarHtml.classList.add('was-validated')
    //     return
    // }

    const indiceEditado = usuarioLogado.recados.findIndex((recado) => recado.id === idEditar)

    // console.log(indiceEditado)
    // console.log(usuarioLogado.recados[indiceEditado].descricao);

    usuarioLogado.recados[indiceEditado].descricao = descricaoEditada.value
    usuarioLogado.recados[indiceEditado].detalhamento = detalhamentoEditado.value


    const cardTitle = document.querySelector(`#recado-${idEditar} .card-title`)
    cardTitle.innerHTML = descricaoEditada.value

        // const cardText = document.querySelector(`#recado-${idEditar} .card-text`)
        // cardText.innerHTML = detalhamentoEditado.value

    atualizarUsuarioLogadoStorage(usuarioLogado)



    console.log(descricaoEditada.value);
    console.log(detalhamentoEditado.value);
    
    modalEditar.hide()
    toastAlert('success', 'Recado editado com sucesso!')
    idEditar = -1
    formEditarHtml.classList.remove('was-validated')

})

btnSairHtml.addEventListener('click', sair)

// funções
function criarRecados() {

    let indiceMaior = usuarioLogado.recados.reduce((acc, next) => {
        if (acc > next.id) {
            console.log(acc)
            return acc.id
        }
        return next.id
    }, 0)

    let id = indiceMaior ? indiceMaior + 1 : 1;

    const novoRecado = {
        id,
        data: dataAtual(),
        descricao: inputDescricaoHtml.value,
        detalhamento: inputDetalhamentoHtml.value,
    }
    usuarioLogado.recados.push(novoRecado)
    atualizarUsuarioLogadoStorage(usuarioLogado)
    formRecadosHtml.reset()
    recadosNoHtml(novoRecado)
    modalRecados.hide()
    formRecadosHtml.classList.remove('was-validated')
    toastAlert('success', 'Recado cadastrado com sucesso!')
}
function recadosNoHtml(recado) {
    const { id, data, descricao, detalhamento } = recado

    const col = document.createElement('div')
    col.classList.add('col-12', 'col-sm-6', 'col-lg-6', 'col-xl-3')
    col.setAttribute('id', `${id}`)

    const card = document.createElement('div')
    card.classList.add('card', 'bg-secondary-subtle')

    const cardHeader = document.createElement('div')
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-around')

    const idRecado = document.createElement('div')
    idRecado.classList.add('text-secondary')
    idRecado.innerHTML = id

    const dataRecado = document.createElement('div')
    dataRecado.classList.add('text-secondary')
    dataRecado.innerHTML = data

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    const cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title', 'd-flex', 'justify-content-center')
    cardTitle.innerHTML = descricao

    const cardText = document.createElement('p')
    cardText.classList.add('card-text', 'text-center')
    cardText.innerHTML = detalhamento

    const divBtn = document.createElement('div')
    divBtn.classList.add('d-flex', 'justify-content-evenly')

    const btnEditar = document.createElement('button')
    btnEditar.classList.add('btn', 'btn-secondary')
    btnEditar.innerHTML = `<i class="bi bi-pencil-square"></i>`
    btnEditar.addEventListener('click', () => {
        modalEditar.show()
        descricaoEditada.value = descricao
        detalhamentoEditado.value = detalhamento
        idEditar = id
    })

    const btnApagar = document.createElement('button')
    btnApagar.classList.add('btn', 'btn-danger')
    btnApagar.innerHTML = ` <i class="bi bi-trash3"></i>`
    btnApagar.addEventListener('click', () => {
        modalApagar.show()
        const btnConfirmaExclusao = document.getElementById('btnConfirmaExclusao')
        btnConfirmaExclusao.setAttribute('onclick', `apagar(${id})`)
    })

    cardHeader.appendChild(idRecado)
    cardHeader.appendChild(dataRecado)

    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardText)
    cardBody.appendChild(divBtn)

    divBtn.appendChild(btnEditar)
    divBtn.appendChild(btnApagar)

    card.appendChild(cardHeader)
    card.appendChild(cardBody)

    col.appendChild(card)

    cardRecadosHtml.appendChild(col)
}

function apagar(id) {
    const indiceEncontrado = usuarioLogado.recados.findIndex((recado) => recado.id === id)
    usuarioLogado.recados.splice(indiceEncontrado, 1)

    atualizarUsuarioLogadoStorage(usuarioLogado)

    let divCardExcluir = document.getElementById(id)
    divCardExcluir.remove()

    modalApagar.hide()
    toastAlert('success', 'Contato deletado com sucesso!')
}
function sair() {
    atualizarUsuariosNoStorage()
    localStorage.removeItem('usuarioLogadoRecado')
    window.location.href = 'index.html'
}
function dataAtual() {
    let data = new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' });
    return data
}
function buscarUsuarioLogado() {
    // localstorage logado
    return JSON.parse(localStorage.getItem('usuarioLogadoRecado'));
}
function atualizarUsuarioLogadoStorage(dados) {
    localStorage.setItem('usuarioLogadoRecado', JSON.stringify(dados))
}
function atualizarUsuariosNoStorage() {
    // localstorage geral
    const usuario = JSON.parse(localStorage.getItem('usuariosNoStorage'))
    usuario.forEach((valor) => {
        if (valor.email === buscarUsuarioLogado().email) {
            valor.recados = buscarUsuarioLogado().recados
        }
    })
    localStorage.setItem('usuariosNoStorage', JSON.stringify(usuario))
}
function toastAlert(modo, mensagem) {

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