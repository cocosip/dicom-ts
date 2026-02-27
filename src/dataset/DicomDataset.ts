/**
 * DicomDataset — ordered collection of DICOM data elements.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomDataset.cs
 *
 * Storage: Map<uint32, DicomItem> keyed by tag.toUint32(). Iteration is
 * always in ascending tag order (sorted on demand).
 *
 * Transfer syntax cascade: setting internalTransferSyntax propagates the
 * value recursively into every nested DicomSequence dataset.
 */

import { DicomTag } from "../core/DicomTag.js";
import { DicomVR } from "../core/DicomVR.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomDictionary, UnknownTag } from "../core/DicomDictionary.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomItem } from "./DicomItem.js";
import {
  DicomElement,
  DicomStringElement,
  DicomMultiStringElement,
  DicomValueElement,
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
} from "./DicomElement.js";
import { DicomSequence } from "./DicomSequence.js";
import { DicomFragmentSequence } from "./DicomFragmentSequence.js";

// ---------------------------------------------------------------------------
// DicomDataset
// ---------------------------------------------------------------------------

export class DicomDataset implements Iterable<DicomItem> {
  private _items: Map<number, DicomItem>;
  private _syntax: DicomTransferSyntax;

  /** When false, skip per-element validation on add/update. */
  validateItems: boolean = true;

  /**
   * Fallback character encodings used when SpecificCharacterSet tag is absent.
   * The binary reader sets this to the default encoding array.
   */
  fallbackEncodings: readonly string[] = [];

  // -------------------------------------------------------------------------
  // Constructors
  // -------------------------------------------------------------------------

  constructor();
  constructor(transferSyntax: DicomTransferSyntax);
  constructor(items: Iterable<DicomItem>);
  constructor(arg?: DicomTransferSyntax | Iterable<DicomItem>) {
    this._items = new Map();
    if (arg instanceof DicomTransferSyntax) {
      this._syntax = arg;
    } else {
      this._syntax = DicomTransferSyntax.ExplicitVRLittleEndian;
      if (arg) {
        for (const item of arg as Iterable<DicomItem>) {
          this._doAdd(item, true);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // Transfer syntax (with cascade into nested sequences)
  // -------------------------------------------------------------------------

  get internalTransferSyntax(): DicomTransferSyntax { return this._syntax; }

  set internalTransferSyntax(value: DicomTransferSyntax) {
    this._syntax = value;
    for (const item of this._items.values()) {
      if (item instanceof DicomSequence) {
        for (const ds of item.items as DicomDataset[]) {
          ds.internalTransferSyntax = value;
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // Counts / presence
  // -------------------------------------------------------------------------

  /** Number of top-level items in this dataset. */
  get count(): number { return this._items.size; }

  contains(tag: DicomTag): boolean {
    return this._items.has(tag.toUint32());
  }

  getValueCount(tag: DicomTag): number {
    const item = this._items.get(tag.toUint32());
    if (!item) return 0;
    if (item instanceof DicomElement) return item.count;
    if (item instanceof DicomSequence) return item.items.length;
    return 0;
  }

  // -------------------------------------------------------------------------
  // Item retrieval
  // -------------------------------------------------------------------------

  /** Return the raw DicomItem for a tag, or null if not present. */
  getDicomItem<T extends DicomItem>(tag: DicomTag): T | null {
    return (this._items.get(tag.toUint32()) as T | undefined) ?? null;
  }

  /** Return the DicomSequence for a tag; throws if absent or wrong type. */
  getSequence(tag: DicomTag): DicomSequence {
    const item = this._items.get(tag.toUint32());
    if (!item) throw new Error(`Tag ${tag} not found in dataset`);
    if (!(item instanceof DicomSequence)) {
      throw new Error(`Tag ${tag} is not a sequence (VR=${item.valueRepresentation})`);
    }
    return item;
  }

  /** Return the DicomSequence for a tag, or null if absent or wrong type. */
  tryGetSequence(tag: DicomTag): DicomSequence | null {
    const item = this._items.get(tag.toUint32());
    return item instanceof DicomSequence ? item : null;
  }

  // -------------------------------------------------------------------------
  // Value retrieval — single index
  // -------------------------------------------------------------------------

  /**
   * Get the value at `index` from a data element.
   * T is used as a type annotation only — no runtime conversion is performed.
   * For string elements returns string, for numeric elements returns number or bigint.
   */
  getValue<T>(tag: DicomTag, index = 0): T {
    const item = this._items.get(tag.toUint32());
    if (!item || !(item instanceof DicomElement)) {
      throw new Error(`Tag ${tag} not found`);
    }
    return _extractValue<T>(item, index);
  }

  /** Non-throwing variant; returns undefined if tag absent or index out of range. */
  tryGetValue<T>(tag: DicomTag, index = 0): T | undefined {
    const item = this._items.get(tag.toUint32());
    if (!item || !(item instanceof DicomElement)) return undefined;
    try { return _extractValue<T>(item, index); } catch { return undefined; }
  }

  /** Returns the value at `index`, or `defaultValue` if tag absent. */
  getValueOrDefault<T>(tag: DicomTag, index: number, defaultValue: T): T {
    return this.tryGetValue<T>(tag, index) ?? defaultValue;
  }

  // -------------------------------------------------------------------------
  // Value retrieval — all values
  // -------------------------------------------------------------------------

  /** Return all values from a data element as an array. Throws if tag absent. */
  getValues<T>(tag: DicomTag): T[] {
    const item = this._items.get(tag.toUint32());
    if (!item || !(item instanceof DicomElement)) {
      throw new Error(`Tag ${tag} not found`);
    }
    return _extractValues<T>(item);
  }

  /** Non-throwing variant; returns undefined if tag absent. */
  tryGetValues<T>(tag: DicomTag): T[] | undefined {
    const item = this._items.get(tag.toUint32());
    if (!item || !(item instanceof DicomElement)) return undefined;
    try { return _extractValues<T>(item); } catch { return undefined; }
  }

  // -------------------------------------------------------------------------
  // Value retrieval — single-valued (VM=1) elements
  // -------------------------------------------------------------------------

  /**
   * Return the single value of a VM=1 element.
   * Throws if the tag is absent or has ≠1 values.
   */
  getSingleValue<T>(tag: DicomTag): T {
    const item = this._items.get(tag.toUint32());
    if (!item || !(item instanceof DicomElement)) {
      throw new Error(`Tag ${tag} not found`);
    }
    if (item.count !== 1) {
      throw new Error(`Tag ${tag} has ${item.count} values; expected exactly 1`);
    }
    return _extractValue<T>(item, 0);
  }

  /** Non-throwing variant; returns `defaultValue` if absent or count≠1. */
  getSingleValueOrDefault<T>(tag: DicomTag, defaultValue: T): T {
    try { return this.getSingleValue<T>(tag); } catch { return defaultValue; }
  }

  // -------------------------------------------------------------------------
  // String retrieval
  // -------------------------------------------------------------------------

  /**
   * Return a string representation of the element value.
   * For multi-value elements the values are joined with backslash.
   */
  getString(tag: DicomTag): string {
    const item = this._items.get(tag.toUint32());
    if (!item || !(item instanceof DicomElement)) {
      throw new Error(`Tag ${tag} not found`);
    }
    return _getStringValue(item);
  }

  /** Non-throwing variant; returns undefined if tag absent. */
  tryGetString(tag: DicomTag): string | undefined {
    const item = this._items.get(tag.toUint32());
    if (!item || !(item instanceof DicomElement)) return undefined;
    try { return _getStringValue(item); } catch { return undefined; }
  }

  // -------------------------------------------------------------------------
  // Add — throws if tag already present
  // -------------------------------------------------------------------------

  add(item: DicomItem): this;
  add(items: Iterable<DicomItem>): this;
  add(...items: DicomItem[]): this;
  add(arg: DicomItem | Iterable<DicomItem>, ...rest: DicomItem[]): this {
    if (rest.length > 0) {
      this._doAdd(arg as DicomItem, false);
      for (const item of rest) this._doAdd(item, false);
      return this;
    }
    if (arg instanceof DicomItem) {
      return this._doAdd(arg, false);
    }
    for (const item of arg as Iterable<DicomItem>) {
      this._doAdd(item, false);
    }
    return this;
  }

  // -------------------------------------------------------------------------
  // AddOrUpdate — replaces existing tag
  // -------------------------------------------------------------------------

  addOrUpdate(item: DicomItem): this;
  addOrUpdate(items: Iterable<DicomItem>): this;
  addOrUpdate(...items: DicomItem[]): this;
  addOrUpdate(arg: DicomItem | Iterable<DicomItem>, ...rest: DicomItem[]): this {
    if (rest.length > 0) {
      this._doAdd(arg as DicomItem, true);
      for (const item of rest) this._doAdd(item, true);
      return this;
    }
    if (arg instanceof DicomItem) {
      return this._doAdd(arg, true);
    }
    for (const item of arg as Iterable<DicomItem>) {
      this._doAdd(item, true);
    }
    return this;
  }

  /**
   * Create and add/update a data element from raw values with an explicit VR.
   * Used for private tags and cases where the dictionary lookup is skipped.
   */
  addOrUpdateElement(vr: DicomVR, tag: DicomTag, ...values: unknown[]): this {
    const item = _createItemFromValues(vr, tag, values);
    return this._doAdd(item, true);
  }

  /**
   * Create and add/update a data element from raw values.
   * The VR is looked up from the DICOM dictionary.
   * Throws for unknown tags — use `addOrUpdateElement` with explicit VR instead.
   */
  addOrUpdateValue(tag: DicomTag, ...values: unknown[]): this {
    const entry = DicomDictionary.default.lookup(tag);
    if (entry === UnknownTag) {
      throw new Error(`Tag ${tag} not found in dictionary. Use addOrUpdateElement() with explicit VR for private tags.`);
    }
    return this.addOrUpdateElement(entry.vr, tag, ...values);
  }

  // -------------------------------------------------------------------------
  // Remove / clear
  // -------------------------------------------------------------------------

  remove(tag: DicomTag): this;
  remove(predicate: (item: DicomItem) => boolean): this;
  remove(arg: DicomTag | ((item: DicomItem) => boolean)): this {
    if (arg instanceof DicomTag) {
      this._items.delete(arg.toUint32());
    } else {
      const pred = arg as (item: DicomItem) => boolean;
      for (const [key, item] of this._items) {
        if (pred(item)) this._items.delete(key);
      }
    }
    return this;
  }

  clear(): this {
    this._items.clear();
    return this;
  }

  // -------------------------------------------------------------------------
  // Copy
  // -------------------------------------------------------------------------

  /** Copy all items from this dataset into `destination`. Returns destination. */
  copyTo(destination: DicomDataset): DicomDataset {
    for (const item of this) {
      destination.addOrUpdate(item);
    }
    return destination;
  }

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------

  /** Validate all items (ignores `validateItems` flag — always runs). */
  validate(): void {
    for (const item of this._items.values()) {
      item.validate();
    }
  }

  // -------------------------------------------------------------------------
  // Iteration (sorted by tag uint32 ascending)
  // -------------------------------------------------------------------------

  [Symbol.iterator](): Iterator<DicomItem> {
    const sorted = [...this._items.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, item]) => item);
    return sorted[Symbol.iterator]();
  }

  // -------------------------------------------------------------------------
  // Equality
  // -------------------------------------------------------------------------

  equals(other: DicomDataset): boolean {
    if (this._items.size !== other._items.size) return false;
    for (const [key, item] of this._items) {
      const otherItem = other._items.get(key);
      if (!otherItem) return false;
      if (item.toString() !== otherItem.toString()) return false;
    }
    return true;
  }

  toString(): string {
    return `DicomDataset[${this._items.size} items, ${this._syntax.uid.uid}]`;
  }

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  private _doAdd(item: DicomItem, allowUpdate: boolean): this {
    const key = item.tag.toUint32();
    if (!allowUpdate && this._items.has(key)) {
      throw new Error(`Tag ${item.tag} already exists in dataset. Use addOrUpdate() to replace.`);
    }
    if (this.validateItems) {
      try { item.validate(); } catch (e) {
        // Re-throw with context
        throw e;
      }
    }
    this._items.set(key, item);
    return this;
  }
}

// ---------------------------------------------------------------------------
// DicomDatasetReaderObserver — builds a DicomDataset from binary read events
// (used by Phase 7 DicomReader)
// ---------------------------------------------------------------------------

export interface IDicomDatasetObserver {
  onBeginSequence(tag: DicomTag, length: number): void;
  onEndSequence(): void;
  onBeginSequenceItem(length: number): void;
  onEndSequenceItem(): void;
  onElement(tag: DicomTag, vr: DicomVR, buffer: import("../io/buffer/IByteBuffer.js").IByteBuffer): void;
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function _extractValue<T>(item: DicomElement, index: number): T {
  if (item instanceof DicomValueElement) {
    return (item as DicomValueElement<number | bigint>).getAt(index) as unknown as T;
  }
  if (item instanceof DicomMultiStringElement) {
    return item.getAt(index) as unknown as T;
  }
  if (item instanceof DicomStringElement) {
    if (index !== 0) throw new RangeError(`Single-value string element has only 1 value (index=${index})`);
    return item.value as unknown as T;
  }
  // Attribute tags
  if (item instanceof DicomAttributeTag) {
    return item.tagValues[index] as unknown as T;
  }
  throw new Error(`Cannot extract typed value from ${item.valueRepresentation} element`);
}

function _extractValues<T>(item: DicomElement): T[] {
  if (item instanceof DicomValueElement) {
    return (item as DicomValueElement<number | bigint>).values as unknown as T[];
  }
  if (item instanceof DicomMultiStringElement) {
    return item.values as unknown as T[];
  }
  if (item instanceof DicomStringElement) {
    return [item.value] as unknown as T[];
  }
  if (item instanceof DicomAttributeTag) {
    return item.tagValues as unknown as T[];
  }
  return [];
}

function _getStringValue(item: DicomElement): string {
  if (item instanceof DicomStringElement) return item.value;
  if (item instanceof DicomValueElement) {
    return (item as DicomValueElement<number | bigint>).values.map(String).join("\\");
  }
  if (item instanceof DicomAttributeTag) {
    return item.tagValues.map((t) => t.toString()).join("\\");
  }
  return "";
}

/**
 * Create a concrete DicomElement from a VR code and raw JavaScript values.
 * Used by `addOrUpdateElement()` to build elements programmatically.
 */
function _createItemFromValues(vr: DicomVR, tag: DicomTag, values: unknown[]): DicomElement {
  switch (vr) {
    case DicomVR.AE: return new DicomApplicationEntity(tag, ...(values as string[]));
    case DicomVR.AS: return new DicomAgeString(tag, ...(values as string[]));
    case DicomVR.AT: return new DicomAttributeTag(tag, ...(values as DicomTag[]));
    case DicomVR.CS: return new DicomCodeString(tag, ...(values as string[]));
    case DicomVR.DA: return new DicomDate(tag, ...(values as (string | Date | DicomDateRange)[]));
    case DicomVR.DS: return new DicomDecimalString(tag, ...(values as (string | number)[]));
    case DicomVR.DT: return new DicomDateTime(tag, ...(values as (string | Date | DicomDateRange)[]));
    case DicomVR.FD: return new DicomFloatingPointDouble(tag, ...(values as number[]));
    case DicomVR.FL: return new DicomFloatingPointSingle(tag, ...(values as number[]));
    case DicomVR.IS: return new DicomIntegerString(tag, ...(values as (string | number)[]));
    case DicomVR.LO: return new DicomLongString(tag, ...(values as string[]));
    case DicomVR.LT: return new DicomLongText(tag, (values[0] as string) ?? "");
    case DicomVR.OB: return new DicomOtherByte(tag, (values[0] as Uint8Array | undefined) ?? new Uint8Array());
    case DicomVR.OD: return new DicomOtherDouble(tag, (values[0] as Float64Array | undefined) ?? new Float64Array());
    case DicomVR.OF: return new DicomOtherFloat(tag, (values[0] as Float32Array | undefined) ?? new Float32Array());
    case DicomVR.OL: return new DicomOtherLong(tag, (values[0] as Uint32Array | undefined) ?? new Uint32Array());
    case DicomVR.OV: return new DicomOtherVeryLong(tag, (values[0] as BigUint64Array | undefined) ?? new BigUint64Array());
    case DicomVR.OW: return new DicomOtherWord(tag, (values[0] as Uint16Array | undefined) ?? new Uint16Array());
    case DicomVR.PN: return new DicomPersonName(tag, ...(values as string[]));
    case DicomVR.SH: return new DicomShortString(tag, ...(values as string[]));
    case DicomVR.SL: return new DicomSignedLong(tag, ...(values as number[]));
    case DicomVR.SS: return new DicomSignedShort(tag, ...(values as number[]));
    case DicomVR.ST: return new DicomShortText(tag, (values[0] as string) ?? "");
    case DicomVR.SV: return new DicomSignedVeryLong(tag, ...(values as bigint[]));
    case DicomVR.TM: return new DicomTime(tag, ...(values as (string | Date | DicomDateRange)[]));
    case DicomVR.UC: return new DicomUnlimitedCharacters(tag, ...(values as string[]));
    case DicomVR.UI: return new DicomUniqueIdentifier(tag, ...(values as (string | DicomUID)[]));
    case DicomVR.UL: return new DicomUnsignedLong(tag, ...(values as number[]));
    case DicomVR.UN: return new DicomUnknown(tag, (values[0] as Uint8Array | undefined) ?? new Uint8Array());
    case DicomVR.UR: return new DicomUniversalResource(tag, (values[0] as string) ?? "");
    case DicomVR.US: return new DicomUnsignedShort(tag, ...(values as number[]));
    case DicomVR.UT: return new DicomUnlimitedText(tag, (values[0] as string) ?? "");
    case DicomVR.UV: return new DicomUnsignedVeryLong(tag, ...(values as bigint[]));
    default:         return new DicomUnknown(tag, new Uint8Array());
  }
}
