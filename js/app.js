function Marca(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

function UI() {}

//Carga las fechas en el formulario
UI.prototype.cargarOpciones = () => {

    const fecha = new Date().getFullYear();
    min = fecha - 12;

    //Añadimos las fechas al HTML
    for (let i = fecha; i >= min; i--) {
        const item = document.createElement('option');

        item.value = i;
        item.textContent = i;

        document.querySelector('#year').appendChild(item);
    }
}

UI.prototype.crearMensaje = function(mensaje, tipo) {
    const formulario = document.querySelector('#cotizar-seguro');

    const mensajeHTML = document.createElement('div');
    const spinner = document.querySelector('#cargando');
    //Mostramos el spinner

    if (tipo === 'error') {
        mensajeHTML.classList.add('error')
    } else {
        mensajeHTML.classList.add('correcto')
        spinner.classList.replace('hidden', 'block')

    }
    mensajeHTML.classList.add('mt-10');
    mensajeHTML.innerHTML = `${mensaje}`;

    formulario.insertBefore(mensajeHTML, document.querySelector('#resultado'))

    setTimeout(() => {
        mensajeHTML.remove();

        spinner.classList.replace('block', 'hidden')

    }, 3000);
}

const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {

    //Cargamos las opciones
    ui.cargarOpciones();

    //Asignar accion al botón
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
})

function limpiarResultados(resultados) {
    while (resultados.firstChild) {
        resultados.removeChild(resultado.firstChild);
    }
}

function cotizarSeguro(a) {
    a.preventDefault();
    const resultado = document.querySelector('#resultado');

    if (resultado.childElementCount > 0) {
        limpiarResultados(resultado)
    }

    //Revisamos que todas las opciones esten seleccionadas
    const marca = document.querySelector('#marca').value;
    const marcaText = document.querySelector('#marca').textContent
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    //Comprobamos que todo este seleccionado
    if (marca === '' || year === '') {
        ui.crearMensaje("Todos los campos son obligatorios...", "error")
        return;
    }

    ui.crearMensaje("Cotizando seguro...", "exito");

    //Creamos la cotización
    const precio = crearCotizacion(marca, year, tipo);
    //Creamos el resumen
    const div = document.createElement('div');

    div.innerHTML = `
        <p class='header'>Tu Resumen: </p>
        <p class="font-bold">Marca: <span class="font-normal"> ${marcaText} </span> </p>
        <p class="font-bold">Año: <span class="font-normal"> ${year} </span> </p>
        <p class="font-bold">Tipo: <span class="font-normal"> ${tipo} </span> </p>
        <p class="font-bold"> Total: <span class="font-normal"> $ ${precio} </span> </p>
    `;

    div.style.marginTop = '35px'

    setTimeout(() => {
        resultado.appendChild(div)

    }, 3000);
};

function crearCotizacion(marca, year, tipo) {

    /*
        1: americano x1.25
        2: asiatico x1.10
        3: europeo x1.30
    */

    const base = 2000;
    let precio;

    switch (marca) {
        case "1":
            precio = base * 1.25;
            break;
        case "2":
            precio = base * 1.10;
            break;
        case "3":
            precio = base * 1.30;
            break;
        default:
            break;
    }

    //Diferencia entre el año de ahora y el que seleccionaste
    const diferencia = new Date().getFullYear() - year;

    //Cada año abajo es el 3% menos del precio
    precio -= ((diferencia * 3) * precio) / 100;

    /*
        Si el seguro es básico se multiplica por un 30% más  
        Si el seguro es completo se multiplica por un 50% más  
    */
    if (tipo === 'basico') {
        precio *= 1.30;
    } else {
        precio *= 1.50;
    }

    return precio;
}