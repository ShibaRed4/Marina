// main.ts
import Game from "./engine/Game";
import InstanceManager, {
  InstanceType,
} from "./engine/InstanceManager";
import Render from "./engine/Render";

const canvas: HTMLCanvasElement = document.querySelector(".main")!;
const context: CanvasRenderingContext2D = canvas.getContext("2d")!; // Corrected type

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const MainRenderer = new Render(context); // Pass InputService and Player
const MainInstanceManager = new InstanceManager(MainRenderer);
const MainCamera = MainInstanceManager.new(InstanceType.Camera);
const MainGame = new Game(MainInstanceManager, context);

async function loadScripts(): Promise<void> {
  const pluginFiles = import.meta.glob("./scripts/*.ts");

  for (const filePath in pluginFiles) {
    try {
      const module: any = await pluginFiles[filePath]();

      if (typeof module.onUpdate === "function") {
        MainRenderer.renderFunctions.push((deltaTime: number) =>
          module.onUpdate(MainRenderer, MainInstanceManager, MainCamera, deltaTime),
        ); // Pass MainRenderer
      } else {
        console.warn(
          `Script from ${filePath} does not export a 'onUpdate' function.`,
        );
      }

      if (typeof module.init === "function") {
        module.init(MainRenderer, MainInstanceManager, MainCamera); // Pass MainRenderer
      }
    } catch (error) {
      console.error(`Error executing script from ${filePath}:`, error);
    }
  }
}

loadScripts();

MainRenderer.renderFunctions.push((deltaTime: number) => {
  // Simulate physics after adjusting position
  const allInstances = MainInstanceManager.getInstances();

  for (let instance of allInstances) {
    if (instance.instanceType === InstanceType.Camera) continue;

    // Get the active camera (assuming there's only one camera)
    if (MainCamera) {
      // Calculate projected position and size based on the camera
	//@ts-ignore
      const zoomFactor = MainCamera.Zoom;

      // Projected Position: Adjust for camera position and zoom
      instance.ProjectedPosition = {
        x: (instance.Position.x - MainCamera.Position.x) * zoomFactor,
        y: (instance.Position.y - MainCamera.Position.y) * zoomFactor,
      };

      // Projected Size: Scale by zoom
      
      instance.ProjectedSize = {
        x: instance.Size.x * zoomFactor,
        y: instance.Size.y * zoomFactor,
      };

    } else {
      // If no camera, use original position and size
      instance.ProjectedPosition = { ...instance.Position };
      instance.ProjectedSize = { ...instance.Size };
    }
  }

  // Simulate physics
  MainGame.simulatePhysics(deltaTime);
});

MainRenderer.start();
