import { afterEach, describe, expect, it } from "vitest";
import { DicomState, DicomStatus } from "../../src/network/index.js";

describe("DicomStatus", () => {
  const stateUPSIsAlreadyCompleted = new DicomStatus(
    "B306",
    DicomState.Warning,
    "The UPS is already in the requested state of COMPLETED",
  );

  const stateSOPInstanceDoesNotExist = new DicomStatus(
    "C307",
    DicomState.Failure,
    "Specified SOP Instance UID does not exist or is not a UPS Instance managed by this SCP",
  );

  afterEach(() => {
    DicomStatus.resetEntries();
  });

  it("does not consider statuses with different code patterns as equal", () => {
    expect(stateUPSIsAlreadyCompleted.equals(stateSOPInstanceDoesNotExist)).toBe(false);
  });

  it("matches masked storage cannot understand status", () => {
    expect(stateSOPInstanceDoesNotExist.equals(DicomStatus.StorageCannotUnderstand)).toBe(true);
  });

  it("looks up exact masked status code", () => {
    const testStatus = DicomStatus.PrintManagementFilmBoxEmptyPage;
    const status = DicomStatus.lookup(testStatus.code);

    expect(status.code).toBe(testStatus.code);
    expect(status.description).toBe(testStatus.description);
  });

  it("returns warning-class status for unknown B3xx code", () => {
    const status = DicomStatus.lookup(stateUPSIsAlreadyCompleted.code);

    expect(status.state).toBe(DicomState.Warning);
    expect(status.code).toBe(stateUPSIsAlreadyCompleted.code);
    expect(status.description).not.toBe(stateUPSIsAlreadyCompleted.description);
  });

  it("allows extending known statuses and lookup", () => {
    DicomStatus.addKnownDicomStatuses([stateUPSIsAlreadyCompleted, stateSOPInstanceDoesNotExist]);
    const upsComplete = DicomStatus.lookup(stateUPSIsAlreadyCompleted.code);
    const missingSop = DicomStatus.lookup(stateSOPInstanceDoesNotExist.code);

    expect(upsComplete.equals(stateUPSIsAlreadyCompleted)).toBe(true);
    expect(upsComplete.description).toBe(stateUPSIsAlreadyCompleted.description);
    expect(missingSop.equals(stateSOPInstanceDoesNotExist)).toBe(true);
    expect(missingSop.description).toBe(stateSOPInstanceDoesNotExist.description);
  });

  it("supports null-safe equality helper", () => {
    expect(DicomStatus.areEqual(DicomStatus.Success, null)).toBe(false);
    expect(DicomStatus.areEqual(null, null)).toBe(true);
    expect(DicomStatus.areEqual(DicomStatus.Success, DicomStatus.Success)).toBe(true);
  });

  it("produces stable hashCode for equal values", () => {
    expect(DicomStatus.Success.hashCode()).toBe(DicomStatus.Success.hashCode());
    expect(
      new DicomStatus("DDDD", DicomState.Success, "DESC1").hashCode(),
    ).toBe(new DicomStatus("DDDD", DicomState.Success, "DESC1").hashCode());
    expect(
      new DicomStatus("DDDD", DicomState.Success, "DESC1", "COMMENT1").hashCode(),
    ).toBe(new DicomStatus("DDDD", DicomState.Success, "DESC1", "COMMENT1").hashCode());
    expect(
      new DicomStatus(DicomStatus.Success, "COMMENT1").hashCode(),
    ).toBe(new DicomStatus(DicomStatus.Success, "COMMENT1").hashCode());
    expect(
      new DicomStatus(0xdddd, DicomStatus.Success).hashCode(),
    ).toBe(new DicomStatus(0xdddd, DicomStatus.Success).hashCode());
  });
});
