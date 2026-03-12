

// primero definimos las variables con sus respectivos prompts
let nombreusuario = prompt("Ingrese su nombre");
let edad = prompt("Ingrese su edad");

//mostramos el resultado requerido tanto en pantalla como en consola
alert("El usuario " + nombreusuario + " tiene " + edad + " años.");
console.log("El usuario " + nombreusuario + " tiene " + edad + " años.");
// definimos la variable para la nota final
let notafinal = prompt("Ingrese su nota final", "entre 0 y 20");
// lo convertimos a entero para la condicional
notafinal = parseInt(notafinal);

// hacemos la condicional respectiva y mostramos el resultado en pantalla y consola
if (notafinal >= 13) {
    console.log("Felicidades, estas aprobado");
    alert("Felicidades, estas aprobado");
} else {
    console.log("Lo siento, estas desaprobado");
    alert("Lo siento, estas desaprobado");
}