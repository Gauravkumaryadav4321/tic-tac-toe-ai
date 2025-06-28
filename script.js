const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');

const moveSound = document.getElementById('moveSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

let board = Array(9).fill(null);
let human = 'X';
let ai = 'O';
let currentPlayer = human;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

cells.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true });
});

restartButton.addEventListener('click', startGame);

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!board[index] && currentPlayer === human) {
    makeMove(index, human);
    moveSound.play();
    if (!checkWinner(board, human) && !isDraw()) {
      currentPlayer = ai;
      setTimeout(() => {
        const bestMove = getBestMove();
        makeMove(bestMove, ai);
        moveSound.play();
        if (!checkWinner(board, ai) && !isDraw()) {
          currentPlayer = human;
        }
      }, 500);
    }
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].innerText = player;
  cells[index].classList.add(player.toLowerCase());
  if (checkWinner(board, player)) {
    message.innerText = `${player} wins!`;
    winSound.play();
    endGame();
  } else if (isDraw()) {
    message.innerText = "It's a draw!";
    drawSound.play();
    endGame();
  }
}

function checkWinner(board, player) {
  return winningCombinations.some(combination =>
    combination.every(index => board[index] === player)
  );
}

function isDraw() {
  return board.every(cell => cell);
}

function endGame() {
  cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

function startGame() {
  board = Array(9).fill(null);
  currentPlayer = human;
  message.innerText = '';
  cells.forEach(cell => {
    cell.innerText = '';
    cell.classList.remove('x', 'o');
    cell.addEventListener('click', handleClick, { once: true });
  });
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner(newBoard, ai)) {
    return 10 - depth;
  }
  if (checkWinner(newBoard, human)) {
    return depth - 10;
  }
  if (isDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = ai;
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = human;
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
