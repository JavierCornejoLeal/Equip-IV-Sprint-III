

var users;

document.addEventListener('DOMContentLoaded', async function() {
    editUser();
    document.getElementById('saveChanges').addEventListener('click', saveChanges);
    document.getElementById('name').addEventListener('blur', validarName, false);
    document.getElementById('email').addEventListener('blur', validarEmail, false);
    document.getElementById('pswd').addEventListener('blur', validarPassword, false);
    document.getElementById('eye').addEventListener('click', showPassword);
    users = await getData(url, 'Users');  
})

function editUser() {
    let userToEdit = JSON.parse(localStorage.getItem("userToEdit"));

    if (userToEdit) {
        document.getElementById("name").value = userToEdit.name;
        document.getElementById("email").value = userToEdit.email;
        document.getElementById("pswd").value = userToEdit.password;

        let roles = document.getElementById("user_profile");
        for(let i = 0; i < roles.length; i++){
            if(roles[i].text === userToEdit.user_profile){
                roles[i].selected = true;
            }
        }
    }
}
/**
 * Verifica que el nombre siga el pattern establecido
 * @returns boolean
 */
function validarName() {
    let element = document.getElementById("name");
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
    let userToEdit = JSON.parse(localStorage.getItem("userToEdit"));
    let element = document.getElementById("email");
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
    let email_taken = users.some(e => e.email === element.value && e.id != userToEdit.id);
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
 * En caso de cumplirse las validaciones, se guarda el nuevo usuario. En caso contrario no se previene el envío del fomulario
 * @param {*} e 
 * @returns boolean
 */
function validar(e) {
    e.preventDefault();
    borrarError();

    if (validarName() && validarEmail() && validarPassword() && confirm("¿Desea guardar los cambios realizados?")) {
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
    let formulari = document.forms[0].elements;
    for (let i=0; i < formulari.length; i++) {
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
// Función para guardar los cambios
async function saveChanges(e) {
    e.preventDefault();

    let userToEdit = JSON.parse(localStorage.getItem("userToEdit"));
    let roles      = document.getElementById('user_profile');

    let updatedUser = {
        id: userToEdit.id,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("pswd").value,
        user_profile: roles.options[roles.selectedIndex].text
    };

   await updateId(url, 'Users', userToEdit.id, updatedUser);
   
   localStorage.removeItem('userToEdit');
    window.location.href = "../llistar/llistarUsuaris.html"; 
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

