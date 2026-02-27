import { describe, it, expect } from "vitest";
import {
  PhotometricInterpretation,
  parsePhotometricInterpretation,
  isMonochrome,
} from "../../src/imaging/PhotometricInterpretation.js";

describe("PhotometricInterpretation", () => {
  it("parses aliases and ignores case", () => {
    expect(parsePhotometricInterpretation("monochrome1")).toBe(PhotometricInterpretation.MONOCHROME1);
    expect(parsePhotometricInterpretation("PALETTE COLOR")).toBe(PhotometricInterpretation.PALETTE_COLOR);
    expect(parsePhotometricInterpretation("palette_color")).toBe(PhotometricInterpretation.PALETTE_COLOR);
    expect(parsePhotometricInterpretation(" ybr_full ")).toBe(PhotometricInterpretation.YBR_FULL);
  });

  it("detects monochrome types", () => {
    expect(isMonochrome(PhotometricInterpretation.MONOCHROME1)).toBe(true);
    expect(isMonochrome(PhotometricInterpretation.MONOCHROME2)).toBe(true);
    expect(isMonochrome(PhotometricInterpretation.RGB)).toBe(false);
    expect(isMonochrome(null)).toBe(false);
  });
});
