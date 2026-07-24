const board = ["", "", "", "", "", "", "", "", ""];
const winningCombinations = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal
  [2, 4, 6], // diagonal
];
let currentPlayer = "X";

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");


function checkWin(player) {
  return winningCombinations.some(
    ([a, b, c]) =>
      board[a] === player && board[b] === player && board[c] === player,
  );
}

function isBoardFull() {
  return board.every((cell) => cell !== "");
}

function resetBoard() {
  board.fill("");
  cells.forEach((cell) => {
    cell.disabled = false;
    cell.textContent = "";   
  });
  document.getElementById("status").textContent = "PlayerX's turn";
}

function disableBoard() {
  cells.forEach((cell) => {
    cell.disabled = true;
  });
}

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        board[index] = currentPlayer;
        cell.style.color = currentPlayer === "X" ? "red" : "blue";
        cell.textContent = currentPlayer;
        cell.disabled = true;
        if (checkWin(currentPlayer)) {
            statusText.textContent = `${currentPlayer} wins!`;
            disableBoard();
            return;
        }
        if (isBoardFull()) {
            statusText.textContent = "It's a draw!";
            return;
        }
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    });
});

document.getElementById("resetButton").addEventListener("click", resetBoard);

module.exports = {
  board,
  winningCombinations,
  currentPlayer,
  checkWin,
  isBoardFull,
  resetBoard,
  disableBoard,
};  
  

