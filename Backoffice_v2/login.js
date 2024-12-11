

document.addEventListener('DOMContentLoaded', async function() {
    document.getElementById("eye").addEventListener('click', showPassword);
    document.getElementById("login").addEventListener("click", verificarUser);

    
    let currentUser= localStorage.getItem("currentUser");
    
    if(currentUser){
        localStorage.removeItem("currentUser");
    }
 
    
    let userToEdit    = JSON.parse(localStorage.getItem("userToEdit"));
    let userToDisplay = JSON.parse(localStorage.getItem("userToDisplay"));

    if(userToEdit){
        localStorage.removeItem('userToEdit');
    }

    if(userToDisplay){
        localStorage.removeItem('userToDisplay');
    }
})

async function verificarUser(e) {
    e.preventDefault();
    var email           = document.getElementById("email").value;
    var contrassenya    = document.getElementById("pswd").value;
    var users           = await getData(url, 'Users');
    
    for (var i = 0; i < users.length; i++) {
        if (email == "" || contrassenya == "") {
            alert("Es necesario rellenar ambos campos.");
            return;
        }

        if (users[i].email === email && users[i].password === contrassenya) {
            localStorage.setItem("currentUser", JSON.stringify(users[i]));
            alert("Login exitoso"); // Mensaje de éxito
            window.location.href = 'blog/blog.html';
            return true;
        }
    }

    alert("Usuario o contraseña incorrecto.");
    setTimeout(cleanFields(), 1000); 
}

function cleanFields() {
    document.getElementById("email").value      = '';
    document.getElementById("pswd").value   = '';
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
