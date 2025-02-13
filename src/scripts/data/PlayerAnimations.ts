import Util from "../../engine/Util";

const PlayerAnimations = {
  ["Idle"]: {
    Image: "../../assets/Idle.png",
    FrameDimensions: Util.Vector2(128, 128),
    FPS: 6,
    FrameAmount: 6,
  },
  ["Walking"]: {
    Image: "../../assets/Walk.png",
    FrameDimensions: Util.Vector2(128, 128),
    FPS: 6,
    FrameAmount: 11,
  },
  ["Attack"]: {
    Image: "../../assets/Attack.png",
    FrameDimensions: Util.Vector2(128, 128),
    FPS: 4,
    FrameAmount: 7,
  },
};

export default PlayerAnimations;
