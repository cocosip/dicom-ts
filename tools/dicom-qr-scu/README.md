# dicom-qr-scu

Send Query/Retrieve DIMSE requests to a remote QR SCP.

Supported operations:

- `C-FIND`
- `C-GET`
- `C-MOVE`

## Usage

Find studies by patient name:

```bash
node tools/dicom-qr-scu/index.mjs \
  --operation find \
  --host 127.0.0.1 \
  --port 11112 \
  --called-ae MY_QR \
  --level study \
  --key PatientName=DOE*
```

Retrieve one study with `C-GET`:

```bash
node tools/dicom-qr-scu/index.mjs \
  --operation get \
  --host 127.0.0.1 \
  --port 11112 \
  --called-ae MY_QR \
  --level study \
  --key StudyInstanceUID=1.2.3 \
  --receive-dir ./received
```

Retrieve one study with `C-MOVE` and a local receive port:

```bash
node tools/dicom-qr-scu/index.mjs \
  --operation move \
  --host 127.0.0.1 \
  --port 11112 \
  --called-ae MY_QR \
  --level study \
  --key StudyInstanceUID=1.2.3 \
  --move-destination-ae MOVE_SCU \
  --move-listen-port 11113 \
  --receive-dir ./received
```

## Notes

- `C-GET` currently expects `StudyInstanceUID` to be present in the request keys.
- Before `C-GET`, the tool performs an internal image-level `C-FIND` to discover storage SOP classes to accept.
- For `C-MOVE`, the remote SCP still needs to know how to resolve the destination AE title to the local receiver address.
