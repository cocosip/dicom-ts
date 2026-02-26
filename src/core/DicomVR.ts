/**
 * DICOM Value Representation (VR) descriptor.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomVR.cs
 *
 * Each VR describes how a data element's value is encoded:
 *   - string vs binary
 *   - 16-bit vs 32-bit length field in the binary stream
 *   - unit size and byte-swap width for endian conversion
 *   - padding byte (space 0x20 or null 0x00)
 */
import * as v from "./DicomValidation.js";

export type StringValidator = (value: string) => void;

/** All supported VR code strings. */
export type VRCode =
  | "NONE"
  | "AE" | "AS" | "AT" | "CS" | "DA" | "DS" | "DT"
  | "FD" | "FL"
  | "IS" | "LO" | "LT"
  | "OB" | "OD" | "OF" | "OL" | "OV" | "OW"
  | "PN" | "SH" | "SL" | "SQ" | "SS" | "ST" | "SV"
  | "TM" | "UC" | "UI" | "UL" | "UN" | "UR" | "US" | "UT" | "UV";

export interface DicomVRProps {
  code: VRCode;
  name: string;
  isString: boolean;
  isStringEncoded: boolean;
  is16bitLength: boolean;
  isMultiValue: boolean;
  paddingValue: number;   // 0x00 or 0x20
  maximumLength: number;  // 0 = unlimited
  unitSize: number;       // bytes per value unit (0 for variable)
  byteSwap: number;       // bytes to swap per unit for endian conversion
  stringValidator?: StringValidator;
}

const PAD_ZERO = 0x00;
const PAD_SPACE = 0x20;

/**
 * Immutable DICOM Value Representation descriptor.
 */
export class DicomVR {
  readonly code: VRCode;
  readonly name: string;
  /** Value is stored as a character string. */
  readonly isString: boolean;
  /** String uses the SpecificCharacterSet encoding. */
  readonly isStringEncoded: boolean;
  /** Length field in the binary stream is 16 bits (vs 32 bits). */
  readonly is16bitLength: boolean;
  /** Value can hold multiple items separated by `\`. */
  readonly isMultiValue: boolean;
  /** Byte used to pad values to even length. */
  readonly paddingValue: number;
  /** Maximum byte length of a single value (0 = unlimited). */
  readonly maximumLength: number;
  /** Fixed byte size per value unit; 0 for variable-length. */
  readonly unitSize: number;
  /** Number of bytes to swap when converting endianness. */
  readonly byteSwap: number;

  private readonly _stringValidator: StringValidator | undefined;

  private constructor(props: DicomVRProps) {
    this.code = props.code;
    this.name = props.name;
    this.isString = props.isString;
    this.isStringEncoded = props.isStringEncoded;
    this.is16bitLength = props.is16bitLength;
    this.isMultiValue = props.isMultiValue;
    this.paddingValue = props.paddingValue;
    this.maximumLength = props.maximumLength;
    this.unitSize = props.unitSize;
    this.byteSwap = props.byteSwap;
    this._stringValidator = props.stringValidator;
  }

  /** Validate a string value for this VR. Throws if invalid. */
  validateString(value: string): void {
    this._stringValidator?.(value);
  }

  toString(): string {
    return this.code;
  }

  // ---------------------------------------------------------------------------
  // Static registry & lookup
  // ---------------------------------------------------------------------------

  private static readonly _registry = new Map<string, DicomVR>();

  private static register(props: DicomVRProps): DicomVR {
    const vr = new DicomVR(props);
    DicomVR._registry.set(props.code, vr);
    return vr;
  }

  /**
   * Look up a VR by its two-character code.
   * Throws `Error` if the code is unknown.
   */
  static parse(code: string): DicomVR {
    const vr = DicomVR._registry.get(code);
    if (vr === undefined) throw new Error(`Unknown VR: '${code}'`);
    return vr;
  }

  /**
   * Try to look up a VR by its two-character code.
   * Returns `null` if the code is unknown.
   */
  static tryParse(code: string): DicomVR | null {
    return DicomVR._registry.get(code) ?? null;
  }

  /**
   * Look up a VR from the first two bytes of a binary VR field.
   * Returns `null` if unrecognised.
   */
  static tryParseBytes(b0: number, b1: number): DicomVR | null {
    // Fast two-byte lookup via string key
    const code = String.fromCharCode(b0, b1);
    return DicomVR._registry.get(code) ?? null;
  }

  // ---------------------------------------------------------------------------
  // VR constants — ordered alphabetically by code
  // ---------------------------------------------------------------------------

  /** No Value Representation */
  static readonly NONE = DicomVR.register({
    code: "NONE",
    name: "No Value Representation",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: false,
    paddingValue: PAD_ZERO,
    maximumLength: 0,
    unitSize: 0,
    byteSwap: 0,
  });

  /** Application Entity */
  static readonly AE = DicomVR.register({
    code: "AE",
    name: "Application Entity",
    isString: true,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 16,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateAE,
  });

  /** Age String */
  static readonly AS = DicomVR.register({
    code: "AS",
    name: "Age String",
    isString: true,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 4,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateAS,
  });

  /** Attribute Tag */
  static readonly AT = DicomVR.register({
    code: "AT",
    name: "Attribute Tag",
    isString: false,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 4,
    unitSize: 4,
    byteSwap: 2,
  });

  /** Code String */
  static readonly CS = DicomVR.register({
    code: "CS",
    name: "Code String",
    isString: true,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 16,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateCS,
  });

  /** Date */
  static readonly DA = DicomVR.register({
    code: "DA",
    name: "Date",
    isString: true,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 18,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateDA,
  });

  /** Decimal String */
  static readonly DS = DicomVR.register({
    code: "DS",
    name: "Decimal String",
    isString: true,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 16,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateDS,
  });

  /** Date Time */
  static readonly DT = DicomVR.register({
    code: "DT",
    name: "Date Time",
    isString: true,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 54,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateDT,
  });

  /** Floating Point Double (64-bit) */
  static readonly FD = DicomVR.register({
    code: "FD",
    name: "Floating Point Double",
    isString: false,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 8,
    unitSize: 8,
    byteSwap: 8,
  });

  /** Floating Point Single (32-bit) */
  static readonly FL = DicomVR.register({
    code: "FL",
    name: "Floating Point Single",
    isString: false,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 4,
    unitSize: 4,
    byteSwap: 4,
  });

  /** Integer String */
  static readonly IS = DicomVR.register({
    code: "IS",
    name: "Integer String",
    isString: true,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 12,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateIS,
  });

  /** Long String */
  static readonly LO = DicomVR.register({
    code: "LO",
    name: "Long String",
    isString: true,
    isStringEncoded: true,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 64,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateLO,
  });

  /** Long Text */
  static readonly LT = DicomVR.register({
    code: "LT",
    name: "Long Text",
    isString: true,
    isStringEncoded: true,
    is16bitLength: true,
    isMultiValue: false,
    paddingValue: PAD_SPACE,
    maximumLength: 10240,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateLT,
  });

  /** Other Byte */
  static readonly OB = DicomVR.register({
    code: "OB",
    name: "Other Byte",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 0,
    unitSize: 1,
    byteSwap: 1,
  });

  /** Other Double */
  static readonly OD = DicomVR.register({
    code: "OD",
    name: "Other Double",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 0,
    unitSize: 8,
    byteSwap: 8,
  });

  /** Other Float */
  static readonly OF = DicomVR.register({
    code: "OF",
    name: "Other Float",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 0,
    unitSize: 4,
    byteSwap: 4,
  });

  /** Other Long */
  static readonly OL = DicomVR.register({
    code: "OL",
    name: "Other Long",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 0,
    unitSize: 4,
    byteSwap: 4,
  });

  /** Other Very Long */
  static readonly OV = DicomVR.register({
    code: "OV",
    name: "Other Very Long",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 0,
    unitSize: 8,
    byteSwap: 8,
  });

  /** Other Word */
  static readonly OW = DicomVR.register({
    code: "OW",
    name: "Other Word",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 0,
    unitSize: 2,
    byteSwap: 2,
  });

  /** Person Name */
  static readonly PN = DicomVR.register({
    code: "PN",
    name: "Person Name",
    isString: true,
    isStringEncoded: true,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 64,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validatePN,
  });

  /** Short String */
  static readonly SH = DicomVR.register({
    code: "SH",
    name: "Short String",
    isString: true,
    isStringEncoded: true,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 16,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateSH,
  });

  /** Signed Long (32-bit signed integer) */
  static readonly SL = DicomVR.register({
    code: "SL",
    name: "Signed Long",
    isString: false,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 4,
    unitSize: 4,
    byteSwap: 4,
  });

  /** Sequence of Items */
  static readonly SQ = DicomVR.register({
    code: "SQ",
    name: "Sequence of Items",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: false,
    paddingValue: PAD_SPACE,
    maximumLength: 0,
    unitSize: 0,
    byteSwap: 0,
  });

  /** Signed Short (16-bit signed integer) */
  static readonly SS = DicomVR.register({
    code: "SS",
    name: "Signed Short",
    isString: false,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 2,
    unitSize: 2,
    byteSwap: 2,
  });

  /** Short Text */
  static readonly ST = DicomVR.register({
    code: "ST",
    name: "Short Text",
    isString: true,
    isStringEncoded: true,
    is16bitLength: true,
    isMultiValue: false,
    paddingValue: PAD_SPACE,
    maximumLength: 1024,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateST,
  });

  /** Signed Very Long (64-bit signed integer) */
  static readonly SV = DicomVR.register({
    code: "SV",
    name: "Signed Very Long",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 8,
    unitSize: 8,
    byteSwap: 8,
  });

  /** Time */
  static readonly TM = DicomVR.register({
    code: "TM",
    name: "Time",
    isString: true,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 16,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateTM,
  });

  /** Unlimited Characters */
  static readonly UC = DicomVR.register({
    code: "UC",
    name: "Unlimited Characters",
    isString: true,
    isStringEncoded: true,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_SPACE,
    maximumLength: 0,
    unitSize: 1,
    byteSwap: 1,
  });

  /** Unique Identifier (UID) */
  static readonly UI = DicomVR.register({
    code: "UI",
    name: "Unique Identifier",
    isString: true,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 64,
    unitSize: 1,
    byteSwap: 1,
    stringValidator: v.validateUI,
  });

  /** Unsigned Long (32-bit unsigned integer) */
  static readonly UL = DicomVR.register({
    code: "UL",
    name: "Unsigned Long",
    isString: false,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 4,
    unitSize: 4,
    byteSwap: 4,
  });

  /** Unknown */
  static readonly UN = DicomVR.register({
    code: "UN",
    name: "Unknown",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 0,
    unitSize: 1,
    byteSwap: 1,
  });

  /** Universal Resource Identifier / Locator */
  static readonly UR = DicomVR.register({
    code: "UR",
    name: "Universal Resource Identifier or Locator",
    isString: true,
    isStringEncoded: true,
    is16bitLength: false,
    isMultiValue: false,
    paddingValue: PAD_SPACE,
    maximumLength: 0,
    unitSize: 1,
    byteSwap: 1,
  });

  /** Unsigned Short (16-bit unsigned integer) */
  static readonly US = DicomVR.register({
    code: "US",
    name: "Unsigned Short",
    isString: false,
    isStringEncoded: false,
    is16bitLength: true,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 2,
    unitSize: 2,
    byteSwap: 2,
  });

  /** Unlimited Text */
  static readonly UT = DicomVR.register({
    code: "UT",
    name: "Unlimited Text",
    isString: true,
    isStringEncoded: true,
    is16bitLength: false,
    isMultiValue: false,
    paddingValue: PAD_SPACE,
    maximumLength: 0,
    unitSize: 1,
    byteSwap: 1,
  });

  /** Unsigned Very Long (64-bit unsigned integer) */
  static readonly UV = DicomVR.register({
    code: "UV",
    name: "Unsigned Very Long",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: true,
    paddingValue: PAD_ZERO,
    maximumLength: 8,
    unitSize: 8,
    byteSwap: 8,
  });

  /** Implicit VR placeholder (used in Implicit VR Little Endian datasets). */
  static readonly Implicit = new DicomVR({
    code: "NONE",
    name: "Implicit VR",
    isString: false,
    isStringEncoded: false,
    is16bitLength: false,
    isMultiValue: false,
    paddingValue: PAD_ZERO,
    maximumLength: 0,
    unitSize: 0,
    byteSwap: 0,
  });
}
