import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  cloneDataset,
  enumerateGroup,
  enumerateMasked,
  getDateTime,
  getDateTimeOffset,
  notValidated,
  tryGetDateTime,
  tryGetDateTimeOffset,
  validated,
} from "../../src/dataset/DicomDatasetExtensions.js";
import { DicomTag, DicomMaskedTag } from "../../src/core/DicomTag.js";
import { DicomDate, DicomShortString, DicomTime, DicomUnsignedLong, DicomUnsignedShort } from "../../src/dataset/DicomElement.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import * as Tags from "../../src/core/DicomTag.generated.js";

const MIN_DATE = new Date(Date.UTC(1, 0, 1, 0, 0, 0, 0));

function localOffsetMinutesFor(date: Date): number {
  const local = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
  return -local.getTimezoneOffset();
}

describe("DicomDatasetExtensions - getDateTime", () => {
  it("combines date and time", () => {
    const ds = new DicomDataset([
      new DicomDate(Tags.CreationDate, "20160525"),
      new DicomTime(Tags.CreationTime, "155431"),
    ]);
    const actual = getDateTime(ds, Tags.CreationDate, Tags.CreationTime);
    const expected = new Date(Date.UTC(2016, 4, 25, 15, 54, 31, 0));
    expect(actual.getTime()).toBe(expected.getTime());

    const maybe = tryGetDateTime(ds, Tags.CreationDate, Tags.CreationTime);
    expect(maybe?.getTime()).toBe(expected.getTime());
  });

  it("combines date and time with milliseconds", () => {
    const ds = new DicomDataset([
      new DicomDate(Tags.CreationDate, "20160525"),
      new DicomTime(Tags.CreationTime, "155431.750"),
    ]);
    const actual = getDateTime(ds, Tags.CreationDate, Tags.CreationTime);
    const expected = new Date(Date.UTC(2016, 4, 25, 15, 54, 31, 750));
    expect(actual.getTime()).toBe(expected.getTime());
  });

  it("missing date and time returns min date", () => {
    const ds = new DicomDataset();
    const actual = getDateTime(ds, Tags.CreationDate, Tags.CreationTime);
    expect(actual.getTime()).toBe(MIN_DATE.getTime());
  });

  it("missing date uses min date with specified time", () => {
    const ds = new DicomDataset([new DicomTime(Tags.CreationTime, "160215")]);
    const actual = getDateTime(ds, Tags.CreationDate, Tags.CreationTime);
    const expected = new Date(Date.UTC(1, 0, 1, 16, 2, 15, 0));
    expect(actual.getTime()).toBe(expected.getTime());
  });

  it("missing time uses specified date with min time", () => {
    const ds = new DicomDataset([new DicomDate(Tags.CreationDate, "20160525")]);
    const actual = getDateTime(ds, Tags.CreationDate, Tags.CreationTime);
    const expected = new Date(Date.UTC(2016, 4, 25, 0, 0, 0, 0));
    expect(actual.getTime()).toBe(expected.getTime());
  });

  it("invalid date throws and tryGetDateTime returns undefined", () => {
    const ds = notValidated(new DicomDataset());
    ds.addOrUpdate([
      new DicomDate(Tags.CreationDate, "20163040"),
      new DicomTime(Tags.CreationTime, "155431.750"),
    ]);
    expect(() => getDateTime(ds, Tags.CreationDate, Tags.CreationTime)).toThrow();
    expect(tryGetDateTime(ds, Tags.CreationDate, Tags.CreationTime)).toBeUndefined();
  });
});

describe("DicomDatasetExtensions - getDateTimeOffset", () => {
  it("uses explicit timezone offset", () => {
    const ds = new DicomDataset([
      new DicomDate(Tags.CreationDate, "20160525"),
      new DicomTime(Tags.CreationTime, "155431"),
      new DicomShortString(Tags.TimezoneOffsetFromUTC, "+0400"),
    ]);
    const actual = getDateTimeOffset(ds, Tags.CreationDate, Tags.CreationTime);
    expect(actual.offsetMinutes).toBe(240);
    expect(actual.date.getTime()).toBe(new Date(Date.UTC(2016, 4, 25, 15, 54, 31)).getTime());
  });

  it("uses negative timezone offset", () => {
    const ds = new DicomDataset([
      new DicomDate(Tags.CreationDate, "20160525"),
      new DicomTime(Tags.CreationTime, "155431"),
      new DicomShortString(Tags.TimezoneOffsetFromUTC, "-0100"),
    ]);
    const actual = getDateTimeOffset(ds, Tags.CreationDate, Tags.CreationTime);
    expect(actual.offsetMinutes).toBe(-60);
  });

  it("uses local offset when no timezone is specified", () => {
    const ds = new DicomDataset([
      new DicomDate(Tags.CreationDate, "20160525"),
      new DicomTime(Tags.CreationTime, "155431"),
    ]);
    const actual = getDateTimeOffset(ds, Tags.CreationDate, Tags.CreationTime);
    const expectedOffset = localOffsetMinutesFor(new Date(Date.UTC(2016, 4, 25, 15, 54, 31, 0)));
    expect(actual.offsetMinutes).toBe(expectedOffset);
  });

  it("missing date and time returns undefined in tryGet", () => {
    const ds = new DicomDataset([new DicomShortString(Tags.TimezoneOffsetFromUTC, "-0900")]);
    expect(tryGetDateTimeOffset(ds, Tags.StudyDate, Tags.StudyTime)).toBeUndefined();
  });
});

describe("DicomDatasetExtensions - enumerate helpers", () => {
  it("enumerateMasked returns matching items", () => {
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomUnsignedShort(new DicomTag(0x6000, 0x3000), 1));
    ds.addOrUpdate(new DicomUnsignedShort(new DicomTag(0x6002, 0x3000), 2));
    ds.addOrUpdate(new DicomUnsignedShort(new DicomTag(0x6020, 0x0010), 3));

    const mask = DicomMaskedTag.parse("(60xx,3000)");
    const items = [...enumerateMasked(ds, mask)];
    expect(items.length).toBe(2);
  });

  it("enumerateGroup skips group length elements", () => {
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomUnsignedLong(new DicomTag(0x0010, 0x0000), 0));
    ds.addOrUpdate(new DicomUnsignedShort(new DicomTag(0x0010, 0x0010), 1));
    ds.addOrUpdate(new DicomUnsignedShort(new DicomTag(0x0010, 0x0020), 2));

    const items = [...enumerateGroup(ds, 0x0010)];
    expect(items.length).toBe(2);
  });
});

describe("DicomDatasetExtensions - validation toggles", () => {
  it("notValidated and validated toggle validateItems", () => {
    const ds = new DicomDataset();
    expect(ds.validateItems).toBe(true);
    notValidated(ds);
    expect(ds.validateItems).toBe(false);
    validated(ds);
    expect(ds.validateItems).toBe(true);
  });
});

describe("DicomDatasetExtensions - cloneDataset", () => {
  it("clones nested sequence datasets", () => {
    const inner = new DicomDataset([new DicomUnsignedShort(Tags.Rows, 512)]);
    const outer = new DicomDataset([new DicomSequence(Tags.ReferencedSOPSequence, inner)]);
    const clone = cloneDataset(outer);

    const originalSeq = outer.getSequence(Tags.ReferencedSOPSequence);
    const clonedSeq = clone.getSequence(Tags.ReferencedSOPSequence);

    expect(clonedSeq.items.length).toBe(1);
    expect(clonedSeq.items[0]!.getValue<number>(Tags.Rows)).toBe(512);
    expect(clonedSeq.items[0]).not.toBe(originalSeq.items[0]);
  });
});
