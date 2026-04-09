declare module "upng-js" {
  export interface UPNGStatic {
    encode(frames: ArrayBuffer[], width: number, height: number, colors: number, delays?: number[]): ArrayBuffer;
    decode(buffer: ArrayBuffer): unknown;
    toRGBA8(image: unknown): ArrayBuffer[];
  }

  const UPNG: UPNGStatic;
  export default UPNG;
}
