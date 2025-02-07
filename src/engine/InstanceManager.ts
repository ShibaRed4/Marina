class InstanceManager {
  Position: { x: number; y: number };
  Velocity: { x: number; y: number };
  Size: { x: number; y: number };
  Rotation: number;
  Parent: Object;
  Image: HTMLImageElement | null;
  Renderer: any;
  private instanceData: any; // Store the instance data

  constructor(Renderer: any) {
    this.Position = { x: 0, y: 0 };
    this.Velocity = { x: 0, y: 0 };
    this.Size = { x: 50, y: 50 };
    this.Rotation = 0;
    this.Parent = {};
    this.Image = null;
    this.Renderer = Renderer;
    this.instanceData = null; // Initialize instanceData
  }

  new() {
    this.instanceData = {
      Position: { ...this.Position },
      Size: { ...this.Size },
      Velocity: { ...this.Velocity },
      Rotation: this.Rotation,
      Parent: this.Parent,
      Image: this.Image,
    };

    this.Renderer.addItems(this.instanceData);
  }

  updatePosition(newX: number, newY: number): void {
    this.Position.x = newX;
    this.Position.y = newY;

    if (this.instanceData) {
      this.instanceData.Position.x = newX;
      this.instanceData.Position.y = newY;
    }
  }
}

export default InstanceManager;
