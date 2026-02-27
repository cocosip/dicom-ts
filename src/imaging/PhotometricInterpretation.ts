/**
 * Photometric interpretation (color space) enumeration.
 *
 * Reference: DICOM PS3.3 C.7.6.3.1.2
 */
export enum PhotometricInterpretation {
  MONOCHROME1 = "MONOCHROME1",
  MONOCHROME2 = "MONOCHROME2",
  RGB = "RGB",
  YBR_FULL = "YBR_FULL",
  YBR_FULL_422 = "YBR_FULL_422",
  YBR_PARTIAL_422 = "YBR_PARTIAL_422",
  YBR_PARTIAL_420 = "YBR_PARTIAL_420",
  PALETTE_COLOR = "PALETTE COLOR",
  YBR_ICT = "YBR_ICT",
  YBR_RCT = "YBR_RCT",
}

const ALIASES: Record<string, PhotometricInterpretation> = {
  MONOCHROME1: PhotometricInterpretation.MONOCHROME1,
  MONOCHROME2: PhotometricInterpretation.MONOCHROME2,
  RGB: PhotometricInterpretation.RGB,
  YBR_FULL: PhotometricInterpretation.YBR_FULL,
  YBR_FULL_422: PhotometricInterpretation.YBR_FULL_422,
  YBR_PARTIAL_422: PhotometricInterpretation.YBR_PARTIAL_422,
  YBR_PARTIAL_420: PhotometricInterpretation.YBR_PARTIAL_420,
  "PALETTE COLOR": PhotometricInterpretation.PALETTE_COLOR,
  PALETTE_COLOR: PhotometricInterpretation.PALETTE_COLOR,
  YBR_ICT: PhotometricInterpretation.YBR_ICT,
  YBR_RCT: PhotometricInterpretation.YBR_RCT,
};

export function parsePhotometricInterpretation(
  value: string | null | undefined
): PhotometricInterpretation | null {
  if (!value) return null;
  const key = value.trim().toUpperCase();
  return ALIASES[key] ?? null;
}

export function isMonochrome(pi: PhotometricInterpretation | null): boolean {
  return pi === PhotometricInterpretation.MONOCHROME1
    || pi === PhotometricInterpretation.MONOCHROME2;
}
