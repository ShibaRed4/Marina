import Animation from "./Animation";
import EventEmitter from "./Events";
import Util, { Color } from "./Util";

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
  Animator: Animation;
  Texture: any; // Initialize to null
  IsGrounded: boolean;
  eventEmitter: EventEmitter;
  Physics: boolean;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  collide: (
    entity: Instance,
    overlaps: { xOverlap: number; yOverlap: number },
  ) => void;
}

export interface Camera {
  Zoom: number;
  Position: Vector2;
  FOV: number;
}

export interface Text {
  Text: string;
  Color: Color;
  Position: Vector2;
  Size: number;
}

export enum InstanceType {
  Part = "Part",
  Camera = "Camera",
  Frame = "Frame",
}

class InstanceManager {
  Renderer: any;
  private instances: { [key: string]: any }; // Store instances by name
  private ui: {[key: string]: any}

  constructor(Renderer: any) {
    this.Renderer = Renderer;
    this.instances = {}; // Initialize instances object
    this.ui = {};
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
          ProjectedSize: { x: 50, y: 50 },
          ProjectedPosition: { x: 0, y: 0 },
          Rotation: 0,
          Parent: null,
          CanCollide: true,
          Animator: new Animation(this.Renderer),
          Anchored: false,
          IsGrounded: false,
          Physics: true,
          Frame: 0,
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
          collide: function (
            entity: Instance,
            overlaps: { xOverlap: number; yOverlap: number },
          ) {
            this.eventEmitter.emit("Collided", entity, overlaps); // Use eventEmitter
          },
          Texture: null as HTMLImageElement | null, // Initialize to null
        };
      case InstanceType.Camera:
        return {
          instanceType: instanceType,
          Name: "Camera",
          Position: Util.Vector2(0, 0),
          Size: Util.Vector2(0, 0),
          ProjectedSize: Util.Vector2(0, 0),
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

  text(name: string): Text {
    const UILayer: HTMLDivElement = document.querySelector(".ui")!;

    // Create the HTML element for the text
    const htmlElement = document.createElement("div");
    htmlElement.className = name;

    // Initial text instance
    const textInstance = {
      Text: "Hello World",
      Color: Util.Color(255, 255, 255, 1),
      Size: 30, // Set an initial size
      Position: Util.Vector2(0, 0),
    };

    // Function to update the HTML element based on textInstance properties
    const updateElement = () => {
      htmlElement.innerHTML = textInstance.Text;
      htmlElement.style.transform = `translate(${textInstance.Position.x}px, ${textInstance.Position.y}px)`;
      htmlElement.style.fontSize = `${textInstance.Size}px`;
      htmlElement.style.fontFamily = "pixelArtFont";
      htmlElement.style.color = `rgba(${textInstance.Color.r}, ${textInstance.Color.g}, ${textInstance.Color.b}, ${textInstance.Color.a})`;
    };

    // Create a proxy to watch for changes to textInstance
    const handler = {
      set(target: any, property: string, value: any) {
        target[property] = value; // Update the property
        updateElement(); // Update the HTML element whenever a property changes
        return true; // Indicate success
      },
    };

    // Create a proxy for textInstance
    const reactiveTextInstance = new Proxy(textInstance, handler);

    // Initial update to set the element's properties
    updateElement();

    // Append the HTML element to the UI layer
    UILayer.appendChild(htmlElement);

    this.ui[name] = reactiveTextInstance;

    return reactiveTextInstance; // Return the reactive instance
  }

  // Method to get an instance by name
  getInstance(name: string): Instance {
    return this.instances[name];
  }

  getUI(name: string) {
	  return this.ui[name]
  }

  // Method to update an instance (if needed)
  updateInstance(instance: any): void {
    this.Renderer.updateItem(instance);
  }
}

export default InstanceManager;
