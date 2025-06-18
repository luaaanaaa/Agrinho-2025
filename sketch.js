// Array para armazenar todas as cartas do jogo
let cards = [];
// Array para armazenar as cartas viradas no turno atual
let flippedCards = [];
// Largura do canvas
let canvasWidth = 400;
// Altura do canvas (será ajustada pela função startGame)
let canvasHeight;
// Altura da área onde as cartas são desenhadas (será ajustada pela função startGame)
let cardAreaHeight;
// Altura da área da pontuação
let scoreAreaHeight = 50;
// Tamanho de cada carta (largura do canvas / número de colunas)
let cardSize = canvasWidth / 4; // Assume 4 colunas fixas
// Contador de pares combinados
let matchedPairs = 0;
// Flag para bloquear o tabuleiro durante a verificação de pares
let lockBoard = false;
// Variável para a pontuação do jogador
let score = 0;
// Nível atual do jogo (começa com 16 cartas)
let currentLevelCards = 16;

// Propriedades para o botão de alternar nível (desenhado no canvas)
let toggleButtonX;
let toggleButtonY;
let toggleButtonWidth = 100;
let toggleButtonHeight = 30;

/**
 * Inicializa ou reinicia o jogo com um número específico de cartas.
 * Ajusta o tamanho do canvas e os símbolos com base no nível escolhido.
 * @param {number} numCards O total de cartas para o jogo (16 ou 20).
 */
function startGame(numCards) {
    currentLevelCards = numCards; // Define o nível atual
    let symbols; // Array de símbolos para o nível
    let numRows; // Número de linhas de cartas para o nível

    // Configurações para o nível de 16 cartas (4x4)
    if (numCards === 16) {
        canvasHeight = 450; // Altura do canvas: 4 linhas * 100 (cardSize) + 50 (scoreArea)
        cardAreaHeight = 400; // Altura da área das cartas: 4 linhas * 100
        symbols = ['🌽', '🍅', '🌱', '🚗', '🏭', '🛒', '🏙️', '🌾']; // 8 símbolos únicos
        numRows = 4;
    }
    // Configurações para o nível de 20 cartas (4x5)
    else if (numCards === 20) {
        canvasHeight = 550; // Altura do canvas: 5 linhas * 100 (cardSize) + 50 (scoreArea)
        cardAreaHeight = 500; // Altura da área das cartas: 5 linhas * 100
        symbols = ['🌽', '🍅', '🌱', '🚗', '🏭', '🛒', '🏙️', '🌾', '💻', '💡']; // 10 símbolos únicos
        numRows = 5;
    }
    // Caso um número inválido seja passado, assume 16 cartas e avisa no console
    else {
        console.warn("Número de cartas inválido. Usando 16 cartas como padrão.");
        canvasHeight = 450;
        cardAreaHeight = 400;
        symbols = ['🌽', '🍅', '🌱', '🚗', '🏭', '🛒', '🏙️', '🌾'];
        numRows = 4;
        currentLevelCards = 16; // Garante que currentLevelCards esteja correto
    }

    // Redimensiona o canvas dinamicamente para o novo nível
    resizeCanvas(canvasWidth, canvasHeight);

    // Reseta todas as variáveis de estado do jogo para um novo início
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    lockBoard = false;
    score = 0;

    // Duplica os símbolos para formar os pares e embaralha-os
    symbols = symbols.concat(symbols);
    symbols = shuffle(symbols);

    // Cria as cartas para o novo nível, organizando-as em uma grade
    for (let i = 0; i < 4; i++) { // Itera sobre as colunas
        for (let j = 0; j < numRows; j++) { // Itera sobre as linhas
            let symbol = symbols.pop(); // Pega o próximo símbolo embaralhado
            // Cria uma nova carta e a adiciona ao array 'cards'
            let card = new Card(i * cardSize, j * cardSize + scoreAreaHeight, cardSize, symbol);
            cards.push(card);
        }
    }

    // Define a posição do botão de alternar nível (no canto superior direito da área de pontuação)
    toggleButtonX = canvasWidth - toggleButtonWidth - 10; // 10px da borda direita
    toggleButtonY = (scoreAreaHeight - toggleButtonHeight) / 2; // Centralizado verticalmente na área de pontuação
}

/**
 * Função de configuração inicial do p5.js, executada uma vez ao iniciar.
 * Cria o canvas e inicia o jogo no nível padrão.
 */
function setup() {
    createCanvas(canvasWidth, canvasHeight); // Cria o canvas com a largura inicial
    startGame(currentLevelCards); // Inicia o jogo com o nível de 16 cartas por padrão
}

/**
 * Função principal de desenho do p5.js, executada continuamente (loop).
 * Desenha o fundo, a área da pontuação, o botão de alternar nível e todas as cartas.
 */
function draw() {
    background(255); // Limpa o canvas com um fundo branco

    // --- Área da Pontuação ---
    fill(50); // Cor de fundo escura
    noStroke(); // Sem borda
    // Desenha o retângulo da área de pontuação com cantos arredondados na parte superior
    rect(0, 0, canvasWidth, scoreAreaHeight, 10, 10, 0, 0);

    fill(255); // Cor do texto branca
    textSize(24); // Tamanho do texto
    textAlign(LEFT, CENTER); // Alinhamento do texto
    text(`Pontos: ${score}`, 20, scoreAreaHeight / 2); // Exibe a pontuação

    // --- Desenha o botão de alternar nível ---
    // O texto do botão muda dependendo do nível atual
    let buttonText = `${currentLevelCards === 16 ? '20 Cartas' : '16 Cartas'}`;
    fill(100, 150, 200); // Cor do botão
    stroke(255); // Borda do botão
    strokeWeight(1); // Espessura da borda
    rect(toggleButtonX, toggleButtonY, toggleButtonWidth, toggleButtonHeight, 5); // Desenha o botão com cantos arredondados
    fill(255); // Cor do texto do botão
    textSize(14); // Tamanho do texto do botão
    textAlign(CENTER, CENTER); // Alinhamento do texto do botão
    text(buttonText, toggleButtonX + toggleButtonWidth / 2, toggleButtonY + toggleButtonHeight / 2); // Exibe o texto no botão

    // --- Desenha as Cartas ---
    for (let card of cards) {
        card.show(); // Chama o método show() de cada carta para desenhá-la
    }

    // --- Mensagem de "Você ganhou!" ---
    // Verifica se todos os pares foram combinados
    if (matchedPairs === cards.length / 2) {
        textSize(40); // Tamanho do texto de vitória
        fill(0, 150, 0); // Cor verde
        textAlign(CENTER, CENTER); // Alinhamento
        text('Você ganhou!', canvasWidth / 2, scoreAreaHeight + cardAreaHeight / 2); // Exibe a mensagem
    }
}

/**
 * Função chamada quando o mouse é pressionado.
 * Lida com o clique no botão de nível e nas cartas.
 */
function mousePressed() {
    // Verifica se o clique foi no botão de alternar nível
    if (mouseX > toggleButtonX && mouseX < toggleButtonX + toggleButtonWidth &&
        mouseY > toggleButtonY && mouseY < toggleButtonY + toggleButtonHeight) {
        // Alterna o nível e reinicia o jogo com o novo nível
        if (currentLevelCards === 16) {
            startGame(20);
        } else {
            startGame(16);
        }
        return; // Sai da função para evitar que o clique também interaja com as cartas
    }

    // Ignora cliques se o tabuleiro estiver bloqueado (durante a verificação de pares)
    if (lockBoard) {
        return;
    }

    // Lógica para virar as cartas
    for (let card of cards) {
        // Verifica se o clique foi dentro da carta e se ela não está virada nem combinada
        if (card.contains(mouseX, mouseY) && !card.isFlipped && !card.isMatched) {
            card.flip(); // Vira a carta
            flippedCards.push(card); // Adiciona a carta virada à lista

            // Se duas cartas foram viradas, bloqueia o tabuleiro e programa a verificação
            if (flippedCards.length === 2) {
                lockBoard = true; // Bloqueia imediatamente
                setTimeout(checkMatch, 1000); // Espera 1 segundo para verificar
            }
            break; // Sai do loop após virar uma carta
        }
    }
}

/**
 * Função para verificar se as duas cartas viradas formam um par.
 */
function checkMatch() {
    const [card1, card2] = flippedCards; // Pega as duas cartas viradas

    // Se as cartas existem e seus símbolos são iguais, é um par
    if (card1 && card2 && card1.symbol === card2.symbol) {
        matchedPairs++; // Incrementa pares combinados
        score++; // Adiciona ponto
        card1.isMatched = true; // Marca as cartas como combinadas
        card2.isMatched = true;
        flippedCards = []; // Limpa as cartas viradas
        lockBoard = false; // Desbloqueia o tabuleiro
    } else {
        // Se não for um par, vira as cartas de volta após um atraso
        setTimeout(() => {
            if (card1) card1.flip(); // Desvira a primeira carta
            if (card2) card2.flip(); // Desvira a segunda carta
            flippedCards = []; // Limpa as cartas viradas
            lockBoard = false; // Desbloqueia o tabuleiro
        }, 1000); // Espera 1 segundo
    }
}

/**
 * Classe Card (Carta)
 * Representa cada carta individual no jogo, gerenciando seu estado e desenho.
 */
class Card {
    /**
     * Construtor da classe Card.
     * @param {number} x Posição X da carta.
     * @param {number} y Posição Y da carta.
     * @param {number} size Tamanho (largura e altura) da carta.
     * @param {string} symbol Símbolo da carta.
     */
    constructor(x, y, size, symbol) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.symbol = symbol;
        this.isFlipped = false; // Estado inicial: virada para baixo
        this.isMatched = false; // Estado inicial: não combinada
    }

    /**
     * Alterna o estado 'isFlipped' da carta (vira/desvira).
     * Só permite virar se a carta ainda não foi combinada.
     */
    flip() {
        if (!this.isMatched) {
            this.isFlipped = !this.isFlipped;
        }
    }

    /**
     * Verifica se as coordenadas passadas (geralmente do mouse) estão dentro da área da carta.
     * @param {number} px Posição X a ser verificada.
     * @param {number} py Posição Y a ser verificada.
     * @returns {boolean} True se as coordenadas estiverem dentro da carta, False caso contrário.
     */
    contains(px, py) {
        return px > this.x && px < this.x + this.size && py > this.y && py < this.y + this.size;
    }

    /**
     * Desenha a carta no canvas.
     * Mostra o símbolo se a carta estiver virada para cima ou já foi combinada.
     * Caso contrário, mostra a face oculta da carta.
     */
    show() {
        stroke(0); // Borda preta
        strokeWeight(2); // Espessura da borda

        // Cor da carta: cinza claro se virada/combinada, branco se oculta
        fill(this.isFlipped || this.isMatched ? 200 : 255);
        // Desenha o retângulo da carta com cantos arredondados
        rect(this.x, this.y, this.size, this.size, 10);

        // Se a carta estiver virada ou combinada, desenha o símbolo
        if (this.isFlipped || this.isMatched) {
            textSize(32); // Tamanho do texto do símbolo
            textAlign(CENTER, CENTER); // Alinhamento
            fill(0); // Cor do texto preta
            text(this.symbol, this.x + this.size / 2, this.y + this.size / 2); // Desenha o símbolo
        }
    }
}
