/**
 * DICOM Unique Identifier (UID) — a dot-separated string of digits.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomUID.cs
 *
 * Standard UID constants live in DicomUID.generated.ts and are merged
 * into this class via augmentation in DicomUID.constants.ts.
 */
import { randomBytes } from "node:crypto";

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export enum DicomUidType {
  TransferSyntax = "Transfer Syntax",
  SOPClass = "SOP Class",
  MetaSOPClass = "Meta SOP Class",
  ServiceClass = "Service Class",
  SOPInstance = "SOP Instance",
  ApplicationContextName = "Application Context Name",
  ApplicationHostingModel = "Application Hosting Model",
  CodingScheme = "Coding Scheme",
  FrameOfReference = "Frame of Reference",
  LDAP = "LDAP",
  MappingResource = "Mapping Resource",
  ContextGroupName = "Context Group Name",
  Unknown = "Unknown",
}

export enum DicomStorageCategory {
  None = "None",
  Image = "Image",
  PresentationState = "Presentation State",
  StructuredReport = "Structured Report",
  Waveform = "Waveform",
  Document = "Document",
  Raw = "Raw",
  Other = "Other",
  Private = "Private",
  Volume = "Volume",
}

// ---------------------------------------------------------------------------
// DicomUID
// ---------------------------------------------------------------------------

/** Root UID used as prefix for generated UIDs. */
let _rootUID = "1.2.826.0.1.3680043.2.1343.1";

/**
 * A DICOM Unique Identifier.
 *
 * Format: `<root>.<suffix>` where each component is a sequence of digits
 * separated by dots. Total length must not exceed 64 characters.
 */
export class DicomUID {
  readonly uid: string;
  readonly name: string;
  readonly type: DicomUidType;
  readonly isRetired: boolean;

  constructor(
    uid: string,
    name: string,
    type: DicomUidType,
    isRetired = false,
  ) {
    this.uid = uid;
    this.name = name;
    this.type = type;
    this.isRetired = isRetired;
  }

  // ---------------------------------------------------------------------------
  // Registry
  // ---------------------------------------------------------------------------

  private static readonly _uids = new Map<string, DicomUID>();

  /** Register a UID in the global registry (called by generated code). */
  static register(uid: DicomUID): void {
    DicomUID._uids.set(uid.uid, uid);
  }

  // ---------------------------------------------------------------------------
  // Static root UID
  // ---------------------------------------------------------------------------

  static get rootUID(): string {
    return _rootUID;
  }

  static set rootUID(value: string) {
    _rootUID = value;
  }

  // ---------------------------------------------------------------------------
  // Lookup / parse
  // ---------------------------------------------------------------------------

  /**
   * Lookup a registered UID by string value.
   * Returns `null` if not found in the registry.
   */
  static lookup(uid: string): DicomUID | null {
    return DicomUID._uids.get(uid.trimEnd()) ?? null;
  }

  /**
   * Parse a UID string, returning an existing registered instance or
   * creating a transient one with type `Unknown`.
   */
  static parse(uid: string, name = "Unknown", type = DicomUidType.Unknown): DicomUID {
    const trimmed = uid.trimEnd().replace(/\0+$/, "");
    return DicomUID._uids.get(trimmed) ?? new DicomUID(trimmed, name, type);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /** Returns true if `uid` is a syntactically valid DICOM UID. */
  static isValid(uid: string): boolean {
    if (!uid || uid.length > 64) return false;
    // Only digits and dots; no leading zeros in components; no empty components
    return /^[0-2](\.(0|[1-9]\d*))*$/.test(uid);
  }

  // ---------------------------------------------------------------------------
  // Generation
  // ---------------------------------------------------------------------------

  /**
   * Generate a new unique UID derived from a UUID (same algorithm as fo-dicom).
   *
   * The UUID bytes are converted to a large integer and appended to the root UID.
   */
  static generate(): DicomUID {
    const uid = DicomUIDGenerator.generateDerivedFromUUID();
    return new DicomUID(uid, "SOP Instance UID", DicomUidType.SOPInstance);
  }

  /**
   * Create a new UID by appending `nextSeq` to a base UID.
   */
  static append(baseUid: DicomUID, nextSeq: number | bigint): DicomUID {
    const uid = `${baseUid.uid}.${nextSeq}`;
    return new DicomUID(uid, "SOP Instance UID", DicomUidType.SOPInstance);
  }

  // ---------------------------------------------------------------------------
  // String representation
  // ---------------------------------------------------------------------------

  toString(): string {
    return this.uid;
  }

  equals(other: DicomUID): boolean {
    return this.uid === other.uid;
  }
}

// ---------------------------------------------------------------------------
// DicomUIDGenerator
// ---------------------------------------------------------------------------

/**
 * Generates unique DICOM UIDs.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomUIDGenerator.cs
 */
export class DicomUIDGenerator {
  /**
   * Generate a UID derived from a random UUID.
   *
   * The 128-bit UUID is interpreted as a big-endian unsigned integer and
   * represented as a decimal number, then appended to the root UID.
   * This matches fo-dicom's `DicomUIDGenerator.GenerateDerivedFromUUID()`.
   */
  static generateDerivedFromUUID(): string {
    const bytes = randomBytes(16);
    // Convert 16-byte big-endian buffer to a decimal string via BigInt
    let n = 0n;
    for (const b of bytes) {
      n = (n << 8n) | BigInt(b);
    }
    const uid = `${_rootUID}.${n}`;
    if (uid.length > 64) {
      // Trim the numeric suffix to fit within 64 chars
      const maxSuffix = 64 - _rootUID.length - 1;
      const trimmed = n.toString().slice(0, maxSuffix);
      return `${_rootUID}.${trimmed}`;
    }
    return uid;
  }

  /**
   * Generate a UID for a specific sequence position.
   * The prefix must not exceed 54 characters to leave room for the suffix.
   */
  static generateSequential(prefix: string, sequence: number): string {
    const uid = `${prefix}.${sequence}`;
    if (uid.length > 64) throw new Error(`Generated UID exceeds 64 characters: ${uid}`);
    return uid;
  }
}
