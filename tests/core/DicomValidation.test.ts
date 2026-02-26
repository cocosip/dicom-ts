import { describe, it, expect } from "vitest";
import {
  validateAE, validateAS, validateCS, validateDA, validateDS,
  validateDT, validateIS, validateLO, validateLT, validatePN,
  validateSH, validateST, validateTM, validateUI,
  DicomValidationException,
} from "../../src/core/DicomValidation.js";

// Helper: expect no throw
const ok = (fn: () => void) => expect(fn).not.toThrow();
// Helper: expect DicomValidationException
const fail = (fn: () => void) => expect(fn).toThrow(DicomValidationException);

// ---------------------------------------------------------------------------
describe("validateAE", () => {
  it("accepts valid values", () => {
    ok(() => validateAE("STORE_SCP"));
    ok(() => validateAE("A"));
    ok(() => validateAE("MY AE TITLE"));
  });
  it("rejects > 16 chars", () => fail(() => validateAE("A".repeat(17))));
  it("rejects all-spaces", () => fail(() => validateAE("   ")));
  it("rejects backslash", () => fail(() => validateAE("AE\\TITLE")));
  it("rejects control chars", () => fail(() => validateAE("AE\nTITLE")));
});

// ---------------------------------------------------------------------------
describe("validateAS", () => {
  it("accepts valid values", () => {
    ok(() => validateAS("010Y"));
    ok(() => validateAS("003W"));
    ok(() => validateAS("030D"));
    ok(() => validateAS(""));   // empty allowed
  });
  it("rejects bad suffix", () => fail(() => validateAS("010X")));
  it("rejects short form", () => fail(() => validateAS("10Y")));
  it("rejects long form", () => fail(() => validateAS("0010Y")));
});

// ---------------------------------------------------------------------------
describe("validateCS", () => {
  it("accepts valid values", () => {
    ok(() => validateCS("ORIGINAL"));
    ok(() => validateCS("PRIMARY"));
    ok(() => validateCS("A_B C"));
    ok(() => validateCS(""));
  });
  it("rejects lowercase", () => fail(() => validateCS("original")));
  it("rejects > 16 chars", () => fail(() => validateCS("A".repeat(17))));
  it("rejects special chars", () => fail(() => validateCS("A-B")));
});

// ---------------------------------------------------------------------------
describe("validateDA", () => {
  it("accepts valid dates", () => {
    ok(() => validateDA("20230101"));
    ok(() => validateDA("19991231"));
    ok(() => validateDA("20230101-20231231")); // range
    ok(() => validateDA(""));
  });
  it("rejects bad format", () => fail(() => validateDA("2023-01-01")));
  it("rejects invalid month", () => fail(() => validateDA("20231301")));
  it("rejects invalid day", () => fail(() => validateDA("20230132")));
  it("rejects three range separators", () => fail(() => validateDA("20230101-20230201-20230301")));
});

// ---------------------------------------------------------------------------
describe("validateDS", () => {
  it("accepts valid decimal strings", () => {
    ok(() => validateDS("3.14"));
    ok(() => validateDS("-1.5e10"));
    ok(() => validateDS("+.5"));
    ok(() => validateDS("0"));
    ok(() => validateDS(""));
  });
  it("rejects non-numeric", () => fail(() => validateDS("abc")));
  it("rejects > 16 chars", () => fail(() => validateDS("1".repeat(17))));
});

// ---------------------------------------------------------------------------
describe("validateIS", () => {
  it("accepts valid integer strings", () => {
    ok(() => validateIS("42"));
    ok(() => validateIS("-2147483648"));
    ok(() => validateIS("+2147483647"));
    ok(() => validateIS("  123  ")); // spaces trimmed
    ok(() => validateIS(""));
  });
  it("rejects non-integer", () => fail(() => validateIS("3.14")));
  it("rejects overflow", () => fail(() => validateIS("2147483648")));
});

// ---------------------------------------------------------------------------
describe("validateLO", () => {
  it("accepts valid strings", () => {
    ok(() => validateLO("Hello World"));
    ok(() => validateLO(""));
    ok(() => validateLO("A".repeat(64)));
  });
  it("rejects > 64 chars", () => fail(() => validateLO("A".repeat(65))));
  it("rejects backslash", () => fail(() => validateLO("Hello\\World")));
  it("rejects control char", () => fail(() => validateLO("Hello\nWorld")));
});

// ---------------------------------------------------------------------------
describe("validatePN", () => {
  it("accepts valid person names", () => {
    ok(() => validatePN("Doe^John"));
    ok(() => validatePN("Smith^Jane^Mary^Dr^Jr"));
    ok(() => validatePN("Wang^XiaoMing=王^小明=ワン^シャオミン"));
    ok(() => validatePN(""));
  });
  it("rejects > 3 groups", () => fail(() => validatePN("A=B=C=D")));
  it("rejects > 5 components in a group", () => fail(() => validatePN("A^B^C^D^E^F")));
  it("rejects group > 64 chars", () => fail(() => validatePN("A".repeat(65))));
});

// ---------------------------------------------------------------------------
describe("validateSH", () => {
  it("accepts valid short strings", () => {
    ok(() => validateSH("Hello"));
    ok(() => validateSH("A".repeat(16)));
    ok(() => validateSH(""));
  });
  it("rejects > 16 chars", () => fail(() => validateSH("A".repeat(17))));
  it("rejects backslash", () => fail(() => validateSH("A\\B")));
});

// ---------------------------------------------------------------------------
describe("validateTM", () => {
  it("accepts valid times", () => {
    ok(() => validateTM("070907.0705"));
    ok(() => validateTM("1010"));
    ok(() => validateTM("00"));
    ok(() => validateTM("235960")); // leap second
    ok(() => validateTM("")); // empty allowed
    ok(() => validateTM("0800-1200")); // range
  });
  it("rejects bad format", () => fail(() => validateTM("7:09:07")));
  it("rejects hour > 23", () => fail(() => validateTM("2400")));
  it("rejects minute > 59", () => fail(() => validateTM("0060")));
  it("rejects second > 60", () => fail(() => validateTM("000061")));
});

// ---------------------------------------------------------------------------
describe("validateUI", () => {
  it("accepts valid UIDs", () => {
    ok(() => validateUI("1.2.840.10008.1.2.1"));
    ok(() => validateUI("1.2.3"));
    ok(() => validateUI(""));   // empty allowed
    ok(() => validateUI("2.25.123456789")); // single-component prefix
  });
  it("rejects leading zeros in component", () => fail(() => validateUI("1.02.3")));
  it("rejects empty component", () => fail(() => validateUI("1..3")));
  it("rejects trailing dot", () => fail(() => validateUI("1.2.3.")));
  it("rejects non-digit chars", () => fail(() => validateUI("1.2.A")));
  it("rejects > 64 chars", () => fail(() => validateUI("1." + "2".repeat(63))));
});
