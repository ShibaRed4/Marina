import Render from "../engine/Render";
import Util from "../engine/Util";
import InputService from "../engine/InputService";
import InstanceManager, {
  Camera,
  Instance,
  InstanceType,
} from "../engine/InstanceManager";

const UIS = new InputService();

export function init(
  _Renderer: Render,
  Instance: InstanceManager,
  _Camera: Camera,
) {
  // Initialize master instance manager

  const backGround = Instance.new(InstanceType.Frame, "Background");
  backGround.Position = Util.Vector2(0, 0);
  backGround.Size = Util.Vector2(window.innerWidth, window.innerHeight);
  backGround.ImageUrl = "../../assets/background-1.jpg";

  const floor = Instance.new(InstanceType.Part, "Floor");
  floor.Position = Util.Vector2(0, 250);
  floor.Size = Util.Vector2(1000, 100);
  floor.Anchored = true;

  const player = Instance.new(InstanceType.Part, "MyPlayer");
  player.Position = Util.Vector2(0, 0);
  player.Size = Util.Vector2(100, 100);
  player.Velocity = { x: 0, y: 0 };
  player.IsGrounded = false;

  // Collision handling
  player.on("Collided", (otherEntity: Instance) => {
	  player.Position = {
		  x: player.Position.x,
		  y: otherEntity.Position.y - player.Size.y
	  }
	  player.Velocity.y = 0;
	  player.IsGrounded = true;
  });
  // Input bindings
  UIS.bindInputBegan((inputObject) => {
    // Handle jumping
    if (inputObject.KeyCode === "Space" && player.IsGrounded) {
      player.Velocity.y = -65;
      player.IsGrounded = false;
    }
  });
}

export function onUpdate(
  _Renderer: Render,
  Instance: InstanceManager,
  Camera: Camera,
) {
  const player = Instance.getInstance("MyPlayer");
  const pressedKeys = UIS.getPressedKeys();

  // Handle horizontal movement
  if (pressedKeys.some((key) => ["KeyA", "KeyD"].includes(key))) {
    player.Velocity.x = pressedKeys.includes("KeyD") ? 40 : -40;
  } else {
    player.Velocity.x = 0;
  }

  Camera.Position = player.Position;

  if (UIS.getPressedKeys().includes("ArrowUp")) {
    Camera.Zoom += 0.1;
  }
  if (UIS.getPressedKeys().includes("ArrowDown")) {
    if (Camera.Zoom - 0.1 < 0.1) return;
    Camera.Zoom -= 0.1;
  }
}
