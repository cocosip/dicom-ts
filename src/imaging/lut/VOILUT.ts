import { DicomDataset } from "../../dataset/DicomDataset.js";
import * as Tags from "../../core/DicomTag.generated.js";
import { ILUT } from "./ILUT.js";

/**
 * VOI LUT (window center/width).
 */
export class VOILUT implements ILUT {
  readonly windowCenter: number;
  readonly windowWidth: number;
  readonly invert: boolean;

  constructor(windowCenter: number, windowWidth: number, invert: boolean = false) {
    this.windowCenter = windowCenter;
    this.windowWidth = windowWidth;
    this.invert = invert;
  }

  map(value: number): number {
    const wc = this.windowCenter;
    const ww = this.windowWidth;
    let out = 0;
    if (ww <= 1) {
      out = value <= (wc - 0.5) ? 0 : 255;
    } else {
      const low = wc - 0.5 - (ww - 1) / 2;
      const high = wc - 0.5 + (ww - 1) / 2;
      if (value <= low) out = 0;
      else if (value > high) out = 255;
      else out = ((value - (wc - 0.5)) / (ww - 1)) * 255;
    }
    out = clamp8(out);
    return this.invert ? 255 - out : out;
  }

  static fromDataset(dataset: DicomDataset, index: number = 0, invert: boolean = false): VOILUT | null {
    const centers = parseMultiNumeric(dataset.tryGetValue<string>(Tags.WindowCenter));
    const widths = parseMultiNumeric(dataset.tryGetValue<string>(Tags.WindowWidth));
    const wc = centers[index] ?? centers[0];
    const ww = widths[index] ?? widths[0];
    if (wc === undefined || ww === undefined) return null;
    return new VOILUT(wc, ww, invert);
  }
}

function parseMultiNumeric(raw?: string): number[] {
  if (!raw) return [];
  return raw.split("\\").map((v) => parseFloat(v.trim())).filter((v) => Number.isFinite(v));
}

function clamp8(v: number): number {
  if (v <= 0) return 0;
  if (v >= 255) return 255;
  return v & 0xFF;
}
