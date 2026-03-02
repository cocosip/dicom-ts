import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomRequest } from "./DicomRequest.js";
import type { DicomResponse } from "./DicomResponse.js";
import type { DicomNEventReportResponse } from "./DicomNEventReportResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomNEventReportRequest extends DicomRequest {
  onResponseReceived?: (request: DicomNEventReportRequest, response: DicomNEventReportResponse) => void;

  constructor(command: DicomDataset);
  constructor(affectedSopClassUid: DicomUID, affectedSopInstanceUid: DicomUID, eventTypeID: number);
  constructor(commandOrClassUid: DicomDataset | DicomUID, affectedSopInstanceUid?: DicomUID, eventTypeID = 0) {
    if (commandOrClassUid instanceof DicomDataset) {
      super(commandOrClassUid);
      return;
    }

    super(DicomCommandField.NEventReportRequest, commandOrClassUid);
    this.sopInstanceUID = affectedSopInstanceUid ?? null;
    this.eventTypeID = eventTypeID;
  }

  get sopInstanceUID(): DicomUID | null {
    return getUid(this.command, Tags.AffectedSOPInstanceUID);
  }

  private set sopInstanceUID(value: DicomUID | null) {
    setUid(this.command, Tags.AffectedSOPInstanceUID, value);
  }

  get eventTypeID(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.EventTypeID, 0);
  }

  private set eventTypeID(value: number) {
    this.command.addOrUpdateValue(Tags.EventTypeID, value);
  }

  protected override postResponse(response: DicomResponse): void {
    this.onResponseReceived?.(this, response as DicomNEventReportResponse);
  }

  override toString(): string {
    const base = super.toString();
    if (!this.command.contains(Tags.EventTypeID)) {
      return base;
    }
    return `${base}\n\t\tEvent Type:\t${this.eventTypeID.toString(16).padStart(4, "0")}`;
  }
}
