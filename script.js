document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const chooseTeamScreen = document.getElementById('choose-team-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameContainer = document.querySelector('.memory-game');
    const heartsContainer = document.getElementById('hearts-container');
    const gremioButton = document.getElementById('gremio-button');
    const interButton = document.getElementById('inter-button');

    let team = '';

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        chooseTeamScreen.style.display = 'flex';
    });

    gremioButton.addEventListener('click', () => {
        team = 'gremio';
        startGame();
    });

    interButton.addEventListener('click', () => {
        team = 'inter';
        startGame();
    });

    function startGame() {
        chooseTeamScreen.style.display = 'none';
        loadingScreen.style.display = 'flex';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
            createBoard();
            document.querySelectorAll('.memory-card').forEach(card => card.addEventListener('click', flipCard));
        }, 2000);
    }

    // Defina as cartas para cada time
    const cardsArray = {
        gremio: [
            { name: 'player1', img: 'player1.jfif' },
            { name: 'player2', img: 'player2.jfif' },
            { name: 'player3', img: 'player3.jfif' },
            { name: 'player4', img: 'player4.jfif' },
            { name: 'player5', img: 'player5.jfif' },
            { name: 'player6', img: 'player6.jfif' },
            { name: 'player7', img: 'player7.jfif' },
            { name: 'player8', img: 'player8.jfif' }
        ],
        inter: [
            { name: 'player1', img: 'player9.jfif' },
            { name: 'player2', img: 'player10.jfif' },
            { name: 'player3', img: 'player11.jfif' },
            { name: 'player4', img: 'player12.jfif' },
            { name: 'player5', img: 'player13.jfif' },
            { name: 'player6', img: 'payer14.jfif' },
            { name: 'player7', img: 'player15.jfif' },
            { name: 'player8', img: 'player16.jfif' }
        ]
    };

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let hearts = 5;

    function createBoard() {
        gameContainer.innerHTML = ''; // Limpa o conteúdo do container antes de criar o novo tabuleiro

        // Pegue as cartas para o time selecionado
        const selectedCards = cardsArray[team];
        const gameCards = [...selectedCards, ...selectedCards];
        gameCards.sort(() => 0.5 - Math.random());
        
        // Crie o tabuleiro de memória
        gameCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.name = card.name;
            cardElement.innerHTML = `
                <div class="front-face" style="background: url('${card.img}') no-repeat center/cover;"></div>
                <div class="back-face ${team}"></div> <!-- Adiciona a classe do time aqui -->
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
        if (matchedCards.length === cardsArray[team].length * 2) {
            setTimeout(() => {
                window.location.href = 'voceganhou.html'; // Redireciona para a página "Você Ganhou"
            }, 2000);
        }
    }
});
