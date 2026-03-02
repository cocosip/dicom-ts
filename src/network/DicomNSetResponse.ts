import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import type { DicomNSetRequest } from "./DicomNSetRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomNSetResponse extends DicomResponse {
  constructor(command: DicomDataset);
  constructor(request: DicomNSetRequest, status: number);
  constructor(commandOrRequest: DicomDataset | DicomNSetRequest, status = 0x0000) {
    if (commandOrRequest instanceof DicomDataset) {
      super(commandOrRequest);
    } else {
      super(commandOrRequest, status);
      this.sopInstanceUID = commandOrRequest.sopInstanceUID;
    }
  }

  get sopInstanceUID(): DicomUID | null {
    return getUid(this.command, Tags.AffectedSOPInstanceUID);
  }

  private set sopInstanceUID(value: DicomUID | null) {
    setUid(this.command, Tags.AffectedSOPInstanceUID, value);
  }
}
