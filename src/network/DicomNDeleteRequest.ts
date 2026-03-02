import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomRequest } from "./DicomRequest.js";
import type { DicomResponse } from "./DicomResponse.js";
import type { DicomNDeleteResponse } from "./DicomNDeleteResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomNDeleteRequest extends DicomRequest {
  onResponseReceived?: (request: DicomNDeleteRequest, response: DicomNDeleteResponse) => void;

  constructor(command: DicomDataset);
  constructor(requestedSopClassUid: DicomUID, requestedSopInstanceUid: DicomUID);
  constructor(commandOrClassUid: DicomDataset | DicomUID, requestedSopInstanceUid?: DicomUID) {
    if (commandOrClassUid instanceof DicomDataset) {
      super(commandOrClassUid);
      return;
    }

    super(DicomCommandField.NDeleteRequest, commandOrClassUid);
    this.sopInstanceUID = requestedSopInstanceUid ?? null;
  }

  get sopInstanceUID(): DicomUID | null {
    return getUid(this.command, Tags.RequestedSOPInstanceUID);
  }

  private set sopInstanceUID(value: DicomUID | null) {
    setUid(this.command, Tags.RequestedSOPInstanceUID, value);
  }

  protected override postResponse(response: DicomResponse): void {
    this.onResponseReceived?.(this, response as DicomNDeleteResponse);
  }
}
