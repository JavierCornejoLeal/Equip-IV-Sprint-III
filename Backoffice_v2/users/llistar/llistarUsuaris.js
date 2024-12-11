document.addEventListener('DOMContentLoaded', function() {
    verifyUser();
    listUsers();

    
   

    document.getElementById('searchUser').addEventListener('click', search);
    document.getElementById('apply-BA').addEventListener('click', bulkActions);
    document.getElementById('cleanFilters').addEventListener("click", cleanFilters);
    document.getElementById('selectAll').addEventListener('click', () => {
        let checkboxes = document.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach(checkbox => {
            let selectAll     = document.getElementById('selectAll');
            if(checkbox.checked === false){
                checkbox.checked = true;
                selectAll.checked = true;
            } else {
                checkbox.checked  = false;
                selectAll.checked = false;
            }
            
        })
    })


    $('#funnel').click(() => {
        if($('#panel').css('display') === 'none'){
            $('#panel').fadeIn(500);
        } else {
            $('#panel').fadeOut(500); 
        }
    })
    autocompleteFilters();
})

function verifyUser () {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
    if (currentUser.user_profile === 'Publicador' || currentUser.user_profile === 'Editor'){
        alert('No cuenta con los permisos necesarios para acceder a esta sección. Comuniquese con su Administrador');
        window.location.href = '../../blog/blog.html';
    } 
}

async function listUsers() {
    var users = await getData(url, 'Users') ?? []; // Obtener los usuarios
    var tbody = document.getElementById("users-list");
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser.id)

    // Limpiar el contenido actual del tbody
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    users.forEach(user => {
        // Crear una nueva fila
        let tr = document.createElement("tr");
        tr.setAttribute("id", user.id)

        let checkBox = document.createElement("td");
        let input    = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("id", user.id)
        checkBox.appendChild(input); 

        // NOMBRE
        let tdName = document.createElement("td");
        tdName.setAttribute("data-label", "Nombre:")
        tdName.appendChild(document.createTextNode(user.name));
        // CORREO ELECTRÓNICO
        let tdEmail = document.createElement("td");
        tdEmail.setAttribute("data-label", "Correo:")
        tdEmail.appendChild(document.createTextNode(user.email));
        // USER PROFILE
        let tdRole = document.createElement("td");
        tdRole.setAttribute("data-label", "Rol:");
        tdRole.appendChild(document.createTextNode(user.user_profile));
        // ACCIONES
        let tdAcciones   = document.createElement("td");
        tdAcciones.setAttribute("data-label", "Acciones:")
        // EDITAR
        let aEdit      = document.createElement("a");
        let aEdit_icon = document.createElement("i");
        aEdit_icon.setAttribute("class", "fa-regular fa-pen-to-square");
        aEdit.appendChild(aEdit_icon);
        aEdit.addEventListener("click", () => {
            modifyUser(user.id); // Función para modificar el usuario
        });
        // MOSTRAR
        let aDisplay      = document.createElement("a");
        let aDisplay_icon = document.createElement("i");
        aDisplay_icon.setAttribute("class", "fa-regular fa-eye");
        aDisplay.appendChild(aDisplay_icon);
        aDisplay.addEventListener("click", () => {
            displayUser(user.id);
        });
        // ELIMINAR
        let aDelete      = document.createElement("a");
        if(currentUser.id != user.id){
            let aDelete_icon = document.createElement("i");
            aDelete_icon.setAttribute('class', 'fa-regular fa-trash-can');
            aDelete.appendChild(aDelete_icon);
            aDelete.addEventListener("click", async function() {
                let posts = await getData(url, 'Post');
                let exists;
                for (let i = 0; i < posts.length; i++){
                    if(posts.id_creator == user.id){
                        exists = 1;
                    }
                }

                if(!exists && confirm('¿Desea eliminar a ' + user.name + '?')){
                    deleteData(url, 'Users', user.id); // Función para borrar el usuario
                    tbody.removeChild(tr);
                }    
            });
        }
        
        
        tdAcciones.appendChild(aEdit);
        tdAcciones.appendChild(aDisplay);
        tdAcciones.appendChild(aDelete);

        // Añadir columnas a la fila
        tr.appendChild(checkBox);
        tr.appendChild(tdName);
        tr.appendChild(tdEmail);
        tr.appendChild(tdRole);
        tr.appendChild(tdAcciones)

        // Añadir la fila al tbody
        tbody.appendChild(tr);
    });
}

async function modifyUser(id) {
    let users = await getData(url, 'Users');
    console.log(users);
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.id === id) {
            console.log(id)
            localStorage.setItem("userToEdit", JSON.stringify(user));
            window.location.href = "../modificar/modificarUsuari.html";
            break;
        }
    }
}

async function displayUser(id) {
    let users = await getData(url, 'Users');
    console.log(users);
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.id === id) {
            console.log(id)
            localStorage.setItem("userToDisplay", JSON.stringify(user));
            window.location.href = "../visualitzar/visualitzarUsuari.html";
            break;
        }
    }
}


async function autocompleteFilters () {
    let users = await getData(url, 'Users');
    let names = [];
    let email = [];
    let role = ['Administrador', 'Editor', 'Publicador'];
    
    users.forEach(user => {
        names.push(user.name);
        email.push(user.email);   
    });
    $('#name').autocomplete ({
        source: names
    });

    $('#email').autocomplete({
        source:email
    });

    $('#role').autocomplete({
        source:role
    })
    
}

function search () {
    let name         = document.getElementById("name").value.toLowerCase();
    let email        = document.getElementById("email").value.toLowerCase();
    let user_profile = document.getElementById("user_profile");
    role = user_profile.options[user_profile.selectedIndex].text;

    if(role === "Seleccione el rol"){
        role = "";
    }

    let rows = document.querySelectorAll("#users-list tr"); // Todas las filas de la tabla
   
    rows.forEach(row => {
        let tdName = row.querySelector("td[data-label='Nombre:']");
        let tdEmail = row.querySelector("td[data-label='Correo:']");
        let tdRole = row.querySelector("td[data-label='Rol:']");
        

        let match = true;
        if (name && !tdName.textContent.toLowerCase().includes(name)) {
            match = false;
        }

        if (email && !tdEmail.textContent.toLowerCase().includes(email)) {
            match = false;
        }

        if (role && tdRole.textContent !== role) {
            match = false;
        }

        // Muestra u oculta una línea según el resultado
        row.style.display = match ? "" : "none";
        
    });

}

async function bulkActions () {
    let select = document.getElementById("bulkActions");
    let option = select.options[select.selectedIndex].value;
    let tbody  = document.getElementById('users-list');
    let tr;

    if(option === 'Eliminar'){
        let checkboxes = document.querySelectorAll("input[type=checkbox]");
        let delete_users = [];
        checkboxes.forEach(checkbox => {
            if(checkbox.checked === true){
                if(checkbox.id != 'selectAll'){
                    delete_users.push(checkbox.id);
                }
            } 
        });
        console.log(delete_users);
        console.log(delete_users.length);
        if(delete_users.length === 1 ){
            if(confirm("¿Desea eliminar el usuario seleccionado?")){
                tr = document.getElementById(delete_users[0]);
                tbody.removeChild(tr);
                await deleteData(url, 'Users', delete_users[0]);
                select = "";
                //window.location.href = "llistarUsuaris.html";
                //console.log(delete_users[0])
            }
        } else if (confirm("¿Desea eliminar los usuarios seleccionados?")){
            delete_users.forEach(async function(user) {
                tr = document.getElementById(user);
                tbody.removeChild(tr);
                await deleteData(url, 'Users', user);
                select = "";
                //window.location.href = "llistarUsuaris.html";
                //console.log(user)
            })
        }
    }
}


function cleanFilters () {
    let name         = document.getElementById("name").value;
    let email        = document.getElementById("email").value;
    let user_profile = document.getElementById("user_profile").value;

    if(name || email || user_profile === 0){
        name         = "";
        email        = "";
        user_profile = "";

        window.location.href = "llistarUsuaris.html";
    }
    
}