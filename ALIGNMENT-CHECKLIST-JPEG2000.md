# JPEG2000 Alignment Checklist (Go -> TypeScript)

This checklist tracks parity work between:

- Go reference: `source-code/go-dicom-codec/jpeg2000/`
- TS target: `src/imaging/codec/jpeg2000/`

Status legend:

- `TODO`: not started
- `WIP`: in progress
- `DONE`: aligned and verified with tests

---

## 1) Core module parity map

| Go module | TS target | Status | Notes |
| --- | --- | --- | --- |
| `jpeg2000/codestream/*` | `jpeg2000/core/codestream/*` | DONE | Marker/types/parser baseline + fixture metadata parsing (+ Part2 `MCT/MCC/MCO` segment parsing) |
| `jpeg2000/colorspace/*` | `jpeg2000/core/colorspace/*` | WIP | Inverse RCT/ICT landed; Part2 inverse MCT binding/fallback path wired. Forward path + parity matrix pending |
| `jpeg2000/mqc/*` | `jpeg2000/core/mqc/*` | WIP | MQ decoder + RAW bypass + baseline encoder landed; packetization integration/perf parity pending |
| `jpeg2000/t1/*` | `jpeg2000/core/t1/*` | WIP | T1 decoder + context model + baseline encoder landed; packetization integration/full parity pending |
| `jpeg2000/t2/*` | `jpeg2000/core/t2/*` | WIP | P2.1 packet header decode foundation + P3.3/P3.4 LRCP packet encoder landed (single/multi-layer + TERMALL pass-length semantics) |
| `jpeg2000/wavelet/*` | `jpeg2000/core/wavelet/*` | WIP | Inverse + forward 5/3 & 9/7 multilevel/parity path landed with roundtrip tests; fixture-level parity/perf validation pending |
| `jpeg2000/decoder.go` | `jpeg2000/core/decoder/*` | WIP | Header/codestream/T2+T1 -> DWT -> component assembly -> pixel packing wired; Part2 MCT binding/fallback + irreversible/isPart2 metadata landed; error-model parity pending |
| `jpeg2000/encoder.go` | `jpeg2000/core/encoder/*` | WIP | Encode-side analysis + in-tree MQ/T1 + LRCP single-tile codestream writing (single/multi-layer) landed; full rate-target budget/PCRD parity pending |
| `jpeg2000/mct_builder.go` + MCT tests | `jpeg2000/core/mct/*` | TODO | Part 2 MCT bindings/ordering |
| `jpeg2000/lossless/*` | `jpeg2000/lossless/*` + `mc-lossless/*` | WIP | Codec shell exists; backend not aligned |
| `jpeg2000/lossy/*` | `jpeg2000/lossy/*` + `mc-lossy/*` | WIP | Codec shell exists; backend not aligned |

---

## 2) DICOM codec behavior parity

| Item | Status | Notes |
| --- | --- | --- |
| `.90` decode | WIP | T2+MQ/T1 + inverse DWT + component reconstruction + inverse RCT/ICT + sample packing wired; full fixture parity and metadata semantics pending |
| `.91` decode | WIP | Shares same pipeline; irreversible dequant/DWT + inverse ICT path wired, lossy parity thresholds pending |
| `.92` decode | WIP | Part2 marker parsing + decode-side MCT binding/fallback path landed; Go-generated synthetic parity is green, real fixture parity pending |
| `.93` decode | WIP | Part2 marker parsing + decode-side MCT binding/fallback path landed; Go-generated synthetic parity is green, real fixture parity pending |
| `.90` encode | WIP | LRCP single/multi-layer path landed (TERMALL + layered pass-length header semantics, Part1 single-tile); broader compatibility matrix pending |
| `.91` encode | WIP | LRCP single/multi-layer path landed (irreversible + TERMALL layered semantics); full rate-target/pixel-threshold parity pending |
| `.92` encode | TODO | Part 2 + MCT parity |
| `.93` encode | TODO | Part 2 + MCT parity |
| Photometric/Planar updates | WIP | Existing logic present; must verify against Go behavior |
| Parameter normalization parity | WIP | `DicomJpeg2000Params` exists; needs strict parity audit |
| Error model parity | TODO | Syntax/frame context and matching failure classes |

---

## 3) Validation matrix

| Validation | Status | Notes |
| --- | --- | --- |
| Decode fo-dicom.Codecs JPEG2000 acceptance fixtures | WIP | Pixel decode wired; `.90/.91` now close to reference with sparse outliers, still below final parity thresholds |
| Go encode -> TS decode compatibility | WIP | TS decode now byte-equal to go-dicom-codec decode output on `.90/.91` acceptance codestreams and Go-generated Part2 synthetic vectors (`.92/.93`); broader corpus still pending |
| TS encode -> Go decode compatibility | WIP | `.90/.91` fixture corpus matrix added (single-layer + multi-layer/rate-derived cases), Go-decode/TS-decode hash parity wired |
| Lossless deterministic checks | TODO | Hash/byte exactness where expected |
| Lossy threshold checks | TODO | Error metric thresholds |
| Single-frame + multi-frame coverage | TODO | All 4 transfer syntaxes |
| Invalid codestream negative tests | TODO | Truncation, marker corruption, metadata mismatch |

---

## 4) Known blockers / current reality

- Current TS JPEG2000 backend is not a real J2K/JP2 implementation.
- Custom pseudo-codestream backend has been removed and replaced with explicit "not implemented" errors.
- Red baseline tests for real fixtures are now in:
  - `tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts` (`it.fails` cases)

---

## 5) Session checklist (update every chat)

- [x] Chosen sub-goal mapped to one row above (Phase 2 decode pipeline kickoff)
- [x] Files changed listed
- [x] Tests added/updated listed
- [x] Commands run listed
- [x] Row statuses updated (`TODO/WIP/DONE`)

### 2026-03-04 (Phase 2 / P2.1)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketTypes.ts`
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketHeaderBitIo.ts`
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000TagTree.ts`
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketHeaderParser.ts`
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketDecoder.ts`
  - `src/imaging/codec/jpeg2000/core/t2/index.ts`
  - `src/imaging/codec/jpeg2000/core/index.ts`
  - `tests/imaging/jpeg2000/Jpeg2000PacketHeaderParser.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000PacketDecoder.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000PacketHeaderParser.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000PacketDecoder.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000PacketHeaderParser.test.ts tests/imaging/jpeg2000/Jpeg2000PacketDecoder.test.ts`
  - `npm test -- tests/imaging/jpeg2000`
  - `npm run build`
- Row status updates:
  - `jpeg2000/t2/* -> jpeg2000/core/t2/*` changed `TODO -> WIP`

### 2026-03-04 (Phase 2 / P2.1 follow-up)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketGeometry.ts`
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketDecoder.ts`
  - `src/imaging/codec/jpeg2000/core/t2/index.ts`
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `src/imaging/codec/jpeg2000/core/decoder/index.ts`
  - `tests/imaging/jpeg2000/Jpeg2000PacketDecoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000PacketDecoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000PacketDecoder.test.ts tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts tests/imaging/jpeg2000/Jpeg2000PacketHeaderParser.test.ts`
  - `npm test -- tests/imaging/jpeg2000`
  - `npm run build`
- Row status updates:
  - `jpeg2000/decoder.go -> jpeg2000/core/decoder/*` changed `TODO -> WIP`

### 2026-03-04 (Phase 2 / P2.2 kickoff)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/mqc/Jpeg2000MqDecoder.ts`
  - `src/imaging/codec/jpeg2000/core/mqc/index.ts`
  - `src/imaging/codec/jpeg2000/core/t1/Jpeg2000T1ContextModel.ts`
  - `src/imaging/codec/jpeg2000/core/t1/Jpeg2000T1Decoder.ts`
  - `src/imaging/codec/jpeg2000/core/t1/index.ts`
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketDecoder.ts`
  - `src/imaging/codec/jpeg2000/core/t2/index.ts`
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `src/imaging/codec/jpeg2000/core/decoder/index.ts`
  - `src/imaging/codec/jpeg2000/core/index.ts`
  - `tests/imaging/jpeg2000/Jpeg2000MqDecoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000T1Decoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000MqDecoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000T1Decoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000MqDecoder.test.ts tests/imaging/jpeg2000/Jpeg2000T1Decoder.test.ts tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `npm test -- tests/imaging/jpeg2000`
  - `npm run build`
- Row status updates:
  - `jpeg2000/mqc/* -> jpeg2000/core/mqc/*` changed `TODO -> WIP`
  - `jpeg2000/t1/* -> jpeg2000/core/t1/*` changed `TODO -> WIP`

### 2026-03-04 (Phase 2 / P2.3 + P2.4 bridge)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/wavelet/Jpeg2000WaveletParity.ts`
  - `src/imaging/codec/jpeg2000/core/wavelet/Jpeg2000Dwt53.ts`
  - `src/imaging/codec/jpeg2000/core/wavelet/Jpeg2000Dwt97.ts`
  - `src/imaging/codec/jpeg2000/core/wavelet/index.ts`
  - `src/imaging/codec/jpeg2000/core/index.ts`
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `src/imaging/codec/jpeg2000/core/decoder/index.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `npm test -- tests/imaging/jpeg2000`
  - `npm test -- tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`
- Row status updates:
  - `jpeg2000/wavelet/* -> jpeg2000/core/wavelet/*` changed `TODO -> WIP`

### 2026-03-04 (Phase 2 follow-up / MCT & colorspace inverse path)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/colorspace/Jpeg2000ColorTransforms.ts`
  - `src/imaging/codec/jpeg2000/core/colorspace/index.ts`
  - `src/imaging/codec/jpeg2000/core/index.ts`
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `tests/imaging/jpeg2000/Jpeg2000ColorTransforms.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000ColorTransforms.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000ColorTransforms.test.ts tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`
- Row status updates:
  - `jpeg2000/colorspace/* -> jpeg2000/core/colorspace/*` changed `TODO -> WIP`

### 2026-03-04 (Phase 2 follow-up / acceptance pixel-level comparison baseline)

- Files changed:
  - `tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
- Tests added/updated:
  - `tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
- Commands run:
  - `npm test -- tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm run build`
- Row status updates:
  - `Decode fo-dicom.Codecs JPEG2000 acceptance fixtures` remains `WIP` (now with explicit `.90`逐像素一致与`.91`阈值红线断言)

### 2026-03-04 (Phase 2 follow-up / bitplane mapping alignment)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm run build`
- Metrics snapshot (vs `PM5644-960x540_RGB.dcm`):
  - `.90` Lossless: `MAE 40.90 -> 0.239`, `PSNR 11.82 -> 30.28`, mismatch rate `48.77% -> 0.09375%`
  - `.91` Lossy: `MAE 40.85 -> 0.174`, `PSNR 11.84 -> 31.66`, mismatch rate `48.75% -> 0.068%`

### 2026-03-04 (Phase 2 follow-up / Go parity confirmation)

- Files changed:
  - `tests/imaging/DicomJpeg2000GoParity.test.ts`
- Tests added/updated:
  - `tests/imaging/DicomJpeg2000GoParity.test.ts`
- Commands run:
  - `go run source-code/go-dicom-codec/tmp_decode_main.go ...` (temporary local verification script, then removed)
  - `npm test -- tests/imaging/DicomJpeg2000GoParity.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000GoParity.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm run build`
- Row status updates:
  - `Go encode -> TS decode compatibility` changed `TODO -> WIP`

### 2026-03-04 (Phase 2/P5 follow-up / Part2 marker + inverse MCT bridge)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamTypes.ts`
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamParser.ts`
  - `src/imaging/codec/jpeg2000/core/codestream/index.ts`
  - `src/imaging/codec/jpeg2000/core/colorspace/Jpeg2000Part2Mct.ts`
  - `src/imaging/codec/jpeg2000/core/colorspace/index.ts`
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000Core.ts`
  - `tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Part2Mct.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Part2Mct.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000Part2Mct.test.ts tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `npm run build`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000GoParity.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
- Row status updates:
  - `.92 decode` changed `TODO -> WIP`
  - `.93 decode` changed `TODO -> WIP`

### 2026-03-04 (Phase 8.1 follow-up / Go-generated Part2 parity vectors)

- Files changed:
  - `source-code/go-dicom-codec/tools/generate_part2_vectors/main.go`
  - `tests/imaging/jpeg2000/fixtures/go-part2-lossless.j2k`
  - `tests/imaging/jpeg2000/fixtures/go-part2-lossy.j2k`
  - `tests/imaging/DicomJpeg2000GoPart2Parity.test.ts`
- Tests added/updated:
  - `tests/imaging/DicomJpeg2000GoPart2Parity.test.ts`
- Commands run:
  - `go run ./tools/generate_part2_vectors` (from `source-code/go-dicom-codec`)
  - `npm test -- tests/imaging/DicomJpeg2000GoPart2Parity.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000GoParity.test.ts tests/imaging/DicomJpeg2000GoPart2Parity.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm run build`
- Row status updates:
  - `Go encode -> TS decode compatibility` remains `WIP` (extended with `.92/.93` Go-generated synthetic parity coverage)

### 2026-03-04 (Phase 3 / P3.1 kickoff - forward DWT + encoder analysis scaffold)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/wavelet/Jpeg2000Dwt53.ts`
  - `src/imaging/codec/jpeg2000/core/wavelet/Jpeg2000Dwt97.ts`
  - `src/imaging/codec/jpeg2000/core/wavelet/index.ts`
  - `src/imaging/codec/jpeg2000/core/colorspace/Jpeg2000ColorTransforms.ts`
  - `src/imaging/codec/jpeg2000/core/colorspace/index.ts`
  - `src/imaging/codec/jpeg2000/core/encoder/Jpeg2000Encoder.ts`
  - `src/imaging/codec/jpeg2000/core/encoder/index.ts`
  - `src/imaging/codec/jpeg2000/core/index.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000Core.ts`
  - `tests/imaging/jpeg2000/Jpeg2000WaveletForward.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000ColorTransforms.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000WaveletForward.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000ColorTransforms.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000WaveletForward.test.ts tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts tests/imaging/jpeg2000/Jpeg2000ColorTransforms.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000GoParity.test.ts tests/imaging/DicomJpeg2000GoPart2Parity.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm run build`
- Row status updates:
  - `jpeg2000/encoder.go -> jpeg2000/core/encoder/*` changed `TODO -> WIP`

### 2026-03-04 (Phase 3 / P3.2 kickoff - MQ encoder + T1 encoder minimum path)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/mqc/Jpeg2000MqEncoder.ts`
  - `src/imaging/codec/jpeg2000/core/mqc/index.ts`
  - `src/imaging/codec/jpeg2000/core/t1/Jpeg2000T1Encoder.ts`
  - `src/imaging/codec/jpeg2000/core/t1/index.ts`
  - `tests/imaging/jpeg2000/Jpeg2000MqEncoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000T1Encoder.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000MqEncoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000T1Encoder.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000MqEncoder.test.ts tests/imaging/jpeg2000/Jpeg2000T1Encoder.test.ts tests/imaging/jpeg2000/Jpeg2000MqDecoder.test.ts tests/imaging/jpeg2000/Jpeg2000T1Decoder.test.ts`
  - `npm test -- tests/imaging/jpeg2000`
  - `npm test -- tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`
- Row status updates:
  - `jpeg2000/mqc/* -> jpeg2000/core/mqc/*` remains `WIP` (encoder path now landed; packetization integration pending)
  - `jpeg2000/t1/* -> jpeg2000/core/t1/*` remains `WIP` (encoder path now landed; packetization integration pending)

### 2026-03-04 (Phase 3 / P3.3 kickoff - T2 packetization + codestream writer baseline)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketEncoder.ts`
  - `src/imaging/codec/jpeg2000/core/t2/index.ts`
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamWriter.ts`
  - `src/imaging/codec/jpeg2000/core/codestream/index.ts`
  - `src/imaging/codec/jpeg2000/core/encoder/Jpeg2000Encoder.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000Core.ts`
  - `tests/imaging/jpeg2000/Jpeg2000PacketEncoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000PacketEncoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000PacketEncoder.test.ts tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm test -- tests/imaging/DicomJpeg2000GoParity.test.ts tests/imaging/DicomJpeg2000GoPart2Parity.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000GoParity.test.ts tests/imaging/DicomJpeg2000GoPart2Parity.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts`
  - `npm run build`
- Row status updates:
  - `.90 encode` changed `TODO -> WIP`
  - `.91 encode` changed `TODO -> WIP`

### 2026-03-04 (Phase 3 / P3.4/P3.6 baseline hardening - LRCP multi-layer/rate + TS->Go matrix)

- Files changed:
  - `src/imaging/codec/jpeg2000/core/t1/Jpeg2000T1Encoder.ts`
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketEncoder.ts`
  - `src/imaging/codec/jpeg2000/core/t2/index.ts`
  - `src/imaging/codec/jpeg2000/core/encoder/Jpeg2000Encoder.ts`
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `source-code/go-dicom-codec/tools/decode_codestream/main.go`
  - `tests/imaging/jpeg2000/Jpeg2000T1Encoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000PacketEncoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
- Tests added/updated:
  - `tests/imaging/jpeg2000/Jpeg2000T1Encoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000PacketEncoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
- Commands run:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000T1Encoder.test.ts tests/imaging/jpeg2000/Jpeg2000PacketEncoder.test.ts tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `npm test -- tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `npm test -- tests/imaging/jpeg2000 tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000GoParity.test.ts tests/imaging/DicomJpeg2000GoPart2Parity.test.ts tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `npm run build`
- Row status updates:
  - `TS encode -> Go decode compatibility` changed `TODO -> WIP`
