/**
 * Representation of one DICOM file.
 *
 * Runtime-neutral core container:
 * - Browser side: in-memory open + export to ArrayBuffer/Blob-like
 * - Node side: path/stream open/save via lazily loaded node adapter
 */
import { DicomTransferSyntax } from "./core/DicomTransferSyntax.js";
import { DicomFileMetaInformation } from "./DicomFileMetaInformation.js";
import { DicomDataset } from "./dataset/DicomDataset.js";
import { DicomFileReader } from "./io/reader/DicomFileReader.js";
import { DicomFileWriter } from "./io/writer/DicomFileWriter.js";
import { FileReadOption } from "./io/FileReadOption.js";
import { DicomFileFormat } from "./DicomFileFormat.js";
import type { DicomWriteOptions } from "./io/writer/DicomWriteOptions.js";
import { ByteBufferByteSource } from "./io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "./io/buffer/MemoryByteBuffer.js";
import { MemoryByteTarget } from "./io/MemoryByteTarget.js";
import { createRuntimeCapabilityError } from "./runtime/RuntimeCapabilityError.js";

export interface DicomFileOpenOptions {
  readOption?: FileReadOption;
  largeObjectSize?: number;
}

export interface BlobLike {
  arrayBuffer(): Promise<ArrayBuffer>;
}

export interface BlobResultLike {
  readonly type: string;
  readonly size: number;
  readonly arrayBuffer: () => Promise<ArrayBuffer>;
}

interface NodeDicomFileAdapter {
  open(source: string | unknown, options: DicomFileOpenOptions): Promise<DicomFile>;
  save(file: DicomFile, target: string | unknown, options?: DicomWriteOptions): Promise<void>;
  hasValidHeader(path: string): Promise<boolean>;
}

/**
 * DICOM file container.
 */
export class DicomFile {
  fileMetaInfo: DicomFileMetaInformation;
  dataset: DicomDataset;
  format: DicomFileFormat;
  isPartial: boolean;

  constructor();
  constructor(dataset: DicomDataset);
  constructor(arg?: DicomDataset) {
    if (arg) {
      this.dataset = arg;
      this.fileMetaInfo = new DicomFileMetaInformation(arg);
    } else {
      this.dataset = new DicomDataset();
      this.fileMetaInfo = new DicomFileMetaInformation();
    }
    this.format = DicomFileFormat.DICOM3;
    this.isPartial = false;
  }

  static async open(source: unknown, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    if (typeof source === "string" || isNodeReadableLike(source)) {
      const adapter = await getNodeAdapter();
      if (!adapter) {
        throw createRuntimeCapabilityError(
          "DICOMFILE_NODE_IO_UNSUPPORTED",
          "Node file/stream open is not available in this runtime."
        );
      }
      return adapter.open(source, options);
    }

    const bytes = await sourceToBytes(source);
    return this.openFromBytes(bytes, options);
  }

  static async openAsync(source: unknown, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    return this.open(source, options);
  }

  /**
   * Browser-friendly alias for opening from `File` / `Blob`.
   */
  static async openFromFile(file: BlobLike, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    return this.openFromBlob(file, options);
  }

  /**
   * Browser-friendly open from blob-like source.
   */
  static async openFromBlob(source: BlobLike, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    const buffer = await source.arrayBuffer();
    return this.openFromArrayBuffer(buffer, options);
  }

  /**
   * Browser-friendly open from ArrayBuffer.
   */
  static async openFromArrayBuffer(source: ArrayBuffer, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    return this.openFromBytes(new Uint8Array(source), options);
  }

  /**
   * Browser-friendly open from in-memory bytes.
   */
  static openFromBytes(source: Uint8Array, _options: DicomFileOpenOptions = {}): DicomFile {
    const byteSource = new ByteBufferByteSource([new MemoryByteBuffer(source)]);
    const result = DicomFileReader.read(byteSource);
    const file = DicomFile.fromReadResult(result);
    file.format = inferFormat(result);
    return file;
  }

  async save(path: string, options?: DicomWriteOptions): Promise<void>;
  async save(target: unknown, options?: DicomWriteOptions): Promise<void>;
  async save(target: unknown, options?: DicomWriteOptions): Promise<void> {
    if (typeof target === "string" || isNodeWritableLike(target)) {
      const adapter = await getNodeAdapter();
      if (!adapter) {
        throw createRuntimeCapabilityError(
          "DICOMFILE_NODE_IO_UNSUPPORTED",
          "Node file/stream save is not available in this runtime."
        );
      }
      await adapter.save(this, target, options);
      return;
    }

    throw new Error("Unsupported save target. Use save(path|stream) in Node or toArrayBuffer()/toBlob() for browser.");
  }

  async toArrayBuffer(options?: DicomWriteOptions): Promise<ArrayBuffer> {
    const bytes = this.toUint8Array(options);
    const copy = new Uint8Array(bytes.byteLength);
    copy.set(bytes);
    return copy.buffer;
  }

  toUint8Array(options?: DicomWriteOptions): Uint8Array {
    this.preprocessFileMetaInformation();
    this.onSave();
    const writer = new DicomFileWriter(options);
    const target = new MemoryByteTarget();
    writer.write(target, this.fileMetaInfo, this.dataset);
    return target.toBuffer();
  }

  async toBlob(options?: DicomWriteOptions): Promise<BlobResultLike> {
    const bytes = this.toUint8Array(options);
    return {
      type: "application/dicom",
      size: bytes.byteLength,
      arrayBuffer: async () => {
        const copy = new Uint8Array(bytes.byteLength);
        copy.set(bytes);
        return copy.buffer;
      },
    };
  }

  static async hasValidHeader(path: string): Promise<boolean> {
    const adapter = await getNodeAdapter();
    if (!adapter) {
      return false;
    }
    return adapter.hasValidHeader(path);
  }

  toString(): string {
    return `DICOM File [${this.format}]`;
  }

  protected preprocessFileMetaInformation(): void {
    if (this.format === DicomFileFormat.ACRNEMA1 || this.format === DicomFileFormat.ACRNEMA2) {
      throw new Error("Unable to save ACR-NEMA file");
    }

    if (this.format === DicomFileFormat.DICOM3NoFileMetaInfo) {
      this.fileMetaInfo = new DicomFileMetaInformation(this.dataset);
    } else {
      this.fileMetaInfo = new DicomFileMetaInformation(this.fileMetaInfo);
    }

    if (!this.fileMetaInfo.transferSyntaxUID) {
      this.fileMetaInfo.transferSyntaxUID = this.dataset.internalTransferSyntax
        ?? DicomTransferSyntax.ExplicitVRLittleEndian;
    }
  }

  protected onSave(): void {
    // subclasses may override
  }

  static fromReadResult(result: ReturnType<typeof DicomFileReader.read>): DicomFile {
    const file = new DicomFile();
    file.dataset = result.dataset;
    file.dataset.internalTransferSyntax = result.transferSyntax;
    file.fileMetaInfo = new DicomFileMetaInformation(result.metaInfo);
    return file;
  }
}

function inferFormat(result: ReturnType<typeof DicomFileReader.read>): DicomFileFormat {
  if (result.preamble) return DicomFileFormat.DICOM3;
  if (result.metaInfo.count > 0) return DicomFileFormat.DICOM3NoPreamble;
  return DicomFileFormat.DICOM3NoFileMetaInfo;
}

async function sourceToBytes(source: unknown): Promise<Uint8Array> {
  if (source instanceof Uint8Array) {
    return source;
  }
  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source);
  }
  if (ArrayBuffer.isView(source)) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }
  if (isBlobLike(source)) {
    const buffer = await source.arrayBuffer();
    return new Uint8Array(buffer);
  }
  throw new Error("Unsupported source for DicomFile.open().");
}

function isBlobLike(value: unknown): value is BlobLike {
  return !!value && typeof value === "object" && typeof (value as BlobLike).arrayBuffer === "function";
}

function isNodeReadableLike(value: unknown): boolean {
  return !!value
    && typeof value === "object"
    && typeof (value as { read?: unknown }).read === "function";
}

function isNodeWritableLike(value: unknown): boolean {
  return !!value
    && typeof value === "object"
    && typeof (value as { write?: unknown }).write === "function";
}

let nodeAdapterPromise: Promise<NodeDicomFileAdapter | null> | null = null;

async function getNodeAdapter(): Promise<NodeDicomFileAdapter | null> {
  if (!nodeAdapterPromise) {
    nodeAdapterPromise = (async () => {
      try {
        const mod = await import("./node/DicomFileNodeAdapter.js");
        return {
          open: mod.openNodeDicomFile,
          save: mod.saveNodeDicomFile,
          hasValidHeader: mod.hasValidHeaderNode,
        } satisfies NodeDicomFileAdapter;
      } catch {
        return null;
      }
    })();
  }
  return nodeAdapterPromise;
}
