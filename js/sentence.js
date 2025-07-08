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
import { shuffleArray } from "./utils.js";

export function startSentenceGame() {
  setCurrentGame("sentenceOrdering");
  setCurrentLevel(0);
  setCorrectAnswers(0);
  setStartTime(new Date());

  homePage.classList.add("hidden");
  gamePages.classList.remove("hidden");
  game1Container.classList.add("hidden");
  game2Container.classList.add("hidden");
  game3Container.classList.remove("hidden");

  loadSentenceLevel();
}

export function loadSentenceLevel() {
  const level = gameData.sentenceOrdering[currentLevel];
  const shuffledWords = shuffleArray([...level.words]);

  game3Container.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-6">
                <button id="backToHomesentences" class="flex items-center text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </button>
                <div class="text-lg font-medium">
                    Nivel ${currentLevel + 1} de ${
    gameData.sentenceOrdering.length
  }
                </div>
            </div>
            
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800">Ordena las palabras para formar una frase</h2>
                <p class="text-gray-600 mt-2">Arrastra las palabras para colocarlas en el orden correcto</p>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <!-- Área de palabras ordenadas -->
                <div class="drop-zone border-2 border-dashed border-gray-300 rounded-xl min-h-[100px] p-4 mb-6 flex flex-wrap gap-2" id="sentenceContainer"></div>
                
                <!-- Palabras disponibles -->
                <div class="flex flex-wrap gap-2" id="wordsContainer">
                    ${shuffledWords
                      .map(
                        (word) => `
                        <div class="drag-item bg-amber-100 border border-amber-200 rounded-lg py-2 px-4 font-medium text-amber-800 cursor-move" draggable="true" data-word="${word}">
                            ${word}
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="flex justify-between items-center">
                <div class="text-gray-600">
                    Palabras colocadas: <span id="placedCount">0</span>/${
                      level.words.length
                    }
                </div>
                <button id="checkSentence" class="bg-primary hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition disabled:opacity-50" disabled>
                    Comprobar
                </button>
            </div>
        </div>
    `;

  // Siempre elimina primero los posibles listeners antiguos antes de agregar uno nuevo
  const backToHomeBtn = document.getElementById("backToHomesentences");
  if (backToHomeBtn) {
    // Elimina todos los listeners previos (clonando el nodo)
    const newBtn = backToHomeBtn.cloneNode(true);
    backToHomeBtn.parentNode.replaceChild(newBtn, backToHomeBtn);
    newBtn.addEventListener("click", showHomePage);
  }

  const checkSentenceBtn = document.getElementById("checkSentence");
  if (checkSentenceBtn) {
    const newCheckBtn = checkSentenceBtn.cloneNode(true);
    checkSentenceBtn.parentNode.replaceChild(newCheckBtn, checkSentenceBtn);
    newCheckBtn.addEventListener("click", checkSentenceOrder);
  }

  // Llama a la función para habilitar drag and drop
  setupSentenceDragAndDrop();

  // Iniciar temporizador
  startGameTimer();
}

function setupSentenceDragAndDrop() {
  const draggables = document.querySelectorAll(".drag-item");
  const dropZone = document.getElementById("sentenceContainer");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
    draggable.addEventListener("dragend", dragEnd);
  });

  dropZone.addEventListener("dragover", dragOverZone);
  dropZone.addEventListener("drop", dropOnZone);

  function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.word);
    setTimeout(() => {
      e.target.classList.add("opacity-30");
    }, 0);
    dropZone.draggedElement = e.target;
  }

  function dragEnd(e) {
    e.target.classList.remove("opacity-30");
    dropZone.draggedElement = null;
  }

  // Permite arrastrar sobre el dropZone y calcula la posición de inserción
  function dragOverZone(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(dropZone, e.clientX, e.clientY);
    const dragged = dropZone.draggedElement;
    if (!dragged) return;
    if (afterElement == null) {
      dropZone.appendChild(dragged);
    } else if (afterElement !== dragged) {
      dropZone.insertBefore(dragged, afterElement);
    }
  }

  // Al soltar, si viene del banco de palabras, clónalo y ponlo en la posición correcta
  function dropOnZone(e) {
    e.preventDefault();
    const word = e.dataTransfer.getData("text/plain");
    const dragged = dropZone.draggedElement;
    const fromBank = dragged && dragged.parentElement !== dropZone;
    const afterElement = getDragAfterElement(dropZone, e.clientX, e.clientY);

    if (fromBank) {
      // Clonar y agregar eventos
      const clone = dragged.cloneNode(true);
      clone.classList.add("cursor-pointer");
      clone.setAttribute("draggable", "true");
      clone.addEventListener("click", () => {
        dropZone.removeChild(clone);
        dragged.classList.remove("hidden");
        updateSentenceCount();
      });
      // Eventos drag para el clon
      clone.addEventListener("dragstart", dragStart);
      clone.addEventListener("dragend", dragEnd);

      // Ocultar el original
      dragged.classList.add("hidden");

      // Insertar en la posición correcta
      if (afterElement == null) {
        dropZone.appendChild(clone);
      } else {
        dropZone.insertBefore(clone, afterElement);
      }
    }
    updateSentenceCount();
  }

  // Utilidad para encontrar el elemento después del cual insertar
  function getDragAfterElement(container, x, y) {
    const draggableElements = [
      ...container.querySelectorAll(".drag-item:not(.opacity-30)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        // Usar horizontal si flex-row, vertical si flex-col/flex-wrap
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}

function updateSentenceCount() {
  const totalWords = gameData.sentenceOrdering[currentLevel].words.length;
  const placedWords =
    document.getElementById("sentenceContainer").children.length;
  const checkButton = document.getElementById("checkSentence");

  document.getElementById("placedCount").textContent = placedWords;
  checkButton.disabled = placedWords !== totalWords;
}

function checkSentenceOrder() {
  const level = gameData.sentenceOrdering[currentLevel];
  const sentenceContainer = document.getElementById("sentenceContainer");
  // Elimina espacios y saltos de línea extra de cada palabra
  const userSentence = Array.from(sentenceContainer.children)
    .map((word) => word.textContent.trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const correctSentence = level.sentence.trim();

  // Deshabilitar el botón de comprobar
  document.getElementById("checkSentence").disabled = true;

  // Comprobar si la frase es correcta
  console.log(`Frase del usuario: "${userSentence}"`);
  console.log(`Frase correcta: "${correctSentence}"`);

  if (userSentence === correctSentence) {
    sentenceContainer.classList.add("bg-green-50", "border-green-300");
    // Puntaje según intento
    if (currentLevel <= 2) {
      setCorrectAnswers(correctAnswers + 1);
    } else if (currentLevel <= 3) {
      setCorrectAnswers(correctAnswers + 0.5);
    }
    // Animación de celebración
    Array.from(sentenceContainer.children).forEach((word, index) => {
      setTimeout(() => {
        word.classList.add("bounce");
      }, index * 150);
    });

    // Avanzar al siguiente nivel después de un breve retraso
    setTimeout(() => {
      setCurrentLevel(currentLevel + 1);
      if (currentLevel < gameData.sentenceOrdering.length) {
        loadSentenceLevel();
      } else {
        showGameResults();
      }
    }, 2000);
  } else {
    sentenceContainer.classList.add("bg-red-50", "border-red-300", "shake");
    // Permitir reintentar: volver a habilitar el botón después de un breve retraso
    setTimeout(() => {
      document.getElementById("checkSentence").disabled = false;
      sentenceContainer.classList.remove(
        "bg-red-50",
        "border-red-300",
        "shake"
      );
    }, 1200);
  }
}
