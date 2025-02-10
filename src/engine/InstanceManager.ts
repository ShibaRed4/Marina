import EventEmitter from "./Events";
import Util from "./Util";

type Vector2 = {
  x: number;
  y: number;
};

export interface Instance {
  instanceType: string; // Store the instance type
  Position: Vector2;
  Name: string;
  Velocity: Vector2;
  Size: Vector2;
  ProjectedSize: Vector2;
  ProjectedPosition: Vector2;
  Rotation: number;
  Parent: string;
  CanCollide: boolean;
  Anchored: boolean;
  ImageUrl: any; // Initialize to null
  IsGrounded: boolean;
  eventEmitter: EventEmitter;
  Physics: boolean;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  collide: (entity: Instance) => void;
}

export interface Camera {
  Zoom: number;
  Position: Vector2;
  FOV: number;
}

export enum InstanceType {
  Part = "Part",
  Camera = "Camera",
  Frame = "Frame",
}

class InstanceManager {
  Renderer: any;
  private instances: { [key: string]: any }; // Store instances by name

  constructor(Renderer: any) {
    this.Renderer = Renderer;
    this.instances = {}; // Initialize instances object
  }

  private genInstances(instanceType: InstanceType) {
    switch (instanceType) {
      case InstanceType.Part:
        return {
          instanceType: instanceType, // Store the instance type
          Name: "",
          Position: { x: 0, y: 0 },
          Velocity: { x: 0, y: 0 },
          Size: { x: 50, y: 50 },
	  ProjectedSize: {x: 50, y: 50},
	  ProjectedPosition: {x: 0, y: 0},
          Rotation: 0,
          Parent: null,
          CanCollide: true,
          Anchored: false,
          IsGrounded: false,
	  Physics: true,
          on: function (
            event: string,
            callback: (...args: any[]) => void,
          ): void {
            this.eventEmitter.on(event, callback);
          },

          off: function (
            event: string,
            callback: (...args: any[]) => void,
          ): void {
            this.eventEmitter.off(event, callback);
          },
          eventEmitter: new EventEmitter(),
          collide: function (entity: Instance) {
            this.eventEmitter.emit("Collided", entity); // Use eventEmitter
          },
          ImageUrl: null as HTMLImageElement | null, // Initialize to null
        };
      case InstanceType.Camera:
        return {
          instanceType: instanceType,
          Name: "Camera",
          Position: Util.Vector2(0,0),
	  Size: Util.Vector2(0,0),
	  ProjectedSize: Util.Vector2(0,0),
          Zoom: 1,
	  FOV: 90,
	  Physics: false,
        };
      case InstanceType.Frame:
        return {
          instanceType: instanceType,
          Position: Util.Vector2(0, 0),
          Name: "",
          Parent: "",
          Rotation: 0,
          Size: Util.Vector2(0, 0),
	  Physics: false,
        };
    }
  }

  getInstances(): Array<Instance> {
    return Object.values(this.instances);
  }

  new(instanceType: InstanceType, name?: string): Instance {
    // Generate a unique name if one isn't provided
    const instance = this.genInstances(instanceType);
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
