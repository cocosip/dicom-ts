import { readFile, writeFile } from "node:fs/promises";
import { Color32 } from "../imaging/Color32.js";
import { registerColorTableFileIo } from "../imaging/ColorTable.js";
import type { IImageEncoder } from "../imaging/runtime/IImageEncoder.js";
import type { IImageSurface } from "../imaging/runtime/IImageSurface.js";
import { registerImageEncoder } from "../imaging/runtime/ImageEncoderRegistry.js";
import { registerNodeImageEncoders, registerSharedImageEncoders } from "../imaging/runtime/registerBuiltins.js";
import { createRuntimeCapabilityError } from "../runtime/RuntimeCapabilityError.js";

let registered = false;
let nodeImageMode: NodeImageOperationMode = "shared";

export type NodeImageOperationMode = "shared" | "sharp";

export interface RegisterNodeSharpImageOptions {
  fallbackToShared?: boolean;
  sharpImport?: () => Promise<unknown>;
}

/**
 * Registers image operations in Node by reusing shared JPEG/PNG encoders.
 */
export function registerNodeSharedImageOperations(): void {
  registerNodeImageEncoders();
  registerSharedImageEncoders();
  nodeImageMode = "shared";
}

export async function registerNodeSharpImageOperations(options: RegisterNodeSharpImageOptions = {}): Promise<void> {
  registerNodeImageEncoders();

  const importSharp = options.sharpImport ?? defaultSharpImport;
  try {
    const sharp = resolveSharpFactory(await importSharp());
    registerImageEncoder(new SharpJpegImageEncoder(sharp));
    registerImageEncoder(new SharpPngImageEncoder(sharp));
    nodeImageMode = "sharp";
  } catch (error) {
    if (options.fallbackToShared ?? true) {
      registerNodeSharedImageOperations();
      return;
    }

    const reason = error instanceof Error ? error.message : String(error);
    throw createRuntimeCapabilityError(
      "NODE_SHARP_UNAVAILABLE",
      `Failed to register sharp image operations: ${reason}`
    );
  }
}

export async function setNodeImageOperationMode(
  mode: NodeImageOperationMode,
  options: RegisterNodeSharpImageOptions = {},
): Promise<NodeImageOperationMode> {
  if (mode === "shared") {
    registerNodeSharedImageOperations();
    return nodeImageMode;
  }

  await registerNodeSharpImageOperations(options);
  return nodeImageMode;
}

export function getNodeImageOperationMode(): NodeImageOperationMode {
  return nodeImageMode;
}

export function registerNodeImaging(): void {
  if (registered) {
    return;
  }

  registerColorTableFileIo({
    async load(path: string): Promise<Color32[] | null> {
      try {
        const data = await readFile(path);
        if (data.length !== 256 * 3) {
          return null;
        }
        const lut: Color32[] = new Array(256);
        for (let i = 0; i < 256; i++) {
          lut[i] = new Color32(data[i]!, data[i + 256]!, data[i + 512]!, 255);
        }
        return lut;
      } catch {
        return null;
      }
    },
    async save(path: string, lut: Color32[]): Promise<void> {
      if (lut.length !== 256) {
        return;
      }
      const data = new Uint8Array(256 * 3);
      for (let i = 0; i < 256; i++) {
        data[i] = lut[i]!.r;
        data[i + 256] = lut[i]!.g;
        data[i + 512] = lut[i]!.b;
      }
      await writeFile(path, data);
    },
  });

  registerNodeSharedImageOperations();

  registered = true;
}

interface SharpPipelineLike {
  jpeg(options?: { quality?: number }): SharpPipelineLike;
  png(options?: { compressionLevel?: number }): SharpPipelineLike;
  toBuffer(): Promise<Uint8Array | Buffer>;
}

type SharpFactoryLike = (input: Buffer, options: { raw: { width: number; height: number; channels: number } }) => SharpPipelineLike;

class SharpJpegImageEncoder implements IImageEncoder {
  readonly id = "node-sharp-jpeg-encoder";
  readonly format = "jpeg";

  constructor(private readonly sharp: SharpFactoryLike) {}

  encode(): Uint8Array {
    throw createRuntimeCapabilityError(
      "IMAGE_ENCODER_ASYNC_ONLY",
      "Sharp JPEG encoder is async-only. Use encodeImageSurfaceAsync or DicomImage.encodeAsync."
    );
  }

  async encodeAsync(surface: IImageSurface, options?: Record<string, unknown>): Promise<Uint8Array> {
    const quality = normalizeQuality(readNumberOption(options, "quality", 90));
    const output = await this.sharp(toNodeBuffer(surface), {
      raw: { width: surface.width, height: surface.height, channels: 4 },
    }).jpeg({ quality }).toBuffer();
    return toUint8Array(output);
  }
}

class SharpPngImageEncoder implements IImageEncoder {
  readonly id = "node-sharp-png-encoder";
  readonly format = "png";

  constructor(private readonly sharp: SharpFactoryLike) {}

  encode(): Uint8Array {
    throw createRuntimeCapabilityError(
      "IMAGE_ENCODER_ASYNC_ONLY",
      "Sharp PNG encoder is async-only. Use encodeImageSurfaceAsync or DicomImage.encodeAsync."
    );
  }

  async encodeAsync(surface: IImageSurface, options?: Record<string, unknown>): Promise<Uint8Array> {
    const compressionLevel = normalizeCompression(readNumberOption(options, "compressionLevel", 9));
    const output = await this.sharp(toNodeBuffer(surface), {
      raw: { width: surface.width, height: surface.height, channels: 4 },
    }).png({ compressionLevel }).toBuffer();
    return toUint8Array(output);
  }
}

function resolveSharpFactory(moduleValue: unknown): SharpFactoryLike {
  const candidate = typeof moduleValue === "function"
    ? moduleValue
    : (moduleValue && typeof (moduleValue as { default?: unknown }).default === "function"
      ? (moduleValue as { default: unknown }).default
      : null);

  if (!candidate) {
    throw new Error("sharp module does not expose a callable default export");
  }

  return candidate as SharpFactoryLike;
}

function toNodeBuffer(surface: IImageSurface): Buffer {
  return Buffer.from(surface.pixels);
}

function toUint8Array(data: Uint8Array | Buffer): Uint8Array {
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

function readNumberOption(options: Record<string, unknown> | undefined, key: string, defaultValue: number): number {
  const value = options?.[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return defaultValue;
  }
  return value;
}

function normalizeQuality(value: number): number {
  return Math.max(1, Math.min(100, Math.round(value)));
}

function normalizeCompression(value: number): number {
  return Math.max(0, Math.min(9, Math.round(value)));
}

async function defaultSharpImport(): Promise<unknown> {
  const dynamicImport = new Function("modulePath", "return import(modulePath);") as (modulePath: string) => Promise<unknown>;
  return dynamicImport("sharp");
}
