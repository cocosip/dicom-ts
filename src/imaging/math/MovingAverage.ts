/**
 * Moving average implementations for integer, float, and double values.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Mathematics/MovingAverage.cs
 */

/** Moving average over a fixed-size window of integer values. */
export class MovingAverage {
  private readonly _window: number;
  private readonly _values: Int32Array;
  private _count: number = 0;

  constructor(window: number) {
    this._window = window;
    this._values = new Int32Array(window);
  }

  get count(): number {
    return this._count;
  }

  next(value: number): number {
    this._values[this._count % this._window] = value | 0;
    this._count++;
    let sum = 0;
    for (let i = 0; i < this._values.length; i++) sum += this._values[i]!;
    if (this._count < this._window) return (sum / this._count) | 0;
    return (sum / this._window) | 0;
  }
}

/** Moving average over a fixed-size window of float (single-precision) values. */
export class MovingAverageF {
  private readonly _window: number;
  private readonly _values: Float32Array;
  private _count: number = 0;

  constructor(window: number) {
    this._window = window;
    this._values = new Float32Array(window);
  }

  get count(): number {
    return this._count;
  }

  next(value: number): number {
    this._values[this._count % this._window] = value;
    this._count++;
    let sum = 0;
    for (let i = 0; i < this._values.length; i++) sum += this._values[i]!;
    if (this._count < this._window) return sum / this._count;
    return sum / this._window;
  }
}

/** Moving average over a fixed-size window of double-precision values. */
export class MovingAverageD {
  private readonly _window: number;
  private readonly _values: Float64Array;
  private _count: number = 0;

  constructor(window: number) {
    this._window = window;
    this._values = new Float64Array(window);
  }

  get count(): number {
    return this._count;
  }

  next(value: number): number {
    this._values[this._count % this._window] = value;
    this._count++;
    let sum = 0;
    for (let i = 0; i < this._values.length; i++) sum += this._values[i]!;
    if (this._count < this._window) return sum / this._count;
    return sum / this._window;
  }
}
