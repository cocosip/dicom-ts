import { describe, it, expect } from "vitest";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomUID } from "../../src/core/DicomUID.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import {
  DicomApplicationEntity,
  DicomAgeString,
  DicomAttributeTag,
  DicomCodeString,
  DicomDate,
  DicomDateRange,
  DicomDecimalString,
  DicomDateTime,
  DicomFloatingPointDouble,
  DicomFloatingPointSingle,
  DicomIntegerString,
  DicomLongString,
  DicomLongText,
  DicomOtherByte,
  DicomOtherDouble,
  DicomOtherFloat,
  DicomOtherLong,
  DicomOtherVeryLong,
  DicomOtherWord,
  DicomPersonName,
  DicomShortString,
  DicomSignedLong,
  DicomSignedShort,
  DicomShortText,
  DicomSignedVeryLong,
  DicomTime,
  DicomUnlimitedCharacters,
  DicomUniqueIdentifier,
  DicomUnsignedLong,
  DicomUnknown,
  DicomUniversalResource,
  DicomUnsignedShort,
  DicomUnlimitedText,
  DicomUnsignedVeryLong,
} from "../../src/dataset/DicomElement.js";

const privateTag = new DicomTag(0x7777, 0x0010);

describe("DicomElement get/set - string multi-value", () => {
  const cases: Array<{
    label: string;
    vr: DicomVR;
    create: (...values: string[]) => { value: string; values: string[]; count: number; valueRepresentation: DicomVR };
  }> = [
    { label: "AE", vr: DicomVR.AE, create: (...v) => new DicomApplicationEntity(privateTag, ...v) },
    { label: "AS", vr: DicomVR.AS, create: (...v) => new DicomAgeString(privateTag, ...v) },
    { label: "CS", vr: DicomVR.CS, create: (...v) => new DicomCodeString(privateTag, ...v) },
    { label: "LO", vr: DicomVR.LO, create: (...v) => new DicomLongString(privateTag, ...v) },
    { label: "PN", vr: DicomVR.PN, create: (...v) => new DicomPersonName(privateTag, ...v) },
    { label: "SH", vr: DicomVR.SH, create: (...v) => new DicomShortString(privateTag, ...v) },
    { label: "UC", vr: DicomVR.UC, create: (...v) => new DicomUnlimitedCharacters(privateTag, ...v) },
    { label: "UI", vr: DicomVR.UI, create: (...v) => new DicomUniqueIdentifier(privateTag, ...v) },
  ];

  for (const c of cases) {
    it(`${c.label} returns values and joined string`, () => {
      const element = c.create("A", "B");
      expect(element.valueRepresentation).toBe(c.vr);
      expect(element.count).toBe(2);
      expect(element.values).toEqual(["A", "B"]);
      expect(element.value).toBe("A\\B");
    });
  }
});

describe("DicomElement get/set - string single-value", () => {
  it("LT/ST/UT/UR keep single value", () => {
    const lt = new DicomLongText(privateTag, "hello");
    const st = new DicomShortText(privateTag, "world");
    const ut = new DicomUnlimitedText(privateTag, "long");
    const ur = new DicomUniversalResource(privateTag, "https://example.test/x");

    expect(lt.valueRepresentation).toBe(DicomVR.LT);
    expect(st.valueRepresentation).toBe(DicomVR.ST);
    expect(ut.valueRepresentation).toBe(DicomVR.UT);
    expect(ur.valueRepresentation).toBe(DicomVR.UR);

    expect(lt.count).toBe(1);
    expect(st.count).toBe(1);
    expect(ut.count).toBe(1);
    expect(ur.count).toBe(1);

    expect(lt.value).toBe("hello");
    expect(st.value).toBe("world");
    expect(ut.value).toBe("long");
    expect(ur.value).toBe("https://example.test/x");
  });
});

describe("DicomElement get/set - numeric and binary", () => {
  it("numeric value elements expose value and values", () => {
    const ss = new DicomSignedShort(privateTag, -1, 2);
    const us = new DicomUnsignedShort(privateTag, 1, 2);
    const sl = new DicomSignedLong(privateTag, -3, 4);
    const ul = new DicomUnsignedLong(privateTag, 5, 6);
    const sv = new DicomSignedVeryLong(privateTag, -7n, 8n);
    const uv = new DicomUnsignedVeryLong(privateTag, 9n, 10n);
    const fl = new DicomFloatingPointSingle(privateTag, 1.5, 2.5);
    const fd = new DicomFloatingPointDouble(privateTag, 3.25, 4.75);

    expect(ss.valueRepresentation).toBe(DicomVR.SS);
    expect(us.valueRepresentation).toBe(DicomVR.US);
    expect(sl.valueRepresentation).toBe(DicomVR.SL);
    expect(ul.valueRepresentation).toBe(DicomVR.UL);
    expect(sv.valueRepresentation).toBe(DicomVR.SV);
    expect(uv.valueRepresentation).toBe(DicomVR.UV);
    expect(fl.valueRepresentation).toBe(DicomVR.FL);
    expect(fd.valueRepresentation).toBe(DicomVR.FD);

    expect(ss.value).toBe(-1);
    expect(us.values).toEqual([1, 2]);
    expect(sl.values).toEqual([-3, 4]);
    expect(ul.values).toEqual([5, 6]);
    expect(sv.values).toEqual([-7n, 8n]);
    expect(uv.values).toEqual([9n, 10n]);
    expect(fl.values[0]).toBeCloseTo(1.5);
    expect(fd.values[1]).toBeCloseTo(4.75);
  });

  it("other binary elements expose raw values", () => {
    const ob = new DicomOtherByte(privateTag, new Uint8Array([1, 2, 3]));
    const ow = new DicomOtherWord(privateTag, new Uint16Array([258, 259]));
    const ol = new DicomOtherLong(privateTag, new Uint32Array([1, 2]));
    const of = new DicomOtherFloat(privateTag, new Float32Array([1.25, 2.5]));
    const od = new DicomOtherDouble(privateTag, new Float64Array([1.125, 2.25]));
    const ov = new DicomOtherVeryLong(privateTag, new BigUint64Array([1n, 2n]));
    const un = new DicomUnknown(privateTag, new Uint8Array([9, 8]));

    expect(ob.valueRepresentation).toBe(DicomVR.OB);
    expect(ow.valueRepresentation).toBe(DicomVR.OW);
    expect(ol.valueRepresentation).toBe(DicomVR.OL);
    expect(of.valueRepresentation).toBe(DicomVR.OF);
    expect(od.valueRepresentation).toBe(DicomVR.OD);
    expect(ov.valueRepresentation).toBe(DicomVR.OV);
    expect(un.valueRepresentation).toBe(DicomVR.UN);

    expect(ob.values).toEqual([1, 2, 3]);
    expect(ow.values).toEqual([258, 259]);
    expect(ol.values).toEqual([1, 2]);
    expect(of.values[0]).toBeCloseTo(1.25);
    expect(od.values[1]).toBeCloseTo(2.25);
    expect(ov.values).toEqual([1n, 2n]);
    expect(un.values).toEqual([9, 8]);
  });

  it("attribute tag elements expose tag values", () => {
    const tag1 = new DicomTag(0x0010, 0x0010);
    const tag2 = new DicomTag(0x0010, 0x0020);
    const at = new DicomAttributeTag(privateTag, tag1, tag2);
    expect(at.valueRepresentation).toBe(DicomVR.AT);
    expect(at.tagValues.length).toBe(2);
    expect(at.tagValues[0]?.toString()).toBe(tag1.toString());
    expect(at.tagValues[1]?.toString()).toBe(tag2.toString());
  });
});

describe("DicomElement get/set - string conversions", () => {
  it("decimal and integer strings expose numeric values", () => {
    const ds = new DicomDecimalString(privateTag, 1.5, "2.25");
    expect(ds.values).toEqual(["1.5", "2.25"]);
    expect(ds.numericValues).toEqual([1.5, 2.25]);
    expect(ds.numericValue).toBe(1.5);

    const is = new DicomIntegerString(privateTag, 5, -2);
    expect(is.values).toEqual(["5", "-2"]);
    expect(is.intValues).toEqual([5, -2]);
    expect(is.intValue).toBe(5);
  });

  it("date and time values format to DICOM strings", () => {
    const date = new Date(Date.UTC(2020, 0, 2));
    const time = new Date(Date.UTC(1970, 0, 1, 15, 19, 45, 406));
    const dt = new Date(Date.UTC(2007, 5, 28, 15, 19, 45, 406));
    const range = new DicomDateRange(new Date(Date.UTC(2020, 0, 2)), new Date(Date.UTC(2020, 0, 5)));

    const da = new DicomDate(privateTag, date);
    const tm = new DicomTime(privateTag, time);
    const dtt = new DicomDateTime(privateTag, dt);
    const daRange = new DicomDate(privateTag, range);

    expect(da.value).toBe("20200102");
    expect(tm.value).toBe("151945.406");
    expect(dtt.value).toBe("20070628151945.406");
    expect(daRange.value).toBe("20200102-20200105");
  });
});

describe("DicomUniqueIdentifier", () => {
  it("accepts DicomUID and transfer syntax values", () => {
    const ui1 = new DicomUniqueIdentifier(privateTag, DicomUID.parse("1.2.3"));
    expect(ui1.values).toEqual(["1.2.3"]);
    expect(ui1.uidValues[0]?.uid).toBe("1.2.3");

    const ui2 = new DicomUniqueIdentifier(privateTag, DicomTransferSyntax.ExplicitVRLittleEndian);
    expect(ui2.values).toEqual([DicomTransferSyntax.ExplicitVRLittleEndian.uid.uid]);
    expect(ui2.transferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
  });
});

describe("DicomElement validate (string VRs)", () => {
  const invalidCases: Array<{ label: string; element: { validate: () => void } }> = [
    { label: "AE", element: new DicomApplicationEntity(privateTag, "A".repeat(17)) },
    { label: "AS", element: new DicomAgeString(privateTag, "010X") },
    { label: "CS", element: new DicomCodeString(privateTag, "lower") },
    { label: "DA", element: new DicomDate(privateTag, "20231301") },
    { label: "DS", element: new DicomDecimalString(privateTag, "1".repeat(17)) },
    { label: "DT", element: new DicomDateTime(privateTag, "2016-04-20") },
    { label: "IS", element: new DicomIntegerString(privateTag, "2147483648") },
    { label: "LO", element: new DicomLongString(privateTag, "A".repeat(65)) },
    { label: "LT", element: new DicomLongText(privateTag, "A".repeat(10241)) },
    { label: "PN", element: new DicomPersonName(privateTag, "A^B^C^D^E^F") },
    { label: "SH", element: new DicomShortString(privateTag, "A".repeat(17)) },
    { label: "ST", element: new DicomShortText(privateTag, "A".repeat(1025)) },
    { label: "TM", element: new DicomTime(privateTag, "2500") },
    { label: "UI", element: new DicomUniqueIdentifier(privateTag, "1.02.3") },
  ];

  for (const c of invalidCases) {
    it(`${c.label} throws on invalid value`, () => {
      expect(() => c.element.validate()).toThrow();
    });
  }

  it("UC/UT/UR have no string validation", () => {
    const uc = new DicomUnlimitedCharacters(privateTag, "A".repeat(1000));
    const ut = new DicomUnlimitedText(privateTag, "A".repeat(2000));
    const ur = new DicomUniversalResource(privateTag, "not-a-valid-uri");
    expect(() => uc.validate()).not.toThrow();
    expect(() => ut.validate()).not.toThrow();
    expect(() => ur.validate()).not.toThrow();
  });
});
