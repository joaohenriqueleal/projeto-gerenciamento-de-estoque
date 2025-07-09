"use strict"

const abas = [...document.querySelectorAll('.destination')]

const set_tab_color = () => {
    for (let tab of abas) {
        tab.addEventListener('click', (event) => {
            for (let t of abas) {
                t.classList.remove('destination-selected')
            }
            tab.classList.add('destination-selected')
        })
    }
}

set_tab_color()
