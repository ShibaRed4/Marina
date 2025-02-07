class Render {
  ctx: CanvasRenderingContext2D;
  renderQueue: Array<any>;
  renderFunctions: Array<() => void>;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.renderQueue = [];
    this.renderFunctions = [];
  }

  addItems(Instance: any) {
    this.renderQueue.push(Instance);
  }

  unPack() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (const obj of this.renderQueue) {
      const { Position, Size, Image } = obj; // Corrected property names

      if (Image) {
        // Draw image sprite
        this.ctx.drawImage(
          Image, // Use Image instead of sprite
          Position.x,
          Position.y,
          Size.x, // Use Size.x as width
          Size.y // Use Size.y as height
        );
      } else {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(Position.x, Position.y, Size.x, Size.y);
      }
    }
  }

  start() {
    const loop = () => {
      this.unPack(); // Call unPack inside the loop

      // Call renderFunctions after unPack
      for (const runtimeFunction of this.renderFunctions) {
        runtimeFunction();
      }

      requestAnimationFrame(loop); // Use the loop function
    };

    loop(); // Start the loop
  }
}

export default Render;

