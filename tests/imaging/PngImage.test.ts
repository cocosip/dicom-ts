import { describe, expect, it } from "vitest";
import UPNG from "upng-js";
import { RawImage } from "../../src/imaging/RawImage.js";
import { encodePngImage } from "../../src/imaging/PngImage.js";

describe("PngImage", () => {
  it("encodes RGBA image to a PNG bitstream", () => {
    const image = new RawImage(
      8,
      8,
      createSolidRgba(8, 8, [12, 200, 34, 255]),
      4,
    );

    const png = encodePngImage(image, { colors: 0 });
    const decoded = UPNG.decode(sliceToExactBuffer(png));
    const rgbaFrames = UPNG.toRGBA8(decoded);
    const rgba = new Uint8Array(rgbaFrames[0] ?? new ArrayBuffer(0));

    expect(png[0]).toBe(0x89);
    expect(png[1]).toBe(0x50);
    expect(png[2]).toBe(0x4e);
    expect(png[3]).toBe(0x47);
    expect(rgba.length).toBe(8 * 8 * 4);
    expect(rgba[0]).toBe(12);
    expect(rgba[1]).toBe(200);
    expect(rgba[2]).toBe(34);
    expect(rgba[3]).toBe(255);
  });
});

function createSolidRgba(width: number, height: number, [r, g, b, a]: [number, number, number, number]): Uint8Array {
  const pixels = new Uint8Array(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
    pixels[i + 3] = a;
  }
  return pixels;
}

function sliceToExactBuffer(data: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  return copy.buffer;
}
