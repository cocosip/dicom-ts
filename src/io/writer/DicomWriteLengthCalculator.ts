/**
 * Calculates encoded byte lengths for DICOM items.
 *
 * Ported from fo-dicom/FO-DICOM.Core/IO/Writer/DicomWriteLengthCalculator.cs
 */
import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import { DicomWriteOptions } from "./DicomWriteOptions.js";
import { DicomItem } from "../../dataset/DicomItem.js";
import { DicomElement } from "../../dataset/DicomElement.js";
import { DicomSequence } from "../../dataset/DicomSequence.js";
import { DicomFragmentSequence } from "../../dataset/DicomFragmentSequence.js";

export class DicomWriteLengthCalculator {
  private readonly syntax: DicomTransferSyntax;
  private readonly options: DicomWriteOptions;

  constructor(syntax: DicomTransferSyntax, options: DicomWriteOptions = DicomWriteOptions.Default) {
    this.syntax = syntax;
    this.options = options;
  }

  calculateItems(items: Iterable<DicomItem>): number {
    let total = 0;
    for (const item of items) {
      total += this.calculateItem(item);
    }
    return total;
  }

  calculateItem(item: DicomItem): number {
    if (!this.options.keepGroupLengths && item.tag.element === 0x0000) {
      return 0;
    }

    let length = 0;
    length += 4; // tag

    if (this.syntax.isExplicitVR) {
      length += 2; // vr
      if (item.valueRepresentation.is16bitLength) {
        length += 2; // length
      } else {
        length += 2; // reserved
        length += 4; // length
      }
    } else {
      length += 4; // length
    }

    if (item instanceof DicomElement) {
      length += item.buffer.size;
    } else if (item instanceof DicomFragmentSequence) {
      length += 4; // item tag
      length += 4; // item length
      length += item.offsetTable.length * 4;

      for (const fragment of item) {
        length += 4; // item tag
        length += 4; // item length
        length += fragment.size;
      }

      length += 4; // sequence delimitation tag
      length += 4; // sequence delimitation length
    } else if (item instanceof DicomSequence) {
      length += this.calculateSequence(item);
    }

    return length;
  }

  calculateSequence(sequence: DicomSequence): number {
    let length = 0;
    for (const dataset of sequence.items) {
      length += 4; // item tag
      length += 4; // item length

      length += this.calculateItems(dataset);

      if (!this.options.explicitLengthSequenceItems) {
        length += 4; // item delimitation tag
        length += 4; // item delimitation length
      }
    }

    if (!this.options.explicitLengthSequences && !sequence.tag.isPrivate) {
      length += 4; // sequence delimitation tag
      length += 4; // sequence delimitation length
    }

    return length;
  }
}

