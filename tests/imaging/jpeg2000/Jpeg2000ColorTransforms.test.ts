import { describe, expect, it } from "vitest";
import {
  forwardIct,
  forwardRct,
  inverseIct,
  inverseRct,
} from "../../../src/imaging/codec/jpeg2000/core/index.js";

describe("Jpeg2000ColorTransforms", () => {
  it("applies inverse RCT exactly with integer arithmetic", () => {
    const converted = inverseRct(100, 20, -10);
    expect(converted).toEqual({
      r: 88,
      g: 98,
      b: 118,
    });
  });

  it("applies inverse ICT with JPEG2000 rounding behavior", () => {
    const neutral = inverseIct(100, 0, 0);
    expect(neutral).toEqual({
      r: 100,
      g: 100,
      b: 100,
    });

    const converted = inverseIct(50, 20, -10);
    expect(converted).toEqual({
      r: 36,
      g: 50,
      b: 85,
    });
  });

  it("round-trips forward/inverse RCT for one pixel", () => {
    const transformed = forwardRct(88, 98, 118);
    expect(transformed).toEqual({
      y: 100,
      cb: 20,
      cr: -10,
    });

    const restored = inverseRct(transformed.y, transformed.cb, transformed.cr);
    expect(restored).toEqual({
      r: 88,
      g: 98,
      b: 118,
    });
  });

  it("round-trips forward/inverse ICT approximately", () => {
    const transformed = forwardIct(36, 50, 85);
    const restored = inverseIct(transformed.y, transformed.cb, transformed.cr);
    expect(restored.r).toBeCloseTo(36, 0);
    expect(restored.g).toBeCloseTo(50, 0);
    expect(restored.b).toBeCloseTo(85, 0);
  });
});
