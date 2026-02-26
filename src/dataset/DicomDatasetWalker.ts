/**
 * DicomDatasetWalker — depth-first traversal of a DicomDataset tree.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomDatasetWalker.cs
 *
 * The walker calls observer callbacks in document order:
 *   onBeginDataset → elements/sequences → onEndDataset
 *
 * For sequences:
 *   onBeginSequence → per item: (onBeginSequenceItem → ... → onEndSequenceItem) → onEndSequence
 */

import { DicomDataset } from "./DicomDataset.js";
import { DicomElement } from "./DicomElement.js";
import { DicomSequence } from "./DicomSequence.js";
import { DicomFragmentSequence } from "./DicomFragmentSequence.js";

// ---------------------------------------------------------------------------
// Observer interface
// ---------------------------------------------------------------------------

export interface IDicomDatasetWalker {
  /** Called before iterating a dataset's items. */
  onBeginDataset(dataset: DicomDataset): void;

  /** Called after all items of a dataset have been visited. */
  onEndDataset(): void;

  /** Called when a DicomSequence item is encountered (before its sub-items). */
  onBeginSequence(sequence: DicomSequence): void;

  /** Called after all sub-items of a sequence have been visited. */
  onEndSequence(): void;

  /** Called before visiting the items of one sequence entry. */
  onBeginSequenceItem(dataset: DicomDataset): void;

  /** Called after all items of one sequence entry have been visited. */
  onEndSequenceItem(): void;

  /** Called for every leaf DicomElement. */
  onElement(element: DicomElement): void;

  /** Called for fragment sequences (e.g. encapsulated pixel data). */
  onFragmentSequence(fragment: DicomFragmentSequence): void;
}

// ---------------------------------------------------------------------------
// Default no-op base
// ---------------------------------------------------------------------------

/**
 * Base implementation that does nothing.
 * Extend this and override only the callbacks you need.
 */
export abstract class DicomDatasetWalkerBase implements IDicomDatasetWalker {
  onBeginDataset(_dataset: DicomDataset): void { /* no-op */ }
  onEndDataset(): void { /* no-op */ }
  onBeginSequence(_sequence: DicomSequence): void { /* no-op */ }
  onEndSequence(): void { /* no-op */ }
  onBeginSequenceItem(_dataset: DicomDataset): void { /* no-op */ }
  onEndSequenceItem(): void { /* no-op */ }
  onElement(_element: DicomElement): void { /* no-op */ }
  onFragmentSequence(_fragment: DicomFragmentSequence): void { /* no-op */ }
}

// ---------------------------------------------------------------------------
// Walker
// ---------------------------------------------------------------------------

export class DicomDatasetWalker {
  /**
   * Walk a dataset depth-first, dispatching events to `observer`.
   */
  static walk(dataset: DicomDataset, observer: IDicomDatasetWalker): void {
    observer.onBeginDataset(dataset);
    for (const item of dataset) {
      if (item instanceof DicomFragmentSequence) {
        observer.onFragmentSequence(item);
      } else if (item instanceof DicomSequence) {
        observer.onBeginSequence(item);
        for (const subDataset of item.items as DicomDataset[]) {
          observer.onBeginSequenceItem(subDataset);
          DicomDatasetWalker.walk(subDataset, observer);
          observer.onEndSequenceItem();
        }
        observer.onEndSequence();
      } else if (item instanceof DicomElement) {
        observer.onElement(item);
      }
    }
    observer.onEndDataset();
  }
}
