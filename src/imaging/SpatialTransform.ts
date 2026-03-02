
import { Point2 } from "./math/Point2.js";

/**
 * Representation of a spatial 2D transform.
 */
export class SpatialTransform {
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  pan: Point2;

  constructor() {
    this.pan = new Point2(0, 0);
    this.scale = 1.0;
    this.rotation = 0;
    this.flipX = false;
    this.flipY = false;
  }

  get isTransformed(): boolean {
    return this.scale !== 1.0 || this.rotation !== 0 || !this.pan.equals(Point2.ORIGIN);
  }

  rotate(angle: number): void {
    this.rotation += angle;
  }

  reset(): void {
    this.scale = 1.0;
    this.rotation = 0;
    this.flipX = false;
    this.flipY = false;
    this.pan = new Point2(0, 0);
  }
}
