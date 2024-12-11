window.onload = main;

let comentarioSeleccionado;

function main() {
    //thereIsUser();

    document.getElementById("btnGravar").addEventListener("click", validar, false);

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


function validarDescripcio() {
    var element = document.getElementById("descripcio");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error2(element, "Deus d'introduïr una descripcio.");
        }
        if (element.validity.patternMismatch) {
            error2(element, "La descripcio ha de tindre entre 2 i 100 caracters.");
        }
        error(element);
        return false;
    }
    return true;
}

function validar(e) {
    e.preventDefault();
    esborrarError();

    // Validar todos los campos
    if (validarDescripcio()) {
        enviarFormulari();
        return true;
    } else {
        error(document.getElementById("descripcio"), "El comentari no és vàlid.");
        return false;
    }
}

function error(element, missatge) {
    const textError = document.createTextNode(missatge);
    const elementError = document.getElementById("missatgeError");
    elementError.appendChild(textError);
    element.classList.add("error");
    element.focus();
}

function error2(element, missatge) {
    document.getElementById("missatgeError").innerHTML = missatge;
    element.classList.add("error"); 
    element.focus();
}

function esborrarError() {
    let formulari = document.forms[0].elements;
    for (let ele of formulari) {
        ele.classList.remove("error");
    }
    document.getElementById("missatgeError").replaceChildren();
}

// enviar dades
async function enviarFormulari() {
    const comentarioSeleccionado = JSON.parse(localStorage.getItem("modComentari")); 
    const descripcioModificada = document.getElementById("descripcio").value;
    comentarioSeleccionado.description = descripcioModificada;

    await updateId(url, "Comment", comentarioSeleccionado.id, comentarioSeleccionado);
    
    // Eliminar el marcador de modificación en localStorage
    localStorage.removeItem("modComentari"); 

    // Redirigir de nuevo al listado
    window.location.href = "../llistat/llistarComentaris.html";
}
