"use strict"

import { set_header } from './tempplates/header.js'

const removeAcconunt = document.getElementById('removeAccount')
// href´s.
const register_page = 'pages/register.html'
const login_page = 'pages/login.html'

const verify_users = () => {
    if (!localStorage.getItem('users')) {
        location.href = register_page
    } else if (!sessionStorage.getItem('actual_user')) {
        location.href = login_page
    }
}

verify_users()

const header_config = {
    color: "#248",
    title: sessionStorage.getItem('actual_user'),
    padding: "30px"
}

set_header(header_config)

removeAcconunt.addEventListener('click', (event) => {
    event.preventDefault()

    const users = JSON.parse(localStorage.getItem('users')) || []
    const username = sessionStorage.getItem('actual_user')

    const newUsers = users.filter(u => u.user !== username)
    localStorage.setItem('users', JSON.stringify(newUsers))
    localStorage.removeItem(`produtos${sessionStorage.getItem('actual_user')}`, JSON.stringify([]))
    localStorage.removeItem(`categorias${sessionStorage.getItem('actual_user')}`, JSON.stringify([]))
    localStorage.removeItem(`movimentations${sessionStorage.getItem('actual_user')}`, JSON.stringify([]))

    sessionStorage.removeItem('actual_user')

    location.href = 'pages/login.html'
})
