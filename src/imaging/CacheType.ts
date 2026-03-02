
/**
 * Cache type for DicomImage.
 */
export enum CacheType {
  /** No caching at all */
  None = 0,
  /** Caches the raw uncompressed pixel data */
  PixelData = 1,
  /** Caches the lookup tables and pipelines */
  LookupTables = 2,
  /** Caches the rendered display data */
  Display = 4,
  /** All caches */
  All = PixelData | LookupTables | Display,
}
