/**
 * DICOM JSON converter (PS3.18 Annex F).
 */
import { Buffer } from "node:buffer";
import { DicomTag } from "../core/DicomTag.js";
import { DicomVR } from "../core/DicomVR.js";
import { DicomDictionary, UnknownTag } from "../core/DicomDictionary.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { DicomFragmentSequence } from "../dataset/DicomFragmentSequence.js";
import {
  DicomElement,
  DicomAttributeTag,
  DicomMultiStringElement,
  DicomStringElement,
  DicomValueElement,
  createElement,
} from "../dataset/DicomElement.js";
import { BulkDataUriByteBuffer } from "../io/buffer/BulkDataUriByteBuffer.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";

export interface DicomJsonConverterOptions {
  /** Write JSON keys as DICOM keywords instead of 8-hex tag strings. */
  writeTagsAsKeywords?: boolean;
  /** Validate elements as they are added to datasets. */
  autoValidate?: boolean;
}

export type DicomJsonElement = {
  vr: string;
  Value?: unknown[];
  InlineBinary?: string;
  BulkDataURI?: string;
  [key: string]: unknown;
};

export type DicomJsonObject = Record<string, DicomJsonElement>;

const INLINE_BINARY_VRS = new Set([
  "OB", "OW", "OF", "OD", "OL", "OV", "UN",
]);

export class DicomJsonConverter {
  readonly writeTagsAsKeywords: boolean;
  readonly autoValidate: boolean;

  constructor(options: DicomJsonConverterOptions = {}) {
    this.writeTagsAsKeywords = options.writeTagsAsKeywords ?? false;
    this.autoValidate = options.autoValidate ?? true;
  }

  toJsonObject(dataset: DicomDataset): DicomJsonObject {
    return datasetToObject(dataset, this.writeTagsAsKeywords);
  }

  toJson(dataset: DicomDataset, formatIndented = false): string {
    return JSON.stringify(
      this.toJsonObject(dataset),
      null,
      formatIndented ? 2 : undefined
    );
  }

  fromJsonObject(obj: DicomJsonObject): DicomDataset {
    return objectToDataset(obj, { autoValidate: this.autoValidate });
  }

  fromJson(json: string): DicomDataset {
    const parsed = JSON.parse(json) as unknown;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("JSON root must be a DICOM dataset object");
    }
    return this.fromJsonObject(parsed as DicomJsonObject);
  }
}

export function datasetToObject(
  dataset: DicomDataset,
  writeTagsAsKeywords = false
): DicomJsonObject {
  const out: DicomJsonObject = {};
  for (const item of dataset) {
    if (item.tag.element === 0x0000) continue;
    const key = tagKey(item.tag, writeTagsAsKeywords);
    out[key] = itemToJson(item, writeTagsAsKeywords);
  }
  return out;
}

export function objectToDataset(
  obj: DicomJsonObject,
  options: { autoValidate?: boolean } = {}
): DicomDataset {
  const dataset = new DicomDataset();
  dataset.validateItems = options.autoValidate ?? true;

  const entries = Object.entries(obj).map(([key, value]) => ({
    key,
    value,
    tag: parseTagKey(key),
  }));

  entries.sort((a, b) => a.tag.toUint32() - b.tag.toUint32());

  for (const entry of entries) {
    addJsonElement(dataset, entry.tag, entry.value);
  }

  return dataset;
}

function tagKey(tag: DicomTag, writeTagsAsKeywords: boolean): string {
  if (!writeTagsAsKeywords) return tag.toString("J");
  const entry = DicomDictionary.default.lookup(tag);
  if (entry !== UnknownTag && entry.keyword) return entry.keyword;
  return tag.toString("J");
}

function itemToJson(item: import("../dataset/DicomItem.js").DicomItem, writeTagsAsKeywords: boolean): DicomJsonElement {
  if (item instanceof DicomFragmentSequence) {
    throw new Error("Serializing fragmented data is not supported.");
  }

  if (item instanceof DicomSequence) {
    const seqItems = item.items.map((ds) => datasetToObject(ds, writeTagsAsKeywords));
    return seqItems.length > 0
      ? { vr: "SQ", Value: seqItems }
      : { vr: "SQ" };
  }

  if (!(item instanceof DicomElement)) {
    return { vr: item.valueRepresentation.code };
  }

  const vrCode = item.valueRepresentation.code === "NONE"
    ? "UN"
    : item.valueRepresentation.code;

  if (INLINE_BINARY_VRS.has(vrCode)) {
    const buffer = item.buffer;
    if (buffer instanceof BulkDataUriByteBuffer) {
      return { vr: vrCode, BulkDataURI: buffer.bulkDataUri };
    }
    const bytes = buffer.data;
    return { vr: vrCode, InlineBinary: Buffer.from(bytes).toString("base64") };
  }

  if (vrCode === "PN") {
    const values = (item as DicomMultiStringElement).values;
    const jsonValues = values.map((v) => pnToJson(v));
    return jsonValues.length > 0
      ? { vr: vrCode, Value: jsonValues }
      : { vr: vrCode };
  }

  const values = extractValues(item);
  return values.length > 0
    ? { vr: vrCode, Value: values }
    : { vr: vrCode };
}

function extractValues(item: DicomElement): unknown[] {
  if (item instanceof DicomAttributeTag) {
    return item.tagValues.map((t) => t.toString("J"));
  }
  if (item instanceof DicomMultiStringElement) {
    return item.values.map((v) => (v === "" ? null : v));
  }
  if (item instanceof DicomStringElement) {
    const v = item.value;
    return [v === "" ? null : v];
  }
  if (item instanceof DicomValueElement) {
    return item.values.map((v) => (typeof v === "bigint" ? v.toString() : v));
  }
  return [];
}

function pnToJson(value: string): Record<string, string> | null {
  if (value.length === 0) return null;
  const parts = value.split("=");
  const out: Record<string, string> = {};
  if (parts[0]) out.Alphabetic = parts[0];
  if (parts[1]) out.Ideographic = parts[1];
  if (parts[2]) out.Phonetic = parts[2];
  return out;
}

function addJsonElement(dataset: DicomDataset, tag: DicomTag, element: unknown): void {
  if (element === null || typeof element !== "object") return;
  const obj = element as Record<string, unknown>;
  const vrCode = typeof obj.vr === "string" ? obj.vr : undefined;
  const vr = vrCode ? DicomVR.tryParse(vrCode) : null;
  const resolvedVr = vr ?? DicomDictionary.default.lookup(tag).vr ?? DicomVR.UN;

  const bulkUri = obj.BulkDataURI ?? obj.BulkDataUri ?? obj.BulkDataUrl;
  if (typeof bulkUri === "string") {
    const buffer = new BulkDataUriByteBuffer(bulkUri);
    const item = createElement(resolvedVr, tag, buffer, dataset.fallbackEncodings);
    dataset.addOrUpdate(item);
    return;
  }

  if (obj.InlineBinary !== undefined) {
    const bytes = Buffer.from(String(obj.InlineBinary), "base64");
    const buffer = new MemoryByteBuffer(bytes);
    const item = createElement(resolvedVr, tag, buffer, dataset.fallbackEncodings);
    dataset.addOrUpdate(item);
    return;
  }

  if (resolvedVr === DicomVR.SQ) {
    const value = obj.Value;
    const items = Array.isArray(value)
      ? value
          .filter((v) => v !== null && typeof v === "object" && !Array.isArray(v))
          .map((v) => objectToDataset(v as DicomJsonObject, { autoValidate: dataset.validateItems }))
      : [];
    dataset.addOrUpdate(new DicomSequence(tag, ...items));
    return;
  }

  const values = parseValues(resolvedVr, obj.Value);
  dataset.addOrUpdateElement(resolvedVr, tag, ...values);
}

function parseValues(vr: DicomVR, valueField: unknown): unknown[] {
  const values = normalizeValueArray(valueField);
  if (values.length === 0) return [];

  switch (vr.code) {
    case "PN":
      return values.map(parsePnValue);
    case "AT":
      return values.map(parseTagValue).filter((v): v is DicomTag => v !== null);
    case "SV":
    case "UV":
      return values.map(parseBigIntValue);
    default:
      if (vr.isString) {
        return values.map((v) => (v === null || v === undefined) ? "" : String(v));
      }
      return values
        .map(parseNumberValue)
        .filter((v): v is number => v !== undefined);
  }
}

function normalizeValueArray(valueField: unknown): unknown[] {
  if (valueField === null || valueField === undefined) return [];
  return Array.isArray(valueField) ? valueField : [valueField];
}

function parseNumberValue(v: unknown): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return n;
}

function parseBigIntValue(v: unknown): bigint {
  if (typeof v === "bigint") return v;
  if (typeof v === "number") return BigInt(Math.trunc(v));
  if (typeof v === "string") return BigInt(v.trim());
  throw new Error(`Invalid bigint value: ${String(v)}`);
}

function parsePnValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v !== "object") return String(v);

  const obj = v as Record<string, unknown>;
  const alpha = stringField(obj, "Alphabetic");
  const ideo = stringField(obj, "Ideographic");
  const phon = stringField(obj, "Phonetic");
  const groups = [alpha, ideo, phon];
  while (groups.length > 0 && groups[groups.length - 1] === "") groups.pop();
  return groups.join("=");
}

function stringField(obj: Record<string, unknown>, key: string): string {
  const direct = obj[key];
  if (typeof direct === "string") return direct;
  const lower = obj[key.toLowerCase()];
  if (typeof lower === "string") return lower;
  return "";
}

function parseTagValue(v: unknown): DicomTag | null {
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[() ,]/g, "");
  if (!/^[0-9a-fA-F]{8}$/.test(cleaned)) return null;
  const group = parseInt(cleaned.slice(0, 4), 16);
  const element = parseInt(cleaned.slice(4), 16);
  return new DicomTag(group, element);
}

function parseTagKey(key: string): DicomTag {
  const cleaned = key.replace(/[() ,]/g, "");
  if (/^[0-9a-fA-F]{8}$/.test(cleaned)) {
    const group = parseInt(cleaned.slice(0, 4), 16);
    const element = parseInt(cleaned.slice(4), 16);
    return new DicomTag(group, element);
  }

  const tag = DicomDictionary.default.lookupKeyword(key);
  if (tag) return tag;

  throw new Error(`Invalid DICOM tag key: ${key}`);
}
