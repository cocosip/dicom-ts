import type { DicomDataset } from "../../dataset/DicomDataset.js";

export interface IDicomTranscoder {
  transcode(dataset: DicomDataset): DicomDataset;
}
