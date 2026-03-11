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
| `jpeg2000/lossless/*` | `jpeg2000/lossless/*` + `mc-lossless/*` | DONE | All four JPEG2000 codec classes are now wired directly to in-tree `Jpeg2000Encoder` API (no helper indirection) |
| `jpeg2000/lossy/*` | `jpeg2000/lossy/*` + `mc-lossy/*` | DONE | All four JPEG2000 codec classes are now wired directly to in-tree `Jpeg2000Encoder` API (no helper indirection) |

---

## 2) DICOM codec behavior parity

| Item | Status | Notes |
| --- | --- | --- |
| `.90` decode | WIP | T2+MQ/T1 + inverse DWT + component reconstruction + inverse RCT/ICT + sample packing wired; full fixture parity and metadata semantics pending |
| `.91` decode | WIP | Shares same pipeline; irreversible dequant/DWT + inverse ICT path wired, lossy parity thresholds pending |
| `.92` decode | WIP | Part2 marker parsing + decode-side MCT binding/fallback path landed; Go-generated synthetic parity is green, real fixture parity pending |
| `.93` decode | WIP | Part2 marker parsing + decode-side MCT binding/fallback path landed; Go-generated synthetic parity is green, real fixture parity pending |
| `.90` encode | DONE | LRCP single/multi-layer path landed; codec now calls in-tree encoder API directly; TS->Go single/multi-frame fixture matrix green |
| `.91` encode | DONE | LRCP single/multi-layer path landed; TS->Go single/multi-frame fixture matrix green; lossy PSNR/MAE quality thresholds validated |
| `.92` encode | DONE | Part 2 encode path landed (`Rsiz=2` + Part2 MCT + `MCT/MCC/MCO` writing); TS->Go single/multi-frame parity green |
| `.93` encode | DONE | Part 2 encode path landed (`Rsiz=2` + Part2 MCT + `MCT/MCC/MCO` writing); TS->Go single/multi-frame parity green + lossy PSNR/MAE thresholds validated |
| Photometric/Planar updates | DONE | Helper-level + end-to-end matrices now cover `.90/.91/.92/.93` encode/decode PI + planar semantics (including Part 2 `.92/.93` transcode roundtrip assertions) |
| Parameter normalization parity | WIP | Lossless defaults + rate/targetRatio/layer derivation aligned; strict regression table now covers allowMct/updatePI/encodeSigned + invalid/fallback behaviors (including `.92/.93` metadata mapping helper coverage). Phase 4 follow-up added Part2 scalar normalization (`mctNormScale>0`, `mctMatrixElementType` range `0..3`) and explicit-binding `mcoPrecision` bit0 -> MCC reversible semantics; full-table audit still pending |
| Error model parity | WIP | Four JPEG2000 codec classes now wrap encode/decode failures with standardized `JPEG2000 {encode|decode} failed [class=...]` prefix plus `syntax/frame/size/bits/samples` context; failure-class mapping now distinguishes `marker-corruption` / `truncation` / `metadata-mismatch` / `validation` and extends marker-corruption coverage to invalid segment length + tile header marker sequence errors + missing required main-header segments (`SIZ/COD/QCD`) + JP2 missing `jp2c` box + invalid `SOT/Psot` tile-part length semantics + duplicate main-header (`SIZ/COD/QCD`) + malformed Part2 marker corpus (`MCT/MCC/MCO` invalid-length / unsupported `Zmct/Ymct/Zmcc/Ymcc` / invalid collections) with codec-level negative matrices for `.90/.91/.92/.93`; truncation coverage includes JP2 `XLBox` truncation + codestream premature-end cases. Remaining: broader malformed-marker/truncation corpus and Go-side failure-class table audit |

---

## 3) Validation matrix

| Validation | Status | Notes |
| --- | --- | --- |
| Decode fo-dicom.Codecs JPEG2000 acceptance fixtures | WIP | Pixel decode wired; `.90/.91` now close to reference with sparse outliers, still below final parity thresholds |
| Go encode -> TS decode compatibility | WIP | TS decode now byte-equal to go-dicom-codec decode output on `.90/.91` acceptance codestreams and Go-generated Part2 synthetic vectors (`.92/.93`); broader corpus still pending |
| TS encode -> Go decode compatibility | DONE | `.90/.91` acceptance fixture single/multi-frame matrix + `.92/.93` single/multi-frame matrix are green (Go-decode/TS-decode hash parity wired) |
| Lossless deterministic checks | WIP | Codec-level deterministic hash/byte checks added for repeated `.90/.92` lossless encode outputs (single-frame + multi-frame); acceptance-fixture-level deterministic matrix still pending |
| Lossy threshold checks | DONE | `.91/.93` lossy quality threshold checks are stable via PSNR/MAE assertions against Go decode output |
| Single-frame + multi-frame coverage | DONE | `.90/.91/.92/.93` single-frame and multi-frame encode->decode compatibility matrix is green |
| Invalid codestream negative tests | WIP | Truncation + marker corruption + metadata mismatch baseline matrices are covered at codec level (including invalid segment length, tile header order, missing required `SIZ/COD/QCD`, JP2 missing `jp2c`, invalid `SOT/Psot` tile-part length cases, JP2 `XLBox` truncation, codestream premature-end, and malformed Part2 `MCT/MCC/MCO` marker corpus with invalid lengths + unsupported selector fields); broader corpus still pending |

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

### 2026-03-11 (Phase 7 follow-up / P7.2 required main-header segments alignment: missing COD/QCD)

- Focus:
  - Continue P7.2 by aligning parser/error-class behavior with Go for missing required main-header segments (`COD`/`QCD`) and pinning codec-level failure-class mapping across `.90/.91/.92/.93`.
- Key updates:
  - Codestream parser now enforces required main-header segments after parse completion:
    - missing `COD` => throws `JPEG2000 codestream is missing required COD segment`,
    - missing `QCD` => throws `JPEG2000 codestream is missing required QCD segment`.
  - Extended JPEG2000 error-classifier `marker-corruption` branch to recognize:
    - `missing COD segment` / `missing required COD segment`,
    - `missing QCD segment` / `missing required QCD segment`.
  - Added codec-level negative matrix coverage for all `.90/.91/.92/.93` syntaxes:
    - codestream missing `COD` => `class=marker-corruption`,
    - codestream missing `QCD` => `class=marker-corruption`.
  - Expanded `DicomJpeg2000Codec` negative-path suite from 25 to 26 tests.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamParser.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `npm run build`

### 2026-03-11 (Phase 8 follow-up / P8.4 lossless deterministic checks kickoff: .90/.92)

- Focus:
  - Start P8.4 deterministic validation by pinning byte/hash exactness for repeated lossless encodes on `.90` and `.92` (single-frame + multi-frame).
- Key updates:
  - Added deterministic lossless regression tests in codec suite:
    - repeated `.90/.92` single-frame encode outputs now assert byte-equal parity + SHA-256 parity,
    - repeated `.90/.92` multi-frame encode outputs now assert per-frame byte-equal parity + SHA-256 parity.
  - Added test helpers for deterministic RGB fixture generation + Part2 lossless parameter setup in codec-level test module.
  - Updated validation row `Lossless deterministic checks` from `TODO` to `WIP`.
- Main touched files:
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-11 (Phase 7 follow-up / P7.2 Part2 malformed-marker corpus extension: MCT/MCC/MCO)

- Focus:
  - Continue P7.2 by extending marker-corruption failure-class mapping for malformed Part2 marker segments and pinning behavior across `.90/.91/.92/.93` codec-level negative matrices.
- Key updates:
  - Extended JPEG2000 error-classifier `marker-corruption` branch to recognize Part2 marker corruption signals:
    - `Unsupported MCT Zmct value`
    - `Unsupported MCT Ymct value`
    - `Unsupported MCC Zmcc value`
    - `Unsupported MCC Ymcc value`
    - `Invalid MCT segment payload length`
    - `Invalid MCC segment payload length`
    - `Invalid MCO segment payload length`
    - `Invalid MCC payload: no collections`
  - Added codec-level negative matrix coverage for all `.90/.91/.92/.93` syntaxes:
    - malformed `MCT` selector fields (`Zmct`/`Ymct`) => `class=marker-corruption`
    - malformed `MCC` selector fields (`Zmcc`/`Ymcc`) => `class=marker-corruption`
    - invalid Part2 payload lengths (`MCT/MCC/MCO`) => `class=marker-corruption`
    - invalid `MCC` collection count (`Qmcc=0`) => `class=marker-corruption`
  - Expanded `DicomJpeg2000Codec` negative-path suite from 22 to 23 tests.
- Main touched files:
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-10 (Phase 6 completion / P6.1-P6.4 JPEG2000 metadata semantics closure)

- Focus:
  - Close Phase 6 by completing end-to-end metadata semantics coverage for JPEG2000 `.90/.91/.92/.93`, including PI/planar behavior and lossy metadata append semantics.
- Key updates:
  - Expanded `DicomJpeg2000ParamSemantics` table from `.90/.91` to `.90/.91/.92/.93`:
    - `allowMct` + `updatePhotometricInterpretation` encode-side PI mapping now asserts Part 2 syntaxes,
    - decode-side roundtrip normalization explicitly asserts PI -> `RGB` where expected,
    - planar configuration remains interleaved (`0`) after both encode and decode.
  - Added real encode-path lossy metadata assertions for `.91/.93`:
    - `LossyImageCompression (0028,2110) = "01"`,
    - `LossyImageCompressionMethod (0028,2112)` appends `ISO_15444_1` / `ISO_15444_2` while preserving existing method,
    - `LossyImageCompressionRatio (0028,2114)` appends numeric ratio while preserving existing ratio entries.
  - Marked Phase 6 checklist items and Photometric/Planar parity row as completed.
- Main touched files:
  - `tests/imaging/DicomJpeg2000ParamSemantics.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000ParamSemantics.test.ts tests/imaging/jpeg2000/Jpeg2000CodecCommonMetadata.test.ts tests/imaging/DicomTranscoder.test.ts`
  - `npm run build`

### 2026-03-10 (Phase 7 follow-up / P7.2 duplicate main-header mapping: SIZ/COD/QCD)

- Focus:
  - Continue P7.2 by extending marker-corruption mapping for duplicate main-header segment failures and pinning behavior across `.90/.91/.92/.93`.
- Key updates:
  - Extended JPEG2000 error-classifier `marker-corruption` branch to recognize:
    - `Duplicate SIZ segment in main header`
    - `Duplicate COD segment in main header`
    - `Duplicate QCD segment in main header`
  - Added codec-level negative tests for all `.90/.91/.92/.93` syntaxes:
    - duplicate `SIZ` => `class=marker-corruption`
    - duplicate `COD` => `class=marker-corruption`
    - duplicate `QCD` => `class=marker-corruption`
  - Expanded `DicomJpeg2000Codec` negative matrix from 19 to 22 tests.
- Main touched files:
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-10 (Phase 7 follow-up / P7.2 malformed-marker corpus extension: missing SIZ + JP2 missing jp2c)

- Focus:
  - Continue P7.2 by extending malformed-marker coverage for container/codestream structural failures and locking class mapping in codec-level negative matrices across `.90/.91/.92/.93`.
- Key updates:
  - Extended JPEG2000 error-classifier `marker-corruption` branch to recognize:
    - `missing required SIZ segment`
    - `invalid JP2 box header size`
    - `payload does not start with SOC marker`
    - `JP2 stream does not contain a jp2c codestream box`
  - Added codec-level negative tests for all `.90/.91/.92/.93` syntaxes:
    - codestream missing `SIZ` => `class=marker-corruption`
    - JP2 container without `jp2c` codestream box => `class=marker-corruption`
  - Updated invalid-codestream validation row from `TODO` to `WIP` with explicit covered-corpus notes.
- Main touched files:
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-10 (Phase 7 follow-up / P7.2 SOT/Psot structural error mapping)

- Focus:
  - Continue P7.2 by extending marker-corruption classification for invalid tile-part length semantics (`Psot`) and pinning behavior in `.90/.91/.92/.93` codec-level negative matrices.
- Key updates:
  - Extended JPEG2000 error-classifier `marker-corruption` branch to recognize:
    - `Invalid SOT Psot: tile-part exceeds codestream`
    - `Invalid SOT Psot: tile-part end precedes SOD data`
  - Added codec-level negative tests for all `.90/.91/.92/.93` syntaxes:
    - oversized `Psot` (`tile-part exceeds codestream`) => `class=marker-corruption`
    - undersized `Psot` (`tile-part end precedes SOD data`) => `class=marker-corruption`
- Main touched files:
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-10 (Phase 7 follow-up / P7.2 truncation corpus extension: JP2 XLBox + codestream premature-end)

- Focus:
  - Continue P7.2 by extending truncation classification coverage for container/codestream boundary failures and pinning class mapping for `.90/.91/.92/.93`.
- Key updates:
  - Added/validated codec-level truncation negative matrices for all `.90/.91/.92/.93` syntaxes:
    - JP2 `XLBox` truncation (`Invalid JP2 box header: truncated XLBox`) => `class=truncation`
    - codestream premature-end (EOC-removed fixture; parser emits `Unexpected end of codestream while peeking marker`) => `class=truncation`
  - Increased codec negative-path matrix size in `DicomJpeg2000Codec.test.ts` from 17 to 19 tests.
- Main touched files:
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-10 (Phase 4 follow-up / P4.2-P4.3 Part2 parameter semantics hardening)

- Focus:
  - Continue Phase 4 parameter alignment by tightening Part2 scalar normalization and MCC reversible mapping semantics against go-dicom-codec behavior.
- Key updates:
  - `DicomJpeg2000Params.cloneNormalized` now normalizes:
    - `mctNormScale` to positive-only (`<=0` fallback to `1.0`),
    - `mctMatrixElementType` to integer range `0..3` (fallback `1`).
  - `Jpeg2000Part2MctBuilder` now aligns MCC reversible flag resolution with Go semantics:
    - explicit `mctBindings` with omitted `mcoPrecision` default to non-reversible (`false`),
    - explicit `mcoPrecision` uses bit0 to set reversible,
    - fallback matrix path derives reversible from codec irreversible mode (`!irreversible`).
  - Added/extended regression tests:
    - Part2 scalar normalization coverage in `DicomJpeg2000Params.test.ts`,
    - Part2 builder reversible-flag matrix for explicit binding vs fallback path in `Jpeg2000Part2MctBuilder.test.ts`.
- Main touched files:
  - `src/imaging/codec/jpeg2000/DicomJpeg2000Params.ts`
  - `src/imaging/codec/jpeg2000/core/mct/Jpeg2000Part2MctBuilder.ts`
  - `tests/imaging/DicomJpeg2000Params.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts tests/imaging/DicomJpeg2000Params.test.ts tests/imaging/DicomJpeg2000ParamSemantics.test.ts`
  - `npm run build`

### 2026-03-10 (Phase 7 follow-up / P7.2 marker-corruption hardening for invalid segment length + tile marker sequence)

- Focus:
  - Continue P7.2 by closing additional marker-corruption classes: invalid segment length and tile header marker sequence errors.
- Key updates:
  - Refined JPEG2000 failure-class classifier (`marker-corruption` branch) to include:
    - `segment length` pattern
    - `unexpected non-segment marker` pattern
    - `tile-part header ended before SOD marker` pattern
    - `invalid jp2 box length` pattern
  - Added codec-level negative tests for all `.90/.91/.92/.93` syntaxes:
    - invalid segment length codestream => `class=marker-corruption`
    - tile header marker sequence error (missing `SOD`) => `class=marker-corruption`
- Main touched files:
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-10 (Phase 7 follow-up / P7.2 failure-class mapping for marker-corruption vs truncation)

- Focus:
  - Continue Phase 7 by adding failure-class mapping in JPEG2000 codec error wrapping and pinning class expectations with malformed/truncated negative tests across `.90/.91/.92/.93`.
- Key updates:
  - Extended codec common error wrapper with failure-class classification:
    - `truncation`
    - `marker-corruption`
    - `metadata-mismatch`
    - `validation`
    - `unknown`
  - Updated wrapped error format to include class marker:
    - `JPEG2000 {encode|decode} failed [class=...]`
  - Added/updated codec-level negative tests:
    - malformed decode input now asserts `class=marker-corruption` for `.90/.91/.92/.93`;
    - truncated codestream decode now asserts `class=truncation` for `.90/.91/.92/.93`;
    - metadata mismatch and encode validation assertions now check `class=metadata-mismatch` / `class=validation`.
- Main touched files:
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-10 (Phase 7 kickoff / P7.1-P7.3 error model context wrapping + negative-path coverage)

- Focus:
  - Start Phase 7 error-model alignment by standardizing JPEG2000 codec-level encode/decode error wrapping and adding malformed-input negative tests across `.90/.91/.92/.93`.
- Key updates:
  - Added shared JPEG2000 error wrapper helper in codec common layer:
    - standardized message prefix: `JPEG2000 {encode|decode} failed`
    - unified context fields: `syntax`, `frame`, `size`, `bitsAllocated`, `bitsStored`, `samples`.
  - Updated all four JPEG2000 codec classes (`.90/.91/.92/.93`) to wrap both encode and decode exceptions with unified context while preserving nested failure details.
  - Extended codec-level tests:
    - existing decode metadata mismatch assertion now checks wrapped-prefix semantics;
    - new malformed-codestream decode negative matrix for all four syntaxes (`.90/.91/.92/.93`);
    - new encode validation negative matrix for all four syntaxes (`BitsAllocated` unsupported path) asserting wrapped context.
- Main touched files:
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `src/imaging/codec/jpeg2000/lossless/DicomJpeg2000LosslessCodec.ts`
  - `src/imaging/codec/jpeg2000/lossy/DicomJpeg2000LossyCodec.ts`
  - `src/imaging/codec/jpeg2000/mc-lossless/DicomJpeg2000Part2MCLosslessCodec.ts`
  - `src/imaging/codec/jpeg2000/mc-lossy/DicomJpeg2000Part2MCCodec.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-09 (Phase 3 completion / P3.5-P3.6 codec API wiring + coverage hardening)

- Focus:
  - Close remaining Phase 3 gaps by finishing codec-side encoder API wiring and stabilizing encode validation coverage.
- Key updates:
  - Rewired `.90/.91/.92/.93` codec classes to call in-tree `Jpeg2000Encoder` directly (no `encodeJpeg2000` helper indirection).
  - Added per-codec encoder instance reuse for both single-frame and multi-frame encode loops.
  - Reworked lossy quality gate from unstable compression-ratio check to stable PSNR/MAE thresholds against Go decode output.
  - Extended lossy quality threshold validation from `.91` to `.93`.
- Main touched files:
  - `src/imaging/codec/jpeg2000/lossless/DicomJpeg2000LosslessCodec.ts`
  - `src/imaging/codec/jpeg2000/lossy/DicomJpeg2000LossyCodec.ts`
  - `src/imaging/codec/jpeg2000/mc-lossless/DicomJpeg2000Part2MCLosslessCodec.ts`
  - `src/imaging/codec/jpeg2000/mc-lossy/DicomJpeg2000Part2MCCodec.ts`
  - `tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `npm run build`

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
