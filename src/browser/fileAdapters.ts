import { DicomFileMetaInformation } from "../DicomFileMetaInformation.js";
import { DicomFileFormat } from "../DicomFileFormat.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { ByteBufferByteSource } from "../io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import { DicomFileReader } from "../io/reader/DicomFileReader.js";
import { DicomFileWriter } from "../io/writer/DicomFileWriter.js";
import type { DicomWriteOptions } from "../io/writer/DicomWriteOptions.js";
import { MemoryByteTarget } from "../io/MemoryByteTarget.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { encodeImageSurface } from "../imaging/runtime/ImageEncoderRegistry.js";
import type { IImage } from "../imaging/IImage.js";
import type { IImageSurface } from "../imaging/runtime/IImageSurface.js";
import { createRuntimeCapabilityError } from "../runtime/RuntimeCapabilityError.js";

export interface BrowserDicomFile {
  readonly fileMetaInfo: DicomFileMetaInformation;
  readonly dataset: DicomDataset;
  readonly transferSyntax: DicomTransferSyntax;
  readonly format: DicomFileFormat;
  readonly isPartial: boolean;
  readonly preamble: Uint8Array | null;
}

export interface BlobLike {
  arrayBuffer(): Promise<ArrayBuffer>;
}

export async function readDicomFromFile(file: BlobLike): Promise<BrowserDicomFile> {
  const buffer = await file.arrayBuffer();
  return readDicomFromArrayBuffer(buffer);
}

export function readDicomFromArrayBuffer(buffer: ArrayBuffer): BrowserDicomFile {
  const source = new ByteBufferByteSource([new MemoryByteBuffer(new Uint8Array(buffer))]);
  const result = DicomFileReader.read(source);

  if (result.transferSyntax.isDeflate) {
    throw createRuntimeCapabilityError(
      "DICOM_DEFLATE_UNSUPPORTED",
      "Deflate transfer syntax is not supported in browser adapters by default."
    );
  }

  return {
    fileMetaInfo: new DicomFileMetaInformation(result.metaInfo),
    dataset: result.dataset,
    transferSyntax: result.transferSyntax,
    format: inferFormat(result.preamble, result.metaInfo),
    isPartial: false,
    preamble: result.preamble,
  };
}

export function writeDicomToBlob(
  input: BrowserDicomFile | { dataset: DicomDataset; fileMetaInfo?: DicomFileMetaInformation | DicomDataset },
  options?: DicomWriteOptions,
): { readonly type: string; readonly size: number; readonly arrayBuffer: () => Promise<ArrayBuffer> } {
  const dataset = input.dataset;
  const fileMetaInfo = input.fileMetaInfo
    ? (input.fileMetaInfo instanceof DicomFileMetaInformation
      ? input.fileMetaInfo
      : new DicomFileMetaInformation(input.fileMetaInfo))
    : new DicomFileMetaInformation(dataset);

  const writer = new DicomFileWriter(options);
  const target = new MemoryByteTarget();
  writer.write(target, fileMetaInfo, dataset);
  return toBlobLike(target.toBuffer(), "application/dicom");
}

export function exportImageToBlob(
  image: IImage | IImageSurface,
  format: string = "jpeg",
  options?: Record<string, unknown>,
): { readonly type: string; readonly size: number; readonly arrayBuffer: () => Promise<ArrayBuffer> } {
  const surface = toSurface(image);
  const encoded = encodeImageSurface(surface, format, options);
  return toBlobLike(encoded, inferMimeType(format));
}

function inferFormat(preamble: Uint8Array | null, metaInfo: DicomDataset): DicomFileFormat {
  if (preamble) return DicomFileFormat.DICOM3;
  if (metaInfo.count > 0) return DicomFileFormat.DICOM3NoPreamble;
  return DicomFileFormat.DICOM3NoFileMetaInfo;
}

function toSurface(image: IImage | IImageSurface): IImageSurface {
  if ("pixelFormat" in image) {
    return image;
  }

  return {
    width: image.width,
    height: image.height,
    pixelFormat: "rgba8",
    pixels: image.pixels,
  };
}

function inferMimeType(format: string): string {
  const normalized = format.trim().toLowerCase();
  if (normalized === "jpg" || normalized === "jpeg") return "image/jpeg";
  if (normalized === "png") return "image/png";
  if (normalized === "webp") return "image/webp";
  return "application/octet-stream";
}

function toBlobLike(
  bytes: Uint8Array,
  type: string,
): { readonly type: string; readonly size: number; readonly arrayBuffer: () => Promise<ArrayBuffer> } {
  return {
    type,
    size: bytes.byteLength,
    arrayBuffer: async () => {
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      return copy.buffer;
    },
  };
}
