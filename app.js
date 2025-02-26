const BOARD_SIZE = 5;
const GEM_COUNT = 1;
const TIMER = 10;

let level = 1;
let timeLeft = TIMER;
let boardSize = BOARD_SIZE;
let gemCount = GEM_COUNT;
let timerInterval;
let isPaused = false;
let totalScore = 0;
let gemsFound = 0;
let gemPositions = [];
let cells = [];
let currentScore = 0;

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
const gemTotalEl = document.querySelector(".gem-total");
const boardSizeEl = document.querySelector(".board-size-value");
const congratulationsEl = document.querySelector(".congratulations");
const youLostEl = document.querySelector(".you-lost");
const gameOverEl = document.querySelectorAll(".game-over");
const actions = document.querySelector(".game-actions-container");
const nextLevelBtn = document.querySelector(".next-level-btn");
const tryAgainBtn = document.querySelector(".try-again-btn");

gameOverEl.forEach((el) => hideElement(el));

pauseButton.addEventListener("click", handlePause);
startButton.addEventListener("click", startGame);
nextLevelBtn.addEventListener("click", handleLevelUp);
tryAgainBtn.addEventListener("click", () => {
  console.log("Try again");
  handleRestart();
});

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

function getGemsPositions() {
  while (gemPositions.length < gemCount) {
    const randomRow = Math.floor(Math.random() * boardSize);
    const randomCol = Math.floor(Math.random() * boardSize);
    const position = `${randomRow}-${randomCol}`;
    if (!gemPositions.includes(position)) {
      gemPositions.push(position);
    }
  }
}

function getHintsPositions() {
  let hintPosition = [];
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
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

function createGrid() {
  board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  getGemsPositions();
  hints = getHintsPositions();

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
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
    board.innerHTML = "";
  }
}

function setUpGame() {
  resetGameState();
  createGrid();

  gameOverEl.forEach((el) => hideElement(el));
  cells.forEach((cell) => cell.setDisabled());
  showElement(actions);
  showElement(startButton);
}

function startGame() {
  hideElement(startButton);
  startCountdown();
}

function resetGameState() {
  clearGrid();
  timeLeft = TIMER;
  timerValue.textContent = TIMER;
  gemPositions = [];
  currentScore = 0;
  gemsFound = 0;
  boardSizeEl.textContent = `${boardSize}x${boardSize}`;
  gemTotalEl.textContent = gemCount;
  scoreEl.textContent = totalScore;
  gemEl.textContent = gemsFound;
  isPaused = false;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerValue.textContent = timeLeft;
    if (timeLeft <= 0 && gemsFound < gemCount) {
      clearInterval(timerInterval);
      showElement(youLostEl);
      cells.forEach((cell) => cell.setDisabled());
    }
  }, 1000);
}

function handlePause() {
  if (isPaused) {
    isPaused = false;
    startTimer();
    cells.forEach((cell) => cell.setEnabled());
    pauseButton.style.backgroundImage = "url('./assets/icons/icon-pause.png')";
  } else {
    clearInterval(timerInterval);
    isPaused = true;
    cells.forEach((cell) => cell.setDisabled());
    pauseButton.style.backgroundImage = "url('./assets/icons/icon-play-s.png')";
  }
}

function handleRestart() {
  level = 1;
  boardSize = BOARD_SIZE;
  gemCount = GEM_COUNT;
  setUpGame();
}

function handleLevelUp() {
  boardSize += 1;
  gemCount += 1;
  setUpGame();
}

function onGemFound() {
  currentScore += 100;
  scoreEl.textContent = totalScore + currentScore;
  gemsFound++;
  gemEl.textContent = gemsFound;
  if (gemsFound === gemCount && timeLeft > 0) {
    clearInterval(timerInterval);
    showElement(congratulationsEl);
    totalScore += getFinalScore(currentScore);
    scoreEl.textContent = totalScore;
  }
}

function getFinalScore(currentScore) {
  return currentScore + timeLeft * 10;
}

function showElement(element) {
  element.classList.remove("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

function startCountdown() {
  let countdownValue = 3;
  const countdownEl = document.createElement("div");
  countdownEl.classList.add("countdown");
  countdownEl.textContent = countdownValue;
  board.appendChild(countdownEl);

  const countdownInterval = setInterval(() => {
    countdownValue--;
    if (countdownValue > 0) {
      countdownEl.textContent = countdownValue;
    } else if (countdownValue === 0) {
      countdownEl.textContent = "Go!";
    } else {
      clearInterval(countdownInterval);
      countdownEl.remove();
      startTimer();
      cells.forEach((cell) => cell.setEnabled());
      showElement(actions);
    }
  }, 1000);
}

function initialState() {
  level = 1;
  boardSize = BOARD_SIZE;
  gemCount = GEM_COUNT;
}

setUpGame();
