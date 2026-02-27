import { describe, it, expect } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomFileFormat } from "../../src/DicomFileFormat.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

async function withTempDir<T>(fn: (dir: string) => Promise<T> | T): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), "dicom-ts-"));
  try {
    return await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function pushUInt16LE(out: number[], value: number): void {
  out.push(value & 0xff, (value >> 8) & 0xff);
}

function pushTag(out: number[], group: number, element: number): void {
  pushUInt16LE(out, group);
  pushUInt16LE(out, element);
}

function pushVR(out: number[], vr: string): void {
  out.push(vr.charCodeAt(0), vr.charCodeAt(1));
}

function pushElementExplicit16(out: number[], group: number, element: number, vr: string, value: Uint8Array): void {
  pushTag(out, group, element);
  pushVR(out, vr);
  pushUInt16LE(out, value.length);
  out.push(...value);
}

function padEven(bytes: Uint8Array): Uint8Array {
  if ((bytes.length & 1) === 0) return bytes;
  const out = new Uint8Array(bytes.length + 1);
  out.set(bytes);
  out[out.length - 1] = 0x00;
  return out;
}

describe("DicomFile.open edge cases", () => {
  it("opens dataset without preamble or meta info", async () => {
    await withTempDir(async (dir) => {
      const bytes: number[] = [];
      const pnValue = Buffer.from("NoMeta^File", "ascii");
      pushElementExplicit16(bytes, 0x0010, 0x0010, "PN", pnValue);

      const filePath = join(dir, "no-meta.dcm");
      writeFileSync(filePath, Uint8Array.from(bytes));

      const opened = await DicomFile.open(filePath);
      expect(opened.format).toBe(DicomFileFormat.DICOM3NoFileMetaInfo);
      expect(opened.dataset.getString(DicomTags.PatientName)).toBe("NoMeta^File");
    });
  });

  it("opens dataset with meta info but without preamble", async () => {
    await withTempDir(async (dir) => {
      const bytes: number[] = [];
      const tsUid = "1.2.840.10008.1.2.1";
      const tsValue = padEven(Buffer.from(tsUid, "ascii"));
      pushElementExplicit16(bytes, 0x0002, 0x0010, "UI", tsValue);

      const pnValue = Buffer.from("Doe^NoPreamble", "ascii");
      pushElementExplicit16(bytes, 0x0010, 0x0010, "PN", pnValue);

      const filePath = join(dir, "no-preamble.dcm");
      writeFileSync(filePath, Uint8Array.from(bytes));

      const opened = await DicomFile.open(filePath);
      expect(opened.format).toBe(DicomFileFormat.DICOM3NoPreamble);
      expect(opened.fileMetaInfo.getString(DicomTags.TransferSyntaxUID)).toBe(tsUid);
      expect(opened.dataset.getString(DicomTags.PatientName)).toBe("Doe^NoPreamble");
    });
  });

  it("rejects non-file readable streams", async () => {
    const stream = Readable.from([Uint8Array.from([1, 2, 3])]);
    try {
      await expect(DicomFile.open(stream)).rejects.toThrow(
        "StreamByteSource requires a readable stream with a valid file descriptor"
      );
    } finally {
      stream.destroy();
    }
  });
});
