import * as Tags from "../core/DicomTag.generated.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomMessage } from "./DicomMessage.js";
import { DicomRequest } from "./DicomRequest.js";

/**
 * Base class for DIMSE response messages.
 */
export abstract class DicomResponse extends DicomMessage {
  protected constructor(command: DicomDataset);
  protected constructor(request: DicomRequest, status: number);
  protected constructor(commandOrRequest: DicomDataset | DicomRequest, status = 0x0000) {
    if (commandOrRequest instanceof DicomDataset) {
      super(commandOrRequest);
      return;
    }

    super();
    this.presentationContext = commandOrRequest.presentationContext;
    this.type = ((commandOrRequest.type as number) | 0x8000) as DicomCommandField;
    this.sopClassUID = commandOrRequest.sopClassUID;
    this.requestMessageID = commandOrRequest.messageID;
    this.status = status;
  }

  get requestMessageID(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.MessageIDBeingRespondedTo, 0);
  }

  set requestMessageID(value: number) {
    this.command.addOrUpdateValue(Tags.MessageIDBeingRespondedTo, value);
  }

  get status(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.Status, 0x0000);
  }

  set status(value: number) {
    this.command.addOrUpdateValue(Tags.Status, value);
  }

  override toString(): string {
    return `${DicomMessage.toCommandName(this.type)} [${this.requestMessageID}]: 0x${this.status.toString(16).padStart(4, "0")}`;
  }
}
