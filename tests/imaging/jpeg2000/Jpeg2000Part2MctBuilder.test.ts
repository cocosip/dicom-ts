import { describe, expect, it } from "vitest";
import { DicomJpeg2000Params } from "../../../src/imaging/codec/jpeg2000/DicomJpeg2000Params.js";
import {
  buildPart2MctMainHeaderSegments,
  Jpeg2000Encoder,
  parseJpeg2000Codestream,
} from "../../../src/imaging/codec/jpeg2000/core/index.js";
import { PixelRepresentation } from "../../../src/imaging/PixelRepresentation.js";

describe("Jpeg2000Part2MctBuilder", () => {
  it("builds no Part2 MCT header segments when MCT is disabled", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = false;
    params.mctBindings = [
      {
        componentIds: [0, 1, 2],
        matrix: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        offsets: [5, -3, 2],
        elementType: 1,
      },
    ];

    const segments = buildPart2MctMainHeaderSegments(params, 3, false);
    expect(segments).toHaveLength(0);
  });

  it("builds Part2 MCT/MCC/MCO markers and writes them into .92 codestream", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.numLevels = 1;
    params.numLayers = 1;
    params.progressionOrder = 0;
    params.mctBindings = [
      {
        assocType: 0,
        componentIds: [0, 1, 2],
        matrix: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        offsets: [5, -3, 2],
        elementType: 1,
      },
    ];

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

    expect(parsed.mct.length).toBeGreaterThanOrEqual(2);
    expect(parsed.mcc.length).toBe(1);
    expect(parsed.mco.length).toBe(1);

    expect(parsed.mcc[0]?.componentIds).toEqual([0, 1, 2]);
    expect(parsed.mcc[0]?.outputComponentIds).toEqual([0, 1, 2]);
    expect(parsed.mco[0]?.stageIndices).toEqual([1]);
    expect(parsed.mcc[0]?.reversible).toBe(false);
  });

  it("uses mcoPrecision bit0 from explicit binding to set MCC reversible flag", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.numLevels = 1;
    params.numLayers = 1;
    params.progressionOrder = 0;
    params.mctBindings = [
      {
        componentIds: [0, 1, 2],
        matrix: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        offsets: [1, 2, 3],
        elementType: 1,
        mcoPrecision: 1,
      },
    ];

    const codestream = new Jpeg2000Encoder().encodeFrame({
      frameData: new Uint8Array([
        10, 20, 30,
        40, 50, 60,
        70, 80, 90,
        100, 110, 120,
      ]),
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
    expect(parsed.mcc).toHaveLength(1);
    expect(parsed.mcc[0]?.reversible).toBe(true);
  });

  it("fallback matrix path derives MCC reversible from irreversible mode", () => {
    const matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];

    const losslessParams = DicomJpeg2000Params.createLosslessDefaults();
    losslessParams.allowMct = true;
    losslessParams.mctBindings = [];
    losslessParams.mctMatrix = matrix;

    const lossyParams = new DicomJpeg2000Params();
    lossyParams.allowMct = true;
    lossyParams.irreversible = true;
    lossyParams.mctBindings = [];
    lossyParams.mctMatrix = matrix;

    const losslessCodestream = new Jpeg2000Encoder().encodeFrame({
      frameData: new Uint8Array([
        10, 20, 30,
        40, 50, 60,
        70, 80, 90,
        100, 110, 120,
      ]),
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: losslessParams,
      isPart2: true,
    });
    const lossyCodestream = new Jpeg2000Encoder().encodeFrame({
      frameData: new Uint8Array([
        10, 20, 30,
        40, 50, 60,
        70, 80, 90,
        100, 110, 120,
      ]),
      width: 2,
      height: 2,
      components: 3,
      bitsAllocated: 8,
      bitsStored: 8,
      pixelRepresentation: PixelRepresentation.Unsigned,
      parameters: lossyParams,
      isPart2: true,
    });

    const parsedLossless = parseJpeg2000Codestream(losslessCodestream);
    const parsedLossy = parseJpeg2000Codestream(lossyCodestream);

    expect(parsedLossless.mcc[0]?.reversible).toBe(true);
    expect(parsedLossy.mcc[0]?.reversible).toBe(false);
  });

  it("skips Part2 markers when fallback input has offsets only without matrix", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.mctBindings = [];
    params.mctOffsets = [5, -3, 2];

    const segments = buildPart2MctMainHeaderSegments(params, 3, false);
    expect(segments).toHaveLength(0);
  });

  it("skips Part2 markers when fallback matrix dimensions are invalid", () => {
    const params = DicomJpeg2000Params.createLosslessDefaults();
    params.allowMct = true;
    params.mctBindings = [];
    params.mctMatrix = [
      [1, 0],
      [0, 1],
    ];
    params.mctOffsets = [5, -3, 2];

    const segments = buildPart2MctMainHeaderSegments(params, 3, false);
    expect(segments).toHaveLength(0);
  });

  it("honors valid mcoRecordOrder when multiple MCC stages are present", () => {
    const params = createMultiStageParams();
    params.mcoRecordOrder = [2, 1];

    const parsed = parseJpeg2000Codestream(encodePart2Codestream(params));
    expect(parsed.mcc).toHaveLength(2);
    expect(parsed.mco).toHaveLength(1);
    expect(parsed.mco[0]?.stageIndices).toEqual([2, 1]);
  });

  it("ignores partial or invalid mcoRecordOrder values and keeps natural MCC stage order", () => {
    const params = createMultiStageParams();
    params.mcoRecordOrder = [2];

    const parsedPartial = parseJpeg2000Codestream(encodePart2Codestream(params));
    expect(parsedPartial.mco[0]?.stageIndices).toEqual([1, 2]);

    params.mcoRecordOrder = [2, 9];
    const parsedInvalid = parseJpeg2000Codestream(encodePart2Codestream(params));
    expect(parsedInvalid.mco[0]?.stageIndices).toEqual([1, 2]);
  });
});

function createMultiStageParams(): DicomJpeg2000Params {
  const params = DicomJpeg2000Params.createLosslessDefaults();
  params.allowMct = true;
  params.numLevels = 1;
  params.numLayers = 1;
  params.mctBindings = [
    {
      componentIds: [0, 1, 2],
      matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      offsets: [5, -3, 2],
      elementType: 1,
      mcoPrecision: 1,
    },
    {
      componentIds: [0, 1, 2],
      matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      offsets: [1, 2, 3],
      elementType: 1,
      mcoPrecision: 1,
    },
  ];
  return params;
}

function encodePart2Codestream(params: DicomJpeg2000Params): Uint8Array {
  return new Jpeg2000Encoder().encodeFrame({
    frameData: new Uint8Array([
      10, 20, 30,
      40, 50, 60,
      70, 80, 90,
      100, 110, 120,
    ]),
    width: 2,
    height: 2,
    components: 3,
    bitsAllocated: 8,
    bitsStored: 8,
    pixelRepresentation: PixelRepresentation.Unsigned,
    parameters: params,
    isPart2: true,
  });
}
