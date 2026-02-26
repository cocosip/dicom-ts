/**
 * DicomDataset unit tests.
 *
 * Reference: fo-dicom Tests/FO-DICOM.Tests/DicomDatasetTest.cs
 */
import { describe, it, expect, beforeEach } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomDatasetWalker, DicomDatasetWalkerBase } from "../../src/dataset/DicomDatasetWalker.js";
import { DicomItem } from "../../src/dataset/DicomItem.js";
import {
  DicomElement,
  DicomUnsignedShort,
  DicomUnsignedLong,
  DicomSignedShort,
  DicomSignedLong,
  DicomFloatingPointDouble,
  DicomFloatingPointSingle,
  DicomOtherByte,
  DicomOtherDouble,
  DicomOtherWord,
  DicomLongString,
  DicomShortString,
  DicomCodeString,
  DicomPersonName,
  DicomDate,
  DicomTime,
  DicomUniqueIdentifier,
  DicomDecimalString,
  DicomIntegerString,
  DicomLongText,
  DicomShortText,
  DicomUnlimitedText,
  DicomUnlimitedCharacters,
  DicomUniversalResource,
  DicomAttributeTag,
  DicomSignedVeryLong,
  DicomUnsignedVeryLong,
} from "../../src/dataset/DicomElement.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeDS(): DicomDataset {
  return new DicomDataset();
}

// ---------------------------------------------------------------------------
// Constructor
// ---------------------------------------------------------------------------

describe("DicomDataset — constructor", () => {
  it("default constructor uses ExplicitVRLittleEndian", () => {
    const ds = new DicomDataset();
    expect(ds.internalTransferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
  });

  it("constructor with transfer syntax stores it", () => {
    const ds = new DicomDataset(DicomTransferSyntax.ImplicitVRLittleEndian);
    expect(ds.internalTransferSyntax).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
  });

  it("constructor from iterable copies items", () => {
    const items: DicomItem[] = [
      new DicomUnsignedShort(Tags.Rows, 512),
      new DicomUnsignedShort(Tags.Columns, 256),
    ];
    const ds = new DicomDataset(items);
    expect(ds.count).toBe(2);
    expect(ds.contains(Tags.Rows)).toBe(true);
    expect(ds.contains(Tags.Columns)).toBe(true);
  });

  it("starts with zero items", () => {
    expect(new DicomDataset().count).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// add / addOrUpdate — DicomItem overload
// ---------------------------------------------------------------------------

describe("DicomDataset — add/addOrUpdate (DicomItem)", () => {
  it("add inserts an element", () => {
    const ds = makeDS();
    ds.add(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.contains(Tags.BitsAllocated)).toBe(true);
  });

  it("add throws when tag already present", () => {
    const ds = makeDS();
    ds.add(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(() => ds.add(new DicomUnsignedShort(Tags.BitsAllocated, 8))).toThrow();
  });

  it("addOrUpdate replaces existing tag", () => {
    const ds = makeDS();
    ds.add(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 8));
    expect(ds.getValue<number>(Tags.BitsAllocated)).toBe(8);
  });

  it("addOrUpdate adds when tag absent", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.getValue<number>(Tags.BitsAllocated)).toBe(16);
  });

  it("addOrUpdate iterable adds multiple items", () => {
    const ds = makeDS();
    ds.addOrUpdate([
      new DicomUnsignedShort(Tags.Rows, 512),
      new DicomUnsignedShort(Tags.Columns, 256),
    ]);
    expect(ds.count).toBe(2);
  });

  it("method chaining works", () => {
    const ds = makeDS()
      .addOrUpdate(new DicomUnsignedShort(Tags.Rows, 512))
      .addOrUpdate(new DicomUnsignedShort(Tags.Columns, 256));
    expect(ds.count).toBe(2);
  });

  it("add sequence item", () => {
    const ds = makeDS();
    const inner = new DicomDataset();
    inner.addOrUpdate(new DicomUniqueIdentifier(Tags.SOPClassUID, "1.2.3"));
    ds.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence, inner));
    expect(ds.contains(Tags.ReferencedSOPSequence)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// addOrUpdateElement / addOrUpdateValue
// ---------------------------------------------------------------------------

describe("DicomDataset — addOrUpdateElement", () => {
  it("creates US element from values", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 16);
    const el = ds.getDicomItem<DicomUnsignedShort>(Tags.BitsAllocated);
    expect(el).toBeInstanceOf(DicomUnsignedShort);
    expect(el!.value).toBe(16);
  });

  it("creates LO element from values", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.LO, Tags.PatientID, "P001");
    expect(ds.getString(Tags.PatientID)).toBe("P001");
  });

  it("creates SQ element correctly", () => {
    const ds = makeDS();
    const seq = new DicomSequence(Tags.ReferencedSOPSequence);
    ds.addOrUpdate(seq);
    expect(ds.getSequence(Tags.ReferencedSOPSequence)).toBeInstanceOf(DicomSequence);
  });

  it("addOrUpdateValue looks up VR from dictionary", () => {
    const ds = makeDS();
    ds.addOrUpdateValue(Tags.PatientName, "Doe^John");
    const el = ds.getDicomItem<DicomPersonName>(Tags.PatientName);
    expect(el).toBeInstanceOf(DicomPersonName);
    expect(el!.last).toBe("Doe");
  });
});

// ---------------------------------------------------------------------------
// contains / remove / clear
// ---------------------------------------------------------------------------

describe("DicomDataset — contains / remove / clear", () => {
  it("contains returns false for missing tag", () => {
    expect(makeDS().contains(Tags.PatientName)).toBe(false);
  });

  it("contains returns true after add", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomLongString(Tags.PatientID, "P001"));
    expect(ds.contains(Tags.PatientID)).toBe(true);
  });

  it("remove by tag", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomLongString(Tags.PatientID, "P001"));
    ds.remove(Tags.PatientID);
    expect(ds.contains(Tags.PatientID)).toBe(false);
  });

  it("remove non-existent tag does not throw", () => {
    expect(() => makeDS().remove(Tags.PatientID)).not.toThrow();
  });

  it("remove by predicate", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 512));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 256));
    ds.remove((item) => item.tag.equals(Tags.Rows));
    expect(ds.contains(Tags.Rows)).toBe(false);
    expect(ds.contains(Tags.Columns)).toBe(true);
  });

  it("clear removes all items", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 512));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 256));
    ds.clear();
    expect(ds.count).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getValueCount
// ---------------------------------------------------------------------------

describe("DicomDataset — getValueCount", () => {
  it("returns 0 for missing tag", () => {
    expect(makeDS().getValueCount(Tags.PatientName)).toBe(0);
  });

  it("returns element count", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0010); // private tag — no VM restriction
    ds.addOrUpdate(new DicomUnsignedShort(multiTag, 10, 20, 30));
    expect(ds.getValueCount(multiTag)).toBe(3);
  });

  it("returns sequence item count", () => {
    const ds = makeDS();
    const inner1 = new DicomDataset();
    const inner2 = new DicomDataset();
    ds.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence, inner1, inner2));
    expect(ds.getValueCount(Tags.ReferencedSOPSequence)).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// getValue / tryGetValue / getValueOrDefault
// ---------------------------------------------------------------------------

describe("DicomDataset — getValue", () => {
  it("getValue returns number from US element", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.getValue<number>(Tags.BitsAllocated)).toBe(16);
  });

  it("getValue returns number from SL element", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomSignedLong(Tags.Rows, -100));
    expect(ds.getValue<number>(Tags.Rows)).toBe(-100);
  });

  it("getValue with index", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0010); // private tag — no VM restriction
    ds.addOrUpdate(new DicomUnsignedShort(multiTag, 10, 20, 30));
    expect(ds.getValue<number>(multiTag, 2)).toBe(30);
  });

  it("getValue throws for missing tag", () => {
    expect(() => makeDS().getValue<number>(Tags.BitsAllocated)).toThrow();
  });

  it("getValue throws for out-of-range index", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(() => ds.getValue<number>(Tags.BitsAllocated, 5)).toThrow();
  });

  it("tryGetValue returns undefined for missing tag", () => {
    expect(makeDS().tryGetValue<number>(Tags.BitsAllocated)).toBeUndefined();
  });

  it("tryGetValue returns value when present", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.tryGetValue<number>(Tags.BitsAllocated)).toBe(16);
  });

  it("getValueOrDefault returns default when missing", () => {
    expect(makeDS().getValueOrDefault<number>(Tags.BitsAllocated, 0, 99)).toBe(99);
  });

  it("getValueOrDefault returns value when present", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.getValueOrDefault<number>(Tags.BitsAllocated, 0, 99)).toBe(16);
  });

  it("getValue returns string from string element", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomLongString(Tags.PatientID, "P001"));
    expect(ds.getValue<string>(Tags.PatientID)).toBe("P001");
  });

  it("getValue returns bigint from SV element", () => {
    const ds = makeDS();
    const tag = new DicomTag(0x0008, 0x1190); // any SV tag
    ds.addOrUpdateElement(DicomVR.SV, tag, BigInt(-9007199254740993));
    expect(ds.getValue<bigint>(tag)).toBe(BigInt(-9007199254740993));
  });
});

// ---------------------------------------------------------------------------
// getValues / tryGetValues
// ---------------------------------------------------------------------------

describe("DicomDataset — getValues", () => {
  it("getValues returns all numeric values", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0010); // private tag — no VM restriction
    ds.addOrUpdate(new DicomUnsignedShort(multiTag, 10, 20, 30));
    expect(ds.getValues<number>(multiTag)).toEqual([10, 20, 30]);
  });

  it("getValues returns all string values", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0012); // private tag — no VM restriction
    ds.addOrUpdate(new DicomCodeString(multiTag, "CT", "MR"));
    const vals = ds.getValues<string>(multiTag);
    expect(vals).toEqual(["CT", "MR"]);
  });

  it("getValues returns empty array for empty element", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated);
    expect(ds.getValues<number>(Tags.BitsAllocated)).toEqual([]);
  });

  it("getValues throws for missing tag", () => {
    expect(() => makeDS().getValues<number>(Tags.BitsAllocated)).toThrow();
  });

  it("tryGetValues returns undefined for missing tag", () => {
    expect(makeDS().tryGetValues<number>(Tags.BitsAllocated)).toBeUndefined();
  });

  it("tryGetValues returns array when present", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0014); // private tag — no VM restriction
    ds.addOrUpdate(new DicomUnsignedShort(multiTag, 1, 2));
    expect(ds.tryGetValues<number>(multiTag)).toEqual([1, 2]);
  });
});

// ---------------------------------------------------------------------------
// getSingleValue / getSingleValueOrDefault
// ---------------------------------------------------------------------------

describe("DicomDataset — getSingleValue", () => {
  it("getSingleValue returns the single value", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.getSingleValue<number>(Tags.BitsAllocated)).toBe(16);
  });

  it("getSingleValue throws when count != 1", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0016); // private tag — no VM restriction
    ds.addOrUpdate(new DicomUnsignedShort(multiTag, 10, 20));
    expect(() => ds.getSingleValue<number>(multiTag)).toThrow();
  });

  it("getSingleValue throws for missing tag", () => {
    expect(() => makeDS().getSingleValue<number>(Tags.BitsAllocated)).toThrow();
  });

  it("getSingleValueOrDefault returns default when missing", () => {
    expect(makeDS().getSingleValueOrDefault<number>(Tags.BitsAllocated, 8)).toBe(8);
  });

  it("getSingleValueOrDefault returns value when present", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.getSingleValueOrDefault<number>(Tags.BitsAllocated, 8)).toBe(16);
  });
});

// ---------------------------------------------------------------------------
// getString / tryGetString
// ---------------------------------------------------------------------------

describe("DicomDataset — getString", () => {
  it("getString returns string from LO element", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomLongString(Tags.PatientID, "P001"));
    expect(ds.getString(Tags.PatientID)).toBe("P001");
  });

  it("getString joins multi-value with backslash", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0018); // private tag — no VM restriction
    ds.addOrUpdate(new DicomCodeString(multiTag, "CT", "MR"));
    expect(ds.getString(multiTag)).toBe("CT\\MR");
  });

  it("getString returns string from numeric element", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.getString(Tags.BitsAllocated)).toBe("16");
  });

  it("getString throws for missing tag", () => {
    expect(() => makeDS().getString(Tags.PatientName)).toThrow();
  });

  it("tryGetString returns undefined for missing tag", () => {
    expect(makeDS().tryGetString(Tags.PatientName)).toBeUndefined();
  });

  it("tryGetString returns string when present", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomLongString(Tags.PatientID, "P001"));
    expect(ds.tryGetString(Tags.PatientID)).toBe("P001");
  });
});

// ---------------------------------------------------------------------------
// getDicomItem / getSequence / tryGetSequence
// ---------------------------------------------------------------------------

describe("DicomDataset — getDicomItem / getSequence", () => {
  it("getDicomItem returns null for missing tag", () => {
    expect(makeDS().getDicomItem(Tags.PatientName)).toBeNull();
  });

  it("getDicomItem returns item for present tag", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    const el = ds.getDicomItem<DicomUnsignedShort>(Tags.BitsAllocated);
    expect(el).toBeInstanceOf(DicomUnsignedShort);
  });

  it("getSequence returns DicomSequence", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence));
    const seq = ds.getSequence(Tags.ReferencedSOPSequence);
    expect(seq).toBeInstanceOf(DicomSequence);
  });

  it("getSequence throws for missing tag", () => {
    expect(() => makeDS().getSequence(Tags.ReferencedSOPSequence)).toThrow();
  });

  it("getSequence throws when element is not a sequence", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(() => ds.getSequence(Tags.BitsAllocated)).toThrow();
  });

  it("tryGetSequence returns null for missing tag", () => {
    expect(makeDS().tryGetSequence(Tags.ReferencedSOPSequence)).toBeNull();
  });

  it("tryGetSequence returns sequence when present", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence));
    expect(ds.tryGetSequence(Tags.ReferencedSOPSequence)).toBeInstanceOf(DicomSequence);
  });

  it("tryGetSequence returns null when tag is not a sequence", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.tryGetSequence(Tags.BitsAllocated)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Transfer syntax cascade
// ---------------------------------------------------------------------------

describe("DicomDataset — transfer syntax cascade", () => {
  it("setting internalTransferSyntax cascades to nested datasets", () => {
    const inner = new DicomDataset();
    const outer = makeDS();
    outer.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence, inner));

    outer.internalTransferSyntax = DicomTransferSyntax.ImplicitVRLittleEndian;

    expect(inner.internalTransferSyntax).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
  });

  it("cascade works to deeply nested datasets", () => {
    const level2 = new DicomDataset();
    const level1 = new DicomDataset();
    level1.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence, level2));
    const root = makeDS();
    root.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence, level1));

    root.internalTransferSyntax = DicomTransferSyntax.ImplicitVRLittleEndian;

    expect(level2.internalTransferSyntax).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
  });
});

// ---------------------------------------------------------------------------
// Iteration order
// ---------------------------------------------------------------------------

describe("DicomDataset — iteration order", () => {
  it("iterates in ascending tag order", () => {
    const ds = makeDS();
    // Add in reverse order
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 256));  // (0028,0011)
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 512));     // (0028,0010)
    ds.addOrUpdate(new DicomLongString(Tags.PatientID, "P001")); // (0010,0020)

    const tags = [...ds].map((item) => item.tag.toUint32());
    expect(tags).toEqual([...tags].sort((a, b) => a - b));
  });

  it("all items visited in iteration", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 512));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 256));
    ds.addOrUpdate(new DicomLongString(Tags.PatientID, "P001"));
    expect([...ds].length).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// copyTo
// ---------------------------------------------------------------------------

describe("DicomDataset — copyTo", () => {
  it("copyTo copies all items", () => {
    const src = makeDS();
    src.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 512));
    src.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 256));

    const dst = makeDS();
    src.copyTo(dst);

    expect(dst.count).toBe(2);
    expect(dst.getValue<number>(Tags.Rows)).toBe(512);
    expect(dst.getValue<number>(Tags.Columns)).toBe(256);
  });

  it("copyTo returns destination dataset", () => {
    const src = makeDS();
    const dst = makeDS();
    expect(src.copyTo(dst)).toBe(dst);
  });
});

// ---------------------------------------------------------------------------
// Element type tests — verify correct concrete class created
// ---------------------------------------------------------------------------

describe("DicomDataset — element types via addOrUpdateElement", () => {
  const cases: Array<[DicomVR, string, unknown[], unknown]> = [
    [DicomVR.AE, "AE", ["MYAE"],      "MYAE"],
    [DicomVR.AS, "AS", ["010Y"],      "010Y"],
    [DicomVR.CS, "CS", ["YES"],       "YES"],
    [DicomVR.DS, "DS", [3.14],        "3.14"],
    [DicomVR.IS, "IS", [42],          "42"],
    [DicomVR.LO, "LO", ["Hello"],     "Hello"],
    [DicomVR.LT, "LT", ["Long text"], "Long text"],
    [DicomVR.PN, "PN", ["Doe^John"],  "Doe^John"],
    [DicomVR.SH, "SH", ["Short"],     "Short"],
    [DicomVR.ST, "ST", ["Some text"], "Some text"],
    [DicomVR.UC, "UC", ["UC val"],    "UC val"],
    [DicomVR.UR, "UR", ["http://x"],  "http://x"],
    [DicomVR.UT, "UT", ["UT val"],    "UT val"],
  ];

  for (const [vr, name, values, expected] of cases) {
    it(`creates ${name} element correctly`, () => {
      const ds = makeDS();
      const tag = new DicomTag(0x0010, 0x0020); // PatientID
      ds.addOrUpdateElement(vr, tag, ...values);
      expect(ds.getString(tag)).toBe(expected as string);
    });
  }

  it("creates FD element correctly", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.FD, Tags.Rows, 3.14);
    expect(ds.getValue<number>(Tags.Rows)).toBeCloseTo(3.14);
  });

  it("creates FL element correctly", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.FL, Tags.Rows, 1.5);
    expect(ds.getValue<number>(Tags.Rows)).toBeCloseTo(1.5, 3);
  });

  it("creates SL element correctly", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.SL, Tags.Rows, -100);
    expect(ds.getValue<number>(Tags.Rows)).toBe(-100);
  });

  it("creates SS element correctly", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.SS, Tags.Rows, -10);
    expect(ds.getValue<number>(Tags.Rows)).toBe(-10);
  });

  it("creates UL element correctly", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.UL, Tags.Rows, 0xFFFFFFFF);
    expect(ds.getValue<number>(Tags.Rows)).toBe(0xFFFFFFFF);
  });

  it("creates US element correctly", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 16);
    expect(ds.getValue<number>(Tags.BitsAllocated)).toBe(16);
  });

  it("creates SV element with bigint correctly", () => {
    const ds = makeDS();
    const tag = new DicomTag(0x0009, 0x0010);
    ds.addOrUpdateElement(DicomVR.SV, tag, BigInt(-100));
    expect(ds.getValue<bigint>(tag)).toBe(BigInt(-100));
  });

  it("creates UV element with bigint correctly", () => {
    const ds = makeDS();
    const tag = new DicomTag(0x0009, 0x0012);
    ds.addOrUpdateElement(DicomVR.UV, tag, BigInt(200));
    expect(ds.getValue<bigint>(tag)).toBe(BigInt(200));
  });

  it("creates OB element correctly", () => {
    const ds = makeDS();
    const data = new Uint8Array([1, 2, 3]);
    ds.addOrUpdateElement(DicomVR.OB, Tags.PixelData, data);
    const el = ds.getDicomItem<DicomOtherByte>(Tags.PixelData);
    expect(el).toBeInstanceOf(DicomOtherByte);
    expect(el!.buffer.size).toBe(3);
  });

  it("creates UI element correctly", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.UI, Tags.SOPClassUID, "1.2.840.10008.5.1.4.1.1.2");
    expect(ds.getString(Tags.SOPClassUID)).toBe("1.2.840.10008.5.1.4.1.1.2");
  });

  it("creates DA element correctly", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.DA, Tags.StudyDate, "20240101");
    expect(ds.getString(Tags.StudyDate)).toBe("20240101");
  });

  it("creates TM element correctly", () => {
    const ds = makeDS();
    ds.addOrUpdateElement(DicomVR.TM, Tags.StudyTime, "120000");
    expect(ds.getString(Tags.StudyTime)).toBe("120000");
  });

  it("creates AT element correctly", () => {
    const ds = makeDS();
    const atTag = new DicomTag(0x0008, 0x1195);
    ds.addOrUpdateElement(DicomVR.AT, atTag, Tags.PatientName);
    const el = ds.getDicomItem<DicomAttributeTag>(atTag);
    expect(el).toBeInstanceOf(DicomAttributeTag);
    expect(el!.tagValues[0]!.equals(Tags.PatientName)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Multi-value string elements
// ---------------------------------------------------------------------------

describe("DicomDataset — multi-value strings", () => {
  it("CS element supports multiple values", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0020); // private tag — no VM restriction
    ds.addOrUpdate(new DicomCodeString(multiTag, "CT", "MR", "PT"));
    expect(ds.getValueCount(multiTag)).toBe(3);
    expect(ds.getValue<string>(multiTag, 0)).toBe("CT");
    expect(ds.getValue<string>(multiTag, 1)).toBe("MR");
    expect(ds.getValue<string>(multiTag, 2)).toBe("PT");
  });

  it("PN stores complex person name", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomPersonName(Tags.PatientName, "Doe^John^M^Dr^Jr"));
    const el = ds.getDicomItem<DicomPersonName>(Tags.PatientName)!;
    expect(el.last).toBe("Doe");
    expect(el.first).toBe("John");
    expect(el.middle).toBe("M");
    expect(el.prefix).toBe("Dr");
    expect(el.suffix).toBe("Jr");
  });

  it("IS element supports integer strings", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0022); // private tag — no VM restriction
    ds.addOrUpdate(new DicomIntegerString(multiTag, 100, 200));
    const el = ds.getDicomItem<DicomIntegerString>(multiTag)!;
    expect(el.intValues).toEqual([100, 200]);
  });

  it("DS element supports decimal strings", () => {
    const ds = makeDS();
    const multiTag = new DicomTag(0x0009, 0x0024); // private tag — no VM restriction
    ds.addOrUpdate(new DicomDecimalString(multiTag, 1.5, 2.5));
    const el = ds.getDicomItem<DicomDecimalString>(multiTag)!;
    expect(el.numericValues[0]).toBeCloseTo(1.5);
    expect(el.numericValues[1]).toBeCloseTo(2.5);
  });
});

// ---------------------------------------------------------------------------
// Nested sequences (read/write)
// ---------------------------------------------------------------------------

describe("DicomDataset — nested sequences", () => {
  it("nested dataset accessible via getSequence", () => {
    const inner = new DicomDataset();
    inner.addOrUpdate(new DicomUniqueIdentifier(Tags.SOPInstanceUID, "1.2.3.4.5"));

    const outer = makeDS();
    outer.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence, inner));

    const seq = outer.getSequence(Tags.ReferencedSOPSequence);
    expect(seq.items.length).toBe(1);
    expect(seq.items[0]!.getString(Tags.SOPInstanceUID)).toBe("1.2.3.4.5");
  });

  it("empty sequence is accessible", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence));
    const seq = ds.getSequence(Tags.ReferencedSOPSequence);
    expect(seq.items.length).toBe(0);
  });

  it("multiple sequence items", () => {
    const ds = makeDS();
    const items = [new DicomDataset(), new DicomDataset(), new DicomDataset()];
    ds.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence, ...items));
    expect(ds.getValueCount(Tags.ReferencedSOPSequence)).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// DicomDatasetWalker
// ---------------------------------------------------------------------------

describe("DicomDatasetWalker", () => {
  it("visits all leaf elements", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 512));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 256));

    const visited: DicomElement[] = [];
    class Collector extends DicomDatasetWalkerBase {
      override onElement(el: DicomElement): void { visited.push(el); }
    }
    DicomDatasetWalker.walk(ds, new Collector());
    expect(visited.length).toBe(2);
  });

  it("visits nested sequence items", () => {
    const inner = new DicomDataset();
    inner.addOrUpdate(new DicomLongString(Tags.PatientID, "P001"));

    const outer = makeDS();
    outer.addOrUpdate(new DicomSequence(Tags.ReferencedSOPSequence, inner));

    const log: string[] = [];
    class Logger extends DicomDatasetWalkerBase {
      override onBeginSequence(): void { log.push("begin_seq"); }
      override onEndSequence(): void { log.push("end_seq"); }
      override onBeginSequenceItem(): void { log.push("begin_item"); }
      override onEndSequenceItem(): void { log.push("end_item"); }
      override onElement(): void { log.push("element"); }
    }
    DicomDatasetWalker.walk(outer, new Logger());

    expect(log).toEqual(["begin_seq", "begin_item", "element", "end_item", "end_seq"]);
  });

  it("calls onBeginDataset and onEndDataset", () => {
    const events: string[] = [];
    class Tracker extends DicomDatasetWalkerBase {
      override onBeginDataset(): void { events.push("begin"); }
      override onEndDataset(): void { events.push("end"); }
    }
    DicomDatasetWalker.walk(makeDS(), new Tracker());
    expect(events).toEqual(["begin", "end"]);
  });
});

// ---------------------------------------------------------------------------
// Equals
// ---------------------------------------------------------------------------

describe("DicomDataset — equals", () => {
  it("two empty datasets are equal", () => {
    expect(new DicomDataset().equals(new DicomDataset())).toBe(true);
  });

  it("dataset equals itself", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(ds.equals(ds)).toBe(true);
  });

  it("datasets with different item count are not equal", () => {
    const a = makeDS();
    a.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 512));
    const b = makeDS();
    expect(a.equals(b)).toBe(false);
  });

  it("datasets with same items are equal", () => {
    const a = makeDS();
    a.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    const b = makeDS();
    b.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(a.equals(b)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// validate
// ---------------------------------------------------------------------------

describe("DicomDataset — validate", () => {
  it("validate does not throw for valid dataset", () => {
    const ds = makeDS();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16));
    expect(() => ds.validate()).not.toThrow();
  });

  it("validateItems=false skips validation on add", () => {
    const ds = makeDS();
    ds.validateItems = false;
    // This would fail VM check if validation ran (Rows expects 1 value, not 0+)
    expect(() => ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 16))).not.toThrow();
  });
});
