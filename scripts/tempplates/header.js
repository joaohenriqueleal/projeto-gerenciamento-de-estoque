"use strict"

const set_header = (config) => {
    const header_style = `
        background-color: ${config.color};

        width: 100%;
        padding: ${config.padding};
        
        display: flex;
        align-items: center;
        justify-content: flex-start;
    `

    const title_style = `
        margin-left: 50px;

        color: white;
        font-size: 3em;
        font-wheight: bolder;
        font-family: 'Impact', sans-serif;

        text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.4);
    `

    const header = document.createElement('header')
    header.setAttribute('id', 'header')
    header.setAttribute('style', header_style)

    const header_title = document.createElement('h1')
    header_title.innerHTML = config.title
    header_title.setAttribute('style', title_style)

    header.appendChild(header_title)
    document.body.prepend(header)
}

export { set_header }
