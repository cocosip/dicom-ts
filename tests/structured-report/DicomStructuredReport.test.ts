import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomUID } from "../../src/core/DicomUID.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  DicomCodeItem,
  DicomContentItem,
  DicomRelationship,
  DicomStructuredReport,
  DicomValueType,
} from "../../src/structured-report/index.js";

async function withTempDir<T>(fn: (dir: string) => Promise<T> | T): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), "dicom-ts-sr-"));
  try {
    return await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("StructuredReport DicomStructuredReport", () => {
  it("creates, saves and reopens an SR document", async () => {
    const dataset = new DicomDataset();
    dataset.addOrUpdateValue(DicomTags.SOPClassUID, DicomUIDs.BasicTextSRStorage.uid);
    dataset.addOrUpdateValue(DicomTags.SOPInstanceUID, DicomUID.generate().uid);
    dataset.addOrUpdateValue(DicomTags.StudyInstanceUID, DicomUID.generate().uid);
    dataset.addOrUpdateValue(DicomTags.SeriesInstanceUID, DicomUID.generate().uid);
    dataset.addOrUpdateValue(DicomTags.Modality, "SR");
    dataset.addOrUpdateValue(DicomTags.TransferSyntaxUID, DicomTransferSyntax.ExplicitVRLittleEndian.uid.uid);

    const title = new DicomCodeItem("121144", "DCM", "Document Title");
    const text = new DicomContentItem(
      new DicomCodeItem("111412", "DCM", "Narrative Summary"),
      DicomRelationship.Contains,
      DicomValueType.Text,
      "Hello World",
    );
    const report = new DicomStructuredReport(title, text);
    report.dataset.add(dataset);

    await withTempDir(async (dir) => {
      const path = join(dir, "report.dcm");
      await report.save(path);

      const reloaded = await DicomStructuredReport.open(path);
      expect(reloaded.code?.equals(report.code!)).toBe(true);
      expect(reloaded.dataset.getString(DicomTags.SOPInstanceUID)).toBe(report.dataset.getString(DicomTags.SOPInstanceUID));

      const children = [...reloaded.children()];
      expect(children).toHaveLength(1);
      expect(children[0]?.get<string>()).toBe("Hello World");
    });
  });
});
