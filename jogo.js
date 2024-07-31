document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const loadingScreen = document.getElementById('loading-screen');
    const gameContainer = document.getElementById('game-container');
    const heartsContainer = document.querySelector('.hearts-container');
    const gameArea = document.querySelector('.game-area');
    const endMessage = document.getElementById('end-message');
    const gameEnd = document.getElementById('game-end');
    const retryButton = document.getElementById('retry-button');

    let cards = [];
    let firstCard, secondCard;
    let lockBoard = false;
    let hearts = 5;
    let matches = 0;

    startButton.addEventListener('click', () => {
        document.getElementById('welcome-screen').classList.add('hidden');
        loadingScreen.classList.remove('hidden');

        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            createBoard();
        }, 2000); // Simula o carregamento
    });

    retryButton.addEventListener('click', () => {
        gameEnd.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        createBoard();
    });

    function createBoard() {
        cards = [];
        gameArea.innerHTML = '';
        const images = [
            'player1.jfif', 'player2.jfif', 'player3.jfif', 'player4.jfif',
            'player5.jfif', 'player6.jfif', 'player7.jfif', 'player8.jfif'
        ];
        const cardImages = [...images, ...images]; // 8 cartas de 8 jogadores

        // Embaralhar
        cardImages.sort(() => 0.5 - Math.random());

        cardImages.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.symbol = image;
            card.innerHTML = `<img src="${image}" alt="Imagem do jogador">`; // Adiciona a imagem do jogador
            card.addEventListener('click', flipCard);
            gameArea.appendChild(card);
            cards.push(card);
        });
        updateHearts();
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkMatch();
    }

    function checkMatch() {
        if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
            disableCards();
            matches++;
            if (matches === cards.length / 2) {
                setTimeout(() => {
                    showEndMessage('Você Ganhou!', 'win');
                }, 1000);
            }
        } else {
            setTimeout(() => {
                unflipCards();
                hearts--;
                updateHearts();
                if (hearts <= 0) {
                    showEndMessage('Você Perdeu!', 'lose');
                }
            }, 1000);
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function updateHearts() {
        heartsContainer.innerHTML = '';
        for (let i = 0; i < hearts; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heartsContainer.appendChild(heart);
        }
        for (let i = hearts; i < 5; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart', 'lost');
            heartsContainer.appendChild(heart);
        }
    }

    function showEndMessage(message, result) {
        endMessage.innerHTML = `<h1>${message}</h1>`;
        endMessage.classList.add(result);
        gameEnd.classList.remove('hidden');
        gameContainer.classList.add('hidden');

        // Mostrar onde estavam as cartas
        cards.forEach(card => {
            card.classList.add('flipped');
        });
    }
});