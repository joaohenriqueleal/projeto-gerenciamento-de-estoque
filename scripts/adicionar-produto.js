"use strict"

const categoria_selecionada = document.getElementById('selected')

// Inputs
const input_nome = document.getElementById('nome-novo-produto')
const input_select = document.getElementById('categorias')
const input_preco = document.getElementById('preco-novo-produto')
const input_id = document.getElementById('id-novo-produto')
const input_qtd = document.getElementById('qtd-novo-produto')

const btn_add_produto = document.getElementById('adicionar-produto')

// --- Funções de movimentações ---
const loadRegisters = () => {
    return JSON.parse(localStorage.getItem(`movimentations${sessionStorage.getItem('actual_user')}`)) || []
}

const saveRegisters = (registersList) => {
    localStorage.setItem(`movimentations${sessionStorage.getItem('actual_user')}`, JSON.stringify(registersList))
}

const addNewRegister = (register) => {
    let existentRegisters = loadRegisters()
    existentRegisters.push(register)
    saveRegisters(existentRegisters)
}

// --- Produtos e categorias ---
const load_categories = () => {
    return JSON.parse(localStorage.getItem(`categorias${sessionStorage.getItem('actual_user')}`)) || []
}

const load_products = () => {
    return JSON.parse(localStorage.getItem(`produtos${sessionStorage.getItem('actual_user')}`)) || []
}

const save_product = (products_list) => {
    localStorage.setItem(`produtos${sessionStorage.getItem('actual_user')}`, products_list)
}

const add_new_product = (product) => {
    let existent_products = load_products()
    existent_products.push(product)
    save_product(JSON.stringify(existent_products))
}

// --- Opções do select ---
const create_options = () => {
    let categories = load_categories()
    for (let c of categories) {
        const option = document.createElement('option')
        option.value = c
        option.innerHTML = c
        input_select.appendChild(option)
    }

    if (input_select.options.length > 0) {
        categoria_selecionada.innerHTML = input_select.value
    }
}

input_select.addEventListener('change', (event) => {
    categoria_selecionada.innerHTML = event.target.value
})

// --- Adicionar Produto ---
const add_product = () => {
    if (input_nome.value == '' || input_preco.value == '' || input_id.value == '' || input_qtd.value == '') {
        alert('Preencha todos os campos!')
        return
    }

    const preco = parseFloat(input_preco.value)
    const qtd = parseInt(input_qtd.value)

    const new_product = {
        nome: input_nome.value,
        categoria: input_select.value,
        preco: preco,
        qtd: qtd,
        id: input_id.value
    }

    add_new_product(new_product)

    // Cria registro da movimentação
    const valorOperacao = preco * qtd
    addNewRegister({
        valorOperacao: valorOperacao,
        timestamp: Date.now()
    })

    alert('Produto adicionado com sucesso!')
}

// --- Evento botão ---
btn_add_produto.addEventListener('click', (event) => {
    add_product()
})

// Inicializa
create_options()
