"use strict"

import { set_header } from './tempplates/header.js'
import { janela_ed } from './tempplates/janela-ed.js'

const div_contas = document.getElementById('contas')
const header_config = {
    color: "#248",
    title: "Login",
    padding: "30px"
}

set_header(header_config)

const load_users = () => {
    return JSON.parse(localStorage.getItem('users'))
}

const user_to_DOM = (user) => {
    const user_row = document.createElement('div')
    user_row.innerHTML = user.user
    user_row.setAttribute('class', 'user-row')

    user_row.addEventListener('click', (event) => {
        const login = () => {
            const users = load_users()
            let index = 0
            for (let u of users) {
                if (u.user == event.target.innerHTML) {
                    break
                }
                index++
            }
            if (document.querySelector('#input_janela').value == users[index].password) {
                sessionStorage.setItem('actual_user', user.user)
                location.href = '../index.html'
            } else {
                alert('Senha incorreta!')
            }
        }
        const janelaConfig = {
            color: '#248',
            placeholder: 'insira sua senha',
            second_color: '#ddd',
            text: 'Login',
            title: 'Insira sua senha',
            action: login
        }
        janela_ed(janelaConfig)
    })

    div_contas.appendChild(user_row)
}

const place_all_users = () => {
    let users = load_users()
    for (let u of users) {
        user_to_DOM(u)
    }
}

place_all_users()
