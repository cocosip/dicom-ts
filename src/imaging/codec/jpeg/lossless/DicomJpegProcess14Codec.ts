import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import { JpegProcess14CodecCore } from "../common/JpegProcess14Common.js";

/**
 * JPEG Lossless Process 14 (1.2.840.10008.1.2.4.57) codec.
 */
export class DicomJpegProcess14Codec extends JpegProcess14CodecCore {
  constructor() {
    super(DicomTransferSyntax.JPEGProcess14);
  }
}
