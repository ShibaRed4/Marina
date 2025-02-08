type Vector2 = {
	x: number,
	y: number
}

class InstanceManager {
  Renderer: any;
  private instances: { [key: string]: any }; // Store instances by name

  constructor(Renderer: any) {
    this.Renderer = Renderer;
    this.instances = {}; // Initialize instances object
  }

  new(instanceType: string, name?: string): any {
    const instance = {
      instanceType: instanceType, // Store the instance type
      Position: { x: 0, y: 0 },
      Velocity: { x: 0, y: 0 },
      Size: { x: 50, y: 50 },
      Rotation: 0,
      Parent: null,
      ImageUrl: null as HTMLImageElement | null, // Initialize to null
      // Add more properties as needed
    };

    // Generate a unique name if one isn't provided
    const instanceName = name || `${instanceType}_${Date.now()}`;

    this.instances[instanceName] = instance; // Store the instance

    this.Renderer.addItems(instance); // Add the instance to the renderer

    return new Proxy(instance, { // Return a Proxy
      set: (target: any, property, value) => {
        target[property] = value; // Set the value

        // Notify the renderer that the instance has been updated
        this.Renderer.updateItem(target);

        return true; // Indicate success
      },
    });
  }

  // Method to get an instance by name
  getInstance(name: string): {instanceType: string, Position: Vector2, Velocity: Vector2, Size: Vector2, Rotation: number, Parent: string, Image: string}  {
    return this.instances[name];
  }

  // Method to update an instance (if needed)
  updateInstance(instance: any): void {
    this.Renderer.updateItem(instance);
  }
}

export default InstanceManager;

