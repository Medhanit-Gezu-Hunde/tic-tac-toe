// ====== Selectors ======
const boardEl = document.getElementById("board");
const cells = document.querySelectorAll(".cell");

const playerXInput = document.getElementById("playerXInput");
const startBtn = document.getElementById("startBtn");

const labelX = document.getElementById("labelX");
const labelO = document.getElementById("labelO");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");

// ====== Game State ======
let board = Array(9).fill(null);
let currentPlayer = "X";
let scores = { X: 0, O: 0, D: 0 };
let playerXName = "Player X";
let playerOName = "Computer";
let gameActive = false;

// ====== Winning Combinations ======
const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

// ====== Start Game ======
startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  boardEl.scrollIntoView();

  playerXName = playerXInput.value.trim() || "Player X";

  labelX.textContent = playerXName;
  labelO.textContent = playerOName;

  resetBoard();
  gameActive = true;
});

// ====== Handle Player Move ======
function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index]) return;

  makeMove(index, "X");

  if (checkWinner()) return;
  if (board.every(cell => cell)) {
    endRound("D");
    return;
  }

  currentPlayer = "O";
  setTimeout(computerMove, 400);
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player);
}

// ====== Computer AI (Unbeatable) ======
function computerMove() {
  const bestMove = minimax(board, "O").index;
  makeMove(bestMove, "O");

  if (checkWinner()) return;
  if (board.every(cell => cell)) {
    endRound("D");
    return;
  }

  currentPlayer = "X";
}

// ====== Minimax Algorithm ======
function minimax(newBoard, player) {
  const availSpots = newBoard
    .map((val, i) => (val === null ? i : null))
    .filter(i => i !== null);

  // Terminal states
  if (checkWin(newBoard, "X")) return { score: -10 };
  if (checkWin(newBoard, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === "O") {
      const result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      const result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[availSpots[i]] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

// ====== Helper for Minimax ======
function checkWin(boardState, player) {
  return winPatterns.some(pattern => pattern.every(i => boardState[i] === player));
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
