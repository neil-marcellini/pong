class Paddle {
  static wallMargin = 10;
  static width = 20;
  static height = 80;
  static speed = 5;
  constructor(canvas) {
    this.canvas = canvas;
    this.y = this.canvas.height / 2 - Paddle.height / 2;
    this.velocity = 0;
  }
}

class Player {
  constructor(canvas, ctx, playerNumber) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.playerNumber = playerNumber;
    this.score = 0;
    this.paddle = new Paddle(this.canvas);
    this.addKeyListeners();
  }

  addKeyListeners() {
    this.upKey = 'ArrowUp';
    this.downKey = 'ArrowDown';
    if (this.playerNumber === 1) {
      this.upKey = 'w'
      this.downKey = 's'
    }
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));
  }

  onKeyDown(e) {
    const up = e.key === this.upKey;
    const down = e.key === this.downKey;
    if (!up && !down) {
      return;
    }
    if (up) {
      this.paddle.velocity = -5;
    } else if (down) {
      this.paddle.velocity = 5;
    }
  }

  onKeyUp(e) {
    const up = e.key === this.upKey;
    const down = e.key === this.downKey;
    if (!up && !down) {
      return;
    }
    this.paddle.velocity = 0;
  }

  updatePaddleY() {
    let newPaddleY = this.paddle.y + this.paddle.velocity;
    if (newPaddleY < 0) {
      newPaddleY = 0;
    }
    if (newPaddleY + Paddle.height > this.canvas.height) {
      newPaddleY = this.canvas.height - Paddle.height;
    }
    this.paddle.y = newPaddleY;
    this.drawPaddle();
  }

  drawPaddle() {
    let x;
    if (this.playerNumber === 1) {
      x = Paddle.wallMargin;
    } else {
      x = this.canvas.width - Paddle.width - Paddle.wallMargin;
    }
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(x, this.paddle.y, Paddle.width, Paddle.height);
  }
  
}
class PongGame {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.midHeight;
    this.midWidth;
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', this.resizeCanvas, false);
    this.resizeCanvas();

    this.ctx = this.canvas.getContext('2d');

    
    this.player1 = new Player(this.canvas, this.ctx, 1);
    this.player2 = new Player(this.canvas, this.ctx, 2);
    this.player1.drawPaddle();
    this.player2.drawPaddle();

    this.ballRadius = 20;
    this.ballX = this.midWidth;
    this.ballY = this.midHeight;
    this.initialBallVelocity();

    this.animationLoop();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.midWidth = this.canvas.width / 2;
    this.midHeight = this.canvas.height / 2;
  }

  drawScreen() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    // Dashed line
    this.ctx.strokeStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.lineWidth = 10;
    this.ctx.setLineDash([20, 10]);
    this.ctx.moveTo(this.midWidth, 0);
    this.ctx.lineTo(this.midWidth, this.canvas.height);
    this.ctx.stroke();
  }

  drawBall() {
    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath()
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, 2 * Math.PI, false);
    this.ctx.fill();
  }

  

  /**
   * Set a random initial ball velocity.
   */
  initialBallVelocity() {
    let ballVelocityMultiplier = 5;
    let minVelocity = 2;
    let xDirection = 1;
    let yDirection = 1;
    if (Math.random() > 0.5) {
      xDirection = -1;
    }
    if (Math.random() > 0.5) {
      yDirection = -1;
    }
    this.ballXVelocity = Math.max(minVelocity, Math.random() * ballVelocityMultiplier) * xDirection;
    this.ballYVelocity = Math.max(minVelocity, Math.random() * ballVelocityMultiplier) * yDirection;
  }

  updateBall() {
    let newBallX = this.ballX + this.ballXVelocity; 
    let newBallY = this.ballY + this.ballYVelocity;

    let ballLeftBoundary = newBallX - this.ballRadius;
    let ballRightBoundary = newBallX + this.ballRadius;
    let hitLeftWall = ballLeftBoundary <= 0;  
    let hitRightWall = ballRightBoundary >= this.canvas.width;

    if (hitLeftWall || hitRightWall) {
      this.ballXVelocity *= -1;
    }

    let ballTopBoundary = newBallY - this.ballRadius;
    let ballBottomBoundary = newBallY + this.ballRadius;
    let hitTopWall = ballTopBoundary <= 0;  
    let hitBottomWall = ballBottomBoundary >= this.canvas.height;

    if (hitTopWall || hitBottomWall) {
      this.ballYVelocity *= -1;
    }

    this.detectPaddleHit(newBallX, newBallY);

    this.ballX = this.ballX + this.ballXVelocity;
    this.ballY = this.ballY + this.ballYVelocity;

    this.drawBall();
  }

  detectPaddleHit(newBallX, newBallY) {
    let ballLeftBoundary = newBallX - this.ballRadius;
    let leftPaddleTop = this.player1.paddle.y - Paddle.height / 2; 
    let leftPaddleBottom = this.player1.paddle.y + Paddle.height / 2;
    let matchesLeftHeight = newBallY >= leftPaddleTop  && newBallY <= leftPaddleBottom;
    let leftPaddleFront = Paddle.wallMargin + Paddle.width;
    let hitLeftPaddleFront = ballLeftBoundary < leftPaddleFront && matchesLeftHeight; 

    let ballRightBoundary = newBallX + this.ballRadius;
    let rightPaddleTop = this.player2.paddle.y - Paddle.height / 2; 
    let rightPaddleBottom = this.player2.paddle.y + Paddle.height / 2;
    let matchesRightHeight = newBallY >= rightPaddleTop  && newBallY <= rightPaddleBottom;
    let rightPaddleFront = this.canvas.width - Paddle.wallMargin - Paddle.width;
    let hitRightPaddleFront = ballRightBoundary > rightPaddleFront && matchesRightHeight; 

    if (hitLeftPaddleFront || hitRightPaddleFront) {
      this.ballXVelocity *= -1;
    } else {
      // someone scored

    }

  }

  animationLoop() {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.drawScreen();
    this.updateBall();
    this.player1.updatePaddleY();
    this.player2.updatePaddleY();
    requestAnimationFrame(() => this.animationLoop());
  }

}

const game = new PongGame();