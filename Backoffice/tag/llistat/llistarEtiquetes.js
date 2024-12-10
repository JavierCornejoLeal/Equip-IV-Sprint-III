window.onload = main;

function main() {
    document.getElementById("novaEtiqueta").addEventListener("click", novaEtiqueta);
    document.getElementById("filtrarFuncion").addEventListener("click", activarFiltros);  

    document.getElementById("nom").addEventListener("input", actualizarFiltrosEnTiempoReal);
    obtindreEtiquetes();
   
    let boton = document.getElementById("dropdown");
    let menu  = document.querySelector("nav");

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

function novaEtiqueta(){
    window.location.assign("../alta/altaEtiqueta.html");
}


async function obtindreEtiquetes(filtros = null) {
    // Obtener etiquetas del backend o localStorage
    const llistaEtiquetes = await getData(url, "Tag");
    const tbody = document.getElementById("files");
  
    // Limpiar el contenido de la tabla antes de añadir nuevas filas
    tbody.innerHTML = "";
  
    // Si se pasa un filtro, aplicar, si no, mostrar todas las etiquetas
    const etiquetasFiltradas = filtros ? llistaEtiquetes.filter(filtros) : llistaEtiquetes;
  
    // Recorrer las etiquetas filtradas y agregar filas con la estructura deseada
    etiquetasFiltradas.forEach((etiqueta) => {
      const tr = document.createElement("tr");
  
      // Columna de checkbox
      const tdCheckBox = document.createElement("td");
      tdCheckBox.className = "checkBoxth";
      const inputCheckbox = document.createElement("input");
      inputCheckbox.type = "checkbox";
      tdCheckBox.appendChild(inputCheckbox);
  
      // Columna de ID
      const tdId = document.createElement("td");
      tdId.setAttribute("data-label", "ID:");
      tdId.textContent = etiqueta.id; // Usar el índice como ID temporal
  
      // Columna de nombre
      const tdNombre = document.createElement("td");
      tdNombre.setAttribute("data-label", "Nombre:");
      tdNombre.textContent = etiqueta.name;
  
      // Columna de acciones
      const tdAcciones = document.createElement("td");
      tdAcciones.setAttribute("data-label", "Acciones:");
      const divAccions = document.createElement("div");
      divAccions.className = "divAccions";
  
      // Botón de modificar
      const enlaceModificar = document.createElement("a");
      enlaceModificar.href = "../modificar/modificaEtiqueta.html";
      const iconoModificar = document.createElement("i");
      iconoModificar.className = "fa-regular fa-pen-to-square";
      enlaceModificar.appendChild(iconoModificar);
      enlaceModificar.onclick = (e) => {
        e.preventDefault(); // Evitar la redirección inmediata
        modificar(etiqueta);
      };
  
      // Botón de visualizar
      const enlaceVisualizar = document.createElement("a");
      enlaceVisualizar.href = "../visualitzar/visualitzaEtiqueta.html";
      const iconoVisualizar = document.createElement("i");
      iconoVisualizar.className = "fa-regular fa-eye";
      enlaceVisualizar.appendChild(iconoVisualizar);
      enlaceVisualizar.onclick = (e) => {
        e.preventDefault(); // Evitar la redirección inmediata
        visualizar(etiqueta);
      };
  
      // Botón de eliminar
      const enlaceEliminar = document.createElement("a");
      enlaceEliminar.href = "#"; // Evitar redirección
      const iconoEliminar = document.createElement("i");
      iconoEliminar.className = "fa-regular fa-trash-can eliminar";
      enlaceEliminar.appendChild(iconoEliminar);
      enlaceEliminar.onclick = (e) => {
        e.preventDefault();
        esborrar(etiqueta.id, etiqueta.name);
      };
  
      // Añadir los botones al contenedor de acciones
      divAccions.appendChild(enlaceModificar);
      divAccions.appendChild(enlaceVisualizar);
      divAccions.appendChild(enlaceEliminar);
  
      // Añadir el contenedor de acciones a la columna
      tdAcciones.appendChild(divAccions);
  
      // Añadir las columnas a la fila
      tr.appendChild(tdCheckBox);
      tr.appendChild(tdId);
      tr.appendChild(tdNombre);
      tr.appendChild(tdAcciones);
  
      // Añadir la fila a la tabla
      tbody.appendChild(tr);
    });
  
    // Actualizar autocompletado con las etiquetas filtradas
    autocompletado(etiquetasFiltradas);
  }
  
  async function activarFiltros() {
    const nom = document.getElementById("nom").value.trim().toLowerCase();
    const filtros = crearFiltro(nom);
    await obtindreEtiquetes(filtros);
  }
  
  function crearFiltro(nom) {
    return (etiqueta) => {
      return !nom || etiqueta.name.toLowerCase().includes(nom);
    };
  }
  
  async function actualizarFiltrosEnTiempoReal() {
    const nom = document.getElementById("nom").value.trim().toLowerCase();
    const filtros = crearFiltro(nom);
    await obtindreEtiquetes(filtros);
  }

function esborrar(id, nomEtiqueta) {
  // Obtener los posts para verificar si la etiqueta está referenciada
  getData(url, "Post").then(llistaPosts => {
    // Buscar si algún post tiene el nombre de la etiqueta referenciado
    const etiquetaAsociada = llistaPosts.some(post => post.tag === nomEtiqueta); 

    if (etiquetaAsociada) {
      // Mostrar un mensaje al usuario indicando que la etiqueta no puede ser eliminada
      alert(`No se puede eliminar la etiqueta "${nomEtiqueta}" porque está asociada a uno o más posts.`);
      return; 
    }

    // Llamar a la función deleteData para eliminar la etiqueta del backend
    deleteData(url, "Tag", id).then(() => {
      // Actualizar la tabla sin recargar la página
      obtindreEtiquetes();
    });
  });
}

// Borrar predeterminado de la etiqueta
async function esborrar(id) {
  await deleteData(url, "Tag", id);

  // Actualizar la tabla sin recargar la página
  obtindreEtiquetes();
}

function modificar(etiqueta) {
  // Guardar la etiqueta seleccionada en localStorage para acceder a ella en modificaEtiqueta.html
  localStorage.setItem("modEtiqueta", JSON.stringify(etiqueta));

  // Redirigir a la página de modificación
  window.location.assign("../modificar/modificaEtiqueta.html");
}

function visualizar(etiqueta) {
  // Guardar la etiqueta seleccionada en localStorage para acceder a ella en visualizarEtiqueta.html
  localStorage.setItem("modEtiqueta", JSON.stringify(etiqueta));

  // Redirigir a la página de visualización
  window.location.assign("../visualitzar/visualitzaEtiqueta.html");
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

function autocompletado(llistaEtiquetes) {
  const etiquetasNames = llistaEtiquetes.map((etiqueta) => etiqueta.name);
  $("#nom").autocomplete({
    source: etiquetasNames,
  });
}
