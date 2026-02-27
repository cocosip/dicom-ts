/**
 * Convenience helpers for DICOM JSON conversion.
 */
import type { DicomDataset } from "../dataset/DicomDataset.js";
import {
  DicomJsonConverter,
  type DicomJsonConverterOptions,
  type DicomJsonObject,
  datasetToObject,
  objectToDataset,
} from "./DicomJsonConverter.js";

export interface DicomJsonSerializeOptions extends DicomJsonConverterOptions {
  formatIndented?: boolean;
}

export function convertDicomToJson(
  dataset: DicomDataset,
  options: DicomJsonSerializeOptions = {}
): string {
  const conv = new DicomJsonConverter(options);
  return conv.toJson(dataset, options.formatIndented ?? false);
}

export function convertDicomToJsonArray(
  datasets: Iterable<DicomDataset>,
  options: DicomJsonSerializeOptions = {}
): string {
  const writeTagsAsKeywords = options.writeTagsAsKeywords ?? false;
  const obj = Array.from(datasets, (ds) => datasetToObject(ds, writeTagsAsKeywords));
  return JSON.stringify(obj, null, options.formatIndented ? 2 : undefined);
}

export function convertJsonToDicom(
  json: string,
  options: DicomJsonConverterOptions = {}
): DicomDataset {
  const conv = new DicomJsonConverter(options);
  return conv.fromJson(json);
}

export function convertJsonToDicomArray(
  json: string,
  options: DicomJsonConverterOptions = {}
): DicomDataset[] {
  const parsed = JSON.parse(json) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("JSON root must be an array of DICOM datasets");
  }
  return parsed.map((obj) => objectToDataset(obj as DicomJsonObject, options));
}
