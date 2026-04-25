import type { Readable, Writable } from "node:stream";
import {
  DicomDirectory as CoreDicomDirectory,
  type DicomDirectoryOpenOptions,
} from "../../media/DicomDirectory.js";
import type { BlobLike, BrowserDicomFileSaveTarget } from "../../DicomFile.js";
import type { DicomWriteOptions } from "../../io/writer/DicomWriteOptions.js";
import { FileByteSource } from "../io/FileByteSource.js";
import { StreamByteSource } from "../io/StreamByteSource.js";
import { saveNodeDicomFile } from "../DicomFileNodeAdapter.js";

export type { DicomDirectoryOpenOptions } from "../../media/DicomDirectory.js";

export class DicomDirectory extends CoreDicomDirectory {
  static override async open(source: Uint8Array, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async open(source: ArrayBuffer, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async open(source: ArrayBufferView, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async open(source: BlobLike, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async open(path: string, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async open(stream: Readable, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async open(source: unknown, options: DicomDirectoryOpenOptions = {}): Promise<DicomDirectory> {
    if (typeof source === "string") {
      const fileSource = new FileByteSource(source, options.readOption, options.largeObjectSize ?? 0);
      try {
        return this.readFromSource(fileSource);
      } finally {
        fileSource.close();
      }
    }

    if (isNodeReadableLike(source)) {
      const streamSource = new StreamByteSource(source, options.readOption, options.largeObjectSize ?? 0);
      return this.readFromSource(streamSource);
    }

    return await super.open(source as any, options) as DicomDirectory;
  }

  static override async openAsync(source: Uint8Array, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async openAsync(source: ArrayBuffer, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async openAsync(source: ArrayBufferView, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async openAsync(source: BlobLike, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async openAsync(path: string, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async openAsync(stream: Readable, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async openAsync(source: unknown, options: DicomDirectoryOpenOptions = {}): Promise<DicomDirectory> {
    return this.open(source as any, options);
  }

  override async save(path: string, options?: DicomWriteOptions): Promise<void>;
  override async save(stream: Writable, options?: DicomWriteOptions): Promise<void>;
  override async save(options?: DicomWriteOptions): Promise<Uint8Array>;
  override async save(target: BrowserDicomFileSaveTarget, options?: DicomWriteOptions): Promise<void>;
  override async save(
    targetOrOptions?: string | Writable | BrowserDicomFileSaveTarget | DicomWriteOptions,
    options?: DicomWriteOptions,
  ): Promise<Uint8Array | void> {
    if (typeof targetOrOptions === "string" || isNodeWritableLike(targetOrOptions)) {
      await saveNodeDicomFile(this, targetOrOptions, options);
      return;
    }

    return await (super.save as (
      targetOrOptions?: BrowserDicomFileSaveTarget | DicomWriteOptions,
      options?: DicomWriteOptions,
    ) => Promise<Uint8Array | void>)(targetOrOptions as BrowserDicomFileSaveTarget | DicomWriteOptions | undefined, options);
  }
}

function isNodeReadableLike(value: unknown): value is Readable {
  return !!value
    && typeof value === "object"
    && typeof (value as { read?: unknown }).read === "function";
}

function isNodeWritableLike(value: unknown): value is Writable {
  return !!value
    && typeof value === "object"
    && typeof (value as { write?: unknown }).write === "function"
    && (
      typeof (value as { end?: unknown }).end === "function"
      || typeof (value as { on?: unknown }).on === "function"
    );
}
