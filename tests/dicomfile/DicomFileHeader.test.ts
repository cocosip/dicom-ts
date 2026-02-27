import { describe, it, expect } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DicomFile } from "../../src/DicomFile.js";

async function withTempDir<T>(fn: (dir: string) => Promise<T> | T): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), "dicom-ts-"));
  try {
    return await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("DicomFile.hasValidHeader", () => {
  it("returns true when DICM marker present", async () => {
    await withTempDir(async (dir) => {
      const filePath = join(dir, "valid-header.dcm");
      const bytes = new Uint8Array(132);
      bytes[128] = 0x44; // D
      bytes[129] = 0x49; // I
      bytes[130] = 0x43; // C
      bytes[131] = 0x4d; // M
      writeFileSync(filePath, bytes);
      expect(await DicomFile.hasValidHeader(filePath)).toBe(true);
    });
  });

  it("returns false for short files", async () => {
    await withTempDir(async (dir) => {
      const filePath = join(dir, "short.dcm");
      writeFileSync(filePath, new Uint8Array(10));
      expect(await DicomFile.hasValidHeader(filePath)).toBe(false);
    });
  });

  it("returns false when marker is missing", async () => {
    await withTempDir(async (dir) => {
      const filePath = join(dir, "wrong-magic.dcm");
      const bytes = new Uint8Array(132);
      bytes[128] = 0x44; // D
      bytes[129] = 0x49; // I
      bytes[130] = 0x43; // C
      bytes[131] = 0x00; // wrong last byte
      writeFileSync(filePath, bytes);
      expect(await DicomFile.hasValidHeader(filePath)).toBe(false);
    });
  });
});
