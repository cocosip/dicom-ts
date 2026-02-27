import { describe, it, expect } from "vitest";
import { ColorSpace } from "../../src/imaging/ColorSpace.js";



describe("ColorSpace", () => {
  it("converts YBR_FULL neutral to RGB gray", () => {
    const c = ColorSpace.ybrFullToRgb(128, 128, 128);
    expect(c.r).toBeGreaterThanOrEqual(127);
    expect(c.r).toBeLessThanOrEqual(129);
    expect(c.g).toBeGreaterThanOrEqual(127);
    expect(c.g).toBeLessThanOrEqual(129);
    expect(c.b).toBeGreaterThanOrEqual(127);
    expect(c.b).toBeLessThanOrEqual(129);
  });
});
