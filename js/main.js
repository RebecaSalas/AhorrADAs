// Selección de elementos del DOM
const elementos = {
    iconoHamburguesa: document.getElementById('hamburger-icon'), // Ícono del menú hamburguesa
    iconoCerrar: document.getElementById('close-icon'), // Ícono para cerrar el menú
    menuModal: document.getElementById('menu-modal'), // Modal del menú en modo responsive
    abrirModalBtn: document.getElementById('abrir-modal-btn'), // Botón para abrir el modal de nueva operación
    modalNuevaOperacion: document.getElementById('modal-nueva-operacion'), // Modal de nueva operación
    cancelarBtn: document.getElementById('cancelar-btn'), // Botón de cancelar en el modal de nueva operación
    formularioNuevaOperacion: document.getElementById('formulario-nueva-operacion'), // Formulario para nueva operación
    listaOperaciones: document.getElementById('lista-operaciones'), // Contenedor de la lista de operaciones
    itemsOperaciones: document.getElementById('operaciones-lista'), // Elemento donde se muestran las operaciones
    mensajeSinResultados: document.getElementById('mensaje-sin-resultados'), // Mensaje de "Sin resultados"
    mensajeCambiarFiltros: document.getElementById('mensaje-cambiar-filtros'), // Mensaje de "Cambiar filtros"
    operationsPlaceholder: document.getElementById('operations-placeholder'), // Placeholder cuando no hay operaciones
    balanceGanancias: document.getElementById('balance-ganancias'), // Elemento que muestra las ganancias
    balanceGastos: document.getElementById('balance-gastos'), // Elemento que muestra los gastos
    balanceTotal: document.getElementById('balance-total'), // Elemento que muestra el balance total
    contenedorFiltros: document.querySelector('#contenedor-filtros'), // Contenedor de filtros
    mostrarOcultarFiltrosBtn: document.querySelector('#contenedor-filtros a'), // Botón para mostrar/ocultar filtros
    contenidoFiltros: document.querySelector('#contenido-filtros'), // Contenido de los filtros
    filtroTipo: document.querySelector('#filter-tipo'), // Filtro por tipo de operación
    filtroCategoria: document.querySelector('#filter-categoria'), // Filtro por categoría de operación
    filtroFecha: document.querySelector('#filter-fecha'), // Filtro por fecha de operación
    filtroOrden: document.querySelector('#filter-ordenar') // Filtro para ordenar las operaciones
};

// Almacenar operaciones
let operaciones = []; // Array para almacenar las operaciones

// Funciones de almacenamiento
const guardarOperaciones = () => localStorage.setItem('operaciones', JSON.stringify(operaciones)); // Guarda las operaciones en localStorage

const cargarOperaciones = () => {
    const operacionesGuardadas = localStorage.getItem('operaciones'); // Carga las operaciones desde localStorage
    if (operacionesGuardadas) {
        operaciones = JSON.parse(operacionesGuardadas);
        aplicarFiltros(); // Aplica los filtros después de cargar las operaciones
        actualizarBalance(); // Actualiza el balance después de cargar las operaciones
    }
};

// Función para alternar el menú hamburguesa
const alternarMenu = () => {
    elementos.menuModal.classList.toggle('hidden'); // Muestra/oculta el menú modal
    elementos.iconoHamburguesa.classList.toggle('hidden'); // Muestra/oculta el ícono del menú hamburguesa
    elementos.iconoCerrar.classList.toggle('hidden'); // Muestra/oculta el ícono de cerrar
};

elementos.iconoHamburguesa.addEventListener('click', alternarMenu);
elementos.iconoCerrar.addEventListener('click', alternarMenu);

// Funciones para abrir y cerrar el modal de nueva operación
const abrirModal = () => {
    elementos.modalNuevaOperacion.classList.remove('hidden'); // Muestra el modal de nueva operación
    document.getElementById('contenido-principal').classList.add('hidden'); // Oculta el contenido principal
};

const cerrarModal = () => {
    elementos.modalNuevaOperacion.classList.add('hidden'); // Oculta el modal de nueva operación
    document.getElementById('contenido-principal').classList.remove('hidden'); // Muestra el contenido principal
};

elementos.abrirModalBtn.addEventListener('click', abrirModal);
elementos.cancelarBtn.addEventListener('click', cerrarModal);

// Función para agregar una nueva operación
const agregarOperacion = (evento) => {
    evento.preventDefault();
    const nuevaOperacion = {
        id: Date.now(),
        descripcion: document.getElementById('descripcion').value,
        monto: parseFloat(document.getElementById('monto').value),
        tipo: document.getElementById('tipo').value,
        categoria: document.getElementById('categoria').value,
        fecha: document.getElementById('fecha').value,
    };
    operaciones.push(nuevaOperacion); // Añade la nueva operación al array
    guardarOperaciones(); // Guarda las operaciones en localStorage
    aplicarFiltros(); // Aplica los filtros después de agregar la operación
    actualizarBalance(); // Actualiza el balance después de agregar la operación
    cerrarModal(); // Cierra el modal de nueva operación
    elementos.formularioNuevaOperacion.reset(); // Resetea el formulario de nueva operación
};

elementos.formularioNuevaOperacion.addEventListener('submit', agregarOperacion);

// Función para editar una operación existente
const editarOperacion = (id) => {
    const operacion = operaciones.find(op => op.id === id); // Encuentra la operación a editar
    document.getElementById('descripcion').value = operacion.descripcion;
    document.getElementById('monto').value = operacion.monto;
    document.getElementById('tipo').value = operacion.tipo;
    document.getElementById('categoria').value = operacion.categoria;
    document.getElementById('fecha').value = operacion.fecha;

    abrirModal(); // Abre el modal con los datos de la operación a editar

    const guardarEdicion = (evento) => {
        evento.preventDefault();
        operacion.descripcion = document.getElementById('descripcion').value;
        operacion.monto = parseFloat(document.getElementById('monto').value);
        operacion.tipo = document.getElementById('tipo').value;
        operacion.categoria = document.getElementById('categoria').value;
        operacion.fecha = document.getElementById('fecha').value;

        guardarOperaciones(); // Guarda las operaciones editadas en localStorage
        aplicarFiltros(); // Aplica los filtros después de editar la operación
        actualizarBalance(); // Actualiza el balance después de editar la operación
        cerrarModal(); // Cierra el modal de nueva operación
        elementos.formularioNuevaOperacion.removeEventListener('submit', guardarEdicion);
        elementos.formularioNuevaOperacion.addEventListener('submit', agregarOperacion);
    };

    elementos.formularioNuevaOperacion.removeEventListener('submit', agregarOperacion);
    elementos.formularioNuevaOperacion.addEventListener('submit', guardarEdicion);
};

// Función para eliminar una operación
const eliminarOperacion = (id) => {
    operaciones = operaciones.filter(op => op.id !== id); // Filtra las operaciones para eliminar la operación seleccionada
    guardarOperaciones(); // Guarda las operaciones después de eliminar
    aplicarFiltros(); // Aplica los filtros después de eliminar la operación
    actualizarBalance(); // Actualiza el balance después de eliminar la operación
};

// Función para renderizar las operaciones en la interfaz
const renderizarOperaciones = (ops) => {
    elementos.itemsOperaciones.innerHTML = ''; // Limpia la lista de operaciones
    ops.forEach(operacion => {
        const nuevaOperacionDiv = document.createElement('div');
        nuevaOperacionDiv.classList.add('operacion', 'grid', 'grid-cols-5', 'gap-4', 'py-2', 'border-b', 'border-gray-200');
        nuevaOperacionDiv.dataset.tipo = operacion.tipo; // Añade el tipo de operación como dato
        nuevaOperacionDiv.dataset.categoria = operacion.categoria; // Añade la categoría de operación como dato
        nuevaOperacionDiv.dataset.fecha = operacion.fecha; // Añade la fecha de operación como dato
        nuevaOperacionDiv.dataset.monto = operacion.monto; // Añade el monto de operación como dato
        nuevaOperacionDiv.dataset.descripcion = operacion.descripcion; // Añade la descripción de operación como dato
        nuevaOperacionDiv.innerHTML = `
            <div>${operacion.descripcion}</div>
            <div>${operacion.categoria}</div>
            <div>${operacion.fecha}</div>
            <div class="${operacion.tipo === 'gasto' ? 'text-red-500' : 'text-green-500'}">
                ${operacion.tipo === 'gasto' ? '-' : '+'}$${operacion.monto.toFixed(2)}
            </div>
            <div class="flex space-x-2">
                <button class="editar-btn text-red-500 hover:text-black font-bold py-1 px-2 rounded bg-white cursor-pointer">Editar</button>
                <button class="eliminar-btn text-red-500 hover:text-black font-bold py-1 px-2 rounded bg-white cursor-pointer">Eliminar</button>
            </div>
        `;
        // Asigna los eventos de edición y eliminación a los botones correspondientes
        nuevaOperacionDiv.querySelector('.editar-btn').addEventListener('click', () => editarOperacion(operacion.id));
        nuevaOperacionDiv.querySelector('.eliminar-btn').addEventListener('click', () => eliminarOperacion(operacion.id));
        elementos.itemsOperaciones.appendChild(nuevaOperacionDiv); // Añade la operación a la lista en la interfaz
    });

    const noOperaciones = ops.length === 0; // Verifica si no hay operaciones
    elementos.mensajeSinResultados.classList.toggle('hidden', !noOperaciones); // Muestra/oculta el mensaje de "Sin resultados"
    elementos.mensajeCambiarFiltros.classList.toggle('hidden', !noOperaciones); // Muestra/oculta el mensaje de "Cambiar filtros"
    elementos.operationsPlaceholder.classList.toggle('hidden', !noOperaciones); // Muestra/oculta el placeholder de operaciones
    elementos.listaOperaciones.classList.toggle('hidden', noOperaciones); // Muestra/oculta la lista de operaciones
};

// Función para aplicar filtros y ordenar operaciones
const aplicarFiltros = () => {
    let operacionesFiltradas = operaciones; // Copia del array de operaciones

    const tipo = elementos.filtroTipo.value;
    if (tipo !== 'todos') {
        operacionesFiltradas = operacionesFiltradas.filter(op => op.tipo === tipo); // Filtra por tipo
    }

    const categoria = elementos.filtroCategoria.value;
    if (categoria !== 'todas') {
        operacionesFiltradas = operacionesFiltradas.filter(op => op.categoria === categoria); // Filtra por categoría
    }

    const fecha = elementos.filtroFecha.value;
    if (fecha) {
        operacionesFiltradas = operacionesFiltradas.filter(op => new Date(op.fecha) >= new Date(fecha)); // Filtra por fecha
    }

    const ordenar = elementos.filtroOrden.value;
    operacionesFiltradas.sort((a, b) => {
        if (ordenar === 'fecha-reciente') return new Date(b.fecha) - new Date(a.fecha);
        if (ordenar === 'fecha-antigua') return new Date(a.fecha) - new Date(b.fecha);
        if (ordenar === 'monto-mayor') return b.monto - a.monto;
        if (ordenar === 'monto-menor') return a.monto - b.monto;
        if (ordenar === 'descripcion-asc') return a.descripcion.localeCompare(b.descripcion);
        if (ordenar === 'descripcion-desc') return b.descripcion.localeCompare(a.descripcion);
        return 0;
    });

    renderizarOperaciones(operacionesFiltradas); // Renderiza las operaciones filtradas y ordenadas
};

// Agregar eventos a los filtros
elementos.filtroTipo.addEventListener('change', aplicarFiltros);
elementos.filtroCategoria.addEventListener('change', aplicarFiltros);
elementos.filtroFecha.addEventListener('change', aplicarFiltros);
elementos.filtroOrden.addEventListener('change', aplicarFiltros);

// Función para alternar la visibilidad de los filtros
const alternarFiltros = () => {
    const isHidden = elementos.contenidoFiltros.classList.contains('hidden');
    elementos.contenidoFiltros.classList.toggle('hidden'); // Muestra/oculta el contenido de los filtros
    elementos.mostrarOcultarFiltrosBtn.textContent = isHidden ? 'Ocultar filtros' : 'Mostrar filtros'; // Cambia el texto del botón
};

elementos.mostrarOcultarFiltrosBtn.addEventListener('click', alternarFiltros);

// Función para actualizar el balance
const actualizarBalance = () => {
    const ingresos = operaciones.filter(op => op.tipo === 'ganancia').reduce((total, op) => total + op.monto, 0); // Calcula las ganancias
    const gastos = operaciones.filter(op => op.tipo === 'gasto').reduce((total, op) => total + op.monto, 0); // Calcula los gastos
    const total = ingresos - gastos; // Calcula el balance total

    elementos.balanceGanancias.textContent = `+$${ingresos.toFixed(2)}`; // Actualiza el texto de ganancias
    elementos.balanceGastos.textContent = `-$${gastos.toFixed(2)}`; // Actualiza el texto de gastos
    if (total >= 0) {
        elementos.balanceTotal.textContent = `+$${total.toFixed(2)}`; // Actualiza el texto del balance total positivo
        elementos.balanceTotal.classList.remove('text-red-500');
        elementos.balanceTotal.classList.add('text-green-500');
    } else {
        elementos.balanceTotal.textContent = `-$${Math.abs(total).toFixed(2)}`; // Actualiza el texto del balance total negativo
        elementos.balanceTotal.classList.remove('text-green-500');
        elementos.balanceTotal.classList.add('text-red-500');
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarOperaciones(); // Carga las operaciones desde localStorage
    elementos.contenidoFiltros.classList.remove('hidden'); // Muestra los filtros al cargar la página
    elementos.mostrarOcultarFiltrosBtn.textContent = 'Ocultar filtros'; // Ajusta el texto del botón de filtros
    aplicarFiltros(); // Aplica los filtros al cargar la página
    actualizarBalance(); // Actualiza el balance al cargar la página
});
