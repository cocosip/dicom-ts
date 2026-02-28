import { Point3D, Vector3D } from "../math/Geometry3D.js";
import type { IntervalD, VolumeData } from "./VolumeData.js";

/**
 * Represents a reconstructed slice through a volume.
 */
export class Slice {
  readonly topLeft: Point3D;
  readonly rowDirection: Vector3D;
  readonly columnDirection: Vector3D;
  readonly rows: number;
  readonly columns: number;
  readonly spacing: number;

  private readonly output: number[];

  constructor(
    volume: VolumeData,
    topLeft: Point3D,
    rowDirection: Vector3D,
    columnDirection: Vector3D,
    rows: number,
    columns: number,
    spacing: number,
  ) {
    this.topLeft = topLeft.clone();
    this.rowDirection = rowDirection.clone();
    this.columnDirection = columnDirection.clone();
    this.rows = rows;
    this.columns = columns;
    this.spacing = spacing;
    this.output = volume.getCut(
      this.topLeft,
      this.rowDirection,
      this.columnDirection,
      this.rows,
      this.columns,
      this.spacing,
    );
  }

  renderIntoByteArray(data: Uint8Array, stride: number): void {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        const value = this.output[x + y * this.columns] ?? 0;
        data[x + y * stride] = clampByte(value);
      }
    }
  }

  renderRawData(bytesPerPixel: number): Uint8Array {
    const buffer = new Uint8Array(this.rows * this.columns * bytesPerPixel);
    if (bytesPerPixel === 1) {
      for (let i = 0; i < this.output.length; i++) {
        buffer[i] = clampByte(this.output[i] ?? 0);
      }
      return buffer;
    }

    if (bytesPerPixel === 2) {
      for (let i = 0; i < this.output.length; i++) {
        const value = clampUint16(this.output[i] ?? 0);
        buffer[2 * i] = value & 0xff;
        buffer[2 * i + 1] = value >> 8;
      }
      return buffer;
    }

    throw new RangeError("Slice.renderRawData currently supports 1 or 2 bytes per pixel");
  }

  getMinMaxValue(): IntervalD {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const v of this.output) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: 0, max: 0 };
    return { min, max };
  }
}

function clampByte(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 255) return 255;
  return Math.round(value) & 0xff;
}

function clampUint16(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 0xffff) return 0xffff;
  return Math.round(value) & 0xffff;
}
