import { Point2 } from "./Point2.js";

/**
 * Coordinate in 2D space with floating point values.
 */
export class Point2D {
  static readonly ORIGIN = new Point2D(0, 0);

  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  equals(other: Point2D | null | undefined): boolean {
    return !!other && this.x === other.x && this.y === other.y;
  }

  compareTo(other: Point2D): number {
    if (this.x < other.x) return -1;
    if (this.x > other.x) return 1;
    if (this.y < other.y) return -1;
    if (this.y > other.y) return 1;
    return 0;
  }

  round(): Point2 {
    return new Point2(Math.round(this.x), Math.round(this.y));
  }

  clone(): Point2D {
    return new Point2D(this.x, this.y);
  }

  toString(): string {
    return `(${this.x},${this.y})`;
  }
}
