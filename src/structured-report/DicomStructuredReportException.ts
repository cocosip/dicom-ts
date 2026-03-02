
export class DicomStructuredReportException extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "DicomStructuredReportException";
    if (options && "cause" in options) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}
