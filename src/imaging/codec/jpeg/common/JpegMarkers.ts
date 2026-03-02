/** JPEG marker constants. */
export const SOI  = 0xffd8;
export const EOI  = 0xffd9;
export const SOF0 = 0xffc0; // Baseline DCT
export const SOF1 = 0xffc1; // Extended Sequential DCT
export const SOF3 = 0xffc3; // Lossless Sequential
export const DHT  = 0xffc4;
export const DQT  = 0xffdb;
export const DRI  = 0xffdd;
export const SOS  = 0xffda;
export const APP0 = 0xffe0;
export const RST0 = 0xffd0;
export const RST7 = 0xffd7;

/** Returns true if the marker has a length field (i.e. is not a standalone marker). */
export function hasLength(marker: number): boolean {
  return marker !== SOI && marker !== EOI
    && (marker & 0xfff8) !== RST0;  // RST0-RST7 have no length
}

/** Returns true if marker is a restart marker (RST0–RST7). */
export function isRST(marker: number): boolean {
  return marker >= RST0 && marker <= RST7;
}
