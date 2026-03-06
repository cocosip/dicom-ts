import { describe, expect, it } from "vitest";
import { PixelRepresentation } from "../../../src/imaging/PixelRepresentation.js";
import { DicomJpeg2000Params } from "../../../src/imaging/codec/jpeg2000/DicomJpeg2000Params.js";
import { Jpeg2000Decoder, Jpeg2000Encoder, parseJpeg2000Codestream } from "../../../src/imaging/codec/jpeg2000/core/index.js";

describe("Jpeg2000Encoder", () => {
  it("analyzes part1 lossless frame with forward RCT and 5/3 DWT", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.numLevels = 5;

    const frame = new Uint8Array([
      10, 40, 90,
      20, 50, 100,
      30, 60, 110,
      40, 70, 120,
    ]);

    const analyzed = new Jpeg2000Encoder().analyzeFrame({
      frameData: frame,
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: false,
    });

    expect(analyzed.appliedMct).toBe("rct");
    expect(analyzed.irreversible).toBe(false);
    expect(analyzed.numLevels).toBe(1);
    expect(analyzed.analyzedComponents).toHaveLength(3);
    for (const component of analyzed.analyzedComponents) {
      expect(component.transformedInt).toBeDefined();
      expect(component.transformedInt!.length).toBe(4);
    }
  });

  it("analyzes part1 lossy frame with forward ICT and 9/7 DWT", () => {
    const params = new DicomJpeg2000Params();
    params.irreversible = true;
    params.allowMct = true;
    params.numLevels = 2;

    const frame = new Uint8Array([
      15, 35, 55,
      25, 45, 65,
      35, 55, 75,
      45, 65, 85,
    ]);

    const analyzed = new Jpeg2000Encoder().analyzeFrame({
      frameData: frame,
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: false,
    });

    expect(analyzed.appliedMct).toBe("ict");
    expect(analyzed.irreversible).toBe(true);
    expect(analyzed.numLevels).toBe(1);
    for (const component of analyzed.analyzedComponents) {
      expect(component.transformedFloat).toBeDefined();
      expect(component.transformedFloat!.length).toBe(4);
    }
  });

  it("falls back to Part1 MCT when Part2 has no custom bindings/matrix", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.numLevels = 1;

    const frame = new Uint8Array([
      4, 8, 12,
      16, 20, 24,
      28, 32, 36,
      40, 44, 48,
    ]);

    const analyzed = new Jpeg2000Encoder().analyzeFrame({
      frameData: frame,
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: true,
    });

    expect(analyzed.appliedMct).toBe("rct");
    expect(analyzed.isPart2).toBe(true);
  });

  it("uses custom Part2 MCT path when fallback matrix is provided", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.numLevels = 1;
    params.mctMatrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    params.inverseMctMatrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    params.mctOffsets = [2, -1, 3];

    const frame = new Uint8Array([
      4, 8, 12,
      16, 20, 24,
      28, 32, 36,
      40, 44, 48,
    ]);

    const analyzed = new Jpeg2000Encoder().analyzeFrame({
      frameData: frame,
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: true,
    });

    expect(analyzed.appliedMct).toBe("none");
    expect(analyzed.isPart2).toBe(true);
  });

  it("encodes .90 baseline codestream and decodes it back losslessly", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = false;
    params.numLevels = 1;
    params.progressionOrder = 0;
    params.numLayers = 1;

    const frame = new Uint8Array([
      10, 20, 30, 40,
      50, 60, 70, 80,
      90, 100, 110, 120,
      130, 140, 150, 160,
    ]);

    const codestream = new Jpeg2000Encoder().encodeFrame({
      frameData: frame,
      width: 4,
      height: 4,
      components: 1,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: false,
    });

    expect(codestream.length).toBeGreaterThan(0);
    const decoded = new Jpeg2000Decoder().decode(codestream);
    expect(Array.from(decoded.pixelData)).toEqual(Array.from(frame));
  });

  it("encodes .91 baseline codestream (single-layer LRCP) and decodes with bounded error", () => {
    const params = new DicomJpeg2000Params();
    params.irreversible = true;
    params.allowMct = true;
    params.numLevels = 1;
    params.progressionOrder = 0;
    params.numLayers = 1;

    const frame = new Uint8Array([
      8, 20, 32,
      16, 28, 40,
      24, 36, 48,
      32, 44, 56,
    ]);

    const codestream = new Jpeg2000Encoder().encodeFrame({
      frameData: frame,
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: false,
    });

    expect(codestream.length).toBeGreaterThan(0);
    const decoded = new Jpeg2000Decoder().decode(codestream);
    expect(decoded.pixelData.length).toBe(frame.length);

    let maxDelta = 0;
    for (let i = 0; i < frame.length; i++) {
      const delta = Math.abs((decoded.pixelData[i] ?? 0) - frame[i]!);
      if (delta > maxDelta) {
        maxDelta = delta;
      }
    }
    expect(maxDelta).toBeLessThanOrEqual(8);
  });

  it("encodes Part2 .92 with no bindings using Part1 fallback (COD MCT=1, no Part2 markers)", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.numLevels = 1;
    params.progressionOrder = 0;
    params.numLayers = 1;

    const frame = new Uint8Array([
      10, 20, 30,
      40, 50, 60,
      70, 80, 90,
      100, 110, 120,
    ]);

    const codestream = new Jpeg2000Encoder().encodeFrame({
      frameData: frame,
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: true,
    });

    const parsed = parseJpeg2000Codestream(codestream);
    expect(parsed.siz?.rSiz).toBe(2);
    expect(parsed.cod?.multipleComponentTransform).toBe(1);
    expect(parsed.mct).toHaveLength(0);
    expect(parsed.mcc).toHaveLength(0);
    expect(parsed.mco).toHaveLength(0);
  });

  it("encodes Part2 with offsets-only fallback input without Part2 markers", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.numLevels = 1;
    params.progressionOrder = 0;
    params.numLayers = 1;
    params.mctOffsets = [5, -3, 2];

    const frame = new Uint8Array([
      10, 20, 30,
      40, 50, 60,
      70, 80, 90,
      100, 110, 120,
    ]);

    const codestream = new Jpeg2000Encoder().encodeFrame({
      frameData: frame,
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: true,
    });

    const parsed = parseJpeg2000Codestream(codestream);
    expect(parsed.cod?.multipleComponentTransform).toBe(1);
    expect(parsed.mct).toHaveLength(0);
    expect(parsed.mcc).toHaveLength(0);
    expect(parsed.mco).toHaveLength(0);
  });

  it("encodes Part2 with invalid fallback matrix dimensions without Part2 markers", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.numLevels = 1;
    params.progressionOrder = 0;
    params.numLayers = 1;
    params.mctMatrix = [
      [1, 0],
      [0, 1],
    ];
    params.mctOffsets = [5, -3, 2];

    const frame = new Uint8Array([
      10, 20, 30,
      40, 50, 60,
      70, 80, 90,
      100, 110, 120,
    ]);

    const codestream = new Jpeg2000Encoder().encodeFrame({
      frameData: frame,
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: true,
    });

    const parsed = parseJpeg2000Codestream(codestream);
    expect(parsed.cod?.multipleComponentTransform).toBe(1);
    expect(parsed.mct).toHaveLength(0);
    expect(parsed.mcc).toHaveLength(0);
    expect(parsed.mco).toHaveLength(0);
  });

  it("encodes multi-layer LRCP codestream with TERMALL and keeps lossless roundtrip", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = false;
    params.numLevels = 1;
    params.progressionOrder = 0;
    params.numLayers = 3;

    const frame = new Uint8Array([
      5, 10, 15, 20,
      25, 30, 35, 40,
      45, 50, 55, 60,
      65, 70, 75, 80,
    ]);

    const codestream = new Jpeg2000Encoder().encodeFrame({
      frameData: frame,
      width: 4,
      height: 4,
      components: 1,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: false,
    });

    const parsed = parseJpeg2000Codestream(codestream);
    expect(parsed.cod?.numberOfLayers).toBe(3);
    expect((parsed.cod?.codeBlockStyle ?? 0) & 0x04).toBe(0x04);

    const decoded = new Jpeg2000Decoder().decode(codestream);
    expect(Array.from(decoded.pixelData)).toEqual(Array.from(frame));
  });

  it("derives layered encode count from rate/rateLevels when targetRatio is set", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = false;
    params.numLevels = 1;
    params.progressionOrder = 0;
    params.numLayers = 1;
    params.targetRatio = 4;
    params.rate = 20;
    params.rateLevels = [80, 40, 20, 10];

    const frame = new Uint8Array([
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
    ]);

    const codestream = new Jpeg2000Encoder().encodeFrame({
      frameData: frame,
      width: 4,
      height: 4,
      components: 1,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: params,
      isPart2: false,
    });

    const parsed = parseJpeg2000Codestream(codestream);
    expect(parsed.cod?.numberOfLayers).toBe(3);
    expect((parsed.cod?.codeBlockStyle ?? 0) & 0x04).toBe(0x04);
  });
});
