const boardSize = 10;
const gemCount = 3;
const board = document.querySelector(".game-board");

const startButton = document.querySelector(".start-btn");

startButton.addEventListener("click", startGame);

let gemPositions = [];

const placeGemsRandomly = () => {
  while (gemPositions.length < gemCount) {
    const randomRow = Math.floor(Math.random() * boardSize);
    const randomCol = Math.floor(Math.random() * boardSize);
    const position = `${randomRow}-${randomCol}`;
    if (!gemPositions.includes(position)) {
      gemPositions.push(position);
    }
  }
};

function createGrid() {
  placeGemsRandomly();

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
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

const timer = document.querySelector(".timer");
const timerValue = document.querySelector(".timer-value");

function startGame() {
  startButton.classList.add("hidden");
  startTime();
}

//start timer
function startTime() {
  console.log(timerValue.textContent);

  let timeLeft = 30;
  const timerInterval = setInterval(() => {
    timeLeft--;
    timerValue.textContent = timeLeft;
    console.log(timeLeft);
    if (timeLeft === 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

createGrid();
