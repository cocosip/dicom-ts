import { describe, it, expect } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomPersonName, DicomUniqueIdentifier } from "../../src/dataset/DicomElement.js";
import { DicomUID } from "../../src/core/DicomUID.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

describe("DicomFile", () => {
  it("saves and opens a DICOM file", async () => {
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const sopClass = DicomUID.parse("1.2.3");
    const sopInstance = DicomUID.parse("1.2.3.4");
    dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, sopClass));
    dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, sopInstance));
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^Jane"));

    const file = new DicomFile(dataset);

    const dir = mkdtempSync(join(tmpdir(), "dicom-ts-"));
    const filePath = join(dir, "roundtrip.dcm");
    try {
      await file.save(filePath);
      const opened = await DicomFile.open(filePath);
      expect(opened.dataset.getString(DicomTags.PatientName)).toBe("Doe^Jane");
      expect(opened.fileMetaInfo.mediaStorageSOPClassUID?.uid).toBe("1.2.3");
      expect(await DicomFile.hasValidHeader(filePath)).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
