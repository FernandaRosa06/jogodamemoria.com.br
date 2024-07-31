document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameContainer = document.querySelector('.memory-game');
    const heartsContainer = document.getElementById('hearts-container');

    startButton.addEventListener('click', startGame);

    function startGame() {
        startScreen.style.display = 'none';
        loadingScreen.style.display = 'flex';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
            createBoard();
            document.querySelectorAll('.memory-card').forEach(card => card.addEventListener('click', flipCard));
        }, 2000);
    }

    const cardsArray = [
        { name: 'player1', img: 'player1.jfif' },
        { name: 'player2', img: 'player2.jfif' },
        { name: 'player3', img: 'player3.jfif' },
        { name: 'player4', img: 'player4.jfif' },
        { name: 'player5', img: 'player5.jfif' },
        { name: 'player6', img: 'player6.jfif' },
        { name: 'player7', img: 'player7.jfif' },
        { name: 'player8', img: 'player8.jfif' }
    ];

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let hearts = 5;

    function createBoard() {
        const gameCards = [...cardsArray, ...cardsArray];
        gameCards.sort(() => 0.5 - Math.random());
        gameCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.name = card.name;
            cardElement.innerHTML = `
                <div class="front-face" style="background: url('${card.img}') no-repeat center/cover;"></div>
                <div class="back-face"></div>
            `;
            gameContainer.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.name === secondCard.dataset.name;
        isMatch ? disableCards() : unflipCards();
        setTimeout(() => {
            if (isMatch) {
                firstCard.classList.add('match');
                secondCard.classList.add('match');
                heartsContainer.children[hearts - 1].classList.remove('black'); // Volta a ser vermelho
                checkForWin(); // Verifica se ganhou
            } else {
                firstCard.classList.add('no-match');
                secondCard.classList.add('no-match');
                decrementHearts();
            }
        }, 500);
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip', 'no-match');
            secondCard.classList.remove('flip', 'no-match');
            resetBoard();
        }, 2000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function decrementHearts() {
        hearts--;
        heartsContainer.children[hearts].classList.add('black'); // Torna o coração preto
        if (hearts === 0) {
            revealAllCards();
            setTimeout(() => {
                window.location.href = 'voceperdeu.html'; // Redireciona para a página "Você Perdeu"
            }, 2000);
        }
    }

    function revealAllCards() {
        document.querySelectorAll('.memory-card').forEach(card => {
            card.classList.add('flip');
        });
    }

    function checkForWin() {
        const matchedCards = document.querySelectorAll('.memory-card.match');
        if (matchedCards.length === cardsArray.length * 2) {
            setTimeout(() => {
                window.location.href = 'voceganhou.html'; // Redireciona para a página "Você Ganhou"
            }, 2000);
        }
    }
});
