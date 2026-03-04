import { describe, expect, it } from "vitest";
import {
  forward53_1dWithParity,
  forward97_1dWithParity,
  forwardMultilevel53WithParity,
  forwardMultilevel97WithParity,
  inverse53_1dWithParity,
  inverse97_1dWithParity,
  inverseMultilevel53WithParity,
  inverseMultilevel97WithParity,
} from "../../../src/imaging/codec/jpeg2000/core/wavelet/index.js";

describe("Jpeg2000WaveletForward", () => {
  it("round-trips 5/3 1D transform with even parity", () => {
    const source = new Int32Array([5, -2, 9, 12, -3, 7, 1]);
    const transformed = source.slice();
    forward53_1dWithParity(transformed, true);
    inverse53_1dWithParity(transformed, true);
    expect([...transformed]).toEqual([...source]);
  });

  it("round-trips 5/3 1D transform with odd parity", () => {
    const source = new Int32Array([4, 8, -1, 3, 15, -7]);
    const transformed = source.slice();
    forward53_1dWithParity(transformed, false);
    inverse53_1dWithParity(transformed, false);
    expect([...transformed]).toEqual([...source]);
  });

  it("round-trips multilevel 5/3 transform for 2D signal", () => {
    const width = 8;
    const height = 8;
    const source = new Int32Array(width * height);
    for (let i = 0; i < source.length; i++) {
      source[i] = ((i * 7) % 31) - 15;
    }

    const transformed = source.slice();
    forwardMultilevel53WithParity(transformed, width, height, 3, 0, 0);
    inverseMultilevel53WithParity(transformed, width, height, 3, 0, 0);
    expect([...transformed]).toEqual([...source]);
  });

  it("round-trips 9/7 1D transform with parity variants", () => {
    const source = new Float64Array([3, 8, -2, 6, 10, -4, 1, 5]);
    for (const even of [true, false]) {
      const transformed = source.slice();
      forward97_1dWithParity(transformed, even);
      inverse97_1dWithParity(transformed, even);
      for (let i = 0; i < source.length; i++) {
        expect(transformed[i]).toBeCloseTo(source[i] ?? 0, 6);
      }
    }
  });

  it("round-trips multilevel 9/7 transform for 2D signal", () => {
    const width = 8;
    const height = 8;
    const source = new Float64Array(width * height);
    for (let i = 0; i < source.length; i++) {
      source[i] = ((i * 11) % 37) - 18;
    }

    const transformed = source.slice();
    forwardMultilevel97WithParity(transformed, width, height, 3, 0, 0);
    inverseMultilevel97WithParity(transformed, width, height, 3, 0, 0);
    for (let i = 0; i < source.length; i++) {
      expect(transformed[i]).toBeCloseTo(source[i] ?? 0, 6);
    }
  });
});
