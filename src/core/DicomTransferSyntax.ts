/**
 * DICOM Transfer Syntax descriptor.
 *
 * A transfer syntax defines how a DICOM dataset is encoded on the wire:
 *   - VR explicitness (explicit vs implicit)
 *   - endianness
 *   - whether data is encapsulated (compressed pixel data)
 *   - whether the dataset is deflate-compressed
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomTransferSyntax.cs
 */
import { DicomUID, DicomUidType } from "./DicomUID.js";
import * as DicomUIDs from "./DicomUID.generated.js";

/** Byte order */
export const enum Endian {
  Little = 0,
  Big = 1,
}

export interface DicomTransferSyntaxProps {
  isExplicitVR?: boolean;
  isEncapsulated?: boolean;
  isLossy?: boolean;
  lossyCompressionMethod?: string;
  isDeflate?: boolean;
  endian?: Endian;
  swapPixelData?: boolean;
  isRetired?: boolean;
}

/**
 * Immutable DICOM transfer syntax descriptor.
 */
export class DicomTransferSyntax {
  readonly uid: DicomUID;
  readonly isRetired: boolean;
  /** VR is written explicitly in the binary stream. */
  readonly isExplicitVR: boolean;
  /** Pixel data (and possibly other data) is in a compressed encapsulation. */
  readonly isEncapsulated: boolean;
  /** Compression is lossy (irreversible). */
  readonly isLossy: boolean;
  /** DICOM lossy compression method code (e.g. `ISO_10918_1`). */
  readonly lossyCompressionMethod: string;
  /** Dataset is zlib/deflate compressed after group 0002. */
  readonly isDeflate: boolean;
  /** Byte order for multi-byte values. */
  readonly endian: Endian;
  /**
   * Pixel data byte order differs from the dataset byte order (GE private hack).
   * When true, pixel data is always Big Endian.
   */
  readonly swapPixelData: boolean;

  private constructor(uid: DicomUID, props: DicomTransferSyntaxProps = {}) {
    this.uid = uid;
    this.isRetired = props.isRetired ?? false;
    this.isExplicitVR = props.isExplicitVR ?? false;
    this.isEncapsulated = props.isEncapsulated ?? false;
    this.isLossy = props.isLossy ?? false;
    this.lossyCompressionMethod = props.lossyCompressionMethod ?? "";
    this.isDeflate = props.isDeflate ?? false;
    this.endian = props.endian ?? Endian.Little;
    this.swapPixelData = props.swapPixelData ?? false;
  }

  // ---------------------------------------------------------------------------
  // Registry
  // ---------------------------------------------------------------------------

  private static readonly _map = new Map<string, DicomTransferSyntax>();

  private static register(ts: DicomTransferSyntax): DicomTransferSyntax {
    DicomTransferSyntax._map.set(ts.uid.uid, ts);
    return ts;
  }

  /** Look up a registered transfer syntax by UID string. Returns null if unknown. */
  static lookup(uidStr: string): DicomTransferSyntax | null {
    return DicomTransferSyntax._map.get(uidStr) ?? null;
  }

  /**
   * Parse a UID string into a DicomTransferSyntax.
   * If the UID is registered, the known instance is returned.
   * Otherwise a generic explicit VR little endian descriptor is created.
   */
  static parse(uidStr: string): DicomTransferSyntax {
    const known = DicomTransferSyntax._map.get(uidStr);
    if (known) return known;
    const uid = DicomUID.parse(uidStr, "Unknown Transfer Syntax", DicomUidType.TransferSyntax);
    return new DicomTransferSyntax(uid, { isExplicitVR: true, endian: Endian.Little });
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  equals(other: DicomTransferSyntax): boolean {
    return this.uid.uid === other.uid.uid;
  }

  toString(): string {
    return this.uid.name;
  }

  // ---------------------------------------------------------------------------
  // Helpers for building instances
  // ---------------------------------------------------------------------------

  private static make(uid: DicomUID, props: DicomTransferSyntaxProps): DicomTransferSyntax {
    return DicomTransferSyntax.register(new DicomTransferSyntax(uid, props));
  }

  // ---------------------------------------------------------------------------
  // Standard transfer syntax constants
  // ---------------------------------------------------------------------------

  /** Virtual: Implicit VR Big Endian (non-standard, used for reading some broken files) */
  static readonly ImplicitVRBigEndian = DicomTransferSyntax.register(
    new DicomTransferSyntax(
      new DicomUID(DicomUIDs.ExplicitVRBigEndian.uid + ".123456", "Implicit VR Big Endian", DicomUidType.TransferSyntax),
      { isExplicitVR: false, endian: Endian.Big },
    ),
  );

  /** GE Private Implicit VR Big Endian (big-endian pixel data only) */
  static readonly GEPrivateImplicitVRBigEndian = DicomTransferSyntax.make(
    DicomUID.parse("1.2.840.113619.5.2", "GE Private Implicit VR Big Endian", DicomUidType.TransferSyntax),
    { isExplicitVR: false, endian: Endian.Little, swapPixelData: true },
  );

  /** Implicit VR Little Endian (default transfer syntax for DICOM) */
  static readonly ImplicitVRLittleEndian = DicomTransferSyntax.make(
    DicomUIDs.ImplicitVRLittleEndian,
    { isExplicitVR: false, endian: Endian.Little },
  );

  /** Explicit VR Little Endian */
  static readonly ExplicitVRLittleEndian = DicomTransferSyntax.make(
    DicomUIDs.ExplicitVRLittleEndian,
    { isExplicitVR: true, endian: Endian.Little },
  );

  /** Explicit VR Big Endian (Retired) */
  static readonly ExplicitVRBigEndian = DicomTransferSyntax.make(
    DicomUIDs.ExplicitVRBigEndian,
    { isRetired: true, isExplicitVR: true, endian: Endian.Big },
  );

  /** Deflated Explicit VR Little Endian */
  static readonly DeflatedExplicitVRLittleEndian = DicomTransferSyntax.make(
    DicomUIDs.DeflatedExplicitVRLittleEndian,
    { isExplicitVR: true, isDeflate: true, endian: Endian.Little },
  );

  /** Encapsulated Uncompressed Explicit VR Little Endian */
  static readonly EncapsulatedUncompressedExplicitVRLittleEndian = DicomTransferSyntax.make(
    DicomUIDs.EncapsulatedUncompressedExplicitVRLittleEndian,
    { isExplicitVR: true, isEncapsulated: true, endian: Endian.Little },
  );

  /** JPEG Baseline (Process 1) — lossy */
  static readonly JPEGProcess1 = DicomTransferSyntax.make(
    DicomUIDs.JPEGBaseline8Bit,
    { isExplicitVR: true, isEncapsulated: true, isLossy: true, lossyCompressionMethod: "ISO_10918_1", endian: Endian.Little },
  );

  /** JPEG Extended (Process 2 & 4) — lossy */
  static readonly JPEGProcess2_4 = DicomTransferSyntax.make(
    DicomUIDs.JPEGExtended12Bit,
    { isExplicitVR: true, isEncapsulated: true, isLossy: true, lossyCompressionMethod: "ISO_10918_1", endian: Endian.Little },
  );

  /** JPEG Lossless, Non-Hierarchical (Process 14) */
  static readonly JPEGProcess14 = DicomTransferSyntax.make(
    DicomUIDs.JPEGLossless,
    { isExplicitVR: true, isEncapsulated: true, endian: Endian.Little },
  );

  /** JPEG Lossless, Non-Hierarchical, First-Order Prediction (Process 14 SV1) */
  static readonly JPEGProcess14SV1 = DicomTransferSyntax.make(
    DicomUIDs.JPEGLosslessSV1,
    { isExplicitVR: true, isEncapsulated: true, endian: Endian.Little },
  );

  /** JPEG-LS Lossless */
  static readonly JPEGLSLossless = DicomTransferSyntax.make(
    DicomUIDs.JPEGLSLossless,
    { isExplicitVR: true, isEncapsulated: true, endian: Endian.Little },
  );

  /** JPEG-LS Near Lossless — lossy */
  static readonly JPEGLSNearLossless = DicomTransferSyntax.make(
    DicomUIDs.JPEGLSNearLossless,
    { isExplicitVR: true, isEncapsulated: true, isLossy: true, lossyCompressionMethod: "ISO_14495_1", endian: Endian.Little },
  );

  /** JPEG 2000 Lossless Only */
  static readonly JPEG2000Lossless = DicomTransferSyntax.make(
    DicomUIDs.JPEG2000Lossless,
    { isExplicitVR: true, isEncapsulated: true, endian: Endian.Little },
  );

  /** JPEG 2000 (lossy) */
  static readonly JPEG2000Lossy = DicomTransferSyntax.make(
    DicomUIDs.JPEG2000,
    { isExplicitVR: true, isEncapsulated: true, isLossy: true, lossyCompressionMethod: "ISO_15444_1", endian: Endian.Little },
  );

  /** RLE Lossless */
  static readonly RLELossless = DicomTransferSyntax.make(
    DicomUIDs.RLELossless,
    { isExplicitVR: true, isEncapsulated: true, endian: Endian.Little },
  );

  /** High-Throughput JPEG 2000 (HT-J2K) Lossless */
  static readonly HTJ2KLossless = DicomTransferSyntax.make(
    DicomUIDs.HTJ2KLossless,
    { isExplicitVR: true, isEncapsulated: true, endian: Endian.Little },
  );

  /** High-Throughput JPEG 2000 (HT-J2K) Near Lossless */
  static readonly HTJ2KLosslessRPCL = DicomTransferSyntax.make(
    DicomUIDs.HTJ2KLosslessRPCL,
    { isExplicitVR: true, isEncapsulated: true, endian: Endian.Little },
  );

  /** High-Throughput JPEG 2000 (HT-J2K) Lossy */
  static readonly HTJ2K = DicomTransferSyntax.make(
    DicomUIDs.HTJ2K,
    { isExplicitVR: true, isEncapsulated: true, isLossy: true, lossyCompressionMethod: "ISO_15444_15", endian: Endian.Little },
  );
}
