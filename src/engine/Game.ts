// engine/Game.ts
import InstanceManager, { Instance } from "./InstanceManager";

class Game {
  private instanceManager: InstanceManager;
  private gravity: number;
  public ctx: CanvasRenderingContext2D;

  constructor(
    instanceManager: InstanceManager,
    ctx: CanvasRenderingContext2D,
    gravity: number = 240,
  ) {
    this.instanceManager = instanceManager;
    this.ctx = ctx;
    this.gravity = gravity;
  }

  checkCollision(
    entity1: Instance,
    entity2: Instance,
  ): { colliding: boolean; xOverlap: number; yOverlap: number } {
    const rect1 = {
      x: entity1.ProjectedPosition?.x ?? entity1.Position.x,
      y: entity1.ProjectedPosition?.y ?? entity1.Position.y,
      width: entity1.ProjectedSize?.x ?? entity1.Size.x,
      height: entity1.ProjectedSize?.y ?? entity1.Size.y,
    };
    const rect2 = {
      x: entity2.ProjectedPosition?.x ?? entity2.Position.x,
      y: entity2.ProjectedPosition?.y ?? entity2.Position.y,
      width: entity2.ProjectedSize?.x ?? entity2.Size.x,
      height: entity2.ProjectedSize?.y ?? entity2.Size.y,
    };

    // Since we're using center-origin coordinates, we need to offset by half the width/height
    // for both rectangles to get their true boundaries
    const rect1Left = rect1.x - rect1.width / 2;
    const rect1Right = rect1.x + rect1.width / 2;
    const rect1Top = rect1.y - rect1.height / 2;
    const rect1Bottom = rect1.y + rect1.height / 2;

    const rect2Left = rect2.x - rect2.width / 2;
    const rect2Right = rect2.x + rect2.width / 2;
    const rect2Top = rect2.y - rect2.height / 2;
    const rect2Bottom = rect2.y + rect2.height / 2;

    // Perform collision check with centered coordinates
    const xOverlap =
      Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left);
    const yOverlap =
      Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top);

    // Check if actually colliding
    const colliding = xOverlap > 0 && yOverlap > 0;

    return {
      colliding,
      xOverlap: colliding ? xOverlap : 0,
      yOverlap: colliding ? yOverlap : 0,
    };
  }

  // Physics Simulation Step
  simulatePhysics(deltaTime: number): void {
    const instances: Instance[] = this.instanceManager.getInstances(); // Use the interface

    // Apply gravity and check for collisions
    for (const instance of instances) {
      // Apply gravity to velocity
      if (instance.Anchored || !instance.Physics) continue; // Now TypeScript knows about Anchored

      // Only apply gravity if not grounded

      instance.Velocity.y += this.gravity * deltaTime;

      // Update position based on velocity
      instance.Position.x += instance.Velocity.x * deltaTime * 10;
      instance.Position.y += instance.Velocity.y * deltaTime * 10;

      // Update the instance in the InstanceManager
      this.instanceManager.updateInstance(instance);
    }

    // Collision Detection (Naive O(n^2) approach)
    for (let i = 0; i < instances.length; i++) {
      for (let j = i + 1; j < instances.length; j++) {
        const entity1 = instances[i];
        const entity2 = instances[j];

        if (entity1.Physics && entity2.Physics) {
          const collisionCheck = this.checkCollision(entity1, entity2);
          if (collisionCheck.colliding) {
          entity1.collide(entity2, {
              xOverlap: collisionCheck.xOverlap,
              yOverlap: collisionCheck.yOverlap,
            });
            entity2.collide(entity1, {
              xOverlap: collisionCheck.xOverlap,
              yOverlap: collisionCheck.yOverlap,
            });
          }
        }
      }
    }
  }
}

export default Game;
