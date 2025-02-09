class Render {
  ctx: CanvasRenderingContext2D;
  renderQueue: Array<any>;
  renderFunctions: Array<(deltaTime: number) => void>;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.renderQueue = [];
    this.renderFunctions = [];
  }

  addItems(Instance: any) {
    this.renderQueue.push(Instance);
  }

  updateItem(updatedInstance: any): void {
    // Find the instance in the renderQueue and update it
    for (let i = 0; i < this.renderQueue.length; i++) {
      if (this.renderQueue[i] === updatedInstance) {
        // Update the instance in place
        this.renderQueue[i] = updatedInstance;
        return; // Exit after updating
      }
    }
  }

  unPack() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (const obj of this.renderQueue) {
      const { instanceType, Position, Size, ImageUrl } = obj; // Get instanceType

      switch (instanceType) {
        case "Frame":
          // Draw a Frame (assumed to be an image)
          if (ImageUrl) {
            let htmlImage = new Image(Size.x, Size.y);
            htmlImage.src = ImageUrl;
            this.ctx.drawImage(
              htmlImage,
              Position.x,
              Position.y,
              Size.x,
              Size.y,
            );
          }
          break;
        case "Sprite":
          // Draw a Sprite (you'll need to implement sprite drawing logic)
          // Example: this.drawSprite(obj);
          console.log("Drawing Sprite (not implemented)");
          break;
        default:
          // Draw a default rectangle if instanceType is unknown
          this.ctx.fillStyle = "white";
          this.ctx.fillRect(Position.x, Position.y, Size.x, Size.y);
          break;
      }
    }
  }

  start() {
    let lastTime = 0;

    const loop = (currentTime: number) => {
      let deltaTime = (currentTime - lastTime) / 1000;
      deltaTime = Math.min(deltaTime, 0.1);

      lastTime = currentTime;

      this.unPack(); // Call unPack inside the loop

      // Call renderFunctions after unPack
      for (const runtimeFunction of this.renderFunctions) {
        runtimeFunction(deltaTime);
      }

      requestAnimationFrame(loop); // Use the loop function
    };

    loop(0); // Start the loop
  }
}

export default Render;
