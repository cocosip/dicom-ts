/**
 * Interface for Lookup table definition.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/ILUT.cs
 */
export interface ILUT {
  /** Returns true if the lookup table is valid */
  readonly isValid: boolean;

  /** Minimum output value */
  readonly minimumOutputValue: number;

  /** Maximum output value */
  readonly maximumOutputValue: number;

  /**
   * Transform input value into output value (maps to C# indexer this[double input]).
   */
  apply(value: number): number;

  /** Forces recalculation of the LUT */
  recalculate(): void;
}
