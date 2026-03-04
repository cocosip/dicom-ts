/**
 * JPEG 2000 marker codes (ISO/IEC 15444-1 Table A.1 + Part 2 extensions).
 */
export const Jpeg2000Marker = {
  // Delimiting markers
  SOC: 0xff4f,
  SOT: 0xff90,
  SOD: 0xff93,
  EOC: 0xffd9,

  // Fixed information marker segments
  SIZ: 0xff51,

  // Functional marker segments
  COD: 0xff52,
  COC: 0xff53,
  RGN: 0xff5e,
  QCD: 0xff5c,
  QCC: 0xff5d,
  POC: 0xff5f,

  // Pointer marker segments
  TLM: 0xff55,
  PLM: 0xff57,
  PLT: 0xff58,
  PPM: 0xff60,
  PPT: 0xff61,

  // Informational marker segments
  CRG: 0xff63,
  COM: 0xff64,

  // Part 2 multi-component transform markers
  MCT: 0xff74,
  MCC: 0xff75,
  MCO: 0xff77,
} as const;

export type Jpeg2000MarkerCode = (typeof Jpeg2000Marker)[keyof typeof Jpeg2000Marker];

const MARKER_NAMES = new Map<number, string>([
  [Jpeg2000Marker.SOC, "SOC"],
  [Jpeg2000Marker.SOT, "SOT"],
  [Jpeg2000Marker.SOD, "SOD"],
  [Jpeg2000Marker.EOC, "EOC"],
  [Jpeg2000Marker.SIZ, "SIZ"],
  [Jpeg2000Marker.COD, "COD"],
  [Jpeg2000Marker.COC, "COC"],
  [Jpeg2000Marker.RGN, "RGN"],
  [Jpeg2000Marker.QCD, "QCD"],
  [Jpeg2000Marker.QCC, "QCC"],
  [Jpeg2000Marker.POC, "POC"],
  [Jpeg2000Marker.TLM, "TLM"],
  [Jpeg2000Marker.PLM, "PLM"],
  [Jpeg2000Marker.PLT, "PLT"],
  [Jpeg2000Marker.PPM, "PPM"],
  [Jpeg2000Marker.PPT, "PPT"],
  [Jpeg2000Marker.CRG, "CRG"],
  [Jpeg2000Marker.COM, "COM"],
  [Jpeg2000Marker.MCT, "MCT"],
  [Jpeg2000Marker.MCC, "MCC"],
  [Jpeg2000Marker.MCO, "MCO"],
]);

export function markerName(marker: number): string {
  return MARKER_NAMES.get(marker) ?? "UNKNOWN";
}

export function markerHasLength(marker: number): boolean {
  return marker !== Jpeg2000Marker.SOC
    && marker !== Jpeg2000Marker.SOD
    && marker !== Jpeg2000Marker.EOC;
}

