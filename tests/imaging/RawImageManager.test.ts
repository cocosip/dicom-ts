import { describe, it, expect } from "vitest";
import { RawImageManager } from "../../src/imaging/RawImageManager.js";


describe("RawImageManager", () => {
  it("creates raw image instances", () => {
    const pixels = new Uint8Array([1, 2, 3, 4]);
    const img = RawImageManager.create(1, 1, pixels, 4);
    expect(img.width).toBe(1);
    expect(img.height).toBe(1);
    expect([...img.pixels]).toEqual([1, 2, 3, 4]);
  });

  it("creates a blank image with color fill", () => {
    const img = RawImageManager.createBlank(2, 1, [10, 20, 30, 40]);
    expect([...img.pixels]).toEqual([10, 20, 30, 40, 10, 20, 30, 40]);
  });
});
