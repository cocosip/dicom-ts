import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import * as Tags from "../core/DicomTag.generated.js";
import { BitDepth } from "./BitDepth.js";
import { Color32 } from "./Color32.js";
import { ColorTable } from "./ColorTable.js";
import { PhotometricInterpretation } from "./PhotometricInterpretation.js";
import type { IModalityLUT } from "./lut/IModalityLUT.js";
// ModalitySequenceLUT is imported here; it does NOT import GrayscaleRenderOptions → no cycle.
import { ModalitySequenceLUT } from "./lut/ModalitySequenceLUT.js";

/**
 * Grayscale rendering options.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/GrayscaleRenderOptions.cs
 */
export class GrayscaleRenderOptions {
  bitDepth: BitDepth;
  rescaleSlope: number = 1.0;
  rescaleIntercept: number = 0.0;
  voiLutFunction: string = "LINEAR";
  modalityLut: IModalityLUT | null = null;
  voiLutSequence: DicomSequence | null = null;
  windowWidth: number = 0;
  windowCenter: number = 0;
  invert: boolean = false;

  private _useVoiLut: boolean = false;
  private _colorMap: Color32[] = ColorTable.Monochrome2;

  private constructor(bits: BitDepth) {
    this.bitDepth = bits;
  }

  get useVoiLut(): boolean {
    return this._useVoiLut && this.voiLutSequence != null;
  }
  set useVoiLut(value: boolean) {
    this._useVoiLut = value;
  }

  get colorMap(): Color32[] {
    return this._colorMap;
  }
  set colorMap(value: Color32[]) {
    if (!value || value.length !== 256) {
      throw new Error("Expected 256 entry color map");
    }
    this._colorMap = value;
  }

  // ---------------------------------------------------------------------------
  // Factory: from window level tags
  // ---------------------------------------------------------------------------
  static fromWindowLevel(dataset: DicomDataset, frame: number = 0): GrayscaleRenderOptions | null {
    const rawWw = dataset.tryGetValue<number | string>(Tags.WindowWidth);
    const rawWc = dataset.tryGetValue<number | string>(Tags.WindowCenter);
    if (rawWw == null || rawWc == null) return null;
    const ww = Number(rawWw);
    const wc = Number(rawWc);
    if (!Number.isFinite(ww) || !Number.isFinite(wc)) return null;

    const bits = BitDepth.fromDataset(dataset);
    let voiLutFunction = dataset.tryGetValue<string>(Tags.VOILUTFunction) ?? "LINEAR";
    if (!voiLutFunction) voiLutFunction = "LINEAR";
    // #1905: LINEAR with windowWidth < 1 must use LINEAR_EXACT
    if (ww < 1.0 && voiLutFunction === "LINEAR") voiLutFunction = "LINEAR_EXACT";

    const options = new GrayscaleRenderOptions(bits);
    options.rescaleSlope = parseNumericTag(dataset, Tags.RescaleSlope) ?? 1.0;
    options.rescaleIntercept = parseNumericTag(dataset, Tags.RescaleIntercept) ?? 0.0;
    options.windowWidth = ww;
    options.windowCenter = wc;
    options.voiLutFunction = voiLutFunction;
    options.colorMap = getColorMap(dataset);
    populateLutSequences(options, dataset, bits);
    return options;
  }

  // ---------------------------------------------------------------------------
  // Factory: from SmallestImagePixelValue / LargestImagePixelValue
  // ---------------------------------------------------------------------------
  static fromImagePixelValueTags(dataset: DicomDataset): GrayscaleRenderOptions | null {
    const rawSmall = dataset.tryGetValue<number | string>(Tags.SmallestImagePixelValue);
    const rawLarge = dataset.tryGetValue<number | string>(Tags.LargestImagePixelValue);
    if (rawSmall == null || rawLarge == null) return null;
    const sVal = Number(rawSmall);
    const lVal = Number(rawLarge);
    if (!Number.isFinite(sVal) || !Number.isFinite(lVal) || sVal >= lVal) return null;

    const bits = BitDepth.fromDataset(dataset);
    const options = new GrayscaleRenderOptions(bits);
    options.rescaleSlope = parseNumericTag(dataset, Tags.RescaleSlope) ?? 1.0;
    options.rescaleIntercept = parseNumericTag(dataset, Tags.RescaleIntercept) ?? 0.0;
    options.windowWidth = Math.abs(lVal - sVal);
    options.windowCenter = (lVal + sVal) / 2.0;
    options.voiLutFunction = dataset.tryGetValue<string>(Tags.VOILUTFunction) ?? "LINEAR";
    options.colorMap = getColorMap(dataset);
    populateLutSequences(options, dataset, bits);
    return options;
  }

  // ---------------------------------------------------------------------------
  // Factory: from bit range
  // ---------------------------------------------------------------------------
  static fromBitRange(dataset: DicomDataset): GrayscaleRenderOptions {
    const bits = BitDepth.fromDataset(dataset);
    const options = new GrayscaleRenderOptions(bits);
    options.rescaleSlope = parseNumericTag(dataset, Tags.RescaleSlope) ?? 1.0;
    options.rescaleIntercept = parseNumericTag(dataset, Tags.RescaleIntercept) ?? 0.0;
    const min = bits.minimumValue * options.rescaleSlope + options.rescaleIntercept;
    const max = bits.maximumValue * options.rescaleSlope + options.rescaleIntercept;
    options.windowWidth = Math.abs(max - min);
    options.windowCenter = (max + min) / 2.0;
    options.voiLutFunction = dataset.tryGetValue<string>(Tags.VOILUTFunction) ?? "LINEAR";
    options.colorMap = getColorMap(dataset);
    populateLutSequences(options, dataset, bits);
    return options;
  }

  // ---------------------------------------------------------------------------
  // Factory: from min/max pixel scan (simplified — uses bitDepth range as fallback)
  // ---------------------------------------------------------------------------
  static fromMinMax(dataset: DicomDataset): GrayscaleRenderOptions {
    const bits = BitDepth.fromDataset(dataset);
    const options = new GrayscaleRenderOptions(bits);
    options.rescaleSlope = parseNumericTag(dataset, Tags.RescaleSlope) ?? 1.0;
    options.rescaleIntercept = parseNumericTag(dataset, Tags.RescaleIntercept) ?? 0.0;
    options.voiLutFunction = dataset.tryGetValue<string>(Tags.VOILUTFunction) ?? "LINEAR";
    options.colorMap = getColorMap(dataset);
    populateLutSequences(options, dataset, bits);

    let min = bits.minimumValue * options.rescaleSlope + options.rescaleIntercept;
    let max = bits.maximumValue * options.rescaleSlope + options.rescaleIntercept;
    if (options.modalityLut != null) {
      min = options.modalityLut.apply(min);
      max = options.modalityLut.apply(max);
    }
    options.windowWidth = Math.max(1, Math.abs(max - min));
    options.windowCenter = (max + min) / 2.0;
    return options;
  }

  // ---------------------------------------------------------------------------
  // Factory: main entry point — picks the right strategy
  // ---------------------------------------------------------------------------
  static fromDataset(dataset: DicomDataset, frame: number = 0): GrayscaleRenderOptions {
    const rawWw = dataset.tryGetValue<number | string>(Tags.WindowWidth);
    const rawWc = dataset.tryGetValue<number | string>(Tags.WindowCenter);
    if (rawWw != null && rawWc != null && Number(rawWw) > 0) {
      const opts = GrayscaleRenderOptions.fromWindowLevel(dataset, frame);
      if (opts) return opts;
    }

    const rawSmall = dataset.tryGetValue<number | string>(Tags.SmallestImagePixelValue);
    const rawLarge = dataset.tryGetValue<number | string>(Tags.LargestImagePixelValue);
    if (rawSmall != null && rawLarge != null && Number(rawSmall) < Number(rawLarge)) {
      const opts = GrayscaleRenderOptions.fromImagePixelValueTags(dataset);
      if (opts) return opts;
    }

    return GrayscaleRenderOptions.fromMinMax(dataset);
  }

  // ---------------------------------------------------------------------------
  // Helper: create a linear option for post-VOISequenceLUT windowing
  // ---------------------------------------------------------------------------
  static createLinearOption(bits: BitDepth, minValue: number, maxValue: number): GrayscaleRenderOptions {
    const options = new GrayscaleRenderOptions(bits);
    // window width should be the full range
    options.windowWidth = Math.abs(maxValue - minValue);
    // window center should be the middle
    options.windowCenter = (maxValue + minValue) / 2;
    return options;
  }
}

// ---------------------------------------------------------------------------
// Module helpers
// ---------------------------------------------------------------------------

function parseNumericTag(
  dataset: DicomDataset,
  tag: import("../core/DicomTag.js").DicomTag
): number | null {
  const raw = dataset.tryGetValue<number | string>(tag);
  if (raw == null) return null;
  const v = Number(raw);
  return Number.isFinite(v) ? v : null;
}

function getColorMap(dataset: DicomDataset): Color32[] {
  const pi = dataset.tryGetValue<string>(Tags.PhotometricInterpretation);
  return pi === PhotometricInterpretation.MONOCHROME1
    ? ColorTable.Monochrome1
    : ColorTable.Monochrome2;
}

function populateLutSequences(
  options: GrayscaleRenderOptions,
  dataset: DicomDataset,
  bits: BitDepth
): void {
  const modalitySeq = dataset.tryGetSequence(Tags.ModalityLUTSequence);
  if (modalitySeq instanceof DicomSequence && modalitySeq.items.length > 0) {
    options.modalityLut = new ModalitySequenceLUT(modalitySeq.items[0]!, bits.isSigned);
  }

  const voiSeq = dataset.tryGetSequence(Tags.VOILUTSequence);
  if (voiSeq instanceof DicomSequence && voiSeq.items.length > 0) {
    options.voiLutSequence = voiSeq;
    options.useVoiLut = true;
  }
}
