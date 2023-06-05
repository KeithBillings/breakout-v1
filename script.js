const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

ctx.fillStyle = '#0095DD'; // default draw color

// GAME VARIABLES
let score = 0;
let lives = 3;

// BALL VARIABLES
const ballRadius = 10;
const ballColors = {
  left: '#FF0000',
  right: '#0000FF',
  top: '#00FF00',
  bottom: 'black',
};
let ballColor = '#0095DD';

// PADDLE VARIABLES
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// KEYBOARD CONTROLS VARIABLES
let rightPressed = false;
let leftPressed = false;

// BRICK VARIABLES
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// BRICKS ARRAY
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// MATH FUNCTIONS
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

// DRAWING FUNCTIONS
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);

  if (x === 0 + ballRadius) {
    ballColor = ballColors.left;
  }
  if (x === canvas.width - ballRadius) {
    ballColor = ballColors.right;
  }
  if (y === 0 + ballRadius) {
    ballColor = ballColors.top;
  }
  if (y === canvas.height - ballRadius) {
    ballColor = ballColors.bottom;
  }

  ctx.fillStyle = ballColor;

  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    // loop through columns
    for (let r = 0; r < brickRowCount; r++) {
      // loop through rows
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft; // calculate brick position
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop; // calculate brick position

        bricks[c][r].x = brickX; // store brick position
        bricks[c][r].y = brickY; // store brick position

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();
  drawScore();
  drawLives();

  // keeping the ball inside the canvas vertically
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  // keeping the ball inside the canvas horizontally
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // paddle controls
  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

// KEYBOARD CONTROLS
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    leftPressed = false;
  }
}

// KEYBOARD CONTROLS EVENT LISTENERS
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// MOUSE CONTROLS
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft; // calculate mouse position relative to canvas

  if (relativeX - paddleWidth / 2 > 0 && relativeX + paddleWidth / 2 < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// MOUSE CONTROLS EVENT LISTENERS
document.addEventListener('mousemove', mouseMoveHandler, false);

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        // if ball is inside a brick
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy; // reverse ball direction
          b.status = 0; // remove brick
          score++; // increase score

          // if all bricks are removed
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

draw();
