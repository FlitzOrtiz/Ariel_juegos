// Función para barajar array (Fisher-Yates)
export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Función para formatear tiempo
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

// Función para obtener nombre del juego
export function getGameName(gameType) {
  switch (gameType) {
    case "imageWordAssociation":
      return "Asociación";
    case "classificationGroups":
      return "Clasificación";
    case "sentenceOrdering":
      return "Ordenar Frases";
    default:
      return "";
  }
}

// Configuración de eventos de arrastrar y soltar
export function setupDragAndDrop(draggables, dropZones) {
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
    draggable.addEventListener("dragend", dragEnd);
  });

  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("dragenter", dragEnter);
    zone.addEventListener("dragleave", dragLeave);
    zone.addEventListener("drop", dragDrop);
  });

  function dragStart(e) {
    e.dataTransfer.setData(
      "text/plain",
      e.target.dataset.id || e.target.dataset.word
    );
    setTimeout(() => {
      e.target.classList.add("opacity-30");
    }, 0);
  }

  function dragEnd(e) {
    e.target.classList.remove("opacity-30");
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
    this.classList.add("drag-over");
  }

  function dragLeave() {
    this.classList.remove("drag-over");
  }

  function dragDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");

    const id = e.dataTransfer.getData("text/plain");
    let draggable;

    // Intentar encontrar por data-id o data-word
    draggable = document.querySelector(`[data-id="${id}"]`);
    if (!draggable) {
      draggable = document.querySelector(`[data-word="${id}"]`);
    }

    if (!draggable) return;

    // Comprobar si el elemento ya está en un grupo
    if (draggable.parentElement.classList.contains("drop-zone")) {
      // Busca el primer hijo con clase que contenga 'min-h-' (tailwind)
      const container = Array.from(draggable.parentElement.children).find(
        (el) => el.className && el.className.includes("min-h-")
      );
      if (container) {
        container.removeChild(draggable);
      }
    }

    // Añadir el elemento al grupo
    // Busca el primer hijo con clase que contenga 'min-h-' (tailwind)
    const targetContainer = Array.from(this.children).find(
      (el) => el.className && el.className.includes("min-h-")
    );
    if (targetContainer) {
      targetContainer.appendChild(draggable);
    }
  }
}
