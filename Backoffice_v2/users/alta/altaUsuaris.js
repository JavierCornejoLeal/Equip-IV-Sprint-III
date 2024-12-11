var users;

document.addEventListener('DOMContentLoaded', async function() {
    document.getElementById("addUser").addEventListener("click", validar);
    document.getElementById("name").addEventListener('blur', validarName, false);
    document.getElementById("email").addEventListener('blur', validarEmail, false);
    document.getElementById("pswd").addEventListener('blur', validarPassword, false);
    document.getElementById("repeatPassword").addEventListener('blur', validarRepeatPassword, false);
    users = await getData(url, 'Users');
})

/**
 * Verifica que el nombre siga el pattern establecido
 * @returns boolean
 */
function validarName() {
    var element = document.getElementById("name");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error2(element, "Debes introducir un nombre");
        }
        if (element.validity.patternMismatch) {
            error2(element, "El nombre debe tener entre 2 y 25 caracteres.");
        }
        /*error(element);*/
        return false;
    }
    valid();
    element.setAttribute("class", "inputVisualitzar valid");
    return true;
}
/**
 * Verifica que el email siga el pattern establecido
 * @returns boolean
 */
function validarEmail() {
    var element = document.getElementById("email");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error2(element, "Debes introducir un email.");
        }
        if (element.validity.typeMismatch) {
            error2(element, "El correo electrónico deber tener el siguiente formato xxx@xxx.com");
        }
        return false;
    }
    // Control en caso de estar el correo en uso por otro usuario
    let email_taken = users.some(e => e.email === element.value);
    if (email_taken){
        error2(element, "Este correo está en uso para otro usuario.");
        return false;
    } 
    valid();
    element.setAttribute("class", "inputVisualitzar valid");
    return true;
}
/**
 * Verifica que la contraseña siga el pattern establecido
 * @returns boolean
 */
function validarPassword() {
    var element = document.getElementById("pswd");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error2(element, "Debes introducir una contraseña.");
        }
        if (element.validity.patternMismatch) {
            error2(element, "La contraseña debe tener entre 8 y 20 caracteres. Al menos una letra mayúscula, una minúscula, un número y un carácter especial.");
        }
        return false;
    }
    valid();
    element.setAttribute("class", "inputVisualitzar valid");
    return true;
}
/**
 * Verifica que la contraseña ingresada por segunda vez coincida con la primera
 * @returns boolean
 */
function validarRepeatPassword() {
    var password = document.getElementById("pswd").value;
    var repeatPassword = document.getElementById("repeatPassword").value;

    if (repeatPassword !== password) {
        error2(repeatPassword, "Las contraseñas no coinciden");
        return false;
    }
    return true;
}
/**
 * En caso de cumplirse las validaciones, se guarda el nuevo usuario. En caso contrario no se previene el envío del fomulario
 * @param {*} e 
 * @returns boolean
 */
function validar(e) {
    e.preventDefault();
    borrarError();

    if (validarName() && validarEmail() && validarPassword() && validarRepeatPassword() && confirm("¿Deseas añadir este usuario?")) {
        enviarFormulari();
        return true;
    } else {
        return false;
    }
}
/**
 * Muestra un mensaje de error si no se cumple con la validación
 * @param {*} element --> elemento en el cual se encuentra el error
 * @param {*} mensaje --> mensaje que mostrará
 */

function error2(element, message) {
    let row = document.getElementById("messageRow");
    let h4  = document.getElementById("errorMessage");

    if(!h4){
        h4 = document.createElement("h4");
        h4.setAttribute("id", "errorMessage");
        h4.setAttribute("class", "error");
        row.appendChild(h4);
    } 
    while(h4.firstChild){
        h4.removeChild(h4.firstChild);
    }

    let show_message = document.createTextNode(message);
    h4.appendChild(show_message);
    h4.setAttribute("class", "error")
    element.setAttribute("class", "inputVisualitzar error");
    element.focus();
}


function borrarError() {
    var formulari = document.forms[0].elements;
    for (var i=0; i < formulari.length; i++) {
        formulari[i].classList.remove("error");
   
    }
    document.getElementById("errorMessage").replaceChildren();
}

function valid () {
    let valid  = document.getElementById("errorMessage");
    if(valid){
        while(valid.firstChild){
            valid.replaceChildren();
        }
    }
}

async function enviarFormulari () {
    let name     = document.getElementById("name").value;
    let email    = document.getElementById("email").value;
    let password = document.getElementById("pswd").value;
    let roles    = document.getElementById("user_profile");

    let user = {    
        name: name,
        email: email,
        password: password,
        user_profile: roles.options[roles.selectedIndex].text
    };
    await postData(url, 'Users', user);

    document.querySelector('form').reset();
    alert("Usuario añadido");
    //window.location.href = "../llistar/llistarUsuaris.html";
}
