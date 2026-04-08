# dicom-qr-scp

Run a file-backed Query/Retrieve SCP over a local archive directory.

Supported DIMSE services:

- `C-FIND`
- `C-GET`
- `C-MOVE`
- `C-ECHO`

The tool scans `--archive-dir` recursively for DICOM files and uses them as the query/retrieve source.

## Usage

```bash
node tools/dicom-qr-scp/index.mjs --port 11112 --ae MY_QR --archive-dir ./archive
```

Register one or more C-MOVE destinations:

```bash
node tools/dicom-qr-scp/index.mjs \
  --port 11112 \
  --ae MY_QR \
  --archive-dir ./archive \
  --move-destination MOVE_SCU=127.0.0.1:11113
```

## Notes

- `C-GET` returns matching instances on the same association.
- `C-MOVE` requires `--move-destination` mappings so the SCP can resolve destination AE titles to `host:port`.
- The implementation is intentionally tool-oriented and directory-backed; it is not a full PACS database/index implementation.
