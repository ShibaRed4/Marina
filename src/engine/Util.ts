export interface Vector2 {
	x: number;
	y: number
}

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

  static lerp(start: number, end: number, alpha: number): number {
    return start + (end - start) * Math.min(alpha, 1);
  }
}

export default Util;
