"use strict"

const input_nome_categoria = document.getElementById('nome-nova-categoria')
const btn_adicionar_categoria = document.getElementById('adicionar_categoria')

const save_categories = (categories_list) => {
    localStorage.setItem(`categorias${sessionStorage.getItem('actual_user')}`, categories_list)
}

const load_categories = () => {
    return JSON.parse(localStorage.getItem(`categorias${sessionStorage.getItem('actual_user')}`)) || []
}

const add_new_categorie = (categorie) => {
    let existent_categories = load_categories()
    if (!existent_categories.includes(categorie)) {
        existent_categories.push(categorie)
        save_categories(JSON.stringify(existent_categories))
    }
}

btn_adicionar_categoria.addEventListener('click', (event) => {
    if (input_nome_categoria.value == '') {
        alert('Preencha o nome da categoria.')
        return
    }
    add_new_categorie(input_nome_categoria.value)
    alert('Categoria adicionada com sucesso!')
})
