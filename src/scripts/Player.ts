import Render from "../engine/Render";
import InstanceManager from "../engine/InstanceManager";
import InputService from "../engine/InputService";
import Util from "../engine/Util";

const movementManager = new InputService()
var newPlayer: InstanceManager;

export function init(Renderer: Render){
	newPlayer = new InstanceManager(Renderer)
	newPlayer.Position = Util.Vector2(200,100)
	newPlayer.Renderer = Renderer
	newPlayer.new()
}

export function onUpdate(){
	if(movementManager.getCurrentKeyCode() === "KeyD"){
		newPlayer.updatePosition(newPlayer.Position.x + 5, newPlayer.Position.y)
	}
	if(movementManager.getCurrentKeyCode() === "KeyA"){
		newPlayer.updatePosition(newPlayer.Position.x - 5, newPlayer.Position.y)
	}
}
