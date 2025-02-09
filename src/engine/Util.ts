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
}

export default Util;
