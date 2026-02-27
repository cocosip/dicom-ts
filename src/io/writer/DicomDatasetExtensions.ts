/**
 * Dataset writer helpers and group length utilities.
 *
 * Ported from fo-dicom/FO-DICOM.Core/IO/Writer/DicomDatasetExtensions.cs
 */
import { deflateRawSync } from "node:zlib";
import { DicomTag } from "../../core/DicomTag.js";
import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import { DicomSequence } from "../../dataset/DicomSequence.js";
import { DicomUnsignedLong } from "../../dataset/DicomElement.js";
import type { IByteTarget } from "../IByteTarget.js";
import { MemoryByteTarget } from "../MemoryByteTarget.js";
import { DicomWriter } from "./DicomWriter.js";
import { DicomWriteOptions } from "./DicomWriteOptions.js";
import { DicomWriteLengthCalculator } from "./DicomWriteLengthCalculator.js";

/**
 * Recalculate group length for a specific group.
 */
export function recalculateGroupLength(
  dataset: DicomDataset,
  group: number,
  createIfMissing = true
): void {
  const lengthTag = new DicomTag(group, 0x0000);
  if (!createIfMissing && !dataset.contains(lengthTag)) return;

  const items = collectGroupItems(dataset, group);
  if (items.length === 0) {
    dataset.remove(lengthTag);
    return;
  }

  const calculator = new DicomWriteLengthCalculator(dataset.internalTransferSyntax, DicomWriteOptions.Default);
  const length = calculator.calculateItems(items);
  dataset.addOrUpdate(new DicomUnsignedLong(lengthTag, length));
}

/**
 * Recalculate group lengths for all groups in the dataset.
 */
export function recalculateGroupLengths(dataset: DicomDataset, createIfMissing = true): void {
  // recalc nested sequences first
  for (const item of dataset) {
    if (item instanceof DicomSequence) {
      for (const sub of item.items as DicomDataset[]) {
        recalculateGroupLengths(sub, createIfMissing);
      }
    }
  }

  const groups = new Set<number>();
  for (const item of dataset) {
    if (createIfMissing) {
      groups.add(item.tag.group);
    } else if (item.tag.element === 0x0000) {
      groups.add(item.tag.group);
    }
  }

  const calculator = new DicomWriteLengthCalculator(dataset.internalTransferSyntax, DicomWriteOptions.Default);

  for (const group of groups) {
    const items = collectGroupItems(dataset, group);
    const lengthTag = new DicomTag(group, 0x0000);

    if (items.length === 0) {
      dataset.remove(lengthTag);
      continue;
    }

    const length = calculator.calculateItems(items);
    dataset.addOrUpdate(new DicomUnsignedLong(lengthTag, length));
  }
}

/**
 * Remove group length elements from the dataset.
 */
export function removeGroupLengths(dataset: DicomDataset, firstLevelOnly = false): void {
  dataset.remove((item) => item.tag.element === 0x0000);

  if (firstLevelOnly) return;

  for (const item of dataset) {
    if (item instanceof DicomSequence) {
      for (const sub of item.items as DicomDataset[]) {
        removeGroupLengths(sub, firstLevelOnly);
      }
    }
  }
}

/**
 * Write a dataset to a byte target.
 */
export function write(
  dataset: DicomDataset,
  target: IByteTarget,
  syntax: DicomTransferSyntax = dataset.internalTransferSyntax,
  options?: DicomWriteOptions
): void {
  const writeOptions = options ?? DicomWriteOptions.Default;

  if (writeOptions.keepGroupLengths) {
    dataset.internalTransferSyntax = syntax;
    recalculateGroupLengths(dataset, false);
  } else {
    removeGroupLengths(dataset, false);
  }

  if (syntax.isDeflate) {
    const temp = new MemoryByteTarget();
    new DicomWriter(syntax, writeOptions, temp).write(dataset);
    const compressed = deflateRawSync(temp.toBuffer());
    target.writeBytes(compressed);
    return;
  }

  new DicomWriter(syntax, writeOptions, target).write(dataset);
}

function collectGroupItems(dataset: DicomDataset, group: number): Array<import("../../dataset/DicomItem.js").DicomItem> {
  const items: Array<import("../../dataset/DicomItem.js").DicomItem> = [];
  for (const item of dataset) {
    if (item.tag.group === group && item.tag.element !== 0x0000) items.push(item);
  }
  return items;
}
