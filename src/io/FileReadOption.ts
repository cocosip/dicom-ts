/**
 * Strategy for handling large tag values during read.
 * Mirrors fo-dicom FileReadOption.
 */
export enum FileReadOption {
  Default = 0,
  ReadAll = 1,
  ReadLargeOnDemand = 2,
  SkipLargeTags = 3,
}

export function normalizeReadOption(option: FileReadOption): FileReadOption {
  return option === FileReadOption.Default ? FileReadOption.ReadLargeOnDemand : option;
}
