export enum DicomQueryRetrieveLevel {
  NotApplicable = -1,
  Patient = 0,
  Study = 1,
  Series = 2,
  Image = 3,
  Worklist = 4,
}

const QUERY_RETRIEVE_LEVEL_MAP = new Map<string, DicomQueryRetrieveLevel>([
  ["PATIENT", DicomQueryRetrieveLevel.Patient],
  ["STUDY", DicomQueryRetrieveLevel.Study],
  ["SERIES", DicomQueryRetrieveLevel.Series],
  ["IMAGE", DicomQueryRetrieveLevel.Image],
  ["WORKLIST", DicomQueryRetrieveLevel.Worklist],
]);

export function parseQueryRetrieveLevel(value: string | null | undefined): DicomQueryRetrieveLevel {
  if (!value) {
    return DicomQueryRetrieveLevel.NotApplicable;
  }

  return QUERY_RETRIEVE_LEVEL_MAP.get(value.trim().toUpperCase()) ?? DicomQueryRetrieveLevel.NotApplicable;
}

export function queryRetrieveLevelToString(level: DicomQueryRetrieveLevel): string | null {
  switch (level) {
    case DicomQueryRetrieveLevel.Patient:
      return "PATIENT";
    case DicomQueryRetrieveLevel.Study:
      return "STUDY";
    case DicomQueryRetrieveLevel.Series:
      return "SERIES";
    case DicomQueryRetrieveLevel.Image:
      return "IMAGE";
    case DicomQueryRetrieveLevel.Worklist:
      return "WORKLIST";
    default:
      return null;
  }
}
