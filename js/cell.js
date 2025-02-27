class Cell {
  constructor(row, col, onGemFound) {
    this.row = row;
    this.col = col;
    this.position = `${row}-${col}`;
    this.type = "empty";
    this.isRevealed = false;
    this.isDisabled = true;
    this.onGemFound = onGemFound;
    this.element = document.createElement("div");
    this.element.style.backgroundImage = `url('./assets/tiles/tile-type-${this.getTileImage()}.png')`;
    this.element.classList.add("cell", "disabled");

    this.element.addEventListener("click", () => {
      this.reveal();
    });

    // board.appendChild(this.element);
  }
  setType(type) {
    if (type === "gem") {
      this.type = "gem";
    } else if (type === "hint") {
      this.type = "hint";
    }
  }

  getTileImage() {
    return Math.floor(Math.random() * 11);
  }

  setDisabled() {
    this.isDisabled = true;
    this.element.classList.add("disabled");
  }

  setEnabled() {
    this.isDisabled = false;
    this.element.classList.remove("disabled");
  }

  reveal() {
    if (this.isRevealed || this.isDisabled) return;
    this.isRevealed = true;

    if (this.type === "gem") {
      this.element.style.backgroundImage = "url('./assets/tiles/tile-gem.png')";
      this.onGemFound();
    } else if (this.type === "hint") {
      this.element.style.backgroundImage =
        "url('./assets/tiles/tile-bg-pink.png')";
    } else {
      this.element.style.backgroundImage =
        "url('./assets/tiles/tile-bg-1.png')";
    }
  }
}

export default Cell;
