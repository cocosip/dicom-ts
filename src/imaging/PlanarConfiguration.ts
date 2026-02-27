/**
 * Planar configuration (pixel data organization for color images).
 */
export enum PlanarConfiguration {
  Interleaved = 0,
  Planar = 1,
}

export function parsePlanarConfiguration(value: number | string | null | undefined): PlanarConfiguration {
  if (value === null || value === undefined) return PlanarConfiguration.Interleaved;
  const v = typeof value === "string" ? parseInt(value, 10) : value;
  return v === 1 ? PlanarConfiguration.Planar : PlanarConfiguration.Interleaved;
}
