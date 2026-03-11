//1. INTENTAMOS RECUPERAR EL CONTEO PROEVIO GUARDADO EN LA CACHE
let contador = localStorage.getItem("contador");

//2. usamos un condicional ternario, si 'contador' tiene datos, lo convertimos a entero (parseInt) si esta vacio, inicia en 0
contador = contador ? parseInt(contador) : 0;

//3. capturamos el elemento usando su ID, usamos 'const' porque la "caja" de HTML no cambiara, solo cambiara el texto dentro de ello 
const conteo = document.getElementById("contador");

//4. Mostramos el valor inicial en la pantalla
conteo.textContent = contador;

//5. esta funcion recibe un "valor" (+1 o -1) y actualiza todo 
function actualizarConteo(valor) {
    // sumamos o restamos el valor al contador actual
    contador += valor;

    // guardamos el nuevo valor en la cache
    localStorage.setItem("contador", contador);

    //actualizamos el numero visible en la web
    conteo.textContent = contador;
}

//7. funcion para el boton reducir 
function reducir() {
    actualizarConteo(-1);
}

//8 funcion del reset
function reset() {
    contador = 0; // devolvemos la variabe a cero 
    localStorage.setItem("contador", contador); // sobreescribimos la memora
    conteo.textContent = contador;
}

//9. funcion para el boton aumentar
function aumentar() {
    actualizarConteo(+1);
}