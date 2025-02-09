// engine/Game.ts
import InstanceManager, { Instance } from "./InstanceManager";

class Game {
  private instanceManager: InstanceManager;
  private gravity: number;

  constructor(instanceManager: InstanceManager, gravity: number = 240) {
    this.instanceManager = instanceManager;
    this.gravity = gravity;
  }

  checkCollision(entity1: Instance, entity2: Instance): boolean {
    const rect1 = {
      x: entity1.Position.x,
      y: entity1.Position.y,
      width: entity1.Size.x,
      height: entity1.Size.y,
    };
    const rect2 = {
      x: entity2.Position.x,
      y: entity2.Position.y,
      width: entity2.Size.x,
      height: entity2.Size.y,
    };

    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  // Physics Simulation Step
  simulatePhysics(deltaTime: number): void {
    const instances: Instance[] = this.instanceManager.getInstances(); // Use the interface

    // Apply gravity and check for collisions
    for (const instance of instances) {
      // Apply gravity to velocity
      if (instance.Anchored) continue; // Now TypeScript knows about Anchored

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

        if (this.checkCollision(entity1, entity2)) {
          // Trigger the Collided event on both entities
          entity1.collide(entity2);
          entity2.collide(entity1);
        }
      }
    }
  }
}

export default Game;
