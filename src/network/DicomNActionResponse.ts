import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import type { DicomNActionRequest } from "./DicomNActionRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomNActionResponse extends DicomResponse {
  constructor(command: DicomDataset);
  constructor(request: DicomNActionRequest, status: number);
  constructor(commandOrRequest: DicomDataset | DicomNActionRequest, status = 0x0000) {
    if (commandOrRequest instanceof DicomDataset) {
      super(commandOrRequest);
    } else {
      super(commandOrRequest, status);
      this.sopInstanceUID = commandOrRequest.sopInstanceUID;
      this.actionTypeID = commandOrRequest.actionTypeID;
    }
  }

  get sopInstanceUID(): DicomUID | null {
    return getUid(this.command, Tags.AffectedSOPInstanceUID);
  }

  private set sopInstanceUID(value: DicomUID | null) {
    setUid(this.command, Tags.AffectedSOPInstanceUID, value);
  }

  get actionTypeID(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.ActionTypeID, 0);
  }

  private set actionTypeID(value: number) {
    this.command.addOrUpdateValue(Tags.ActionTypeID, value);
  }

  override toString(): string {
    const base = super.toString();
    if (!this.command.contains(Tags.ActionTypeID)) {
      return base;
    }
    return `${base}\n\t\tAction Type:\t${this.actionTypeID.toString(16).padStart(4, "0")}`;
  }
}
