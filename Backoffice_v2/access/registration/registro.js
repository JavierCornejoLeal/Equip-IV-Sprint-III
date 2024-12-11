window.onload = iniciar;

var users;

async function iniciar() {
    document.getElementById("signup").addEventListener("click", validar);
    document.getElementById("name").addEventListener('blur', validarName, false);
    document.getElementById("email").addEventListener('blur', validarEmail, false);
    document.getElementById("pswd").addEventListener('blur', validarPassword, false);
    document.getElementById("repeatPassword").addEventListener('blur', validarRepeatPassword, false);
    document.getElementById("terms").addEventListener('blur', verifyTerms, false);
    document.getElementById("eye").addEventListener('click', showPassword);
    users = await getData(url, 'Users');
    verifyTerms();
}

function validarName() {
    var element = document.getElementById("name");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error2(element, "Debes introducir un nombre");
        }
        if (element.validity.patternMismatch) {
            error2(element, "El nombre debe tener entre 2 y 25 caracteres.");
        }
        return false;
    }
    valid();
    element.classList.add('valid');
    return true;
}

function validarEmail() {
    var element = document.getElementById("email");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error2(element, "Debes introducir un correo electrónico");
        }
        if (element.validity.patternMismatch) {
            error2(element, "El correo electrónico debe tener el formato xxx@xxx.xxx");
        }
        return false;
    }

    //let users = await getData(url, 'Users');
    let email_taken = users.some(e => e.email === element.value);

    if (email_taken){
        error2(element, "Este correo está en uso para otra cuenta.");
        return false;
    } 
    valid();
    element.classList.add('valid');
    return true;
}

function validarPassword() {
    var element = document.getElementById("pswd");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error2(element, "Debes introducir una contraseña.");
        }
        if (element.validity.patternMismatch) {
            error2(element, "La contraseña debe tener entre 8 y 20 caracteres.");
        }
        return false;
    }
    valid();
    element.classList.add('valid');
    return true;
}

function validarRepeatPassword() {
    var password = document.getElementById("pswd").value;
    var repeatPassword = document.getElementById("repeatPassword").value;

    if (repeatPassword !== password) {
        error2(repeatPassword, "Las contraseñas no coinciden.");
        return false;
    }
    return true;
}

function verifyTerms () {
    let terms = document.getElementById('terms').value;
    if(!terms.checkValidity()){
        if(terms.checked){
            return true;
        } else {
            error2(terms, 'Debes aceptar los términos y condiciones para crear su cuenta.');
            return false;
        }
    }
}

function validar(e) {
    e.preventDefault();
    borrarError();

    

    if (validarName() && validarEmail() && validarPassword() && validarRepeatPassword() && verifyTerms && confirm("¿Desea crear esta cuenta?")) {
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
    let form = document.querySelector("form");
    let h4   = document.getElementById("errorMessage");

    if(!h4){
        h4 = document.createElement("h4");
        h4.setAttribute("id", "errorMessage");
        h4.setAttribute("class", "error");
        form.appendChild(h4);
    } 
    while(h4.firstChild){
        h4.removeChild(h4.firstChild);
    }

    let show_message = document.createTextNode(message);
    h4.appendChild(show_message);
    h4.setAttribute("class", "error")
    element.classList.add ("error");
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
    let name        = document.getElementById("name").value;
    let email       = document.getElementById("email").value;
    let password    = document.getElementById("pswd").value;

    let users = await getData(url, 'Users');
   
    let user = {    
        name: name,
        email: email,
        password: password,
        user_profile: users.lenght == 0 ? "Administrador" : "Publicador"
    };
    await postData(url, 'Users', user);

    window.location.href = '../../index.html';
}

function showPassword () {
    let pswd = document.getElementById('pswd');
    let icon = document.getElementById('eye');

    if(pswd.type === 'password'){
        pswd.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        pswd.type = 'password';
        icon.classList.add('fa-eye-slash');
        icon.classList.remove('fa-eye');
    }
}
