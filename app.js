const BOARD_SIZE = 10;
const GEM_COUNT = 3;
const TIMER = 30;

const board = document.querySelector(".game-board");
const startButton = document.querySelector(".start-btn");
const timer = document.querySelector(".timer");
const timerValue = document.querySelector(".timer-value");

startButton.addEventListener("click", startGame);

let gemPositions = [];

const placeGemsRandomly = () => {
  while (gemPositions.length < GEM_COUNT) {
    const randomRow = Math.floor(Math.random() * BOARD_SIZE);
    const randomCol = Math.floor(Math.random() * BOARD_SIZE);
    const position = `${randomRow}-${randomCol}`;
    if (!gemPositions.includes(position)) {
      gemPositions.push(position);
    }
  }
};

function createGrid() {
  placeGemsRandomly();

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const position = `${row}-${col}`;

      if (gemPositions.includes(position)) {
        cell.classList.add("gem");
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
}

function initialize() {
  timer.classList.add("hidden");
  createGrid();
}

initialize();
