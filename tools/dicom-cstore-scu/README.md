# tool: dicom-cstore-scu

Send DICOM files from file paths or directory paths to a remote C-STORE SCP.

## Run

```bash
npm run tool:dicom-cstore-scu -- ./path/to/dicom-dir
```

## Common examples

Send all files in a directory:

```bash
node tools/dicom-cstore-scu/index.mjs ./dicom-dir
```

Send recursively from subdirectories:

```bash
node tools/dicom-cstore-scu/index.mjs --recursive ./dicom-dir
```

Strictly reject non-standard DICOM values:

```bash
node tools/dicom-cstore-scu/index.mjs --validation error ./dicom-dir
```

Send file/directory mix with custom AE/port:

```bash
node tools/dicom-cstore-scu/index.mjs --host 127.0.0.1 --port 11112 --calling-ae MY_SCU --called-ae MY_SCP ./a.dcm ./batch-dir
```

Set request timeout:

```bash
node tools/dicom-cstore-scu/index.mjs --timeout 60000 ./image.dcm
```
