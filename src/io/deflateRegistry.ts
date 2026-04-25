import { createRuntimeCapabilityError } from "../runtime/RuntimeCapabilityError.js";

export interface DeflateCodec {
  inflateRaw(data: Uint8Array): Uint8Array;
  inflate(data: Uint8Array): Uint8Array;
  deflateRaw(data: Uint8Array): Uint8Array;
}

let codec: DeflateCodec | null = null;

export function registerDeflateCodec(value: DeflateCodec): void {
  codec = value;
}

export function clearDeflateCodec(): void {
  codec = null;
}

export function hasDeflateCodec(): boolean {
  return codec !== null;
}

export function getDeflateCodecOrThrow(operation: "inflate" | "deflate"): DeflateCodec {
  if (!codec) {
    throw createRuntimeCapabilityError(
      "DICOM_DEFLATE_UNSUPPORTED",
      `Deflate ${operation} is not available in this runtime. Register a deflate codec provider first.`
    );
  }
  return codec;
}
