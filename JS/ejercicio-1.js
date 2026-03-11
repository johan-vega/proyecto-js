// 1. Paso #1: Capturamos elementos del DOM
//DOM: Document Object Model
const nombreUsuario = document.getElementById('nombreUsuario');
const btnSaludar = document.getElementById('btnSaludar');
const mensaje = document.getElementById('mensaje');

//2. Creamos la funcion
function registrar() {
    // registrando o capturando el dato desde el DOM
    let nombre = nombreUsuario.value;
    //Mostramos  en la consola
    console.log('El Nombre registrado en consola es: ' + nombre);

    // Mostrar en el DOM
    mensaje.textContent = '¡Hola, ' + nombre + ' Bienvenido al curso!';

}

