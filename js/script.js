// =============================
// CONFIGURACIÓN Y VARIABLES
// =============================
// Variable para almacenar los personajes en memoria (optimización)
let personajesEnCache = null;

// URL del endpoint de la API Rick & Morty para los primeros 10 personajes + Pickle Rick (ID 265)
const URL_API = "https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10,265";

// Obtener personajes (solo la primera vez)
// =============================
// FUNCIÓN: Obtener personajes de la API
// =============================
// Esta función consulta la API solo la primera vez y luego usa los datos en memoria.
// Se asocia con las funciones de mostrar lista, agrupación y ficha individual.
async function obtenerPersonajes() {
    if (personajesEnCache) return personajesEnCache;
    const respuesta = await fetch(URL_API);
    const datos = await respuesta.json();
    // Verifica si la respuesta es un array o un objeto con .results
    if (Array.isArray(datos)) {
        personajesEnCache = datos;
    } else if (Array.isArray(datos.results)) {
        personajesEnCache = datos.results;
    } else if (datos.id) {
        // Si la respuesta es un solo personaje
        personajesEnCache = [datos];
    } else {
        personajesEnCache = [];
    }
    console.log("Personajes cargados:", personajesEnCache);
    return personajesEnCache;
}

// Mostrar lista de personajes
// =============================
// FUNCIÓN: Mostrar lista de personajes
// =============================
// Muestra en el HTML la lista de los 10 personajes con sus atributos principales.
// Se asocia con el botón "Obtener lista de personajes" en index.html y el div #output.
async function mostrarLista() {
    const personajes = await obtenerPersonajes();
    const salida = document.getElementById("salida");
    salida.innerHTML = "<h2>Lista de personajes</h2>";
    salida.innerHTML += "<ul class='lista-personajes'>" +
        personajes.map(personaje => `<li>ID: ${personaje.id} - Nombre: ${personaje.name} - Especie: ${personaje.species}</li>`).join("") +
        "</ul>";
}

// Agrupar por especie
// =============================
// FUNCIÓN: Agrupar personajes por especie
// =============================
// Agrupa y muestra los personajes por especie en el HTML.
// Se asocia con el botón "Agrupar por especie" en index.html y el div #grouped.
async function mostrarAgrupados() {
    const personajes = await obtenerPersonajes();
    const agrupados = personajes.reduce((acumulador, personaje) => {
        acumulador[personaje.species] = acumulador[personaje.species] || [];
        acumulador[personaje.species].push(personaje);
        return acumulador;
    }, {});
    const contenedor = document.getElementById("agrupados");
    contenedor.innerHTML = "<h2>Agrupación por especie</h2>";
    Object.keys(agrupados).sort((a, b) => a.localeCompare(b)).forEach(especie => {
        contenedor.innerHTML += `<div class='grupo-especie'><span class='titulo-especie'>${especie}</span><ul class='lista-personajes'>` +
            agrupados[especie].map(personaje => `<li>${personaje.name} (ID: ${personaje.id})</li>`).join("") +
            "</ul></div>";
    });
}

// Mostrar ficha individual
// =============================
// FUNCIÓN: Mostrar ficha individual tipo carta coleccionable
// =============================
// Muestra una carta coleccionable con información ampliada del personaje seleccionado.
// Se asocia con el input #character-id, el botón "Ver ficha personaje" y el div #character-detail en index.html.
async function mostrarDetalle() {
    const id = Number.parseInt(document.getElementById("personaje-id").value);
    // Permitir IDs del 1 al 10 y el 265 (Pickle Rick)
    if (!id || (id < 1 || (id > 10 && id !== 265))) {
        alert("Ingresa un ID válido entre 1 y 10, o 265 para Pickle Rick");
        return;
    }
    const personajes = await obtenerPersonajes();
    const personaje = personajes.find(p => p.id === id);
    if (!personaje) {
        alert("Personaje no encontrado");
        return;
    }
    const detalle = document.getElementById("detalle-personaje");
    detalle.innerHTML = `
        <h2>Carta Coleccionable</h2>
        <div class='carta-coleccionable'>
            <div class='cabecera-carta'>
                <span class='titulo-carta'>${personaje.name}</span>
                <span class='id-carta'>#${personaje.id}</span>
            </div>
            <img class='img-carta' src='${personaje.image}' alt='${personaje.name}'>
            <div class='cuerpo-carta'>
                <p><strong>Especie:</strong> ${personaje.species}</p>
                <p><strong>Estado:</strong> ${personaje.status}</p>
                <p><strong>Género:</strong> ${personaje.gender}</p>
                <p><strong>Origen:</strong> ${personaje.origin.name}</p>
                <p><strong>Ubicación actual:</strong> ${personaje.location.name}</p>
                <p><strong>Episodios:</strong> ${personaje.episode.length}</p>
            </div>
            <div class='pie-carta'>
                <span class='creado-carta'>Creado: ${new Date(personaje.created).toLocaleDateString()}</span>
            </div>
        </div>`;
}

// Eventos
// =============================
// ASOCIACIÓN DE EVENTOS CON BOTONES DEL HTML
// =============================
// Asocia los botones y el input del HTML con las funciones JS correspondientes.
window.onload = () => {
    document.getElementById("btn-lista").onclick = mostrarLista;
    document.getElementById("btn-agrupados").onclick = mostrarAgrupados;
    document.getElementById("btn-detalle").onclick = mostrarDetalle;
};
