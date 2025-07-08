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

export function startImageWordGame() {
  console.log("Iniciando juego de asociación de imagen y palabra");
  setCurrentGame("imageWordAssociation");
  setCurrentLevel(0);
  setCorrectAnswers(0);
  setStartTime(new Date());

  homePage.classList.add("hidden");
  gamePages.classList.remove("hidden");
  game1Container.classList.remove("hidden");
  game2Container.classList.add("hidden");
  game3Container.classList.add("hidden");

  loadImageWordLevel();
}

export function loadImageWordLevel() {
  const level = gameData.imageWordAssociation[currentLevel];

  game1Container.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-6">
                <button id="backToHome" class="flex items-center text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </button>
                <div class="text-lg font-medium">
                    Nivel ${currentLevel + 1} de ${
    gameData.imageWordAssociation.length
  }
                </div>
            </div>
            
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800">Asocia la imagen con la palabra correcta</h2>
                <p class="text-gray-600 mt-2">Selecciona la palabra que mejor describe la imagen</p>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <!-- Imagen -->
                    <div class="flex justify-center">
                        <div class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
                            ${level.image}
                        </div>
                    </div>
                    
                    <!-- Opciones -->
                    <div class="space-y-4">
                        ${level.options
                          .map(
                            (option, index) => `
                            <button class="word-card w-full bg-white border-2 border-gray-200 rounded-xl py-4 px-6 text-lg font-medium text-gray-800 hover:border-primary hover:bg-primary hover:text-white transition-colors duration-300" data-answer="${option}">
                                ${option}
                            </button>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            </div>
            
            <div class="flex justify-between items-center">
                <div class="text-gray-600">
                    Respuestas correctas: ${correctAnswers}/${currentLevel}
                </div>
                <div class="text-gray-600">
                    Tiempo: <span id="timer">00:00</span>
                </div>
            </div>
        </div>
    `;

  // Configurar evento de respuesta
  document.querySelectorAll(".word-card").forEach((button) => {
    button.addEventListener("click", checkImageWordAnswer);
  });

  // Configurar botón de volver
  console.log("Configurando evento de botón de volver");

  document.getElementById("backToHome").addEventListener("click", showHomePage);

  // Iniciar temporizador
  startGameTimer();
}

function checkImageWordAnswer(e) {
  const selectedAnswer = e.target.dataset.answer;
  const correctAnswer = gameData.imageWordAssociation[currentLevel].correctWord;
  const buttons = document.querySelectorAll(".word-card");

  // Deshabilitar todos los botones
  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.answer === correctAnswer) {
      btn.classList.add("bg-green-500", "border-green-500", "text-white");
    } else {
      btn.classList.add("opacity-50");
    }
  });

  // Resaltar selección del usuario
  if (selectedAnswer === correctAnswer) {
    e.target.classList.remove(
      "hover:border-primary",
      "hover:bg-primary",
      "hover:text-white"
    );
    e.target.classList.add("bg-green-500", "border-green-500", "text-white");
    setCorrectAnswers(correctAnswers + 1);
  } else {
    e.target.classList.add(
      "bg-red-500",
      "border-red-500",
      "text-white",
      "shake"
    );
  }

  // Avanzar al siguiente nivel después de un breve retraso
  setTimeout(() => {
    setCurrentLevel(currentLevel + 1);
    if (currentLevel < gameData.imageWordAssociation.length) {
      loadImageWordLevel();
    } else {
      showGameResults();
    }
  }, 1500);
}
