window.onload = main;

function main() {
    verifyUser();
    document.getElementById("alta").addEventListener("click", nouPost);
    document.getElementById("filtrarFuncion").addEventListener("click", activarFiltros);  

    document.getElementById("titol").addEventListener("input", actualizarFiltrosEnTiempoReal);
    obtindrePosts();
   
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

function verifyUser () {
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (currentUser.user_profile === 'Publicador'){
      alert('No cuenta con los permisos necesarios para acceder a esta sección. Comuniquese con su Administrador');
      window.location.href = '../../blog/blog.html';
  } 
}

function nouPost(){
    window.location.assign("../alta/altaPost.html");
}


async function obtindrePosts(filtros = null) {
    const llistaPosts = await getData(url, "Post");
    const tbody = document.getElementById("files");

    // Limpiar el contenido de la tabla antes de añadir los posts
    tbody.innerHTML = "";

    // Obtener el título del input de búsqueda
    const titol = document.getElementById("titol").value.trim().toLowerCase();

    // Filtrar los posts por el título si se ha ingresado algo
    const postsFiltrats = filtros
        ? llistaPosts.filter(filtros)
        : titol
        ? llistaPosts.filter(post => post.title.toLowerCase().includes(titol))
        : llistaPosts;

    // Llenar los selectores con categorías y usuarios solo de los posts filtrados
    actualizarSelectCategoria(postsFiltrats);
    actualizarSelectUsuari(postsFiltrats);

    postsFiltrats.forEach((post) => {
        const tr = document.createElement("tr");

        // Checkbox
        const tdCheckbox = document.createElement("td");
        tdCheckbox.classList.add("checkBoxth");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        tdCheckbox.appendChild(checkbox);

        // ID
        const tdId = document.createElement("td");
        tdId.dataset.label = "ID:";
        tdId.textContent = post.id;

        // Título
        const tdTitulo = document.createElement("td");
        tdTitulo.dataset.label = "Título:";
        tdTitulo.textContent = post.title;

        // Etiqueta
        const tdEtiqueta = document.createElement("td");
        tdEtiqueta.dataset.label = "Etiqueta:";
        tdEtiqueta.textContent = post.tag;

        // Usuario
        const tdUsuario = document.createElement("td");
        tdUsuario.dataset.label = "Usuario:";
        tdUsuario.textContent = post.creator_id;

        // Acciones
        const tdAcciones = document.createElement("td");
        tdAcciones.dataset.label = "Acciones:";
        const divAccions = document.createElement("div");
        divAccions.classList.add("divAccions");

        const linkModificar = document.createElement("a");
        linkModificar.href = "../modificar/modificaPost.html";
        const iconModificar = document.createElement("i");
        iconModificar.classList.add("fa-regular", "fa-pen-to-square");
        linkModificar.appendChild(iconModificar);
        linkModificar.onclick = (e) => {
            e.preventDefault(); 
            modificar(post);
        };

        const linkVisualizar = document.createElement("a");
        linkVisualizar.href = "../visualitzar/visualitzaPost.html";
        const iconVisualizar = document.createElement("i");
        iconVisualizar.classList.add("fa-regular", "fa-eye");
        linkVisualizar.appendChild(iconVisualizar);
        linkVisualizar.onclick = (e) => {
            e.preventDefault(); 
            visualizar(post);
        };

        const linkEliminar = document.createElement("a");
        linkEliminar.href = "#";
        const iconEliminar = document.createElement("i");
        iconEliminar.classList.add("fa-regular", "fa-trash-can", "eliminar");
        iconEliminar.onclick = () => esborrar(post.id);
        linkEliminar.appendChild(iconEliminar);

        divAccions.appendChild(linkModificar);
        divAccions.appendChild(linkVisualizar);
        divAccions.appendChild(linkEliminar);

        tdAcciones.appendChild(divAccions);

        // Añadir los elementos a la fila
        tr.appendChild(tdCheckbox);
        tr.appendChild(tdId);
        tr.appendChild(tdTitulo);
        tr.appendChild(tdEtiqueta);
        tr.appendChild(tdUsuario);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    });

    autocompletado(llistaPosts);
}

  
  async function esborrar(id) {
    await deleteData(url, "Post", id);
  
    // Actualizar la tabla sin recargar la página
    obtindrePosts();
  }
  
  function modificar(post) {
    localStorage.setItem("modPost", JSON.stringify(post));
    window.location.assign("../modificar/modificaPost.html");
  }
  
  function visualizar(post) {
    localStorage.setItem("modPost", JSON.stringify(post));
    window.location.assign("../visualitzar/visualitzaPost.html");
  }

  // Filtro que toma en cuenta los valores seleccionados
  async function activarFiltros() {
    const titol = document.getElementById("titol").value.trim().toLowerCase();
    const categoriaSeleccionat = document.getElementById("categoria").value.trim();
    const usuariSeleccionat = document.getElementById("creador").value.trim();
  
    // Crear la función de filtro con los valores proporcionados
    const filtros = crearFiltro(titol, categoriaSeleccionat, usuariSeleccionat);
  
    // Pasar filtros a obtindrePosts
    obtindrePosts(filtros);
  }
  
  function crearFiltro(titol, categoriaSeleccionat, usuariSeleccionat) {
    return (post) => {
      // Validar si el título coincide
      const coincideTitol = !titol || post.title.toLowerCase().includes(titol);
  
      // Validar si la categoría coincide (si está seleccionada)
      const coincideCategoria =
        categoriaSeleccionat === "Categoria del Post..." || 
        post.tag.toLowerCase() === categoriaSeleccionat.toLowerCase();
  
      // Validar si el usuario coincide (si está seleccionado)
      const coincideUsuari =
        usuariSeleccionat === "Creador del Post..." || 
        post.creator_id.toLowerCase() === usuariSeleccionat.toLowerCase();
  
      // Retornar verdadero si todos los filtros coinciden
      return coincideTitol && coincideCategoria && coincideUsuari;
    };
  }
  
  function actualizarSelectCategoria(llistaPosts) {
    const selectCategoria = document.getElementById("categoria");
  
    // Limpiar las opciones existentes
    while (selectCategoria.firstChild) {
      selectCategoria.removeChild(selectCategoria.firstChild);
    }
  
    // Añadir la opción por defecto
    const opcionPorDefecto = document.createElement("option");
    opcionPorDefecto.selected = true;
    opcionPorDefecto.textContent = "Categoria del Post...";
    selectCategoria.appendChild(opcionPorDefecto);
  
    // Obtener categorías únicas de los posts filtrados
    const categorias = [...new Set(llistaPosts.map((post) => post.tag))];
  
    categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria;
      option.textContent = categoria;
      selectCategoria.appendChild(option);
    });
  }
  
  function actualizarSelectUsuari(llistaPosts) {
    const selectUsuari = document.getElementById("creador");
  
    // Limpiar las opciones existentes
    while (selectUsuari.firstChild) {
      selectUsuari.removeChild(selectUsuari.firstChild);
    }
  
    // Añadir la opción por defecto
    const opcionPorDefecto = document.createElement("option");
    opcionPorDefecto.selected = true;
    opcionPorDefecto.textContent = "Creador del Post...";
    selectUsuari.appendChild(opcionPorDefecto);
  
    // Obtener usuarios únicos de los posts filtrados
    const usuarios = [...new Set(llistaPosts.map((post) => post.creator_id))];
  
    usuarios.forEach((usuario) => {
      const option = document.createElement("option");
      option.value = usuario;
      option.textContent = usuario;
      selectUsuari.appendChild(option);
    });
  }
  
  // Función que actualiza filtros en tiempo real al escribir en el título
  async function actualizarFiltrosEnTiempoReal() {
    const titol = document.getElementById("titol").value.trim().toLowerCase();
    const llistaPosts = await getData(url, "Post");
  
    // Filtrar los posts por el título ingresado
    const postsFiltrats = llistaPosts.filter(post => post.title.toLowerCase().includes(titol));
  
    // Llenar los selectores con categorías y usuarios solo de los posts filtrados
    actualizarSelectCategoria(postsFiltrats);
    actualizarSelectUsuari(postsFiltrats);
  
    // Actualizar la tabla de posts
    obtindrePosts();
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
  
  function autocompletado(llistaPosts) {
    const titols = [...new Set(llistaPosts.map((post) => post.title))];
    $("#titol").autocomplete({
        source: titols,
    });
  }
  