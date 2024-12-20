window.onload = main;

function main() {
    document.getElementById("btnGravar").addEventListener("click", validar);
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

async function enviarFormulari() {
    const descripcio = document.getElementById("descripcio").value.trim();
    const postID = sessionStorage.getItem("currentPostID");
    const postTitle = sessionStorage.getItem("currentPostTitle");
    const currentUserData = localStorage.getItem("currentUser");

    const currentUser = JSON.parse(currentUserData); 
    const creatorId = currentUser.name; 

    // Validar la longitud de la descripción
    if (descripcio.length < 2 || descripcio.length > 200) {
        const missatgeError = document.getElementById("missatgeError");

        // Limpiar cualquier mensaje de error previo
        while (missatgeError.firstChild) {
            missatgeError.removeChild(missatgeError.firstChild);
        }

        // Crear un nodo de texto y añadirlo al contenedor de error
        const textNode = document.createTextNode("El comentario debe tener entre 2 y 200 caracteres.");
        missatgeError.appendChild(textNode);
        return;
    }

    // Crear un nuevo comentario con el ID y título del post
    const comentari = {
        description: descripcio,
        post_id: postID,
        post_title: postTitle,
        creator_id: creatorId
    };

    const resultat = await postData(url, "Comment", comentari);

    // Redirigir a la página llistatComentaris.html
    setTimeout(function () {
        window.location.href = "../llistat/llistarComentaris.html"; // Cambia la ruta si es necesario
    }, 0);
}
