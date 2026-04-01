import { DicomCodecParams } from "../DicomCodecParams.js";

export type DicomJpeg2000ProgressionOrder = 0 | 1 | 2 | 3 | 4;

export interface DicomJpeg2000MctBinding {
  assocType?: number;
  componentIds?: number[];
  matrix?: number[][];
  inverse?: number[][];
  offsets?: number[];
  elementType?: number;
  mcoPrecision?: number;
  mcoRecordOrder?: number[];
}

const DEFAULT_RATE_LEVELS = [1280, 640, 320, 160, 80, 40, 20, 10, 5];

/**
 * JPEG2000 parameters aligned with fo-dicom/go-dicom-codec semantics.
 */
export class DicomJpeg2000Params extends DicomCodecParams {
  irreversible = true;
  rate = 20;
  rateLevels = [...DEFAULT_RATE_LEVELS];
  progressionOrder: DicomJpeg2000ProgressionOrder = 0;
  isVerbose = false;
  allowMct = false;
  updatePhotometricInterpretation = false;
  encodeSignedPixelValuesAsUnsigned = false;

  numLevels = 5;
  numLayers = 1;
  targetRatio = 0;
  usePcrdOpt = false;
  appendLosslessLayer = false;

  quantStepScale = 1.0;
  subbandSteps: number[] = [];

  mctBindings: DicomJpeg2000MctBinding[] = [];
  mctMatrix?: number[][];
  inverseMctMatrix?: number[][];
  mctOffsets?: number[];
  mctNormScale = 1.0;
  mctAssocType = 0;
  mctMatrixElementType = 1;
  mcoPrecision = 0;
  mcoRecordOrder: number[] = [];

  cloneNormalized(): DicomJpeg2000Params {
    const clone = new DicomJpeg2000Params();

    clone.irreversible = typeof this.irreversible === "boolean" ? this.irreversible : true;
    clone.rate = Number.isFinite(this.rate) && this.rate > 0 ? Math.trunc(this.rate) : 20;
    clone.rateLevels = Array.isArray(this.rateLevels) && this.rateLevels.length > 0
      ? this.rateLevels.filter((v) => Number.isFinite(v) && v > 0).map((v) => Math.trunc(v))
      : [...DEFAULT_RATE_LEVELS];
    if (clone.rateLevels.length === 0) {
      clone.rateLevels = [...DEFAULT_RATE_LEVELS];
    }

    clone.progressionOrder = normalizeProgressionOrder(this.progressionOrder);
    clone.isVerbose = typeof this.isVerbose === "boolean" ? this.isVerbose : false;
    clone.allowMct = typeof this.allowMct === "boolean" ? this.allowMct : true;
    clone.updatePhotometricInterpretation = typeof this.updatePhotometricInterpretation === "boolean"
      ? this.updatePhotometricInterpretation
      : true;
    clone.encodeSignedPixelValuesAsUnsigned = typeof this.encodeSignedPixelValuesAsUnsigned === "boolean"
      ? this.encodeSignedPixelValuesAsUnsigned
      : false;

    clone.numLevels = normalizeIntegerInRange(this.numLevels, 5, 0, 6);
    clone.numLayers = Math.max(1, Number.isFinite(this.numLayers) ? Math.trunc(this.numLayers) : 1);
    clone.targetRatio = Number.isFinite(this.targetRatio) && this.targetRatio >= 0 ? this.targetRatio : 0;
    clone.usePcrdOpt = typeof this.usePcrdOpt === "boolean" ? this.usePcrdOpt : false;
    clone.appendLosslessLayer = typeof this.appendLosslessLayer === "boolean" ? this.appendLosslessLayer : false;

    clone.quantStepScale = Number.isFinite(this.quantStepScale) && this.quantStepScale > 0
      ? this.quantStepScale
      : 1.0;
    clone.subbandSteps = Array.isArray(this.subbandSteps)
      ? this.subbandSteps.filter((v) => Number.isFinite(v) && v > 0)
      : [];

    clone.mctBindings = Array.isArray(this.mctBindings)
      ? this.mctBindings.map((binding) => ({ ...binding }))
      : [];
    if (this.mctMatrix) {
      clone.mctMatrix = this.mctMatrix.map((row) => [...row]);
    }
    if (this.inverseMctMatrix) {
      clone.inverseMctMatrix = this.inverseMctMatrix.map((row) => [...row]);
    }
    if (this.mctOffsets) {
      clone.mctOffsets = [...this.mctOffsets];
    }
    clone.mctNormScale = Number.isFinite(this.mctNormScale) && this.mctNormScale > 0
      ? this.mctNormScale
      : 1.0;
    clone.mctAssocType = normalizeIntegerInRange(this.mctAssocType, 0, 0, 255);
    clone.mctMatrixElementType = normalizeIntegerInRange(this.mctMatrixElementType, 1, 0, 3) as 0 | 1 | 2 | 3;
    clone.mcoPrecision = normalizeIntegerInRange(this.mcoPrecision, 0, 0, 255);
    clone.mcoRecordOrder = Array.isArray(this.mcoRecordOrder)
      ? this.mcoRecordOrder.filter((v) => Number.isInteger(v) && v >= 0).map((v) => Math.trunc(v))
      : [];

    return clone;
  }

  static createLosslessDefaults(): DicomJpeg2000Params {
    const parameters = new DicomJpeg2000Params();
    parameters.irreversible = false;
    parameters.rate = 0;
    return parameters;
  }
}

function normalizeIntegerInRange(value: number, fallback: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  const normalized = Math.trunc(value);
  if (normalized < min || normalized > max) {
    return fallback;
  }

  return normalized;
}

function normalizeProgressionOrder(value: number): DicomJpeg2000ProgressionOrder {
  const normalized = normalizeIntegerInRange(value, 0, 0, 4);
  return normalized as DicomJpeg2000ProgressionOrder;
}
