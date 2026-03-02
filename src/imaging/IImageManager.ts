import type { IImage } from "./IImage.js";

/**
 * Image manager interface — factory for creating IImage instances.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/IImageManager.cs
 */
export interface IImageManager {
  createImage(width: number, height: number): IImage;
}
