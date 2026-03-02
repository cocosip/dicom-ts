import * as Tags from "../core/DicomTag.generated.js";
import { DicomTag } from "../core/DicomTag.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomRequest } from "./DicomRequest.js";
import type { DicomResponse } from "./DicomResponse.js";
import type { DicomNGetResponse } from "./DicomNGetResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomNGetRequest extends DicomRequest {
  onResponseReceived?: (request: DicomNGetRequest, response: DicomNGetResponse) => void;

  constructor(command: DicomDataset);
  constructor(requestedSopClassUid: DicomUID, requestedSopInstanceUid: DicomUID, attributes?: readonly DicomTag[]);
  constructor(
    commandOrClassUid: DicomDataset | DicomUID,
    requestedSopInstanceUid?: DicomUID,
    attributes: readonly DicomTag[] = [],
  ) {
    if (commandOrClassUid instanceof DicomDataset) {
      super(commandOrClassUid);
      return;
    }

    super(DicomCommandField.NGetRequest, commandOrClassUid);
    this.sopInstanceUID = requestedSopInstanceUid ?? null;
    this.attributes = attributes;
  }

  get sopInstanceUID(): DicomUID | null {
    return getUid(this.command, Tags.RequestedSOPInstanceUID);
  }

  private set sopInstanceUID(value: DicomUID | null) {
    setUid(this.command, Tags.RequestedSOPInstanceUID, value);
  }

  get attributes(): DicomTag[] | null {
    return this.command.tryGetValues<DicomTag>(Tags.AttributeIdentifierList) ?? null;
  }

  private set attributes(value: readonly DicomTag[] | null) {
    if (!value || value.length === 0) {
      this.command.remove(Tags.AttributeIdentifierList);
      return;
    }
    this.command.addOrUpdateValue(Tags.AttributeIdentifierList, ...value);
  }

  protected override postResponse(response: DicomResponse): void {
    this.onResponseReceived?.(this, response as DicomNGetResponse);
  }
}
