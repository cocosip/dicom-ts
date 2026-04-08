# dicom-worklist-scp

Run a file-backed Modality Worklist SCP.

Supported DIMSE services:

- `C-FIND` using Modality Worklist Information Model - FIND
- `C-ECHO`

The tool scans `--worklist-dir` recursively for DICOM worklist files and serves matching responses.

## Usage

```bash
node tools/dicom-worklist-scp/index.mjs --port 11112 --ae MY_WL --worklist-dir ./worklist
```

## Notes

- Each worklist file should contain a `ScheduledProcedureStepSequence` item.
- Matching supports both root-level keys and keys inside the first `ScheduledProcedureStepSequence` item.
- This is a lightweight tool implementation backed by directory scans, not a persistent RIS/PACS worklist database.
