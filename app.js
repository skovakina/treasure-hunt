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

function placeGems() {
  while (gemPositions.length < GEM_COUNT) {
    const randomRow = Math.floor(Math.random() * BOARD_SIZE);
    const randomCol = Math.floor(Math.random() * BOARD_SIZE);
    const position = `${randomRow}-${randomCol}`;
    if (!gemPositions.includes(position)) {
      gemPositions.push(position);
    }
    console.log(gemPositions);
  }
}

// check if a position is within the grid
function isValidPosition(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function createGrid() {
  placeGems();

  const hintPosition = [];
  gemPositions.forEach((gem) => {
    const [gemRow, gemCol] = gem.split("-").map(Number);
    console.log(gemRow, gemCol);

    OFFSET.forEach((offset) => {
      const row = gemRow + offset[0];
      const col = gemCol + offset[1];
      if (
        isValidPosition(row, col) &&
        !gemPositions.includes(`${row}-${col}`)
      ) {
        hintPosition.push(`${row}-${col}`);
      }
    });
  });

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const position = `${row}-${col}`;
      if (gemPositions.includes(position)) {
        cell.classList.add("gem");
      }
      if (hintPosition.includes(position)) {
        cell.classList.add("hint");
      }
      board.appendChild(cell);
    }
  }
}

function startGame() {
  startButton.classList.add("hidden");
  startTime();
}

//start timer
function startTime() {
  console.log(timerValue.textContent);
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
    cell.classList.add("tile");
  });
}

function uncoverCells() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("tile");
  });
}

function initialize() {
  timer.classList.add("hidden");
  createGrid();
  coverCells();
}

function playGame() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      cell.classList.remove("tile");
    });
  });
}

initialize();
