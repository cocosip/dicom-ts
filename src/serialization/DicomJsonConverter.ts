
import { DicomJsonOptions, NumberSerializationMode } from "./DicomJson.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomItem } from "../dataset/DicomItem.js";
import {
  DicomElement,
  DicomStringElement,
  DicomMultiStringElement,
  DicomValueElement,
  DicomAttributeTag,
  DicomPersonName,
  DicomOtherByte,
  DicomApplicationEntity,
  DicomAgeString,
  DicomCodeString,
  DicomDate,
  DicomDecimalString,
  DicomDateTime,
  DicomFloatingPointDouble,
  DicomFloatingPointSingle,
  DicomIntegerString,
  DicomLongString,
  DicomLongText,
  DicomOtherDouble,
  DicomOtherFloat,
  DicomOtherLong,
  DicomOtherVeryLong,
  DicomOtherWord,
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
  createElement
} from "../dataset/DicomElement.js";
import { DicomTag } from "../core/DicomTag.js";
import { DicomVR } from "../core/DicomVR.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { DicomFragmentSequence } from "../dataset/DicomFragmentSequence.js";
import { DicomDictionary } from "../core/DicomDictionary.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDateRange } from "../dataset/DicomDateRange.js";
import { BulkDataUriByteBuffer } from "../io/buffer/BulkDataUriByteBuffer.js";
import { IByteBuffer } from "../io/buffer/IByteBuffer.js";
import { EmptyBuffer } from "../io/buffer/EmptyBuffer.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import { Base64 } from "../core/Base64.js";

export class DicomJsonConverter {
  private _options: DicomJsonOptions;

  constructor(options?: DicomJsonOptions) {
    this._options = options || new DicomJsonOptions();
  }

  public write(dataset: DicomDataset): string {
    const obj = this.convertDatasetToModel(dataset);
    return JSON.stringify(obj, null, this._options.format ? 2 : undefined);
  }

  public convertDatasetToModel(dataset: DicomDataset): any {
    const obj: any = {};
    for (const item of dataset) {
      const key = this.getKey(item.tag);
      obj[key] = this.convertItemToModel(item);
    }
    return obj;
  }

  private getKey(tag: DicomTag): string {
    if (this._options.writeTagsAsKeywords) {
      const entry = DicomDictionary.default.lookup(tag);
      if (entry && entry.keyword) {
        return entry.keyword;
      }
    }
    return tag.toString("J").toUpperCase();
  }

  private convertItemToModel(item: DicomItem): any {
    const model: any = {
      vr: item.valueRepresentation.code,
    };

    if (item instanceof DicomSequence) {
      const values = [];
      for (const ds of item.items) {
        values.push(this.convertDatasetToModel(ds));
      }
      if (values.length > 0) {
        model.Value = values;
      }
    } else if (item instanceof DicomFragmentSequence) {
      const data = [];
      for (const fragment of item.fragments) {
        data.push(Base64.encode(fragment.data));
      }
      model.DataFragment = data;
    } else if (item instanceof DicomElement) {
      if (item.count === 0) {
        // Empty element
      } else {
        this.writeElementValue(model, item);
      }
    }

    return model;
  }

  private writeElementValue(model: any, element: DicomElement): void {
    const vr = element.valueRepresentation;
    if (vr === DicomVR.OB || vr === DicomVR.OW || 
        vr === DicomVR.OF || vr === DicomVR.OD || 
        vr === DicomVR.OL || vr === DicomVR.OV || 
        vr === DicomVR.UN) {
      
      const buffer = element.buffer;
      if (buffer instanceof BulkDataUriByteBuffer) {
        model.BulkDataURI = buffer.bulkDataUri;
      } else if (buffer === EmptyBuffer) {
        // No value
      } else {
        // InlineBinary
        model.InlineBinary = Base64.encode(element.buffer.data);
      }
    } else if (element instanceof DicomPersonName) {
      const values = [];
      for (let i = 0; i < element.count; i++) {
        // DicomPersonName does not expose generic getValue(i) but it extends DicomMultiStringElement which has values[]
        // Actually DicomPersonName stores raw strings.
        // We need to parse components if we want { Alphabetic, ... }
        // The element.values returns strings "Smith^John"
        const val = element.values[i];
        if (typeof val === "string") {
            values.push(this.parsePersonName(val));
        }
      }
      model.Value = values;
    } else if (element instanceof DicomAttributeTag) {
        const values = [];
        const tags = element.tagValues;
        for (const t of tags) {
             values.push(t.toString().toUpperCase().replace(",", ""));
        }
        model.Value = values;
    } else {
      // String or Number types
      const values = [];
      
      // We need to extract values based on type
      if (element instanceof DicomValueElement) {
         // Number or BigInt
         const nums = (element as DicomValueElement<number | bigint>).values;
         for (const n of nums) {
             if (this.isNumberVR(vr) && this._options.numberSerializationMode === NumberSerializationMode.PreferJsonNumber) {
                 const numVal = Number(n);
                 if (!isNaN(numVal)) values.push(numVal);
                 else values.push(n.toString());
             } else {
                 values.push(n); // For JSON, number is number. BigInt might need serialization to string?
                 // JSON.stringify doesn't handle BigInt.
                 // So if it's BigInt, we MUST convert to string or number.
             }
         }
      } else if (element instanceof DicomMultiStringElement) {
          const strs = element.values;
          for (const s of strs) {
              if (this.isNumberVR(vr) && this._options.numberSerializationMode === NumberSerializationMode.PreferJsonNumber) {
                   const num = Number(s);
                   if (!isNaN(num)) values.push(num);
                   else values.push(s);
              } else {
                   values.push(s);
              }
          }
      } else if (element instanceof DicomStringElement) {
          const s = element.value;
          if (this.isNumberVR(vr) && this._options.numberSerializationMode === NumberSerializationMode.PreferJsonNumber) {
               const num = Number(s);
               if (!isNaN(num)) values.push(num);
               else values.push(s);
          } else {
               values.push(s);
          }
      }

      model.Value = values;
    }
  }

  private isNumberVR(vr: DicomVR): boolean {
      return vr === DicomVR.DS || vr === DicomVR.IS || vr === DicomVR.SV || vr === DicomVR.UV;
  }

  private parsePersonName(value: string): any {
      const parts = value.split("=");
      const obj: any = {};
      if (parts[0]) obj.Alphabetic = parts[0];
      if (parts[1]) obj.Ideographic = parts[1];
      if (parts[2]) obj.Phonetic = parts[2];
      return obj;
  }

  // Deserialization
  public read(json: string): DicomDataset {
      const obj = JSON.parse(json);
      return this.convertModelToDataset(obj);
  }

  public convertModelToDataset(obj: any): DicomDataset {
      const dataset = new DicomDataset();
      for (const key of Object.keys(obj)) {
          const tag = this.parseTag(key);
          if (!tag) continue;
          const val = obj[key];
          const item = this.convertModelToItem(tag, val);
          if (item) {
              dataset.add(item);
          }
      }
      return dataset;
  }

  private parseTag(key: string): DicomTag | undefined {
      // key could be "00100010" or "PatientName"
      if (/^[0-9A-Fa-f]{8}$/.test(key)) {
          const group = parseInt(key.substring(0, 4), 16);
          const element = parseInt(key.substring(4), 16);
          return new DicomTag(group, element);
      }
      // Try keyword
      const tag = DicomDictionary.default.lookupKeyword(key);
      if (tag) return tag;
      
      return undefined;
  }

  private convertModelToItem(tag: DicomTag, model: any): DicomItem | null {
      const vrCode = model.vr;
      if (!vrCode) return null;
      const vr = DicomVR.parse(vrCode);
      
      if (model.Value === undefined && model.BulkDataURI === undefined && model.InlineBinary === undefined && model.DataFragment === undefined) {
          // Empty
          return createElement(vr, tag, EmptyBuffer);
      }

      if (vr === DicomVR.SQ) {
          const items: DicomDataset[] = [];
          if (Array.isArray(model.Value)) {
              for (const v of model.Value) {
                  items.push(this.convertModelToDataset(v));
              }
          }
          return new DicomSequence(tag, ...items);
      }
      
      // Elements
      if (model.BulkDataURI) {
           return createElement(vr, tag, new BulkDataUriByteBuffer(model.BulkDataURI));
      }
      
      if (model.InlineBinary) {
          const buffer = new MemoryByteBuffer(Base64.decode(model.InlineBinary));
          return createElement(vr, tag, buffer);
      }

      if (model.Value) {
          return this.createItemFromValues(vr, tag, model.Value);
      }

      return null;
  }

  private createItemFromValues(vr: DicomVR, tag: DicomTag, values: any[]): DicomElement {
      switch (vr) {
        case DicomVR.AE: return new DicomApplicationEntity(tag, ...(values as string[]));
        case DicomVR.AS: return new DicomAgeString(tag, ...(values as string[]));
        case DicomVR.AT: {
            const tags = values.map(v => this.parseTag(v)).filter((t): t is DicomTag => t !== undefined);
            return new DicomAttributeTag(tag, ...tags);
        }
        case DicomVR.CS: return new DicomCodeString(tag, ...(values as string[]));
        case DicomVR.DA: return new DicomDate(tag, ...(values as string[]));
        case DicomVR.DS: return new DicomDecimalString(tag, ...(values as (string | number)[]));
        case DicomVR.DT: return new DicomDateTime(tag, ...(values as string[]));
        case DicomVR.FD: return new DicomFloatingPointDouble(tag, ...(values as number[]));
        case DicomVR.FL: return new DicomFloatingPointSingle(tag, ...(values as number[]));
        case DicomVR.IS: return new DicomIntegerString(tag, ...(values as (string | number)[]));
        case DicomVR.LO: return new DicomLongString(tag, ...(values as string[]));
        case DicomVR.LT: return new DicomLongText(tag, (values[0] as string) ?? "");
        // Binary VRs with Value field (should not happen in standard JSON but handled)
        case DicomVR.OB: return new DicomOtherByte(tag, (values[0] as Uint8Array | undefined) ?? new Uint8Array());
        case DicomVR.OD: return new DicomOtherDouble(tag, (values[0] as Float64Array | undefined) ?? new Float64Array());
        case DicomVR.OF: return new DicomOtherFloat(tag, (values[0] as Float32Array | undefined) ?? new Float32Array());
        case DicomVR.OL: return new DicomOtherLong(tag, (values[0] as Uint32Array | undefined) ?? new Uint32Array());
        case DicomVR.OV: return new DicomOtherVeryLong(tag, (values[0] as BigUint64Array | undefined) ?? new BigUint64Array());
        case DicomVR.OW: return new DicomOtherWord(tag, (values[0] as Uint16Array | undefined) ?? new Uint16Array());
        case DicomVR.PN: {
            const strs = values.map((v: any) => {
                if (typeof v === "string") return v;
                return `${v.Alphabetic || ""}=${v.Ideographic || ""}=${v.Phonetic || ""}`.replace(/=+$/, "");
            });
            return new DicomPersonName(tag, ...strs);
        }
        case DicomVR.SH: return new DicomShortString(tag, ...(values as string[]));
        case DicomVR.SL: return new DicomSignedLong(tag, ...(values as number[]));
        case DicomVR.SS: return new DicomSignedShort(tag, ...(values as number[]));
        case DicomVR.ST: return new DicomShortText(tag, (values[0] as string) ?? "");
        case DicomVR.SV: return new DicomSignedVeryLong(tag, ...(values as bigint[]));
        case DicomVR.TM: return new DicomTime(tag, ...(values as string[]));
        case DicomVR.UC: return new DicomUnlimitedCharacters(tag, ...(values as string[]));
        case DicomVR.UI: return new DicomUniqueIdentifier(tag, ...(values as string[]));
        case DicomVR.UL: return new DicomUnsignedLong(tag, ...(values as number[]));
        case DicomVR.UN: return new DicomUnknown(tag, (values[0] as Uint8Array | undefined) ?? new Uint8Array());
        case DicomVR.UR: return new DicomUniversalResource(tag, (values[0] as string) ?? "");
        case DicomVR.US: return new DicomUnsignedShort(tag, ...(values as number[]));
        case DicomVR.UT: return new DicomUnlimitedText(tag, (values[0] as string) ?? "");
        case DicomVR.UV: return new DicomUnsignedVeryLong(tag, ...(values as bigint[]));
        default:         return new DicomUnknown(tag, new Uint8Array());
      }
  }
}

export function convertDicomToJson(dataset: DicomDataset, options?: DicomJsonOptions): string {
  const converter = new DicomJsonConverter(options);
  return converter.write(dataset);
}

export function convertJsonToDicom(json: string): DicomDataset {
  const converter = new DicomJsonConverter();
  return converter.read(json);
}
