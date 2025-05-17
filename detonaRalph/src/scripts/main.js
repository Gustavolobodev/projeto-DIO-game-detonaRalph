/**
 * DETONA RALPH - Jogo de clique rápido
 * 
 * Objeto principal que armazena o estado do jogo
 * Contém:
 * - Referências aos elementos DOM
 * - Valores do jogo (pontuação, tempo, etc)
 * - IDs dos intervalos (timers)
 */
const state = {
    // Referências aos elementos da interface
    view: {
        squares: document.querySelectorAll(".square"), // Todos os quadrados
        enemy: document.querySelector(".enemy"),       // Quadrado com o inimigo
        timeLeft: document.querySelector("#time-left"), // Contador de tempo
        score: document.querySelector("#score"),        // Mostrador de pontos
        gameOverMessage: document.getElementById("game-over-message"), // Mensagem de fim
        restartButton: document.getElementById("restart-button") // Botão de reinício
    },
    // Valores mutáveis do jogo
    values: {
        gameVelocity: 1000,    // Velocidade do jogo (ms)
        hitPosition: 0,         // ID do quadrado atual com inimigo
        result: 0,              // Pontuação atual
        currentTime: 60,        // Tempo restante (segundos)
    },
    // Controles de tempo/intervalos
    actions: {
        timerId: null,          // ID do timer do inimigo
        countDownTimerId: null, // ID do timer da contagem regressiva
    }
};

/**
 * Inicia os timers do jogo
 * - Um para mover o inimigo entre quadrados
 * - Outro para a contagem regressiva
 */
function startTimers() {
    // Timer para mover o inimigo
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    // Timer para contagem regressiva
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

/**
 * Atualiza a contagem regressiva e verifica fim do jogo
 */
function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    // Verifica se o tempo acabou
    if(state.values.currentTime < 0) {
        endGame();
    }
}

/**
 * Finaliza o jogo quando o tempo acaba
 * - Para os timers
 * - Mostra a mensagem de game over
 * - Configura o botão de reinício
 */
function endGame() {
    // Para os timers
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);

    // Atualiza a pontuação final na mensagem
    document.getElementById('final-score').textContent = state.values.result;
    // Mostra a tela de game over
    state.view.gameOverMessage.style.display = 'flex';
    
    // Mostra o botão de reinício
    state.view.restartButton.style.display = 'block';
}

/**
 * Reinicia o jogo para o estado inicial
 * - Reseta valores
 * - Atualiza a interface
 * - Limpa quadrados
 * - Reinicia timers
 */
function restart() {
    // Reseta os valores do jogo
    state.values.currentTime = 60;
    state.values.result = 0;
    state.values.hitPosition = 0;

    // Atualiza a interface
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;

    // Esconde a mensagem de game over
    state.view.gameOverMessage.style.display = 'none';
    state.view.restartButton.style.display = 'none';

    // Remove o inimigo de todos os quadrados
    state.view.squares.forEach(square => {
        square.classList.remove("enemy");
    })

    // Começa um novo jogo
    startTimers();
}

/**
 * Toca um efeito sonoro
 * @param {string} audioName - Nome do arquivo de áudio (sem extensão)
 */
function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.mp3`);
    audio.volume = 0.05; // Volume baixo para não assustar :)
    audio.play();
}

/**
 * Move o inimigo para um quadrado aleatório
 */
function randomSquare() {
    // Remove o inimigo de todos os quadrados
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    })

    // Seleciona um quadrado aleatório (0-8)
    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    // Adiciona a classe 'enemy' ao quadrado selecionado
    randomSquare.classList.add("enemy");
    // Armazena a posição do inimigo
    state.values.hitPosition = randomSquare.id;
}

/**
 * Adiciona os listeners de clique nos quadrados
 */
function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            // Verifica se o quadrado clicado contém o inimigo
            if(square.id === state.values.hitPosition) {
                state.values.result++; // Aumenta a pontuação
                state.view.score.textContent = state.values.result; // Atualiza a interface
                state.values.hitPosition = null; // Reseta a posição do inimigo
                playSound("hit"); // Toca o som de acerto
            }
        })
    });
}

/**
 * Inicializa o jogo
 * - Configura o botão de reinício
 * - Adiciona listeners aos quadrados
 * - Inicia os timers
 */
function init() {
    // Configura o botão de reinício
    state.view.restartButton.addEventListener("click", restart);
    // Garante que a mensagem de game over está oculta
    state.view.gameOverMessage.style.display = 'none';

    // Prepara os quadrados para interação
    addListenerHitBox();
    // Começa o jogo
    startTimers();
}

// Inicia o jogo quando a página carrega
init();