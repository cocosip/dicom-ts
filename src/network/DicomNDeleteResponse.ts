import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import type { DicomNDeleteRequest } from "./DicomNDeleteRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomNDeleteResponse extends DicomResponse {
  constructor(command: DicomDataset);
  constructor(request: DicomNDeleteRequest, status: number);
  constructor(commandOrRequest: DicomDataset | DicomNDeleteRequest, status = 0x0000) {
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
