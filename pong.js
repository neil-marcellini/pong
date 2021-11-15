class Player {
  constructor(canvas, ctx, playerNumber) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.playerNumber = playerNumber;
    this.score = 0;
    this.paddleWallMargin = 10;
    this.paddleWidth = 20;
    this.paddleHeight = 80;
    this.paddleY = this.canvas.height / 2 - this.paddleHeight / 2;
    this.paddleVelocity = 0;
    this.paddleSpeed = 5;
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
      this.paddleVelocity = -5;
    } else if (down) {
      this.paddleVelocity = 5;
    }
  }

  onKeyUp(e) {
    const up = e.key === this.upKey;
    const down = e.key === this.downKey;
    if (!up && !down) {
      return;
    }
    this.paddleVelocity = 0;
  }

  updatePaddleY() {
    let newPaddleY = this.paddleY + this.paddleVelocity;
    if (newPaddleY < 0) {
      newPaddleY = 0;
    }
    if (newPaddleY + this.paddleHeight > this.canvas.height) {
      newPaddleY = this.canvas.height - this.paddleHeight;
    }
    this.paddleY = newPaddleY;
    this.drawPaddle();
  }

  drawPaddle() {
    let x;
    if (this.playerNumber === 1) {
      x = this.paddleWallMargin;
    } else {
      x = this.canvas.width - this.paddleWidth - this.paddleWallMargin;
    }
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(x, this.paddleY, this.paddleWidth, this.paddleHeight);
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
    let ballRightBoundary = newBallX + this.ballRadius;
    let hitLeftPaddleFront = ballLeftBoundary < this.paddleWallMargin + this.paddleWidth;
    let hitRightPaddleFront = ballRightBoundary > this.canvas.width - this.paddleWallMargin - this.paddleWidth;
    if (hitLeftPaddleFront || hitRightPaddleFront) {
      this.ballXVelocity *= -1;
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