# tool: dicom-cstore-scp

Run a basic C-STORE SCP that receives incoming DICOM instances and saves them to disk.

## Run

```bash
npm run tool:dicom-cstore-scp
```

## Common examples

Start SCP with default settings:

```bash
node tools/dicom-cstore-scp/index.mjs
```

Listen on a custom port and AE:

```bash
node tools/dicom-cstore-scp/index.mjs --port 11112 --ae MY_SCP
```

Allow only specific calling AE and set output directory:

```bash
node tools/dicom-cstore-scp/index.mjs --allow-calling-ae MY_SCU --out-dir ./incoming
```
