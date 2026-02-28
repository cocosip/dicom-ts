/**
 * Coordinate in 2D space with integer values.
 */
export class Point2 {
  static readonly ORIGIN = new Point2(0, 0);

  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = Math.trunc(x);
    this.y = Math.trunc(y);
  }

  equals(other: Point2 | null | undefined): boolean {
    return !!other && this.x === other.x && this.y === other.y;
  }

  compareTo(other: Point2): number {
    if (this.x < other.x) return -1;
    if (this.x > other.x) return 1;
    if (this.y < other.y) return -1;
    if (this.y > other.y) return 1;
    return 0;
  }

  clone(): Point2 {
    return new Point2(this.x, this.y);
  }

  toString(): string {
    return `(${this.x},${this.y})`;
  }
}
