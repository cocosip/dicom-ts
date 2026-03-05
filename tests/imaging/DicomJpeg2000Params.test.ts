import { describe, expect, it } from "vitest";
import { DicomJpeg2000Params } from "../../src/imaging/codec/jpeg2000/DicomJpeg2000Params.js";
import { normalizeLosslessRateControlParams } from "../../src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.js";

describe("DicomJpeg2000Params", () => {
  it("uses Go-aligned lossless defaults", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    expect(params.irreversible).toBe(false);
    expect(params.rate).toBe(0);
    expect(params.numLayers).toBe(1);
    expect(params.targetRatio).toBe(0);
  });

  it("normalizes invalid values to safe fallbacks", () => {
    const params = new DicomJpeg2000Params();
    params.rate = 0;
    params.rateLevels = [0, -2, Number.NaN];
    (params as { progressionOrder: number }).progressionOrder = 7;
    params.numLevels = 20;
    params.numLayers = 0;
    params.targetRatio = -1;
    params.quantStepScale = 0;
    params.subbandSteps = [1.5, 0, Number.NaN, -2];
    params.mctAssocType = 512;
    params.mctMatrixElementType = 7;
    params.mcoPrecision = -2;
    params.mcoRecordOrder = [1, -1, 2.5, 3];

    const normalized = params.cloneNormalized();
    expect(normalized.rate).toBe(20);
    expect(normalized.rateLevels).toEqual([1280, 640, 320, 160, 80, 40, 20, 10, 5]);
    expect(normalized.progressionOrder).toBe(0);
    expect(normalized.numLevels).toBe(5);
    expect(normalized.numLayers).toBe(1);
    expect(normalized.targetRatio).toBe(0);
    expect(normalized.quantStepScale).toBe(1.0);
    expect(normalized.subbandSteps).toEqual([1.5]);
    expect(normalized.mctAssocType).toBe(0);
    expect(normalized.mctMatrixElementType).toBe(1);
    expect(normalized.mcoPrecision).toBe(0);
    expect(normalized.mcoRecordOrder).toEqual([1, 3]);
  });

  it("normalizes non-boolean compatibility flags to defaults", () => {
    const params = new DicomJpeg2000Params();
    (params as { irreversible: unknown }).irreversible = "bad";
    (params as { isVerbose: unknown }).isVerbose = 1;
    (params as { allowMct: unknown }).allowMct = "bad";
    (params as { updatePhotometricInterpretation: unknown }).updatePhotometricInterpretation = 2;
    (params as { encodeSignedPixelValuesAsUnsigned: unknown }).encodeSignedPixelValuesAsUnsigned = "bad";
    (params as { usePcrdOpt: unknown }).usePcrdOpt = "bad";
    (params as { appendLosslessLayer: unknown }).appendLosslessLayer = "bad";

    const normalized = params.cloneNormalized();
    expect(normalized.irreversible).toBe(true);
    expect(normalized.isVerbose).toBe(false);
    expect(normalized.allowMct).toBe(true);
    expect(normalized.updatePhotometricInterpretation).toBe(true);
    expect(normalized.encodeSignedPixelValuesAsUnsigned).toBe(false);
    expect(normalized.usePcrdOpt).toBe(false);
    expect(normalized.appendLosslessLayer).toBe(false);
  });

  it("derives targetRatio and layers from rate ladder in lossless normalization", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.rate = 32;
    params.rateLevels = [128, 64, 32, 16];
    params.targetRatio = 0;
    params.numLayers = 1;
    params.usePcrdOpt = false;

    const normalized = normalizeLosslessRateControlParams(params, 12, 16);
    expect(normalized.targetRatio).toBe(24);
    expect(normalized.numLayers).toBe(3);
    expect(normalized.usePcrdOpt).toBe(true);

    expect(params.targetRatio).toBe(0);
    expect(params.numLayers).toBe(1);
    expect(params.usePcrdOpt).toBe(false);
  });

  it("enforces appendLosslessLayer minimum when target ratio is active", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.targetRatio = 6;
    params.numLayers = 1;
    params.appendLosslessLayer = true;

    const normalized = normalizeLosslessRateControlParams(params, 12, 16);
    expect(normalized.numLayers).toBe(2);
  });
});
