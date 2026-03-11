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
| Parameter normalization parity | WIP | Lossless defaults + rate/targetRatio/layer derivation aligned; strict regression table now covers allowMct/updatePI/encodeSigned + invalid/fallback behaviors (including `.92/.93` metadata mapping helper coverage). Part2 scalar normalization + MCC reversible semantics aligned; full-table audit still pending |
| Error model parity | WIP | Standardized `JPEG2000 {encode|decode} failed [class=...]` wrapping + `syntax/frame/size/bits/samples` context landed. Failure classes include `marker-corruption` / `truncation` / `metadata-mismatch` / `validation` with broad malformed-codestream coverage; Go-side full failure-class table audit pending |

---

## 3) Validation matrix

| Validation | Status | Notes |
| --- | --- | --- |
| Decode fo-dicom.Codecs JPEG2000 acceptance fixtures | WIP | Pixel decode wired; `.90/.91` now close to reference with sparse outliers, still below final parity thresholds |
| Go encode -> TS decode compatibility | WIP | `.90/.91` acceptance codestreams + `.92/.93` Go-generated Part2 vectors are green on hash parity; broader corpus still pending |
| TS encode -> Go decode compatibility | DONE | `.90/.91` acceptance fixture single/multi-frame + `.92/.93` single/multi-frame matrix green |
| Lossless deterministic checks | WIP | Codec-level deterministic hash/byte checks added for repeated `.90/.92` lossless encodes (single + multi-frame); acceptance-fixture deterministic matrix pending |
| Lossy threshold checks | DONE | `.91/.93` lossy quality threshold checks are stable via PSNR/MAE assertions against Go decode output |
| Single-frame + multi-frame coverage | DONE | `.90/.91/.92/.93` single-frame and multi-frame encode->decode compatibility matrix is green |
| Invalid codestream negative tests | WIP | Truncation + marker corruption + metadata mismatch baseline matrices covered at codec level; broader malformed corpus still pending |

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
- Retention policy: keep only recent key sessions here; detailed history is kept in Git.

### 2026-03-11 (Phase 8 / P8.1 Go->TS compatibility extension: Part2 `.92/.93`)

- Focus: extend Go->TS compatibility with explicit Part2 generated-vector assertions.
- Key updates:
  - Added `DicomJpeg2000TsEncodeGoDecode` case for `go-part2-lossless.j2k` / `go-part2-lossy.j2k`.
  - Asserted `Go decode hash == TS decode hash` and decoded-length parity.
- Main touched files:
  - `tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `npm run build`

### 2026-03-11 (Phase 8 / P8.4 lossless deterministic checks kickoff: `.90/.92`)

- Focus: pin deterministic byte/hash behavior for repeated lossless encodes.
- Key updates:
  - Added repeated encode byte+SHA256 parity checks for `.90/.92` (single + multi-frame).
  - Updated validation row `Lossless deterministic checks` to `WIP`.
- Main touched files:
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-11 (Phase 7 / P7.2 required segments + Part2 malformed-marker hardening)

- Focus: extend marker-corruption mapping and parser validation.
- Key updates:
  - Added required main-header checks (`SIZ/COD/QCD`) and missing `COD/QCD` codec-level negatives.
  - Extended Part2 malformed marker coverage (`MCT/MCC/MCO`: invalid length/selector/collection cases).
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamParser.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `npm run build`

### Archived history

- 2026-03-10 and earlier detailed entries have been compacted.
- Coverage includes Phase 6 metadata semantics closure, Phase 7 baseline error-model rollout, and Phase 3/5 encode-path hardening.
- For full per-session trace, use Git history for this file.
