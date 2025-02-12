import Render from "../engine/Render";
import Util from "../engine/Util";
import InputService from "../engine/InputService";
import InstanceManager, {
  Camera,
  Instance,
  InstanceType,
} from "../engine/InstanceManager";
import StateMachine, { States } from "./lib/StateMachine";

const PlayerStates = new StateMachine();
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
  backGround.Texture = "../../assets/background-1.jpg";

  const floor = Instance.new(InstanceType.Part, "Floor");
  floor.Position = Util.Vector2(0, 250);
  floor.Size = Util.Vector2(1000, 100);
  floor.Anchored = true;

  const wall = Instance.new(InstanceType.Part, "Wall");
  wall.Size = Util.Vector2(25, 100);
  wall.Position = Util.Vector2(
    floor.Position.x + floor.Size.x / 2 - wall.Size.x / 2,
    150,
  );
  wall.Anchored = true;

  const player = Instance.new(InstanceType.Part, "MyPlayer");
  player.Position = Util.Vector2(0, 0);
  player.Size = Util.Vector2(100, 100);
  player.Velocity = { x: 0, y: 0 };
  player.IsGrounded = false;

  player.Animator.create("Idle", {
    Image: "../../assets/Idle.png",
    FrameDimensions: Util.Vector2(128, 128),
    FPS: 6,
    FrameAmount: 6,
  });

  player.Animator.create("Walk", {
    Image: "../../assets/Walk.png",
    FrameDimensions: Util.Vector2(128, 128),
    FPS: 6,
    FrameAmount: 11,
  });

  player.Animator.play("Idle");

  // Collision handling

  player.on(
    "Collided",
    (
      otherEntity: Instance,
      overlap: { xOverlap: number; yOverlap: number },
    ) => {
      if (overlap.xOverlap < overlap.yOverlap) {
        // Side collision
        console.log("Side collision!");
        const targetX =
          player.Position.x < otherEntity.Position.x
            ? otherEntity.Position.x -
              otherEntity.Size.x / 2 -
              player.Size.x / 2 // left side
            : otherEntity.Position.x +
              otherEntity.Size.x / 2 +
              player.Size.x / 2; // right side

        player.Position.x = Util.lerp(
          player.Position.x,
          targetX,
          0.5, // You can adjust this value to control smoothness
        );
        player.Velocity.x = 0;
      } else {
        // Top/Bottom collision
        const targetY =
          player.Position.y < otherEntity.Position.y
            ? otherEntity.Position.y -
              otherEntity.Size.y / 2 -
              player.Size.y / 2 // above
            : otherEntity.Position.y +
              otherEntity.Size.y / 2 +
              player.Size.y / 2; // below

        player.Position = Util.Vector2(player.Position.x, targetY + 0.0001);
        player.IsGrounded = true;

        player.Velocity.y = 0;
      }
    },
  );

  UIS.bindInputBegan((inputObject) => {
    // Handle jumping
    if (inputObject.KeyCode === "Space" && player.IsGrounded) {
      console.log("Attempting to jump");
      player.Velocity.y = -65;
      player.IsGrounded = false;
      player.Position.y -= 1; // Small offset to ensure we're clear of the ground
    }
  });

  PlayerStates.addInitFunction(States.WALKING, (_oldState: States) => {
    player.Animator.play("Walk");
  });

  PlayerStates.addInitFunction(States.IDLE, () => {
    player.Animator.play("Idle");
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

    if (PlayerStates.state !== States.WALKING) {
      PlayerStates.changeState(States.WALKING);
    }
  } else {
    if (PlayerStates.state !== States.IDLE) {
      PlayerStates.changeState(States.IDLE);
    }
    player.Velocity.x = 0;
  }

  Camera.Position.x = Util.lerp(Camera.Position.x, player.Position.x, 0.9)
  Camera.Position.y = Util.lerp(Camera.Position.y, player.Position.y, 0.9)
}
