window.onload = main;

let etiquetaSeleccionada;

function main() {
    //thereIsUser();
    document.getElementById("botonTornar").addEventListener("click", tornar);

    // Recuperar la etiqueta seleccionada desde localStorage
    const etiquetaSeleccionada = JSON.parse(localStorage.getItem("modEtiqueta"));

    // Mostrar el nombre de la etiqueta en el campo de texto
    document.getElementById("nom").setAttribute("value", etiquetaSeleccionada.name);

    let boton = document.getElementById("dropdown");
    let menu  = document.querySelector("nav");

    boton.addEventListener("click", () => {
        menu.classList.toggle('show');
    });
}

function tornar() {
    window.location.assign("../llistat/llistarEtiquetes.html");
}