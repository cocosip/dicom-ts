import * as Tags from "../core/DicomTag.generated.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import type { DicomCMoveRequest } from "./DicomCMoveRequest.js";
import { DicomResponse } from "./DicomResponse.js";

export class DicomCMoveResponse extends DicomResponse {
  constructor(command: DicomDataset);
  constructor(request: DicomCMoveRequest, status: number);
  constructor(commandOrRequest: DicomDataset | DicomCMoveRequest, status = 0x0000) {
    if (commandOrRequest instanceof DicomDataset) {
      super(commandOrRequest);
    } else {
      super(commandOrRequest, status);
    }
  }

  get remaining(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.NumberOfRemainingSuboperations, 0);
  }

  set remaining(value: number) {
    this.command.addOrUpdateValue(Tags.NumberOfRemainingSuboperations, value);
  }

  get completed(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.NumberOfCompletedSuboperations, 0);
  }

  set completed(value: number) {
    this.command.addOrUpdateValue(Tags.NumberOfCompletedSuboperations, value);
  }

  get warnings(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.NumberOfWarningSuboperations, 0);
  }

  set warnings(value: number) {
    this.command.addOrUpdateValue(Tags.NumberOfWarningSuboperations, value);
  }

  get failures(): number {
    return this.command.getSingleValueOrDefault<number>(Tags.NumberOfFailedSuboperations, 0);
  }

  set failures(value: number) {
    this.command.addOrUpdateValue(Tags.NumberOfFailedSuboperations, value);
  }
}
