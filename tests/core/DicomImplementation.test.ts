import { describe, expect, it } from "vitest";
import { DicomFileMetaInformation } from "../../src/DicomFileMetaInformation.js";
import { DicomImplementation } from "../../src/core/DicomImplementation.js";
import { DicomUID, DicomUidType } from "../../src/core/DicomUID.js";

describe("DicomImplementation", () => {
  it("uses expected default class UID and version format", () => {
    expect(DicomImplementation.ClassUID.uid).toBe("1.3.6.1.4.1.30071.8");
    expect(DicomUID.isValid(DicomImplementation.ClassUID.uid)).toBe(true);
    expect(DicomImplementation.Version).toMatch(/^dicom-ts \d+\.\d+\.\d+$/);
    expect(DicomImplementation.Version.length).toBeLessThanOrEqual(16);
  });

  it("supports overriding class UID and version", () => {
    const originalClassUID = DicomImplementation.ClassUID;
    const originalVersion = DicomImplementation.Version;
    try {
      DicomImplementation.ClassUID = new DicomUID(
        "1.2.826.0.1.3680043.10.543.1",
        "Implementation Class UID",
        DicomUidType.Unknown,
      );
      DicomImplementation.Version = "dicom-ts test";

      expect(DicomImplementation.ClassUID.uid).toBe("1.2.826.0.1.3680043.10.543.1");
      expect(DicomImplementation.Version).toBe("dicom-ts test");
    } finally {
      DicomImplementation.ClassUID = originalClassUID;
      DicomImplementation.Version = originalVersion;
    }
  });

  it("is used by default in file meta information", () => {
    const meta = new DicomFileMetaInformation();
    expect(meta.implementationClassUID?.uid).toBe(DicomImplementation.ClassUID.uid);
    expect(meta.implementationVersionName).toBe(DicomImplementation.Version);
  });
});
