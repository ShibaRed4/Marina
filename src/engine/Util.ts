import { Camera, Instance } from "./InstanceManager";

class Util {
  static wait(seconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000); // Convert seconds to milliseconds
    });
  }
  static Vector2(x: number, y: number): { x: number; y: number } {
    return { x: x, y: y };
  }

  static calculateProjectedPosition(camera: Camera, object: Instance) {
    const X_object = object.Position.x;
    const Y_object = object.Position.y;

    const X_camera = camera.Position.x;
    const Y_camera = camera.Position.y;

    const FOV = camera.FOV;
    const Zoom = camera.Zoom;

    // Calculate the relative position of the object
    const X_relative = X_object - X_camera;
    const Y_relative = Y_object - Y_camera;

    // Convert FOV to radians
    const FOV_rad = (FOV * Math.PI) / 180;

    // Assume a fixed Z distance (you can modify this as needed)
    const Z = 5; // Distance from the camera to the object

    // Calculate projected height and width
    const H_image = 2 * (Zoom * Math.tan(FOV_rad / 2));
    const W_image = H_image * (object.Size.x / object.Size.y);

    // Calculate projected positions
    const X_view = (X_relative / Z) * (Zoom * Math.tan(FOV_rad / 2));
    const Y_view = (Y_relative / Z) * (Zoom * Math.tan(FOV_rad / 2));

    return {
      projectedPosition: {
        x: X_view,
        y: Y_view,
      },
      projectedSize: {
        x: W_image,
        y: H_image,
      },
    };
  }
}

export default Util;
