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
  });
});
