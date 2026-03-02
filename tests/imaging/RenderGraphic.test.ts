
import { describe, it, expect } from "vitest";
import { OverlayGraphic } from "../../src/imaging/render/OverlayGraphic.js";

describe("OverlayGraphic", () => {
  it("applies overlay mask to image", () => {
    // 2x1 image, RGBA (8 bytes)
    // Pixel 0: Black (0,0,0,255)
    // Pixel 1: Black (0,0,0,255)
    const pixels = new Uint8Array([
      0, 0, 0, 255,
      0, 0, 0, 255,
    ]);
    
    // Mask: 1st pixel active, 2nd inactive
    const mask = new Uint8Array([1, 0]);
    const width = 2;
    const height = 1;
    
    // Red opaque: ARGB = 0xFFFF0000
    // Unpacked: A=FF, R=FF, G=00, B=00
    const color = 0xFFFF0000; 

    const overlay = new OverlayGraphic(mask, width, height, 0, 0, color);
    overlay.render(pixels, width, height);

    expect([...pixels]).toEqual([
      255, 0, 0, 255, // Pixel 0: Red
      0, 0, 0, 255,   // Pixel 1: Black
    ]);
  });

  it("handles offset and scaling", () => {
    // 2x2 image
    const pixels = new Uint8Array(2 * 2 * 4).fill(0); // All transparent black
    // Set alphas to opaque
    for (let i = 3; i < pixels.length; i += 4) pixels[i] = 255;

    // 1x1 overlay, active
    const mask = new Uint8Array([1]);
    
    // Green opaque: ARGB = 0xFF00FF00
    const color = 0xFF00FF00;

    // Offset 1,1 -> should hit bottom-right pixel (1,1)
    const overlay = new OverlayGraphic(mask, 1, 1, 1, 1, color);
    overlay.render(pixels, 2, 2);

    // Pixel 0 (0,0): Black
    expect(pixels[0]).toBe(0);
    expect(pixels[1]).toBe(0);
    expect(pixels[2]).toBe(0);

    // Pixel 3 (1,1): Green
    const p3 = (1 * 2 + 1) * 4;
    expect(pixels[p3]).toBe(0);     // R
    expect(pixels[p3 + 1]).toBe(255); // G
    expect(pixels[p3 + 2]).toBe(0);   // B
    expect(pixels[p3 + 3]).toBe(255); // A
  });
});
