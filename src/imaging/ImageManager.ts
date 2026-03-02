
import { IImage } from "./IImage.js";
import { IImageManager } from "./IImageManager.js";
import { RawImageManager } from "./RawImageManager.js";

/**
 * Manager for creation of image objects.
 */
export class ImageManager {
  private static _instance: IImageManager;

  static get instance(): IImageManager {
    if (!ImageManager._instance) {
      // Default to RawImageManager or similar if available
      ImageManager._instance = new RawImageManager();
    }
    return ImageManager._instance;
  }

  static setImplementation(impl: IImageManager) {
    ImageManager._instance = impl;
  }

  static createImage(width: number, height: number): IImage {
    return ImageManager.instance.createImage(width, height);
  }
}
