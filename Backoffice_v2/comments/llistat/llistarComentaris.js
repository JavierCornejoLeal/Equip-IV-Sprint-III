window.onload = main;

function main() {
    verifyUser();
    document.getElementById("alta").addEventListener("click", nouComentari);
    document.getElementById("filtrarFuncion").addEventListener("click", activarFiltros); 

    document.getElementById("titol").addEventListener("input", actualizarFiltrosEnTiempoReal);
    obtindreComentaris();

    let boton = document.getElementById("dropdown");
    let menu = document.querySelector("nav");

    boton.addEventListener("click", () => {
        menu.classList.toggle('show');
    });

    document.getElementById("aplicarAccion").addEventListener("click", () => {
        const accionSeleccionada = document.getElementById("selectorAccion").value;
        if (accionSeleccionada === "eliminar") {
            eliminarSeleccionados();
        } else {
            alert("Por favor, selecciona una acción válida.");
        }
    });
}

function verifyUser () {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser.user_profile === 'Publicador'){
        alert('No cuenta con los permisos necesarios para acceder a esta sección. Comuniquese con su Administrador');
        window.location.href = '../../blog/blog.html';
    }
}


function nouComentari(){
    window.location.assign("../alta/altaComentari.html");
}


async function obtindreComentaris(filtros = null) {
    const llistaComentaris = await getData(url, "Comment");
    const tbody = document.getElementById("files");

    // Limpiar la tabla antes de mostrar los comentarios
    tbody.innerHTML = "";

    // Aplicar los filtros si están definidos, de lo contrario mostrar todos los comentarios
    const comentarisFiltrats = filtros ? llistaComentaris.filter(filtros) : llistaComentaris;

    // Actualizar el selector con los comentarios filtrados
    actualizarSelectComentario(comentarisFiltrats);

    // Recorrer el array y construir la estructura HTML
    comentarisFiltrats.forEach((comentari) => {
        const tr = document.createElement("tr");

        // Checkbox
        const tdCheckbox = document.createElement("td");
        tdCheckbox.className = "checkBoxth";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        tdCheckbox.appendChild(checkbox);

        // ID
        const tdId = document.createElement("td");
        tdId.setAttribute("data-label", "ID:");
        tdId.textContent = comentari.id;

        // Descripción
        const tdDescripcion = document.createElement("td");
        tdDescripcion.setAttribute("data-label", "Descripción:");
        tdDescripcion.textContent = comentari.description;

        // Título del post
        const tdTitolPost = document.createElement("td");
        tdTitolPost.setAttribute("data-label", "Título-Post:");
        tdTitolPost.textContent = comentari.post_title;

        // Acciones
        const tdAcciones = document.createElement("td");
        tdAcciones.setAttribute("data-label", "Acciones:");
        const divAcciones = document.createElement("div");
        divAcciones.className = "divAccions";

        // Enlace para modificar
        const linkModificar = document.createElement("a");
        linkModificar.href = "../modificar/modificaComentari.html";
        const iconModificar = document.createElement("i");
        iconModificar.className = "fa-regular fa-pen-to-square";
        linkModificar.appendChild(iconModificar);
        divAcciones.appendChild(linkModificar);
        linkModificar.onclick = (e) => {
            e.preventDefault(); // Evitar la redirección inmediata
            modificar(comentari);
        };

        // Enlace para visualizar
        const linkVisualizar = document.createElement("a");
        linkVisualizar.href = "../visualitzar/visualitzaComentari.html";
        const iconVisualizar = document.createElement("i");
        iconVisualizar.className = "fa-regular fa-eye";
        linkVisualizar.appendChild(iconVisualizar);
        divAcciones.appendChild(linkVisualizar);
        linkVisualizar.onclick = (e) => {
            e.preventDefault(); // Evitar la redirección inmediata
            visualizar(comentari);
        };

        // Enlace para eliminar
        const linkEliminar = document.createElement("a");
        const iconEliminar = document.createElement("i");
        iconEliminar.className = "fa-regular fa-trash-can eliminar";
        linkEliminar.appendChild(iconEliminar);
        linkEliminar.onclick = () => esborrar(comentari.id);
        divAcciones.appendChild(linkEliminar);

        tdAcciones.appendChild(divAcciones);

        // Añadir celdas a la fila
        tr.appendChild(tdCheckbox);
        tr.appendChild(tdId);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdTitolPost);
        tr.appendChild(tdAcciones);

        // Añadir la fila a la tabla
        tbody.appendChild(tr);
    });

    autocompletado(llistaComentaris);
}


// Función que activa los filtros aplicados
async function activarFiltros() {
    const titol = document.getElementById("titol").value.trim().toLowerCase();
    const comentariSeleccionat = document.getElementById("comentari").value.trim();
  
    // Crear una función de filtro basada en los valores
    const filtros = crearFiltro(titol, comentariSeleccionat);
  
    // Obtener y filtrar comentarios
    await obtindreComentaris(filtros);
}
  
// Función que genera un filtro combinado
function crearFiltro(titol, comentariSeleccionat) {
    return (comentari) => {
        // Validar título si está ingresado
        const coincideTitol = !titol || comentari.post_title.toLowerCase().includes(titol);
      
        // Validar comentario seleccionado si no es la opción por defecto
        const coincideComentari = comentariSeleccionat === "Categoria del Post..." || 
            comentari.description.toLowerCase() === comentariSeleccionat.toLowerCase();
      
        // Retorna verdadero si ambos filtros coinciden
        return coincideTitol && coincideComentari;
    };
}

  function actualizarSelectComentario(llistaComentaris) {
    const selectComentario = document.getElementById("comentari");
  
    // Limpiar las opciones existentes
    while (selectComentario.firstChild) {
        selectComentario.removeChild(selectComentario.firstChild);
    }
  
    // Añadir la opción por defecto
    const opcionPorDefecto = document.createElement("option");
    opcionPorDefecto.selected = true;
    opcionPorDefecto.textContent = "Categoria del Post...";
    selectComentario.appendChild(opcionPorDefecto);
  
    // Obtener categorías únicas de los posts filtrados
    const comentaris = [...new Set(llistaComentaris.map((comentari) => comentari.description))];
  
    comentaris.forEach((comentari) => {
      const option = document.createElement("option");
      option.value = comentari;
      option.textContent = comentari;
      selectComentario.appendChild(option);
    });
    autocompletado(llistaComentaris);
  }

// Actualización en tiempo real del filtro al escribir en el título
async function actualizarFiltrosEnTiempoReal() {
    const titol = document.getElementById("titol").value.trim().toLowerCase();
    const comentariSeleccionat = document.getElementById("comentari").value.trim();

    // Crear la función de filtro basada en el título ingresado
    const filtros = crearFiltro(titol, comentariSeleccionat);

    // Aplicar filtros
    await obtindreComentaris(filtros);
}

function autocompletado(llistaComentaris) {
    const titols = [...new Set(llistaComentaris.map((comentari) => comentari.post_title))];
    $("#titol").autocomplete({
        source: titols,
    });
  }

async function esborrar(id) {
    await deleteData(url, "Comment", id);
    obtindreComentaris();
}


// Función para seleccionar o deseleccionar todos los checkboxes
function seleccionarTodosCheckboxes(checkboxPrincipal) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#seleccionarTodo)');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = checkboxPrincipal.checked;
    });
}

// Actualización de la función de eliminar comentarios seleccionados
function eliminarSeleccionados() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked:not(#seleccionarTodo)');
    const checkboxesSeleccionados = [];

    // Recolectar los IDs de los comentarios seleccionados
    checkboxes.forEach((checkbox) => {
        const row = checkbox.closest('tr');
        const checkboxId = row.querySelector('td[data-label="ID:"]').textContent;
        checkboxesSeleccionados.push(checkboxId);
    });

    // Si no hay comentarios seleccionados
    if (checkboxesSeleccionados.length === 0) {
        alert('Por favor, selecciona al menos un elemento para eliminar.');
        return;
    }

    // Confirmar eliminación
    if (confirm('¿Estás seguro de que deseas eliminar los elementos seleccionados?')) {
        // Eliminar los comentarios seleccionados uno a uno
        checkboxesSeleccionados.forEach((checkboxId) => {
            esborrar(checkboxId); // Llamada a la función para eliminar el comentario
        });

        // Recargar los comentarios después de la eliminación
        alert('Elementos eliminados con éxito.');
        obtindreComentaris(); // Actualiza la lista de comentarios después de la eliminación

        // Desmarcar el checkbox principal
        document.getElementById("seleccionarTodo").checked = false;
    }
}

function modificar(comentari) {
    localStorage.setItem("modComentari", JSON.stringify(comentari));
    window.location.assign("../modificar/modificaComentari.html");
}

function visualizar(comentari) {
    localStorage.setItem("modComentari", JSON.stringify(comentari));
    window.location.assign("../visualitzar/visualitzaComentari.html");
}



