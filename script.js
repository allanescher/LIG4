const columns = 7;
const rows = 6;
let board = [];
let currentPlayer = 'red';
let gameOver = false;

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    document.getElementById('resetButton').addEventListener('click', resetGame);
});

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board = Array.from({ length: rows }, () => Array(columns).fill(null));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.column = c;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (gameOver) return;

    const column = event.target.dataset.column;
    const row = getAvailableRow(column);
    if (row === null) return;

    board[row][column] = currentPlayer;
    updateBoard();

    const winningCells = checkWin();
    if (winningCells) {
        highlightWinningCells(winningCells);
        document.getElementById('message').textContent = `${currentPlayer.toUpperCase()} Venceu!`;
        gameOver = true;
    } else if (checkDraw()) {
        document.getElementById('message').textContent = 'Empate!';
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    }
}

function getAvailableRow(column) {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][column] === null) {
            return r;
        }
    }
    return null;
}

function updateBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cell = document.querySelector(`.cell[data-row="${r}"][data-column="${c}"]`);
            cell.classList.remove('red', 'black');
            if (board[r][c]) {
                cell.classList.add(board[r][c]);
            }
        }
    }
}

function checkWin() {
    return checkHorizontal() || checkVertical() || checkDiagonal();
}

function checkHorizontal() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] && board[r][c] === board[r][c + 1] && board[r][c] === board[r][c + 2] && board[r][c] === board[r][c + 3]) {
                return [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]];
            }
        }
    }
    return null;
}

function checkVertical() {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] && board[r][c] === board[r + 1][c] && board[r][c] === board[r + 2][c] && board[r][c] === board[r + 3][c]) {
                return [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]];
            }
        }
    }
    return null;
}


function checkDiagonal() {
    // Check diagonals (bottom-left to top-right)
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] && board[r][c] === board[r - 1][c + 1] && board[r][c] === board[r - 2][c + 2] && board[r][c] === board[r - 3][c + 3]) {
                return [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]];
            }
        }
    }

    // Check diagonals (top-left to bottom-right)
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] && board[r][c] === board[r + 1][c + 1] && board[r][c] === board[r + 2][c + 2] && board[r][c] === board[r + 3][c + 3]) {
                return [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]];
            }
        }
    }

    return null;
}

function highlightWinningCells(winningCells) {
    winningCells.forEach(([r, c]) => {
        const cell = document.querySelector(`.cell[data-row="${r}"][data-column="${c}"]`);
        cell.classList.add('winner');
    });
}

function checkDraw() {
    return board.every(row => row.every(cell => cell !== null));
}

function resetGame() {
    currentPlayer = 'red';
    gameOver = false;
    document.getElementById('message').textContent = '';
    createBoard();
}

