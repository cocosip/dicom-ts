# DICOM To JPEG Tool

Render a DICOM image frame through `DicomImage.renderImage()` and export the final `IImage` as a `.jpg`.

## Usage

```bash
node tools/dicom-to-jpeg/index.mjs <input-file> [options]
```

## Options

- `-o, --out <file>`: Output JPEG path.
- `-f, --frame <index>`: Zero-based frame index. Default: `0`.
- `-q, --quality <1-100>`: JPEG quality. Default: `90`.
- `--window-center <value>`: Override grayscale window center before rendering.
- `--window-width <value>`: Override grayscale window width before rendering.
- `--no-overlays`: Disable DICOM graphics overlays.
- `-h, --help`: Show help.

## Notes

- Encapsulated transfer syntaxes are handled inside `DicomImage.renderImage()`, aligned with the fo-dicom rendering flow.
- The JPEG file is produced from the rendered `IImage` pixels, not from raw DICOM pixel bytes directly.

## Examples

Export the first frame:

```bash
node tools/dicom-to-jpeg/index.mjs image.dcm
```

Export frame 3 with custom quality:

```bash
node tools/dicom-to-jpeg/index.mjs multiframe.dcm --frame 3 --quality 95
```

Export with explicit windowing:

```bash
node tools/dicom-to-jpeg/index.mjs ct.dcm --window-center 40 --window-width 400 --out ct.jpg
```
