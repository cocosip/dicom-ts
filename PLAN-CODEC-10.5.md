# Phase 10.5 Codec Implementation Plan (By Encoding Family)

This document is the execution plan for codec work in Phase 10.5.
It is the baseline document for future implementation tasks.

## 1) Scope and Required Transfer Syntax Coverage

Required syntax UIDs:

- JPEG Family
  - `1.2.840.10008.1.2.4.50` JPEG Baseline (Process 1), lossy 8-bit
  - `1.2.840.10008.1.2.4.51` JPEG Extended (Process 2 and 4), lossy 8/12-bit
  - `1.2.840.10008.1.2.4.57` JPEG Lossless (Process 14), all predictors
  - `1.2.840.10008.1.2.4.70` JPEG Lossless SV1 (Process 14, predictor 1)
- JPEG-LS Family
  - `1.2.840.10008.1.2.4.80` JPEG-LS Lossless
  - `1.2.840.10008.1.2.4.81` JPEG-LS Near-Lossless
- JPEG 2000 Family
  - `1.2.840.10008.1.2.4.90` JPEG 2000 Lossless
  - `1.2.840.10008.1.2.4.91` JPEG 2000 (lossy/lossless)
  - `1.2.840.10008.1.2.4.92` JPEG 2000 Multi-component Lossless
  - `1.2.840.10008.1.2.4.93` JPEG 2000 Multi-component

## 2) Reference Sources

- Pure C# core reference:
  - `source-code/fo-dicom/FO-DICOM.Core/Imaging/Codec/`
  - `source-code/fo-dicom/FO-DICOM.Core/Imaging/Codec/JpegLossless/`
- Codec plugin/native reference:
  - `source-code/fo-dicom.Codecs/Codec/`
  - `source-code/fo-dicom.Codecs/Native/`
  - `source-code/fo-dicom.Codecs/Tests/Acceptance/`
- Pure Go JPEG2000 behavior reference:
  - `source-code/go-dicom-codec/jpeg2000/`
  - `source-code/go-dicom-codec/jpeg2000/lossless/`
  - `source-code/go-dicom-codec/jpeg2000/lossy/`

## 3) Current State and Gaps

Current state in `dicom-ts`:
- Already available:
  - `IDicomCodec`, `IDicomTranscoder`, `TranscoderManager`
  - `DicomTranscoder` pipeline
  - `DicomRleCodec` base implementation
  - Codec family split layout initialized:
    - `src/imaging/codec/rle/`
    - `src/imaging/codec/jpeg/`
    - `src/imaging/codec/jpeg-ls/`
    - `src/imaging/codec/jpeg2000/`
    - `src/imaging/codec/common/`
- Missing or incomplete:
  - JPEG Process 14 core decode chain is implemented (`codec/jpeg/common/JpegProcess14Common.ts`), conformance matrix still in progress
  - `DicomTransferSyntax` does not fully expose `4.92` / `4.93` constants
  - No unified codec capability metadata (decode-only vs encode+decode)
  - No full acceptance matrix for all required transfer syntaxes
  - No JPEG2000 `IDicomCodec` implementation classes yet

## 4) Architecture and Boundaries

- Keep core runtime policy unchanged:
  - Pure TypeScript + Node built-ins in the main library
- Built-in vs plugin strategy:
  - Built-in (in-tree): JPEG Lossless Process 14 family (`4.57`, `4.70`) and RLE
  - Plugin-first: JPEG Baseline/Extended, JPEG-LS, JPEG 2000 family
- JPEG2000 implementation rule for this phase:
  - Implement concrete `IDicomCodec` classes directly
  - Do not add a new abstract codec base layer for JPEG2000
  - Shared helper functions are allowed in `jpeg2000/common/`
- Source layout strategy:
  - By family directory:
    - `codec/rle/`
    - `codec/jpeg/`
    - `codec/jpeg-ls/`
    - `codec/jpeg2000/`
    - `codec/common/`
- Do not import native binaries from `source-code/fo-dicom.Codecs/Native/` into core runtime

## 5) Work Breakdown Structure (WBS)

### A. Foundation (cross-family)
- [ ] A1. Add missing transfer syntax constants and mapping
  - [ ] Add `JPEG2000MCLossless` (`4.92`) and `JPEG2000MC` (`4.93`) in `DicomTransferSyntax`
  - [ ] Add tests for syntax lookup and registration flow
- [ ] A2. Extend codec capability model
  - [ ] Add capability metadata (decode, encode, lossy/lossless flags)
  - [ ] Add strict error messages for missing capability paths
- [ ] A3. Standardize codec error model and logging context
  - [ ] Include syntax UID, frame index, and bit depth in errors

### B. JPEG Lossless family (`4.57`, `4.70`) - built-in
- [x] B1. Port Process 14 decode chain from `JpegLossless/`
  - [x] Huffman table parsing
  - [x] Frame/scan header parsing
  - [x] Predictor pipeline (all Process 14 predictors)
- [x] B2. SV1 behavior support
  - [x] Enforce predictor 1 for `4.70`
- [ ] B3. Pixel integration
  - [x] Validate 8-bit RGB fixture path with `DicomTranscoder`
  - [ ] Validate 8/12/16-bit full matrix and multi-frame handling
- [ ] B4. Conformance tests
  - [x] Added fo-dicom-compatible output hash check for `PM5644-960x540_JPEG-Lossless_RGB.dcm`
  - [ ] Expand to more fixtures (grayscale 12/16-bit, multi-frame)

### C. JPEG Baseline/Extended (`4.50`, `4.51`) - plugin path
- [x] C1. Define official adapter contract
  - [x] I/O buffer shape, color space expectations, 12-bit notes
- [x] C2. Provide one reference adapter example (no bundled binary)
  - [x] Implemented via callback adapter examples in `tests/imaging/DicomJpegBaselineExtendedCodec.test.ts`
- [x] C3. Add integration tests for registered adapter behavior

### D. JPEG-LS (`4.80`, `4.81`) - plugin path
- [ ] D1. Define parameter model (near-lossless controls, sign/precision)
- [ ] D2. Provide one reference adapter example
- [ ] D3. Add integration tests for lossless and near-lossless paths

### E. JPEG 2000 (`4.90`, `4.91`, `4.92`, `4.93`) - direct `IDicomCodec` implementations

- [ ] E0. Class matrix and source structure
  - [ ] `src/imaging/codec/jpeg2000/lossless/DicomJpeg2000LosslessCodec.ts` (`4.90`)
  - [ ] `src/imaging/codec/jpeg2000/lossy/DicomJpeg2000LossyCodec.ts` (`4.91`)
  - [ ] `src/imaging/codec/jpeg2000/mc-lossless/DicomJpeg2000Part2MCLosslessCodec.ts` (`4.92`)
  - [ ] `src/imaging/codec/jpeg2000/mc-lossy/DicomJpeg2000Part2MCCodec.ts` (`4.93`)
  - [ ] `src/imaging/codec/jpeg2000/index.ts` export wiring

- [ ] E1. Transfer syntax routing and registry wiring (P0)
  - [ ] Add `.92` / `.93` transfer syntax constants and lookup coverage
  - [ ] Register all 4 JPEG2000 codecs in `DefaultTranscoderManager.loadCodecs()`
  - [ ] Add routing tests via `TranscoderManager.getCodec(...)`

- [ ] E2. Parameter model (P0)
  - [ ] Add `DicomJpeg2000Params` with baseline fields:
    - `irreversible`, `rate`, `rateLevels`, `numLevels`
    - `numLayers`, `targetRatio`, `progressionOrder`
    - `allowMct`, `updatePhotometricInterpretation`
    - `encodeSignedPixelValuesAsUnsigned`
  - [ ] Add Part 2 fields for `.92/.93`:
    - `mctBindings`, `mctMatrix`, `inverseMctMatrix`
    - `mctOffsets`, `mctMatrixElementType`, `mctAssocType`
    - `mcoPrecision`, `mcoRecordOrder`
  - [ ] Add normalization rules:
    - `numLevels` in `0..6`
    - `progressionOrder` in `0..4`
    - `numLayers >= 1`
    - `targetRatio >= 0`

- [ ] E3. Encode behavior (P0)
  - [ ] Support single-frame and multi-frame encode loops
  - [ ] Validate pixel constraints before encode:
    - `BitsStored` in 2..16
    - `BitsAllocated` in 8/16
    - `.90/.91`: `SamplesPerPixel` 1 or 3
    - `.92/.93`: multi-component path enabled
  - [ ] Strip trailing frame padding byte before encode
  - [ ] Emit actionable errors with syntax UID and frame index

- [ ] E4. Decode behavior (P0)
  - [ ] Support single-frame and multi-frame decode loops
  - [ ] Validate decoded metadata against DICOM tags:
    - rows, columns, samplesPerPixel, bit depth
  - [ ] Explicitly define supported codestream forms (J2K and/or JP2)
  - [ ] Emit actionable errors with syntax UID and frame index

- [ ] E5. Photometric and Planar behavior (P0)
  - [ ] Write `PlanarConfiguration = Interleaved` after JPEG2000 encode
  - [ ] If `allowMct && updatePhotometricInterpretation`:
    - `.91/.93` with `irreversible=true` => `YBR_ICT`
    - otherwise => `YBR_RCT`
  - [ ] Decode path normalizes `YBR_ICT`/`YBR_RCT`/`YBR_FULL(_422)` to RGB output path

- [ ] E6. Part 2 multi-component behavior (P1)
  - [ ] `.92`: support Part 2 multi-component lossless parameter path
  - [ ] `.93`: support Part 2 multi-component lossy/lossless path
  - [ ] Support explicit MCT binding order (`mcoRecordOrder`) with safe fallback
  - [ ] If no MCT binding is provided, fall back to Part 1 behavior

- [ ] E7. Quality layer and rate control behavior (P1)
  - [ ] Support `rate` and `targetRatio` entry points
  - [ ] Support `numLayers` and `rateLevels`
  - [ ] Support progression order values `0..4` (LRCP/RLCP/RPCL/PCRL/CPRL)
  - [ ] Support optional quantization controls (`quantStepScale`, `subbandSteps`) when backend allows

- [ ] E8. Deferred items (P2, out of initial Phase 10.5 delivery)
  - [ ] ROI advanced controls (RGN/COM)
  - [ ] Tile/Precinct fine-grained controls
  - [ ] HTJ2K (`.201/.202/.203`) in a separate milestone

- [ ] E9. Reference integration example (P0)
  - [ ] Provide one minimal backend registration example for tests
  - [ ] Document register -> encode/decode -> transcode workflow

## 6) JPEG2000 Feature Confirmation (from go-dicom-codec)

Features confirmed in the reference implementation:

- Must-have for Phase 10.5
  - Encode/decode support for `.90`, `.91`, `.92`, `.93`
  - Multi-frame processing
  - Parameter model for rate/layer/progression/MCT
  - Part 2 MCT/MCC/MCO parameter path
- Candidate for second step in this phase
  - Multi-layer quality with rate-distortion allocation
  - Custom quantization step control
  - More complete Part 2 binding order and precision tuning
- Deferred to later phases
  - ROI, Tile, Precinct advanced controls
  - HTJ2K track

## 7) Test and Acceptance Plan

Test layers:
- Unit tests: parameter normalization, routing, error model, metadata checks
- Integration tests: `DicomTranscoder` full path (encode/decode/transcode)
- Acceptance tests: fixtures and behavior baselines from `fo-dicom.Codecs` and `go-dicom-codec/jpeg2000`

Minimum acceptance criteria:
- [ ] `4.90`, `4.91`, `4.92`, `4.93` all route through standard codec registration
- [ ] Each JPEG2000 UID has single-frame, multi-frame, and invalid-input tests
- [ ] Parameter normalization and fallback behavior are covered by tests
- [ ] Photometric and Planar updates are verified in encode/decode tests
- [ ] Error messages include syntax UID and frame index

## 8) Milestones

- M1 (P0): Foundation tasks (A1-A3)
- M2 (P0): JPEG Lossless Process 14 family (`4.57`, `4.70`) usable in core
- M3 (P1): JPEG Baseline/Extended + JPEG-LS plugin pipeline usable
- M4 (P0): JPEG2000 P0 done (4 UIDs routing + base encode/decode + parameter model)
- M5 (P1): JPEG2000 P1 done (Part 2 depth + quality layer/rate control)
- M6 (P1): Full regression matrix and documentation closure

## 9) Risks and Mitigation

- Risk: Too many JPEG2000 parameter combinations cause behavior drift
  - Mitigation: lock a P0 subset first, then open P1 options in controlled batches
- Risk: Different backend engines produce different byte streams
  - Mitigation: assert semantic compatibility, not byte-for-byte identity
- Risk: Part 2 multi-component path (`4.92`, `4.93`) is complex
  - Mitigation: stage delivery (core decode/encode first, advanced binding validation second)
- Risk: Photometric conversion changes downstream render behavior
  - Mitigation: add regression tests for photometric + planar tags before/after transcode
