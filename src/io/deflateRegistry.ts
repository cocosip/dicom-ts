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
  ensureDefaultNodeCodec();
  return codec !== null;
}

export function getDeflateCodecOrThrow(operation: "inflate" | "deflate"): DeflateCodec {
  ensureDefaultNodeCodec();
  if (!codec) {
    throw createRuntimeCapabilityError(
      "DICOM_DEFLATE_UNSUPPORTED",
      `Deflate ${operation} is not available in this runtime. Register a deflate codec provider first.`
    );
  }
  return codec;
}

function ensureDefaultNodeCodec(): void {
  if (codec) {
    return;
  }

  try {
    const maybeRequire = Function("return typeof require === 'function' ? require : undefined;")() as
      | ((id: string) => any)
      | undefined;
    if (!maybeRequire) {
      return;
    }

    const zlib = maybeRequire("node:zlib");
    codec = {
      inflateRaw: (data: Uint8Array) => zlib.inflateRawSync(data),
      inflate: (data: Uint8Array) => zlib.inflateSync(data),
      deflateRaw: (data: Uint8Array) => zlib.deflateRawSync(data),
    };
  } catch {
    // ignore; runtime can still register codec explicitly
  }
}
