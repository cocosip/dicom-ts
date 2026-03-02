
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomItem } from "../dataset/DicomItem.js";
import {
    DicomElement,
    DicomStringElement,
    DicomMultiStringElement,
    DicomValueElement,
    DicomPersonName,
    DicomAttributeTag
} from "../dataset/DicomElement.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { DicomVR } from "../core/DicomVR.js";
import { DicomTag } from "../core/DicomTag.js";
import { Base64 } from "../core/Base64.js";
import { DicomDictionary } from "../core/DicomDictionary.js";

export class DicomXmlConverter {
    private _writeKeyword: boolean = true;

    constructor(writeKeyword: boolean = true) {
        this._writeKeyword = writeKeyword;
    }

    public write(dataset: DicomDataset): string {
        // Native DICOM Model XML (PS3.19)
        let xml = "<NativeDicomModel>";
        for (const item of dataset) {
            xml += this.convertItem(item);
        }
        xml += "</NativeDicomModel>";
        return xml;
    }

    private convertItem(item: DicomItem): string {
        const tag = item.tag.toString("J").toUpperCase();
        const entry = DicomDictionary.default.lookup(item.tag);
        const keyword = entry.keyword || "";
        const vr = item.valueRepresentation.code;
        
        let attrs = ` tag="${tag}" vr="${vr}"`;
        if (this._writeKeyword && keyword) {
            attrs += ` keyword="${keyword}"`;
        }

        let xml = `<DicomAttribute${attrs}>`;

        if (item instanceof DicomSequence) {
            for (let i = 0; i < item.items.length; i++) {
                const ds = item.items[i];
                if (!ds) continue;
                xml += `<Item number="${i + 1}">`;
                for (const child of ds) {
                    xml += this.convertItem(child);
                }
                xml += "</Item>";
            }
        } else if (item instanceof DicomElement) {
            if (item.count > 0) {
                xml += this.convertElementValue(item);
            }
        }

        xml += "</DicomAttribute>";
        return xml;
    }

    private convertElementValue(element: DicomElement): string {
        const vr = element.valueRepresentation;
        let xml = "";

        if (vr === DicomVR.OB || vr === DicomVR.OW || vr === DicomVR.OF || 
            vr === DicomVR.OD || vr === DicomVR.OL || vr === DicomVR.OV || 
            vr === DicomVR.UN) {
            
            // Binary data -> InlineBinary
            // TODO: BulkDataURI support if needed
            const base64 = Base64.encode(element.buffer.data);
            xml += `<InlineBinary>${base64}</InlineBinary>`;
        } else if (element instanceof DicomPersonName) {
             for (let i = 0; i < element.count; i++) {
                const val = element.values[i]; // raw string like "Smith^John"
                xml += `<PersonName number="${i + 1}">`;
                if (val) {
                    const parts = val.split("=");
                    if (parts[0]) xml += `<Alphabetic>${this.escapeXml(parts[0])}</Alphabetic>`;
                    if (parts[1]) xml += `<Ideographic>${this.escapeXml(parts[1])}</Ideographic>`;
                    if (parts[2]) xml += `<Phonetic>${this.escapeXml(parts[2])}</Phonetic>`;
                }
                xml += `</PersonName>`;
            }
        } else {
             // Generic values extraction
             let values: string[] = [];
             if (element instanceof DicomMultiStringElement) {
                 values = element.values;
             } else if (element instanceof DicomStringElement) {
                 values = [element.value];
             } else if (element instanceof DicomValueElement) {
                 // Convert numbers/bigints to string
                 values = (element as DicomValueElement<number | bigint>).values.map(String);
             } else if (element instanceof DicomAttributeTag) {
                 values = element.tagValues.map(t => t.toString().toUpperCase().replace(",", ""));
             }

             for (let i = 0; i < values.length; i++) {
                const strVal = values[i] || "";
                xml += `<Value number="${i + 1}">${this.escapeXml(strVal)}</Value>`;
            }
        }

        return xml;
    }

    private escapeXml(unsafe: string): string {
        return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case "<": return "&lt;";
                case ">": return "&gt;";
                case "&": return "&amp;";
                case "'": return "&apos;";
                case "\"": return "&quot;";
                default: return c;
            }
        });
    }
}

export function convertDicomToXml(dataset: DicomDataset, writeKeyword: boolean = true): string {
  const converter = new DicomXmlConverter(writeKeyword);
  return converter.write(dataset);
}
