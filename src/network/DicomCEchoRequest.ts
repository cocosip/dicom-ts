import * as DicomUIDs from "../core/DicomUID.generated.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomRequest } from "./DicomRequest.js";
import type { DicomResponse } from "./DicomResponse.js";
import type { DicomCEchoResponse } from "./DicomCEchoResponse.js";

export class DicomCEchoRequest extends DicomRequest {
  onResponseReceived?: (request: DicomCEchoRequest, response: DicomCEchoResponse) => void;

  constructor(command: DicomDataset);
  constructor();
  constructor(command?: DicomDataset) {
    if (command) {
      super(command);
    } else {
      super(DicomCommandField.CEchoRequest, DicomUIDs.Verification);
    }
  }

  protected override postResponse(response: DicomResponse): void {
    this.onResponseReceived?.(this, response as DicomCEchoResponse);
  }
}
