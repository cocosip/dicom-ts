/**
 * Represents an interval of double values.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Mathematics/Interval.cs
 */
export class IntervalD {
  readonly min: number;
  readonly max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  /** Returns true if `value` is between min and max inclusive. */
  contains(value: number): boolean {
    return this.min <= value && value <= this.max;
  }

  get center(): number {
    return (this.min + this.max) / 2;
  }

  get width(): number {
    return this.max - this.min;
  }
}
