import { DicomDataset } from "../../dataset/DicomDataset.js";
import * as Tags from "../../core/DicomTag.generated.js";
import { ILUT } from "./ILUT.js";

/**
 * Modality rescale LUT (Rescale Slope/Intercept).
 */
export class ModalityRescaleLUT implements ILUT {
  readonly slope: number;
  readonly intercept: number;

  constructor(slope: number = 1, intercept: number = 0) {
    this.slope = slope;
    this.intercept = intercept;
  }

  map(value: number): number {
    return value * this.slope + this.intercept;
  }

  static fromDataset(dataset: DicomDataset): ModalityRescaleLUT {
    const slope = parseFloat(dataset.tryGetValue<string>(Tags.RescaleSlope) ?? "1");
    const intercept = parseFloat(dataset.tryGetValue<string>(Tags.RescaleIntercept) ?? "0");
    return new ModalityRescaleLUT(
      Number.isFinite(slope) ? slope : 1,
      Number.isFinite(intercept) ? intercept : 0
    );
  }
}
