/**
 * Convenience helpers for DICOM XML conversion.
 */
import type { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomXmlConverter, type DicomXmlConverterOptions } from "./DicomXmlConverter.js";
import type { DicomFile } from "../DicomFile.js";

export function convertDicomToXml(
  dataset: DicomDataset,
  options: DicomXmlConverterOptions = {}
): string {
  return new DicomXmlConverter(options).toXml(dataset);
}

export function convertDicomFileToXml(
  file: DicomFile,
  options: DicomXmlConverterOptions = {}
): string {
  return new DicomXmlConverter(options).toXml(file.dataset);
}
