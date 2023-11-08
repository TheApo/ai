var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  dx: 1.5,
  dy: 1.5
};

var paddleHeight = ball.radius * 6;
var paddleWidth = 10;
var paddleY = (canvas.height - paddleHeight) / 2;

var aiPaddleY = paddleY;
var playerScore = 0;
var aiScore = 0;

var upPressed = false;
var downPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
  if(e.key == 'Up' || e.key == 'ArrowUp') upPressed = true;
  if(e.key == 'Down' || e.key == 'ArrowDown') downPressed = true;
}

function keyUpHandler(e) {
  if(e.key == 'Up' || e.key == 'ArrowUp') upPressed = false;
  if(e.key == 'Down' || e.key == 'ArrowDown') downPressed = false;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = '#FFF';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, paddleWidth, paddleHeight);
  ctx.fillStyle = '#FFF';
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#FFF';
  ctx.fillText('Spieler: ' + playerScore, 8, 20);
  ctx.fillText('KI: ' + aiScore, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle(0, paddleY);
  drawPaddle(canvas.width - paddleWidth, aiPaddleY);
  drawScore();

  if(upPressed && paddleY > 0) paddleY -= 7;
  if(downPressed && paddleY < canvas.height - paddleHeight) paddleY += 7;

  // AI difficulty
  var aiSpeed = 3.3;
  if(ball.y < aiPaddleY + paddleHeight/2) aiPaddleY -= aiSpeed;
  if(ball.y + ball.radius > aiPaddleY + paddleHeight/2) aiPaddleY += aiSpeed;

  if(ball.y + ball.dy < ball.radius || ball.y + ball.dy > canvas.height - ball.radius) {
    ball.dy = -ball.dy;
  }

  if(ball.x + ball.dx < ball.radius) {
    if(ball.y > paddleY && ball.y < paddleY + paddleHeight) {
      // Calculate hit point
      let delta = ball.y - (paddleY + paddleHeight / 2);
      ball.dx = -ball.dx;
      ball.dy = delta * 0.3;
    } else {
      aiScore++;
      if(aiScore == 10) {
        alert('KI gewinnt');
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
		ball.dx = 1.5;
		ball.dy = 1.5;
      }
    }
  } else if(ball.x + ball.dx > canvas.width - ball.radius) {
    if(ball.y > aiPaddleY && ball.y < aiPaddleY + paddleHeight) {
      // Calculate hit point
      let delta = ball.y - (aiPaddleY + paddleHeight / 2);
      ball.dx = -ball.dx;
      ball.dy = delta * 0.3;
    } else {
      playerScore++;
      if(playerScore == 10) {
        alert('Spieler gewinnt');
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
		ball.dx = 1.5;
		ball.dy = 1.5;
      }
    }
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
}

setInterval(draw, 10);
