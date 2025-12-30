// =============================
// CONFIGURACIÓN Y VARIABLES
// =============================
// Variable para almacenar los personajes en memoria (optimización)
let cachedCharacters = null;

// URL del endpoint de la API Rick & Morty para los primeros 10 personajes + Pickle Rick (ID 265)
const API_URL = "https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10,265";

// Obtener personajes (solo la primera vez)
// =============================
// FUNCIÓN: Obtener personajes de la API
// =============================
// Esta función consulta la API solo la primera vez y luego usa los datos en memoria.
// Se asocia con las funciones de mostrar lista, agrupación y ficha individual.
async function fetchCharacters() {
    if (cachedCharacters) return cachedCharacters;
    const res = await fetch(API_URL);
    const data = await res.json();
    // Verifica si la respuesta es un array o un objeto con .results
    if (Array.isArray(data)) {
        cachedCharacters = data;
    } else if (Array.isArray(data.results)) {
        cachedCharacters = data.results;
    } else if (data.id) {
        // Si la respuesta es un solo personaje
        cachedCharacters = [data];
    } else {
        cachedCharacters = [];
    }
    console.log("Personajes cargados:", cachedCharacters);
    return cachedCharacters;
}

// Mostrar lista de personajes
// =============================
// FUNCIÓN: Mostrar lista de personajes
// =============================
// Muestra en el HTML la lista de los 10 personajes con sus atributos principales.
// Se asocia con el botón "Obtener lista de personajes" en index.html y el div #output.
async function showList() {
    const characters = await fetchCharacters();
    const output = document.getElementById("output");
    output.innerHTML = "<h2>Lista de personajes</h2>";
    output.innerHTML += "<ul class='character-list'>" +
        characters.map(c => `<li>ID: ${c.id} - Nombre: ${c.name} - Especie: ${c.species}</li>`).join("") +
        "</ul>";
}

// Agrupar por especie
// =============================
// FUNCIÓN: Agrupar personajes por especie
// =============================
// Agrupa y muestra los personajes por especie en el HTML.
// Se asocia con el botón "Agrupar por especie" en index.html y el div #grouped.
async function showGrouped() {
    const characters = await fetchCharacters();
    const grouped = characters.reduce((acc, c) => {
        acc[c.species] = acc[c.species] || [];
        acc[c.species].push(c);
        return acc;
    }, {});
    const container = document.getElementById("grouped");
    container.innerHTML = "<h2>Agrupación por especie</h2>";
    Object.keys(grouped).sort().forEach(species => {
        container.innerHTML += `<div class='species-group'><span class='species-title'>${species}</span><ul class='character-list'>` +
            grouped[species].map(c => `<li>${c.name} (ID: ${c.id})</li>`).join("") +
            "</ul></div>";
    });
}

// Mostrar ficha individual
// =============================
// FUNCIÓN: Mostrar ficha individual tipo carta coleccionable
// =============================
// Muestra una carta coleccionable con información ampliada del personaje seleccionado.
// Se asocia con el input #character-id, el botón "Ver ficha personaje" y el div #character-detail en index.html.
async function showDetail() {
    const id = parseInt(document.getElementById("character-id").value);
    // Permitir IDs del 1 al 10 y el 265 (Pickle Rick)
    if (!id || (id < 1 || (id > 10 && id !== 265))) {
        alert("Ingresa un ID válido entre 1 y 10, o 265 para Pickle Rick");
        return;
    }
    const characters = await fetchCharacters();
    const character = characters.find(c => c.id === id);
    if (!character) {
        alert("Personaje no encontrado");
        return;
    }
    const detail = document.getElementById("character-detail");
    detail.innerHTML = `
        <h2>Carta Coleccionable</h2>
        <div class='collectible-card'>
            <div class='card-header'>
                <span class='card-title'>${character.name}</span>
                <span class='card-id'>#${character.id}</span>
            </div>
            <img class='card-img' src='${character.image}' alt='${character.name}'>
            <div class='card-body'>
                <p><strong>Especie:</strong> ${character.species}</p>
                <p><strong>Estado:</strong> ${character.status}</p>
                <p><strong>Género:</strong> ${character.gender}</p>
                <p><strong>Origen:</strong> ${character.origin.name}</p>
                <p><strong>Ubicación actual:</strong> ${character.location.name}</p>
                <p><strong>Episodios:</strong> ${character.episode.length}</p>
            </div>
            <div class='card-footer'>
                <span class='card-created'>Creado: ${new Date(character.created).toLocaleDateString()}</span>
            </div>
        </div>`;
}

// Eventos
// =============================
// ASOCIACIÓN DE EVENTOS CON BOTONES DEL HTML
// =============================
// Asocia los botones y el input del HTML con las funciones JS correspondientes.
window.onload = () => {
    document.getElementById("btn-list").onclick = showList;
    document.getElementById("btn-group").onclick = showGrouped;
    document.getElementById("btn-detail").onclick = showDetail;
};
