/**
 * Common interface for byte buffers.
 *
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/IByteBuffer.cs
 */
export interface IByteBuffer {
  /** Whether the data is fully resident in memory. */
  readonly isMemory: boolean;

  /** Size of the buffered data in bytes. */
  readonly size: number;

  /** The raw data bytes. */
  readonly data: Uint8Array;

  /** Return a view (subarray) of `count` bytes starting at `offset`. */
  getByteRange(offset: number, count: number): Uint8Array;
}
