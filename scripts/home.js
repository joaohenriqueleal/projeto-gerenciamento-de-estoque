"use strict"

const canvas_grafico_visao_geral = document.getElementById('product-per-categories').getContext('2d')
const div_graphic = document.getElementById('graphic')

const p_total_products = document.getElementById('total-products')
const totalCategories = document.getElementById('totalCategories')
const totalValue = document.getElementById('totalValue')

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

const add_new_categorie = (categorie) => {
    let existent_categories = load_categories()
    if (!existent_categories.includes(categorie)) {
        existent_categories.push(categorie)
        save_categories(JSON.stringify(existent_categories))
    }
}

const random_colors = (n) => {
    let colors = []
    while (n > 0) {
        let r = Math.round(Math.random() * 255)
        let g = Math.round(Math.random() * 255)
        let b = Math.round(Math.random() * 255)
        colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`)
        n--
    } 
    return colors
}

const length_per_categorie = () => {
    let categorias = load_categories()
    let produtos = load_products()
    let contagens = categorias.map(categoria => {
        return produtos
            .filter(produto => produto.categoria === categoria)
            .reduce((total, produto) => total + Number(produto.qtd || 0), 0)
    })
    return contagens
}

const total_products = () => {
    const total = load_products().reduce((acc, p) => acc + Number(p.qtd || 0), 0)
    p_total_products.innerHTML = `Total de produtos:  ${total}`
}

const total_categories = () => {
    totalCategories.innerHTML = `Total de categorias:  ${load_categories().length}`
}

const total_value_storage = () => {
    let total = 0
    load_products().map(p => {
        total += p.preco * p.qtd
    })
    totalValue.innerHTML = `Valor total do estoque: R$  ${parseFloat(total).toFixed(2).replace('.', ',')}`
}

const loadRegisters = () => {
    return JSON.parse(localStorage.getItem(
        `movimentations${sessionStorage.getItem('actual_user')}`)) || []
}

const saveRegisters = (registersList) => {
    localStorage.setItem(`movimentations${sessionStorage.getItem('actual_user')}`,
        JSON.stringify(registersList))
}

const addNewRegister = (register) => {
    // register == {"valorOperacao": 10, "timestamp": no formato: Date.now()}
    let existentRegisters = loadRegisters()
    existentRegisters.push(register)
    saveRegisters(existentRegisters)
}

const show_general_vision_graphic = () => {
    const categorias = load_categories()
    const produtos = load_products()

    if (categorias.length === 0 || produtos.length === 0) {
        div_graphic.innerHTML = '<p>Nenhum produto cadastrado.</p>'
    } else {
        const colors = random_colors(categorias.length)
        const counts = length_per_categorie()
        const total = counts.reduce((sum, val) => sum + val, 0)

        const grafico_visao_geral = new Chart(canvas_grafico_visao_geral, {
            type: 'pie',
            data: {
                labels: categorias,
                datasets: [{
                    label: 'Produtos por Categoria',
                    data: counts,
                    backgroundColor: colors,
                    borderColor: 'rgb(255, 255, 255)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                const value = context.raw
                                const percentage = ((value / total) * 100).toFixed(1)
                                return `${context.label}: ${value} (${percentage}%)`
                            }
                        }
                    },
                    datalabels: {
                        color: '#000',
                        font: {
                            weight: 'bold'
                        },
                        formatter: (value, context) => {
                            const percentage = (value / total) * 100
                            return `${percentage.toFixed(1)}%`
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        })
    }
}

function getMonthlySummaryLast12Months() {
    const registers = loadRegisters() // seus registros carregados
    const now = new Date()

    // Criar um objeto para guardar o total por mês no formato "ano-mes" (ex: "2025-07")
    const summary = {};

    // Inicializa o summary com 12 meses anteriores a hoje, com valor zero
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        summary[key] = 0
    }

    // Agrupa os valores por mês
    for (const reg of registers) {
        const d = new Date(reg.timestamp)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

        if (key in summary) {
            summary[key] += Number(reg.valorOperacao) || 0
        }
    }

    // Retorna array dos valores ordenados do mais antigo para mais recente
    return Object.values(summary)
}

function generateLast12MonthsLabels() {
    const monthsPt = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const labels = []
    const today = new Date()

    for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        labels.push(monthsPt[d.getMonth()])
    }
    return labels;
}

function showTotalStogareValueGraphic() {
    const ctx = document.getElementById('totalValueGraphic').getContext('2d');

    const labels = generateLast12MonthsLabels();
    const dataValues = getMonthlySummaryLast12Months();

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Valor total do estoque (últimos 12 meses)',
          data: dataValues,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
}

show_general_vision_graphic()
total_products()
total_categories()
total_value_storage()

showTotalStogareValueGraphic()
