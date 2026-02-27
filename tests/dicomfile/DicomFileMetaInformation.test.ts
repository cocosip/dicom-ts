import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomUniqueIdentifier, DicomPersonName } from "../../src/dataset/DicomElement.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomUID } from "../../src/core/DicomUID.js";
import { DicomFileMetaInformation } from "../../src/DicomFileMetaInformation.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

describe("DicomFileMetaInformation", () => {
  it("initializes from dataset values", () => {
    const dataset = new DicomDataset(DicomTransferSyntax.ImplicitVRLittleEndian);
    const sopClass = DicomUID.parse("1.2.3");
    const sopInstance = DicomUID.parse("1.2.3.4");
    dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, sopClass));
    dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, sopInstance));
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^John"));

    const meta = new DicomFileMetaInformation(dataset);

    expect(meta.mediaStorageSOPClassUID?.uid).toBe("1.2.3");
    expect(meta.mediaStorageSOPInstanceUID?.uid).toBe("1.2.3.4");
    expect(meta.transferSyntaxUID).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
    expect(meta.implementationClassUID).toBeTruthy();
    expect(meta.implementationVersionName).toBeTruthy();
    expect(Array.from(meta.version)).toEqual([0x00, 0x01]);
  });
});
