import EventEmitter from "./Events";

type Vector2 = {
  x: number;
  y: number;
};

export interface Instance {
  instanceType: string; // Store the instance type
  Position: Vector2;
  Name: string
  Velocity: Vector2;
  Size: Vector2;
  Rotation: number;
  Parent: string;
  CanCollide: boolean;
  Anchored: boolean;
  ImageUrl: string; // Initialize to null
  IsGrounded: boolean
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  collide: (entity: Instance) => void;
}

class InstanceManager {
  Renderer: any;
  private instances: { [key: string]: any }; // Store instances by name

  constructor(Renderer: any) {
    this.Renderer = Renderer;
    this.instances = {}; // Initialize instances object
  }

  getInstances(): Array<Instance> {
    return Object.values(this.instances);
  }

  new(instanceType: string, name?: string): Instance {
    const instance = {
      instanceType: instanceType, // Store the instance type
      Name: name || null,
      Position: { x: 0, y: 0 },
      Velocity: { x: 0, y: 0 },
      Size: { x: 50, y: 50 },
      Rotation: 0,
      Parent: null,
      CanCollide: true,
      Anchored: false,
      IsGrounded: false,
      on: function(event: string, callback: (...args: any[]) => void): void {
        this.eventEmitter.on(event, callback);
      },

      off: function(event: string, callback: (...args: any[]) => void): void {
        this.eventEmitter.off(event, callback);
      },
      eventEmitter: new EventEmitter(),
      collide: function (entity: Instance) {
        this.eventEmitter.emit("Collided", entity); // Use eventEmitter
      },
      ImageUrl: null as HTMLImageElement | null, // Initialize to null
      // Add more properties as needed
    };

    // Generate a unique name if one isn't provided
    const instanceName = name || `${instanceType}_${Date.now()}`;
    this.instances[instanceName] = instance; // Store the instance

    this.Renderer.addItems(instance); // Add the instance to the renderer

    return new Proxy(instance, {
      // Return a Proxy
      set: (target: any, property, value) => {
        target[property] = value; // Set the value

        // Notify the renderer that the instance has been updated
        this.Renderer.updateItem(target);

        return true; // Indicate success
      },
    });
  }

  // Method to get an instance by name
  getInstance(name: string): Instance {
    return this.instances[name];
  }

  // Method to update an instance (if needed)
  updateInstance(instance: any): void {
    this.Renderer.updateItem(instance);
  }
}

export default InstanceManager;
