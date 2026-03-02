import { describe, expect, it } from "vitest";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  BoolDicomMatchRule,
  ContainsDicomMatchRule,
  DicomMatchOperator,
  DicomMatchRuleSet,
  EndsWithDicomMatchRule,
  EqualsDicomMatchRule,
  ExistsDicomMatchRule,
  IsEmptyDicomMatchRule,
  NegateDicomMatchRule,
  OneOfDicomMatchRule,
  RegexDicomMatchRule,
  StartsWithDicomMatchRule,
  WildcardDicomMatchRule,
} from "../../src/dataset/index.js";

describe("DicomMatchRules", () => {
  const dataset = createDataset();

  it("matches equals and oneOf", () => {
    expect(new EqualsDicomMatchRule(DicomTags.PatientName, "Doe^John").match(dataset)).toBe(true);
    expect(new EqualsDicomMatchRule(DicomTags.PatientID, "Doe^John").match(dataset)).toBe(false);

    expect(new OneOfDicomMatchRule(DicomTags.PatientID, "123456", "ABC").match(dataset)).toBe(true);
    expect(new OneOfDicomMatchRule(DicomTags.StudyDescription, "ABC", "XYZ").match(dataset)).toBe(false);
  });

  it("matches starts/ends/contains/wildcard/regex", () => {
    expect(new StartsWithDicomMatchRule(DicomTags.PatientName, "Do").match(dataset)).toBe(true);
    expect(new EndsWithDicomMatchRule(DicomTags.PatientName, "ohn").match(dataset)).toBe(true);
    expect(new ContainsDicomMatchRule(DicomTags.StudyDescription, "study").match(dataset)).toBe(true);
    expect(new WildcardDicomMatchRule(DicomTags.SeriesDescription, "*series?1").match(dataset)).toBe(true);
    expect(new WildcardDicomMatchRule(DicomTags.SeriesDescription, "?series 1").match(dataset)).toBe(false);
    expect(new RegexDicomMatchRule(DicomTags.StudyDescription, "^(?i)test StuDy \\d{1}$").match(dataset)).toBe(true);
    expect(new RegexDicomMatchRule(DicomTags.SeriesDescription, "^(?i)test series \\d{2}$").match(dataset)).toBe(false);
  });

  it("supports exists/isEmpty/negate/bool", () => {
    expect(new ExistsDicomMatchRule(DicomTags.PatientName).match(dataset)).toBe(true);
    expect(new ExistsDicomMatchRule(DicomTags.PatientBirthDate).match(dataset)).toBe(false);
    expect(new IsEmptyDicomMatchRule(DicomTags.PatientBirthDate).match(dataset)).toBe(true);
    expect(new IsEmptyDicomMatchRule(DicomTags.PatientName).match(dataset)).toBe(false);
    expect(new NegateDicomMatchRule(new ExistsDicomMatchRule(DicomTags.PatientBirthDate)).match(dataset)).toBe(true);
    expect(new BoolDicomMatchRule(true).match(dataset)).toBe(true);
    expect(new BoolDicomMatchRule(false).match(dataset)).toBe(false);
  });

  it("combines rules with and/or set", () => {
    const andSet = new DicomMatchRuleSet(
      DicomMatchOperator.And,
      new StartsWithDicomMatchRule(DicomTags.PatientName, "Doe"),
      new ContainsDicomMatchRule(DicomTags.StudyDescription, "study"),
    );
    expect(andSet.match(dataset)).toBe(true);

    const orSet = new DicomMatchRuleSet(
      DicomMatchOperator.Or,
      new EqualsDicomMatchRule(DicomTags.PatientID, "NOPE"),
      new EqualsDicomMatchRule(DicomTags.PatientID, "123456"),
    );
    expect(orSet.match(dataset)).toBe(true);
  });
});

function createDataset(): DicomDataset {
  const dataset = new DicomDataset();
  dataset.addOrUpdateValue(DicomTags.PatientName, "Doe^John");
  dataset.addOrUpdateValue(DicomTags.PatientID, "123456");
  dataset.addOrUpdateValue(DicomTags.StudyDescription, "Test study 1");
  dataset.addOrUpdateValue(DicomTags.SeriesDescription, "Test series 1");
  return dataset;
}
