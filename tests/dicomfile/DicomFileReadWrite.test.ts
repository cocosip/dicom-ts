import { describe, it, expect } from "vitest";
import { createReadStream, createWriteStream, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  DicomLongString,
  DicomCodeString,
  DicomShortText,
  DicomOtherByte,
  DicomPersonName,
  DicomUniqueIdentifier,
} from "../../src/dataset/DicomElement.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { FileReadOption } from "../../src/io/FileReadOption.js";
import { FileByteBuffer } from "../../src/io/buffer/FileByteBuffer.js";
import { StreamByteBuffer } from "../../src/io/buffer/StreamByteBuffer.js";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

function buildFile(pixelData?: Uint8Array): DicomFile {
  const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
  dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, DicomUIDs.CTImageStorage));
  dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, "1.2.3.4.5"));
  dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^Stream"));
  dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, "P001"));
  if (pixelData) {
    dataset.addOrUpdate(new DicomOtherByte(DicomTags.PixelData, pixelData));
  }
  return new DicomFile(dataset);
}

async function withTempDir<T>(fn: (dir: string) => Promise<T> | T): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), "dicom-ts-"));
  try {
    return await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function writeFileViaStream(file: DicomFile, filePath: string): Promise<void> {
  const stream = createWriteStream(filePath);
  const done = new Promise<void>((resolve, reject) => {
    stream.once("finish", () => resolve());
    stream.once("error", (err) => reject(err));
  });
  await file.save(stream);
  stream.end();
  await done;
}

async function openReadStream(filePath: string) {
  const stream = createReadStream(filePath);
  await new Promise<void>((resolve, reject) => {
    stream.once("open", () => resolve());
    stream.once("error", (err) => reject(err));
  });
  return stream;
}

describe("DicomFile read/write", () => {
  it("saves to a writable stream", async () => {
    await withTempDir(async (dir) => {
      const file = buildFile();
      const filePath = join(dir, "stream-save.dcm");
      await writeFileViaStream(file, filePath);

      const opened = await DicomFile.open(filePath);
      expect(opened.dataset.getString(DicomTags.PatientName)).toBe("Doe^Stream");
      expect(opened.dataset.getString(DicomTags.PatientID)).toBe("P001");
    });
  });

  it("opens from a readable stream", async () => {
    await withTempDir(async (dir) => {
      const file = buildFile();
      const filePath = join(dir, "stream-open.dcm");
      await file.save(filePath);

      const stream = await openReadStream(filePath);
      try {
        const opened = await DicomFile.open(stream);
        expect(opened.dataset.getString(DicomTags.PatientName)).toBe("Doe^Stream");
      } finally {
        stream.close();
      }
    });
  });

  it("reads large tags on demand from file", async () => {
    const pixelData = new Uint8Array(64).fill(0x5a);
    await withTempDir(async (dir) => {
      const file = buildFile(pixelData);
      const filePath = join(dir, "large-on-demand.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath, {
        readOption: FileReadOption.ReadLargeOnDemand,
        largeObjectSize: 32,
      });

      const pixel = opened.dataset.getDicomItem<DicomOtherByte>(DicomTags.PixelData)!;
      expect(pixel.buffer instanceof FileByteBuffer).toBe(true);
      expect(pixel.buffer.isMemory).toBe(false);
      expect(pixel.buffer.size).toBe(pixelData.length);
      expect(Array.from(pixel.buffer.getByteRange(0, pixelData.length))).toEqual(Array.from(pixelData));
    });
  });

  it("defaults to read large tags on demand", async () => {
    const pixelData = new Uint8Array(64).fill(0x7e);
    await withTempDir(async (dir) => {
      const file = buildFile(pixelData);
      const filePath = join(dir, "default-on-demand.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath, { largeObjectSize: 32 });
      const pixel = opened.dataset.getDicomItem<DicomOtherByte>(DicomTags.PixelData)!;
      expect(pixel.buffer instanceof FileByteBuffer).toBe(true);
      expect(pixel.buffer.isMemory).toBe(false);
      expect(pixel.buffer.size).toBe(pixelData.length);
    });
  });

  it("reads large tags into memory when configured", async () => {
    const pixelData = new Uint8Array(64).fill(0x33);
    await withTempDir(async (dir) => {
      const file = buildFile(pixelData);
      const filePath = join(dir, "read-all.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath, {
        readOption: FileReadOption.ReadAll,
        largeObjectSize: 32,
      });

      const pixel = opened.dataset.getDicomItem<DicomOtherByte>(DicomTags.PixelData)!;
      expect(pixel.buffer.isMemory).toBe(true);
      expect(Array.from(pixel.buffer.data)).toEqual(Array.from(pixelData));
    });
  });

  it("reads large tags on demand from stream", async () => {
    const pixelData = new Uint8Array(64).fill(0x6b);
    await withTempDir(async (dir) => {
      const file = buildFile(pixelData);
      const filePath = join(dir, "large-on-demand-stream.dcm");
      await file.save(filePath);

      const stream = await openReadStream(filePath);
      try {
        const opened = await DicomFile.open(stream, {
          readOption: FileReadOption.ReadLargeOnDemand,
          largeObjectSize: 32,
        });

        const pixel = opened.dataset.getDicomItem<DicomOtherByte>(DicomTags.PixelData)!;
        expect(pixel.buffer instanceof StreamByteBuffer).toBe(true);
        expect(pixel.buffer.isMemory).toBe(false);
        expect(pixel.buffer.size).toBe(pixelData.length);
        expect(Array.from(pixel.buffer.getByteRange(0, pixelData.length))).toEqual(Array.from(pixelData));
      } finally {
        stream.close();
      }
    });
  });

  it("skips large tags when configured", async () => {
    const pixelData = new Uint8Array(64).fill(0x2a);
    await withTempDir(async (dir) => {
      const file = buildFile(pixelData);
      const filePath = join(dir, "large-skip.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath, {
        readOption: FileReadOption.SkipLargeTags,
        largeObjectSize: 32,
      });

      const pixel = opened.dataset.getDicomItem<DicomOtherByte>(DicomTags.PixelData)!;
      expect(pixel.buffer.size).toBe(0);
      expect(pixel.buffer.data.length).toBe(0);
      expect(opened.dataset.getString(DicomTags.PatientName)).toBe("Doe^Stream");
    });
  });

  it("round-trips UTF-8 patient name without mojibake", async () => {
    const patientName = "张三^李四";
    await withTempDir(async (dir) => {
      const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, DicomUIDs.CTImageStorage));
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, "1.2.3.4.6"));
      dataset.addOrUpdate(new DicomCodeString(DicomTags.SpecificCharacterSet, "ISO_IR 192"));
      dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, patientName));

      const file = new DicomFile(dataset);
      const filePath = join(dir, "utf8-pn.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath);
      expect(opened.dataset.getString(DicomTags.PatientName)).toBe(patientName);
      expect(opened.dataset.getString(DicomTags.SpecificCharacterSet)).toBe("ISO_IR 192");
    });
  });

  it("round-trips GB18030 patient name without mojibake", async () => {
    const patientName = "张三^李四";
    await withTempDir(async (dir) => {
      const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, DicomUIDs.CTImageStorage));
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, "1.2.3.4.7"));
      dataset.addOrUpdate(new DicomCodeString(DicomTags.SpecificCharacterSet, "GB18030"));
      dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, patientName));

      const file = new DicomFile(dataset);
      const filePath = join(dir, "gb18030-pn.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath);
      expect(opened.dataset.getString(DicomTags.PatientName)).toBe(patientName);
      expect(opened.dataset.getString(DicomTags.SpecificCharacterSet)).toBe("GB18030");
    });
  });

  it("round-trips GBK patient name without mojibake", async () => {
    const patientName = "张三^李四";
    await withTempDir(async (dir) => {
      const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, DicomUIDs.CTImageStorage));
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, "1.2.3.4.8"));
      dataset.addOrUpdate(new DicomCodeString(DicomTags.SpecificCharacterSet, "GBK"));
      dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, patientName));

      const file = new DicomFile(dataset);
      const filePath = join(dir, "gbk-pn.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath);
      expect(opened.dataset.getString(DicomTags.PatientName)).toBe(patientName);
      expect(opened.dataset.getString(DicomTags.SpecificCharacterSet)).toBe("GBK");
    });
  });

  it("round-trips multi-charset patient name without mojibake", async () => {
    const patientName = "DOE^张三";
    await withTempDir(async (dir) => {
      const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, DicomUIDs.CTImageStorage));
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, "1.2.3.4.9"));
      dataset.addOrUpdate(new DicomCodeString(
        DicomTags.SpecificCharacterSet,
        "ISO 2022 IR 6",
        "ISO 2022 IR 58"
      ));
      dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, patientName));

      const file = new DicomFile(dataset);
      const filePath = join(dir, "multi-charset-pn.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath);
      expect(opened.dataset.getString(DicomTags.PatientName)).toBe(patientName);
      expect(opened.dataset.getString(DicomTags.SpecificCharacterSet)).toBe("ISO 2022 IR 6\\ISO 2022 IR 58");
    });
  });

  it("round-trips multi-charset non-PN strings without mojibake", async () => {
    const asciiText = "ASCII_TEXT";
    const chineseText = "中文内容";
    await withTempDir(async (dir) => {
      const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, DicomUIDs.CTImageStorage));
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, "1.2.3.4.10"));
      dataset.addOrUpdate(new DicomCodeString(
        DicomTags.SpecificCharacterSet,
        "ISO 2022 IR 6",
        "ISO 2022 IR 58"
      ));

      dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, `${asciiText} ${chineseText}`));
      dataset.addOrUpdate(new DicomShortText(DicomTags.StudyDescription, `${chineseText} ${asciiText}`));

      const file = new DicomFile(dataset);
      const filePath = join(dir, "multi-charset-non-pn.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath);
      expect(opened.dataset.getString(DicomTags.PatientID)).toBe(`${asciiText} ${chineseText}`);
      expect(opened.dataset.getString(DicomTags.StudyDescription)).toBe(`${chineseText} ${asciiText}`);
      expect(opened.dataset.getString(DicomTags.SpecificCharacterSet)).toBe("ISO 2022 IR 6\\ISO 2022 IR 58");
    });
  });
});
