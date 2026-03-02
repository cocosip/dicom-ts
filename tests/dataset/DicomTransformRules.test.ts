import { describe, expect, it } from "vitest";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import { DicomMaskedTag } from "../../src/core/DicomTag.js";
import { DicomUID } from "../../src/core/DicomUID.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  AppendDicomTransformRule,
  ContainsDicomMatchRule,
  CopyValueDicomTransformRule,
  DicomTransformRuleSet,
  DicomTrimPosition,
  GenerateUidDicomTransformRule,
  MapValueDicomTransformRule,
  PadStringDicomTransformRule,
  PrefixDicomTransformRule,
  RegexDicomTransformRule,
  RemoveElementDicomTransformRule,
  SetValueDicomTransformRule,
  SplitFormatDicomTransformRule,
  ToLowerDicomTransformRule,
  ToUpperDicomTransformRule,
  TrimCharactersDicomTransformRule,
  TrimStringDicomTransformRule,
  TruncateDicomTransformRule,
} from "../../src/dataset/index.js";

describe("DicomTransformRules", () => {
  it("applies remove/set/map/copy/regex/prefix/append rules", () => {
    const dataset = createDataset();

    new RemoveElementDicomTransformRule(DicomMaskedTag.parse("(0010,xxxx)")).transform(dataset);
    expect(dataset.contains(DicomTags.PatientName)).toBe(false);
    expect(dataset.contains(DicomTags.PatientID)).toBe(false);

    new SetValueDicomTransformRule(DicomTags.StudyDescription, "initial").transform(dataset);
    new MapValueDicomTransformRule(DicomTags.StudyDescription, "initial", "mapped").transform(dataset);
    new RegexDicomTransformRule(DicomTags.StudyDescription, "map", "MAP").transform(dataset);
    new PrefixDicomTransformRule(DicomTags.StudyDescription, "PRE-").transform(dataset);
    new AppendDicomTransformRule(DicomTags.StudyDescription, "-POST").transform(dataset);
    expect(dataset.getSingleValue<string>(DicomTags.StudyDescription)).toBe("PRE-MAPped-POST");

    dataset.addOrUpdateValue(DicomTags.PatientID, "ABC-100");
    new CopyValueDicomTransformRule(DicomTags.PatientID, DicomTags.AccessionNumber).transform(dataset);
    expect(dataset.getSingleValue<string>(DicomTags.AccessionNumber)).toBe("ABC-100");
  });

  it("applies trim/pad/truncate/split/toUpper/toLower rules", () => {
    const dataset = new DicomDataset();
    dataset.addOrUpdateValue(DicomTags.StudyDescription, "***  MiXed-Case Value  ***");

    new TrimStringDicomTransformRule(DicomTags.StudyDescription, DicomTrimPosition.Both, "*").transform(dataset);
    new TrimCharactersDicomTransformRule(DicomTags.StudyDescription, DicomTrimPosition.Both).transform(dataset);
    new ToUpperDicomTransformRule(DicomTags.StudyDescription).transform(dataset);
    new ToLowerDicomTransformRule(DicomTags.StudyDescription).transform(dataset);
    new PadStringDicomTransformRule(DicomTags.StudyDescription, 20, "_").transform(dataset);
    new TruncateDicomTransformRule(DicomTags.StudyDescription, 10).transform(dataset);
    expect(dataset.getSingleValue<string>(DicomTags.StudyDescription)).toBe("mixed-case");

    dataset.addOrUpdateValue(DicomTags.PatientName, "DOE^JOHN");
    new SplitFormatDicomTransformRule(DicomTags.PatientName, ["^"], "{1}, {0}").transform(dataset);
    expect(dataset.getSingleValue<string>(DicomTags.PatientName)).toBe("JOHN, DOE");
  });

  it("generates new UID and supports conditional transform sets", () => {
    const dataset = createDataset();
    const originalUid = dataset.getSingleValue<string>(DicomTags.StudyInstanceUID);

    new GenerateUidDicomTransformRule(DicomTags.StudyInstanceUID).transform(dataset);
    const generatedUid = dataset.getSingleValue<string>(DicomTags.StudyInstanceUID);
    expect(generatedUid).not.toBe(originalUid);
    expect(DicomUID.isValid(generatedUid)).toBe(true);

    const ruleSet = new DicomTransformRuleSet(
      new ContainsDicomMatchRule(DicomTags.SeriesDescription, "series"),
      new SetValueDicomTransformRule(DicomTags.SeriesDescription, "transformed"),
    );
    ruleSet.transform(dataset);
    expect(dataset.getSingleValue<string>(DicomTags.SeriesDescription)).toBe("transformed");
  });

  it("copies original values into modified attributes dataset when provided", () => {
    const dataset = createDataset();
    const modified = new DicomDataset();

    new SetValueDicomTransformRule(DicomTags.PatientName, "Changed^Name").transform(dataset, modified);
    expect(dataset.getSingleValue<string>(DicomTags.PatientName)).toBe("Changed^Name");
    expect(modified.getSingleValue<string>(DicomTags.PatientName)).toBe("Doe^John");
  });
});

function createDataset(): DicomDataset {
  const dataset = new DicomDataset();
  dataset.addOrUpdateValue(DicomTags.PatientName, "Doe^John");
  dataset.addOrUpdateValue(DicomTags.PatientID, "123456");
  dataset.addOrUpdateValue(DicomTags.StudyDescription, "Test study 1");
  dataset.addOrUpdateValue(DicomTags.SeriesDescription, "Test series 1");
  dataset.addOrUpdateValue(DicomTags.StudyInstanceUID, "1.2.826.0.1.3680043.2.1125.450.1");
  return dataset;
}
