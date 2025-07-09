"use strict"

import { set_header } from './tempplates/header.js'

const btn_submit = document.getElementById('submit')

const username = document.getElementById('nome-nova-loja')
const password = document.getElementById('senha-nova-loja')

const header_config = {
    color: "#248",
    title: "Nova Loja",
    padding: "30px"
}

set_header(header_config)

const myObserver = new IntersectionObserver((entryes) => {
    entryes.map((entrye) => {
        if (entrye.isIntersecting) {
            entrye.target.classList.add('show')
        } else {
            entrye.target.classList.remove('show')
        }
    })
})

const hiddens = [...document.querySelectorAll('.hidden')]

hiddens.map((element) => myObserver.observe(element))

btn_submit.addEventListener('click', (event) => {
    event.preventDefault()

    if (username.value == '' || password.value == '') {
        alert('Preencha todos os campos!')
        return
    }

    let registred_users = JSON.parse(localStorage.getItem('users'))
    if (!registred_users) {
        localStorage.setItem('users', JSON.stringify([
            {"user": username.value, "password": password.value}
        ]))
    } else {
        registred_users.push({"user": username.value, "password": password.value})
        localStorage.setItem('users', JSON.stringify(
            registred_users
        ))
    }
    location.href = '../pages/login.html'
})
