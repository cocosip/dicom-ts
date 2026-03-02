/**
 * Standard JPEG Huffman tables used for lossless coding.
 *
 * Reference: go-dicom-codec/jpeg/standard/tables.go
 */
import { HuffmanTable, buildHuffmanCodes, type HuffmanCode } from "./JpegHuffman.js";

// Standard lossless DC luminance table (categories 0-11, covers up to 8-bit images)
// Matches libjpeg / fo-dicom lossless tables.
export const LosslessDCLuminanceBits   = [0, 2, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0];
export const LosslessDCLuminanceValues = [0x00, 0x04, 0x02, 0x03, 0x05, 0x01, 0x06, 0x07, 0x0c, 0x0b, 0x08, 0x0f];

export const LosslessDCChrominanceBits   = [0, 2, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0];
export const LosslessDCChrominanceValues = [0x00, 0x04, 0x02, 0x03, 0x05, 0x01, 0x06, 0x07, 0x0c, 0x0b, 0x08, 0x0f];

// Extended DC tables for high bit-depth images (supports categories 0-16, up to 16-bit)
export const ExtendedDCLuminanceBits   = [0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2];
export const ExtendedDCLuminanceValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export const ExtendedDCChrominanceBits   = [0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 3];
export const ExtendedDCChrominanceValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

function makeTable(bits: number[], values: number[]): HuffmanTable {
  return new HuffmanTable({ bits, values });
}

export function buildLosslessTables(useExtended: boolean): {
  tables: [HuffmanTable, HuffmanTable];
  codes:  [HuffmanCode[], HuffmanCode[]];
} {
  const t0 = useExtended
    ? makeTable(ExtendedDCLuminanceBits,   ExtendedDCLuminanceValues)
    : makeTable(LosslessDCLuminanceBits,   LosslessDCLuminanceValues);
  const t1 = useExtended
    ? makeTable(ExtendedDCChrominanceBits,   ExtendedDCChrominanceValues)
    : makeTable(LosslessDCChrominanceBits,   LosslessDCChrominanceValues);
  return {
    tables: [t0, t1],
    codes:  [buildHuffmanCodes(t0), buildHuffmanCodes(t1)],
  };
}
