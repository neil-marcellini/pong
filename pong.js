class PongGame {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    this.drawScreen();
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  drawScreen() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
  }
}

const game = new PongGame();