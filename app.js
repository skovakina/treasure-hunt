const BOARD_SIZE = 10;
const GEM_COUNT = 5;
const TIMER = 30;

let timeLeft = TIMER;
let timerInterval;
let isPaused = false;
let gemPositions = [];
let totalScore = 0;
let gemsFound = 0;
const cells = [];

// Offsets for hint positions
const OFFSET = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const board = document.querySelector(".game-board");
const startButton = document.querySelector(".start-btn");
const timerValue = document.querySelector(".timer-value");
const pauseButton = document.querySelector(".pause-btn");
const scoreEl = document.querySelector(".score-value");
const gemEl = document.querySelector(".gem-found");
const congratulationsEl = document.querySelector(".congratulations");
const gameOverEl = document.querySelectorAll(".game-over");
const gameOverBtn = document.querySelectorAll(".game-over-btn");
const actions = document.querySelector(".game-actions-container");

gameOverEl.forEach((el) => el.classList.add("hidden"));

pauseButton.addEventListener("click", handlePause);
startButton.addEventListener("click", startGame);
gameOverBtn.forEach((btn) => {
  btn.addEventListener("click", startGame);
});

function getGemsPositions() {
  while (gemPositions.length < GEM_COUNT) {
    const randomRow = Math.floor(Math.random() * BOARD_SIZE);
    const randomCol = Math.floor(Math.random() * BOARD_SIZE);
    const position = `${randomRow}-${randomCol}`;
    if (!gemPositions.includes(position)) {
      gemPositions.push(position);
    }
  }
}

function getHintsPositions() {
  const hintPosition = [];
  gemPositions.forEach((gem) => {
    const [gemRow, gemCol] = gem.split("-").map(Number);

    OFFSET.forEach((offset) => {
      const row = gemRow + offset[0];
      const col = gemCol + offset[1];
      const position = `${row}-${col}`;
      if (isValidPosition(row, col) && !gemPositions.includes(position)) {
        hintPosition.push(position);
      }
    });
  });
  return hintPosition;
}

function isValidPosition(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function createGrid() {
  gems = getGemsPositions();
  hints = getHintsPositions();

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = new Cell(row, col, onGemFound);
      cells.push(cell);
      if (gemPositions.includes(`${row}-${col}`)) {
        cell.setType("gem");
      }
      if (hints.includes(`${row}-${col}`)) {
        cell.setType("hint");
      }
    }
  }
}

function clearGrid() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

function startGame() {
  clearGrid();
  resetGameState();
  createGrid();

  cells.forEach((cell) => cell.setEnabled());

  gameOverEl.forEach((el) => el.classList.add("hidden"));
  congratulationsEl.classList.add("hidden");
  startButton.classList.add("hidden");

  startTime();
}

function resetGameState() {
  clearGrid();
  timeLeft = TIMER;
  timerValue.textContent = TIMER;
  gemPositions = [];
  totalScore = 0;
  gemsFound = 0;
  scoreEl.textContent = totalScore;
  gemEl.textContent = gemsFound;
  isPaused = false;
}

function startTime() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerValue.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
  playGame();
}

function handlePause() {
  if (isPaused) {
    isPaused = false;
    startTime();
    cells.forEach((cell) => cell.setEnabled());
    pauseButton.style.backgroundImage = "url('./assets/icons/icon-pause.png')";
  } else {
    clearInterval(timerInterval);
    isPaused = true;
    cells.forEach((cell) => cell.setDisabled());
    pauseButton.style.backgroundImage = "url('./assets/icons/icon-play-s.png')";
  }
}

function playGame() {
  actions.classList.remove("hidden");
}

function initialize() {
  actions.classList.add("hidden");
  createGrid();
}

function onGemFound() {
  totalScore += 100;
  scoreEl.textContent = totalScore;
  gemsFound++;
  gemEl.textContent = gemsFound;
  if (gemsFound === GEM_COUNT && timeLeft > 0) {
    clearInterval(timerInterval);
    congratulationsEl.classList.remove("hidden");
  }
  if (timeLeft === 0) {
    clearInterval(timerInterval);
    gameOverEl.classList.remove("hidden");
  }
}

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
    this.element.classList.add("cell");

    this.element.addEventListener("click", () => {
      this.reveal();
    });

    board.appendChild(this.element);
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
  }

  setEnabled() {
    this.isDisabled = false;
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

initialize();
