/**
 * Numeric extension utilities.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Mathematics/Extensions.cs
 */

/** Returns true if `v` is odd (least-significant bit is 1). */
export function isOdd(v: number): boolean {
  return (v & 1) === 1;
}

/** Returns true if `v` is even (least-significant bit is 0). */
export function isEven(v: number): boolean {
  return (v & 1) === 0;
}
