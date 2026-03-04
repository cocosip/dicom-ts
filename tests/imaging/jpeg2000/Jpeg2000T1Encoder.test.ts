import { describe, expect, it } from "vitest";
import { CBLK_STYLE_TERMALL, Jpeg2000T1Decoder, Jpeg2000T1Encoder } from "../../../src/imaging/codec/jpeg2000/core/index.js";

describe("Jpeg2000T1Encoder", () => {
  it("round-trips basic blocks through T1 decode path", () => {
    const vectors = [
      {
        name: "single-non-zero",
        width: 4,
        height: 4,
        data: [0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "mixed-sign",
        width: 4,
        height: 4,
        data: [-4, 0, 0, 0, 0, 8, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1],
      },
      {
        name: "run-length-friendly",
        width: 8,
        height: 8,
        data: buildSparseBlock(8, 8, [
          [0, 0, 100],
          [2, 2, -80],
          [4, 4, 60],
          [6, 6, -40],
        ]),
      },
    ];

    for (const vector of vectors) {
      const maxBitplane = calculateMaxBitplane(vector.data);
      const numPasses = maxBitplane < 0 ? 1 : ((maxBitplane + 1) * 3) - 2;

      const encoder = new Jpeg2000T1Encoder(vector.width, vector.height, 0);
      encoder.setOrientation(0);
      const encoded = encoder.encode(Int32Array.from(vector.data), numPasses, 0);

      expect(encoder.getLastMaxBitplane(), vector.name).toBe(maxBitplane);
      expect(encoded.length, vector.name).toBeGreaterThan(0);

      const decoder = new Jpeg2000T1Decoder(vector.width, vector.height, 0);
      decoder.setOrientation(0);
      decoder.decodeWithBitplane(encoded, numPasses, maxBitplane, 0);

      expect(Array.from(decoder.getData()), vector.name).toEqual(vector.data);
    }
  });

  it("encodes all-zero block and decodes back to zero coefficients", () => {
    const width = 8;
    const height = 8;
    const data = new Array<number>(width * height).fill(0);
    const maxBitplane = calculateMaxBitplane(data);

    const encoder = new Jpeg2000T1Encoder(width, height, 0);
    encoder.setOrientation(0);
    const encoded = encoder.encode(Int32Array.from(data), 1, 0);

    expect(maxBitplane).toBe(-1);
    expect(encoder.getLastMaxBitplane()).toBe(-1);
    expect(encoded.length).toBeGreaterThan(0);

    const decoder = new Jpeg2000T1Decoder(width, height, 0);
    decoder.setOrientation(0);
    decoder.decodeWithBitplane(encoded, 1, maxBitplane, 0);
    expect(Array.from(decoder.getData())).toEqual(data);
  });

  it("collects TERMALL pass offsets for layered packetization", () => {
    const width = 4;
    const height = 4;
    const data = Int32Array.from([
      0, 0, 0, 0,
      0, 12, 0, 0,
      0, 0, -6, 0,
      0, 0, 0, 3,
    ]);
    const maxBitplane = calculateMaxBitplane(Array.from(data));
    const numPasses = maxBitplane < 0 ? 1 : ((maxBitplane + 1) * 3) - 2;

    const encoder = new Jpeg2000T1Encoder(width, height, CBLK_STYLE_TERMALL);
    encoder.setOrientation(0);
    const encoded = encoder.encodeWithPasses(data, numPasses, 0);

    expect(encoded.passEndOffsets.length).toBe(numPasses);
    expect(encoded.passEndOffsets[numPasses - 1]).toBe(encoded.data.length);
    for (let i = 1; i < encoded.passEndOffsets.length; i++) {
      expect(encoded.passEndOffsets[i]!).toBeGreaterThanOrEqual(encoded.passEndOffsets[i - 1]!);
    }

    const decoder = new Jpeg2000T1Decoder(width, height, CBLK_STYLE_TERMALL);
    decoder.setOrientation(0);
    decoder.decodeLayeredWithMode(encoded.data, encoded.passEndOffsets, maxBitplane, 0, true, false);
    expect(Array.from(decoder.getData())).toEqual(Array.from(data));
  });
});

function calculateMaxBitplane(data: number[]): number {
  let maxAbs = 0;
  for (let i = 0; i < data.length; i++) {
    const value = data[i] ?? 0;
    const absValue = value < 0 ? -value : value;
    if (absValue > maxAbs) {
      maxAbs = absValue;
    }
  }

  if (maxAbs === 0) {
    return -1;
  }

  let bitplane = 0;
  while (maxAbs > 0) {
    maxAbs = Math.floor(maxAbs / 2);
    bitplane++;
  }
  return bitplane - 1;
}

function buildSparseBlock(width: number, height: number, entries: Array<[number, number, number]>): number[] {
  const output = new Array<number>(width * height).fill(0);
  for (let i = 0; i < entries.length; i++) {
    const [x, y, value] = entries[i]!;
    output[y * width + x] = value;
  }
  return output;
}
