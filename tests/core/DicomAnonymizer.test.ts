import { describe, expect, it } from "vitest";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import { DicomTag, DicomPrivateCreator } from "../../src/core/DicomTag.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomAnonymizer, SecurityProfile } from "../../src/core/DicomAnonymizer.js";
import { SecurityProfileOptions } from "../../src/core/SecurityProfileOptions.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";

describe("DicomAnonymizer", () => {
  it("anonymizes dataset clone and keeps UID mapping internally consistent", () => {
    const dataset = createIntegrationLikeDataset();
    const originalSopInstanceUid = dataset.getSingleValue<string>(DicomTags.SOPInstanceUID);
    const originalStudyInstanceUid = dataset.getSingleValue<string>(DicomTags.StudyInstanceUID);
    const originalReferencedSop1 = "1.2.826.0.1.3680043.2.1125.200.1";
    const originalReferencedSop2 = "1.2.826.0.1.3680043.2.1125.200.2";

    const anonymizer = new DicomAnonymizer();
    const anonymized = anonymizer.anonymize(dataset);

    expect(dataset.getSingleValue<string>(DicomTags.SOPInstanceUID)).toBe(originalSopInstanceUid);
    expect(dataset.contains(DicomTags.SeriesDate)).toBe(true);

    expect(anonymized.getValueCount(DicomTags.PatientName)).toBe(0);
    expect(anonymized.getValueCount(DicomTags.PatientID)).toBe(0);
    expect(anonymized.getValueCount(DicomTags.StudyDate)).toBe(0);
    expect(anonymized.contains(DicomTags.SeriesDate)).toBe(false);
    expect(anonymized.contains(DicomTags.OriginalAttributesSequence)).toBe(false);

    const anonymizedSopInstanceUid = anonymized.getSingleValue<string>(DicomTags.SOPInstanceUID);
    const anonymizedStudyInstanceUid = anonymized.getSingleValue<string>(DicomTags.StudyInstanceUID);
    expect(anonymizedSopInstanceUid).not.toBe(originalSopInstanceUid);
    expect(anonymizedStudyInstanceUid).not.toBe(originalStudyInstanceUid);
    expect(anonymizer.replacedUIDs.get(originalSopInstanceUid)).toBe(anonymizedSopInstanceUid);
    expect(anonymizer.replacedUIDs.get(originalStudyInstanceUid)).toBe(anonymizedStudyInstanceUid);

    const personCodeSequence = anonymized.getSequence(DicomTags.PersonIdentificationCodeSequence);
    expect(personCodeSequence.items).toHaveLength(0);

    const contourImageSequence = anonymized
      .getSequence(DicomTags.ROIContourSequence).items[0]!
      .getSequence(DicomTags.ContourSequence).items[0]!
      .getSequence(DicomTags.ContourImageSequence);

    const referencedSop1 = contourImageSequence.items[0]!.getSingleValue<string>(DicomTags.ReferencedSOPInstanceUID);
    const referencedSop2 = contourImageSequence.items[1]!.getSingleValue<string>(DicomTags.ReferencedSOPInstanceUID);
    expect(referencedSop1).not.toBe(originalReferencedSop1);
    expect(referencedSop2).not.toBe(originalReferencedSop2);
    expect(referencedSop1).not.toBe(referencedSop2);
    expect(contourImageSequence.items[0]!.getSingleValue<string>(DicomTags.ReferencedFrameNumber)).toBe("1");
    expect(contourImageSequence.items[1]!.getSingleValue<string>(DicomTags.ReferencedFrameNumber)).toBe("2");
  });

  it("respects RetainUIDs profile option", () => {
    const dataset = new DicomDataset();
    dataset.addOrUpdateValue(DicomTags.SOPInstanceUID, "1.2.826.0.1.3680043.2.1125.300.1");
    dataset.addOrUpdateValue(DicomTags.StudyInstanceUID, "1.2.826.0.1.3680043.2.1125.300.2");

    const profile = SecurityProfile.loadProfile(
      null,
      SecurityProfileOptions.BasicProfile | SecurityProfileOptions.RetainUIDs,
    );
    const anonymizer = new DicomAnonymizer(profile);
    anonymizer.anonymizeInPlace(dataset);

    expect(dataset.getSingleValue<string>(DicomTags.SOPInstanceUID)).toBe("1.2.826.0.1.3680043.2.1125.300.1");
    expect(dataset.getSingleValue<string>(DicomTags.StudyInstanceUID)).toBe("1.2.826.0.1.3680043.2.1125.300.2");
    expect(anonymizer.replacedUIDs.size).toBe(0);
  });

  it("applies predefined patient name and patient id overrides", () => {
    const dataset = new DicomDataset();
    dataset.addOrUpdateValue(DicomTags.PatientName, "Original^Name");
    dataset.addOrUpdateValue(DicomTags.PatientID, "OriginalID");

    const profile = SecurityProfile.loadProfile();
    profile.patientName = "Alias^Patient";
    profile.patientID = "Alias-123";

    const anonymized = new DicomAnonymizer(profile).anonymize(dataset);
    expect(anonymized.getSingleValue<string>(DicomTags.PatientName)).toBe("Alias^Patient");
    expect(anonymized.getSingleValue<string>(DicomTags.PatientID)).toBe("Alias-123");
  });

  it("blanks numeric and other VR elements with custom profile action C", () => {
    const creator = new DicomPrivateCreator("TEST");
    const floatTag = new DicomTag(0x300f, 0x1010, creator);
    const otherTag = new DicomTag(0x300f, 0x1011, creator);

    const dataset = new DicomDataset();
    dataset.addOrUpdateElement(DicomVR.FL, floatTag, 12.5);
    dataset.addOrUpdateElement(DicomVR.OF, otherTag, new Float32Array([12.5, 16.5]));

    const profile = SecurityProfile.loadProfile(
      "300f,10[0-9A-F]{2};C;;;;;;;;;;",
      SecurityProfileOptions.BasicProfile,
    );
    new DicomAnonymizer(profile).anonymizeInPlace(dataset);

    expect(dataset.getSingleValue<number>(floatTag)).toBe(0);
    expect(dataset.getValueCount(otherTag)).toBe(0);
  });

  it("loads profile columns by option flags", () => {
    const profileText = "0010,0010;Z;;;;;K;;;;;";
    const source = new DicomDataset();
    source.addOrUpdateValue(DicomTags.PatientName, "Option^Test");

    const basicOnly = SecurityProfile.loadProfile(profileText, SecurityProfileOptions.BasicProfile);
    const anonymizedBasicOnly = new DicomAnonymizer(basicOnly).anonymize(source);
    expect(anonymizedBasicOnly.getValueCount(DicomTags.PatientName)).toBe(0);

    const retainChars = SecurityProfile.loadProfile(
      profileText,
      SecurityProfileOptions.BasicProfile | SecurityProfileOptions.RetainPatientChars,
    );
    const anonymizedRetainChars = new DicomAnonymizer(retainChars).anonymize(source);
    expect(anonymizedRetainChars.getSingleValue<string>(DicomTags.PatientName)).toBe("Option^Test");
  });
});

function createIntegrationLikeDataset(): DicomDataset {
  const dataset = new DicomDataset();
  dataset.addOrUpdateValue(DicomTags.PatientName, "Integration^Patient");
  dataset.addOrUpdateValue(DicomTags.PatientID, "PATIENT-001");
  dataset.addOrUpdateValue(DicomTags.PatientSex, "M");
  dataset.addOrUpdateValue(DicomTags.StudyDate, "20240201");
  dataset.addOrUpdateValue(DicomTags.SeriesDate, "20240202");
  dataset.addOrUpdateValue(DicomTags.SOPInstanceUID, "1.2.826.0.1.3680043.2.1125.100.1");
  dataset.addOrUpdateValue(DicomTags.StudyInstanceUID, "1.2.826.0.1.3680043.2.1125.100.2");
  dataset.addOrUpdateValue(DicomTags.SeriesInstanceUID, "1.2.826.0.1.3680043.2.1125.100.3");

  const personCodeItem = new DicomDataset();
  personCodeItem.addOrUpdateValue(DicomTags.CodeMeaning, "SOME CODE");
  dataset.addOrUpdate(new DicomSequence(DicomTags.PersonIdentificationCodeSequence, personCodeItem));
  dataset.addOrUpdate(new DicomSequence(DicomTags.OriginalAttributesSequence, new DicomDataset()));

  const contourImageItem1 = new DicomDataset();
  contourImageItem1.addOrUpdateValue(DicomTags.ReferencedSOPInstanceUID, "1.2.826.0.1.3680043.2.1125.200.1");
  contourImageItem1.addOrUpdateValue(DicomTags.ReferencedFrameNumber, 1);
  const contourImageItem2 = new DicomDataset();
  contourImageItem2.addOrUpdateValue(DicomTags.ReferencedSOPInstanceUID, "1.2.826.0.1.3680043.2.1125.200.2");
  contourImageItem2.addOrUpdateValue(DicomTags.ReferencedFrameNumber, 2);

  const contourImageSequence = new DicomSequence(DicomTags.ContourImageSequence, contourImageItem1, contourImageItem2);
  const contourItem = new DicomDataset([contourImageSequence]);
  const contourSequence = new DicomSequence(DicomTags.ContourSequence, contourItem);
  const roiContourItem = new DicomDataset([contourSequence]);
  dataset.addOrUpdate(new DicomSequence(DicomTags.ROIContourSequence, roiContourItem));

  return dataset;
}
