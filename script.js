// ====== Selectors ======
const boardEl = document.getElementById("board");
const cells = document.querySelectorAll(".cell");

const singlePlayerBtn = document.getElementById("singlePlayerBtn");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const nameForm = document.getElementById("nameForm");

const playerXInput = document.getElementById("playerXInput");
const playerOInput = document.getElementById("playerOInput");

const labelX = document.getElementById("labelX");
const labelO = document.getElementById("labelO");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");

const startBtn = document.getElementById("startBtn");

// ====== Game State ======
let board = Array(9).fill(null);
let currentPlayer = "X";
let scores = { X: 0, O: 0, D: 0 };
let singlePlayerMode = false;
let playerXName = "Player X";
let playerOName = "Player O";
let gameActive = false;

// ====== Winning Combinations ======
const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

// ====== Mode Selection ======
singlePlayerBtn.addEventListener("click", () => {
  singlePlayerMode = true;
  singlePlayerBtn.setAttribute("aria-pressed", "true");
  twoPlayerBtn.setAttribute("aria-pressed", "false");
  playerOInput.parentElement.style.display = "none";
});

twoPlayerBtn.addEventListener("click", () => {
  singlePlayerMode = false;
  twoPlayerBtn.setAttribute("aria-pressed", "true");
  singlePlayerBtn.setAttribute("aria-pressed", "false");
  playerOInput.parentElement.style.display = "block";
});

// ====== Start Game ======
nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  playerXName = playerXInput.value.trim() || "Player X";
  playerOName = singlePlayerMode ? "Computer" : (playerOInput.value.trim() || "Player O");

  labelX.textContent = playerXName;
  labelO.textContent = playerOName;

  resetBoard();
  gameActive = true;
});

// ====== Handle Move ======
function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index]) return;

  makeMove(index, currentPlayer);

  if (checkWinner()) return;
  if (board.every(cell => cell)) {
    endRound("D");
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Computer move
  if (singlePlayerMode && currentPlayer === "O") {
    setTimeout(computerMove, 400);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player);
}

// ====== Computer AI (Easy Random) ======
function computerMove() {
  const emptyCells = board
    .map((val, i) => (val === null ? i : null))
    .filter(i => i !== null);

  const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(choice, "O");

  if (checkWinner()) return;
  if (board.every(cell => cell)) {
    endRound("D");
    return;
  }

  currentPlayer = "X";
}

// ====== Check Winner ======
function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      endRound(board[a]);
      return true;
    }
  }
  return false;
}

// ====== End Round ======
function endRound(winner) {
  gameActive = false;

  if (winner === "D") {
    scores.D++;
    scoreDEl.textContent = scores.D;
    alert("It's a draw!");
  } else {
    scores[winner]++;
    if (winner === "X") scoreXEl.textContent = scores.X;
    else scoreOEl.textContent = scores.O;
    alert(`${winner === "X" ? playerXName : playerOName} wins!`);
  }

  setTimeout(resetBoard, 1000);
}

// ====== Reset Board ======
function resetBoard() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O");
  });
  gameActive = true;
}

// ====== Attach Events ======
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
