import Render from "../engine/Render";
import Util from "../engine/Util";
import InputService from "../engine/InputService";
import InstanceManager, { Instance } from "../engine/InstanceManager";

const UIS = new InputService();

export function init(_Renderer: Render, Instance: InstanceManager) {
  // Initialize master instance manager

  const backGround = Instance.new("Frame"); // Frame refers to Roblox's "Frame" object which is just an image.
  backGround.Position = Util.Vector2(0, 0);
  backGround.Size = Util.Vector2(window.innerWidth, window.innerHeight);
  backGround.ImageUrl = "../../assets/background-1.jpg"; // This will trigger the Proxy
  backGround.Anchored = true;

  const floor = Instance.new("Part", "Floor");
  floor.Position = Util.Vector2(50, 500);
  floor.Size = Util.Vector2(200, 50);
  floor.Anchored = true;

  const player = Instance.new("Player", "MyPlayer"); // Create a player with a specific name
  player.Position = Util.Vector2(100, 100);
  player.Size = Util.Vector2(50, 50);

  // main.ts
  player.on("Collided", (otherEntity: Instance) => {
    if (otherEntity.Name === "Floor") {
      player.Position = {
        x: player.Position.x,
        y: otherEntity.Position.y - player.Size.y, // Accurate position
      };
      player.Velocity.y = 0; // Stop falling
    }
  });

  UIS.bindInputBegan((inputObject) => {
    if (inputObject.KeyCode === "Space") {
      player.Velocity.y = -65;
    }
  });

  UIS.bindInputEnded((inputObject) => {
	  const movementKeys = ["KeyD", "KeyA"];
})

export function onUpdate(_Renderer: Render, Instance: InstanceManager) {
  const player = Instance.getInstance("MyPlayer");


  if (UIS.getCurrentKeyCode() === "KeyD") {
    player.Velocity.x = 20;
  }
  if (UIS.getCurrentKeyCode() === "KeyA") {
    player.Velocity.x = -20;
  }
}
