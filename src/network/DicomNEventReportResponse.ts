import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import type { DicomNEventReportRequest } from "./DicomNEventReportRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomNEventReportResponse extends DicomResponse {
  constructor(command: DicomDataset);
  constructor(request: DicomNEventReportRequest, status: number);
  constructor(commandOrRequest: DicomDataset | DicomNEventReportRequest, status = 0x0000) {
    if (commandOrRequest instanceof DicomDataset) {
      super(commandOrRequest);
    } else {
      super(commandOrRequest, status);
      this.sopInstanceUID = commandOrRequest.sopInstanceUID;
      this.eventTypeID = commandOrRequest.eventTypeID;
    }
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

  override toString(): string {
    const base = super.toString();
    if (!this.command.contains(Tags.EventTypeID)) {
      return base;
    }
    return `${base}\n\t\tEvent Type:\t${this.eventTypeID.toString(16).padStart(4, "0")}`;
  }
}
