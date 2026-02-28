import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import type { DicomCStoreRequest } from "./DicomCStoreRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomCStoreResponse extends DicomResponse {
  constructor(command: DicomDataset);
  constructor(request: DicomCStoreRequest, status: number);
  constructor(commandOrRequest: DicomDataset | DicomCStoreRequest, status = 0x0000) {
    if (commandOrRequest instanceof DicomDataset) {
      super(commandOrRequest);
    } else {
      super(commandOrRequest, status);
      this.affectedSOPInstanceUID = commandOrRequest.sopInstanceUID;
    }
  }

  get affectedSOPInstanceUID(): DicomUID | null {
    return getUid(this.command, Tags.AffectedSOPInstanceUID);
  }

  set affectedSOPInstanceUID(value: DicomUID | null) {
    setUid(this.command, Tags.AffectedSOPInstanceUID, value);
  }
}
