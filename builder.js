const STORAGE_KEY = "portfolio_builder_blocks";
let draggedType = null;

const components = {
  heading: () => createEditableElement("h2", "New section heading"),
  paragraph: () => createEditableElement("p", "Write your paragraph here."),
  image: () => {
    const img = document.createElement("img");
    img.src = "https://via.placeholder.com/640x260?text=Your+Image";
    img.alt = "User added";
    img.className = "builder-image";
    img.title = "Double-click to edit image URL";
    img.addEventListener("dblclick", () => {
      const nextUrl = prompt("Enter image URL", img.src);
      if (nextUrl) {
        img.src = nextUrl;
        saveCanvas();
      }
    });
    return wrapBlock(img);
  },
  button: () => {
    const btn = document.createElement("a");
    btn.className = "btn primary";
    btn.href = "#";
    btn.textContent = "Click me";
    btn.contentEditable = true;
    return wrapBlock(btn);
  },
  divider: () => wrapBlock(document.createElement("hr")),
};

function createEditableElement(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  el.contentEditable = true;
  return wrapBlock(el);
}

function wrapBlock(innerElement) {
  const wrapper = document.createElement("div");
  wrapper.className = "canvas-block";
  wrapper.draggable = true;

  const controls = document.createElement("div");
  controls.className = "canvas-controls";

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.textContent = "Delete";
  delBtn.className = "btn small danger";
  delBtn.addEventListener("click", () => {
    wrapper.remove();
    saveCanvas();
  });

  controls.append(delBtn);
  wrapper.append(controls, innerElement);
  attachSortHandlers(wrapper);
  return wrapper;
}

function attachSortHandlers(block) {
  block.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/sort", "1");
    block.classList.add("dragging");
  });

  block.addEventListener("dragend", () => {
    block.classList.remove("dragging");
    saveCanvas();
  });
}

function saveCanvas() {
  localStorage.setItem(STORAGE_KEY, document.getElementById("dropZone").innerHTML);
}

function restoreCanvas() {
  const html = localStorage.getItem(STORAGE_KEY);
  if (!html) return;
  const zone = document.getElementById("dropZone");
  zone.innerHTML = html;

  zone.querySelectorAll(".canvas-block").forEach((block) => {
    attachSortHandlers(block);
    const delBtn = block.querySelector(".canvas-controls button");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        block.remove();
        saveCanvas();
      });
    }
  });

  zone.querySelectorAll("img.builder-image").forEach((img) => {
    img.addEventListener("dblclick", () => {
      const nextUrl = prompt("Enter image URL", img.src);
      if (nextUrl) {
        img.src = nextUrl;
        saveCanvas();
      }
    });
  });
}

function setupBuilder() {
  const draggableButtons = document.querySelectorAll("[data-type]");
  const dropZone = document.getElementById("dropZone");
  const clearCanvas = document.getElementById("clearCanvas");

  draggableButtons.forEach((btn) => {
    btn.addEventListener("dragstart", (event) => {
      draggedType = event.target.dataset.type;
      event.dataTransfer.setData("text/plain", draggedType);
    });
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(dropZone, event.clientY);
    const draggingBlock = document.querySelector(".dragging");

    if (draggingBlock) {
      if (afterElement == null) {
        dropZone.appendChild(draggingBlock);
      } else {
        dropZone.insertBefore(draggingBlock, afterElement);
      }
    }
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();

    const typeFromTransfer = event.dataTransfer.getData("text/plain");
    const type = typeFromTransfer || draggedType;

    if (type && components[type]) {
      const block = components[type]();
      dropZone.appendChild(block);
      saveCanvas();
    }

    draggedType = null;
  });

  clearCanvas.addEventListener("click", () => {
    dropZone.innerHTML = "";
    localStorage.removeItem(STORAGE_KEY);
  });

  restoreCanvas();
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".canvas-block:not(.dragging)")];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null },
  ).element;
}

setupBuilder();
