import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomRequest } from "./DicomRequest.js";
import type { DicomResponse } from "./DicomResponse.js";
import type { DicomNActionResponse } from "./DicomNActionResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomNActionRequest extends DicomRequest {
  onResponseReceived?: (request: DicomNActionRequest, response: DicomNActionResponse) => void;

  constructor(command: DicomDataset);
  constructor(requestedSopClassUid: DicomUID, requestedSopInstanceUid: DicomUID, actionTypeID: number);
  constructor(commandOrClassUid: DicomDataset | DicomUID, requestedSopInstanceUid?: DicomUID, actionTypeID = 0) {
    if (commandOrClassUid instanceof DicomDataset) {
      super(commandOrClassUid);
      return;
    }

    super(DicomCommandField.NActionRequest, commandOrClassUid);
    this.sopInstanceUID = requestedSopInstanceUid ?? null;
    this.actionTypeID = actionTypeID;
  }

  get sopInstanceUID(): DicomUID | null {
    return getUid(this.command, Tags.RequestedSOPInstanceUID);
  }

  private set sopInstanceUID(value: DicomUID | null) {
    setUid(this.command, Tags.RequestedSOPInstanceUID, value);
  }

  get actionTypeID(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.ActionTypeID, 0);
  }

  private set actionTypeID(value: number) {
    this.command.addOrUpdateValue(Tags.ActionTypeID, value);
  }

  protected override postResponse(response: DicomResponse): void {
    this.onResponseReceived?.(this, response as DicomNActionResponse);
  }

  override toString(): string {
    const base = super.toString();
    if (!this.command.contains(Tags.ActionTypeID)) {
      return base;
    }
    return `${base}\n\t\tAction Type:\t${this.actionTypeID.toString(16).padStart(4, "0")}`;
  }
}
