/**
 * DICOM Tag — (group, element) pair uniquely identifying a data element.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomTag.cs
 */

/** Opaque reference to a private block creator; value is the creator string. */
export class DicomPrivateCreator {
  constructor(readonly creator: string) {}

  toString(): string {
    return this.creator;
  }
}

/**
 * Immutable DICOM tag consisting of a 16-bit group and 16-bit element number.
 *
 * Tags are ordered by (group << 16 | element) and compared numerically.
 */
export class DicomTag {
  /** Sentinel tag (FFFF,FFFF) used as a placeholder / unknown value. */
  static readonly Unknown = new DicomTag(0xffff, 0xffff);

  /**
   * @param group   16-bit group number (0x0000 – 0xFFFF)
   * @param element 16-bit element number (0x0000 – 0xFFFF)
   * @param privateCreator Optional private-tag creator block descriptor
   */
  constructor(
    readonly group: number,
    readonly element: number,
    readonly privateCreator: DicomPrivateCreator | null = null,
  ) {
    // Clamp to uint16 range
    this.group = group & 0xffff;
    this.element = element & 0xffff;
  }

  // ---------------------------------------------------------------------------
  // Derived properties
  // ---------------------------------------------------------------------------

  /** True when the group number is odd (private tag range). */
  get isPrivate(): boolean {
    return (this.group & 1) === 1;
  }

  /** True when this is a group-length element (element == 0x0000). */
  get isGroupLength(): boolean {
    return this.element === 0x0000;
  }

  // ---------------------------------------------------------------------------
  // Numeric conversions
  // ---------------------------------------------------------------------------

  /** Pack into a single uint32 value for fast comparison / map keys. */
  toUint32(): number {
    return ((this.group & 0xffff) * 0x10000 + (this.element & 0xffff)) >>> 0;
  }

  /** Construct a DicomTag from a packed uint32. */
  static fromUint32(value: number): DicomTag {
    return new DicomTag((value >>> 16) & 0xffff, value & 0xffff);
  }

  // ---------------------------------------------------------------------------
  // Equality & ordering
  // ---------------------------------------------------------------------------

  equals(other: DicomTag): boolean {
    return this.group === other.group && this.element === other.element;
  }

  /**
   * Negative if this < other, 0 if equal, positive if this > other.
   * Ordering is purely numeric (group << 16 | element).
   */
  compareTo(other: DicomTag): number {
    return this.toUint32() - other.toUint32();
  }

  // ---------------------------------------------------------------------------
  // String formatting
  // ---------------------------------------------------------------------------

  /**
   * Format the tag as a string.
   *
   * - `"G"` (default) — `(0028,0010)` for public, `(0029,1001:MYPRIVATE)` for private
   * - `"X"` — `(0028,0010)` for public, `(0029,xx01:MYPRIVATE)` for private
   * - `"J"` — `00280010` (JSON key format, no parens)
   */
  toString(format: "G" | "X" | "J" = "G"): string {
    const g = this.group.toString(16).toUpperCase().padStart(4, "0");
    const e = this.element.toString(16).toUpperCase().padStart(4, "0");

    switch (format) {
      case "J":
        return `${g}${e}`;
      case "X":
        if (this.privateCreator !== null) {
          const el = (this.element & 0xff).toString(16).toUpperCase().padStart(2, "0");
          return `(${g},xx${el}:${this.privateCreator.creator})`;
        }
        return `(${g},${e})`;
      default: // "G"
        if (this.privateCreator !== null) {
          return `(${g},${e}:${this.privateCreator.creator})`;
        }
        return `(${g},${e})`;
    }
  }
}

// ---------------------------------------------------------------------------
// DicomMaskedTag — tag with wildcard mask (e.g. (60xx,3000))
// ---------------------------------------------------------------------------

/**
 * A DICOM tag paired with a bit-mask, used for range-matched dictionary entries
 * such as overlay data tags `(60xx,3000)`.
 */
export class DicomMaskedTag {
  /** The tag with masked bits zeroed out. */
  readonly tag: DicomTag;
  /** uint32 mask — bits set to 0 are wildcards. */
  readonly mask: number;
  /** Cached uint32 of the tag for fast matching. */
  private readonly _tagVal: number;

  constructor(tag: DicomTag, mask: number) {
    this.tag = tag;
    this.mask = mask >>> 0;
    this._tagVal = tag.toUint32();
  }

  /** Returns true when the given tag matches the masked pattern. */
  isMatch(tag: DicomTag): boolean {
    return (tag.toUint32() & this.mask) === (this._tagVal & this.mask);
  }

  /**
   * Parse a masked tag string such as `"(60xx,3000)"`.
   * `xx` in the group/element position is treated as a wildcard byte.
   */
  static parse(s: string): DicomMaskedTag {
    // Expected form: (gggg,eeee) where each nibble may be 'x'
    const cleaned = s.replace(/[() ]/g, "");
    const [groupStr, elementStr] = cleaned.split(",");

    if (!groupStr || !elementStr) {
      throw new Error(`Invalid masked tag format: ${s}`);
    }

    const [group, groupMask] = parseMaskedHex(groupStr);
    const [element, elementMask] = parseMaskedHex(elementStr);
    const mask = ((groupMask << 16) | elementMask) >>> 0;

    return new DicomMaskedTag(new DicomTag(group, element), mask);
  }

  toString(): string {
    return this.tag.toString();
  }
}

/** Parse a 4-character hex string where 'x' chars are wildcards. */
function parseMaskedHex(hex: string): [value: number, mask: number] {
  let value = 0;
  let mask = 0;
  for (const ch of hex.toLowerCase()) {
    value <<= 4;
    mask <<= 4;
    if (ch !== "x") {
      value |= parseInt(ch, 16);
      mask |= 0xf;
    }
  }
  return [value & 0xffff, mask & 0xffff];
}
