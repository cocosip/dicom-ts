/**
 * DICOM status code definitions and lookup helpers.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Network/DicomStatus.cs
 */

export enum DicomState {
  Success = "Success",
  Cancel = "Cancel",
  Pending = "Pending",
  Warning = "Warning",
  Failure = "Failure",
}

export class DicomStatus {
  readonly code: number;
  readonly state: DicomState;
  readonly description: string;
  readonly errorComment: string | null;

  private readonly mask: number;

  constructor(code: string, state: DicomState, description: string, errorComment?: string);
  constructor(status: DicomStatus, errorComment: string);
  constructor(code: number, baseStatus: DicomStatus);
  constructor(
    codeOrStatus: string | DicomStatus | number,
    stateOrCommentOrBase: DicomState | string | DicomStatus,
    description?: string,
    errorComment?: string,
  ) {
    if (codeOrStatus instanceof DicomStatus && typeof stateOrCommentOrBase === "string") {
      this.code = codeOrStatus.code;
      this.state = codeOrStatus.state;
      this.description = codeOrStatus.description;
      this.errorComment = stateOrCommentOrBase;
      this.mask = 0xffff;
      return;
    }

    if (typeof codeOrStatus === "number" && stateOrCommentOrBase instanceof DicomStatus) {
      this.code = codeOrStatus & 0xffff;
      this.state = stateOrCommentOrBase.state;
      this.description = stateOrCommentOrBase.description;
      this.errorComment = stateOrCommentOrBase.errorComment;
      this.mask = stateOrCommentOrBase.mask;
      return;
    }

    if (typeof codeOrStatus !== "string" || typeof stateOrCommentOrBase !== "string") {
      throw new Error("Invalid DicomStatus constructor arguments");
    }

    this.code = parseCodePattern(codeOrStatus);
    this.mask = createMask(codeOrStatus);
    this.state = stateOrCommentOrBase as DicomState;
    this.description = description ?? "";
    this.errorComment = errorComment ?? null;
  }

  toString(): string {
    if (this.state === DicomState.Warning || this.state === DicomState.Failure) {
      const formatted = `${this.state} [${formatCode(this.code)}: ${this.description}]`;
      return this.errorComment ? `${formatted} -> ${this.errorComment}` : formatted;
    }
    return this.description;
  }

  equals(other: unknown): boolean {
    if (!(other instanceof DicomStatus)) return false;
    return DicomStatus.areEqual(this, other);
  }

  hashCode(): number {
    let hash = 17;
    hash = hash * 31 + this.code;
    hash = hash * 31 + this.state.charCodeAt(0);
    hash = hash * 31 + hashString(this.description);
    hash = hash * 31 + hashString(this.errorComment ?? "");
    hash = hash * 31 + this.mask;
    return hash | 0;
  }

  static areEqual(s1: DicomStatus | null | undefined, s2: DicomStatus | null | undefined): boolean {
    if (!s1 || !s2) return !s1 && !s2;
    return (s1.code & s2.mask) === (s2.code & s1.mask);
  }

  static readonly Success = new DicomStatus("0000", DicomState.Success, "Success");
  static readonly Cancel = new DicomStatus("FE00", DicomState.Cancel, "Cancel");
  static readonly Pending = new DicomStatus("FF00", DicomState.Pending, "Pending");
  static readonly Warning = new DicomStatus("0001", DicomState.Warning, "Warning");
  static readonly WarningClass = new DicomStatus("Bxxx", DicomState.Warning, "Warning Class");
  static readonly AttributeListError = new DicomStatus("0107", DicomState.Warning, "Attribute list error");
  static readonly AttributeValueOutOfRange = new DicomStatus("0116", DicomState.Warning, "Attribute Value Out of Range");
  static readonly SOPClassNotSupported = new DicomStatus("0122", DicomState.Failure, "Refused: SOP class not supported");
  static readonly ClassInstanceConflict = new DicomStatus("0119", DicomState.Failure, "Class-instance conflict");
  static readonly DuplicateSOPInstance = new DicomStatus("0111", DicomState.Failure, "Duplicate SOP instance");
  static readonly DuplicateInvocation = new DicomStatus("0210", DicomState.Failure, "Duplicate invocation");
  static readonly InvalidArgumentValue = new DicomStatus("0115", DicomState.Failure, "Invalid argument value");
  static readonly InvalidAttributeValue = new DicomStatus("0106", DicomState.Failure, "Invalid attribute value");
  static readonly InvalidObjectInstance = new DicomStatus("0117", DicomState.Failure, "Invalid object instance");
  static readonly MissingAttribute = new DicomStatus("0120", DicomState.Failure, "Missing attribute");
  static readonly MissingAttributeValue = new DicomStatus("0121", DicomState.Failure, "Missing attribute value");
  static readonly MistypedArgument = new DicomStatus("0212", DicomState.Failure, "Mistyped argument");
  static readonly NoSuchArgument = new DicomStatus("0114", DicomState.Failure, "No such argument");
  static readonly NoSuchEventType = new DicomStatus("0113", DicomState.Failure, "No such event type");
  static readonly NoSuchObjectInstance = new DicomStatus("0112", DicomState.Failure, "No Such object instance");
  static readonly NoSuchSOPClass = new DicomStatus("0118", DicomState.Failure, "No Such SOP class");
  static readonly ProcessingFailure = new DicomStatus("0110", DicomState.Failure, "Processing failure");
  static readonly ResourceLimitation = new DicomStatus("0213", DicomState.Failure, "Resource limitation");
  static readonly UnrecognizedOperation = new DicomStatus("0211", DicomState.Failure, "Unrecognized operation");
  static readonly NoSuchActionType = new DicomStatus("0123", DicomState.Failure, "No such action type");
  static readonly StorageStorageOutOfResources = new DicomStatus("A7xx", DicomState.Failure, "Out of Resources");
  static readonly StorageDataSetDoesNotMatchSOPClassError = new DicomStatus("A9xx", DicomState.Failure, "Data Set does not match SOP Class (Error)");
  static readonly StorageCannotUnderstand = new DicomStatus("Cxxx", DicomState.Failure, "Cannot understand");
  static readonly StorageCoercionOfDataElements = new DicomStatus("B000", DicomState.Warning, "Coercion of Data Elements");
  static readonly StorageDataSetDoesNotMatchSOPClassWarning = new DicomStatus("B007", DicomState.Warning, "Data Set does not match SOP Class (Warning)");
  static readonly StorageElementsDiscarded = new DicomStatus("B006", DicomState.Warning, "Elements Discarded");
  static readonly QueryRetrieveOutOfResources = new DicomStatus("A700", DicomState.Failure, "Out of Resources");
  static readonly QueryRetrieveUnableToCalculateNumberOfMatches = new DicomStatus("A701", DicomState.Failure, "Unable to calculate number of matches");
  static readonly QueryRetrieveUnableToPerformSuboperations = new DicomStatus("A702", DicomState.Failure, "Unable to perform suboperations");
  static readonly QueryRetrieveMoveDestinationUnknown = new DicomStatus("A801", DicomState.Failure, "Move Destination unknown");
  static readonly QueryRetrieveIdentifierDoesNotMatchSOPClass = new DicomStatus("A900", DicomState.Failure, "Identifier does not match SOP Class");
  static readonly QueryRetrieveUnableToProcess = new DicomStatus("Cxxx", DicomState.Failure, "Unable to process");
  static readonly QueryRetrieveOptionalKeysNotSupported = new DicomStatus("FF01", DicomState.Pending, "Optional Keys Not Supported");
  static readonly QueryRetrieveSubOpsOneOrMoreFailures = new DicomStatus("B000", DicomState.Warning, "Sub-operations Complete - One or more Failures");
  static readonly PrintManagementMemoryAllocationNotSupported = new DicomStatus("B000", DicomState.Warning, "Memory allocation not supported");
  static readonly PrintManagementFilmSessionPrintingNotSupported = new DicomStatus("B601", DicomState.Warning, "Film session printing (collation) is not supported");
  static readonly PrintManagementFilmSessionEmptyPage = new DicomStatus("B602", DicomState.Warning, "Film session SOP instance hierarchy does not contain image box SOP instances (empty page)");
  static readonly PrintManagementFilmBoxEmptyPage = new DicomStatus("B603", DicomState.Warning, "Film box SOP instance hierarchy does not contain image box SOP instances (empty page)");
  static readonly PrintManagementImageDemagnified = new DicomStatus("B604", DicomState.Warning, "Image size is larger than image box size, the image has been demagnified");
  static readonly PrintManagementMinMaxDensityOutOfRange = new DicomStatus("B605", DicomState.Warning, "Requested min density or max density outside of printer's operating range");
  static readonly PrintManagementImageCropped = new DicomStatus("B609", DicomState.Warning, "Image size is larger than the image box size, the Image has been cropped to fit");
  static readonly PrintManagementImageDecimated = new DicomStatus("B60A", DicomState.Warning, "Image size or combined print image size is larger than the image box size, image or combined print image has been decimated to fit");
  static readonly PrintManagementFilmSessionEmpty = new DicomStatus("C600", DicomState.Failure, "Film session SOP instance hierarchy does not contain film box SOP instances");
  static readonly PrintManagementPrintQueueFull = new DicomStatus("C601", DicomState.Failure, "Unable to create Print Job SOP Instance; print queue is full");
  static readonly PrintManagementImageLargerThanImageBox = new DicomStatus("C603", DicomState.Failure, "Image size is larger than image box size");
  static readonly PrintManagementInsufficientMemoryInPrinter = new DicomStatus("C605", DicomState.Failure, "Insufficient memory in printer to store the image");
  static readonly PrintManagementCombinedImageLargerThanImageBox = new DicomStatus("C613", DicomState.Failure, "Combined Print Image size is larger than the Image Box size");
  static readonly PrintManagementExistingFilmBoxNotPrinted = new DicomStatus("C616", DicomState.Failure, "There is an existing film box that has not been printed and N-ACTION at the Film Session level is not supported.");
  static readonly MediaCreationManagementDuplicateInitiateMediaCreation = new DicomStatus("A510", DicomState.Failure, "Refused because an Initiate Media Creation action has already been received for this SOP Instance");
  static readonly MediaCreationManagementMediaCreationRequestAlreadyCompleted = new DicomStatus("C201", DicomState.Failure, "Media creation request already completed");
  static readonly MediaCreationManagementMediaCreationRequestAlreadyInProgress = new DicomStatus("C202", DicomState.Failure, "Media creation request already in progress and cannot be interrupted");
  static readonly MediaCreationManagementCancellationDeniedForUnspecifiedReason = new DicomStatus("C203", DicomState.Failure, "Cancellation denied for unspecified reason");

  private static entries: DicomStatus[] = [];

  static lookup(code: number): DicomStatus {
    const normalized = code & 0xffff;
    for (const status of DicomStatus.entries) {
      if (status.code === (normalized & status.mask)) {
        return new DicomStatus(normalized, status);
      }
    }
    return DicomStatus.ProcessingFailure;
  }

  static addKnownDicomStatuses(statuses: Iterable<DicomStatus>): void {
    for (const status of statuses) {
      DicomStatus.entries.push(status);
    }
    DicomStatus.sortEntries();
  }

  static resetEntries(): void {
    DicomStatus.entries = [
      DicomStatus.Success,
      DicomStatus.Cancel,
      DicomStatus.Pending,
      DicomStatus.Warning,
      DicomStatus.WarningClass,
      DicomStatus.AttributeListError,
      DicomStatus.AttributeValueOutOfRange,
      DicomStatus.SOPClassNotSupported,
      DicomStatus.ClassInstanceConflict,
      DicomStatus.DuplicateSOPInstance,
      DicomStatus.DuplicateInvocation,
      DicomStatus.InvalidArgumentValue,
      DicomStatus.InvalidAttributeValue,
      DicomStatus.InvalidObjectInstance,
      DicomStatus.MissingAttribute,
      DicomStatus.MissingAttributeValue,
      DicomStatus.MistypedArgument,
      DicomStatus.NoSuchArgument,
      DicomStatus.NoSuchEventType,
      DicomStatus.NoSuchObjectInstance,
      DicomStatus.NoSuchSOPClass,
      DicomStatus.ProcessingFailure,
      DicomStatus.ResourceLimitation,
      DicomStatus.UnrecognizedOperation,
      DicomStatus.NoSuchActionType,
      DicomStatus.StorageStorageOutOfResources,
      DicomStatus.StorageDataSetDoesNotMatchSOPClassError,
      DicomStatus.StorageCannotUnderstand,
      DicomStatus.StorageCoercionOfDataElements,
      DicomStatus.StorageDataSetDoesNotMatchSOPClassWarning,
      DicomStatus.StorageElementsDiscarded,
      DicomStatus.QueryRetrieveOutOfResources,
      DicomStatus.QueryRetrieveUnableToCalculateNumberOfMatches,
      DicomStatus.QueryRetrieveUnableToPerformSuboperations,
      DicomStatus.QueryRetrieveMoveDestinationUnknown,
      DicomStatus.QueryRetrieveIdentifierDoesNotMatchSOPClass,
      DicomStatus.QueryRetrieveUnableToProcess,
      DicomStatus.QueryRetrieveOptionalKeysNotSupported,
      DicomStatus.QueryRetrieveSubOpsOneOrMoreFailures,
      DicomStatus.PrintManagementMemoryAllocationNotSupported,
      DicomStatus.PrintManagementFilmSessionPrintingNotSupported,
      DicomStatus.PrintManagementFilmSessionEmptyPage,
      DicomStatus.PrintManagementFilmBoxEmptyPage,
      DicomStatus.PrintManagementImageDemagnified,
      DicomStatus.PrintManagementMinMaxDensityOutOfRange,
      DicomStatus.PrintManagementImageCropped,
      DicomStatus.PrintManagementImageDecimated,
      DicomStatus.PrintManagementFilmSessionEmpty,
      DicomStatus.PrintManagementPrintQueueFull,
      DicomStatus.PrintManagementImageLargerThanImageBox,
      DicomStatus.PrintManagementInsufficientMemoryInPrinter,
      DicomStatus.PrintManagementCombinedImageLargerThanImageBox,
      DicomStatus.PrintManagementExistingFilmBoxNotPrinted,
      DicomStatus.MediaCreationManagementDuplicateInitiateMediaCreation,
      DicomStatus.MediaCreationManagementMediaCreationRequestAlreadyCompleted,
      DicomStatus.MediaCreationManagementMediaCreationRequestAlreadyInProgress,
      DicomStatus.MediaCreationManagementCancellationDeniedForUnspecifiedReason,
    ];
    DicomStatus.sortEntries();
  }

  private static sortEntries(): void {
    DicomStatus.entries.sort((a, b) => countBits(b.mask) - countBits(a.mask));
  }
}

function parseCodePattern(code: string): number {
  return parseInt(code.replace(/[xX]/g, "0"), 16);
}

function createMask(code: string): number {
  const maskText = code
    .toLowerCase()
    .replace(/[0-9a-f]/g, "F")
    .replace(/x/g, "0");
  return parseInt(maskText, 16);
}

function countBits(value: number): number {
  let count = 0;
  for (let i = 0; i < 16; i++) {
    if ((value & (1 << i)) !== 0) count++;
  }
  return count;
}

function formatCode(code: number): string {
  return (code & 0xffff).toString(16).padStart(4, "0");
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return hash;
}

DicomStatus.resetEntries();
