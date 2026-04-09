import { open as openFs } from "node:fs/promises";
import type { Readable, Writable } from "node:stream";
import { DicomFile, type DicomFileOpenOptions } from "../DicomFile.js";
import { FileByteSource } from "../io/FileByteSource.js";
import { StreamByteSource } from "../io/StreamByteSource.js";
import { FileByteTarget } from "../io/FileByteTarget.js";
import { StreamByteTarget } from "../io/StreamByteTarget.js";
import { DicomFileReader } from "../io/reader/DicomFileReader.js";
import type { DicomWriteOptions } from "../io/writer/DicomWriteOptions.js";
import { DicomFileFormat } from "../DicomFileFormat.js";

export async function openNodeDicomFile(
  source: string | unknown,
  options: DicomFileOpenOptions = {},
): Promise<DicomFile> {
  if (typeof source === "string") {
    const fileSource = new FileByteSource(source, options.readOption, options.largeObjectSize ?? 0);
    try {
      const result = DicomFileReader.read(fileSource);
      const file = DicomFile.fromReadResult(result);
      file.format = inferFormat(result);
      return file;
    } finally {
      fileSource.close();
    }
  }

  const streamSource = new StreamByteSource(source as Readable, options.readOption, options.largeObjectSize ?? 0);
  const result = DicomFileReader.read(streamSource);
  const file = DicomFile.fromReadResult(result);
  file.format = inferFormat(result);
  return file;
}

export async function saveNodeDicomFile(
  file: DicomFile,
  target: string | unknown,
  options?: DicomWriteOptions,
): Promise<void> {
  const bytes = file.toUint8Array(options);

  if (typeof target === "string") {
    const fileTarget = new FileByteTarget(target);
    try {
      fileTarget.writeBytes(bytes);
    } finally {
      const stream = fileTarget.asWritableStream();
      const finished = waitForFinish(stream);
      if ("close" in fileTarget && typeof (fileTarget as { close: () => void }).close === "function") {
        (fileTarget as { close: () => void }).close();
      } else {
        stream.end();
      }
      await finished;
    }
    return;
  }

  const streamTarget = new StreamByteTarget(target as Writable);
  streamTarget.writeBytes(bytes);
}

export async function hasValidHeaderNode(path: string): Promise<boolean> {
  try {
    const handle = await openFs(path, "r");
    try {
      const buffer = Buffer.alloc(4);
      const { bytesRead } = await handle.read(buffer, 0, 4, 128);
      if (bytesRead < 4) return false;
      return buffer[0] === 0x44 && buffer[1] === 0x49 && buffer[2] === 0x43 && buffer[3] === 0x4d;
    } finally {
      await handle.close();
    }
  } catch {
    return false;
  }
}

function inferFormat(result: ReturnType<typeof DicomFileReader.read>): DicomFileFormat {
  if (result.preamble) return DicomFileFormat.DICOM3;
  if (result.metaInfo.count > 0) return DicomFileFormat.DICOM3NoPreamble;
  return DicomFileFormat.DICOM3NoFileMetaInfo;
}

function waitForFinish(stream: NodeJS.WritableStream): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.once("finish", () => resolve());
    stream.once("error", (err) => reject(err));
  });
}
