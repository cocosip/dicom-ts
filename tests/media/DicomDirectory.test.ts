import { describe, it, expect } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DicomDirectory } from "../../src/media/DicomDirectory.js";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  DicomLongString,
  DicomPersonName,
  DicomUniqueIdentifier,
} from "../../src/dataset/DicomElement.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

function createTestFile(instanceSuffix: string): DicomFile {
  const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
  ds.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, DicomUIDs.CTImageStorage));
  ds.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, `1.2.3.4.${instanceSuffix}`));
  ds.addOrUpdate(new DicomUniqueIdentifier(DicomTags.StudyInstanceUID, "1.2.3.4.100"));
  ds.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SeriesInstanceUID, "1.2.3.4.200"));
  ds.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^Jane"));
  ds.addOrUpdate(new DicomLongString(DicomTags.PatientID, "PID-1"));
  return new DicomFile(ds);
}

describe("DicomDirectory", () => {
  it("adds files into directory records", () => {
    const dir = new DicomDirectory();
    const file = createTestFile("1");

    const entry = dir.addFile(file, "IMG1");

    expect(entry.patientRecord.directoryRecordType).toBe("PATIENT");
    expect(entry.studyRecord.directoryRecordType).toBe("STUDY");
    expect(entry.seriesRecord.directoryRecordType).toBe("SERIES");
    expect(entry.instanceRecord.directoryRecordType).toBe("IMAGE");
    expect(dir.rootDirectoryRecordCollection.count).toBe(1);
  });

  it("saves and opens a DICOMDIR with directory records", async () => {
    const dir = new DicomDirectory();
    const file1 = createTestFile("1");
    const file2 = createTestFile("2");

    dir.addFile(file1, "IMG1");
    dir.addFile(file2, "IMG2");

    const dirPath = mkdtempSync(join(tmpdir(), "dicomdir-"));
    const filePath = join(dirPath, "DICOMDIR");

    try {
      await dir.save(filePath);
      const opened = await DicomDirectory.open(filePath);

      expect(opened.fileMetaInfo.mediaStorageSOPClassUID?.uid)
        .toBe(DicomUIDs.MediaStorageDirectoryStorage.uid);

      const patient = opened.rootDirectoryRecord;
      expect(patient?.directoryRecordType).toBe("PATIENT");
      const study = patient?.lowerLevelDirectoryRecord;
      expect(study?.directoryRecordType).toBe("STUDY");
      const series = study?.lowerLevelDirectoryRecord;
      expect(series?.directoryRecordType).toBe("SERIES");
      const images = Array.from(series?.lowerLevelDirectoryRecordCollection ?? []);
      expect(images.length).toBe(2);
    } finally {
      rmSync(dirPath, { recursive: true, force: true });
    }
  });
});
