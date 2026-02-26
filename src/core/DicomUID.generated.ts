// AUTO-GENERATED — do not edit manually.
// Run `npm run generate:dict` to regenerate.
//
// Source: FO-DICOM.Core/Dictionaries/DICOM Dictionary.xml

import { DicomUID, DicomUidType } from "./DicomUID.js";

// Standard DICOM UIDs
/** 1.2.840.10008.1.1 Verification SOP Class */
export const Verification = new DicomUID("1.2.840.10008.1.1", "Verification SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(Verification);
/** 1.2.840.10008.1.2 Implicit VR Little Endian: Default Transfer Syntax for DICOM */
export const ImplicitVRLittleEndian = new DicomUID("1.2.840.10008.1.2", "Implicit VR Little Endian: Default Transfer Syntax for DICOM", DicomUidType.TransferSyntax, false);
DicomUID.register(ImplicitVRLittleEndian);
/** 1.2.840.10008.1.2.1 Explicit VR Little Endian */
export const ExplicitVRLittleEndian = new DicomUID("1.2.840.10008.1.2.1", "Explicit VR Little Endian", DicomUidType.TransferSyntax, false);
DicomUID.register(ExplicitVRLittleEndian);
/** 1.2.840.10008.1.2.1.98 Encapsulated Uncompressed Explicit VR Little Endian */
export const EncapsulatedUncompressedExplicitVRLittleEndian = new DicomUID("1.2.840.10008.1.2.1.98", "Encapsulated Uncompressed Explicit VR Little Endian", DicomUidType.TransferSyntax, false);
DicomUID.register(EncapsulatedUncompressedExplicitVRLittleEndian);
/** 1.2.840.10008.1.2.1.99 Deflated Explicit VR Little Endian */
export const DeflatedExplicitVRLittleEndian = new DicomUID("1.2.840.10008.1.2.1.99", "Deflated Explicit VR Little Endian", DicomUidType.TransferSyntax, false);
DicomUID.register(DeflatedExplicitVRLittleEndian);
/** 1.2.840.10008.1.2.2 Explicit VR Big Endian (Retired) (Retired) */
export const ExplicitVRBigEndian = new DicomUID("1.2.840.10008.1.2.2", "Explicit VR Big Endian (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(ExplicitVRBigEndian);
/** 1.2.840.10008.1.2.4.50 JPEG Baseline (Process 1): Default Transfer Syntax for Lossy JPEG 8 Bit Image Compression */
export const JPEGBaseline8Bit = new DicomUID("1.2.840.10008.1.2.4.50", "JPEG Baseline (Process 1): Default Transfer Syntax for Lossy JPEG 8 Bit Image Compression", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEGBaseline8Bit);
/** 1.2.840.10008.1.2.4.51 JPEG Extended (Process 2 & 4): Default Transfer Syntax for Lossy JPEG 12 Bit Image Compression (Process 4 only) */
export const JPEGExtended12Bit = new DicomUID("1.2.840.10008.1.2.4.51", "JPEG Extended (Process 2 & 4): Default Transfer Syntax for Lossy JPEG 12 Bit Image Compression (Process 4 only)", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEGExtended12Bit);
/** 1.2.840.10008.1.2.4.52 JPEG Extended (Process 3 & 5) (Retired) (Retired) */
export const JPEGExtended35 = new DicomUID("1.2.840.10008.1.2.4.52", "JPEG Extended (Process 3 & 5) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGExtended35);
/** 1.2.840.10008.1.2.4.53 JPEG Spectral Selection, Non-Hierarchical (Process 6 & 8) (Retired) (Retired) */
export const JPEGSpectralSelectionNonHierarchical68 = new DicomUID("1.2.840.10008.1.2.4.53", "JPEG Spectral Selection, Non-Hierarchical (Process 6 & 8) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGSpectralSelectionNonHierarchical68);
/** 1.2.840.10008.1.2.4.54 JPEG Spectral Selection, Non-Hierarchical (Process 7 & 9) (Retired) (Retired) */
export const JPEGSpectralSelectionNonHierarchical79 = new DicomUID("1.2.840.10008.1.2.4.54", "JPEG Spectral Selection, Non-Hierarchical (Process 7 & 9) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGSpectralSelectionNonHierarchical79);
/** 1.2.840.10008.1.2.4.55 JPEG Full Progression, Non-Hierarchical (Process 10 & 12) (Retired) (Retired) */
export const JPEGFullProgressionNonHierarchical1012 = new DicomUID("1.2.840.10008.1.2.4.55", "JPEG Full Progression, Non-Hierarchical (Process 10 & 12) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGFullProgressionNonHierarchical1012);
/** 1.2.840.10008.1.2.4.56 JPEG Full Progression, Non-Hierarchical (Process 11 & 13) (Retired) (Retired) */
export const JPEGFullProgressionNonHierarchical1113 = new DicomUID("1.2.840.10008.1.2.4.56", "JPEG Full Progression, Non-Hierarchical (Process 11 & 13) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGFullProgressionNonHierarchical1113);
/** 1.2.840.10008.1.2.4.57 JPEG Lossless, Non-Hierarchical (Process 14) */
export const JPEGLossless = new DicomUID("1.2.840.10008.1.2.4.57", "JPEG Lossless, Non-Hierarchical (Process 14)", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEGLossless);
/** 1.2.840.10008.1.2.4.58 JPEG Lossless, Non-Hierarchical (Process 15) (Retired) (Retired) */
export const JPEGLosslessNonHierarchical15 = new DicomUID("1.2.840.10008.1.2.4.58", "JPEG Lossless, Non-Hierarchical (Process 15) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGLosslessNonHierarchical15);
/** 1.2.840.10008.1.2.4.59 JPEG Extended, Hierarchical (Process 16 & 18) (Retired) (Retired) */
export const JPEGExtendedHierarchical1618 = new DicomUID("1.2.840.10008.1.2.4.59", "JPEG Extended, Hierarchical (Process 16 & 18) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGExtendedHierarchical1618);
/** 1.2.840.10008.1.2.4.60 JPEG Extended, Hierarchical (Process 17 & 19) (Retired) (Retired) */
export const JPEGExtendedHierarchical1719 = new DicomUID("1.2.840.10008.1.2.4.60", "JPEG Extended, Hierarchical (Process 17 & 19) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGExtendedHierarchical1719);
/** 1.2.840.10008.1.2.4.61 JPEG Spectral Selection, Hierarchical (Process 20 & 22) (Retired) (Retired) */
export const JPEGSpectralSelectionHierarchical2022 = new DicomUID("1.2.840.10008.1.2.4.61", "JPEG Spectral Selection, Hierarchical (Process 20 & 22) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGSpectralSelectionHierarchical2022);
/** 1.2.840.10008.1.2.4.62 JPEG Spectral Selection, Hierarchical (Process 21 & 23) (Retired) (Retired) */
export const JPEGSpectralSelectionHierarchical2123 = new DicomUID("1.2.840.10008.1.2.4.62", "JPEG Spectral Selection, Hierarchical (Process 21 & 23) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGSpectralSelectionHierarchical2123);
/** 1.2.840.10008.1.2.4.63 JPEG Full Progression, Hierarchical (Process 24 & 26) (Retired) (Retired) */
export const JPEGFullProgressionHierarchical2426 = new DicomUID("1.2.840.10008.1.2.4.63", "JPEG Full Progression, Hierarchical (Process 24 & 26) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGFullProgressionHierarchical2426);
/** 1.2.840.10008.1.2.4.64 JPEG Full Progression, Hierarchical (Process 25 & 27) (Retired) (Retired) */
export const JPEGFullProgressionHierarchical2527 = new DicomUID("1.2.840.10008.1.2.4.64", "JPEG Full Progression, Hierarchical (Process 25 & 27) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGFullProgressionHierarchical2527);
/** 1.2.840.10008.1.2.4.65 JPEG Lossless, Hierarchical (Process 28) (Retired) (Retired) */
export const JPEGLosslessHierarchical28 = new DicomUID("1.2.840.10008.1.2.4.65", "JPEG Lossless, Hierarchical (Process 28) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGLosslessHierarchical28);
/** 1.2.840.10008.1.2.4.66 JPEG Lossless, Hierarchical (Process 29) (Retired) (Retired) */
export const JPEGLosslessHierarchical29 = new DicomUID("1.2.840.10008.1.2.4.66", "JPEG Lossless, Hierarchical (Process 29) (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(JPEGLosslessHierarchical29);
/** 1.2.840.10008.1.2.4.70 JPEG Lossless, Non-Hierarchical, First-Order Prediction (Process 14 [Selection Value 1]): Default Transfer Syntax for Lossless JPEG Image Compression */
export const JPEGLosslessSV1 = new DicomUID("1.2.840.10008.1.2.4.70", "JPEG Lossless, Non-Hierarchical, First-Order Prediction (Process 14 [Selection Value 1]): Default Transfer Syntax for Lossless JPEG Image Compression", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEGLosslessSV1);
/** 1.2.840.10008.1.2.4.80 JPEG-LS Lossless Image Compression */
export const JPEGLSLossless = new DicomUID("1.2.840.10008.1.2.4.80", "JPEG-LS Lossless Image Compression", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEGLSLossless);
/** 1.2.840.10008.1.2.4.81 JPEG-LS Lossy (Near-Lossless) Image Compression */
export const JPEGLSNearLossless = new DicomUID("1.2.840.10008.1.2.4.81", "JPEG-LS Lossy (Near-Lossless) Image Compression", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEGLSNearLossless);
/** 1.2.840.10008.1.2.4.90 JPEG 2000 Image Compression (Lossless Only) */
export const JPEG2000Lossless = new DicomUID("1.2.840.10008.1.2.4.90", "JPEG 2000 Image Compression (Lossless Only)", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEG2000Lossless);
/** 1.2.840.10008.1.2.4.91 JPEG 2000 Image Compression */
export const JPEG2000 = new DicomUID("1.2.840.10008.1.2.4.91", "JPEG 2000 Image Compression", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEG2000);
/** 1.2.840.10008.1.2.4.92 JPEG 2000 Part 2 Multi-component Image Compression (Lossless Only) */
export const JPEG2000MCLossless = new DicomUID("1.2.840.10008.1.2.4.92", "JPEG 2000 Part 2 Multi-component Image Compression (Lossless Only)", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEG2000MCLossless);
/** 1.2.840.10008.1.2.4.93 JPEG 2000 Part 2 Multi-component Image Compression */
export const JPEG2000MC = new DicomUID("1.2.840.10008.1.2.4.93", "JPEG 2000 Part 2 Multi-component Image Compression", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEG2000MC);
/** 1.2.840.10008.1.2.4.94 JPIP Referenced */
export const JPIPReferenced = new DicomUID("1.2.840.10008.1.2.4.94", "JPIP Referenced", DicomUidType.TransferSyntax, false);
DicomUID.register(JPIPReferenced);
/** 1.2.840.10008.1.2.4.95 JPIP Referenced Deflate */
export const JPIPReferencedDeflate = new DicomUID("1.2.840.10008.1.2.4.95", "JPIP Referenced Deflate", DicomUidType.TransferSyntax, false);
DicomUID.register(JPIPReferencedDeflate);
/** 1.2.840.10008.1.2.4.100 MPEG2 Main Profile / Main Level */
export const MPEG2MPML = new DicomUID("1.2.840.10008.1.2.4.100", "MPEG2 Main Profile / Main Level", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG2MPML);
/** 1.2.840.10008.1.2.4.100.1 Fragmentable MPEG2 Main Profile / Main Level */
export const MPEG2MPMLF = new DicomUID("1.2.840.10008.1.2.4.100.1", "Fragmentable MPEG2 Main Profile / Main Level", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG2MPMLF);
/** 1.2.840.10008.1.2.4.101 MPEG2 Main Profile / High Level */
export const MPEG2MPHL = new DicomUID("1.2.840.10008.1.2.4.101", "MPEG2 Main Profile / High Level", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG2MPHL);
/** 1.2.840.10008.1.2.4.101.1 Fragmentable MPEG2 Main Profile / High Level */
export const MPEG2MPHLF = new DicomUID("1.2.840.10008.1.2.4.101.1", "Fragmentable MPEG2 Main Profile / High Level", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG2MPHLF);
/** 1.2.840.10008.1.2.4.102 MPEG-4 AVC/H.264 High Profile / Level 4.1 */
export const MPEG4HP41 = new DicomUID("1.2.840.10008.1.2.4.102", "MPEG-4 AVC/H.264 High Profile / Level 4.1", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP41);
/** 1.2.840.10008.1.2.4.102.1 Fragmentable MPEG-4 AVC/H.264 High Profile / Level 4.1 */
export const MPEG4HP41F = new DicomUID("1.2.840.10008.1.2.4.102.1", "Fragmentable MPEG-4 AVC/H.264 High Profile / Level 4.1", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP41F);
/** 1.2.840.10008.1.2.4.103 MPEG-4 AVC/H.264 BD-compatible High Profile / Level 4.1 */
export const MPEG4HP41BD = new DicomUID("1.2.840.10008.1.2.4.103", "MPEG-4 AVC/H.264 BD-compatible High Profile / Level 4.1", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP41BD);
/** 1.2.840.10008.1.2.4.103.1 Fragmentable MPEG-4 AVC/H.264 BD-compatible High Profile / Level 4.1 */
export const MPEG4HP41BDF = new DicomUID("1.2.840.10008.1.2.4.103.1", "Fragmentable MPEG-4 AVC/H.264 BD-compatible High Profile / Level 4.1", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP41BDF);
/** 1.2.840.10008.1.2.4.104 MPEG-4 AVC/H.264 High Profile / Level 4.2 For 2D Video */
export const MPEG4HP422D = new DicomUID("1.2.840.10008.1.2.4.104", "MPEG-4 AVC/H.264 High Profile / Level 4.2 For 2D Video", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP422D);
/** 1.2.840.10008.1.2.4.104.1 Fragmentable MPEG-4 AVC/H.264 High Profile / Level 4.2 For 2D Video */
export const MPEG4HP422DF = new DicomUID("1.2.840.10008.1.2.4.104.1", "Fragmentable MPEG-4 AVC/H.264 High Profile / Level 4.2 For 2D Video", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP422DF);
/** 1.2.840.10008.1.2.4.105 MPEG-4 AVC/H.264 High Profile / Level 4.2 For 3D Video */
export const MPEG4HP423D = new DicomUID("1.2.840.10008.1.2.4.105", "MPEG-4 AVC/H.264 High Profile / Level 4.2 For 3D Video", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP423D);
/** 1.2.840.10008.1.2.4.105.1 Fragmentable MPEG-4 AVC/H.264 High Profile / Level 4.2 For 3D Video */
export const MPEG4HP423DF = new DicomUID("1.2.840.10008.1.2.4.105.1", "Fragmentable MPEG-4 AVC/H.264 High Profile / Level 4.2 For 3D Video", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP423DF);
/** 1.2.840.10008.1.2.4.106 MPEG-4 AVC/H.264 Stereo High Profile / Level 4.2 */
export const MPEG4HP42STEREO = new DicomUID("1.2.840.10008.1.2.4.106", "MPEG-4 AVC/H.264 Stereo High Profile / Level 4.2", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP42STEREO);
/** 1.2.840.10008.1.2.4.106.1 Fragmentable MPEG-4 AVC/H.264 Stereo High Profile / Level 4.2 */
export const MPEG4HP42STEREOF = new DicomUID("1.2.840.10008.1.2.4.106.1", "Fragmentable MPEG-4 AVC/H.264 Stereo High Profile / Level 4.2", DicomUidType.TransferSyntax, false);
DicomUID.register(MPEG4HP42STEREOF);
/** 1.2.840.10008.1.2.4.107 HEVC/H.265 Main Profile / Level 5.1 */
export const HEVCMP51 = new DicomUID("1.2.840.10008.1.2.4.107", "HEVC/H.265 Main Profile / Level 5.1", DicomUidType.TransferSyntax, false);
DicomUID.register(HEVCMP51);
/** 1.2.840.10008.1.2.4.108 HEVC/H.265 Main 10 Profile / Level 5.1 */
export const HEVCM10P51 = new DicomUID("1.2.840.10008.1.2.4.108", "HEVC/H.265 Main 10 Profile / Level 5.1", DicomUidType.TransferSyntax, false);
DicomUID.register(HEVCM10P51);
/** 1.2.840.10008.1.2.4.110 JPEG XL Lossless */
export const JPEGXLLossless = new DicomUID("1.2.840.10008.1.2.4.110", "JPEG XL Lossless", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEGXLLossless);
/** 1.2.840.10008.1.2.4.111 JPEG XL JPEG Recompression */
export const JPEGXLJPEGRecompression = new DicomUID("1.2.840.10008.1.2.4.111", "JPEG XL JPEG Recompression", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEGXLJPEGRecompression);
/** 1.2.840.10008.1.2.4.112 JPEG XL */
export const JPEGXL = new DicomUID("1.2.840.10008.1.2.4.112", "JPEG XL", DicomUidType.TransferSyntax, false);
DicomUID.register(JPEGXL);
/** 1.2.840.10008.1.2.4.201 High-Throughput JPEG 2000 Image Compression (Lossless Only) */
export const HTJ2KLossless = new DicomUID("1.2.840.10008.1.2.4.201", "High-Throughput JPEG 2000 Image Compression (Lossless Only)", DicomUidType.TransferSyntax, false);
DicomUID.register(HTJ2KLossless);
/** 1.2.840.10008.1.2.4.202 High-Throughput JPEG 2000 with RPCL Options Image Compression (Lossless Only) */
export const HTJ2KLosslessRPCL = new DicomUID("1.2.840.10008.1.2.4.202", "High-Throughput JPEG 2000 with RPCL Options Image Compression (Lossless Only)", DicomUidType.TransferSyntax, false);
DicomUID.register(HTJ2KLosslessRPCL);
/** 1.2.840.10008.1.2.4.203 High-Throughput JPEG 2000 Image Compression */
export const HTJ2K = new DicomUID("1.2.840.10008.1.2.4.203", "High-Throughput JPEG 2000 Image Compression", DicomUidType.TransferSyntax, false);
DicomUID.register(HTJ2K);
/** 1.2.840.10008.1.2.4.204 JPIP HTJ2K Referenced */
export const JPIPHTJ2KReferenced = new DicomUID("1.2.840.10008.1.2.4.204", "JPIP HTJ2K Referenced", DicomUidType.TransferSyntax, false);
DicomUID.register(JPIPHTJ2KReferenced);
/** 1.2.840.10008.1.2.4.205 JPIP HTJ2K Referenced Deflate */
export const JPIPHTJ2KReferencedDeflate = new DicomUID("1.2.840.10008.1.2.4.205", "JPIP HTJ2K Referenced Deflate", DicomUidType.TransferSyntax, false);
DicomUID.register(JPIPHTJ2KReferencedDeflate);
/** 1.2.840.10008.1.2.5 RLE Lossless */
export const RLELossless = new DicomUID("1.2.840.10008.1.2.5", "RLE Lossless", DicomUidType.TransferSyntax, false);
DicomUID.register(RLELossless);
/** 1.2.840.10008.1.2.6.1 RFC 2557 MIME encapsulation (Retired) (Retired) */
export const RFC2557MIMEEncapsulation = new DicomUID("1.2.840.10008.1.2.6.1", "RFC 2557 MIME encapsulation (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(RFC2557MIMEEncapsulation);
/** 1.2.840.10008.1.2.6.2 XML Encoding (Retired) (Retired) */
export const XMLEncoding = new DicomUID("1.2.840.10008.1.2.6.2", "XML Encoding (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(XMLEncoding);
/** 1.2.840.10008.1.2.7.1 SMPTE ST 2110-20 Uncompressed Progressive Active Video */
export const SMPTEST211020UncompressedProgressiveActiveVideo = new DicomUID("1.2.840.10008.1.2.7.1", "SMPTE ST 2110-20 Uncompressed Progressive Active Video", DicomUidType.TransferSyntax, false);
DicomUID.register(SMPTEST211020UncompressedProgressiveActiveVideo);
/** 1.2.840.10008.1.2.7.2 SMPTE ST 2110-20 Uncompressed Interlaced Active Video */
export const SMPTEST211020UncompressedInterlacedActiveVideo = new DicomUID("1.2.840.10008.1.2.7.2", "SMPTE ST 2110-20 Uncompressed Interlaced Active Video", DicomUidType.TransferSyntax, false);
DicomUID.register(SMPTEST211020UncompressedInterlacedActiveVideo);
/** 1.2.840.10008.1.2.7.3 SMPTE ST 2110-30 PCM Digital Audio */
export const SMPTEST211030PCMDigitalAudio = new DicomUID("1.2.840.10008.1.2.7.3", "SMPTE ST 2110-30 PCM Digital Audio", DicomUidType.TransferSyntax, false);
DicomUID.register(SMPTEST211030PCMDigitalAudio);
/** 1.2.840.10008.1.2.8.1 Deflated Image Frame Compression */
export const DeflatedImageFrameCompression = new DicomUID("1.2.840.10008.1.2.8.1", "Deflated Image Frame Compression", DicomUidType.TransferSyntax, false);
DicomUID.register(DeflatedImageFrameCompression);
/** 1.2.840.10008.1.3.10 Media Storage Directory Storage */
export const MediaStorageDirectoryStorage = new DicomUID("1.2.840.10008.1.3.10", "Media Storage Directory Storage", DicomUidType.SOPClass, false);
DicomUID.register(MediaStorageDirectoryStorage);
/** 1.2.840.10008.1.5.1 Hot Iron Color Palette SOP Instance */
export const HotIronPalette = new DicomUID("1.2.840.10008.1.5.1", "Hot Iron Color Palette SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(HotIronPalette);
/** 1.2.840.10008.1.5.2 PET Color Palette SOP Instance */
export const PETPalette = new DicomUID("1.2.840.10008.1.5.2", "PET Color Palette SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(PETPalette);
/** 1.2.840.10008.1.5.3 Hot Metal Blue Color Palette SOP Instance */
export const HotMetalBluePalette = new DicomUID("1.2.840.10008.1.5.3", "Hot Metal Blue Color Palette SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(HotMetalBluePalette);
/** 1.2.840.10008.1.5.4 PET 20 Step Color Palette SOP Instance */
export const PET20StepPalette = new DicomUID("1.2.840.10008.1.5.4", "PET 20 Step Color Palette SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(PET20StepPalette);
/** 1.2.840.10008.1.5.5 Spring Color Palette SOP Instance */
export const SpringPalette = new DicomUID("1.2.840.10008.1.5.5", "Spring Color Palette SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(SpringPalette);
/** 1.2.840.10008.1.5.6 Summer Color Palette SOP Instance */
export const SummerPalette = new DicomUID("1.2.840.10008.1.5.6", "Summer Color Palette SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(SummerPalette);
/** 1.2.840.10008.1.5.7 Fall Color Palette SOP Instance */
export const FallPalette = new DicomUID("1.2.840.10008.1.5.7", "Fall Color Palette SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(FallPalette);
/** 1.2.840.10008.1.5.8 Winter Color Palette SOP Instance */
export const WinterPalette = new DicomUID("1.2.840.10008.1.5.8", "Winter Color Palette SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(WinterPalette);
/** 1.2.840.10008.1.9 Basic Study Content Notification SOP Class (Retired) (Retired) */
export const BasicStudyContentNotification = new DicomUID("1.2.840.10008.1.9", "Basic Study Content Notification SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(BasicStudyContentNotification);
/** 1.2.840.10008.1.20 Papyrus 3 Implicit VR Little Endian (Retired) (Retired) */
export const Papyrus3ImplicitVRLittleEndian = new DicomUID("1.2.840.10008.1.20", "Papyrus 3 Implicit VR Little Endian (Retired)", DicomUidType.TransferSyntax, true);
DicomUID.register(Papyrus3ImplicitVRLittleEndian);
/** 1.2.840.10008.1.20.1 Storage Commitment Push Model SOP Class */
export const StorageCommitmentPushModel = new DicomUID("1.2.840.10008.1.20.1", "Storage Commitment Push Model SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(StorageCommitmentPushModel);
/** 1.2.840.10008.1.20.1.1 Storage Commitment Push Model SOP Instance */
export const StorageCommitmentPushModelInstance = new DicomUID("1.2.840.10008.1.20.1.1", "Storage Commitment Push Model SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(StorageCommitmentPushModelInstance);
/** 1.2.840.10008.1.20.2 Storage Commitment Pull Model SOP Class (Retired) (Retired) */
export const StorageCommitmentPullModel = new DicomUID("1.2.840.10008.1.20.2", "Storage Commitment Pull Model SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(StorageCommitmentPullModel);
/** 1.2.840.10008.1.20.2.1 Storage Commitment Pull Model SOP Instance (Retired) (Retired) */
export const StorageCommitmentPullModelInstance = new DicomUID("1.2.840.10008.1.20.2.1", "Storage Commitment Pull Model SOP Instance (Retired)", DicomUidType.Unknown, true);
DicomUID.register(StorageCommitmentPullModelInstance);
/** 1.2.840.10008.1.40 Procedural Event Logging SOP Class */
export const ProceduralEventLogging = new DicomUID("1.2.840.10008.1.40", "Procedural Event Logging SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(ProceduralEventLogging);
/** 1.2.840.10008.1.40.1 Procedural Event Logging SOP Instance */
export const ProceduralEventLoggingInstance = new DicomUID("1.2.840.10008.1.40.1", "Procedural Event Logging SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(ProceduralEventLoggingInstance);
/** 1.2.840.10008.1.42 Substance Administration Logging SOP Class */
export const SubstanceAdministrationLogging = new DicomUID("1.2.840.10008.1.42", "Substance Administration Logging SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(SubstanceAdministrationLogging);
/** 1.2.840.10008.1.42.1 Substance Administration Logging SOP Instance */
export const SubstanceAdministrationLoggingInstance = new DicomUID("1.2.840.10008.1.42.1", "Substance Administration Logging SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(SubstanceAdministrationLoggingInstance);
/** 1.2.840.10008.2.6.1 DICOM UID Registry */
export const DCMUID = new DicomUID("1.2.840.10008.2.6.1", "DICOM UID Registry", DicomUidType.Unknown, false);
DicomUID.register(DCMUID);
/** 1.2.840.10008.2.16.4 DICOM Controlled Terminology */
export const DCM = new DicomUID("1.2.840.10008.2.16.4", "DICOM Controlled Terminology", DicomUidType.CodingScheme, false);
DicomUID.register(DCM);
/** 1.2.840.10008.2.16.5 Adult Mouse Anatomy Ontology */
export const MA = new DicomUID("1.2.840.10008.2.16.5", "Adult Mouse Anatomy Ontology", DicomUidType.CodingScheme, false);
DicomUID.register(MA);
/** 1.2.840.10008.2.16.6 Uberon Ontology */
export const UBERON = new DicomUID("1.2.840.10008.2.16.6", "Uberon Ontology", DicomUidType.CodingScheme, false);
DicomUID.register(UBERON);
/** 1.2.840.10008.2.16.7 Integrated Taxonomic Information System (ITIS) Taxonomic Serial Number (TSN) */
export const ITIS_TSN = new DicomUID("1.2.840.10008.2.16.7", "Integrated Taxonomic Information System (ITIS) Taxonomic Serial Number (TSN)", DicomUidType.CodingScheme, false);
DicomUID.register(ITIS_TSN);
/** 1.2.840.10008.2.16.8 Mouse Genome Initiative (MGI) */
export const MGI = new DicomUID("1.2.840.10008.2.16.8", "Mouse Genome Initiative (MGI)", DicomUidType.CodingScheme, false);
DicomUID.register(MGI);
/** 1.2.840.10008.2.16.9 PubChem Compound CID */
export const PUBCHEM_CID = new DicomUID("1.2.840.10008.2.16.9", "PubChem Compound CID", DicomUidType.CodingScheme, false);
DicomUID.register(PUBCHEM_CID);
/** 1.2.840.10008.2.16.10 Dublin Core */
export const DC = new DicomUID("1.2.840.10008.2.16.10", "Dublin Core", DicomUidType.CodingScheme, false);
DicomUID.register(DC);
/** 1.2.840.10008.2.16.11 New York University Melanoma Clinical Cooperative Group */
export const NYUMCCG = new DicomUID("1.2.840.10008.2.16.11", "New York University Melanoma Clinical Cooperative Group", DicomUidType.CodingScheme, false);
DicomUID.register(NYUMCCG);
/** 1.2.840.10008.2.16.12 Mayo Clinic Non-radiological Images Specific Body Structure Anatomical Surface Region Guide */
export const MAYONRISBSASRG = new DicomUID("1.2.840.10008.2.16.12", "Mayo Clinic Non-radiological Images Specific Body Structure Anatomical Surface Region Guide", DicomUidType.CodingScheme, false);
DicomUID.register(MAYONRISBSASRG);
/** 1.2.840.10008.2.16.13 Image Biomarker Standardisation Initiative */
export const IBSI = new DicomUID("1.2.840.10008.2.16.13", "Image Biomarker Standardisation Initiative", DicomUidType.CodingScheme, false);
DicomUID.register(IBSI);
/** 1.2.840.10008.2.16.14 Radiomics Ontology */
export const RO = new DicomUID("1.2.840.10008.2.16.14", "Radiomics Ontology", DicomUidType.CodingScheme, false);
DicomUID.register(RO);
/** 1.2.840.10008.2.16.15 RadElement */
export const RADELEMENT = new DicomUID("1.2.840.10008.2.16.15", "RadElement", DicomUidType.CodingScheme, false);
DicomUID.register(RADELEMENT);
/** 1.2.840.10008.2.16.16 ICD-11 */
export const I11 = new DicomUID("1.2.840.10008.2.16.16", "ICD-11", DicomUidType.CodingScheme, false);
DicomUID.register(I11);
/** 1.2.840.10008.2.16.17 Unified numbering system (UNS) for metals and alloys */
export const UNS = new DicomUID("1.2.840.10008.2.16.17", "Unified numbering system (UNS) for metals and alloys", DicomUidType.CodingScheme, false);
DicomUID.register(UNS);
/** 1.2.840.10008.2.16.18 Research Resource Identification */
export const RRID = new DicomUID("1.2.840.10008.2.16.18", "Research Resource Identification", DicomUidType.CodingScheme, false);
DicomUID.register(RRID);
/** 1.2.840.10008.3.1.1.1 DICOM Application Context Name */
export const DICOMApplicationContext = new DicomUID("1.2.840.10008.3.1.1.1", "DICOM Application Context Name", DicomUidType.ApplicationContextName, false);
DicomUID.register(DICOMApplicationContext);
/** 1.2.840.10008.3.1.2.1.1 Detached Patient Management SOP Class (Retired) (Retired) */
export const DetachedPatientManagement = new DicomUID("1.2.840.10008.3.1.2.1.1", "Detached Patient Management SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(DetachedPatientManagement);
/** 1.2.840.10008.3.1.2.1.4 Detached Patient Management Meta SOP Class (Retired) (Retired) */
export const DetachedPatientManagementMeta = new DicomUID("1.2.840.10008.3.1.2.1.4", "Detached Patient Management Meta SOP Class (Retired)", DicomUidType.MetaSOPClass, true);
DicomUID.register(DetachedPatientManagementMeta);
/** 1.2.840.10008.3.1.2.2.1 Detached Visit Management SOP Class (Retired) (Retired) */
export const DetachedVisitManagement = new DicomUID("1.2.840.10008.3.1.2.2.1", "Detached Visit Management SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(DetachedVisitManagement);
/** 1.2.840.10008.3.1.2.3.1 Detached Study Management SOP Class (Retired) (Retired) */
export const DetachedStudyManagement = new DicomUID("1.2.840.10008.3.1.2.3.1", "Detached Study Management SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(DetachedStudyManagement);
/** 1.2.840.10008.3.1.2.3.2 Study Component Management SOP Class (Retired) (Retired) */
export const StudyComponentManagement = new DicomUID("1.2.840.10008.3.1.2.3.2", "Study Component Management SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(StudyComponentManagement);
/** 1.2.840.10008.3.1.2.3.3 Modality Performed Procedure Step SOP Class */
export const ModalityPerformedProcedureStep = new DicomUID("1.2.840.10008.3.1.2.3.3", "Modality Performed Procedure Step SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(ModalityPerformedProcedureStep);
/** 1.2.840.10008.3.1.2.3.4 Modality Performed Procedure Step Retrieve SOP Class */
export const ModalityPerformedProcedureStepRetrieve = new DicomUID("1.2.840.10008.3.1.2.3.4", "Modality Performed Procedure Step Retrieve SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(ModalityPerformedProcedureStepRetrieve);
/** 1.2.840.10008.3.1.2.3.5 Modality Performed Procedure Step Notification SOP Class */
export const ModalityPerformedProcedureStepNotification = new DicomUID("1.2.840.10008.3.1.2.3.5", "Modality Performed Procedure Step Notification SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(ModalityPerformedProcedureStepNotification);
/** 1.2.840.10008.3.1.2.5.1 Detached Results Management SOP Class (Retired) (Retired) */
export const DetachedResultsManagement = new DicomUID("1.2.840.10008.3.1.2.5.1", "Detached Results Management SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(DetachedResultsManagement);
/** 1.2.840.10008.3.1.2.5.4 Detached Results Management Meta SOP Class (Retired) (Retired) */
export const DetachedResultsManagementMeta = new DicomUID("1.2.840.10008.3.1.2.5.4", "Detached Results Management Meta SOP Class (Retired)", DicomUidType.MetaSOPClass, true);
DicomUID.register(DetachedResultsManagementMeta);
/** 1.2.840.10008.3.1.2.5.5 Detached Study Management Meta SOP Class (Retired) (Retired) */
export const DetachedStudyManagementMeta = new DicomUID("1.2.840.10008.3.1.2.5.5", "Detached Study Management Meta SOP Class (Retired)", DicomUidType.MetaSOPClass, true);
DicomUID.register(DetachedStudyManagementMeta);
/** 1.2.840.10008.3.1.2.6.1 Detached Interpretation Management SOP Class (Retired) (Retired) */
export const DetachedInterpretationManagement = new DicomUID("1.2.840.10008.3.1.2.6.1", "Detached Interpretation Management SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(DetachedInterpretationManagement);
/** 1.2.840.10008.4.2 Storage Service Class */
export const Storage = new DicomUID("1.2.840.10008.4.2", "Storage Service Class", DicomUidType.ServiceClass, false);
DicomUID.register(Storage);
/** 1.2.840.10008.5.1.1.1 Basic Film Session SOP Class */
export const BasicFilmSession = new DicomUID("1.2.840.10008.5.1.1.1", "Basic Film Session SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(BasicFilmSession);
/** 1.2.840.10008.5.1.1.2 Basic Film Box SOP Class */
export const BasicFilmBox = new DicomUID("1.2.840.10008.5.1.1.2", "Basic Film Box SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(BasicFilmBox);
/** 1.2.840.10008.5.1.1.4 Basic Grayscale Image Box SOP Class */
export const BasicGrayscaleImageBox = new DicomUID("1.2.840.10008.5.1.1.4", "Basic Grayscale Image Box SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(BasicGrayscaleImageBox);
/** 1.2.840.10008.5.1.1.4.1 Basic Color Image Box SOP Class */
export const BasicColorImageBox = new DicomUID("1.2.840.10008.5.1.1.4.1", "Basic Color Image Box SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(BasicColorImageBox);
/** 1.2.840.10008.5.1.1.4.2 Referenced Image Box SOP Class (Retired) (Retired) */
export const ReferencedImageBox = new DicomUID("1.2.840.10008.5.1.1.4.2", "Referenced Image Box SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(ReferencedImageBox);
/** 1.2.840.10008.5.1.1.9 Basic Grayscale Print Management Meta SOP Class */
export const BasicGrayscalePrintManagementMeta = new DicomUID("1.2.840.10008.5.1.1.9", "Basic Grayscale Print Management Meta SOP Class", DicomUidType.MetaSOPClass, false);
DicomUID.register(BasicGrayscalePrintManagementMeta);
/** 1.2.840.10008.5.1.1.9.1 Referenced Grayscale Print Management Meta SOP Class (Retired) (Retired) */
export const ReferencedGrayscalePrintManagementMeta = new DicomUID("1.2.840.10008.5.1.1.9.1", "Referenced Grayscale Print Management Meta SOP Class (Retired)", DicomUidType.MetaSOPClass, true);
DicomUID.register(ReferencedGrayscalePrintManagementMeta);
/** 1.2.840.10008.5.1.1.14 Print Job SOP Class */
export const PrintJob = new DicomUID("1.2.840.10008.5.1.1.14", "Print Job SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(PrintJob);
/** 1.2.840.10008.5.1.1.15 Basic Annotation Box SOP Class */
export const BasicAnnotationBox = new DicomUID("1.2.840.10008.5.1.1.15", "Basic Annotation Box SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(BasicAnnotationBox);
/** 1.2.840.10008.5.1.1.16 Printer SOP Class */
export const Printer = new DicomUID("1.2.840.10008.5.1.1.16", "Printer SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(Printer);
/** 1.2.840.10008.5.1.1.16.376 Printer Configuration Retrieval SOP Class */
export const PrinterConfigurationRetrieval = new DicomUID("1.2.840.10008.5.1.1.16.376", "Printer Configuration Retrieval SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(PrinterConfigurationRetrieval);
/** 1.2.840.10008.5.1.1.17 Printer SOP Instance */
export const PrinterInstance = new DicomUID("1.2.840.10008.5.1.1.17", "Printer SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(PrinterInstance);
/** 1.2.840.10008.5.1.1.17.376 Printer Configuration Retrieval SOP Instance */
export const PrinterConfigurationRetrievalInstance = new DicomUID("1.2.840.10008.5.1.1.17.376", "Printer Configuration Retrieval SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(PrinterConfigurationRetrievalInstance);
/** 1.2.840.10008.5.1.1.18 Basic Color Print Management Meta SOP Class */
export const BasicColorPrintManagementMeta = new DicomUID("1.2.840.10008.5.1.1.18", "Basic Color Print Management Meta SOP Class", DicomUidType.MetaSOPClass, false);
DicomUID.register(BasicColorPrintManagementMeta);
/** 1.2.840.10008.5.1.1.18.1 Referenced Color Print Management Meta SOP Class (Retired) (Retired) */
export const ReferencedColorPrintManagementMeta = new DicomUID("1.2.840.10008.5.1.1.18.1", "Referenced Color Print Management Meta SOP Class (Retired)", DicomUidType.MetaSOPClass, true);
DicomUID.register(ReferencedColorPrintManagementMeta);
/** 1.2.840.10008.5.1.1.22 VOI LUT Box SOP Class */
export const VOILUTBox = new DicomUID("1.2.840.10008.5.1.1.22", "VOI LUT Box SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(VOILUTBox);
/** 1.2.840.10008.5.1.1.23 Presentation LUT SOP Class */
export const PresentationLUT = new DicomUID("1.2.840.10008.5.1.1.23", "Presentation LUT SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(PresentationLUT);
/** 1.2.840.10008.5.1.1.24 Image Overlay Box SOP Class (Retired) (Retired) */
export const ImageOverlayBox = new DicomUID("1.2.840.10008.5.1.1.24", "Image Overlay Box SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(ImageOverlayBox);
/** 1.2.840.10008.5.1.1.24.1 Basic Print Image Overlay Box SOP Class (Retired) (Retired) */
export const BasicPrintImageOverlayBox = new DicomUID("1.2.840.10008.5.1.1.24.1", "Basic Print Image Overlay Box SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(BasicPrintImageOverlayBox);
/** 1.2.840.10008.5.1.1.25 Print Queue SOP Instance (Retired) (Retired) */
export const PrintQueueInstance = new DicomUID("1.2.840.10008.5.1.1.25", "Print Queue SOP Instance (Retired)", DicomUidType.Unknown, true);
DicomUID.register(PrintQueueInstance);
/** 1.2.840.10008.5.1.1.26 Print Queue Management SOP Class (Retired) (Retired) */
export const PrintQueueManagement = new DicomUID("1.2.840.10008.5.1.1.26", "Print Queue Management SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(PrintQueueManagement);
/** 1.2.840.10008.5.1.1.27 Stored Print Storage SOP Class (Retired) (Retired) */
export const StoredPrintStorage = new DicomUID("1.2.840.10008.5.1.1.27", "Stored Print Storage SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(StoredPrintStorage);
/** 1.2.840.10008.5.1.1.29 Hardcopy Grayscale Image Storage SOP Class (Retired) (Retired) */
export const HardcopyGrayscaleImageStorage = new DicomUID("1.2.840.10008.5.1.1.29", "Hardcopy Grayscale Image Storage SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(HardcopyGrayscaleImageStorage);
/** 1.2.840.10008.5.1.1.30 Hardcopy Color Image Storage SOP Class (Retired) (Retired) */
export const HardcopyColorImageStorage = new DicomUID("1.2.840.10008.5.1.1.30", "Hardcopy Color Image Storage SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(HardcopyColorImageStorage);
/** 1.2.840.10008.5.1.1.31 Pull Print Request SOP Class (Retired) (Retired) */
export const PullPrintRequest = new DicomUID("1.2.840.10008.5.1.1.31", "Pull Print Request SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(PullPrintRequest);
/** 1.2.840.10008.5.1.1.32 Pull Stored Print Management Meta SOP Class (Retired) (Retired) */
export const PullStoredPrintManagementMeta = new DicomUID("1.2.840.10008.5.1.1.32", "Pull Stored Print Management Meta SOP Class (Retired)", DicomUidType.MetaSOPClass, true);
DicomUID.register(PullStoredPrintManagementMeta);
/** 1.2.840.10008.5.1.1.33 Media Creation Management SOP Class UID */
export const MediaCreationManagement = new DicomUID("1.2.840.10008.5.1.1.33", "Media Creation Management SOP Class UID", DicomUidType.SOPClass, false);
DicomUID.register(MediaCreationManagement);
/** 1.2.840.10008.5.1.1.40 Display System SOP Class */
export const DisplaySystem = new DicomUID("1.2.840.10008.5.1.1.40", "Display System SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(DisplaySystem);
/** 1.2.840.10008.5.1.1.40.1 Display System SOP Instance */
export const DisplaySystemInstance = new DicomUID("1.2.840.10008.5.1.1.40.1", "Display System SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(DisplaySystemInstance);
/** 1.2.840.10008.5.1.4.1.1.1 Computed Radiography Image Storage */
export const ComputedRadiographyImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.1", "Computed Radiography Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(ComputedRadiographyImageStorage);
/** 1.2.840.10008.5.1.4.1.1.1.1 Digital X-Ray Image Storage - For Presentation */
export const DigitalXRayImageStorageForPresentation = new DicomUID("1.2.840.10008.5.1.4.1.1.1.1", "Digital X-Ray Image Storage - For Presentation", DicomUidType.SOPClass, false);
DicomUID.register(DigitalXRayImageStorageForPresentation);
/** 1.2.840.10008.5.1.4.1.1.1.1.1 Digital X-Ray Image Storage - For Processing */
export const DigitalXRayImageStorageForProcessing = new DicomUID("1.2.840.10008.5.1.4.1.1.1.1.1", "Digital X-Ray Image Storage - For Processing", DicomUidType.SOPClass, false);
DicomUID.register(DigitalXRayImageStorageForProcessing);
/** 1.2.840.10008.5.1.4.1.1.1.2 Digital Mammography X-Ray Image Storage - For Presentation */
export const DigitalMammographyXRayImageStorageForPresentation = new DicomUID("1.2.840.10008.5.1.4.1.1.1.2", "Digital Mammography X-Ray Image Storage - For Presentation", DicomUidType.SOPClass, false);
DicomUID.register(DigitalMammographyXRayImageStorageForPresentation);
/** 1.2.840.10008.5.1.4.1.1.1.2.1 Digital Mammography X-Ray Image Storage - For Processing */
export const DigitalMammographyXRayImageStorageForProcessing = new DicomUID("1.2.840.10008.5.1.4.1.1.1.2.1", "Digital Mammography X-Ray Image Storage - For Processing", DicomUidType.SOPClass, false);
DicomUID.register(DigitalMammographyXRayImageStorageForProcessing);
/** 1.2.840.10008.5.1.4.1.1.1.3 Digital Intra-Oral X-Ray Image Storage - For Presentation */
export const DigitalIntraOralXRayImageStorageForPresentation = new DicomUID("1.2.840.10008.5.1.4.1.1.1.3", "Digital Intra-Oral X-Ray Image Storage - For Presentation", DicomUidType.SOPClass, false);
DicomUID.register(DigitalIntraOralXRayImageStorageForPresentation);
/** 1.2.840.10008.5.1.4.1.1.1.3.1 Digital Intra-Oral X-Ray Image Storage - For Processing */
export const DigitalIntraOralXRayImageStorageForProcessing = new DicomUID("1.2.840.10008.5.1.4.1.1.1.3.1", "Digital Intra-Oral X-Ray Image Storage - For Processing", DicomUidType.SOPClass, false);
DicomUID.register(DigitalIntraOralXRayImageStorageForProcessing);
/** 1.2.840.10008.5.1.4.1.1.2 CT Image Storage */
export const CTImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.2", "CT Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(CTImageStorage);
/** 1.2.840.10008.5.1.4.1.1.2.1 Enhanced CT Image Storage */
export const EnhancedCTImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.2.1", "Enhanced CT Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedCTImageStorage);
/** 1.2.840.10008.5.1.4.1.1.2.2 Legacy Converted Enhanced CT Image Storage */
export const LegacyConvertedEnhancedCTImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.2.2", "Legacy Converted Enhanced CT Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(LegacyConvertedEnhancedCTImageStorage);
/** 1.2.840.10008.5.1.4.1.1.3 Ultrasound Multi-frame Image Storage (Retired) (Retired) */
export const UltrasoundMultiFrameImageStorageRetired = new DicomUID("1.2.840.10008.5.1.4.1.1.3", "Ultrasound Multi-frame Image Storage (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(UltrasoundMultiFrameImageStorageRetired);
/** 1.2.840.10008.5.1.4.1.1.3.1 Ultrasound Multi-frame Image Storage */
export const UltrasoundMultiFrameImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.3.1", "Ultrasound Multi-frame Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(UltrasoundMultiFrameImageStorage);
/** 1.2.840.10008.5.1.4.1.1.4 MR Image Storage */
export const MRImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.4", "MR Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(MRImageStorage);
/** 1.2.840.10008.5.1.4.1.1.4.1 Enhanced MR Image Storage */
export const EnhancedMRImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.4.1", "Enhanced MR Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedMRImageStorage);
/** 1.2.840.10008.5.1.4.1.1.4.2 MR Spectroscopy Storage */
export const MRSpectroscopyStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.4.2", "MR Spectroscopy Storage", DicomUidType.SOPClass, false);
DicomUID.register(MRSpectroscopyStorage);
/** 1.2.840.10008.5.1.4.1.1.4.3 Enhanced MR Color Image Storage */
export const EnhancedMRColorImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.4.3", "Enhanced MR Color Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedMRColorImageStorage);
/** 1.2.840.10008.5.1.4.1.1.4.4 Legacy Converted Enhanced MR Image Storage */
export const LegacyConvertedEnhancedMRImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.4.4", "Legacy Converted Enhanced MR Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(LegacyConvertedEnhancedMRImageStorage);
/** 1.2.840.10008.5.1.4.1.1.5 Nuclear Medicine Image Storage (Retired) (Retired) */
export const NuclearMedicineImageStorageRetired = new DicomUID("1.2.840.10008.5.1.4.1.1.5", "Nuclear Medicine Image Storage (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(NuclearMedicineImageStorageRetired);
/** 1.2.840.10008.5.1.4.1.1.6 Ultrasound Image Storage (Retired) (Retired) */
export const UltrasoundImageStorageRetired = new DicomUID("1.2.840.10008.5.1.4.1.1.6", "Ultrasound Image Storage (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(UltrasoundImageStorageRetired);
/** 1.2.840.10008.5.1.4.1.1.6.1 Ultrasound Image Storage */
export const UltrasoundImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.6.1", "Ultrasound Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(UltrasoundImageStorage);
/** 1.2.840.10008.5.1.4.1.1.6.2 Enhanced US Volume Storage */
export const EnhancedUSVolumeStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.6.2", "Enhanced US Volume Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedUSVolumeStorage);
/** 1.2.840.10008.5.1.4.1.1.6.3 Photoacoustic Image Storage */
export const PhotoacousticImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.6.3", "Photoacoustic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(PhotoacousticImageStorage);
/** 1.2.840.10008.5.1.4.1.1.7 Secondary Capture Image Storage */
export const SecondaryCaptureImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.7", "Secondary Capture Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(SecondaryCaptureImageStorage);
/** 1.2.840.10008.5.1.4.1.1.7.1 Multi-frame Single Bit Secondary Capture Image Storage */
export const MultiFrameSingleBitSecondaryCaptureImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.7.1", "Multi-frame Single Bit Secondary Capture Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(MultiFrameSingleBitSecondaryCaptureImageStorage);
/** 1.2.840.10008.5.1.4.1.1.7.2 Multi-frame Grayscale Byte Secondary Capture Image Storage */
export const MultiFrameGrayscaleByteSecondaryCaptureImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.7.2", "Multi-frame Grayscale Byte Secondary Capture Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(MultiFrameGrayscaleByteSecondaryCaptureImageStorage);
/** 1.2.840.10008.5.1.4.1.1.7.3 Multi-frame Grayscale Word Secondary Capture Image Storage */
export const MultiFrameGrayscaleWordSecondaryCaptureImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.7.3", "Multi-frame Grayscale Word Secondary Capture Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(MultiFrameGrayscaleWordSecondaryCaptureImageStorage);
/** 1.2.840.10008.5.1.4.1.1.7.4 Multi-frame True Color Secondary Capture Image Storage */
export const MultiFrameTrueColorSecondaryCaptureImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.7.4", "Multi-frame True Color Secondary Capture Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(MultiFrameTrueColorSecondaryCaptureImageStorage);
/** 1.2.840.10008.5.1.4.1.1.8 Standalone Overlay Storage (Retired) (Retired) */
export const StandaloneOverlayStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.8", "Standalone Overlay Storage (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(StandaloneOverlayStorage);
/** 1.2.840.10008.5.1.4.1.1.9 Standalone Curve Storage (Retired) (Retired) */
export const StandaloneCurveStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9", "Standalone Curve Storage (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(StandaloneCurveStorage);
/** 1.2.840.10008.5.1.4.1.1.9.1 Waveform Storage - Trial (Retired) (Retired) */
export const WaveformStorageTrial = new DicomUID("1.2.840.10008.5.1.4.1.1.9.1", "Waveform Storage - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(WaveformStorageTrial);
/** 1.2.840.10008.5.1.4.1.1.9.1.1 12-lead ECG Waveform Storage */
export const TwelveLeadECGWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.1.1", "12-lead ECG Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(TwelveLeadECGWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.1.2 General ECG Waveform Storage */
export const GeneralECGWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.1.2", "General ECG Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(GeneralECGWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.1.3 Ambulatory ECG Waveform Storage */
export const AmbulatoryECGWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.1.3", "Ambulatory ECG Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(AmbulatoryECGWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.1.4 General 32-bit ECG Waveform Storage */
export const General32bitECGWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.1.4", "General 32-bit ECG Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(General32bitECGWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.2.1 Hemodynamic Waveform Storage */
export const HemodynamicWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.2.1", "Hemodynamic Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(HemodynamicWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.3.1 Cardiac Electrophysiology Waveform Storage */
export const CardiacElectrophysiologyWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.3.1", "Cardiac Electrophysiology Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(CardiacElectrophysiologyWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.4.1 Basic Voice Audio Waveform Storage */
export const BasicVoiceAudioWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.4.1", "Basic Voice Audio Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(BasicVoiceAudioWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.4.2 General Audio Waveform Storage */
export const GeneralAudioWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.4.2", "General Audio Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(GeneralAudioWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.5.1 Arterial Pulse Waveform Storage */
export const ArterialPulseWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.5.1", "Arterial Pulse Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(ArterialPulseWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.6.1 Respiratory Waveform Storage */
export const RespiratoryWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.6.1", "Respiratory Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(RespiratoryWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.6.2 Multi-channel Respiratory Waveform Storage */
export const MultichannelRespiratoryWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.6.2", "Multi-channel Respiratory Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(MultichannelRespiratoryWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.7.1 Routine Scalp Electroencephalogram Waveform Storage */
export const RoutineScalpElectroencephalogramWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.7.1", "Routine Scalp Electroencephalogram Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(RoutineScalpElectroencephalogramWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.7.2 Electromyogram Waveform Storage */
export const ElectromyogramWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.7.2", "Electromyogram Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(ElectromyogramWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.7.3 Electrooculogram Waveform Storage */
export const ElectrooculogramWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.7.3", "Electrooculogram Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(ElectrooculogramWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.7.4 Sleep Electroencephalogram Waveform Storage */
export const SleepElectroencephalogramWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.7.4", "Sleep Electroencephalogram Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(SleepElectroencephalogramWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.8.1 Body Position Waveform Storage */
export const BodyPositionWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.8.1", "Body Position Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(BodyPositionWaveformStorage);
/** 1.2.840.10008.5.1.4.1.1.9.100.1 Waveform Presentation State Storage */
export const WaveformPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.100.1", "Waveform Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(WaveformPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.9.100.2 Waveform Acquisition Presentation State Storage */
export const WaveformAcquisitionPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.9.100.2", "Waveform Acquisition Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(WaveformAcquisitionPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.10 Standalone Modality LUT Storage (Retired) (Retired) */
export const StandaloneModalityLUTStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.10", "Standalone Modality LUT Storage (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(StandaloneModalityLUTStorage);
/** 1.2.840.10008.5.1.4.1.1.11 Standalone VOI LUT Storage (Retired) (Retired) */
export const StandaloneVOILUTStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11", "Standalone VOI LUT Storage (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(StandaloneVOILUTStorage);
/** 1.2.840.10008.5.1.4.1.1.11.1 Grayscale Softcopy Presentation State Storage */
export const GrayscaleSoftcopyPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.1", "Grayscale Softcopy Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(GrayscaleSoftcopyPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.2 Color Softcopy Presentation State Storage */
export const ColorSoftcopyPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.2", "Color Softcopy Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(ColorSoftcopyPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.3 Pseudo-Color Softcopy Presentation State Storage */
export const PseudoColorSoftcopyPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.3", "Pseudo-Color Softcopy Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(PseudoColorSoftcopyPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.4 Blending Softcopy Presentation State Storage */
export const BlendingSoftcopyPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.4", "Blending Softcopy Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(BlendingSoftcopyPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.5 XA/XRF Grayscale Softcopy Presentation State Storage */
export const XAXRFGrayscaleSoftcopyPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.5", "XA/XRF Grayscale Softcopy Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(XAXRFGrayscaleSoftcopyPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.6 Grayscale Planar MPR Volumetric Presentation State Storage */
export const GrayscalePlanarMPRVolumetricPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.6", "Grayscale Planar MPR Volumetric Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(GrayscalePlanarMPRVolumetricPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.7 Compositing Planar MPR Volumetric Presentation State Storage */
export const CompositingPlanarMPRVolumetricPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.7", "Compositing Planar MPR Volumetric Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(CompositingPlanarMPRVolumetricPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.8 Advanced Blending Presentation State Storage */
export const AdvancedBlendingPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.8", "Advanced Blending Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(AdvancedBlendingPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.9 Volume Rendering Volumetric Presentation State Storage */
export const VolumeRenderingVolumetricPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.9", "Volume Rendering Volumetric Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(VolumeRenderingVolumetricPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.10 Segmented Volume Rendering Volumetric Presentation State Storage */
export const SegmentedVolumeRenderingVolumetricPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.10", "Segmented Volume Rendering Volumetric Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(SegmentedVolumeRenderingVolumetricPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.11 Multiple Volume Rendering Volumetric Presentation State Storage */
export const MultipleVolumeRenderingVolumetricPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.11", "Multiple Volume Rendering Volumetric Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(MultipleVolumeRenderingVolumetricPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.11.12 Variable Modality LUT Softcopy Presentation State Storage */
export const VariableModalityLUTSoftcopyPresentationStateStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.11.12", "Variable Modality LUT Softcopy Presentation State Storage", DicomUidType.SOPClass, false);
DicomUID.register(VariableModalityLUTSoftcopyPresentationStateStorage);
/** 1.2.840.10008.5.1.4.1.1.12.1 X-Ray Angiographic Image Storage */
export const XRayAngiographicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.12.1", "X-Ray Angiographic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(XRayAngiographicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.12.1.1 Enhanced XA Image Storage */
export const EnhancedXAImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.12.1.1", "Enhanced XA Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedXAImageStorage);
/** 1.2.840.10008.5.1.4.1.1.12.2 X-Ray Radiofluoroscopic Image Storage */
export const XRayRadiofluoroscopicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.12.2", "X-Ray Radiofluoroscopic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(XRayRadiofluoroscopicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.12.2.1 Enhanced XRF Image Storage */
export const EnhancedXRFImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.12.2.1", "Enhanced XRF Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedXRFImageStorage);
/** 1.2.840.10008.5.1.4.1.1.12.3 X-Ray Angiographic Bi-Plane Image Storage (Retired) (Retired) */
export const XRayAngiographicBiPlaneImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.12.3", "X-Ray Angiographic Bi-Plane Image Storage (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(XRayAngiographicBiPlaneImageStorage);
/** 1.2.840.10008.5.1.4.1.1.13.1.1 X-Ray 3D Angiographic Image Storage */
export const XRay3DAngiographicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.13.1.1", "X-Ray 3D Angiographic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(XRay3DAngiographicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.13.1.2 X-Ray 3D Craniofacial Image Storage */
export const XRay3DCraniofacialImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.13.1.2", "X-Ray 3D Craniofacial Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(XRay3DCraniofacialImageStorage);
/** 1.2.840.10008.5.1.4.1.1.13.1.3 Breast Tomosynthesis Image Storage */
export const BreastTomosynthesisImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.13.1.3", "Breast Tomosynthesis Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(BreastTomosynthesisImageStorage);
/** 1.2.840.10008.5.1.4.1.1.13.1.4 Breast Projection X-Ray Image Storage - For Presentation */
export const BreastProjectionXRayImageStorageForPresentation = new DicomUID("1.2.840.10008.5.1.4.1.1.13.1.4", "Breast Projection X-Ray Image Storage - For Presentation", DicomUidType.SOPClass, false);
DicomUID.register(BreastProjectionXRayImageStorageForPresentation);
/** 1.2.840.10008.5.1.4.1.1.13.1.5 Breast Projection X-Ray Image Storage - For Processing */
export const BreastProjectionXRayImageStorageForProcessing = new DicomUID("1.2.840.10008.5.1.4.1.1.13.1.5", "Breast Projection X-Ray Image Storage - For Processing", DicomUidType.SOPClass, false);
DicomUID.register(BreastProjectionXRayImageStorageForProcessing);
/** 1.2.840.10008.5.1.4.1.1.14.1 Intravascular Optical Coherence Tomography Image Storage - For Presentation */
export const IntravascularOpticalCoherenceTomographyImageStorageForPresentation = new DicomUID("1.2.840.10008.5.1.4.1.1.14.1", "Intravascular Optical Coherence Tomography Image Storage - For Presentation", DicomUidType.SOPClass, false);
DicomUID.register(IntravascularOpticalCoherenceTomographyImageStorageForPresentation);
/** 1.2.840.10008.5.1.4.1.1.14.2 Intravascular Optical Coherence Tomography Image Storage - For Processing */
export const IntravascularOpticalCoherenceTomographyImageStorageForProcessing = new DicomUID("1.2.840.10008.5.1.4.1.1.14.2", "Intravascular Optical Coherence Tomography Image Storage - For Processing", DicomUidType.SOPClass, false);
DicomUID.register(IntravascularOpticalCoherenceTomographyImageStorageForProcessing);
/** 1.2.840.10008.5.1.4.1.1.20 Nuclear Medicine Image Storage */
export const NuclearMedicineImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.20", "Nuclear Medicine Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(NuclearMedicineImageStorage);
/** 1.2.840.10008.5.1.4.1.1.30 Parametric Map Storage */
export const ParametricMapStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.30", "Parametric Map Storage", DicomUidType.SOPClass, false);
DicomUID.register(ParametricMapStorage);
/** 1.2.840.10008.5.1.4.1.1.66 Raw Data Storage */
export const RawDataStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.66", "Raw Data Storage", DicomUidType.SOPClass, false);
DicomUID.register(RawDataStorage);
/** 1.2.840.10008.5.1.4.1.1.66.1 Spatial Registration Storage */
export const SpatialRegistrationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.66.1", "Spatial Registration Storage", DicomUidType.SOPClass, false);
DicomUID.register(SpatialRegistrationStorage);
/** 1.2.840.10008.5.1.4.1.1.66.2 Spatial Fiducials Storage */
export const SpatialFiducialsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.66.2", "Spatial Fiducials Storage", DicomUidType.SOPClass, false);
DicomUID.register(SpatialFiducialsStorage);
/** 1.2.840.10008.5.1.4.1.1.66.3 Deformable Spatial Registration Storage */
export const DeformableSpatialRegistrationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.66.3", "Deformable Spatial Registration Storage", DicomUidType.SOPClass, false);
DicomUID.register(DeformableSpatialRegistrationStorage);
/** 1.2.840.10008.5.1.4.1.1.66.4 Segmentation Storage */
export const SegmentationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.66.4", "Segmentation Storage", DicomUidType.SOPClass, false);
DicomUID.register(SegmentationStorage);
/** 1.2.840.10008.5.1.4.1.1.66.5 Surface Segmentation Storage */
export const SurfaceSegmentationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.66.5", "Surface Segmentation Storage", DicomUidType.SOPClass, false);
DicomUID.register(SurfaceSegmentationStorage);
/** 1.2.840.10008.5.1.4.1.1.66.6 Tractography Results Storage */
export const TractographyResultsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.66.6", "Tractography Results Storage", DicomUidType.SOPClass, false);
DicomUID.register(TractographyResultsStorage);
/** 1.2.840.10008.5.1.4.1.1.66.7 Label Map Segmentation Storage */
export const LabelMapSegmentationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.66.7", "Label Map Segmentation Storage", DicomUidType.SOPClass, false);
DicomUID.register(LabelMapSegmentationStorage);
/** 1.2.840.10008.5.1.4.1.1.66.8 Height Map Segmentation Storage */
export const HeightMapSegmentationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.66.8", "Height Map Segmentation Storage", DicomUidType.SOPClass, false);
DicomUID.register(HeightMapSegmentationStorage);
/** 1.2.840.10008.5.1.4.1.1.67 Real World Value Mapping Storage */
export const RealWorldValueMappingStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.67", "Real World Value Mapping Storage", DicomUidType.SOPClass, false);
DicomUID.register(RealWorldValueMappingStorage);
/** 1.2.840.10008.5.1.4.1.1.68.1 Surface Scan Mesh Storage */
export const SurfaceScanMeshStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.68.1", "Surface Scan Mesh Storage", DicomUidType.SOPClass, false);
DicomUID.register(SurfaceScanMeshStorage);
/** 1.2.840.10008.5.1.4.1.1.68.2 Surface Scan Point Cloud Storage */
export const SurfaceScanPointCloudStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.68.2", "Surface Scan Point Cloud Storage", DicomUidType.SOPClass, false);
DicomUID.register(SurfaceScanPointCloudStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1 VL Image Storage - Trial (Retired) (Retired) */
export const VLImageStorageTrial = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1", "VL Image Storage - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(VLImageStorageTrial);
/** 1.2.840.10008.5.1.4.1.1.77.2 VL Multi-frame Image Storage - Trial (Retired) (Retired) */
export const VLMultiFrameImageStorageTrial = new DicomUID("1.2.840.10008.5.1.4.1.1.77.2", "VL Multi-frame Image Storage - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(VLMultiFrameImageStorageTrial);
/** 1.2.840.10008.5.1.4.1.1.77.1.1 VL Endoscopic Image Storage */
export const VLEndoscopicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.1", "VL Endoscopic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(VLEndoscopicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.1.1 Video Endoscopic Image Storage */
export const VideoEndoscopicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.1.1", "Video Endoscopic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(VideoEndoscopicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.2 VL Microscopic Image Storage */
export const VLMicroscopicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.2", "VL Microscopic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(VLMicroscopicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.2.1 Video Microscopic Image Storage */
export const VideoMicroscopicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.2.1", "Video Microscopic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(VideoMicroscopicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.3 VL Slide-Coordinates Microscopic Image Storage */
export const VLSlideCoordinatesMicroscopicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.3", "VL Slide-Coordinates Microscopic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(VLSlideCoordinatesMicroscopicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.4 VL Photographic Image Storage */
export const VLPhotographicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.4", "VL Photographic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(VLPhotographicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.4.1 Video Photographic Image Storage */
export const VideoPhotographicImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.4.1", "Video Photographic Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(VideoPhotographicImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.5.1 Ophthalmic Photography 8 Bit Image Storage */
export const OphthalmicPhotography8BitImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.5.1", "Ophthalmic Photography 8 Bit Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(OphthalmicPhotography8BitImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.5.2 Ophthalmic Photography 16 Bit Image Storage */
export const OphthalmicPhotography16BitImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.5.2", "Ophthalmic Photography 16 Bit Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(OphthalmicPhotography16BitImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.5.3 Stereometric Relationship Storage */
export const StereometricRelationshipStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.5.3", "Stereometric Relationship Storage", DicomUidType.SOPClass, false);
DicomUID.register(StereometricRelationshipStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.5.4 Ophthalmic Tomography Image Storage */
export const OphthalmicTomographyImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.5.4", "Ophthalmic Tomography Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(OphthalmicTomographyImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.5.5 Wide Field Ophthalmic Photography Stereographic Projection Image Storage */
export const WideFieldOphthalmicPhotographyStereographicProjectionImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.5.5", "Wide Field Ophthalmic Photography Stereographic Projection Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(WideFieldOphthalmicPhotographyStereographicProjectionImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.5.6 Wide Field Ophthalmic Photography 3D Coordinates Image Storage */
export const WideFieldOphthalmicPhotography3DCoordinatesImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.5.6", "Wide Field Ophthalmic Photography 3D Coordinates Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(WideFieldOphthalmicPhotography3DCoordinatesImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.5.7 Ophthalmic Optical Coherence Tomography En Face Image Storage */
export const OphthalmicOpticalCoherenceTomographyEnFaceImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.5.7", "Ophthalmic Optical Coherence Tomography En Face Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(OphthalmicOpticalCoherenceTomographyEnFaceImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.5.8 Ophthalmic Optical Coherence Tomography B-scan Volume Analysis Storage */
export const OphthalmicOpticalCoherenceTomographyBscanVolumeAnalysisStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.5.8", "Ophthalmic Optical Coherence Tomography B-scan Volume Analysis Storage", DicomUidType.SOPClass, false);
DicomUID.register(OphthalmicOpticalCoherenceTomographyBscanVolumeAnalysisStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.6 VL Whole Slide Microscopy Image Storage */
export const VLWholeSlideMicroscopyImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.6", "VL Whole Slide Microscopy Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(VLWholeSlideMicroscopyImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.7 Dermoscopic Photography Image Storage */
export const DermoscopicPhotographyImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.7", "Dermoscopic Photography Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(DermoscopicPhotographyImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.8 Confocal Microscopy Image Storage */
export const ConfocalMicroscopyImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.8", "Confocal Microscopy Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(ConfocalMicroscopyImageStorage);
/** 1.2.840.10008.5.1.4.1.1.77.1.9 Confocal Microscopy Tiled Pyramidal Image Storage */
export const ConfocalMicroscopyTiledPyramidalImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.77.1.9", "Confocal Microscopy Tiled Pyramidal Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(ConfocalMicroscopyTiledPyramidalImageStorage);
/** 1.2.840.10008.5.1.4.1.1.78.1 Lensometry Measurements Storage */
export const LensometryMeasurementsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.78.1", "Lensometry Measurements Storage", DicomUidType.SOPClass, false);
DicomUID.register(LensometryMeasurementsStorage);
/** 1.2.840.10008.5.1.4.1.1.78.2 Autorefraction Measurements Storage */
export const AutorefractionMeasurementsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.78.2", "Autorefraction Measurements Storage", DicomUidType.SOPClass, false);
DicomUID.register(AutorefractionMeasurementsStorage);
/** 1.2.840.10008.5.1.4.1.1.78.3 Keratometry Measurements Storage */
export const KeratometryMeasurementsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.78.3", "Keratometry Measurements Storage", DicomUidType.SOPClass, false);
DicomUID.register(KeratometryMeasurementsStorage);
/** 1.2.840.10008.5.1.4.1.1.78.4 Subjective Refraction Measurements Storage */
export const SubjectiveRefractionMeasurementsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.78.4", "Subjective Refraction Measurements Storage", DicomUidType.SOPClass, false);
DicomUID.register(SubjectiveRefractionMeasurementsStorage);
/** 1.2.840.10008.5.1.4.1.1.78.5 Visual Acuity Measurements Storage */
export const VisualAcuityMeasurementsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.78.5", "Visual Acuity Measurements Storage", DicomUidType.SOPClass, false);
DicomUID.register(VisualAcuityMeasurementsStorage);
/** 1.2.840.10008.5.1.4.1.1.78.6 Spectacle Prescription Report Storage */
export const SpectaclePrescriptionReportStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.78.6", "Spectacle Prescription Report Storage", DicomUidType.SOPClass, false);
DicomUID.register(SpectaclePrescriptionReportStorage);
/** 1.2.840.10008.5.1.4.1.1.78.7 Ophthalmic Axial Measurements Storage */
export const OphthalmicAxialMeasurementsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.78.7", "Ophthalmic Axial Measurements Storage", DicomUidType.SOPClass, false);
DicomUID.register(OphthalmicAxialMeasurementsStorage);
/** 1.2.840.10008.5.1.4.1.1.78.8 Intraocular Lens Calculations Storage */
export const IntraocularLensCalculationsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.78.8", "Intraocular Lens Calculations Storage", DicomUidType.SOPClass, false);
DicomUID.register(IntraocularLensCalculationsStorage);
/** 1.2.840.10008.5.1.4.1.1.79.1 Macular Grid Thickness and Volume Report Storage */
export const MacularGridThicknessAndVolumeReportStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.79.1", "Macular Grid Thickness and Volume Report Storage", DicomUidType.SOPClass, false);
DicomUID.register(MacularGridThicknessAndVolumeReportStorage);
/** 1.2.840.10008.5.1.4.1.1.80.1 Ophthalmic Visual Field Static Perimetry Measurements Storage */
export const OphthalmicVisualFieldStaticPerimetryMeasurementsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.80.1", "Ophthalmic Visual Field Static Perimetry Measurements Storage", DicomUidType.SOPClass, false);
DicomUID.register(OphthalmicVisualFieldStaticPerimetryMeasurementsStorage);
/** 1.2.840.10008.5.1.4.1.1.81.1 Ophthalmic Thickness Map Storage */
export const OphthalmicThicknessMapStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.81.1", "Ophthalmic Thickness Map Storage", DicomUidType.SOPClass, false);
DicomUID.register(OphthalmicThicknessMapStorage);
/** 1.2.840.10008.5.1.4.1.1.82.1 Corneal Topography Map Storage */
export const CornealTopographyMapStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.82.1", "Corneal Topography Map Storage", DicomUidType.SOPClass, false);
DicomUID.register(CornealTopographyMapStorage);
/** 1.2.840.10008.5.1.4.1.1.88.1 Text SR Storage - Trial (Retired) (Retired) */
export const TextSRStorageTrial = new DicomUID("1.2.840.10008.5.1.4.1.1.88.1", "Text SR Storage - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(TextSRStorageTrial);
/** 1.2.840.10008.5.1.4.1.1.88.2 Audio SR Storage - Trial (Retired) (Retired) */
export const AudioSRStorageTrial = new DicomUID("1.2.840.10008.5.1.4.1.1.88.2", "Audio SR Storage - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(AudioSRStorageTrial);
/** 1.2.840.10008.5.1.4.1.1.88.3 Detail SR Storage - Trial (Retired) (Retired) */
export const DetailSRStorageTrial = new DicomUID("1.2.840.10008.5.1.4.1.1.88.3", "Detail SR Storage - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(DetailSRStorageTrial);
/** 1.2.840.10008.5.1.4.1.1.88.4 Comprehensive SR Storage - Trial (Retired) (Retired) */
export const ComprehensiveSRStorageTrial = new DicomUID("1.2.840.10008.5.1.4.1.1.88.4", "Comprehensive SR Storage - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(ComprehensiveSRStorageTrial);
/** 1.2.840.10008.5.1.4.1.1.88.11 Basic Text SR Storage */
export const BasicTextSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.11", "Basic Text SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(BasicTextSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.22 Enhanced SR Storage */
export const EnhancedSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.22", "Enhanced SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.33 Comprehensive SR Storage */
export const ComprehensiveSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.33", "Comprehensive SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(ComprehensiveSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.34 Comprehensive 3D SR Storage */
export const Comprehensive3DSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.34", "Comprehensive 3D SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(Comprehensive3DSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.35 Extensible SR Storage */
export const ExtensibleSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.35", "Extensible SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(ExtensibleSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.40 Procedure Log Storage */
export const ProcedureLogStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.40", "Procedure Log Storage", DicomUidType.SOPClass, false);
DicomUID.register(ProcedureLogStorage);
/** 1.2.840.10008.5.1.4.1.1.88.50 Mammography CAD SR Storage */
export const MammographyCADSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.50", "Mammography CAD SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(MammographyCADSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.59 Key Object Selection Document Storage */
export const KeyObjectSelectionDocumentStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.59", "Key Object Selection Document Storage", DicomUidType.SOPClass, false);
DicomUID.register(KeyObjectSelectionDocumentStorage);
/** 1.2.840.10008.5.1.4.1.1.88.65 Chest CAD SR Storage */
export const ChestCADSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.65", "Chest CAD SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(ChestCADSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.67 X-Ray Radiation Dose SR Storage */
export const XRayRadiationDoseSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.67", "X-Ray Radiation Dose SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(XRayRadiationDoseSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.68 Radiopharmaceutical Radiation Dose SR Storage */
export const RadiopharmaceuticalRadiationDoseSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.68", "Radiopharmaceutical Radiation Dose SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(RadiopharmaceuticalRadiationDoseSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.69 Colon CAD SR Storage */
export const ColonCADSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.69", "Colon CAD SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(ColonCADSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.70 Implantation Plan SR Storage */
export const ImplantationPlanSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.70", "Implantation Plan SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(ImplantationPlanSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.71 Acquisition Context SR Storage */
export const AcquisitionContextSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.71", "Acquisition Context SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(AcquisitionContextSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.72 Simplified Adult Echo SR Storage */
export const SimplifiedAdultEchoSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.72", "Simplified Adult Echo SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(SimplifiedAdultEchoSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.73 Patient Radiation Dose SR Storage */
export const PatientRadiationDoseSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.73", "Patient Radiation Dose SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(PatientRadiationDoseSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.74 Planned Imaging Agent Administration SR Storage */
export const PlannedImagingAgentAdministrationSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.74", "Planned Imaging Agent Administration SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(PlannedImagingAgentAdministrationSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.75 Performed Imaging Agent Administration SR Storage */
export const PerformedImagingAgentAdministrationSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.75", "Performed Imaging Agent Administration SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(PerformedImagingAgentAdministrationSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.76 Enhanced X-Ray Radiation Dose SR Storage */
export const EnhancedXRayRadiationDoseSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.76", "Enhanced X-Ray Radiation Dose SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedXRayRadiationDoseSRStorage);
/** 1.2.840.10008.5.1.4.1.1.88.77 Waveform Annotation SR Storage */
export const WaveformAnnotationSRStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.88.77", "Waveform Annotation SR Storage", DicomUidType.SOPClass, false);
DicomUID.register(WaveformAnnotationSRStorage);
/** 1.2.840.10008.5.1.4.1.1.90.1 Content Assessment Results Storage */
export const ContentAssessmentResultsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.90.1", "Content Assessment Results Storage", DicomUidType.SOPClass, false);
DicomUID.register(ContentAssessmentResultsStorage);
/** 1.2.840.10008.5.1.4.1.1.91.1 Microscopy Bulk Simple Annotations Storage */
export const MicroscopyBulkSimpleAnnotationsStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.91.1", "Microscopy Bulk Simple Annotations Storage", DicomUidType.SOPClass, false);
DicomUID.register(MicroscopyBulkSimpleAnnotationsStorage);
/** 1.2.840.10008.5.1.4.1.1.104.1 Encapsulated PDF Storage */
export const EncapsulatedPDFStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.104.1", "Encapsulated PDF Storage", DicomUidType.SOPClass, false);
DicomUID.register(EncapsulatedPDFStorage);
/** 1.2.840.10008.5.1.4.1.1.104.2 Encapsulated CDA Storage */
export const EncapsulatedCDAStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.104.2", "Encapsulated CDA Storage", DicomUidType.SOPClass, false);
DicomUID.register(EncapsulatedCDAStorage);
/** 1.2.840.10008.5.1.4.1.1.104.3 Encapsulated STL Storage */
export const EncapsulatedSTLStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.104.3", "Encapsulated STL Storage", DicomUidType.SOPClass, false);
DicomUID.register(EncapsulatedSTLStorage);
/** 1.2.840.10008.5.1.4.1.1.104.4 Encapsulated OBJ Storage */
export const EncapsulatedOBJStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.104.4", "Encapsulated OBJ Storage", DicomUidType.SOPClass, false);
DicomUID.register(EncapsulatedOBJStorage);
/** 1.2.840.10008.5.1.4.1.1.104.5 Encapsulated MTL Storage */
export const EncapsulatedMTLStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.104.5", "Encapsulated MTL Storage", DicomUidType.SOPClass, false);
DicomUID.register(EncapsulatedMTLStorage);
/** 1.2.840.10008.5.1.4.1.1.128 Positron Emission Tomography Image Storage */
export const PositronEmissionTomographyImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.128", "Positron Emission Tomography Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(PositronEmissionTomographyImageStorage);
/** 1.2.840.10008.5.1.4.1.1.128.1 Legacy Converted Enhanced PET Image Storage */
export const LegacyConvertedEnhancedPETImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.128.1", "Legacy Converted Enhanced PET Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(LegacyConvertedEnhancedPETImageStorage);
/** 1.2.840.10008.5.1.4.1.1.129 Standalone PET Curve Storage (Retired) (Retired) */
export const StandalonePETCurveStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.129", "Standalone PET Curve Storage (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(StandalonePETCurveStorage);
/** 1.2.840.10008.5.1.4.1.1.130 Enhanced PET Image Storage */
export const EnhancedPETImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.130", "Enhanced PET Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedPETImageStorage);
/** 1.2.840.10008.5.1.4.1.1.131 Basic Structured Display Storage */
export const BasicStructuredDisplayStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.131", "Basic Structured Display Storage", DicomUidType.SOPClass, false);
DicomUID.register(BasicStructuredDisplayStorage);
/** 1.2.840.10008.5.1.4.1.1.200.1 CT Defined Procedure Protocol Storage */
export const CTDefinedProcedureProtocolStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.200.1", "CT Defined Procedure Protocol Storage", DicomUidType.SOPClass, false);
DicomUID.register(CTDefinedProcedureProtocolStorage);
/** 1.2.840.10008.5.1.4.1.1.200.2 CT Performed Procedure Protocol Storage */
export const CTPerformedProcedureProtocolStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.200.2", "CT Performed Procedure Protocol Storage", DicomUidType.SOPClass, false);
DicomUID.register(CTPerformedProcedureProtocolStorage);
/** 1.2.840.10008.5.1.4.1.1.200.3 Protocol Approval Storage */
export const ProtocolApprovalStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.200.3", "Protocol Approval Storage", DicomUidType.SOPClass, false);
DicomUID.register(ProtocolApprovalStorage);
/** 1.2.840.10008.5.1.4.1.1.200.4 Protocol Approval Information Model - FIND */
export const ProtocolApprovalInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.1.1.200.4", "Protocol Approval Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(ProtocolApprovalInformationModelFind);
/** 1.2.840.10008.5.1.4.1.1.200.5 Protocol Approval Information Model - MOVE */
export const ProtocolApprovalInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.1.1.200.5", "Protocol Approval Information Model - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(ProtocolApprovalInformationModelMove);
/** 1.2.840.10008.5.1.4.1.1.200.6 Protocol Approval Information Model - GET */
export const ProtocolApprovalInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.1.1.200.6", "Protocol Approval Information Model - GET", DicomUidType.SOPClass, false);
DicomUID.register(ProtocolApprovalInformationModelGet);
/** 1.2.840.10008.5.1.4.1.1.200.7 XA Defined Procedure Protocol Storage */
export const XADefinedProcedureProtocolStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.200.7", "XA Defined Procedure Protocol Storage", DicomUidType.SOPClass, false);
DicomUID.register(XADefinedProcedureProtocolStorage);
/** 1.2.840.10008.5.1.4.1.1.200.8 XA Performed Procedure Protocol Storage */
export const XAPerformedProcedureProtocolStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.200.8", "XA Performed Procedure Protocol Storage", DicomUidType.SOPClass, false);
DicomUID.register(XAPerformedProcedureProtocolStorage);
/** 1.2.840.10008.5.1.4.1.1.201.1 Inventory Storage */
export const InventoryStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.201.1", "Inventory Storage", DicomUidType.SOPClass, false);
DicomUID.register(InventoryStorage);
/** 1.2.840.10008.5.1.4.1.1.201.2 Inventory - FIND */
export const InventoryFind = new DicomUID("1.2.840.10008.5.1.4.1.1.201.2", "Inventory - FIND", DicomUidType.SOPClass, false);
DicomUID.register(InventoryFind);
/** 1.2.840.10008.5.1.4.1.1.201.3 Inventory - MOVE */
export const InventoryMove = new DicomUID("1.2.840.10008.5.1.4.1.1.201.3", "Inventory - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(InventoryMove);
/** 1.2.840.10008.5.1.4.1.1.201.4 Inventory - GET */
export const InventoryGet = new DicomUID("1.2.840.10008.5.1.4.1.1.201.4", "Inventory - GET", DicomUidType.SOPClass, false);
DicomUID.register(InventoryGet);
/** 1.2.840.10008.5.1.4.1.1.201.5 Inventory Creation */
export const InventoryCreation = new DicomUID("1.2.840.10008.5.1.4.1.1.201.5", "Inventory Creation", DicomUidType.SOPClass, false);
DicomUID.register(InventoryCreation);
/** 1.2.840.10008.5.1.4.1.1.201.6 Repository Query */
export const RepositoryQuery = new DicomUID("1.2.840.10008.5.1.4.1.1.201.6", "Repository Query", DicomUidType.SOPClass, false);
DicomUID.register(RepositoryQuery);
/** 1.2.840.10008.5.1.4.1.1.201.1.1 Storage Management SOP Instance */
export const StorageManagementInstance = new DicomUID("1.2.840.10008.5.1.4.1.1.201.1.1", "Storage Management SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(StorageManagementInstance);
/** 1.2.840.10008.5.1.4.1.1.481.1 RT Image Storage */
export const RTImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.1", "RT Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTImageStorage);
/** 1.2.840.10008.5.1.4.1.1.481.2 RT Dose Storage */
export const RTDoseStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.2", "RT Dose Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTDoseStorage);
/** 1.2.840.10008.5.1.4.1.1.481.3 RT Structure Set Storage */
export const RTStructureSetStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.3", "RT Structure Set Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTStructureSetStorage);
/** 1.2.840.10008.5.1.4.1.1.481.4 RT Beams Treatment Record Storage */
export const RTBeamsTreatmentRecordStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.4", "RT Beams Treatment Record Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTBeamsTreatmentRecordStorage);
/** 1.2.840.10008.5.1.4.1.1.481.5 RT Plan Storage */
export const RTPlanStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.5", "RT Plan Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTPlanStorage);
/** 1.2.840.10008.5.1.4.1.1.481.6 RT Brachy Treatment Record Storage */
export const RTBrachyTreatmentRecordStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.6", "RT Brachy Treatment Record Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTBrachyTreatmentRecordStorage);
/** 1.2.840.10008.5.1.4.1.1.481.7 RT Treatment Summary Record Storage */
export const RTTreatmentSummaryRecordStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.7", "RT Treatment Summary Record Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTTreatmentSummaryRecordStorage);
/** 1.2.840.10008.5.1.4.1.1.481.8 RT Ion Plan Storage */
export const RTIonPlanStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.8", "RT Ion Plan Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTIonPlanStorage);
/** 1.2.840.10008.5.1.4.1.1.481.9 RT Ion Beams Treatment Record Storage */
export const RTIonBeamsTreatmentRecordStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.9", "RT Ion Beams Treatment Record Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTIonBeamsTreatmentRecordStorage);
/** 1.2.840.10008.5.1.4.1.1.481.10 RT Physician Intent Storage */
export const RTPhysicianIntentStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.10", "RT Physician Intent Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTPhysicianIntentStorage);
/** 1.2.840.10008.5.1.4.1.1.481.11 RT Segment Annotation Storage */
export const RTSegmentAnnotationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.11", "RT Segment Annotation Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTSegmentAnnotationStorage);
/** 1.2.840.10008.5.1.4.1.1.481.12 RT Radiation Set Storage */
export const RTRadiationSetStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.12", "RT Radiation Set Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTRadiationSetStorage);
/** 1.2.840.10008.5.1.4.1.1.481.13 C-Arm Photon-Electron Radiation Storage */
export const CArmPhotonElectronRadiationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.13", "C-Arm Photon-Electron Radiation Storage", DicomUidType.SOPClass, false);
DicomUID.register(CArmPhotonElectronRadiationStorage);
/** 1.2.840.10008.5.1.4.1.1.481.14 Tomotherapeutic Radiation Storage */
export const TomotherapeuticRadiationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.14", "Tomotherapeutic Radiation Storage", DicomUidType.SOPClass, false);
DicomUID.register(TomotherapeuticRadiationStorage);
/** 1.2.840.10008.5.1.4.1.1.481.15 Robotic-Arm Radiation Storage */
export const RoboticArmRadiationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.15", "Robotic-Arm Radiation Storage", DicomUidType.SOPClass, false);
DicomUID.register(RoboticArmRadiationStorage);
/** 1.2.840.10008.5.1.4.1.1.481.16 RT Radiation Record Set Storage */
export const RTRadiationRecordSetStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.16", "RT Radiation Record Set Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTRadiationRecordSetStorage);
/** 1.2.840.10008.5.1.4.1.1.481.17 RT Radiation Salvage Record Storage */
export const RTRadiationSalvageRecordStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.17", "RT Radiation Salvage Record Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTRadiationSalvageRecordStorage);
/** 1.2.840.10008.5.1.4.1.1.481.18 Tomotherapeutic Radiation Record Storage */
export const TomotherapeuticRadiationRecordStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.18", "Tomotherapeutic Radiation Record Storage", DicomUidType.SOPClass, false);
DicomUID.register(TomotherapeuticRadiationRecordStorage);
/** 1.2.840.10008.5.1.4.1.1.481.19 C-Arm Photon-Electron Radiation Record Storage */
export const CArmPhotonElectronRadiationRecordStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.19", "C-Arm Photon-Electron Radiation Record Storage", DicomUidType.SOPClass, false);
DicomUID.register(CArmPhotonElectronRadiationRecordStorage);
/** 1.2.840.10008.5.1.4.1.1.481.20 Robotic Radiation Record Storage */
export const RoboticRadiationRecordStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.20", "Robotic Radiation Record Storage", DicomUidType.SOPClass, false);
DicomUID.register(RoboticRadiationRecordStorage);
/** 1.2.840.10008.5.1.4.1.1.481.21 RT Radiation Set Delivery Instruction Storage */
export const RTRadiationSetDeliveryInstructionStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.21", "RT Radiation Set Delivery Instruction Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTRadiationSetDeliveryInstructionStorage);
/** 1.2.840.10008.5.1.4.1.1.481.22 RT Treatment Preparation Storage */
export const RTTreatmentPreparationStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.22", "RT Treatment Preparation Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTTreatmentPreparationStorage);
/** 1.2.840.10008.5.1.4.1.1.481.23 Enhanced RT Image Storage */
export const EnhancedRTImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.23", "Enhanced RT Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedRTImageStorage);
/** 1.2.840.10008.5.1.4.1.1.481.24 Enhanced Continuous RT Image Storage */
export const EnhancedContinuousRTImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.24", "Enhanced Continuous RT Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EnhancedContinuousRTImageStorage);
/** 1.2.840.10008.5.1.4.1.1.481.25 RT Patient Position Acquisition Instruction Storage */
export const RTPatientPositionAcquisitionInstructionStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.481.25", "RT Patient Position Acquisition Instruction Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTPatientPositionAcquisitionInstructionStorage);
/** 1.2.840.10008.5.1.4.1.1.501.1 DICOS CT Image Storage */
export const DICOSCTImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.501.1", "DICOS CT Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(DICOSCTImageStorage);
/** 1.2.840.10008.5.1.4.1.1.501.2.1 DICOS Digital X-Ray Image Storage - For Presentation */
export const DICOSDigitalXRayImageStorageForPresentation = new DicomUID("1.2.840.10008.5.1.4.1.1.501.2.1", "DICOS Digital X-Ray Image Storage - For Presentation", DicomUidType.SOPClass, false);
DicomUID.register(DICOSDigitalXRayImageStorageForPresentation);
/** 1.2.840.10008.5.1.4.1.1.501.2.2 DICOS Digital X-Ray Image Storage - For Processing */
export const DICOSDigitalXRayImageStorageForProcessing = new DicomUID("1.2.840.10008.5.1.4.1.1.501.2.2", "DICOS Digital X-Ray Image Storage - For Processing", DicomUidType.SOPClass, false);
DicomUID.register(DICOSDigitalXRayImageStorageForProcessing);
/** 1.2.840.10008.5.1.4.1.1.501.3 DICOS Threat Detection Report Storage */
export const DICOSThreatDetectionReportStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.501.3", "DICOS Threat Detection Report Storage", DicomUidType.SOPClass, false);
DicomUID.register(DICOSThreatDetectionReportStorage);
/** 1.2.840.10008.5.1.4.1.1.501.4 DICOS 2D AIT Storage */
export const DICOS2DAITStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.501.4", "DICOS 2D AIT Storage", DicomUidType.SOPClass, false);
DicomUID.register(DICOS2DAITStorage);
/** 1.2.840.10008.5.1.4.1.1.501.5 DICOS 3D AIT Storage */
export const DICOS3DAITStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.501.5", "DICOS 3D AIT Storage", DicomUidType.SOPClass, false);
DicomUID.register(DICOS3DAITStorage);
/** 1.2.840.10008.5.1.4.1.1.501.6 DICOS Quadrupole Resonance (QR) Storage */
export const DICOSQuadrupoleResonanceStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.501.6", "DICOS Quadrupole Resonance (QR) Storage", DicomUidType.SOPClass, false);
DicomUID.register(DICOSQuadrupoleResonanceStorage);
/** 1.2.840.10008.5.1.4.1.1.601.1 Eddy Current Image Storage */
export const EddyCurrentImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.601.1", "Eddy Current Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EddyCurrentImageStorage);
/** 1.2.840.10008.5.1.4.1.1.601.2 Eddy Current Multi-frame Image Storage */
export const EddyCurrentMultiFrameImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.601.2", "Eddy Current Multi-frame Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(EddyCurrentMultiFrameImageStorage);
/** 1.2.840.10008.5.1.4.1.1.601.3 Thermography Image Storage */
export const ThermographyImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.601.3", "Thermography Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(ThermographyImageStorage);
/** 1.2.840.10008.5.1.4.1.1.601.4 Thermography Multi-frame Image Storage */
export const ThermographyMultiFrameImageStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.601.4", "Thermography Multi-frame Image Storage", DicomUidType.SOPClass, false);
DicomUID.register(ThermographyMultiFrameImageStorage);
/** 1.2.840.10008.5.1.4.1.1.601.5 Ultrasound Waveform Storage */
export const UltrasoundWaveformStorage = new DicomUID("1.2.840.10008.5.1.4.1.1.601.5", "Ultrasound Waveform Storage", DicomUidType.SOPClass, false);
DicomUID.register(UltrasoundWaveformStorage);
/** 1.2.840.10008.5.1.4.1.2.1.1 Patient Root Query/Retrieve Information Model - FIND */
export const PatientRootQueryRetrieveInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.1.2.1.1", "Patient Root Query/Retrieve Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(PatientRootQueryRetrieveInformationModelFind);
/** 1.2.840.10008.5.1.4.1.2.1.2 Patient Root Query/Retrieve Information Model - MOVE */
export const PatientRootQueryRetrieveInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.1.2.1.2", "Patient Root Query/Retrieve Information Model - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(PatientRootQueryRetrieveInformationModelMove);
/** 1.2.840.10008.5.1.4.1.2.1.3 Patient Root Query/Retrieve Information Model - GET */
export const PatientRootQueryRetrieveInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.1.2.1.3", "Patient Root Query/Retrieve Information Model - GET", DicomUidType.SOPClass, false);
DicomUID.register(PatientRootQueryRetrieveInformationModelGet);
/** 1.2.840.10008.5.1.4.1.2.2.1 Study Root Query/Retrieve Information Model - FIND */
export const StudyRootQueryRetrieveInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.1.2.2.1", "Study Root Query/Retrieve Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(StudyRootQueryRetrieveInformationModelFind);
/** 1.2.840.10008.5.1.4.1.2.2.2 Study Root Query/Retrieve Information Model - MOVE */
export const StudyRootQueryRetrieveInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.1.2.2.2", "Study Root Query/Retrieve Information Model - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(StudyRootQueryRetrieveInformationModelMove);
/** 1.2.840.10008.5.1.4.1.2.2.3 Study Root Query/Retrieve Information Model - GET */
export const StudyRootQueryRetrieveInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.1.2.2.3", "Study Root Query/Retrieve Information Model - GET", DicomUidType.SOPClass, false);
DicomUID.register(StudyRootQueryRetrieveInformationModelGet);
/** 1.2.840.10008.5.1.4.1.2.3.1 Patient/Study Only Query/Retrieve Information Model - FIND (Retired) (Retired) */
export const PatientStudyOnlyQueryRetrieveInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.1.2.3.1", "Patient/Study Only Query/Retrieve Information Model - FIND (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(PatientStudyOnlyQueryRetrieveInformationModelFind);
/** 1.2.840.10008.5.1.4.1.2.3.2 Patient/Study Only Query/Retrieve Information Model - MOVE (Retired) (Retired) */
export const PatientStudyOnlyQueryRetrieveInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.1.2.3.2", "Patient/Study Only Query/Retrieve Information Model - MOVE (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(PatientStudyOnlyQueryRetrieveInformationModelMove);
/** 1.2.840.10008.5.1.4.1.2.3.3 Patient/Study Only Query/Retrieve Information Model - GET (Retired) (Retired) */
export const PatientStudyOnlyQueryRetrieveInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.1.2.3.3", "Patient/Study Only Query/Retrieve Information Model - GET (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(PatientStudyOnlyQueryRetrieveInformationModelGet);
/** 1.2.840.10008.5.1.4.1.2.4.2 Composite Instance Root Retrieve - MOVE */
export const CompositeInstanceRootRetrieveMove = new DicomUID("1.2.840.10008.5.1.4.1.2.4.2", "Composite Instance Root Retrieve - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(CompositeInstanceRootRetrieveMove);
/** 1.2.840.10008.5.1.4.1.2.4.3 Composite Instance Root Retrieve - GET */
export const CompositeInstanceRootRetrieveGet = new DicomUID("1.2.840.10008.5.1.4.1.2.4.3", "Composite Instance Root Retrieve - GET", DicomUidType.SOPClass, false);
DicomUID.register(CompositeInstanceRootRetrieveGet);
/** 1.2.840.10008.5.1.4.1.2.5.3 Composite Instance Retrieve Without Bulk Data - GET */
export const CompositeInstanceRetrieveWithoutBulkDataGet = new DicomUID("1.2.840.10008.5.1.4.1.2.5.3", "Composite Instance Retrieve Without Bulk Data - GET", DicomUidType.SOPClass, false);
DicomUID.register(CompositeInstanceRetrieveWithoutBulkDataGet);
/** 1.2.840.10008.5.1.4.20.1 Defined Procedure Protocol Information Model - FIND */
export const DefinedProcedureProtocolInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.20.1", "Defined Procedure Protocol Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(DefinedProcedureProtocolInformationModelFind);
/** 1.2.840.10008.5.1.4.20.2 Defined Procedure Protocol Information Model - MOVE */
export const DefinedProcedureProtocolInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.20.2", "Defined Procedure Protocol Information Model - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(DefinedProcedureProtocolInformationModelMove);
/** 1.2.840.10008.5.1.4.20.3 Defined Procedure Protocol Information Model - GET */
export const DefinedProcedureProtocolInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.20.3", "Defined Procedure Protocol Information Model - GET", DicomUidType.SOPClass, false);
DicomUID.register(DefinedProcedureProtocolInformationModelGet);
/** 1.2.840.10008.5.1.4.31 Modality Worklist Information Model - FIND */
export const ModalityWorklistInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.31", "Modality Worklist Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(ModalityWorklistInformationModelFind);
/** 1.2.840.10008.5.1.4.32 General Purpose Worklist Management Meta SOP Class (Retired) (Retired) */
export const GeneralPurposeWorklistManagementMeta = new DicomUID("1.2.840.10008.5.1.4.32", "General Purpose Worklist Management Meta SOP Class (Retired)", DicomUidType.MetaSOPClass, true);
DicomUID.register(GeneralPurposeWorklistManagementMeta);
/** 1.2.840.10008.5.1.4.32.1 General Purpose Worklist Information Model - FIND (Retired) (Retired) */
export const GeneralPurposeWorklistInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.32.1", "General Purpose Worklist Information Model - FIND (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(GeneralPurposeWorklistInformationModelFind);
/** 1.2.840.10008.5.1.4.32.2 General Purpose Scheduled Procedure Step SOP Class (Retired) (Retired) */
export const GeneralPurposeScheduledProcedureStep = new DicomUID("1.2.840.10008.5.1.4.32.2", "General Purpose Scheduled Procedure Step SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(GeneralPurposeScheduledProcedureStep);
/** 1.2.840.10008.5.1.4.32.3 General Purpose Performed Procedure Step SOP Class (Retired) (Retired) */
export const GeneralPurposePerformedProcedureStep = new DicomUID("1.2.840.10008.5.1.4.32.3", "General Purpose Performed Procedure Step SOP Class (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(GeneralPurposePerformedProcedureStep);
/** 1.2.840.10008.5.1.4.33 Instance Availability Notification SOP Class */
export const InstanceAvailabilityNotification = new DicomUID("1.2.840.10008.5.1.4.33", "Instance Availability Notification SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(InstanceAvailabilityNotification);
/** 1.2.840.10008.5.1.4.34.1 RT Beams Delivery Instruction Storage - Trial (Retired) (Retired) */
export const RTBeamsDeliveryInstructionStorageTrial = new DicomUID("1.2.840.10008.5.1.4.34.1", "RT Beams Delivery Instruction Storage - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(RTBeamsDeliveryInstructionStorageTrial);
/** 1.2.840.10008.5.1.4.34.2 RT Conventional Machine Verification - Trial (Retired) (Retired) */
export const RTConventionalMachineVerificationTrial = new DicomUID("1.2.840.10008.5.1.4.34.2", "RT Conventional Machine Verification - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(RTConventionalMachineVerificationTrial);
/** 1.2.840.10008.5.1.4.34.3 RT Ion Machine Verification - Trial (Retired) (Retired) */
export const RTIonMachineVerificationTrial = new DicomUID("1.2.840.10008.5.1.4.34.3", "RT Ion Machine Verification - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(RTIonMachineVerificationTrial);
/** 1.2.840.10008.5.1.4.34.4 Unified Worklist and Procedure Step Service Class - Trial (Retired) (Retired) */
export const UnifiedWorklistAndProcedureStepTrial = new DicomUID("1.2.840.10008.5.1.4.34.4", "Unified Worklist and Procedure Step Service Class - Trial (Retired)", DicomUidType.ServiceClass, true);
DicomUID.register(UnifiedWorklistAndProcedureStepTrial);
/** 1.2.840.10008.5.1.4.34.4.1 Unified Procedure Step - Push SOP Class - Trial (Retired) (Retired) */
export const UnifiedProcedureStepPushTrial = new DicomUID("1.2.840.10008.5.1.4.34.4.1", "Unified Procedure Step - Push SOP Class - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(UnifiedProcedureStepPushTrial);
/** 1.2.840.10008.5.1.4.34.4.2 Unified Procedure Step - Watch SOP Class - Trial (Retired) (Retired) */
export const UnifiedProcedureStepWatchTrial = new DicomUID("1.2.840.10008.5.1.4.34.4.2", "Unified Procedure Step - Watch SOP Class - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(UnifiedProcedureStepWatchTrial);
/** 1.2.840.10008.5.1.4.34.4.3 Unified Procedure Step - Pull SOP Class - Trial (Retired) (Retired) */
export const UnifiedProcedureStepPullTrial = new DicomUID("1.2.840.10008.5.1.4.34.4.3", "Unified Procedure Step - Pull SOP Class - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(UnifiedProcedureStepPullTrial);
/** 1.2.840.10008.5.1.4.34.4.4 Unified Procedure Step - Event SOP Class - Trial (Retired) (Retired) */
export const UnifiedProcedureStepEventTrial = new DicomUID("1.2.840.10008.5.1.4.34.4.4", "Unified Procedure Step - Event SOP Class - Trial (Retired)", DicomUidType.SOPClass, true);
DicomUID.register(UnifiedProcedureStepEventTrial);
/** 1.2.840.10008.5.1.4.34.5 UPS Global Subscription SOP Instance */
export const UPSGlobalSubscriptionInstance = new DicomUID("1.2.840.10008.5.1.4.34.5", "UPS Global Subscription SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(UPSGlobalSubscriptionInstance);
/** 1.2.840.10008.5.1.4.34.5.1 UPS Filtered Global Subscription SOP Instance */
export const UPSFilteredGlobalSubscriptionInstance = new DicomUID("1.2.840.10008.5.1.4.34.5.1", "UPS Filtered Global Subscription SOP Instance", DicomUidType.Unknown, false);
DicomUID.register(UPSFilteredGlobalSubscriptionInstance);
/** 1.2.840.10008.5.1.4.34.6 Unified Worklist and Procedure Step Service Class */
export const UnifiedWorklistAndProcedureStep = new DicomUID("1.2.840.10008.5.1.4.34.6", "Unified Worklist and Procedure Step Service Class", DicomUidType.ServiceClass, false);
DicomUID.register(UnifiedWorklistAndProcedureStep);
/** 1.2.840.10008.5.1.4.34.6.1 Unified Procedure Step - Push SOP Class */
export const UnifiedProcedureStepPush = new DicomUID("1.2.840.10008.5.1.4.34.6.1", "Unified Procedure Step - Push SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(UnifiedProcedureStepPush);
/** 1.2.840.10008.5.1.4.34.6.2 Unified Procedure Step - Watch SOP Class */
export const UnifiedProcedureStepWatch = new DicomUID("1.2.840.10008.5.1.4.34.6.2", "Unified Procedure Step - Watch SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(UnifiedProcedureStepWatch);
/** 1.2.840.10008.5.1.4.34.6.3 Unified Procedure Step - Pull SOP Class */
export const UnifiedProcedureStepPull = new DicomUID("1.2.840.10008.5.1.4.34.6.3", "Unified Procedure Step - Pull SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(UnifiedProcedureStepPull);
/** 1.2.840.10008.5.1.4.34.6.4 Unified Procedure Step - Event SOP Class */
export const UnifiedProcedureStepEvent = new DicomUID("1.2.840.10008.5.1.4.34.6.4", "Unified Procedure Step - Event SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(UnifiedProcedureStepEvent);
/** 1.2.840.10008.5.1.4.34.6.5 Unified Procedure Step - Query SOP Class */
export const UnifiedProcedureStepQuery = new DicomUID("1.2.840.10008.5.1.4.34.6.5", "Unified Procedure Step - Query SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(UnifiedProcedureStepQuery);
/** 1.2.840.10008.5.1.4.34.7 RT Beams Delivery Instruction Storage */
export const RTBeamsDeliveryInstructionStorage = new DicomUID("1.2.840.10008.5.1.4.34.7", "RT Beams Delivery Instruction Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTBeamsDeliveryInstructionStorage);
/** 1.2.840.10008.5.1.4.34.8 RT Conventional Machine Verification */
export const RTConventionalMachineVerification = new DicomUID("1.2.840.10008.5.1.4.34.8", "RT Conventional Machine Verification", DicomUidType.SOPClass, false);
DicomUID.register(RTConventionalMachineVerification);
/** 1.2.840.10008.5.1.4.34.9 RT Ion Machine Verification */
export const RTIonMachineVerification = new DicomUID("1.2.840.10008.5.1.4.34.9", "RT Ion Machine Verification", DicomUidType.SOPClass, false);
DicomUID.register(RTIonMachineVerification);
/** 1.2.840.10008.5.1.4.34.10 RT Brachy Application Setup Delivery Instruction Storage */
export const RTBrachyApplicationSetupDeliveryInstructionStorage = new DicomUID("1.2.840.10008.5.1.4.34.10", "RT Brachy Application Setup Delivery Instruction Storage", DicomUidType.SOPClass, false);
DicomUID.register(RTBrachyApplicationSetupDeliveryInstructionStorage);
/** 1.2.840.10008.5.1.4.37.1 General Relevant Patient Information Query */
export const GeneralRelevantPatientInformationQuery = new DicomUID("1.2.840.10008.5.1.4.37.1", "General Relevant Patient Information Query", DicomUidType.SOPClass, false);
DicomUID.register(GeneralRelevantPatientInformationQuery);
/** 1.2.840.10008.5.1.4.37.2 Breast Imaging Relevant Patient Information Query */
export const BreastImagingRelevantPatientInformationQuery = new DicomUID("1.2.840.10008.5.1.4.37.2", "Breast Imaging Relevant Patient Information Query", DicomUidType.SOPClass, false);
DicomUID.register(BreastImagingRelevantPatientInformationQuery);
/** 1.2.840.10008.5.1.4.37.3 Cardiac Relevant Patient Information Query */
export const CardiacRelevantPatientInformationQuery = new DicomUID("1.2.840.10008.5.1.4.37.3", "Cardiac Relevant Patient Information Query", DicomUidType.SOPClass, false);
DicomUID.register(CardiacRelevantPatientInformationQuery);
/** 1.2.840.10008.5.1.4.38.1 Hanging Protocol Storage */
export const HangingProtocolStorage = new DicomUID("1.2.840.10008.5.1.4.38.1", "Hanging Protocol Storage", DicomUidType.SOPClass, false);
DicomUID.register(HangingProtocolStorage);
/** 1.2.840.10008.5.1.4.38.2 Hanging Protocol Information Model - FIND */
export const HangingProtocolInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.38.2", "Hanging Protocol Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(HangingProtocolInformationModelFind);
/** 1.2.840.10008.5.1.4.38.3 Hanging Protocol Information Model - MOVE */
export const HangingProtocolInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.38.3", "Hanging Protocol Information Model - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(HangingProtocolInformationModelMove);
/** 1.2.840.10008.5.1.4.38.4 Hanging Protocol Information Model - GET */
export const HangingProtocolInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.38.4", "Hanging Protocol Information Model - GET", DicomUidType.SOPClass, false);
DicomUID.register(HangingProtocolInformationModelGet);
/** 1.2.840.10008.5.1.4.39.1 Color Palette Storage */
export const ColorPaletteStorage = new DicomUID("1.2.840.10008.5.1.4.39.1", "Color Palette Storage", DicomUidType.SOPClass, false);
DicomUID.register(ColorPaletteStorage);
/** 1.2.840.10008.5.1.4.39.2 Color Palette Query/Retrieve Information Model - FIND */
export const ColorPaletteQueryRetrieveInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.39.2", "Color Palette Query/Retrieve Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(ColorPaletteQueryRetrieveInformationModelFind);
/** 1.2.840.10008.5.1.4.39.3 Color Palette Query/Retrieve Information Model - MOVE */
export const ColorPaletteQueryRetrieveInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.39.3", "Color Palette Query/Retrieve Information Model - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(ColorPaletteQueryRetrieveInformationModelMove);
/** 1.2.840.10008.5.1.4.39.4 Color Palette Query/Retrieve Information Model - GET */
export const ColorPaletteQueryRetrieveInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.39.4", "Color Palette Query/Retrieve Information Model - GET", DicomUidType.SOPClass, false);
DicomUID.register(ColorPaletteQueryRetrieveInformationModelGet);
/** 1.2.840.10008.5.1.4.41 Product Characteristics Query SOP Class */
export const ProductCharacteristicsQuery = new DicomUID("1.2.840.10008.5.1.4.41", "Product Characteristics Query SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(ProductCharacteristicsQuery);
/** 1.2.840.10008.5.1.4.42 Substance Approval Query SOP Class */
export const SubstanceApprovalQuery = new DicomUID("1.2.840.10008.5.1.4.42", "Substance Approval Query SOP Class", DicomUidType.SOPClass, false);
DicomUID.register(SubstanceApprovalQuery);
/** 1.2.840.10008.5.1.4.43.1 Generic Implant Template Storage */
export const GenericImplantTemplateStorage = new DicomUID("1.2.840.10008.5.1.4.43.1", "Generic Implant Template Storage", DicomUidType.SOPClass, false);
DicomUID.register(GenericImplantTemplateStorage);
/** 1.2.840.10008.5.1.4.43.2 Generic Implant Template Information Model - FIND */
export const GenericImplantTemplateInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.43.2", "Generic Implant Template Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(GenericImplantTemplateInformationModelFind);
/** 1.2.840.10008.5.1.4.43.3 Generic Implant Template Information Model - MOVE */
export const GenericImplantTemplateInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.43.3", "Generic Implant Template Information Model - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(GenericImplantTemplateInformationModelMove);
/** 1.2.840.10008.5.1.4.43.4 Generic Implant Template Information Model - GET */
export const GenericImplantTemplateInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.43.4", "Generic Implant Template Information Model - GET", DicomUidType.SOPClass, false);
DicomUID.register(GenericImplantTemplateInformationModelGet);
/** 1.2.840.10008.5.1.4.44.1 Implant Assembly Template Storage */
export const ImplantAssemblyTemplateStorage = new DicomUID("1.2.840.10008.5.1.4.44.1", "Implant Assembly Template Storage", DicomUidType.SOPClass, false);
DicomUID.register(ImplantAssemblyTemplateStorage);
/** 1.2.840.10008.5.1.4.44.2 Implant Assembly Template Information Model - FIND */
export const ImplantAssemblyTemplateInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.44.2", "Implant Assembly Template Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(ImplantAssemblyTemplateInformationModelFind);
/** 1.2.840.10008.5.1.4.44.3 Implant Assembly Template Information Model - MOVE */
export const ImplantAssemblyTemplateInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.44.3", "Implant Assembly Template Information Model - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(ImplantAssemblyTemplateInformationModelMove);
/** 1.2.840.10008.5.1.4.44.4 Implant Assembly Template Information Model - GET */
export const ImplantAssemblyTemplateInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.44.4", "Implant Assembly Template Information Model - GET", DicomUidType.SOPClass, false);
DicomUID.register(ImplantAssemblyTemplateInformationModelGet);
/** 1.2.840.10008.5.1.4.45.1 Implant Template Group Storage */
export const ImplantTemplateGroupStorage = new DicomUID("1.2.840.10008.5.1.4.45.1", "Implant Template Group Storage", DicomUidType.SOPClass, false);
DicomUID.register(ImplantTemplateGroupStorage);
/** 1.2.840.10008.5.1.4.45.2 Implant Template Group Information Model - FIND */
export const ImplantTemplateGroupInformationModelFind = new DicomUID("1.2.840.10008.5.1.4.45.2", "Implant Template Group Information Model - FIND", DicomUidType.SOPClass, false);
DicomUID.register(ImplantTemplateGroupInformationModelFind);
/** 1.2.840.10008.5.1.4.45.3 Implant Template Group Information Model - MOVE */
export const ImplantTemplateGroupInformationModelMove = new DicomUID("1.2.840.10008.5.1.4.45.3", "Implant Template Group Information Model - MOVE", DicomUidType.SOPClass, false);
DicomUID.register(ImplantTemplateGroupInformationModelMove);
/** 1.2.840.10008.5.1.4.45.4 Implant Template Group Information Model - GET */
export const ImplantTemplateGroupInformationModelGet = new DicomUID("1.2.840.10008.5.1.4.45.4", "Implant Template Group Information Model - GET", DicomUidType.SOPClass, false);
DicomUID.register(ImplantTemplateGroupInformationModelGet);
/** 1.2.840.10008.7.1.1 Native DICOM Model */
export const NativeDICOMModel = new DicomUID("1.2.840.10008.7.1.1", "Native DICOM Model", DicomUidType.ApplicationHostingModel, false);
DicomUID.register(NativeDICOMModel);
/** 1.2.840.10008.7.1.2 Abstract Multi-Dimensional Image Model */
export const AbstractMultiDimensionalImageModel = new DicomUID("1.2.840.10008.7.1.2", "Abstract Multi-Dimensional Image Model", DicomUidType.ApplicationHostingModel, false);
DicomUID.register(AbstractMultiDimensionalImageModel);
/** 1.2.840.10008.8.1.1 DICOM Content Mapping Resource */
export const DICOMContentMappingResource = new DicomUID("1.2.840.10008.8.1.1", "DICOM Content Mapping Resource", DicomUidType.MappingResource, false);
DicomUID.register(DICOMContentMappingResource);
/** 1.2.840.10008.10.1 Video Endoscopic Image Real-Time Communication */
export const VideoEndoscopicImageRealTimeCommunication = new DicomUID("1.2.840.10008.10.1", "Video Endoscopic Image Real-Time Communication", DicomUidType.SOPClass, false);
DicomUID.register(VideoEndoscopicImageRealTimeCommunication);
/** 1.2.840.10008.10.2 Video Photographic Image Real-Time Communication */
export const VideoPhotographicImageRealTimeCommunication = new DicomUID("1.2.840.10008.10.2", "Video Photographic Image Real-Time Communication", DicomUidType.SOPClass, false);
DicomUID.register(VideoPhotographicImageRealTimeCommunication);
/** 1.2.840.10008.10.3 Audio Waveform Real-Time Communication */
export const AudioWaveformRealTimeCommunication = new DicomUID("1.2.840.10008.10.3", "Audio Waveform Real-Time Communication", DicomUidType.SOPClass, false);
DicomUID.register(AudioWaveformRealTimeCommunication);
/** 1.2.840.10008.10.4 Rendition Selection Document Real-Time Communication */
export const RenditionSelectionDocumentRealTimeCommunication = new DicomUID("1.2.840.10008.10.4", "Rendition Selection Document Real-Time Communication", DicomUidType.SOPClass, false);
DicomUID.register(RenditionSelectionDocumentRealTimeCommunication);
/** 1.2.840.10008.15.0.3.1 dicomDeviceName */
export const dicomDeviceName = new DicomUID("1.2.840.10008.15.0.3.1", "dicomDeviceName", DicomUidType.Unknown, false);
DicomUID.register(dicomDeviceName);
/** 1.2.840.10008.15.0.3.2 dicomDescription */
export const dicomDescription = new DicomUID("1.2.840.10008.15.0.3.2", "dicomDescription", DicomUidType.Unknown, false);
DicomUID.register(dicomDescription);
/** 1.2.840.10008.15.0.3.3 dicomManufacturer */
export const dicomManufacturer = new DicomUID("1.2.840.10008.15.0.3.3", "dicomManufacturer", DicomUidType.Unknown, false);
DicomUID.register(dicomManufacturer);
/** 1.2.840.10008.15.0.3.4 dicomManufacturerModelName */
export const dicomManufacturerModelName = new DicomUID("1.2.840.10008.15.0.3.4", "dicomManufacturerModelName", DicomUidType.Unknown, false);
DicomUID.register(dicomManufacturerModelName);
/** 1.2.840.10008.15.0.3.5 dicomSoftwareVersion */
export const dicomSoftwareVersion = new DicomUID("1.2.840.10008.15.0.3.5", "dicomSoftwareVersion", DicomUidType.Unknown, false);
DicomUID.register(dicomSoftwareVersion);
/** 1.2.840.10008.15.0.3.6 dicomVendorData */
export const dicomVendorData = new DicomUID("1.2.840.10008.15.0.3.6", "dicomVendorData", DicomUidType.Unknown, false);
DicomUID.register(dicomVendorData);
/** 1.2.840.10008.15.0.3.7 dicomAETitle */
export const dicomAETitle = new DicomUID("1.2.840.10008.15.0.3.7", "dicomAETitle", DicomUidType.Unknown, false);
DicomUID.register(dicomAETitle);
/** 1.2.840.10008.15.0.3.8 dicomNetworkConnectionReference */
export const dicomNetworkConnectionReference = new DicomUID("1.2.840.10008.15.0.3.8", "dicomNetworkConnectionReference", DicomUidType.Unknown, false);
DicomUID.register(dicomNetworkConnectionReference);
/** 1.2.840.10008.15.0.3.9 dicomApplicationCluster */
export const dicomApplicationCluster = new DicomUID("1.2.840.10008.15.0.3.9", "dicomApplicationCluster", DicomUidType.Unknown, false);
DicomUID.register(dicomApplicationCluster);
/** 1.2.840.10008.15.0.3.10 dicomAssociationInitiator */
export const dicomAssociationInitiator = new DicomUID("1.2.840.10008.15.0.3.10", "dicomAssociationInitiator", DicomUidType.Unknown, false);
DicomUID.register(dicomAssociationInitiator);
/** 1.2.840.10008.15.0.3.11 dicomAssociationAcceptor */
export const dicomAssociationAcceptor = new DicomUID("1.2.840.10008.15.0.3.11", "dicomAssociationAcceptor", DicomUidType.Unknown, false);
DicomUID.register(dicomAssociationAcceptor);
/** 1.2.840.10008.15.0.3.12 dicomHostname */
export const dicomHostname = new DicomUID("1.2.840.10008.15.0.3.12", "dicomHostname", DicomUidType.Unknown, false);
DicomUID.register(dicomHostname);
/** 1.2.840.10008.15.0.3.13 dicomPort */
export const dicomPort = new DicomUID("1.2.840.10008.15.0.3.13", "dicomPort", DicomUidType.Unknown, false);
DicomUID.register(dicomPort);
/** 1.2.840.10008.15.0.3.14 dicomSOPClass */
export const dicomSOPClass = new DicomUID("1.2.840.10008.15.0.3.14", "dicomSOPClass", DicomUidType.Unknown, false);
DicomUID.register(dicomSOPClass);
/** 1.2.840.10008.15.0.3.15 dicomTransferRole */
export const dicomTransferRole = new DicomUID("1.2.840.10008.15.0.3.15", "dicomTransferRole", DicomUidType.Unknown, false);
DicomUID.register(dicomTransferRole);
/** 1.2.840.10008.15.0.3.16 dicomTransferSyntax */
export const dicomTransferSyntax = new DicomUID("1.2.840.10008.15.0.3.16", "dicomTransferSyntax", DicomUidType.Unknown, false);
DicomUID.register(dicomTransferSyntax);
/** 1.2.840.10008.15.0.3.17 dicomPrimaryDeviceType */
export const dicomPrimaryDeviceType = new DicomUID("1.2.840.10008.15.0.3.17", "dicomPrimaryDeviceType", DicomUidType.Unknown, false);
DicomUID.register(dicomPrimaryDeviceType);
/** 1.2.840.10008.15.0.3.18 dicomRelatedDeviceReference */
export const dicomRelatedDeviceReference = new DicomUID("1.2.840.10008.15.0.3.18", "dicomRelatedDeviceReference", DicomUidType.Unknown, false);
DicomUID.register(dicomRelatedDeviceReference);
/** 1.2.840.10008.15.0.3.19 dicomPreferredCalledAETitle */
export const dicomPreferredCalledAETitle = new DicomUID("1.2.840.10008.15.0.3.19", "dicomPreferredCalledAETitle", DicomUidType.Unknown, false);
DicomUID.register(dicomPreferredCalledAETitle);
/** 1.2.840.10008.15.0.3.20 dicomTLSCyphersuite */
export const dicomTLSCyphersuite = new DicomUID("1.2.840.10008.15.0.3.20", "dicomTLSCyphersuite", DicomUidType.Unknown, false);
DicomUID.register(dicomTLSCyphersuite);
/** 1.2.840.10008.15.0.3.21 dicomAuthorizedNodeCertificateReference */
export const dicomAuthorizedNodeCertificateReference = new DicomUID("1.2.840.10008.15.0.3.21", "dicomAuthorizedNodeCertificateReference", DicomUidType.Unknown, false);
DicomUID.register(dicomAuthorizedNodeCertificateReference);
/** 1.2.840.10008.15.0.3.22 dicomThisNodeCertificateReference */
export const dicomThisNodeCertificateReference = new DicomUID("1.2.840.10008.15.0.3.22", "dicomThisNodeCertificateReference", DicomUidType.Unknown, false);
DicomUID.register(dicomThisNodeCertificateReference);
/** 1.2.840.10008.15.0.3.23 dicomInstalled */
export const dicomInstalled = new DicomUID("1.2.840.10008.15.0.3.23", "dicomInstalled", DicomUidType.Unknown, false);
DicomUID.register(dicomInstalled);
/** 1.2.840.10008.15.0.3.24 dicomStationName */
export const dicomStationName = new DicomUID("1.2.840.10008.15.0.3.24", "dicomStationName", DicomUidType.Unknown, false);
DicomUID.register(dicomStationName);
/** 1.2.840.10008.15.0.3.25 dicomDeviceSerialNumber */
export const dicomDeviceSerialNumber = new DicomUID("1.2.840.10008.15.0.3.25", "dicomDeviceSerialNumber", DicomUidType.Unknown, false);
DicomUID.register(dicomDeviceSerialNumber);
/** 1.2.840.10008.15.0.3.26 dicomInstitutionName */
export const dicomInstitutionName = new DicomUID("1.2.840.10008.15.0.3.26", "dicomInstitutionName", DicomUidType.Unknown, false);
DicomUID.register(dicomInstitutionName);
/** 1.2.840.10008.15.0.3.27 dicomInstitutionAddress */
export const dicomInstitutionAddress = new DicomUID("1.2.840.10008.15.0.3.27", "dicomInstitutionAddress", DicomUidType.Unknown, false);
DicomUID.register(dicomInstitutionAddress);
/** 1.2.840.10008.15.0.3.28 dicomInstitutionDepartmentName */
export const dicomInstitutionDepartmentName = new DicomUID("1.2.840.10008.15.0.3.28", "dicomInstitutionDepartmentName", DicomUidType.Unknown, false);
DicomUID.register(dicomInstitutionDepartmentName);
/** 1.2.840.10008.15.0.3.29 dicomIssuerOfPatientID */
export const dicomIssuerOfPatientID = new DicomUID("1.2.840.10008.15.0.3.29", "dicomIssuerOfPatientID", DicomUidType.Unknown, false);
DicomUID.register(dicomIssuerOfPatientID);
/** 1.2.840.10008.15.0.3.30 dicomPreferredCallingAETitle */
export const dicomPreferredCallingAETitle = new DicomUID("1.2.840.10008.15.0.3.30", "dicomPreferredCallingAETitle", DicomUidType.Unknown, false);
DicomUID.register(dicomPreferredCallingAETitle);
/** 1.2.840.10008.15.0.3.31 dicomSupportedCharacterSet */
export const dicomSupportedCharacterSet = new DicomUID("1.2.840.10008.15.0.3.31", "dicomSupportedCharacterSet", DicomUidType.Unknown, false);
DicomUID.register(dicomSupportedCharacterSet);
/** 1.2.840.10008.15.0.4.1 dicomConfigurationRoot */
export const dicomConfigurationRoot = new DicomUID("1.2.840.10008.15.0.4.1", "dicomConfigurationRoot", DicomUidType.Unknown, false);
DicomUID.register(dicomConfigurationRoot);
/** 1.2.840.10008.15.0.4.2 dicomDevicesRoot */
export const dicomDevicesRoot = new DicomUID("1.2.840.10008.15.0.4.2", "dicomDevicesRoot", DicomUidType.Unknown, false);
DicomUID.register(dicomDevicesRoot);
/** 1.2.840.10008.15.0.4.3 dicomUniqueAETitlesRegistryRoot */
export const dicomUniqueAETitlesRegistryRoot = new DicomUID("1.2.840.10008.15.0.4.3", "dicomUniqueAETitlesRegistryRoot", DicomUidType.Unknown, false);
DicomUID.register(dicomUniqueAETitlesRegistryRoot);
/** 1.2.840.10008.15.0.4.4 dicomDevice */
export const dicomDevice = new DicomUID("1.2.840.10008.15.0.4.4", "dicomDevice", DicomUidType.Unknown, false);
DicomUID.register(dicomDevice);
/** 1.2.840.10008.15.0.4.5 dicomNetworkAE */
export const dicomNetworkAE = new DicomUID("1.2.840.10008.15.0.4.5", "dicomNetworkAE", DicomUidType.Unknown, false);
DicomUID.register(dicomNetworkAE);
/** 1.2.840.10008.15.0.4.6 dicomNetworkConnection */
export const dicomNetworkConnection = new DicomUID("1.2.840.10008.15.0.4.6", "dicomNetworkConnection", DicomUidType.Unknown, false);
DicomUID.register(dicomNetworkConnection);
/** 1.2.840.10008.15.0.4.7 dicomUniqueAETitle */
export const dicomUniqueAETitle = new DicomUID("1.2.840.10008.15.0.4.7", "dicomUniqueAETitle", DicomUidType.Unknown, false);
DicomUID.register(dicomUniqueAETitle);
/** 1.2.840.10008.15.0.4.8 dicomTransferCapability */
export const dicomTransferCapability = new DicomUID("1.2.840.10008.15.0.4.8", "dicomTransferCapability", DicomUidType.Unknown, false);
DicomUID.register(dicomTransferCapability);
/** 1.2.840.10008.15.1.1 Universal Coordinated Time */
export const UTC = new DicomUID("1.2.840.10008.15.1.1", "Universal Coordinated Time", DicomUidType.Unknown, false);
DicomUID.register(UTC);
/** 1.2.840.10008.6.1.1 Anatomic Modifier (2) */
export const AnatomicModifier2 = new DicomUID("1.2.840.10008.6.1.1", "Anatomic Modifier (2)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicModifier2);
/** 1.2.840.10008.6.1.2 Anatomic Region (4) */
export const AnatomicRegion4 = new DicomUID("1.2.840.10008.6.1.2", "Anatomic Region (4)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicRegion4);
/** 1.2.840.10008.6.1.3 Transducer Approach (5) */
export const TransducerApproach5 = new DicomUID("1.2.840.10008.6.1.3", "Transducer Approach (5)", DicomUidType.ContextGroupName, false);
DicomUID.register(TransducerApproach5);
/** 1.2.840.10008.6.1.4 Transducer Orientation (6) */
export const TransducerOrientation6 = new DicomUID("1.2.840.10008.6.1.4", "Transducer Orientation (6)", DicomUidType.ContextGroupName, false);
DicomUID.register(TransducerOrientation6);
/** 1.2.840.10008.6.1.5 Ultrasound Beam Path (7) */
export const UltrasoundBeamPath7 = new DicomUID("1.2.840.10008.6.1.5", "Ultrasound Beam Path (7)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundBeamPath7);
/** 1.2.840.10008.6.1.6 Angiographic Interventional Device (8) */
export const AngiographicInterventionalDevice8 = new DicomUID("1.2.840.10008.6.1.6", "Angiographic Interventional Device (8)", DicomUidType.ContextGroupName, false);
DicomUID.register(AngiographicInterventionalDevice8);
/** 1.2.840.10008.6.1.7 Image Guided Therapeutic Procedure (9) */
export const ImageGuidedTherapeuticProcedure9 = new DicomUID("1.2.840.10008.6.1.7", "Image Guided Therapeutic Procedure (9)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImageGuidedTherapeuticProcedure9);
/** 1.2.840.10008.6.1.8 Interventional Drug (10) */
export const InterventionalDrug10 = new DicomUID("1.2.840.10008.6.1.8", "Interventional Drug (10)", DicomUidType.ContextGroupName, false);
DicomUID.register(InterventionalDrug10);
/** 1.2.840.10008.6.1.9 Administration Route (11) */
export const AdministrationRoute11 = new DicomUID("1.2.840.10008.6.1.9", "Administration Route (11)", DicomUidType.ContextGroupName, false);
DicomUID.register(AdministrationRoute11);
/** 1.2.840.10008.6.1.10 Imaging Contrast Agent (12) */
export const ImagingContrastAgent12 = new DicomUID("1.2.840.10008.6.1.10", "Imaging Contrast Agent (12)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingContrastAgent12);
/** 1.2.840.10008.6.1.11 Imaging Contrast Agent Ingredient (13) */
export const ImagingContrastAgentIngredient13 = new DicomUID("1.2.840.10008.6.1.11", "Imaging Contrast Agent Ingredient (13)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingContrastAgentIngredient13);
/** 1.2.840.10008.6.1.12 Radiopharmaceutical Isotope (18) */
export const RadiopharmaceuticalIsotope18 = new DicomUID("1.2.840.10008.6.1.12", "Radiopharmaceutical Isotope (18)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiopharmaceuticalIsotope18);
/** 1.2.840.10008.6.1.13 Patient Orientation (19) */
export const PatientOrientation19 = new DicomUID("1.2.840.10008.6.1.13", "Patient Orientation (19)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientOrientation19);
/** 1.2.840.10008.6.1.14 Patient Orientation Modifier (20) */
export const PatientOrientationModifier20 = new DicomUID("1.2.840.10008.6.1.14", "Patient Orientation Modifier (20)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientOrientationModifier20);
/** 1.2.840.10008.6.1.15 Patient Equipment Relationship (21) */
export const PatientEquipmentRelationship21 = new DicomUID("1.2.840.10008.6.1.15", "Patient Equipment Relationship (21)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientEquipmentRelationship21);
/** 1.2.840.10008.6.1.16 Cranio-Caudad Angulation (23) */
export const CranioCaudadAngulation23 = new DicomUID("1.2.840.10008.6.1.16", "Cranio-Caudad Angulation (23)", DicomUidType.ContextGroupName, false);
DicomUID.register(CranioCaudadAngulation23);
/** 1.2.840.10008.6.1.17 Radiopharmaceutical (25) */
export const Radiopharmaceutical25 = new DicomUID("1.2.840.10008.6.1.17", "Radiopharmaceutical (25)", DicomUidType.ContextGroupName, false);
DicomUID.register(Radiopharmaceutical25);
/** 1.2.840.10008.6.1.18 Nuclear Medicine Projection (26) */
export const NuclearMedicineProjection26 = new DicomUID("1.2.840.10008.6.1.18", "Nuclear Medicine Projection (26)", DicomUidType.ContextGroupName, false);
DicomUID.register(NuclearMedicineProjection26);
/** 1.2.840.10008.6.1.19 Acquisition Modality (29) */
export const AcquisitionModality29 = new DicomUID("1.2.840.10008.6.1.19", "Acquisition Modality (29)", DicomUidType.ContextGroupName, false);
DicomUID.register(AcquisitionModality29);
/** 1.2.840.10008.6.1.20 DICOM Device (30) */
export const DICOMDevice30 = new DicomUID("1.2.840.10008.6.1.20", "DICOM Device (30)", DicomUidType.ContextGroupName, false);
DicomUID.register(DICOMDevice30);
/** 1.2.840.10008.6.1.21 Abstract Prior (31) */
export const AbstractPrior31 = new DicomUID("1.2.840.10008.6.1.21", "Abstract Prior (31)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbstractPrior31);
/** 1.2.840.10008.6.1.22 Numeric Value Qualifier (42) */
export const NumericValueQualifier42 = new DicomUID("1.2.840.10008.6.1.22", "Numeric Value Qualifier (42)", DicomUidType.ContextGroupName, false);
DicomUID.register(NumericValueQualifier42);
/** 1.2.840.10008.6.1.23 Measurement Unit (82) */
export const MeasurementUnit82 = new DicomUID("1.2.840.10008.6.1.23", "Measurement Unit (82)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasurementUnit82);
/** 1.2.840.10008.6.1.24 Real World Value Mapping Unit (83) */
export const RealWorldValueMappingUnit83 = new DicomUID("1.2.840.10008.6.1.24", "Real World Value Mapping Unit (83)", DicomUidType.ContextGroupName, false);
DicomUID.register(RealWorldValueMappingUnit83);
/** 1.2.840.10008.6.1.25 Significance Level (220) */
export const SignificanceLevel220 = new DicomUID("1.2.840.10008.6.1.25", "Significance Level (220)", DicomUidType.ContextGroupName, false);
DicomUID.register(SignificanceLevel220);
/** 1.2.840.10008.6.1.26 Measurement Range Concept (221) */
export const MeasurementRangeConcept221 = new DicomUID("1.2.840.10008.6.1.26", "Measurement Range Concept (221)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasurementRangeConcept221);
/** 1.2.840.10008.6.1.27 Normality (222) */
export const Normality222 = new DicomUID("1.2.840.10008.6.1.27", "Normality (222)", DicomUidType.ContextGroupName, false);
DicomUID.register(Normality222);
/** 1.2.840.10008.6.1.28 Normal Range Value (223) */
export const NormalRangeValue223 = new DicomUID("1.2.840.10008.6.1.28", "Normal Range Value (223)", DicomUidType.ContextGroupName, false);
DicomUID.register(NormalRangeValue223);
/** 1.2.840.10008.6.1.29 Selection Method (224) */
export const SelectionMethod224 = new DicomUID("1.2.840.10008.6.1.29", "Selection Method (224)", DicomUidType.ContextGroupName, false);
DicomUID.register(SelectionMethod224);
/** 1.2.840.10008.6.1.30 Measurement Uncertainty Concept (225) */
export const MeasurementUncertaintyConcept225 = new DicomUID("1.2.840.10008.6.1.30", "Measurement Uncertainty Concept (225)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasurementUncertaintyConcept225);
/** 1.2.840.10008.6.1.31 Population Statistical Descriptor (226) */
export const PopulationStatisticalDescriptor226 = new DicomUID("1.2.840.10008.6.1.31", "Population Statistical Descriptor (226)", DicomUidType.ContextGroupName, false);
DicomUID.register(PopulationStatisticalDescriptor226);
/** 1.2.840.10008.6.1.32 Sample Statistical Descriptor (227) */
export const SampleStatisticalDescriptor227 = new DicomUID("1.2.840.10008.6.1.32", "Sample Statistical Descriptor (227)", DicomUidType.ContextGroupName, false);
DicomUID.register(SampleStatisticalDescriptor227);
/** 1.2.840.10008.6.1.33 Equation or Table (228) */
export const EquationOrTable228 = new DicomUID("1.2.840.10008.6.1.33", "Equation or Table (228)", DicomUidType.ContextGroupName, false);
DicomUID.register(EquationOrTable228);
/** 1.2.840.10008.6.1.34 Yes-No (230) */
export const YesNo230 = new DicomUID("1.2.840.10008.6.1.34", "Yes-No (230)", DicomUidType.ContextGroupName, false);
DicomUID.register(YesNo230);
/** 1.2.840.10008.6.1.35 Present-Absent (240) */
export const PresentAbsent240 = new DicomUID("1.2.840.10008.6.1.35", "Present-Absent (240)", DicomUidType.ContextGroupName, false);
DicomUID.register(PresentAbsent240);
/** 1.2.840.10008.6.1.36 Normal-Abnormal (242) */
export const NormalAbnormal242 = new DicomUID("1.2.840.10008.6.1.36", "Normal-Abnormal (242)", DicomUidType.ContextGroupName, false);
DicomUID.register(NormalAbnormal242);
/** 1.2.840.10008.6.1.37 Laterality (244) */
export const Laterality244 = new DicomUID("1.2.840.10008.6.1.37", "Laterality (244)", DicomUidType.ContextGroupName, false);
DicomUID.register(Laterality244);
/** 1.2.840.10008.6.1.38 Positive-Negative (250) */
export const PositiveNegative250 = new DicomUID("1.2.840.10008.6.1.38", "Positive-Negative (250)", DicomUidType.ContextGroupName, false);
DicomUID.register(PositiveNegative250);
/** 1.2.840.10008.6.1.39 Complication Severity (251) */
export const ComplicationSeverity251 = new DicomUID("1.2.840.10008.6.1.39", "Complication Severity (251)", DicomUidType.ContextGroupName, false);
DicomUID.register(ComplicationSeverity251);
/** 1.2.840.10008.6.1.40 Observer Type (270) */
export const ObserverType270 = new DicomUID("1.2.840.10008.6.1.40", "Observer Type (270)", DicomUidType.ContextGroupName, false);
DicomUID.register(ObserverType270);
/** 1.2.840.10008.6.1.41 Observation Subject Class (271) */
export const ObservationSubjectClass271 = new DicomUID("1.2.840.10008.6.1.41", "Observation Subject Class (271)", DicomUidType.ContextGroupName, false);
DicomUID.register(ObservationSubjectClass271);
/** 1.2.840.10008.6.1.42 Audio Channel Source (3000) */
export const AudioChannelSource3000 = new DicomUID("1.2.840.10008.6.1.42", "Audio Channel Source (3000)", DicomUidType.ContextGroupName, false);
DicomUID.register(AudioChannelSource3000);
/** 1.2.840.10008.6.1.43 ECG Lead (3001) */
export const ECGLead3001 = new DicomUID("1.2.840.10008.6.1.43", "ECG Lead (3001)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGLead3001);
/** 1.2.840.10008.6.1.44 Hemodynamic Waveform Source (3003) */
export const HemodynamicWaveformSource3003 = new DicomUID("1.2.840.10008.6.1.44", "Hemodynamic Waveform Source (3003)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicWaveformSource3003);
/** 1.2.840.10008.6.1.45 Cardiovascular Anatomic Structure (3010) */
export const CardiovascularAnatomicStructure3010 = new DicomUID("1.2.840.10008.6.1.45", "Cardiovascular Anatomic Structure (3010)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiovascularAnatomicStructure3010);
/** 1.2.840.10008.6.1.46 Electrophysiology Anatomic Location (3011) */
export const ElectrophysiologyAnatomicLocation3011 = new DicomUID("1.2.840.10008.6.1.46", "Electrophysiology Anatomic Location (3011)", DicomUidType.ContextGroupName, false);
DicomUID.register(ElectrophysiologyAnatomicLocation3011);
/** 1.2.840.10008.6.1.47 Coronary Artery Segment (3014) */
export const CoronaryArterySegment3014 = new DicomUID("1.2.840.10008.6.1.47", "Coronary Artery Segment (3014)", DicomUidType.ContextGroupName, false);
DicomUID.register(CoronaryArterySegment3014);
/** 1.2.840.10008.6.1.48 Coronary Artery (3015) */
export const CoronaryArtery3015 = new DicomUID("1.2.840.10008.6.1.48", "Coronary Artery (3015)", DicomUidType.ContextGroupName, false);
DicomUID.register(CoronaryArtery3015);
/** 1.2.840.10008.6.1.49 Cardiovascular Anatomic Structure Modifier (3019) */
export const CardiovascularAnatomicStructureModifier3019 = new DicomUID("1.2.840.10008.6.1.49", "Cardiovascular Anatomic Structure Modifier (3019)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiovascularAnatomicStructureModifier3019);
/** 1.2.840.10008.6.1.50 Cardiology Measurement Unit (Retired) (3082) (Retired) */
export const CardiologyMeasurementUnit3082 = new DicomUID("1.2.840.10008.6.1.50", "Cardiology Measurement Unit (Retired) (3082)", DicomUidType.ContextGroupName, true);
DicomUID.register(CardiologyMeasurementUnit3082);
/** 1.2.840.10008.6.1.51 Time Synchronization Channel Type (3090) */
export const TimeSynchronizationChannelType3090 = new DicomUID("1.2.840.10008.6.1.51", "Time Synchronization Channel Type (3090)", DicomUidType.ContextGroupName, false);
DicomUID.register(TimeSynchronizationChannelType3090);
/** 1.2.840.10008.6.1.52 Cardiac Procedural State Value (3101) */
export const CardiacProceduralStateValue3101 = new DicomUID("1.2.840.10008.6.1.52", "Cardiac Procedural State Value (3101)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacProceduralStateValue3101);
/** 1.2.840.10008.6.1.53 Electrophysiology Measurement Function/Technique (3240) */
export const ElectrophysiologyMeasurementFunctionTechnique3240 = new DicomUID("1.2.840.10008.6.1.53", "Electrophysiology Measurement Function/Technique (3240)", DicomUidType.ContextGroupName, false);
DicomUID.register(ElectrophysiologyMeasurementFunctionTechnique3240);
/** 1.2.840.10008.6.1.54 Hemodynamic Measurement Technique (3241) */
export const HemodynamicMeasurementTechnique3241 = new DicomUID("1.2.840.10008.6.1.54", "Hemodynamic Measurement Technique (3241)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicMeasurementTechnique3241);
/** 1.2.840.10008.6.1.55 Catheterization Procedure Phase (3250) */
export const CatheterizationProcedurePhase3250 = new DicomUID("1.2.840.10008.6.1.55", "Catheterization Procedure Phase (3250)", DicomUidType.ContextGroupName, false);
DicomUID.register(CatheterizationProcedurePhase3250);
/** 1.2.840.10008.6.1.56 Electrophysiology Procedure Phase (3254) */
export const ElectrophysiologyProcedurePhase3254 = new DicomUID("1.2.840.10008.6.1.56", "Electrophysiology Procedure Phase (3254)", DicomUidType.ContextGroupName, false);
DicomUID.register(ElectrophysiologyProcedurePhase3254);
/** 1.2.840.10008.6.1.57 Stress Protocol (3261) */
export const StressProtocol3261 = new DicomUID("1.2.840.10008.6.1.57", "Stress Protocol (3261)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressProtocol3261);
/** 1.2.840.10008.6.1.58 ECG Patient State Value (3262) */
export const ECGPatientStateValue3262 = new DicomUID("1.2.840.10008.6.1.58", "ECG Patient State Value (3262)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGPatientStateValue3262);
/** 1.2.840.10008.6.1.59 Electrode Placement Value (3263) */
export const ElectrodePlacementValue3263 = new DicomUID("1.2.840.10008.6.1.59", "Electrode Placement Value (3263)", DicomUidType.ContextGroupName, false);
DicomUID.register(ElectrodePlacementValue3263);
/** 1.2.840.10008.6.1.60 XYZ Electrode Placement Values (Retired) (3264) (Retired) */
export const XYZElectrodePlacementValues3264 = new DicomUID("1.2.840.10008.6.1.60", "XYZ Electrode Placement Values (Retired) (3264)", DicomUidType.ContextGroupName, true);
DicomUID.register(XYZElectrodePlacementValues3264);
/** 1.2.840.10008.6.1.61 Hemodynamic Physiological Challenge (3271) */
export const HemodynamicPhysiologicalChallenge3271 = new DicomUID("1.2.840.10008.6.1.61", "Hemodynamic Physiological Challenge (3271)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicPhysiologicalChallenge3271);
/** 1.2.840.10008.6.1.62 ECG Annotation (3335) */
export const ECGAnnotation3335 = new DicomUID("1.2.840.10008.6.1.62", "ECG Annotation (3335)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGAnnotation3335);
/** 1.2.840.10008.6.1.63 Hemodynamic Annotation (3337) */
export const HemodynamicAnnotation3337 = new DicomUID("1.2.840.10008.6.1.63", "Hemodynamic Annotation (3337)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicAnnotation3337);
/** 1.2.840.10008.6.1.64 Electrophysiology Annotation (3339) */
export const ElectrophysiologyAnnotation3339 = new DicomUID("1.2.840.10008.6.1.64", "Electrophysiology Annotation (3339)", DicomUidType.ContextGroupName, false);
DicomUID.register(ElectrophysiologyAnnotation3339);
/** 1.2.840.10008.6.1.65 Procedure Log Title (3400) */
export const ProcedureLogTitle3400 = new DicomUID("1.2.840.10008.6.1.65", "Procedure Log Title (3400)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProcedureLogTitle3400);
/** 1.2.840.10008.6.1.66 Log Note Type (3401) */
export const LogNoteType3401 = new DicomUID("1.2.840.10008.6.1.66", "Log Note Type (3401)", DicomUidType.ContextGroupName, false);
DicomUID.register(LogNoteType3401);
/** 1.2.840.10008.6.1.67 Patient Status and Event (3402) */
export const PatientStatusAndEvent3402 = new DicomUID("1.2.840.10008.6.1.67", "Patient Status and Event (3402)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientStatusAndEvent3402);
/** 1.2.840.10008.6.1.68 Percutaneous Entry (3403) */
export const PercutaneousEntry3403 = new DicomUID("1.2.840.10008.6.1.68", "Percutaneous Entry (3403)", DicomUidType.ContextGroupName, false);
DicomUID.register(PercutaneousEntry3403);
/** 1.2.840.10008.6.1.69 Staff Action (3404) */
export const StaffAction3404 = new DicomUID("1.2.840.10008.6.1.69", "Staff Action (3404)", DicomUidType.ContextGroupName, false);
DicomUID.register(StaffAction3404);
/** 1.2.840.10008.6.1.70 Procedure Action Value (3405) */
export const ProcedureActionValue3405 = new DicomUID("1.2.840.10008.6.1.70", "Procedure Action Value (3405)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProcedureActionValue3405);
/** 1.2.840.10008.6.1.71 Non-coronary Transcatheter Intervention (3406) */
export const NonCoronaryTranscatheterIntervention3406 = new DicomUID("1.2.840.10008.6.1.71", "Non-coronary Transcatheter Intervention (3406)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonCoronaryTranscatheterIntervention3406);
/** 1.2.840.10008.6.1.72 Object Reference Purpose (3407) */
export const ObjectReferencePurpose3407 = new DicomUID("1.2.840.10008.6.1.72", "Object Reference Purpose (3407)", DicomUidType.ContextGroupName, false);
DicomUID.register(ObjectReferencePurpose3407);
/** 1.2.840.10008.6.1.73 Consumable Action (3408) */
export const ConsumableAction3408 = new DicomUID("1.2.840.10008.6.1.73", "Consumable Action (3408)", DicomUidType.ContextGroupName, false);
DicomUID.register(ConsumableAction3408);
/** 1.2.840.10008.6.1.74 Drug/Contrast Administration (3409) */
export const DrugContrastAdministration3409 = new DicomUID("1.2.840.10008.6.1.74", "Drug/Contrast Administration (3409)", DicomUidType.ContextGroupName, false);
DicomUID.register(DrugContrastAdministration3409);
/** 1.2.840.10008.6.1.75 Drug/Contrast Numeric Parameter (3410) */
export const DrugContrastNumericParameter3410 = new DicomUID("1.2.840.10008.6.1.75", "Drug/Contrast Numeric Parameter (3410)", DicomUidType.ContextGroupName, false);
DicomUID.register(DrugContrastNumericParameter3410);
/** 1.2.840.10008.6.1.76 Intracoronary Device (3411) */
export const IntracoronaryDevice3411 = new DicomUID("1.2.840.10008.6.1.76", "Intracoronary Device (3411)", DicomUidType.ContextGroupName, false);
DicomUID.register(IntracoronaryDevice3411);
/** 1.2.840.10008.6.1.77 Intervention Action/Status (3412) */
export const InterventionActionStatus3412 = new DicomUID("1.2.840.10008.6.1.77", "Intervention Action/Status (3412)", DicomUidType.ContextGroupName, false);
DicomUID.register(InterventionActionStatus3412);
/** 1.2.840.10008.6.1.78 Adverse Outcome (3413) */
export const AdverseOutcome3413 = new DicomUID("1.2.840.10008.6.1.78", "Adverse Outcome (3413)", DicomUidType.ContextGroupName, false);
DicomUID.register(AdverseOutcome3413);
/** 1.2.840.10008.6.1.79 Procedure Urgency (3414) */
export const ProcedureUrgency3414 = new DicomUID("1.2.840.10008.6.1.79", "Procedure Urgency (3414)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProcedureUrgency3414);
/** 1.2.840.10008.6.1.80 Cardiac Rhythm (3415) */
export const CardiacRhythm3415 = new DicomUID("1.2.840.10008.6.1.80", "Cardiac Rhythm (3415)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacRhythm3415);
/** 1.2.840.10008.6.1.81 Respiration Rhythm (3416) */
export const RespirationRhythm3416 = new DicomUID("1.2.840.10008.6.1.81", "Respiration Rhythm (3416)", DicomUidType.ContextGroupName, false);
DicomUID.register(RespirationRhythm3416);
/** 1.2.840.10008.6.1.82 Lesion Risk (3418) */
export const LesionRisk3418 = new DicomUID("1.2.840.10008.6.1.82", "Lesion Risk (3418)", DicomUidType.ContextGroupName, false);
DicomUID.register(LesionRisk3418);
/** 1.2.840.10008.6.1.83 Finding Title (3419) */
export const FindingTitle3419 = new DicomUID("1.2.840.10008.6.1.83", "Finding Title (3419)", DicomUidType.ContextGroupName, false);
DicomUID.register(FindingTitle3419);
/** 1.2.840.10008.6.1.84 Procedure Action (3421) */
export const ProcedureAction3421 = new DicomUID("1.2.840.10008.6.1.84", "Procedure Action (3421)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProcedureAction3421);
/** 1.2.840.10008.6.1.85 Device Use Action (3422) */
export const DeviceUseAction3422 = new DicomUID("1.2.840.10008.6.1.85", "Device Use Action (3422)", DicomUidType.ContextGroupName, false);
DicomUID.register(DeviceUseAction3422);
/** 1.2.840.10008.6.1.86 Numeric Device Characteristic (3423) */
export const NumericDeviceCharacteristic3423 = new DicomUID("1.2.840.10008.6.1.86", "Numeric Device Characteristic (3423)", DicomUidType.ContextGroupName, false);
DicomUID.register(NumericDeviceCharacteristic3423);
/** 1.2.840.10008.6.1.87 Intervention Parameter (3425) */
export const InterventionParameter3425 = new DicomUID("1.2.840.10008.6.1.87", "Intervention Parameter (3425)", DicomUidType.ContextGroupName, false);
DicomUID.register(InterventionParameter3425);
/** 1.2.840.10008.6.1.88 Consumables Parameter (3426) */
export const ConsumablesParameter3426 = new DicomUID("1.2.840.10008.6.1.88", "Consumables Parameter (3426)", DicomUidType.ContextGroupName, false);
DicomUID.register(ConsumablesParameter3426);
/** 1.2.840.10008.6.1.89 Equipment Event (3427) */
export const EquipmentEvent3427 = new DicomUID("1.2.840.10008.6.1.89", "Equipment Event (3427)", DicomUidType.ContextGroupName, false);
DicomUID.register(EquipmentEvent3427);
/** 1.2.840.10008.6.1.90 Cardiovascular Imaging Procedure (3428) */
export const CardiovascularImagingProcedure3428 = new DicomUID("1.2.840.10008.6.1.90", "Cardiovascular Imaging Procedure (3428)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiovascularImagingProcedure3428);
/** 1.2.840.10008.6.1.91 Catheterization Device (3429) */
export const CatheterizationDevice3429 = new DicomUID("1.2.840.10008.6.1.91", "Catheterization Device (3429)", DicomUidType.ContextGroupName, false);
DicomUID.register(CatheterizationDevice3429);
/** 1.2.840.10008.6.1.92 DateTime Qualifier (3430) */
export const DateTimeQualifier3430 = new DicomUID("1.2.840.10008.6.1.92", "DateTime Qualifier (3430)", DicomUidType.ContextGroupName, false);
DicomUID.register(DateTimeQualifier3430);
/** 1.2.840.10008.6.1.93 Peripheral Pulse Location (3440) */
export const PeripheralPulseLocation3440 = new DicomUID("1.2.840.10008.6.1.93", "Peripheral Pulse Location (3440)", DicomUidType.ContextGroupName, false);
DicomUID.register(PeripheralPulseLocation3440);
/** 1.2.840.10008.6.1.94 Patient Assessment (3441) */
export const PatientAssessment3441 = new DicomUID("1.2.840.10008.6.1.94", "Patient Assessment (3441)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientAssessment3441);
/** 1.2.840.10008.6.1.95 Peripheral Pulse Method (3442) */
export const PeripheralPulseMethod3442 = new DicomUID("1.2.840.10008.6.1.95", "Peripheral Pulse Method (3442)", DicomUidType.ContextGroupName, false);
DicomUID.register(PeripheralPulseMethod3442);
/** 1.2.840.10008.6.1.96 Skin Condition (3446) */
export const SkinCondition3446 = new DicomUID("1.2.840.10008.6.1.96", "Skin Condition (3446)", DicomUidType.ContextGroupName, false);
DicomUID.register(SkinCondition3446);
/** 1.2.840.10008.6.1.97 Airway Assessment (3448) */
export const AirwayAssessment3448 = new DicomUID("1.2.840.10008.6.1.97", "Airway Assessment (3448)", DicomUidType.ContextGroupName, false);
DicomUID.register(AirwayAssessment3448);
/** 1.2.840.10008.6.1.98 Calibration Object (3451) */
export const CalibrationObject3451 = new DicomUID("1.2.840.10008.6.1.98", "Calibration Object (3451)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalibrationObject3451);
/** 1.2.840.10008.6.1.99 Calibration Method (3452) */
export const CalibrationMethod3452 = new DicomUID("1.2.840.10008.6.1.99", "Calibration Method (3452)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalibrationMethod3452);
/** 1.2.840.10008.6.1.100 Cardiac Volume Method (3453) */
export const CardiacVolumeMethod3453 = new DicomUID("1.2.840.10008.6.1.100", "Cardiac Volume Method (3453)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacVolumeMethod3453);
/** 1.2.840.10008.6.1.101 Index Method (3455) */
export const IndexMethod3455 = new DicomUID("1.2.840.10008.6.1.101", "Index Method (3455)", DicomUidType.ContextGroupName, false);
DicomUID.register(IndexMethod3455);
/** 1.2.840.10008.6.1.102 Sub-segment Method (3456) */
export const SubSegmentMethod3456 = new DicomUID("1.2.840.10008.6.1.102", "Sub-segment Method (3456)", DicomUidType.ContextGroupName, false);
DicomUID.register(SubSegmentMethod3456);
/** 1.2.840.10008.6.1.103 Contour Realignment (3458) */
export const ContourRealignment3458 = new DicomUID("1.2.840.10008.6.1.103", "Contour Realignment (3458)", DicomUidType.ContextGroupName, false);
DicomUID.register(ContourRealignment3458);
/** 1.2.840.10008.6.1.104 Circumferential Extent (3460) */
export const CircumferentialExtent3460 = new DicomUID("1.2.840.10008.6.1.104", "Circumferential Extent (3460)", DicomUidType.ContextGroupName, false);
DicomUID.register(CircumferentialExtent3460);
/** 1.2.840.10008.6.1.105 Regional Extent (3461) */
export const RegionalExtent3461 = new DicomUID("1.2.840.10008.6.1.105", "Regional Extent (3461)", DicomUidType.ContextGroupName, false);
DicomUID.register(RegionalExtent3461);
/** 1.2.840.10008.6.1.106 Chamber Identification (3462) */
export const ChamberIdentification3462 = new DicomUID("1.2.840.10008.6.1.106", "Chamber Identification (3462)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChamberIdentification3462);
/** 1.2.840.10008.6.1.107 QA Reference Method (3465) */
export const QAReferenceMethod3465 = new DicomUID("1.2.840.10008.6.1.107", "QA Reference Method (3465)", DicomUidType.ContextGroupName, false);
DicomUID.register(QAReferenceMethod3465);
/** 1.2.840.10008.6.1.108 Plane Identification (3466) */
export const PlaneIdentification3466 = new DicomUID("1.2.840.10008.6.1.108", "Plane Identification (3466)", DicomUidType.ContextGroupName, false);
DicomUID.register(PlaneIdentification3466);
/** 1.2.840.10008.6.1.109 Ejection Fraction (3467) */
export const EjectionFraction3467 = new DicomUID("1.2.840.10008.6.1.109", "Ejection Fraction (3467)", DicomUidType.ContextGroupName, false);
DicomUID.register(EjectionFraction3467);
/** 1.2.840.10008.6.1.110 ED Volume (3468) */
export const EDVolume3468 = new DicomUID("1.2.840.10008.6.1.110", "ED Volume (3468)", DicomUidType.ContextGroupName, false);
DicomUID.register(EDVolume3468);
/** 1.2.840.10008.6.1.111 ES Volume (3469) */
export const ESVolume3469 = new DicomUID("1.2.840.10008.6.1.111", "ES Volume (3469)", DicomUidType.ContextGroupName, false);
DicomUID.register(ESVolume3469);
/** 1.2.840.10008.6.1.112 Vessel Lumen Cross-sectional Area Calculation Method (3470) */
export const VesselLumenCrossSectionalAreaCalculationMethod3470 = new DicomUID("1.2.840.10008.6.1.112", "Vessel Lumen Cross-sectional Area Calculation Method (3470)", DicomUidType.ContextGroupName, false);
DicomUID.register(VesselLumenCrossSectionalAreaCalculationMethod3470);
/** 1.2.840.10008.6.1.113 Estimated Volume (3471) */
export const EstimatedVolume3471 = new DicomUID("1.2.840.10008.6.1.113", "Estimated Volume (3471)", DicomUidType.ContextGroupName, false);
DicomUID.register(EstimatedVolume3471);
/** 1.2.840.10008.6.1.114 Cardiac Contraction Phase (3472) */
export const CardiacContractionPhase3472 = new DicomUID("1.2.840.10008.6.1.114", "Cardiac Contraction Phase (3472)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacContractionPhase3472);
/** 1.2.840.10008.6.1.115 IVUS Procedure Phase (3480) */
export const IVUSProcedurePhase3480 = new DicomUID("1.2.840.10008.6.1.115", "IVUS Procedure Phase (3480)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSProcedurePhase3480);
/** 1.2.840.10008.6.1.116 IVUS Distance Measurement (3481) */
export const IVUSDistanceMeasurement3481 = new DicomUID("1.2.840.10008.6.1.116", "IVUS Distance Measurement (3481)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSDistanceMeasurement3481);
/** 1.2.840.10008.6.1.117 IVUS Area Measurement (3482) */
export const IVUSAreaMeasurement3482 = new DicomUID("1.2.840.10008.6.1.117", "IVUS Area Measurement (3482)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSAreaMeasurement3482);
/** 1.2.840.10008.6.1.118 IVUS Longitudinal Measurement (3483) */
export const IVUSLongitudinalMeasurement3483 = new DicomUID("1.2.840.10008.6.1.118", "IVUS Longitudinal Measurement (3483)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSLongitudinalMeasurement3483);
/** 1.2.840.10008.6.1.119 IVUS Index/Ratio (3484) */
export const IVUSIndexRatio3484 = new DicomUID("1.2.840.10008.6.1.119", "IVUS Index/Ratio (3484)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSIndexRatio3484);
/** 1.2.840.10008.6.1.120 IVUS Volume Measurement (3485) */
export const IVUSVolumeMeasurement3485 = new DicomUID("1.2.840.10008.6.1.120", "IVUS Volume Measurement (3485)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSVolumeMeasurement3485);
/** 1.2.840.10008.6.1.121 Vascular Measurement Site (3486) */
export const VascularMeasurementSite3486 = new DicomUID("1.2.840.10008.6.1.121", "Vascular Measurement Site (3486)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularMeasurementSite3486);
/** 1.2.840.10008.6.1.122 Intravascular Volumetric Region (3487) */
export const IntravascularVolumetricRegion3487 = new DicomUID("1.2.840.10008.6.1.122", "Intravascular Volumetric Region (3487)", DicomUidType.ContextGroupName, false);
DicomUID.register(IntravascularVolumetricRegion3487);
/** 1.2.840.10008.6.1.123 Min/Max/Mean (3488) */
export const MinMaxMean3488 = new DicomUID("1.2.840.10008.6.1.123", "Min/Max/Mean (3488)", DicomUidType.ContextGroupName, false);
DicomUID.register(MinMaxMean3488);
/** 1.2.840.10008.6.1.124 Calcium Distribution (3489) */
export const CalciumDistribution3489 = new DicomUID("1.2.840.10008.6.1.124", "Calcium Distribution (3489)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalciumDistribution3489);
/** 1.2.840.10008.6.1.125 IVUS Lesion Morphology (3491) */
export const IVUSLesionMorphology3491 = new DicomUID("1.2.840.10008.6.1.125", "IVUS Lesion Morphology (3491)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSLesionMorphology3491);
/** 1.2.840.10008.6.1.126 Vascular Dissection Classification (3492) */
export const VascularDissectionClassification3492 = new DicomUID("1.2.840.10008.6.1.126", "Vascular Dissection Classification (3492)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularDissectionClassification3492);
/** 1.2.840.10008.6.1.127 IVUS Relative Stenosis Severity (3493) */
export const IVUSRelativeStenosisSeverity3493 = new DicomUID("1.2.840.10008.6.1.127", "IVUS Relative Stenosis Severity (3493)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSRelativeStenosisSeverity3493);
/** 1.2.840.10008.6.1.128 IVUS Non Morphological Finding (3494) */
export const IVUSNonMorphologicalFinding3494 = new DicomUID("1.2.840.10008.6.1.128", "IVUS Non Morphological Finding (3494)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSNonMorphologicalFinding3494);
/** 1.2.840.10008.6.1.129 IVUS Plaque Composition (3495) */
export const IVUSPlaqueComposition3495 = new DicomUID("1.2.840.10008.6.1.129", "IVUS Plaque Composition (3495)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSPlaqueComposition3495);
/** 1.2.840.10008.6.1.130 IVUS Fiducial Point (3496) */
export const IVUSFiducialPoint3496 = new DicomUID("1.2.840.10008.6.1.130", "IVUS Fiducial Point (3496)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSFiducialPoint3496);
/** 1.2.840.10008.6.1.131 IVUS Arterial Morphology (3497) */
export const IVUSArterialMorphology3497 = new DicomUID("1.2.840.10008.6.1.131", "IVUS Arterial Morphology (3497)", DicomUidType.ContextGroupName, false);
DicomUID.register(IVUSArterialMorphology3497);
/** 1.2.840.10008.6.1.132 Pressure Unit (3500) */
export const PressureUnit3500 = new DicomUID("1.2.840.10008.6.1.132", "Pressure Unit (3500)", DicomUidType.ContextGroupName, false);
DicomUID.register(PressureUnit3500);
/** 1.2.840.10008.6.1.133 Hemodynamic Resistance Unit (3502) */
export const HemodynamicResistanceUnit3502 = new DicomUID("1.2.840.10008.6.1.133", "Hemodynamic Resistance Unit (3502)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicResistanceUnit3502);
/** 1.2.840.10008.6.1.134 Indexed Hemodynamic Resistance Unit (3503) */
export const IndexedHemodynamicResistanceUnit3503 = new DicomUID("1.2.840.10008.6.1.134", "Indexed Hemodynamic Resistance Unit (3503)", DicomUidType.ContextGroupName, false);
DicomUID.register(IndexedHemodynamicResistanceUnit3503);
/** 1.2.840.10008.6.1.135 Catheter Size Unit (3510) */
export const CatheterSizeUnit3510 = new DicomUID("1.2.840.10008.6.1.135", "Catheter Size Unit (3510)", DicomUidType.ContextGroupName, false);
DicomUID.register(CatheterSizeUnit3510);
/** 1.2.840.10008.6.1.136 Specimen Collection (3515) */
export const SpecimenCollection3515 = new DicomUID("1.2.840.10008.6.1.136", "Specimen Collection (3515)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecimenCollection3515);
/** 1.2.840.10008.6.1.137 Blood Source Type (3520) */
export const BloodSourceType3520 = new DicomUID("1.2.840.10008.6.1.137", "Blood Source Type (3520)", DicomUidType.ContextGroupName, false);
DicomUID.register(BloodSourceType3520);
/** 1.2.840.10008.6.1.138 Blood Gas Pressure (3524) */
export const BloodGasPressure3524 = new DicomUID("1.2.840.10008.6.1.138", "Blood Gas Pressure (3524)", DicomUidType.ContextGroupName, false);
DicomUID.register(BloodGasPressure3524);
/** 1.2.840.10008.6.1.139 Blood Gas Content (3525) */
export const BloodGasContent3525 = new DicomUID("1.2.840.10008.6.1.139", "Blood Gas Content (3525)", DicomUidType.ContextGroupName, false);
DicomUID.register(BloodGasContent3525);
/** 1.2.840.10008.6.1.140 Blood Gas Saturation (3526) */
export const BloodGasSaturation3526 = new DicomUID("1.2.840.10008.6.1.140", "Blood Gas Saturation (3526)", DicomUidType.ContextGroupName, false);
DicomUID.register(BloodGasSaturation3526);
/** 1.2.840.10008.6.1.141 Blood Base Excess (3527) */
export const BloodBaseExcess3527 = new DicomUID("1.2.840.10008.6.1.141", "Blood Base Excess (3527)", DicomUidType.ContextGroupName, false);
DicomUID.register(BloodBaseExcess3527);
/** 1.2.840.10008.6.1.142 Blood pH (3528) */
export const BloodPH3528 = new DicomUID("1.2.840.10008.6.1.142", "Blood pH (3528)", DicomUidType.ContextGroupName, false);
DicomUID.register(BloodPH3528);
/** 1.2.840.10008.6.1.143 Arterial / Venous Content (3529) */
export const ArterialVenousContent3529 = new DicomUID("1.2.840.10008.6.1.143", "Arterial / Venous Content (3529)", DicomUidType.ContextGroupName, false);
DicomUID.register(ArterialVenousContent3529);
/** 1.2.840.10008.6.1.144 Oxygen Administration Action (3530) */
export const OxygenAdministrationAction3530 = new DicomUID("1.2.840.10008.6.1.144", "Oxygen Administration Action (3530)", DicomUidType.ContextGroupName, false);
DicomUID.register(OxygenAdministrationAction3530);
/** 1.2.840.10008.6.1.145 Oxygen Administration (3531) */
export const OxygenAdministration3531 = new DicomUID("1.2.840.10008.6.1.145", "Oxygen Administration (3531)", DicomUidType.ContextGroupName, false);
DicomUID.register(OxygenAdministration3531);
/** 1.2.840.10008.6.1.146 Circulatory Support Action (3550) */
export const CirculatorySupportAction3550 = new DicomUID("1.2.840.10008.6.1.146", "Circulatory Support Action (3550)", DicomUidType.ContextGroupName, false);
DicomUID.register(CirculatorySupportAction3550);
/** 1.2.840.10008.6.1.147 Ventilation Action (3551) */
export const VentilationAction3551 = new DicomUID("1.2.840.10008.6.1.147", "Ventilation Action (3551)", DicomUidType.ContextGroupName, false);
DicomUID.register(VentilationAction3551);
/** 1.2.840.10008.6.1.148 Pacing Action (3552) */
export const PacingAction3552 = new DicomUID("1.2.840.10008.6.1.148", "Pacing Action (3552)", DicomUidType.ContextGroupName, false);
DicomUID.register(PacingAction3552);
/** 1.2.840.10008.6.1.149 Circulatory Support (3553) */
export const CirculatorySupport3553 = new DicomUID("1.2.840.10008.6.1.149", "Circulatory Support (3553)", DicomUidType.ContextGroupName, false);
DicomUID.register(CirculatorySupport3553);
/** 1.2.840.10008.6.1.150 Ventilation (3554) */
export const Ventilation3554 = new DicomUID("1.2.840.10008.6.1.150", "Ventilation (3554)", DicomUidType.ContextGroupName, false);
DicomUID.register(Ventilation3554);
/** 1.2.840.10008.6.1.151 Pacing (3555) */
export const Pacing3555 = new DicomUID("1.2.840.10008.6.1.151", "Pacing (3555)", DicomUidType.ContextGroupName, false);
DicomUID.register(Pacing3555);
/** 1.2.840.10008.6.1.152 Blood Pressure Method (3560) */
export const BloodPressureMethod3560 = new DicomUID("1.2.840.10008.6.1.152", "Blood Pressure Method (3560)", DicomUidType.ContextGroupName, false);
DicomUID.register(BloodPressureMethod3560);
/** 1.2.840.10008.6.1.153 Relative Time (3600) */
export const RelativeTime3600 = new DicomUID("1.2.840.10008.6.1.153", "Relative Time (3600)", DicomUidType.ContextGroupName, false);
DicomUID.register(RelativeTime3600);
/** 1.2.840.10008.6.1.154 Hemodynamic Patient State (3602) */
export const HemodynamicPatientState3602 = new DicomUID("1.2.840.10008.6.1.154", "Hemodynamic Patient State (3602)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicPatientState3602);
/** 1.2.840.10008.6.1.155 Arterial Lesion Location (3604) */
export const ArterialLesionLocation3604 = new DicomUID("1.2.840.10008.6.1.155", "Arterial Lesion Location (3604)", DicomUidType.ContextGroupName, false);
DicomUID.register(ArterialLesionLocation3604);
/** 1.2.840.10008.6.1.156 Arterial Source Location (3606) */
export const ArterialSourceLocation3606 = new DicomUID("1.2.840.10008.6.1.156", "Arterial Source Location (3606)", DicomUidType.ContextGroupName, false);
DicomUID.register(ArterialSourceLocation3606);
/** 1.2.840.10008.6.1.157 Venous Source Location (3607) */
export const VenousSourceLocation3607 = new DicomUID("1.2.840.10008.6.1.157", "Venous Source Location (3607)", DicomUidType.ContextGroupName, false);
DicomUID.register(VenousSourceLocation3607);
/** 1.2.840.10008.6.1.158 Atrial Source Location (3608) */
export const AtrialSourceLocation3608 = new DicomUID("1.2.840.10008.6.1.158", "Atrial Source Location (3608)", DicomUidType.ContextGroupName, false);
DicomUID.register(AtrialSourceLocation3608);
/** 1.2.840.10008.6.1.159 Ventricular Source Location (3609) */
export const VentricularSourceLocation3609 = new DicomUID("1.2.840.10008.6.1.159", "Ventricular Source Location (3609)", DicomUidType.ContextGroupName, false);
DicomUID.register(VentricularSourceLocation3609);
/** 1.2.840.10008.6.1.160 Gradient Source Location (3610) */
export const GradientSourceLocation3610 = new DicomUID("1.2.840.10008.6.1.160", "Gradient Source Location (3610)", DicomUidType.ContextGroupName, false);
DicomUID.register(GradientSourceLocation3610);
/** 1.2.840.10008.6.1.161 Pressure Measurement (3611) */
export const PressureMeasurement3611 = new DicomUID("1.2.840.10008.6.1.161", "Pressure Measurement (3611)", DicomUidType.ContextGroupName, false);
DicomUID.register(PressureMeasurement3611);
/** 1.2.840.10008.6.1.162 Blood Velocity Measurement (3612) */
export const BloodVelocityMeasurement3612 = new DicomUID("1.2.840.10008.6.1.162", "Blood Velocity Measurement (3612)", DicomUidType.ContextGroupName, false);
DicomUID.register(BloodVelocityMeasurement3612);
/** 1.2.840.10008.6.1.163 Hemodynamic Time Measurement (3613) */
export const HemodynamicTimeMeasurement3613 = new DicomUID("1.2.840.10008.6.1.163", "Hemodynamic Time Measurement (3613)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicTimeMeasurement3613);
/** 1.2.840.10008.6.1.164 Non-mitral Valve Area (3614) */
export const NonMitralValveArea3614 = new DicomUID("1.2.840.10008.6.1.164", "Non-mitral Valve Area (3614)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonMitralValveArea3614);
/** 1.2.840.10008.6.1.165 Valve Area (3615) */
export const ValveArea3615 = new DicomUID("1.2.840.10008.6.1.165", "Valve Area (3615)", DicomUidType.ContextGroupName, false);
DicomUID.register(ValveArea3615);
/** 1.2.840.10008.6.1.166 Hemodynamic Period Measurement (3616) */
export const HemodynamicPeriodMeasurement3616 = new DicomUID("1.2.840.10008.6.1.166", "Hemodynamic Period Measurement (3616)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicPeriodMeasurement3616);
/** 1.2.840.10008.6.1.167 Valve Flow (3617) */
export const ValveFlow3617 = new DicomUID("1.2.840.10008.6.1.167", "Valve Flow (3617)", DicomUidType.ContextGroupName, false);
DicomUID.register(ValveFlow3617);
/** 1.2.840.10008.6.1.168 Hemodynamic Flow (3618) */
export const HemodynamicFlow3618 = new DicomUID("1.2.840.10008.6.1.168", "Hemodynamic Flow (3618)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicFlow3618);
/** 1.2.840.10008.6.1.169 Hemodynamic Resistance Measurement (3619) */
export const HemodynamicResistanceMeasurement3619 = new DicomUID("1.2.840.10008.6.1.169", "Hemodynamic Resistance Measurement (3619)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicResistanceMeasurement3619);
/** 1.2.840.10008.6.1.170 Hemodynamic Ratio (3620) */
export const HemodynamicRatio3620 = new DicomUID("1.2.840.10008.6.1.170", "Hemodynamic Ratio (3620)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicRatio3620);
/** 1.2.840.10008.6.1.171 Fractional Flow Reserve (3621) */
export const FractionalFlowReserve3621 = new DicomUID("1.2.840.10008.6.1.171", "Fractional Flow Reserve (3621)", DicomUidType.ContextGroupName, false);
DicomUID.register(FractionalFlowReserve3621);
/** 1.2.840.10008.6.1.172 Measurement Type (3627) */
export const MeasurementType3627 = new DicomUID("1.2.840.10008.6.1.172", "Measurement Type (3627)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasurementType3627);
/** 1.2.840.10008.6.1.173 Cardiac Output Method (3628) */
export const CardiacOutputMethod3628 = new DicomUID("1.2.840.10008.6.1.173", "Cardiac Output Method (3628)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacOutputMethod3628);
/** 1.2.840.10008.6.1.174 Procedure Intent (3629) */
export const ProcedureIntent3629 = new DicomUID("1.2.840.10008.6.1.174", "Procedure Intent (3629)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProcedureIntent3629);
/** 1.2.840.10008.6.1.175 Cardiovascular Anatomic Location (3630) */
export const CardiovascularAnatomicLocation3630 = new DicomUID("1.2.840.10008.6.1.175", "Cardiovascular Anatomic Location (3630)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiovascularAnatomicLocation3630);
/** 1.2.840.10008.6.1.176 Hypertension (3640) */
export const Hypertension3640 = new DicomUID("1.2.840.10008.6.1.176", "Hypertension (3640)", DicomUidType.ContextGroupName, false);
DicomUID.register(Hypertension3640);
/** 1.2.840.10008.6.1.177 Hemodynamic Assessment (3641) */
export const HemodynamicAssessment3641 = new DicomUID("1.2.840.10008.6.1.177", "Hemodynamic Assessment (3641)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicAssessment3641);
/** 1.2.840.10008.6.1.178 Degree Finding (3642) */
export const DegreeFinding3642 = new DicomUID("1.2.840.10008.6.1.178", "Degree Finding (3642)", DicomUidType.ContextGroupName, false);
DicomUID.register(DegreeFinding3642);
/** 1.2.840.10008.6.1.179 Hemodynamic Measurement Phase (3651) */
export const HemodynamicMeasurementPhase3651 = new DicomUID("1.2.840.10008.6.1.179", "Hemodynamic Measurement Phase (3651)", DicomUidType.ContextGroupName, false);
DicomUID.register(HemodynamicMeasurementPhase3651);
/** 1.2.840.10008.6.1.180 Body Surface Area Equation (3663) */
export const BodySurfaceAreaEquation3663 = new DicomUID("1.2.840.10008.6.1.180", "Body Surface Area Equation (3663)", DicomUidType.ContextGroupName, false);
DicomUID.register(BodySurfaceAreaEquation3663);
/** 1.2.840.10008.6.1.181 Oxygen Consumption Equation/Table (3664) */
export const OxygenConsumptionEquationTable3664 = new DicomUID("1.2.840.10008.6.1.181", "Oxygen Consumption Equation/Table (3664)", DicomUidType.ContextGroupName, false);
DicomUID.register(OxygenConsumptionEquationTable3664);
/** 1.2.840.10008.6.1.182 P50 Equation (3666) */
export const P50Equation3666 = new DicomUID("1.2.840.10008.6.1.182", "P50 Equation (3666)", DicomUidType.ContextGroupName, false);
DicomUID.register(P50Equation3666);
/** 1.2.840.10008.6.1.183 Framingham Score (3667) */
export const FraminghamScore3667 = new DicomUID("1.2.840.10008.6.1.183", "Framingham Score (3667)", DicomUidType.ContextGroupName, false);
DicomUID.register(FraminghamScore3667);
/** 1.2.840.10008.6.1.184 Framingham Table (3668) */
export const FraminghamTable3668 = new DicomUID("1.2.840.10008.6.1.184", "Framingham Table (3668)", DicomUidType.ContextGroupName, false);
DicomUID.register(FraminghamTable3668);
/** 1.2.840.10008.6.1.185 ECG Procedure Type (3670) */
export const ECGProcedureType3670 = new DicomUID("1.2.840.10008.6.1.185", "ECG Procedure Type (3670)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGProcedureType3670);
/** 1.2.840.10008.6.1.186 Reason for ECG Study (3671) */
export const ReasonForECGStudy3671 = new DicomUID("1.2.840.10008.6.1.186", "Reason for ECG Study (3671)", DicomUidType.ContextGroupName, false);
DicomUID.register(ReasonForECGStudy3671);
/** 1.2.840.10008.6.1.187 Pacemaker (3672) */
export const Pacemaker3672 = new DicomUID("1.2.840.10008.6.1.187", "Pacemaker (3672)", DicomUidType.ContextGroupName, false);
DicomUID.register(Pacemaker3672);
/** 1.2.840.10008.6.1.188 Diagnosis (Retired) (3673) (Retired) */
export const Diagnosis3673 = new DicomUID("1.2.840.10008.6.1.188", "Diagnosis (Retired) (3673)", DicomUidType.ContextGroupName, true);
DicomUID.register(Diagnosis3673);
/** 1.2.840.10008.6.1.189 Other Filters (Retired) (3675) (Retired) */
export const OtherFilters3675 = new DicomUID("1.2.840.10008.6.1.189", "Other Filters (Retired) (3675)", DicomUidType.ContextGroupName, true);
DicomUID.register(OtherFilters3675);
/** 1.2.840.10008.6.1.190 Lead Measurement Technique (3676) */
export const LeadMeasurementTechnique3676 = new DicomUID("1.2.840.10008.6.1.190", "Lead Measurement Technique (3676)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeadMeasurementTechnique3676);
/** 1.2.840.10008.6.1.191 Summary Codes ECG (3677) */
export const SummaryCodesECG3677 = new DicomUID("1.2.840.10008.6.1.191", "Summary Codes ECG (3677)", DicomUidType.ContextGroupName, false);
DicomUID.register(SummaryCodesECG3677);
/** 1.2.840.10008.6.1.192 QT Correction Algorithm (3678) */
export const QTCorrectionAlgorithm3678 = new DicomUID("1.2.840.10008.6.1.192", "QT Correction Algorithm (3678)", DicomUidType.ContextGroupName, false);
DicomUID.register(QTCorrectionAlgorithm3678);
/** 1.2.840.10008.6.1.193 ECG Morphology Description (Retired) (3679) (Retired) */
export const ECGMorphologyDescription3679 = new DicomUID("1.2.840.10008.6.1.193", "ECG Morphology Description (Retired) (3679)", DicomUidType.ContextGroupName, true);
DicomUID.register(ECGMorphologyDescription3679);
/** 1.2.840.10008.6.1.194 ECG Lead Noise Description (3680) */
export const ECGLeadNoiseDescription3680 = new DicomUID("1.2.840.10008.6.1.194", "ECG Lead Noise Description (3680)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGLeadNoiseDescription3680);
/** 1.2.840.10008.6.1.195 ECG Lead Noise Modifier (Retired) (3681) (Retired) */
export const ECGLeadNoiseModifier3681 = new DicomUID("1.2.840.10008.6.1.195", "ECG Lead Noise Modifier (Retired) (3681)", DicomUidType.ContextGroupName, true);
DicomUID.register(ECGLeadNoiseModifier3681);
/** 1.2.840.10008.6.1.196 Probability (Retired) (3682) (Retired) */
export const Probability3682 = new DicomUID("1.2.840.10008.6.1.196", "Probability (Retired) (3682)", DicomUidType.ContextGroupName, true);
DicomUID.register(Probability3682);
/** 1.2.840.10008.6.1.197 Modifier (Retired) (3683) (Retired) */
export const Modifier3683 = new DicomUID("1.2.840.10008.6.1.197", "Modifier (Retired) (3683)", DicomUidType.ContextGroupName, true);
DicomUID.register(Modifier3683);
/** 1.2.840.10008.6.1.198 Trend (Retired) (3684) (Retired) */
export const Trend3684 = new DicomUID("1.2.840.10008.6.1.198", "Trend (Retired) (3684)", DicomUidType.ContextGroupName, true);
DicomUID.register(Trend3684);
/** 1.2.840.10008.6.1.199 Conjunctive Term (Retired) (3685) (Retired) */
export const ConjunctiveTerm3685 = new DicomUID("1.2.840.10008.6.1.199", "Conjunctive Term (Retired) (3685)", DicomUidType.ContextGroupName, true);
DicomUID.register(ConjunctiveTerm3685);
/** 1.2.840.10008.6.1.200 ECG Interpretive Statement (Retired) (3686) (Retired) */
export const ECGInterpretiveStatement3686 = new DicomUID("1.2.840.10008.6.1.200", "ECG Interpretive Statement (Retired) (3686)", DicomUidType.ContextGroupName, true);
DicomUID.register(ECGInterpretiveStatement3686);
/** 1.2.840.10008.6.1.201 Electrophysiology Waveform Duration (3687) */
export const ElectrophysiologyWaveformDuration3687 = new DicomUID("1.2.840.10008.6.1.201", "Electrophysiology Waveform Duration (3687)", DicomUidType.ContextGroupName, false);
DicomUID.register(ElectrophysiologyWaveformDuration3687);
/** 1.2.840.10008.6.1.202 Electrophysiology Waveform Voltage (3688) */
export const ElectrophysiologyWaveformVoltage3688 = new DicomUID("1.2.840.10008.6.1.202", "Electrophysiology Waveform Voltage (3688)", DicomUidType.ContextGroupName, false);
DicomUID.register(ElectrophysiologyWaveformVoltage3688);
/** 1.2.840.10008.6.1.203 Cath Diagnosis (3700) */
export const CathDiagnosis3700 = new DicomUID("1.2.840.10008.6.1.203", "Cath Diagnosis (3700)", DicomUidType.ContextGroupName, false);
DicomUID.register(CathDiagnosis3700);
/** 1.2.840.10008.6.1.204 Cardiac Valve/Tract (3701) */
export const CardiacValveTract3701 = new DicomUID("1.2.840.10008.6.1.204", "Cardiac Valve/Tract (3701)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacValveTract3701);
/** 1.2.840.10008.6.1.205 Wall Motion (3703) */
export const WallMotion3703 = new DicomUID("1.2.840.10008.6.1.205", "Wall Motion (3703)", DicomUidType.ContextGroupName, false);
DicomUID.register(WallMotion3703);
/** 1.2.840.10008.6.1.206 Myocardium Wall Morphology Finding (3704) */
export const MyocardiumWallMorphologyFinding3704 = new DicomUID("1.2.840.10008.6.1.206", "Myocardium Wall Morphology Finding (3704)", DicomUidType.ContextGroupName, false);
DicomUID.register(MyocardiumWallMorphologyFinding3704);
/** 1.2.840.10008.6.1.207 Chamber Size (3705) */
export const ChamberSize3705 = new DicomUID("1.2.840.10008.6.1.207", "Chamber Size (3705)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChamberSize3705);
/** 1.2.840.10008.6.1.208 Overall Contractility (3706) */
export const OverallContractility3706 = new DicomUID("1.2.840.10008.6.1.208", "Overall Contractility (3706)", DicomUidType.ContextGroupName, false);
DicomUID.register(OverallContractility3706);
/** 1.2.840.10008.6.1.209 VSD Description (3707) */
export const VSDDescription3707 = new DicomUID("1.2.840.10008.6.1.209", "VSD Description (3707)", DicomUidType.ContextGroupName, false);
DicomUID.register(VSDDescription3707);
/** 1.2.840.10008.6.1.210 Aortic Root Description (3709) */
export const AorticRootDescription3709 = new DicomUID("1.2.840.10008.6.1.210", "Aortic Root Description (3709)", DicomUidType.ContextGroupName, false);
DicomUID.register(AorticRootDescription3709);
/** 1.2.840.10008.6.1.211 Coronary Dominance (3710) */
export const CoronaryDominance3710 = new DicomUID("1.2.840.10008.6.1.211", "Coronary Dominance (3710)", DicomUidType.ContextGroupName, false);
DicomUID.register(CoronaryDominance3710);
/** 1.2.840.10008.6.1.212 Valvular Abnormality (3711) */
export const ValvularAbnormality3711 = new DicomUID("1.2.840.10008.6.1.212", "Valvular Abnormality (3711)", DicomUidType.ContextGroupName, false);
DicomUID.register(ValvularAbnormality3711);
/** 1.2.840.10008.6.1.213 Vessel Descriptor (3712) */
export const VesselDescriptor3712 = new DicomUID("1.2.840.10008.6.1.213", "Vessel Descriptor (3712)", DicomUidType.ContextGroupName, false);
DicomUID.register(VesselDescriptor3712);
/** 1.2.840.10008.6.1.214 TIMI Flow Characteristic (3713) */
export const TIMIFlowCharacteristic3713 = new DicomUID("1.2.840.10008.6.1.214", "TIMI Flow Characteristic (3713)", DicomUidType.ContextGroupName, false);
DicomUID.register(TIMIFlowCharacteristic3713);
/** 1.2.840.10008.6.1.215 Thrombus (3714) */
export const Thrombus3714 = new DicomUID("1.2.840.10008.6.1.215", "Thrombus (3714)", DicomUidType.ContextGroupName, false);
DicomUID.register(Thrombus3714);
/** 1.2.840.10008.6.1.216 Lesion Margin (3715) */
export const LesionMargin3715 = new DicomUID("1.2.840.10008.6.1.216", "Lesion Margin (3715)", DicomUidType.ContextGroupName, false);
DicomUID.register(LesionMargin3715);
/** 1.2.840.10008.6.1.217 Severity (3716) */
export const Severity3716 = new DicomUID("1.2.840.10008.6.1.217", "Severity (3716)", DicomUidType.ContextGroupName, false);
DicomUID.register(Severity3716);
/** 1.2.840.10008.6.1.218 Left Ventricle Myocardial Wall 17 Segment Model (3717) */
export const LeftVentricleMyocardialWall17SegmentModel3717 = new DicomUID("1.2.840.10008.6.1.218", "Left Ventricle Myocardial Wall 17 Segment Model (3717)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleMyocardialWall17SegmentModel3717);
/** 1.2.840.10008.6.1.219 Myocardial Wall Segments in Projection (3718) */
export const MyocardialWallSegmentsInProjection3718 = new DicomUID("1.2.840.10008.6.1.219", "Myocardial Wall Segments in Projection (3718)", DicomUidType.ContextGroupName, false);
DicomUID.register(MyocardialWallSegmentsInProjection3718);
/** 1.2.840.10008.6.1.220 Canadian Clinical Classification (3719) */
export const CanadianClinicalClassification3719 = new DicomUID("1.2.840.10008.6.1.220", "Canadian Clinical Classification (3719)", DicomUidType.ContextGroupName, false);
DicomUID.register(CanadianClinicalClassification3719);
/** 1.2.840.10008.6.1.221 Cardiac History Date (Retired) (3720) (Retired) */
export const CardiacHistoryDate3720 = new DicomUID("1.2.840.10008.6.1.221", "Cardiac History Date (Retired) (3720)", DicomUidType.ContextGroupName, true);
DicomUID.register(CardiacHistoryDate3720);
/** 1.2.840.10008.6.1.222 Cardiovascular Surgery (3721) */
export const CardiovascularSurgery3721 = new DicomUID("1.2.840.10008.6.1.222", "Cardiovascular Surgery (3721)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiovascularSurgery3721);
/** 1.2.840.10008.6.1.223 Diabetic Therapy (3722) */
export const DiabeticTherapy3722 = new DicomUID("1.2.840.10008.6.1.223", "Diabetic Therapy (3722)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiabeticTherapy3722);
/** 1.2.840.10008.6.1.224 MI Type (3723) */
export const MIType3723 = new DicomUID("1.2.840.10008.6.1.224", "MI Type (3723)", DicomUidType.ContextGroupName, false);
DicomUID.register(MIType3723);
/** 1.2.840.10008.6.1.225 Smoking History (3724) */
export const SmokingHistory3724 = new DicomUID("1.2.840.10008.6.1.225", "Smoking History (3724)", DicomUidType.ContextGroupName, false);
DicomUID.register(SmokingHistory3724);
/** 1.2.840.10008.6.1.226 Coronary Intervention Indication (3726) */
export const CoronaryInterventionIndication3726 = new DicomUID("1.2.840.10008.6.1.226", "Coronary Intervention Indication (3726)", DicomUidType.ContextGroupName, false);
DicomUID.register(CoronaryInterventionIndication3726);
/** 1.2.840.10008.6.1.227 Catheterization Indication (3727) */
export const CatheterizationIndication3727 = new DicomUID("1.2.840.10008.6.1.227", "Catheterization Indication (3727)", DicomUidType.ContextGroupName, false);
DicomUID.register(CatheterizationIndication3727);
/** 1.2.840.10008.6.1.228 Cath Finding (3728) */
export const CathFinding3728 = new DicomUID("1.2.840.10008.6.1.228", "Cath Finding (3728)", DicomUidType.ContextGroupName, false);
DicomUID.register(CathFinding3728);
/** 1.2.840.10008.6.1.229 Admission Status (3729) */
export const AdmissionStatus3729 = new DicomUID("1.2.840.10008.6.1.229", "Admission Status (3729)", DicomUidType.ContextGroupName, false);
DicomUID.register(AdmissionStatus3729);
/** 1.2.840.10008.6.1.230 Insurance Payor (3730) */
export const InsurancePayor3730 = new DicomUID("1.2.840.10008.6.1.230", "Insurance Payor (3730)", DicomUidType.ContextGroupName, false);
DicomUID.register(InsurancePayor3730);
/** 1.2.840.10008.6.1.231 Primary Cause of Death (3733) */
export const PrimaryCauseOfDeath3733 = new DicomUID("1.2.840.10008.6.1.231", "Primary Cause of Death (3733)", DicomUidType.ContextGroupName, false);
DicomUID.register(PrimaryCauseOfDeath3733);
/** 1.2.840.10008.6.1.232 Acute Coronary Syndrome Time Period (3735) */
export const AcuteCoronarySyndromeTimePeriod3735 = new DicomUID("1.2.840.10008.6.1.232", "Acute Coronary Syndrome Time Period (3735)", DicomUidType.ContextGroupName, false);
DicomUID.register(AcuteCoronarySyndromeTimePeriod3735);
/** 1.2.840.10008.6.1.233 NYHA Classification (3736) */
export const NYHAClassification3736 = new DicomUID("1.2.840.10008.6.1.233", "NYHA Classification (3736)", DicomUidType.ContextGroupName, false);
DicomUID.register(NYHAClassification3736);
/** 1.2.840.10008.6.1.234 Ischemia Non-invasive Test (3737) */
export const IschemiaNonInvasiveTest3737 = new DicomUID("1.2.840.10008.6.1.234", "Ischemia Non-invasive Test (3737)", DicomUidType.ContextGroupName, false);
DicomUID.register(IschemiaNonInvasiveTest3737);
/** 1.2.840.10008.6.1.235 Pre-Cath Angina Type (3738) */
export const PreCathAnginaType3738 = new DicomUID("1.2.840.10008.6.1.235", "Pre-Cath Angina Type (3738)", DicomUidType.ContextGroupName, false);
DicomUID.register(PreCathAnginaType3738);
/** 1.2.840.10008.6.1.236 Cath Procedure Type (3739) */
export const CathProcedureType3739 = new DicomUID("1.2.840.10008.6.1.236", "Cath Procedure Type (3739)", DicomUidType.ContextGroupName, false);
DicomUID.register(CathProcedureType3739);
/** 1.2.840.10008.6.1.237 Thrombolytic Administration (3740) */
export const ThrombolyticAdministration3740 = new DicomUID("1.2.840.10008.6.1.237", "Thrombolytic Administration (3740)", DicomUidType.ContextGroupName, false);
DicomUID.register(ThrombolyticAdministration3740);
/** 1.2.840.10008.6.1.238 Lab Visit Medication Administration (3741) */
export const LabVisitMedicationAdministration3741 = new DicomUID("1.2.840.10008.6.1.238", "Lab Visit Medication Administration (3741)", DicomUidType.ContextGroupName, false);
DicomUID.register(LabVisitMedicationAdministration3741);
/** 1.2.840.10008.6.1.239 PCI Medication Administration (3742) */
export const PCIMedicationAdministration3742 = new DicomUID("1.2.840.10008.6.1.239", "PCI Medication Administration (3742)", DicomUidType.ContextGroupName, false);
DicomUID.register(PCIMedicationAdministration3742);
/** 1.2.840.10008.6.1.240 Clopidogrel/Ticlopidine Administration (3743) */
export const ClopidogrelTiclopidineAdministration3743 = new DicomUID("1.2.840.10008.6.1.240", "Clopidogrel/Ticlopidine Administration (3743)", DicomUidType.ContextGroupName, false);
DicomUID.register(ClopidogrelTiclopidineAdministration3743);
/** 1.2.840.10008.6.1.241 EF Testing Method (3744) */
export const EFTestingMethod3744 = new DicomUID("1.2.840.10008.6.1.241", "EF Testing Method (3744)", DicomUidType.ContextGroupName, false);
DicomUID.register(EFTestingMethod3744);
/** 1.2.840.10008.6.1.242 Calculation Method (3745) */
export const CalculationMethod3745 = new DicomUID("1.2.840.10008.6.1.242", "Calculation Method (3745)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalculationMethod3745);
/** 1.2.840.10008.6.1.243 Percutaneous Entry Site (3746) */
export const PercutaneousEntrySite3746 = new DicomUID("1.2.840.10008.6.1.243", "Percutaneous Entry Site (3746)", DicomUidType.ContextGroupName, false);
DicomUID.register(PercutaneousEntrySite3746);
/** 1.2.840.10008.6.1.244 Percutaneous Closure (3747) */
export const PercutaneousClosure3747 = new DicomUID("1.2.840.10008.6.1.244", "Percutaneous Closure (3747)", DicomUidType.ContextGroupName, false);
DicomUID.register(PercutaneousClosure3747);
/** 1.2.840.10008.6.1.245 Angiographic EF Testing Method (3748) */
export const AngiographicEFTestingMethod3748 = new DicomUID("1.2.840.10008.6.1.245", "Angiographic EF Testing Method (3748)", DicomUidType.ContextGroupName, false);
DicomUID.register(AngiographicEFTestingMethod3748);
/** 1.2.840.10008.6.1.246 PCI Procedure Result (3749) */
export const PCIProcedureResult3749 = new DicomUID("1.2.840.10008.6.1.246", "PCI Procedure Result (3749)", DicomUidType.ContextGroupName, false);
DicomUID.register(PCIProcedureResult3749);
/** 1.2.840.10008.6.1.247 Previously Dilated Lesion (3750) */
export const PreviouslyDilatedLesion3750 = new DicomUID("1.2.840.10008.6.1.247", "Previously Dilated Lesion (3750)", DicomUidType.ContextGroupName, false);
DicomUID.register(PreviouslyDilatedLesion3750);
/** 1.2.840.10008.6.1.248 Guidewire Crossing (3752) */
export const GuidewireCrossing3752 = new DicomUID("1.2.840.10008.6.1.248", "Guidewire Crossing (3752)", DicomUidType.ContextGroupName, false);
DicomUID.register(GuidewireCrossing3752);
/** 1.2.840.10008.6.1.249 Vascular Complication (3754) */
export const VascularComplication3754 = new DicomUID("1.2.840.10008.6.1.249", "Vascular Complication (3754)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularComplication3754);
/** 1.2.840.10008.6.1.250 Cath Complication (3755) */
export const CathComplication3755 = new DicomUID("1.2.840.10008.6.1.250", "Cath Complication (3755)", DicomUidType.ContextGroupName, false);
DicomUID.register(CathComplication3755);
/** 1.2.840.10008.6.1.251 Cardiac Patient Risk Factor (3756) */
export const CardiacPatientRiskFactor3756 = new DicomUID("1.2.840.10008.6.1.251", "Cardiac Patient Risk Factor (3756)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacPatientRiskFactor3756);
/** 1.2.840.10008.6.1.252 Cardiac Diagnostic Procedure (3757) */
export const CardiacDiagnosticProcedure3757 = new DicomUID("1.2.840.10008.6.1.252", "Cardiac Diagnostic Procedure (3757)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacDiagnosticProcedure3757);
/** 1.2.840.10008.6.1.253 Cardiovascular Family History (3758) */
export const CardiovascularFamilyHistory3758 = new DicomUID("1.2.840.10008.6.1.253", "Cardiovascular Family History (3758)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiovascularFamilyHistory3758);
/** 1.2.840.10008.6.1.254 Hypertension Therapy (3760) */
export const HypertensionTherapy3760 = new DicomUID("1.2.840.10008.6.1.254", "Hypertension Therapy (3760)", DicomUidType.ContextGroupName, false);
DicomUID.register(HypertensionTherapy3760);
/** 1.2.840.10008.6.1.255 Antilipemic Agent (3761) */
export const AntilipemicAgent3761 = new DicomUID("1.2.840.10008.6.1.255", "Antilipemic Agent (3761)", DicomUidType.ContextGroupName, false);
DicomUID.register(AntilipemicAgent3761);
/** 1.2.840.10008.6.1.256 Antiarrhythmic Agent (3762) */
export const AntiarrhythmicAgent3762 = new DicomUID("1.2.840.10008.6.1.256", "Antiarrhythmic Agent (3762)", DicomUidType.ContextGroupName, false);
DicomUID.register(AntiarrhythmicAgent3762);
/** 1.2.840.10008.6.1.257 Myocardial Infarction Therapy (3764) */
export const MyocardialInfarctionTherapy3764 = new DicomUID("1.2.840.10008.6.1.257", "Myocardial Infarction Therapy (3764)", DicomUidType.ContextGroupName, false);
DicomUID.register(MyocardialInfarctionTherapy3764);
/** 1.2.840.10008.6.1.258 Concern Type (3769) */
export const ConcernType3769 = new DicomUID("1.2.840.10008.6.1.258", "Concern Type (3769)", DicomUidType.ContextGroupName, false);
DicomUID.register(ConcernType3769);
/** 1.2.840.10008.6.1.259 Problem Status (3770) */
export const ProblemStatus3770 = new DicomUID("1.2.840.10008.6.1.259", "Problem Status (3770)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProblemStatus3770);
/** 1.2.840.10008.6.1.260 Health Status (3772) */
export const HealthStatus3772 = new DicomUID("1.2.840.10008.6.1.260", "Health Status (3772)", DicomUidType.ContextGroupName, false);
DicomUID.register(HealthStatus3772);
/** 1.2.840.10008.6.1.261 Use Status (3773) */
export const UseStatus3773 = new DicomUID("1.2.840.10008.6.1.261", "Use Status (3773)", DicomUidType.ContextGroupName, false);
DicomUID.register(UseStatus3773);
/** 1.2.840.10008.6.1.262 Social History (3774) */
export const SocialHistory3774 = new DicomUID("1.2.840.10008.6.1.262", "Social History (3774)", DicomUidType.ContextGroupName, false);
DicomUID.register(SocialHistory3774);
/** 1.2.840.10008.6.1.263 Cardiovascular Implant (3777) */
export const CardiovascularImplant3777 = new DicomUID("1.2.840.10008.6.1.263", "Cardiovascular Implant (3777)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiovascularImplant3777);
/** 1.2.840.10008.6.1.264 Plaque Structure (3802) */
export const PlaqueStructure3802 = new DicomUID("1.2.840.10008.6.1.264", "Plaque Structure (3802)", DicomUidType.ContextGroupName, false);
DicomUID.register(PlaqueStructure3802);
/** 1.2.840.10008.6.1.265 Stenosis Measurement Method (3804) */
export const StenosisMeasurementMethod3804 = new DicomUID("1.2.840.10008.6.1.265", "Stenosis Measurement Method (3804)", DicomUidType.ContextGroupName, false);
DicomUID.register(StenosisMeasurementMethod3804);
/** 1.2.840.10008.6.1.266 Stenosis Type (3805) */
export const StenosisType3805 = new DicomUID("1.2.840.10008.6.1.266", "Stenosis Type (3805)", DicomUidType.ContextGroupName, false);
DicomUID.register(StenosisType3805);
/** 1.2.840.10008.6.1.267 Stenosis Shape (3806) */
export const StenosisShape3806 = new DicomUID("1.2.840.10008.6.1.267", "Stenosis Shape (3806)", DicomUidType.ContextGroupName, false);
DicomUID.register(StenosisShape3806);
/** 1.2.840.10008.6.1.268 Volume Measurement Method (3807) */
export const VolumeMeasurementMethod3807 = new DicomUID("1.2.840.10008.6.1.268", "Volume Measurement Method (3807)", DicomUidType.ContextGroupName, false);
DicomUID.register(VolumeMeasurementMethod3807);
/** 1.2.840.10008.6.1.269 Aneurysm Type (3808) */
export const AneurysmType3808 = new DicomUID("1.2.840.10008.6.1.269", "Aneurysm Type (3808)", DicomUidType.ContextGroupName, false);
DicomUID.register(AneurysmType3808);
/** 1.2.840.10008.6.1.270 Associated Condition (3809) */
export const AssociatedCondition3809 = new DicomUID("1.2.840.10008.6.1.270", "Associated Condition (3809)", DicomUidType.ContextGroupName, false);
DicomUID.register(AssociatedCondition3809);
/** 1.2.840.10008.6.1.271 Vascular Morphology (3810) */
export const VascularMorphology3810 = new DicomUID("1.2.840.10008.6.1.271", "Vascular Morphology (3810)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularMorphology3810);
/** 1.2.840.10008.6.1.272 Stent Finding (3813) */
export const StentFinding3813 = new DicomUID("1.2.840.10008.6.1.272", "Stent Finding (3813)", DicomUidType.ContextGroupName, false);
DicomUID.register(StentFinding3813);
/** 1.2.840.10008.6.1.273 Stent Composition (3814) */
export const StentComposition3814 = new DicomUID("1.2.840.10008.6.1.273", "Stent Composition (3814)", DicomUidType.ContextGroupName, false);
DicomUID.register(StentComposition3814);
/** 1.2.840.10008.6.1.274 Source of Vascular Finding (3815) */
export const SourceOfVascularFinding3815 = new DicomUID("1.2.840.10008.6.1.274", "Source of Vascular Finding (3815)", DicomUidType.ContextGroupName, false);
DicomUID.register(SourceOfVascularFinding3815);
/** 1.2.840.10008.6.1.275 Vascular Sclerosis Type (3817) */
export const VascularSclerosisType3817 = new DicomUID("1.2.840.10008.6.1.275", "Vascular Sclerosis Type (3817)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularSclerosisType3817);
/** 1.2.840.10008.6.1.276 Non-invasive Vascular Procedure (3820) */
export const NonInvasiveVascularProcedure3820 = new DicomUID("1.2.840.10008.6.1.276", "Non-invasive Vascular Procedure (3820)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonInvasiveVascularProcedure3820);
/** 1.2.840.10008.6.1.277 Papillary Muscle Included/Excluded (3821) */
export const PapillaryMuscleIncludedExcluded3821 = new DicomUID("1.2.840.10008.6.1.277", "Papillary Muscle Included/Excluded (3821)", DicomUidType.ContextGroupName, false);
DicomUID.register(PapillaryMuscleIncludedExcluded3821);
/** 1.2.840.10008.6.1.278 Respiratory Status (3823) */
export const RespiratoryStatus3823 = new DicomUID("1.2.840.10008.6.1.278", "Respiratory Status (3823)", DicomUidType.ContextGroupName, false);
DicomUID.register(RespiratoryStatus3823);
/** 1.2.840.10008.6.1.279 Heart Rhythm (3826) */
export const HeartRhythm3826 = new DicomUID("1.2.840.10008.6.1.279", "Heart Rhythm (3826)", DicomUidType.ContextGroupName, false);
DicomUID.register(HeartRhythm3826);
/** 1.2.840.10008.6.1.280 Vessel Segment (3827) */
export const VesselSegment3827 = new DicomUID("1.2.840.10008.6.1.280", "Vessel Segment (3827)", DicomUidType.ContextGroupName, false);
DicomUID.register(VesselSegment3827);
/** 1.2.840.10008.6.1.281 Pulmonary Artery (3829) */
export const PulmonaryArtery3829 = new DicomUID("1.2.840.10008.6.1.281", "Pulmonary Artery (3829)", DicomUidType.ContextGroupName, false);
DicomUID.register(PulmonaryArtery3829);
/** 1.2.840.10008.6.1.282 Stenosis Length (3831) */
export const StenosisLength3831 = new DicomUID("1.2.840.10008.6.1.282", "Stenosis Length (3831)", DicomUidType.ContextGroupName, false);
DicomUID.register(StenosisLength3831);
/** 1.2.840.10008.6.1.283 Stenosis Grade (3832) */
export const StenosisGrade3832 = new DicomUID("1.2.840.10008.6.1.283", "Stenosis Grade (3832)", DicomUidType.ContextGroupName, false);
DicomUID.register(StenosisGrade3832);
/** 1.2.840.10008.6.1.284 Cardiac Ejection Fraction (3833) */
export const CardiacEjectionFraction3833 = new DicomUID("1.2.840.10008.6.1.284", "Cardiac Ejection Fraction (3833)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacEjectionFraction3833);
/** 1.2.840.10008.6.1.285 Cardiac Volume Measurement (3835) */
export const CardiacVolumeMeasurement3835 = new DicomUID("1.2.840.10008.6.1.285", "Cardiac Volume Measurement (3835)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacVolumeMeasurement3835);
/** 1.2.840.10008.6.1.286 Time-based Perfusion Measurement (3836) */
export const TimeBasedPerfusionMeasurement3836 = new DicomUID("1.2.840.10008.6.1.286", "Time-based Perfusion Measurement (3836)", DicomUidType.ContextGroupName, false);
DicomUID.register(TimeBasedPerfusionMeasurement3836);
/** 1.2.840.10008.6.1.287 Fiducial Feature (3837) */
export const FiducialFeature3837 = new DicomUID("1.2.840.10008.6.1.287", "Fiducial Feature (3837)", DicomUidType.ContextGroupName, false);
DicomUID.register(FiducialFeature3837);
/** 1.2.840.10008.6.1.288 Diameter Derivation (3838) */
export const DiameterDerivation3838 = new DicomUID("1.2.840.10008.6.1.288", "Diameter Derivation (3838)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiameterDerivation3838);
/** 1.2.840.10008.6.1.289 Coronary Vein (3839) */
export const CoronaryVein3839 = new DicomUID("1.2.840.10008.6.1.289", "Coronary Vein (3839)", DicomUidType.ContextGroupName, false);
DicomUID.register(CoronaryVein3839);
/** 1.2.840.10008.6.1.290 Pulmonary Vein (3840) */
export const PulmonaryVein3840 = new DicomUID("1.2.840.10008.6.1.290", "Pulmonary Vein (3840)", DicomUidType.ContextGroupName, false);
DicomUID.register(PulmonaryVein3840);
/** 1.2.840.10008.6.1.291 Myocardial Subsegment (3843) */
export const MyocardialSubsegment3843 = new DicomUID("1.2.840.10008.6.1.291", "Myocardial Subsegment (3843)", DicomUidType.ContextGroupName, false);
DicomUID.register(MyocardialSubsegment3843);
/** 1.2.840.10008.6.1.292 Partial View Section for Mammography (4005) */
export const PartialViewSectionForMammography4005 = new DicomUID("1.2.840.10008.6.1.292", "Partial View Section for Mammography (4005)", DicomUidType.ContextGroupName, false);
DicomUID.register(PartialViewSectionForMammography4005);
/** 1.2.840.10008.6.1.293 DX Anatomy Imaged (4009) */
export const DXAnatomyImaged4009 = new DicomUID("1.2.840.10008.6.1.293", "DX Anatomy Imaged (4009)", DicomUidType.ContextGroupName, false);
DicomUID.register(DXAnatomyImaged4009);
/** 1.2.840.10008.6.1.294 DX View (4010) */
export const DXView4010 = new DicomUID("1.2.840.10008.6.1.294", "DX View (4010)", DicomUidType.ContextGroupName, false);
DicomUID.register(DXView4010);
/** 1.2.840.10008.6.1.295 DX View Modifier (4011) */
export const DXViewModifier4011 = new DicomUID("1.2.840.10008.6.1.295", "DX View Modifier (4011)", DicomUidType.ContextGroupName, false);
DicomUID.register(DXViewModifier4011);
/** 1.2.840.10008.6.1.296 Projection Eponymous Name (4012) */
export const ProjectionEponymousName4012 = new DicomUID("1.2.840.10008.6.1.296", "Projection Eponymous Name (4012)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProjectionEponymousName4012);
/** 1.2.840.10008.6.1.297 Anatomic Region for Mammography (4013) */
export const AnatomicRegionForMammography4013 = new DicomUID("1.2.840.10008.6.1.297", "Anatomic Region for Mammography (4013)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicRegionForMammography4013);
/** 1.2.840.10008.6.1.298 View for Mammography (4014) */
export const ViewForMammography4014 = new DicomUID("1.2.840.10008.6.1.298", "View for Mammography (4014)", DicomUidType.ContextGroupName, false);
DicomUID.register(ViewForMammography4014);
/** 1.2.840.10008.6.1.299 View Modifier for Mammography (4015) */
export const ViewModifierForMammography4015 = new DicomUID("1.2.840.10008.6.1.299", "View Modifier for Mammography (4015)", DicomUidType.ContextGroupName, false);
DicomUID.register(ViewModifierForMammography4015);
/** 1.2.840.10008.6.1.300 Anatomic Region for Intra-oral Radiography (4016) */
export const AnatomicRegionForIntraOralRadiography4016 = new DicomUID("1.2.840.10008.6.1.300", "Anatomic Region for Intra-oral Radiography (4016)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicRegionForIntraOralRadiography4016);
/** 1.2.840.10008.6.1.301 Anatomic Region Modifier for Intra-oral Radiography (4017) */
export const AnatomicRegionModifierForIntraOralRadiography4017 = new DicomUID("1.2.840.10008.6.1.301", "Anatomic Region Modifier for Intra-oral Radiography (4017)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicRegionModifierForIntraOralRadiography4017);
/** 1.2.840.10008.6.1.302 Primary Anatomic Structure for Intra-oral Radiography (Permanent Dentition - Designation of Teeth) (4018) */
export const PrimaryAnatomicStructureForIntraOralRadiographyPermanentDentitionDesignationOfTeeth4018 = new DicomUID("1.2.840.10008.6.1.302", "Primary Anatomic Structure for Intra-oral Radiography (Permanent Dentition - Designation of Teeth) (4018)", DicomUidType.ContextGroupName, false);
DicomUID.register(PrimaryAnatomicStructureForIntraOralRadiographyPermanentDentitionDesignationOfTeeth4018);
/** 1.2.840.10008.6.1.303 Primary Anatomic Structure for Intra-oral Radiography (Deciduous Dentition - Designation of Teeth) (4019) */
export const PrimaryAnatomicStructureForIntraOralRadiographyDeciduousDentitionDesignationOfTeeth4019 = new DicomUID("1.2.840.10008.6.1.303", "Primary Anatomic Structure for Intra-oral Radiography (Deciduous Dentition - Designation of Teeth) (4019)", DicomUidType.ContextGroupName, false);
DicomUID.register(PrimaryAnatomicStructureForIntraOralRadiographyDeciduousDentitionDesignationOfTeeth4019);
/** 1.2.840.10008.6.1.304 PET Radionuclide (4020) */
export const PETRadionuclide4020 = new DicomUID("1.2.840.10008.6.1.304", "PET Radionuclide (4020)", DicomUidType.ContextGroupName, false);
DicomUID.register(PETRadionuclide4020);
/** 1.2.840.10008.6.1.305 PET Radiopharmaceutical (4021) */
export const PETRadiopharmaceutical4021 = new DicomUID("1.2.840.10008.6.1.305", "PET Radiopharmaceutical (4021)", DicomUidType.ContextGroupName, false);
DicomUID.register(PETRadiopharmaceutical4021);
/** 1.2.840.10008.6.1.306 Craniofacial Anatomic Region (4028) */
export const CraniofacialAnatomicRegion4028 = new DicomUID("1.2.840.10008.6.1.306", "Craniofacial Anatomic Region (4028)", DicomUidType.ContextGroupName, false);
DicomUID.register(CraniofacialAnatomicRegion4028);
/** 1.2.840.10008.6.1.307 CT, MR and PET Anatomy Imaged (4030) */
export const CTMRAndPETAnatomyImaged4030 = new DicomUID("1.2.840.10008.6.1.307", "CT, MR and PET Anatomy Imaged (4030)", DicomUidType.ContextGroupName, false);
DicomUID.register(CTMRAndPETAnatomyImaged4030);
/** 1.2.840.10008.6.1.308 Common Anatomic Region (4031) */
export const CommonAnatomicRegion4031 = new DicomUID("1.2.840.10008.6.1.308", "Common Anatomic Region (4031)", DicomUidType.ContextGroupName, false);
DicomUID.register(CommonAnatomicRegion4031);
/** 1.2.840.10008.6.1.309 MR Spectroscopy Metabolite (4032) */
export const MRSpectroscopyMetabolite4032 = new DicomUID("1.2.840.10008.6.1.309", "MR Spectroscopy Metabolite (4032)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRSpectroscopyMetabolite4032);
/** 1.2.840.10008.6.1.310 MR Proton Spectroscopy Metabolite (4033) */
export const MRProtonSpectroscopyMetabolite4033 = new DicomUID("1.2.840.10008.6.1.310", "MR Proton Spectroscopy Metabolite (4033)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRProtonSpectroscopyMetabolite4033);
/** 1.2.840.10008.6.1.311 Endoscopy Anatomic Region (4040) */
export const EndoscopyAnatomicRegion4040 = new DicomUID("1.2.840.10008.6.1.311", "Endoscopy Anatomic Region (4040)", DicomUidType.ContextGroupName, false);
DicomUID.register(EndoscopyAnatomicRegion4040);
/** 1.2.840.10008.6.1.312 XA/XRF Anatomy Imaged (4042) */
export const XAXRFAnatomyImaged4042 = new DicomUID("1.2.840.10008.6.1.312", "XA/XRF Anatomy Imaged (4042)", DicomUidType.ContextGroupName, false);
DicomUID.register(XAXRFAnatomyImaged4042);
/** 1.2.840.10008.6.1.313 Drug or Contrast Agent Characteristic (4050) */
export const DrugOrContrastAgentCharacteristic4050 = new DicomUID("1.2.840.10008.6.1.313", "Drug or Contrast Agent Characteristic (4050)", DicomUidType.ContextGroupName, false);
DicomUID.register(DrugOrContrastAgentCharacteristic4050);
/** 1.2.840.10008.6.1.314 General Device (4051) */
export const GeneralDevice4051 = new DicomUID("1.2.840.10008.6.1.314", "General Device (4051)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralDevice4051);
/** 1.2.840.10008.6.1.315 Phantom Device (4052) */
export const PhantomDevice4052 = new DicomUID("1.2.840.10008.6.1.315", "Phantom Device (4052)", DicomUidType.ContextGroupName, false);
DicomUID.register(PhantomDevice4052);
/** 1.2.840.10008.6.1.316 Ophthalmic Imaging Agent (4200) */
export const OphthalmicImagingAgent4200 = new DicomUID("1.2.840.10008.6.1.316", "Ophthalmic Imaging Agent (4200)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicImagingAgent4200);
/** 1.2.840.10008.6.1.317 Patient Eye Movement Command (4201) */
export const PatientEyeMovementCommand4201 = new DicomUID("1.2.840.10008.6.1.317", "Patient Eye Movement Command (4201)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientEyeMovementCommand4201);
/** 1.2.840.10008.6.1.318 Ophthalmic Photography Acquisition Device (4202) */
export const OphthalmicPhotographyAcquisitionDevice4202 = new DicomUID("1.2.840.10008.6.1.318", "Ophthalmic Photography Acquisition Device (4202)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicPhotographyAcquisitionDevice4202);
/** 1.2.840.10008.6.1.319 Ophthalmic Photography Illumination (4203) */
export const OphthalmicPhotographyIllumination4203 = new DicomUID("1.2.840.10008.6.1.319", "Ophthalmic Photography Illumination (4203)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicPhotographyIllumination4203);
/** 1.2.840.10008.6.1.320 Ophthalmic Filter (4204) */
export const OphthalmicFilter4204 = new DicomUID("1.2.840.10008.6.1.320", "Ophthalmic Filter (4204)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicFilter4204);
/** 1.2.840.10008.6.1.321 Ophthalmic Lens (4205) */
export const OphthalmicLens4205 = new DicomUID("1.2.840.10008.6.1.321", "Ophthalmic Lens (4205)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicLens4205);
/** 1.2.840.10008.6.1.322 Ophthalmic Channel Description (4206) */
export const OphthalmicChannelDescription4206 = new DicomUID("1.2.840.10008.6.1.322", "Ophthalmic Channel Description (4206)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicChannelDescription4206);
/** 1.2.840.10008.6.1.323 Ophthalmic Image Position (4207) */
export const OphthalmicImagePosition4207 = new DicomUID("1.2.840.10008.6.1.323", "Ophthalmic Image Position (4207)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicImagePosition4207);
/** 1.2.840.10008.6.1.324 Mydriatic Agent (4208) */
export const MydriaticAgent4208 = new DicomUID("1.2.840.10008.6.1.324", "Mydriatic Agent (4208)", DicomUidType.ContextGroupName, false);
DicomUID.register(MydriaticAgent4208);
/** 1.2.840.10008.6.1.325 Ophthalmic Anatomic Structure Imaged (4209) */
export const OphthalmicAnatomicStructureImaged4209 = new DicomUID("1.2.840.10008.6.1.325", "Ophthalmic Anatomic Structure Imaged (4209)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicAnatomicStructureImaged4209);
/** 1.2.840.10008.6.1.326 Ophthalmic Tomography Acquisition Device (4210) */
export const OphthalmicTomographyAcquisitionDevice4210 = new DicomUID("1.2.840.10008.6.1.326", "Ophthalmic Tomography Acquisition Device (4210)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicTomographyAcquisitionDevice4210);
/** 1.2.840.10008.6.1.327 Ophthalmic OCT Anatomic Structure Imaged (4211) */
export const OphthalmicOCTAnatomicStructureImaged4211 = new DicomUID("1.2.840.10008.6.1.327", "Ophthalmic OCT Anatomic Structure Imaged (4211)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicOCTAnatomicStructureImaged4211);
/** 1.2.840.10008.6.1.328 Language (5000) */
export const Language5000 = new DicomUID("1.2.840.10008.6.1.328", "Language (5000)", DicomUidType.ContextGroupName, false);
DicomUID.register(Language5000);
/** 1.2.840.10008.6.1.329 Country (5001) */
export const Country5001 = new DicomUID("1.2.840.10008.6.1.329", "Country (5001)", DicomUidType.ContextGroupName, false);
DicomUID.register(Country5001);
/** 1.2.840.10008.6.1.330 Overall Breast Composition (6000) */
export const OverallBreastComposition6000 = new DicomUID("1.2.840.10008.6.1.330", "Overall Breast Composition (6000)", DicomUidType.ContextGroupName, false);
DicomUID.register(OverallBreastComposition6000);
/** 1.2.840.10008.6.1.331 Overall Breast Composition from BI-RADS® (6001) */
export const OverallBreastCompositionFromBIRADS6001 = new DicomUID("1.2.840.10008.6.1.331", "Overall Breast Composition from BI-RADS® (6001)", DicomUidType.ContextGroupName, false);
DicomUID.register(OverallBreastCompositionFromBIRADS6001);
/** 1.2.840.10008.6.1.332 Change Since Last Mammogram or Prior Surgery (6002) */
export const ChangeSinceLastMammogramOrPriorSurgery6002 = new DicomUID("1.2.840.10008.6.1.332", "Change Since Last Mammogram or Prior Surgery (6002)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChangeSinceLastMammogramOrPriorSurgery6002);
/** 1.2.840.10008.6.1.333 Change Since Last Mammogram or Prior Surgery from BI-RADS® (6003) */
export const ChangeSinceLastMammogramOrPriorSurgeryFromBIRADS6003 = new DicomUID("1.2.840.10008.6.1.333", "Change Since Last Mammogram or Prior Surgery from BI-RADS® (6003)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChangeSinceLastMammogramOrPriorSurgeryFromBIRADS6003);
/** 1.2.840.10008.6.1.334 Mammography Shape Characteristic (6004) */
export const MammographyShapeCharacteristic6004 = new DicomUID("1.2.840.10008.6.1.334", "Mammography Shape Characteristic (6004)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyShapeCharacteristic6004);
/** 1.2.840.10008.6.1.335 Shape Characteristic from BI-RADS® (6005) */
export const ShapeCharacteristicFromBIRADS6005 = new DicomUID("1.2.840.10008.6.1.335", "Shape Characteristic from BI-RADS® (6005)", DicomUidType.ContextGroupName, false);
DicomUID.register(ShapeCharacteristicFromBIRADS6005);
/** 1.2.840.10008.6.1.336 Mammography Margin Characteristic (6006) */
export const MammographyMarginCharacteristic6006 = new DicomUID("1.2.840.10008.6.1.336", "Mammography Margin Characteristic (6006)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyMarginCharacteristic6006);
/** 1.2.840.10008.6.1.337 Margin Characteristic from BI-RADS® (6007) */
export const MarginCharacteristicFromBIRADS6007 = new DicomUID("1.2.840.10008.6.1.337", "Margin Characteristic from BI-RADS® (6007)", DicomUidType.ContextGroupName, false);
DicomUID.register(MarginCharacteristicFromBIRADS6007);
/** 1.2.840.10008.6.1.338 Density Modifier (6008) */
export const DensityModifier6008 = new DicomUID("1.2.840.10008.6.1.338", "Density Modifier (6008)", DicomUidType.ContextGroupName, false);
DicomUID.register(DensityModifier6008);
/** 1.2.840.10008.6.1.339 Density Modifier from BI-RADS® (6009) */
export const DensityModifierFromBIRADS6009 = new DicomUID("1.2.840.10008.6.1.339", "Density Modifier from BI-RADS® (6009)", DicomUidType.ContextGroupName, false);
DicomUID.register(DensityModifierFromBIRADS6009);
/** 1.2.840.10008.6.1.340 Mammography Calcification Type (6010) */
export const MammographyCalcificationType6010 = new DicomUID("1.2.840.10008.6.1.340", "Mammography Calcification Type (6010)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyCalcificationType6010);
/** 1.2.840.10008.6.1.341 Calcification Type from BI-RADS® (6011) */
export const CalcificationTypeFromBIRADS6011 = new DicomUID("1.2.840.10008.6.1.341", "Calcification Type from BI-RADS® (6011)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalcificationTypeFromBIRADS6011);
/** 1.2.840.10008.6.1.342 Calcification Distribution Modifier (6012) */
export const CalcificationDistributionModifier6012 = new DicomUID("1.2.840.10008.6.1.342", "Calcification Distribution Modifier (6012)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalcificationDistributionModifier6012);
/** 1.2.840.10008.6.1.343 Calcification Distribution Modifier from BI-RADS® (6013) */
export const CalcificationDistributionModifierFromBIRADS6013 = new DicomUID("1.2.840.10008.6.1.343", "Calcification Distribution Modifier from BI-RADS® (6013)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalcificationDistributionModifierFromBIRADS6013);
/** 1.2.840.10008.6.1.344 Mammography Single Image Finding (6014) */
export const MammographySingleImageFinding6014 = new DicomUID("1.2.840.10008.6.1.344", "Mammography Single Image Finding (6014)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographySingleImageFinding6014);
/** 1.2.840.10008.6.1.345 Single Image Finding from BI-RADS® (6015) */
export const SingleImageFindingFromBIRADS6015 = new DicomUID("1.2.840.10008.6.1.345", "Single Image Finding from BI-RADS® (6015)", DicomUidType.ContextGroupName, false);
DicomUID.register(SingleImageFindingFromBIRADS6015);
/** 1.2.840.10008.6.1.346 Mammography Composite Feature (6016) */
export const MammographyCompositeFeature6016 = new DicomUID("1.2.840.10008.6.1.346", "Mammography Composite Feature (6016)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyCompositeFeature6016);
/** 1.2.840.10008.6.1.347 Composite Feature from BI-RADS® (6017) */
export const CompositeFeatureFromBIRADS6017 = new DicomUID("1.2.840.10008.6.1.347", "Composite Feature from BI-RADS® (6017)", DicomUidType.ContextGroupName, false);
DicomUID.register(CompositeFeatureFromBIRADS6017);
/** 1.2.840.10008.6.1.348 Clockface Location or Region (6018) */
export const ClockfaceLocationOrRegion6018 = new DicomUID("1.2.840.10008.6.1.348", "Clockface Location or Region (6018)", DicomUidType.ContextGroupName, false);
DicomUID.register(ClockfaceLocationOrRegion6018);
/** 1.2.840.10008.6.1.349 Clockface Location or Region from BI-RADS® (6019) */
export const ClockfaceLocationOrRegionFromBIRADS6019 = new DicomUID("1.2.840.10008.6.1.349", "Clockface Location or Region from BI-RADS® (6019)", DicomUidType.ContextGroupName, false);
DicomUID.register(ClockfaceLocationOrRegionFromBIRADS6019);
/** 1.2.840.10008.6.1.350 Quadrant Location (6020) */
export const QuadrantLocation6020 = new DicomUID("1.2.840.10008.6.1.350", "Quadrant Location (6020)", DicomUidType.ContextGroupName, false);
DicomUID.register(QuadrantLocation6020);
/** 1.2.840.10008.6.1.351 Quadrant Location from BI-RADS® (6021) */
export const QuadrantLocationFromBIRADS6021 = new DicomUID("1.2.840.10008.6.1.351", "Quadrant Location from BI-RADS® (6021)", DicomUidType.ContextGroupName, false);
DicomUID.register(QuadrantLocationFromBIRADS6021);
/** 1.2.840.10008.6.1.352 Side (6022) */
export const Side6022 = new DicomUID("1.2.840.10008.6.1.352", "Side (6022)", DicomUidType.ContextGroupName, false);
DicomUID.register(Side6022);
/** 1.2.840.10008.6.1.353 Side from BI-RADS® (6023) */
export const SideFromBIRADS6023 = new DicomUID("1.2.840.10008.6.1.353", "Side from BI-RADS® (6023)", DicomUidType.ContextGroupName, false);
DicomUID.register(SideFromBIRADS6023);
/** 1.2.840.10008.6.1.354 Depth (6024) */
export const Depth6024 = new DicomUID("1.2.840.10008.6.1.354", "Depth (6024)", DicomUidType.ContextGroupName, false);
DicomUID.register(Depth6024);
/** 1.2.840.10008.6.1.355 Depth from BI-RADS® (6025) */
export const DepthFromBIRADS6025 = new DicomUID("1.2.840.10008.6.1.355", "Depth from BI-RADS® (6025)", DicomUidType.ContextGroupName, false);
DicomUID.register(DepthFromBIRADS6025);
/** 1.2.840.10008.6.1.356 Mammography Assessment (6026) */
export const MammographyAssessment6026 = new DicomUID("1.2.840.10008.6.1.356", "Mammography Assessment (6026)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyAssessment6026);
/** 1.2.840.10008.6.1.357 Assessment from BI-RADS® (6027) */
export const AssessmentFromBIRADS6027 = new DicomUID("1.2.840.10008.6.1.357", "Assessment from BI-RADS® (6027)", DicomUidType.ContextGroupName, false);
DicomUID.register(AssessmentFromBIRADS6027);
/** 1.2.840.10008.6.1.358 Mammography Recommended Follow-up (6028) */
export const MammographyRecommendedFollowUp6028 = new DicomUID("1.2.840.10008.6.1.358", "Mammography Recommended Follow-up (6028)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyRecommendedFollowUp6028);
/** 1.2.840.10008.6.1.359 Recommended Follow-up from BI-RADS® (6029) */
export const RecommendedFollowUpFromBIRADS6029 = new DicomUID("1.2.840.10008.6.1.359", "Recommended Follow-up from BI-RADS® (6029)", DicomUidType.ContextGroupName, false);
DicomUID.register(RecommendedFollowUpFromBIRADS6029);
/** 1.2.840.10008.6.1.360 Mammography Pathology Code (6030) */
export const MammographyPathologyCode6030 = new DicomUID("1.2.840.10008.6.1.360", "Mammography Pathology Code (6030)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyPathologyCode6030);
/** 1.2.840.10008.6.1.361 Benign Pathology Code from BI-RADS® (6031) */
export const BenignPathologyCodeFromBIRADS6031 = new DicomUID("1.2.840.10008.6.1.361", "Benign Pathology Code from BI-RADS® (6031)", DicomUidType.ContextGroupName, false);
DicomUID.register(BenignPathologyCodeFromBIRADS6031);
/** 1.2.840.10008.6.1.362 High Risk Lesion Pathology Code from BI-RADS® (6032) */
export const HighRiskLesionPathologyCodeFromBIRADS6032 = new DicomUID("1.2.840.10008.6.1.362", "High Risk Lesion Pathology Code from BI-RADS® (6032)", DicomUidType.ContextGroupName, false);
DicomUID.register(HighRiskLesionPathologyCodeFromBIRADS6032);
/** 1.2.840.10008.6.1.363 Malignant Pathology Code from BI-RADS® (6033) */
export const MalignantPathologyCodeFromBIRADS6033 = new DicomUID("1.2.840.10008.6.1.363", "Malignant Pathology Code from BI-RADS® (6033)", DicomUidType.ContextGroupName, false);
DicomUID.register(MalignantPathologyCodeFromBIRADS6033);
/** 1.2.840.10008.6.1.364 CAD Output Intended Use (6034) */
export const CADOutputIntendedUse6034 = new DicomUID("1.2.840.10008.6.1.364", "CAD Output Intended Use (6034)", DicomUidType.ContextGroupName, false);
DicomUID.register(CADOutputIntendedUse6034);
/** 1.2.840.10008.6.1.365 Composite Feature Relation (6035) */
export const CompositeFeatureRelation6035 = new DicomUID("1.2.840.10008.6.1.365", "Composite Feature Relation (6035)", DicomUidType.ContextGroupName, false);
DicomUID.register(CompositeFeatureRelation6035);
/** 1.2.840.10008.6.1.366 Feature Scope (6036) */
export const FeatureScope6036 = new DicomUID("1.2.840.10008.6.1.366", "Feature Scope (6036)", DicomUidType.ContextGroupName, false);
DicomUID.register(FeatureScope6036);
/** 1.2.840.10008.6.1.367 Mammography Quantitative Temporal Difference Type (6037) */
export const MammographyQuantitativeTemporalDifferenceType6037 = new DicomUID("1.2.840.10008.6.1.367", "Mammography Quantitative Temporal Difference Type (6037)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyQuantitativeTemporalDifferenceType6037);
/** 1.2.840.10008.6.1.368 Mammography Qualitative Temporal Difference Type (6038) */
export const MammographyQualitativeTemporalDifferenceType6038 = new DicomUID("1.2.840.10008.6.1.368", "Mammography Qualitative Temporal Difference Type (6038)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyQualitativeTemporalDifferenceType6038);
/** 1.2.840.10008.6.1.369 Nipple Characteristic (6039) */
export const NippleCharacteristic6039 = new DicomUID("1.2.840.10008.6.1.369", "Nipple Characteristic (6039)", DicomUidType.ContextGroupName, false);
DicomUID.register(NippleCharacteristic6039);
/** 1.2.840.10008.6.1.370 Non-lesion Object Type (6040) */
export const NonLesionObjectType6040 = new DicomUID("1.2.840.10008.6.1.370", "Non-lesion Object Type (6040)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonLesionObjectType6040);
/** 1.2.840.10008.6.1.371 Mammography Image Quality Finding (6041) */
export const MammographyImageQualityFinding6041 = new DicomUID("1.2.840.10008.6.1.371", "Mammography Image Quality Finding (6041)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyImageQualityFinding6041);
/** 1.2.840.10008.6.1.372 Result Status (6042) */
export const ResultStatus6042 = new DicomUID("1.2.840.10008.6.1.372", "Result Status (6042)", DicomUidType.ContextGroupName, false);
DicomUID.register(ResultStatus6042);
/** 1.2.840.10008.6.1.373 Mammography CAD Analysis Type (6043) */
export const MammographyCADAnalysisType6043 = new DicomUID("1.2.840.10008.6.1.373", "Mammography CAD Analysis Type (6043)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyCADAnalysisType6043);
/** 1.2.840.10008.6.1.374 Image Quality Assessment Type (6044) */
export const ImageQualityAssessmentType6044 = new DicomUID("1.2.840.10008.6.1.374", "Image Quality Assessment Type (6044)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImageQualityAssessmentType6044);
/** 1.2.840.10008.6.1.375 Mammography Quality Control Standard Type (6045) */
export const MammographyQualityControlStandardType6045 = new DicomUID("1.2.840.10008.6.1.375", "Mammography Quality Control Standard Type (6045)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammographyQualityControlStandardType6045);
/** 1.2.840.10008.6.1.376 Follow-up Interval Unit (6046) */
export const FollowUpIntervalUnit6046 = new DicomUID("1.2.840.10008.6.1.376", "Follow-up Interval Unit (6046)", DicomUidType.ContextGroupName, false);
DicomUID.register(FollowUpIntervalUnit6046);
/** 1.2.840.10008.6.1.377 CAD Processing and Finding Summary (6047) */
export const CADProcessingAndFindingSummary6047 = new DicomUID("1.2.840.10008.6.1.377", "CAD Processing and Finding Summary (6047)", DicomUidType.ContextGroupName, false);
DicomUID.register(CADProcessingAndFindingSummary6047);
/** 1.2.840.10008.6.1.378 CAD Operating Point Axis Label (6048) */
export const CADOperatingPointAxisLabel6048 = new DicomUID("1.2.840.10008.6.1.378", "CAD Operating Point Axis Label (6048)", DicomUidType.ContextGroupName, false);
DicomUID.register(CADOperatingPointAxisLabel6048);
/** 1.2.840.10008.6.1.379 Breast Procedure Reported (6050) */
export const BreastProcedureReported6050 = new DicomUID("1.2.840.10008.6.1.379", "Breast Procedure Reported (6050)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastProcedureReported6050);
/** 1.2.840.10008.6.1.380 Breast Procedure Reason (6051) */
export const BreastProcedureReason6051 = new DicomUID("1.2.840.10008.6.1.380", "Breast Procedure Reason (6051)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastProcedureReason6051);
/** 1.2.840.10008.6.1.381 Breast Imaging Report Section Title (6052) */
export const BreastImagingReportSectionTitle6052 = new DicomUID("1.2.840.10008.6.1.381", "Breast Imaging Report Section Title (6052)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastImagingReportSectionTitle6052);
/** 1.2.840.10008.6.1.382 Breast Imaging Report Element (6053) */
export const BreastImagingReportElement6053 = new DicomUID("1.2.840.10008.6.1.382", "Breast Imaging Report Element (6053)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastImagingReportElement6053);
/** 1.2.840.10008.6.1.383 Breast Imaging Finding (6054) */
export const BreastImagingFinding6054 = new DicomUID("1.2.840.10008.6.1.383", "Breast Imaging Finding (6054)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastImagingFinding6054);
/** 1.2.840.10008.6.1.384 Breast Clinical Finding or Indicated Problem (6055) */
export const BreastClinicalFindingOrIndicatedProblem6055 = new DicomUID("1.2.840.10008.6.1.384", "Breast Clinical Finding or Indicated Problem (6055)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastClinicalFindingOrIndicatedProblem6055);
/** 1.2.840.10008.6.1.385 Associated Finding for Breast (6056) */
export const AssociatedFindingForBreast6056 = new DicomUID("1.2.840.10008.6.1.385", "Associated Finding for Breast (6056)", DicomUidType.ContextGroupName, false);
DicomUID.register(AssociatedFindingForBreast6056);
/** 1.2.840.10008.6.1.386 Ductography Finding for Breast (6057) */
export const DuctographyFindingForBreast6057 = new DicomUID("1.2.840.10008.6.1.386", "Ductography Finding for Breast (6057)", DicomUidType.ContextGroupName, false);
DicomUID.register(DuctographyFindingForBreast6057);
/** 1.2.840.10008.6.1.387 Procedure Modifiers for Breast (6058) */
export const ProcedureModifiersForBreast6058 = new DicomUID("1.2.840.10008.6.1.387", "Procedure Modifiers for Breast (6058)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProcedureModifiersForBreast6058);
/** 1.2.840.10008.6.1.388 Breast Implant Type (6059) */
export const BreastImplantType6059 = new DicomUID("1.2.840.10008.6.1.388", "Breast Implant Type (6059)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastImplantType6059);
/** 1.2.840.10008.6.1.389 Breast Biopsy Technique (6060) */
export const BreastBiopsyTechnique6060 = new DicomUID("1.2.840.10008.6.1.389", "Breast Biopsy Technique (6060)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastBiopsyTechnique6060);
/** 1.2.840.10008.6.1.390 Breast Imaging Procedure Modifier (6061) */
export const BreastImagingProcedureModifier6061 = new DicomUID("1.2.840.10008.6.1.390", "Breast Imaging Procedure Modifier (6061)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastImagingProcedureModifier6061);
/** 1.2.840.10008.6.1.391 Interventional Procedure Complication (6062) */
export const InterventionalProcedureComplication6062 = new DicomUID("1.2.840.10008.6.1.391", "Interventional Procedure Complication (6062)", DicomUidType.ContextGroupName, false);
DicomUID.register(InterventionalProcedureComplication6062);
/** 1.2.840.10008.6.1.392 Interventional Procedure Result (6063) */
export const InterventionalProcedureResult6063 = new DicomUID("1.2.840.10008.6.1.392", "Interventional Procedure Result (6063)", DicomUidType.ContextGroupName, false);
DicomUID.register(InterventionalProcedureResult6063);
/** 1.2.840.10008.6.1.393 Ultrasound Finding for Breast (6064) */
export const UltrasoundFindingForBreast6064 = new DicomUID("1.2.840.10008.6.1.393", "Ultrasound Finding for Breast (6064)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundFindingForBreast6064);
/** 1.2.840.10008.6.1.394 Instrument Approach (6065) */
export const InstrumentApproach6065 = new DicomUID("1.2.840.10008.6.1.394", "Instrument Approach (6065)", DicomUidType.ContextGroupName, false);
DicomUID.register(InstrumentApproach6065);
/** 1.2.840.10008.6.1.395 Target Confirmation (6066) */
export const TargetConfirmation6066 = new DicomUID("1.2.840.10008.6.1.395", "Target Confirmation (6066)", DicomUidType.ContextGroupName, false);
DicomUID.register(TargetConfirmation6066);
/** 1.2.840.10008.6.1.396 Fluid Color (6067) */
export const FluidColor6067 = new DicomUID("1.2.840.10008.6.1.396", "Fluid Color (6067)", DicomUidType.ContextGroupName, false);
DicomUID.register(FluidColor6067);
/** 1.2.840.10008.6.1.397 Tumor Stages From AJCC (6068) */
export const TumorStagesFromAJCC6068 = new DicomUID("1.2.840.10008.6.1.397", "Tumor Stages From AJCC (6068)", DicomUidType.ContextGroupName, false);
DicomUID.register(TumorStagesFromAJCC6068);
/** 1.2.840.10008.6.1.398 Nottingham Combined Histologic Grade (6069) */
export const NottinghamCombinedHistologicGrade6069 = new DicomUID("1.2.840.10008.6.1.398", "Nottingham Combined Histologic Grade (6069)", DicomUidType.ContextGroupName, false);
DicomUID.register(NottinghamCombinedHistologicGrade6069);
/** 1.2.840.10008.6.1.399 Bloom-Richardson Histologic Grade (6070) */
export const BloomRichardsonHistologicGrade6070 = new DicomUID("1.2.840.10008.6.1.399", "Bloom-Richardson Histologic Grade (6070)", DicomUidType.ContextGroupName, false);
DicomUID.register(BloomRichardsonHistologicGrade6070);
/** 1.2.840.10008.6.1.400 Histologic Grading Method (6071) */
export const HistologicGradingMethod6071 = new DicomUID("1.2.840.10008.6.1.400", "Histologic Grading Method (6071)", DicomUidType.ContextGroupName, false);
DicomUID.register(HistologicGradingMethod6071);
/** 1.2.840.10008.6.1.401 Breast Implant Finding (6072) */
export const BreastImplantFinding6072 = new DicomUID("1.2.840.10008.6.1.401", "Breast Implant Finding (6072)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastImplantFinding6072);
/** 1.2.840.10008.6.1.402 Gynecological Hormone (6080) */
export const GynecologicalHormone6080 = new DicomUID("1.2.840.10008.6.1.402", "Gynecological Hormone (6080)", DicomUidType.ContextGroupName, false);
DicomUID.register(GynecologicalHormone6080);
/** 1.2.840.10008.6.1.403 Breast Cancer Risk Factor (6081) */
export const BreastCancerRiskFactor6081 = new DicomUID("1.2.840.10008.6.1.403", "Breast Cancer Risk Factor (6081)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastCancerRiskFactor6081);
/** 1.2.840.10008.6.1.404 Gynecological Procedure (6082) */
export const GynecologicalProcedure6082 = new DicomUID("1.2.840.10008.6.1.404", "Gynecological Procedure (6082)", DicomUidType.ContextGroupName, false);
DicomUID.register(GynecologicalProcedure6082);
/** 1.2.840.10008.6.1.405 Procedures for Breast (6083) */
export const ProceduresForBreast6083 = new DicomUID("1.2.840.10008.6.1.405", "Procedures for Breast (6083)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProceduresForBreast6083);
/** 1.2.840.10008.6.1.406 Mammoplasty Procedure (6084) */
export const MammoplastyProcedure6084 = new DicomUID("1.2.840.10008.6.1.406", "Mammoplasty Procedure (6084)", DicomUidType.ContextGroupName, false);
DicomUID.register(MammoplastyProcedure6084);
/** 1.2.840.10008.6.1.407 Therapies for Breast (6085) */
export const TherapiesForBreast6085 = new DicomUID("1.2.840.10008.6.1.407", "Therapies for Breast (6085)", DicomUidType.ContextGroupName, false);
DicomUID.register(TherapiesForBreast6085);
/** 1.2.840.10008.6.1.408 Menopausal Phase (6086) */
export const MenopausalPhase6086 = new DicomUID("1.2.840.10008.6.1.408", "Menopausal Phase (6086)", DicomUidType.ContextGroupName, false);
DicomUID.register(MenopausalPhase6086);
/** 1.2.840.10008.6.1.409 General Risk Factor (6087) */
export const GeneralRiskFactor6087 = new DicomUID("1.2.840.10008.6.1.409", "General Risk Factor (6087)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralRiskFactor6087);
/** 1.2.840.10008.6.1.410 OB-GYN Maternal Risk Factor (6088) */
export const OBGYNMaternalRiskFactor6088 = new DicomUID("1.2.840.10008.6.1.410", "OB-GYN Maternal Risk Factor (6088)", DicomUidType.ContextGroupName, false);
DicomUID.register(OBGYNMaternalRiskFactor6088);
/** 1.2.840.10008.6.1.411 Substance (6089) */
export const Substance6089 = new DicomUID("1.2.840.10008.6.1.411", "Substance (6089)", DicomUidType.ContextGroupName, false);
DicomUID.register(Substance6089);
/** 1.2.840.10008.6.1.412 Relative Usage/Exposure Amount (6090) */
export const RelativeUsageExposureAmount6090 = new DicomUID("1.2.840.10008.6.1.412", "Relative Usage/Exposure Amount (6090)", DicomUidType.ContextGroupName, false);
DicomUID.register(RelativeUsageExposureAmount6090);
/** 1.2.840.10008.6.1.413 Relative Frequency of Event Value (6091) */
export const RelativeFrequencyOfEventValue6091 = new DicomUID("1.2.840.10008.6.1.413", "Relative Frequency of Event Value (6091)", DicomUidType.ContextGroupName, false);
DicomUID.register(RelativeFrequencyOfEventValue6091);
/** 1.2.840.10008.6.1.414 Usage/Exposure Qualitative Concept (6092) */
export const UsageExposureQualitativeConcept6092 = new DicomUID("1.2.840.10008.6.1.414", "Usage/Exposure Qualitative Concept (6092)", DicomUidType.ContextGroupName, false);
DicomUID.register(UsageExposureQualitativeConcept6092);
/** 1.2.840.10008.6.1.415 Usage/Exposure/Amount Qualitative Concept (6093) */
export const UsageExposureAmountQualitativeConcept6093 = new DicomUID("1.2.840.10008.6.1.415", "Usage/Exposure/Amount Qualitative Concept (6093)", DicomUidType.ContextGroupName, false);
DicomUID.register(UsageExposureAmountQualitativeConcept6093);
/** 1.2.840.10008.6.1.416 Usage/Exposure/Frequency Qualitative Concept (6094) */
export const UsageExposureFrequencyQualitativeConcept6094 = new DicomUID("1.2.840.10008.6.1.416", "Usage/Exposure/Frequency Qualitative Concept (6094)", DicomUidType.ContextGroupName, false);
DicomUID.register(UsageExposureFrequencyQualitativeConcept6094);
/** 1.2.840.10008.6.1.417 Procedure Numeric Property (6095) */
export const ProcedureNumericProperty6095 = new DicomUID("1.2.840.10008.6.1.417", "Procedure Numeric Property (6095)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProcedureNumericProperty6095);
/** 1.2.840.10008.6.1.418 Pregnancy Status (6096) */
export const PregnancyStatus6096 = new DicomUID("1.2.840.10008.6.1.418", "Pregnancy Status (6096)", DicomUidType.ContextGroupName, false);
DicomUID.register(PregnancyStatus6096);
/** 1.2.840.10008.6.1.419 Side of Family (6097) */
export const SideOfFamily6097 = new DicomUID("1.2.840.10008.6.1.419", "Side of Family (6097)", DicomUidType.ContextGroupName, false);
DicomUID.register(SideOfFamily6097);
/** 1.2.840.10008.6.1.420 Chest Component Category (6100) */
export const ChestComponentCategory6100 = new DicomUID("1.2.840.10008.6.1.420", "Chest Component Category (6100)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestComponentCategory6100);
/** 1.2.840.10008.6.1.421 Chest Finding or Feature (6101) */
export const ChestFindingOrFeature6101 = new DicomUID("1.2.840.10008.6.1.421", "Chest Finding or Feature (6101)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestFindingOrFeature6101);
/** 1.2.840.10008.6.1.422 Chest Finding or Feature Modifier (6102) */
export const ChestFindingOrFeatureModifier6102 = new DicomUID("1.2.840.10008.6.1.422", "Chest Finding or Feature Modifier (6102)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestFindingOrFeatureModifier6102);
/** 1.2.840.10008.6.1.423 Abnormal Lines Finding or Feature (6103) */
export const AbnormalLinesFindingOrFeature6103 = new DicomUID("1.2.840.10008.6.1.423", "Abnormal Lines Finding or Feature (6103)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbnormalLinesFindingOrFeature6103);
/** 1.2.840.10008.6.1.424 Abnormal Opacity Finding or Feature (6104) */
export const AbnormalOpacityFindingOrFeature6104 = new DicomUID("1.2.840.10008.6.1.424", "Abnormal Opacity Finding or Feature (6104)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbnormalOpacityFindingOrFeature6104);
/** 1.2.840.10008.6.1.425 Abnormal Lucency Finding or Feature (6105) */
export const AbnormalLucencyFindingOrFeature6105 = new DicomUID("1.2.840.10008.6.1.425", "Abnormal Lucency Finding or Feature (6105)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbnormalLucencyFindingOrFeature6105);
/** 1.2.840.10008.6.1.426 Abnormal Texture Finding or Feature (6106) */
export const AbnormalTextureFindingOrFeature6106 = new DicomUID("1.2.840.10008.6.1.426", "Abnormal Texture Finding or Feature (6106)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbnormalTextureFindingOrFeature6106);
/** 1.2.840.10008.6.1.427 Width Descriptor (6107) */
export const WidthDescriptor6107 = new DicomUID("1.2.840.10008.6.1.427", "Width Descriptor (6107)", DicomUidType.ContextGroupName, false);
DicomUID.register(WidthDescriptor6107);
/** 1.2.840.10008.6.1.428 Chest Anatomic Structure Abnormal Distribution (6108) */
export const ChestAnatomicStructureAbnormalDistribution6108 = new DicomUID("1.2.840.10008.6.1.428", "Chest Anatomic Structure Abnormal Distribution (6108)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestAnatomicStructureAbnormalDistribution6108);
/** 1.2.840.10008.6.1.429 Radiographic Anatomy Finding or Feature (6109) */
export const RadiographicAnatomyFindingOrFeature6109 = new DicomUID("1.2.840.10008.6.1.429", "Radiographic Anatomy Finding or Feature (6109)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiographicAnatomyFindingOrFeature6109);
/** 1.2.840.10008.6.1.430 Lung Anatomy Finding or Feature (6110) */
export const LungAnatomyFindingOrFeature6110 = new DicomUID("1.2.840.10008.6.1.430", "Lung Anatomy Finding or Feature (6110)", DicomUidType.ContextGroupName, false);
DicomUID.register(LungAnatomyFindingOrFeature6110);
/** 1.2.840.10008.6.1.431 Bronchovascular Anatomy Finding or Feature (6111) */
export const BronchovascularAnatomyFindingOrFeature6111 = new DicomUID("1.2.840.10008.6.1.431", "Bronchovascular Anatomy Finding or Feature (6111)", DicomUidType.ContextGroupName, false);
DicomUID.register(BronchovascularAnatomyFindingOrFeature6111);
/** 1.2.840.10008.6.1.432 Pleura Anatomy Finding or Feature (6112) */
export const PleuraAnatomyFindingOrFeature6112 = new DicomUID("1.2.840.10008.6.1.432", "Pleura Anatomy Finding or Feature (6112)", DicomUidType.ContextGroupName, false);
DicomUID.register(PleuraAnatomyFindingOrFeature6112);
/** 1.2.840.10008.6.1.433 Mediastinum Anatomy Finding or Feature (6113) */
export const MediastinumAnatomyFindingOrFeature6113 = new DicomUID("1.2.840.10008.6.1.433", "Mediastinum Anatomy Finding or Feature (6113)", DicomUidType.ContextGroupName, false);
DicomUID.register(MediastinumAnatomyFindingOrFeature6113);
/** 1.2.840.10008.6.1.434 Osseous Anatomy Finding or Feature (6114) */
export const OsseousAnatomyFindingOrFeature6114 = new DicomUID("1.2.840.10008.6.1.434", "Osseous Anatomy Finding or Feature (6114)", DicomUidType.ContextGroupName, false);
DicomUID.register(OsseousAnatomyFindingOrFeature6114);
/** 1.2.840.10008.6.1.435 Osseous Anatomy Modifier (6115) */
export const OsseousAnatomyModifier6115 = new DicomUID("1.2.840.10008.6.1.435", "Osseous Anatomy Modifier (6115)", DicomUidType.ContextGroupName, false);
DicomUID.register(OsseousAnatomyModifier6115);
/** 1.2.840.10008.6.1.436 Muscular Anatomy (6116) */
export const MuscularAnatomy6116 = new DicomUID("1.2.840.10008.6.1.436", "Muscular Anatomy (6116)", DicomUidType.ContextGroupName, false);
DicomUID.register(MuscularAnatomy6116);
/** 1.2.840.10008.6.1.437 Vascular Anatomy (6117) */
export const VascularAnatomy6117 = new DicomUID("1.2.840.10008.6.1.437", "Vascular Anatomy (6117)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularAnatomy6117);
/** 1.2.840.10008.6.1.438 Size Descriptor (6118) */
export const SizeDescriptor6118 = new DicomUID("1.2.840.10008.6.1.438", "Size Descriptor (6118)", DicomUidType.ContextGroupName, false);
DicomUID.register(SizeDescriptor6118);
/** 1.2.840.10008.6.1.439 Chest Border Shape (6119) */
export const ChestBorderShape6119 = new DicomUID("1.2.840.10008.6.1.439", "Chest Border Shape (6119)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestBorderShape6119);
/** 1.2.840.10008.6.1.440 Chest Border Definition (6120) */
export const ChestBorderDefinition6120 = new DicomUID("1.2.840.10008.6.1.440", "Chest Border Definition (6120)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestBorderDefinition6120);
/** 1.2.840.10008.6.1.441 Chest Orientation Descriptor (6121) */
export const ChestOrientationDescriptor6121 = new DicomUID("1.2.840.10008.6.1.441", "Chest Orientation Descriptor (6121)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestOrientationDescriptor6121);
/** 1.2.840.10008.6.1.442 Chest Content Descriptor (6122) */
export const ChestContentDescriptor6122 = new DicomUID("1.2.840.10008.6.1.442", "Chest Content Descriptor (6122)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestContentDescriptor6122);
/** 1.2.840.10008.6.1.443 Chest Opacity Descriptor (6123) */
export const ChestOpacityDescriptor6123 = new DicomUID("1.2.840.10008.6.1.443", "Chest Opacity Descriptor (6123)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestOpacityDescriptor6123);
/** 1.2.840.10008.6.1.444 Location in Chest (6124) */
export const LocationInChest6124 = new DicomUID("1.2.840.10008.6.1.444", "Location in Chest (6124)", DicomUidType.ContextGroupName, false);
DicomUID.register(LocationInChest6124);
/** 1.2.840.10008.6.1.445 General Chest Location (6125) */
export const GeneralChestLocation6125 = new DicomUID("1.2.840.10008.6.1.445", "General Chest Location (6125)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralChestLocation6125);
/** 1.2.840.10008.6.1.446 Location in Lung (6126) */
export const LocationInLung6126 = new DicomUID("1.2.840.10008.6.1.446", "Location in Lung (6126)", DicomUidType.ContextGroupName, false);
DicomUID.register(LocationInLung6126);
/** 1.2.840.10008.6.1.447 Segment Location in Lung (6127) */
export const SegmentLocationInLung6127 = new DicomUID("1.2.840.10008.6.1.447", "Segment Location in Lung (6127)", DicomUidType.ContextGroupName, false);
DicomUID.register(SegmentLocationInLung6127);
/** 1.2.840.10008.6.1.448 Chest Distribution Descriptor (6128) */
export const ChestDistributionDescriptor6128 = new DicomUID("1.2.840.10008.6.1.448", "Chest Distribution Descriptor (6128)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestDistributionDescriptor6128);
/** 1.2.840.10008.6.1.449 Chest Site Involvement (6129) */
export const ChestSiteInvolvement6129 = new DicomUID("1.2.840.10008.6.1.449", "Chest Site Involvement (6129)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestSiteInvolvement6129);
/** 1.2.840.10008.6.1.450 Severity Descriptor (6130) */
export const SeverityDescriptor6130 = new DicomUID("1.2.840.10008.6.1.450", "Severity Descriptor (6130)", DicomUidType.ContextGroupName, false);
DicomUID.register(SeverityDescriptor6130);
/** 1.2.840.10008.6.1.451 Chest Texture Descriptor (6131) */
export const ChestTextureDescriptor6131 = new DicomUID("1.2.840.10008.6.1.451", "Chest Texture Descriptor (6131)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestTextureDescriptor6131);
/** 1.2.840.10008.6.1.452 Chest Calcification Descriptor (6132) */
export const ChestCalcificationDescriptor6132 = new DicomUID("1.2.840.10008.6.1.452", "Chest Calcification Descriptor (6132)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestCalcificationDescriptor6132);
/** 1.2.840.10008.6.1.453 Chest Quantitative Temporal Difference Type (6133) */
export const ChestQuantitativeTemporalDifferenceType6133 = new DicomUID("1.2.840.10008.6.1.453", "Chest Quantitative Temporal Difference Type (6133)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestQuantitativeTemporalDifferenceType6133);
/** 1.2.840.10008.6.1.454 Chest Qualitative Temporal Difference Type (6134) */
export const ChestQualitativeTemporalDifferenceType6134 = new DicomUID("1.2.840.10008.6.1.454", "Chest Qualitative Temporal Difference Type (6134)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestQualitativeTemporalDifferenceType6134);
/** 1.2.840.10008.6.1.455 Image Quality Finding (6135) */
export const ImageQualityFinding6135 = new DicomUID("1.2.840.10008.6.1.455", "Image Quality Finding (6135)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImageQualityFinding6135);
/** 1.2.840.10008.6.1.456 Chest Types of Quality Control Standard (6136) */
export const ChestTypesOfQualityControlStandard6136 = new DicomUID("1.2.840.10008.6.1.456", "Chest Types of Quality Control Standard (6136)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestTypesOfQualityControlStandard6136);
/** 1.2.840.10008.6.1.457 CAD Analysis Type (6137) */
export const CADAnalysisType6137 = new DicomUID("1.2.840.10008.6.1.457", "CAD Analysis Type (6137)", DicomUidType.ContextGroupName, false);
DicomUID.register(CADAnalysisType6137);
/** 1.2.840.10008.6.1.458 Chest Non-lesion Object Type (6138) */
export const ChestNonLesionObjectType6138 = new DicomUID("1.2.840.10008.6.1.458", "Chest Non-lesion Object Type (6138)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestNonLesionObjectType6138);
/** 1.2.840.10008.6.1.459 Non-lesion Modifier (6139) */
export const NonLesionModifier6139 = new DicomUID("1.2.840.10008.6.1.459", "Non-lesion Modifier (6139)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonLesionModifier6139);
/** 1.2.840.10008.6.1.460 Calculation Method (6140) */
export const CalculationMethod6140 = new DicomUID("1.2.840.10008.6.1.460", "Calculation Method (6140)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalculationMethod6140);
/** 1.2.840.10008.6.1.461 Attenuation Coefficient Measurement (6141) */
export const AttenuationCoefficientMeasurement6141 = new DicomUID("1.2.840.10008.6.1.461", "Attenuation Coefficient Measurement (6141)", DicomUidType.ContextGroupName, false);
DicomUID.register(AttenuationCoefficientMeasurement6141);
/** 1.2.840.10008.6.1.462 Calculated Value (6142) */
export const CalculatedValue6142 = new DicomUID("1.2.840.10008.6.1.462", "Calculated Value (6142)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalculatedValue6142);
/** 1.2.840.10008.6.1.463 Lesion Response (6143) */
export const LesionResponse6143 = new DicomUID("1.2.840.10008.6.1.463", "Lesion Response (6143)", DicomUidType.ContextGroupName, false);
DicomUID.register(LesionResponse6143);
/** 1.2.840.10008.6.1.464 RECIST Defined Lesion Response (6144) */
export const RECISTDefinedLesionResponse6144 = new DicomUID("1.2.840.10008.6.1.464", "RECIST Defined Lesion Response (6144)", DicomUidType.ContextGroupName, false);
DicomUID.register(RECISTDefinedLesionResponse6144);
/** 1.2.840.10008.6.1.465 Baseline Category (6145) */
export const BaselineCategory6145 = new DicomUID("1.2.840.10008.6.1.465", "Baseline Category (6145)", DicomUidType.ContextGroupName, false);
DicomUID.register(BaselineCategory6145);
/** 1.2.840.10008.6.1.466 Background Echotexture (6151) */
export const BackgroundEchotexture6151 = new DicomUID("1.2.840.10008.6.1.466", "Background Echotexture (6151)", DicomUidType.ContextGroupName, false);
DicomUID.register(BackgroundEchotexture6151);
/** 1.2.840.10008.6.1.467 Orientation (6152) */
export const Orientation6152 = new DicomUID("1.2.840.10008.6.1.467", "Orientation (6152)", DicomUidType.ContextGroupName, false);
DicomUID.register(Orientation6152);
/** 1.2.840.10008.6.1.468 Lesion Boundary (6153) */
export const LesionBoundary6153 = new DicomUID("1.2.840.10008.6.1.468", "Lesion Boundary (6153)", DicomUidType.ContextGroupName, false);
DicomUID.register(LesionBoundary6153);
/** 1.2.840.10008.6.1.469 Echo Pattern (6154) */
export const EchoPattern6154 = new DicomUID("1.2.840.10008.6.1.469", "Echo Pattern (6154)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchoPattern6154);
/** 1.2.840.10008.6.1.470 Posterior Acoustic Feature (6155) */
export const PosteriorAcousticFeature6155 = new DicomUID("1.2.840.10008.6.1.470", "Posterior Acoustic Feature (6155)", DicomUidType.ContextGroupName, false);
DicomUID.register(PosteriorAcousticFeature6155);
/** 1.2.840.10008.6.1.471 Vascularity (6157) */
export const Vascularity6157 = new DicomUID("1.2.840.10008.6.1.471", "Vascularity (6157)", DicomUidType.ContextGroupName, false);
DicomUID.register(Vascularity6157);
/** 1.2.840.10008.6.1.472 Correlation to Other Finding (6158) */
export const CorrelationToOtherFinding6158 = new DicomUID("1.2.840.10008.6.1.472", "Correlation to Other Finding (6158)", DicomUidType.ContextGroupName, false);
DicomUID.register(CorrelationToOtherFinding6158);
/** 1.2.840.10008.6.1.473 Malignancy Type (6159) */
export const MalignancyType6159 = new DicomUID("1.2.840.10008.6.1.473", "Malignancy Type (6159)", DicomUidType.ContextGroupName, false);
DicomUID.register(MalignancyType6159);
/** 1.2.840.10008.6.1.474 Breast Primary Tumor Assessment From AJCC (6160) */
export const BreastPrimaryTumorAssessmentFromAJCC6160 = new DicomUID("1.2.840.10008.6.1.474", "Breast Primary Tumor Assessment From AJCC (6160)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastPrimaryTumorAssessmentFromAJCC6160);
/** 1.2.840.10008.6.1.475 Pathological Regional Lymph Node Assessment for Breast (6161) */
export const PathologicalRegionalLymphNodeAssessmentForBreast6161 = new DicomUID("1.2.840.10008.6.1.475", "Pathological Regional Lymph Node Assessment for Breast (6161)", DicomUidType.ContextGroupName, false);
DicomUID.register(PathologicalRegionalLymphNodeAssessmentForBreast6161);
/** 1.2.840.10008.6.1.476 Assessment of Metastasis for Breast (6162) */
export const AssessmentOfMetastasisForBreast6162 = new DicomUID("1.2.840.10008.6.1.476", "Assessment of Metastasis for Breast (6162)", DicomUidType.ContextGroupName, false);
DicomUID.register(AssessmentOfMetastasisForBreast6162);
/** 1.2.840.10008.6.1.477 Menstrual Cycle Phase (6163) */
export const MenstrualCyclePhase6163 = new DicomUID("1.2.840.10008.6.1.477", "Menstrual Cycle Phase (6163)", DicomUidType.ContextGroupName, false);
DicomUID.register(MenstrualCyclePhase6163);
/** 1.2.840.10008.6.1.478 Time Interval (6164) */
export const TimeInterval6164 = new DicomUID("1.2.840.10008.6.1.478", "Time Interval (6164)", DicomUidType.ContextGroupName, false);
DicomUID.register(TimeInterval6164);
/** 1.2.840.10008.6.1.479 Breast Linear Measurement (6165) */
export const BreastLinearMeasurement6165 = new DicomUID("1.2.840.10008.6.1.479", "Breast Linear Measurement (6165)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastLinearMeasurement6165);
/** 1.2.840.10008.6.1.480 CAD Geometry Secondary Graphical Representation (6166) */
export const CADGeometrySecondaryGraphicalRepresentation6166 = new DicomUID("1.2.840.10008.6.1.480", "CAD Geometry Secondary Graphical Representation (6166)", DicomUidType.ContextGroupName, false);
DicomUID.register(CADGeometrySecondaryGraphicalRepresentation6166);
/** 1.2.840.10008.6.1.481 Diagnostic Imaging Report Document Title (7000) */
export const DiagnosticImagingReportDocumentTitle7000 = new DicomUID("1.2.840.10008.6.1.481", "Diagnostic Imaging Report Document Title (7000)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiagnosticImagingReportDocumentTitle7000);
/** 1.2.840.10008.6.1.482 Diagnostic Imaging Report Heading (7001) */
export const DiagnosticImagingReportHeading7001 = new DicomUID("1.2.840.10008.6.1.482", "Diagnostic Imaging Report Heading (7001)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiagnosticImagingReportHeading7001);
/** 1.2.840.10008.6.1.483 Diagnostic Imaging Report Element (7002) */
export const DiagnosticImagingReportElement7002 = new DicomUID("1.2.840.10008.6.1.483", "Diagnostic Imaging Report Element (7002)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiagnosticImagingReportElement7002);
/** 1.2.840.10008.6.1.484 Diagnostic Imaging Report Purpose of Reference (7003) */
export const DiagnosticImagingReportPurposeOfReference7003 = new DicomUID("1.2.840.10008.6.1.484", "Diagnostic Imaging Report Purpose of Reference (7003)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiagnosticImagingReportPurposeOfReference7003);
/** 1.2.840.10008.6.1.485 Waveform Purpose of Reference (7004) */
export const WaveformPurposeOfReference7004 = new DicomUID("1.2.840.10008.6.1.485", "Waveform Purpose of Reference (7004)", DicomUidType.ContextGroupName, false);
DicomUID.register(WaveformPurposeOfReference7004);
/** 1.2.840.10008.6.1.486 Contributing Equipment Purpose of Reference (7005) */
export const ContributingEquipmentPurposeOfReference7005 = new DicomUID("1.2.840.10008.6.1.486", "Contributing Equipment Purpose of Reference (7005)", DicomUidType.ContextGroupName, false);
DicomUID.register(ContributingEquipmentPurposeOfReference7005);
/** 1.2.840.10008.6.1.487 SR Document Purpose of Reference (7006) */
export const SRDocumentPurposeOfReference7006 = new DicomUID("1.2.840.10008.6.1.487", "SR Document Purpose of Reference (7006)", DicomUidType.ContextGroupName, false);
DicomUID.register(SRDocumentPurposeOfReference7006);
/** 1.2.840.10008.6.1.488 Signature Purpose (7007) */
export const SignaturePurpose7007 = new DicomUID("1.2.840.10008.6.1.488", "Signature Purpose (7007)", DicomUidType.ContextGroupName, false);
DicomUID.register(SignaturePurpose7007);
/** 1.2.840.10008.6.1.489 Media Import (7008) */
export const MediaImport7008 = new DicomUID("1.2.840.10008.6.1.489", "Media Import (7008)", DicomUidType.ContextGroupName, false);
DicomUID.register(MediaImport7008);
/** 1.2.840.10008.6.1.490 Key Object Selection Document Title (7010) */
export const KeyObjectSelectionDocumentTitle7010 = new DicomUID("1.2.840.10008.6.1.490", "Key Object Selection Document Title (7010)", DicomUidType.ContextGroupName, false);
DicomUID.register(KeyObjectSelectionDocumentTitle7010);
/** 1.2.840.10008.6.1.491 Rejected for Quality Reason (7011) */
export const RejectedForQualityReason7011 = new DicomUID("1.2.840.10008.6.1.491", "Rejected for Quality Reason (7011)", DicomUidType.ContextGroupName, false);
DicomUID.register(RejectedForQualityReason7011);
/** 1.2.840.10008.6.1.492 Best in Set (7012) */
export const BestInSet7012 = new DicomUID("1.2.840.10008.6.1.492", "Best in Set (7012)", DicomUidType.ContextGroupName, false);
DicomUID.register(BestInSet7012);
/** 1.2.840.10008.6.1.493 Document Title (7020) */
export const DocumentTitle7020 = new DicomUID("1.2.840.10008.6.1.493", "Document Title (7020)", DicomUidType.ContextGroupName, false);
DicomUID.register(DocumentTitle7020);
/** 1.2.840.10008.6.1.494 RCS Registration Method Type (7100) */
export const RCSRegistrationMethodType7100 = new DicomUID("1.2.840.10008.6.1.494", "RCS Registration Method Type (7100)", DicomUidType.ContextGroupName, false);
DicomUID.register(RCSRegistrationMethodType7100);
/** 1.2.840.10008.6.1.495 Brain Atlas Fiducial (7101) */
export const BrainAtlasFiducial7101 = new DicomUID("1.2.840.10008.6.1.495", "Brain Atlas Fiducial (7101)", DicomUidType.ContextGroupName, false);
DicomUID.register(BrainAtlasFiducial7101);
/** 1.2.840.10008.6.1.496 Segmentation Property Category (7150) */
export const SegmentationPropertyCategory7150 = new DicomUID("1.2.840.10008.6.1.496", "Segmentation Property Category (7150)", DicomUidType.ContextGroupName, false);
DicomUID.register(SegmentationPropertyCategory7150);
/** 1.2.840.10008.6.1.497 Segmentation Property Type (7151) */
export const SegmentationPropertyType7151 = new DicomUID("1.2.840.10008.6.1.497", "Segmentation Property Type (7151)", DicomUidType.ContextGroupName, false);
DicomUID.register(SegmentationPropertyType7151);
/** 1.2.840.10008.6.1.498 Cardiac Structure Segmentation Type (7152) */
export const CardiacStructureSegmentationType7152 = new DicomUID("1.2.840.10008.6.1.498", "Cardiac Structure Segmentation Type (7152)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacStructureSegmentationType7152);
/** 1.2.840.10008.6.1.499 CNS Segmentation Type (7153) */
export const CNSSegmentationType7153 = new DicomUID("1.2.840.10008.6.1.499", "CNS Segmentation Type (7153)", DicomUidType.ContextGroupName, false);
DicomUID.register(CNSSegmentationType7153);
/** 1.2.840.10008.6.1.500 Abdominal Segmentation Type (7154) */
export const AbdominalSegmentationType7154 = new DicomUID("1.2.840.10008.6.1.500", "Abdominal Segmentation Type (7154)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbdominalSegmentationType7154);
/** 1.2.840.10008.6.1.501 Thoracic Segmentation Type (7155) */
export const ThoracicSegmentationType7155 = new DicomUID("1.2.840.10008.6.1.501", "Thoracic Segmentation Type (7155)", DicomUidType.ContextGroupName, false);
DicomUID.register(ThoracicSegmentationType7155);
/** 1.2.840.10008.6.1.502 Vascular Segmentation Type (7156) */
export const VascularSegmentationType7156 = new DicomUID("1.2.840.10008.6.1.502", "Vascular Segmentation Type (7156)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularSegmentationType7156);
/** 1.2.840.10008.6.1.503 Device Segmentation Type (7157) */
export const DeviceSegmentationType7157 = new DicomUID("1.2.840.10008.6.1.503", "Device Segmentation Type (7157)", DicomUidType.ContextGroupName, false);
DicomUID.register(DeviceSegmentationType7157);
/** 1.2.840.10008.6.1.504 Artifact Segmentation Type (7158) */
export const ArtifactSegmentationType7158 = new DicomUID("1.2.840.10008.6.1.504", "Artifact Segmentation Type (7158)", DicomUidType.ContextGroupName, false);
DicomUID.register(ArtifactSegmentationType7158);
/** 1.2.840.10008.6.1.505 Lesion Segmentation Type (7159) */
export const LesionSegmentationType7159 = new DicomUID("1.2.840.10008.6.1.505", "Lesion Segmentation Type (7159)", DicomUidType.ContextGroupName, false);
DicomUID.register(LesionSegmentationType7159);
/** 1.2.840.10008.6.1.506 Pelvic Organ Segmentation Type (7160) */
export const PelvicOrganSegmentationType7160 = new DicomUID("1.2.840.10008.6.1.506", "Pelvic Organ Segmentation Type (7160)", DicomUidType.ContextGroupName, false);
DicomUID.register(PelvicOrganSegmentationType7160);
/** 1.2.840.10008.6.1.507 Physiology Segmentation Type (7161) */
export const PhysiologySegmentationType7161 = new DicomUID("1.2.840.10008.6.1.507", "Physiology Segmentation Type (7161)", DicomUidType.ContextGroupName, false);
DicomUID.register(PhysiologySegmentationType7161);
/** 1.2.840.10008.6.1.508 Referenced Image Purpose of Reference (7201) */
export const ReferencedImagePurposeOfReference7201 = new DicomUID("1.2.840.10008.6.1.508", "Referenced Image Purpose of Reference (7201)", DicomUidType.ContextGroupName, false);
DicomUID.register(ReferencedImagePurposeOfReference7201);
/** 1.2.840.10008.6.1.509 Source Image Purpose of Reference (7202) */
export const SourceImagePurposeOfReference7202 = new DicomUID("1.2.840.10008.6.1.509", "Source Image Purpose of Reference (7202)", DicomUidType.ContextGroupName, false);
DicomUID.register(SourceImagePurposeOfReference7202);
/** 1.2.840.10008.6.1.510 Image Derivation (7203) */
export const ImageDerivation7203 = new DicomUID("1.2.840.10008.6.1.510", "Image Derivation (7203)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImageDerivation7203);
/** 1.2.840.10008.6.1.511 Purpose of Reference to Alternate Representation (7205) */
export const PurposeOfReferenceToAlternateRepresentation7205 = new DicomUID("1.2.840.10008.6.1.511", "Purpose of Reference to Alternate Representation (7205)", DicomUidType.ContextGroupName, false);
DicomUID.register(PurposeOfReferenceToAlternateRepresentation7205);
/** 1.2.840.10008.6.1.512 Related Series Purpose of Reference (7210) */
export const RelatedSeriesPurposeOfReference7210 = new DicomUID("1.2.840.10008.6.1.512", "Related Series Purpose of Reference (7210)", DicomUidType.ContextGroupName, false);
DicomUID.register(RelatedSeriesPurposeOfReference7210);
/** 1.2.840.10008.6.1.513 Multi-Frame Subset Type (7250) */
export const MultiFrameSubsetType7250 = new DicomUID("1.2.840.10008.6.1.513", "Multi-Frame Subset Type (7250)", DicomUidType.ContextGroupName, false);
DicomUID.register(MultiFrameSubsetType7250);
/** 1.2.840.10008.6.1.514 Person Role (7450) */
export const PersonRole7450 = new DicomUID("1.2.840.10008.6.1.514", "Person Role (7450)", DicomUidType.ContextGroupName, false);
DicomUID.register(PersonRole7450);
/** 1.2.840.10008.6.1.515 Family Member (7451) */
export const FamilyMember7451 = new DicomUID("1.2.840.10008.6.1.515", "Family Member (7451)", DicomUidType.ContextGroupName, false);
DicomUID.register(FamilyMember7451);
/** 1.2.840.10008.6.1.516 Organizational Role (7452) */
export const OrganizationalRole7452 = new DicomUID("1.2.840.10008.6.1.516", "Organizational Role (7452)", DicomUidType.ContextGroupName, false);
DicomUID.register(OrganizationalRole7452);
/** 1.2.840.10008.6.1.517 Performing Role (7453) */
export const PerformingRole7453 = new DicomUID("1.2.840.10008.6.1.517", "Performing Role (7453)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerformingRole7453);
/** 1.2.840.10008.6.1.518 Animal Taxonomic Rank Value (7454) */
export const AnimalTaxonomicRankValue7454 = new DicomUID("1.2.840.10008.6.1.518", "Animal Taxonomic Rank Value (7454)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnimalTaxonomicRankValue7454);
/** 1.2.840.10008.6.1.519 Sex (7455) */
export const Sex7455 = new DicomUID("1.2.840.10008.6.1.519", "Sex (7455)", DicomUidType.ContextGroupName, false);
DicomUID.register(Sex7455);
/** 1.2.840.10008.6.1.520 Age Unit (7456) */
export const AgeUnit7456 = new DicomUID("1.2.840.10008.6.1.520", "Age Unit (7456)", DicomUidType.ContextGroupName, false);
DicomUID.register(AgeUnit7456);
/** 1.2.840.10008.6.1.521 Linear Measurement Unit (7460) */
export const LinearMeasurementUnit7460 = new DicomUID("1.2.840.10008.6.1.521", "Linear Measurement Unit (7460)", DicomUidType.ContextGroupName, false);
DicomUID.register(LinearMeasurementUnit7460);
/** 1.2.840.10008.6.1.522 Area Measurement Unit (7461) */
export const AreaMeasurementUnit7461 = new DicomUID("1.2.840.10008.6.1.522", "Area Measurement Unit (7461)", DicomUidType.ContextGroupName, false);
DicomUID.register(AreaMeasurementUnit7461);
/** 1.2.840.10008.6.1.523 Volume Measurement Unit (7462) */
export const VolumeMeasurementUnit7462 = new DicomUID("1.2.840.10008.6.1.523", "Volume Measurement Unit (7462)", DicomUidType.ContextGroupName, false);
DicomUID.register(VolumeMeasurementUnit7462);
/** 1.2.840.10008.6.1.524 Linear Measurement (7470) */
export const LinearMeasurement7470 = new DicomUID("1.2.840.10008.6.1.524", "Linear Measurement (7470)", DicomUidType.ContextGroupName, false);
DicomUID.register(LinearMeasurement7470);
/** 1.2.840.10008.6.1.525 Area Measurement (7471) */
export const AreaMeasurement7471 = new DicomUID("1.2.840.10008.6.1.525", "Area Measurement (7471)", DicomUidType.ContextGroupName, false);
DicomUID.register(AreaMeasurement7471);
/** 1.2.840.10008.6.1.526 Volume Measurement (7472) */
export const VolumeMeasurement7472 = new DicomUID("1.2.840.10008.6.1.526", "Volume Measurement (7472)", DicomUidType.ContextGroupName, false);
DicomUID.register(VolumeMeasurement7472);
/** 1.2.840.10008.6.1.527 General Area Calculation Method (7473) */
export const GeneralAreaCalculationMethod7473 = new DicomUID("1.2.840.10008.6.1.527", "General Area Calculation Method (7473)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralAreaCalculationMethod7473);
/** 1.2.840.10008.6.1.528 General Volume Calculation Method (7474) */
export const GeneralVolumeCalculationMethod7474 = new DicomUID("1.2.840.10008.6.1.528", "General Volume Calculation Method (7474)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralVolumeCalculationMethod7474);
/** 1.2.840.10008.6.1.529 Breed (7480) */
export const Breed7480 = new DicomUID("1.2.840.10008.6.1.529", "Breed (7480)", DicomUidType.ContextGroupName, false);
DicomUID.register(Breed7480);
/** 1.2.840.10008.6.1.530 Breed Registry (7481) */
export const BreedRegistry7481 = new DicomUID("1.2.840.10008.6.1.530", "Breed Registry (7481)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreedRegistry7481);
/** 1.2.840.10008.6.1.531 Workitem Definition (9231) */
export const WorkitemDefinition9231 = new DicomUID("1.2.840.10008.6.1.531", "Workitem Definition (9231)", DicomUidType.ContextGroupName, false);
DicomUID.register(WorkitemDefinition9231);
/** 1.2.840.10008.6.1.532 Non-DICOM Output Types (Retired) (9232) (Retired) */
export const NonDICOMOutputTypes9232 = new DicomUID("1.2.840.10008.6.1.532", "Non-DICOM Output Types (Retired) (9232)", DicomUidType.ContextGroupName, true);
DicomUID.register(NonDICOMOutputTypes9232);
/** 1.2.840.10008.6.1.533 Procedure Discontinuation Reason (9300) */
export const ProcedureDiscontinuationReason9300 = new DicomUID("1.2.840.10008.6.1.533", "Procedure Discontinuation Reason (9300)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProcedureDiscontinuationReason9300);
/** 1.2.840.10008.6.1.534 Scope of Accumulation (10000) */
export const ScopeOfAccumulation10000 = new DicomUID("1.2.840.10008.6.1.534", "Scope of Accumulation (10000)", DicomUidType.ContextGroupName, false);
DicomUID.register(ScopeOfAccumulation10000);
/** 1.2.840.10008.6.1.535 UID Type (10001) */
export const UIDType10001 = new DicomUID("1.2.840.10008.6.1.535", "UID Type (10001)", DicomUidType.ContextGroupName, false);
DicomUID.register(UIDType10001);
/** 1.2.840.10008.6.1.536 Irradiation Event Type (10002) */
export const IrradiationEventType10002 = new DicomUID("1.2.840.10008.6.1.536", "Irradiation Event Type (10002)", DicomUidType.ContextGroupName, false);
DicomUID.register(IrradiationEventType10002);
/** 1.2.840.10008.6.1.537 Equipment Plane Identification (10003) */
export const EquipmentPlaneIdentification10003 = new DicomUID("1.2.840.10008.6.1.537", "Equipment Plane Identification (10003)", DicomUidType.ContextGroupName, false);
DicomUID.register(EquipmentPlaneIdentification10003);
/** 1.2.840.10008.6.1.538 Fluoro Mode (10004) */
export const FluoroMode10004 = new DicomUID("1.2.840.10008.6.1.538", "Fluoro Mode (10004)", DicomUidType.ContextGroupName, false);
DicomUID.register(FluoroMode10004);
/** 1.2.840.10008.6.1.539 X-Ray Filter Material (10006) */
export const XRayFilterMaterial10006 = new DicomUID("1.2.840.10008.6.1.539", "X-Ray Filter Material (10006)", DicomUidType.ContextGroupName, false);
DicomUID.register(XRayFilterMaterial10006);
/** 1.2.840.10008.6.1.540 X-Ray Filter Type (10007) */
export const XRayFilterType10007 = new DicomUID("1.2.840.10008.6.1.540", "X-Ray Filter Type (10007)", DicomUidType.ContextGroupName, false);
DicomUID.register(XRayFilterType10007);
/** 1.2.840.10008.6.1.541 Dose Related Distance Measurement (10008) */
export const DoseRelatedDistanceMeasurement10008 = new DicomUID("1.2.840.10008.6.1.541", "Dose Related Distance Measurement (10008)", DicomUidType.ContextGroupName, false);
DicomUID.register(DoseRelatedDistanceMeasurement10008);
/** 1.2.840.10008.6.1.542 Measured/Calculated (10009) */
export const MeasuredCalculated10009 = new DicomUID("1.2.840.10008.6.1.542", "Measured/Calculated (10009)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasuredCalculated10009);
/** 1.2.840.10008.6.1.543 Dose Measurement Device (10010) */
export const DoseMeasurementDevice10010 = new DicomUID("1.2.840.10008.6.1.543", "Dose Measurement Device (10010)", DicomUidType.ContextGroupName, false);
DicomUID.register(DoseMeasurementDevice10010);
/** 1.2.840.10008.6.1.544 Effective Dose Evaluation Method (10011) */
export const EffectiveDoseEvaluationMethod10011 = new DicomUID("1.2.840.10008.6.1.544", "Effective Dose Evaluation Method (10011)", DicomUidType.ContextGroupName, false);
DicomUID.register(EffectiveDoseEvaluationMethod10011);
/** 1.2.840.10008.6.1.545 CT Acquisition Type (10013) */
export const CTAcquisitionType10013 = new DicomUID("1.2.840.10008.6.1.545", "CT Acquisition Type (10013)", DicomUidType.ContextGroupName, false);
DicomUID.register(CTAcquisitionType10013);
/** 1.2.840.10008.6.1.546 CT IV Contrast Imaging Technique (10014) */
export const CTIVContrastImagingTechnique10014 = new DicomUID("1.2.840.10008.6.1.546", "CT IV Contrast Imaging Technique (10014)", DicomUidType.ContextGroupName, false);
DicomUID.register(CTIVContrastImagingTechnique10014);
/** 1.2.840.10008.6.1.547 CT Dose Reference Authority (10015) */
export const CTDoseReferenceAuthority10015 = new DicomUID("1.2.840.10008.6.1.547", "CT Dose Reference Authority (10015)", DicomUidType.ContextGroupName, false);
DicomUID.register(CTDoseReferenceAuthority10015);
/** 1.2.840.10008.6.1.548 Anode Target Material (10016) */
export const AnodeTargetMaterial10016 = new DicomUID("1.2.840.10008.6.1.548", "Anode Target Material (10016)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnodeTargetMaterial10016);
/** 1.2.840.10008.6.1.549 X-Ray Grid (10017) */
export const XRayGrid10017 = new DicomUID("1.2.840.10008.6.1.549", "X-Ray Grid (10017)", DicomUidType.ContextGroupName, false);
DicomUID.register(XRayGrid10017);
/** 1.2.840.10008.6.1.550 Ultrasound Protocol Type (12001) */
export const UltrasoundProtocolType12001 = new DicomUID("1.2.840.10008.6.1.550", "Ultrasound Protocol Type (12001)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundProtocolType12001);
/** 1.2.840.10008.6.1.551 Ultrasound Protocol Stage Type (12002) */
export const UltrasoundProtocolStageType12002 = new DicomUID("1.2.840.10008.6.1.551", "Ultrasound Protocol Stage Type (12002)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundProtocolStageType12002);
/** 1.2.840.10008.6.1.552 OB-GYN Date (12003) */
export const OBGYNDate12003 = new DicomUID("1.2.840.10008.6.1.552", "OB-GYN Date (12003)", DicomUidType.ContextGroupName, false);
DicomUID.register(OBGYNDate12003);
/** 1.2.840.10008.6.1.553 Fetal Biometry Ratio (12004) */
export const FetalBiometryRatio12004 = new DicomUID("1.2.840.10008.6.1.553", "Fetal Biometry Ratio (12004)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalBiometryRatio12004);
/** 1.2.840.10008.6.1.554 Fetal Biometry Measurement (12005) */
export const FetalBiometryMeasurement12005 = new DicomUID("1.2.840.10008.6.1.554", "Fetal Biometry Measurement (12005)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalBiometryMeasurement12005);
/** 1.2.840.10008.6.1.555 Fetal Long Bones Biometry Measurement (12006) */
export const FetalLongBonesBiometryMeasurement12006 = new DicomUID("1.2.840.10008.6.1.555", "Fetal Long Bones Biometry Measurement (12006)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalLongBonesBiometryMeasurement12006);
/** 1.2.840.10008.6.1.556 Fetal Cranium Measurement (12007) */
export const FetalCraniumMeasurement12007 = new DicomUID("1.2.840.10008.6.1.556", "Fetal Cranium Measurement (12007)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalCraniumMeasurement12007);
/** 1.2.840.10008.6.1.557 OB-GYN Amniotic Sac Measurement (12008) */
export const OBGYNAmnioticSacMeasurement12008 = new DicomUID("1.2.840.10008.6.1.557", "OB-GYN Amniotic Sac Measurement (12008)", DicomUidType.ContextGroupName, false);
DicomUID.register(OBGYNAmnioticSacMeasurement12008);
/** 1.2.840.10008.6.1.558 Early Gestation Biometry Measurement (12009) */
export const EarlyGestationBiometryMeasurement12009 = new DicomUID("1.2.840.10008.6.1.558", "Early Gestation Biometry Measurement (12009)", DicomUidType.ContextGroupName, false);
DicomUID.register(EarlyGestationBiometryMeasurement12009);
/** 1.2.840.10008.6.1.559 Ultrasound Pelvis and Uterus Measurement (12011) */
export const UltrasoundPelvisAndUterusMeasurement12011 = new DicomUID("1.2.840.10008.6.1.559", "Ultrasound Pelvis and Uterus Measurement (12011)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundPelvisAndUterusMeasurement12011);
/** 1.2.840.10008.6.1.560 OB Equation/Table (12012) */
export const OBEquationTable12012 = new DicomUID("1.2.840.10008.6.1.560", "OB Equation/Table (12012)", DicomUidType.ContextGroupName, false);
DicomUID.register(OBEquationTable12012);
/** 1.2.840.10008.6.1.561 Gestational Age Equation/Table (12013) */
export const GestationalAgeEquationTable12013 = new DicomUID("1.2.840.10008.6.1.561", "Gestational Age Equation/Table (12013)", DicomUidType.ContextGroupName, false);
DicomUID.register(GestationalAgeEquationTable12013);
/** 1.2.840.10008.6.1.562 OB Fetal Body Weight Equation/Table (12014) */
export const OBFetalBodyWeightEquationTable12014 = new DicomUID("1.2.840.10008.6.1.562", "OB Fetal Body Weight Equation/Table (12014)", DicomUidType.ContextGroupName, false);
DicomUID.register(OBFetalBodyWeightEquationTable12014);
/** 1.2.840.10008.6.1.563 Fetal Growth Equation/Table (12015) */
export const FetalGrowthEquationTable12015 = new DicomUID("1.2.840.10008.6.1.563", "Fetal Growth Equation/Table (12015)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalGrowthEquationTable12015);
/** 1.2.840.10008.6.1.564 Estimated Fetal Weight Percentile Equation/Table (12016) */
export const EstimatedFetalWeightPercentileEquationTable12016 = new DicomUID("1.2.840.10008.6.1.564", "Estimated Fetal Weight Percentile Equation/Table (12016)", DicomUidType.ContextGroupName, false);
DicomUID.register(EstimatedFetalWeightPercentileEquationTable12016);
/** 1.2.840.10008.6.1.565 Growth Distribution Rank (12017) */
export const GrowthDistributionRank12017 = new DicomUID("1.2.840.10008.6.1.565", "Growth Distribution Rank (12017)", DicomUidType.ContextGroupName, false);
DicomUID.register(GrowthDistributionRank12017);
/** 1.2.840.10008.6.1.566 OB-GYN Summary (12018) */
export const OBGYNSummary12018 = new DicomUID("1.2.840.10008.6.1.566", "OB-GYN Summary (12018)", DicomUidType.ContextGroupName, false);
DicomUID.register(OBGYNSummary12018);
/** 1.2.840.10008.6.1.567 OB-GYN Fetus Summary (12019) */
export const OBGYNFetusSummary12019 = new DicomUID("1.2.840.10008.6.1.567", "OB-GYN Fetus Summary (12019)", DicomUidType.ContextGroupName, false);
DicomUID.register(OBGYNFetusSummary12019);
/** 1.2.840.10008.6.1.568 Vascular Summary (12101) */
export const VascularSummary12101 = new DicomUID("1.2.840.10008.6.1.568", "Vascular Summary (12101)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularSummary12101);
/** 1.2.840.10008.6.1.569 Temporal Period Relating to Procedure or Therapy (12102) */
export const TemporalPeriodRelatingToProcedureOrTherapy12102 = new DicomUID("1.2.840.10008.6.1.569", "Temporal Period Relating to Procedure or Therapy (12102)", DicomUidType.ContextGroupName, false);
DicomUID.register(TemporalPeriodRelatingToProcedureOrTherapy12102);
/** 1.2.840.10008.6.1.570 Vascular Ultrasound Anatomic Location (12103) */
export const VascularUltrasoundAnatomicLocation12103 = new DicomUID("1.2.840.10008.6.1.570", "Vascular Ultrasound Anatomic Location (12103)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularUltrasoundAnatomicLocation12103);
/** 1.2.840.10008.6.1.571 Extracranial Artery (12104) */
export const ExtracranialArtery12104 = new DicomUID("1.2.840.10008.6.1.571", "Extracranial Artery (12104)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExtracranialArtery12104);
/** 1.2.840.10008.6.1.572 Intracranial Cerebral Vessel (12105) */
export const IntracranialCerebralVessel12105 = new DicomUID("1.2.840.10008.6.1.572", "Intracranial Cerebral Vessel (12105)", DicomUidType.ContextGroupName, false);
DicomUID.register(IntracranialCerebralVessel12105);
/** 1.2.840.10008.6.1.573 Intracranial Cerebral Vessel (Unilateral) (12106) */
export const IntracranialCerebralVesselUnilateral12106 = new DicomUID("1.2.840.10008.6.1.573", "Intracranial Cerebral Vessel (Unilateral) (12106)", DicomUidType.ContextGroupName, false);
DicomUID.register(IntracranialCerebralVesselUnilateral12106);
/** 1.2.840.10008.6.1.574 Upper Extremity Artery (12107) */
export const UpperExtremityArtery12107 = new DicomUID("1.2.840.10008.6.1.574", "Upper Extremity Artery (12107)", DicomUidType.ContextGroupName, false);
DicomUID.register(UpperExtremityArtery12107);
/** 1.2.840.10008.6.1.575 Upper Extremity Vein (12108) */
export const UpperExtremityVein12108 = new DicomUID("1.2.840.10008.6.1.575", "Upper Extremity Vein (12108)", DicomUidType.ContextGroupName, false);
DicomUID.register(UpperExtremityVein12108);
/** 1.2.840.10008.6.1.576 Lower Extremity Artery (12109) */
export const LowerExtremityArtery12109 = new DicomUID("1.2.840.10008.6.1.576", "Lower Extremity Artery (12109)", DicomUidType.ContextGroupName, false);
DicomUID.register(LowerExtremityArtery12109);
/** 1.2.840.10008.6.1.577 Lower Extremity Vein (12110) */
export const LowerExtremityVein12110 = new DicomUID("1.2.840.10008.6.1.577", "Lower Extremity Vein (12110)", DicomUidType.ContextGroupName, false);
DicomUID.register(LowerExtremityVein12110);
/** 1.2.840.10008.6.1.578 Abdominopelvic Artery (Paired) (12111) */
export const AbdominopelvicArteryPaired12111 = new DicomUID("1.2.840.10008.6.1.578", "Abdominopelvic Artery (Paired) (12111)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbdominopelvicArteryPaired12111);
/** 1.2.840.10008.6.1.579 Abdominopelvic Artery (Unpaired) (12112) */
export const AbdominopelvicArteryUnpaired12112 = new DicomUID("1.2.840.10008.6.1.579", "Abdominopelvic Artery (Unpaired) (12112)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbdominopelvicArteryUnpaired12112);
/** 1.2.840.10008.6.1.580 Abdominopelvic Vein (Paired) (12113) */
export const AbdominopelvicVeinPaired12113 = new DicomUID("1.2.840.10008.6.1.580", "Abdominopelvic Vein (Paired) (12113)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbdominopelvicVeinPaired12113);
/** 1.2.840.10008.6.1.581 Abdominopelvic Vein (Unpaired) (12114) */
export const AbdominopelvicVeinUnpaired12114 = new DicomUID("1.2.840.10008.6.1.581", "Abdominopelvic Vein (Unpaired) (12114)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbdominopelvicVeinUnpaired12114);
/** 1.2.840.10008.6.1.582 Renal Vessel (12115) */
export const RenalVessel12115 = new DicomUID("1.2.840.10008.6.1.582", "Renal Vessel (12115)", DicomUidType.ContextGroupName, false);
DicomUID.register(RenalVessel12115);
/** 1.2.840.10008.6.1.583 Vessel Segment Modifier (12116) */
export const VesselSegmentModifier12116 = new DicomUID("1.2.840.10008.6.1.583", "Vessel Segment Modifier (12116)", DicomUidType.ContextGroupName, false);
DicomUID.register(VesselSegmentModifier12116);
/** 1.2.840.10008.6.1.584 Vessel Branch Modifier (12117) */
export const VesselBranchModifier12117 = new DicomUID("1.2.840.10008.6.1.584", "Vessel Branch Modifier (12117)", DicomUidType.ContextGroupName, false);
DicomUID.register(VesselBranchModifier12117);
/** 1.2.840.10008.6.1.585 Vascular Ultrasound Property (12119) */
export const VascularUltrasoundProperty12119 = new DicomUID("1.2.840.10008.6.1.585", "Vascular Ultrasound Property (12119)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularUltrasoundProperty12119);
/** 1.2.840.10008.6.1.586 Ultrasound Blood Velocity Measurement (12120) */
export const UltrasoundBloodVelocityMeasurement12120 = new DicomUID("1.2.840.10008.6.1.586", "Ultrasound Blood Velocity Measurement (12120)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundBloodVelocityMeasurement12120);
/** 1.2.840.10008.6.1.587 Vascular Index/Ratio (12121) */
export const VascularIndexRatio12121 = new DicomUID("1.2.840.10008.6.1.587", "Vascular Index/Ratio (12121)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularIndexRatio12121);
/** 1.2.840.10008.6.1.588 Other Vascular Property (12122) */
export const OtherVascularProperty12122 = new DicomUID("1.2.840.10008.6.1.588", "Other Vascular Property (12122)", DicomUidType.ContextGroupName, false);
DicomUID.register(OtherVascularProperty12122);
/** 1.2.840.10008.6.1.589 Carotid Ratio (12123) */
export const CarotidRatio12123 = new DicomUID("1.2.840.10008.6.1.589", "Carotid Ratio (12123)", DicomUidType.ContextGroupName, false);
DicomUID.register(CarotidRatio12123);
/** 1.2.840.10008.6.1.590 Renal Ratio (12124) */
export const RenalRatio12124 = new DicomUID("1.2.840.10008.6.1.590", "Renal Ratio (12124)", DicomUidType.ContextGroupName, false);
DicomUID.register(RenalRatio12124);
/** 1.2.840.10008.6.1.591 Pelvic Vasculature Anatomical Location (12140) */
export const PelvicVasculatureAnatomicalLocation12140 = new DicomUID("1.2.840.10008.6.1.591", "Pelvic Vasculature Anatomical Location (12140)", DicomUidType.ContextGroupName, false);
DicomUID.register(PelvicVasculatureAnatomicalLocation12140);
/** 1.2.840.10008.6.1.592 Fetal Vasculature Anatomical Location (12141) */
export const FetalVasculatureAnatomicalLocation12141 = new DicomUID("1.2.840.10008.6.1.592", "Fetal Vasculature Anatomical Location (12141)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalVasculatureAnatomicalLocation12141);
/** 1.2.840.10008.6.1.593 Echocardiography Left Ventricle Measurement (12200) */
export const EchocardiographyLeftVentricleMeasurement12200 = new DicomUID("1.2.840.10008.6.1.593", "Echocardiography Left Ventricle Measurement (12200)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyLeftVentricleMeasurement12200);
/** 1.2.840.10008.6.1.594 Left Ventricle Linear Measurement (12201) */
export const LeftVentricleLinearMeasurement12201 = new DicomUID("1.2.840.10008.6.1.594", "Left Ventricle Linear Measurement (12201)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleLinearMeasurement12201);
/** 1.2.840.10008.6.1.595 Left Ventricle Volume Measurement (12202) */
export const LeftVentricleVolumeMeasurement12202 = new DicomUID("1.2.840.10008.6.1.595", "Left Ventricle Volume Measurement (12202)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleVolumeMeasurement12202);
/** 1.2.840.10008.6.1.596 Left Ventricle Other Measurement (12203) */
export const LeftVentricleOtherMeasurement12203 = new DicomUID("1.2.840.10008.6.1.596", "Left Ventricle Other Measurement (12203)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleOtherMeasurement12203);
/** 1.2.840.10008.6.1.597 Echocardiography Right Ventricle Measurement (12204) */
export const EchocardiographyRightVentricleMeasurement12204 = new DicomUID("1.2.840.10008.6.1.597", "Echocardiography Right Ventricle Measurement (12204)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyRightVentricleMeasurement12204);
/** 1.2.840.10008.6.1.598 Echocardiography Left Atrium Measurement (12205) */
export const EchocardiographyLeftAtriumMeasurement12205 = new DicomUID("1.2.840.10008.6.1.598", "Echocardiography Left Atrium Measurement (12205)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyLeftAtriumMeasurement12205);
/** 1.2.840.10008.6.1.599 Echocardiography Right Atrium Measurement (12206) */
export const EchocardiographyRightAtriumMeasurement12206 = new DicomUID("1.2.840.10008.6.1.599", "Echocardiography Right Atrium Measurement (12206)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyRightAtriumMeasurement12206);
/** 1.2.840.10008.6.1.600 Echocardiography Mitral Valve Measurement (12207) */
export const EchocardiographyMitralValveMeasurement12207 = new DicomUID("1.2.840.10008.6.1.600", "Echocardiography Mitral Valve Measurement (12207)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyMitralValveMeasurement12207);
/** 1.2.840.10008.6.1.601 Echocardiography Tricuspid Valve Measurement (12208) */
export const EchocardiographyTricuspidValveMeasurement12208 = new DicomUID("1.2.840.10008.6.1.601", "Echocardiography Tricuspid Valve Measurement (12208)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyTricuspidValveMeasurement12208);
/** 1.2.840.10008.6.1.602 Echocardiography Pulmonic Valve Measurement (12209) */
export const EchocardiographyPulmonicValveMeasurement12209 = new DicomUID("1.2.840.10008.6.1.602", "Echocardiography Pulmonic Valve Measurement (12209)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyPulmonicValveMeasurement12209);
/** 1.2.840.10008.6.1.603 Echocardiography Pulmonary Artery Measurement (12210) */
export const EchocardiographyPulmonaryArteryMeasurement12210 = new DicomUID("1.2.840.10008.6.1.603", "Echocardiography Pulmonary Artery Measurement (12210)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyPulmonaryArteryMeasurement12210);
/** 1.2.840.10008.6.1.604 Echocardiography Aortic Valve Measurement (12211) */
export const EchocardiographyAorticValveMeasurement12211 = new DicomUID("1.2.840.10008.6.1.604", "Echocardiography Aortic Valve Measurement (12211)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyAorticValveMeasurement12211);
/** 1.2.840.10008.6.1.605 Echocardiography Aorta Measurement (12212) */
export const EchocardiographyAortaMeasurement12212 = new DicomUID("1.2.840.10008.6.1.605", "Echocardiography Aorta Measurement (12212)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyAortaMeasurement12212);
/** 1.2.840.10008.6.1.606 Echocardiography Pulmonary Vein Measurement (12214) */
export const EchocardiographyPulmonaryVeinMeasurement12214 = new DicomUID("1.2.840.10008.6.1.606", "Echocardiography Pulmonary Vein Measurement (12214)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyPulmonaryVeinMeasurement12214);
/** 1.2.840.10008.6.1.607 Echocardiography Vena Cava Measurement (12215) */
export const EchocardiographyVenaCavaMeasurement12215 = new DicomUID("1.2.840.10008.6.1.607", "Echocardiography Vena Cava Measurement (12215)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyVenaCavaMeasurement12215);
/** 1.2.840.10008.6.1.608 Echocardiography Hepatic Vein Measurement (12216) */
export const EchocardiographyHepaticVeinMeasurement12216 = new DicomUID("1.2.840.10008.6.1.608", "Echocardiography Hepatic Vein Measurement (12216)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyHepaticVeinMeasurement12216);
/** 1.2.840.10008.6.1.609 Echocardiography Cardiac Shunt Measurement (12217) */
export const EchocardiographyCardiacShuntMeasurement12217 = new DicomUID("1.2.840.10008.6.1.609", "Echocardiography Cardiac Shunt Measurement (12217)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyCardiacShuntMeasurement12217);
/** 1.2.840.10008.6.1.610 Echocardiography Congenital Anomaly Measurement (12218) */
export const EchocardiographyCongenitalAnomalyMeasurement12218 = new DicomUID("1.2.840.10008.6.1.610", "Echocardiography Congenital Anomaly Measurement (12218)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyCongenitalAnomalyMeasurement12218);
/** 1.2.840.10008.6.1.611 Pulmonary Vein Modifier (12219) */
export const PulmonaryVeinModifier12219 = new DicomUID("1.2.840.10008.6.1.611", "Pulmonary Vein Modifier (12219)", DicomUidType.ContextGroupName, false);
DicomUID.register(PulmonaryVeinModifier12219);
/** 1.2.840.10008.6.1.612 Echocardiography Common Measurement (12220) */
export const EchocardiographyCommonMeasurement12220 = new DicomUID("1.2.840.10008.6.1.612", "Echocardiography Common Measurement (12220)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyCommonMeasurement12220);
/** 1.2.840.10008.6.1.613 Flow Direction (12221) */
export const FlowDirection12221 = new DicomUID("1.2.840.10008.6.1.613", "Flow Direction (12221)", DicomUidType.ContextGroupName, false);
DicomUID.register(FlowDirection12221);
/** 1.2.840.10008.6.1.614 Orifice Flow Property (12222) */
export const OrificeFlowProperty12222 = new DicomUID("1.2.840.10008.6.1.614", "Orifice Flow Property (12222)", DicomUidType.ContextGroupName, false);
DicomUID.register(OrificeFlowProperty12222);
/** 1.2.840.10008.6.1.615 Echocardiography Stroke Volume Origin (12223) */
export const EchocardiographyStrokeVolumeOrigin12223 = new DicomUID("1.2.840.10008.6.1.615", "Echocardiography Stroke Volume Origin (12223)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyStrokeVolumeOrigin12223);
/** 1.2.840.10008.6.1.616 Ultrasound Image Mode (12224) */
export const UltrasoundImageMode12224 = new DicomUID("1.2.840.10008.6.1.616", "Ultrasound Image Mode (12224)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundImageMode12224);
/** 1.2.840.10008.6.1.617 Echocardiography Image View (12226) */
export const EchocardiographyImageView12226 = new DicomUID("1.2.840.10008.6.1.617", "Echocardiography Image View (12226)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyImageView12226);
/** 1.2.840.10008.6.1.618 Echocardiography Measurement Method (12227) */
export const EchocardiographyMeasurementMethod12227 = new DicomUID("1.2.840.10008.6.1.618", "Echocardiography Measurement Method (12227)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyMeasurementMethod12227);
/** 1.2.840.10008.6.1.619 Echocardiography Volume Method (12228) */
export const EchocardiographyVolumeMethod12228 = new DicomUID("1.2.840.10008.6.1.619", "Echocardiography Volume Method (12228)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyVolumeMethod12228);
/** 1.2.840.10008.6.1.620 Echocardiography Area Method (12229) */
export const EchocardiographyAreaMethod12229 = new DicomUID("1.2.840.10008.6.1.620", "Echocardiography Area Method (12229)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyAreaMethod12229);
/** 1.2.840.10008.6.1.621 Gradient Method (12230) */
export const GradientMethod12230 = new DicomUID("1.2.840.10008.6.1.621", "Gradient Method (12230)", DicomUidType.ContextGroupName, false);
DicomUID.register(GradientMethod12230);
/** 1.2.840.10008.6.1.622 Volume Flow Method (12231) */
export const VolumeFlowMethod12231 = new DicomUID("1.2.840.10008.6.1.622", "Volume Flow Method (12231)", DicomUidType.ContextGroupName, false);
DicomUID.register(VolumeFlowMethod12231);
/** 1.2.840.10008.6.1.623 Myocardium Mass Method (12232) */
export const MyocardiumMassMethod12232 = new DicomUID("1.2.840.10008.6.1.623", "Myocardium Mass Method (12232)", DicomUidType.ContextGroupName, false);
DicomUID.register(MyocardiumMassMethod12232);
/** 1.2.840.10008.6.1.624 Cardiac Phase (12233) */
export const CardiacPhase12233 = new DicomUID("1.2.840.10008.6.1.624", "Cardiac Phase (12233)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacPhase12233);
/** 1.2.840.10008.6.1.625 Respiration State (12234) */
export const RespirationState12234 = new DicomUID("1.2.840.10008.6.1.625", "Respiration State (12234)", DicomUidType.ContextGroupName, false);
DicomUID.register(RespirationState12234);
/** 1.2.840.10008.6.1.626 Mitral Valve Anatomic Site (12235) */
export const MitralValveAnatomicSite12235 = new DicomUID("1.2.840.10008.6.1.626", "Mitral Valve Anatomic Site (12235)", DicomUidType.ContextGroupName, false);
DicomUID.register(MitralValveAnatomicSite12235);
/** 1.2.840.10008.6.1.627 Echocardiography Anatomic Site (12236) */
export const EchocardiographyAnatomicSite12236 = new DicomUID("1.2.840.10008.6.1.627", "Echocardiography Anatomic Site (12236)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyAnatomicSite12236);
/** 1.2.840.10008.6.1.628 Echocardiography Anatomic Site Modifier (12237) */
export const EchocardiographyAnatomicSiteModifier12237 = new DicomUID("1.2.840.10008.6.1.628", "Echocardiography Anatomic Site Modifier (12237)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchocardiographyAnatomicSiteModifier12237);
/** 1.2.840.10008.6.1.629 Wall Motion Scoring Scheme (12238) */
export const WallMotionScoringScheme12238 = new DicomUID("1.2.840.10008.6.1.629", "Wall Motion Scoring Scheme (12238)", DicomUidType.ContextGroupName, false);
DicomUID.register(WallMotionScoringScheme12238);
/** 1.2.840.10008.6.1.630 Cardiac Output Property (12239) */
export const CardiacOutputProperty12239 = new DicomUID("1.2.840.10008.6.1.630", "Cardiac Output Property (12239)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacOutputProperty12239);
/** 1.2.840.10008.6.1.631 Left Ventricle Area Measurement (12240) */
export const LeftVentricleAreaMeasurement12240 = new DicomUID("1.2.840.10008.6.1.631", "Left Ventricle Area Measurement (12240)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleAreaMeasurement12240);
/** 1.2.840.10008.6.1.632 Tricuspid Valve Finding Site (12241) */
export const TricuspidValveFindingSite12241 = new DicomUID("1.2.840.10008.6.1.632", "Tricuspid Valve Finding Site (12241)", DicomUidType.ContextGroupName, false);
DicomUID.register(TricuspidValveFindingSite12241);
/** 1.2.840.10008.6.1.633 Aortic Valve Finding Site (12242) */
export const AorticValveFindingSite12242 = new DicomUID("1.2.840.10008.6.1.633", "Aortic Valve Finding Site (12242)", DicomUidType.ContextGroupName, false);
DicomUID.register(AorticValveFindingSite12242);
/** 1.2.840.10008.6.1.634 Left Ventricle Finding Site (12243) */
export const LeftVentricleFindingSite12243 = new DicomUID("1.2.840.10008.6.1.634", "Left Ventricle Finding Site (12243)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleFindingSite12243);
/** 1.2.840.10008.6.1.635 Congenital Finding Site (12244) */
export const CongenitalFindingSite12244 = new DicomUID("1.2.840.10008.6.1.635", "Congenital Finding Site (12244)", DicomUidType.ContextGroupName, false);
DicomUID.register(CongenitalFindingSite12244);
/** 1.2.840.10008.6.1.636 Surface Processing Algorithm Family (7162) */
export const SurfaceProcessingAlgorithmFamily7162 = new DicomUID("1.2.840.10008.6.1.636", "Surface Processing Algorithm Family (7162)", DicomUidType.ContextGroupName, false);
DicomUID.register(SurfaceProcessingAlgorithmFamily7162);
/** 1.2.840.10008.6.1.637 Stress Test Procedure Phase (3207) */
export const StressTestProcedurePhase3207 = new DicomUID("1.2.840.10008.6.1.637", "Stress Test Procedure Phase (3207)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressTestProcedurePhase3207);
/** 1.2.840.10008.6.1.638 Stage (3778) */
export const Stage3778 = new DicomUID("1.2.840.10008.6.1.638", "Stage (3778)", DicomUidType.ContextGroupName, false);
DicomUID.register(Stage3778);
/** 1.2.840.10008.6.1.735 S-M-L Size Descriptor (252) */
export const SMLSizeDescriptor252 = new DicomUID("1.2.840.10008.6.1.735", "S-M-L Size Descriptor (252)", DicomUidType.ContextGroupName, false);
DicomUID.register(SMLSizeDescriptor252);
/** 1.2.840.10008.6.1.736 Major Coronary Artery (3016) */
export const MajorCoronaryArtery3016 = new DicomUID("1.2.840.10008.6.1.736", "Major Coronary Artery (3016)", DicomUidType.ContextGroupName, false);
DicomUID.register(MajorCoronaryArtery3016);
/** 1.2.840.10008.6.1.737 Radioactivity Unit (3083) */
export const RadioactivityUnit3083 = new DicomUID("1.2.840.10008.6.1.737", "Radioactivity Unit (3083)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadioactivityUnit3083);
/** 1.2.840.10008.6.1.738 Rest/Stress State (3102) */
export const RestStressState3102 = new DicomUID("1.2.840.10008.6.1.738", "Rest/Stress State (3102)", DicomUidType.ContextGroupName, false);
DicomUID.register(RestStressState3102);
/** 1.2.840.10008.6.1.739 PET Cardiology Protocol (3106) */
export const PETCardiologyProtocol3106 = new DicomUID("1.2.840.10008.6.1.739", "PET Cardiology Protocol (3106)", DicomUidType.ContextGroupName, false);
DicomUID.register(PETCardiologyProtocol3106);
/** 1.2.840.10008.6.1.740 PET Cardiology Radiopharmaceutical (3107) */
export const PETCardiologyRadiopharmaceutical3107 = new DicomUID("1.2.840.10008.6.1.740", "PET Cardiology Radiopharmaceutical (3107)", DicomUidType.ContextGroupName, false);
DicomUID.register(PETCardiologyRadiopharmaceutical3107);
/** 1.2.840.10008.6.1.741 NM/PET Procedure (3108) */
export const NMPETProcedure3108 = new DicomUID("1.2.840.10008.6.1.741", "NM/PET Procedure (3108)", DicomUidType.ContextGroupName, false);
DicomUID.register(NMPETProcedure3108);
/** 1.2.840.10008.6.1.742 Nuclear Cardiology Protocol (3110) */
export const NuclearCardiologyProtocol3110 = new DicomUID("1.2.840.10008.6.1.742", "Nuclear Cardiology Protocol (3110)", DicomUidType.ContextGroupName, false);
DicomUID.register(NuclearCardiologyProtocol3110);
/** 1.2.840.10008.6.1.743 Nuclear Cardiology Radiopharmaceutical (3111) */
export const NuclearCardiologyRadiopharmaceutical3111 = new DicomUID("1.2.840.10008.6.1.743", "Nuclear Cardiology Radiopharmaceutical (3111)", DicomUidType.ContextGroupName, false);
DicomUID.register(NuclearCardiologyRadiopharmaceutical3111);
/** 1.2.840.10008.6.1.744 Attenuation Correction (3112) */
export const AttenuationCorrection3112 = new DicomUID("1.2.840.10008.6.1.744", "Attenuation Correction (3112)", DicomUidType.ContextGroupName, false);
DicomUID.register(AttenuationCorrection3112);
/** 1.2.840.10008.6.1.745 Perfusion Defect Type (3113) */
export const PerfusionDefectType3113 = new DicomUID("1.2.840.10008.6.1.745", "Perfusion Defect Type (3113)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerfusionDefectType3113);
/** 1.2.840.10008.6.1.746 Study Quality (3114) */
export const StudyQuality3114 = new DicomUID("1.2.840.10008.6.1.746", "Study Quality (3114)", DicomUidType.ContextGroupName, false);
DicomUID.register(StudyQuality3114);
/** 1.2.840.10008.6.1.747 Stress Imaging Quality Issue (3115) */
export const StressImagingQualityIssue3115 = new DicomUID("1.2.840.10008.6.1.747", "Stress Imaging Quality Issue (3115)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressImagingQualityIssue3115);
/** 1.2.840.10008.6.1.748 NM Extracardiac Finding (3116) */
export const NMExtracardiacFinding3116 = new DicomUID("1.2.840.10008.6.1.748", "NM Extracardiac Finding (3116)", DicomUidType.ContextGroupName, false);
DicomUID.register(NMExtracardiacFinding3116);
/** 1.2.840.10008.6.1.749 Attenuation Correction Method (3117) */
export const AttenuationCorrectionMethod3117 = new DicomUID("1.2.840.10008.6.1.749", "Attenuation Correction Method (3117)", DicomUidType.ContextGroupName, false);
DicomUID.register(AttenuationCorrectionMethod3117);
/** 1.2.840.10008.6.1.750 Level of Risk (3118) */
export const LevelOfRisk3118 = new DicomUID("1.2.840.10008.6.1.750", "Level of Risk (3118)", DicomUidType.ContextGroupName, false);
DicomUID.register(LevelOfRisk3118);
/** 1.2.840.10008.6.1.751 LV Function (3119) */
export const LVFunction3119 = new DicomUID("1.2.840.10008.6.1.751", "LV Function (3119)", DicomUidType.ContextGroupName, false);
DicomUID.register(LVFunction3119);
/** 1.2.840.10008.6.1.752 Perfusion Finding (3120) */
export const PerfusionFinding3120 = new DicomUID("1.2.840.10008.6.1.752", "Perfusion Finding (3120)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerfusionFinding3120);
/** 1.2.840.10008.6.1.753 Perfusion Morphology (3121) */
export const PerfusionMorphology3121 = new DicomUID("1.2.840.10008.6.1.753", "Perfusion Morphology (3121)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerfusionMorphology3121);
/** 1.2.840.10008.6.1.754 Ventricular Enlargement (3122) */
export const VentricularEnlargement3122 = new DicomUID("1.2.840.10008.6.1.754", "Ventricular Enlargement (3122)", DicomUidType.ContextGroupName, false);
DicomUID.register(VentricularEnlargement3122);
/** 1.2.840.10008.6.1.755 Stress Test Procedure (3200) */
export const StressTestProcedure3200 = new DicomUID("1.2.840.10008.6.1.755", "Stress Test Procedure (3200)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressTestProcedure3200);
/** 1.2.840.10008.6.1.756 Indications for Stress Test (3201) */
export const IndicationsForStressTest3201 = new DicomUID("1.2.840.10008.6.1.756", "Indications for Stress Test (3201)", DicomUidType.ContextGroupName, false);
DicomUID.register(IndicationsForStressTest3201);
/** 1.2.840.10008.6.1.757 Chest Pain (3202) */
export const ChestPain3202 = new DicomUID("1.2.840.10008.6.1.757", "Chest Pain (3202)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestPain3202);
/** 1.2.840.10008.6.1.758 Exerciser Device (3203) */
export const ExerciserDevice3203 = new DicomUID("1.2.840.10008.6.1.758", "Exerciser Device (3203)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExerciserDevice3203);
/** 1.2.840.10008.6.1.759 Stress Agent (3204) */
export const StressAgent3204 = new DicomUID("1.2.840.10008.6.1.759", "Stress Agent (3204)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressAgent3204);
/** 1.2.840.10008.6.1.760 Indications for Pharmacological Stress Test (3205) */
export const IndicationsForPharmacologicalStressTest3205 = new DicomUID("1.2.840.10008.6.1.760", "Indications for Pharmacological Stress Test (3205)", DicomUidType.ContextGroupName, false);
DicomUID.register(IndicationsForPharmacologicalStressTest3205);
/** 1.2.840.10008.6.1.761 Non-invasive Cardiac Imaging Procedure (3206) */
export const NonInvasiveCardiacImagingProcedure3206 = new DicomUID("1.2.840.10008.6.1.761", "Non-invasive Cardiac Imaging Procedure (3206)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonInvasiveCardiacImagingProcedure3206);
/** 1.2.840.10008.6.1.763 Exercise ECG Summary Code (3208) */
export const ExerciseECGSummaryCode3208 = new DicomUID("1.2.840.10008.6.1.763", "Exercise ECG Summary Code (3208)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExerciseECGSummaryCode3208);
/** 1.2.840.10008.6.1.764 Stress Imaging Summary Code (3209) */
export const StressImagingSummaryCode3209 = new DicomUID("1.2.840.10008.6.1.764", "Stress Imaging Summary Code (3209)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressImagingSummaryCode3209);
/** 1.2.840.10008.6.1.765 Speed of Response (3210) */
export const SpeedOfResponse3210 = new DicomUID("1.2.840.10008.6.1.765", "Speed of Response (3210)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpeedOfResponse3210);
/** 1.2.840.10008.6.1.766 BP Response (3211) */
export const BPResponse3211 = new DicomUID("1.2.840.10008.6.1.766", "BP Response (3211)", DicomUidType.ContextGroupName, false);
DicomUID.register(BPResponse3211);
/** 1.2.840.10008.6.1.767 Treadmill Speed (3212) */
export const TreadmillSpeed3212 = new DicomUID("1.2.840.10008.6.1.767", "Treadmill Speed (3212)", DicomUidType.ContextGroupName, false);
DicomUID.register(TreadmillSpeed3212);
/** 1.2.840.10008.6.1.768 Stress Hemodynamic Finding (3213) */
export const StressHemodynamicFinding3213 = new DicomUID("1.2.840.10008.6.1.768", "Stress Hemodynamic Finding (3213)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressHemodynamicFinding3213);
/** 1.2.840.10008.6.1.769 Perfusion Finding Method (3215) */
export const PerfusionFindingMethod3215 = new DicomUID("1.2.840.10008.6.1.769", "Perfusion Finding Method (3215)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerfusionFindingMethod3215);
/** 1.2.840.10008.6.1.770 Comparison Finding (3217) */
export const ComparisonFinding3217 = new DicomUID("1.2.840.10008.6.1.770", "Comparison Finding (3217)", DicomUidType.ContextGroupName, false);
DicomUID.register(ComparisonFinding3217);
/** 1.2.840.10008.6.1.771 Stress Symptom (3220) */
export const StressSymptom3220 = new DicomUID("1.2.840.10008.6.1.771", "Stress Symptom (3220)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressSymptom3220);
/** 1.2.840.10008.6.1.772 Stress Test Termination Reason (3221) */
export const StressTestTerminationReason3221 = new DicomUID("1.2.840.10008.6.1.772", "Stress Test Termination Reason (3221)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressTestTerminationReason3221);
/** 1.2.840.10008.6.1.773 QTc Measurement (3227) */
export const QTcMeasurement3227 = new DicomUID("1.2.840.10008.6.1.773", "QTc Measurement (3227)", DicomUidType.ContextGroupName, false);
DicomUID.register(QTcMeasurement3227);
/** 1.2.840.10008.6.1.774 ECG Timing Measurement (3228) */
export const ECGTimingMeasurement3228 = new DicomUID("1.2.840.10008.6.1.774", "ECG Timing Measurement (3228)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGTimingMeasurement3228);
/** 1.2.840.10008.6.1.775 ECG Axis Measurement (3229) */
export const ECGAxisMeasurement3229 = new DicomUID("1.2.840.10008.6.1.775", "ECG Axis Measurement (3229)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGAxisMeasurement3229);
/** 1.2.840.10008.6.1.776 ECG Finding (3230) */
export const ECGFinding3230 = new DicomUID("1.2.840.10008.6.1.776", "ECG Finding (3230)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGFinding3230);
/** 1.2.840.10008.6.1.777 ST Segment Finding (3231) */
export const STSegmentFinding3231 = new DicomUID("1.2.840.10008.6.1.777", "ST Segment Finding (3231)", DicomUidType.ContextGroupName, false);
DicomUID.register(STSegmentFinding3231);
/** 1.2.840.10008.6.1.778 ST Segment Location (3232) */
export const STSegmentLocation3232 = new DicomUID("1.2.840.10008.6.1.778", "ST Segment Location (3232)", DicomUidType.ContextGroupName, false);
DicomUID.register(STSegmentLocation3232);
/** 1.2.840.10008.6.1.779 ST Segment Morphology (3233) */
export const STSegmentMorphology3233 = new DicomUID("1.2.840.10008.6.1.779", "ST Segment Morphology (3233)", DicomUidType.ContextGroupName, false);
DicomUID.register(STSegmentMorphology3233);
/** 1.2.840.10008.6.1.780 Ectopic Beat Morphology (3234) */
export const EctopicBeatMorphology3234 = new DicomUID("1.2.840.10008.6.1.780", "Ectopic Beat Morphology (3234)", DicomUidType.ContextGroupName, false);
DicomUID.register(EctopicBeatMorphology3234);
/** 1.2.840.10008.6.1.781 Perfusion Comparison Finding (3235) */
export const PerfusionComparisonFinding3235 = new DicomUID("1.2.840.10008.6.1.781", "Perfusion Comparison Finding (3235)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerfusionComparisonFinding3235);
/** 1.2.840.10008.6.1.782 Tolerance Comparison Finding (3236) */
export const ToleranceComparisonFinding3236 = new DicomUID("1.2.840.10008.6.1.782", "Tolerance Comparison Finding (3236)", DicomUidType.ContextGroupName, false);
DicomUID.register(ToleranceComparisonFinding3236);
/** 1.2.840.10008.6.1.783 Wall Motion Comparison Finding (3237) */
export const WallMotionComparisonFinding3237 = new DicomUID("1.2.840.10008.6.1.783", "Wall Motion Comparison Finding (3237)", DicomUidType.ContextGroupName, false);
DicomUID.register(WallMotionComparisonFinding3237);
/** 1.2.840.10008.6.1.784 Stress Scoring Scale (3238) */
export const StressScoringScale3238 = new DicomUID("1.2.840.10008.6.1.784", "Stress Scoring Scale (3238)", DicomUidType.ContextGroupName, false);
DicomUID.register(StressScoringScale3238);
/** 1.2.840.10008.6.1.785 Perceived Exertion Scale (3239) */
export const PerceivedExertionScale3239 = new DicomUID("1.2.840.10008.6.1.785", "Perceived Exertion Scale (3239)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerceivedExertionScale3239);
/** 1.2.840.10008.6.1.786 Ventricle Identification (3463) */
export const VentricleIdentification3463 = new DicomUID("1.2.840.10008.6.1.786", "Ventricle Identification (3463)", DicomUidType.ContextGroupName, false);
DicomUID.register(VentricleIdentification3463);
/** 1.2.840.10008.6.1.787 Colon Overall Assessment (6200) */
export const ColonOverallAssessment6200 = new DicomUID("1.2.840.10008.6.1.787", "Colon Overall Assessment (6200)", DicomUidType.ContextGroupName, false);
DicomUID.register(ColonOverallAssessment6200);
/** 1.2.840.10008.6.1.788 Colon Finding or Feature (6201) */
export const ColonFindingOrFeature6201 = new DicomUID("1.2.840.10008.6.1.788", "Colon Finding or Feature (6201)", DicomUidType.ContextGroupName, false);
DicomUID.register(ColonFindingOrFeature6201);
/** 1.2.840.10008.6.1.789 Colon Finding or Feature Modifier (6202) */
export const ColonFindingOrFeatureModifier6202 = new DicomUID("1.2.840.10008.6.1.789", "Colon Finding or Feature Modifier (6202)", DicomUidType.ContextGroupName, false);
DicomUID.register(ColonFindingOrFeatureModifier6202);
/** 1.2.840.10008.6.1.790 Colon Non-lesion Object Type (6203) */
export const ColonNonLesionObjectType6203 = new DicomUID("1.2.840.10008.6.1.790", "Colon Non-lesion Object Type (6203)", DicomUidType.ContextGroupName, false);
DicomUID.register(ColonNonLesionObjectType6203);
/** 1.2.840.10008.6.1.791 Anatomic Non-colon Finding (6204) */
export const AnatomicNonColonFinding6204 = new DicomUID("1.2.840.10008.6.1.791", "Anatomic Non-colon Finding (6204)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicNonColonFinding6204);
/** 1.2.840.10008.6.1.792 Clockface Location for Colon (6205) */
export const ClockfaceLocationForColon6205 = new DicomUID("1.2.840.10008.6.1.792", "Clockface Location for Colon (6205)", DicomUidType.ContextGroupName, false);
DicomUID.register(ClockfaceLocationForColon6205);
/** 1.2.840.10008.6.1.793 Recumbent Patient Orientation for Colon (6206) */
export const RecumbentPatientOrientationForColon6206 = new DicomUID("1.2.840.10008.6.1.793", "Recumbent Patient Orientation for Colon (6206)", DicomUidType.ContextGroupName, false);
DicomUID.register(RecumbentPatientOrientationForColon6206);
/** 1.2.840.10008.6.1.794 Colon Quantitative Temporal Difference Type (6207) */
export const ColonQuantitativeTemporalDifferenceType6207 = new DicomUID("1.2.840.10008.6.1.794", "Colon Quantitative Temporal Difference Type (6207)", DicomUidType.ContextGroupName, false);
DicomUID.register(ColonQuantitativeTemporalDifferenceType6207);
/** 1.2.840.10008.6.1.795 Colon Types of Quality Control Standard (6208) */
export const ColonTypesOfQualityControlStandard6208 = new DicomUID("1.2.840.10008.6.1.795", "Colon Types of Quality Control Standard (6208)", DicomUidType.ContextGroupName, false);
DicomUID.register(ColonTypesOfQualityControlStandard6208);
/** 1.2.840.10008.6.1.796 Colon Morphology Descriptor (6209) */
export const ColonMorphologyDescriptor6209 = new DicomUID("1.2.840.10008.6.1.796", "Colon Morphology Descriptor (6209)", DicomUidType.ContextGroupName, false);
DicomUID.register(ColonMorphologyDescriptor6209);
/** 1.2.840.10008.6.1.797 Location in Intestinal Tract (6210) */
export const LocationInIntestinalTract6210 = new DicomUID("1.2.840.10008.6.1.797", "Location in Intestinal Tract (6210)", DicomUidType.ContextGroupName, false);
DicomUID.register(LocationInIntestinalTract6210);
/** 1.2.840.10008.6.1.798 Colon CAD Material Description (6211) */
export const ColonCADMaterialDescription6211 = new DicomUID("1.2.840.10008.6.1.798", "Colon CAD Material Description (6211)", DicomUidType.ContextGroupName, false);
DicomUID.register(ColonCADMaterialDescription6211);
/** 1.2.840.10008.6.1.799 Calculated Value for Colon Finding (6212) */
export const CalculatedValueForColonFinding6212 = new DicomUID("1.2.840.10008.6.1.799", "Calculated Value for Colon Finding (6212)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalculatedValueForColonFinding6212);
/** 1.2.840.10008.6.1.800 Ophthalmic Horizontal Direction (4214) */
export const OphthalmicHorizontalDirection4214 = new DicomUID("1.2.840.10008.6.1.800", "Ophthalmic Horizontal Direction (4214)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicHorizontalDirection4214);
/** 1.2.840.10008.6.1.801 Ophthalmic Vertical Direction (4215) */
export const OphthalmicVerticalDirection4215 = new DicomUID("1.2.840.10008.6.1.801", "Ophthalmic Vertical Direction (4215)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicVerticalDirection4215);
/** 1.2.840.10008.6.1.802 Ophthalmic Visual Acuity Type (4216) */
export const OphthalmicVisualAcuityType4216 = new DicomUID("1.2.840.10008.6.1.802", "Ophthalmic Visual Acuity Type (4216)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicVisualAcuityType4216);
/** 1.2.840.10008.6.1.803 Arterial Pulse Waveform (3004) */
export const ArterialPulseWaveform3004 = new DicomUID("1.2.840.10008.6.1.803", "Arterial Pulse Waveform (3004)", DicomUidType.ContextGroupName, false);
DicomUID.register(ArterialPulseWaveform3004);
/** 1.2.840.10008.6.1.804 Respiration Waveform (3005) */
export const RespirationWaveform3005 = new DicomUID("1.2.840.10008.6.1.804", "Respiration Waveform (3005)", DicomUidType.ContextGroupName, false);
DicomUID.register(RespirationWaveform3005);
/** 1.2.840.10008.6.1.805 Ultrasound Contrast/Bolus Agent (12030) */
export const UltrasoundContrastBolusAgent12030 = new DicomUID("1.2.840.10008.6.1.805", "Ultrasound Contrast/Bolus Agent (12030)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundContrastBolusAgent12030);
/** 1.2.840.10008.6.1.806 Protocol Interval Event (12031) */
export const ProtocolIntervalEvent12031 = new DicomUID("1.2.840.10008.6.1.806", "Protocol Interval Event (12031)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProtocolIntervalEvent12031);
/** 1.2.840.10008.6.1.807 Transducer Scan Pattern (12032) */
export const TransducerScanPattern12032 = new DicomUID("1.2.840.10008.6.1.807", "Transducer Scan Pattern (12032)", DicomUidType.ContextGroupName, false);
DicomUID.register(TransducerScanPattern12032);
/** 1.2.840.10008.6.1.808 Ultrasound Transducer Geometry (12033) */
export const UltrasoundTransducerGeometry12033 = new DicomUID("1.2.840.10008.6.1.808", "Ultrasound Transducer Geometry (12033)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundTransducerGeometry12033);
/** 1.2.840.10008.6.1.809 Ultrasound Transducer Beam Steering (12034) */
export const UltrasoundTransducerBeamSteering12034 = new DicomUID("1.2.840.10008.6.1.809", "Ultrasound Transducer Beam Steering (12034)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundTransducerBeamSteering12034);
/** 1.2.840.10008.6.1.810 Ultrasound Transducer Application (12035) */
export const UltrasoundTransducerApplication12035 = new DicomUID("1.2.840.10008.6.1.810", "Ultrasound Transducer Application (12035)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundTransducerApplication12035);
/** 1.2.840.10008.6.1.811 Instance Availability Status (50) */
export const InstanceAvailabilityStatus50 = new DicomUID("1.2.840.10008.6.1.811", "Instance Availability Status (50)", DicomUidType.ContextGroupName, false);
DicomUID.register(InstanceAvailabilityStatus50);
/** 1.2.840.10008.6.1.812 Modality PPS Discontinuation Reason (9301) */
export const ModalityPPSDiscontinuationReason9301 = new DicomUID("1.2.840.10008.6.1.812", "Modality PPS Discontinuation Reason (9301)", DicomUidType.ContextGroupName, false);
DicomUID.register(ModalityPPSDiscontinuationReason9301);
/** 1.2.840.10008.6.1.813 Media Import PPS Discontinuation Reason (9302) */
export const MediaImportPPSDiscontinuationReason9302 = new DicomUID("1.2.840.10008.6.1.813", "Media Import PPS Discontinuation Reason (9302)", DicomUidType.ContextGroupName, false);
DicomUID.register(MediaImportPPSDiscontinuationReason9302);
/** 1.2.840.10008.6.1.814 DX Anatomy Imaged for Animal (7482) */
export const DXAnatomyImagedForAnimal7482 = new DicomUID("1.2.840.10008.6.1.814", "DX Anatomy Imaged for Animal (7482)", DicomUidType.ContextGroupName, false);
DicomUID.register(DXAnatomyImagedForAnimal7482);
/** 1.2.840.10008.6.1.815 Common Anatomic Regions for Animal (7483) */
export const CommonAnatomicRegionsForAnimal7483 = new DicomUID("1.2.840.10008.6.1.815", "Common Anatomic Regions for Animal (7483)", DicomUidType.ContextGroupName, false);
DicomUID.register(CommonAnatomicRegionsForAnimal7483);
/** 1.2.840.10008.6.1.816 DX View for Animal (7484) */
export const DXViewForAnimal7484 = new DicomUID("1.2.840.10008.6.1.816", "DX View for Animal (7484)", DicomUidType.ContextGroupName, false);
DicomUID.register(DXViewForAnimal7484);
/** 1.2.840.10008.6.1.817 Institutional Department/Unit/Service (7030) */
export const InstitutionalDepartmentUnitService7030 = new DicomUID("1.2.840.10008.6.1.817", "Institutional Department/Unit/Service (7030)", DicomUidType.ContextGroupName, false);
DicomUID.register(InstitutionalDepartmentUnitService7030);
/** 1.2.840.10008.6.1.818 Purpose of Reference to Predecessor Report (7009) */
export const PurposeOfReferenceToPredecessorReport7009 = new DicomUID("1.2.840.10008.6.1.818", "Purpose of Reference to Predecessor Report (7009)", DicomUidType.ContextGroupName, false);
DicomUID.register(PurposeOfReferenceToPredecessorReport7009);
/** 1.2.840.10008.6.1.819 Visual Fixation Quality During Acquisition (4220) */
export const VisualFixationQualityDuringAcquisition4220 = new DicomUID("1.2.840.10008.6.1.819", "Visual Fixation Quality During Acquisition (4220)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFixationQualityDuringAcquisition4220);
/** 1.2.840.10008.6.1.820 Visual Fixation Quality Problem (4221) */
export const VisualFixationQualityProblem4221 = new DicomUID("1.2.840.10008.6.1.820", "Visual Fixation Quality Problem (4221)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFixationQualityProblem4221);
/** 1.2.840.10008.6.1.821 Ophthalmic Macular Grid Problem (4222) */
export const OphthalmicMacularGridProblem4222 = new DicomUID("1.2.840.10008.6.1.821", "Ophthalmic Macular Grid Problem (4222)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicMacularGridProblem4222);
/** 1.2.840.10008.6.1.822 Organization (5002) */
export const Organization5002 = new DicomUID("1.2.840.10008.6.1.822", "Organization (5002)", DicomUidType.ContextGroupName, false);
DicomUID.register(Organization5002);
/** 1.2.840.10008.6.1.823 Mixed Breed (7486) */
export const MixedBreed7486 = new DicomUID("1.2.840.10008.6.1.823", "Mixed Breed (7486)", DicomUidType.ContextGroupName, false);
DicomUID.register(MixedBreed7486);
/** 1.2.840.10008.6.1.824 Broselow-Luten Pediatric Size Category (7040) */
export const BroselowLutenPediatricSizeCategory7040 = new DicomUID("1.2.840.10008.6.1.824", "Broselow-Luten Pediatric Size Category (7040)", DicomUidType.ContextGroupName, false);
DicomUID.register(BroselowLutenPediatricSizeCategory7040);
/** 1.2.840.10008.6.1.825 CMDCTECC Calcium Scoring Patient Size Category (7042) */
export const CMDCTECCCalciumScoringPatientSizeCategory7042 = new DicomUID("1.2.840.10008.6.1.825", "CMDCTECC Calcium Scoring Patient Size Category (7042)", DicomUidType.ContextGroupName, false);
DicomUID.register(CMDCTECCCalciumScoringPatientSizeCategory7042);
/** 1.2.840.10008.6.1.826 Cardiac Ultrasound Report Title (12245) */
export const CardiacUltrasoundReportTitle12245 = new DicomUID("1.2.840.10008.6.1.826", "Cardiac Ultrasound Report Title (12245)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundReportTitle12245);
/** 1.2.840.10008.6.1.827 Cardiac Ultrasound Indication for Study (12246) */
export const CardiacUltrasoundIndicationForStudy12246 = new DicomUID("1.2.840.10008.6.1.827", "Cardiac Ultrasound Indication for Study (12246)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundIndicationForStudy12246);
/** 1.2.840.10008.6.1.828 Pediatric, Fetal and Congenital Cardiac Surgical Intervention (12247) */
export const PediatricFetalAndCongenitalCardiacSurgicalIntervention12247 = new DicomUID("1.2.840.10008.6.1.828", "Pediatric, Fetal and Congenital Cardiac Surgical Intervention (12247)", DicomUidType.ContextGroupName, false);
DicomUID.register(PediatricFetalAndCongenitalCardiacSurgicalIntervention12247);
/** 1.2.840.10008.6.1.829 Cardiac Ultrasound Summary Code (12248) */
export const CardiacUltrasoundSummaryCode12248 = new DicomUID("1.2.840.10008.6.1.829", "Cardiac Ultrasound Summary Code (12248)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundSummaryCode12248);
/** 1.2.840.10008.6.1.830 Cardiac Ultrasound Fetal Summary Code (12249) */
export const CardiacUltrasoundFetalSummaryCode12249 = new DicomUID("1.2.840.10008.6.1.830", "Cardiac Ultrasound Fetal Summary Code (12249)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundFetalSummaryCode12249);
/** 1.2.840.10008.6.1.831 Cardiac Ultrasound Common Linear Measurement (12250) */
export const CardiacUltrasoundCommonLinearMeasurement12250 = new DicomUID("1.2.840.10008.6.1.831", "Cardiac Ultrasound Common Linear Measurement (12250)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundCommonLinearMeasurement12250);
/** 1.2.840.10008.6.1.832 Cardiac Ultrasound Linear Valve Measurement (12251) */
export const CardiacUltrasoundLinearValveMeasurement12251 = new DicomUID("1.2.840.10008.6.1.832", "Cardiac Ultrasound Linear Valve Measurement (12251)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundLinearValveMeasurement12251);
/** 1.2.840.10008.6.1.833 Cardiac Ultrasound Cardiac Function (12252) */
export const CardiacUltrasoundCardiacFunction12252 = new DicomUID("1.2.840.10008.6.1.833", "Cardiac Ultrasound Cardiac Function (12252)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundCardiacFunction12252);
/** 1.2.840.10008.6.1.834 Cardiac Ultrasound Area Measurement (12253) */
export const CardiacUltrasoundAreaMeasurement12253 = new DicomUID("1.2.840.10008.6.1.834", "Cardiac Ultrasound Area Measurement (12253)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAreaMeasurement12253);
/** 1.2.840.10008.6.1.835 Cardiac Ultrasound Hemodynamic Measurement (12254) */
export const CardiacUltrasoundHemodynamicMeasurement12254 = new DicomUID("1.2.840.10008.6.1.835", "Cardiac Ultrasound Hemodynamic Measurement (12254)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundHemodynamicMeasurement12254);
/** 1.2.840.10008.6.1.836 Cardiac Ultrasound Myocardium Measurement (12255) */
export const CardiacUltrasoundMyocardiumMeasurement12255 = new DicomUID("1.2.840.10008.6.1.836", "Cardiac Ultrasound Myocardium Measurement (12255)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundMyocardiumMeasurement12255);
/** 1.2.840.10008.6.1.838 Cardiac Ultrasound Left Ventricle Measurement (12257) */
export const CardiacUltrasoundLeftVentricleMeasurement12257 = new DicomUID("1.2.840.10008.6.1.838", "Cardiac Ultrasound Left Ventricle Measurement (12257)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundLeftVentricleMeasurement12257);
/** 1.2.840.10008.6.1.839 Cardiac Ultrasound Right Ventricle Measurement (12258) */
export const CardiacUltrasoundRightVentricleMeasurement12258 = new DicomUID("1.2.840.10008.6.1.839", "Cardiac Ultrasound Right Ventricle Measurement (12258)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundRightVentricleMeasurement12258);
/** 1.2.840.10008.6.1.840 Cardiac Ultrasound Ventricles Measurement (12259) */
export const CardiacUltrasoundVentriclesMeasurement12259 = new DicomUID("1.2.840.10008.6.1.840", "Cardiac Ultrasound Ventricles Measurement (12259)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundVentriclesMeasurement12259);
/** 1.2.840.10008.6.1.841 Cardiac Ultrasound Pulmonary Artery Measurement (12260) */
export const CardiacUltrasoundPulmonaryArteryMeasurement12260 = new DicomUID("1.2.840.10008.6.1.841", "Cardiac Ultrasound Pulmonary Artery Measurement (12260)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundPulmonaryArteryMeasurement12260);
/** 1.2.840.10008.6.1.842 Cardiac Ultrasound Pulmonary Vein (12261) */
export const CardiacUltrasoundPulmonaryVein12261 = new DicomUID("1.2.840.10008.6.1.842", "Cardiac Ultrasound Pulmonary Vein (12261)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundPulmonaryVein12261);
/** 1.2.840.10008.6.1.843 Cardiac Ultrasound Pulmonary Valve Measurement (12262) */
export const CardiacUltrasoundPulmonaryValveMeasurement12262 = new DicomUID("1.2.840.10008.6.1.843", "Cardiac Ultrasound Pulmonary Valve Measurement (12262)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundPulmonaryValveMeasurement12262);
/** 1.2.840.10008.6.1.844 Cardiac Ultrasound Venous Return Pulmonary Measurement (12263) */
export const CardiacUltrasoundVenousReturnPulmonaryMeasurement12263 = new DicomUID("1.2.840.10008.6.1.844", "Cardiac Ultrasound Venous Return Pulmonary Measurement (12263)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundVenousReturnPulmonaryMeasurement12263);
/** 1.2.840.10008.6.1.845 Cardiac Ultrasound Venous Return Systemic Measurement (12264) */
export const CardiacUltrasoundVenousReturnSystemicMeasurement12264 = new DicomUID("1.2.840.10008.6.1.845", "Cardiac Ultrasound Venous Return Systemic Measurement (12264)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundVenousReturnSystemicMeasurement12264);
/** 1.2.840.10008.6.1.846 Cardiac Ultrasound Atria and Atrial Septum Measurement (12265) */
export const CardiacUltrasoundAtriaAndAtrialSeptumMeasurement12265 = new DicomUID("1.2.840.10008.6.1.846", "Cardiac Ultrasound Atria and Atrial Septum Measurement (12265)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAtriaAndAtrialSeptumMeasurement12265);
/** 1.2.840.10008.6.1.847 Cardiac Ultrasound Mitral Valve Measurement (12266) */
export const CardiacUltrasoundMitralValveMeasurement12266 = new DicomUID("1.2.840.10008.6.1.847", "Cardiac Ultrasound Mitral Valve Measurement (12266)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundMitralValveMeasurement12266);
/** 1.2.840.10008.6.1.848 Cardiac Ultrasound Tricuspid Valve Measurement (12267) */
export const CardiacUltrasoundTricuspidValveMeasurement12267 = new DicomUID("1.2.840.10008.6.1.848", "Cardiac Ultrasound Tricuspid Valve Measurement (12267)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundTricuspidValveMeasurement12267);
/** 1.2.840.10008.6.1.849 Cardiac Ultrasound Atrioventricular Valve Measurement (12268) */
export const CardiacUltrasoundAtrioventricularValveMeasurement12268 = new DicomUID("1.2.840.10008.6.1.849", "Cardiac Ultrasound Atrioventricular Valve Measurement (12268)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAtrioventricularValveMeasurement12268);
/** 1.2.840.10008.6.1.850 Cardiac Ultrasound Interventricular Septum Measurement (12269) */
export const CardiacUltrasoundInterventricularSeptumMeasurement12269 = new DicomUID("1.2.840.10008.6.1.850", "Cardiac Ultrasound Interventricular Septum Measurement (12269)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundInterventricularSeptumMeasurement12269);
/** 1.2.840.10008.6.1.851 Cardiac Ultrasound Aortic Valve Measurement (12270) */
export const CardiacUltrasoundAorticValveMeasurement12270 = new DicomUID("1.2.840.10008.6.1.851", "Cardiac Ultrasound Aortic Valve Measurement (12270)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAorticValveMeasurement12270);
/** 1.2.840.10008.6.1.852 Cardiac Ultrasound Outflow Tract Measurement (12271) */
export const CardiacUltrasoundOutflowTractMeasurement12271 = new DicomUID("1.2.840.10008.6.1.852", "Cardiac Ultrasound Outflow Tract Measurement (12271)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundOutflowTractMeasurement12271);
/** 1.2.840.10008.6.1.853 Cardiac Ultrasound Semilunar Valve, Annulate and Sinus Measurement (12272) */
export const CardiacUltrasoundSemilunarValveAnnulateAndSinusMeasurement12272 = new DicomUID("1.2.840.10008.6.1.853", "Cardiac Ultrasound Semilunar Valve, Annulate and Sinus Measurement (12272)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundSemilunarValveAnnulateAndSinusMeasurement12272);
/** 1.2.840.10008.6.1.854 Cardiac Ultrasound Aortic Sinotubular Junction Measurement (12273) */
export const CardiacUltrasoundAorticSinotubularJunctionMeasurement12273 = new DicomUID("1.2.840.10008.6.1.854", "Cardiac Ultrasound Aortic Sinotubular Junction Measurement (12273)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAorticSinotubularJunctionMeasurement12273);
/** 1.2.840.10008.6.1.855 Cardiac Ultrasound Aorta Measurement (12274) */
export const CardiacUltrasoundAortaMeasurement12274 = new DicomUID("1.2.840.10008.6.1.855", "Cardiac Ultrasound Aorta Measurement (12274)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAortaMeasurement12274);
/** 1.2.840.10008.6.1.856 Cardiac Ultrasound Coronary Artery Measurement (12275) */
export const CardiacUltrasoundCoronaryArteryMeasurement12275 = new DicomUID("1.2.840.10008.6.1.856", "Cardiac Ultrasound Coronary Artery Measurement (12275)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundCoronaryArteryMeasurement12275);
/** 1.2.840.10008.6.1.857 Cardiac Ultrasound Aorto Pulmonary Connection Measurement (12276) */
export const CardiacUltrasoundAortoPulmonaryConnectionMeasurement12276 = new DicomUID("1.2.840.10008.6.1.857", "Cardiac Ultrasound Aorto Pulmonary Connection Measurement (12276)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAortoPulmonaryConnectionMeasurement12276);
/** 1.2.840.10008.6.1.858 Cardiac Ultrasound Pericardium and Pleura Measurement (12277) */
export const CardiacUltrasoundPericardiumAndPleuraMeasurement12277 = new DicomUID("1.2.840.10008.6.1.858", "Cardiac Ultrasound Pericardium and Pleura Measurement (12277)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundPericardiumAndPleuraMeasurement12277);
/** 1.2.840.10008.6.1.859 Cardiac Ultrasound Fetal General Measurement (12279) */
export const CardiacUltrasoundFetalGeneralMeasurement12279 = new DicomUID("1.2.840.10008.6.1.859", "Cardiac Ultrasound Fetal General Measurement (12279)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundFetalGeneralMeasurement12279);
/** 1.2.840.10008.6.1.860 Cardiac Ultrasound Target Site (12280) */
export const CardiacUltrasoundTargetSite12280 = new DicomUID("1.2.840.10008.6.1.860", "Cardiac Ultrasound Target Site (12280)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundTargetSite12280);
/** 1.2.840.10008.6.1.861 Cardiac Ultrasound Target Site Modifier (12281) */
export const CardiacUltrasoundTargetSiteModifier12281 = new DicomUID("1.2.840.10008.6.1.861", "Cardiac Ultrasound Target Site Modifier (12281)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundTargetSiteModifier12281);
/** 1.2.840.10008.6.1.862 Cardiac Ultrasound Venous Return Systemic Finding Site (12282) */
export const CardiacUltrasoundVenousReturnSystemicFindingSite12282 = new DicomUID("1.2.840.10008.6.1.862", "Cardiac Ultrasound Venous Return Systemic Finding Site (12282)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundVenousReturnSystemicFindingSite12282);
/** 1.2.840.10008.6.1.863 Cardiac Ultrasound Venous Return Pulmonary Finding Site (12283) */
export const CardiacUltrasoundVenousReturnPulmonaryFindingSite12283 = new DicomUID("1.2.840.10008.6.1.863", "Cardiac Ultrasound Venous Return Pulmonary Finding Site (12283)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundVenousReturnPulmonaryFindingSite12283);
/** 1.2.840.10008.6.1.864 Cardiac Ultrasound Atria and Atrial Septum Finding Site (12284) */
export const CardiacUltrasoundAtriaAndAtrialSeptumFindingSite12284 = new DicomUID("1.2.840.10008.6.1.864", "Cardiac Ultrasound Atria and Atrial Septum Finding Site (12284)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAtriaAndAtrialSeptumFindingSite12284);
/** 1.2.840.10008.6.1.865 Cardiac Ultrasound Atrioventricular Valve Finding Site (12285) */
export const CardiacUltrasoundAtrioventricularValveFindingSite12285 = new DicomUID("1.2.840.10008.6.1.865", "Cardiac Ultrasound Atrioventricular Valve Finding Site (12285)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAtrioventricularValveFindingSite12285);
/** 1.2.840.10008.6.1.866 Cardiac Ultrasound Interventricular Septum Finding Site (12286) */
export const CardiacUltrasoundInterventricularSeptumFindingSite12286 = new DicomUID("1.2.840.10008.6.1.866", "Cardiac Ultrasound Interventricular Septum Finding Site (12286)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundInterventricularSeptumFindingSite12286);
/** 1.2.840.10008.6.1.867 Cardiac Ultrasound Ventricle Finding Site (12287) */
export const CardiacUltrasoundVentricleFindingSite12287 = new DicomUID("1.2.840.10008.6.1.867", "Cardiac Ultrasound Ventricle Finding Site (12287)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundVentricleFindingSite12287);
/** 1.2.840.10008.6.1.868 Cardiac Ultrasound Outflow Tract Finding Site (12288) */
export const CardiacUltrasoundOutflowTractFindingSite12288 = new DicomUID("1.2.840.10008.6.1.868", "Cardiac Ultrasound Outflow Tract Finding Site (12288)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundOutflowTractFindingSite12288);
/** 1.2.840.10008.6.1.869 Cardiac Ultrasound Semilunar Valve, Annulus and Sinus Finding Site (12289) */
export const CardiacUltrasoundSemilunarValveAnnulusAndSinusFindingSite12289 = new DicomUID("1.2.840.10008.6.1.869", "Cardiac Ultrasound Semilunar Valve, Annulus and Sinus Finding Site (12289)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundSemilunarValveAnnulusAndSinusFindingSite12289);
/** 1.2.840.10008.6.1.870 Cardiac Ultrasound Pulmonary Artery Finding Site (12290) */
export const CardiacUltrasoundPulmonaryArteryFindingSite12290 = new DicomUID("1.2.840.10008.6.1.870", "Cardiac Ultrasound Pulmonary Artery Finding Site (12290)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundPulmonaryArteryFindingSite12290);
/** 1.2.840.10008.6.1.871 Cardiac Ultrasound Aorta Finding Site (12291) */
export const CardiacUltrasoundAortaFindingSite12291 = new DicomUID("1.2.840.10008.6.1.871", "Cardiac Ultrasound Aorta Finding Site (12291)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAortaFindingSite12291);
/** 1.2.840.10008.6.1.872 Cardiac Ultrasound Coronary Artery Finding Site (12292) */
export const CardiacUltrasoundCoronaryArteryFindingSite12292 = new DicomUID("1.2.840.10008.6.1.872", "Cardiac Ultrasound Coronary Artery Finding Site (12292)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundCoronaryArteryFindingSite12292);
/** 1.2.840.10008.6.1.873 Cardiac Ultrasound Aortopulmonary Connection Finding Site (12293) */
export const CardiacUltrasoundAortopulmonaryConnectionFindingSite12293 = new DicomUID("1.2.840.10008.6.1.873", "Cardiac Ultrasound Aortopulmonary Connection Finding Site (12293)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundAortopulmonaryConnectionFindingSite12293);
/** 1.2.840.10008.6.1.874 Cardiac Ultrasound Pericardium and Pleura Finding Site (12294) */
export const CardiacUltrasoundPericardiumAndPleuraFindingSite12294 = new DicomUID("1.2.840.10008.6.1.874", "Cardiac Ultrasound Pericardium and Pleura Finding Site (12294)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundPericardiumAndPleuraFindingSite12294);
/** 1.2.840.10008.6.1.876 Ophthalmic Ultrasound Axial Measurements Type (4230) */
export const OphthalmicUltrasoundAxialMeasurementsType4230 = new DicomUID("1.2.840.10008.6.1.876", "Ophthalmic Ultrasound Axial Measurements Type (4230)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicUltrasoundAxialMeasurementsType4230);
/** 1.2.840.10008.6.1.877 Lens Status (4231) */
export const LensStatus4231 = new DicomUID("1.2.840.10008.6.1.877", "Lens Status (4231)", DicomUidType.ContextGroupName, false);
DicomUID.register(LensStatus4231);
/** 1.2.840.10008.6.1.878 Vitreous Status (4232) */
export const VitreousStatus4232 = new DicomUID("1.2.840.10008.6.1.878", "Vitreous Status (4232)", DicomUidType.ContextGroupName, false);
DicomUID.register(VitreousStatus4232);
/** 1.2.840.10008.6.1.879 Ophthalmic Axial Length Measurements Segment Name (4233) */
export const OphthalmicAxialLengthMeasurementsSegmentName4233 = new DicomUID("1.2.840.10008.6.1.879", "Ophthalmic Axial Length Measurements Segment Name (4233)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicAxialLengthMeasurementsSegmentName4233);
/** 1.2.840.10008.6.1.880 Refractive Surgery Type (4234) */
export const RefractiveSurgeryType4234 = new DicomUID("1.2.840.10008.6.1.880", "Refractive Surgery Type (4234)", DicomUidType.ContextGroupName, false);
DicomUID.register(RefractiveSurgeryType4234);
/** 1.2.840.10008.6.1.881 Keratometry Descriptor (4235) */
export const KeratometryDescriptor4235 = new DicomUID("1.2.840.10008.6.1.881", "Keratometry Descriptor (4235)", DicomUidType.ContextGroupName, false);
DicomUID.register(KeratometryDescriptor4235);
/** 1.2.840.10008.6.1.882 IOL Calculation Formula (4236) */
export const IOLCalculationFormula4236 = new DicomUID("1.2.840.10008.6.1.882", "IOL Calculation Formula (4236)", DicomUidType.ContextGroupName, false);
DicomUID.register(IOLCalculationFormula4236);
/** 1.2.840.10008.6.1.883 Lens Constant Type (4237) */
export const LensConstantType4237 = new DicomUID("1.2.840.10008.6.1.883", "Lens Constant Type (4237)", DicomUidType.ContextGroupName, false);
DicomUID.register(LensConstantType4237);
/** 1.2.840.10008.6.1.884 Refractive Error Type (4238) */
export const RefractiveErrorType4238 = new DicomUID("1.2.840.10008.6.1.884", "Refractive Error Type (4238)", DicomUidType.ContextGroupName, false);
DicomUID.register(RefractiveErrorType4238);
/** 1.2.840.10008.6.1.885 Anterior Chamber Depth Definition (4239) */
export const AnteriorChamberDepthDefinition4239 = new DicomUID("1.2.840.10008.6.1.885", "Anterior Chamber Depth Definition (4239)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnteriorChamberDepthDefinition4239);
/** 1.2.840.10008.6.1.886 Ophthalmic Measurement or Calculation Data Source (4240) */
export const OphthalmicMeasurementOrCalculationDataSource4240 = new DicomUID("1.2.840.10008.6.1.886", "Ophthalmic Measurement or Calculation Data Source (4240)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicMeasurementOrCalculationDataSource4240);
/** 1.2.840.10008.6.1.887 Ophthalmic Axial Length Selection Method (4241) */
export const OphthalmicAxialLengthSelectionMethod4241 = new DicomUID("1.2.840.10008.6.1.887", "Ophthalmic Axial Length Selection Method (4241)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicAxialLengthSelectionMethod4241);
/** 1.2.840.10008.6.1.889 Ophthalmic Quality Metric Type (4243) */
export const OphthalmicQualityMetricType4243 = new DicomUID("1.2.840.10008.6.1.889", "Ophthalmic Quality Metric Type (4243)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicQualityMetricType4243);
/** 1.2.840.10008.6.1.890 Ophthalmic Agent Concentration Unit (4244) */
export const OphthalmicAgentConcentrationUnit4244 = new DicomUID("1.2.840.10008.6.1.890", "Ophthalmic Agent Concentration Unit (4244)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicAgentConcentrationUnit4244);
/** 1.2.840.10008.6.1.891 Functional Condition Present During Acquisition (91) */
export const FunctionalConditionPresentDuringAcquisition91 = new DicomUID("1.2.840.10008.6.1.891", "Functional Condition Present During Acquisition (91)", DicomUidType.ContextGroupName, false);
DicomUID.register(FunctionalConditionPresentDuringAcquisition91);
/** 1.2.840.10008.6.1.892 Joint Position During Acquisition (92) */
export const JointPositionDuringAcquisition92 = new DicomUID("1.2.840.10008.6.1.892", "Joint Position During Acquisition (92)", DicomUidType.ContextGroupName, false);
DicomUID.register(JointPositionDuringAcquisition92);
/** 1.2.840.10008.6.1.893 Joint Positioning Method (93) */
export const JointPositioningMethod93 = new DicomUID("1.2.840.10008.6.1.893", "Joint Positioning Method (93)", DicomUidType.ContextGroupName, false);
DicomUID.register(JointPositioningMethod93);
/** 1.2.840.10008.6.1.894 Physical Force Applied During Acquisition (94) */
export const PhysicalForceAppliedDuringAcquisition94 = new DicomUID("1.2.840.10008.6.1.894", "Physical Force Applied During Acquisition (94)", DicomUidType.ContextGroupName, false);
DicomUID.register(PhysicalForceAppliedDuringAcquisition94);
/** 1.2.840.10008.6.1.895 ECG Control Numeric Variable (3690) */
export const ECGControlNumericVariable3690 = new DicomUID("1.2.840.10008.6.1.895", "ECG Control Numeric Variable (3690)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGControlNumericVariable3690);
/** 1.2.840.10008.6.1.896 ECG Control Text Variable (3691) */
export const ECGControlTextVariable3691 = new DicomUID("1.2.840.10008.6.1.896", "ECG Control Text Variable (3691)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGControlTextVariable3691);
/** 1.2.840.10008.6.1.897 Whole Slide Microscopy Image Referenced Image Purpose of Reference (8120) */
export const WholeSlideMicroscopyImageReferencedImagePurposeOfReference8120 = new DicomUID("1.2.840.10008.6.1.897", "Whole Slide Microscopy Image Referenced Image Purpose of Reference (8120)", DicomUidType.ContextGroupName, false);
DicomUID.register(WholeSlideMicroscopyImageReferencedImagePurposeOfReference8120);
/** 1.2.840.10008.6.1.898 Microscopy Lens Type (8121) */
export const MicroscopyLensType8121 = new DicomUID("1.2.840.10008.6.1.898", "Microscopy Lens Type (8121)", DicomUidType.ContextGroupName, false);
DicomUID.register(MicroscopyLensType8121);
/** 1.2.840.10008.6.1.899 Microscopy Illuminator and Sensor Color (8122) */
export const MicroscopyIlluminatorAndSensorColor8122 = new DicomUID("1.2.840.10008.6.1.899", "Microscopy Illuminator and Sensor Color (8122)", DicomUidType.ContextGroupName, false);
DicomUID.register(MicroscopyIlluminatorAndSensorColor8122);
/** 1.2.840.10008.6.1.900 Microscopy Illumination Method (8123) */
export const MicroscopyIlluminationMethod8123 = new DicomUID("1.2.840.10008.6.1.900", "Microscopy Illumination Method (8123)", DicomUidType.ContextGroupName, false);
DicomUID.register(MicroscopyIlluminationMethod8123);
/** 1.2.840.10008.6.1.901 Microscopy Filter (8124) */
export const MicroscopyFilter8124 = new DicomUID("1.2.840.10008.6.1.901", "Microscopy Filter (8124)", DicomUidType.ContextGroupName, false);
DicomUID.register(MicroscopyFilter8124);
/** 1.2.840.10008.6.1.902 Microscopy Illuminator Type (8125) */
export const MicroscopyIlluminatorType8125 = new DicomUID("1.2.840.10008.6.1.902", "Microscopy Illuminator Type (8125)", DicomUidType.ContextGroupName, false);
DicomUID.register(MicroscopyIlluminatorType8125);
/** 1.2.840.10008.6.1.903 Audit Event ID (400) */
export const AuditEventID400 = new DicomUID("1.2.840.10008.6.1.903", "Audit Event ID (400)", DicomUidType.ContextGroupName, false);
DicomUID.register(AuditEventID400);
/** 1.2.840.10008.6.1.904 Audit Event Type Code (401) */
export const AuditEventTypeCode401 = new DicomUID("1.2.840.10008.6.1.904", "Audit Event Type Code (401)", DicomUidType.ContextGroupName, false);
DicomUID.register(AuditEventTypeCode401);
/** 1.2.840.10008.6.1.905 Audit Active Participant Role ID Code (402) */
export const AuditActiveParticipantRoleIDCode402 = new DicomUID("1.2.840.10008.6.1.905", "Audit Active Participant Role ID Code (402)", DicomUidType.ContextGroupName, false);
DicomUID.register(AuditActiveParticipantRoleIDCode402);
/** 1.2.840.10008.6.1.906 Security Alert Type Code (403) */
export const SecurityAlertTypeCode403 = new DicomUID("1.2.840.10008.6.1.906", "Security Alert Type Code (403)", DicomUidType.ContextGroupName, false);
DicomUID.register(SecurityAlertTypeCode403);
/** 1.2.840.10008.6.1.907 Audit Participant Object ID Type Code (404) */
export const AuditParticipantObjectIDTypeCode404 = new DicomUID("1.2.840.10008.6.1.907", "Audit Participant Object ID Type Code (404)", DicomUidType.ContextGroupName, false);
DicomUID.register(AuditParticipantObjectIDTypeCode404);
/** 1.2.840.10008.6.1.908 Media Type Code (405) */
export const MediaTypeCode405 = new DicomUID("1.2.840.10008.6.1.908", "Media Type Code (405)", DicomUidType.ContextGroupName, false);
DicomUID.register(MediaTypeCode405);
/** 1.2.840.10008.6.1.909 Visual Field Static Perimetry Test Pattern (4250) */
export const VisualFieldStaticPerimetryTestPattern4250 = new DicomUID("1.2.840.10008.6.1.909", "Visual Field Static Perimetry Test Pattern (4250)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFieldStaticPerimetryTestPattern4250);
/** 1.2.840.10008.6.1.910 Visual Field Static Perimetry Test Strategy (4251) */
export const VisualFieldStaticPerimetryTestStrategy4251 = new DicomUID("1.2.840.10008.6.1.910", "Visual Field Static Perimetry Test Strategy (4251)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFieldStaticPerimetryTestStrategy4251);
/** 1.2.840.10008.6.1.911 Visual Field Static Perimetry Screening Test Mode (4252) */
export const VisualFieldStaticPerimetryScreeningTestMode4252 = new DicomUID("1.2.840.10008.6.1.911", "Visual Field Static Perimetry Screening Test Mode (4252)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFieldStaticPerimetryScreeningTestMode4252);
/** 1.2.840.10008.6.1.912 Visual Field Static Perimetry Fixation Strategy (4253) */
export const VisualFieldStaticPerimetryFixationStrategy4253 = new DicomUID("1.2.840.10008.6.1.912", "Visual Field Static Perimetry Fixation Strategy (4253)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFieldStaticPerimetryFixationStrategy4253);
/** 1.2.840.10008.6.1.913 Visual Field Static Perimetry Test Analysis Result (4254) */
export const VisualFieldStaticPerimetryTestAnalysisResult4254 = new DicomUID("1.2.840.10008.6.1.913", "Visual Field Static Perimetry Test Analysis Result (4254)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFieldStaticPerimetryTestAnalysisResult4254);
/** 1.2.840.10008.6.1.914 Visual Field Illumination Color (4255) */
export const VisualFieldIlluminationColor4255 = new DicomUID("1.2.840.10008.6.1.914", "Visual Field Illumination Color (4255)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFieldIlluminationColor4255);
/** 1.2.840.10008.6.1.915 Visual Field Procedure Modifier (4256) */
export const VisualFieldProcedureModifier4256 = new DicomUID("1.2.840.10008.6.1.915", "Visual Field Procedure Modifier (4256)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFieldProcedureModifier4256);
/** 1.2.840.10008.6.1.916 Visual Field Global Index Name (4257) */
export const VisualFieldGlobalIndexName4257 = new DicomUID("1.2.840.10008.6.1.916", "Visual Field Global Index Name (4257)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFieldGlobalIndexName4257);
/** 1.2.840.10008.6.1.917 Abstract Multi-dimensional Image Model Component Semantic (7180) */
export const AbstractMultiDimensionalImageModelComponentSemantic7180 = new DicomUID("1.2.840.10008.6.1.917", "Abstract Multi-dimensional Image Model Component Semantic (7180)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbstractMultiDimensionalImageModelComponentSemantic7180);
/** 1.2.840.10008.6.1.918 Abstract Multi-dimensional Image Model Component Unit (7181) */
export const AbstractMultiDimensionalImageModelComponentUnit7181 = new DicomUID("1.2.840.10008.6.1.918", "Abstract Multi-dimensional Image Model Component Unit (7181)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbstractMultiDimensionalImageModelComponentUnit7181);
/** 1.2.840.10008.6.1.919 Abstract Multi-dimensional Image Model Dimension Semantic (7182) */
export const AbstractMultiDimensionalImageModelDimensionSemantic7182 = new DicomUID("1.2.840.10008.6.1.919", "Abstract Multi-dimensional Image Model Dimension Semantic (7182)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbstractMultiDimensionalImageModelDimensionSemantic7182);
/** 1.2.840.10008.6.1.920 Abstract Multi-dimensional Image Model Dimension Unit (7183) */
export const AbstractMultiDimensionalImageModelDimensionUnit7183 = new DicomUID("1.2.840.10008.6.1.920", "Abstract Multi-dimensional Image Model Dimension Unit (7183)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbstractMultiDimensionalImageModelDimensionUnit7183);
/** 1.2.840.10008.6.1.921 Abstract Multi-dimensional Image Model Axis Direction (7184) */
export const AbstractMultiDimensionalImageModelAxisDirection7184 = new DicomUID("1.2.840.10008.6.1.921", "Abstract Multi-dimensional Image Model Axis Direction (7184)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbstractMultiDimensionalImageModelAxisDirection7184);
/** 1.2.840.10008.6.1.922 Abstract Multi-dimensional Image Model Axis Orientation (7185) */
export const AbstractMultiDimensionalImageModelAxisOrientation7185 = new DicomUID("1.2.840.10008.6.1.922", "Abstract Multi-dimensional Image Model Axis Orientation (7185)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbstractMultiDimensionalImageModelAxisOrientation7185);
/** 1.2.840.10008.6.1.923 Abstract Multi-dimensional Image Model Qualitative Dimension Sample Semantic (7186) */
export const AbstractMultiDimensionalImageModelQualitativeDimensionSampleSemantic7186 = new DicomUID("1.2.840.10008.6.1.923", "Abstract Multi-dimensional Image Model Qualitative Dimension Sample Semantic (7186)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbstractMultiDimensionalImageModelQualitativeDimensionSampleSemantic7186);
/** 1.2.840.10008.6.1.924 Planning Method (7320) */
export const PlanningMethod7320 = new DicomUID("1.2.840.10008.6.1.924", "Planning Method (7320)", DicomUidType.ContextGroupName, false);
DicomUID.register(PlanningMethod7320);
/** 1.2.840.10008.6.1.925 De-identification Method (7050) */
export const DeIdentificationMethod7050 = new DicomUID("1.2.840.10008.6.1.925", "De-identification Method (7050)", DicomUidType.ContextGroupName, false);
DicomUID.register(DeIdentificationMethod7050);
/** 1.2.840.10008.6.1.926 Measurement Orientation (12118) */
export const MeasurementOrientation12118 = new DicomUID("1.2.840.10008.6.1.926", "Measurement Orientation (12118)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasurementOrientation12118);
/** 1.2.840.10008.6.1.927 ECG Global Waveform Duration (3689) */
export const ECGGlobalWaveformDuration3689 = new DicomUID("1.2.840.10008.6.1.927", "ECG Global Waveform Duration (3689)", DicomUidType.ContextGroupName, false);
DicomUID.register(ECGGlobalWaveformDuration3689);
/** 1.2.840.10008.6.1.930 ICD (3692) */
export const ICD3692 = new DicomUID("1.2.840.10008.6.1.930", "ICD (3692)", DicomUidType.ContextGroupName, false);
DicomUID.register(ICD3692);
/** 1.2.840.10008.6.1.931 Radiotherapy General Workitem Definition (9241) */
export const RadiotherapyGeneralWorkitemDefinition9241 = new DicomUID("1.2.840.10008.6.1.931", "Radiotherapy General Workitem Definition (9241)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyGeneralWorkitemDefinition9241);
/** 1.2.840.10008.6.1.932 Radiotherapy Acquisition Workitem Definition (9242) */
export const RadiotherapyAcquisitionWorkitemDefinition9242 = new DicomUID("1.2.840.10008.6.1.932", "Radiotherapy Acquisition Workitem Definition (9242)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyAcquisitionWorkitemDefinition9242);
/** 1.2.840.10008.6.1.933 Radiotherapy Registration Workitem Definition (9243) */
export const RadiotherapyRegistrationWorkitemDefinition9243 = new DicomUID("1.2.840.10008.6.1.933", "Radiotherapy Registration Workitem Definition (9243)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyRegistrationWorkitemDefinition9243);
/** 1.2.840.10008.6.1.934 Contrast Bolus Substance (3850) */
export const ContrastBolusSubstance3850 = new DicomUID("1.2.840.10008.6.1.934", "Contrast Bolus Substance (3850)", DicomUidType.ContextGroupName, false);
DicomUID.register(ContrastBolusSubstance3850);
/** 1.2.840.10008.6.1.935 Label Type (10022) */
export const LabelType10022 = new DicomUID("1.2.840.10008.6.1.935", "Label Type (10022)", DicomUidType.ContextGroupName, false);
DicomUID.register(LabelType10022);
/** 1.2.840.10008.6.1.936 Ophthalmic Mapping Unit for Real World Value Mapping (4260) */
export const OphthalmicMappingUnitForRealWorldValueMapping4260 = new DicomUID("1.2.840.10008.6.1.936", "Ophthalmic Mapping Unit for Real World Value Mapping (4260)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicMappingUnitForRealWorldValueMapping4260);
/** 1.2.840.10008.6.1.937 Ophthalmic Mapping Acquisition Method (4261) */
export const OphthalmicMappingAcquisitionMethod4261 = new DicomUID("1.2.840.10008.6.1.937", "Ophthalmic Mapping Acquisition Method (4261)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicMappingAcquisitionMethod4261);
/** 1.2.840.10008.6.1.938 Retinal Thickness Definition (4262) */
export const RetinalThicknessDefinition4262 = new DicomUID("1.2.840.10008.6.1.938", "Retinal Thickness Definition (4262)", DicomUidType.ContextGroupName, false);
DicomUID.register(RetinalThicknessDefinition4262);
/** 1.2.840.10008.6.1.939 Ophthalmic Thickness Map Value Type (4263) */
export const OphthalmicThicknessMapValueType4263 = new DicomUID("1.2.840.10008.6.1.939", "Ophthalmic Thickness Map Value Type (4263)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicThicknessMapValueType4263);
/** 1.2.840.10008.6.1.940 Ophthalmic Map Purpose of Reference (4264) */
export const OphthalmicMapPurposeOfReference4264 = new DicomUID("1.2.840.10008.6.1.940", "Ophthalmic Map Purpose of Reference (4264)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicMapPurposeOfReference4264);
/** 1.2.840.10008.6.1.941 Ophthalmic Thickness Deviation Category (4265) */
export const OphthalmicThicknessDeviationCategory4265 = new DicomUID("1.2.840.10008.6.1.941", "Ophthalmic Thickness Deviation Category (4265)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicThicknessDeviationCategory4265);
/** 1.2.840.10008.6.1.942 Ophthalmic Anatomic Structure Reference Point (4266) */
export const OphthalmicAnatomicStructureReferencePoint4266 = new DicomUID("1.2.840.10008.6.1.942", "Ophthalmic Anatomic Structure Reference Point (4266)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicAnatomicStructureReferencePoint4266);
/** 1.2.840.10008.6.1.943 Cardiac Synchronization Technique (3104) */
export const CardiacSynchronizationTechnique3104 = new DicomUID("1.2.840.10008.6.1.943", "Cardiac Synchronization Technique (3104)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacSynchronizationTechnique3104);
/** 1.2.840.10008.6.1.944 Staining Protocol (8130) */
export const StainingProtocol8130 = new DicomUID("1.2.840.10008.6.1.944", "Staining Protocol (8130)", DicomUidType.ContextGroupName, false);
DicomUID.register(StainingProtocol8130);
/** 1.2.840.10008.6.1.947 Size Specific Dose Estimation Method for CT (10023) */
export const SizeSpecificDoseEstimationMethodForCT10023 = new DicomUID("1.2.840.10008.6.1.947", "Size Specific Dose Estimation Method for CT (10023)", DicomUidType.ContextGroupName, false);
DicomUID.register(SizeSpecificDoseEstimationMethodForCT10023);
/** 1.2.840.10008.6.1.948 Pathology Imaging Protocol (8131) */
export const PathologyImagingProtocol8131 = new DicomUID("1.2.840.10008.6.1.948", "Pathology Imaging Protocol (8131)", DicomUidType.ContextGroupName, false);
DicomUID.register(PathologyImagingProtocol8131);
/** 1.2.840.10008.6.1.949 Magnification Selection (8132) */
export const MagnificationSelection8132 = new DicomUID("1.2.840.10008.6.1.949", "Magnification Selection (8132)", DicomUidType.ContextGroupName, false);
DicomUID.register(MagnificationSelection8132);
/** 1.2.840.10008.6.1.950 Tissue Selection (8133) */
export const TissueSelection8133 = new DicomUID("1.2.840.10008.6.1.950", "Tissue Selection (8133)", DicomUidType.ContextGroupName, false);
DicomUID.register(TissueSelection8133);
/** 1.2.840.10008.6.1.951 General Region of Interest Measurement Modifier (7464) */
export const GeneralRegionOfInterestMeasurementModifier7464 = new DicomUID("1.2.840.10008.6.1.951", "General Region of Interest Measurement Modifier (7464)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralRegionOfInterestMeasurementModifier7464);
/** 1.2.840.10008.6.1.952 Measurement Derived From Multiple ROI Measurements (7465) */
export const MeasurementDerivedFromMultipleROIMeasurements7465 = new DicomUID("1.2.840.10008.6.1.952", "Measurement Derived From Multiple ROI Measurements (7465)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasurementDerivedFromMultipleROIMeasurements7465);
/** 1.2.840.10008.6.1.953 Surface Scan Acquisition Type (8201) */
export const SurfaceScanAcquisitionType8201 = new DicomUID("1.2.840.10008.6.1.953", "Surface Scan Acquisition Type (8201)", DicomUidType.ContextGroupName, false);
DicomUID.register(SurfaceScanAcquisitionType8201);
/** 1.2.840.10008.6.1.954 Surface Scan Mode Type (8202) */
export const SurfaceScanModeType8202 = new DicomUID("1.2.840.10008.6.1.954", "Surface Scan Mode Type (8202)", DicomUidType.ContextGroupName, false);
DicomUID.register(SurfaceScanModeType8202);
/** 1.2.840.10008.6.1.956 Surface Scan Registration Method Type (8203) */
export const SurfaceScanRegistrationMethodType8203 = new DicomUID("1.2.840.10008.6.1.956", "Surface Scan Registration Method Type (8203)", DicomUidType.ContextGroupName, false);
DicomUID.register(SurfaceScanRegistrationMethodType8203);
/** 1.2.840.10008.6.1.957 Basic Cardiac View (27) */
export const BasicCardiacView27 = new DicomUID("1.2.840.10008.6.1.957", "Basic Cardiac View (27)", DicomUidType.ContextGroupName, false);
DicomUID.register(BasicCardiacView27);
/** 1.2.840.10008.6.1.958 CT Reconstruction Algorithm (10033) */
export const CTReconstructionAlgorithm10033 = new DicomUID("1.2.840.10008.6.1.958", "CT Reconstruction Algorithm (10033)", DicomUidType.ContextGroupName, false);
DicomUID.register(CTReconstructionAlgorithm10033);
/** 1.2.840.10008.6.1.959 Detector Type (10030) */
export const DetectorType10030 = new DicomUID("1.2.840.10008.6.1.959", "Detector Type (10030)", DicomUidType.ContextGroupName, false);
DicomUID.register(DetectorType10030);
/** 1.2.840.10008.6.1.960 CR/DR Mechanical Configuration (10031) */
export const CRDRMechanicalConfiguration10031 = new DicomUID("1.2.840.10008.6.1.960", "CR/DR Mechanical Configuration (10031)", DicomUidType.ContextGroupName, false);
DicomUID.register(CRDRMechanicalConfiguration10031);
/** 1.2.840.10008.6.1.961 Projection X-Ray Acquisition Device Type (10032) */
export const ProjectionXRayAcquisitionDeviceType10032 = new DicomUID("1.2.840.10008.6.1.961", "Projection X-Ray Acquisition Device Type (10032)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProjectionXRayAcquisitionDeviceType10032);
/** 1.2.840.10008.6.1.962 Abstract Segmentation Type (7165) */
export const AbstractSegmentationType7165 = new DicomUID("1.2.840.10008.6.1.962", "Abstract Segmentation Type (7165)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbstractSegmentationType7165);
/** 1.2.840.10008.6.1.963 Common Tissue Segmentation Type (7166) */
export const CommonTissueSegmentationType7166 = new DicomUID("1.2.840.10008.6.1.963", "Common Tissue Segmentation Type (7166)", DicomUidType.ContextGroupName, false);
DicomUID.register(CommonTissueSegmentationType7166);
/** 1.2.840.10008.6.1.964 Peripheral Nervous System Segmentation Type (7167) */
export const PeripheralNervousSystemSegmentationType7167 = new DicomUID("1.2.840.10008.6.1.964", "Peripheral Nervous System Segmentation Type (7167)", DicomUidType.ContextGroupName, false);
DicomUID.register(PeripheralNervousSystemSegmentationType7167);
/** 1.2.840.10008.6.1.965 Corneal Topography Mapping Unit for Real World Value Mapping (4267) */
export const CornealTopographyMappingUnitForRealWorldValueMapping4267 = new DicomUID("1.2.840.10008.6.1.965", "Corneal Topography Mapping Unit for Real World Value Mapping (4267)", DicomUidType.ContextGroupName, false);
DicomUID.register(CornealTopographyMappingUnitForRealWorldValueMapping4267);
/** 1.2.840.10008.6.1.966 Corneal Topography Map Value Type (4268) */
export const CornealTopographyMapValueType4268 = new DicomUID("1.2.840.10008.6.1.966", "Corneal Topography Map Value Type (4268)", DicomUidType.ContextGroupName, false);
DicomUID.register(CornealTopographyMapValueType4268);
/** 1.2.840.10008.6.1.967 Brain Structure for Volumetric Measurement (7140) */
export const BrainStructureForVolumetricMeasurement7140 = new DicomUID("1.2.840.10008.6.1.967", "Brain Structure for Volumetric Measurement (7140)", DicomUidType.ContextGroupName, false);
DicomUID.register(BrainStructureForVolumetricMeasurement7140);
/** 1.2.840.10008.6.1.968 RT Dose Derivation (7220) */
export const RTDoseDerivation7220 = new DicomUID("1.2.840.10008.6.1.968", "RT Dose Derivation (7220)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTDoseDerivation7220);
/** 1.2.840.10008.6.1.969 RT Dose Purpose of Reference (7221) */
export const RTDosePurposeOfReference7221 = new DicomUID("1.2.840.10008.6.1.969", "RT Dose Purpose of Reference (7221)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTDosePurposeOfReference7221);
/** 1.2.840.10008.6.1.970 Spectroscopy Purpose of Reference (7215) */
export const SpectroscopyPurposeOfReference7215 = new DicomUID("1.2.840.10008.6.1.970", "Spectroscopy Purpose of Reference (7215)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpectroscopyPurposeOfReference7215);
/** 1.2.840.10008.6.1.971 Scheduled Processing Parameter Concept Codes for RT Treatment (9250) */
export const ScheduledProcessingParameterConceptCodesForRTTreatment9250 = new DicomUID("1.2.840.10008.6.1.971", "Scheduled Processing Parameter Concept Codes for RT Treatment (9250)", DicomUidType.ContextGroupName, false);
DicomUID.register(ScheduledProcessingParameterConceptCodesForRTTreatment9250);
/** 1.2.840.10008.6.1.972 Radiopharmaceutical Organ Dose Reference Authority (10040) */
export const RadiopharmaceuticalOrganDoseReferenceAuthority10040 = new DicomUID("1.2.840.10008.6.1.972", "Radiopharmaceutical Organ Dose Reference Authority (10040)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiopharmaceuticalOrganDoseReferenceAuthority10040);
/** 1.2.840.10008.6.1.973 Source of Radioisotope Activity Information (10041) */
export const SourceOfRadioisotopeActivityInformation10041 = new DicomUID("1.2.840.10008.6.1.973", "Source of Radioisotope Activity Information (10041)", DicomUidType.ContextGroupName, false);
DicomUID.register(SourceOfRadioisotopeActivityInformation10041);
/** 1.2.840.10008.6.1.975 Intravenous Extravasation Symptom (10043) */
export const IntravenousExtravasationSymptom10043 = new DicomUID("1.2.840.10008.6.1.975", "Intravenous Extravasation Symptom (10043)", DicomUidType.ContextGroupName, false);
DicomUID.register(IntravenousExtravasationSymptom10043);
/** 1.2.840.10008.6.1.976 Radiosensitive Organ (10044) */
export const RadiosensitiveOrgan10044 = new DicomUID("1.2.840.10008.6.1.976", "Radiosensitive Organ (10044)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiosensitiveOrgan10044);
/** 1.2.840.10008.6.1.977 Radiopharmaceutical Patient State (10045) */
export const RadiopharmaceuticalPatientState10045 = new DicomUID("1.2.840.10008.6.1.977", "Radiopharmaceutical Patient State (10045)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiopharmaceuticalPatientState10045);
/** 1.2.840.10008.6.1.978 GFR Measurement (10046) */
export const GFRMeasurement10046 = new DicomUID("1.2.840.10008.6.1.978", "GFR Measurement (10046)", DicomUidType.ContextGroupName, false);
DicomUID.register(GFRMeasurement10046);
/** 1.2.840.10008.6.1.979 GFR Measurement Method (10047) */
export const GFRMeasurementMethod10047 = new DicomUID("1.2.840.10008.6.1.979", "GFR Measurement Method (10047)", DicomUidType.ContextGroupName, false);
DicomUID.register(GFRMeasurementMethod10047);
/** 1.2.840.10008.6.1.980 Visual Evaluation Method (8300) */
export const VisualEvaluationMethod8300 = new DicomUID("1.2.840.10008.6.1.980", "Visual Evaluation Method (8300)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualEvaluationMethod8300);
/** 1.2.840.10008.6.1.981 Test Pattern Code (8301) */
export const TestPatternCode8301 = new DicomUID("1.2.840.10008.6.1.981", "Test Pattern Code (8301)", DicomUidType.ContextGroupName, false);
DicomUID.register(TestPatternCode8301);
/** 1.2.840.10008.6.1.982 Measurement Pattern Code (8302) */
export const MeasurementPatternCode8302 = new DicomUID("1.2.840.10008.6.1.982", "Measurement Pattern Code (8302)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasurementPatternCode8302);
/** 1.2.840.10008.6.1.983 Display Device Type (8303) */
export const DisplayDeviceType8303 = new DicomUID("1.2.840.10008.6.1.983", "Display Device Type (8303)", DicomUidType.ContextGroupName, false);
DicomUID.register(DisplayDeviceType8303);
/** 1.2.840.10008.6.1.984 SUV Unit (85) */
export const SUVUnit85 = new DicomUID("1.2.840.10008.6.1.984", "SUV Unit (85)", DicomUidType.ContextGroupName, false);
DicomUID.register(SUVUnit85);
/** 1.2.840.10008.6.1.985 T1 Measurement Method (4100) */
export const T1MeasurementMethod4100 = new DicomUID("1.2.840.10008.6.1.985", "T1 Measurement Method (4100)", DicomUidType.ContextGroupName, false);
DicomUID.register(T1MeasurementMethod4100);
/** 1.2.840.10008.6.1.986 Tracer Kinetic Model (4101) */
export const TracerKineticModel4101 = new DicomUID("1.2.840.10008.6.1.986", "Tracer Kinetic Model (4101)", DicomUidType.ContextGroupName, false);
DicomUID.register(TracerKineticModel4101);
/** 1.2.840.10008.6.1.987 Perfusion Measurement Method (4102) */
export const PerfusionMeasurementMethod4102 = new DicomUID("1.2.840.10008.6.1.987", "Perfusion Measurement Method (4102)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerfusionMeasurementMethod4102);
/** 1.2.840.10008.6.1.988 Arterial Input Function Measurement Method (4103) */
export const ArterialInputFunctionMeasurementMethod4103 = new DicomUID("1.2.840.10008.6.1.988", "Arterial Input Function Measurement Method (4103)", DicomUidType.ContextGroupName, false);
DicomUID.register(ArterialInputFunctionMeasurementMethod4103);
/** 1.2.840.10008.6.1.989 Bolus Arrival Time Derivation Method (4104) */
export const BolusArrivalTimeDerivationMethod4104 = new DicomUID("1.2.840.10008.6.1.989", "Bolus Arrival Time Derivation Method (4104)", DicomUidType.ContextGroupName, false);
DicomUID.register(BolusArrivalTimeDerivationMethod4104);
/** 1.2.840.10008.6.1.990 Perfusion Analysis Method (4105) */
export const PerfusionAnalysisMethod4105 = new DicomUID("1.2.840.10008.6.1.990", "Perfusion Analysis Method (4105)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerfusionAnalysisMethod4105);
/** 1.2.840.10008.6.1.991 Quantitative Method Used for Perfusion and Tracer Kinetic Model (4106) */
export const QuantitativeMethodUsedForPerfusionAndTracerKineticModel4106 = new DicomUID("1.2.840.10008.6.1.991", "Quantitative Method Used for Perfusion and Tracer Kinetic Model (4106)", DicomUidType.ContextGroupName, false);
DicomUID.register(QuantitativeMethodUsedForPerfusionAndTracerKineticModel4106);
/** 1.2.840.10008.6.1.992 Tracer Kinetic Model Parameter (4107) */
export const TracerKineticModelParameter4107 = new DicomUID("1.2.840.10008.6.1.992", "Tracer Kinetic Model Parameter (4107)", DicomUidType.ContextGroupName, false);
DicomUID.register(TracerKineticModelParameter4107);
/** 1.2.840.10008.6.1.993 Perfusion Model Parameter (4108) */
export const PerfusionModelParameter4108 = new DicomUID("1.2.840.10008.6.1.993", "Perfusion Model Parameter (4108)", DicomUidType.ContextGroupName, false);
DicomUID.register(PerfusionModelParameter4108);
/** 1.2.840.10008.6.1.994 Model-Independent Dynamic Contrast Analysis Parameter (4109) */
export const ModelIndependentDynamicContrastAnalysisParameter4109 = new DicomUID("1.2.840.10008.6.1.994", "Model-Independent Dynamic Contrast Analysis Parameter (4109)", DicomUidType.ContextGroupName, false);
DicomUID.register(ModelIndependentDynamicContrastAnalysisParameter4109);
/** 1.2.840.10008.6.1.995 Tracer Kinetic Modeling Covariate (4110) */
export const TracerKineticModelingCovariate4110 = new DicomUID("1.2.840.10008.6.1.995", "Tracer Kinetic Modeling Covariate (4110)", DicomUidType.ContextGroupName, false);
DicomUID.register(TracerKineticModelingCovariate4110);
/** 1.2.840.10008.6.1.996 Contrast Characteristic (4111) */
export const ContrastCharacteristic4111 = new DicomUID("1.2.840.10008.6.1.996", "Contrast Characteristic (4111)", DicomUidType.ContextGroupName, false);
DicomUID.register(ContrastCharacteristic4111);
/** 1.2.840.10008.6.1.997 Measurement Report Document Title (7021) */
export const MeasurementReportDocumentTitle7021 = new DicomUID("1.2.840.10008.6.1.997", "Measurement Report Document Title (7021)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasurementReportDocumentTitle7021);
/** 1.2.840.10008.6.1.998 Quantitative Diagnostic Imaging Procedure (100) */
export const QuantitativeDiagnosticImagingProcedure100 = new DicomUID("1.2.840.10008.6.1.998", "Quantitative Diagnostic Imaging Procedure (100)", DicomUidType.ContextGroupName, false);
DicomUID.register(QuantitativeDiagnosticImagingProcedure100);
/** 1.2.840.10008.6.1.999 PET Region of Interest Measurement (7466) */
export const PETRegionOfInterestMeasurement7466 = new DicomUID("1.2.840.10008.6.1.999", "PET Region of Interest Measurement (7466)", DicomUidType.ContextGroupName, false);
DicomUID.register(PETRegionOfInterestMeasurement7466);
/** 1.2.840.10008.6.1.1000 Gray Level Co-occurrence Matrix Measurement (7467) */
export const GrayLevelCoOccurrenceMatrixMeasurement7467 = new DicomUID("1.2.840.10008.6.1.1000", "Gray Level Co-occurrence Matrix Measurement (7467)", DicomUidType.ContextGroupName, false);
DicomUID.register(GrayLevelCoOccurrenceMatrixMeasurement7467);
/** 1.2.840.10008.6.1.1001 Texture Measurement (7468) */
export const TextureMeasurement7468 = new DicomUID("1.2.840.10008.6.1.1001", "Texture Measurement (7468)", DicomUidType.ContextGroupName, false);
DicomUID.register(TextureMeasurement7468);
/** 1.2.840.10008.6.1.1002 Time Point Type (6146) */
export const TimePointType6146 = new DicomUID("1.2.840.10008.6.1.1002", "Time Point Type (6146)", DicomUidType.ContextGroupName, false);
DicomUID.register(TimePointType6146);
/** 1.2.840.10008.6.1.1003 Generic Intensity and Size Measurement (7469) */
export const GenericIntensityAndSizeMeasurement7469 = new DicomUID("1.2.840.10008.6.1.1003", "Generic Intensity and Size Measurement (7469)", DicomUidType.ContextGroupName, false);
DicomUID.register(GenericIntensityAndSizeMeasurement7469);
/** 1.2.840.10008.6.1.1004 Response Criteria (6147) */
export const ResponseCriteria6147 = new DicomUID("1.2.840.10008.6.1.1004", "Response Criteria (6147)", DicomUidType.ContextGroupName, false);
DicomUID.register(ResponseCriteria6147);
/** 1.2.840.10008.6.1.1005 Fetal Biometry Anatomic Site (12020) */
export const FetalBiometryAnatomicSite12020 = new DicomUID("1.2.840.10008.6.1.1005", "Fetal Biometry Anatomic Site (12020)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalBiometryAnatomicSite12020);
/** 1.2.840.10008.6.1.1006 Fetal Long Bone Anatomic Site (12021) */
export const FetalLongBoneAnatomicSite12021 = new DicomUID("1.2.840.10008.6.1.1006", "Fetal Long Bone Anatomic Site (12021)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalLongBoneAnatomicSite12021);
/** 1.2.840.10008.6.1.1007 Fetal Cranium Anatomic Site (12022) */
export const FetalCraniumAnatomicSite12022 = new DicomUID("1.2.840.10008.6.1.1007", "Fetal Cranium Anatomic Site (12022)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalCraniumAnatomicSite12022);
/** 1.2.840.10008.6.1.1008 Pelvis and Uterus Anatomic Site (12023) */
export const PelvisAndUterusAnatomicSite12023 = new DicomUID("1.2.840.10008.6.1.1008", "Pelvis and Uterus Anatomic Site (12023)", DicomUidType.ContextGroupName, false);
DicomUID.register(PelvisAndUterusAnatomicSite12023);
/** 1.2.840.10008.6.1.1009 Parametric Map Derivation Image Purpose of Reference (7222) */
export const ParametricMapDerivationImagePurposeOfReference7222 = new DicomUID("1.2.840.10008.6.1.1009", "Parametric Map Derivation Image Purpose of Reference (7222)", DicomUidType.ContextGroupName, false);
DicomUID.register(ParametricMapDerivationImagePurposeOfReference7222);
/** 1.2.840.10008.6.1.1010 Physical Quantity Descriptor (9000) */
export const PhysicalQuantityDescriptor9000 = new DicomUID("1.2.840.10008.6.1.1010", "Physical Quantity Descriptor (9000)", DicomUidType.ContextGroupName, false);
DicomUID.register(PhysicalQuantityDescriptor9000);
/** 1.2.840.10008.6.1.1011 Lymph Node Anatomic Site (7600) */
export const LymphNodeAnatomicSite7600 = new DicomUID("1.2.840.10008.6.1.1011", "Lymph Node Anatomic Site (7600)", DicomUidType.ContextGroupName, false);
DicomUID.register(LymphNodeAnatomicSite7600);
/** 1.2.840.10008.6.1.1012 Head and Neck Cancer Anatomic Site (7601) */
export const HeadAndNeckCancerAnatomicSite7601 = new DicomUID("1.2.840.10008.6.1.1012", "Head and Neck Cancer Anatomic Site (7601)", DicomUidType.ContextGroupName, false);
DicomUID.register(HeadAndNeckCancerAnatomicSite7601);
/** 1.2.840.10008.6.1.1013 Fiber Tract In Brainstem (7701) */
export const FiberTractInBrainstem7701 = new DicomUID("1.2.840.10008.6.1.1013", "Fiber Tract In Brainstem (7701)", DicomUidType.ContextGroupName, false);
DicomUID.register(FiberTractInBrainstem7701);
/** 1.2.840.10008.6.1.1014 Projection and Thalamic Fiber (7702) */
export const ProjectionAndThalamicFiber7702 = new DicomUID("1.2.840.10008.6.1.1014", "Projection and Thalamic Fiber (7702)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProjectionAndThalamicFiber7702);
/** 1.2.840.10008.6.1.1015 Association Fiber (7703) */
export const AssociationFiber7703 = new DicomUID("1.2.840.10008.6.1.1015", "Association Fiber (7703)", DicomUidType.ContextGroupName, false);
DicomUID.register(AssociationFiber7703);
/** 1.2.840.10008.6.1.1016 Limbic System Tract (7704) */
export const LimbicSystemTract7704 = new DicomUID("1.2.840.10008.6.1.1016", "Limbic System Tract (7704)", DicomUidType.ContextGroupName, false);
DicomUID.register(LimbicSystemTract7704);
/** 1.2.840.10008.6.1.1017 Commissural Fiber (7705) */
export const CommissuralFiber7705 = new DicomUID("1.2.840.10008.6.1.1017", "Commissural Fiber (7705)", DicomUidType.ContextGroupName, false);
DicomUID.register(CommissuralFiber7705);
/** 1.2.840.10008.6.1.1018 Cranial Nerve (7706) */
export const CranialNerve7706 = new DicomUID("1.2.840.10008.6.1.1018", "Cranial Nerve (7706)", DicomUidType.ContextGroupName, false);
DicomUID.register(CranialNerve7706);
/** 1.2.840.10008.6.1.1019 Spinal Cord Fiber (7707) */
export const SpinalCordFiber7707 = new DicomUID("1.2.840.10008.6.1.1019", "Spinal Cord Fiber (7707)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpinalCordFiber7707);
/** 1.2.840.10008.6.1.1020 Tractography Anatomic Site (7710) */
export const TractographyAnatomicSite7710 = new DicomUID("1.2.840.10008.6.1.1020", "Tractography Anatomic Site (7710)", DicomUidType.ContextGroupName, false);
DicomUID.register(TractographyAnatomicSite7710);
/** 1.2.840.10008.6.1.1021 Primary Anatomic Structure for Intra-oral Radiography (Supernumerary Dentition - Designation of Teeth) (4025) */
export const PrimaryAnatomicStructureForIntraOralRadiographySupernumeraryDentitionDesignationOfTeeth4025 = new DicomUID("1.2.840.10008.6.1.1021", "Primary Anatomic Structure for Intra-oral Radiography (Supernumerary Dentition - Designation of Teeth) (4025)", DicomUidType.ContextGroupName, false);
DicomUID.register(PrimaryAnatomicStructureForIntraOralRadiographySupernumeraryDentitionDesignationOfTeeth4025);
/** 1.2.840.10008.6.1.1022 Primary Anatomic Structure for Intra-oral and Craniofacial Radiography - Teeth (4026) */
export const PrimaryAnatomicStructureForIntraOralAndCraniofacialRadiographyTeeth4026 = new DicomUID("1.2.840.10008.6.1.1022", "Primary Anatomic Structure for Intra-oral and Craniofacial Radiography - Teeth (4026)", DicomUidType.ContextGroupName, false);
DicomUID.register(PrimaryAnatomicStructureForIntraOralAndCraniofacialRadiographyTeeth4026);
/** 1.2.840.10008.6.1.1023 IEC61217 Device Position Parameter (9401) */
export const IEC61217DevicePositionParameter9401 = new DicomUID("1.2.840.10008.6.1.1023", "IEC61217 Device Position Parameter (9401)", DicomUidType.ContextGroupName, false);
DicomUID.register(IEC61217DevicePositionParameter9401);
/** 1.2.840.10008.6.1.1024 IEC61217 Gantry Position Parameter (9402) */
export const IEC61217GantryPositionParameter9402 = new DicomUID("1.2.840.10008.6.1.1024", "IEC61217 Gantry Position Parameter (9402)", DicomUidType.ContextGroupName, false);
DicomUID.register(IEC61217GantryPositionParameter9402);
/** 1.2.840.10008.6.1.1025 IEC61217 Patient Support Position Parameter (9403) */
export const IEC61217PatientSupportPositionParameter9403 = new DicomUID("1.2.840.10008.6.1.1025", "IEC61217 Patient Support Position Parameter (9403)", DicomUidType.ContextGroupName, false);
DicomUID.register(IEC61217PatientSupportPositionParameter9403);
/** 1.2.840.10008.6.1.1026 Actionable Finding Classification (7035) */
export const ActionableFindingClassification7035 = new DicomUID("1.2.840.10008.6.1.1026", "Actionable Finding Classification (7035)", DicomUidType.ContextGroupName, false);
DicomUID.register(ActionableFindingClassification7035);
/** 1.2.840.10008.6.1.1027 Image Quality Assessment (7036) */
export const ImageQualityAssessment7036 = new DicomUID("1.2.840.10008.6.1.1027", "Image Quality Assessment (7036)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImageQualityAssessment7036);
/** 1.2.840.10008.6.1.1028 Summary Radiation Exposure Quantity (10050) */
export const SummaryRadiationExposureQuantity10050 = new DicomUID("1.2.840.10008.6.1.1028", "Summary Radiation Exposure Quantity (10050)", DicomUidType.ContextGroupName, false);
DicomUID.register(SummaryRadiationExposureQuantity10050);
/** 1.2.840.10008.6.1.1029 Wide Field Ophthalmic Photography Transformation Method (4245) */
export const WideFieldOphthalmicPhotographyTransformationMethod4245 = new DicomUID("1.2.840.10008.6.1.1029", "Wide Field Ophthalmic Photography Transformation Method (4245)", DicomUidType.ContextGroupName, false);
DicomUID.register(WideFieldOphthalmicPhotographyTransformationMethod4245);
/** 1.2.840.10008.6.1.1030 PET Unit (84) */
export const PETUnit84 = new DicomUID("1.2.840.10008.6.1.1030", "PET Unit (84)", DicomUidType.ContextGroupName, false);
DicomUID.register(PETUnit84);
/** 1.2.840.10008.6.1.1031 Implant Material (7300) */
export const ImplantMaterial7300 = new DicomUID("1.2.840.10008.6.1.1031", "Implant Material (7300)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImplantMaterial7300);
/** 1.2.840.10008.6.1.1032 Intervention Type (7301) */
export const InterventionType7301 = new DicomUID("1.2.840.10008.6.1.1032", "Intervention Type (7301)", DicomUidType.ContextGroupName, false);
DicomUID.register(InterventionType7301);
/** 1.2.840.10008.6.1.1033 Implant Template View Orientation (7302) */
export const ImplantTemplateViewOrientation7302 = new DicomUID("1.2.840.10008.6.1.1033", "Implant Template View Orientation (7302)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImplantTemplateViewOrientation7302);
/** 1.2.840.10008.6.1.1034 Implant Template Modified View Orientation (7303) */
export const ImplantTemplateModifiedViewOrientation7303 = new DicomUID("1.2.840.10008.6.1.1034", "Implant Template Modified View Orientation (7303)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImplantTemplateModifiedViewOrientation7303);
/** 1.2.840.10008.6.1.1035 Implant Target Anatomy (7304) */
export const ImplantTargetAnatomy7304 = new DicomUID("1.2.840.10008.6.1.1035", "Implant Target Anatomy (7304)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImplantTargetAnatomy7304);
/** 1.2.840.10008.6.1.1036 Implant Planning Landmark (7305) */
export const ImplantPlanningLandmark7305 = new DicomUID("1.2.840.10008.6.1.1036", "Implant Planning Landmark (7305)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImplantPlanningLandmark7305);
/** 1.2.840.10008.6.1.1037 Human Hip Implant Planning Landmark (7306) */
export const HumanHipImplantPlanningLandmark7306 = new DicomUID("1.2.840.10008.6.1.1037", "Human Hip Implant Planning Landmark (7306)", DicomUidType.ContextGroupName, false);
DicomUID.register(HumanHipImplantPlanningLandmark7306);
/** 1.2.840.10008.6.1.1038 Implant Component Type (7307) */
export const ImplantComponentType7307 = new DicomUID("1.2.840.10008.6.1.1038", "Implant Component Type (7307)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImplantComponentType7307);
/** 1.2.840.10008.6.1.1039 Human Hip Implant Component Type (7308) */
export const HumanHipImplantComponentType7308 = new DicomUID("1.2.840.10008.6.1.1039", "Human Hip Implant Component Type (7308)", DicomUidType.ContextGroupName, false);
DicomUID.register(HumanHipImplantComponentType7308);
/** 1.2.840.10008.6.1.1040 Human Trauma Implant Component Type (7309) */
export const HumanTraumaImplantComponentType7309 = new DicomUID("1.2.840.10008.6.1.1040", "Human Trauma Implant Component Type (7309)", DicomUidType.ContextGroupName, false);
DicomUID.register(HumanTraumaImplantComponentType7309);
/** 1.2.840.10008.6.1.1041 Implant Fixation Method (7310) */
export const ImplantFixationMethod7310 = new DicomUID("1.2.840.10008.6.1.1041", "Implant Fixation Method (7310)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImplantFixationMethod7310);
/** 1.2.840.10008.6.1.1042 Device Participating Role (7445) */
export const DeviceParticipatingRole7445 = new DicomUID("1.2.840.10008.6.1.1042", "Device Participating Role (7445)", DicomUidType.ContextGroupName, false);
DicomUID.register(DeviceParticipatingRole7445);
/** 1.2.840.10008.6.1.1043 Container Type (8101) */
export const ContainerType8101 = new DicomUID("1.2.840.10008.6.1.1043", "Container Type (8101)", DicomUidType.ContextGroupName, false);
DicomUID.register(ContainerType8101);
/** 1.2.840.10008.6.1.1044 Container Component Type (8102) */
export const ContainerComponentType8102 = new DicomUID("1.2.840.10008.6.1.1044", "Container Component Type (8102)", DicomUidType.ContextGroupName, false);
DicomUID.register(ContainerComponentType8102);
/** 1.2.840.10008.6.1.1045 Anatomic Pathology Specimen Type (8103) */
export const AnatomicPathologySpecimenType8103 = new DicomUID("1.2.840.10008.6.1.1045", "Anatomic Pathology Specimen Type (8103)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicPathologySpecimenType8103);
/** 1.2.840.10008.6.1.1046 Breast Tissue Specimen Type (8104) */
export const BreastTissueSpecimenType8104 = new DicomUID("1.2.840.10008.6.1.1046", "Breast Tissue Specimen Type (8104)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastTissueSpecimenType8104);
/** 1.2.840.10008.6.1.1047 Specimen Collection Procedure (8109) */
export const SpecimenCollectionProcedure8109 = new DicomUID("1.2.840.10008.6.1.1047", "Specimen Collection Procedure (8109)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecimenCollectionProcedure8109);
/** 1.2.840.10008.6.1.1048 Specimen Sampling Procedure (8110) */
export const SpecimenSamplingProcedure8110 = new DicomUID("1.2.840.10008.6.1.1048", "Specimen Sampling Procedure (8110)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecimenSamplingProcedure8110);
/** 1.2.840.10008.6.1.1049 Specimen Preparation Procedure (8111) */
export const SpecimenPreparationProcedure8111 = new DicomUID("1.2.840.10008.6.1.1049", "Specimen Preparation Procedure (8111)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecimenPreparationProcedure8111);
/** 1.2.840.10008.6.1.1050 Specimen Stain (8112) */
export const SpecimenStain8112 = new DicomUID("1.2.840.10008.6.1.1050", "Specimen Stain (8112)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecimenStain8112);
/** 1.2.840.10008.6.1.1051 Specimen Preparation Step (8113) */
export const SpecimenPreparationStep8113 = new DicomUID("1.2.840.10008.6.1.1051", "Specimen Preparation Step (8113)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecimenPreparationStep8113);
/** 1.2.840.10008.6.1.1052 Specimen Fixative (8114) */
export const SpecimenFixative8114 = new DicomUID("1.2.840.10008.6.1.1052", "Specimen Fixative (8114)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecimenFixative8114);
/** 1.2.840.10008.6.1.1053 Specimen Embedding Media (8115) */
export const SpecimenEmbeddingMedia8115 = new DicomUID("1.2.840.10008.6.1.1053", "Specimen Embedding Media (8115)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecimenEmbeddingMedia8115);
/** 1.2.840.10008.6.1.1054 Source of Projection X-Ray Dose Information (10020) */
export const SourceOfProjectionXRayDoseInformation10020 = new DicomUID("1.2.840.10008.6.1.1054", "Source of Projection X-Ray Dose Information (10020)", DicomUidType.ContextGroupName, false);
DicomUID.register(SourceOfProjectionXRayDoseInformation10020);
/** 1.2.840.10008.6.1.1055 Source of CT Dose Information (10021) */
export const SourceOfCTDoseInformation10021 = new DicomUID("1.2.840.10008.6.1.1055", "Source of CT Dose Information (10021)", DicomUidType.ContextGroupName, false);
DicomUID.register(SourceOfCTDoseInformation10021);
/** 1.2.840.10008.6.1.1056 Radiation Dose Reference Point (10025) */
export const RadiationDoseReferencePoint10025 = new DicomUID("1.2.840.10008.6.1.1056", "Radiation Dose Reference Point (10025)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationDoseReferencePoint10025);
/** 1.2.840.10008.6.1.1057 Volumetric View Description (501) */
export const VolumetricViewDescription501 = new DicomUID("1.2.840.10008.6.1.1057", "Volumetric View Description (501)", DicomUidType.ContextGroupName, false);
DicomUID.register(VolumetricViewDescription501);
/** 1.2.840.10008.6.1.1058 Volumetric View Modifier (502) */
export const VolumetricViewModifier502 = new DicomUID("1.2.840.10008.6.1.1058", "Volumetric View Modifier (502)", DicomUidType.ContextGroupName, false);
DicomUID.register(VolumetricViewModifier502);
/** 1.2.840.10008.6.1.1059 Diffusion Acquisition Value Type (7260) */
export const DiffusionAcquisitionValueType7260 = new DicomUID("1.2.840.10008.6.1.1059", "Diffusion Acquisition Value Type (7260)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiffusionAcquisitionValueType7260);
/** 1.2.840.10008.6.1.1060 Diffusion Model Value Type (7261) */
export const DiffusionModelValueType7261 = new DicomUID("1.2.840.10008.6.1.1060", "Diffusion Model Value Type (7261)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiffusionModelValueType7261);
/** 1.2.840.10008.6.1.1061 Diffusion Tractography Algorithm Family (7262) */
export const DiffusionTractographyAlgorithmFamily7262 = new DicomUID("1.2.840.10008.6.1.1061", "Diffusion Tractography Algorithm Family (7262)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiffusionTractographyAlgorithmFamily7262);
/** 1.2.840.10008.6.1.1062 Diffusion Tractography Measurement Type (7263) */
export const DiffusionTractographyMeasurementType7263 = new DicomUID("1.2.840.10008.6.1.1062", "Diffusion Tractography Measurement Type (7263)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiffusionTractographyMeasurementType7263);
/** 1.2.840.10008.6.1.1063 Research Animal Source Registry (7490) */
export const ResearchAnimalSourceRegistry7490 = new DicomUID("1.2.840.10008.6.1.1063", "Research Animal Source Registry (7490)", DicomUidType.ContextGroupName, false);
DicomUID.register(ResearchAnimalSourceRegistry7490);
/** 1.2.840.10008.6.1.1064 Yes-No Only (231) */
export const YesNoOnly231 = new DicomUID("1.2.840.10008.6.1.1064", "Yes-No Only (231)", DicomUidType.ContextGroupName, false);
DicomUID.register(YesNoOnly231);
/** 1.2.840.10008.6.1.1065 Biosafety Level (601) */
export const BiosafetyLevel601 = new DicomUID("1.2.840.10008.6.1.1065", "Biosafety Level (601)", DicomUidType.ContextGroupName, false);
DicomUID.register(BiosafetyLevel601);
/** 1.2.840.10008.6.1.1066 Biosafety Control Reason (602) */
export const BiosafetyControlReason602 = new DicomUID("1.2.840.10008.6.1.1066", "Biosafety Control Reason (602)", DicomUidType.ContextGroupName, false);
DicomUID.register(BiosafetyControlReason602);
/** 1.2.840.10008.6.1.1067 Sex - Male Female or Both (7457) */
export const SexMaleFemaleOrBoth7457 = new DicomUID("1.2.840.10008.6.1.1067", "Sex - Male Female or Both (7457)", DicomUidType.ContextGroupName, false);
DicomUID.register(SexMaleFemaleOrBoth7457);
/** 1.2.840.10008.6.1.1068 Animal Room Type (603) */
export const AnimalRoomType603 = new DicomUID("1.2.840.10008.6.1.1068", "Animal Room Type (603)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnimalRoomType603);
/** 1.2.840.10008.6.1.1069 Device Reuse (604) */
export const DeviceReuse604 = new DicomUID("1.2.840.10008.6.1.1069", "Device Reuse (604)", DicomUidType.ContextGroupName, false);
DicomUID.register(DeviceReuse604);
/** 1.2.840.10008.6.1.1070 Animal Bedding Material (605) */
export const AnimalBeddingMaterial605 = new DicomUID("1.2.840.10008.6.1.1070", "Animal Bedding Material (605)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnimalBeddingMaterial605);
/** 1.2.840.10008.6.1.1071 Animal Shelter Type (606) */
export const AnimalShelterType606 = new DicomUID("1.2.840.10008.6.1.1071", "Animal Shelter Type (606)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnimalShelterType606);
/** 1.2.840.10008.6.1.1072 Animal Feed Type (607) */
export const AnimalFeedType607 = new DicomUID("1.2.840.10008.6.1.1072", "Animal Feed Type (607)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnimalFeedType607);
/** 1.2.840.10008.6.1.1073 Animal Feed Source (608) */
export const AnimalFeedSource608 = new DicomUID("1.2.840.10008.6.1.1073", "Animal Feed Source (608)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnimalFeedSource608);
/** 1.2.840.10008.6.1.1074 Animal Feeding Method (609) */
export const AnimalFeedingMethod609 = new DicomUID("1.2.840.10008.6.1.1074", "Animal Feeding Method (609)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnimalFeedingMethod609);
/** 1.2.840.10008.6.1.1075 Water Type (610) */
export const WaterType610 = new DicomUID("1.2.840.10008.6.1.1075", "Water Type (610)", DicomUidType.ContextGroupName, false);
DicomUID.register(WaterType610);
/** 1.2.840.10008.6.1.1076 Anesthesia Category Code Type for Small Animal Anesthesia (611) */
export const AnesthesiaCategoryCodeTypeForSmallAnimalAnesthesia611 = new DicomUID("1.2.840.10008.6.1.1076", "Anesthesia Category Code Type for Small Animal Anesthesia (611)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnesthesiaCategoryCodeTypeForSmallAnimalAnesthesia611);
/** 1.2.840.10008.6.1.1077 Anesthesia Category Code Type from Anesthesia Quality Initiative (612) */
export const AnesthesiaCategoryCodeTypeFromAnesthesiaQualityInitiative612 = new DicomUID("1.2.840.10008.6.1.1077", "Anesthesia Category Code Type from Anesthesia Quality Initiative (612)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnesthesiaCategoryCodeTypeFromAnesthesiaQualityInitiative612);
/** 1.2.840.10008.6.1.1078 Anesthesia Induction Code Type for Small Animal Anesthesia (613) */
export const AnesthesiaInductionCodeTypeForSmallAnimalAnesthesia613 = new DicomUID("1.2.840.10008.6.1.1078", "Anesthesia Induction Code Type for Small Animal Anesthesia (613)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnesthesiaInductionCodeTypeForSmallAnimalAnesthesia613);
/** 1.2.840.10008.6.1.1079 Anesthesia Induction Code Type from Anesthesia Quality Initiative (614) */
export const AnesthesiaInductionCodeTypeFromAnesthesiaQualityInitiative614 = new DicomUID("1.2.840.10008.6.1.1079", "Anesthesia Induction Code Type from Anesthesia Quality Initiative (614)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnesthesiaInductionCodeTypeFromAnesthesiaQualityInitiative614);
/** 1.2.840.10008.6.1.1080 Anesthesia Maintenance Code Type for Small Animal Anesthesia (615) */
export const AnesthesiaMaintenanceCodeTypeForSmallAnimalAnesthesia615 = new DicomUID("1.2.840.10008.6.1.1080", "Anesthesia Maintenance Code Type for Small Animal Anesthesia (615)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnesthesiaMaintenanceCodeTypeForSmallAnimalAnesthesia615);
/** 1.2.840.10008.6.1.1081 Anesthesia Maintenance Code Type from Anesthesia Quality Initiative (616) */
export const AnesthesiaMaintenanceCodeTypeFromAnesthesiaQualityInitiative616 = new DicomUID("1.2.840.10008.6.1.1081", "Anesthesia Maintenance Code Type from Anesthesia Quality Initiative (616)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnesthesiaMaintenanceCodeTypeFromAnesthesiaQualityInitiative616);
/** 1.2.840.10008.6.1.1082 Airway Management Method Code Type for Small Animal Anesthesia (617) */
export const AirwayManagementMethodCodeTypeForSmallAnimalAnesthesia617 = new DicomUID("1.2.840.10008.6.1.1082", "Airway Management Method Code Type for Small Animal Anesthesia (617)", DicomUidType.ContextGroupName, false);
DicomUID.register(AirwayManagementMethodCodeTypeForSmallAnimalAnesthesia617);
/** 1.2.840.10008.6.1.1083 Airway Management Method Code Type from Anesthesia Quality Initiative (618) */
export const AirwayManagementMethodCodeTypeFromAnesthesiaQualityInitiative618 = new DicomUID("1.2.840.10008.6.1.1083", "Airway Management Method Code Type from Anesthesia Quality Initiative (618)", DicomUidType.ContextGroupName, false);
DicomUID.register(AirwayManagementMethodCodeTypeFromAnesthesiaQualityInitiative618);
/** 1.2.840.10008.6.1.1084 Airway Management Sub-Method Code Type for Small Animal Anesthesia (619) */
export const AirwayManagementSubMethodCodeTypeForSmallAnimalAnesthesia619 = new DicomUID("1.2.840.10008.6.1.1084", "Airway Management Sub-Method Code Type for Small Animal Anesthesia (619)", DicomUidType.ContextGroupName, false);
DicomUID.register(AirwayManagementSubMethodCodeTypeForSmallAnimalAnesthesia619);
/** 1.2.840.10008.6.1.1085 Airway Management Sub-Method Code Type from Anesthesia Quality Initiative (620) */
export const AirwayManagementSubMethodCodeTypeFromAnesthesiaQualityInitiative620 = new DicomUID("1.2.840.10008.6.1.1085", "Airway Management Sub-Method Code Type from Anesthesia Quality Initiative (620)", DicomUidType.ContextGroupName, false);
DicomUID.register(AirwayManagementSubMethodCodeTypeFromAnesthesiaQualityInitiative620);
/** 1.2.840.10008.6.1.1086 Medication Type for Small Animal Anesthesia (621) */
export const MedicationTypeForSmallAnimalAnesthesia621 = new DicomUID("1.2.840.10008.6.1.1086", "Medication Type for Small Animal Anesthesia (621)", DicomUidType.ContextGroupName, false);
DicomUID.register(MedicationTypeForSmallAnimalAnesthesia621);
/** 1.2.840.10008.6.1.1087 Medication Type Code Type from Anesthesia Quality Initiative (622) */
export const MedicationTypeCodeTypeFromAnesthesiaQualityInitiative622 = new DicomUID("1.2.840.10008.6.1.1087", "Medication Type Code Type from Anesthesia Quality Initiative (622)", DicomUidType.ContextGroupName, false);
DicomUID.register(MedicationTypeCodeTypeFromAnesthesiaQualityInitiative622);
/** 1.2.840.10008.6.1.1088 Medication for Small Animal Anesthesia (623) */
export const MedicationForSmallAnimalAnesthesia623 = new DicomUID("1.2.840.10008.6.1.1088", "Medication for Small Animal Anesthesia (623)", DicomUidType.ContextGroupName, false);
DicomUID.register(MedicationForSmallAnimalAnesthesia623);
/** 1.2.840.10008.6.1.1089 Inhalational Anesthesia Agent for Small Animal Anesthesia (624) */
export const InhalationalAnesthesiaAgentForSmallAnimalAnesthesia624 = new DicomUID("1.2.840.10008.6.1.1089", "Inhalational Anesthesia Agent for Small Animal Anesthesia (624)", DicomUidType.ContextGroupName, false);
DicomUID.register(InhalationalAnesthesiaAgentForSmallAnimalAnesthesia624);
/** 1.2.840.10008.6.1.1090 Injectable Anesthesia Agent for Small Animal Anesthesia (625) */
export const InjectableAnesthesiaAgentForSmallAnimalAnesthesia625 = new DicomUID("1.2.840.10008.6.1.1090", "Injectable Anesthesia Agent for Small Animal Anesthesia (625)", DicomUidType.ContextGroupName, false);
DicomUID.register(InjectableAnesthesiaAgentForSmallAnimalAnesthesia625);
/** 1.2.840.10008.6.1.1091 Premedication Agent for Small Animal Anesthesia (626) */
export const PremedicationAgentForSmallAnimalAnesthesia626 = new DicomUID("1.2.840.10008.6.1.1091", "Premedication Agent for Small Animal Anesthesia (626)", DicomUidType.ContextGroupName, false);
DicomUID.register(PremedicationAgentForSmallAnimalAnesthesia626);
/** 1.2.840.10008.6.1.1092 Neuromuscular Blocking Agent for Small Animal Anesthesia (627) */
export const NeuromuscularBlockingAgentForSmallAnimalAnesthesia627 = new DicomUID("1.2.840.10008.6.1.1092", "Neuromuscular Blocking Agent for Small Animal Anesthesia (627)", DicomUidType.ContextGroupName, false);
DicomUID.register(NeuromuscularBlockingAgentForSmallAnimalAnesthesia627);
/** 1.2.840.10008.6.1.1093 Ancillary Medications for Small Animal Anesthesia (628) */
export const AncillaryMedicationsForSmallAnimalAnesthesia628 = new DicomUID("1.2.840.10008.6.1.1093", "Ancillary Medications for Small Animal Anesthesia (628)", DicomUidType.ContextGroupName, false);
DicomUID.register(AncillaryMedicationsForSmallAnimalAnesthesia628);
/** 1.2.840.10008.6.1.1094 Carrier Gases for Small Animal Anesthesia (629) */
export const CarrierGasesForSmallAnimalAnesthesia629 = new DicomUID("1.2.840.10008.6.1.1094", "Carrier Gases for Small Animal Anesthesia (629)", DicomUidType.ContextGroupName, false);
DicomUID.register(CarrierGasesForSmallAnimalAnesthesia629);
/** 1.2.840.10008.6.1.1095 Local Anesthetics for Small Animal Anesthesia (630) */
export const LocalAnestheticsForSmallAnimalAnesthesia630 = new DicomUID("1.2.840.10008.6.1.1095", "Local Anesthetics for Small Animal Anesthesia (630)", DicomUidType.ContextGroupName, false);
DicomUID.register(LocalAnestheticsForSmallAnimalAnesthesia630);
/** 1.2.840.10008.6.1.1096 Procedure Phase Requiring Anesthesia (631) */
export const ProcedurePhaseRequiringAnesthesia631 = new DicomUID("1.2.840.10008.6.1.1096", "Procedure Phase Requiring Anesthesia (631)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProcedurePhaseRequiringAnesthesia631);
/** 1.2.840.10008.6.1.1097 Surgical Procedure Phase Requiring Anesthesia (632) */
export const SurgicalProcedurePhaseRequiringAnesthesia632 = new DicomUID("1.2.840.10008.6.1.1097", "Surgical Procedure Phase Requiring Anesthesia (632)", DicomUidType.ContextGroupName, false);
DicomUID.register(SurgicalProcedurePhaseRequiringAnesthesia632);
/** 1.2.840.10008.6.1.1098 Phase of Imaging Procedure Requiring Anesthesia (Retired) (633) (Retired) */
export const PhaseOfImagingProcedureRequiringAnesthesia633 = new DicomUID("1.2.840.10008.6.1.1098", "Phase of Imaging Procedure Requiring Anesthesia (Retired) (633)", DicomUidType.ContextGroupName, true);
DicomUID.register(PhaseOfImagingProcedureRequiringAnesthesia633);
/** 1.2.840.10008.6.1.1099 Animal Handling Phase (634) */
export const AnimalHandlingPhase634 = new DicomUID("1.2.840.10008.6.1.1099", "Animal Handling Phase (634)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnimalHandlingPhase634);
/** 1.2.840.10008.6.1.1100 Heating Method (635) */
export const HeatingMethod635 = new DicomUID("1.2.840.10008.6.1.1100", "Heating Method (635)", DicomUidType.ContextGroupName, false);
DicomUID.register(HeatingMethod635);
/** 1.2.840.10008.6.1.1101 Temperature Sensor Device Component Type for Small Animal Procedure (636) */
export const TemperatureSensorDeviceComponentTypeForSmallAnimalProcedure636 = new DicomUID("1.2.840.10008.6.1.1101", "Temperature Sensor Device Component Type for Small Animal Procedure (636)", DicomUidType.ContextGroupName, false);
DicomUID.register(TemperatureSensorDeviceComponentTypeForSmallAnimalProcedure636);
/** 1.2.840.10008.6.1.1102 Exogenous Substance Type (637) */
export const ExogenousSubstanceType637 = new DicomUID("1.2.840.10008.6.1.1102", "Exogenous Substance Type (637)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExogenousSubstanceType637);
/** 1.2.840.10008.6.1.1103 Exogenous Substance (638) */
export const ExogenousSubstance638 = new DicomUID("1.2.840.10008.6.1.1103", "Exogenous Substance (638)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExogenousSubstance638);
/** 1.2.840.10008.6.1.1104 Tumor Graft Histologic Type (639) */
export const TumorGraftHistologicType639 = new DicomUID("1.2.840.10008.6.1.1104", "Tumor Graft Histologic Type (639)", DicomUidType.ContextGroupName, false);
DicomUID.register(TumorGraftHistologicType639);
/** 1.2.840.10008.6.1.1105 Fibril (640) */
export const Fibril640 = new DicomUID("1.2.840.10008.6.1.1105", "Fibril (640)", DicomUidType.ContextGroupName, false);
DicomUID.register(Fibril640);
/** 1.2.840.10008.6.1.1106 Virus (641) */
export const Virus641 = new DicomUID("1.2.840.10008.6.1.1106", "Virus (641)", DicomUidType.ContextGroupName, false);
DicomUID.register(Virus641);
/** 1.2.840.10008.6.1.1107 Cytokine (642) */
export const Cytokine642 = new DicomUID("1.2.840.10008.6.1.1107", "Cytokine (642)", DicomUidType.ContextGroupName, false);
DicomUID.register(Cytokine642);
/** 1.2.840.10008.6.1.1108 Toxin (643) */
export const Toxin643 = new DicomUID("1.2.840.10008.6.1.1108", "Toxin (643)", DicomUidType.ContextGroupName, false);
DicomUID.register(Toxin643);
/** 1.2.840.10008.6.1.1109 Exogenous Substance Administration Site (644) */
export const ExogenousSubstanceAdministrationSite644 = new DicomUID("1.2.840.10008.6.1.1109", "Exogenous Substance Administration Site (644)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExogenousSubstanceAdministrationSite644);
/** 1.2.840.10008.6.1.1110 Exogenous Substance Origin Tissue (645) */
export const ExogenousSubstanceOriginTissue645 = new DicomUID("1.2.840.10008.6.1.1110", "Exogenous Substance Origin Tissue (645)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExogenousSubstanceOriginTissue645);
/** 1.2.840.10008.6.1.1111 Preclinical Small Animal Imaging Procedure (646) */
export const PreclinicalSmallAnimalImagingProcedure646 = new DicomUID("1.2.840.10008.6.1.1111", "Preclinical Small Animal Imaging Procedure (646)", DicomUidType.ContextGroupName, false);
DicomUID.register(PreclinicalSmallAnimalImagingProcedure646);
/** 1.2.840.10008.6.1.1112 Position Reference Indicator for Frame of Reference (647) */
export const PositionReferenceIndicatorForFrameOfReference647 = new DicomUID("1.2.840.10008.6.1.1112", "Position Reference Indicator for Frame of Reference (647)", DicomUidType.ContextGroupName, false);
DicomUID.register(PositionReferenceIndicatorForFrameOfReference647);
/** 1.2.840.10008.6.1.1113 Present-Absent Only (241) */
export const PresentAbsentOnly241 = new DicomUID("1.2.840.10008.6.1.1113", "Present-Absent Only (241)", DicomUidType.ContextGroupName, false);
DicomUID.register(PresentAbsentOnly241);
/** 1.2.840.10008.6.1.1114 Water Equivalent Diameter Method (10024) */
export const WaterEquivalentDiameterMethod10024 = new DicomUID("1.2.840.10008.6.1.1114", "Water Equivalent Diameter Method (10024)", DicomUidType.ContextGroupName, false);
DicomUID.register(WaterEquivalentDiameterMethod10024);
/** 1.2.840.10008.6.1.1115 Radiotherapy Purpose of Reference (7022) */
export const RadiotherapyPurposeOfReference7022 = new DicomUID("1.2.840.10008.6.1.1115", "Radiotherapy Purpose of Reference (7022)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyPurposeOfReference7022);
/** 1.2.840.10008.6.1.1116 Content Assessment Type (701) */
export const ContentAssessmentType701 = new DicomUID("1.2.840.10008.6.1.1116", "Content Assessment Type (701)", DicomUidType.ContextGroupName, false);
DicomUID.register(ContentAssessmentType701);
/** 1.2.840.10008.6.1.1117 RT Content Assessment Type (702) */
export const RTContentAssessmentType702 = new DicomUID("1.2.840.10008.6.1.1117", "RT Content Assessment Type (702)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTContentAssessmentType702);
/** 1.2.840.10008.6.1.1118 Assessment Basis (703) */
export const AssessmentBasis703 = new DicomUID("1.2.840.10008.6.1.1118", "Assessment Basis (703)", DicomUidType.ContextGroupName, false);
DicomUID.register(AssessmentBasis703);
/** 1.2.840.10008.6.1.1119 Reader Specialty (7449) */
export const ReaderSpecialty7449 = new DicomUID("1.2.840.10008.6.1.1119", "Reader Specialty (7449)", DicomUidType.ContextGroupName, false);
DicomUID.register(ReaderSpecialty7449);
/** 1.2.840.10008.6.1.1120 Requested Report Type (9233) */
export const RequestedReportType9233 = new DicomUID("1.2.840.10008.6.1.1120", "Requested Report Type (9233)", DicomUidType.ContextGroupName, false);
DicomUID.register(RequestedReportType9233);
/** 1.2.840.10008.6.1.1121 CT Transverse Plane Reference Basis (1000) */
export const CTTransversePlaneReferenceBasis1000 = new DicomUID("1.2.840.10008.6.1.1121", "CT Transverse Plane Reference Basis (1000)", DicomUidType.ContextGroupName, false);
DicomUID.register(CTTransversePlaneReferenceBasis1000);
/** 1.2.840.10008.6.1.1122 Anatomical Reference Basis (1001) */
export const AnatomicalReferenceBasis1001 = new DicomUID("1.2.840.10008.6.1.1122", "Anatomical Reference Basis (1001)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicalReferenceBasis1001);
/** 1.2.840.10008.6.1.1123 Anatomical Reference Basis - Head (1002) */
export const AnatomicalReferenceBasisHead1002 = new DicomUID("1.2.840.10008.6.1.1123", "Anatomical Reference Basis - Head (1002)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicalReferenceBasisHead1002);
/** 1.2.840.10008.6.1.1124 Anatomical Reference Basis - Spine (1003) */
export const AnatomicalReferenceBasisSpine1003 = new DicomUID("1.2.840.10008.6.1.1124", "Anatomical Reference Basis - Spine (1003)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicalReferenceBasisSpine1003);
/** 1.2.840.10008.6.1.1125 Anatomical Reference Basis - Chest (1004) */
export const AnatomicalReferenceBasisChest1004 = new DicomUID("1.2.840.10008.6.1.1125", "Anatomical Reference Basis - Chest (1004)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicalReferenceBasisChest1004);
/** 1.2.840.10008.6.1.1126 Anatomical Reference Basis - Abdomen/Pelvis (1005) */
export const AnatomicalReferenceBasisAbdomenPelvis1005 = new DicomUID("1.2.840.10008.6.1.1126", "Anatomical Reference Basis - Abdomen/Pelvis (1005)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicalReferenceBasisAbdomenPelvis1005);
/** 1.2.840.10008.6.1.1127 Anatomical Reference Basis - Extremity (1006) */
export const AnatomicalReferenceBasisExtremity1006 = new DicomUID("1.2.840.10008.6.1.1127", "Anatomical Reference Basis - Extremity (1006)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicalReferenceBasisExtremity1006);
/** 1.2.840.10008.6.1.1128 Reference Geometry - Plane (1010) */
export const ReferenceGeometryPlane1010 = new DicomUID("1.2.840.10008.6.1.1128", "Reference Geometry - Plane (1010)", DicomUidType.ContextGroupName, false);
DicomUID.register(ReferenceGeometryPlane1010);
/** 1.2.840.10008.6.1.1129 Reference Geometry - Point (1011) */
export const ReferenceGeometryPoint1011 = new DicomUID("1.2.840.10008.6.1.1129", "Reference Geometry - Point (1011)", DicomUidType.ContextGroupName, false);
DicomUID.register(ReferenceGeometryPoint1011);
/** 1.2.840.10008.6.1.1130 Patient Alignment Method (1015) */
export const PatientAlignmentMethod1015 = new DicomUID("1.2.840.10008.6.1.1130", "Patient Alignment Method (1015)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientAlignmentMethod1015);
/** 1.2.840.10008.6.1.1131 Contraindications For CT Imaging (1200) */
export const ContraindicationsForCTImaging1200 = new DicomUID("1.2.840.10008.6.1.1131", "Contraindications For CT Imaging (1200)", DicomUidType.ContextGroupName, false);
DicomUID.register(ContraindicationsForCTImaging1200);
/** 1.2.840.10008.6.1.1132 Fiducial Category (7110) */
export const FiducialCategory7110 = new DicomUID("1.2.840.10008.6.1.1132", "Fiducial Category (7110)", DicomUidType.ContextGroupName, false);
DicomUID.register(FiducialCategory7110);
/** 1.2.840.10008.6.1.1133 Fiducial (7111) */
export const Fiducial7111 = new DicomUID("1.2.840.10008.6.1.1133", "Fiducial (7111)", DicomUidType.ContextGroupName, false);
DicomUID.register(Fiducial7111);
/** 1.2.840.10008.6.1.1134 Non-Image Source Instance Purpose of Reference (7013) */
export const NonImageSourceInstancePurposeOfReference7013 = new DicomUID("1.2.840.10008.6.1.1134", "Non-Image Source Instance Purpose of Reference (7013)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonImageSourceInstancePurposeOfReference7013);
/** 1.2.840.10008.6.1.1135 RT Process Output (7023) */
export const RTProcessOutput7023 = new DicomUID("1.2.840.10008.6.1.1135", "RT Process Output (7023)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTProcessOutput7023);
/** 1.2.840.10008.6.1.1136 RT Process Input (7024) */
export const RTProcessInput7024 = new DicomUID("1.2.840.10008.6.1.1136", "RT Process Input (7024)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTProcessInput7024);
/** 1.2.840.10008.6.1.1137 RT Process Input Used (7025) */
export const RTProcessInputUsed7025 = new DicomUID("1.2.840.10008.6.1.1137", "RT Process Input Used (7025)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTProcessInputUsed7025);
/** 1.2.840.10008.6.1.1138 Prostate Anatomy (6300) */
export const ProstateAnatomy6300 = new DicomUID("1.2.840.10008.6.1.1138", "Prostate Anatomy (6300)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateAnatomy6300);
/** 1.2.840.10008.6.1.1139 Prostate Sector Anatomy from PI-RADS v2 (6301) */
export const ProstateSectorAnatomyFromPIRADSV26301 = new DicomUID("1.2.840.10008.6.1.1139", "Prostate Sector Anatomy from PI-RADS v2 (6301)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateSectorAnatomyFromPIRADSV26301);
/** 1.2.840.10008.6.1.1140 Prostate Sector Anatomy from European Concensus 16 Sector (Minimal) Model (6302) */
export const ProstateSectorAnatomyFromEuropeanConcensus16SectorMinimalModel6302 = new DicomUID("1.2.840.10008.6.1.1140", "Prostate Sector Anatomy from European Concensus 16 Sector (Minimal) Model (6302)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateSectorAnatomyFromEuropeanConcensus16SectorMinimalModel6302);
/** 1.2.840.10008.6.1.1141 Prostate Sector Anatomy from European Concensus 27 Sector (Optimal) Model (6303) */
export const ProstateSectorAnatomyFromEuropeanConcensus27SectorOptimalModel6303 = new DicomUID("1.2.840.10008.6.1.1141", "Prostate Sector Anatomy from European Concensus 27 Sector (Optimal) Model (6303)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateSectorAnatomyFromEuropeanConcensus27SectorOptimalModel6303);
/** 1.2.840.10008.6.1.1142 Measurement Selection Reason (12301) */
export const MeasurementSelectionReason12301 = new DicomUID("1.2.840.10008.6.1.1142", "Measurement Selection Reason (12301)", DicomUidType.ContextGroupName, false);
DicomUID.register(MeasurementSelectionReason12301);
/** 1.2.840.10008.6.1.1143 Echo Finding Observation Type (12302) */
export const EchoFindingObservationType12302 = new DicomUID("1.2.840.10008.6.1.1143", "Echo Finding Observation Type (12302)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchoFindingObservationType12302);
/** 1.2.840.10008.6.1.1144 Echo Measurement Type (12303) */
export const EchoMeasurementType12303 = new DicomUID("1.2.840.10008.6.1.1144", "Echo Measurement Type (12303)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchoMeasurementType12303);
/** 1.2.840.10008.6.1.1145 Cardiovascular Measured Property (12304) */
export const CardiovascularMeasuredProperty12304 = new DicomUID("1.2.840.10008.6.1.1145", "Cardiovascular Measured Property (12304)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiovascularMeasuredProperty12304);
/** 1.2.840.10008.6.1.1146 Basic Echo Anatomic Site (12305) */
export const BasicEchoAnatomicSite12305 = new DicomUID("1.2.840.10008.6.1.1146", "Basic Echo Anatomic Site (12305)", DicomUidType.ContextGroupName, false);
DicomUID.register(BasicEchoAnatomicSite12305);
/** 1.2.840.10008.6.1.1147 Echo Flow Direction (12306) */
export const EchoFlowDirection12306 = new DicomUID("1.2.840.10008.6.1.1147", "Echo Flow Direction (12306)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchoFlowDirection12306);
/** 1.2.840.10008.6.1.1148 Cardiac Phase and Time Point (12307) */
export const CardiacPhaseAndTimePoint12307 = new DicomUID("1.2.840.10008.6.1.1148", "Cardiac Phase and Time Point (12307)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacPhaseAndTimePoint12307);
/** 1.2.840.10008.6.1.1149 Core Echo Measurement (12300) */
export const CoreEchoMeasurement12300 = new DicomUID("1.2.840.10008.6.1.1149", "Core Echo Measurement (12300)", DicomUidType.ContextGroupName, false);
DicomUID.register(CoreEchoMeasurement12300);
/** 1.2.840.10008.6.1.1150 OCT-A Processing Algorithm Family (4270) */
export const OCTAProcessingAlgorithmFamily4270 = new DicomUID("1.2.840.10008.6.1.1150", "OCT-A Processing Algorithm Family (4270)", DicomUidType.ContextGroupName, false);
DicomUID.register(OCTAProcessingAlgorithmFamily4270);
/** 1.2.840.10008.6.1.1151 En Face Image Type (4271) */
export const EnFaceImageType4271 = new DicomUID("1.2.840.10008.6.1.1151", "En Face Image Type (4271)", DicomUidType.ContextGroupName, false);
DicomUID.register(EnFaceImageType4271);
/** 1.2.840.10008.6.1.1152 OPT Scan Pattern Type (4272) */
export const OPTScanPatternType4272 = new DicomUID("1.2.840.10008.6.1.1152", "OPT Scan Pattern Type (4272)", DicomUidType.ContextGroupName, false);
DicomUID.register(OPTScanPatternType4272);
/** 1.2.840.10008.6.1.1153 Retinal Segmentation Surface (4273) */
export const RetinalSegmentationSurface4273 = new DicomUID("1.2.840.10008.6.1.1153", "Retinal Segmentation Surface (4273)", DicomUidType.ContextGroupName, false);
DicomUID.register(RetinalSegmentationSurface4273);
/** 1.2.840.10008.6.1.1154 Organ for Radiation Dose Estimate (10060) */
export const OrganForRadiationDoseEstimate10060 = new DicomUID("1.2.840.10008.6.1.1154", "Organ for Radiation Dose Estimate (10060)", DicomUidType.ContextGroupName, false);
DicomUID.register(OrganForRadiationDoseEstimate10060);
/** 1.2.840.10008.6.1.1155 Absorbed Radiation Dose Type (10061) */
export const AbsorbedRadiationDoseType10061 = new DicomUID("1.2.840.10008.6.1.1155", "Absorbed Radiation Dose Type (10061)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbsorbedRadiationDoseType10061);
/** 1.2.840.10008.6.1.1156 Equivalent Radiation Dose Type (10062) */
export const EquivalentRadiationDoseType10062 = new DicomUID("1.2.840.10008.6.1.1156", "Equivalent Radiation Dose Type (10062)", DicomUidType.ContextGroupName, false);
DicomUID.register(EquivalentRadiationDoseType10062);
/** 1.2.840.10008.6.1.1157 Radiation Dose Estimate Distribution Representation (10063) */
export const RadiationDoseEstimateDistributionRepresentation10063 = new DicomUID("1.2.840.10008.6.1.1157", "Radiation Dose Estimate Distribution Representation (10063)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationDoseEstimateDistributionRepresentation10063);
/** 1.2.840.10008.6.1.1158 Patient Model Type (10064) */
export const PatientModelType10064 = new DicomUID("1.2.840.10008.6.1.1158", "Patient Model Type (10064)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientModelType10064);
/** 1.2.840.10008.6.1.1159 Radiation Transport Model Type (10065) */
export const RadiationTransportModelType10065 = new DicomUID("1.2.840.10008.6.1.1159", "Radiation Transport Model Type (10065)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationTransportModelType10065);
/** 1.2.840.10008.6.1.1160 Attenuator Category (10066) */
export const AttenuatorCategory10066 = new DicomUID("1.2.840.10008.6.1.1160", "Attenuator Category (10066)", DicomUidType.ContextGroupName, false);
DicomUID.register(AttenuatorCategory10066);
/** 1.2.840.10008.6.1.1161 Radiation Attenuator Material (10067) */
export const RadiationAttenuatorMaterial10067 = new DicomUID("1.2.840.10008.6.1.1161", "Radiation Attenuator Material (10067)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationAttenuatorMaterial10067);
/** 1.2.840.10008.6.1.1162 Estimate Method Type (10068) */
export const EstimateMethodType10068 = new DicomUID("1.2.840.10008.6.1.1162", "Estimate Method Type (10068)", DicomUidType.ContextGroupName, false);
DicomUID.register(EstimateMethodType10068);
/** 1.2.840.10008.6.1.1163 Radiation Dose Estimate Parameter (10069) */
export const RadiationDoseEstimateParameter10069 = new DicomUID("1.2.840.10008.6.1.1163", "Radiation Dose Estimate Parameter (10069)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationDoseEstimateParameter10069);
/** 1.2.840.10008.6.1.1164 Radiation Dose Type (10070) */
export const RadiationDoseType10070 = new DicomUID("1.2.840.10008.6.1.1164", "Radiation Dose Type (10070)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationDoseType10070);
/** 1.2.840.10008.6.1.1165 MR Diffusion Component Semantic (7270) */
export const MRDiffusionComponentSemantic7270 = new DicomUID("1.2.840.10008.6.1.1165", "MR Diffusion Component Semantic (7270)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRDiffusionComponentSemantic7270);
/** 1.2.840.10008.6.1.1166 MR Diffusion Anisotropy Index (7271) */
export const MRDiffusionAnisotropyIndex7271 = new DicomUID("1.2.840.10008.6.1.1166", "MR Diffusion Anisotropy Index (7271)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRDiffusionAnisotropyIndex7271);
/** 1.2.840.10008.6.1.1167 MR Diffusion Model Parameter (7272) */
export const MRDiffusionModelParameter7272 = new DicomUID("1.2.840.10008.6.1.1167", "MR Diffusion Model Parameter (7272)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRDiffusionModelParameter7272);
/** 1.2.840.10008.6.1.1168 MR Diffusion Model (7273) */
export const MRDiffusionModel7273 = new DicomUID("1.2.840.10008.6.1.1168", "MR Diffusion Model (7273)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRDiffusionModel7273);
/** 1.2.840.10008.6.1.1169 MR Diffusion Model Fitting Method (7274) */
export const MRDiffusionModelFittingMethod7274 = new DicomUID("1.2.840.10008.6.1.1169", "MR Diffusion Model Fitting Method (7274)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRDiffusionModelFittingMethod7274);
/** 1.2.840.10008.6.1.1170 MR Diffusion Model Specific Method (7275) */
export const MRDiffusionModelSpecificMethod7275 = new DicomUID("1.2.840.10008.6.1.1170", "MR Diffusion Model Specific Method (7275)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRDiffusionModelSpecificMethod7275);
/** 1.2.840.10008.6.1.1171 MR Diffusion Model Input (7276) */
export const MRDiffusionModelInput7276 = new DicomUID("1.2.840.10008.6.1.1171", "MR Diffusion Model Input (7276)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRDiffusionModelInput7276);
/** 1.2.840.10008.6.1.1172 Diffusion Rate Area Over Time Unit (7277) */
export const DiffusionRateAreaOverTimeUnit7277 = new DicomUID("1.2.840.10008.6.1.1172", "Diffusion Rate Area Over Time Unit (7277)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiffusionRateAreaOverTimeUnit7277);
/** 1.2.840.10008.6.1.1173 Pediatric Size Category (7039) */
export const PediatricSizeCategory7039 = new DicomUID("1.2.840.10008.6.1.1173", "Pediatric Size Category (7039)", DicomUidType.ContextGroupName, false);
DicomUID.register(PediatricSizeCategory7039);
/** 1.2.840.10008.6.1.1174 Calcium Scoring Patient Size Category (7041) */
export const CalciumScoringPatientSizeCategory7041 = new DicomUID("1.2.840.10008.6.1.1174", "Calcium Scoring Patient Size Category (7041)", DicomUidType.ContextGroupName, false);
DicomUID.register(CalciumScoringPatientSizeCategory7041);
/** 1.2.840.10008.6.1.1175 Reason for Repeating Acquisition (10034) */
export const ReasonForRepeatingAcquisition10034 = new DicomUID("1.2.840.10008.6.1.1175", "Reason for Repeating Acquisition (10034)", DicomUidType.ContextGroupName, false);
DicomUID.register(ReasonForRepeatingAcquisition10034);
/** 1.2.840.10008.6.1.1176 Protocol Assertion (800) */
export const ProtocolAssertion800 = new DicomUID("1.2.840.10008.6.1.1176", "Protocol Assertion (800)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProtocolAssertion800);
/** 1.2.840.10008.6.1.1177 Radiotherapeutic Dose Measurement Device (7026) */
export const RadiotherapeuticDoseMeasurementDevice7026 = new DicomUID("1.2.840.10008.6.1.1177", "Radiotherapeutic Dose Measurement Device (7026)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapeuticDoseMeasurementDevice7026);
/** 1.2.840.10008.6.1.1178 Export Additional Information Document Title (7014) */
export const ExportAdditionalInformationDocumentTitle7014 = new DicomUID("1.2.840.10008.6.1.1178", "Export Additional Information Document Title (7014)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExportAdditionalInformationDocumentTitle7014);
/** 1.2.840.10008.6.1.1179 Export Delay Reason (7015) */
export const ExportDelayReason7015 = new DicomUID("1.2.840.10008.6.1.1179", "Export Delay Reason (7015)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExportDelayReason7015);
/** 1.2.840.10008.6.1.1180 Level of Difficulty (7016) */
export const LevelOfDifficulty7016 = new DicomUID("1.2.840.10008.6.1.1180", "Level of Difficulty (7016)", DicomUidType.ContextGroupName, false);
DicomUID.register(LevelOfDifficulty7016);
/** 1.2.840.10008.6.1.1181 Category of Teaching Material - Imaging (7017) */
export const CategoryOfTeachingMaterialImaging7017 = new DicomUID("1.2.840.10008.6.1.1181", "Category of Teaching Material - Imaging (7017)", DicomUidType.ContextGroupName, false);
DicomUID.register(CategoryOfTeachingMaterialImaging7017);
/** 1.2.840.10008.6.1.1182 Miscellaneous Document Title (7018) */
export const MiscellaneousDocumentTitle7018 = new DicomUID("1.2.840.10008.6.1.1182", "Miscellaneous Document Title (7018)", DicomUidType.ContextGroupName, false);
DicomUID.register(MiscellaneousDocumentTitle7018);
/** 1.2.840.10008.6.1.1183 Segmentation Non-Image Source Purpose of Reference (7019) */
export const SegmentationNonImageSourcePurposeOfReference7019 = new DicomUID("1.2.840.10008.6.1.1183", "Segmentation Non-Image Source Purpose of Reference (7019)", DicomUidType.ContextGroupName, false);
DicomUID.register(SegmentationNonImageSourcePurposeOfReference7019);
/** 1.2.840.10008.6.1.1184 Longitudinal Temporal Event Type (280) */
export const LongitudinalTemporalEventType280 = new DicomUID("1.2.840.10008.6.1.1184", "Longitudinal Temporal Event Type (280)", DicomUidType.ContextGroupName, false);
DicomUID.register(LongitudinalTemporalEventType280);
/** 1.2.840.10008.6.1.1185 Non-lesion Object Type - Physical Object (6401) */
export const NonLesionObjectTypePhysicalObject6401 = new DicomUID("1.2.840.10008.6.1.1185", "Non-lesion Object Type - Physical Object (6401)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonLesionObjectTypePhysicalObject6401);
/** 1.2.840.10008.6.1.1186 Non-lesion Object Type - Substance (6402) */
export const NonLesionObjectTypeSubstance6402 = new DicomUID("1.2.840.10008.6.1.1186", "Non-lesion Object Type - Substance (6402)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonLesionObjectTypeSubstance6402);
/** 1.2.840.10008.6.1.1187 Non-lesion Object Type - Tissue (6403) */
export const NonLesionObjectTypeTissue6403 = new DicomUID("1.2.840.10008.6.1.1187", "Non-lesion Object Type - Tissue (6403)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonLesionObjectTypeTissue6403);
/** 1.2.840.10008.6.1.1188 Chest Non-lesion Object Type - Physical Object (6404) */
export const ChestNonLesionObjectTypePhysicalObject6404 = new DicomUID("1.2.840.10008.6.1.1188", "Chest Non-lesion Object Type - Physical Object (6404)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestNonLesionObjectTypePhysicalObject6404);
/** 1.2.840.10008.6.1.1189 Chest Non-lesion Object Type - Tissue (6405) */
export const ChestNonLesionObjectTypeTissue6405 = new DicomUID("1.2.840.10008.6.1.1189", "Chest Non-lesion Object Type - Tissue (6405)", DicomUidType.ContextGroupName, false);
DicomUID.register(ChestNonLesionObjectTypeTissue6405);
/** 1.2.840.10008.6.1.1190 Tissue Segmentation Property Type (7191) */
export const TissueSegmentationPropertyType7191 = new DicomUID("1.2.840.10008.6.1.1190", "Tissue Segmentation Property Type (7191)", DicomUidType.ContextGroupName, false);
DicomUID.register(TissueSegmentationPropertyType7191);
/** 1.2.840.10008.6.1.1191 Anatomical Structure Segmentation Property Type (7192) */
export const AnatomicalStructureSegmentationPropertyType7192 = new DicomUID("1.2.840.10008.6.1.1191", "Anatomical Structure Segmentation Property Type (7192)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicalStructureSegmentationPropertyType7192);
/** 1.2.840.10008.6.1.1192 Physical Object Segmentation Property Type (7193) */
export const PhysicalObjectSegmentationPropertyType7193 = new DicomUID("1.2.840.10008.6.1.1192", "Physical Object Segmentation Property Type (7193)", DicomUidType.ContextGroupName, false);
DicomUID.register(PhysicalObjectSegmentationPropertyType7193);
/** 1.2.840.10008.6.1.1193 Morphologically Abnormal Structure Segmentation Property Type (7194) */
export const MorphologicallyAbnormalStructureSegmentationPropertyType7194 = new DicomUID("1.2.840.10008.6.1.1193", "Morphologically Abnormal Structure Segmentation Property Type (7194)", DicomUidType.ContextGroupName, false);
DicomUID.register(MorphologicallyAbnormalStructureSegmentationPropertyType7194);
/** 1.2.840.10008.6.1.1194 Function Segmentation Property Type (7195) */
export const FunctionSegmentationPropertyType7195 = new DicomUID("1.2.840.10008.6.1.1194", "Function Segmentation Property Type (7195)", DicomUidType.ContextGroupName, false);
DicomUID.register(FunctionSegmentationPropertyType7195);
/** 1.2.840.10008.6.1.1195 Spatial and Relational Concept Segmentation Property Type (7196) */
export const SpatialAndRelationalConceptSegmentationPropertyType7196 = new DicomUID("1.2.840.10008.6.1.1195", "Spatial and Relational Concept Segmentation Property Type (7196)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpatialAndRelationalConceptSegmentationPropertyType7196);
/** 1.2.840.10008.6.1.1196 Body Substance Segmentation Property Type (7197) */
export const BodySubstanceSegmentationPropertyType7197 = new DicomUID("1.2.840.10008.6.1.1196", "Body Substance Segmentation Property Type (7197)", DicomUidType.ContextGroupName, false);
DicomUID.register(BodySubstanceSegmentationPropertyType7197);
/** 1.2.840.10008.6.1.1197 Substance Segmentation Property Type (7198) */
export const SubstanceSegmentationPropertyType7198 = new DicomUID("1.2.840.10008.6.1.1197", "Substance Segmentation Property Type (7198)", DicomUidType.ContextGroupName, false);
DicomUID.register(SubstanceSegmentationPropertyType7198);
/** 1.2.840.10008.6.1.1198 Interpretation Request Discontinuation Reason (9303) */
export const InterpretationRequestDiscontinuationReason9303 = new DicomUID("1.2.840.10008.6.1.1198", "Interpretation Request Discontinuation Reason (9303)", DicomUidType.ContextGroupName, false);
DicomUID.register(InterpretationRequestDiscontinuationReason9303);
/** 1.2.840.10008.6.1.1199 Gray Level Run Length Based Feature (7475) */
export const GrayLevelRunLengthBasedFeature7475 = new DicomUID("1.2.840.10008.6.1.1199", "Gray Level Run Length Based Feature (7475)", DicomUidType.ContextGroupName, false);
DicomUID.register(GrayLevelRunLengthBasedFeature7475);
/** 1.2.840.10008.6.1.1200 Gray Level Size Zone Based Feature (7476) */
export const GrayLevelSizeZoneBasedFeature7476 = new DicomUID("1.2.840.10008.6.1.1200", "Gray Level Size Zone Based Feature (7476)", DicomUidType.ContextGroupName, false);
DicomUID.register(GrayLevelSizeZoneBasedFeature7476);
/** 1.2.840.10008.6.1.1201 Encapsulated Document Source Purpose of Reference (7060) */
export const EncapsulatedDocumentSourcePurposeOfReference7060 = new DicomUID("1.2.840.10008.6.1.1201", "Encapsulated Document Source Purpose of Reference (7060)", DicomUidType.ContextGroupName, false);
DicomUID.register(EncapsulatedDocumentSourcePurposeOfReference7060);
/** 1.2.840.10008.6.1.1202 Model Document Title (7061) */
export const ModelDocumentTitle7061 = new DicomUID("1.2.840.10008.6.1.1202", "Model Document Title (7061)", DicomUidType.ContextGroupName, false);
DicomUID.register(ModelDocumentTitle7061);
/** 1.2.840.10008.6.1.1203 Purpose of Reference to Predecessor 3D Model (7062) */
export const PurposeOfReferenceToPredecessor3DModel7062 = new DicomUID("1.2.840.10008.6.1.1203", "Purpose of Reference to Predecessor 3D Model (7062)", DicomUidType.ContextGroupName, false);
DicomUID.register(PurposeOfReferenceToPredecessor3DModel7062);
/** 1.2.840.10008.6.1.1204 Model Scale Unit (7063) */
export const ModelScaleUnit7063 = new DicomUID("1.2.840.10008.6.1.1204", "Model Scale Unit (7063)", DicomUidType.ContextGroupName, false);
DicomUID.register(ModelScaleUnit7063);
/** 1.2.840.10008.6.1.1205 Model Usage (7064) */
export const ModelUsage7064 = new DicomUID("1.2.840.10008.6.1.1205", "Model Usage (7064)", DicomUidType.ContextGroupName, false);
DicomUID.register(ModelUsage7064);
/** 1.2.840.10008.6.1.1206 Radiation Dose Unit (10071) */
export const RadiationDoseUnit10071 = new DicomUID("1.2.840.10008.6.1.1206", "Radiation Dose Unit (10071)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationDoseUnit10071);
/** 1.2.840.10008.6.1.1207 Radiotherapy Fiducial (7112) */
export const RadiotherapyFiducial7112 = new DicomUID("1.2.840.10008.6.1.1207", "Radiotherapy Fiducial (7112)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyFiducial7112);
/** 1.2.840.10008.6.1.1208 Multi-energy Relevant Material (300) */
export const MultiEnergyRelevantMaterial300 = new DicomUID("1.2.840.10008.6.1.1208", "Multi-energy Relevant Material (300)", DicomUidType.ContextGroupName, false);
DicomUID.register(MultiEnergyRelevantMaterial300);
/** 1.2.840.10008.6.1.1209 Multi-energy Material Unit (301) */
export const MultiEnergyMaterialUnit301 = new DicomUID("1.2.840.10008.6.1.1209", "Multi-energy Material Unit (301)", DicomUidType.ContextGroupName, false);
DicomUID.register(MultiEnergyMaterialUnit301);
/** 1.2.840.10008.6.1.1210 Dosimetric Objective Type (9500) */
export const DosimetricObjectiveType9500 = new DicomUID("1.2.840.10008.6.1.1210", "Dosimetric Objective Type (9500)", DicomUidType.ContextGroupName, false);
DicomUID.register(DosimetricObjectiveType9500);
/** 1.2.840.10008.6.1.1211 Prescription Anatomy Category (9501) */
export const PrescriptionAnatomyCategory9501 = new DicomUID("1.2.840.10008.6.1.1211", "Prescription Anatomy Category (9501)", DicomUidType.ContextGroupName, false);
DicomUID.register(PrescriptionAnatomyCategory9501);
/** 1.2.840.10008.6.1.1212 RT Segment Annotation Category (9502) */
export const RTSegmentAnnotationCategory9502 = new DicomUID("1.2.840.10008.6.1.1212", "RT Segment Annotation Category (9502)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTSegmentAnnotationCategory9502);
/** 1.2.840.10008.6.1.1213 Radiotherapy Therapeutic Role Category (9503) */
export const RadiotherapyTherapeuticRoleCategory9503 = new DicomUID("1.2.840.10008.6.1.1213", "Radiotherapy Therapeutic Role Category (9503)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyTherapeuticRoleCategory9503);
/** 1.2.840.10008.6.1.1214 RT Geometric Information (9504) */
export const RTGeometricInformation9504 = new DicomUID("1.2.840.10008.6.1.1214", "RT Geometric Information (9504)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTGeometricInformation9504);
/** 1.2.840.10008.6.1.1215 Fixation or Positioning Device (9505) */
export const FixationOrPositioningDevice9505 = new DicomUID("1.2.840.10008.6.1.1215", "Fixation or Positioning Device (9505)", DicomUidType.ContextGroupName, false);
DicomUID.register(FixationOrPositioningDevice9505);
/** 1.2.840.10008.6.1.1216 Brachytherapy Device (9506) */
export const BrachytherapyDevice9506 = new DicomUID("1.2.840.10008.6.1.1216", "Brachytherapy Device (9506)", DicomUidType.ContextGroupName, false);
DicomUID.register(BrachytherapyDevice9506);
/** 1.2.840.10008.6.1.1217 External Body Model (9507) */
export const ExternalBodyModel9507 = new DicomUID("1.2.840.10008.6.1.1217", "External Body Model (9507)", DicomUidType.ContextGroupName, false);
DicomUID.register(ExternalBodyModel9507);
/** 1.2.840.10008.6.1.1218 Non-specific Volume (9508) */
export const NonSpecificVolume9508 = new DicomUID("1.2.840.10008.6.1.1218", "Non-specific Volume (9508)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonSpecificVolume9508);
/** 1.2.840.10008.6.1.1219 Purpose of Reference For RT Physician Intent Input (9509) */
export const PurposeOfReferenceForRTPhysicianIntentInput9509 = new DicomUID("1.2.840.10008.6.1.1219", "Purpose of Reference For RT Physician Intent Input (9509)", DicomUidType.ContextGroupName, false);
DicomUID.register(PurposeOfReferenceForRTPhysicianIntentInput9509);
/** 1.2.840.10008.6.1.1220 Purpose of Reference For RT Treatment Planning Input (9510) */
export const PurposeOfReferenceForRTTreatmentPlanningInput9510 = new DicomUID("1.2.840.10008.6.1.1220", "Purpose of Reference For RT Treatment Planning Input (9510)", DicomUidType.ContextGroupName, false);
DicomUID.register(PurposeOfReferenceForRTTreatmentPlanningInput9510);
/** 1.2.840.10008.6.1.1221 General External Radiotherapy Procedure Technique (9511) */
export const GeneralExternalRadiotherapyProcedureTechnique9511 = new DicomUID("1.2.840.10008.6.1.1221", "General External Radiotherapy Procedure Technique (9511)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralExternalRadiotherapyProcedureTechnique9511);
/** 1.2.840.10008.6.1.1222 Tomotherapeutic Radiotherapy Procedure Technique (9512) */
export const TomotherapeuticRadiotherapyProcedureTechnique9512 = new DicomUID("1.2.840.10008.6.1.1222", "Tomotherapeutic Radiotherapy Procedure Technique (9512)", DicomUidType.ContextGroupName, false);
DicomUID.register(TomotherapeuticRadiotherapyProcedureTechnique9512);
/** 1.2.840.10008.6.1.1223 Fixation Device (9513) */
export const FixationDevice9513 = new DicomUID("1.2.840.10008.6.1.1223", "Fixation Device (9513)", DicomUidType.ContextGroupName, false);
DicomUID.register(FixationDevice9513);
/** 1.2.840.10008.6.1.1224 Anatomical Structure For Radiotherapy (9514) */
export const AnatomicalStructureForRadiotherapy9514 = new DicomUID("1.2.840.10008.6.1.1224", "Anatomical Structure For Radiotherapy (9514)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicalStructureForRadiotherapy9514);
/** 1.2.840.10008.6.1.1225 RT Patient Support Device (9515) */
export const RTPatientSupportDevice9515 = new DicomUID("1.2.840.10008.6.1.1225", "RT Patient Support Device (9515)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTPatientSupportDevice9515);
/** 1.2.840.10008.6.1.1226 Radiotherapy Bolus Device Type (9516) */
export const RadiotherapyBolusDeviceType9516 = new DicomUID("1.2.840.10008.6.1.1226", "Radiotherapy Bolus Device Type (9516)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyBolusDeviceType9516);
/** 1.2.840.10008.6.1.1227 Radiotherapy Block Device Type (9517) */
export const RadiotherapyBlockDeviceType9517 = new DicomUID("1.2.840.10008.6.1.1227", "Radiotherapy Block Device Type (9517)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyBlockDeviceType9517);
/** 1.2.840.10008.6.1.1228 Radiotherapy Accessory No-slot Holder Device Type (9518) */
export const RadiotherapyAccessoryNoSlotHolderDeviceType9518 = new DicomUID("1.2.840.10008.6.1.1228", "Radiotherapy Accessory No-slot Holder Device Type (9518)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyAccessoryNoSlotHolderDeviceType9518);
/** 1.2.840.10008.6.1.1229 Radiotherapy Accessory Slot Holder Device Type (9519) */
export const RadiotherapyAccessorySlotHolderDeviceType9519 = new DicomUID("1.2.840.10008.6.1.1229", "Radiotherapy Accessory Slot Holder Device Type (9519)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyAccessorySlotHolderDeviceType9519);
/** 1.2.840.10008.6.1.1230 Segmented RT Accessory Device (9520) */
export const SegmentedRTAccessoryDevice9520 = new DicomUID("1.2.840.10008.6.1.1230", "Segmented RT Accessory Device (9520)", DicomUidType.ContextGroupName, false);
DicomUID.register(SegmentedRTAccessoryDevice9520);
/** 1.2.840.10008.6.1.1231 Radiotherapy Treatment Energy Unit (9521) */
export const RadiotherapyTreatmentEnergyUnit9521 = new DicomUID("1.2.840.10008.6.1.1231", "Radiotherapy Treatment Energy Unit (9521)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyTreatmentEnergyUnit9521);
/** 1.2.840.10008.6.1.1232 Multi-source Radiotherapy Procedure Technique (9522) */
export const MultiSourceRadiotherapyProcedureTechnique9522 = new DicomUID("1.2.840.10008.6.1.1232", "Multi-source Radiotherapy Procedure Technique (9522)", DicomUidType.ContextGroupName, false);
DicomUID.register(MultiSourceRadiotherapyProcedureTechnique9522);
/** 1.2.840.10008.6.1.1233 Robotic Radiotherapy Procedure Technique (9523) */
export const RoboticRadiotherapyProcedureTechnique9523 = new DicomUID("1.2.840.10008.6.1.1233", "Robotic Radiotherapy Procedure Technique (9523)", DicomUidType.ContextGroupName, false);
DicomUID.register(RoboticRadiotherapyProcedureTechnique9523);
/** 1.2.840.10008.6.1.1234 Radiotherapy Procedure Technique (9524) */
export const RadiotherapyProcedureTechnique9524 = new DicomUID("1.2.840.10008.6.1.1234", "Radiotherapy Procedure Technique (9524)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyProcedureTechnique9524);
/** 1.2.840.10008.6.1.1235 Radiation Therapy Particle (9525) */
export const RadiationTherapyParticle9525 = new DicomUID("1.2.840.10008.6.1.1235", "Radiation Therapy Particle (9525)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationTherapyParticle9525);
/** 1.2.840.10008.6.1.1236 Ion Therapy Particle (9526) */
export const IonTherapyParticle9526 = new DicomUID("1.2.840.10008.6.1.1236", "Ion Therapy Particle (9526)", DicomUidType.ContextGroupName, false);
DicomUID.register(IonTherapyParticle9526);
/** 1.2.840.10008.6.1.1237 Teletherapy Isotope (9527) */
export const TeletherapyIsotope9527 = new DicomUID("1.2.840.10008.6.1.1237", "Teletherapy Isotope (9527)", DicomUidType.ContextGroupName, false);
DicomUID.register(TeletherapyIsotope9527);
/** 1.2.840.10008.6.1.1238 Brachytherapy Isotope (9528) */
export const BrachytherapyIsotope9528 = new DicomUID("1.2.840.10008.6.1.1238", "Brachytherapy Isotope (9528)", DicomUidType.ContextGroupName, false);
DicomUID.register(BrachytherapyIsotope9528);
/** 1.2.840.10008.6.1.1239 Single Dose Dosimetric Objective (9529) */
export const SingleDoseDosimetricObjective9529 = new DicomUID("1.2.840.10008.6.1.1239", "Single Dose Dosimetric Objective (9529)", DicomUidType.ContextGroupName, false);
DicomUID.register(SingleDoseDosimetricObjective9529);
/** 1.2.840.10008.6.1.1240 Percentage and Dose Dosimetric Objective (9530) */
export const PercentageAndDoseDosimetricObjective9530 = new DicomUID("1.2.840.10008.6.1.1240", "Percentage and Dose Dosimetric Objective (9530)", DicomUidType.ContextGroupName, false);
DicomUID.register(PercentageAndDoseDosimetricObjective9530);
/** 1.2.840.10008.6.1.1241 Volume and Dose Dosimetric Objective (9531) */
export const VolumeAndDoseDosimetricObjective9531 = new DicomUID("1.2.840.10008.6.1.1241", "Volume and Dose Dosimetric Objective (9531)", DicomUidType.ContextGroupName, false);
DicomUID.register(VolumeAndDoseDosimetricObjective9531);
/** 1.2.840.10008.6.1.1242 No-Parameter Dosimetric Objective (9532) */
export const NoParameterDosimetricObjective9532 = new DicomUID("1.2.840.10008.6.1.1242", "No-Parameter Dosimetric Objective (9532)", DicomUidType.ContextGroupName, false);
DicomUID.register(NoParameterDosimetricObjective9532);
/** 1.2.840.10008.6.1.1243 Delivery Time Structure (9533) */
export const DeliveryTimeStructure9533 = new DicomUID("1.2.840.10008.6.1.1243", "Delivery Time Structure (9533)", DicomUidType.ContextGroupName, false);
DicomUID.register(DeliveryTimeStructure9533);
/** 1.2.840.10008.6.1.1244 Radiotherapy Target (9534) */
export const RadiotherapyTarget9534 = new DicomUID("1.2.840.10008.6.1.1244", "Radiotherapy Target (9534)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyTarget9534);
/** 1.2.840.10008.6.1.1245 Radiotherapy Dose Calculation Role (9535) */
export const RadiotherapyDoseCalculationRole9535 = new DicomUID("1.2.840.10008.6.1.1245", "Radiotherapy Dose Calculation Role (9535)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyDoseCalculationRole9535);
/** 1.2.840.10008.6.1.1246 Radiotherapy Prescribing and Segmenting Person Role (9536) */
export const RadiotherapyPrescribingAndSegmentingPersonRole9536 = new DicomUID("1.2.840.10008.6.1.1246", "Radiotherapy Prescribing and Segmenting Person Role (9536)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyPrescribingAndSegmentingPersonRole9536);
/** 1.2.840.10008.6.1.1247 Effective Dose Calculation Method Category (9537) */
export const EffectiveDoseCalculationMethodCategory9537 = new DicomUID("1.2.840.10008.6.1.1247", "Effective Dose Calculation Method Category (9537)", DicomUidType.ContextGroupName, false);
DicomUID.register(EffectiveDoseCalculationMethodCategory9537);
/** 1.2.840.10008.6.1.1248 Radiation Transport-based Effective Dose Method Modifier (9538) */
export const RadiationTransportBasedEffectiveDoseMethodModifier9538 = new DicomUID("1.2.840.10008.6.1.1248", "Radiation Transport-based Effective Dose Method Modifier (9538)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationTransportBasedEffectiveDoseMethodModifier9538);
/** 1.2.840.10008.6.1.1249 Fractionation-based Effective Dose Method Modifier (9539) */
export const FractionationBasedEffectiveDoseMethodModifier9539 = new DicomUID("1.2.840.10008.6.1.1249", "Fractionation-based Effective Dose Method Modifier (9539)", DicomUidType.ContextGroupName, false);
DicomUID.register(FractionationBasedEffectiveDoseMethodModifier9539);
/** 1.2.840.10008.6.1.1250 Imaging Agent Administration Adverse Event (60) */
export const ImagingAgentAdministrationAdverseEvent60 = new DicomUID("1.2.840.10008.6.1.1250", "Imaging Agent Administration Adverse Event (60)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationAdverseEvent60);
/** 1.2.840.10008.6.1.1251 Time Relative to Procedure (Retired) (61) (Retired) */
export const TimeRelativeToProcedure61 = new DicomUID("1.2.840.10008.6.1.1251", "Time Relative to Procedure (Retired) (61)", DicomUidType.ContextGroupName, true);
DicomUID.register(TimeRelativeToProcedure61);
/** 1.2.840.10008.6.1.1252 Imaging Agent Administration Phase Type (62) */
export const ImagingAgentAdministrationPhaseType62 = new DicomUID("1.2.840.10008.6.1.1252", "Imaging Agent Administration Phase Type (62)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationPhaseType62);
/** 1.2.840.10008.6.1.1253 Imaging Agent Administration Mode (63) */
export const ImagingAgentAdministrationMode63 = new DicomUID("1.2.840.10008.6.1.1253", "Imaging Agent Administration Mode (63)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationMode63);
/** 1.2.840.10008.6.1.1254 Imaging Agent Administration Patient State (64) */
export const ImagingAgentAdministrationPatientState64 = new DicomUID("1.2.840.10008.6.1.1254", "Imaging Agent Administration Patient State (64)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationPatientState64);
/** 1.2.840.10008.6.1.1255 Imaging Agent Administration Premedication (65) */
export const ImagingAgentAdministrationPremedication65 = new DicomUID("1.2.840.10008.6.1.1255", "Imaging Agent Administration Premedication (65)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationPremedication65);
/** 1.2.840.10008.6.1.1256 Imaging Agent Administration Medication (66) */
export const ImagingAgentAdministrationMedication66 = new DicomUID("1.2.840.10008.6.1.1256", "Imaging Agent Administration Medication (66)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationMedication66);
/** 1.2.840.10008.6.1.1257 Imaging Agent Administration Completion Status (67) */
export const ImagingAgentAdministrationCompletionStatus67 = new DicomUID("1.2.840.10008.6.1.1257", "Imaging Agent Administration Completion Status (67)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationCompletionStatus67);
/** 1.2.840.10008.6.1.1258 Imaging Agent Administration Pharmaceutical Presentation Unit (68) */
export const ImagingAgentAdministrationPharmaceuticalPresentationUnit68 = new DicomUID("1.2.840.10008.6.1.1258", "Imaging Agent Administration Pharmaceutical Presentation Unit (68)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationPharmaceuticalPresentationUnit68);
/** 1.2.840.10008.6.1.1259 Imaging Agent Administration Consumable (69) */
export const ImagingAgentAdministrationConsumable69 = new DicomUID("1.2.840.10008.6.1.1259", "Imaging Agent Administration Consumable (69)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationConsumable69);
/** 1.2.840.10008.6.1.1260 Flush (70) */
export const Flush70 = new DicomUID("1.2.840.10008.6.1.1260", "Flush (70)", DicomUidType.ContextGroupName, false);
DicomUID.register(Flush70);
/** 1.2.840.10008.6.1.1261 Imaging Agent Administration Injector Event Type (71) */
export const ImagingAgentAdministrationInjectorEventType71 = new DicomUID("1.2.840.10008.6.1.1261", "Imaging Agent Administration Injector Event Type (71)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationInjectorEventType71);
/** 1.2.840.10008.6.1.1262 Imaging Agent Administration Step Type (72) */
export const ImagingAgentAdministrationStepType72 = new DicomUID("1.2.840.10008.6.1.1262", "Imaging Agent Administration Step Type (72)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationStepType72);
/** 1.2.840.10008.6.1.1263 Bolus Shaping Curve (73) */
export const BolusShapingCurve73 = new DicomUID("1.2.840.10008.6.1.1263", "Bolus Shaping Curve (73)", DicomUidType.ContextGroupName, false);
DicomUID.register(BolusShapingCurve73);
/** 1.2.840.10008.6.1.1264 Imaging Agent Administration Consumable Catheter Type (74) */
export const ImagingAgentAdministrationConsumableCatheterType74 = new DicomUID("1.2.840.10008.6.1.1264", "Imaging Agent Administration Consumable Catheter Type (74)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingAgentAdministrationConsumableCatheterType74);
/** 1.2.840.10008.6.1.1265 Low High or Equal (75) */
export const LowHighOrEqual75 = new DicomUID("1.2.840.10008.6.1.1265", "Low High or Equal (75)", DicomUidType.ContextGroupName, false);
DicomUID.register(LowHighOrEqual75);
/** 1.2.840.10008.6.1.1266 Premedication Type (76) */
export const PremedicationType76 = new DicomUID("1.2.840.10008.6.1.1266", "Premedication Type (76)", DicomUidType.ContextGroupName, false);
DicomUID.register(PremedicationType76);
/** 1.2.840.10008.6.1.1267 Laterality with Median (245) */
export const LateralityWithMedian245 = new DicomUID("1.2.840.10008.6.1.1267", "Laterality with Median (245)", DicomUidType.ContextGroupName, false);
DicomUID.register(LateralityWithMedian245);
/** 1.2.840.10008.6.1.1268 Dermatology Anatomic Site (4029) */
export const DermatologyAnatomicSite4029 = new DicomUID("1.2.840.10008.6.1.1268", "Dermatology Anatomic Site (4029)", DicomUidType.ContextGroupName, false);
DicomUID.register(DermatologyAnatomicSite4029);
/** 1.2.840.10008.6.1.1269 Quantitative Image Feature (218) */
export const QuantitativeImageFeature218 = new DicomUID("1.2.840.10008.6.1.1269", "Quantitative Image Feature (218)", DicomUidType.ContextGroupName, false);
DicomUID.register(QuantitativeImageFeature218);
/** 1.2.840.10008.6.1.1270 Global Shape Descriptor (7477) */
export const GlobalShapeDescriptor7477 = new DicomUID("1.2.840.10008.6.1.1270", "Global Shape Descriptor (7477)", DicomUidType.ContextGroupName, false);
DicomUID.register(GlobalShapeDescriptor7477);
/** 1.2.840.10008.6.1.1271 Intensity Histogram Feature (7478) */
export const IntensityHistogramFeature7478 = new DicomUID("1.2.840.10008.6.1.1271", "Intensity Histogram Feature (7478)", DicomUidType.ContextGroupName, false);
DicomUID.register(IntensityHistogramFeature7478);
/** 1.2.840.10008.6.1.1272 Grey Level Distance Zone Based Feature (7479) */
export const GreyLevelDistanceZoneBasedFeature7479 = new DicomUID("1.2.840.10008.6.1.1272", "Grey Level Distance Zone Based Feature (7479)", DicomUidType.ContextGroupName, false);
DicomUID.register(GreyLevelDistanceZoneBasedFeature7479);
/** 1.2.840.10008.6.1.1273 Neighbourhood Grey Tone Difference Based Feature (7500) */
export const NeighbourhoodGreyToneDifferenceBasedFeature7500 = new DicomUID("1.2.840.10008.6.1.1273", "Neighbourhood Grey Tone Difference Based Feature (7500)", DicomUidType.ContextGroupName, false);
DicomUID.register(NeighbourhoodGreyToneDifferenceBasedFeature7500);
/** 1.2.840.10008.6.1.1274 Neighbouring Grey Level Dependence Based Feature (7501) */
export const NeighbouringGreyLevelDependenceBasedFeature7501 = new DicomUID("1.2.840.10008.6.1.1274", "Neighbouring Grey Level Dependence Based Feature (7501)", DicomUidType.ContextGroupName, false);
DicomUID.register(NeighbouringGreyLevelDependenceBasedFeature7501);
/** 1.2.840.10008.6.1.1275 Cornea Measurement Method Descriptor (4242) */
export const CorneaMeasurementMethodDescriptor4242 = new DicomUID("1.2.840.10008.6.1.1275", "Cornea Measurement Method Descriptor (4242)", DicomUidType.ContextGroupName, false);
DicomUID.register(CorneaMeasurementMethodDescriptor4242);
/** 1.2.840.10008.6.1.1276 Segmented Radiotherapeutic Dose Measurement Device (7027) */
export const SegmentedRadiotherapeuticDoseMeasurementDevice7027 = new DicomUID("1.2.840.10008.6.1.1276", "Segmented Radiotherapeutic Dose Measurement Device (7027)", DicomUidType.ContextGroupName, false);
DicomUID.register(SegmentedRadiotherapeuticDoseMeasurementDevice7027);
/** 1.2.840.10008.6.1.1277 Clinical Course of Disease (6098) */
export const ClinicalCourseOfDisease6098 = new DicomUID("1.2.840.10008.6.1.1277", "Clinical Course of Disease (6098)", DicomUidType.ContextGroupName, false);
DicomUID.register(ClinicalCourseOfDisease6098);
/** 1.2.840.10008.6.1.1278 Racial Group (6099) */
export const RacialGroup6099 = new DicomUID("1.2.840.10008.6.1.1278", "Racial Group (6099)", DicomUidType.ContextGroupName, false);
DicomUID.register(RacialGroup6099);
/** 1.2.840.10008.6.1.1279 Relative Laterality (246) */
export const RelativeLaterality246 = new DicomUID("1.2.840.10008.6.1.1279", "Relative Laterality (246)", DicomUidType.ContextGroupName, false);
DicomUID.register(RelativeLaterality246);
/** 1.2.840.10008.6.1.1280 Brain Lesion Segmentation Type With Necrosis (7168) */
export const BrainLesionSegmentationTypeWithNecrosis7168 = new DicomUID("1.2.840.10008.6.1.1280", "Brain Lesion Segmentation Type With Necrosis (7168)", DicomUidType.ContextGroupName, false);
DicomUID.register(BrainLesionSegmentationTypeWithNecrosis7168);
/** 1.2.840.10008.6.1.1281 Brain Lesion Segmentation Type Without Necrosis (7169) */
export const BrainLesionSegmentationTypeWithoutNecrosis7169 = new DicomUID("1.2.840.10008.6.1.1281", "Brain Lesion Segmentation Type Without Necrosis (7169)", DicomUidType.ContextGroupName, false);
DicomUID.register(BrainLesionSegmentationTypeWithoutNecrosis7169);
/** 1.2.840.10008.6.1.1282 Non-Acquisition Modality (32) */
export const NonAcquisitionModality32 = new DicomUID("1.2.840.10008.6.1.1282", "Non-Acquisition Modality (32)", DicomUidType.ContextGroupName, false);
DicomUID.register(NonAcquisitionModality32);
/** 1.2.840.10008.6.1.1283 Modality (33) */
export const Modality33 = new DicomUID("1.2.840.10008.6.1.1283", "Modality (33)", DicomUidType.ContextGroupName, false);
DicomUID.register(Modality33);
/** 1.2.840.10008.6.1.1284 Laterality Left-Right Only (247) */
export const LateralityLeftRightOnly247 = new DicomUID("1.2.840.10008.6.1.1284", "Laterality Left-Right Only (247)", DicomUidType.ContextGroupName, false);
DicomUID.register(LateralityLeftRightOnly247);
/** 1.2.840.10008.6.1.1285 Qualitative Evaluation Modifier Type (210) */
export const QualitativeEvaluationModifierType210 = new DicomUID("1.2.840.10008.6.1.1285", "Qualitative Evaluation Modifier Type (210)", DicomUidType.ContextGroupName, false);
DicomUID.register(QualitativeEvaluationModifierType210);
/** 1.2.840.10008.6.1.1286 Qualitative Evaluation Modifier Value (211) */
export const QualitativeEvaluationModifierValue211 = new DicomUID("1.2.840.10008.6.1.1286", "Qualitative Evaluation Modifier Value (211)", DicomUidType.ContextGroupName, false);
DicomUID.register(QualitativeEvaluationModifierValue211);
/** 1.2.840.10008.6.1.1287 Generic Anatomic Location Modifier (212) */
export const GenericAnatomicLocationModifier212 = new DicomUID("1.2.840.10008.6.1.1287", "Generic Anatomic Location Modifier (212)", DicomUidType.ContextGroupName, false);
DicomUID.register(GenericAnatomicLocationModifier212);
/** 1.2.840.10008.6.1.1288 Beam Limiting Device Type (9541) */
export const BeamLimitingDeviceType9541 = new DicomUID("1.2.840.10008.6.1.1288", "Beam Limiting Device Type (9541)", DicomUidType.ContextGroupName, false);
DicomUID.register(BeamLimitingDeviceType9541);
/** 1.2.840.10008.6.1.1289 Compensator Device Type (9542) */
export const CompensatorDeviceType9542 = new DicomUID("1.2.840.10008.6.1.1289", "Compensator Device Type (9542)", DicomUidType.ContextGroupName, false);
DicomUID.register(CompensatorDeviceType9542);
/** 1.2.840.10008.6.1.1290 Radiotherapy Treatment Machine Mode (9543) */
export const RadiotherapyTreatmentMachineMode9543 = new DicomUID("1.2.840.10008.6.1.1290", "Radiotherapy Treatment Machine Mode (9543)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyTreatmentMachineMode9543);
/** 1.2.840.10008.6.1.1291 Radiotherapy Distance Reference Location (9544) */
export const RadiotherapyDistanceReferenceLocation9544 = new DicomUID("1.2.840.10008.6.1.1291", "Radiotherapy Distance Reference Location (9544)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyDistanceReferenceLocation9544);
/** 1.2.840.10008.6.1.1292 Fixed Beam Limiting Device Type (9545) */
export const FixedBeamLimitingDeviceType9545 = new DicomUID("1.2.840.10008.6.1.1292", "Fixed Beam Limiting Device Type (9545)", DicomUidType.ContextGroupName, false);
DicomUID.register(FixedBeamLimitingDeviceType9545);
/** 1.2.840.10008.6.1.1293 Radiotherapy Wedge Type (9546) */
export const RadiotherapyWedgeType9546 = new DicomUID("1.2.840.10008.6.1.1293", "Radiotherapy Wedge Type (9546)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyWedgeType9546);
/** 1.2.840.10008.6.1.1294 RT Beam Limiting Device Orientation Label (9547) */
export const RTBeamLimitingDeviceOrientationLabel9547 = new DicomUID("1.2.840.10008.6.1.1294", "RT Beam Limiting Device Orientation Label (9547)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTBeamLimitingDeviceOrientationLabel9547);
/** 1.2.840.10008.6.1.1295 General Accessory Device Type (9548) */
export const GeneralAccessoryDeviceType9548 = new DicomUID("1.2.840.10008.6.1.1295", "General Accessory Device Type (9548)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralAccessoryDeviceType9548);
/** 1.2.840.10008.6.1.1296 Radiation Generation Mode Type (9549) */
export const RadiationGenerationModeType9549 = new DicomUID("1.2.840.10008.6.1.1296", "Radiation Generation Mode Type (9549)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiationGenerationModeType9549);
/** 1.2.840.10008.6.1.1297 C-Arm Photon-Electron Delivery Rate Unit (9550) */
export const CArmPhotonElectronDeliveryRateUnit9550 = new DicomUID("1.2.840.10008.6.1.1297", "C-Arm Photon-Electron Delivery Rate Unit (9550)", DicomUidType.ContextGroupName, false);
DicomUID.register(CArmPhotonElectronDeliveryRateUnit9550);
/** 1.2.840.10008.6.1.1298 Treatment Delivery Device Type (9551) */
export const TreatmentDeliveryDeviceType9551 = new DicomUID("1.2.840.10008.6.1.1298", "Treatment Delivery Device Type (9551)", DicomUidType.ContextGroupName, false);
DicomUID.register(TreatmentDeliveryDeviceType9551);
/** 1.2.840.10008.6.1.1299 C-Arm Photon-Electron Dosimeter Unit (9552) */
export const CArmPhotonElectronDosimeterUnit9552 = new DicomUID("1.2.840.10008.6.1.1299", "C-Arm Photon-Electron Dosimeter Unit (9552)", DicomUidType.ContextGroupName, false);
DicomUID.register(CArmPhotonElectronDosimeterUnit9552);
/** 1.2.840.10008.6.1.1300 Treatment Point (9553) */
export const TreatmentPoint9553 = new DicomUID("1.2.840.10008.6.1.1300", "Treatment Point (9553)", DicomUidType.ContextGroupName, false);
DicomUID.register(TreatmentPoint9553);
/** 1.2.840.10008.6.1.1301 Equipment Reference Point (9554) */
export const EquipmentReferencePoint9554 = new DicomUID("1.2.840.10008.6.1.1301", "Equipment Reference Point (9554)", DicomUidType.ContextGroupName, false);
DicomUID.register(EquipmentReferencePoint9554);
/** 1.2.840.10008.6.1.1302 Radiotherapy Treatment Planning Person Role (9555) */
export const RadiotherapyTreatmentPlanningPersonRole9555 = new DicomUID("1.2.840.10008.6.1.1302", "Radiotherapy Treatment Planning Person Role (9555)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyTreatmentPlanningPersonRole9555);
/** 1.2.840.10008.6.1.1303 Real Time Video Rendition Title (7070) */
export const RealTimeVideoRenditionTitle7070 = new DicomUID("1.2.840.10008.6.1.1303", "Real Time Video Rendition Title (7070)", DicomUidType.ContextGroupName, false);
DicomUID.register(RealTimeVideoRenditionTitle7070);
/** 1.2.840.10008.6.1.1304 Geometry Graphical Representation (219) */
export const GeometryGraphicalRepresentation219 = new DicomUID("1.2.840.10008.6.1.1304", "Geometry Graphical Representation (219)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeometryGraphicalRepresentation219);
/** 1.2.840.10008.6.1.1305 Visual Explanation (217) */
export const VisualExplanation217 = new DicomUID("1.2.840.10008.6.1.1305", "Visual Explanation (217)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualExplanation217);
/** 1.2.840.10008.6.1.1306 Prostate Sector Anatomy from PI-RADS v2.1 (6304) */
export const ProstateSectorAnatomyFromPIRADSV216304 = new DicomUID("1.2.840.10008.6.1.1306", "Prostate Sector Anatomy from PI-RADS v2.1 (6304)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateSectorAnatomyFromPIRADSV216304);
/** 1.2.840.10008.6.1.1307 Radiotherapy Robotic Node Set (9556) */
export const RadiotherapyRoboticNodeSet9556 = new DicomUID("1.2.840.10008.6.1.1307", "Radiotherapy Robotic Node Set (9556)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyRoboticNodeSet9556);
/** 1.2.840.10008.6.1.1308 Tomotherapeutic Dosimeter Unit (9557) */
export const TomotherapeuticDosimeterUnit9557 = new DicomUID("1.2.840.10008.6.1.1308", "Tomotherapeutic Dosimeter Unit (9557)", DicomUidType.ContextGroupName, false);
DicomUID.register(TomotherapeuticDosimeterUnit9557);
/** 1.2.840.10008.6.1.1309 Tomotherapeutic Dose Rate Unit (9558) */
export const TomotherapeuticDoseRateUnit9558 = new DicomUID("1.2.840.10008.6.1.1309", "Tomotherapeutic Dose Rate Unit (9558)", DicomUidType.ContextGroupName, false);
DicomUID.register(TomotherapeuticDoseRateUnit9558);
/** 1.2.840.10008.6.1.1310 Robotic Delivery Device Dosimeter Unit (9559) */
export const RoboticDeliveryDeviceDosimeterUnit9559 = new DicomUID("1.2.840.10008.6.1.1310", "Robotic Delivery Device Dosimeter Unit (9559)", DicomUidType.ContextGroupName, false);
DicomUID.register(RoboticDeliveryDeviceDosimeterUnit9559);
/** 1.2.840.10008.6.1.1311 Robotic Delivery Device Dose Rate Unit (9560) */
export const RoboticDeliveryDeviceDoseRateUnit9560 = new DicomUID("1.2.840.10008.6.1.1311", "Robotic Delivery Device Dose Rate Unit (9560)", DicomUidType.ContextGroupName, false);
DicomUID.register(RoboticDeliveryDeviceDoseRateUnit9560);
/** 1.2.840.10008.6.1.1312 Anatomic Structure (8134) */
export const AnatomicStructure8134 = new DicomUID("1.2.840.10008.6.1.1312", "Anatomic Structure (8134)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicStructure8134);
/** 1.2.840.10008.6.1.1313 Mediastinum Finding or Feature (6148) */
export const MediastinumFindingOrFeature6148 = new DicomUID("1.2.840.10008.6.1.1313", "Mediastinum Finding or Feature (6148)", DicomUidType.ContextGroupName, false);
DicomUID.register(MediastinumFindingOrFeature6148);
/** 1.2.840.10008.6.1.1314 Mediastinum Anatomy (6149) */
export const MediastinumAnatomy6149 = new DicomUID("1.2.840.10008.6.1.1314", "Mediastinum Anatomy (6149)", DicomUidType.ContextGroupName, false);
DicomUID.register(MediastinumAnatomy6149);
/** 1.2.840.10008.6.1.1315 Vascular Ultrasound Report Document Title (12100) */
export const VascularUltrasoundReportDocumentTitle12100 = new DicomUID("1.2.840.10008.6.1.1315", "Vascular Ultrasound Report Document Title (12100)", DicomUidType.ContextGroupName, false);
DicomUID.register(VascularUltrasoundReportDocumentTitle12100);
/** 1.2.840.10008.6.1.1316 Organ Part (Non-Lateralized) (12130) */
export const OrganPartNonLateralized12130 = new DicomUID("1.2.840.10008.6.1.1316", "Organ Part (Non-Lateralized) (12130)", DicomUidType.ContextGroupName, false);
DicomUID.register(OrganPartNonLateralized12130);
/** 1.2.840.10008.6.1.1317 Organ Part (Lateralized) (12131) */
export const OrganPartLateralized12131 = new DicomUID("1.2.840.10008.6.1.1317", "Organ Part (Lateralized) (12131)", DicomUidType.ContextGroupName, false);
DicomUID.register(OrganPartLateralized12131);
/** 1.2.840.10008.6.1.1318 Treatment Termination Reason (9561) */
export const TreatmentTerminationReason9561 = new DicomUID("1.2.840.10008.6.1.1318", "Treatment Termination Reason (9561)", DicomUidType.ContextGroupName, false);
DicomUID.register(TreatmentTerminationReason9561);
/** 1.2.840.10008.6.1.1319 Radiotherapy Treatment Delivery Person Role (9562) */
export const RadiotherapyTreatmentDeliveryPersonRole9562 = new DicomUID("1.2.840.10008.6.1.1319", "Radiotherapy Treatment Delivery Person Role (9562)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyTreatmentDeliveryPersonRole9562);
/** 1.2.840.10008.6.1.1320 Radiotherapy Interlock Resolution (9563) */
export const RadiotherapyInterlockResolution9563 = new DicomUID("1.2.840.10008.6.1.1320", "Radiotherapy Interlock Resolution (9563)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyInterlockResolution9563);
/** 1.2.840.10008.6.1.1321 Treatment Session Confirmation Assertion (9564) */
export const TreatmentSessionConfirmationAssertion9564 = new DicomUID("1.2.840.10008.6.1.1321", "Treatment Session Confirmation Assertion (9564)", DicomUidType.ContextGroupName, false);
DicomUID.register(TreatmentSessionConfirmationAssertion9564);
/** 1.2.840.10008.6.1.1322 Treatment Tolerance Violation Cause (9565) */
export const TreatmentToleranceViolationCause9565 = new DicomUID("1.2.840.10008.6.1.1322", "Treatment Tolerance Violation Cause (9565)", DicomUidType.ContextGroupName, false);
DicomUID.register(TreatmentToleranceViolationCause9565);
/** 1.2.840.10008.6.1.1323 Clinical Tolerance Violation Type (9566) */
export const ClinicalToleranceViolationType9566 = new DicomUID("1.2.840.10008.6.1.1323", "Clinical Tolerance Violation Type (9566)", DicomUidType.ContextGroupName, false);
DicomUID.register(ClinicalToleranceViolationType9566);
/** 1.2.840.10008.6.1.1324 Machine Tolerance Violation Type (9567) */
export const MachineToleranceViolationType9567 = new DicomUID("1.2.840.10008.6.1.1324", "Machine Tolerance Violation Type (9567)", DicomUidType.ContextGroupName, false);
DicomUID.register(MachineToleranceViolationType9567);
/** 1.2.840.10008.6.1.1325 Radiotherapy Treatment Interlock (9568) */
export const RadiotherapyTreatmentInterlock9568 = new DicomUID("1.2.840.10008.6.1.1325", "Radiotherapy Treatment Interlock (9568)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyTreatmentInterlock9568);
/** 1.2.840.10008.6.1.1326 Isocentric Patient Support Position Parameter (9569) */
export const IsocentricPatientSupportPositionParameter9569 = new DicomUID("1.2.840.10008.6.1.1326", "Isocentric Patient Support Position Parameter (9569)", DicomUidType.ContextGroupName, false);
DicomUID.register(IsocentricPatientSupportPositionParameter9569);
/** 1.2.840.10008.6.1.1327 RT Overridden Treatment Parameter (9570) */
export const RTOverriddenTreatmentParameter9570 = new DicomUID("1.2.840.10008.6.1.1327", "RT Overridden Treatment Parameter (9570)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTOverriddenTreatmentParameter9570);
/** 1.2.840.10008.6.1.1328 EEG Lead (3030) */
export const EEGLead3030 = new DicomUID("1.2.840.10008.6.1.1328", "EEG Lead (3030)", DicomUidType.ContextGroupName, false);
DicomUID.register(EEGLead3030);
/** 1.2.840.10008.6.1.1329 Lead Location Near or in Muscle (3031) */
export const LeadLocationNearOrInMuscle3031 = new DicomUID("1.2.840.10008.6.1.1329", "Lead Location Near or in Muscle (3031)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeadLocationNearOrInMuscle3031);
/** 1.2.840.10008.6.1.1330 Lead Location Near Peripheral Nerve (3032) */
export const LeadLocationNearPeripheralNerve3032 = new DicomUID("1.2.840.10008.6.1.1330", "Lead Location Near Peripheral Nerve (3032)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeadLocationNearPeripheralNerve3032);
/** 1.2.840.10008.6.1.1331 EOG Lead (3033) */
export const EOGLead3033 = new DicomUID("1.2.840.10008.6.1.1331", "EOG Lead (3033)", DicomUidType.ContextGroupName, false);
DicomUID.register(EOGLead3033);
/** 1.2.840.10008.6.1.1332 Body Position Channel (3034) */
export const BodyPositionChannel3034 = new DicomUID("1.2.840.10008.6.1.1332", "Body Position Channel (3034)", DicomUidType.ContextGroupName, false);
DicomUID.register(BodyPositionChannel3034);
/** 1.2.840.10008.6.1.1333 EEG Annotation – Neurophysiologic Enumeration (3035) */
export const EEGAnnotationNeurophysiologicEnumeration3035 = new DicomUID("1.2.840.10008.6.1.1333", "EEG Annotation – Neurophysiologic Enumeration (3035)", DicomUidType.ContextGroupName, false);
DicomUID.register(EEGAnnotationNeurophysiologicEnumeration3035);
/** 1.2.840.10008.6.1.1334 EMG Annotation – Neurophysiological Enumeration (3036) */
export const EMGAnnotationNeurophysiologicalEnumeration3036 = new DicomUID("1.2.840.10008.6.1.1334", "EMG Annotation – Neurophysiological Enumeration (3036)", DicomUidType.ContextGroupName, false);
DicomUID.register(EMGAnnotationNeurophysiologicalEnumeration3036);
/** 1.2.840.10008.6.1.1335 EOG Annotation – Neurophysiological Enumeration (3037) */
export const EOGAnnotationNeurophysiologicalEnumeration3037 = new DicomUID("1.2.840.10008.6.1.1335", "EOG Annotation – Neurophysiological Enumeration (3037)", DicomUidType.ContextGroupName, false);
DicomUID.register(EOGAnnotationNeurophysiologicalEnumeration3037);
/** 1.2.840.10008.6.1.1336 Pattern Event (3038) */
export const PatternEvent3038 = new DicomUID("1.2.840.10008.6.1.1336", "Pattern Event (3038)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatternEvent3038);
/** 1.2.840.10008.6.1.1337 Device-related and Environment-related Event (3039) */
export const DeviceRelatedAndEnvironmentRelatedEvent3039 = new DicomUID("1.2.840.10008.6.1.1337", "Device-related and Environment-related Event (3039)", DicomUidType.ContextGroupName, false);
DicomUID.register(DeviceRelatedAndEnvironmentRelatedEvent3039);
/** 1.2.840.10008.6.1.1338 EEG Annotation - Neurological Monitoring Measurement (3040) */
export const EEGAnnotationNeurologicalMonitoringMeasurement3040 = new DicomUID("1.2.840.10008.6.1.1338", "EEG Annotation - Neurological Monitoring Measurement (3040)", DicomUidType.ContextGroupName, false);
DicomUID.register(EEGAnnotationNeurologicalMonitoringMeasurement3040);
/** 1.2.840.10008.6.1.1339 OB-GYN Ultrasound Report Document Title (12024) */
export const OBGYNUltrasoundReportDocumentTitle12024 = new DicomUID("1.2.840.10008.6.1.1339", "OB-GYN Ultrasound Report Document Title (12024)", DicomUidType.ContextGroupName, false);
DicomUID.register(OBGYNUltrasoundReportDocumentTitle12024);
/** 1.2.840.10008.6.1.1340 Automation of Measurement (7230) */
export const AutomationOfMeasurement7230 = new DicomUID("1.2.840.10008.6.1.1340", "Automation of Measurement (7230)", DicomUidType.ContextGroupName, false);
DicomUID.register(AutomationOfMeasurement7230);
/** 1.2.840.10008.6.1.1341 OB-GYN Ultrasound Beam Path (12025) */
export const OBGYNUltrasoundBeamPath12025 = new DicomUID("1.2.840.10008.6.1.1341", "OB-GYN Ultrasound Beam Path (12025)", DicomUidType.ContextGroupName, false);
DicomUID.register(OBGYNUltrasoundBeamPath12025);
/** 1.2.840.10008.6.1.1342 Angle Measurement (7550) */
export const AngleMeasurement7550 = new DicomUID("1.2.840.10008.6.1.1342", "Angle Measurement (7550)", DicomUidType.ContextGroupName, false);
DicomUID.register(AngleMeasurement7550);
/** 1.2.840.10008.6.1.1343 Generic Purpose of Reference to Images and Coordinates in Measurement (7551) */
export const GenericPurposeOfReferenceToImagesAndCoordinatesInMeasurement7551 = new DicomUID("1.2.840.10008.6.1.1343", "Generic Purpose of Reference to Images and Coordinates in Measurement (7551)", DicomUidType.ContextGroupName, false);
DicomUID.register(GenericPurposeOfReferenceToImagesAndCoordinatesInMeasurement7551);
/** 1.2.840.10008.6.1.1344 Generic Purpose of Reference to Images in Measurement (7552) */
export const GenericPurposeOfReferenceToImagesInMeasurement7552 = new DicomUID("1.2.840.10008.6.1.1344", "Generic Purpose of Reference to Images in Measurement (7552)", DicomUidType.ContextGroupName, false);
DicomUID.register(GenericPurposeOfReferenceToImagesInMeasurement7552);
/** 1.2.840.10008.6.1.1345 Generic Purpose of Reference to Coordinates in Measurement (7553) */
export const GenericPurposeOfReferenceToCoordinatesInMeasurement7553 = new DicomUID("1.2.840.10008.6.1.1345", "Generic Purpose of Reference to Coordinates in Measurement (7553)", DicomUidType.ContextGroupName, false);
DicomUID.register(GenericPurposeOfReferenceToCoordinatesInMeasurement7553);
/** 1.2.840.10008.6.1.1346 Fitzpatrick Skin Type (4401) */
export const FitzpatrickSkinType4401 = new DicomUID("1.2.840.10008.6.1.1346", "Fitzpatrick Skin Type (4401)", DicomUidType.ContextGroupName, false);
DicomUID.register(FitzpatrickSkinType4401);
/** 1.2.840.10008.6.1.1347 History of Malignant Melanoma (4402) */
export const HistoryOfMalignantMelanoma4402 = new DicomUID("1.2.840.10008.6.1.1347", "History of Malignant Melanoma (4402)", DicomUidType.ContextGroupName, false);
DicomUID.register(HistoryOfMalignantMelanoma4402);
/** 1.2.840.10008.6.1.1348 History of Melanoma in Situ (4403) */
export const HistoryOfMelanomaInSitu4403 = new DicomUID("1.2.840.10008.6.1.1348", "History of Melanoma in Situ (4403)", DicomUidType.ContextGroupName, false);
DicomUID.register(HistoryOfMelanomaInSitu4403);
/** 1.2.840.10008.6.1.1349 History of Non-Melanoma Skin Cancer (4404) */
export const HistoryOfNonMelanomaSkinCancer4404 = new DicomUID("1.2.840.10008.6.1.1349", "History of Non-Melanoma Skin Cancer (4404)", DicomUidType.ContextGroupName, false);
DicomUID.register(HistoryOfNonMelanomaSkinCancer4404);
/** 1.2.840.10008.6.1.1350 Skin Disorder (4405) */
export const SkinDisorder4405 = new DicomUID("1.2.840.10008.6.1.1350", "Skin Disorder (4405)", DicomUidType.ContextGroupName, false);
DicomUID.register(SkinDisorder4405);
/** 1.2.840.10008.6.1.1351 Patient Reported Lesion Characteristic (4406) */
export const PatientReportedLesionCharacteristic4406 = new DicomUID("1.2.840.10008.6.1.1351", "Patient Reported Lesion Characteristic (4406)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientReportedLesionCharacteristic4406);
/** 1.2.840.10008.6.1.1352 Lesion Palpation Finding (4407) */
export const LesionPalpationFinding4407 = new DicomUID("1.2.840.10008.6.1.1352", "Lesion Palpation Finding (4407)", DicomUidType.ContextGroupName, false);
DicomUID.register(LesionPalpationFinding4407);
/** 1.2.840.10008.6.1.1353 Lesion Visual Finding (4408) */
export const LesionVisualFinding4408 = new DicomUID("1.2.840.10008.6.1.1353", "Lesion Visual Finding (4408)", DicomUidType.ContextGroupName, false);
DicomUID.register(LesionVisualFinding4408);
/** 1.2.840.10008.6.1.1354 Skin Procedure (4409) */
export const SkinProcedure4409 = new DicomUID("1.2.840.10008.6.1.1354", "Skin Procedure (4409)", DicomUidType.ContextGroupName, false);
DicomUID.register(SkinProcedure4409);
/** 1.2.840.10008.6.1.1355 Abdominopelvic Vessel (12125) */
export const AbdominopelvicVessel12125 = new DicomUID("1.2.840.10008.6.1.1355", "Abdominopelvic Vessel (12125)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbdominopelvicVessel12125);
/** 1.2.840.10008.6.1.1356 Numeric Value Failure Qualifier (43) */
export const NumericValueFailureQualifier43 = new DicomUID("1.2.840.10008.6.1.1356", "Numeric Value Failure Qualifier (43)", DicomUidType.ContextGroupName, false);
DicomUID.register(NumericValueFailureQualifier43);
/** 1.2.840.10008.6.1.1357 Numeric Value Unknown Qualifier (44) */
export const NumericValueUnknownQualifier44 = new DicomUID("1.2.840.10008.6.1.1357", "Numeric Value Unknown Qualifier (44)", DicomUidType.ContextGroupName, false);
DicomUID.register(NumericValueUnknownQualifier44);
/** 1.2.840.10008.6.1.1358 Couinaud Liver Segment (7170) */
export const CouinaudLiverSegment7170 = new DicomUID("1.2.840.10008.6.1.1358", "Couinaud Liver Segment (7170)", DicomUidType.ContextGroupName, false);
DicomUID.register(CouinaudLiverSegment7170);
/** 1.2.840.10008.6.1.1359 Liver Segmentation Type (7171) */
export const LiverSegmentationType7171 = new DicomUID("1.2.840.10008.6.1.1359", "Liver Segmentation Type (7171)", DicomUidType.ContextGroupName, false);
DicomUID.register(LiverSegmentationType7171);
/** 1.2.840.10008.6.1.1360 Contraindications For XA Imaging (1201) */
export const ContraindicationsForXAImaging1201 = new DicomUID("1.2.840.10008.6.1.1360", "Contraindications For XA Imaging (1201)", DicomUidType.ContextGroupName, false);
DicomUID.register(ContraindicationsForXAImaging1201);
/** 1.2.840.10008.6.1.1361 Neurophysiologic Stimulation Mode (3041) */
export const NeurophysiologicStimulationMode3041 = new DicomUID("1.2.840.10008.6.1.1361", "Neurophysiologic Stimulation Mode (3041)", DicomUidType.ContextGroupName, false);
DicomUID.register(NeurophysiologicStimulationMode3041);
/** 1.2.840.10008.6.1.1362 Reported Value Type (10072) */
export const ReportedValueType10072 = new DicomUID("1.2.840.10008.6.1.1362", "Reported Value Type (10072)", DicomUidType.ContextGroupName, false);
DicomUID.register(ReportedValueType10072);
/** 1.2.840.10008.6.1.1363 Value Timing (10073) */
export const ValueTiming10073 = new DicomUID("1.2.840.10008.6.1.1363", "Value Timing (10073)", DicomUidType.ContextGroupName, false);
DicomUID.register(ValueTiming10073);
/** 1.2.840.10008.6.1.1364 RDSR Frame of Reference Origin (10074) */
export const RDSRFrameOfReferenceOrigin10074 = new DicomUID("1.2.840.10008.6.1.1364", "RDSR Frame of Reference Origin (10074)", DicomUidType.ContextGroupName, false);
DicomUID.register(RDSRFrameOfReferenceOrigin10074);
/** 1.2.840.10008.6.1.1365 Microscopy Annotation Property Type (8135) */
export const MicroscopyAnnotationPropertyType8135 = new DicomUID("1.2.840.10008.6.1.1365", "Microscopy Annotation Property Type (8135)", DicomUidType.ContextGroupName, false);
DicomUID.register(MicroscopyAnnotationPropertyType8135);
/** 1.2.840.10008.6.1.1366 Microscopy Measurement Type (8136) */
export const MicroscopyMeasurementType8136 = new DicomUID("1.2.840.10008.6.1.1366", "Microscopy Measurement Type (8136)", DicomUidType.ContextGroupName, false);
DicomUID.register(MicroscopyMeasurementType8136);
/** 1.2.840.10008.6.1.1367 Prostate Reporting System (6310) */
export const ProstateReportingSystem6310 = new DicomUID("1.2.840.10008.6.1.1367", "Prostate Reporting System (6310)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateReportingSystem6310);
/** 1.2.840.10008.6.1.1368 MR Signal Intensity (6311) */
export const MRSignalIntensity6311 = new DicomUID("1.2.840.10008.6.1.1368", "MR Signal Intensity (6311)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRSignalIntensity6311);
/** 1.2.840.10008.6.1.1369 Cross-sectional Scan Plane Orientation (6312) */
export const CrossSectionalScanPlaneOrientation6312 = new DicomUID("1.2.840.10008.6.1.1369", "Cross-sectional Scan Plane Orientation (6312)", DicomUidType.ContextGroupName, false);
DicomUID.register(CrossSectionalScanPlaneOrientation6312);
/** 1.2.840.10008.6.1.1370 History of Prostate Disease (6313) */
export const HistoryOfProstateDisease6313 = new DicomUID("1.2.840.10008.6.1.1370", "History of Prostate Disease (6313)", DicomUidType.ContextGroupName, false);
DicomUID.register(HistoryOfProstateDisease6313);
/** 1.2.840.10008.6.1.1371 Prostate MRI Study Quality Finding (6314) */
export const ProstateMRIStudyQualityFinding6314 = new DicomUID("1.2.840.10008.6.1.1371", "Prostate MRI Study Quality Finding (6314)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateMRIStudyQualityFinding6314);
/** 1.2.840.10008.6.1.1372 Prostate MRI Series Quality Finding (6315) */
export const ProstateMRISeriesQualityFinding6315 = new DicomUID("1.2.840.10008.6.1.1372", "Prostate MRI Series Quality Finding (6315)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateMRISeriesQualityFinding6315);
/** 1.2.840.10008.6.1.1373 MR Imaging Artifact (6316) */
export const MRImagingArtifact6316 = new DicomUID("1.2.840.10008.6.1.1373", "MR Imaging Artifact (6316)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRImagingArtifact6316);
/** 1.2.840.10008.6.1.1374 Prostate DCE MRI Quality Finding (6317) */
export const ProstateDCEMRIQualityFinding6317 = new DicomUID("1.2.840.10008.6.1.1374", "Prostate DCE MRI Quality Finding (6317)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateDCEMRIQualityFinding6317);
/** 1.2.840.10008.6.1.1375 Prostate DWI MRI Quality Finding (6318) */
export const ProstateDWIMRIQualityFinding6318 = new DicomUID("1.2.840.10008.6.1.1375", "Prostate DWI MRI Quality Finding (6318)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateDWIMRIQualityFinding6318);
/** 1.2.840.10008.6.1.1376 Abdominal Intervention Type (6319) */
export const AbdominalInterventionType6319 = new DicomUID("1.2.840.10008.6.1.1376", "Abdominal Intervention Type (6319)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbdominalInterventionType6319);
/** 1.2.840.10008.6.1.1377 Abdominopelvic Intervention (6320) */
export const AbdominopelvicIntervention6320 = new DicomUID("1.2.840.10008.6.1.1377", "Abdominopelvic Intervention (6320)", DicomUidType.ContextGroupName, false);
DicomUID.register(AbdominopelvicIntervention6320);
/** 1.2.840.10008.6.1.1378 Prostate Cancer Diagnostic Procedure (6321) */
export const ProstateCancerDiagnosticProcedure6321 = new DicomUID("1.2.840.10008.6.1.1378", "Prostate Cancer Diagnostic Procedure (6321)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateCancerDiagnosticProcedure6321);
/** 1.2.840.10008.6.1.1379 Prostate Cancer Family History (6322) */
export const ProstateCancerFamilyHistory6322 = new DicomUID("1.2.840.10008.6.1.1379", "Prostate Cancer Family History (6322)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateCancerFamilyHistory6322);
/** 1.2.840.10008.6.1.1380 Prostate Cancer Therapy (6323) */
export const ProstateCancerTherapy6323 = new DicomUID("1.2.840.10008.6.1.1380", "Prostate Cancer Therapy (6323)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateCancerTherapy6323);
/** 1.2.840.10008.6.1.1381 Prostate MRI Assessment (6324) */
export const ProstateMRIAssessment6324 = new DicomUID("1.2.840.10008.6.1.1381", "Prostate MRI Assessment (6324)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateMRIAssessment6324);
/** 1.2.840.10008.6.1.1382 Overall Assessment from PI-RADS® (6325) */
export const OverallAssessmentFromPIRADS6325 = new DicomUID("1.2.840.10008.6.1.1382", "Overall Assessment from PI-RADS® (6325)", DicomUidType.ContextGroupName, false);
DicomUID.register(OverallAssessmentFromPIRADS6325);
/** 1.2.840.10008.6.1.1383 Image Quality Control Standard (6326) */
export const ImageQualityControlStandard6326 = new DicomUID("1.2.840.10008.6.1.1383", "Image Quality Control Standard (6326)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImageQualityControlStandard6326);
/** 1.2.840.10008.6.1.1384 Prostate Imaging Indication (6327) */
export const ProstateImagingIndication6327 = new DicomUID("1.2.840.10008.6.1.1384", "Prostate Imaging Indication (6327)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateImagingIndication6327);
/** 1.2.840.10008.6.1.1385 PI-RADS® v2 Lesion Assessment Category (6328) */
export const PIRADSV2LesionAssessmentCategory6328 = new DicomUID("1.2.840.10008.6.1.1385", "PI-RADS® v2 Lesion Assessment Category (6328)", DicomUidType.ContextGroupName, false);
DicomUID.register(PIRADSV2LesionAssessmentCategory6328);
/** 1.2.840.10008.6.1.1386 PI-RADS® v2 T2WI PZ Lesion Assessment Category (6329) */
export const PIRADSV2T2WIPZLesionAssessmentCategory6329 = new DicomUID("1.2.840.10008.6.1.1386", "PI-RADS® v2 T2WI PZ Lesion Assessment Category (6329)", DicomUidType.ContextGroupName, false);
DicomUID.register(PIRADSV2T2WIPZLesionAssessmentCategory6329);
/** 1.2.840.10008.6.1.1387 PI-RADS® v2 T2WI TZ Lesion Assessment Category (6330) */
export const PIRADSV2T2WITZLesionAssessmentCategory6330 = new DicomUID("1.2.840.10008.6.1.1387", "PI-RADS® v2 T2WI TZ Lesion Assessment Category (6330)", DicomUidType.ContextGroupName, false);
DicomUID.register(PIRADSV2T2WITZLesionAssessmentCategory6330);
/** 1.2.840.10008.6.1.1388 PI-RADS® v2 DWI Lesion Assessment Category (6331) */
export const PIRADSV2DWILesionAssessmentCategory6331 = new DicomUID("1.2.840.10008.6.1.1388", "PI-RADS® v2 DWI Lesion Assessment Category (6331)", DicomUidType.ContextGroupName, false);
DicomUID.register(PIRADSV2DWILesionAssessmentCategory6331);
/** 1.2.840.10008.6.1.1389 PI-RADS® v2 DCE Lesion Assessment Category (6332) */
export const PIRADSV2DCELesionAssessmentCategory6332 = new DicomUID("1.2.840.10008.6.1.1389", "PI-RADS® v2 DCE Lesion Assessment Category (6332)", DicomUidType.ContextGroupName, false);
DicomUID.register(PIRADSV2DCELesionAssessmentCategory6332);
/** 1.2.840.10008.6.1.1390 mpMRI Assessment Type (6333) */
export const mpMRIAssessmentType6333 = new DicomUID("1.2.840.10008.6.1.1390", "mpMRI Assessment Type (6333)", DicomUidType.ContextGroupName, false);
DicomUID.register(mpMRIAssessmentType6333);
/** 1.2.840.10008.6.1.1391 mpMRI Assessment Type from PI-RADS® (6334) */
export const mpMRIAssessmentTypeFromPIRADS6334 = new DicomUID("1.2.840.10008.6.1.1391", "mpMRI Assessment Type from PI-RADS® (6334)", DicomUidType.ContextGroupName, false);
DicomUID.register(mpMRIAssessmentTypeFromPIRADS6334);
/** 1.2.840.10008.6.1.1392 mpMRI Assessment Value (6335) */
export const mpMRIAssessmentValue6335 = new DicomUID("1.2.840.10008.6.1.1392", "mpMRI Assessment Value (6335)", DicomUidType.ContextGroupName, false);
DicomUID.register(mpMRIAssessmentValue6335);
/** 1.2.840.10008.6.1.1393 MRI Abnormality (6336) */
export const MRIAbnormality6336 = new DicomUID("1.2.840.10008.6.1.1393", "MRI Abnormality (6336)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRIAbnormality6336);
/** 1.2.840.10008.6.1.1394 mpMRI Prostate Abnormality from PI-RADS® (6337) */
export const mpMRIProstateAbnormalityFromPIRADS6337 = new DicomUID("1.2.840.10008.6.1.1394", "mpMRI Prostate Abnormality from PI-RADS® (6337)", DicomUidType.ContextGroupName, false);
DicomUID.register(mpMRIProstateAbnormalityFromPIRADS6337);
/** 1.2.840.10008.6.1.1395 mpMRI Benign Prostate Abnormality from PI-RADS® (6338) */
export const mpMRIBenignProstateAbnormalityFromPIRADS6338 = new DicomUID("1.2.840.10008.6.1.1395", "mpMRI Benign Prostate Abnormality from PI-RADS® (6338)", DicomUidType.ContextGroupName, false);
DicomUID.register(mpMRIBenignProstateAbnormalityFromPIRADS6338);
/** 1.2.840.10008.6.1.1396 MRI Shape Characteristic (6339) */
export const MRIShapeCharacteristic6339 = new DicomUID("1.2.840.10008.6.1.1396", "MRI Shape Characteristic (6339)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRIShapeCharacteristic6339);
/** 1.2.840.10008.6.1.1397 Prostate MRI Shape Characteristic from PI-RADS® (6340) */
export const ProstateMRIShapeCharacteristicFromPIRADS6340 = new DicomUID("1.2.840.10008.6.1.1397", "Prostate MRI Shape Characteristic from PI-RADS® (6340)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateMRIShapeCharacteristicFromPIRADS6340);
/** 1.2.840.10008.6.1.1398 MRI Margin Characteristic (6341) */
export const MRIMarginCharacteristic6341 = new DicomUID("1.2.840.10008.6.1.1398", "MRI Margin Characteristic (6341)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRIMarginCharacteristic6341);
/** 1.2.840.10008.6.1.1399 Prostate MRI Margin Characteristic from PI-RADS® (6342) */
export const ProstateMRIMarginCharacteristicFromPIRADS6342 = new DicomUID("1.2.840.10008.6.1.1399", "Prostate MRI Margin Characteristic from PI-RADS® (6342)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateMRIMarginCharacteristicFromPIRADS6342);
/** 1.2.840.10008.6.1.1400 MRI Signal Characteristic (6343) */
export const MRISignalCharacteristic6343 = new DicomUID("1.2.840.10008.6.1.1400", "MRI Signal Characteristic (6343)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRISignalCharacteristic6343);
/** 1.2.840.10008.6.1.1401 Prostate MRI Signal Characteristic from PI-RADS® (6344) */
export const ProstateMRISignalCharacteristicFromPIRADS6344 = new DicomUID("1.2.840.10008.6.1.1401", "Prostate MRI Signal Characteristic from PI-RADS® (6344)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateMRISignalCharacteristicFromPIRADS6344);
/** 1.2.840.10008.6.1.1402 MRI Enhancement Pattern (6345) */
export const MRIEnhancementPattern6345 = new DicomUID("1.2.840.10008.6.1.1402", "MRI Enhancement Pattern (6345)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRIEnhancementPattern6345);
/** 1.2.840.10008.6.1.1403 Prostate MRI Enhancement Pattern from PI-RADS® (6346) */
export const ProstateMRIEnhancementPatternFromPIRADS6346 = new DicomUID("1.2.840.10008.6.1.1403", "Prostate MRI Enhancement Pattern from PI-RADS® (6346)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateMRIEnhancementPatternFromPIRADS6346);
/** 1.2.840.10008.6.1.1404 Prostate MRI Extra-prostatic Finding (6347) */
export const ProstateMRIExtraProstaticFinding6347 = new DicomUID("1.2.840.10008.6.1.1404", "Prostate MRI Extra-prostatic Finding (6347)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateMRIExtraProstaticFinding6347);
/** 1.2.840.10008.6.1.1405 Prostate MRI Assessment of Extra-prostatic Anatomic Site (6348) */
export const ProstateMRIAssessmentOfExtraProstaticAnatomicSite6348 = new DicomUID("1.2.840.10008.6.1.1405", "Prostate MRI Assessment of Extra-prostatic Anatomic Site (6348)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateMRIAssessmentOfExtraProstaticAnatomicSite6348);
/** 1.2.840.10008.6.1.1406 MR Coil Type (6349) */
export const MRCoilType6349 = new DicomUID("1.2.840.10008.6.1.1406", "MR Coil Type (6349)", DicomUidType.ContextGroupName, false);
DicomUID.register(MRCoilType6349);
/** 1.2.840.10008.6.1.1407 Endorectal Coil Fill Substance (6350) */
export const EndorectalCoilFillSubstance6350 = new DicomUID("1.2.840.10008.6.1.1407", "Endorectal Coil Fill Substance (6350)", DicomUidType.ContextGroupName, false);
DicomUID.register(EndorectalCoilFillSubstance6350);
/** 1.2.840.10008.6.1.1408 Prostate Relational Measurement (6351) */
export const ProstateRelationalMeasurement6351 = new DicomUID("1.2.840.10008.6.1.1408", "Prostate Relational Measurement (6351)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateRelationalMeasurement6351);
/** 1.2.840.10008.6.1.1409 Prostate Cancer Diagnostic Blood Lab Measurement (6352) */
export const ProstateCancerDiagnosticBloodLabMeasurement6352 = new DicomUID("1.2.840.10008.6.1.1409", "Prostate Cancer Diagnostic Blood Lab Measurement (6352)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateCancerDiagnosticBloodLabMeasurement6352);
/** 1.2.840.10008.6.1.1410 Prostate Imaging Types of Quality Control Standard (6353) */
export const ProstateImagingTypesOfQualityControlStandard6353 = new DicomUID("1.2.840.10008.6.1.1410", "Prostate Imaging Types of Quality Control Standard (6353)", DicomUidType.ContextGroupName, false);
DicomUID.register(ProstateImagingTypesOfQualityControlStandard6353);
/** 1.2.840.10008.6.1.1411 Ultrasound Shear Wave Measurement (12308) */
export const UltrasoundShearWaveMeasurement12308 = new DicomUID("1.2.840.10008.6.1.1411", "Ultrasound Shear Wave Measurement (12308)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundShearWaveMeasurement12308);
/** 1.2.840.10008.6.1.1412 Left Ventricle Myocardial Wall 16 Segment Model (Retired) (3780) (Retired) */
export const LeftVentricleMyocardialWall16SegmentModel3780 = new DicomUID("1.2.840.10008.6.1.1412", "Left Ventricle Myocardial Wall 16 Segment Model (Retired) (3780)", DicomUidType.ContextGroupName, true);
DicomUID.register(LeftVentricleMyocardialWall16SegmentModel3780);
/** 1.2.840.10008.6.1.1413 Left Ventricle Myocardial Wall 18 Segment Model (3781) */
export const LeftVentricleMyocardialWall18SegmentModel3781 = new DicomUID("1.2.840.10008.6.1.1413", "Left Ventricle Myocardial Wall 18 Segment Model (3781)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleMyocardialWall18SegmentModel3781);
/** 1.2.840.10008.6.1.1414 Left Ventricle Basal Wall 6 Segments (3782) */
export const LeftVentricleBasalWall6Segments3782 = new DicomUID("1.2.840.10008.6.1.1414", "Left Ventricle Basal Wall 6 Segments (3782)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleBasalWall6Segments3782);
/** 1.2.840.10008.6.1.1415 Left Ventricle Midlevel Wall 6 Segments (3783) */
export const LeftVentricleMidlevelWall6Segments3783 = new DicomUID("1.2.840.10008.6.1.1415", "Left Ventricle Midlevel Wall 6 Segments (3783)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleMidlevelWall6Segments3783);
/** 1.2.840.10008.6.1.1416 Left Ventricle Apical Wall 4 Segments (3784) */
export const LeftVentricleApicalWall4Segments3784 = new DicomUID("1.2.840.10008.6.1.1416", "Left Ventricle Apical Wall 4 Segments (3784)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleApicalWall4Segments3784);
/** 1.2.840.10008.6.1.1417 Left Ventricle Apical Wall 6 Segments (3785) */
export const LeftVentricleApicalWall6Segments3785 = new DicomUID("1.2.840.10008.6.1.1417", "Left Ventricle Apical Wall 6 Segments (3785)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftVentricleApicalWall6Segments3785);
/** 1.2.840.10008.6.1.1418 Patient Treatment Preparation Method (9571) */
export const PatientTreatmentPreparationMethod9571 = new DicomUID("1.2.840.10008.6.1.1418", "Patient Treatment Preparation Method (9571)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientTreatmentPreparationMethod9571);
/** 1.2.840.10008.6.1.1419 Patient Shielding Device (9572) */
export const PatientShieldingDevice9572 = new DicomUID("1.2.840.10008.6.1.1419", "Patient Shielding Device (9572)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientShieldingDevice9572);
/** 1.2.840.10008.6.1.1420 Patient Treatment Preparation Device (9573) */
export const PatientTreatmentPreparationDevice9573 = new DicomUID("1.2.840.10008.6.1.1420", "Patient Treatment Preparation Device (9573)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientTreatmentPreparationDevice9573);
/** 1.2.840.10008.6.1.1421 Patient Position Displacement Reference Point (9574) */
export const PatientPositionDisplacementReferencePoint9574 = new DicomUID("1.2.840.10008.6.1.1421", "Patient Position Displacement Reference Point (9574)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientPositionDisplacementReferencePoint9574);
/** 1.2.840.10008.6.1.1422 Patient Alignment Device (9575) */
export const PatientAlignmentDevice9575 = new DicomUID("1.2.840.10008.6.1.1422", "Patient Alignment Device (9575)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientAlignmentDevice9575);
/** 1.2.840.10008.6.1.1423 Reasons for RT Radiation Treatment Omission (9576) */
export const ReasonsForRTRadiationTreatmentOmission9576 = new DicomUID("1.2.840.10008.6.1.1423", "Reasons for RT Radiation Treatment Omission (9576)", DicomUidType.ContextGroupName, false);
DicomUID.register(ReasonsForRTRadiationTreatmentOmission9576);
/** 1.2.840.10008.6.1.1424 Patient Treatment Preparation Procedure (9577) */
export const PatientTreatmentPreparationProcedure9577 = new DicomUID("1.2.840.10008.6.1.1424", "Patient Treatment Preparation Procedure (9577)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientTreatmentPreparationProcedure9577);
/** 1.2.840.10008.6.1.1425 Motion Management Setup Device (9578) */
export const MotionManagementSetupDevice9578 = new DicomUID("1.2.840.10008.6.1.1425", "Motion Management Setup Device (9578)", DicomUidType.ContextGroupName, false);
DicomUID.register(MotionManagementSetupDevice9578);
/** 1.2.840.10008.6.1.1426 Core Echo Strain Measurement (12309) */
export const CoreEchoStrainMeasurement12309 = new DicomUID("1.2.840.10008.6.1.1426", "Core Echo Strain Measurement (12309)", DicomUidType.ContextGroupName, false);
DicomUID.register(CoreEchoStrainMeasurement12309);
/** 1.2.840.10008.6.1.1427 Myocardial Strain Method (12310) */
export const MyocardialStrainMethod12310 = new DicomUID("1.2.840.10008.6.1.1427", "Myocardial Strain Method (12310)", DicomUidType.ContextGroupName, false);
DicomUID.register(MyocardialStrainMethod12310);
/** 1.2.840.10008.6.1.1428 Echo Measured Strain Property (12311) */
export const EchoMeasuredStrainProperty12311 = new DicomUID("1.2.840.10008.6.1.1428", "Echo Measured Strain Property (12311)", DicomUidType.ContextGroupName, false);
DicomUID.register(EchoMeasuredStrainProperty12311);
/** 1.2.840.10008.6.1.1429 Assessment from CAD-RADS™ (3020) */
export const AssessmentFromCADRADS3020 = new DicomUID("1.2.840.10008.6.1.1429", "Assessment from CAD-RADS™ (3020)", DicomUidType.ContextGroupName, false);
DicomUID.register(AssessmentFromCADRADS3020);
/** 1.2.840.10008.6.1.1430 CAD-RADS™ Stenosis Assessment Modifier (3021) */
export const CADRADSStenosisAssessmentModifier3021 = new DicomUID("1.2.840.10008.6.1.1430", "CAD-RADS™ Stenosis Assessment Modifier (3021)", DicomUidType.ContextGroupName, false);
DicomUID.register(CADRADSStenosisAssessmentModifier3021);
/** 1.2.840.10008.6.1.1431 CAD-RADS™ Assessment Modifier (3022) */
export const CADRADSAssessmentModifier3022 = new DicomUID("1.2.840.10008.6.1.1431", "CAD-RADS™ Assessment Modifier (3022)", DicomUidType.ContextGroupName, false);
DicomUID.register(CADRADSAssessmentModifier3022);
/** 1.2.840.10008.6.1.1432 RT Segment Material (9579) */
export const RTSegmentMaterial9579 = new DicomUID("1.2.840.10008.6.1.1432", "RT Segment Material (9579)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTSegmentMaterial9579);
/** 1.2.840.10008.6.1.1433 Vertebral Anatomic Structure (7602) */
export const VertebralAnatomicStructure7602 = new DicomUID("1.2.840.10008.6.1.1433", "Vertebral Anatomic Structure (7602)", DicomUidType.ContextGroupName, false);
DicomUID.register(VertebralAnatomicStructure7602);
/** 1.2.840.10008.6.1.1434 Vertebra (7603) */
export const Vertebra7603 = new DicomUID("1.2.840.10008.6.1.1434", "Vertebra (7603)", DicomUidType.ContextGroupName, false);
DicomUID.register(Vertebra7603);
/** 1.2.840.10008.6.1.1435 Intervertebral Disc (7604) */
export const IntervertebralDisc7604 = new DicomUID("1.2.840.10008.6.1.1435", "Intervertebral Disc (7604)", DicomUidType.ContextGroupName, false);
DicomUID.register(IntervertebralDisc7604);
/** 1.2.840.10008.6.1.1436 Imaging Procedure (101) */
export const ImagingProcedure101 = new DicomUID("1.2.840.10008.6.1.1436", "Imaging Procedure (101)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImagingProcedure101);
/** 1.2.840.10008.6.1.1437 NICIP Short Code Imaging Procedure (103) */
export const NICIPShortCodeImagingProcedure103 = new DicomUID("1.2.840.10008.6.1.1437", "NICIP Short Code Imaging Procedure (103)", DicomUidType.ContextGroupName, false);
DicomUID.register(NICIPShortCodeImagingProcedure103);
/** 1.2.840.10008.6.1.1438 NICIP SNOMED Imaging Procedure (104) */
export const NICIPSNOMEDImagingProcedure104 = new DicomUID("1.2.840.10008.6.1.1438", "NICIP SNOMED Imaging Procedure (104)", DicomUidType.ContextGroupName, false);
DicomUID.register(NICIPSNOMEDImagingProcedure104);
/** 1.2.840.10008.6.1.1439 ICD-10-PCS Imaging Procedure (105) */
export const ICD10PCSImagingProcedure105 = new DicomUID("1.2.840.10008.6.1.1439", "ICD-10-PCS Imaging Procedure (105)", DicomUidType.ContextGroupName, false);
DicomUID.register(ICD10PCSImagingProcedure105);
/** 1.2.840.10008.6.1.1440 ICD-10-PCS Nuclear Medicine Procedure (106) */
export const ICD10PCSNuclearMedicineProcedure106 = new DicomUID("1.2.840.10008.6.1.1440", "ICD-10-PCS Nuclear Medicine Procedure (106)", DicomUidType.ContextGroupName, false);
DicomUID.register(ICD10PCSNuclearMedicineProcedure106);
/** 1.2.840.10008.6.1.1441 ICD-10-PCS Radiation Therapy Procedure (107) */
export const ICD10PCSRadiationTherapyProcedure107 = new DicomUID("1.2.840.10008.6.1.1441", "ICD-10-PCS Radiation Therapy Procedure (107)", DicomUidType.ContextGroupName, false);
DicomUID.register(ICD10PCSRadiationTherapyProcedure107);
/** 1.2.840.10008.6.1.1442 RT Segmentation Property Category (9580) */
export const RTSegmentationPropertyCategory9580 = new DicomUID("1.2.840.10008.6.1.1442", "RT Segmentation Property Category (9580)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTSegmentationPropertyCategory9580);
/** 1.2.840.10008.6.1.1443 Radiotherapy Registration Mark (9581) */
export const RadiotherapyRegistrationMark9581 = new DicomUID("1.2.840.10008.6.1.1443", "Radiotherapy Registration Mark (9581)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyRegistrationMark9581);
/** 1.2.840.10008.6.1.1444 Radiotherapy Dose Region (9582) */
export const RadiotherapyDoseRegion9582 = new DicomUID("1.2.840.10008.6.1.1444", "Radiotherapy Dose Region (9582)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyDoseRegion9582);
/** 1.2.840.10008.6.1.1445 Anatomically Localized Lesion Segmentation Type (7199) */
export const AnatomicallyLocalizedLesionSegmentationType7199 = new DicomUID("1.2.840.10008.6.1.1445", "Anatomically Localized Lesion Segmentation Type (7199)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnatomicallyLocalizedLesionSegmentationType7199);
/** 1.2.840.10008.6.1.1446 Reason for Removal from Operational Use (7031) */
export const ReasonForRemovalFromOperationalUse7031 = new DicomUID("1.2.840.10008.6.1.1446", "Reason for Removal from Operational Use (7031)", DicomUidType.ContextGroupName, false);
DicomUID.register(ReasonForRemovalFromOperationalUse7031);
/** 1.2.840.10008.6.1.1447 General Ultrasound Report Document Title (12320) */
export const GeneralUltrasoundReportDocumentTitle12320 = new DicomUID("1.2.840.10008.6.1.1447", "General Ultrasound Report Document Title (12320)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralUltrasoundReportDocumentTitle12320);
/** 1.2.840.10008.6.1.1448 Elastography Site (12321) */
export const ElastographySite12321 = new DicomUID("1.2.840.10008.6.1.1448", "Elastography Site (12321)", DicomUidType.ContextGroupName, false);
DicomUID.register(ElastographySite12321);
/** 1.2.840.10008.6.1.1449 Elastography Measurement Site (12322) */
export const ElastographyMeasurementSite12322 = new DicomUID("1.2.840.10008.6.1.1449", "Elastography Measurement Site (12322)", DicomUidType.ContextGroupName, false);
DicomUID.register(ElastographyMeasurementSite12322);
/** 1.2.840.10008.6.1.1450 Ultrasound Relevant Patient Condition (12323) */
export const UltrasoundRelevantPatientCondition12323 = new DicomUID("1.2.840.10008.6.1.1450", "Ultrasound Relevant Patient Condition (12323)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundRelevantPatientCondition12323);
/** 1.2.840.10008.6.1.1451 Shear Wave Detection Method (12324) */
export const ShearWaveDetectionMethod12324 = new DicomUID("1.2.840.10008.6.1.1451", "Shear Wave Detection Method (12324)", DicomUidType.ContextGroupName, false);
DicomUID.register(ShearWaveDetectionMethod12324);
/** 1.2.840.10008.6.1.1452 Liver Ultrasound Study Indication (12325) */
export const LiverUltrasoundStudyIndication12325 = new DicomUID("1.2.840.10008.6.1.1452", "Liver Ultrasound Study Indication (12325)", DicomUidType.ContextGroupName, false);
DicomUID.register(LiverUltrasoundStudyIndication12325);
/** 1.2.840.10008.6.1.1453 Analog Waveform Filter (3042) */
export const AnalogWaveformFilter3042 = new DicomUID("1.2.840.10008.6.1.1453", "Analog Waveform Filter (3042)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnalogWaveformFilter3042);
/** 1.2.840.10008.6.1.1454 Digital Waveform Filter (3043) */
export const DigitalWaveformFilter3043 = new DicomUID("1.2.840.10008.6.1.1454", "Digital Waveform Filter (3043)", DicomUidType.ContextGroupName, false);
DicomUID.register(DigitalWaveformFilter3043);
/** 1.2.840.10008.6.1.1455 Waveform Filter Lookup Table Input Frequency Unit (3044) */
export const WaveformFilterLookupTableInputFrequencyUnit3044 = new DicomUID("1.2.840.10008.6.1.1455", "Waveform Filter Lookup Table Input Frequency Unit (3044)", DicomUidType.ContextGroupName, false);
DicomUID.register(WaveformFilterLookupTableInputFrequencyUnit3044);
/** 1.2.840.10008.6.1.1456 Waveform Filter Lookup Table Output Magnitude Unit (3045) */
export const WaveformFilterLookupTableOutputMagnitudeUnit3045 = new DicomUID("1.2.840.10008.6.1.1456", "Waveform Filter Lookup Table Output Magnitude Unit (3045)", DicomUidType.ContextGroupName, false);
DicomUID.register(WaveformFilterLookupTableOutputMagnitudeUnit3045);
/** 1.2.840.10008.6.1.1457 Specific Observation Subject Class (272) */
export const SpecificObservationSubjectClass272 = new DicomUID("1.2.840.10008.6.1.1457", "Specific Observation Subject Class (272)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecificObservationSubjectClass272);
/** 1.2.840.10008.6.1.1458 Movable Beam Limiting Device Type (9540) */
export const MovableBeamLimitingDeviceType9540 = new DicomUID("1.2.840.10008.6.1.1458", "Movable Beam Limiting Device Type (9540)", DicomUidType.ContextGroupName, false);
DicomUID.register(MovableBeamLimitingDeviceType9540);
/** 1.2.840.10008.6.1.1459 Radiotherapy Acquisition WorkItem Subtasks (9260) */
export const RadiotherapyAcquisitionWorkItemSubtasks9260 = new DicomUID("1.2.840.10008.6.1.1459", "Radiotherapy Acquisition WorkItem Subtasks (9260)", DicomUidType.ContextGroupName, false);
DicomUID.register(RadiotherapyAcquisitionWorkItemSubtasks9260);
/** 1.2.840.10008.6.1.1460 Patient Position Acquisition Radiation Source Locations (9261) */
export const PatientPositionAcquisitionRadiationSourceLocations9261 = new DicomUID("1.2.840.10008.6.1.1460", "Patient Position Acquisition Radiation Source Locations (9261)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientPositionAcquisitionRadiationSourceLocations9261);
/** 1.2.840.10008.6.1.1461 Energy Derivation Types (9262) */
export const EnergyDerivationTypes9262 = new DicomUID("1.2.840.10008.6.1.1461", "Energy Derivation Types (9262)", DicomUidType.ContextGroupName, false);
DicomUID.register(EnergyDerivationTypes9262);
/** 1.2.840.10008.6.1.1462 KV Imaging Acquisition Techniques (9263) */
export const KVImagingAcquisitionTechniques9263 = new DicomUID("1.2.840.10008.6.1.1462", "KV Imaging Acquisition Techniques (9263)", DicomUidType.ContextGroupName, false);
DicomUID.register(KVImagingAcquisitionTechniques9263);
/** 1.2.840.10008.6.1.1463 MV Imaging Acquisition Techniques (9264) */
export const MVImagingAcquisitionTechniques9264 = new DicomUID("1.2.840.10008.6.1.1463", "MV Imaging Acquisition Techniques (9264)", DicomUidType.ContextGroupName, false);
DicomUID.register(MVImagingAcquisitionTechniques9264);
/** 1.2.840.10008.6.1.1464 Patient Position Acquisition - Projection Techniques (9265) */
export const PatientPositionAcquisitionProjectionTechniques9265 = new DicomUID("1.2.840.10008.6.1.1464", "Patient Position Acquisition - Projection Techniques (9265)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientPositionAcquisitionProjectionTechniques9265);
/** 1.2.840.10008.6.1.1465 Patient Position Acquisition – CT Techniques (9266) */
export const PatientPositionAcquisitionCTTechniques9266 = new DicomUID("1.2.840.10008.6.1.1465", "Patient Position Acquisition – CT Techniques (9266)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientPositionAcquisitionCTTechniques9266);
/** 1.2.840.10008.6.1.1466 Patient Positioning Related Object Purposes (9267) */
export const PatientPositioningRelatedObjectPurposes9267 = new DicomUID("1.2.840.10008.6.1.1466", "Patient Positioning Related Object Purposes (9267)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientPositioningRelatedObjectPurposes9267);
/** 1.2.840.10008.6.1.1467 Patient Position Acquisition Devices (9268) */
export const PatientPositionAcquisitionDevices9268 = new DicomUID("1.2.840.10008.6.1.1467", "Patient Position Acquisition Devices (9268)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientPositionAcquisitionDevices9268);
/** 1.2.840.10008.6.1.1468 RT Radiation Meterset Units (9269) */
export const RTRadiationMetersetUnits9269 = new DicomUID("1.2.840.10008.6.1.1468", "RT Radiation Meterset Units (9269)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTRadiationMetersetUnits9269);
/** 1.2.840.10008.6.1.1469 Acquisition Initiation Types (9270) */
export const AcquisitionInitiationTypes9270 = new DicomUID("1.2.840.10008.6.1.1469", "Acquisition Initiation Types (9270)", DicomUidType.ContextGroupName, false);
DicomUID.register(AcquisitionInitiationTypes9270);
/** 1.2.840.10008.6.1.1470 RT Image Patient Position Acquisition Devices (9271) */
export const RTImagePatientPositionAcquisitionDevices9271 = new DicomUID("1.2.840.10008.6.1.1470", "RT Image Patient Position Acquisition Devices (9271)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTImagePatientPositionAcquisitionDevices9271);
/** 1.2.840.10008.6.1.1471 Photoacoustic Illumination Method (11001) */
export const PhotoacousticIlluminationMethod11001 = new DicomUID("1.2.840.10008.6.1.1471", "Photoacoustic Illumination Method (11001)", DicomUidType.ContextGroupName, false);
DicomUID.register(PhotoacousticIlluminationMethod11001);
/** 1.2.840.10008.6.1.1472 Acoustic Coupling Medium (11002) */
export const AcousticCouplingMedium11002 = new DicomUID("1.2.840.10008.6.1.1472", "Acoustic Coupling Medium (11002)", DicomUidType.ContextGroupName, false);
DicomUID.register(AcousticCouplingMedium11002);
/** 1.2.840.10008.6.1.1473 Ultrasound Transducer Technology (11003) */
export const UltrasoundTransducerTechnology11003 = new DicomUID("1.2.840.10008.6.1.1473", "Ultrasound Transducer Technology (11003)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundTransducerTechnology11003);
/** 1.2.840.10008.6.1.1474 Speed of Sound Correction Mechanisms (11004) */
export const SpeedOfSoundCorrectionMechanisms11004 = new DicomUID("1.2.840.10008.6.1.1474", "Speed of Sound Correction Mechanisms (11004)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpeedOfSoundCorrectionMechanisms11004);
/** 1.2.840.10008.6.1.1475 Photoacoustic Reconstruction Algorithm Family (11005) */
export const PhotoacousticReconstructionAlgorithmFamily11005 = new DicomUID("1.2.840.10008.6.1.1475", "Photoacoustic Reconstruction Algorithm Family (11005)", DicomUidType.ContextGroupName, false);
DicomUID.register(PhotoacousticReconstructionAlgorithmFamily11005);
/** 1.2.840.10008.6.1.1476 Photoacoustic Imaged Property (11006) */
export const PhotoacousticImagedProperty11006 = new DicomUID("1.2.840.10008.6.1.1476", "Photoacoustic Imaged Property (11006)", DicomUidType.ContextGroupName, false);
DicomUID.register(PhotoacousticImagedProperty11006);
/** 1.2.840.10008.6.1.1477 X-Ray Radiation Dose Procedure Type Reported (10005) */
export const XRayRadiationDoseProcedureTypeReported10005 = new DicomUID("1.2.840.10008.6.1.1477", "X-Ray Radiation Dose Procedure Type Reported (10005)", DicomUidType.ContextGroupName, false);
DicomUID.register(XRayRadiationDoseProcedureTypeReported10005);
/** 1.2.840.10008.6.1.1478 Topical Treatment (4410) */
export const TopicalTreatment4410 = new DicomUID("1.2.840.10008.6.1.1478", "Topical Treatment (4410)", DicomUidType.ContextGroupName, false);
DicomUID.register(TopicalTreatment4410);
/** 1.2.840.10008.6.1.1479 Lesion Color (4411) */
export const LesionColor4411 = new DicomUID("1.2.840.10008.6.1.1479", "Lesion Color (4411)", DicomUidType.ContextGroupName, false);
DicomUID.register(LesionColor4411);
/** 1.2.840.10008.6.1.1480 Specimen Stain for Confocal Microscopy (4412) */
export const SpecimenStainForConfocalMicroscopy4412 = new DicomUID("1.2.840.10008.6.1.1480", "Specimen Stain for Confocal Microscopy (4412)", DicomUidType.ContextGroupName, false);
DicomUID.register(SpecimenStainForConfocalMicroscopy4412);
/** 1.2.840.10008.6.1.1481 RT ROI Image Acquisition Context (9272) */
export const RTROIImageAcquisitionContext9272 = new DicomUID("1.2.840.10008.6.1.1481", "RT ROI Image Acquisition Context (9272)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTROIImageAcquisitionContext9272);
/** 1.2.840.10008.6.1.1482 Lobe of Lung (6170) */
export const LobeOfLung6170 = new DicomUID("1.2.840.10008.6.1.1482", "Lobe of Lung (6170)", DicomUidType.ContextGroupName, false);
DicomUID.register(LobeOfLung6170);
/** 1.2.840.10008.6.1.1483 Zone of Lung (6171) */
export const ZoneOfLung6171 = new DicomUID("1.2.840.10008.6.1.1483", "Zone of Lung (6171)", DicomUidType.ContextGroupName, false);
DicomUID.register(ZoneOfLung6171);
/** 1.2.840.10008.6.1.1484 Sleep Stage (3046) */
export const SleepStage3046 = new DicomUID("1.2.840.10008.6.1.1484", "Sleep Stage (3046)", DicomUidType.ContextGroupName, false);
DicomUID.register(SleepStage3046);
/** 1.2.840.10008.6.1.1485 Patient Position Acquisition – MR Techniques (9273) */
export const PatientPositionAcquisitionMRTechniques9273 = new DicomUID("1.2.840.10008.6.1.1485", "Patient Position Acquisition – MR Techniques (9273)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientPositionAcquisitionMRTechniques9273);
/** 1.2.840.10008.6.1.1486 RT Plan Radiotherapy Procedure Technique (9583) */
export const RTPlanRadiotherapyProcedureTechnique9583 = new DicomUID("1.2.840.10008.6.1.1486", "RT Plan Radiotherapy Procedure Technique (9583)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTPlanRadiotherapyProcedureTechnique9583);
/** 1.2.840.10008.6.1.1487 Waveform Annotation Classification (3047) */
export const WaveformAnnotationClassification3047 = new DicomUID("1.2.840.10008.6.1.1487", "Waveform Annotation Classification (3047)", DicomUidType.ContextGroupName, false);
DicomUID.register(WaveformAnnotationClassification3047);
/** 1.2.840.10008.6.1.1488 Waveform Annotations Document Title  (3048) */
export const WaveformAnnotationsDocumentTitle3048 = new DicomUID("1.2.840.10008.6.1.1488", "Waveform Annotations Document Title  (3048)", DicomUidType.ContextGroupName, false);
DicomUID.register(WaveformAnnotationsDocumentTitle3048);
/** 1.2.840.10008.6.1.1489 EEG Procedure  (3049) */
export const EEGProcedure3049 = new DicomUID("1.2.840.10008.6.1.1489", "EEG Procedure  (3049)", DicomUidType.ContextGroupName, false);
DicomUID.register(EEGProcedure3049);
/** 1.2.840.10008.6.1.1490 Patient Consciousness  (3050) */
export const PatientConsciousness3050 = new DicomUID("1.2.840.10008.6.1.1490", "Patient Consciousness  (3050)", DicomUidType.ContextGroupName, false);
DicomUID.register(PatientConsciousness3050);
/** 1.2.840.10008.6.1.1491 Follicle Type (12010) */
export const FollicleType12010 = new DicomUID("1.2.840.10008.6.1.1491", "Follicle Type (12010)", DicomUidType.ContextGroupName, false);
DicomUID.register(FollicleType12010);
/** 1.2.840.10008.6.1.1492 Breast Segmentation Types (7163) */
export const BreastSegmentationTypes7163 = new DicomUID("1.2.840.10008.6.1.1492", "Breast Segmentation Types (7163)", DicomUidType.ContextGroupName, false);
DicomUID.register(BreastSegmentationTypes7163);
/** 1.2.840.10008.6.1.1493 Implanted Device (3779) */
export const ImplantedDevice3779 = new DicomUID("1.2.840.10008.6.1.1493", "Implanted Device (3779)", DicomUidType.ContextGroupName, false);
DicomUID.register(ImplantedDevice3779);
/** 1.2.840.10008.6.1.1494 Similarity Measure (281) */
export const SimilarityMeasure281 = new DicomUID("1.2.840.10008.6.1.1494", "Similarity Measure (281)", DicomUidType.ContextGroupName, false);
DicomUID.register(SimilarityMeasure281);
/** 1.2.840.10008.6.1.1495 Waveform Acquisition Modality (34) */
export const WaveformAcquisitionModality34 = new DicomUID("1.2.840.10008.6.1.1495", "Waveform Acquisition Modality (34)", DicomUidType.ContextGroupName, false);
DicomUID.register(WaveformAcquisitionModality34);
/** 1.2.840.10008.6.1.1496 En Face Processing Algorithm Family (4274) */
export const EnFaceProcessingAlgorithmFamily4274 = new DicomUID("1.2.840.10008.6.1.1496", "En Face Processing Algorithm Family (4274)", DicomUidType.ContextGroupName, false);
DicomUID.register(EnFaceProcessingAlgorithmFamily4274);
/** 1.2.840.10008.6.1.1497 Anterior Eye Segmentation Surface (4275) */
export const AnteriorEyeSegmentationSurface4275 = new DicomUID("1.2.840.10008.6.1.1497", "Anterior Eye Segmentation Surface (4275)", DicomUidType.ContextGroupName, false);
DicomUID.register(AnteriorEyeSegmentationSurface4275);
/** 1.2.840.10008.6.1.1498 Fetal Echocardiography Image View (12312) */
export const FetalEchocardiographyImageView12312 = new DicomUID("1.2.840.10008.6.1.1498", "Fetal Echocardiography Image View (12312)", DicomUidType.ContextGroupName, false);
DicomUID.register(FetalEchocardiographyImageView12312);
/** 1.2.840.10008.6.1.1499 Cardiac Ultrasound Fetal Arrhythmia Measurements (12313) */
export const CardiacUltrasoundFetalArrhythmiaMeasurements12313 = new DicomUID("1.2.840.10008.6.1.1499", "Cardiac Ultrasound Fetal Arrhythmia Measurements (12313)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacUltrasoundFetalArrhythmiaMeasurements12313);
/** 1.2.840.10008.6.1.1500 Common Fetal Echocardiography Measurements (12314) */
export const CommonFetalEchocardiographyMeasurements12314 = new DicomUID("1.2.840.10008.6.1.1500", "Common Fetal Echocardiography Measurements (12314)", DicomUidType.ContextGroupName, false);
DicomUID.register(CommonFetalEchocardiographyMeasurements12314);
/** 1.2.840.10008.6.1.1501 Head and Neck Primary Anatomic Structure (4061) */
export const HeadAndNeckPrimaryAnatomicStructure4061 = new DicomUID("1.2.840.10008.6.1.1501", "Head and Neck Primary Anatomic Structure (4061)", DicomUidType.ContextGroupName, false);
DicomUID.register(HeadAndNeckPrimaryAnatomicStructure4061);
/** 1.2.840.10008.6.1.1502 VL View (4062) */
export const VLView4062 = new DicomUID("1.2.840.10008.6.1.1502", "VL View (4062)", DicomUidType.ContextGroupName, false);
DicomUID.register(VLView4062);
/** 1.2.840.10008.6.1.1503 VL Dental View (4063) */
export const VLDentalView4063 = new DicomUID("1.2.840.10008.6.1.1503", "VL Dental View (4063)", DicomUidType.ContextGroupName, false);
DicomUID.register(VLDentalView4063);
/** 1.2.840.10008.6.1.1504 VL View Modifier (4064) */
export const VLViewModifier4064 = new DicomUID("1.2.840.10008.6.1.1504", "VL View Modifier (4064)", DicomUidType.ContextGroupName, false);
DicomUID.register(VLViewModifier4064);
/** 1.2.840.10008.6.1.1505 VL Dental View Modifier (4065) */
export const VLDentalViewModifier4065 = new DicomUID("1.2.840.10008.6.1.1505", "VL Dental View Modifier (4065)", DicomUidType.ContextGroupName, false);
DicomUID.register(VLDentalViewModifier4065);
/** 1.2.840.10008.6.1.1506 Orthognathic Functional Condition (4066) */
export const OrthognathicFunctionalCondition4066 = new DicomUID("1.2.840.10008.6.1.1506", "Orthognathic Functional Condition (4066)", DicomUidType.ContextGroupName, false);
DicomUID.register(OrthognathicFunctionalCondition4066);
/** 1.2.840.10008.6.1.1507 Orthodontic Finding by Inspection (4067) */
export const OrthodonticFindingByInspection4067 = new DicomUID("1.2.840.10008.6.1.1507", "Orthodontic Finding by Inspection (4067)", DicomUidType.ContextGroupName, false);
DicomUID.register(OrthodonticFindingByInspection4067);
/** 1.2.840.10008.6.1.1508 Orthodontic Observable Entity (4068) */
export const OrthodonticObservableEntity4068 = new DicomUID("1.2.840.10008.6.1.1508", "Orthodontic Observable Entity (4068)", DicomUidType.ContextGroupName, false);
DicomUID.register(OrthodonticObservableEntity4068);
/** 1.2.840.10008.6.1.1509 Dental Occlusion (4069) */
export const DentalOcclusion4069 = new DicomUID("1.2.840.10008.6.1.1509", "Dental Occlusion (4069)", DicomUidType.ContextGroupName, false);
DicomUID.register(DentalOcclusion4069);
/** 1.2.840.10008.6.1.1510 Orthodontic Treatment Progress (4070) */
export const OrthodonticTreatmentProgress4070 = new DicomUID("1.2.840.10008.6.1.1510", "Orthodontic Treatment Progress (4070)", DicomUidType.ContextGroupName, false);
DicomUID.register(OrthodonticTreatmentProgress4070);
/** 1.2.840.10008.6.1.1511 General Photography Device (4071) */
export const GeneralPhotographyDevice4071 = new DicomUID("1.2.840.10008.6.1.1511", "General Photography Device (4071)", DicomUidType.ContextGroupName, false);
DicomUID.register(GeneralPhotographyDevice4071);
/** 1.2.840.10008.6.1.1512 Devices for the Purpose of Dental Photography (4072) */
export const DevicesForThePurposeOfDentalPhotography4072 = new DicomUID("1.2.840.10008.6.1.1512", "Devices for the Purpose of Dental Photography (4072)", DicomUidType.ContextGroupName, false);
DicomUID.register(DevicesForThePurposeOfDentalPhotography4072);
/** 1.2.840.10008.6.1.1513 CTDI Phantom Device (4053) */
export const CTDIPhantomDevice4053 = new DicomUID("1.2.840.10008.6.1.1513", "CTDI Phantom Device (4053)", DicomUidType.ContextGroupName, false);
DicomUID.register(CTDIPhantomDevice4053);
/** 1.2.840.10008.6.1.1514 Diagnostic Imaging Procedure without IV Contrast (108) */
export const DiagnosticImagingProcedureWithoutIVContrast108 = new DicomUID("1.2.840.10008.6.1.1514", "Diagnostic Imaging Procedure without IV Contrast (108)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiagnosticImagingProcedureWithoutIVContrast108);
/** 1.2.840.10008.6.1.1515 Diagnostic Imaging Procedure with IV Contrast (109) */
export const DiagnosticImagingProcedureWithIVContrast109 = new DicomUID("1.2.840.10008.6.1.1515", "Diagnostic Imaging Procedure with IV Contrast (109)", DicomUidType.ContextGroupName, false);
DicomUID.register(DiagnosticImagingProcedureWithIVContrast109);
/** 1.2.840.10008.6.1.1516 Structural Heart Procedure (12331) */
export const StructuralHeartProcedure12331 = new DicomUID("1.2.840.10008.6.1.1516", "Structural Heart Procedure (12331)", DicomUidType.ContextGroupName, false);
DicomUID.register(StructuralHeartProcedure12331);
/** 1.2.840.10008.6.1.1517 Structural Heart Device (12332) */
export const StructuralHeartDevice12332 = new DicomUID("1.2.840.10008.6.1.1517", "Structural Heart Device (12332)", DicomUidType.ContextGroupName, false);
DicomUID.register(StructuralHeartDevice12332);
/** 1.2.840.10008.6.1.1518 Structural Heart Measurement (12333) */
export const StructuralHeartMeasurement12333 = new DicomUID("1.2.840.10008.6.1.1518", "Structural Heart Measurement (12333)", DicomUidType.ContextGroupName, false);
DicomUID.register(StructuralHeartMeasurement12333);
/** 1.2.840.10008.6.1.1519 Aortic Valve Structural Measurement (12334) */
export const AorticValveStructuralMeasurement12334 = new DicomUID("1.2.840.10008.6.1.1519", "Aortic Valve Structural Measurement (12334)", DicomUidType.ContextGroupName, false);
DicomUID.register(AorticValveStructuralMeasurement12334);
/** 1.2.840.10008.6.1.1520 Mitral Valve Structural Measurement (12335) */
export const MitralValveStructuralMeasurement12335 = new DicomUID("1.2.840.10008.6.1.1520", "Mitral Valve Structural Measurement (12335)", DicomUidType.ContextGroupName, false);
DicomUID.register(MitralValveStructuralMeasurement12335);
/** 1.2.840.10008.6.1.1521 Tricuspid Valve Structural Measurement (12336) */
export const TricuspidValveStructuralMeasurement12336 = new DicomUID("1.2.840.10008.6.1.1521", "Tricuspid Valve Structural Measurement (12336)", DicomUidType.ContextGroupName, false);
DicomUID.register(TricuspidValveStructuralMeasurement12336);
/** 1.2.840.10008.6.1.1522 Structural Heart Echo Measurement (12337) */
export const StructuralHeartEchoMeasurement12337 = new DicomUID("1.2.840.10008.6.1.1522", "Structural Heart Echo Measurement (12337)", DicomUidType.ContextGroupName, false);
DicomUID.register(StructuralHeartEchoMeasurement12337);
/** 1.2.840.10008.6.1.1523 Left Atrial Appendage Closure Measurement (12338) */
export const LeftAtrialAppendageClosureMeasurement12338 = new DicomUID("1.2.840.10008.6.1.1523", "Left Atrial Appendage Closure Measurement (12338)", DicomUidType.ContextGroupName, false);
DicomUID.register(LeftAtrialAppendageClosureMeasurement12338);
/** 1.2.840.10008.6.1.1524 Structural Heart Procedure Anatomic Site (12339) */
export const StructuralHeartProcedureAnatomicSite12339 = new DicomUID("1.2.840.10008.6.1.1524", "Structural Heart Procedure Anatomic Site (12339)", DicomUidType.ContextGroupName, false);
DicomUID.register(StructuralHeartProcedureAnatomicSite12339);
/** 1.2.840.10008.6.1.1525 Indication for Structural Heart Procedure (12341) */
export const IndicationForStructuralHeartProcedure12341 = new DicomUID("1.2.840.10008.6.1.1525", "Indication for Structural Heart Procedure (12341)", DicomUidType.ContextGroupName, false);
DicomUID.register(IndicationForStructuralHeartProcedure12341);
/** 1.2.840.10008.6.1.1526 Bradycardiac Agent (12342) */
export const BradycardiacAgent12342 = new DicomUID("1.2.840.10008.6.1.1526", "Bradycardiac Agent (12342)", DicomUidType.ContextGroupName, false);
DicomUID.register(BradycardiacAgent12342);
/** 1.2.840.10008.6.1.1527 Transesophageal Echocardiography Scan Plane (12343) */
export const TransesophagealEchocardiographyScanPlane12343 = new DicomUID("1.2.840.10008.6.1.1527", "Transesophageal Echocardiography Scan Plane (12343)", DicomUidType.ContextGroupName, false);
DicomUID.register(TransesophagealEchocardiographyScanPlane12343);
/** 1.2.840.10008.6.1.1528 Structural Heart Measurement Report Document Title (12344) */
export const StructuralHeartMeasurementReportDocumentTitle12344 = new DicomUID("1.2.840.10008.6.1.1528", "Structural Heart Measurement Report Document Title (12344)", DicomUidType.ContextGroupName, false);
DicomUID.register(StructuralHeartMeasurementReportDocumentTitle12344);
/** 1.2.840.10008.6.1.1529 Person Gender Identity (7458) */
export const PersonGenderIdentity7458 = new DicomUID("1.2.840.10008.6.1.1529", "Person Gender Identity (7458)", DicomUidType.ContextGroupName, false);
DicomUID.register(PersonGenderIdentity7458);
/** 1.2.840.10008.6.1.1530 Category of Sex Parameters for Clinical Use (7459) */
export const CategoryOfSexParametersForClinicalUse7459 = new DicomUID("1.2.840.10008.6.1.1530", "Category of Sex Parameters for Clinical Use (7459)", DicomUidType.ContextGroupName, false);
DicomUID.register(CategoryOfSexParametersForClinicalUse7459);
/** 1.2.840.10008.6.1.1531 Third Person Pronoun Set (7448) */
export const ThirdPersonPronounSet7448 = new DicomUID("1.2.840.10008.6.1.1531", "Third Person Pronoun Set (7448)", DicomUidType.ContextGroupName, false);
DicomUID.register(ThirdPersonPronounSet7448);
/** 1.2.840.10008.6.1.1532 Cardiac Structure Calcification Qualitative Evaluation (12345) */
export const CardiacStructureCalcificationQualitativeEvaluation12345 = new DicomUID("1.2.840.10008.6.1.1532", "Cardiac Structure Calcification Qualitative Evaluation (12345)", DicomUidType.ContextGroupName, false);
DicomUID.register(CardiacStructureCalcificationQualitativeEvaluation12345);
/** 1.2.840.10008.6.1.1533 Visual Field Measurements (4280) */
export const VisualFieldMeasurements4280 = new DicomUID("1.2.840.10008.6.1.1533", "Visual Field Measurements (4280)", DicomUidType.ContextGroupName, false);
DicomUID.register(VisualFieldMeasurements4280);
/** 1.2.840.10008.6.1.1534 Optic Disc Key Measurements (4281) */
export const OpticDiscKeyMeasurements4281 = new DicomUID("1.2.840.10008.6.1.1534", "Optic Disc Key Measurements (4281)", DicomUidType.ContextGroupName, false);
DicomUID.register(OpticDiscKeyMeasurements4281);
/** 1.2.840.10008.6.1.1535 Retinal Sector Methods (4282) */
export const RetinalSectorMethods4282 = new DicomUID("1.2.840.10008.6.1.1535", "Retinal Sector Methods (4282)", DicomUidType.ContextGroupName, false);
DicomUID.register(RetinalSectorMethods4282);
/** 1.2.840.10008.6.1.1536 RNFL Sector Measurements (4283) */
export const RNFLSectorMeasurements4283 = new DicomUID("1.2.840.10008.6.1.1536", "RNFL Sector Measurements (4283)", DicomUidType.ContextGroupName, false);
DicomUID.register(RNFLSectorMeasurements4283);
/** 1.2.840.10008.6.1.1537 RNFL Clockface Measurements (4284) */
export const RNFLClockfaceMeasurements4284 = new DicomUID("1.2.840.10008.6.1.1537", "RNFL Clockface Measurements (4284)", DicomUidType.ContextGroupName, false);
DicomUID.register(RNFLClockfaceMeasurements4284);
/** 1.2.840.10008.6.1.1538 Macular Thickness Key Measurements (4285) */
export const MacularThicknessKeyMeasurements4285 = new DicomUID("1.2.840.10008.6.1.1538", "Macular Thickness Key Measurements (4285)", DicomUidType.ContextGroupName, false);
DicomUID.register(MacularThicknessKeyMeasurements4285);
/** 1.2.840.10008.6.1.1539 Ganglion Cell Measurement Extent (4286) */
export const GanglionCellMeasurementExtent4286 = new DicomUID("1.2.840.10008.6.1.1539", "Ganglion Cell Measurement Extent (4286)", DicomUidType.ContextGroupName, false);
DicomUID.register(GanglionCellMeasurementExtent4286);
/** 1.2.840.10008.6.1.1540 Ganglion Cell Key Measurements (4287) */
export const GanglionCellKeyMeasurements4287 = new DicomUID("1.2.840.10008.6.1.1540", "Ganglion Cell Key Measurements (4287)", DicomUidType.ContextGroupName, false);
DicomUID.register(GanglionCellKeyMeasurements4287);
/** 1.2.840.10008.6.1.1541 Ganglion Cell Sector Measurements (4288) */
export const GanglionCellSectorMeasurements4288 = new DicomUID("1.2.840.10008.6.1.1541", "Ganglion Cell Sector Measurements (4288)", DicomUidType.ContextGroupName, false);
DicomUID.register(GanglionCellSectorMeasurements4288);
/** 1.2.840.10008.6.1.1542 Ganglion Cell Sector Methods (4289) */
export const GanglionCellSectorMethods4289 = new DicomUID("1.2.840.10008.6.1.1542", "Ganglion Cell Sector Methods (4289)", DicomUidType.ContextGroupName, false);
DicomUID.register(GanglionCellSectorMethods4289);
/** 1.2.840.10008.6.1.1543 Endothelial Cell Count Measurements (4290) */
export const EndothelialCellCountMeasurements4290 = new DicomUID("1.2.840.10008.6.1.1543", "Endothelial Cell Count Measurements (4290)", DicomUidType.ContextGroupName, false);
DicomUID.register(EndothelialCellCountMeasurements4290);
/** 1.2.840.10008.6.1.1544 Ophthalmic Image ROI Measurements (4291) */
export const OphthalmicImageROIMeasurements4291 = new DicomUID("1.2.840.10008.6.1.1544", "Ophthalmic Image ROI Measurements (4291)", DicomUidType.ContextGroupName, false);
DicomUID.register(OphthalmicImageROIMeasurements4291);
/** 1.2.840.10008.6.1.1545 RT Plan Approval Assertion (9584) */
export const RTPlanApprovalAssertion9584 = new DicomUID("1.2.840.10008.6.1.1545", "RT Plan Approval Assertion (9584)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTPlanApprovalAssertion9584);
/** 1.2.840.10008.6.1.1546 Estimated Delivery Date Method (12026) */
export const EstimatedDeliveryDateMethod12026 = new DicomUID("1.2.840.10008.6.1.1546", "Estimated Delivery Date Method (12026)", DicomUidType.ContextGroupName, false);
DicomUID.register(EstimatedDeliveryDateMethod12026);
/** 1.2.840.10008.6.1.1547 RT Dose Calculation Algorithm Family (9585) */
export const RTDoseCalculationAlgorithmFamily9585 = new DicomUID("1.2.840.10008.6.1.1547", "RT Dose Calculation Algorithm Family (9585)", DicomUidType.ContextGroupName, false);
DicomUID.register(RTDoseCalculationAlgorithmFamily9585);
/** 1.2.840.10008.6.1.1548 Dose Index for Dose Calibration (10012) */
export const DoseIndexForDoseCalibration10012 = new DicomUID("1.2.840.10008.6.1.1548", "Dose Index for Dose Calibration (10012)", DicomUidType.ContextGroupName, false);
DicomUID.register(DoseIndexForDoseCalibration10012);
/** 1.2.840.10008.6.1.1549 Ultrasound Attenuation Imaging Site (12036) */
export const UltrasoundAttenuationImagingSite12036 = new DicomUID("1.2.840.10008.6.1.1549", "Ultrasound Attenuation Imaging Site (12036)", DicomUidType.ContextGroupName, false);
DicomUID.register(UltrasoundAttenuationImagingSite12036);
