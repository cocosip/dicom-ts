# tool: dicom-to-json

Export a DICOM file to DICOM JSON (PS3.18 Annex F).

## Run

```bash
npm run tool:dicom-to-json
```

If no input file is provided, the tool auto-generates a demo DICOM and prints JSON to stdout.

## Common examples

Use an input file:

```bash
node tools/dicom-to-json/index.mjs ./path/to/file.dcm
```

Write to file and use DICOM keywords as JSON keys:

```bash
node tools/dicom-to-json/index.mjs ./path/to/file.dcm --keywords -o ./out/result.json
```

Output compact JSON:

```bash
node tools/dicom-to-json/index.mjs ./path/to/file.dcm --compact
```
