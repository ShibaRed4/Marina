import Render from "../engine/Render";
import Util from "../engine/Util";
import InputService from "../engine/InputService";
import InstanceManager, {
  Camera,
  Instance,
  InstanceType,
} from "../engine/InstanceManager";
import StateMachine, { States } from "./lib/StateMachine";
import PlayerAnimations from "./data/PlayerAnimations"; 

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
  backGround.Texture = "../../assets/background-2.png";

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

  const text = Instance.text("Test");
  text.Size = 65

  const newtext = Instance.text("newTest");
  newtext.Size = 65
  newtext.Position = Util.Vector2(0, 0)

  const player = Instance.new(InstanceType.Part, "MyPlayer");
  player.Position = Util.Vector2(0, 0);
  player.Size = Util.Vector2(100, 100);
  player.Velocity = { x: 0, y: 0 };
  player.IsGrounded = false;

  player.Animator.bulkLoad(PlayerAnimations)

  player.Animator.play("Idle")


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

    if(inputObject.KeyCode === "KeyH"){
	    player.Velocity.x = 0;
	    PlayerStates.changeState(States.ATTACKING)
    } 
  });

  PlayerStates.addInitFunction(States.WALKING, (_oldState: States) => {
    player.Animator.play("Walking");
  });

  PlayerStates.addInitFunction(States.IDLE, () => {
    player.Animator.play("Idle");
  });

  PlayerStates.addInitFunction(States.ATTACKING, () => {
	  console.log("Attacking!")
	  player.Animator.play("Attack")
  })

  player.Animator.onEnd((animation: string) => {
	  if(animation === "Attack"){
		  PlayerStates.changeState(States.IDLE)
	  }
  })

}

export function onUpdate(
  _Renderer: Render,
  Instance: InstanceManager,
  Camera: Camera,
  deltaTime: number
) {


	const fps = 1/deltaTime
  const player = Instance.getInstance("MyPlayer");
  const text = Instance.getUI("Test");
  const pressedKeys = UIS.getPressedKeys();

  text.Text = `FPS: ${Math.round(fps)}`

  // Handle horizontal movement
  if (pressedKeys.some((key) => ["KeyA", "KeyD"].includes(key)))  {
    player.Velocity.x = pressedKeys.includes("KeyD") ? 40 : -40;

    if (PlayerStates.state !== States.WALKING && PlayerStates.state !== States.ATTACKING) {
      PlayerStates.changeState(States.WALKING);
    }
  } else {
    if (PlayerStates.state !== States.IDLE && PlayerStates.state !== States.ATTACKING) {
      PlayerStates.changeState(States.IDLE);
    }
    player.Velocity.x = 0;
  }

  Camera.Position.x = Util.lerp(Camera.Position.x, player.Position.x, 0.9)
  Camera.Position.y = Util.lerp(Camera.Position.y, player.Position.y, 0.9)
}
