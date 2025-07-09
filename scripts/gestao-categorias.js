"use strict"

import { janela_ed } from './tempplates/janela-ed.js'

const dgvBody = document.getElementById('dgvBody')
const buttonSearch = document.getElementById('buttonSearch')
const inputPesquisa = document.getElementById('inputPesquisa')
const buttonReload = document.getElementById('buttonReload')

// Funções de movimentação
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

// Produtos e categorias
const save_product = (products_list) => {
    localStorage.setItem(`produtos${sessionStorage.getItem('actual_user')}`, products_list)
}

const load_products = () => {
    return JSON.parse(localStorage.getItem(`produtos${sessionStorage.getItem('actual_user')}`)) || []
}

const save_categories = (categories_list) => {
    localStorage.setItem(`categorias${sessionStorage.getItem('actual_user')}`, categories_list)
}

const load_categories = () => {
    return JSON.parse(localStorage.getItem(`categorias${sessionStorage.getItem('actual_user')}`)) || []
}

// Preencher DGV
const setDatasOnDGV = () => {
    let existentCategories = load_categories()
    for (let category of existentCategories) {
        const divDgvBodyRow = document.createElement('div')
        divDgvBodyRow.setAttribute('class', 'dgvBodyRow')

        const pNameCategory = document.createElement('p')
        pNameCategory.setAttribute('class', 'nameCategory')
        pNameCategory.innerHTML = category

        const divOperations = document.createElement('div')
        divOperations.setAttribute('class', 'operations')

        const iDelete = document.createElement('i') 
        iDelete.setAttribute('class', 'iDelete bi bi-trash-fill')
        iDelete.addEventListener('click', (event) => {
            divDgvBodyRow.remove()
            const newCategriesList = load_categories().filter(c => c != category)
            const existentProducts = load_products()

            // Captura valor total da categoria
            const produtosRemovidos = existentProducts.filter(p => p.categoria === category)
            let totalRemovido = 0
            for (const p of produtosRemovidos) {
                totalRemovido += (Number(p.qtd) || 0) * (Number(p.preco) || 0)
            }

            // Registra a perda no estoque
            if (totalRemovido > 0) {
                addNewRegister({
                    valorOperacao: -totalRemovido,
                    timestamp: Date.now()
                })
            }

            // Remove produtos da categoria
            const newProducts = existentProducts.filter(p => p.categoria != category)
            save_product(JSON.stringify(newProducts))
            save_categories(JSON.stringify(newCategriesList))
            alert('Categoria removida com sucesso!')
        })
        divOperations.appendChild(iDelete)

        const iEdit = document.createElement('i')
        iEdit.setAttribute('class', 'iEdit bi bi-pen-fill')
        iEdit.addEventListener('click', (event) => {
            const removeCategory = () => {
                const inputJanela = document.getElementById('input_janela').value
                const existentCategories = load_categories()
                let index = 0
                existentCategories.map(c => {
                    if (c == category) {
                        existentCategories[index] = inputJanela
                    }
                    index++
                })
                save_categories(JSON.stringify(existentCategories))
                const existentProducts = load_products()
                index = 0
                existentProducts.map(p => {
                    if (p.categoria == category) {
                        existentProducts[index].categoria = inputJanela
                    }
                    index++
                })
                save_product(JSON.stringify(existentProducts))
                dgvBody.innerHTML = ''
                setDatasOnDGV()
                alert('Categoria renomeada com sucesso!')
            }
            const janelaConfig = {
                color: '#248',
                placeholder: 'novo nome da categoria',
                second_color: '#ddd',
                text: 'Renomear',
                title: 'Renomear categoria',
                action: removeCategory
            }
            janela_ed(janelaConfig)
        })
        divOperations.appendChild(iEdit)

        divDgvBodyRow.appendChild(pNameCategory)
        divDgvBodyRow.appendChild(divOperations)
        dgvBody.appendChild(divDgvBodyRow)
    }
}

// Filtro de busca
buttonSearch.addEventListener('click', (event) => {
    dgvBody.innerHTML = ''
    let existentCategories = load_categories()
    existentCategories = existentCategories.filter(c =>
        c.toLowerCase().includes(inputPesquisa.value.toLowerCase())
    )

    for (let category of existentCategories) {
        const divDgvBodyRow = document.createElement('div')
        divDgvBodyRow.setAttribute('class', 'dgvBodyRow')

        const pNameCategory = document.createElement('p')
        pNameCategory.setAttribute('class', 'nameCategory')
        pNameCategory.innerHTML = category

        const divOperations = document.createElement('div')
        divOperations.setAttribute('class', 'operations')

        const iDelete = document.createElement('i') 
        iDelete.setAttribute('class', 'iDelete bi bi-trash-fill')
        iDelete.addEventListener('click', (event) => {
            divDgvBodyRow.remove()
            const newCategriesList = load_categories().filter(c => c != category)
            const existentProducts = load_products()

            // Captura valor total da categoria
            const produtosRemovidos = existentProducts.filter(p => p.categoria === category)
            let totalRemovido = 0
            for (const p of produtosRemovidos) {
                totalRemovido += (Number(p.qtd) || 0) * (Number(p.preco) || 0)
            }

            // Registra a perda no estoque
            if (totalRemovido > 0) {
                addNewRegister({
                    valorOperacao: -totalRemovido,
                    timestamp: Date.now()
                })
            }

            // Remove produtos da categoria
            const newProducts = existentProducts.filter(p => p.categoria != category)
            save_product(JSON.stringify(newProducts))
            save_categories(JSON.stringify(newCategriesList))
            alert('Categoria removida com sucesso!')
        })
        divOperations.appendChild(iDelete)

        const iEdit = document.createElement('i')
        iEdit.setAttribute('class', 'iEdit bi bi-pen-fill')
        iEdit.addEventListener('click', (event) => {
            const removeCategory = () => {
                const inputJanela = document.getElementById('input_janela').value
                const existentCategories = load_categories()
                let index = 0
                existentCategories.map(c => {
                    if (c == category) {
                        existentCategories[index] = inputJanela
                    }
                    index++
                })
                save_categories(JSON.stringify(existentCategories))
                const existentProducts = load_products()
                index = 0
                existentProducts.map(p => {
                    if (p.categoria == category) {
                        existentProducts[index].categoria = inputJanela
                    }
                    index++
                })
                save_product(JSON.stringify(existentProducts))
                dgvBody.innerHTML = ''
                setDatasOnDGV()
                alert('Categoria renomeada com sucesso!')
            }
            const janelaConfig = {
                color: '#248',
                placeholder: 'novo nome da categoria',
                second_color: '#ddd',
                text: 'Renomear',
                title: 'Renomear categoria',
                action: removeCategory
            }
            janela_ed(janelaConfig)
        })
        divOperations.appendChild(iEdit)

        divDgvBodyRow.appendChild(pNameCategory)
        divDgvBodyRow.appendChild(divOperations)
        dgvBody.appendChild(divDgvBodyRow)
    }
})

// Recarregar categorias
buttonReload.addEventListener('click', (event) => {
    dgvBody.innerHTML = ''
    setDatasOnDGV()
})

// Inicialização
setDatasOnDGV()
