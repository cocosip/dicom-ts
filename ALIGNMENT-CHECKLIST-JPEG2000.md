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
| `jpeg2000/mct_builder.go` + MCT tests | `jpeg2000/core/mct/*` | WIP | Part 2 MCT builder landed (`MCT/MCC/MCO` header construction + staged ordering + element-type encoding); parity hardening/edge cases pending |
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
| `.92` encode | WIP | Part 2 encode path landed (`Rsiz=2` + Part2 MCT forward pre-transform + `MCT/MCC/MCO` writing); broader fixture/negative coverage pending |
| `.93` encode | WIP | Part 2 encode path landed (`Rsiz=2` + Part2 MCT forward pre-transform + `MCT/MCC/MCO` writing); broader fixture/threshold hardening pending |
| Photometric/Planar updates | WIP | Strict helper-level matrix now covers `.90/.91/.92/.93` encode/decode PI + planar semantics; end-to-end `.92/.93` encode path still pending |
| Parameter normalization parity | WIP | Lossless defaults + rate/targetRatio/layer derivation aligned; strict regression table now covers allowMct/updatePI/encodeSigned + invalid/fallback behaviors (including `.92/.93` metadata mapping helper coverage), full-table audit still pending |
| Error model parity | TODO | Syntax/frame context and matching failure classes |

---

## 3) Validation matrix

| Validation | Status | Notes |
| --- | --- | --- |
| Decode fo-dicom.Codecs JPEG2000 acceptance fixtures | WIP | Pixel decode wired; `.90/.91` now close to reference with sparse outliers, still below final parity thresholds |
| Go encode -> TS decode compatibility | WIP | TS decode now byte-equal to go-dicom-codec decode output on `.90/.91` acceptance codestreams and Go-generated Part2 synthetic vectors (`.92/.93`); broader corpus still pending |
| TS encode -> Go decode compatibility | WIP | `.90/.91` fixture corpus matrix + `.92/.93` synthetic single/multi-frame matrix are green (Go-decode/TS-decode hash parity wired); broader corpus pending |
| Lossless deterministic checks | TODO | Hash/byte exactness where expected |
| Lossy threshold checks | TODO | Error metric thresholds |
| Single-frame + multi-frame coverage | WIP | `.90/.91` + `.92/.93` synthetic single-frame/multi-frame compatibility are green; acceptance-corpus expansion pending |
| Invalid codestream negative tests | TODO | Truncation, marker corruption, metadata mismatch |

---

## 4) Known blockers / current reality

- Current TS JPEG2000 backend is not a real J2K/JP2 implementation.
- Custom pseudo-codestream backend has been removed and replaced with explicit "not implemented" errors.
- Red baseline tests for real fixtures are now in:
  - `tests/imaging/DicomJpeg2000AlignmentBaseline.test.ts` (`it.fails` cases)

---

## 5) Session log (compact)

- [x] Chosen sub-goal mapped to one row above
- [x] Files changed listed
- [x] Tests added/updated listed
- [x] Commands run listed
- [x] Row statuses updated (`TODO/WIP/DONE`)
- Retention policy: this file keeps only recent session records; older detailed history is retained in Git history.

### 2026-03-06 (Phase 2 verification / decode API + multi-frame + metadata-context regressions)

- Focus:
  - Re-validate whether Phase 2 decode pipeline is already landed in code, and close residual checklist drift.
- Key updates:
  - Confirmed `.90/.91/.92/.93` decode path is wired through `Jpeg2000Decoder` in all four codec classes.
  - Added explicit multi-frame decode-loop regression coverage for all four JPEG2000 syntaxes.
  - Added decode-side metadata mismatch regression asserting error context contains `syntax` + `frame`.
- Main touched files:
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts tests/imaging/DicomJpeg2000GoParity.test.ts tests/imaging/DicomJpeg2000GoPart2Parity.test.ts`

### 2026-03-06 (Phase 5 / P5.3 - `.92/.93` no-binding fallback alignment)

- Focus:
  - Align Part2 encode fallback semantics with Go behavior when no explicit `mctBindings`.
- Key updates:
  - No valid fallback matrix => no `MCT/MCC/MCO` markers, fallback to Part1 path.
  - Valid fallback matrix/offsets => emit Part2 markers + Part2 custom path.
  - Offsets-only / invalid matrix dims => skip Part2 markers and fallback to Part1 behavior.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/encoder/Jpeg2000Encoder.ts`
  - `src/imaging/codec/jpeg2000/core/mct/Jpeg2000Part2MctBuilder.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts`
  - `tests/imaging/DicomJpeg2000Params.test.ts`
  - `tests/imaging/DicomJpeg2000ParamSemantics.test.ts`
- Commands:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts tests/imaging/DicomJpeg2000Params.test.ts tests/imaging/DicomJpeg2000ParamSemantics.test.ts`
  - `npm test -- tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts -t ".92/.93"`
  - `npm run build`

### 2026-03-06 (Phase 3/P5 follow-up - `.92/.93` encode path + Part2 MCT builder)

- Focus:
  - Enable baseline Part2 encode pipeline and extend TS->Go parity coverage.
- Key updates:
  - Added in-tree Part2 MCT builder.
  - `Jpeg2000Encoder` writes `Rsiz=2` and main-header `MCT/MCC/MCO`.
  - `.92/.93` encode path enabled; synthetic single/multi-frame parity added.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/mct/Jpeg2000Part2MctBuilder.ts`
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamWriter.ts`
  - `src/imaging/codec/jpeg2000/core/encoder/Jpeg2000Encoder.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
- Commands:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `npm test -- tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts -t ".92/.93"`
  - `npm run build`

### 2026-03-05 (Phase 3 / P3.5-P3.6 completion - JPEG2000 encode hardening)

- Focus:
  - Complete `.90/.91` encode integration and quality/assertion hardening.
- Key updates:
  - Added `.91` PSNR quality assertions for multiple target-ratio scenarios.
  - Confirmed `.90/.91` single-frame + multi-frame TS->Go matrix coverage.
- Main touched files:
  - `tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `npm test`
  - `npm run build`

### Archived history

- Detailed records for earlier sessions (not shown here) were intentionally compacted to reduce file size.
- For full historical trace, use Git history for this file.
