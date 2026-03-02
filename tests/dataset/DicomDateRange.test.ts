import { describe, expect, it } from "vitest";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomDate, DicomDateTime, DicomTime } from "../../src/dataset/DicomElement.js";
import { DicomDateRange } from "../../src/dataset/DicomDateRange.js";

describe("DicomDateRange", () => {
  it("formats DA range as DICOM date query string", () => {
    const dataset = new DicomDataset();
    dataset.addOrUpdateValue(
      DicomTags.AcquisitionDate,
      new DicomDateRange(utc(2016, 4, 20), utc(2016, 4, 21)),
    );

    expect(dataset.getSingleValue<string>(DicomTags.AcquisitionDate)).toBe("20160420-20160421");

    const range = dataset.getDicomItem<DicomDate>(DicomTags.AcquisitionDate)?.getDateRange();
    expect(range?.minimum?.toISOString()).toBe(utc(2016, 4, 20).toISOString());
    expect(range?.maximum?.toISOString()).toBe(utc(2016, 4, 21).toISOString());
  });

  it("formats TM range as DICOM time query string", () => {
    const dataset = new DicomDataset();
    dataset.addOrUpdateValue(
      DicomTags.AcquisitionTime,
      new DicomDateRange(utc(1, 1, 1, 5, 10, 5), utc(1, 1, 1, 19, 0, 20)),
    );

    expect(dataset.getSingleValue<string>(DicomTags.AcquisitionTime)).toBe("051005-190020");

    const range = dataset.getDicomItem<DicomTime>(DicomTags.AcquisitionTime)?.getDateRange();
    expect(range?.minimum?.getUTCHours()).toBe(5);
    expect(range?.maximum?.getUTCHours()).toBe(19);
  });

  it("formats DT range as DICOM datetime query string", () => {
    const dataset = new DicomDataset();
    dataset.addOrUpdateValue(
      DicomTags.AcquisitionDateTime,
      new DicomDateRange(utc(2016, 4, 20, 10, 20, 30), utc(2016, 4, 21, 8, 50, 5)),
    );

    expect(dataset.getSingleValue<string>(DicomTags.AcquisitionDateTime)).toBe("20160420102030-20160421085005");

    const range = dataset.getDicomItem<DicomDateTime>(DicomTags.AcquisitionDateTime)?.getDateRange();
    expect(range?.minimum?.toISOString()).toBe(utc(2016, 4, 20, 10, 20, 30).toISOString());
    expect(range?.maximum?.toISOString()).toBe(utc(2016, 4, 21, 8, 50, 5).toISOString());
  });

  it("supports contains/join and open-ended range formatting", () => {
    const range = new DicomDateRange();
    expect(range.toDicomDateString()).toBe("");

    range.join(utc(2024, 1, 3));
    range.join(utc(2024, 1, 1));
    range.join(utc(2024, 1, 5));

    expect(range.toDicomDateString()).toBe("20240101-20240105");
    expect(range.contains(utc(2024, 1, 3))).toBe(true);
    expect(range.contains(utc(2024, 1, 6))).toBe(false);

    const openStart = new DicomDateRange(null, utc(2024, 1, 5));
    const openEnd = new DicomDateRange(utc(2024, 1, 5), null);
    expect(openStart.toDicomDateString()).toBe("-20240105");
    expect(openEnd.toDicomDateString()).toBe("20240105-");
  });
});

function utc(year: number, month: number, day: number, hour = 0, minute = 0, second = 0): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}
