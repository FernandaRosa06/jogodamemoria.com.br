const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const resetButton = document.getElementById('resetButton');
const selectButtons = document.querySelectorAll('.select-button');
const gameContainer = document.querySelector('.game-container');
const playerSelectionDivs = document.querySelectorAll('.player-selection > .option');
const statusMessage = document.getElementById('statusMessage');
const currentTurn = document.getElementById('currentTurn');
const userPlayerName = document.getElementById('userPlayerName');
const opponentPlayerName = document.getElementById('opponentPlayerName');
let userPlayer = null;
let opponentPlayer = null;
let currentPlayer = 'user'; // 'user' or 'opponent'
let boardState = Array(9).fill(null); // State of the board
let isGameActive = true; // Flag to check if game is active

// Função para selecionar o jogador
function selectPlayer(team, playerImageSrc, playerName, isUser) {
    if (isUser) {
        userPlayer = { team, image: playerImageSrc, name: playerName };
        userPlayerName.textContent = `Jogador X: ${playerName}`;
        statusMessage.textContent = 'Escolha o jogador do adversário!';
    } else {
        opponentPlayer = { team, image: playerImageSrc, name: playerName };
        opponentPlayerName.textContent = `Jogador O: ${playerName}`;
        statusMessage.textContent = ''; // Limpar mensagem de status
    }

    // Atualizar o botão para indicar seleção
    selectButtons.forEach(button => {
        const playerDiv = button.parentElement;
        if (playerDiv.querySelector('img').src === playerImageSrc) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Habilitar jogo quando ambos os jogadores forem escolhidos
    if (userPlayer && opponentPlayer) {
        document.querySelector('.player-selection').style.display = 'none';
        gameContainer.style.display = 'block';
        currentTurn.textContent = 'É a vez do X jogar';
    }
}

// Adicionar ouvintes de evento para seleção de jogadores
selectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const playerDiv = button.parentElement;
        const team = playerDiv.dataset.team;
        const playerImageSrc = playerDiv.querySelector('img').src;
        const playerName = playerDiv.dataset.name;
        const isUser = playerDiv.parentElement.id === 'userPlayers';

        if (isUser && userPlayer) {
            statusMessage.textContent = 'Você já escolheu seu jogador!';
        } else if (!isUser && opponentPlayer) {
            statusMessage.textContent = 'O adversário já tem um jogador!';
        } else {
            selectPlayer(team, playerImageSrc, playerName, isUser);
        }
    });
});

// Função para verificar vitória
function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let winner = null;

    winPatterns.forEach(pattern => {
        const [a, b, c] = pattern;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            winner = boardState[a];
            pattern.forEach(index => cells[index].classList.add('winner'));
        }
    });

    if (winner) {
        statusMessage.textContent = winner === 'user' ? 'Você ganhou!' : 'O adversário ganhou!';
        isGameActive = false;
        return;
    }

    if (!boardState.includes(null)) {
        statusMessage.textContent = 'Empate!';
        isGameActive = false;
    }
}

// Lógica do jogo
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (cell.innerHTML === '' && userPlayer && opponentPlayer && isGameActive) {
            const playerImage = currentPlayer === 'user' ? userPlayer.image : opponentPlayer.image;
            cell.innerHTML = `<img src="${playerImage}" alt="${currentPlayer === 'user' ? userPlayer.name : opponentPlayer.name}">`;
            boardState[index] = currentPlayer;
            currentPlayer = currentPlayer === 'user' ? 'opponent' : 'user';
            currentTurn.textContent = currentPlayer === 'user' ? 'É a vez do X jogar' : 'É a vez do O jogar';
            checkWin();
        }
    });
});

// Reiniciar o jogo
resetButton.addEventListener('click', () => {
    cells.forEach(cell => cell.innerHTML = '');
    cells.forEach(cell => cell.classList.remove('winner'));
    boardState = Array(9).fill(null);
    userPlayer = null;
    opponentPlayer = null;
    currentPlayer = 'user';
    isGameActive = true;
    document.querySelector('.player-selection').style.display = 'block';
    gameContainer.style.display = 'none';
    statusMessage.textContent = '';
    userPlayerName.textContent = 'Jogador X: Nenhum escolhido';
    opponentPlayerName.textContent = 'Jogador O: Nenhum escolhido';
    currentTurn.textContent = '';
});
