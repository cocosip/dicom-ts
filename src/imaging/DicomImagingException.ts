
/**
 * DicomImage operations related exceptions.
 */
export class DicomImagingException extends Error {
  constructor(message: string, options?: any) {
    // @ts-ignore
    super(message, options);
    this.name = "DicomImagingException";
  }
}
