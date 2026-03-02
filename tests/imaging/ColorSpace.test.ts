import { describe, it, expect } from "vitest";
import { ColorSpace } from "../../src/imaging/ColorSpace.js";

describe("ColorSpace", () => {
  it("Grayscale has one component", () => {
    expect(ColorSpace.Grayscale.components.length).toBe(1);
    expect(ColorSpace.Grayscale.components[0]!.name).toBe("Value");
  });

  it("RGB has three components", () => {
    expect(ColorSpace.RGB.components.length).toBe(3);
    expect(ColorSpace.RGB.components[0]!.name).toBe("Red");
    expect(ColorSpace.RGB.components[1]!.name).toBe("Green");
    expect(ColorSpace.RGB.components[2]!.name).toBe("Blue");
  });

  it("equals compares by name", () => {
    expect(ColorSpace.RGB.equals(ColorSpace.RGB)).toBe(true);
    expect(ColorSpace.RGB.equals(ColorSpace.BGR)).toBe(false);
    expect(ColorSpace.Grayscale.equals(null)).toBe(false);
  });
});
