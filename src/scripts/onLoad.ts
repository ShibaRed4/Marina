import Render from "../engine/Render";
import InstanceManager from "../engine/InstanceManager";
import Util from "../engine/Util";
import InputService from "../engine/InputService";

const UIS = new InputService();
let Instance: InstanceManager; // Declare Instance

export function init(Renderer: Render) {
	// Initialize master instance manager
	Instance = new InstanceManager(Renderer);

	const backGround = Instance.new("Frame"); // Frame refers to Roblox's "Frame" object which is just an image.
	backGround.Position = Util.Vector2(0, 0);
	backGround.Size = Util.Vector2(window.innerWidth, window.innerHeight);
	backGround.ImageUrl = "../../assets/background-1.jpg"; // This will trigger the Proxy

	const player = Instance.new("Player", "MyPlayer"); // Create a player with a specific name
	player.Position = Util.Vector2(100, 100);
	player.Size = Util.Vector2(50, 50);

}

export function onUpdate(){
	const player = Instance.getInstance("MyPlayer")

	if(UIS.getCurrentKeyCode() === "KeyD"){
		player.Position = Util.Vector2(player.Position.x + 5, player.Position.y)
	}
	if(UIS.getCurrentKeyCode() === "KeyA"){
		player.Position = Util.Vector2(player.Position.x - 5, player.Position.y)
	}

}

