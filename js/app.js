import {
  showHomePage,
  startPostureReminder,
  closePostureModal,
} from "./games.js";
import { startImageWordGame } from "./image-word.js";
import { startClassificationGame } from "./classification.js";
import { startSentenceGame } from "./sentence.js";

// Referencias a elementos DOM
const game1Btn = document.getElementById("game1Btn");
const game2Btn = document.getElementById("game2Btn");
const game3Btn = document.getElementById("game3Btn");
const homeBtn = document.getElementById("homeBtn");
const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const closeModalBtn = document.getElementById("closeModalBtn");

// Inicializar el sistema
function init() {
  setupEventListeners();
  startPostureReminder();
}

// Configurar event listeners
function setupEventListeners() {
  // Navegación
  game1Btn.addEventListener("click", startImageWordGame);
  game2Btn.addEventListener("click", startClassificationGame);
  game3Btn.addEventListener("click", startSentenceGame);
  homeBtn.addEventListener("click", showHomePage);
  closeModalBtn.addEventListener("click", closePostureModal);
  menuBtn.addEventListener("click", toggleMobileMenu);
}

// Alternar menú móvil
function toggleMobileMenu() {
  mainNav.classList.toggle("hidden");
}

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", init);
