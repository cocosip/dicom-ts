import * as Tags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomPriority } from "./DicomPriority.js";
import { DicomRequest } from "./DicomRequest.js";

/**
 * Base class for DIMSE requests carrying Priority (0000,0700).
 */
export abstract class DicomPriorityRequest extends DicomRequest {
  protected constructor(command: DicomDataset);
  protected constructor(type: DicomCommandField, requestedClassUid: DicomUID, priority: DicomPriority);
  protected constructor(
    commandOrType: DicomDataset | DicomCommandField,
    requestedClassUid?: DicomUID,
    priority: DicomPriority = DicomPriority.Medium,
  ) {
    if (commandOrType instanceof DicomDataset) {
      super(commandOrType);
      return;
    }

    if (!requestedClassUid) {
      throw new Error("Requested SOP Class UID is required for priority requests");
    }
    super(commandOrType, requestedClassUid);
    this.priority = priority;
  }

  get priority(): DicomPriority {
    return this.command.getSingleValueOrDefault<number>(Tags.Priority, DicomPriority.Medium) as DicomPriority;
  }

  protected set priority(value: DicomPriority) {
    this.command.addOrUpdateValue(Tags.Priority, value as number);
  }
}
