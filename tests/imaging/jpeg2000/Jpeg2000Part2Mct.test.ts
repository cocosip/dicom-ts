import { describe, expect, it } from "vitest";
import type { Jpeg2000Codestream } from "../../../src/imaging/codec/jpeg2000/core/codestream/index.js";
import {
  applyPart2MctToPixel,
  resolvePart2MctPlan,
} from "../../../src/imaging/codec/jpeg2000/core/colorspace/index.js";

describe("Jpeg2000Part2Mct", () => {
  it("applies MCC binding matrix and offsets in stage order", () => {
    const codestream = createEmptyCodestream();
    codestream.mct.push({
      index: 1,
      arrayType: 1,
      elementType: 1,
      data: int32Matrix([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]),
    });
    codestream.mct.push({
      index: 2,
      arrayType: 2,
      elementType: 1,
      data: int32Offsets([10, -5, 2]),
    });
    codestream.mcc.push({
      index: 1,
      collectionType: 0,
      numComponents: 3,
      componentIds: [0, 1, 2],
      outputComponentIds: [0, 1, 2],
      decorrelateIndex: 1,
      offsetIndex: 2,
      reversible: true,
    });
    codestream.mco.push({
      numStages: 1,
      stageIndices: [1],
    });

    const plan = resolvePart2MctPlan(codestream, 3);
    expect(plan.bindings).toHaveLength(1);

    const pixel = [100, 20, 30];
    applyPart2MctToPixel(pixel, plan);
    expect(pixel).toEqual([110, 15, 32]);
  });

  it("falls back to legacy MCT matrix when MCC is absent", () => {
    const codestream = createEmptyCodestream();
    codestream.mct.push({
      index: 1,
      arrayType: 1,
      elementType: 1,
      data: int32Matrix([
        [1, 1, 0],
        [0, 1, 1],
        [1, 0, 1],
      ]),
    });

    const plan = resolvePart2MctPlan(codestream, 3);
    expect(plan.bindings).toHaveLength(0);
    expect(plan.fallbackMatrix).toBeDefined();

    const pixel = [1, 2, 3];
    applyPart2MctToPixel(pixel, plan);
    expect(pixel).toEqual([3, 5, 4]);
  });
});

function createEmptyCodestream(): Jpeg2000Codestream {
  return {
    data: new Uint8Array(0),
    mainHeaderSegments: [],
    tileHeaderSegments: [],
    coc: new Map(),
    qcc: new Map(),
    poc: [],
    mct: [],
    mcc: [],
    mco: [],
    tiles: [],
  };
}

function int32Matrix(rows: number[][]): Uint8Array {
  const values: number[] = [];
  for (const row of rows) {
    values.push(...row);
  }
  const bytes = new Uint8Array(values.length * 4);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < values.length; i++) {
    view.setInt32(i * 4, values[i] ?? 0, false);
  }
  return bytes;
}

function int32Offsets(values: number[]): Uint8Array {
  const bytes = new Uint8Array(values.length * 4);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < values.length; i++) {
    view.setInt32(i * 4, values[i] ?? 0, false);
  }
  return bytes;
}
