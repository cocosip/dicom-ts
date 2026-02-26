import { describe, it, expect } from "vitest";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomDateTime, DicomTime } from "../../src/dataset/DicomElement.js";

const privateTag = new DicomTag(0x7777, 0x0010);

describe("DicomDateTime and DicomTime", () => {
  it("formats DateTime without fraction", () => {
    const dt = new Date(Date.UTC(2016, 3, 20, 10, 20, 30));
    const element = new DicomDateTime(privateTag, dt);
    expect(element.value).toBe("20160420102030");
  });

  it("formats DateTime and Time with fraction", () => {
    const dt = new Date(Date.UTC(2007, 5, 28, 15, 19, 45, 406));
    const tt = new Date(Date.UTC(1970, 0, 1, 15, 19, 45, 400));
    const dateTime = new DicomDateTime(privateTag, dt);
    const time = new DicomTime(privateTag, tt);
    expect(dateTime.value).toBe("20070628151945.406");
    expect(time.value).toBe("151945.4");
  });

  it("parses date/time strings with timezone suffix", () => {
    const element = new DicomDateTime(privateTag, "20160420102030+0200");
    const parsed = element.dateValue;
    expect(parsed).not.toBeNull();
    expect(parsed?.toISOString()).toBe("2016-04-20T10:20:30.000Z");
  });

  it("parses time fractions into milliseconds", () => {
    const element = new DicomTime(privateTag, "151945.4");
    const parsed = element.dateValue;
    expect(parsed).not.toBeNull();
    expect(parsed?.getUTCHours()).toBe(15);
    expect(parsed?.getUTCMinutes()).toBe(19);
    expect(parsed?.getUTCSeconds()).toBe(45);
    expect(parsed?.getUTCMilliseconds()).toBe(400);
  });
});
