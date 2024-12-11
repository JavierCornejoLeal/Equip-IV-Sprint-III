window.onload = main;

let comentarioSeleccionado;

function main() {
    //thereIsUser();

    // Recuperar el comentario seleccionado desde localStorage
    const comentarioSeleccionado = JSON.parse(localStorage.getItem("modComentari")); 
    
    // Mostrar el comentario en el campo de texto
    document.getElementById("descripcio").textContent =comentarioSeleccionado.description;
    document.getElementById("botonTornar").addEventListener("click", tornar);

    let boton = document.getElementById("dropdown");
    let menu  = document.querySelector("nav");

    boton.addEventListener("click", () => {
        menu.classList.toggle('show');
    });
}

function tornar(){
    window.location.assign("../llistat/llistarComentaris.html");
}
