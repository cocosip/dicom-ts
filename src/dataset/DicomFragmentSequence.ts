/**
 * DICOM fragment sequence — encapsulated pixel data stored as discrete fragments.
 *
 * Used for compressed pixel data (JPEG, JPEG2000, RLE, …) where the value
 * field is split into an "offset table" fragment followed by one or more
 * data fragments.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomFragmentSequence.cs
 */
import { DicomTag } from "../core/DicomTag.js";
import { DicomVR } from "../core/DicomVR.js";
import type { IByteBuffer } from "../io/buffer/IByteBuffer.js";
import { DicomItem } from "./DicomItem.js";

/**
 * Abstract base for OB and OW fragment sequences.
 */
export abstract class DicomFragmentSequence
  extends DicomItem
  implements Iterable<IByteBuffer>
{
  /** Per-frame byte offset table (first fragment, parsed as uint32 array). */
  readonly offsetTable: number[] = [];

  /** The actual compressed data fragments (one per frame, typically). */
  readonly fragments: IByteBuffer[] = [];

  protected constructor(tag: DicomTag) {
    super(tag);
  }

  /** Add a fragment.  The first call populates the offset table; subsequent
   *  calls append to `fragments`. */
  addRaw(fragment: IByteBuffer): void {
    if (this.offsetTable.length === 0 && this.fragments.length === 0) {
      // First fragment is the basic offset table
      const view = new DataView(
        fragment.data.buffer,
        fragment.data.byteOffset,
        fragment.data.byteLength
      );
      const n = Math.floor(fragment.size / 4);
      for (let i = 0; i < n; i++) {
        this.offsetTable.push(view.getUint32(i * 4, true));
      }
    } else {
      this.fragments.push(fragment);
    }
  }

  [Symbol.iterator](): Iterator<IByteBuffer> {
    return this.fragments[Symbol.iterator]();
  }
}

/** OB-encoded fragment sequence (most compressed formats). */
export class DicomOtherByteFragment extends DicomFragmentSequence {
  constructor(tag: DicomTag) {
    super(tag);
  }

  override get valueRepresentation(): DicomVR {
    return DicomVR.OB;
  }
}

/** OW-encoded fragment sequence. */
export class DicomOtherWordFragment extends DicomFragmentSequence {
  constructor(tag: DicomTag) {
    super(tag);
  }

  override get valueRepresentation(): DicomVR {
    return DicomVR.OW;
  }
}
