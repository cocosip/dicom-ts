import { DicomDataset } from "../../dataset/DicomDataset.js";
import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import * as DicomTags from "../../core/DicomTag.generated.js";
import type { IByteSource } from "../IByteSource.js";
import { ByteBufferByteSource } from "../ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../buffer/MemoryByteBuffer.js";
import { getDeflateCodecOrThrow } from "../deflateRegistry.js";
import { DicomReader } from "./DicomReader.js";
import { DicomDatasetReaderObserver } from "./DicomDatasetReaderObserver.js";

export interface DicomFileReadResult {
  preamble: Uint8Array | null;
  metaInfo: DicomDataset;
  dataset: DicomDataset;
  transferSyntax: DicomTransferSyntax;
}

/**
 * File-level DICOM reader (preamble + meta + dataset).
 */
export class DicomFileReader {
  static read(source: IByteSource): DicomFileReadResult {
    const preamble = readPreamble(source);

    const metaInfo = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const metaObserver = new DicomDatasetReaderObserver(metaInfo);
    const reader = new DicomReader();

    reader.read(source, metaObserver, {
      transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian,
      stop: (tag) => tag.group !== 0x0002,
    });

    const tsUid = metaInfo.tryGetValue<string>(DicomTags.TransferSyntaxUID, 0);
    const transferSyntax = tsUid
      ? DicomTransferSyntax.parse(tsUid)
      : DicomTransferSyntax.ExplicitVRLittleEndian;

    if (transferSyntax.isDeflate) {
      if (!hasRemainingBytesSource(source)) {
        throw new Error("Deflated transfer syntax requires a source that supports reading remaining bytes.");
      }
      const remaining = source.getRemainingBytes();
      const inflated = inflateDeflated(remaining);
      const inflatedSource = new ByteBufferByteSource([new MemoryByteBuffer(inflated)]);
      const dataset = new DicomDataset(transferSyntax);
      const dsObserver = new DicomDatasetReaderObserver(dataset, metaInfo.fallbackEncodings);
      reader.read(inflatedSource, dsObserver, { transferSyntax });
      return { preamble, metaInfo, dataset, transferSyntax };
    }

    const dataset = new DicomDataset(transferSyntax);
    const dsObserver = new DicomDatasetReaderObserver(dataset, metaInfo.fallbackEncodings);
    reader.read(source, dsObserver, { transferSyntax });
    return { preamble, metaInfo, dataset, transferSyntax };
  }
}

function readPreamble(source: IByteSource): Uint8Array | null {
  const start = source.position;
  try {
    if (!source.require(132)) {
      source.goTo(start);
      return null;
    }
  } catch {
    source.goTo(start);
    return null;
  }
  const preamble = source.getBytes(128);
  const magic = source.getBytes(4);
  if (magic[0] === 0x44 && magic[1] === 0x49 && magic[2] === 0x43 && magic[3] === 0x4d) {
    return preamble;
  }
  source.goTo(start);
  return null;
}

function inflateDeflated(bytes: Uint8Array): Uint8Array {
  const codec = getDeflateCodecOrThrow("inflate");
  try {
    return codec.inflateRaw(bytes);
  } catch {
    return codec.inflate(bytes);
  }
}

function hasRemainingBytesSource(source: IByteSource): source is IByteSource & { getRemainingBytes: () => Uint8Array } {
  return typeof (source as { getRemainingBytes?: unknown }).getRemainingBytes === "function";
}
