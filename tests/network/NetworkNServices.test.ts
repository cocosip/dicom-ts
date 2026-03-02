import { describe, expect, it, vi } from "vitest";
import * as Tags from "../../src/core/DicomTag.generated.js";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomUID, DicomUidType } from "../../src/core/DicomUID.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  DicomCommandField,
  DicomNActionRequest,
  DicomNActionResponse,
  DicomNCreateRequest,
  DicomNCreateResponse,
  DicomNDeleteRequest,
  DicomNDeleteResponse,
  DicomNEventReportRequest,
  DicomNEventReportResponse,
  DicomNGetRequest,
  DicomNGetResponse,
  DicomNSetRequest,
  DicomNSetResponse,
} from "../../src/network/index.js";

function createInstanceUid(value: string): DicomUID {
  return DicomUID.parse(value, "Test SOP Instance", DicomUidType.SOPInstance);
}

describe("DIMSE-N request/response", () => {
  it("keeps N-CREATE request SOP Instance UID nullable when missing in command", () => {
    const command = new DicomDataset();
    command.addOrUpdateValue(Tags.CommandField, DicomCommandField.NCreateRequest);
    command.addOrUpdateValue(Tags.MessageID, 1);
    command.addOrUpdateValue(Tags.AffectedSOPClassUID, DicomUIDs.BasicFilmSession.uid);

    const request = new DicomNCreateRequest(command);

    expect(request.sopInstanceUID).toBeNull();
  });

  it("creates N-CREATE response from request without SOP Instance UID", () => {
    const command = new DicomDataset();
    command.addOrUpdateValue(Tags.CommandField, DicomCommandField.NCreateRequest);
    command.addOrUpdateValue(Tags.MessageID, 1);
    command.addOrUpdateValue(Tags.AffectedSOPClassUID, DicomUIDs.BasicFilmSession.uid);
    const request = new DicomNCreateRequest(command);

    const response = new DicomNCreateResponse(request, 0x0000);

    expect(response.type).toBe(DicomCommandField.NCreateResponse);
    expect(response.sopInstanceUID).toBeNull();
  });

  it("stores N-GET attribute identifier list and copies SOP Instance UID to response", () => {
    const instanceUid = createInstanceUid("1.2.3.4.5");
    const request = new DicomNGetRequest(
      DicomUIDs.BasicFilmSession,
      instanceUid,
      [Tags.PatientName, Tags.PatientID],
    );
    const response = new DicomNGetResponse(request, 0x0000);

    expect(request.type).toBe(DicomCommandField.NGetRequest);
    expect(request.attributes?.map((tag) => tag.toString())).toEqual([
      Tags.PatientName.toString(),
      Tags.PatientID.toString(),
    ]);
    expect(response.sopInstanceUID?.uid).toBe(instanceUid.uid);
  });

  it("dispatches N-ACTION callback and retains Action Type ID in response", () => {
    const request = new DicomNActionRequest(
      DicomUIDs.BasicFilmSession,
      createInstanceUid("1.2.3.6"),
      0x0002,
    );
    const onResponseReceived = vi.fn();
    request.onResponseReceived = onResponseReceived;
    const response = new DicomNActionResponse(request, 0x0000);

    request.dispatchResponse(response);

    expect(response.actionTypeID).toBe(0x0002);
    expect(response.toString()).toContain("Action Type:\t0002");
    expect(onResponseReceived).toHaveBeenCalledTimes(1);
    expect(onResponseReceived).toHaveBeenCalledWith(request, response);
  });

  it("copies event type and SOP instance for N-EVENT-REPORT response", () => {
    const request = new DicomNEventReportRequest(
      DicomUIDs.BasicFilmSession,
      createInstanceUid("1.2.3.7"),
      0x0003,
    );
    const response = new DicomNEventReportResponse(request, 0x0000);

    expect(request.type).toBe(DicomCommandField.NEventReportRequest);
    expect(response.type).toBe(DicomCommandField.NEventReportResponse);
    expect(response.eventTypeID).toBe(0x0003);
    expect(response.sopInstanceUID?.uid).toBe("1.2.3.7");
    expect(response.toString()).toContain("Event Type:\t0003");
  });

  it("maps requested/affected SOP Instance UID tags for N-SET and N-DELETE", () => {
    const setRequest = new DicomNSetRequest(
      DicomUIDs.BasicFilmSession,
      createInstanceUid("1.2.3.8"),
    );
    const setResponse = new DicomNSetResponse(setRequest, 0x0000);

    const deleteRequest = new DicomNDeleteRequest(
      DicomUIDs.BasicFilmSession,
      createInstanceUid("1.2.3.9"),
    );
    const deleteResponse = new DicomNDeleteResponse(deleteRequest, 0x0000);

    expect(setRequest.command.contains(Tags.RequestedSOPInstanceUID)).toBe(true);
    expect(setResponse.command.contains(Tags.AffectedSOPInstanceUID)).toBe(true);
    expect(deleteRequest.command.contains(Tags.RequestedSOPInstanceUID)).toBe(true);
    expect(deleteResponse.command.contains(Tags.AffectedSOPInstanceUID)).toBe(true);
  });
});
