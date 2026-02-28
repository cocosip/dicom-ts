import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomPresentationContext } from "./DicomPresentationContext.js";
import { DicomServiceApplicationInfo } from "./DicomServiceApplicationInfo.js";
import { getUid, setUid } from "./utils.js";

/**
 * Base class for DIMSE-C and DIMSE-N message payloads.
 */
export class DicomMessage {
  private datasetValue: DicomDataset | null;

  presentationContext: DicomPresentationContext | null = null;
  applicationInfo: DicomServiceApplicationInfo | null = null;
  userState: unknown;

  pendingSince: Date | null = null;
  lastPDUSent: Date | null = null;
  lastPendingResponseReceived: Date | null = null;

  readonly command: DicomDataset;

  constructor(command?: DicomDataset) {
    this.command = command ?? new DicomDataset();
    this.datasetValue = null;
    this.dataset = null;
  }

  get type(): DicomCommandField {
    const value = this.command.getSingleValueOrDefault<number>(Tags.CommandField, 0);
    return value as DicomCommandField;
  }

  protected set type(value: DicomCommandField) {
    this.command.addOrUpdateValue(Tags.CommandField, value as number);
  }

  get sopClassUID(): DicomUID | null {
    switch (this.type) {
      case DicomCommandField.NGetRequest:
      case DicomCommandField.NSetRequest:
      case DicomCommandField.NActionRequest:
      case DicomCommandField.NDeleteRequest:
        return getUid(this.command, Tags.RequestedSOPClassUID);
      case DicomCommandField.CStoreRequest:
      case DicomCommandField.CFindRequest:
      case DicomCommandField.CGetRequest:
      case DicomCommandField.CMoveRequest:
      case DicomCommandField.CEchoRequest:
      case DicomCommandField.NEventReportRequest:
      case DicomCommandField.NCreateRequest:
        return getUid(this.command, Tags.AffectedSOPClassUID);
      default:
        return getUid(this.command, Tags.AffectedSOPClassUID);
    }
  }

  protected set sopClassUID(value: DicomUID | null) {
    switch (this.type) {
      case DicomCommandField.NGetRequest:
      case DicomCommandField.NSetRequest:
      case DicomCommandField.NActionRequest:
      case DicomCommandField.NDeleteRequest:
        setUid(this.command, Tags.RequestedSOPClassUID, value);
        break;
      default:
        setUid(this.command, Tags.AffectedSOPClassUID, value);
        break;
    }
  }

  get hasDataset(): boolean {
    return this.command.getSingleValueOrDefault<number>(Tags.CommandDataSetType, 0x0101) !== 0x0101;
  }

  get dataset(): DicomDataset | null {
    return this.datasetValue;
  }

  set dataset(value: DicomDataset | null) {
    this.datasetValue = value;
    this.command.addOrUpdateValue(Tags.CommandDataSetType, value ? 0x0202 : 0x0101);
  }

  isTimedOut(timeout: number): boolean {
    const now = Date.now();
    if (this.lastPendingResponseReceived) {
      return this.lastPendingResponseReceived.getTime() + timeout < now;
    }
    if (this.lastPDUSent) {
      return this.lastPDUSent.getTime() + timeout < now;
    }
    if (this.pendingSince) {
      return this.pendingSince.getTime() + timeout < now;
    }
    return false;
  }

  toString(): string {
    const messageId = DicomMessage.isRequest(this.type)
      ? this.command.getSingleValueOrDefault<number>(Tags.MessageID, 0)
      : this.command.getSingleValueOrDefault<number>(Tags.MessageIDBeingRespondedTo, 0);
    return `${DicomMessage.toCommandName(this.type)} [${messageId}]`;
  }

  static toCommandName(type: DicomCommandField): string {
    switch (type) {
      case DicomCommandField.CCancelRequest:
        return "C-Cancel request";
      case DicomCommandField.CEchoRequest:
        return "C-Echo request";
      case DicomCommandField.CEchoResponse:
        return "C-Echo response";
      case DicomCommandField.CFindRequest:
        return "C-Find request";
      case DicomCommandField.CFindResponse:
        return "C-Find response";
      case DicomCommandField.CGetRequest:
        return "C-Get request";
      case DicomCommandField.CGetResponse:
        return "C-Get response";
      case DicomCommandField.CMoveRequest:
        return "C-Move request";
      case DicomCommandField.CMoveResponse:
        return "C-Move response";
      case DicomCommandField.CStoreRequest:
        return "C-Store request";
      case DicomCommandField.CStoreResponse:
        return "C-Store response";
      case DicomCommandField.NActionRequest:
        return "N-Action request";
      case DicomCommandField.NActionResponse:
        return "N-Action response";
      case DicomCommandField.NCreateRequest:
        return "N-Create request";
      case DicomCommandField.NCreateResponse:
        return "N-Create response";
      case DicomCommandField.NDeleteRequest:
        return "N-Delete request";
      case DicomCommandField.NDeleteResponse:
        return "N-Delete response";
      case DicomCommandField.NEventReportRequest:
        return "N-EventReport request";
      case DicomCommandField.NEventReportResponse:
        return "N-EventReport response";
      case DicomCommandField.NGetRequest:
        return "N-Get request";
      case DicomCommandField.NGetResponse:
        return "N-Get response";
      case DicomCommandField.NSetRequest:
        return "N-Set request";
      case DicomCommandField.NSetResponse:
        return "N-Set response";
      default:
        return "DIMSE";
    }
  }

  static isRequest(type: DicomCommandField): boolean {
    return ((type as number) & 0x8000) === 0;
  }
}
