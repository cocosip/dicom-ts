import type { PixelRepresentation } from "../../../PixelRepresentation.js";
import type { DicomJpeg2000Params } from "../DicomJpeg2000Params.js";
import { Jpeg2000Decoder } from "../core/decoder/index.js";
import { Jpeg2000Encoder } from "../core/encoder/index.js";

export interface EncodeJpeg2000Options {
  width: number;
  height: number;
  components: number;
  bitsAllocated: number;
  bitsStored: number;
  pixelRepresentation: PixelRepresentation;
  parameters: DicomJpeg2000Params;
  isPart2: boolean;
}

export interface DecodeJpeg2000Result {
  pixelData: Uint8Array;
  metadata: {
    width: number;
    height: number;
    components: number;
    bitsAllocated: number;
    bitsStored: number;
  };
  irreversible: boolean;
  isPart2: boolean;
}

export function encodeJpeg2000(frameData: Uint8Array, options: EncodeJpeg2000Options): Uint8Array {
  return new Jpeg2000Encoder().encodeFrame({
    frameData,
    width: options.width,
    height: options.height,
    components: options.components,
    bitsAllocated: options.bitsAllocated,
    bitsStored: options.bitsStored,
    pixelRepresentation: options.pixelRepresentation,
    parameters: options.parameters,
    isPart2: options.isPart2,
  });
}

export function decodeJpeg2000(frameData: Uint8Array): DecodeJpeg2000Result {
  const decoded = new Jpeg2000Decoder().decode(frameData);
  const bitsStored = decoded.bitDepth;
  return {
    pixelData: decoded.pixelData,
    metadata: {
      width: decoded.width,
      height: decoded.height,
      components: decoded.components,
      bitsAllocated: bitsStored <= 8 ? 8 : 16,
      bitsStored,
    },
    irreversible: decoded.irreversible,
    isPart2: decoded.isPart2,
  };
}
