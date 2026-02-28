import * as Tags from "../core/DicomTag.generated.js";
import * as DicomUIDs from "../core/DicomUID.generated.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { notValidated } from "../dataset/DicomDatasetExtensions.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomPriority } from "./DicomPriority.js";
import { DicomPriorityRequest } from "./DicomPriorityRequest.js";
import { DicomQueryRetrieveLevel, parseQueryRetrieveLevel, queryRetrieveLevelToString } from "./DicomQueryRetrieveLevel.js";
import type { DicomResponse } from "./DicomResponse.js";
import type { DicomCMoveResponse } from "./DicomCMoveResponse.js";

export class DicomCMoveRequest extends DicomPriorityRequest {
  onResponseReceived?: (request: DicomCMoveRequest, response: DicomCMoveResponse) => void;

  constructor(command: DicomDataset);
  constructor(
    destinationAe: string,
    studyInstanceUid: string,
    seriesOrPriority?: string | DicomPriority,
    sopOrPriority?: string | DicomPriority,
    priority?: DicomPriority,
  );
  constructor(
    commandOrDestinationAe: DicomDataset | string,
    studyInstanceUid?: string,
    seriesOrPriority?: string | DicomPriority,
    sopOrPriority?: string | DicomPriority,
    priority: DicomPriority = DicomPriority.Medium,
  ) {
    if (commandOrDestinationAe instanceof DicomDataset) {
      super(commandOrDestinationAe);
      return;
    }

    if (!studyInstanceUid) {
      throw new Error("C-MOVE request requires Study Instance UID");
    }

    const destinationAe = commandOrDestinationAe;
    const { seriesInstanceUid, sopInstanceUid, effectivePriority } = parseRetrieveConstructorArgs(
      seriesOrPriority,
      sopOrPriority,
      priority,
    );

    super(DicomCommandField.CMoveRequest, DicomUIDs.StudyRootQueryRetrieveInformationModelMove, effectivePriority);
    this.destinationAE = destinationAe;
    this.dataset = notValidated(new DicomDataset());

    if (sopInstanceUid) {
      this.level = DicomQueryRetrieveLevel.Image;
    } else if (seriesInstanceUid) {
      this.level = DicomQueryRetrieveLevel.Series;
    } else {
      this.level = DicomQueryRetrieveLevel.Study;
    }

    this.dataset.addOrUpdateValue(Tags.StudyInstanceUID, studyInstanceUid);
    if (seriesInstanceUid) {
      this.dataset.addOrUpdateValue(Tags.SeriesInstanceUID, seriesInstanceUid);
    }
    if (sopInstanceUid) {
      this.dataset.addOrUpdateValue(Tags.SOPInstanceUID, sopInstanceUid);
    }
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

  get destinationAE(): string {
    return this.command.getSingleValueOrDefault<string>(Tags.MoveDestination, "");
  }

  private set destinationAE(value: string) {
    this.command.addOrUpdateValue(Tags.MoveDestination, value);
  }

  protected override postResponse(response: DicomResponse): void {
    this.onResponseReceived?.(this, response as DicomCMoveResponse);
  }
}

function parseRetrieveConstructorArgs(
  seriesOrPriority: string | DicomPriority | undefined,
  sopOrPriority: string | DicomPriority | undefined,
  priority: DicomPriority,
): { seriesInstanceUid: string | null; sopInstanceUid: string | null; effectivePriority: DicomPriority } {
  let seriesInstanceUid: string | null = null;
  let sopInstanceUid: string | null = null;
  let effectivePriority = priority;

  if (typeof seriesOrPriority === "number") {
    effectivePriority = seriesOrPriority;
  } else if (typeof seriesOrPriority === "string") {
    seriesInstanceUid = seriesOrPriority;
  }

  if (typeof sopOrPriority === "number") {
    effectivePriority = sopOrPriority;
  } else if (typeof sopOrPriority === "string") {
    sopInstanceUid = sopOrPriority;
  }

  return { seriesInstanceUid, sopInstanceUid, effectivePriority };
}
