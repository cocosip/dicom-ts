
export enum NumberSerializationMode {
  /**
   * Serialize DICOM numbers (IS, DS, SV, UV) as JSON numbers.
   */
  PreferJsonNumber = 0,
  /**
   * Serialize DICOM numbers (IS, DS, SV, UV) as JSON strings.
   */
  PreferJsonString = 1,
}

export class DicomJsonOptions {
  /**
   * Gets or sets whether DICOM tags are written as keywords (e.g. "PatientName") or tags (e.g. "00100010").
   */
  public writeTagsAsKeywords: boolean = false;

  /**
   * Gets or sets how numbers (IS, DS, SV, UV) are serialized.
   */
  public numberSerializationMode: NumberSerializationMode = NumberSerializationMode.PreferJsonNumber;

  /**
   * Gets or sets whether to format the JSON output.
   */
  public format: boolean = false;

  /**
   * Gets or sets whether to auto-validate the DICOM dataset before serialization.
   */
  public autoValidate: boolean = true;
}
