const canvas = document.getElementById('game-board');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const box = 20;
const canvasSize = { x: 800, y: 600 };
let snake = [{ x: box, y: box }];
let food = null;
let direction = null; // Die Schlange bewegt sich zunächst nicht
let snakeColor = '#FF0000'; // Schlange wird rot
let foodColor = '#00FF00'; // Futter wird grün
let score = 0;


let allTimeHighscore = 0;
const allTimeHighscoreElement = document.getElementById('all-time-highscore');
allTimeHighscoreElement.innerText = 'All Time Highscore: ' + allTimeHighscore; // Zeigt die Allzeit-Highscore an

// Neuer Code zum Starten des Spiels und Verbergen des Titelscreens
let titleScreen = document.getElementById('title-screen');

titleScreen.addEventListener('click', function() {
    titleScreen.style.display = 'none'; // Verbirgt den Titelscreen
    canvas.style.display = 'block'; // Zeigt das Spiel an
    scoreElement.style.display = 'block'; // Zeigt den Punktezähler an
	allTimeHighscoreElement.style.display = 'block';
    resetGame(); // Startet das Spiel
});


function createFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize.x / box - 1)) * box,
        y: Math.floor(Math.random() * (canvasSize.y / box - 1)) * box,
        color: foodColor
    };
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].x == head.x && array[i].y == head.y) return true;
    }
    return false;
}

function resetGame() {
	allTimeHighscore = Math.max(allTimeHighscore, score); // Aktualisiert die Allzeit-Highscore
    allTimeHighscoreElement.innerText = 'All Time Highscore: ' + allTimeHighscore; // Zeigt die Allzeit-Highscore an
	
    direction = null;
    snake = [{ x: box, y: box }];
    score = 0;
    createFood();
}

function draw() {
    context.clearRect(0, 0, canvasSize.x, canvasSize.y);
    
	// Zeichnet die Schlange
    for(let i = 0; i < snake.length; i++) {
        context.beginPath();
        context.arc(snake[i].x + box/2, snake[i].y + box/2, box/2, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();
        context.closePath();
    }

    if (food == null) createFood();
	
    // Zeichnet das Essen als Sechseck
    context.beginPath();
    context.rect(food.x, food.y, box, box);
    context.fillStyle = 'green';
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();

    if (!direction) return; // Wenn die Schlange sich nicht bewegt, beenden wir die Funktion hier

    let snakeX = snake[0].x + direction.x;
    let snakeY = snake[0].y + direction.y;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerText = 'Score: ' + score;
        createFood();
    } else {
        snake.pop();
    }

    if (snakeX >= canvasSize.x || snakeY >= canvasSize.y || snakeX < 0 || snakeY < 0 || collision({ x: snakeX, y: snakeY }, snake)) {
        resetGame();
        return;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    snake.unshift(newHead);
}

let game = setInterval(draw, 100);

scoreElement.innerText = 'Score: 0';

window.addEventListener('keydown', e => {
    let newDirection = direction;

    switch (e.key) {
        case 'ArrowUp': newDirection = { x: 0, y: -box }; break;
        case 'ArrowDown': newDirection = { x: 0, y: box }; break;
        case 'ArrowLeft': newDirection = { x: -box, y: 0 }; break;
        case 'ArrowRight': newDirection = { x: box, y: 0 }; break;
    }

    // Punktestand zurücksetzen, wenn die Schlange sich zum ersten Mal bewegt
    if (!direction) {
        score = 0; 
        scoreElement.innerText = 'Score: ' + score;
    }

    if (!direction || (newDirection.x !== -direction.x && newDirection.y !== -direction.y)) {
        direction = newDirection;
    }
});

resetGame();
