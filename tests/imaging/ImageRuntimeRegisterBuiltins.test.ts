import { describe, expect, it } from "vitest";
import {
  getImageBackend,
  convertImageSurface,
  unregisterImageBackend,
} from "../../src/imaging/runtime/ImageBackendRegistry.js";
import { registerWebImageEncoders } from "../../src/imaging/runtime/registerBuiltins.js";

describe("Image runtime builtins", () => {
  it("registers Uint8Array RGBA backend when shared registration runs", () => {
    unregisterImageBackend("uint8array");

    registerWebImageEncoders();

    const backend = getImageBackend("uint8array");
    expect(backend).not.toBeNull();

    const source = new Uint8Array([7, 8, 9, 255]);
    const converted = convertImageSurface<Uint8Array>({
      width: 1,
      height: 1,
      pixelFormat: "rgba8",
      pixels: source,
    }, "uint8array");

    expect(Array.from(converted)).toEqual([7, 8, 9, 255]);
    expect(converted).not.toBe(source);
  });
});
