window.onload = iniciar;


function iniciar() {

    verifyUser();
    //checkUser();

    //JaviManu
    mostrarEtiquetas();
    mostrarPosts(); // Mostrar los posts al cargar la página

    let boton = document.getElementById("dropdown");
    let menu  = document.querySelector("nav");

    boton.addEventListener("click", () => {
        menu.classList.toggle('show');
    });
}

function login() {
    window.location.href = '../index.html';
}

function gestioUsuaris() {
    window.location.href = '../users/llistar/llistarUsuaris.html';
}

function verifyUser() {
    //Ocultar el botón 
    const btnCrearComentari         = document.querySelectorAll(".afegirComentari");

    //Obtindre usuari actual
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    //Si no hem iniciat sessió no vorem cap botó, sols el d'iniciar botó
    if (!currentUser) {
        btnCrearComentari.forEach(btn => btn.style.display = "none");

    }
    else {
        // Si hay un usuario logueado
        btnCrearComentari.forEach(btn => btn.style.display = "inline-block"); // Muestra todos los botones
    }
    if (currentUser && currentUser.role === "Administrador") {

    }
    else if (currentUser && currentUser.role === "Editor") {

    }
    else if (currentUser && currentUser.role === "Publicador") {


    }
}

/*function checkUser() {
    var loginBtn = document.getElementById("login");
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        // Crear un nuevo elemento para el nombre del usuario
        const userName = document.createElement("span");
        userName.classList.add("btn", "btn-primary");
        userName.appendChild(document.createTextNode(currentUser.name));

        // Reemplazar el botón de login por el nombre del usuario
        loginBtn.parentNode.replaceChild(userName, loginBtn);
    }
}*/

function tancaSessio() {
    localStorage.removeItem("currentUser");
    verifyUser();
}

//JaviManu
// Función para mostrar las etiquetas almacenadas en localStorage
async function mostrarEtiquetas() {
    const etiquetas = await getData(url, "Tag");
    const etiquetaSelect = document.getElementById("etiquetaSelect");
    
    // Limpiar el contenido del select
    etiquetaSelect.innerHTML = ""; 
    
    // Crear una opción predeterminada
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecciona una etiqueta. . .";
    etiquetaSelect.appendChild(defaultOption);

    // Agregar cada etiqueta como una opción en el select
    etiquetas.forEach(etiqueta => {
        const option = document.createElement("option");
        option.value = etiqueta.name; // El valor es el nombre de la etiqueta
        option.textContent = etiqueta.name; // Muestra el nombre de la etiqueta
        etiquetaSelect.appendChild(option);
    });

    // Agregar un evento para filtrar posts cuando se seleccione una etiqueta
    etiquetaSelect.addEventListener("change", function() {
        const selectedTag = etiquetaSelect.value;
        mostrarPosts(selectedTag); // Filtrar posts por la etiqueta seleccionada
    });
}

async function mostrarPosts(selectedTag = "") {
    const posts = await getData(url, "Post");
    const mostraPostsContainer = document.querySelector(".mostrarPosts");
    mostraPostsContainer.innerHTML = "";

    // Filtrar los posts si se seleccionó una etiqueta
    const filteredPosts = selectedTag ? posts.filter(post => post.tag === selectedTag) : posts;

    // Ordenar los posts por fecha de creación (de más reciente a más antiguo)
    filteredPosts.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));

    filteredPosts.forEach(post => {

        const postContainer = document.createElement("div");
        postContainer.classList.add("post-container");

        const textContainer = document.createElement("div");
        textContainer.classList.add("text-container");

        const tituloContainer = document.createElement("div");
        tituloContainer.classList.add("titulo-post");
        const titulo = document.createElement("p");
        titulo.appendChild(document.createTextNode(post.title));

        const fechaContainer = document.createElement("div");
        fechaContainer.classList.add("fecha-post");
        const fecha = document.createElement("p");
        fecha.appendChild(document.createTextNode(post.creation_date));
        
        const etiquetaContainer = document.createElement("div");
        etiquetaContainer.classList.add("etiqueta-post");
        const etiquetaLogo = document.createElement("i");
        etiquetaLogo.classList.add("fa-solid", "fa-tag");
        const etiqueta = document.createElement("p");
        etiqueta.appendChild(document.createTextNode(post.tag));
        
        const descripcionContainer = document.createElement("div");
        descripcionContainer.classList.add("descripcion-post");
        const descripcion = document.createElement("p");
        descripcion.appendChild(document.createTextNode(post.description));
        


        textContainer.appendChild(tituloContainer);
        textContainer.appendChild(fechaContainer);
        textContainer.appendChild(etiquetaContainer);
        textContainer.appendChild(descripcionContainer);

        tituloContainer.appendChild(titulo);
        fechaContainer.appendChild(fecha);
        etiquetaContainer.appendChild(etiquetaLogo);
        etiquetaContainer.appendChild(etiqueta);
        descripcionContainer.appendChild(descripcion);


        const btnAfegirComentari = document.createElement("button");
        btnAfegirComentari.appendChild(document.createTextNode("Afegir Comentari"));
        btnAfegirComentari.classList.add("btn", "btn-success", "afegirComentari", "botoTaronja");


        btnAfegirComentari.addEventListener("click", function() {
            sessionStorage.setItem("currentPostID", post.id);
            sessionStorage.setItem("currentPostTitle", post.title);
            window.location.href = "../comments/alta/altaComentari.html";
        });

        textContainer.appendChild(btnAfegirComentari);

        const imagenContainer = document.createElement("div");
        imagenContainer.classList.add("img-container");
        const imagen = document.createElement("img");
        imagen.src = post.foto || "https://www.shutterstock.com/image-vector/write-blog-post-icon-blogging-600nw-2417074323.jpg";
        imagen.alt = "imatgePost";

        imagenContainer.appendChild(imagen);

        postContainer.appendChild(textContainer);
        postContainer.appendChild(imagenContainer);

        mostraPostsContainer.appendChild(postContainer);

        const comentariosDiv = document.createElement("div");
        comentariosDiv.classList.add("comentariosPost");


        const comentariosTitle = document.createElement("h5");
        comentariosTitle.appendChild(document.createTextNode("COMENTARIOS"));
        comentariosDiv.appendChild(comentariosTitle);

        mostrarComentariosPorPost(post.id, comentariosDiv);

        mostraPostsContainer.appendChild(comentariosDiv);
    });
}




// Función para mostrar los comentarios relacionados con un post específico
async function mostrarComentariosPorPost(postID, comentariosDiv) {
    const comentaris = await getData(url, "Comment");
    const user = JSON.parse(localStorage.getItem("currentUser")) || [];

    // Filtrar los comentarios que coinciden con el postID
    const comentariosRelacionados = comentaris.filter(comentari => comentari.post_id === postID.toString());

    // Agregar cada comentario al contenedor de comentarios
    comentariosRelacionados.forEach(comentario => {
        const comentarioDiv = document.createElement("div");
        comentarioDiv.classList.add("comentario");


        const usuario = document.createElement("p");
        usuario.style.fontWeight = "bold";
        usuario.style.fontSize = "1.1em";
        usuario.appendChild(document.createTextNode(`${comentario.creator_id}`));

        const descripcio = document.createElement("p");
        descripcio.appendChild(document.createTextNode(comentario.description));
        descripcio.style.padding = "0 10em ";
        comentarioDiv.appendChild(usuario);
        comentarioDiv.appendChild(descripcio);
        comentariosDiv.appendChild(comentarioDiv);
    });
}
