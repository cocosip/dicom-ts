/**
 * Representation of a floating-point rectangle.
 */
export class RectF {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    if (width < 0) throw new RangeError("Negative width not supported.");
    if (height < 0) throw new RangeError("Negative height not supported.");
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  inflate(x: number, y: number): void {
    if (x < -this.width / 2) x = -this.width / 2;
    if (y < -this.height / 2) y = -this.height / 2;

    this.x -= x;
    this.y -= y;
    this.width += 2 * x;
    this.height += 2 * y;
  }

  clone(): RectF {
    return new RectF(this.x, this.y, this.width, this.height);
  }
}
