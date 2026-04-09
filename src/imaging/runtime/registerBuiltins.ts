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
  if (isNodeLikeRuntime()) {
    registerImageBackend(nodeRgbaBackend);
    nodeRegistered = true;
  }
  webRegistered = true;
}

export function registerNodeImageEncoders(): void {
  if (nodeRegistered) {
    return;
  }
  registerSharedImageEncoders();
  registerImageBackend(nodeRgbaBackend);
  nodeRegistered = true;
}

export function registerSharedImageEncoders(): void {
  registerImageEncoder(new ThirdPartyJpegImageEncoder());
  registerImageEncoder(new ThirdPartyPngImageEncoder());
}

const nodeRgbaBackend: IImageBackend<Uint8Array> = {
  id: "node-rgba-backend",
  target: "node:buffer",
  convert: (surface) => {
    const copy = new Uint8Array(surface.pixels.length);
    copy.set(surface.pixels);
    return copy;
  },
};

function isNodeLikeRuntime(): boolean {
  const p = (globalThis as { process?: { versions?: { node?: string } } }).process;
  return typeof p?.versions?.node === "string" && p.versions.node.length > 0;
}
