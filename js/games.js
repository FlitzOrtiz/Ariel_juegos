import { formatTime, getGameName } from "./utils.js";
import { startImageWordGame } from "./image-word.js";
import { startClassificationGame } from "./classification.js";
import { startSentenceGame } from "./sentence.js";

// Variables globales de estado del juego
export let currentGame = null;
export let currentLevel = 0;
export let correctAnswers = 0;
export let startTime = null;

//setters
export function setCurrentGame(game) {
  currentGame = game;
}
export function setCurrentLevel(level) {
  currentLevel = level;
}
export function setCorrectAnswers(count) {
  correctAnswers = count;
}
export function setStartTime(time) {
  startTime = time;
}

// Referencias globales a elementos DOM
export const postureModal = document.getElementById("postureModal");
export const homePage = document.getElementById("homePage");
export const gamePages = document.getElementById("gamePages");
export const game1Container = document.getElementById("game1Container");
export const game2Container = document.getElementById("game2Container");
export const game3Container = document.getElementById("game3Container");

// Obtener datos del juego desde JSON embebido
export const gameData = {
  imageWordAssociation: [
    {
      id: 1,
      image: "🧤",
      correctWord: "Frío",
      options: ["Frío", "Zapato", "Metal"],
    },
    {
      id: 2,
      image: "🐶",
      correctWord: "Mascota",
      options: ["Mascota", "Caballo", "Oreja"],
    },
    {
      id: 3,
      image: "🚿",
      correctWord: "Baño",
      options: ["Baño", "Lavadora", "Taza"],
    },
    {
      id: 4,
      image: "🧊",
      correctWord: "Frío",
      options: ["Frío", "Agua", "Nube"],
    },
    {
      id: 5,
      image: "🎒",
      correctWord: "Escuela",
      options: ["Escuela", "Dormitorio", "Televisor"],
    },
  ],
  classificationGroups: [
    {
      id: 1,
      title: "Clasificación por tipos de comida",
      groups: ["Frutas", "Verduras", "Proteínas"],
      items: [
        { id: 1, name: "Manzana", group: "Frutas", image: "🍎" },
        { id: 2, name: "Pollo", group: "Proteínas", image: "🍗" },
        { id: 3, name: "Brócoli", group: "Verduras", image: "🥦" },
        { id: 4, name: "Carne", group: "Proteínas", image: "🥩" },
        { id: 5, name: "Queso", group: "Proteínas", image: "🧀" },
        { id: 6, name: "Plátano", group: "Frutas", image: "🍌" },
      ],
    },
    {
      id: 2,
      title: "Clasificación por lugares de uso",
      groups: ["Baño", "Cocina", "Escuela"],
      items: [
        { id: 1, name: "Cepillo de dientes", group: "Baño", image: "🪥" },
        { id: 2, name: "Plato", group: "Cocina", image: "🍽️" },
        { id: 3, name: "Libro", group: "Escuela", image: "📚" },
        { id: 4, name: "Ducha", group: "Baño", image: "🚿" }, // ← emoji de ducha
        { id: 5, name: "Jabón", group: "Baño", image: "🧼" },
        { id: 6, name: "Lápiz", group: "Escuela", image: "✏️" },
      ],
    },
    {
      id: 3,
      title: "Clasificación por tipo de ropa según uso o clima",
      groups: [
        "Ropa para clima frío",
        "Ropa para clima cálido",
        "Ropa para hacer deporte",
      ],
      items: [
        { id: 1, name: "Abrigo", group: "Ropa para clima frío", image: "🧥" },
        {
          id: 2,
          name: "Sombrero",
          group: "Ropa para clima cálido",
          image: "👒",
        },
        {
          id: 3,
          name: "Pantaloneta",
          group: "Ropa para clima cálido",
          image: "🩳",
        },
        { id: 4, name: "Guantes", group: "Ropa para clima frío", image: "🧤" },
        {
          id: 5,
          name: "Camiseta",
          group: "Ropa para clima cálido",
          image: "👕",
        },
        {
          id: 6,
          name: "Ropa deportiva",
          group: "Ropa para hacer deporte",
          image: "🎽",
        },
      ],
    },
  ],
  sentenceOrdering: [
    {
      id: 1,
      sentence: "El niño jugó en el parque grande",
      words: ["El", "niño", "jugó", "en", "el", "parque", "grande"],
    },
    {
      id: 2,
      sentence: "Ella lloró porque perdió su muñeca",
      words: ["Ella", "lloró", "porque", "perdió", "su", "muñeca"],
    },
    {
      id: 3,
      sentence: "Después de comer hizo su tarea",
      words: ["Después", "de", "comer", "hizo", "su", "tarea"],
    },
    {
      id: 4,
      sentence: "El perro juega con su pelota roja",
      words: ["El", "perro", "juega", "con", "su", "pelota", "roja"],
    },
    {
      id: 5,
      sentence: "Su hermano montó muy rápido en bicicleta",
      words: ["Su", "hermano", "montó", "muy", "rápido", "en", "bicicleta"],
    },
  ],
};

// Iniciar temporizador del juego
export function startGameTimer() {
  const timerElement = document.getElementById("timer");
  if (!timerElement) return;

  let seconds = 0;
  timerElement.textContent = "00:00";

  const timer = setInterval(() => {
    seconds++;
    timerElement.textContent = formatTime(seconds);

    // Detener el temporizador si se sale del juego
    if (!gamePages || gamePages.classList.contains("hidden")) {
      clearInterval(timer);
    }
  }, 1000);
}

// Mostrar resultados del juego
export function showGameResults() {
  const endTime = new Date();
  const timeSpent = Math.floor((endTime - startTime) / 1000);

  // Validar que currentGame y gameData[currentGame] existan y sean un array
  let totalLevels = 0;
  if (
    currentGame &&
    gameData[currentGame] &&
    Array.isArray(gameData[currentGame])
  ) {
    totalLevels = gameData[currentGame].length;
  } else {
    totalLevels = 1; // fallback para evitar división por cero
  }
  const accuracy = Math.round((correctAnswers / totalLevels) * 100);

  // Ocultar los contenedores de juegos
  if (game1Container) game1Container.classList.add("hidden");
  if (game2Container) game2Container.classList.add("hidden");
  if (game3Container) game3Container.classList.add("hidden");

  // Mostrar el contenedor de resultados (debe existir en tu HTML)
  let resultsContainer = document.getElementById("resultsContainer");
  if (!resultsContainer) {
    resultsContainer = document.createElement("div");
    resultsContainer.id = "resultsContainer";
    gamePages.appendChild(resultsContainer);
  }
  resultsContainer.classList.remove("hidden");

  resultsContainer.innerHTML = `
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
      <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-3xl font-bold text-gray-800 mb-4">¡Juego Completado!</h2>
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-2xl font-bold text-blue-600">${correctAnswers}/${totalLevels}</div>
          <div class="text-gray-600">Niveles completados</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600">${accuracy}%</div>
          <div class="text-gray-600">Precisión</div>
        </div>
        <div class="bg-amber-50 rounded-lg p-4">
          <div class="text-2xl font-bold text-amber-600">${formatTime(
            timeSpent
          )}</div>
          <div class="text-gray-600">Tiempo total</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-4">
          <div class="text-2xl font-bold text-purple-600">${getGameName(
            currentGame
          )}</div>
          <div class="text-gray-600">Juego</div>
        </div>
      </div>
      <div class="flex justify-center gap-4">
        <button id="playAgainBtn" class="bg-primary hover:bg-indigo-700 text-white py-3 px-8 rounded-lg transition font-medium">
          Jugar otra vez
        </button>
        <button id="backHomeBtn" class="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 px-8 rounded-lg transition font-medium">
          Volver al inicio
        </button>
      </div>
    </div>
  `;

  // Configurar botones
  document.getElementById("playAgainBtn").addEventListener("click", () => {
    // Ocultar resultados antes de reiniciar
    resultsContainer.classList.add("hidden");
    // Reiniciar el mismo juego
    console.log(`Reiniciando juego: ${currentGame}`);
    switch (currentGame) {
      case "imageWordAssociation":
        startImageWordGame();
        break;
      case "classification":
        startClassificationGame();
        break;
      case "sentenceOrdering":
        startSentenceGame();
        break;
    }
  });
  document.getElementById("backHomeBtn").addEventListener("click", () => {
    resultsContainer.classList.add("hidden");
    showHomePage();
  });
}

// Mostrar página de inicio
export function showHomePage() {
  console.log(`Volviendo a la página de inicio desde el juego: ${currentGame}`);

  homePage.classList.remove("hidden");
  gamePages.classList.add("hidden");
  currentGame = null;
  document.getElementById("mainNav").classList.add("hidden");
}

// Recordatorio de postura
export function startPostureReminder() {
  setInterval(() => {
    postureModal.classList.remove("hidden");
  }, 2 * 60 * 1000); // 2 minutos
}

// Cerrar modal de postura
export function closePostureModal() {
  postureModal.classList.add("hidden");
}
