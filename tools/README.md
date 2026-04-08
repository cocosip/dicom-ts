# Tools

Each tool lives in its own directory and can run independently.

## List

- `dicom-to-json`: export DICOM file as JSON
  - docs: `tools/dicom-to-json/README.md`
  - entry: `tools/dicom-to-json/index.mjs`
- `dicom-info`: print basic DICOM metadata and common tag values
  - docs: `tools/dicom-info/README.md`
  - entry: `tools/dicom-info/index.mjs`
- `dicom-dump`: dump all DICOM tags with optional depth/value/compact controls
  - docs: `tools/dicom-dump/README.md`
  - entry: `tools/dicom-dump/index.mjs`
- `dicom-cstore-scu`: send DICOM files (from file or directory paths) as C-STORE requests
  - docs: `tools/dicom-cstore-scu/README.md`
  - entry: `tools/dicom-cstore-scu/index.mjs`
- `dicom-cstore-scp`: run a C-STORE SCP and save received files
  - docs: `tools/dicom-cstore-scp/README.md`
  - entry: `tools/dicom-cstore-scp/index.mjs`
- `dicom-qr-scu`: send QR C-FIND / C-GET / C-MOVE requests
  - docs: `tools/dicom-qr-scu/README.md`
  - entry: `tools/dicom-qr-scu/index.mjs`
- `dicom-qr-scp`: run a file-backed QR SCP with C-FIND / C-GET / C-MOVE support
  - docs: `tools/dicom-qr-scp/README.md`
  - entry: `tools/dicom-qr-scp/index.mjs`
- `dicom-worklist-scu`: send Modality Worklist C-FIND requests
  - docs: `tools/dicom-worklist-scu/README.md`
  - entry: `tools/dicom-worklist-scu/index.mjs`
- `dicom-worklist-scp`: run a file-backed Modality Worklist SCP
  - docs: `tools/dicom-worklist-scp/README.md`
  - entry: `tools/dicom-worklist-scp/index.mjs`
- `dicom-transcode`: transcode one DICOM file to one or all compressed transfer syntaxes
  - docs: `tools/dicom-transcode/README.md`
  - entry: `tools/dicom-transcode/index.mjs`
