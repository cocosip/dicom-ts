/**
 * DICOM element class hierarchy.
 *
 * One concrete class per VR, matching fo-dicom/FO-DICOM.Core/DicomElement.cs.
 *
 * TypeScript design notes:
 * - Abstract classes use a BufSrc discriminated-union so `super()` is always
 *   called at the root level (required when any class in the chain has field
 *   initializers).
 * - Concrete classes expose user-facing constructors (new DicomLongString(tag, ...values))
 *   and a static fromBuffer() factory (used by the binary reader).
 * - protected override ordering follows TypeScript's required modifier order.
 * - BigInt (SV/UV) uses the native bigint primitive.
 */

import { DicomTag } from "../core/DicomTag.js";
import { DicomVR } from "../core/DicomVR.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import * as DicomEncoding from "../core/DicomEncoding.js";
import { DicomValidationException } from "../core/DicomValidation.js";
import { DicomDictionary, UnknownTag } from "../core/DicomDictionary.js";
import type { IByteBuffer } from "../io/buffer/IByteBuffer.js";
import { EmptyBuffer } from "../io/buffer/EmptyBuffer.js";
import { LazyByteBuffer } from "../io/buffer/LazyByteBuffer.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import { DicomItem } from "./DicomItem.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function viewOf(data: Uint8Array): DataView {
  return new DataView(data.buffer, data.byteOffset, data.byteLength);
}

function padToEven(bytes: Uint8Array, padByte: number): Uint8Array {
  if (bytes.byteLength % 2 === 0) return bytes;
  const out = new Uint8Array(bytes.byteLength + 1);
  out.set(bytes);
  out[bytes.byteLength] = padByte;
  return out;
}

// Discriminated-union constructor arg for "from raw buffer"
const _FROM_BUF = Symbol("FROM_BUF");
interface BufSrc {
  readonly _tag: typeof _FROM_BUF;
  readonly buffer: IByteBuffer;
  readonly encodings: readonly string[];
}
function bufSrc(buffer: IByteBuffer, encodings: readonly string[] = []): BufSrc {
  return { _tag: _FROM_BUF, buffer, encodings };
}
function isBufSrc(v: unknown): v is BufSrc {
  return typeof v === "object" && v !== null && (v as BufSrc)._tag === _FROM_BUF;
}

// ---------------------------------------------------------------------------
// DicomElement — abstract base
// ---------------------------------------------------------------------------

export abstract class DicomElement extends DicomItem {
  protected _buffer: IByteBuffer;

  protected constructor(tag: DicomTag, buffer: IByteBuffer) {
    super(tag);
    this._buffer = buffer;
  }

  get buffer(): IByteBuffer { return this._buffer; }
  get length(): number { return this._buffer.size; }
  abstract get count(): number;

  override validate(): void {
    this.validateString();
    this.validateVM();
  }

  override toString(): string {
    const entry = DicomDictionary.default.lookup(this.tag);
    const name = entry !== UnknownTag ? entry.name : "Unknown";
    return `${this.tag} ${this.valueRepresentation} ${name}`;
  }

  protected validateVM(): void {
    if (this.tag.isPrivate || this.count === 0) return;
    const entry = DicomDictionary.default.lookup(this.tag);
    if (entry === UnknownTag) return;
    const vm = entry.valueMultiplicity;
    if (this.count < vm.minimum || this.count > vm.maximum) {
      throw new DicomValidationException(
        this.toString(),
        this.valueRepresentation.toString(),
        `Value count ${this.count} does not match VM ${vm}`
      );
    }
  }

  protected validateString(): void { /* overridden in string elements */ }
}

// ---------------------------------------------------------------------------
// DicomStringElement — single-value string base
// ---------------------------------------------------------------------------

export abstract class DicomStringElement extends DicomElement {
  protected _value: string | null;
  protected _encodings: readonly string[];

  protected constructor(tag: DicomTag, src: string | BufSrc) {
    // super() at root level — compute initial buffer before the call
    const initBuf = isBufSrc(src) ? src.buffer : EmptyBuffer;
    super(tag, initBuf);
    if (isBufSrc(src)) {
      this._value    = null;
      this._encodings = src.encodings;
    } else {
      const v = src as string;
      this._value    = v;
      this._encodings = [];
      if (v.length > 0) {
        this._buffer = new LazyByteBuffer(() => this._encode(v));
      }
    }
  }

  override get count(): number { return 1; }
  get value(): string { return this._stringValue; }

  protected get _stringValue(): string {
    if (this._value === null) {
      const raw = DicomEncoding.decodeBytes(this._buffer.data, this._encodings);
      this._value = raw.trimEnd().replace(
        new RegExp(String.fromCharCode(this.valueRepresentation.paddingValue) + "+$"),
        ""
      );
    }
    return this._value;
  }

  protected _encode(s: string): Uint8Array {
    const enc = this.valueRepresentation.isStringEncoded
      ? DicomEncoding.encodeString(s, this._encodings)
      : new TextEncoder().encode(s);
    return padToEven(enc, this.valueRepresentation.paddingValue);
  }

  protected override validateString(): void {
    this.valueRepresentation.validateString(this._stringValue);
  }
}

// ---------------------------------------------------------------------------
// DicomMultiStringElement — backslash-delimited multi-value string base
// ---------------------------------------------------------------------------

export abstract class DicomMultiStringElement extends DicomStringElement {
  private _values: string[] | null = null;

  protected constructor(tag: DicomTag, src: string[] | BufSrc) {
    const strSrc: string | BufSrc = isBufSrc(src) ? src : (src as string[]).join("\\");
    super(tag, strSrc);
  }

  override get count(): number { return this._getValues().length; }
  get values(): string[] { return this._getValues(); }

  getAt(index = -1): string {
    if (index === -1) return this._stringValue;
    const vs = this._getValues();
    if (index < 0 || index >= vs.length) throw new RangeError(`Index ${index} out of range`);
    return vs[index]!;
  }

  private _getValues(): string[] {
    if (this._values === null) {
      const raw = this._stringValue;
      this._values = raw === "" ? [] : raw.split("\\");
    }
    return this._values;
  }

  protected override validateString(): void {
    const vr = this.valueRepresentation;
    for (const v of this._getValues()) vr.validateString(v);
  }
}

// ---------------------------------------------------------------------------
// DicomDateRange
// ---------------------------------------------------------------------------

export class DicomDateRange {
  minimum: Date | null;
  maximum: Date | null;
  constructor(minimum: Date | null = null, maximum: Date | null = null) {
    this.minimum = minimum;
    this.maximum = maximum;
  }
}

// ---------------------------------------------------------------------------
// DicomDateElement — date/time multi-string base
// ---------------------------------------------------------------------------

export abstract class DicomDateElement extends DicomMultiStringElement {
  protected readonly _dateFormats: readonly string[];

  protected constructor(tag: DicomTag, dateFormats: readonly string[], src: string[] | BufSrc) {
    super(tag, src);
    this._dateFormats = dateFormats;
  }

  protected abstract parseDate(s: string): Date | null;

  get dateValues(): Date[] {
    return this.values.map((v) => this.parseDate(v)).filter((d): d is Date => d !== null);
  }

  get dateValue(): Date | null { return this.dateValues[0] ?? null; }

  getDateRange(): DicomDateRange {
    const raw = this._stringValue;
    const idx = raw.indexOf("-");
    if (idx < 0) {
      const d = this.parseDate(raw);
      return new DicomDateRange(d, d);
    }
    const min = idx > 0 ? this.parseDate(raw.slice(0, idx)) : null;
    const max = idx < raw.length - 1 ? this.parseDate(raw.slice(idx + 1)) : null;
    return new DicomDateRange(min, max);
  }
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function parseDicomDate(s: string): Date | null {
  const clean = s.replace(/[./]/g, "").trim();
  if (clean.length < 4) return null;
  const year  = parseInt(clean.slice(0, 4), 10);
  const month = clean.length >= 6 ? parseInt(clean.slice(4, 6), 10) - 1 : 0;
  const day   = clean.length >= 8 ? parseInt(clean.slice(6, 8), 10) : 1;
  const d = new Date(Date.UTC(year, month, day));
  return isNaN(d.getTime()) ? null : d;
}

function parseDicomTime(s: string): Date | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  const [timePart, fracPart] = trimmed.split(".");
  const clean = (timePart ?? "").replace(/:/g, "");
  if (clean.length < 2) return null;
  const hh = parseInt(clean.slice(0, 2), 10);
  const mm = clean.length >= 4 ? parseInt(clean.slice(2, 4), 10) : 0;
  const sc = clean.length >= 6 ? parseInt(clean.slice(4, 6), 10) : 0;
  if ([hh, mm, sc].some((v) => Number.isNaN(v))) return null;
  let ms = 0;
  if (fracPart && fracPart.length > 0) {
    const digits = fracPart.replace(/\D/g, "");
    if (digits.length > 0) {
      const padded = digits.padEnd(3, "0").slice(0, 3);
      ms = parseInt(padded, 10);
    }
  }
  const d = new Date(Date.UTC(1970, 0, 1, hh, mm, sc, ms));
  return isNaN(d.getTime()) ? null : d;
}

function parseDicomDateTime(s: string): Date | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  const withoutZone = trimmed.replace(/[+-]\d{4}$/, "");
  const datePart = withoutZone.slice(0, 8);
  const d = parseDicomDate(datePart);
  if (!d) return null;
  const timePart = withoutZone.slice(8);
  if (timePart.length > 0) {
    const t = parseDicomTime(timePart);
    if (t) d.setUTCHours(t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getUTCMilliseconds());
  }
  return d;
}

function formatDate(d: Date): string {
  const y   = d.getUTCFullYear();
  const m   = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function formatTime(d: Date): string {
  const h  = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const sc = String(d.getUTCSeconds()).padStart(2, "0");
  const ms = d.getUTCMilliseconds();
  if (ms === 0) return `${h}${mi}${sc}`;
  let frac = String(ms).padStart(3, "0").replace(/0+$/, "");
  if (frac.length === 0) frac = "0";
  return `${h}${mi}${sc}.${frac}`;
}

function formatDateTime(d: Date): string { return `${formatDate(d)}${formatTime(d)}`; }

function toDateStr(v: string | Date | DicomDateRange, fmt: (d: Date) => string): string {
  if (typeof v === "string") return v;
  if (v instanceof DicomDateRange) {
    const min = v.minimum ? fmt(v.minimum) : "";
    const max = v.maximum ? fmt(v.maximum) : "";
    return `${min}-${max}`;
  }
  return fmt(v as Date);
}

// ---------------------------------------------------------------------------
// DicomValueElement<T> — binary packed numeric base
// ---------------------------------------------------------------------------

export abstract class DicomValueElement<T extends number | bigint> extends DicomElement {
  protected constructor(tag: DicomTag, buffer: IByteBuffer) {
    super(tag, buffer);
  }

  protected abstract readItem(view: DataView, byteOffset: number): T;

  override get count(): number {
    const unit = this.valueRepresentation.unitSize;
    return unit > 0 ? Math.floor(this._buffer.size / unit) : 0;
  }

  get value(): T { return this.getAt(0); }

  get values(): T[] {
    const n    = this.count;
    const unit = this.valueRepresentation.unitSize;
    const view = viewOf(this._buffer.data);
    const out: T[] = [];
    for (let i = 0; i < n; i++) out.push(this.readItem(view, i * unit));
    return out;
  }

  getAt(index = 0): T {
    if (index < 0 || index >= this.count) {
      throw new RangeError(`Index ${index} out of range (count=${this.count})`);
    }
    return this.readItem(viewOf(this._buffer.data), index * this.valueRepresentation.unitSize);
  }

  protected static buildBuffer<U extends number | bigint>(
    values: readonly U[],
    unitSize: number,
    writer: (view: DataView, offset: number, v: U) => void
  ): MemoryByteBuffer {
    const bytes = new Uint8Array(values.length * unitSize);
    const view  = viewOf(bytes);
    for (let i = 0; i < values.length; i++) writer(view, i * unitSize, values[i]!);
    return new MemoryByteBuffer(bytes);
  }
}

// ===========================================================================
// Concrete element classes — one per VR
// ===========================================================================

// AE
export class DicomApplicationEntity extends DicomMultiStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.AE; }
  constructor(tag: DicomTag, ...values: string[]) { super(tag, values); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomApplicationEntity {
    return _fromBuf(DicomApplicationEntity, tag, bufSrc(b, enc));
  }
}

// AS
export class DicomAgeString extends DicomMultiStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.AS; }
  constructor(tag: DicomTag, ...values: string[]) { super(tag, values); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomAgeString {
    return _fromBuf(DicomAgeString, tag, bufSrc(b, enc));
  }
}

// AT
export class DicomAttributeTag extends DicomElement {
  private _tags: DicomTag[] | null = null;
  override get valueRepresentation(): DicomVR { return DicomVR.AT; }

  constructor(tag: DicomTag, ...values: DicomTag[]) {
    const bytes = new Uint8Array(values.length * 4);
    const view  = viewOf(bytes);
    for (let i = 0; i < values.length; i++) {
      view.setUint16(i * 4,     values[i]!.group,   true);
      view.setUint16(i * 4 + 2, values[i]!.element, true);
    }
    super(tag, new MemoryByteBuffer(bytes));
    this._tags = values.length > 0 ? values : [];
  }

  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomAttributeTag {
    const e = Object.create(DicomAttributeTag.prototype) as DicomAttributeTag;
    initElement(e as unknown as DicomElement, tag, b);
    e._tags = null;
    return e;
  }

  override get count(): number { return Math.floor(this._buffer.size / 4); }

  get tagValues(): DicomTag[] {
    if (this._tags === null) {
      const view = viewOf(this._buffer.data);
      const n    = this.count;
      this._tags = [];
      for (let i = 0; i < n; i++) {
        this._tags.push(new DicomTag(view.getUint16(i * 4, true), view.getUint16(i * 4 + 2, true)));
      }
    }
    return this._tags;
  }
}

// CS
export class DicomCodeString extends DicomMultiStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.CS; }
  constructor(tag: DicomTag, ...values: string[]) { super(tag, values); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomCodeString {
    return _fromBuf(DicomCodeString, tag, bufSrc(b, enc));
  }
}

// DA
export class DicomDate extends DicomDateElement {
  override get valueRepresentation(): DicomVR { return DicomVR.DA; }
  constructor(tag: DicomTag, ...values: (string | Date | DicomDateRange)[]) {
    super(tag, DA_FMTS, values.map((v) => toDateStr(v, formatDate)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomDate {
    return _fromBuf(DicomDate, tag, DA_FMTS, bufSrc(b));
  }
  protected override parseDate(s: string): Date | null { return parseDicomDate(s); }
}
const DA_FMTS = ["yyyyMMdd"];

// DS
export class DicomDecimalString extends DicomMultiStringElement {
  private _nums: number[] | null = null;
  override get valueRepresentation(): DicomVR { return DicomVR.DS; }
  constructor(tag: DicomTag, ...values: (string | number)[]) {
    super(tag, values.map((v) => typeof v === "number" ? fmtDecimal(v) : v as string));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomDecimalString {
    const e = _fromBuf(DicomDecimalString, tag, bufSrc(b)) as DicomDecimalString;
    (e as unknown as { _nums: number[] | null })._nums = null;
    return e;
  }
  get numericValue(): number   { return this._getNums()[0] ?? 0; }
  get numericValues(): number[] { return this._getNums(); }
  private _getNums(): number[] {
    if (this._nums === null) this._nums = this.values.map((s) => parseFloat(s.replace(",", ".")));
    return this._nums;
  }
}
function fmtDecimal(v: number): string { const s = v.toString(); return s.length <= 16 ? s : v.toPrecision(10); }

// DT
export class DicomDateTime extends DicomDateElement {
  override get valueRepresentation(): DicomVR { return DicomVR.DT; }
  constructor(tag: DicomTag, ...values: (string | Date | DicomDateRange)[]) {
    super(tag, DT_FMTS, values.map((v) => toDateStr(v, formatDateTime)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomDateTime {
    return _fromBuf(DicomDateTime, tag, DT_FMTS, bufSrc(b));
  }
  protected override parseDate(s: string): Date | null { return parseDicomDateTime(s); }
}
const DT_FMTS = ["yyyyMMddHHmmss"];

// FD
export class DicomFloatingPointDouble extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.FD; }
  constructor(tag: DicomTag, ...values: number[]) {
    super(tag, DicomValueElement.buildBuffer(values, 8, (v, o, n) => v.setFloat64(o, n, true)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomFloatingPointDouble {
    return _fromBufVal(DicomFloatingPointDouble, tag, b);
  }
  protected override readItem(view: DataView, o: number): number { return view.getFloat64(o, true); }
}

// FL
export class DicomFloatingPointSingle extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.FL; }
  constructor(tag: DicomTag, ...values: number[]) {
    super(tag, DicomValueElement.buildBuffer(values, 4, (v, o, n) => v.setFloat32(o, n, true)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomFloatingPointSingle {
    return _fromBufVal(DicomFloatingPointSingle, tag, b);
  }
  protected override readItem(view: DataView, o: number): number { return view.getFloat32(o, true); }
}

// IS
export class DicomIntegerString extends DicomMultiStringElement {
  private _ints: number[] | null = null;
  override get valueRepresentation(): DicomVR { return DicomVR.IS; }
  constructor(tag: DicomTag, ...values: (string | number | bigint)[]) {
    super(tag, values.map((v) => String(v)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomIntegerString {
    const e = _fromBuf(DicomIntegerString, tag, bufSrc(b)) as DicomIntegerString;
    (e as unknown as { _ints: number[] | null })._ints = null;
    return e;
  }
  get intValue(): number   { return this._getInts()[0] ?? 0; }
  get intValues(): number[] { return this._getInts(); }
  private _getInts(): number[] {
    if (this._ints === null) this._ints = this.values.map((s) => parseInt(s.trim(), 10));
    return this._ints;
  }
}

// LO
export class DicomLongString extends DicomMultiStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.LO; }
  constructor(tag: DicomTag, ...values: string[]) { super(tag, values); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomLongString {
    return _fromBuf(DicomLongString, tag, bufSrc(b, enc));
  }
}

// LT
export class DicomLongText extends DicomStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.LT; }
  constructor(tag: DicomTag, value: string) { super(tag, value); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomLongText {
    return _fromBuf(DicomLongText, tag, bufSrc(b, enc));
  }
}

// OB
export class DicomOtherByte extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.OB; }
  constructor(tag: DicomTag, data: Uint8Array | IByteBuffer) {
    super(tag, data instanceof Uint8Array ? new MemoryByteBuffer(data) : data);
  }
  protected override readItem(view: DataView, o: number): number { return view.getUint8(o); }
  protected override validateVM(): void { /* no VM check */ }
}

// OD
export class DicomOtherDouble extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.OD; }
  constructor(tag: DicomTag, data: Float64Array | IByteBuffer) {
    super(tag, _typedOrBuf(data));
  }
  protected override readItem(view: DataView, o: number): number { return view.getFloat64(o, true); }
  protected override validateVM(): void { /* no VM check */ }
}

// OF
export class DicomOtherFloat extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.OF; }
  constructor(tag: DicomTag, data: Float32Array | IByteBuffer) {
    super(tag, _typedOrBuf(data));
  }
  protected override readItem(view: DataView, o: number): number { return view.getFloat32(o, true); }
  protected override validateVM(): void { /* no VM check */ }
}

// OL
export class DicomOtherLong extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.OL; }
  constructor(tag: DicomTag, data: Uint32Array | IByteBuffer) {
    super(tag, _typedOrBuf(data));
  }
  protected override readItem(view: DataView, o: number): number { return view.getUint32(o, true); }
  protected override validateVM(): void { /* no VM check */ }
}

// OV
export class DicomOtherVeryLong extends DicomValueElement<bigint> {
  override get valueRepresentation(): DicomVR { return DicomVR.OV; }
  constructor(tag: DicomTag, data: BigUint64Array | IByteBuffer) {
    super(tag, _typedOrBuf(data));
  }
  protected override readItem(view: DataView, o: number): bigint { return view.getBigUint64(o, true); }
  protected override validateVM(): void { /* no VM check */ }
}

// OW
export class DicomOtherWord extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.OW; }
  constructor(tag: DicomTag, data: Uint16Array | IByteBuffer) {
    super(tag, _typedOrBuf(data));
  }
  protected override readItem(view: DataView, o: number): number { return view.getUint16(o, true); }
  protected override validateVM(): void { /* no VM check */ }
}

// PN
export class DicomPersonName extends DicomMultiStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.PN; }
  constructor(tag: DicomTag, ...values: string[]) { super(tag, values); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomPersonName {
    return _fromBuf(DicomPersonName, tag, bufSrc(b, enc));
  }
  get last():   string { return this._comp(0); }
  get first():  string { return this._comp(1); }
  get middle(): string { return this._comp(2); }
  get prefix(): string { return this._comp(3); }
  get suffix(): string { return this._comp(4); }
  private _comp(idx: number): string {
    const group = (this._stringValue.split("\\")[0] ?? "").split("=")[0] ?? "";
    return group.split("^")[idx] ?? "";
  }
  static buildName(last: string, first = "", middle = "", prefix = "", suffix = ""): string {
    const parts = [last, first, middle, prefix, suffix];
    while (parts.length > 1 && parts[parts.length - 1] === "") parts.pop();
    return parts.join("^");
  }

  static haveSameContent(a: DicomPersonName | null, b: DicomPersonName | null): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return (
      a.last.toLowerCase() === b.last.toLowerCase()
      && a.first.toLowerCase() === b.first.toLowerCase()
      && a.middle.toLowerCase() === b.middle.toLowerCase()
      && a.prefix.toLowerCase() === b.prefix.toLowerCase()
      && a.suffix.toLowerCase() === b.suffix.toLowerCase()
    );
  }
}

// SH
export class DicomShortString extends DicomMultiStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.SH; }
  constructor(tag: DicomTag, ...values: string[]) { super(tag, values); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomShortString {
    return _fromBuf(DicomShortString, tag, bufSrc(b, enc));
  }
}

// SL
export class DicomSignedLong extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.SL; }
  constructor(tag: DicomTag, ...values: number[]) {
    super(tag, DicomValueElement.buildBuffer(values, 4, (v, o, n) => v.setInt32(o, n, true)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomSignedLong { return _fromBufVal(DicomSignedLong, tag, b); }
  protected override readItem(view: DataView, o: number): number { return view.getInt32(o, true); }
}

// SS
export class DicomSignedShort extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.SS; }
  constructor(tag: DicomTag, ...values: number[]) {
    super(tag, DicomValueElement.buildBuffer(values, 2, (v, o, n) => v.setInt16(o, n, true)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomSignedShort { return _fromBufVal(DicomSignedShort, tag, b); }
  protected override readItem(view: DataView, o: number): number { return view.getInt16(o, true); }
}

// ST
export class DicomShortText extends DicomStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.ST; }
  constructor(tag: DicomTag, value: string) { super(tag, value); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomShortText {
    return _fromBuf(DicomShortText, tag, bufSrc(b, enc));
  }
}

// SV
export class DicomSignedVeryLong extends DicomValueElement<bigint> {
  override get valueRepresentation(): DicomVR { return DicomVR.SV; }
  constructor(tag: DicomTag, ...values: bigint[]) {
    super(tag, DicomValueElement.buildBuffer(values, 8, (v, o, n) => v.setBigInt64(o, n, true)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomSignedVeryLong { return _fromBufVal(DicomSignedVeryLong, tag, b); }
  protected override readItem(view: DataView, o: number): bigint { return view.getBigInt64(o, true); }
}

// TM
export class DicomTime extends DicomDateElement {
  override get valueRepresentation(): DicomVR { return DicomVR.TM; }
  constructor(tag: DicomTag, ...values: (string | Date | DicomDateRange)[]) {
    super(tag, TM_FMTS, values.map((v) => toDateStr(v, formatTime)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomTime {
    return _fromBuf(DicomTime, tag, TM_FMTS, bufSrc(b));
  }
  protected override parseDate(s: string): Date | null { return parseDicomTime(s); }
}
const TM_FMTS = ["HHmmss"];

// UC
export class DicomUnlimitedCharacters extends DicomMultiStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.UC; }
  constructor(tag: DicomTag, ...values: string[]) { super(tag, values); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomUnlimitedCharacters {
    return _fromBuf(DicomUnlimitedCharacters, tag, bufSrc(b, enc));
  }
  protected override validateVM(): void { /* UC — unlimited */ }
}

// UI
export class DicomUniqueIdentifier extends DicomMultiStringElement {
  private _uids: DicomUID[] | null = null;
  override get valueRepresentation(): DicomVR { return DicomVR.UI; }
  constructor(tag: DicomTag, ...values: (string | DicomUID | DicomTransferSyntax)[]) {
    super(tag, values.map((v) =>
      v instanceof DicomUID ? v.uid :
      v instanceof DicomTransferSyntax ? v.uid.uid :
      v as string
    ));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomUniqueIdentifier {
    const e = _fromBuf(DicomUniqueIdentifier, tag, bufSrc(b)) as DicomUniqueIdentifier;
    (e as unknown as { _uids: DicomUID[] | null })._uids = null;
    return e;
  }
  get uidValues(): DicomUID[] {
    if (this._uids === null) {
      this._uids = this.values.map((s) => DicomUID.parse(s.replace(/\x00/g, "").trim()));
    }
    return this._uids;
  }
  get uidValue(): DicomUID { return this.uidValues[0] ?? DicomUID.parse(""); }
  get transferSyntax(): DicomTransferSyntax | null {
    return DicomTransferSyntax.lookup(this.uidValue.uid);
  }
}

// UL
export class DicomUnsignedLong extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.UL; }
  constructor(tag: DicomTag, ...values: number[]) {
    super(tag, DicomValueElement.buildBuffer(values, 4, (v, o, n) => v.setUint32(o, n >>> 0, true)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomUnsignedLong { return _fromBufVal(DicomUnsignedLong, tag, b); }
  protected override readItem(view: DataView, o: number): number { return view.getUint32(o, true); }
}

// UN (extends OB)
export class DicomUnknown extends DicomOtherByte {
  override get valueRepresentation(): DicomVR { return DicomVR.UN; }
  protected override validateVM(): void { /* no VM check */ }
}

// UR
export class DicomUniversalResource extends DicomStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.UR; }
  constructor(tag: DicomTag, value: string) { super(tag, value); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomUniversalResource {
    return _fromBuf(DicomUniversalResource, tag, bufSrc(b, enc));
  }
}

// US
export class DicomUnsignedShort extends DicomValueElement<number> {
  override get valueRepresentation(): DicomVR { return DicomVR.US; }
  constructor(tag: DicomTag, ...values: number[]) {
    super(tag, DicomValueElement.buildBuffer(values, 2, (v, o, n) => v.setUint16(o, n, true)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomUnsignedShort { return _fromBufVal(DicomUnsignedShort, tag, b); }
  protected override readItem(view: DataView, o: number): number { return view.getUint16(o, true); }
}

// UT
export class DicomUnlimitedText extends DicomStringElement {
  override get valueRepresentation(): DicomVR { return DicomVR.UT; }
  constructor(tag: DicomTag, value: string) { super(tag, value); }
  static fromBuffer(tag: DicomTag, b: IByteBuffer, enc?: readonly string[]): DicomUnlimitedText {
    return _fromBuf(DicomUnlimitedText, tag, bufSrc(b, enc));
  }
}

// UV
export class DicomUnsignedVeryLong extends DicomValueElement<bigint> {
  override get valueRepresentation(): DicomVR { return DicomVR.UV; }
  constructor(tag: DicomTag, ...values: bigint[]) {
    super(tag, DicomValueElement.buildBuffer(values, 8, (v, o, n) => v.setBigUint64(o, n, true)));
  }
  static fromBuffer(tag: DicomTag, b: IByteBuffer): DicomUnsignedVeryLong { return _fromBufVal(DicomUnsignedVeryLong, tag, b); }
  protected override readItem(view: DataView, o: number): bigint { return view.getBigUint64(o, true); }
}

// ---------------------------------------------------------------------------
// Internal factory helpers (avoid repeated Object.create boilerplate)
// ---------------------------------------------------------------------------

type MultiStrCtor = new (tag: DicomTag, ...a: string[]) => DicomMultiStringElement;
type StrCtor = new (tag: DicomTag, v: string) => DicomStringElement;
type DateCtor = new (tag: DicomTag, ...a: (string | Date | DicomDateRange)[]) => DicomDateElement;
type ValCtor<C extends DicomValueElement<any>> = new (tag: DicomTag, ...v: any[]) => C;

function _fromBuf<T extends DicomMultiStringElement>(ctor: MultiStrCtor, tag: DicomTag, src: BufSrc): T;
function _fromBuf<T extends DicomStringElement>(ctor: StrCtor, tag: DicomTag, src: BufSrc): T;
function _fromBuf<T extends DicomDateElement>(ctor: DateCtor, tag: DicomTag, fmts: readonly string[], src: BufSrc): T;
function _fromBuf(ctor: Function, tag: DicomTag, fmtsOrSrc: readonly string[] | BufSrc, maybeSrc?: BufSrc): unknown {
  const e = Object.create(ctor.prototype) as DicomElement;

  if (maybeSrc !== undefined) {
    // DicomDateElement path: (ctor, tag, fmts, src)
    const src = maybeSrc;
    initDateElement(e as DicomDateElement, tag, fmtsOrSrc as readonly string[], src);
  } else if (isBufSrc(fmtsOrSrc)) {
    // DicomMultiStringElement / DicomStringElement path
    const src = fmtsOrSrc;
    if (e instanceof DicomMultiStringElement) {
      initMultiStringElement(e as DicomMultiStringElement, tag, src);
    } else {
      initStringElement(e as DicomStringElement, tag, src);
    }
  }
  return e;
}

function _fromBufVal<C extends DicomValueElement<any>>(ctor: ValCtor<C>, tag: DicomTag, b: IByteBuffer): C {
  const e = Object.create(ctor.prototype) as C;
  initElement(e as unknown as DicomElement, tag, b);
  return e;
}

function _typedOrBuf(data: ArrayBufferView | IByteBuffer): IByteBuffer {
  if ("size" in data && "isMemory" in data) return data as IByteBuffer;
  const v = data as ArrayBufferView;
  return new MemoryByteBuffer(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
}

function initItem(target: DicomItem, tag: DicomTag): void {
  (target as { tag: DicomTag }).tag = tag;
}

function initElement(target: DicomElement, tag: DicomTag, buffer: IByteBuffer): void {
  initItem(target, tag);
  (target as unknown as { _buffer: IByteBuffer })._buffer = buffer;
}

function initStringElement(target: DicomStringElement, tag: DicomTag, src: BufSrc): void {
  initElement(target, tag, src.buffer);
  (target as unknown as { _value: string | null })._value = null;
  (target as unknown as { _encodings: readonly string[] })._encodings = src.encodings;
}

function initMultiStringElement(target: DicomMultiStringElement, tag: DicomTag, src: BufSrc): void {
  initStringElement(target, tag, src);
  (target as unknown as { _values: string[] | null })._values = null;
}

function initDateElement(target: DicomDateElement, tag: DicomTag, fmts: readonly string[], src: BufSrc): void {
  initMultiStringElement(target, tag, src);
  (target as unknown as { _dateFormats: readonly string[] })._dateFormats = fmts;
}

// ---------------------------------------------------------------------------
// createElement factory
// ---------------------------------------------------------------------------

export function createElement(
  vr: DicomVR,
  tag: DicomTag,
  buffer: IByteBuffer,
  encodings: readonly string[] = []
): DicomElement {
  switch (vr) {
    case DicomVR.AE: return DicomApplicationEntity.fromBuffer(tag, buffer, encodings);
    case DicomVR.AS: return DicomAgeString.fromBuffer(tag, buffer, encodings);
    case DicomVR.AT: return DicomAttributeTag.fromBuffer(tag, buffer);
    case DicomVR.CS: return DicomCodeString.fromBuffer(tag, buffer, encodings);
    case DicomVR.DA: return DicomDate.fromBuffer(tag, buffer);
    case DicomVR.DS: return DicomDecimalString.fromBuffer(tag, buffer);
    case DicomVR.DT: return DicomDateTime.fromBuffer(tag, buffer);
    case DicomVR.FD: return DicomFloatingPointDouble.fromBuffer(tag, buffer);
    case DicomVR.FL: return DicomFloatingPointSingle.fromBuffer(tag, buffer);
    case DicomVR.IS: return DicomIntegerString.fromBuffer(tag, buffer);
    case DicomVR.LO: return DicomLongString.fromBuffer(tag, buffer, encodings);
    case DicomVR.LT: return DicomLongText.fromBuffer(tag, buffer, encodings);
    case DicomVR.OB: return new DicomOtherByte(tag, buffer);
    case DicomVR.OD: return new DicomOtherDouble(tag, buffer);
    case DicomVR.OF: return new DicomOtherFloat(tag, buffer);
    case DicomVR.OL: return new DicomOtherLong(tag, buffer);
    case DicomVR.OV: return new DicomOtherVeryLong(tag, buffer);
    case DicomVR.OW: return new DicomOtherWord(tag, buffer);
    case DicomVR.PN: return DicomPersonName.fromBuffer(tag, buffer, encodings);
    case DicomVR.SH: return DicomShortString.fromBuffer(tag, buffer, encodings);
    case DicomVR.SL: return DicomSignedLong.fromBuffer(tag, buffer);
    case DicomVR.SS: return DicomSignedShort.fromBuffer(tag, buffer);
    case DicomVR.ST: return DicomShortText.fromBuffer(tag, buffer, encodings);
    case DicomVR.SV: return DicomSignedVeryLong.fromBuffer(tag, buffer);
    case DicomVR.TM: return DicomTime.fromBuffer(tag, buffer);
    case DicomVR.UC: return DicomUnlimitedCharacters.fromBuffer(tag, buffer, encodings);
    case DicomVR.UI: return DicomUniqueIdentifier.fromBuffer(tag, buffer);
    case DicomVR.UL: return DicomUnsignedLong.fromBuffer(tag, buffer);
    case DicomVR.UN: return new DicomUnknown(tag, buffer);
    case DicomVR.UR: return DicomUniversalResource.fromBuffer(tag, buffer, encodings);
    case DicomVR.US: return DicomUnsignedShort.fromBuffer(tag, buffer);
    case DicomVR.UT: return DicomUnlimitedText.fromBuffer(tag, buffer, encodings);
    case DicomVR.UV: return DicomUnsignedVeryLong.fromBuffer(tag, buffer);
    default:         return new DicomUnknown(tag, buffer);
  }
}
