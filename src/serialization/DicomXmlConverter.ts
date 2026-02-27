/**
 * DICOM XML converter (PS3.19 Native DICOM Model).
 */
import { Buffer } from "node:buffer";
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
} from "../dataset/DicomElement.js";
import { BulkDataUriByteBuffer } from "../io/buffer/BulkDataUriByteBuffer.js";

export interface DicomXmlConverterOptions {
  /** Include DICOM keyword attribute when available. */
  includeKeyword?: boolean;
  /** Include private creator attribute when present. */
  includePrivateCreator?: boolean;
  /** Pretty-print output with indentation. */
  formatIndented?: boolean;
}

const BINARY_VRS = new Set([
  "OB", "OW", "OF", "OD", "OL", "OV", "UN",
]);

export class DicomXmlConverter {
  private readonly includeKeyword: boolean;
  private readonly includePrivateCreator: boolean;
  private readonly formatIndented: boolean;

  constructor(options: DicomXmlConverterOptions = {}) {
    this.includeKeyword = options.includeKeyword ?? true;
    this.includePrivateCreator = options.includePrivateCreator ?? true;
    this.formatIndented = options.formatIndented ?? false;
  }

  toXml(dataset: DicomDataset): string {
    const writer = new XmlWriter(this.formatIndented);
    writer.line('<?xml version="1.0" encoding="utf-8"?>');
    writer.open("NativeDicomModel");
    writeDataset(writer, dataset, {
      includeKeyword: this.includeKeyword,
      includePrivateCreator: this.includePrivateCreator,
    });
    writer.close("NativeDicomModel");
    return writer.toString();
  }
}

export function convertDicomToXml(
  dataset: DicomDataset,
  options: DicomXmlConverterOptions = {}
): string {
  return new DicomXmlConverter(options).toXml(dataset);
}

type WriteOptions = {
  includeKeyword: boolean;
  includePrivateCreator: boolean;
};

function writeDataset(writer: XmlWriter, dataset: DicomDataset, options: WriteOptions): void {
  for (const item of dataset) {
    if (item.tag.element === 0x0000) continue;
    if (item instanceof DicomFragmentSequence) {
      writeFragmentSequence(writer, item, options);
      continue;
    }
    if (item instanceof DicomSequence) {
      writeSequence(writer, item, options);
      continue;
    }
    if (item instanceof DicomElement) {
      writeElement(writer, item, options);
    }
  }
}

function writeSequence(writer: XmlWriter, seq: DicomSequence, options: WriteOptions): void {
  writer.open(dicomAttributeTag(seq, options));
  for (let i = 0; i < seq.items.length; i++) {
    writer.open(`Item number="${i + 1}"`);
    writeDataset(writer, seq.items[i]!, options);
    writer.close("Item");
  }
  writer.close("DicomAttribute");
}

function writeFragmentSequence(writer: XmlWriter, seq: DicomFragmentSequence, options: WriteOptions): void {
  writer.open(dicomAttributeTag(seq, options));
  for (let i = 0; i < seq.fragments.length; i++) {
    writer.open(`Fragment number="${i + 1}"`);
    const fragment = seq.fragments[i]!;
    if (fragment instanceof BulkDataUriByteBuffer) {
      writer.line(`<BulkDataURI>${escapeXml(fragment.bulkDataUri)}</BulkDataURI>`);
    } else if (fragment.data.byteLength > 0) {
      writer.line(`<InlineBinary>${Buffer.from(fragment.data).toString("base64")}</InlineBinary>`);
    }
    writer.close("Fragment");
  }
  writer.close("DicomAttribute");
}

function writeElement(writer: XmlWriter, item: DicomElement, options: WriteOptions): void {
  writer.open(dicomAttributeTag(item, options));

  const vrCode = item.valueRepresentation.code === "NONE"
    ? "UN"
    : item.valueRepresentation.code;

  if (BINARY_VRS.has(vrCode)) {
    const buffer = item.buffer;
    if (buffer instanceof BulkDataUriByteBuffer) {
      writer.line(`<BulkDataURI>${escapeXml(buffer.bulkDataUri)}</BulkDataURI>`);
    } else {
      writer.line(`<InlineBinary>${Buffer.from(buffer.data).toString("base64")}</InlineBinary>`);
    }
    writer.close("DicomAttribute");
    return;
  }

  if (vrCode === "PN") {
    const values = (item as DicomMultiStringElement).values;
    for (let i = 0; i < values.length; i++) {
      writePersonName(writer, values[i] ?? "", i + 1);
    }
    writer.close("DicomAttribute");
    return;
  }

  const values = elementValues(item);
  for (let i = 0; i < values.length; i++) {
    writer.line(`<Value number="${i + 1}">${escapeXml(values[i]!)}</Value>`);
  }
  writer.close("DicomAttribute");
}

function writePersonName(writer: XmlWriter, value: string, number: number): void {
  writer.open(`PersonName number="${number}"`);
  writer.open("Alphabetic");

  const [family, given, middle, prefix, suffix] = parseAlphabeticComponents(value);
  if (family) writer.line(`<FamilyName>${escapeXml(family)}</FamilyName>`);
  if (given) writer.line(`<GivenName>${escapeXml(given)}</GivenName>`);
  if (middle) writer.line(`<MiddleName>${escapeXml(middle)}</MiddleName>`);
  if (prefix) writer.line(`<NamePrefix>${escapeXml(prefix)}</NamePrefix>`);
  if (suffix) writer.line(`<NameSuffix>${escapeXml(suffix)}</NameSuffix>`);

  writer.close("Alphabetic");
  writer.close("PersonName");
}

function elementValues(item: DicomElement): string[] {
  if (item instanceof DicomAttributeTag) {
    return item.tagValues.map((t) => t.toString("J"));
  }
  if (item instanceof DicomMultiStringElement) {
    return item.values;
  }
  if (item instanceof DicomStringElement) {
    return [item.value];
  }
  if (item instanceof DicomValueElement) {
    return item.values.map((v) => (typeof v === "bigint" ? v.toString() : String(v)));
  }
  return [];
}

function dicomAttributeTag(
  item: import("../dataset/DicomItem.js").DicomItem,
  options: WriteOptions
): string {
  const tag = item.tag.toString("J");
  const vr = item.valueRepresentation.code === "NONE" ? "UN" : item.valueRepresentation.code;
  const parts = [`DicomAttribute tag="${tag}"`, `vr="${vr}"`];

  if (options.includeKeyword) {
    const entry = DicomDictionary.default.lookup(item.tag);
    if (entry !== UnknownTag && entry.keyword) {
      parts.push(`keyword="${escapeXml(entry.keyword)}"`);
    }
  }

  if (options.includePrivateCreator && item.tag.isPrivate && item.tag.privateCreator) {
    parts.push(`privateCreator="${escapeXml(item.tag.privateCreator.creator)}"`);
  }

  return `${parts.join(" ")}`;
}

function parseAlphabeticComponents(value: string): [string, string, string, string, string] {
  const alphabetic = value.split("=")[0] ?? "";
  const parts = alphabetic.split("^");
  return [
    parts[0] ?? "",
    parts[1] ?? "",
    parts[2] ?? "",
    parts[3] ?? "",
    parts[4] ?? "",
  ];
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

class XmlWriter {
  private readonly indent: string;
  private readonly formatIndented: boolean;
  private depth = 0;
  private readonly lines: string[] = [];

  constructor(formatIndented: boolean) {
    this.formatIndented = formatIndented;
    this.indent = "  ";
  }

  open(tagLine: string): void {
    this.line(`<${tagLine}>`);
    this.depth += 1;
  }

  close(tagName: string): void {
    this.depth = Math.max(0, this.depth - 1);
    this.line(`</${tagName}>`);
  }

  line(text: string): void {
    if (this.formatIndented) {
      this.lines.push(`${this.indent.repeat(this.depth)}${text}`);
    } else {
      this.lines.push(text);
    }
  }

  toString(): string {
    return this.lines.join("\n");
  }
}
