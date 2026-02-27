import { describe, it, expect } from "vitest";
import { BitDepth } from "../../src/imaging/BitDepth.js";
import { PixelRepresentation } from "../../src/imaging/PixelRepresentation.js";

describe("BitDepth", () => {
  it("computes bytes allocated and validity", () => {
    const depth = new BitDepth(16, 12, 11, PixelRepresentation.Unsigned);
    expect(depth.bytesAllocated).toBe(2);
    expect(depth.isValid).toBe(true);
  });

  it("detects invalid high bit", () => {
    const depth = new BitDepth(16, 12, 10, PixelRepresentation.Unsigned);
    expect(depth.isValid).toBe(false);
  });

  it("computes min/max for signed and unsigned", () => {
    const unsigned = new BitDepth(8, 8, 7, PixelRepresentation.Unsigned);
    expect(unsigned.minValue).toBe(0);
    expect(unsigned.maxValue).toBe(255);

    const signed = new BitDepth(8, 8, 7, PixelRepresentation.Signed);
    expect(signed.minValue).toBe(-128);
    expect(signed.maxValue).toBe(127);
  });
});
