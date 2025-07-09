"use strict"

function janela_ed(config) {
    const div_escurecida_style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;

        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const div_escurecida = document.createElement('div');
    div_escurecida.setAttribute('style', div_escurecida_style);

    const janela_style = `
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.29);
        border-radius: 20px;
        background-color: white;
        width: 600px;
        height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        max-width: 90vw;
        overflow: hidden;
        font-family: sans-serif;
    `

    const janela = document.createElement('div');
    janela.setAttribute('style', janela_style);

    const janela_header = document.createElement('div');
    janela_header.setAttribute('style', `
        text-align: center;
        font-weight: bolder;
        font-size: 1.3em;
        padding: 15px;
        background-color: ${config.color};
        color: white;
    `);
    janela_header.textContent = config.title;

    const janela_body = document.createElement('div');
    janela_body.setAttribute('style', `
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `);

    const input_janela_body = document.createElement('input');
    input_janela_body.setAttribute('required', 'true');
    input_janela_body.setAttribute('placeholder', config.placeholder);
    input_janela_body.setAttribute('id', 'input_janela');
    input_janela_body.setAttribute('type', 'text');
    input_janela_body.setAttribute('min', '0');
    input_janela_body.style.width = '100%';
    input_janela_body.style.padding = '10px';
    input_janela_body.style.fontSize = '1em';

    janela_body.appendChild(input_janela_body);

    const janela_footer = document.createElement('div');
    janela_footer.setAttribute('style', `
        background-color: ${config.second_color};
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    `);

    const button_cancelar = document.createElement('button');
    button_cancelar.textContent = 'Cancelar';
    button_cancelar.setAttribute('style', `
        padding: 10px 20px;
        background-color: #f55;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    `);
    button_cancelar.addEventListener('click', () => {
        div_escurecida.remove();
    });

    const button_action = document.createElement('button');
    button_action.textContent = config.text;
    button_action.setAttribute('style', `
        padding: 10px 20px;
        background-color: #4CAF50;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    `);
    button_action.addEventListener('click', () => {
        config.action();
        div_escurecida.remove();  // fecha ao confirmar
    });

    // Monta a janela completa
    janela_footer.appendChild(button_cancelar);
    janela_footer.appendChild(button_action);
    janela.appendChild(janela_header);
    janela.appendChild(janela_body);
    janela.appendChild(janela_footer);
    div_escurecida.appendChild(janela);
    document.body.prepend(div_escurecida);

    input_janela_body.focus(); // foca no input ao abrir
}

export { janela_ed }
