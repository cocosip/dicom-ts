
import { IImage } from "./IImage.js";
import { Color32 } from "./Color32.js";
import { IGraphic } from "./render/IGraphic.js";
import { DicomImagingException } from "./DicomImagingException.js";

/**
 * Base class for image implementations.
 */
export abstract class ImageBase<TImage extends object> implements IImage {
  protected readonly _width: number;
  protected readonly _height: number;
  protected _pixels: Uint8Array;
  protected _image: TImage | null;
  protected _disposed: boolean;

  constructor(width: number, height: number, pixels: Uint8Array, image: TImage | null) {
    this._width = width;
    this._height = height;
    this._pixels = pixels;
    this._image = image;
    this._disposed = false;
  }

  get width(): number { return this._width; }
  get height(): number { return this._height; }
  get pixels(): Uint8Array { return this._pixels; }
  get bytesPerPixel(): number { return 4; }

  as<T>(): T {
    if (!this._image) {
      throw new DicomImagingException("Image has not yet been rendered.");
    }
    return this._image as unknown as T;
  }

  abstract render(components: number, flipX: boolean, flipY: boolean, rotation: number): void;
  abstract drawGraphics(graphics: Iterable<IGraphic>): void;
  abstract clone(): IImage;

  dispose(): void {
    this.disposeInternal(true);
  }

  protected disposeInternal(disposing: boolean): void {
    if (this._disposed) return;
    this._image = null;
    this._disposed = true;
  }

  getPixel(x: number, y: number): Color32 {
    if (x >= 0 && x < this._width && y >= 0 && y < this._height) {
      const idx = (y * this._width + x) * 4;
      return new Color32(
        this._pixels[idx]!,     // R
        this._pixels[idx + 1]!, // G
        this._pixels[idx + 2]!, // B
        this._pixels[idx + 3]!  // A
      );
    }
    return Color32.Black;
  }

  protected static toBytes(width: number, height: number, components: number, flipX: boolean, flipY: boolean, rotation: number, data: Uint8Array): Uint8Array {
    // Treat data as Int32Array for faster processing (assuming little-endian)
    // Note: Uint8Array is byte array, Int32Array view assumes platform endianness (usually LE)
    // ARGB vs RGBA: Color32 stores ARGB in int32, but RGBA in bytes.
    // When viewing RGBA bytes as Int32 (LE), it becomes ABGR (A=MSB, R=LSB).
    // The transformation logic just moves pixels around, so pixel format doesn't matter as long as it's 32-bit.
    
    // Ensure we have a buffer that is multiple of 4
    if (data.byteLength % 4 !== 0) {
      throw new Error("Data length must be multiple of 4 bytes.");
    }

    const int32Data = new Int32Array(data.buffer, data.byteOffset, data.byteLength / 4);
    
    let w = width;
    let h = height;

    const rotated = ImageBase.rotate(w, h, rotation, int32Data);
    
    // Update dimensions if rotated 90 or 270
    if (rotation % 180 !== 0) {
      [w, h] = [h, w];
    }

    const flipped = ImageBase.flip(w, h, flipX, flipY, rotated);

    // Create a new Uint8Array from the result buffer
    return new Uint8Array(flipped.buffer);
  }

  private static rotate(width: number, height: number, angle: number, data: Int32Array): Int32Array {
    angle %= 360;
    if (angle < 0) angle += 360;

    if (angle === 0) return data;

    let result: Int32Array;
    let i = 0;

    if (angle === 90) {
      result = new Int32Array(width * height);
      for (let x = 0; x < width; x++) {
        for (let y = height - 1; y >= 0; y--) {
          result[i++] = data[y * width + x]!;
        }
      }
    } else if (angle === 180) {
      result = new Int32Array(width * height);
      for (let y = height - 1; y >= 0; y--) {
        for (let x = width - 1; x >= 0; x--) {
          result[i++] = data[y * width + x]!;
        }
      }
    } else if (angle === 270) {
      result = new Int32Array(width * height);
      for (let x = width - 1; x >= 0; x--) {
        for (let y = 0; y < height; y++) {
          result[i++] = data[y * width + x]!;
        }
      }
    } else {
      result = data;
    }
    return result;
  }

  private static flip(width: number, height: number, flipX: boolean, flipY: boolean, data: Int32Array): Int32Array {
    if (!flipX && !flipY) return data;

    let tmp: Int32Array;
    if (flipX) {
      tmp = new Int32Array(width * height);
      let i = 0;
      for (let y = 0; y < height; y++) {
        for (let x = width - 1; x >= 0; x--) {
          tmp[i++] = data[y * width + x]!;
        }
      }
    } else {
      tmp = data;
    }

    if (flipY) {
      const result = new Int32Array(width * height);
      let i = 0;
      for (let y = height - 1; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
          result[i++] = tmp[y * width + x]!;
        }
      }
      return result;
    }
    
    return tmp;
  }
}
