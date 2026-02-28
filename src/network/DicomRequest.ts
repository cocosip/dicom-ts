import * as Tags from "../core/DicomTag.generated.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomMessage } from "./DicomMessage.js";
import { DicomPresentationContext } from "./DicomPresentationContext.js";
import type { DicomResponse } from "./DicomResponse.js";

/**
 * Base class for DIMSE request messages.
 */
export abstract class DicomRequest extends DicomMessage {
  private static nextMessageId = 1;

  protected constructor(command: DicomDataset);
  protected constructor(type: DicomCommandField, requestedClassUid: DicomUID);
  protected constructor(commandOrType: DicomDataset | DicomCommandField, requestedClassUid?: DicomUID) {
    if (commandOrType instanceof DicomDataset) {
      super(commandOrType);
      return;
    }

    super();
    this.type = commandOrType;
    this.sopClassUID = requestedClassUid ?? null;
    this.messageID = DicomRequest.getNextMessageID();
    this.dataset = null;
  }

  get messageID(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.MessageID, 0);
  }

  protected set messageID(value: number) {
    this.command.addOrUpdateValue(Tags.MessageID, value);
  }

  protected abstract postResponse(response: DicomResponse): void;

  dispatchResponse(response: DicomResponse): void {
    this.postResponse(response);
  }

  createPresentationContext(...transferSyntaxes: DicomTransferSyntax[]): void {
    if (transferSyntaxes.length === 0) {
      throw new Error("Proposed transfer syntaxes cannot be empty");
    }

    const sopClassUid = this.sopClassUID;
    if (!sopClassUid) {
      throw new Error("Request SOP Class UID is not defined");
    }

    const presentationContext = new DicomPresentationContext(0, sopClassUid);
    for (const transferSyntax of transferSyntaxes) {
      presentationContext.addTransferSyntax(transferSyntax);
    }
    this.presentationContext = presentationContext;
  }

  private static getNextMessageID(): number {
    if (DicomRequest.nextMessageId >= 0xffff) {
      DicomRequest.nextMessageId = 1;
    }
    return DicomRequest.nextMessageId++;
  }
}
