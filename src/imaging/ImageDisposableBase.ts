
import { ImageBase } from "./ImageBase.js";

export interface Disposable {
  dispose(): void;
}

/**
 * Base class for image implementations where underlying image type is disposable.
 */
export abstract class ImageDisposableBase<TImage extends object & Disposable> extends ImageBase<TImage> {
  constructor(width: number, height: number, pixels: Uint8Array, image: TImage | null) {
    super(width, height, pixels, image);
  }

  protected override disposeInternal(disposing: boolean): void {
    if (this._disposed) return;
    
    if (this._image) {
      this._image.dispose();
      this._image = null;
    }
    
    super.disposeInternal(disposing);
  }
}
