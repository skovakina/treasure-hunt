const BOARD_SIZE = 10;
const GEM_COUNT = 5;
const TIMER = 30;

let timeLeft = TIMER;
let timerInterval;
let isPaused = false;

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
const timer = document.querySelector(".timer");
const actions = document.querySelector(".game-actions");
const timerValue = document.querySelector(".timer-value");
const pauseBatton = document.querySelector(".pause-btn");
const scoreEl = document.querySelector(".score-value");
pauseBatton.addEventListener("click", handlePause);

startButton.addEventListener("click", startGame);

let gemPositions = [];
let totalScore = 0;

function placeGems() {
  while (gemPositions.length < GEM_COUNT) {
    const randomRow = Math.floor(Math.random() * BOARD_SIZE);
    const randomCol = Math.floor(Math.random() * BOARD_SIZE);
    const position = `${randomRow}-${randomCol}`;
    if (!gemPositions.includes(position)) {
      gemPositions.push(position);
    }
  }
}

function isValidPosition(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function createGrid() {
  placeGems();
  hints = getHintPosition();

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const position = `${row}-${col}`;
      if (gemPositions.includes(position)) {
        cell.classList.add("gem");
      }
      if (hints.includes(position)) {
        cell.classList.add("hint");
      }
      board.appendChild(cell);
    }
  }

  const cells = document.querySelectorAll(".cell");
}

function getHintPosition() {
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

function startGame() {
  startButton.classList.add("hidden");
  startTime();
}

function startTime() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerValue.textContent = timeLeft;
    console.log(timeLeft);
    if (timeLeft === 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
  playGame();
}

function coverCells() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    getTileImage(cell);
  });
}
function handlePause() {
  if (isPaused) {
    isPaused = false;
    startTime();
    pauseBatton.style.backgroundImage = "url('./assets/icons/icon-pause.png')";
  } else {
    clearInterval(timerInterval);
    isPaused = true;
    pauseBatton.style.backgroundImage = "url('./assets/icons/icon-play-s.png')";
  }
}

function playGame() {
  actions.classList.remove("hidden");
  board.addEventListener("click", (event) => {
    const cell = event.target;
    if (cell.classList.contains("cell")) {
      removeTileImage(cell);
    }
    if (cell.classList.contains("gem")) {
      totalScore += 100;
      scoreEl.textContent = totalScore;
    }
  });
}

function getTileImage(cell) {
  const tileType = Math.floor(Math.random() * 11);
  cell.style.backgroundImage = `url('./assets/tiles/tile-type-${tileType}.png')`;
  cell.style.backgroundSize = "fill";
  cell.style.backgroundPosition = "center";
}

function removeTileImage(cell) {
  if (cell.classList.contains("hint")) {
    cell.style.backgroundImage = "url('./assets/tiles/tile-bg-pink.png')";
    return;
  }
  if (cell.classList.contains("gem")) {
    cell.style.backgroundImage = "url('./assets/tiles/tile-gem.png')";
    return;
  }
  cell.style.backgroundImage = `url('./assets/tiles/tile-bg-1.png')`;
  cell.style.backgroundColor = "#1F1F1F";
}

function setScrore() {}

function initialize() {
  actions.classList.add("hidden");
  createGrid();
  coverCells();
}

initialize();
