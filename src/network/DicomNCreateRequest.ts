import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomRequest } from "./DicomRequest.js";
import type { DicomResponse } from "./DicomResponse.js";
import type { DicomNCreateResponse } from "./DicomNCreateResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomNCreateRequest extends DicomRequest {
  onResponseReceived?: (request: DicomNCreateRequest, response: DicomNCreateResponse) => void;

  constructor(command: DicomDataset);
  constructor(affectedSopClassUid: DicomUID, affectedSopInstanceUid?: DicomUID);
  constructor(commandOrClassUid: DicomDataset | DicomUID, affectedSopInstanceUid: DicomUID | null = null) {
    if (commandOrClassUid instanceof DicomDataset) {
      super(commandOrClassUid);
      return;
    }

    super(DicomCommandField.NCreateRequest, commandOrClassUid);
    this.sopInstanceUID = affectedSopInstanceUid;
  }

  get sopInstanceUID(): DicomUID | null {
    return getUid(this.command, Tags.AffectedSOPInstanceUID);
  }

  private set sopInstanceUID(value: DicomUID | null) {
    setUid(this.command, Tags.AffectedSOPInstanceUID, value);
  }

  protected override postResponse(response: DicomResponse): void {
    this.onResponseReceived?.(this, response as DicomNCreateResponse);
  }
}
