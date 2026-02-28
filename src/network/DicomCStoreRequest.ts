import * as Tags from "../core/DicomTag.generated.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomFile } from "../DicomFile.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { notValidated } from "../dataset/DicomDatasetExtensions.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomPriority } from "./DicomPriority.js";
import { DicomPriorityRequest } from "./DicomPriorityRequest.js";
import type { DicomResponse } from "./DicomResponse.js";
import type { DicomCStoreResponse } from "./DicomCStoreResponse.js";
import { getUid, setUid } from "./utils.js";

export class DicomCStoreRequest extends DicomPriorityRequest {
  file: DicomFile | null;
  additionalTransferSyntaxes: DicomTransferSyntax[] | null;
  omitImplicitVrTransferSyntaxInAssociationRequest: boolean;
  commonServiceClassUid: DicomUID | null;
  relatedGeneralSopClasses: DicomUID[];

  onResponseReceived?: (request: DicomCStoreRequest, response: DicomCStoreResponse) => void;

  constructor(command: DicomDataset);
  constructor(file: DicomFile, priority?: DicomPriority);
  constructor(commandOrFile: DicomDataset | DicomFile, priority: DicomPriority = DicomPriority.Medium) {
    let file: DicomFile | null = null;
    let sopClassUid: DicomUID | null = null;
    if (commandOrFile instanceof DicomFile) {
      file = commandOrFile;
      sopClassUid = getUid(commandOrFile.dataset, Tags.SOPClassUID);
      if (!sopClassUid) {
        throw new Error("C-STORE request requires SOP Class UID in dataset");
      }
    }

    if (commandOrFile instanceof DicomDataset) {
      super(commandOrFile);
    } else {
      super(DicomCommandField.CStoreRequest, sopClassUid as DicomUID, priority);
    }

    this.file = null;
    this.additionalTransferSyntaxes = null;
    this.omitImplicitVrTransferSyntaxInAssociationRequest = false;
    this.commonServiceClassUid = null;
    this.relatedGeneralSopClasses = [];

    if (file) {
      this.file = file;
      this.dataset = notValidated(file.dataset);
      this.sopInstanceUID = getUid(file.dataset, Tags.SOPInstanceUID);
    }
  }

  get sopInstanceUID(): DicomUID | null {
    return getUid(this.command, Tags.AffectedSOPInstanceUID);
  }

  private set sopInstanceUID(value: DicomUID | null) {
    setUid(this.command, Tags.AffectedSOPInstanceUID, value);
  }

  get transferSyntax(): DicomTransferSyntax | null {
    if (!this.file) {
      return null;
    }
    return this.file.fileMetaInfo.transferSyntaxUID ?? this.file.dataset.internalTransferSyntax;
  }

  protected override postResponse(response: DicomResponse): void {
    this.onResponseReceived?.(this, response as DicomCStoreResponse);
  }
}
