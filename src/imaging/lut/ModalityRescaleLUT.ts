import type { IModalityLUT } from "./IModalityLUT.js";
import type { GrayscaleRenderOptions } from "../GrayscaleRenderOptions.js";

/**
 * Modality Rescale LUT — applies RescaleSlope / RescaleIntercept.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/ModalityRescaleLUT.cs
 */
export class ModalityRescaleLUT implements IModalityLUT {
  private readonly _options: GrayscaleRenderOptions;

  constructor(options: GrayscaleRenderOptions) {
    this._options = options;
  }

  get rescaleSlope(): number {
    return this._options.rescaleSlope;
  }

  get rescaleIntercept(): number {
    return this._options.rescaleIntercept;
  }

  get isValid(): boolean {
    return true;
  }

  get minimumOutputValue(): number {
    return this.apply(this._options.bitDepth.minimumValue);
  }

  get maximumOutputValue(): number {
    return this.apply(this._options.bitDepth.maximumValue);
  }

  apply(value: number): number {
    return value * this.rescaleSlope + this.rescaleIntercept;
  }

  recalculate(): void {}
}
