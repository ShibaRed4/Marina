// main.ts
import Render from "./engine/Render";

const canvas: HTMLCanvasElement = document.querySelector(".main")!;
const context: CanvasRenderingContext2D = canvas.getContext("2d")!; // Corrected type

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const MainRenderer = new Render(context); // Pass InputService and Player


async function loadAndExecutePlugins(): Promise<void> {
  const pluginFiles = import.meta.glob("./scripts/*.ts");

  for (const filePath in pluginFiles) {
    try {
      const module: any = await pluginFiles[filePath]();

      if (typeof module.onUpdate === "function") {
        MainRenderer.renderFunctions.push(() => module.onUpdate(MainRenderer)); // Pass MainRenderer
      } else {
        console.warn(
          `Script from ${filePath} does not export a 'onUpdate' function.`
        );
      }

      if (typeof module.init === "function") {
        module.init(MainRenderer); // Pass MainRenderer
      }
    } catch (error) {
      console.error(`Error executing script from ${filePath}:`, error);
    }
  }
}

loadAndExecutePlugins();

MainRenderer.start();

