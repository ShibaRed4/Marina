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
    this.ctx.clearRect(
      -this.ctx.canvas.width / 2,
      -this.ctx.canvas.height / 2,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    // Move the origin to the center
    this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

    for (const obj of this.renderQueue) {
      const {
        instanceType,
        Position,
        ProjectedPosition,
        ProjectedSize,
        Size,
        ImageUrl,
      } = obj;

      switch (instanceType) {
        case "Frame":
          if (ImageUrl) {
            let htmlImage = new Image(Size.x, Size.y);
            htmlImage.src = ImageUrl;
            this.ctx.drawImage(
              htmlImage,
              Position.x - Size.x / 2,
              Position.y - Size.y / 2,
              Size.x,
              Size.y,
            );
          }
          break;
        case "Camera":
          break;
        case "Part":
          this.ctx.fillStyle = "white";
          this.ctx.fillRect(
            ProjectedPosition.x - ProjectedSize.x / 2,
            ProjectedPosition.y - ProjectedSize.y / 2,
            ProjectedSize.x,
            ProjectedSize.y,
          );
          break;
      }
    }

    // Reset the transformation matrix to avoid cumulative translations
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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
