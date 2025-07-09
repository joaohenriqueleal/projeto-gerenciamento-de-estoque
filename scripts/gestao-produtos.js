"use strict"

import { janela_ed } from "./tempplates/janela-ed.js"

const tbody = document.getElementById('tbody')
const input_pesquisa = document.getElementById('pesquisa')
const select_search = document.getElementById('filtro')
const btn_pesquisar = document.getElementById('btn_pesquisar')
const btn_resetar = document.getElementById('reset')

// Movimentações
const loadRegisters = () => {
    return JSON.parse(localStorage.getItem(
        `movimentations${sessionStorage.getItem('actual_user')}`)) || []
}

const saveRegisters = (registersList) => {
    localStorage.setItem(`movimentations${sessionStorage.getItem('actual_user')}`,
        JSON.stringify(registersList))
}

const addNewRegister = (register) => {
    // register == {"valorOperacao": 10, "timestamp": Date.now()}
    let existentRegisters = loadRegisters()
    existentRegisters.push(register)
    saveRegisters(existentRegisters)
}

// Produtos
const load_products = () => {
    const produtos = JSON.parse(localStorage.getItem(`produtos${sessionStorage.getItem('actual_user')}`)) || []
    for (const p of produtos) {
        p.qtd = parseInt(p.qtd) || 0
        p.preco = parseFloat(p.preco) || 0
    }
    return produtos
}

const save_products = (products_list) => {
    localStorage.setItem(`produtos${sessionStorage.getItem('actual_user')}`, products_list)
}

// Renderização
const render_table = (products) => {
    tbody.innerHTML = ''
    for (let p of products) {
        let p_datas = [
            p.nome,
            p.categoria,
            `R$ ${parseFloat(p.preco).toFixed(2)}`,
            `${p.qtd} un.`,
            p.id
        ]
        const tr = document.createElement('tr')
        for (let i = 1; i < 7; i++) {
            const td = document.createElement('td')
            td.setAttribute('class', `c${i}`)

            if (i == 6) {
                const i_delete = document.createElement('i')
                i_delete.setAttribute('class', 'bi bi-trash-fill i-delete op')
                i_delete.addEventListener('click', () => {
                    const new_products = load_products().filter(produto => produto.id !== p.id)
                    save_products(JSON.stringify(new_products))

                    // Registro de exclusão
                    addNewRegister({
                        valorOperacao: -(p.qtd * p.preco),
                        timestamp: Date.now()
                    })

                    tr.remove()
                    alert('Produto removido com sucesso!')
                })

                const i_add_storage = document.createElement('i')
                i_add_storage.setAttribute('class', 'bi bi-plus i-sum op')
                i_add_storage.addEventListener('click', () => {
                    const increment_storage = () => {
                        const input_valor = parseInt(document.getElementById('input_janela').value)
                        if (isNaN(input_valor) || input_valor <= 0) {
                            alert("Insira um número válido maior que zero.")
                            return
                        }
                        const products = load_products()
                        const i = products.findIndex(p2 => p2.id === p.id)
                        if (i !== -1) {
                            products[i].qtd += input_valor
                            save_products(JSON.stringify(products))

                            // Registro de incremento
                            addNewRegister({
                                valorOperacao: input_valor * products[i].preco,
                                timestamp: Date.now()
                            })

                            render_table(products)
                        }
                    }
                    const janela_ed_config = {
                        color: '#248',
                        placeholder: 'quanto você quer adicionar?',
                        second_color: '#ddd',
                        text: 'Adicionar',
                        title: 'Adicionar ao estoque',
                        action: increment_storage
                    }
                    janela_ed(janela_ed_config)
                })

                const i_rem_storage = document.createElement('i')
                i_rem_storage.setAttribute('class', 'bi bi-dash i-sub op')
                i_rem_storage.addEventListener('click', () => {
                    const decrement_storage = () => {
                        const input_valor = parseInt(document.getElementById('input_janela').value)
                        if (isNaN(input_valor) || input_valor <= 0) {
                            alert("Insira um número válido maior que zero.")
                            return
                        }
                        const products = load_products()
                        const i = products.findIndex(p2 => p2.id === p.id)
                        if (i !== -1) {
                            products[i].qtd -= input_valor
                            save_products(JSON.stringify(products))

                            // Registro de decremento
                            addNewRegister({
                                valorOperacao: -(input_valor * products[i].preco),
                                timestamp: Date.now()
                            })

                            render_table(products)
                        }
                    }
                    const janela_ed_config = {
                        color: '#248',
                        placeholder: 'quanto você quer remover?',
                        second_color: '#ddd',
                        text: 'Remover',
                        title: 'Remover do estoque',
                        action: decrement_storage
                    }
                    janela_ed(janela_ed_config)
                })

                const i_edit = document.createElement('i')
                i_edit.setAttribute('class', 'bi bi-pen-fill op i-edit')
                i_edit.addEventListener('click', () => {
                    const overlay = document.createElement('div')
                    overlay.setAttribute('class', 'overlay')

                    const janela = document.createElement('div')
                    janela.setAttribute('class', 'janela')

                    const janela_header = document.createElement('div')
                    janela_header.setAttribute('class', 'janela-header')
                    janela_header.innerHTML = 'Editar Produto'
                    janela.appendChild(janela_header)

                    const janela_body = document.createElement('div')
                    janela_body.setAttribute('class', 'janela-body')

                    const fields = ['Nome', 'Categoria', 'Preço', 'Quantidade', 'ID']
                    const inputs = []

                    for (let i = 0; i < 5; i++) {
                        const input = document.createElement('input')
                        input.setAttribute('id', `input_${i + 1}`)
                        input.setAttribute('class', 'input-janela')
                        input.value = p_datas[i]
                        janela_body.appendChild(input)
                        inputs.push(input)
                    }

                    janela.appendChild(janela_body)

                    const janela_footer = document.createElement('div')
                    janela_footer.setAttribute('class', 'janela-footer')

                    const btn_cancelar = document.createElement('button')
                    btn_cancelar.innerHTML = 'Cancelar'
                    btn_cancelar.setAttribute('class', 'btn-janela')
                    btn_cancelar.addEventListener('click', () => overlay.remove())

                    const btn_editar = document.createElement('button')
                    btn_editar.innerHTML = 'Editar'
                    btn_editar.setAttribute('class', 'btn-janela')
                    btn_editar.addEventListener('click', () => {
                        const [input_1, input_2, input_3, input_4, input_5] = inputs
                        const updated_products = load_products().map(prod => {
                            if (prod.id === p.id) {
                                return {
                                    ...prod,
                                    nome: input_1.value,
                                    categoria: input_2.value,
                                    preco: parseFloat(input_3.value.replace('R$', '').trim()) || 0,
                                    qtd: parseInt(input_4.value.replace('un.', '').trim()) || 0,
                                    id: input_5.value
                                }
                            }
                            return prod
                        })
                        save_products(JSON.stringify(updated_products))
                        overlay.remove()
                        render_table(updated_products)
                    })

                    janela_footer.appendChild(btn_cancelar)
                    janela_footer.appendChild(btn_editar)
                    janela.appendChild(janela_footer)
                    overlay.appendChild(janela)
                    document.body.appendChild(overlay)
                })

                td.appendChild(i_delete)
                td.appendChild(i_edit)
                td.appendChild(i_rem_storage)
                td.appendChild(i_add_storage)
            } else {
                td.innerHTML = p_datas[i - 1]
            }
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    }
}

// Início
const set_datas_on_dgv = () => {
    const products = load_products()
    render_table(products)
}

set_datas_on_dgv()

btn_resetar.addEventListener('click', () => {
    set_datas_on_dgv()
})

btn_pesquisar.addEventListener('click', () => {
    const termo = input_pesquisa.value.toLowerCase()
    const campo = select_search.value
    const produtos = load_products().filter(prod => {
        const valor = String(prod[campo]).toLowerCase()
        return valor.includes(termo)
    })
    render_table(produtos)
})
