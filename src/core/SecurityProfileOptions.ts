/**
 * DICOM PS 3.15 confidentiality profile options.
 *
 * Flag order is intentionally aligned with profile CSV columns.
 */
export enum SecurityProfileOptions {
  BasicProfile = 1,
  RetainSafePrivate = 2,
  RetainUIDs = 4,
  RetainDeviceIdent = 8,
  RetainInstitutionIdent = 16,
  RetainPatientChars = 32,
  RetainLongFullDates = 64,
  RetainLongModifDates = 128,
  CleanDesc = 256,
  CleanStructdCont = 512,
  CleanGraph = 1024,
}

export const SECURITY_PROFILE_OPTION_COUNT = 11;
