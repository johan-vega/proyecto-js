//1. Paso#1: Declarar un Array con 5 lenguajes de programacion
const lenguaje = [
    'Python', 'Java', 'JavaScript', 'PHP', 'C#'
];

// Paso#2: Capturamos los elementos del DOM
const lista = document.getElementById('lista');
let elementos = '';

// Paso#3: Usamos el bucle FOR para recorrer un Array
for (let i = 0; i < lenguaje.length; i++) {
    if (lenguaje[i] === 'JavaScript') {
        alert('JavaScript sirve para el Frontend y para el Backend.');
    }
    // Paso #4: Acumulamos cada lenguaje dentro de las etiquetas <li>.
    elementos += '<li>' + lenguaje[i] + '</li>';
}

//Paso#5: Capturamos y mostramos toda la lisla en pantalla.
lista.innerHTML = elementos;