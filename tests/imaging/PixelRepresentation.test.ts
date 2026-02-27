import { describe, it, expect } from "vitest";
import { PixelRepresentation, parsePixelRepresentation } from "../../src/imaging/PixelRepresentation.js";

describe("PixelRepresentation", () => {
  it("parses signed/unsigned values", () => {
    expect(parsePixelRepresentation(0)).toBe(PixelRepresentation.Unsigned);
    expect(parsePixelRepresentation(1)).toBe(PixelRepresentation.Signed);
    expect(parsePixelRepresentation("1")).toBe(PixelRepresentation.Signed);
  });

  it("defaults to unsigned on null/undefined", () => {
    expect(parsePixelRepresentation(null)).toBe(PixelRepresentation.Unsigned);
    expect(parsePixelRepresentation(undefined)).toBe(PixelRepresentation.Unsigned);
  });
});
