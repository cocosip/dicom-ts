import type { ILUT } from "./ILUT.js";
import type { GrayscaleRenderOptions } from "../GrayscaleRenderOptions.js";

/**
 * Abstract VOI LUT base class.
 * Concrete subclasses: VOILinearLUT, VOILinearExactLUT, VOISigmoidLUT.
 * Use the static Create() factory to instantiate the correct type.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/VOILUT.cs
 */
export abstract class VOILUT implements ILUT {
  protected _options: GrayscaleRenderOptions;

  protected windowCenter: number = 0;
  protected windowWidth: number = 0;
  protected windowCenterMin05: number = 0;
  protected windowWidthMin1: number = 0;
  protected windowWidthDiv2: number = 0;
  protected windowStart: number = 0;
  protected windowEnd: number = 0;

  protected constructor(options: GrayscaleRenderOptions) {
    this._options = options;
    this.recalculate();
  }

  get minimumOutputValue(): number {
    return 0;
  }

  get maximumOutputValue(): number {
    return 255;
  }

  get outputRange(): number {
    return 255;
  }

  /** Always recalculate — options may change. */
  get isValid(): boolean {
    return false;
  }

  abstract apply(value: number): number;

  recalculate(): void {
    if (
      this._options.windowWidth !== this.windowWidth ||
      this._options.windowCenter !== this.windowCenter
    ) {
      this.windowWidth = this._options.windowWidth;
      this.windowCenter = this._options.windowCenter;
      this.windowCenterMin05 = this.windowCenter - 0.5;
      this.windowWidthMin1 = this.windowWidth - 1;
      this.windowWidthDiv2 = this.windowWidthMin1 / 2;
      this.windowStart = (this.windowCenterMin05 - this.windowWidthDiv2) | 0;
      this.windowEnd = (this.windowCenterMin05 + this.windowWidthDiv2) | 0;
    }
  }

  /**
   * Factory: create the correct VOILUT subclass based on VOILUTFunction in options.
   */
  static create(options: GrayscaleRenderOptions): VOILUT {
    switch ((options.voiLutFunction ?? "").toUpperCase()) {
      case "SIGMOID":
        return new VOISigmoidLUT(options);
      case "LINEAR_EXACT":
        return new VOILinearExactLUT(options);
      default:
        return new VOILinearLUT(options);
    }
  }
}

// ---------------------------------------------------------------------------
// VOILinearLUT — standard LINEAR windowing (DICOM C.11.2.1.2.1)
// ---------------------------------------------------------------------------

export class VOILinearLUT extends VOILUT {
  constructor(options: GrayscaleRenderOptions) {
    super(options);
  }

  apply(value: number): number {
    if (this.windowWidth === 1) {
      return value < this.windowCenterMin05
        ? this.minimumOutputValue
        : this.maximumOutputValue;
    }
    return Math.min(
      this.maximumOutputValue,
      Math.max(
        this.minimumOutputValue,
        ((value - this.windowCenterMin05) / this.windowWidthMin1 + 0.5) * this.outputRange +
          this.minimumOutputValue
      )
    );
  }
}

// ---------------------------------------------------------------------------
// VOILinearExactLUT — LINEAR_EXACT windowing (DICOM C.11.2.1.3.2)
// ---------------------------------------------------------------------------

export class VOILinearExactLUT extends VOILUT {
  constructor(options: GrayscaleRenderOptions) {
    super(options);
  }

  apply(value: number): number {
    if (this.windowWidth === 1) {
      return value < this.windowCenterMin05
        ? this.minimumOutputValue
        : this.maximumOutputValue;
    }
    return Math.min(
      this.maximumOutputValue,
      Math.max(
        this.minimumOutputValue,
        ((value - this.windowCenter) / this.windowWidth + 0.5) * this.outputRange +
          this.minimumOutputValue
      )
    );
  }
}

// ---------------------------------------------------------------------------
// VOISigmoidLUT — SIGMOID windowing
// ---------------------------------------------------------------------------

export class VOISigmoidLUT extends VOILUT {
  constructor(options: GrayscaleRenderOptions) {
    super(options);
  }

  apply(value: number): number {
    return 255.0 / (1.0 + Math.exp(-4.0 * ((value - this.windowCenter) / this.windowWidth)));
  }
}
