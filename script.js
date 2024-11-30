// Array para almacenar las tareas
let tareas = [];

let tareaEditando = null; // Variable para mantener referencia a la tarea que se está editando

/**
 * Función para agregar una nueva tarea
 * @param {*} titulo titulo de la tarea
 * @param {*} descripcion descripcion de la tarea
 * @param {*} urgencia  urgencia de la tarea
 * @function agregarTarea crea un nuevo objeto Tarea y lo agrega al array de tareas
 */
function agregarTarea(titulo, descripcion, urgencia) {
    const id = Date.now().toString();
    const nuevaTarea = new Tarea(id, titulo, descripcion, false, urgencia);
    tareas.push(nuevaTarea);
    mostrarTareas();
}

/**
 * Función para mostrar las tareas en el HTML
 * @function mostrarTareas recorre el array de tareas y las muestra en el HTML
 */
function mostrarTareas() {
    const contenedor = document.getElementById('lista-tareas');
    contenedor.innerHTML = '';
    // confirma que la tarea no ha sido eliminada
    tareas.forEach(tarea => {
        if (!tarea.eliminada) {
            const urgenciaClases = {
                'urgente': 'text-red-700 bg-red-100',
                'normal': 'text-yellow-700 bg-yellow-100',
                'no-urgente': 'text-blue-700 bg-blue-100'
            };
            // crea un div para la tarea
            const elemento = document.createElement('div');
            elemento.className = 'flex items-center justify-between p-4 border-b';
            elemento.innerHTML = `
                <div class="flex items-center space-x-4 flex-grow">
                    <input type="checkbox" class="w-5 h-5 rounded"
                          ${tarea.estado ? 'checked' : ''}
                          onchange="toggleTarea('${tarea.id}')">
                    <div class="flex flex-col">
                        <span class="text-lg ${tarea.estado ? 'line-through' : ''}">${tarea.titulo}</span>
                        <span class="text-sm text-gray-600">${tarea.descripcion}</span>
                    </div>
                    <span class="px-3 py-1 text-sm font-semibold rounded-full ${urgenciaClases[tarea.urgencia]}">
                        ${tarea.urgencia}
                    </span>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editarTarea('${tarea.id}')" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button onclick="eliminarTarea('${tarea.id}')" class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            `;
            contenedor.appendChild(elemento);
        }
    });
}

// Funciones para manipular tareas
function toggleTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.toggleEstado();
        mostrarTareas();
    }
}

function eliminarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.eliminar();
        mostrarTareas();
    }
}

function editarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        // Guardamos referencia a la tarea que estamos editando
        tareaEditando = tarea;

        // Rellenamos el formulario con los datos actuales
        document.getElementById('titulo').value = tarea.titulo;
        document.getElementById('descripcion').value = tarea.descripcion;
        document.getElementById('urgencia').value = tarea.urgencia;

        // Cambiamos el texto del botón de guardar
        const botonGuardar = document.querySelector('#formularioTarea button[type="submit"]');
        botonGuardar.textContent = 'Actualizar';

        // Cambiamos el título del modal
        document.querySelector('#modal h2').textContent = 'Editar Tarea';

        // Abrimos el modal
        abrirModal();
    }
}

function abrirModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('active');
}

function cerrarModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');

    // Resetear el formulario
    document.getElementById('formularioTarea').reset();

    // Restaurar el texto del botón
    const botonGuardar = document.querySelector('#formularioTarea button[type="submit"]');
    botonGuardar.textContent = 'Guardar';

    // Restaurar el título del modal
    document.querySelector('#modal h2').textContent = 'Nueva Tarea';

    // Limpiar la referencia a la tarea en edición
    tareaEditando = null;
}

/**
 * Función que se ejecuta cuando se envia el formulario
 * @param {*} event  sirve para evitar que se recargue la pagina al enviar el formulario y no se pierdan los datos
 */
function guardarTarea(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const urgencia = document.getElementById('urgencia').value;

    if (tareaEditando) {
        // Estamos editando una tarea existente
        tareaEditando.actualizar(titulo, descripcion, urgencia);
        tareaEditando = null; // Limpiamos la referencia
    } else {
        // Estamos creando una nueva tarea
        agregarTarea(titulo, descripcion, urgencia);
    }

    mostrarTareas();
    cerrarModal();
}

// Función para validar el formulario de la nueva tarea
/**
 * @param {*} titulo titulo de la nueva tarea
 * @param {*} descripcion  descripcion de la nueva tarea
 * @returns  false si el titulo o la descripcion son menores a 3 o 5 respectivamente
 */
function validarFormulario(titulo, descripcion) {
    if (titulo.length < 3) {
        alert('El título debe tener al menos 3 caracteres');
        return false;
    }
    if (descripcion.length < 5) {
        alert('La descripción debe tener al menos 5 caracteres');
        return false;
    }
    return true;
}

/**
 * Función que se ejecuta al cargar la pagina para mostrar las tareas
 */
window.onload = function() {
    mostrarTareas();
}