import { describe, it, expect } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  DicomApplicationEntity,
  DicomAgeString,
  DicomAttributeTag,
  DicomCodeString,
  DicomDate,
  DicomDateTime,
  DicomDecimalString,
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
  DicomShortText,
  DicomSignedLong,
  DicomSignedShort,
  DicomSignedVeryLong,
  DicomTime,
  DicomUnlimitedCharacters,
  DicomUniqueIdentifier,
  DicomUnknown,
  DicomUniversalResource,
  DicomUnsignedLong,
  DicomUnsignedShort,
  DicomUnsignedVeryLong,
  DicomUnlimitedText,
} from "../../src/dataset/DicomElement.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";

async function withTempDir<T>(fn: (dir: string) => Promise<T> | T): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), "dicom-ts-"));
  try {
    return await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function privateTag(id: number): DicomTag {
  return new DicomTag(0x0011, 0x1000 + id);
}

describe("DicomFile round-trip for element types", () => {
  it("round-trips all supported VR element types", async () => {
    await withTempDir(async (dir) => {
      const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, DicomUIDs.CTImageStorage));
      dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, "1.2.3.4.5"));

      let idx = 1;
      const tagAE = privateTag(idx++);
      const tagAS = privateTag(idx++);
      const tagAT = privateTag(idx++);
      const tagCS = privateTag(idx++);
      const tagDA = privateTag(idx++);
      const tagDS = privateTag(idx++);
      const tagDT = privateTag(idx++);
      const tagFD = privateTag(idx++);
      const tagFL = privateTag(idx++);
      const tagIS = privateTag(idx++);
      const tagLO = privateTag(idx++);
      const tagLT = privateTag(idx++);
      const tagOB = privateTag(idx++);
      const tagOD = privateTag(idx++);
      const tagOF = privateTag(idx++);
      const tagOL = privateTag(idx++);
      const tagOV = privateTag(idx++);
      const tagOW = privateTag(idx++);
      const tagPN = privateTag(idx++);
      const tagSH = privateTag(idx++);
      const tagSL = privateTag(idx++);
      const tagSS = privateTag(idx++);
      const tagST = privateTag(idx++);
      const tagSV = privateTag(idx++);
      const tagTM = privateTag(idx++);
      const tagUC = privateTag(idx++);
      const tagUI = privateTag(idx++);
      const tagUL = privateTag(idx++);
      const tagUN = privateTag(idx++);
      const tagUR = privateTag(idx++);
      const tagUS = privateTag(idx++);
      const tagUT = privateTag(idx++);
      const tagUV = privateTag(idx++);
      const tagSQ = privateTag(idx++);

      dataset.addOrUpdate(new DicomApplicationEntity(tagAE, "AE_TITLE"));
      dataset.addOrUpdate(new DicomAgeString(tagAS, "010Y"));
      dataset.addOrUpdate(new DicomAttributeTag(tagAT, DicomTags.PatientName, DicomTags.PatientID));
      dataset.addOrUpdate(new DicomCodeString(tagCS, "CODE"));
      dataset.addOrUpdate(new DicomDate(tagDA, "20240227"));
      dataset.addOrUpdate(new DicomDecimalString(tagDS, "1.23"));
      dataset.addOrUpdate(new DicomDateTime(tagDT, "20240227112233"));
      dataset.addOrUpdate(new DicomFloatingPointDouble(tagFD, 3.14159));
      dataset.addOrUpdate(new DicomFloatingPointSingle(tagFL, 2.718));
      dataset.addOrUpdate(new DicomIntegerString(tagIS, "42"));
      dataset.addOrUpdate(new DicomLongString(tagLO, "LongValue"));
      dataset.addOrUpdate(new DicomLongText(tagLT, "Long text content"));
      dataset.addOrUpdate(new DicomOtherByte(tagOB, Uint8Array.from([1, 2, 3])));
      dataset.addOrUpdate(new DicomOtherDouble(tagOD, new Float64Array([1.5, 2.5])));
      dataset.addOrUpdate(new DicomOtherFloat(tagOF, new Float32Array([3.5, 4.25])));
      dataset.addOrUpdate(new DicomOtherLong(tagOL, new Uint32Array([9, 10])));
      dataset.addOrUpdate(new DicomOtherVeryLong(tagOV, new BigUint64Array([1n, 2n])));
      dataset.addOrUpdate(new DicomOtherWord(tagOW, new Uint16Array([0x1234, 0xabcd])));
      dataset.addOrUpdate(new DicomPersonName(tagPN, "Doe^Jane"));
      dataset.addOrUpdate(new DicomShortString(tagSH, "SHORT"));
      dataset.addOrUpdate(new DicomSignedLong(tagSL, -123456));
      dataset.addOrUpdate(new DicomSignedShort(tagSS, -123));
      dataset.addOrUpdate(new DicomShortText(tagST, "Short text"));
      dataset.addOrUpdate(new DicomSignedVeryLong(tagSV, -123456789n));
      dataset.addOrUpdate(new DicomTime(tagTM, "235959"));
      dataset.addOrUpdate(new DicomUnlimitedCharacters(tagUC, "UnlimitedChars"));
      dataset.addOrUpdate(new DicomUniqueIdentifier(tagUI, "1.2.3.4"));
      dataset.addOrUpdate(new DicomUnsignedLong(tagUL, 1234567890));
      dataset.addOrUpdate(new DicomUnknown(tagUN, Uint8Array.from([9, 8, 7])));
      dataset.addOrUpdate(new DicomUniversalResource(tagUR, "https://example.com/x"));
      dataset.addOrUpdate(new DicomUnsignedShort(tagUS, 65530));
      dataset.addOrUpdate(new DicomUnlimitedText(tagUT, "Unlimited text"));
      dataset.addOrUpdate(new DicomUnsignedVeryLong(tagUV, 1234567890123n));

      const inner = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
      const tagInner = privateTag(idx++);
      inner.addOrUpdate(new DicomLongString(tagInner, "INNER"));
      dataset.addOrUpdate(new DicomSequence(tagSQ, inner));

      const file = new DicomFile(dataset);
      const filePath = join(dir, "roundtrip-all-vr.dcm");
      await file.save(filePath);

      const opened = await DicomFile.open(filePath);
      const ds = opened.dataset;

      expect(ds.getString(tagAE)).toBe("AE_TITLE");
      expect(ds.getString(tagAS)).toBe("010Y");
      expect(ds.getValues<DicomTag>(tagAT).map((t) => t.toString()))
        .toEqual([DicomTags.PatientName, DicomTags.PatientID].map((t) => t.toString()));
      expect(ds.getString(tagCS)).toBe("CODE");
      expect(ds.getString(tagDA)).toBe("20240227");
      expect(ds.getString(tagDS)).toBe("1.23");
      expect(ds.getString(tagDT)).toBe("20240227112233");
      expect(ds.getValue<number>(tagFD)).toBeCloseTo(3.14159, 5);
      expect(ds.getValue<number>(tagFL)).toBeCloseTo(2.718, 3);
      expect(ds.getString(tagIS)).toBe("42");
      expect(ds.getString(tagLO)).toBe("LongValue");
      expect(ds.getString(tagLT)).toBe("Long text content");
      expect(Array.from(ds.getDicomItem(tagOB)!.buffer.data)).toEqual([1, 2, 3]);
      expect(ds.getValues<number>(tagOD)[0]).toBeCloseTo(1.5, 6);
      expect(ds.getValues<number>(tagOD)[1]).toBeCloseTo(2.5, 6);
      expect(ds.getValues<number>(tagOF)[0]).toBeCloseTo(3.5, 4);
      expect(ds.getValues<number>(tagOF)[1]).toBeCloseTo(4.25, 4);
      expect(ds.getValues<number>(tagOL)).toEqual([9, 10]);
      expect(ds.getValues<bigint>(tagOV)).toEqual([1n, 2n]);
      expect(ds.getValues<number>(tagOW)).toEqual([0x1234, 0xabcd]);
      expect(ds.getString(tagPN)).toBe("Doe^Jane");
      expect(ds.getString(tagSH)).toBe("SHORT");
      expect(ds.getValue<number>(tagSL)).toBe(-123456);
      expect(ds.getValue<number>(tagSS)).toBe(-123);
      expect(ds.getString(tagST)).toBe("Short text");
      expect(ds.getValue<bigint>(tagSV)).toBe(-123456789n);
      expect(ds.getString(tagTM)).toBe("235959");
      expect(ds.getString(tagUC)).toBe("UnlimitedChars");
      expect(ds.getString(tagUI)).toBe("1.2.3.4");
      expect(ds.getValue<number>(tagUL)).toBe(1234567890);
      expect(Array.from(ds.getDicomItem(tagUN)!.buffer.data)).toEqual([9, 8, 7]);
      expect(ds.getString(tagUR)).toBe("https://example.com/x");
      expect(ds.getValue<number>(tagUS)).toBe(65530);
      expect(ds.getString(tagUT)).toBe("Unlimited text");
      expect(ds.getValue<bigint>(tagUV)).toBe(1234567890123n);

      const seq = ds.getSequence(tagSQ);
      expect(seq.items.length).toBe(1);
      expect(seq.items[0]!.getString(tagInner)).toBe("INNER");
    });
  });
});
