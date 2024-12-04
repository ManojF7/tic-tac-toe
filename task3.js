const board = document.getElementById('board');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const modeSelector = document.getElementById('mode-selector'); // Dropdown for mode selection

let gameState = Array(9).fill(null); // Track game state
let currentPlayer = 'X'; // Start with player X
let gameMode = 'two-player'; // Default mode

// Initialize the board
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    board.appendChild(cell);
}

// Handle mode selection
modeSelector.addEventListener('change', (event) => {
    gameMode = event.target.value;
    resetGame(); // Reset the game when mode changes
});

// Handle user clicks
board.addEventListener('click', (event) => {
    const cell = event.target;
    const index = cell.dataset.index;

    if (!cell.textContent && gameState[index] === null) {
        makeMove(index, currentPlayer);

        if (checkWinner(currentPlayer)) {
            status.textContent = `${currentPlayer === 'X' ? 'Player X' : gameMode === 'two-player' ? 'Player O' : 'AI'} wins!`;
            endGame();
            return;
        }

        if (isBoardFull()) {
            status.textContent = `It's a draw!`;
            return;
        }

        if (gameMode === 'two-player') {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
            status.textContent = `Player ${currentPlayer}'s turn.`;
        } else if (currentPlayer === 'X') {
            status.textContent = `AI's turn...`;
            setTimeout(() => {
                const aiMove = getAIMove();
                makeMove(aiMove, 'O');

                if (checkWinner('O')) {
                    status.textContent = `AI wins!`;
                    endGame();
                    return;
                }

                if (isBoardFull()) {
                    status.textContent = `It's a draw!`;
                    return;
                }

                status.textContent = `Your turn!`;
            }, 500); // Delay for realism
        }
    }
});

// Reset the game
resetButton.addEventListener('click', resetGame);

function resetGame() {
    gameState.fill(null);
    Array.from(board.children).forEach(cell => (cell.textContent = ''));
    board.style.pointerEvents = 'auto';
    currentPlayer = 'X';
    status.textContent = `Player X's turn.`;
}

// Make a move
function makeMove(index, marker) {
    const cell = board.children[index];
    cell.textContent = marker;
    gameState[index] = marker;
}

// Get AI move
function getAIMove() {
    // 1. Check if AI can win
    let move = findWinningMove('O');
    if (move !== null) return move;

    // 2. Block player's winning move
    move = findWinningMove('X');
    if (move !== null) return move;

    // 3. Take the center if available
    if (gameState[4] === null) return 4;

    // 4. Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => gameState[index] === null);
    if (availableCorners.length > 0) return availableCorners[Math.floor(Math.random() * availableCorners.length)];

    // 5. Take a random available spot
    const availableSpots = gameState.map((value, index) => value === null ? index : null).filter(index => index !== null);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
}

// Check for winning move
function findWinningMove(marker) {
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winningPatterns) {
        const [a, b, c] = pattern;
        const line = [gameState[a], gameState[b], gameState[c]];

        if (line.filter(cell => cell === marker).length === 2 && line.includes(null)) {
            return pattern[line.indexOf(null)];
        }
    }

    return null;
}

// Check if the board is full
function isBoardFull() {
    return gameState.every(cell => cell !== null);
}

// Check for winner
function checkWinner(marker) {
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winningPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameState[a] === marker && gameState[b] === marker && gameState[c] === marker;
    });
}

// End the game
function endGame() {
    board.style.pointerEvents = 'none'; // Disable further clicks
}
