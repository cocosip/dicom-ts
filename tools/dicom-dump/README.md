# tool: dicom-dump

Dump all DICOM tags from a file (including nested sequences).

## Run

```bash
npm run tool:dicom-dump -- ./path/to/file.dcm
```

Or run directly:

```bash
node tools/dicom-dump/index.mjs ./path/to/file.dcm
```

## Options

- `-version`, `--version`: show tool version
- `-help`, `--help`: show help
- `-depth N`: max nested sequence depth (`-1` means unlimited)
- `-values`: show values (default)
- `-no-values`: hide values
- `-compact`: compact one-line output
- `-o`, `--out <file>`: write output to file

## Examples

```bash
node tools/dicom-dump/index.mjs ./image.dcm
node tools/dicom-dump/index.mjs -depth 2 -compact ./image.dcm
node tools/dicom-dump/index.mjs ./image.dcm -o ./out/dump.txt
```
