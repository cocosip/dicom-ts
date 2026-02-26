import { describe, it, expect } from "vitest";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomPersonName } from "../../src/dataset/DicomElement.js";

const privateTag = new DicomTag(0x7777, 0x0010);

describe("DicomPersonName", () => {
  it("buildName assembles components", () => {
    expect(DicomPersonName.buildName("Last", "First", "Middle", "Prefix", "Suffix"))
      .toBe("Last^First^Middle^Prefix^Suffix");
    expect(DicomPersonName.buildName("Last", "First", "Middle", "", ""))
      .toBe("Last^First^Middle");
    expect(DicomPersonName.buildName("Last", "First"))
      .toBe("Last^First");
    expect(DicomPersonName.buildName("Last", "First", "", "", "Suffix"))
      .toBe("Last^First^^^Suffix");
    expect(DicomPersonName.buildName("", "", "", "", ""))
      .toBe("");
  });

  it("parses component accessors from first value", () => {
    const element = new DicomPersonName(privateTag, "Last^First^Middle^Prefix^Suffix");
    expect(element.last).toBe("Last");
    expect(element.first).toBe("First");
    expect(element.middle).toBe("Middle");
    expect(element.prefix).toBe("Prefix");
    expect(element.suffix).toBe("Suffix");
  });

  it("handles empty primary component group", () => {
    const element = new DicomPersonName(privateTag, "=Doe^John");
    expect(element.last).toBe("");
    expect(element.first).toBe("");
  });

  it("supports multiple person name values", () => {
    const element = new DicomPersonName(privateTag, "Doe^John", "Bar^Foo");
    expect(element.values).toEqual(["Doe^John", "Bar^Foo"]);
    expect(element.getAt(1)).toBe("Bar^Foo");
    expect(element.value).toBe("Doe^John\\Bar^Foo");
  });
});
