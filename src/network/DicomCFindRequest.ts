import * as Tags from "../core/DicomTag.generated.js";
import * as DicomUIDs from "../core/DicomUID.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { notValidated } from "../dataset/DicomDatasetExtensions.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomPriority } from "./DicomPriority.js";
import { DicomPriorityRequest } from "./DicomPriorityRequest.js";
import { DicomQueryRetrieveLevel, parseQueryRetrieveLevel, queryRetrieveLevelToString } from "./DicomQueryRetrieveLevel.js";
import type { DicomResponse } from "./DicomResponse.js";
import type { DicomCFindResponse } from "./DicomCFindResponse.js";

export class DicomCFindRequest extends DicomPriorityRequest {
  onResponseReceived?: (request: DicomCFindRequest, response: DicomCFindResponse) => void;

  constructor(command: DicomDataset);
  constructor(level: DicomQueryRetrieveLevel, priority?: DicomPriority);
  constructor(affectedSopClassUid: DicomUID, level?: DicomQueryRetrieveLevel, priority?: DicomPriority);
  constructor(
    commandOrLevelOrSopClass: DicomDataset | DicomQueryRetrieveLevel | DicomUID,
    levelOrPriority: DicomQueryRetrieveLevel | DicomPriority = DicomQueryRetrieveLevel.NotApplicable,
    priority: DicomPriority = DicomPriority.Medium,
  ) {
    if (commandOrLevelOrSopClass instanceof DicomDataset) {
      super(commandOrLevelOrSopClass);
      return;
    }

    if (commandOrLevelOrSopClass instanceof DicomUID) {
      super(DicomCommandField.CFindRequest, commandOrLevelOrSopClass, priority);
      this.dataset = notValidated(new DicomDataset());
      const queryLevel = typeof levelOrPriority === "number"
        ? levelOrPriority as DicomQueryRetrieveLevel
        : DicomQueryRetrieveLevel.NotApplicable;
      this.level = queryLevel;
      return;
    }

    const queryLevel = commandOrLevelOrSopClass;
    const effectivePriority = typeof levelOrPriority === "number"
      ? levelOrPriority as DicomPriority
      : priority;
    super(DicomCommandField.CFindRequest, getAffectedSopClassUid(queryLevel), effectivePriority);
    this.dataset = notValidated(new DicomDataset());
    this.level = queryLevel;
  }

  get level(): DicomQueryRetrieveLevel {
    return parseQueryRetrieveLevel(this.dataset?.tryGetString(Tags.QueryRetrieveLevel) ?? null);
  }

  set level(value: DicomQueryRetrieveLevel) {
    const encoded = queryRetrieveLevelToString(value);
    if (!this.dataset) {
      this.dataset = notValidated(new DicomDataset());
    }
    if (!encoded) {
      this.dataset.remove(Tags.QueryRetrieveLevel);
      return;
    }
    this.dataset.addOrUpdateValue(Tags.QueryRetrieveLevel, encoded);
  }

  protected override postResponse(response: DicomResponse): void {
    this.onResponseReceived?.(this, response as DicomCFindResponse);
  }
}

function getAffectedSopClassUid(level: DicomQueryRetrieveLevel): DicomUID {
  switch (level) {
    case DicomQueryRetrieveLevel.Patient:
      return DicomUIDs.PatientRootQueryRetrieveInformationModelFind;
    case DicomQueryRetrieveLevel.Study:
    case DicomQueryRetrieveLevel.Series:
    case DicomQueryRetrieveLevel.Image:
      return DicomUIDs.StudyRootQueryRetrieveInformationModelFind;
    case DicomQueryRetrieveLevel.Worklist:
    case DicomQueryRetrieveLevel.NotApplicable:
    default:
      return DicomUIDs.ModalityWorklistInformationModelFind;
  }
}
