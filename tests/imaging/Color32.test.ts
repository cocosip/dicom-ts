import { describe, it, expect } from "vitest";
import { Color32 } from "../../src/imaging/Color32.js";

describe("Color32", () => {
  it("clamps channel values to 0-255", () => {
    const c = new Color32(-5, 260, 128, 999);
    expect(c.r).toBe(0);
    expect(c.g).toBe(255);
    expect(c.b).toBe(128);
    expect(c.a).toBe(255);
  });

  it("converts to RGBA bytes", () => {
    const c = new Color32(1, 2, 3, 4);
    expect([...c.toRgba()]).toEqual([1, 2, 3, 4]);
  });

  it("creates from RGB with alpha 255", () => {
    const c = Color32.fromRgb(5, 6, 7);
    expect(c.r).toBe(5);
    expect(c.g).toBe(6);
    expect(c.b).toBe(7);
    expect(c.a).toBe(255);
  });
});
