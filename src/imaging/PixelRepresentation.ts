/**
 * Pixel representation (signed vs unsigned).
 */
export enum PixelRepresentation {
  Unsigned = 0,
  Signed = 1,
}

export function parsePixelRepresentation(value: number | string | null | undefined): PixelRepresentation {
  if (value === null || value === undefined) return PixelRepresentation.Unsigned;
  const v = typeof value === "string" ? parseInt(value, 10) : value;
  return v === 1 ? PixelRepresentation.Signed : PixelRepresentation.Unsigned;
}
