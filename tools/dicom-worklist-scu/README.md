# dicom-worklist-scu

Send Modality Worklist C-FIND requests to a remote worklist SCP.

## Usage

Query by patient name and modality:

```bash
node tools/dicom-worklist-scu/index.mjs \
  --host 127.0.0.1 \
  --port 11112 \
  --called-ae MY_WL \
  --key PatientName=DOE* \
  --sps-key Modality=CT
```

Request additional Scheduled Procedure Step return keys:

```bash
node tools/dicom-worklist-scu/index.mjs \
  --sps-key ScheduledStationAETitle=CT01 \
  --sps-return ScheduledProcedureStepStartDate \
  --sps-return ScheduledProcedureStepStartTime
```

## Notes

- `--key` targets root-level worklist attributes.
- `--sps-key` targets attributes inside the first `ScheduledProcedureStepSequence` item.
- The tool uses Modality Worklist Information Model - FIND rather than QR query/retrieve models.
