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
      image: "manzana",
      correctWord: "Manzana",
      options: ["Pera", "Manzana", "Plátano"],
    },
    {
      id: 2,
      image: "gato",
      correctWord: "Gato",
      options: ["Perro", "Gato", "Ratón"],
    },
    {
      id: 3,
      image: "casa",
      correctWord: "Casa",
      options: ["Edificio", "Casa", "Tienda"],
    },
    {
      id: 4,
      image: "sol",
      correctWord: "Sol",
      options: ["Luna", "Estrella", "Sol"],
    },
    {
      id: 5,
      image: "árbol",
      correctWord: "Árbol",
      options: ["Planta", "Árbol", "Flor"],
    },
  ],
  classificationGroups: [
    {
      id: 1,
      title: "Clasifica los animales",
      groups: ["Mamíferos", "Aves", "Reptiles"],
      items: [
        { id: 1, name: "León", group: "Mamíferos", image: "🦁" },
        { id: 2, name: "Águila", group: "Aves", image: "🦅" },
        { id: 3, name: "Serpiente", group: "Reptiles", image: "🐍" },
        { id: 4, name: "Elefante", group: "Mamíferos", image: "🐘" },
        { id: 5, name: "Cocodrilo", group: "Reptiles", image: "🐊" },
        { id: 6, name: "Colibrí", group: "Aves", image: "🐦" },
      ],
    },
    {
      id: 2,
      title: "Clasifica las frutas",
      groups: ["Cítricos", "Tropicales", "Bayas"],
      items: [
        { id: 1, name: "Naranja", group: "Cítricos", image: "🍊" },
        { id: 2, name: "Mango", group: "Tropicales", image: "🥭" },
        { id: 3, name: "Fresa", group: "Bayas", image: "🍓" },
        { id: 4, name: "Limón", group: "Cítricos", image: "🍋" },
        { id: 5, name: "Piña", group: "Tropicales", image: "🍍" },
        { id: 6, name: "Arándano", group: "Bayas", image: "🫐" },
      ],
    },
  ],
  sentenceOrdering: [
    {
      id: 1,
      sentence: "El gato duerme en el sofá",
      words: ["El", "gato", "duerme", "en", "el", "sofá"],
    },
    {
      id: 2,
      sentence: "Los niños juegan en el parque",
      words: ["Los", "niños", "juegan", "en", "el", "parque"],
    },
    {
      id: 3,
      sentence: "El sol brilla en el cielo",
      words: ["El", "sol", "brilla", "en", "el", "cielo"],
    },
    {
      id: 4,
      sentence: "La abuela cocina galletas deliciosas",
      words: ["La", "abuela", "cocina", "galletas", "deliciosas"],
    },
    {
      id: 5,
      sentence: "Estudiamos matemáticas en la escuela",
      words: ["Estudiamos", "matemáticas", "en", "la", "escuela"],
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
  }, 20 * 60 * 1000); // 20 minutos
}

// Cerrar modal de postura
export function closePostureModal() {
  postureModal.classList.add("hidden");
}
