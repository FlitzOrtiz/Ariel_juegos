import {
  setCorrectAnswers,
  setCurrentGame,
  setCurrentLevel,
  setStartTime,
  currentGame,
  currentLevel,
  correctAnswers,
  startTime,
  gameData,
  showGameResults,
  startGameTimer,
  showHomePage,
  game1Container,
  game2Container,
  game3Container,
  homePage,
  gamePages,
} from "./games.js";
import { setupDragAndDrop } from "./utils.js";

export function startClassificationGame() {
  console.log("Iniciando juego de clasificación");
  setCurrentGame("classification");
  setCurrentLevel(0);
  setCorrectAnswers(0);
  setStartTime(new Date());

  homePage.classList.add("hidden");
  gamePages.classList.remove("hidden");
  game1Container.classList.add("hidden");
  game2Container.classList.remove("hidden");
  game3Container.classList.add("hidden");

  loadClassificationLevel();
}

export function loadClassificationLevel() {
  const level = gameData.classificationGroups[currentLevel];
  const shuffledItems = [...level.items]; // Usamos utils.shuffleArray si queremos barajar

  game2Container.innerHTML = `
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <button id="backToHomeclassification" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
        <div class="text-lg font-medium">
          Nivel ${currentLevel + 1} de ${gameData.classificationGroups.length}
        </div>
      </div>
      
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800">${level.title}</h2>
        <p class="text-gray-600 mt-2">Arrastra los elementos a la categoría correcta</p>
      </div>
      
      <!-- Items arriba -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-4">
        <div class="flex flex-wrap gap-4 justify-center items-start" id="itemsContainer">
          ${shuffledItems
            .map(
              (item) => `
              <div class="drag-item bg-indigo-100 border border-indigo-200 rounded-lg py-3 px-4 text-center font-medium text-indigo-800 cursor-move flex flex-col items-center min-w-[120px] min-h-[80px] max-w-[140px] max-h-[110px] w-auto" draggable="true" data-id="${item.id}" data-group="${item.group}">
                <span class="text-4xl mb-2">${item.image || ""}</span>
                <span class="truncate">${item.name}</span>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
      <!-- Grupos abajo -->
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        ${level.groups
          .map(
            (group) => `
            <div class="drop-zone flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col min-h-[140px] justify-start items-center" data-group="${group}">
              <h3 class="text-lg font-bold text-center mb-3 text-gray-700">${group}</h3>
              <div class="min-h-[100px] flex flex-wrap gap-2 flex-1 w-full justify-center" id="group-${group}"></div>
            </div>
          `
          )
          .join("")}
      </div>
      
      <div class="flex justify-between items-center">
        <div class="text-gray-600">
          Elementos clasificados: <span id="classifiedCount">0</span>/${level.items.length}
        </div>
        <button id="checkClassification" class="bg-primary hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition disabled:opacity-50" disabled>
          Comprobar
        </button>
      </div>
    </div>
  `;

  // Configurar eventos de arrastrar y soltar
  const draggables = document.querySelectorAll(".drag-item");
  const dropZones = document.querySelectorAll(".drop-zone");
  setupDragAndDrop(draggables, dropZones);

  // IMPORTANTE:
  // Si usas innerHTML para actualizar el DOM, los elementos previos se eliminan y se crean nuevos,
  // por eso debes volver a asignar los eventos cada vez que llamas loadClassificationLevel().
  // No se "borra" el evento, simplemente el botón anterior ya no existe, es uno nuevo.

  document
    .getElementById("backToHomeclassification")
    .addEventListener("click", showHomePage);
  document
    .getElementById("checkClassification")
    .addEventListener("click", checkClassification);

  // Iniciar temporizador
  startGameTimer();

  // Actualizar contador cuando se arrastra un elemento
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragend", updateClassificationCount);
  });
}

function updateClassificationCount() {
  const level = gameData.classificationGroups[currentLevel];
  const totalItems = level.items.length;
  const classifiedItems = document.querySelectorAll(
    ".drop-zone .drag-item"
  ).length;
  const checkButton = document.getElementById("checkClassification");

  document.getElementById("classifiedCount").textContent = classifiedItems;
  checkButton.disabled = classifiedItems !== totalItems;
}

function checkClassification() {
  const level = gameData.classificationGroups[currentLevel];
  const itemsInGroups = document.querySelectorAll(".drop-zone .drag-item");
  let allCorrect = true;

  itemsInGroups.forEach((item) => {
    const group = item.closest(".drop-zone").dataset.group;
    const correctGroup = level.items.find((i) => i.id == item.dataset.id).group;

    if (group === correctGroup) {
      item.classList.add("bg-green-200", "border-green-400");
    } else {
      item.classList.add("bg-red-200", "border-red-400", "shake");
      allCorrect = false;
    }
  });

  // Deshabilitar arrastrar después de comprobar
  document.querySelectorAll(".drag-item").forEach((item) => {
    item.setAttribute("draggable", "false");
  });

  // Deshabilitar el botón de comprobar
  document.getElementById("checkClassification").disabled = true;

  // Avanzar al siguiente nivel después de un breve retraso
  setTimeout(() => {
    if (allCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setCurrentLevel(currentLevel + 1);
    if (currentLevel < gameData.classificationGroups.length) {
      loadClassificationLevel();
    } else {
      showGameResults();
    }
  }, 2000);
}
