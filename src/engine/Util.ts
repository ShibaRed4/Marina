export interface Vector2 {
	x: number;
	y: number
}

export interface Color {
	r: number;
	g: number;
	b: number;
	a: number;
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

  static Color(r: number, g: number, b: number, a: number): Color {
	  return {r: r, g: g, b: b, a: a}
  }


  static lerp(start: number, end: number, alpha: number): number {
    return start + (end - start) * Math.min(alpha, 1);
  }
}

export default Util;
