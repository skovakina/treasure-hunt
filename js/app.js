import Cell from "./cell.js";

const BOARD_SIZE = 6;
const GEM_COUNT = 1;
const TIMER = 30;
const GEM_VALUE = 100;
const BONUS = 10;
const COUNTDOWN = 3;

const GameState = {
  level: 1,
  timeLeft: TIMER,
  boardSize: BOARD_SIZE,
  gemCount: GEM_COUNT,
  currentScore: 0,
  totalScore: 0,
  gemsFound: 0,
  gemPositions: [],
  cells: [],

  resetRound() {
    this.currentScore = 0;
    this.timeLeft = TIMER;
    this.gemPositions = [];
    this.gemsFound = 0;
    this.cells = [];
  },
  resetHard() {
    this.gemCount = GEM_COUNT;
    this.totalScore = 0;
    this.level = 1;
    this.boardSize = BOARD_SIZE;
  },
  levelUp() {
    this.level++;
    this.boardSize++;
    this.gemCount++;
  },
};

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
const timerValue = document.querySelector(".timer-value");
const pauseButton = document.querySelector(".pause-btn");
const scoreEl = document.querySelector(".score-value");
const gemEl = document.querySelector(".gem-found");
const gemTotalEl = document.querySelector(".gem-total");
const boardSizeEl = document.querySelector(".board-size-value");
const congratulationsEl = document.querySelector(".congratulations");
const youLostEl = document.querySelector(".you-lost");
const gameOverEl = document.querySelectorAll(".game-over");
const actions = document.querySelector(".game-actions-container"); //
const nextLevelBtn = document.querySelector(".next-level-btn");
const levelValueEl = document.querySelector(".level-value");
const tryAgainBtn = document.querySelector(".try-again-btn");

gameOverEl.forEach((el) => hideElement(el));

pauseButton.addEventListener("click", handlePause);
startButton.addEventListener("click", startGame);
nextLevelBtn.addEventListener("click", handleLevelUp);
tryAgainBtn.addEventListener("click", () => {
  restartGame();
});

function getGemsPositions() {
  while (GameState.gemPositions.length < GameState.gemCount) {
    const randomRow = Math.floor(Math.random() * GameState.boardSize);
    const randomCol = Math.floor(Math.random() * GameState.boardSize);
    const position = `${randomRow}-${randomCol}`;
    if (!GameState.gemPositions.includes(position)) {
      GameState.gemPositions.push(position);
    }
  }
}

function getHintsPositions() {
  const hintPosition = [];
  GameState.gemPositions.forEach((gem) => {
    const [gemRow, gemCol] = gem.split("-").map(Number);
    OFFSET.forEach((offset) => {
      const row = gemRow + offset[0];
      const col = gemCol + offset[1];
      const position = `${row}-${col}`;
      if (
        isValidPosition(row, col) &&
        !GameState.gemPositions.includes(position)
      ) {
        hintPosition.push(position);
      }
    });
  });
  return hintPosition;
}

function isValidPosition(row, col) {
  return (
    row >= 0 &&
    row < GameState.boardSize &&
    col >= 0 &&
    col < GameState.boardSize
  );
}

function createGrid() {
  board.style.gridTemplateColumns = `repeat(${GameState.boardSize}, 1fr)`;
  getGemsPositions();
  const hints = getHintsPositions();

  for (let row = 0; row < GameState.boardSize; row++) {
    for (let col = 0; col < GameState.boardSize; col++) {
      const cell = new Cell(row, col, onGemFound);
      GameState.cells.push(cell);
      board.appendChild(cell.element);
      if (GameState.gemPositions.includes(`${row}-${col}`)) {
        cell.setType("gem");
      }
      if (hints.includes(`${row}-${col}`)) {
        cell.setType("hint");
      }
    }
  }
}

function clearGrid() {
  board.innerHTML = "";
}

function setUpGame() {
  resetRound();
  createGrid();
  gameOverEl.forEach((el) => hideElement(el));
  GameState.cells.forEach((cell) => cell.setDisabled());
  showElement(startButton);
}

function startGame() {
  hideElement(startButton);
  startCountdown();
}

function resetRound() {
  clearGrid();
  GameState.resetRound();
  updateTextContent();
  isPaused = false;
}

function updateTextContent() {
  timerValue.textContent = TIMER;
  levelValueEl.textContent = GameState.level;
  boardSizeEl.textContent = `${GameState.boardSize} x ${GameState.boardSize}`;
  gemTotalEl.textContent = GameState.gemCount;
  scoreEl.textContent = GameState.totalScore;
  gemEl.textContent = GameState.gemsFound;
}

function startTimer() {
  timerInterval = setInterval(() => {
    GameState.timeLeft--;
    timerValue.textContent = GameState.timeLeft;
    if (GameState.timeLeft <= 0 && GameState.gemsFound < GameState.gemCount) {
      clearInterval(timerInterval);
      showElement(youLostEl);
      GameState.cells.forEach((cell) => cell.setDisabled());
    }
  }, 1000);
}

function handlePause() {
  if (isPaused) {
    isPaused = false;
    startTimer();
    GameState.cells.forEach((cell) => cell.setEnabled());
    pauseButton.style.backgroundImage = "url('./assets/icons/icon-pause.png')";
  } else {
    clearInterval(timerInterval);
    isPaused = true;
    GameState.cells.forEach((cell) => cell.setDisabled());
    pauseButton.style.backgroundImage = "url('./assets/icons/icon-play-s.png')";
  }
}

function restartGame() {
  GameState.resetHard();
  GameState.resetRound();
  setUpGame();
}

function handleLevelUp() {
  GameState.levelUp();
  setUpGame();
}

function onGemFound() {
  GameState.currentScore += GEM_VALUE;

  scoreEl.textContent = GameState.totalScore + GameState.currentScore;
  GameState.gemsFound++;
  gemEl.textContent = GameState.gemsFound;
  if (GameState.gemsFound === GameState.gemCount && GameState.timeLeft > 0) {
    clearInterval(timerInterval);
    showElement(congratulationsEl);
    GameState.totalScore += getFinalScore(GameState.currentScore);
    scoreEl.textContent = GameState.totalScore;
  }
}

function getFinalScore(score) {
  return score + GameState.timeLeft * BONUS;
}

function showElement(element) {
  element.classList.remove("hidden");
  element.classList.add("show");
}

function hideElement(element) {
  element.classList.add("hidden");
}

function startCountdown() {
  let countdownValue = COUNTDOWN;
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
      GameState.cells.forEach((cell) => cell.setEnabled());
    }
  }, 1000);
}

setUpGame();
