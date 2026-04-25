import { ThirdPartyJpegImageEncoder } from "../JpegImage.js";
import { ThirdPartyPngImageEncoder } from "../PngImage.js";
import type { IImageBackend } from "./IImageBackend.js";
import { registerImageEncoder } from "./ImageEncoderRegistry.js";
import { registerImageBackend } from "./ImageBackendRegistry.js";

let webRegistered = false;
let nodeRegistered = false;

export function registerWebImageEncoders(): void {
  if (webRegistered) {
    return;
  }
  registerSharedImageEncoders();
  registerImageBackend(uint8ArrayRgbaBackend);
  nodeRegistered = true;
  webRegistered = true;
}

export function registerNodeImageEncoders(): void {
  if (nodeRegistered) {
    return;
  }
  registerSharedImageEncoders();
  registerImageBackend(uint8ArrayRgbaBackend);
  nodeRegistered = true;
}

export function registerSharedImageEncoders(): void {
  registerImageEncoder(new ThirdPartyJpegImageEncoder());
  registerImageEncoder(new ThirdPartyPngImageEncoder());
}

const uint8ArrayRgbaBackend: IImageBackend<Uint8Array> = {
  id: "uint8array-rgba-backend",
  target: "uint8array",
  convert: (surface) => {
    const copy = new Uint8Array(surface.pixels.length);
    copy.set(surface.pixels);
    return copy;
  },
};
