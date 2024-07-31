document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const result = urlParams.get('result');

    const resultMessage = document.getElementById('result-message');
    const playAgainButton = document.getElementById('play-again-button');
    const retryButton = document.getElementById('retry-button');

    if (result === 'win') {
        resultMessage.textContent = 'Você Ganhou!';
        playAgainButton.classList.remove('hidden');
        retryButton.classList.add('hidden');
    } else {
        resultMessage.textContent = 'Você Perdeu!';
        retryButton.classList.remove('hidden');
        playAgainButton.classList.add('hidden');
    }

    playAgainButton.addEventListener('click', () => {
        window.location.href = 'jogo.html';
    });

    retryButton.addEventListener('click', () => {
        window.location.href = 'jogo.html';
    });
});
