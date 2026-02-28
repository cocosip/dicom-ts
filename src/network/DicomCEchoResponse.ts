import { DicomDataset } from "../dataset/DicomDataset.js";
import type { DicomCEchoRequest } from "./DicomCEchoRequest.js";
import { DicomResponse } from "./DicomResponse.js";

export class DicomCEchoResponse extends DicomResponse {
  constructor(command: DicomDataset);
  constructor(request: DicomCEchoRequest, status: number);
  constructor(commandOrRequest: DicomDataset | DicomCEchoRequest, status = 0x0000) {
    if (commandOrRequest instanceof DicomDataset) {
      super(commandOrRequest);
    } else {
      super(commandOrRequest, status);
    }
  }
}
