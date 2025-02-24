const BOARD_SIZE = 10;
const GEM_COUNT = 5;
const TIMER = 30;

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
const timerValue = document.querySelector(".timer-value");

startButton.addEventListener("click", startGame);

let gemPositions = [];
let totalScrore = 0;

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
  timer.classList.remove("hidden");

  let timeLeft = TIMER;
  const timerInterval = setInterval(() => {
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

function playGame() {
  board.addEventListener("click", (event) => {
    const cell = event.target;
    if (cell.classList.contains("cell")) {
      removeTileImage(cell);
    }
    if (cell.classList.contains("gem")) {
      totalScrore += 100;
    }
  });
}

function getTileImage(cell) {
  const tileType = Math.floor(Math.random() * 33);
  cell.style.backgroundImage = `url('./assets/tiles/tile-type-${tileType}.png')`;
  cell.style.backgroundSize = "fill";
  cell.style.backgroundPosition = "center";
}

function removeTileImage(cell) {
  cell.style.backgroundImage = "none";
}

function initialize() {
  timer.classList.add("hidden");
  createGrid();
  coverCells();
}

initialize();
