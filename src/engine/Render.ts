import { AnimationStates } from "./Animation";

class Render {
  ctx: CanvasRenderingContext2D;
  renderQueue: Array<any>;
  renderFunctions: Array<(deltaTime: number) => void>;
  currentFrame: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.currentFrame = 0;
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

  getFrameFromSpritesheet(
    spritesheet: HTMLImageElement,
    frameIndex: number,
    frameWidth: number,
    frameHeight: number,
  ): { x: number; y: number; width: number; height: number } {
    // Calculate frames per row in the spritesheet
    const framesPerRow = Math.floor(spritesheet.width / frameWidth);

    // Calculate row and column of the frame
    const row = Math.floor(frameIndex / framesPerRow);
    const col = frameIndex % framesPerRow;

    // Calculate pixel coordinates of the frame
    return {
      x: col * frameWidth,
      y: row * frameHeight,
      width: frameWidth,
      height: frameHeight,
    };
  }

  loadImage(url: string): HTMLImageElement {
    let tempImage = new Image();
    tempImage.src = url;

    return tempImage;
  }

  // Usage examp

  unPack() {
    this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    this.ctx.clearRect(
      -this.ctx.canvas.width / 2,
      -this.ctx.canvas.height / 2,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );

    // Move the origin to the center

    for (const obj of this.renderQueue) {
      const {
        instanceType,
        Position,
        ProjectedPosition,
        ProjectedSize,
        Size,
        Texture,
        Animator,
      } = obj;

      switch (instanceType) {
        case "Frame":
          if (Texture) {
            let htmlImage = new Image(Size.x, Size.y);
            htmlImage.src = Texture;
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
          if (Animator.state === AnimationStates.Playing) {
            let currentAnimation = Animator.getCurrentAnimation();

            if (currentAnimation) {
              let spriteSheet = new Image();
              spriteSheet.src = currentAnimation.Image;

              // When it's time to draw the next frame.
              if (this.currentFrame % currentAnimation.FPS === 0) {
                if (Animator.currentFrame === currentAnimation.FrameAmount) {
                  Animator.currentFrame = 1;
                  Animator.finish(Animator.currentAnimation);
                } else {
                  Animator.currentFrame += 1;
                }
              }

              const frame = this.getFrameFromSpritesheet(
                spriteSheet,
                Animator.currentFrame,
                currentAnimation.FrameDimensions.x,
                currentAnimation.FrameDimensions.y,
              );

              // Final push to draw
              this.ctx.drawImage(
                spriteSheet,
                frame.x,
                frame.y,
                frame.width,
                frame.height,
                ProjectedPosition.x - ProjectedSize.x / 2,
                ProjectedPosition.y - ProjectedSize.y / 2,
                ProjectedSize.x,
                ProjectedSize.y,
              );
            } else {
              // Draw with missing texture if no animation
              let missingTexture = this.loadImage("../assets/missing.jpg");
              this.ctx.drawImage(
                missingTexture,
                ProjectedPosition.x - ProjectedSize.x / 2,
                ProjectedPosition.y - ProjectedSize.y / 2,
                ProjectedSize.x,
                ProjectedSize.y,
              );
            }
          } else {
            // Check for a texture property and load it if it exists
            if (Texture) {
              let textureImage = this.loadImage(Texture); // Assuming 'this.texture' holds the path

              this.ctx.drawImage(
                textureImage,
                ProjectedPosition.x - ProjectedSize.x / 2,
                ProjectedPosition.y - ProjectedSize.y / 2,
                ProjectedSize.x,
                ProjectedSize.y,
              );
            } else {
              // Draw with missing texture if animation is not playing and no texture
              let missingTexture = this.loadImage("../assets/missing.jpg");

              this.ctx.drawImage(
                missingTexture,
                ProjectedPosition.x - ProjectedSize.x / 2,
                ProjectedPosition.y - ProjectedSize.y / 2,
                ProjectedSize.x,
                ProjectedSize.y,
              );
            }
          }
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

      this.currentFrame += 1;
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
