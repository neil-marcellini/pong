class Player {
  constructor(playerNumber) {
    this.playerNumber = playerNumber;
    this.score = 0;
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

    this.paddleWallMargin = 10;
    this.paddleWidth = 20;
    this.paddleHeight = 80;
    this.player1 = new Player(1);
    this.player2 = new Player(2);

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

  drawPaddle(y, playerNumber) {
    let x;
    if (playerNumber === 1) {
      x = this.paddleWallMargin;
    } else {
      x = this.canvas.width - this.paddleWidth - this.paddleWallMargin;
    }
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(x, y, this.paddleWidth, this.paddleHeight);
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

    this.ballX = newBallX;
    this.ballY = newBallY;

    this.drawBall();
  }

  animationLoop() {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.drawScreen();
    this.updateBall();
    this.drawPaddle(this.canvas.height / 2 - this.paddleHeight / 2, 1);
    this.drawPaddle(this.canvas.height / 2 - this.paddleHeight / 2, 2);

    requestAnimationFrame(() => this.animationLoop());
  }

}

const game = new PongGame();