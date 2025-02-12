import Render from "./Render";
import { Vector2 } from "./Util";

export interface AnimationObject {
  Image: string;
  FrameAmount: number;
  FPS: number;
  FrameDimensions: Vector2;
}

export enum AnimationStates {
  Playing = "Playing",
  Stopped = "Stopped",
  Paused = "Paused",
  Looping = "Looping",
}

class Animation {
  Renderer: Render;
  loadedAnimations: { [key: string]: AnimationObject };
  state: string;
  currentAnimation: string;
  currentFrame: number;
  constructor(Renderer: Render) {
    this.Renderer = Renderer;
    this.loadedAnimations = {};
    this.state = AnimationStates.Stopped;
    this.currentAnimation = "";
    this.currentFrame = 1;
  }

  getCurrentAnimation(): AnimationObject | undefined {
    if (this.currentAnimation && this.loadedAnimations[this.currentAnimation]) {
      return this.loadedAnimations[this.currentAnimation];
    }
    return undefined; // Or return a default AnimationObject if appropriate
  }

  create(name: string, anim: AnimationObject): void {
    this.loadedAnimations[name] = anim;
  }
  play(name: string): void {
    this.currentAnimation = name;
    this.currentFrame = 1;
    this.state = AnimationStates.Playing;
  }
  stop(): void {
    this.currentAnimation = "";
    this.state = AnimationStates.Stopped;
  }
}

export default Animation;
