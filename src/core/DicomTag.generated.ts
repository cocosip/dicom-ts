// AUTO-GENERATED — do not edit manually.
// Run `npm run generate:dict` to regenerate.
//
// Source: FO-DICOM.Core/Dictionaries/DICOM Dictionary.xml

/**
 * Standard DICOM tag constants as named exports.
 *
 * Usage:
 *   import { PatientName, StudyDate } from "./DicomTag.generated.js";
 */
import { DicomTag } from "./DicomTag.js";

/** (0000,0000) VR=UL VM=1 Command Group Length */
export const CommandGroupLength = new DicomTag(0x0000, 0x0000);
/** (0000,0002) VR=UI VM=1 Affected SOP Class UID */
export const AffectedSOPClassUID = new DicomTag(0x0000, 0x0002);
/** (0000,0003) VR=UI VM=1 Requested SOP Class UID */
export const RequestedSOPClassUID = new DicomTag(0x0000, 0x0003);
/** (0000,0100) VR=US VM=1 Command Field */
export const CommandField = new DicomTag(0x0000, 0x0100);
/** (0000,0110) VR=US VM=1 Message ID */
export const MessageID = new DicomTag(0x0000, 0x0110);
/** (0000,0120) VR=US VM=1 Message ID Being Responded To */
export const MessageIDBeingRespondedTo = new DicomTag(0x0000, 0x0120);
/** (0000,0600) VR=AE VM=1 Move Destination */
export const MoveDestination = new DicomTag(0x0000, 0x0600);
/** (0000,0700) VR=US VM=1 Priority */
export const Priority = new DicomTag(0x0000, 0x0700);
/** (0000,0800) VR=US VM=1 Command Data Set Type */
export const CommandDataSetType = new DicomTag(0x0000, 0x0800);
/** (0000,0900) VR=US VM=1 Status */
export const Status = new DicomTag(0x0000, 0x0900);
/** (0000,0901) VR=AT VM=1-n Offending Element */
export const OffendingElement = new DicomTag(0x0000, 0x0901);
/** (0000,0902) VR=LO VM=1 Error Comment */
export const ErrorComment = new DicomTag(0x0000, 0x0902);
/** (0000,0903) VR=US VM=1 Error ID */
export const ErrorID = new DicomTag(0x0000, 0x0903);
/** (0000,1000) VR=UI VM=1 Affected SOP Instance UID */
export const AffectedSOPInstanceUID = new DicomTag(0x0000, 0x1000);
/** (0000,1001) VR=UI VM=1 Requested SOP Instance UID */
export const RequestedSOPInstanceUID = new DicomTag(0x0000, 0x1001);
/** (0000,1002) VR=US VM=1 Event Type ID */
export const EventTypeID = new DicomTag(0x0000, 0x1002);
/** (0000,1005) VR=AT VM=1-n Attribute Identifier List */
export const AttributeIdentifierList = new DicomTag(0x0000, 0x1005);
/** (0000,1008) VR=US VM=1 Action Type ID */
export const ActionTypeID = new DicomTag(0x0000, 0x1008);
/** (0000,1020) VR=US VM=1 Number of Remaining Sub-operations */
export const NumberOfRemainingSuboperations = new DicomTag(0x0000, 0x1020);
/** (0000,1021) VR=US VM=1 Number of Completed Sub-operations */
export const NumberOfCompletedSuboperations = new DicomTag(0x0000, 0x1021);
/** (0000,1022) VR=US VM=1 Number of Failed Sub-operations */
export const NumberOfFailedSuboperations = new DicomTag(0x0000, 0x1022);
/** (0000,1023) VR=US VM=1 Number of Warning Sub-operations */
export const NumberOfWarningSuboperations = new DicomTag(0x0000, 0x1023);
/** (0000,1030) VR=AE VM=1 Move Originator Application Entity Title */
export const MoveOriginatorApplicationEntityTitle = new DicomTag(0x0000, 0x1030);
/** (0000,1031) VR=US VM=1 Move Originator Message ID */
export const MoveOriginatorMessageID = new DicomTag(0x0000, 0x1031);
/** (0000,0001) VR=UL VM=1 Command Length to End */
export const CommandLengthToEnd = new DicomTag(0x0000, 0x0001);
/** (0000,0010) VR=SH VM=1 Command Recognition Code */
export const CommandRecognitionCode = new DicomTag(0x0000, 0x0010);
/** (0000,0200) VR=AE VM=1 Initiator */
export const Initiator = new DicomTag(0x0000, 0x0200);
/** (0000,0300) VR=AE VM=1 Receiver */
export const Receiver = new DicomTag(0x0000, 0x0300);
/** (0000,0400) VR=AE VM=1 Find Location */
export const FindLocation = new DicomTag(0x0000, 0x0400);
/** (0000,0850) VR=US VM=1 Number of Matches */
export const NumberOfMatches = new DicomTag(0x0000, 0x0850);
/** (0000,0860) VR=US VM=1 Response Sequence Number */
export const ResponseSequenceNumber = new DicomTag(0x0000, 0x0860);
/** (0000,4000) VR=LT VM=1 Dialog Receiver */
export const DialogReceiver = new DicomTag(0x0000, 0x4000);
/** (0000,4010) VR=LT VM=1 Terminal Type */
export const TerminalType = new DicomTag(0x0000, 0x4010);
/** (0000,5010) VR=SH VM=1 Message Set ID */
export const MessageSetID = new DicomTag(0x0000, 0x5010);
/** (0000,5020) VR=SH VM=1 End Message ID */
export const EndMessageID = new DicomTag(0x0000, 0x5020);
/** (0000,5110) VR=LT VM=1 Display Format */
export const DisplayFormat = new DicomTag(0x0000, 0x5110);
/** (0000,5120) VR=LT VM=1 Page Position ID */
export const PagePositionID = new DicomTag(0x0000, 0x5120);
/** (0000,5130) VR=CS VM=1 Text Format ID */
export const TextFormatID = new DicomTag(0x0000, 0x5130);
/** (0000,5140) VR=CS VM=1 Normal/Reverse */
export const NormalReverse = new DicomTag(0x0000, 0x5140);
/** (0000,5150) VR=CS VM=1 Add Gray Scale */
export const AddGrayScale = new DicomTag(0x0000, 0x5150);
/** (0000,5160) VR=CS VM=1 Borders */
export const Borders = new DicomTag(0x0000, 0x5160);
/** (0000,5170) VR=IS VM=1 Copies */
export const Copies = new DicomTag(0x0000, 0x5170);
/** (0000,5180) VR=CS VM=1 Command Magnification Type */
export const CommandMagnificationType = new DicomTag(0x0000, 0x5180);
/** (0000,5190) VR=CS VM=1 Erase */
export const Erase = new DicomTag(0x0000, 0x5190);
/** (0000,51A0) VR=CS VM=1 Print */
export const Print = new DicomTag(0x0000, 0x51A0);
/** (0000,51B0) VR=US VM=1-n Overlays */
export const Overlays = new DicomTag(0x0000, 0x51B0);
/** (0002,0000) VR=UL VM=1 File Meta Information Group Length */
export const FileMetaInformationGroupLength = new DicomTag(0x0002, 0x0000);
/** (0002,0001) VR=OB VM=1 File Meta Information Version */
export const FileMetaInformationVersion = new DicomTag(0x0002, 0x0001);
/** (0002,0002) VR=UI VM=1 Media Storage SOP Class UID */
export const MediaStorageSOPClassUID = new DicomTag(0x0002, 0x0002);
/** (0002,0003) VR=UI VM=1 Media Storage SOP Instance UID */
export const MediaStorageSOPInstanceUID = new DicomTag(0x0002, 0x0003);
/** (0002,0010) VR=UI VM=1 Transfer Syntax UID */
export const TransferSyntaxUID = new DicomTag(0x0002, 0x0010);
/** (0002,0012) VR=UI VM=1 Implementation Class UID */
export const ImplementationClassUID = new DicomTag(0x0002, 0x0012);
/** (0002,0013) VR=SH VM=1 Implementation Version Name */
export const ImplementationVersionName = new DicomTag(0x0002, 0x0013);
/** (0002,0016) VR=AE VM=1 Source Application Entity Title */
export const SourceApplicationEntityTitle = new DicomTag(0x0002, 0x0016);
/** (0002,0017) VR=AE VM=1 Sending Application Entity Title */
export const SendingApplicationEntityTitle = new DicomTag(0x0002, 0x0017);
/** (0002,0018) VR=AE VM=1 Receiving Application Entity Title */
export const ReceivingApplicationEntityTitle = new DicomTag(0x0002, 0x0018);
/** (0002,0026) VR=UR VM=1 Source Presentation Address */
export const SourcePresentationAddress = new DicomTag(0x0002, 0x0026);
/** (0002,0027) VR=UR VM=1 Sending Presentation Address */
export const SendingPresentationAddress = new DicomTag(0x0002, 0x0027);
/** (0002,0028) VR=UR VM=1 Receiving Presentation Address */
export const ReceivingPresentationAddress = new DicomTag(0x0002, 0x0028);
/** (0002,0031) VR=OB VM=1 RTV Meta Information Version */
export const RTVMetaInformationVersion = new DicomTag(0x0002, 0x0031);
/** (0002,0032) VR=UI VM=1 RTV Communication SOP Class UID */
export const RTVCommunicationSOPClassUID = new DicomTag(0x0002, 0x0032);
/** (0002,0033) VR=UI VM=1 RTV Communication SOP Instance UID */
export const RTVCommunicationSOPInstanceUID = new DicomTag(0x0002, 0x0033);
/** (0002,0035) VR=OB VM=1 RTV Source Identifier */
export const RTVSourceIdentifier = new DicomTag(0x0002, 0x0035);
/** (0002,0036) VR=OB VM=1 RTV Flow Identifier */
export const RTVFlowIdentifier = new DicomTag(0x0002, 0x0036);
/** (0002,0037) VR=UL VM=1 RTV Flow RTP Sampling Rate */
export const RTVFlowRTPSamplingRate = new DicomTag(0x0002, 0x0037);
/** (0002,0038) VR=FD VM=1 RTV Flow Actual Frame Duration */
export const RTVFlowActualFrameDuration = new DicomTag(0x0002, 0x0038);
/** (0002,0100) VR=UI VM=1 Private Information Creator UID */
export const PrivateInformationCreatorUID = new DicomTag(0x0002, 0x0100);
/** (0002,0102) VR=OB VM=1 Private Information */
export const PrivateInformation = new DicomTag(0x0002, 0x0102);
/** (0004,1130) VR=CS VM=1 File-set ID */
export const FileSetID = new DicomTag(0x0004, 0x1130);
/** (0004,1141) VR=CS VM=1-8 File-set Descriptor File ID */
export const FileSetDescriptorFileID = new DicomTag(0x0004, 0x1141);
/** (0004,1142) VR=CS VM=1 Specific Character Set of File-set Descriptor File */
export const SpecificCharacterSetOfFileSetDescriptorFile = new DicomTag(0x0004, 0x1142);
/** (0004,1200) VR=UL VM=1 Offset of the First Directory Record of the Root Directory Entity */
export const OffsetOfTheFirstDirectoryRecordOfTheRootDirectoryEntity = new DicomTag(0x0004, 0x1200);
/** (0004,1202) VR=UL VM=1 Offset of the Last Directory Record of the Root Directory Entity */
export const OffsetOfTheLastDirectoryRecordOfTheRootDirectoryEntity = new DicomTag(0x0004, 0x1202);
/** (0004,1212) VR=US VM=1 File-set Consistency Flag */
export const FileSetConsistencyFlag = new DicomTag(0x0004, 0x1212);
/** (0004,1220) VR=SQ VM=1 Directory Record Sequence */
export const DirectoryRecordSequence = new DicomTag(0x0004, 0x1220);
/** (0004,1400) VR=UL VM=1 Offset of the Next Directory Record */
export const OffsetOfTheNextDirectoryRecord = new DicomTag(0x0004, 0x1400);
/** (0004,1410) VR=US VM=1 Record In-use Flag */
export const RecordInUseFlag = new DicomTag(0x0004, 0x1410);
/** (0004,1420) VR=UL VM=1 Offset of Referenced Lower-Level Directory Entity */
export const OffsetOfReferencedLowerLevelDirectoryEntity = new DicomTag(0x0004, 0x1420);
/** (0004,1430) VR=CS VM=1 Directory Record Type */
export const DirectoryRecordType = new DicomTag(0x0004, 0x1430);
/** (0004,1432) VR=UI VM=1 Private Record UID */
export const PrivateRecordUID = new DicomTag(0x0004, 0x1432);
/** (0004,1500) VR=CS VM=1-8 Referenced File ID */
export const ReferencedFileID = new DicomTag(0x0004, 0x1500);
/** (0004,1504) VR=UL VM=1 MRDR Directory Record Offset (Retired) */
export const MRDRDirectoryRecordOffset = new DicomTag(0x0004, 0x1504);
/** (0004,1510) VR=UI VM=1 Referenced SOP Class UID in File */
export const ReferencedSOPClassUIDInFile = new DicomTag(0x0004, 0x1510);
/** (0004,1511) VR=UI VM=1 Referenced SOP Instance UID in File */
export const ReferencedSOPInstanceUIDInFile = new DicomTag(0x0004, 0x1511);
/** (0004,1512) VR=UI VM=1 Referenced Transfer Syntax UID in File */
export const ReferencedTransferSyntaxUIDInFile = new DicomTag(0x0004, 0x1512);
/** (0004,151A) VR=UI VM=1-n Referenced Related General SOP Class UID in File */
export const ReferencedRelatedGeneralSOPClassUIDInFile = new DicomTag(0x0004, 0x151A);
/** (0004,1600) VR=UL VM=1 Number of References (Retired) */
export const NumberOfReferences = new DicomTag(0x0004, 0x1600);
/** (0008,0001) VR=UL VM=1 Length to End (Retired) */
export const LengthToEnd = new DicomTag(0x0008, 0x0001);
/** (0008,0005) VR=CS VM=1-n Specific Character Set */
export const SpecificCharacterSet = new DicomTag(0x0008, 0x0005);
/** (0008,0006) VR=SQ VM=1 Language Code Sequence */
export const LanguageCodeSequence = new DicomTag(0x0008, 0x0006);
/** (0008,0008) VR=CS VM=2-n Image Type */
export const ImageType = new DicomTag(0x0008, 0x0008);
/** (0008,0010) VR=SH VM=1 Recognition Code (Retired) */
export const RecognitionCode = new DicomTag(0x0008, 0x0010);
/** (0008,0012) VR=DA VM=1 Instance Creation Date */
export const InstanceCreationDate = new DicomTag(0x0008, 0x0012);
/** (0008,0013) VR=TM VM=1 Instance Creation Time */
export const InstanceCreationTime = new DicomTag(0x0008, 0x0013);
/** (0008,0014) VR=UI VM=1 Instance Creator UID */
export const InstanceCreatorUID = new DicomTag(0x0008, 0x0014);
/** (0008,0015) VR=DT VM=1 Instance Coercion DateTime */
export const InstanceCoercionDateTime = new DicomTag(0x0008, 0x0015);
/** (0008,0016) VR=UI VM=1 SOP Class UID */
export const SOPClassUID = new DicomTag(0x0008, 0x0016);
/** (0008,0017) VR=UI VM=1 Acquisition UID */
export const AcquisitionUID = new DicomTag(0x0008, 0x0017);
/** (0008,0018) VR=UI VM=1 SOP Instance UID */
export const SOPInstanceUID = new DicomTag(0x0008, 0x0018);
/** (0008,0019) VR=UI VM=1 Pyramid UID */
export const PyramidUID = new DicomTag(0x0008, 0x0019);
/** (0008,001A) VR=UI VM=1-n Related General SOP Class UID */
export const RelatedGeneralSOPClassUID = new DicomTag(0x0008, 0x001A);
/** (0008,001B) VR=UI VM=1 Original Specialized SOP Class UID */
export const OriginalSpecializedSOPClassUID = new DicomTag(0x0008, 0x001B);
/** (0008,001C) VR=CS VM=1 Synthetic Data */
export const SyntheticData = new DicomTag(0x0008, 0x001C);
/** (0008,0020) VR=DA VM=1 Study Date */
export const StudyDate = new DicomTag(0x0008, 0x0020);
/** (0008,0021) VR=DA VM=1 Series Date */
export const SeriesDate = new DicomTag(0x0008, 0x0021);
/** (0008,0022) VR=DA VM=1 Acquisition Date */
export const AcquisitionDate = new DicomTag(0x0008, 0x0022);
/** (0008,0023) VR=DA VM=1 Content Date */
export const ContentDate = new DicomTag(0x0008, 0x0023);
/** (0008,0024) VR=DA VM=1 Overlay Date (Retired) */
export const OverlayDate = new DicomTag(0x0008, 0x0024);
/** (0008,0025) VR=DA VM=1 Curve Date (Retired) */
export const CurveDate = new DicomTag(0x0008, 0x0025);
/** (0008,002A) VR=DT VM=1 Acquisition DateTime */
export const AcquisitionDateTime = new DicomTag(0x0008, 0x002A);
/** (0008,0030) VR=TM VM=1 Study Time */
export const StudyTime = new DicomTag(0x0008, 0x0030);
/** (0008,0031) VR=TM VM=1 Series Time */
export const SeriesTime = new DicomTag(0x0008, 0x0031);
/** (0008,0032) VR=TM VM=1 Acquisition Time */
export const AcquisitionTime = new DicomTag(0x0008, 0x0032);
/** (0008,0033) VR=TM VM=1 Content Time */
export const ContentTime = new DicomTag(0x0008, 0x0033);
/** (0008,0034) VR=TM VM=1 Overlay Time (Retired) */
export const OverlayTime = new DicomTag(0x0008, 0x0034);
/** (0008,0035) VR=TM VM=1 Curve Time (Retired) */
export const CurveTime = new DicomTag(0x0008, 0x0035);
/** (0008,0040) VR=US VM=1 Data Set Type (Retired) */
export const DataSetType = new DicomTag(0x0008, 0x0040);
/** (0008,0041) VR=LO VM=1 Data Set Subtype (Retired) */
export const DataSetSubtype = new DicomTag(0x0008, 0x0041);
/** (0008,0042) VR=CS VM=1 Nuclear Medicine Series Type (Retired) */
export const NuclearMedicineSeriesType = new DicomTag(0x0008, 0x0042);
/** (0008,0050) VR=SH VM=1 Accession Number */
export const AccessionNumber = new DicomTag(0x0008, 0x0050);
/** (0008,0051) VR=SQ VM=1 Issuer of Accession Number Sequence */
export const IssuerOfAccessionNumberSequence = new DicomTag(0x0008, 0x0051);
/** (0008,0052) VR=CS VM=1 Query/Retrieve Level */
export const QueryRetrieveLevel = new DicomTag(0x0008, 0x0052);
/** (0008,0053) VR=CS VM=1 Query/Retrieve View */
export const QueryRetrieveView = new DicomTag(0x0008, 0x0053);
/** (0008,0054) VR=AE VM=1-n Retrieve AE Title */
export const RetrieveAETitle = new DicomTag(0x0008, 0x0054);
/** (0008,0055) VR=AE VM=1 Station AE Title */
export const StationAETitle = new DicomTag(0x0008, 0x0055);
/** (0008,0056) VR=CS VM=1 Instance Availability */
export const InstanceAvailability = new DicomTag(0x0008, 0x0056);
/** (0008,0058) VR=UI VM=1-n Failed SOP Instance UID List */
export const FailedSOPInstanceUIDList = new DicomTag(0x0008, 0x0058);
/** (0008,0060) VR=CS VM=1 Modality */
export const Modality = new DicomTag(0x0008, 0x0060);
/** (0008,0061) VR=CS VM=1-n Modalities in Study */
export const ModalitiesInStudy = new DicomTag(0x0008, 0x0061);
/** (0008,0062) VR=UI VM=1-n SOP Classes in Study */
export const SOPClassesInStudy = new DicomTag(0x0008, 0x0062);
/** (0008,0063) VR=SQ VM=1 Anatomic Regions in Study Code Sequence */
export const AnatomicRegionsInStudyCodeSequence = new DicomTag(0x0008, 0x0063);
/** (0008,0064) VR=CS VM=1 Conversion Type */
export const ConversionType = new DicomTag(0x0008, 0x0064);
/** (0008,0068) VR=CS VM=1 Presentation Intent Type */
export const PresentationIntentType = new DicomTag(0x0008, 0x0068);
/** (0008,0070) VR=LO VM=1 Manufacturer */
export const Manufacturer = new DicomTag(0x0008, 0x0070);
/** (0008,0080) VR=LO VM=1 Institution Name */
export const InstitutionName = new DicomTag(0x0008, 0x0080);
/** (0008,0081) VR=ST VM=1 Institution Address */
export const InstitutionAddress = new DicomTag(0x0008, 0x0081);
/** (0008,0082) VR=SQ VM=1 Institution Code Sequence */
export const InstitutionCodeSequence = new DicomTag(0x0008, 0x0082);
/** (0008,0090) VR=PN VM=1 Referring Physician's Name */
export const ReferringPhysicianName = new DicomTag(0x0008, 0x0090);
/** (0008,0092) VR=ST VM=1 Referring Physician's Address */
export const ReferringPhysicianAddress = new DicomTag(0x0008, 0x0092);
/** (0008,0094) VR=SH VM=1-n Referring Physician's Telephone Numbers */
export const ReferringPhysicianTelephoneNumbers = new DicomTag(0x0008, 0x0094);
/** (0008,0096) VR=SQ VM=1 Referring Physician Identification Sequence */
export const ReferringPhysicianIdentificationSequence = new DicomTag(0x0008, 0x0096);
/** (0008,009C) VR=PN VM=1-n Consulting Physician's Name */
export const ConsultingPhysicianName = new DicomTag(0x0008, 0x009C);
/** (0008,009D) VR=SQ VM=1 Consulting Physician Identification Sequence */
export const ConsultingPhysicianIdentificationSequence = new DicomTag(0x0008, 0x009D);
/** (0008,0100) VR=SH VM=1 Code Value */
export const CodeValue = new DicomTag(0x0008, 0x0100);
/** (0008,0101) VR=LO VM=1 Extended Code Value */
export const ExtendedCodeValue = new DicomTag(0x0008, 0x0101);
/** (0008,0102) VR=SH VM=1 Coding Scheme Designator */
export const CodingSchemeDesignator = new DicomTag(0x0008, 0x0102);
/** (0008,0103) VR=SH VM=1 Coding Scheme Version */
export const CodingSchemeVersion = new DicomTag(0x0008, 0x0103);
/** (0008,0104) VR=LO VM=1 Code Meaning */
export const CodeMeaning = new DicomTag(0x0008, 0x0104);
/** (0008,0105) VR=CS VM=1 Mapping Resource */
export const MappingResource = new DicomTag(0x0008, 0x0105);
/** (0008,0106) VR=DT VM=1 Context Group Version */
export const ContextGroupVersion = new DicomTag(0x0008, 0x0106);
/** (0008,0107) VR=DT VM=1 Context Group Local Version */
export const ContextGroupLocalVersion = new DicomTag(0x0008, 0x0107);
/** (0008,0108) VR=LT VM=1 Extended Code Meaning */
export const ExtendedCodeMeaning = new DicomTag(0x0008, 0x0108);
/** (0008,0109) VR=SQ VM=1 Coding Scheme Resources Sequence */
export const CodingSchemeResourcesSequence = new DicomTag(0x0008, 0x0109);
/** (0008,010A) VR=CS VM=1 Coding Scheme URL Type */
export const CodingSchemeURLType = new DicomTag(0x0008, 0x010A);
/** (0008,010B) VR=CS VM=1 Context Group Extension Flag */
export const ContextGroupExtensionFlag = new DicomTag(0x0008, 0x010B);
/** (0008,010C) VR=UI VM=1 Coding Scheme UID */
export const CodingSchemeUID = new DicomTag(0x0008, 0x010C);
/** (0008,010D) VR=UI VM=1 Context Group Extension Creator UID */
export const ContextGroupExtensionCreatorUID = new DicomTag(0x0008, 0x010D);
/** (0008,010E) VR=UR VM=1 Coding Scheme URL */
export const CodingSchemeURL = new DicomTag(0x0008, 0x010E);
/** (0008,010F) VR=CS VM=1 Context Identifier */
export const ContextIdentifier = new DicomTag(0x0008, 0x010F);
/** (0008,0110) VR=SQ VM=1 Coding Scheme Identification Sequence */
export const CodingSchemeIdentificationSequence = new DicomTag(0x0008, 0x0110);
/** (0008,0112) VR=LO VM=1 Coding Scheme Registry */
export const CodingSchemeRegistry = new DicomTag(0x0008, 0x0112);
/** (0008,0114) VR=ST VM=1 Coding Scheme External ID */
export const CodingSchemeExternalID = new DicomTag(0x0008, 0x0114);
/** (0008,0115) VR=ST VM=1 Coding Scheme Name */
export const CodingSchemeName = new DicomTag(0x0008, 0x0115);
/** (0008,0116) VR=ST VM=1 Coding Scheme Responsible Organization */
export const CodingSchemeResponsibleOrganization = new DicomTag(0x0008, 0x0116);
/** (0008,0117) VR=UI VM=1 Context UID */
export const ContextUID = new DicomTag(0x0008, 0x0117);
/** (0008,0118) VR=UI VM=1 Mapping Resource UID */
export const MappingResourceUID = new DicomTag(0x0008, 0x0118);
/** (0008,0119) VR=UC VM=1 Long Code Value */
export const LongCodeValue = new DicomTag(0x0008, 0x0119);
/** (0008,0120) VR=UR VM=1 URN Code Value */
export const URNCodeValue = new DicomTag(0x0008, 0x0120);
/** (0008,0121) VR=SQ VM=1 Equivalent Code Sequence */
export const EquivalentCodeSequence = new DicomTag(0x0008, 0x0121);
/** (0008,0122) VR=LO VM=1 Mapping Resource Name */
export const MappingResourceName = new DicomTag(0x0008, 0x0122);
/** (0008,0123) VR=SQ VM=1 Context Group Identification Sequence */
export const ContextGroupIdentificationSequence = new DicomTag(0x0008, 0x0123);
/** (0008,0124) VR=SQ VM=1 Mapping Resource Identification Sequence */
export const MappingResourceIdentificationSequence = new DicomTag(0x0008, 0x0124);
/** (0008,0201) VR=SH VM=1 Timezone Offset From UTC */
export const TimezoneOffsetFromUTC = new DicomTag(0x0008, 0x0201);
/** (0008,0220) VR=SQ VM=1 Responsible Group Code Sequence */
export const ResponsibleGroupCodeSequence = new DicomTag(0x0008, 0x0220);
/** (0008,0221) VR=CS VM=1 Equipment Modality */
export const EquipmentModality = new DicomTag(0x0008, 0x0221);
/** (0008,0222) VR=LO VM=1 Manufacturer's Related Model Group */
export const ManufacturerRelatedModelGroup = new DicomTag(0x0008, 0x0222);
/** (0008,0300) VR=SQ VM=1 Private Data Element Characteristics Sequence */
export const PrivateDataElementCharacteristicsSequence = new DicomTag(0x0008, 0x0300);
/** (0008,0301) VR=US VM=1 Private Group Reference */
export const PrivateGroupReference = new DicomTag(0x0008, 0x0301);
/** (0008,0302) VR=LO VM=1 Private Creator Reference */
export const PrivateCreatorReference = new DicomTag(0x0008, 0x0302);
/** (0008,0303) VR=CS VM=1 Block Identifying Information Status */
export const BlockIdentifyingInformationStatus = new DicomTag(0x0008, 0x0303);
/** (0008,0304) VR=US VM=1-n Nonidentifying Private Elements */
export const NonidentifyingPrivateElements = new DicomTag(0x0008, 0x0304);
/** (0008,0306) VR=US VM=1-n Identifying Private Elements */
export const IdentifyingPrivateElements = new DicomTag(0x0008, 0x0306);
/** (0008,0305) VR=SQ VM=1 Deidentification Action Sequence */
export const DeidentificationActionSequence = new DicomTag(0x0008, 0x0305);
/** (0008,0307) VR=CS VM=1 Deidentification Action */
export const DeidentificationAction = new DicomTag(0x0008, 0x0307);
/** (0008,0308) VR=US VM=1 Private Data Element */
export const PrivateDataElement = new DicomTag(0x0008, 0x0308);
/** (0008,0309) VR=UL VM=1-3 Private Data Element Value Multiplicity */
export const PrivateDataElementValueMultiplicity = new DicomTag(0x0008, 0x0309);
/** (0008,030A) VR=CS VM=1 Private Data Element Value Representation */
export const PrivateDataElementValueRepresentation = new DicomTag(0x0008, 0x030A);
/** (0008,030B) VR=UL VM=1-2 Private Data Element Number of Items */
export const PrivateDataElementNumberOfItems = new DicomTag(0x0008, 0x030B);
/** (0008,030C) VR=UC VM=1 Private Data Element Name */
export const PrivateDataElementName = new DicomTag(0x0008, 0x030C);
/** (0008,030D) VR=UC VM=1 Private Data Element Keyword */
export const PrivateDataElementKeyword = new DicomTag(0x0008, 0x030D);
/** (0008,030E) VR=UT VM=1 Private Data Element Description */
export const PrivateDataElementDescription = new DicomTag(0x0008, 0x030E);
/** (0008,030F) VR=UT VM=1 Private Data Element Encoding */
export const PrivateDataElementEncoding = new DicomTag(0x0008, 0x030F);
/** (0008,0310) VR=SQ VM=1 Private Data Element Definition Sequence */
export const PrivateDataElementDefinitionSequence = new DicomTag(0x0008, 0x0310);
/** (0008,0400) VR=SQ VM=1 Scope of Inventory Sequence */
export const ScopeOfInventorySequence = new DicomTag(0x0008, 0x0400);
/** (0008,0401) VR=LT VM=1 Inventory Purpose */
export const InventoryPurpose = new DicomTag(0x0008, 0x0401);
/** (0008,0402) VR=LT VM=1 Inventory Instance Description */
export const InventoryInstanceDescription = new DicomTag(0x0008, 0x0402);
/** (0008,0403) VR=CS VM=1 Inventory Level */
export const InventoryLevel = new DicomTag(0x0008, 0x0403);
/** (0008,0404) VR=DT VM=1 Item Inventory DateTime */
export const ItemInventoryDateTime = new DicomTag(0x0008, 0x0404);
/** (0008,0405) VR=CS VM=1 Removed from Operational Use */
export const RemovedFromOperationalUse = new DicomTag(0x0008, 0x0405);
/** (0008,0406) VR=SQ VM=1 Reason for Removal Code Sequence */
export const ReasonForRemovalCodeSequence = new DicomTag(0x0008, 0x0406);
/** (0008,0407) VR=UR VM=1 Stored Instance Base URI */
export const StoredInstanceBaseURI = new DicomTag(0x0008, 0x0407);
/** (0008,0408) VR=UR VM=1 Folder Access URI */
export const FolderAccessURI = new DicomTag(0x0008, 0x0408);
/** (0008,0409) VR=UR VM=1 File Access URI */
export const FileAccessURI = new DicomTag(0x0008, 0x0409);
/** (0008,040A) VR=CS VM=1 Container File Type */
export const ContainerFileType = new DicomTag(0x0008, 0x040A);
/** (0008,040B) VR=UR VM=1 Filename in Container */
export const FilenameInContainer = new DicomTag(0x0008, 0x040B);
/** (0008,040C) VR=UV VM=1 File Offset in Container */
export const FileOffsetInContainer = new DicomTag(0x0008, 0x040C);
/** (0008,040D) VR=UV VM=1 File Length in Container */
export const FileLengthInContainer = new DicomTag(0x0008, 0x040D);
/** (0008,040E) VR=UI VM=1 Stored Instance Transfer Syntax UID */
export const StoredInstanceTransferSyntaxUID = new DicomTag(0x0008, 0x040E);
/** (0008,040F) VR=CS VM=1-n Extended Matching Mechanisms */
export const ExtendedMatchingMechanisms = new DicomTag(0x0008, 0x040F);
/** (0008,0410) VR=SQ VM=1 Range Matching Sequence */
export const RangeMatchingSequence = new DicomTag(0x0008, 0x0410);
/** (0008,0411) VR=SQ VM=1 List of UID Matching Sequence */
export const ListOfUIDMatchingSequence = new DicomTag(0x0008, 0x0411);
/** (0008,0412) VR=SQ VM=1 Empty Value Matching Sequence */
export const EmptyValueMatchingSequence = new DicomTag(0x0008, 0x0412);
/** (0008,0413) VR=SQ VM=1 General Matching Sequence */
export const GeneralMatchingSequence = new DicomTag(0x0008, 0x0413);
/** (0008,0414) VR=US VM=1 Requested Status Interval */
export const RequestedStatusInterval = new DicomTag(0x0008, 0x0414);
/** (0008,0415) VR=CS VM=1 Retain Instances */
export const RetainInstances = new DicomTag(0x0008, 0x0415);
/** (0008,0416) VR=DT VM=1 Expiration DateTime */
export const ExpirationDateTime = new DicomTag(0x0008, 0x0416);
/** (0008,0417) VR=CS VM=1 Transaction Status */
export const TransactionStatus = new DicomTag(0x0008, 0x0417);
/** (0008,0418) VR=LT VM=1 Transaction Status Comment */
export const TransactionStatusComment = new DicomTag(0x0008, 0x0418);
/** (0008,0419) VR=SQ VM=1 File Set Access Sequence */
export const FileSetAccessSequence = new DicomTag(0x0008, 0x0419);
/** (0008,041A) VR=SQ VM=1 File Access Sequence */
export const FileAccessSequence = new DicomTag(0x0008, 0x041A);
/** (0008,041B) VR=OB VM=1 Record Key */
export const RecordKey = new DicomTag(0x0008, 0x041B);
/** (0008,041C) VR=OB VM=1 Prior Record Key */
export const PriorRecordKey = new DicomTag(0x0008, 0x041C);
/** (0008,041D) VR=SQ VM=1 Metadata Sequence */
export const MetadataSequence = new DicomTag(0x0008, 0x041D);
/** (0008,041E) VR=SQ VM=1 Updated Metadata Sequence */
export const UpdatedMetadataSequence = new DicomTag(0x0008, 0x041E);
/** (0008,041F) VR=DT VM=1 Study Update DateTime */
export const StudyUpdateDateTime = new DicomTag(0x0008, 0x041F);
/** (0008,0420) VR=SQ VM=1 Inventory Access End Points Sequence */
export const InventoryAccessEndPointsSequence = new DicomTag(0x0008, 0x0420);
/** (0008,0421) VR=SQ VM=1 Study Access End Points Sequence */
export const StudyAccessEndPointsSequence = new DicomTag(0x0008, 0x0421);
/** (0008,0422) VR=SQ VM=1 Incorporated Inventory Instance Sequence */
export const IncorporatedInventoryInstanceSequence = new DicomTag(0x0008, 0x0422);
/** (0008,0423) VR=SQ VM=1 Inventoried Studies Sequence */
export const InventoriedStudiesSequence = new DicomTag(0x0008, 0x0423);
/** (0008,0424) VR=SQ VM=1 Inventoried Series Sequence */
export const InventoriedSeriesSequence = new DicomTag(0x0008, 0x0424);
/** (0008,0425) VR=SQ VM=1 Inventoried Instances Sequence */
export const InventoriedInstancesSequence = new DicomTag(0x0008, 0x0425);
/** (0008,0426) VR=CS VM=1 Inventory Completion Status */
export const InventoryCompletionStatus = new DicomTag(0x0008, 0x0426);
/** (0008,0427) VR=UL VM=1 Number of Study Records in Instance */
export const NumberOfStudyRecordsInInstance = new DicomTag(0x0008, 0x0427);
/** (0008,0428) VR=UV VM=1 Total Number of Study Records */
export const TotalNumberOfStudyRecords = new DicomTag(0x0008, 0x0428);
/** (0008,0429) VR=UV VM=1 Maximum Number of Records */
export const MaximumNumberOfRecords = new DicomTag(0x0008, 0x0429);
/** (0008,1000) VR=AE VM=1 Network ID (Retired) */
export const NetworkID = new DicomTag(0x0008, 0x1000);
/** (0008,1010) VR=SH VM=1 Station Name */
export const StationName = new DicomTag(0x0008, 0x1010);
/** (0008,1030) VR=LO VM=1 Study Description */
export const StudyDescription = new DicomTag(0x0008, 0x1030);
/** (0008,1032) VR=SQ VM=1 Procedure Code Sequence */
export const ProcedureCodeSequence = new DicomTag(0x0008, 0x1032);
/** (0008,103E) VR=LO VM=1 Series Description */
export const SeriesDescription = new DicomTag(0x0008, 0x103E);
/** (0008,103F) VR=SQ VM=1 Series Description Code Sequence */
export const SeriesDescriptionCodeSequence = new DicomTag(0x0008, 0x103F);
/** (0008,1040) VR=LO VM=1 Institutional Department Name */
export const InstitutionalDepartmentName = new DicomTag(0x0008, 0x1040);
/** (0008,1041) VR=SQ VM=1 Institutional Department Type Code Sequence */
export const InstitutionalDepartmentTypeCodeSequence = new DicomTag(0x0008, 0x1041);
/** (0008,1048) VR=PN VM=1-n Physician(s) of Record */
export const PhysiciansOfRecord = new DicomTag(0x0008, 0x1048);
/** (0008,1049) VR=SQ VM=1 Physician(s) of Record Identification Sequence */
export const PhysiciansOfRecordIdentificationSequence = new DicomTag(0x0008, 0x1049);
/** (0008,1050) VR=PN VM=1-n Performing Physician's Name */
export const PerformingPhysicianName = new DicomTag(0x0008, 0x1050);
/** (0008,1052) VR=SQ VM=1 Performing Physician Identification Sequence */
export const PerformingPhysicianIdentificationSequence = new DicomTag(0x0008, 0x1052);
/** (0008,1060) VR=PN VM=1-n Name of Physician(s) Reading Study */
export const NameOfPhysiciansReadingStudy = new DicomTag(0x0008, 0x1060);
/** (0008,1062) VR=SQ VM=1 Physician(s) Reading Study Identification Sequence */
export const PhysiciansReadingStudyIdentificationSequence = new DicomTag(0x0008, 0x1062);
/** (0008,1070) VR=PN VM=1-n Operators' Name */
export const OperatorsName = new DicomTag(0x0008, 0x1070);
/** (0008,1072) VR=SQ VM=1 Operator Identification Sequence */
export const OperatorIdentificationSequence = new DicomTag(0x0008, 0x1072);
/** (0008,1080) VR=LO VM=1-n Admitting Diagnoses Description */
export const AdmittingDiagnosesDescription = new DicomTag(0x0008, 0x1080);
/** (0008,1084) VR=SQ VM=1 Admitting Diagnoses Code Sequence */
export const AdmittingDiagnosesCodeSequence = new DicomTag(0x0008, 0x1084);
/** (0008,1088) VR=LO VM=1 Pyramid Description */
export const PyramidDescription = new DicomTag(0x0008, 0x1088);
/** (0008,1090) VR=LO VM=1 Manufacturer's Model Name */
export const ManufacturerModelName = new DicomTag(0x0008, 0x1090);
/** (0008,1100) VR=SQ VM=1 Referenced Results Sequence (Retired) */
export const ReferencedResultsSequence = new DicomTag(0x0008, 0x1100);
/** (0008,1110) VR=SQ VM=1 Referenced Study Sequence */
export const ReferencedStudySequence = new DicomTag(0x0008, 0x1110);
/** (0008,1111) VR=SQ VM=1 Referenced Performed Procedure Step Sequence */
export const ReferencedPerformedProcedureStepSequence = new DicomTag(0x0008, 0x1111);
/** (0008,1112) VR=SQ VM=1 Referenced Instances by SOP Class Sequence */
export const ReferencedInstancesBySOPClassSequence = new DicomTag(0x0008, 0x1112);
/** (0008,1115) VR=SQ VM=1 Referenced Series Sequence */
export const ReferencedSeriesSequence = new DicomTag(0x0008, 0x1115);
/** (0008,1120) VR=SQ VM=1 Referenced Patient Sequence */
export const ReferencedPatientSequence = new DicomTag(0x0008, 0x1120);
/** (0008,1125) VR=SQ VM=1 Referenced Visit Sequence */
export const ReferencedVisitSequence = new DicomTag(0x0008, 0x1125);
/** (0008,1130) VR=SQ VM=1 Referenced Overlay Sequence (Retired) */
export const ReferencedOverlaySequence = new DicomTag(0x0008, 0x1130);
/** (0008,1134) VR=SQ VM=1 Referenced Stereometric Instance Sequence */
export const ReferencedStereometricInstanceSequence = new DicomTag(0x0008, 0x1134);
/** (0008,113A) VR=SQ VM=1 Referenced Waveform Sequence */
export const ReferencedWaveformSequence = new DicomTag(0x0008, 0x113A);
/** (0008,1140) VR=SQ VM=1 Referenced Image Sequence */
export const ReferencedImageSequence = new DicomTag(0x0008, 0x1140);
/** (0008,1145) VR=SQ VM=1 Referenced Curve Sequence (Retired) */
export const ReferencedCurveSequence = new DicomTag(0x0008, 0x1145);
/** (0008,114A) VR=SQ VM=1 Referenced Instance Sequence */
export const ReferencedInstanceSequence = new DicomTag(0x0008, 0x114A);
/** (0008,114B) VR=SQ VM=1 Referenced Real World Value Mapping Instance Sequence */
export const ReferencedRealWorldValueMappingInstanceSequence = new DicomTag(0x0008, 0x114B);
/** (0008,114C) VR=SQ VM=1 Referenced Segmentation Sequence */
export const ReferencedSegmentationSequence = new DicomTag(0x0008, 0x114C);
/** (0008,114D) VR=SQ VM=1 Referenced Surface Segmentation Sequence */
export const ReferencedSurfaceSegmentationSequence = new DicomTag(0x0008, 0x114D);
/** (0008,1150) VR=UI VM=1 Referenced SOP Class UID */
export const ReferencedSOPClassUID = new DicomTag(0x0008, 0x1150);
/** (0008,1155) VR=UI VM=1 Referenced SOP Instance UID */
export const ReferencedSOPInstanceUID = new DicomTag(0x0008, 0x1155);
/** (0008,1156) VR=SQ VM=1 Definition Source Sequence */
export const DefinitionSourceSequence = new DicomTag(0x0008, 0x1156);
/** (0008,115A) VR=UI VM=1-n SOP Classes Supported */
export const SOPClassesSupported = new DicomTag(0x0008, 0x115A);
/** (0008,1160) VR=IS VM=1-n Referenced Frame Number */
export const ReferencedFrameNumber = new DicomTag(0x0008, 0x1160);
/** (0008,1161) VR=UL VM=1-n Simple Frame List */
export const SimpleFrameList = new DicomTag(0x0008, 0x1161);
/** (0008,1162) VR=UL VM=3-3n Calculated Frame List */
export const CalculatedFrameList = new DicomTag(0x0008, 0x1162);
/** (0008,1163) VR=FD VM=2 Time Range */
export const TimeRange = new DicomTag(0x0008, 0x1163);
/** (0008,1164) VR=SQ VM=1 Frame Extraction Sequence */
export const FrameExtractionSequence = new DicomTag(0x0008, 0x1164);
/** (0008,1167) VR=UI VM=1 Multi-frame Source SOP Instance UID */
export const MultiFrameSourceSOPInstanceUID = new DicomTag(0x0008, 0x1167);
/** (0008,1190) VR=UR VM=1 Retrieve URL */
export const RetrieveURL = new DicomTag(0x0008, 0x1190);
/** (0008,1195) VR=UI VM=1 Transaction UID */
export const TransactionUID = new DicomTag(0x0008, 0x1195);
/** (0008,1196) VR=US VM=1 Warning Reason */
export const WarningReason = new DicomTag(0x0008, 0x1196);
/** (0008,1197) VR=US VM=1 Failure Reason */
export const FailureReason = new DicomTag(0x0008, 0x1197);
/** (0008,1198) VR=SQ VM=1 Failed SOP Sequence */
export const FailedSOPSequence = new DicomTag(0x0008, 0x1198);
/** (0008,1199) VR=SQ VM=1 Referenced SOP Sequence */
export const ReferencedSOPSequence = new DicomTag(0x0008, 0x1199);
/** (0008,119A) VR=SQ VM=1 Other Failures Sequence */
export const OtherFailuresSequence = new DicomTag(0x0008, 0x119A);
/** (0008,119B) VR=SQ VM=1 Failed Study Sequence */
export const FailedStudySequence = new DicomTag(0x0008, 0x119B);
/** (0008,1200) VR=SQ VM=1 Studies Containing Other Referenced Instances Sequence */
export const StudiesContainingOtherReferencedInstancesSequence = new DicomTag(0x0008, 0x1200);
/** (0008,1250) VR=SQ VM=1 Related Series Sequence */
export const RelatedSeriesSequence = new DicomTag(0x0008, 0x1250);
/** (0008,1301) VR=SQ VM=1 Principal Diagnosis Code Sequence */
export const PrincipalDiagnosisCodeSequence = new DicomTag(0x0008, 0x1301);
/** (0008,1302) VR=SQ VM=1 Primary Diagnosis Code Sequence */
export const PrimaryDiagnosisCodeSequence = new DicomTag(0x0008, 0x1302);
/** (0008,1303) VR=SQ VM=1 Secondary Diagnoses Code Sequence */
export const SecondaryDiagnosesCodeSequence = new DicomTag(0x0008, 0x1303);
/** (0008,1304) VR=SQ VM=1 Histological Diagnoses Code Sequence */
export const HistologicalDiagnosesCodeSequence = new DicomTag(0x0008, 0x1304);
/** (0008,2110) VR=CS VM=1 Lossy Image Compression (Retired) (Retired) */
export const LossyImageCompressionRetired = new DicomTag(0x0008, 0x2110);
/** (0008,2111) VR=ST VM=1 Derivation Description */
export const DerivationDescription = new DicomTag(0x0008, 0x2111);
/** (0008,2112) VR=SQ VM=1 Source Image Sequence */
export const SourceImageSequence = new DicomTag(0x0008, 0x2112);
/** (0008,2120) VR=SH VM=1 Stage Name */
export const StageName = new DicomTag(0x0008, 0x2120);
/** (0008,2122) VR=IS VM=1 Stage Number */
export const StageNumber = new DicomTag(0x0008, 0x2122);
/** (0008,2124) VR=IS VM=1 Number of Stages */
export const NumberOfStages = new DicomTag(0x0008, 0x2124);
/** (0008,2127) VR=SH VM=1 View Name */
export const ViewName = new DicomTag(0x0008, 0x2127);
/** (0008,2128) VR=IS VM=1 View Number */
export const ViewNumber = new DicomTag(0x0008, 0x2128);
/** (0008,2129) VR=IS VM=1 Number of Event Timers */
export const NumberOfEventTimers = new DicomTag(0x0008, 0x2129);
/** (0008,212A) VR=IS VM=1 Number of Views in Stage */
export const NumberOfViewsInStage = new DicomTag(0x0008, 0x212A);
/** (0008,2130) VR=DS VM=1-n Event Elapsed Time(s) */
export const EventElapsedTimes = new DicomTag(0x0008, 0x2130);
/** (0008,2132) VR=LO VM=1-n Event Timer Name(s) */
export const EventTimerNames = new DicomTag(0x0008, 0x2132);
/** (0008,2133) VR=SQ VM=1 Event Timer Sequence */
export const EventTimerSequence = new DicomTag(0x0008, 0x2133);
/** (0008,2134) VR=FD VM=1 Event Time Offset */
export const EventTimeOffset = new DicomTag(0x0008, 0x2134);
/** (0008,2135) VR=SQ VM=1 Event Code Sequence */
export const EventCodeSequence = new DicomTag(0x0008, 0x2135);
/** (0008,2142) VR=IS VM=1 Start Trim */
export const StartTrim = new DicomTag(0x0008, 0x2142);
/** (0008,2143) VR=IS VM=1 Stop Trim */
export const StopTrim = new DicomTag(0x0008, 0x2143);
/** (0008,2144) VR=IS VM=1 Recommended Display Frame Rate */
export const RecommendedDisplayFrameRate = new DicomTag(0x0008, 0x2144);
/** (0008,2200) VR=CS VM=1 Transducer Position (Retired) */
export const TransducerPosition = new DicomTag(0x0008, 0x2200);
/** (0008,2204) VR=CS VM=1 Transducer Orientation (Retired) */
export const TransducerOrientation = new DicomTag(0x0008, 0x2204);
/** (0008,2208) VR=CS VM=1 Anatomic Structure (Retired) */
export const AnatomicStructure = new DicomTag(0x0008, 0x2208);
/** (0008,2218) VR=SQ VM=1 Anatomic Region Sequence */
export const AnatomicRegionSequence = new DicomTag(0x0008, 0x2218);
/** (0008,2220) VR=SQ VM=1 Anatomic Region Modifier Sequence */
export const AnatomicRegionModifierSequence = new DicomTag(0x0008, 0x2220);
/** (0008,2228) VR=SQ VM=1 Primary Anatomic Structure Sequence */
export const PrimaryAnatomicStructureSequence = new DicomTag(0x0008, 0x2228);
/** (0008,2229) VR=SQ VM=1 Anatomic Structure, Space or Region Sequence (Retired) */
export const AnatomicStructureSpaceOrRegionSequence = new DicomTag(0x0008, 0x2229);
/** (0008,2230) VR=SQ VM=1 Primary Anatomic Structure Modifier Sequence */
export const PrimaryAnatomicStructureModifierSequence = new DicomTag(0x0008, 0x2230);
/** (0008,2240) VR=SQ VM=1 Transducer Position Sequence (Retired) */
export const TransducerPositionSequence = new DicomTag(0x0008, 0x2240);
/** (0008,2242) VR=SQ VM=1 Transducer Position Modifier Sequence (Retired) */
export const TransducerPositionModifierSequence = new DicomTag(0x0008, 0x2242);
/** (0008,2244) VR=SQ VM=1 Transducer Orientation Sequence (Retired) */
export const TransducerOrientationSequence = new DicomTag(0x0008, 0x2244);
/** (0008,2246) VR=SQ VM=1 Transducer Orientation Modifier Sequence (Retired) */
export const TransducerOrientationModifierSequence = new DicomTag(0x0008, 0x2246);
/** (0008,2251) VR=SQ VM=1 Anatomic Structure Space Or Region Code Sequence (Trial) (Retired) */
export const AnatomicStructureSpaceOrRegionCodeSequenceTrial = new DicomTag(0x0008, 0x2251);
/** (0008,2253) VR=SQ VM=1 Anatomic Portal Of Entrance Code Sequence (Trial) (Retired) */
export const AnatomicPortalOfEntranceCodeSequenceTrial = new DicomTag(0x0008, 0x2253);
/** (0008,2255) VR=SQ VM=1 Anatomic Approach Direction Code Sequence (Trial) (Retired) */
export const AnatomicApproachDirectionCodeSequenceTrial = new DicomTag(0x0008, 0x2255);
/** (0008,2256) VR=ST VM=1 Anatomic Perspective Description (Trial) (Retired) */
export const AnatomicPerspectiveDescriptionTrial = new DicomTag(0x0008, 0x2256);
/** (0008,2257) VR=SQ VM=1 Anatomic Perspective Code Sequence (Trial) (Retired) */
export const AnatomicPerspectiveCodeSequenceTrial = new DicomTag(0x0008, 0x2257);
/** (0008,2258) VR=ST VM=1 Anatomic Location Of Examining Instrument Description (Trial) (Retired) */
export const AnatomicLocationOfExaminingInstrumentDescriptionTrial = new DicomTag(0x0008, 0x2258);
/** (0008,2259) VR=SQ VM=1 Anatomic Location Of Examining Instrument Code Sequence (Trial) (Retired) */
export const AnatomicLocationOfExaminingInstrumentCodeSequenceTrial = new DicomTag(0x0008, 0x2259);
/** (0008,225A) VR=SQ VM=1 Anatomic Structure Space Or Region Modifier Code Sequence (Trial) (Retired) */
export const AnatomicStructureSpaceOrRegionModifierCodeSequenceTrial = new DicomTag(0x0008, 0x225A);
/** (0008,225C) VR=SQ VM=1 On Axis Background Anatomic Structure Code Sequence (Trial) (Retired) */
export const OnAxisBackgroundAnatomicStructureCodeSequenceTrial = new DicomTag(0x0008, 0x225C);
/** (0008,3001) VR=SQ VM=1 Alternate Representation Sequence */
export const AlternateRepresentationSequence = new DicomTag(0x0008, 0x3001);
/** (0008,3002) VR=UI VM=1-n Available Transfer Syntax UID */
export const AvailableTransferSyntaxUID = new DicomTag(0x0008, 0x3002);
/** (0008,3010) VR=UI VM=1-n Irradiation Event UID */
export const IrradiationEventUID = new DicomTag(0x0008, 0x3010);
/** (0008,3011) VR=SQ VM=1 Source Irradiation Event Sequence */
export const SourceIrradiationEventSequence = new DicomTag(0x0008, 0x3011);
/** (0008,3012) VR=UI VM=1 Radiopharmaceutical Administration Event UID */
export const RadiopharmaceuticalAdministrationEventUID = new DicomTag(0x0008, 0x3012);
/** (0008,4000) VR=LT VM=1 Identifying Comments (Retired) */
export const IdentifyingComments = new DicomTag(0x0008, 0x4000);
/** (0008,9007) VR=CS VM=4-5 Frame Type */
export const FrameType = new DicomTag(0x0008, 0x9007);
/** (0008,9092) VR=SQ VM=1 Referenced Image Evidence Sequence */
export const ReferencedImageEvidenceSequence = new DicomTag(0x0008, 0x9092);
/** (0008,9121) VR=SQ VM=1 Referenced Raw Data Sequence */
export const ReferencedRawDataSequence = new DicomTag(0x0008, 0x9121);
/** (0008,9123) VR=UI VM=1 Creator-Version UID */
export const CreatorVersionUID = new DicomTag(0x0008, 0x9123);
/** (0008,9124) VR=SQ VM=1 Derivation Image Sequence */
export const DerivationImageSequence = new DicomTag(0x0008, 0x9124);
/** (0008,9154) VR=SQ VM=1 Source Image Evidence Sequence */
export const SourceImageEvidenceSequence = new DicomTag(0x0008, 0x9154);
/** (0008,9205) VR=CS VM=1 Pixel Presentation */
export const PixelPresentation = new DicomTag(0x0008, 0x9205);
/** (0008,9206) VR=CS VM=1 Volumetric Properties */
export const VolumetricProperties = new DicomTag(0x0008, 0x9206);
/** (0008,9207) VR=CS VM=1 Volume Based Calculation Technique */
export const VolumeBasedCalculationTechnique = new DicomTag(0x0008, 0x9207);
/** (0008,9208) VR=CS VM=1 Complex Image Component */
export const ComplexImageComponent = new DicomTag(0x0008, 0x9208);
/** (0008,9209) VR=CS VM=1 Acquisition Contrast */
export const AcquisitionContrast = new DicomTag(0x0008, 0x9209);
/** (0008,9215) VR=SQ VM=1 Derivation Code Sequence */
export const DerivationCodeSequence = new DicomTag(0x0008, 0x9215);
/** (0008,9237) VR=SQ VM=1 Referenced Presentation State Sequence */
export const ReferencedPresentationStateSequence = new DicomTag(0x0008, 0x9237);
/** (0008,9410) VR=SQ VM=1 Referenced Other Plane Sequence */
export const ReferencedOtherPlaneSequence = new DicomTag(0x0008, 0x9410);
/** (0008,9458) VR=SQ VM=1 Frame Display Sequence */
export const FrameDisplaySequence = new DicomTag(0x0008, 0x9458);
/** (0008,9459) VR=FL VM=1 Recommended Display Frame Rate in Float */
export const RecommendedDisplayFrameRateInFloat = new DicomTag(0x0008, 0x9459);
/** (0008,9460) VR=CS VM=1 Skip Frame Range Flag */
export const SkipFrameRangeFlag = new DicomTag(0x0008, 0x9460);
/** (0010,0010) VR=PN VM=1 Patient's Name */
export const PatientName = new DicomTag(0x0010, 0x0010);
/** (0010,0011) VR=SQ VM=1 Person Names to Use Sequence */
export const PersonNamesToUseSequence = new DicomTag(0x0010, 0x0011);
/** (0010,0012) VR=LT VM=1 Name to Use */
export const NameToUse = new DicomTag(0x0010, 0x0012);
/** (0010,0013) VR=UT VM=1 Name to Use Comment */
export const NameToUseComment = new DicomTag(0x0010, 0x0013);
/** (0010,0014) VR=SQ VM=1 Third Person Pronouns Sequence */
export const ThirdPersonPronounsSequence = new DicomTag(0x0010, 0x0014);
/** (0010,0015) VR=SQ VM=1 Pronoun Code Sequence */
export const PronounCodeSequence = new DicomTag(0x0010, 0x0015);
/** (0010,0016) VR=UT VM=1 Pronoun Comment */
export const PronounComment = new DicomTag(0x0010, 0x0016);
/** (0010,0020) VR=LO VM=1 Patient ID */
export const PatientID = new DicomTag(0x0010, 0x0020);
/** (0010,0021) VR=LO VM=1 Issuer of Patient ID */
export const IssuerOfPatientID = new DicomTag(0x0010, 0x0021);
/** (0010,0022) VR=CS VM=1 Type of Patient ID */
export const TypeOfPatientID = new DicomTag(0x0010, 0x0022);
/** (0010,0024) VR=SQ VM=1 Issuer of Patient ID Qualifiers Sequence */
export const IssuerOfPatientIDQualifiersSequence = new DicomTag(0x0010, 0x0024);
/** (0010,0026) VR=SQ VM=1 Source Patient Group Identification Sequence */
export const SourcePatientGroupIdentificationSequence = new DicomTag(0x0010, 0x0026);
/** (0010,0027) VR=SQ VM=1 Group of Patients Identification Sequence */
export const GroupOfPatientsIdentificationSequence = new DicomTag(0x0010, 0x0027);
/** (0010,0028) VR=US VM=3 Subject Relative Position in Image */
export const SubjectRelativePositionInImage = new DicomTag(0x0010, 0x0028);
/** (0010,0030) VR=DA VM=1 Patient's Birth Date */
export const PatientBirthDate = new DicomTag(0x0010, 0x0030);
/** (0010,0032) VR=TM VM=1 Patient's Birth Time */
export const PatientBirthTime = new DicomTag(0x0010, 0x0032);
/** (0010,0033) VR=LO VM=1 Patient's Birth Date in Alternative Calendar */
export const PatientBirthDateInAlternativeCalendar = new DicomTag(0x0010, 0x0033);
/** (0010,0034) VR=LO VM=1 Patient's Death Date in Alternative Calendar */
export const PatientDeathDateInAlternativeCalendar = new DicomTag(0x0010, 0x0034);
/** (0010,0035) VR=CS VM=1 Patient's Alternative Calendar */
export const PatientAlternativeCalendar = new DicomTag(0x0010, 0x0035);
/** (0010,0040) VR=CS VM=1 Patient's Sex */
export const PatientSex = new DicomTag(0x0010, 0x0040);
/** (0010,0041) VR=SQ VM=1 Gender Identity Sequence */
export const GenderIdentitySequence = new DicomTag(0x0010, 0x0041);
/** (0010,0042) VR=UT VM=1 Sex Parameters for Clinical Use Category Comment */
export const SexParametersForClinicalUseCategoryComment = new DicomTag(0x0010, 0x0042);
/** (0010,0043) VR=SQ VM=1 Sex Parameters for Clinical Use Category Sequence */
export const SexParametersForClinicalUseCategorySequence = new DicomTag(0x0010, 0x0043);
/** (0010,0044) VR=SQ VM=1 Gender Identity Code Sequence */
export const GenderIdentityCodeSequence = new DicomTag(0x0010, 0x0044);
/** (0010,0045) VR=UT VM=1 Gender Identity Comment */
export const GenderIdentityComment = new DicomTag(0x0010, 0x0045);
/** (0010,0046) VR=SQ VM=1 Sex Parameters for Clinical Use Category Code Sequence */
export const SexParametersForClinicalUseCategoryCodeSequence = new DicomTag(0x0010, 0x0046);
/** (0010,0047) VR=UR VM=1-n Sex Parameters for Clinical Use Category Reference */
export const SexParametersForClinicalUseCategoryReference = new DicomTag(0x0010, 0x0047);
/** (0010,0050) VR=SQ VM=1 Patient's Insurance Plan Code Sequence */
export const PatientInsurancePlanCodeSequence = new DicomTag(0x0010, 0x0050);
/** (0010,0101) VR=SQ VM=1 Patient's Primary Language Code Sequence */
export const PatientPrimaryLanguageCodeSequence = new DicomTag(0x0010, 0x0101);
/** (0010,0102) VR=SQ VM=1 Patient's Primary Language Modifier Code Sequence */
export const PatientPrimaryLanguageModifierCodeSequence = new DicomTag(0x0010, 0x0102);
/** (0010,0200) VR=CS VM=1 Quality Control Subject */
export const QualityControlSubject = new DicomTag(0x0010, 0x0200);
/** (0010,0201) VR=SQ VM=1 Quality Control Subject Type Code Sequence */
export const QualityControlSubjectTypeCodeSequence = new DicomTag(0x0010, 0x0201);
/** (0010,0212) VR=UC VM=1 Strain Description */
export const StrainDescription = new DicomTag(0x0010, 0x0212);
/** (0010,0213) VR=LO VM=1 Strain Nomenclature */
export const StrainNomenclature = new DicomTag(0x0010, 0x0213);
/** (0010,0214) VR=LO VM=1 Strain Stock Number */
export const StrainStockNumber = new DicomTag(0x0010, 0x0214);
/** (0010,0215) VR=SQ VM=1 Strain Source Registry Code Sequence */
export const StrainSourceRegistryCodeSequence = new DicomTag(0x0010, 0x0215);
/** (0010,0216) VR=SQ VM=1 Strain Stock Sequence */
export const StrainStockSequence = new DicomTag(0x0010, 0x0216);
/** (0010,0217) VR=LO VM=1 Strain Source */
export const StrainSource = new DicomTag(0x0010, 0x0217);
/** (0010,0218) VR=UT VM=1 Strain Additional Information */
export const StrainAdditionalInformation = new DicomTag(0x0010, 0x0218);
/** (0010,0219) VR=SQ VM=1 Strain Code Sequence */
export const StrainCodeSequence = new DicomTag(0x0010, 0x0219);
/** (0010,0221) VR=SQ VM=1 Genetic Modifications Sequence */
export const GeneticModificationsSequence = new DicomTag(0x0010, 0x0221);
/** (0010,0222) VR=UC VM=1 Genetic Modifications Description */
export const GeneticModificationsDescription = new DicomTag(0x0010, 0x0222);
/** (0010,0223) VR=LO VM=1 Genetic Modifications Nomenclature */
export const GeneticModificationsNomenclature = new DicomTag(0x0010, 0x0223);
/** (0010,0229) VR=SQ VM=1 Genetic Modifications Code Sequence */
export const GeneticModificationsCodeSequence = new DicomTag(0x0010, 0x0229);
/** (0010,1000) VR=LO VM=1-n Other Patient IDs (Retired) */
export const OtherPatientIDs = new DicomTag(0x0010, 0x1000);
/** (0010,1001) VR=PN VM=1-n Other Patient Names */
export const OtherPatientNames = new DicomTag(0x0010, 0x1001);
/** (0010,1002) VR=SQ VM=1 Other Patient IDs Sequence */
export const OtherPatientIDsSequence = new DicomTag(0x0010, 0x1002);
/** (0010,1005) VR=PN VM=1 Patient's Birth Name */
export const PatientBirthName = new DicomTag(0x0010, 0x1005);
/** (0010,1010) VR=AS VM=1 Patient's Age */
export const PatientAge = new DicomTag(0x0010, 0x1010);
/** (0010,1020) VR=DS VM=1 Patient's Size */
export const PatientSize = new DicomTag(0x0010, 0x1020);
/** (0010,1021) VR=SQ VM=1 Patient's Size Code Sequence */
export const PatientSizeCodeSequence = new DicomTag(0x0010, 0x1021);
/** (0010,1022) VR=DS VM=1 Patient's Body Mass Index */
export const PatientBodyMassIndex = new DicomTag(0x0010, 0x1022);
/** (0010,1023) VR=DS VM=1 Measured AP Dimension */
export const MeasuredAPDimension = new DicomTag(0x0010, 0x1023);
/** (0010,1024) VR=DS VM=1 Measured Lateral Dimension */
export const MeasuredLateralDimension = new DicomTag(0x0010, 0x1024);
/** (0010,1030) VR=DS VM=1 Patient's Weight */
export const PatientWeight = new DicomTag(0x0010, 0x1030);
/** (0010,1040) VR=LO VM=1 Patient's Address */
export const PatientAddress = new DicomTag(0x0010, 0x1040);
/** (0010,1050) VR=LO VM=1-n Insurance Plan Identification (Retired) */
export const InsurancePlanIdentification = new DicomTag(0x0010, 0x1050);
/** (0010,1060) VR=PN VM=1 Patient's Mother's Birth Name */
export const PatientMotherBirthName = new DicomTag(0x0010, 0x1060);
/** (0010,1080) VR=LO VM=1 Military Rank */
export const MilitaryRank = new DicomTag(0x0010, 0x1080);
/** (0010,1081) VR=LO VM=1 Branch of Service */
export const BranchOfService = new DicomTag(0x0010, 0x1081);
/** (0010,1090) VR=LO VM=1 Medical Record Locator (Retired) */
export const MedicalRecordLocator = new DicomTag(0x0010, 0x1090);
/** (0010,1100) VR=SQ VM=1 Referenced Patient Photo Sequence */
export const ReferencedPatientPhotoSequence = new DicomTag(0x0010, 0x1100);
/** (0010,2000) VR=LO VM=1-n Medical Alerts */
export const MedicalAlerts = new DicomTag(0x0010, 0x2000);
/** (0010,2110) VR=LO VM=1-n Allergies */
export const Allergies = new DicomTag(0x0010, 0x2110);
/** (0010,2150) VR=LO VM=1 Country of Residence */
export const CountryOfResidence = new DicomTag(0x0010, 0x2150);
/** (0010,2152) VR=LO VM=1 Region of Residence */
export const RegionOfResidence = new DicomTag(0x0010, 0x2152);
/** (0010,2154) VR=SH VM=1-n Patient's Telephone Numbers */
export const PatientTelephoneNumbers = new DicomTag(0x0010, 0x2154);
/** (0010,2155) VR=LT VM=1 Patient's Telecom Information */
export const PatientTelecomInformation = new DicomTag(0x0010, 0x2155);
/** (0010,2160) VR=SH VM=1 Ethnic Group (Retired) */
export const EthnicGroup = new DicomTag(0x0010, 0x2160);
/** (0010,2161) VR=SQ VM=1 Ethnic Group Code Sequence */
export const EthnicGroupCodeSequence = new DicomTag(0x0010, 0x2161);
/** (0010,2162) VR=UC VM=1-n Ethnic Groups */
export const EthnicGroups = new DicomTag(0x0010, 0x2162);
/** (0010,2180) VR=SH VM=1 Occupation */
export const Occupation = new DicomTag(0x0010, 0x2180);
/** (0010,21A0) VR=CS VM=1 Smoking Status */
export const SmokingStatus = new DicomTag(0x0010, 0x21A0);
/** (0010,21B0) VR=LT VM=1 Additional Patient History */
export const AdditionalPatientHistory = new DicomTag(0x0010, 0x21B0);
/** (0010,21C0) VR=US VM=1 Pregnancy Status */
export const PregnancyStatus = new DicomTag(0x0010, 0x21C0);
/** (0010,21D0) VR=DA VM=1 Last Menstrual Date */
export const LastMenstrualDate = new DicomTag(0x0010, 0x21D0);
/** (0010,21F0) VR=LO VM=1 Patient's Religious Preference */
export const PatientReligiousPreference = new DicomTag(0x0010, 0x21F0);
/** (0010,2201) VR=LO VM=1 Patient Species Description */
export const PatientSpeciesDescription = new DicomTag(0x0010, 0x2201);
/** (0010,2202) VR=SQ VM=1 Patient Species Code Sequence */
export const PatientSpeciesCodeSequence = new DicomTag(0x0010, 0x2202);
/** (0010,2203) VR=CS VM=1 Patient's Sex Neutered */
export const PatientSexNeutered = new DicomTag(0x0010, 0x2203);
/** (0010,2210) VR=CS VM=1 Anatomical Orientation Type */
export const AnatomicalOrientationType = new DicomTag(0x0010, 0x2210);
/** (0010,2292) VR=LO VM=1 Patient Breed Description */
export const PatientBreedDescription = new DicomTag(0x0010, 0x2292);
/** (0010,2293) VR=SQ VM=1 Patient Breed Code Sequence */
export const PatientBreedCodeSequence = new DicomTag(0x0010, 0x2293);
/** (0010,2294) VR=SQ VM=1 Breed Registration Sequence */
export const BreedRegistrationSequence = new DicomTag(0x0010, 0x2294);
/** (0010,2295) VR=LO VM=1 Breed Registration Number */
export const BreedRegistrationNumber = new DicomTag(0x0010, 0x2295);
/** (0010,2296) VR=SQ VM=1 Breed Registry Code Sequence */
export const BreedRegistryCodeSequence = new DicomTag(0x0010, 0x2296);
/** (0010,2297) VR=PN VM=1 Responsible Person */
export const ResponsiblePerson = new DicomTag(0x0010, 0x2297);
/** (0010,2298) VR=CS VM=1 Responsible Person Role */
export const ResponsiblePersonRole = new DicomTag(0x0010, 0x2298);
/** (0010,2299) VR=LO VM=1 Responsible Organization */
export const ResponsibleOrganization = new DicomTag(0x0010, 0x2299);
/** (0010,4000) VR=LT VM=1 Patient Comments */
export const PatientComments = new DicomTag(0x0010, 0x4000);
/** (0010,9431) VR=FL VM=1 Examined Body Thickness */
export const ExaminedBodyThickness = new DicomTag(0x0010, 0x9431);
/** (0012,0010) VR=LO VM=1 Clinical Trial Sponsor Name */
export const ClinicalTrialSponsorName = new DicomTag(0x0012, 0x0010);
/** (0012,0020) VR=LO VM=1 Clinical Trial Protocol ID */
export const ClinicalTrialProtocolID = new DicomTag(0x0012, 0x0020);
/** (0012,0021) VR=LO VM=1 Clinical Trial Protocol Name */
export const ClinicalTrialProtocolName = new DicomTag(0x0012, 0x0021);
/** (0012,0022) VR=LO VM=1 Issuer of Clinical Trial Protocol ID */
export const IssuerOfClinicalTrialProtocolID = new DicomTag(0x0012, 0x0022);
/** (0012,0023) VR=SQ VM=1 Other Clinical Trial Protocol IDs Sequence */
export const OtherClinicalTrialProtocolIDsSequence = new DicomTag(0x0012, 0x0023);
/** (0012,0030) VR=LO VM=1 Clinical Trial Site ID */
export const ClinicalTrialSiteID = new DicomTag(0x0012, 0x0030);
/** (0012,0031) VR=LO VM=1 Clinical Trial Site Name */
export const ClinicalTrialSiteName = new DicomTag(0x0012, 0x0031);
/** (0012,0032) VR=LO VM=1 Issuer of Clinical Trial Site ID */
export const IssuerOfClinicalTrialSiteID = new DicomTag(0x0012, 0x0032);
/** (0012,0040) VR=LO VM=1 Clinical Trial Subject ID */
export const ClinicalTrialSubjectID = new DicomTag(0x0012, 0x0040);
/** (0012,0041) VR=LO VM=1 Issuer of Clinical Trial Subject ID */
export const IssuerOfClinicalTrialSubjectID = new DicomTag(0x0012, 0x0041);
/** (0012,0042) VR=LO VM=1 Clinical Trial Subject Reading ID */
export const ClinicalTrialSubjectReadingID = new DicomTag(0x0012, 0x0042);
/** (0012,0043) VR=LO VM=1 Issuer of Clinical Trial Subject Reading ID */
export const IssuerOfClinicalTrialSubjectReadingID = new DicomTag(0x0012, 0x0043);
/** (0012,0050) VR=LO VM=1 Clinical Trial Time Point ID */
export const ClinicalTrialTimePointID = new DicomTag(0x0012, 0x0050);
/** (0012,0051) VR=ST VM=1 Clinical Trial Time Point Description */
export const ClinicalTrialTimePointDescription = new DicomTag(0x0012, 0x0051);
/** (0012,0052) VR=FD VM=1 Longitudinal Temporal Offset from Event */
export const LongitudinalTemporalOffsetFromEvent = new DicomTag(0x0012, 0x0052);
/** (0012,0053) VR=CS VM=1 Longitudinal Temporal Event Type */
export const LongitudinalTemporalEventType = new DicomTag(0x0012, 0x0053);
/** (0012,0054) VR=SQ VM=1 Clinical Trial Time Point Type Code Sequence */
export const ClinicalTrialTimePointTypeCodeSequence = new DicomTag(0x0012, 0x0054);
/** (0012,0055) VR=LO VM=1 Issuer of Clinical Trial Time Point ID */
export const IssuerOfClinicalTrialTimePointID = new DicomTag(0x0012, 0x0055);
/** (0012,0060) VR=LO VM=1 Clinical Trial Coordinating Center Name */
export const ClinicalTrialCoordinatingCenterName = new DicomTag(0x0012, 0x0060);
/** (0012,0062) VR=CS VM=1 Patient Identity Removed */
export const PatientIdentityRemoved = new DicomTag(0x0012, 0x0062);
/** (0012,0063) VR=LO VM=1-n De-identification Method */
export const DeidentificationMethod = new DicomTag(0x0012, 0x0063);
/** (0012,0064) VR=SQ VM=1 De-identification Method Code Sequence */
export const DeidentificationMethodCodeSequence = new DicomTag(0x0012, 0x0064);
/** (0012,0071) VR=LO VM=1 Clinical Trial Series ID */
export const ClinicalTrialSeriesID = new DicomTag(0x0012, 0x0071);
/** (0012,0072) VR=LO VM=1 Clinical Trial Series Description */
export const ClinicalTrialSeriesDescription = new DicomTag(0x0012, 0x0072);
/** (0012,0073) VR=LO VM=1 Issuer of Clinical Trial Series ID */
export const IssuerOfClinicalTrialSeriesID = new DicomTag(0x0012, 0x0073);
/** (0012,0081) VR=LO VM=1 Clinical Trial Protocol Ethics Committee Name */
export const ClinicalTrialProtocolEthicsCommitteeName = new DicomTag(0x0012, 0x0081);
/** (0012,0082) VR=LO VM=1 Clinical Trial Protocol Ethics Committee Approval Number */
export const ClinicalTrialProtocolEthicsCommitteeApprovalNumber = new DicomTag(0x0012, 0x0082);
/** (0012,0083) VR=SQ VM=1 Consent for Clinical Trial Use Sequence */
export const ConsentForClinicalTrialUseSequence = new DicomTag(0x0012, 0x0083);
/** (0012,0084) VR=CS VM=1 Distribution Type */
export const DistributionType = new DicomTag(0x0012, 0x0084);
/** (0012,0085) VR=CS VM=1 Consent for Distribution Flag */
export const ConsentForDistributionFlag = new DicomTag(0x0012, 0x0085);
/** (0012,0086) VR=DA VM=1 Ethics Committee Approval Effectiveness Start Date */
export const EthicsCommitteeApprovalEffectivenessStartDate = new DicomTag(0x0012, 0x0086);
/** (0012,0087) VR=DA VM=1 Ethics Committee Approval Effectiveness End Date */
export const EthicsCommitteeApprovalEffectivenessEndDate = new DicomTag(0x0012, 0x0087);
/** (0014,0023) VR=ST VM=1 CAD File Format (Retired) */
export const CADFileFormat = new DicomTag(0x0014, 0x0023);
/** (0014,0024) VR=ST VM=1 Component Reference System (Retired) */
export const ComponentReferenceSystem = new DicomTag(0x0014, 0x0024);
/** (0014,0025) VR=ST VM=1 Component Manufacturing Procedure */
export const ComponentManufacturingProcedure = new DicomTag(0x0014, 0x0025);
/** (0014,0028) VR=ST VM=1 Component Manufacturer */
export const ComponentManufacturer = new DicomTag(0x0014, 0x0028);
/** (0014,0030) VR=DS VM=1-n Material Thickness */
export const MaterialThickness = new DicomTag(0x0014, 0x0030);
/** (0014,0032) VR=DS VM=1-n Material Pipe Diameter */
export const MaterialPipeDiameter = new DicomTag(0x0014, 0x0032);
/** (0014,0034) VR=DS VM=1-n Material Isolation Diameter */
export const MaterialIsolationDiameter = new DicomTag(0x0014, 0x0034);
/** (0014,0042) VR=ST VM=1 Material Grade */
export const MaterialGrade = new DicomTag(0x0014, 0x0042);
/** (0014,0044) VR=ST VM=1 Material Properties Description */
export const MaterialPropertiesDescription = new DicomTag(0x0014, 0x0044);
/** (0014,0045) VR=ST VM=1 Material Properties File Format (Retired) (Retired) */
export const MaterialPropertiesFileFormatRetired = new DicomTag(0x0014, 0x0045);
/** (0014,0046) VR=LT VM=1 Material Notes */
export const MaterialNotes = new DicomTag(0x0014, 0x0046);
/** (0014,0050) VR=CS VM=1 Component Shape */
export const ComponentShape = new DicomTag(0x0014, 0x0050);
/** (0014,0052) VR=CS VM=1 Curvature Type */
export const CurvatureType = new DicomTag(0x0014, 0x0052);
/** (0014,0054) VR=DS VM=1 Outer Diameter */
export const OuterDiameter = new DicomTag(0x0014, 0x0054);
/** (0014,0056) VR=DS VM=1 Inner Diameter */
export const InnerDiameter = new DicomTag(0x0014, 0x0056);
/** (0014,0100) VR=LO VM=1-n Component Welder IDs */
export const ComponentWelderIDs = new DicomTag(0x0014, 0x0100);
/** (0014,0101) VR=CS VM=1 Secondary Approval Status */
export const SecondaryApprovalStatus = new DicomTag(0x0014, 0x0101);
/** (0014,0102) VR=DA VM=1 Secondary Review Date */
export const SecondaryReviewDate = new DicomTag(0x0014, 0x0102);
/** (0014,0103) VR=TM VM=1 Secondary Review Time */
export const SecondaryReviewTime = new DicomTag(0x0014, 0x0103);
/** (0014,0104) VR=PN VM=1 Secondary Reviewer Name */
export const SecondaryReviewerName = new DicomTag(0x0014, 0x0104);
/** (0014,0105) VR=ST VM=1 Repair ID */
export const RepairID = new DicomTag(0x0014, 0x0105);
/** (0014,0106) VR=SQ VM=1 Multiple Component Approval Sequence */
export const MultipleComponentApprovalSequence = new DicomTag(0x0014, 0x0106);
/** (0014,0107) VR=CS VM=1-n Other Approval Status */
export const OtherApprovalStatus = new DicomTag(0x0014, 0x0107);
/** (0014,0108) VR=CS VM=1-n Other Secondary Approval Status */
export const OtherSecondaryApprovalStatus = new DicomTag(0x0014, 0x0108);
/** (0014,0200) VR=SQ VM=1 Data Element Label Sequence */
export const DataElementLabelSequence = new DicomTag(0x0014, 0x0200);
/** (0014,0201) VR=SQ VM=1 Data Element Label Item Sequence */
export const DataElementLabelItemSequence = new DicomTag(0x0014, 0x0201);
/** (0014,0202) VR=AT VM=1 Data Element */
export const DataElement = new DicomTag(0x0014, 0x0202);
/** (0014,0203) VR=LO VM=1 Data Element Name */
export const DataElementName = new DicomTag(0x0014, 0x0203);
/** (0014,0204) VR=LO VM=1 Data Element Description */
export const DataElementDescription = new DicomTag(0x0014, 0x0204);
/** (0014,0205) VR=CS VM=1 Data Element Conditionality */
export const DataElementConditionality = new DicomTag(0x0014, 0x0205);
/** (0014,0206) VR=IS VM=1 Data Element Minimum Characters */
export const DataElementMinimumCharacters = new DicomTag(0x0014, 0x0206);
/** (0014,0207) VR=IS VM=1 Data Element Maximum Characters */
export const DataElementMaximumCharacters = new DicomTag(0x0014, 0x0207);
/** (0014,1010) VR=ST VM=1 Actual Environmental Conditions */
export const ActualEnvironmentalConditions = new DicomTag(0x0014, 0x1010);
/** (0014,1020) VR=DA VM=1 Expiry Date */
export const ExpiryDate = new DicomTag(0x0014, 0x1020);
/** (0014,1040) VR=ST VM=1 Environmental Conditions */
export const EnvironmentalConditions = new DicomTag(0x0014, 0x1040);
/** (0014,2002) VR=SQ VM=1 Evaluator Sequence */
export const EvaluatorSequence = new DicomTag(0x0014, 0x2002);
/** (0014,2004) VR=IS VM=1 Evaluator Number */
export const EvaluatorNumber = new DicomTag(0x0014, 0x2004);
/** (0014,2006) VR=PN VM=1 Evaluator Name */
export const EvaluatorName = new DicomTag(0x0014, 0x2006);
/** (0014,2008) VR=IS VM=1 Evaluation Attempt */
export const EvaluationAttempt = new DicomTag(0x0014, 0x2008);
/** (0014,2012) VR=SQ VM=1 Indication Sequence */
export const IndicationSequence = new DicomTag(0x0014, 0x2012);
/** (0014,2014) VR=IS VM=1 Indication Number */
export const IndicationNumber = new DicomTag(0x0014, 0x2014);
/** (0014,2016) VR=SH VM=1 Indication Label */
export const IndicationLabel = new DicomTag(0x0014, 0x2016);
/** (0014,2018) VR=ST VM=1 Indication Description */
export const IndicationDescription = new DicomTag(0x0014, 0x2018);
/** (0014,201A) VR=CS VM=1-n Indication Type */
export const IndicationType = new DicomTag(0x0014, 0x201A);
/** (0014,201C) VR=CS VM=1 Indication Disposition */
export const IndicationDisposition = new DicomTag(0x0014, 0x201C);
/** (0014,201E) VR=SQ VM=1 Indication ROI Sequence */
export const IndicationROISequence = new DicomTag(0x0014, 0x201E);
/** (0014,2030) VR=SQ VM=1 Indication Physical Property Sequence */
export const IndicationPhysicalPropertySequence = new DicomTag(0x0014, 0x2030);
/** (0014,2032) VR=SH VM=1 Property Label */
export const PropertyLabel = new DicomTag(0x0014, 0x2032);
/** (0014,2202) VR=IS VM=1 Coordinate System Number of Axes */
export const CoordinateSystemNumberOfAxes = new DicomTag(0x0014, 0x2202);
/** (0014,2204) VR=SQ VM=1 Coordinate System Axes Sequence */
export const CoordinateSystemAxesSequence = new DicomTag(0x0014, 0x2204);
/** (0014,2206) VR=ST VM=1 Coordinate System Axis Description */
export const CoordinateSystemAxisDescription = new DicomTag(0x0014, 0x2206);
/** (0014,2208) VR=CS VM=1 Coordinate System Data Set Mapping */
export const CoordinateSystemDataSetMapping = new DicomTag(0x0014, 0x2208);
/** (0014,220A) VR=IS VM=1 Coordinate System Axis Number */
export const CoordinateSystemAxisNumber = new DicomTag(0x0014, 0x220A);
/** (0014,220C) VR=CS VM=1 Coordinate System Axis Type */
export const CoordinateSystemAxisType = new DicomTag(0x0014, 0x220C);
/** (0014,220E) VR=CS VM=1 Coordinate System Axis Units */
export const CoordinateSystemAxisUnits = new DicomTag(0x0014, 0x220E);
/** (0014,2210) VR=OB VM=1 Coordinate System Axis Values */
export const CoordinateSystemAxisValues = new DicomTag(0x0014, 0x2210);
/** (0014,2220) VR=SQ VM=1 Coordinate System Transform Sequence */
export const CoordinateSystemTransformSequence = new DicomTag(0x0014, 0x2220);
/** (0014,2222) VR=ST VM=1 Transform Description */
export const TransformDescription = new DicomTag(0x0014, 0x2222);
/** (0014,2224) VR=IS VM=1 Transform Number of Axes */
export const TransformNumberOfAxes = new DicomTag(0x0014, 0x2224);
/** (0014,2226) VR=IS VM=1-n Transform Order of Axes */
export const TransformOrderOfAxes = new DicomTag(0x0014, 0x2226);
/** (0014,2228) VR=CS VM=1 Transformed Axis Units */
export const TransformedAxisUnits = new DicomTag(0x0014, 0x2228);
/** (0014,222A) VR=DS VM=1-n Coordinate System Transform Rotation and Scale Matrix */
export const CoordinateSystemTransformRotationAndScaleMatrix = new DicomTag(0x0014, 0x222A);
/** (0014,222C) VR=DS VM=1-n Coordinate System Transform Translation Matrix */
export const CoordinateSystemTransformTranslationMatrix = new DicomTag(0x0014, 0x222C);
/** (0014,3011) VR=DS VM=1 Internal Detector Frame Time */
export const InternalDetectorFrameTime = new DicomTag(0x0014, 0x3011);
/** (0014,3012) VR=DS VM=1 Number of Frames Integrated */
export const NumberOfFramesIntegrated = new DicomTag(0x0014, 0x3012);
/** (0014,3020) VR=SQ VM=1 Detector Temperature Sequence */
export const DetectorTemperatureSequence = new DicomTag(0x0014, 0x3020);
/** (0014,3022) VR=ST VM=1 Sensor Name */
export const SensorName = new DicomTag(0x0014, 0x3022);
/** (0014,3024) VR=DS VM=1 Horizontal Offset of Sensor */
export const HorizontalOffsetOfSensor = new DicomTag(0x0014, 0x3024);
/** (0014,3026) VR=DS VM=1 Vertical Offset of Sensor */
export const VerticalOffsetOfSensor = new DicomTag(0x0014, 0x3026);
/** (0014,3028) VR=DS VM=1 Sensor Temperature */
export const SensorTemperature = new DicomTag(0x0014, 0x3028);
/** (0014,3040) VR=SQ VM=1 Dark Current Sequence */
export const DarkCurrentSequence = new DicomTag(0x0014, 0x3040);
/** (0014,3050) VR=OB/OW VM=1 Dark Current Counts */
export const DarkCurrentCounts = new DicomTag(0x0014, 0x3050);
/** (0014,3060) VR=SQ VM=1 Gain Correction Reference Sequence */
export const GainCorrectionReferenceSequence = new DicomTag(0x0014, 0x3060);
/** (0014,3070) VR=OB/OW VM=1 Air Counts */
export const AirCounts = new DicomTag(0x0014, 0x3070);
/** (0014,3071) VR=DS VM=1 KV Used in Gain Calibration */
export const KVUsedInGainCalibration = new DicomTag(0x0014, 0x3071);
/** (0014,3072) VR=DS VM=1 MA Used in Gain Calibration */
export const MAUsedInGainCalibration = new DicomTag(0x0014, 0x3072);
/** (0014,3073) VR=DS VM=1 Number of Frames Used for Integration */
export const NumberOfFramesUsedForIntegration = new DicomTag(0x0014, 0x3073);
/** (0014,3074) VR=LO VM=1 Filter Material Used in Gain Calibration */
export const FilterMaterialUsedInGainCalibration = new DicomTag(0x0014, 0x3074);
/** (0014,3075) VR=DS VM=1 Filter Thickness Used in Gain Calibration */
export const FilterThicknessUsedInGainCalibration = new DicomTag(0x0014, 0x3075);
/** (0014,3076) VR=DA VM=1 Date of Gain Calibration */
export const DateOfGainCalibration = new DicomTag(0x0014, 0x3076);
/** (0014,3077) VR=TM VM=1 Time of Gain Calibration */
export const TimeOfGainCalibration = new DicomTag(0x0014, 0x3077);
/** (0014,3080) VR=OB VM=1 Bad Pixel Image */
export const BadPixelImage = new DicomTag(0x0014, 0x3080);
/** (0014,3099) VR=LT VM=1 Calibration Notes */
export const CalibrationNotes = new DicomTag(0x0014, 0x3099);
/** (0014,3100) VR=LT VM=1 Linearity Correction Technique */
export const LinearityCorrectionTechnique = new DicomTag(0x0014, 0x3100);
/** (0014,3101) VR=LT VM=1 Beam Hardening Correction Technique */
export const BeamHardeningCorrectionTechnique = new DicomTag(0x0014, 0x3101);
/** (0014,4002) VR=SQ VM=1 Pulser Equipment Sequence */
export const PulserEquipmentSequence = new DicomTag(0x0014, 0x4002);
/** (0014,4004) VR=CS VM=1 Pulser Type */
export const PulserType = new DicomTag(0x0014, 0x4004);
/** (0014,4006) VR=LT VM=1 Pulser Notes */
export const PulserNotes = new DicomTag(0x0014, 0x4006);
/** (0014,4008) VR=SQ VM=1 Receiver Equipment Sequence */
export const ReceiverEquipmentSequence = new DicomTag(0x0014, 0x4008);
/** (0014,400A) VR=CS VM=1 Amplifier Type */
export const AmplifierType = new DicomTag(0x0014, 0x400A);
/** (0014,400C) VR=LT VM=1 Receiver Notes */
export const ReceiverNotes = new DicomTag(0x0014, 0x400C);
/** (0014,400E) VR=SQ VM=1 Pre-Amplifier Equipment Sequence */
export const PreAmplifierEquipmentSequence = new DicomTag(0x0014, 0x400E);
/** (0014,400F) VR=LT VM=1 Pre-Amplifier Notes */
export const PreAmplifierNotes = new DicomTag(0x0014, 0x400F);
/** (0014,4010) VR=SQ VM=1 Transmit Transducer Sequence */
export const TransmitTransducerSequence = new DicomTag(0x0014, 0x4010);
/** (0014,4011) VR=SQ VM=1 Receive Transducer Sequence */
export const ReceiveTransducerSequence = new DicomTag(0x0014, 0x4011);
/** (0014,4012) VR=US VM=1 Number of Elements */
export const NumberOfElements = new DicomTag(0x0014, 0x4012);
/** (0014,4013) VR=CS VM=1 Element Shape */
export const ElementShape = new DicomTag(0x0014, 0x4013);
/** (0014,4014) VR=DS VM=1 Element Dimension A */
export const ElementDimensionA = new DicomTag(0x0014, 0x4014);
/** (0014,4015) VR=DS VM=1 Element Dimension B */
export const ElementDimensionB = new DicomTag(0x0014, 0x4015);
/** (0014,4016) VR=DS VM=1 Element Pitch A */
export const ElementPitchA = new DicomTag(0x0014, 0x4016);
/** (0014,4017) VR=DS VM=1 Measured Beam Dimension A */
export const MeasuredBeamDimensionA = new DicomTag(0x0014, 0x4017);
/** (0014,4018) VR=DS VM=1 Measured Beam Dimension B */
export const MeasuredBeamDimensionB = new DicomTag(0x0014, 0x4018);
/** (0014,4019) VR=DS VM=1 Location of Measured Beam Diameter */
export const LocationOfMeasuredBeamDiameter = new DicomTag(0x0014, 0x4019);
/** (0014,401A) VR=DS VM=1 Nominal Frequency */
export const NominalFrequency = new DicomTag(0x0014, 0x401A);
/** (0014,401B) VR=DS VM=1 Measured Center Frequency */
export const MeasuredCenterFrequency = new DicomTag(0x0014, 0x401B);
/** (0014,401C) VR=DS VM=1 Measured Bandwidth */
export const MeasuredBandwidth = new DicomTag(0x0014, 0x401C);
/** (0014,401D) VR=DS VM=1 Element Pitch B */
export const ElementPitchB = new DicomTag(0x0014, 0x401D);
/** (0014,4020) VR=SQ VM=1 Pulser Settings Sequence */
export const PulserSettingsSequence = new DicomTag(0x0014, 0x4020);
/** (0014,4022) VR=DS VM=1 Pulse Width */
export const PulseWidth = new DicomTag(0x0014, 0x4022);
/** (0014,4024) VR=DS VM=1 Excitation Frequency */
export const ExcitationFrequency = new DicomTag(0x0014, 0x4024);
/** (0014,4026) VR=CS VM=1 Modulation Type */
export const ModulationType = new DicomTag(0x0014, 0x4026);
/** (0014,4028) VR=DS VM=1 Damping */
export const Damping = new DicomTag(0x0014, 0x4028);
/** (0014,4030) VR=SQ VM=1 Receiver Settings Sequence */
export const ReceiverSettingsSequence = new DicomTag(0x0014, 0x4030);
/** (0014,4031) VR=DS VM=1 Acquired Soundpath Length */
export const AcquiredSoundpathLength = new DicomTag(0x0014, 0x4031);
/** (0014,4032) VR=CS VM=1 Acquisition Compression Type */
export const AcquisitionCompressionType = new DicomTag(0x0014, 0x4032);
/** (0014,4033) VR=IS VM=1 Acquisition Sample Size */
export const AcquisitionSampleSize = new DicomTag(0x0014, 0x4033);
/** (0014,4034) VR=DS VM=1 Rectifier Smoothing */
export const RectifierSmoothing = new DicomTag(0x0014, 0x4034);
/** (0014,4035) VR=SQ VM=1 DAC Sequence */
export const DACSequence = new DicomTag(0x0014, 0x4035);
/** (0014,4036) VR=CS VM=1 DAC Type */
export const DACType = new DicomTag(0x0014, 0x4036);
/** (0014,4038) VR=DS VM=1-n DAC Gain Points */
export const DACGainPoints = new DicomTag(0x0014, 0x4038);
/** (0014,403A) VR=DS VM=1-n DAC Time Points */
export const DACTimePoints = new DicomTag(0x0014, 0x403A);
/** (0014,403C) VR=DS VM=1-n DAC Amplitude */
export const DACAmplitude = new DicomTag(0x0014, 0x403C);
/** (0014,4040) VR=SQ VM=1 Pre-Amplifier Settings Sequence */
export const PreAmplifierSettingsSequence = new DicomTag(0x0014, 0x4040);
/** (0014,4050) VR=SQ VM=1 Transmit Transducer Settings Sequence */
export const TransmitTransducerSettingsSequence = new DicomTag(0x0014, 0x4050);
/** (0014,4051) VR=SQ VM=1 Receive Transducer Settings Sequence */
export const ReceiveTransducerSettingsSequence = new DicomTag(0x0014, 0x4051);
/** (0014,4052) VR=DS VM=1 Incident Angle */
export const IncidentAngle = new DicomTag(0x0014, 0x4052);
/** (0014,4054) VR=ST VM=1 Coupling Technique */
export const CouplingTechnique = new DicomTag(0x0014, 0x4054);
/** (0014,4056) VR=ST VM=1 Coupling Medium */
export const CouplingMedium = new DicomTag(0x0014, 0x4056);
/** (0014,4057) VR=DS VM=1 Coupling Velocity */
export const CouplingVelocity = new DicomTag(0x0014, 0x4057);
/** (0014,4058) VR=DS VM=1 Probe Center Location X */
export const ProbeCenterLocationX = new DicomTag(0x0014, 0x4058);
/** (0014,4059) VR=DS VM=1 Probe Center Location Z */
export const ProbeCenterLocationZ = new DicomTag(0x0014, 0x4059);
/** (0014,405A) VR=DS VM=1 Sound Path Length */
export const SoundPathLength = new DicomTag(0x0014, 0x405A);
/** (0014,405C) VR=ST VM=1 Delay Law Identifier */
export const DelayLawIdentifier = new DicomTag(0x0014, 0x405C);
/** (0014,4060) VR=SQ VM=1 Gate Settings Sequence */
export const GateSettingsSequence = new DicomTag(0x0014, 0x4060);
/** (0014,4062) VR=DS VM=1 Gate Threshold */
export const GateThreshold = new DicomTag(0x0014, 0x4062);
/** (0014,4064) VR=DS VM=1 Velocity of Sound */
export const VelocityOfSound = new DicomTag(0x0014, 0x4064);
/** (0014,4070) VR=SQ VM=1 Calibration Settings Sequence */
export const CalibrationSettingsSequence = new DicomTag(0x0014, 0x4070);
/** (0014,4072) VR=ST VM=1 Calibration Procedure */
export const CalibrationProcedure = new DicomTag(0x0014, 0x4072);
/** (0014,4074) VR=SH VM=1 Procedure Version */
export const ProcedureVersion = new DicomTag(0x0014, 0x4074);
/** (0014,4076) VR=DA VM=1 Procedure Creation Date */
export const ProcedureCreationDate = new DicomTag(0x0014, 0x4076);
/** (0014,4078) VR=DA VM=1 Procedure Expiration Date */
export const ProcedureExpirationDate = new DicomTag(0x0014, 0x4078);
/** (0014,407A) VR=DA VM=1 Procedure Last Modified Date */
export const ProcedureLastModifiedDate = new DicomTag(0x0014, 0x407A);
/** (0014,407C) VR=TM VM=1-n Calibration Time */
export const CalibrationTime = new DicomTag(0x0014, 0x407C);
/** (0014,407E) VR=DA VM=1-n Calibration Date */
export const CalibrationDate = new DicomTag(0x0014, 0x407E);
/** (0014,4080) VR=SQ VM=1 Probe Drive Equipment Sequence */
export const ProbeDriveEquipmentSequence = new DicomTag(0x0014, 0x4080);
/** (0014,4081) VR=CS VM=1 Drive Type */
export const DriveType = new DicomTag(0x0014, 0x4081);
/** (0014,4082) VR=LT VM=1 Probe Drive Notes */
export const ProbeDriveNotes = new DicomTag(0x0014, 0x4082);
/** (0014,4083) VR=SQ VM=1 Drive Probe Sequence */
export const DriveProbeSequence = new DicomTag(0x0014, 0x4083);
/** (0014,4084) VR=DS VM=1 Probe Inductance */
export const ProbeInductance = new DicomTag(0x0014, 0x4084);
/** (0014,4085) VR=DS VM=1 Probe Resistance */
export const ProbeResistance = new DicomTag(0x0014, 0x4085);
/** (0014,4086) VR=SQ VM=1 Receive Probe Sequence */
export const ReceiveProbeSequence = new DicomTag(0x0014, 0x4086);
/** (0014,4087) VR=SQ VM=1 Probe Drive Settings Sequence */
export const ProbeDriveSettingsSequence = new DicomTag(0x0014, 0x4087);
/** (0014,4088) VR=DS VM=1 Bridge Resistors */
export const BridgeResistors = new DicomTag(0x0014, 0x4088);
/** (0014,4089) VR=DS VM=1 Probe Orientation Angle */
export const ProbeOrientationAngle = new DicomTag(0x0014, 0x4089);
/** (0014,408B) VR=DS VM=1 User Selected Gain Y */
export const UserSelectedGainY = new DicomTag(0x0014, 0x408B);
/** (0014,408C) VR=DS VM=1 User Selected Phase */
export const UserSelectedPhase = new DicomTag(0x0014, 0x408C);
/** (0014,408D) VR=DS VM=1 User Selected Offset X */
export const UserSelectedOffsetX = new DicomTag(0x0014, 0x408D);
/** (0014,408E) VR=DS VM=1 User Selected Offset Y */
export const UserSelectedOffsetY = new DicomTag(0x0014, 0x408E);
/** (0014,4091) VR=SQ VM=1 Channel Settings Sequence */
export const ChannelSettingsSequence = new DicomTag(0x0014, 0x4091);
/** (0014,4092) VR=DS VM=1 Channel Threshold */
export const ChannelThreshold = new DicomTag(0x0014, 0x4092);
/** (0014,409A) VR=SQ VM=1 Scanner Settings Sequence */
export const ScannerSettingsSequence = new DicomTag(0x0014, 0x409A);
/** (0014,409B) VR=ST VM=1 Scan Procedure */
export const ScanProcedure = new DicomTag(0x0014, 0x409B);
/** (0014,409C) VR=DS VM=1 Translation Rate X */
export const TranslationRateX = new DicomTag(0x0014, 0x409C);
/** (0014,409D) VR=DS VM=1 Translation Rate Y */
export const TranslationRateY = new DicomTag(0x0014, 0x409D);
/** (0014,409F) VR=DS VM=1 Channel Overlap */
export const ChannelOverlap = new DicomTag(0x0014, 0x409F);
/** (0014,40A0) VR=LO VM=1-n Image Quality Indicator Type */
export const ImageQualityIndicatorType = new DicomTag(0x0014, 0x40A0);
/** (0014,40A1) VR=LO VM=1-n Image Quality Indicator Material */
export const ImageQualityIndicatorMaterial = new DicomTag(0x0014, 0x40A1);
/** (0014,40A2) VR=LO VM=1-n Image Quality Indicator Size */
export const ImageQualityIndicatorSize = new DicomTag(0x0014, 0x40A2);
/** (0014,4101) VR=SQ VM=1 Wave Dimensions Definition Sequence */
export const WaveDimensionsDefinitionSequence = new DicomTag(0x0014, 0x4101);
/** (0014,4102) VR=US VM=1 Wave Dimension Number */
export const WaveDimensionNumber = new DicomTag(0x0014, 0x4102);
/** (0014,4103) VR=LO VM=1 Wave Dimension Description */
export const WaveDimensionDescription = new DicomTag(0x0014, 0x4103);
/** (0014,4104) VR=US VM=1 Wave Dimension Unit */
export const WaveDimensionUnit = new DicomTag(0x0014, 0x4104);
/** (0014,4105) VR=CS VM=1 Wave Dimension Value Type */
export const WaveDimensionValueType = new DicomTag(0x0014, 0x4105);
/** (0014,4106) VR=SQ VM=1-n Wave Dimension Values Sequence */
export const WaveDimensionValuesSequence = new DicomTag(0x0014, 0x4106);
/** (0014,4107) VR=US VM=1 Referenced Wave Dimension */
export const ReferencedWaveDimension = new DicomTag(0x0014, 0x4107);
/** (0014,4108) VR=SL VM=1 Integer Numeric Value */
export const IntegerNumericValue = new DicomTag(0x0014, 0x4108);
/** (0014,4109) VR=OB VM=1 Byte Numeric Value */
export const ByteNumericValue = new DicomTag(0x0014, 0x4109);
/** (0014,410A) VR=OW VM=1 Short Numeric Value */
export const ShortNumericValue = new DicomTag(0x0014, 0x410A);
/** (0014,410B) VR=OF VM=1 Single Precision Floating Point Numeric Value */
export const SinglePrecisionFloatingPointNumericValue = new DicomTag(0x0014, 0x410B);
/** (0014,410C) VR=OD VM=1 Double Precision Floating Point Numeric Value */
export const DoublePrecisionFloatingPointNumericValue = new DicomTag(0x0014, 0x410C);
/** (0014,5002) VR=IS VM=1 LINAC Energy */
export const LINACEnergy = new DicomTag(0x0014, 0x5002);
/** (0014,5004) VR=IS VM=1 LINAC Output */
export const LINACOutput = new DicomTag(0x0014, 0x5004);
/** (0014,5100) VR=US VM=1 Active Aperture */
export const ActiveAperture = new DicomTag(0x0014, 0x5100);
/** (0014,5101) VR=DS VM=1 Total Aperture */
export const TotalAperture = new DicomTag(0x0014, 0x5101);
/** (0014,5102) VR=DS VM=1 Aperture Elevation */
export const ApertureElevation = new DicomTag(0x0014, 0x5102);
/** (0014,5103) VR=DS VM=1 Main Lobe Angle */
export const MainLobeAngle = new DicomTag(0x0014, 0x5103);
/** (0014,5104) VR=DS VM=1 Main Roof Angle */
export const MainRoofAngle = new DicomTag(0x0014, 0x5104);
/** (0014,5105) VR=CS VM=1 Connector Type */
export const ConnectorType = new DicomTag(0x0014, 0x5105);
/** (0014,5106) VR=SH VM=1 Wedge Model Number */
export const WedgeModelNumber = new DicomTag(0x0014, 0x5106);
/** (0014,5107) VR=DS VM=1 Wedge Angle Float */
export const WedgeAngleFloat = new DicomTag(0x0014, 0x5107);
/** (0014,5108) VR=DS VM=1 Wedge Roof Angle */
export const WedgeRoofAngle = new DicomTag(0x0014, 0x5108);
/** (0014,5109) VR=CS VM=1 Wedge Element 1 Position */
export const WedgeElement1Position = new DicomTag(0x0014, 0x5109);
/** (0014,510A) VR=DS VM=1 Wedge Material Velocity */
export const WedgeMaterialVelocity = new DicomTag(0x0014, 0x510A);
/** (0014,510B) VR=SH VM=1 Wedge Material */
export const WedgeMaterial = new DicomTag(0x0014, 0x510B);
/** (0014,510C) VR=DS VM=1 Wedge Offset Z */
export const WedgeOffsetZ = new DicomTag(0x0014, 0x510C);
/** (0014,510D) VR=DS VM=1 Wedge Origin Offset X */
export const WedgeOriginOffsetX = new DicomTag(0x0014, 0x510D);
/** (0014,510E) VR=DS VM=1 Wedge Time Delay */
export const WedgeTimeDelay = new DicomTag(0x0014, 0x510E);
/** (0014,510F) VR=SH VM=1 Wedge Name */
export const WedgeName = new DicomTag(0x0014, 0x510F);
/** (0014,5110) VR=SH VM=1 Wedge Manufacturer Name */
export const WedgeManufacturerName = new DicomTag(0x0014, 0x5110);
/** (0014,5111) VR=LO VM=1 Wedge Description */
export const WedgeDescription = new DicomTag(0x0014, 0x5111);
/** (0014,5112) VR=DS VM=1 Nominal Beam Angle */
export const NominalBeamAngle = new DicomTag(0x0014, 0x5112);
/** (0014,5113) VR=DS VM=1 Wedge Offset X */
export const WedgeOffsetX = new DicomTag(0x0014, 0x5113);
/** (0014,5114) VR=DS VM=1 Wedge Offset Y */
export const WedgeOffsetY = new DicomTag(0x0014, 0x5114);
/** (0014,5115) VR=DS VM=1 Wedge Total Length */
export const WedgeTotalLength = new DicomTag(0x0014, 0x5115);
/** (0014,5116) VR=DS VM=1 Wedge In Contact Length */
export const WedgeInContactLength = new DicomTag(0x0014, 0x5116);
/** (0014,5117) VR=DS VM=1 Wedge Front Gap */
export const WedgeFrontGap = new DicomTag(0x0014, 0x5117);
/** (0014,5118) VR=DS VM=1 Wedge Total Height */
export const WedgeTotalHeight = new DicomTag(0x0014, 0x5118);
/** (0014,5119) VR=DS VM=1 Wedge Front Height */
export const WedgeFrontHeight = new DicomTag(0x0014, 0x5119);
/** (0014,511A) VR=DS VM=1 Wedge Rear Height */
export const WedgeRearHeight = new DicomTag(0x0014, 0x511A);
/** (0014,511B) VR=DS VM=1 Wedge Total Width */
export const WedgeTotalWidth = new DicomTag(0x0014, 0x511B);
/** (0014,511C) VR=DS VM=1 Wedge In Contact Width */
export const WedgeInContactWidth = new DicomTag(0x0014, 0x511C);
/** (0014,511D) VR=DS VM=1 Wedge Chamfer Height */
export const WedgeChamferHeight = new DicomTag(0x0014, 0x511D);
/** (0014,511E) VR=CS VM=1 Wedge Curve */
export const WedgeCurve = new DicomTag(0x0014, 0x511E);
/** (0014,511F) VR=DS VM=1 Radius Along the Wedge */
export const RadiusAlongWedge = new DicomTag(0x0014, 0x511F);
/** (0014,6001) VR=SQ VM=1 Thermal Camera Settings Sequence */
export const ThermalCameraSettingsSequence = new DicomTag(0x0014, 0x6001);
/** (0014,6002) VR=DS VM=1 Acquisition Frame Rate */
export const AcquisitionFrameRate = new DicomTag(0x0014, 0x6002);
/** (0014,6003) VR=DS VM=1 Integration Time */
export const IntegrationTime = new DicomTag(0x0014, 0x6003);
/** (0014,6004) VR=DS VM=1 Number of Calibration Frames */
export const NumberOfCalibrationFrames = new DicomTag(0x0014, 0x6004);
/** (0014,6005) VR=DS VM=1 Number of Rows in Full Acquisition Image */
export const NumberOfRowsInFullAcquisitionImage = new DicomTag(0x0014, 0x6005);
/** (0014,6006) VR=DS VM=1 Number Of Columns in Full Acquisition Image */
export const NumberOfColumnsInFullAcquisitionImage = new DicomTag(0x0014, 0x6006);
/** (0014,6007) VR=SQ VM=1 Thermal Source Settings Sequence */
export const ThermalSourceSettingsSequence = new DicomTag(0x0014, 0x6007);
/** (0014,6008) VR=DS VM=1 Source Horizontal Pitch */
export const SourceHorizontalPitch = new DicomTag(0x0014, 0x6008);
/** (0014,6009) VR=DS VM=1 Source Vertical Pitch */
export const SourceVerticalPitch = new DicomTag(0x0014, 0x6009);
/** (0014,600A) VR=DS VM=1 Source Horizontal Scan Speed */
export const SourceHorizontalScanSpeed = new DicomTag(0x0014, 0x600A);
/** (0014,600B) VR=DS VM=1 Thermal Source Modulation Frequency */
export const ThermalSourceModulationFrequency = new DicomTag(0x0014, 0x600B);
/** (0014,600C) VR=SQ VM=1 Induction Source Setting Sequence */
export const InductionSourceSettingSequence = new DicomTag(0x0014, 0x600C);
/** (0014,600D) VR=DS VM=1 Coil Frequency */
export const CoilFrequency = new DicomTag(0x0014, 0x600D);
/** (0014,600E) VR=DS VM=1 Current Amplitude Across Coil */
export const CurrentAmplitudeAcrossCoil = new DicomTag(0x0014, 0x600E);
/** (0014,600F) VR=SQ VM=1 Flash Source Setting Sequence */
export const FlashSourceSettingSequence = new DicomTag(0x0014, 0x600F);
/** (0014,6010) VR=DS VM=1 Flash Duration */
export const FlashDuration = new DicomTag(0x0014, 0x6010);
/** (0014,6011) VR=DS VM=1-n Flash Frame Number */
export const FlashFrameNumber = new DicomTag(0x0014, 0x6011);
/** (0014,6012) VR=SQ VM=1 Laser Source Setting Sequence */
export const LaserSourceSettingSequence = new DicomTag(0x0014, 0x6012);
/** (0014,6013) VR=DS VM=1 Horizontal Laser Spot Dimension */
export const HorizontalLaserSpotDimension = new DicomTag(0x0014, 0x6013);
/** (0014,6014) VR=DS VM=1 Vertical Laser Spot Dimension */
export const VerticalLaserSpotDimension = new DicomTag(0x0014, 0x6014);
/** (0014,6015) VR=DS VM=1 Laser Wavelength */
export const LaserWavelength = new DicomTag(0x0014, 0x6015);
/** (0014,6016) VR=DS VM=1 Laser Power */
export const LaserPower = new DicomTag(0x0014, 0x6016);
/** (0014,6017) VR=SQ VM=1 Forced Gas Setting Sequence */
export const ForcedGasSettingSequence = new DicomTag(0x0014, 0x6017);
/** (0014,6018) VR=SQ VM=1 Vibration Source Setting Sequence */
export const VibrationSourceSettingSequence = new DicomTag(0x0014, 0x6018);
/** (0014,6019) VR=DS VM=1 Vibration Excitation Frequency */
export const VibrationExcitationFrequency = new DicomTag(0x0014, 0x6019);
/** (0014,601A) VR=DS VM=1 Vibration Excitation Voltage */
export const VibrationExcitationVoltage = new DicomTag(0x0014, 0x601A);
/** (0014,601B) VR=CS VM=1 Thermography Data Capture Method */
export const ThermographyDataCaptureMethod = new DicomTag(0x0014, 0x601B);
/** (0014,601C) VR=CS VM=1 Thermal Technique */
export const ThermalTechnique = new DicomTag(0x0014, 0x601C);
/** (0014,601D) VR=SQ VM=1 Thermal Camera Core Sequence */
export const ThermalCameraCoreSequence = new DicomTag(0x0014, 0x601D);
/** (0014,601E) VR=CS VM=1 Detector Wavelength Range */
export const DetectorWavelengthRange = new DicomTag(0x0014, 0x601E);
/** (0014,601F) VR=CS VM=1 Thermal Camera Calibration Type */
export const ThermalCameraCalibrationType = new DicomTag(0x0014, 0x601F);
/** (0014,6020) VR=UV VM=1 Acquisition Image Counter */
export const AcquisitionImageCounter = new DicomTag(0x0014, 0x6020);
/** (0014,6021) VR=DS VM=1 Front Panel Temperature */
export const FrontPanelTemperature = new DicomTag(0x0014, 0x6021);
/** (0014,6022) VR=DS VM=1 Air Gap Temperature */
export const AirGapTemperature = new DicomTag(0x0014, 0x6022);
/** (0014,6023) VR=DS VM=1 Vertical Pixel Size */
export const VerticalPixelSize = new DicomTag(0x0014, 0x6023);
/** (0014,6024) VR=DS VM=1 Horizontal Pixel Size */
export const HorizontalPixelSize = new DicomTag(0x0014, 0x6024);
/** (0014,6025) VR=ST VM=1-n Data Streaming Protocol */
export const DataStreamingProtocol = new DicomTag(0x0014, 0x6025);
/** (0014,6026) VR=SQ VM=1 Lens Sequence */
export const LensSequence = new DicomTag(0x0014, 0x6026);
/** (0014,6027) VR=DS VM=1 Field of View */
export const FieldOfView = new DicomTag(0x0014, 0x6027);
/** (0014,6028) VR=LO VM=1 Lens Filter Manufacturer */
export const LensFilterManufacturer = new DicomTag(0x0014, 0x6028);
/** (0014,6029) VR=CS VM=1 Cutoff Filter Type */
export const CutoffFilterType = new DicomTag(0x0014, 0x6029);
/** (0014,602A) VR=DS VM=1-n Lens Filter Cut-Off Wavelength */
export const LensFilterCutOffWavelength = new DicomTag(0x0014, 0x602A);
/** (0014,602B) VR=SQ VM=1 Thermal Source Sequence */
export const ThermalSourceSequence = new DicomTag(0x0014, 0x602B);
/** (0014,602C) VR=CS VM=1 Thermal Source Motion State */
export const ThermalSourceMotionState = new DicomTag(0x0014, 0x602C);
/** (0014,602D) VR=CS VM=1 Thermal Source Motion Type */
export const ThermalSourceMotionType = new DicomTag(0x0014, 0x602D);
/** (0014,602E) VR=SQ VM=1 Induction Heating Sequence */
export const InductionHeatingSequence = new DicomTag(0x0014, 0x602E);
/** (0014,602F) VR=ST VM=1 Coil Configuration ID */
export const CoilConfigurationID = new DicomTag(0x0014, 0x602F);
/** (0014,6030) VR=DS VM=1 Number of Turns in Coil */
export const NumberOfTurnsInCoil = new DicomTag(0x0014, 0x6030);
/** (0014,6031) VR=CS VM=1 Shape of Individual Turn */
export const ShapeOfIndividualTurn = new DicomTag(0x0014, 0x6031);
/** (0014,6032) VR=DS VM=1-n Size of Individual Turn */
export const SizeOfIndividualTurn = new DicomTag(0x0014, 0x6032);
/** (0014,6033) VR=DS VM=1-n Distance Between Turns */
export const DistanceBetweenTurns = new DicomTag(0x0014, 0x6033);
/** (0014,6034) VR=SQ VM=1 Flash Heating Sequence */
export const FlashHeatingSequence = new DicomTag(0x0014, 0x6034);
/** (0014,6035) VR=DS VM=1 Number of Lamps */
export const NumberOfLamps = new DicomTag(0x0014, 0x6035);
/** (0014,6036) VR=ST VM=1 Flash Synchronization Protocol */
export const FlashSynchronizationProtocol = new DicomTag(0x0014, 0x6036);
/** (0014,6037) VR=CS VM=1 Flash Modification Status */
export const FlashModificationStatus = new DicomTag(0x0014, 0x6037);
/** (0014,6038) VR=SQ VM=1 Laser Heating Sequence */
export const LaserHeatingSequence = new DicomTag(0x0014, 0x6038);
/** (0014,6039) VR=LO VM=1 Laser Manufacturer */
export const LaserManufacturer = new DicomTag(0x0014, 0x6039);
/** (0014,603A) VR=LO VM=1 Laser Model Number */
export const LaserModelNumber = new DicomTag(0x0014, 0x603A);
/** (0014,603B) VR=ST VM=1 Laser Type Description */
export const LaserTypeDescription = new DicomTag(0x0014, 0x603B);
/** (0014,603C) VR=SQ VM=1 Forced Gas Heating Sequence */
export const ForcedGasHeatingSequence = new DicomTag(0x0014, 0x603C);
/** (0014,603D) VR=LO VM=1 Gas Used for Heating/Cooling Part */
export const GasUsedForHeatingCoolingPart = new DicomTag(0x0014, 0x603D);
/** (0014,603E) VR=SQ VM=1 Vibration/Sonic Heating Sequence */
export const VibrationSonicHeatingSequence = new DicomTag(0x0014, 0x603E);
/** (0014,603F) VR=LO VM=1 Probe Manufacturer */
export const ProbeManufacturer = new DicomTag(0x0014, 0x603F);
/** (0014,6040) VR=LO VM=1 Probe Model Number */
export const ProbeModelNumber = new DicomTag(0x0014, 0x6040);
/** (0014,6041) VR=DS VM=1 Aperture Size */
export const ApertureSize = new DicomTag(0x0014, 0x6041);
/** (0014,6042) VR=DS VM=1 Probe Resonant Frequency */
export const ProbeResonantFrequency = new DicomTag(0x0014, 0x6042);
/** (0014,6043) VR=UT VM=1 Heat Source Description */
export const HeatSourceDescription = new DicomTag(0x0014, 0x6043);
/** (0014,6044) VR=CS VM=1 Surface Preparation with Optical Coating */
export const SurfacePreparationWithOpticalCoating = new DicomTag(0x0014, 0x6044);
/** (0014,6045) VR=ST VM=1 Optical Coating Type */
export const OpticalCoatingType = new DicomTag(0x0014, 0x6045);
/** (0014,6046) VR=DS VM=1 Thermal Conductivity of Exposed Surface */
export const ThermalConductivityOfExposedSurface = new DicomTag(0x0014, 0x6046);
/** (0014,6047) VR=DS VM=1 Material Density */
export const MaterialDensity = new DicomTag(0x0014, 0x6047);
/** (0014,6048) VR=DS VM=1 Specific Heat of Inspection Surface */
export const SpecificHeatOfInspectionSurface = new DicomTag(0x0014, 0x6048);
/** (0014,6049) VR=DS VM=1 Emissivity of Inspection Surface */
export const EmissivityOfInspectionSurface = new DicomTag(0x0014, 0x6049);
/** (0014,604A) VR=CS VM=1-n Electromagnetic Classification of Inspection Surface */
export const ElectromagneticClassificationOfInspectionSurface = new DicomTag(0x0014, 0x604A);
/** (0014,604C) VR=DS VM=1 Moving Window Size */
export const MovingWindowSize = new DicomTag(0x0014, 0x604C);
/** (0014,604D) VR=CS VM=1 Moving Window Type */
export const MovingWindowType = new DicomTag(0x0014, 0x604D);
/** (0014,604E) VR=DS VM=1-n Moving Window Weights */
export const MovingWindowWeights = new DicomTag(0x0014, 0x604E);
/** (0014,604F) VR=DS VM=1 Moving Window Pitch */
export const MovingWindowPitch = new DicomTag(0x0014, 0x604F);
/** (0014,6050) VR=CS VM=1 Moving Window Padding Scheme */
export const MovingWindowPaddingScheme = new DicomTag(0x0014, 0x6050);
/** (0014,6051) VR=DS VM=1 Moving Window Padding Sength */
export const MovingWindowPaddingLength = new DicomTag(0x0014, 0x6051);
/** (0014,6052) VR=SQ VM=1 Spatial Filtering Parameters Sequence */
export const SpatialFilteringParametersSequence = new DicomTag(0x0014, 0x6052);
/** (0014,6053) VR=CS VM=1 Spatial Filtering Scheme */
export const SpatialFilteringScheme = new DicomTag(0x0014, 0x6053);
/** (0014,6056) VR=DS VM=1 Horizontal Moving Window Size */
export const HorizontalMovingWindowSize = new DicomTag(0x0014, 0x6056);
/** (0014,6057) VR=DS VM=1 Vertical Moving Window Size */
export const VerticalMovingWindowSize = new DicomTag(0x0014, 0x6057);
/** (0014,6059) VR=SQ VM=1 Polynomial Fitting Sequence */
export const PolynomialFittingSequence = new DicomTag(0x0014, 0x6059);
/** (0014,605A) VR=CS VM=1-n Fitting Data Type */
export const FittingDataType = new DicomTag(0x0014, 0x605A);
/** (0014,605B) VR=CS VM=1 Operation on Time Axis Before Fitting */
export const OperationOnTimeAxisBeforeFitting = new DicomTag(0x0014, 0x605B);
/** (0014,605C) VR=CS VM=1 Operation on Pixel Intensity Before Fitting */
export const OperationOnPixelIntensityBeforeFitting = new DicomTag(0x0014, 0x605C);
/** (0014,605D) VR=DS VM=1 Order of Polynomial */
export const OrderOfPolynomial = new DicomTag(0x0014, 0x605D);
/** (0014,605E) VR=CS VM=1 Independent Variable for Polynomial Fit */
export const IndependentVariableForPolynomialFit = new DicomTag(0x0014, 0x605E);
/** (0014,605F) VR=DS VM=1-n PolynomialCoefficients */
export const PolynomialCoefficients = new DicomTag(0x0014, 0x605F);
/** (0014,6060) VR=CS VM=1 Thermography Pixel Data Unit */
export const ThermographyPixelDataUnit = new DicomTag(0x0014, 0x6060);
/** (0016,0001) VR=DS VM=1 White Point */
export const WhitePoint = new DicomTag(0x0016, 0x0001);
/** (0016,0002) VR=DS VM=3 Primary Chromaticities */
export const PrimaryChromaticities = new DicomTag(0x0016, 0x0002);
/** (0016,0003) VR=UT VM=1 Battery Level */
export const BatteryLevel = new DicomTag(0x0016, 0x0003);
/** (0016,0004) VR=DS VM=1 Exposure Time in Seconds */
export const ExposureTimeInSeconds = new DicomTag(0x0016, 0x0004);
/** (0016,0005) VR=DS VM=1 F-Number */
export const FNumber = new DicomTag(0x0016, 0x0005);
/** (0016,0006) VR=IS VM=1 OECF Rows */
export const OECFRows = new DicomTag(0x0016, 0x0006);
/** (0016,0007) VR=IS VM=1 OECF Columns */
export const OECFColumns = new DicomTag(0x0016, 0x0007);
/** (0016,0008) VR=UC VM=1-n OECF Column Names */
export const OECFColumnNames = new DicomTag(0x0016, 0x0008);
/** (0016,0009) VR=DS VM=1-n OECF Values */
export const OECFValues = new DicomTag(0x0016, 0x0009);
/** (0016,000A) VR=IS VM=1 Spatial Frequency Response Rows */
export const SpatialFrequencyResponseRows = new DicomTag(0x0016, 0x000A);
/** (0016,000B) VR=IS VM=1 Spatial Frequency Response Columns */
export const SpatialFrequencyResponseColumns = new DicomTag(0x0016, 0x000B);
/** (0016,000C) VR=UC VM=1-n Spatial Frequency Response Column Names */
export const SpatialFrequencyResponseColumnNames = new DicomTag(0x0016, 0x000C);
/** (0016,000D) VR=DS VM=1-n Spatial Frequency Response Values */
export const SpatialFrequencyResponseValues = new DicomTag(0x0016, 0x000D);
/** (0016,000E) VR=IS VM=1 Color Filter Array Pattern Rows */
export const ColorFilterArrayPatternRows = new DicomTag(0x0016, 0x000E);
/** (0016,000F) VR=IS VM=1 Color Filter Array Pattern Columns */
export const ColorFilterArrayPatternColumns = new DicomTag(0x0016, 0x000F);
/** (0016,0010) VR=DS VM=1-n Color Filter Array Pattern Values */
export const ColorFilterArrayPatternValues = new DicomTag(0x0016, 0x0010);
/** (0016,0011) VR=US VM=1 Flash Firing Status */
export const FlashFiringStatus = new DicomTag(0x0016, 0x0011);
/** (0016,0012) VR=US VM=1 Flash Return Status */
export const FlashReturnStatus = new DicomTag(0x0016, 0x0012);
/** (0016,0013) VR=US VM=1 Flash Mode */
export const FlashMode = new DicomTag(0x0016, 0x0013);
/** (0016,0014) VR=US VM=1 Flash Function Present */
export const FlashFunctionPresent = new DicomTag(0x0016, 0x0014);
/** (0016,0015) VR=US VM=1 Flash Red Eye Mode */
export const FlashRedEyeMode = new DicomTag(0x0016, 0x0015);
/** (0016,0016) VR=US VM=1 Exposure Program */
export const ExposureProgram = new DicomTag(0x0016, 0x0016);
/** (0016,0017) VR=UT VM=1 Spectral Sensitivity */
export const SpectralSensitivity = new DicomTag(0x0016, 0x0017);
/** (0016,0018) VR=IS VM=1 Photographic Sensitivity */
export const PhotographicSensitivity = new DicomTag(0x0016, 0x0018);
/** (0016,0019) VR=IS VM=1 Self Timer Mode */
export const SelfTimerMode = new DicomTag(0x0016, 0x0019);
/** (0016,001A) VR=US VM=1 Sensitivity Type */
export const SensitivityType = new DicomTag(0x0016, 0x001A);
/** (0016,001B) VR=IS VM=1 Standard Output Sensitivity */
export const StandardOutputSensitivity = new DicomTag(0x0016, 0x001B);
/** (0016,001C) VR=IS VM=1 Recommended Exposure Index */
export const RecommendedExposureIndex = new DicomTag(0x0016, 0x001C);
/** (0016,001D) VR=IS VM=1 ISO Speed */
export const ISOSpeed = new DicomTag(0x0016, 0x001D);
/** (0016,001E) VR=IS VM=1 ISO Speed Latitude yyy */
export const ISOSpeedLatitudeyyy = new DicomTag(0x0016, 0x001E);
/** (0016,001F) VR=IS VM=1 ISO Speed Latitude zzz */
export const ISOSpeedLatitudezzz = new DicomTag(0x0016, 0x001F);
/** (0016,0020) VR=UT VM=1 EXIF Version */
export const EXIFVersion = new DicomTag(0x0016, 0x0020);
/** (0016,0021) VR=DS VM=1 Shutter Speed Value */
export const ShutterSpeedValue = new DicomTag(0x0016, 0x0021);
/** (0016,0022) VR=DS VM=1 Aperture Value */
export const ApertureValue = new DicomTag(0x0016, 0x0022);
/** (0016,0023) VR=DS VM=1 Brightness Value */
export const BrightnessValue = new DicomTag(0x0016, 0x0023);
/** (0016,0024) VR=DS VM=1 Exposure Bias Value */
export const ExposureBiasValue = new DicomTag(0x0016, 0x0024);
/** (0016,0025) VR=DS VM=1 Max Aperture Value */
export const MaxApertureValue = new DicomTag(0x0016, 0x0025);
/** (0016,0026) VR=DS VM=1 Subject Distance */
export const SubjectDistance = new DicomTag(0x0016, 0x0026);
/** (0016,0027) VR=US VM=1 Metering Mode */
export const MeteringMode = new DicomTag(0x0016, 0x0027);
/** (0016,0028) VR=US VM=1 Light Source */
export const LightSource = new DicomTag(0x0016, 0x0028);
/** (0016,0029) VR=DS VM=1 Focal Length */
export const FocalLength = new DicomTag(0x0016, 0x0029);
/** (0016,002A) VR=IS VM=2-4 Subject Area */
export const SubjectArea = new DicomTag(0x0016, 0x002A);
/** (0016,002B) VR=OB VM=1 Maker Note */
export const MakerNote = new DicomTag(0x0016, 0x002B);
/** (0016,0030) VR=DS VM=1 Temperature */
export const Temperature = new DicomTag(0x0016, 0x0030);
/** (0016,0031) VR=DS VM=1 Humidity */
export const Humidity = new DicomTag(0x0016, 0x0031);
/** (0016,0032) VR=DS VM=1 Pressure */
export const Pressure = new DicomTag(0x0016, 0x0032);
/** (0016,0033) VR=DS VM=1 Water Depth */
export const WaterDepth = new DicomTag(0x0016, 0x0033);
/** (0016,0034) VR=DS VM=1 Acceleration */
export const Acceleration = new DicomTag(0x0016, 0x0034);
/** (0016,0035) VR=DS VM=1 Camera Elevation Angle */
export const CameraElevationAngle = new DicomTag(0x0016, 0x0035);
/** (0016,0036) VR=DS VM=1-2 Flash Energy */
export const FlashEnergy = new DicomTag(0x0016, 0x0036);
/** (0016,0037) VR=IS VM=2 Subject Location */
export const SubjectLocation = new DicomTag(0x0016, 0x0037);
/** (0016,0038) VR=DS VM=1 Photographic Exposure Index */
export const PhotographicExposureIndex = new DicomTag(0x0016, 0x0038);
/** (0016,0039) VR=US VM=1 Sensing Method */
export const SensingMethod = new DicomTag(0x0016, 0x0039);
/** (0016,003A) VR=US VM=1 File Source */
export const FileSource = new DicomTag(0x0016, 0x003A);
/** (0016,003B) VR=US VM=1 Scene Type */
export const SceneType = new DicomTag(0x0016, 0x003B);
/** (0016,0041) VR=US VM=1 Custom Rendered */
export const CustomRendered = new DicomTag(0x0016, 0x0041);
/** (0016,0042) VR=US VM=1 Exposure Mode */
export const ExposureMode = new DicomTag(0x0016, 0x0042);
/** (0016,0043) VR=US VM=1 White Balance */
export const WhiteBalance = new DicomTag(0x0016, 0x0043);
/** (0016,0044) VR=DS VM=1 Digital Zoom Ratio */
export const DigitalZoomRatio = new DicomTag(0x0016, 0x0044);
/** (0016,0045) VR=IS VM=1 Focal Length In 35mm Film */
export const FocalLengthIn35mmFilm = new DicomTag(0x0016, 0x0045);
/** (0016,0046) VR=US VM=1 Scene Capture Type */
export const SceneCaptureType = new DicomTag(0x0016, 0x0046);
/** (0016,0047) VR=US VM=1 Gain Control */
export const GainControl = new DicomTag(0x0016, 0x0047);
/** (0016,0048) VR=US VM=1 Contrast */
export const Contrast = new DicomTag(0x0016, 0x0048);
/** (0016,0049) VR=US VM=1 Saturation */
export const Saturation = new DicomTag(0x0016, 0x0049);
/** (0016,004A) VR=US VM=1 Sharpness */
export const Sharpness = new DicomTag(0x0016, 0x004A);
/** (0016,004B) VR=OB VM=1 Device Setting Description */
export const DeviceSettingDescription = new DicomTag(0x0016, 0x004B);
/** (0016,004C) VR=US VM=1 Subject Distance Range */
export const SubjectDistanceRange = new DicomTag(0x0016, 0x004C);
/** (0016,004D) VR=UT VM=1 Camera Owner Name */
export const CameraOwnerName = new DicomTag(0x0016, 0x004D);
/** (0016,004E) VR=DS VM=4 Lens Specification */
export const LensSpecification = new DicomTag(0x0016, 0x004E);
/** (0016,004F) VR=UT VM=1 Lens Make */
export const LensMake = new DicomTag(0x0016, 0x004F);
/** (0016,0050) VR=UT VM=1 Lens Model */
export const LensModel = new DicomTag(0x0016, 0x0050);
/** (0016,0051) VR=UT VM=1 Lens Serial Number */
export const LensSerialNumber = new DicomTag(0x0016, 0x0051);
/** (0016,0061) VR=CS VM=1 Interoperability Index */
export const InteroperabilityIndex = new DicomTag(0x0016, 0x0061);
/** (0016,0062) VR=OB VM=1 Interoperability Version */
export const InteroperabilityVersion = new DicomTag(0x0016, 0x0062);
/** (0016,0070) VR=OB VM=1 GPS Version ID */
export const GPSVersionID = new DicomTag(0x0016, 0x0070);
/** (0016,0071) VR=CS VM=1 GPS Latitude Ref */
export const GPSLatitudeRef = new DicomTag(0x0016, 0x0071);
/** (0016,0072) VR=DS VM=3 GPS Latitude */
export const GPSLatitude = new DicomTag(0x0016, 0x0072);
/** (0016,0073) VR=CS VM=1 GPS Longitude Ref */
export const GPSLongitudeRef = new DicomTag(0x0016, 0x0073);
/** (0016,0074) VR=DS VM=3 GPS Longitude */
export const GPSLongitude = new DicomTag(0x0016, 0x0074);
/** (0016,0075) VR=US VM=1 GPS Altitude Ref */
export const GPSAltitudeRef = new DicomTag(0x0016, 0x0075);
/** (0016,0076) VR=DS VM=1 GPS Altitude */
export const GPSAltitude = new DicomTag(0x0016, 0x0076);
/** (0016,0077) VR=DT VM=1 GPS Time Stamp */
export const GPSTimeStamp = new DicomTag(0x0016, 0x0077);
/** (0016,0078) VR=UT VM=1 GPS Satellites */
export const GPSSatellites = new DicomTag(0x0016, 0x0078);
/** (0016,0079) VR=CS VM=1 GPS Status */
export const GPSStatus = new DicomTag(0x0016, 0x0079);
/** (0016,007A) VR=CS VM=1 GPS Measure Mode */
export const GPSMeasureMode = new DicomTag(0x0016, 0x007A);
/** (0016,007B) VR=DS VM=1 GPS DOP */
export const GPSDOP = new DicomTag(0x0016, 0x007B);
/** (0016,007C) VR=CS VM=1 GPS Speed Ref */
export const GPSSpeedRef = new DicomTag(0x0016, 0x007C);
/** (0016,007D) VR=DS VM=1 GPS Speed */
export const GPSSpeed = new DicomTag(0x0016, 0x007D);
/** (0016,007E) VR=CS VM=1 GPS Track Ref */
export const GPSTrackRef = new DicomTag(0x0016, 0x007E);
/** (0016,007F) VR=DS VM=1 GPS Track */
export const GPSTrack = new DicomTag(0x0016, 0x007F);
/** (0016,0080) VR=CS VM=1 GPS Img Direction Ref */
export const GPSImgDirectionRef = new DicomTag(0x0016, 0x0080);
/** (0016,0081) VR=DS VM=1 GPS Img Direction */
export const GPSImgDirection = new DicomTag(0x0016, 0x0081);
/** (0016,0082) VR=UT VM=1 GPS Map Datum */
export const GPSMapDatum = new DicomTag(0x0016, 0x0082);
/** (0016,0083) VR=CS VM=1 GPS Dest Latitude Ref */
export const GPSDestLatitudeRef = new DicomTag(0x0016, 0x0083);
/** (0016,0084) VR=DS VM=3 GPS Dest Latitude */
export const GPSDestLatitude = new DicomTag(0x0016, 0x0084);
/** (0016,0085) VR=CS VM=1 GPS Dest Longitude Ref */
export const GPSDestLongitudeRef = new DicomTag(0x0016, 0x0085);
/** (0016,0086) VR=DS VM=3 GPS Dest Longitude */
export const GPSDestLongitude = new DicomTag(0x0016, 0x0086);
/** (0016,0087) VR=CS VM=1 GPS Dest Bearing Ref */
export const GPSDestBearingRef = new DicomTag(0x0016, 0x0087);
/** (0016,0088) VR=DS VM=1 GPS Dest Bearing */
export const GPSDestBearing = new DicomTag(0x0016, 0x0088);
/** (0016,0089) VR=CS VM=1 GPS Dest Distance Ref */
export const GPSDestDistanceRef = new DicomTag(0x0016, 0x0089);
/** (0016,008A) VR=DS VM=1 GPS Dest Distance */
export const GPSDestDistance = new DicomTag(0x0016, 0x008A);
/** (0016,008B) VR=OB VM=1 GPS Processing Method */
export const GPSProcessingMethod = new DicomTag(0x0016, 0x008B);
/** (0016,008C) VR=OB VM=1 GPS Area Information */
export const GPSAreaInformation = new DicomTag(0x0016, 0x008C);
/** (0016,008D) VR=DT VM=1 GPS Date Stamp */
export const GPSDateStamp = new DicomTag(0x0016, 0x008D);
/** (0016,008E) VR=IS VM=1 GPS Differential */
export const GPSDifferential = new DicomTag(0x0016, 0x008E);
/** (0016,1001) VR=CS VM=1 Light Source Polarization */
export const LightSourcePolarization = new DicomTag(0x0016, 0x1001);
/** (0016,1002) VR=DS VM=1 Emitter Color Temperature */
export const EmitterColorTemperature = new DicomTag(0x0016, 0x1002);
/** (0016,1003) VR=CS VM=1 Contact Method */
export const ContactMethod = new DicomTag(0x0016, 0x1003);
/** (0016,1004) VR=CS VM=1-n Immersion Media */
export const ImmersionMedia = new DicomTag(0x0016, 0x1004);
/** (0016,1005) VR=DS VM=1 Optical Magnification Factor */
export const OpticalMagnificationFactor = new DicomTag(0x0016, 0x1005);
/** (0018,0010) VR=LO VM=1 Contrast/Bolus Agent */
export const ContrastBolusAgent = new DicomTag(0x0018, 0x0010);
/** (0018,0012) VR=SQ VM=1 Contrast/Bolus Agent Sequence */
export const ContrastBolusAgentSequence = new DicomTag(0x0018, 0x0012);
/** (0018,0013) VR=FL VM=1 Contrast/Bolus T1 Relaxivity */
export const ContrastBolusT1Relaxivity = new DicomTag(0x0018, 0x0013);
/** (0018,0014) VR=SQ VM=1 Contrast/Bolus Administration Route Sequence */
export const ContrastBolusAdministrationRouteSequence = new DicomTag(0x0018, 0x0014);
/** (0018,0015) VR=CS VM=1 Body Part Examined */
export const BodyPartExamined = new DicomTag(0x0018, 0x0015);
/** (0018,0020) VR=CS VM=1-n Scanning Sequence */
export const ScanningSequence = new DicomTag(0x0018, 0x0020);
/** (0018,0021) VR=CS VM=1-n Sequence Variant */
export const SequenceVariant = new DicomTag(0x0018, 0x0021);
/** (0018,0022) VR=CS VM=1-n Scan Options */
export const ScanOptions = new DicomTag(0x0018, 0x0022);
/** (0018,0023) VR=CS VM=1 MR Acquisition Type */
export const MRAcquisitionType = new DicomTag(0x0018, 0x0023);
/** (0018,0024) VR=SH VM=1 Sequence Name */
export const SequenceName = new DicomTag(0x0018, 0x0024);
/** (0018,0025) VR=CS VM=1 Angio Flag */
export const AngioFlag = new DicomTag(0x0018, 0x0025);
/** (0018,0026) VR=SQ VM=1 Intervention Drug Information Sequence */
export const InterventionDrugInformationSequence = new DicomTag(0x0018, 0x0026);
/** (0018,0027) VR=TM VM=1 Intervention Drug Stop Time */
export const InterventionDrugStopTime = new DicomTag(0x0018, 0x0027);
/** (0018,0028) VR=DS VM=1 Intervention Drug Dose */
export const InterventionDrugDose = new DicomTag(0x0018, 0x0028);
/** (0018,0029) VR=SQ VM=1 Intervention Drug Code Sequence */
export const InterventionDrugCodeSequence = new DicomTag(0x0018, 0x0029);
/** (0018,002A) VR=SQ VM=1 Additional Drug Sequence */
export const AdditionalDrugSequence = new DicomTag(0x0018, 0x002A);
/** (0018,0030) VR=LO VM=1-n Radionuclide (Retired) */
export const Radionuclide = new DicomTag(0x0018, 0x0030);
/** (0018,0031) VR=LO VM=1 Radiopharmaceutical */
export const Radiopharmaceutical = new DicomTag(0x0018, 0x0031);
/** (0018,0032) VR=DS VM=1 Energy Window Centerline (Retired) */
export const EnergyWindowCenterline = new DicomTag(0x0018, 0x0032);
/** (0018,0033) VR=DS VM=1-n Energy Window Total Width (Retired) */
export const EnergyWindowTotalWidth = new DicomTag(0x0018, 0x0033);
/** (0018,0034) VR=LO VM=1 Intervention Drug Name */
export const InterventionDrugName = new DicomTag(0x0018, 0x0034);
/** (0018,0035) VR=TM VM=1 Intervention Drug Start Time */
export const InterventionDrugStartTime = new DicomTag(0x0018, 0x0035);
/** (0018,0036) VR=SQ VM=1 Intervention Sequence */
export const InterventionSequence = new DicomTag(0x0018, 0x0036);
/** (0018,0037) VR=CS VM=1 Therapy Type (Retired) */
export const TherapyType = new DicomTag(0x0018, 0x0037);
/** (0018,0038) VR=CS VM=1 Intervention Status */
export const InterventionStatus = new DicomTag(0x0018, 0x0038);
/** (0018,0039) VR=CS VM=1 Therapy Description (Retired) */
export const TherapyDescription = new DicomTag(0x0018, 0x0039);
/** (0018,003A) VR=ST VM=1 Intervention Description */
export const InterventionDescription = new DicomTag(0x0018, 0x003A);
/** (0018,0040) VR=IS VM=1 Cine Rate */
export const CineRate = new DicomTag(0x0018, 0x0040);
/** (0018,0042) VR=CS VM=1 Initial Cine Run State */
export const InitialCineRunState = new DicomTag(0x0018, 0x0042);
/** (0018,0050) VR=DS VM=1 Slice Thickness */
export const SliceThickness = new DicomTag(0x0018, 0x0050);
/** (0018,0060) VR=DS VM=1 KVP */
export const KVP = new DicomTag(0x0018, 0x0060);
/** (0018,0070) VR=IS VM=1 Counts Accumulated */
export const CountsAccumulated = new DicomTag(0x0018, 0x0070);
/** (0018,0071) VR=CS VM=1 Acquisition Termination Condition */
export const AcquisitionTerminationCondition = new DicomTag(0x0018, 0x0071);
/** (0018,0072) VR=DS VM=1 Effective Duration */
export const EffectiveDuration = new DicomTag(0x0018, 0x0072);
/** (0018,0073) VR=CS VM=1 Acquisition Start Condition */
export const AcquisitionStartCondition = new DicomTag(0x0018, 0x0073);
/** (0018,0074) VR=IS VM=1 Acquisition Start Condition Data */
export const AcquisitionStartConditionData = new DicomTag(0x0018, 0x0074);
/** (0018,0075) VR=IS VM=1 Acquisition Termination Condition Data */
export const AcquisitionTerminationConditionData = new DicomTag(0x0018, 0x0075);
/** (0018,0080) VR=DS VM=1 Repetition Time */
export const RepetitionTime = new DicomTag(0x0018, 0x0080);
/** (0018,0081) VR=DS VM=1 Echo Time */
export const EchoTime = new DicomTag(0x0018, 0x0081);
/** (0018,0082) VR=DS VM=1 Inversion Time */
export const InversionTime = new DicomTag(0x0018, 0x0082);
/** (0018,0083) VR=DS VM=1 Number of Averages */
export const NumberOfAverages = new DicomTag(0x0018, 0x0083);
/** (0018,0084) VR=DS VM=1 Imaging Frequency */
export const ImagingFrequency = new DicomTag(0x0018, 0x0084);
/** (0018,0085) VR=SH VM=1 Imaged Nucleus */
export const ImagedNucleus = new DicomTag(0x0018, 0x0085);
/** (0018,0086) VR=IS VM=1-n Echo Number(s) */
export const EchoNumbers = new DicomTag(0x0018, 0x0086);
/** (0018,0087) VR=DS VM=1 Magnetic Field Strength */
export const MagneticFieldStrength = new DicomTag(0x0018, 0x0087);
/** (0018,0088) VR=DS VM=1 Spacing Between Slices */
export const SpacingBetweenSlices = new DicomTag(0x0018, 0x0088);
/** (0018,0089) VR=IS VM=1 Number of Phase Encoding Steps */
export const NumberOfPhaseEncodingSteps = new DicomTag(0x0018, 0x0089);
/** (0018,0090) VR=DS VM=1 Data Collection Diameter */
export const DataCollectionDiameter = new DicomTag(0x0018, 0x0090);
/** (0018,0091) VR=IS VM=1 Echo Train Length */
export const EchoTrainLength = new DicomTag(0x0018, 0x0091);
/** (0018,0093) VR=DS VM=1 Percent Sampling */
export const PercentSampling = new DicomTag(0x0018, 0x0093);
/** (0018,0094) VR=DS VM=1 Percent Phase Field of View */
export const PercentPhaseFieldOfView = new DicomTag(0x0018, 0x0094);
/** (0018,0095) VR=DS VM=1 Pixel Bandwidth */
export const PixelBandwidth = new DicomTag(0x0018, 0x0095);
/** (0018,1000) VR=LO VM=1 Device Serial Number */
export const DeviceSerialNumber = new DicomTag(0x0018, 0x1000);
/** (0018,1002) VR=UI VM=1 Device UID */
export const DeviceUID = new DicomTag(0x0018, 0x1002);
/** (0018,1003) VR=LO VM=1 Device ID */
export const DeviceID = new DicomTag(0x0018, 0x1003);
/** (0018,1004) VR=LO VM=1 Plate ID */
export const PlateID = new DicomTag(0x0018, 0x1004);
/** (0018,1005) VR=LO VM=1 Generator ID */
export const GeneratorID = new DicomTag(0x0018, 0x1005);
/** (0018,1006) VR=LO VM=1 Grid ID */
export const GridID = new DicomTag(0x0018, 0x1006);
/** (0018,1007) VR=LO VM=1 Cassette ID */
export const CassetteID = new DicomTag(0x0018, 0x1007);
/** (0018,1008) VR=LO VM=1 Gantry ID */
export const GantryID = new DicomTag(0x0018, 0x1008);
/** (0018,1009) VR=UT VM=1 Unique Device Identifier */
export const UniqueDeviceIdentifier = new DicomTag(0x0018, 0x1009);
/** (0018,100A) VR=SQ VM=1 UDI Sequence */
export const UDISequence = new DicomTag(0x0018, 0x100A);
/** (0018,100B) VR=UI VM=1-n Manufacturer's Device Class UID */
export const ManufacturerDeviceClassUID = new DicomTag(0x0018, 0x100B);
/** (0018,1010) VR=LO VM=1 Secondary Capture Device ID */
export const SecondaryCaptureDeviceID = new DicomTag(0x0018, 0x1010);
/** (0018,1011) VR=LO VM=1 Hardcopy Creation Device ID (Retired) */
export const HardcopyCreationDeviceID = new DicomTag(0x0018, 0x1011);
/** (0018,1012) VR=DA VM=1 Date of Secondary Capture */
export const DateOfSecondaryCapture = new DicomTag(0x0018, 0x1012);
/** (0018,1014) VR=TM VM=1 Time of Secondary Capture */
export const TimeOfSecondaryCapture = new DicomTag(0x0018, 0x1014);
/** (0018,1016) VR=LO VM=1 Secondary Capture Device Manufacturer */
export const SecondaryCaptureDeviceManufacturer = new DicomTag(0x0018, 0x1016);
/** (0018,1017) VR=LO VM=1 Hardcopy Device Manufacturer (Retired) */
export const HardcopyDeviceManufacturer = new DicomTag(0x0018, 0x1017);
/** (0018,1018) VR=LO VM=1 Secondary Capture Device Manufacturer's Model Name */
export const SecondaryCaptureDeviceManufacturerModelName = new DicomTag(0x0018, 0x1018);
/** (0018,1019) VR=LO VM=1-n Secondary Capture Device Software Versions */
export const SecondaryCaptureDeviceSoftwareVersions = new DicomTag(0x0018, 0x1019);
/** (0018,101A) VR=LO VM=1-n Hardcopy Device Software Version (Retired) */
export const HardcopyDeviceSoftwareVersion = new DicomTag(0x0018, 0x101A);
/** (0018,101B) VR=LO VM=1 Hardcopy Device Manufacturer's Model Name (Retired) */
export const HardcopyDeviceManufacturerModelName = new DicomTag(0x0018, 0x101B);
/** (0018,1020) VR=LO VM=1-n Software Versions */
export const SoftwareVersions = new DicomTag(0x0018, 0x1020);
/** (0018,1022) VR=SH VM=1 Video Image Format Acquired */
export const VideoImageFormatAcquired = new DicomTag(0x0018, 0x1022);
/** (0018,1023) VR=LO VM=1 Digital Image Format Acquired */
export const DigitalImageFormatAcquired = new DicomTag(0x0018, 0x1023);
/** (0018,1030) VR=LO VM=1 Protocol Name */
export const ProtocolName = new DicomTag(0x0018, 0x1030);
/** (0018,1040) VR=LO VM=1 Contrast/Bolus Route */
export const ContrastBolusRoute = new DicomTag(0x0018, 0x1040);
/** (0018,1041) VR=DS VM=1 Contrast/Bolus Volume */
export const ContrastBolusVolume = new DicomTag(0x0018, 0x1041);
/** (0018,1042) VR=TM VM=1 Contrast/Bolus Start Time */
export const ContrastBolusStartTime = new DicomTag(0x0018, 0x1042);
/** (0018,1043) VR=TM VM=1 Contrast/Bolus Stop Time */
export const ContrastBolusStopTime = new DicomTag(0x0018, 0x1043);
/** (0018,1044) VR=DS VM=1 Contrast/Bolus Total Dose */
export const ContrastBolusTotalDose = new DicomTag(0x0018, 0x1044);
/** (0018,1045) VR=IS VM=1 Syringe Counts */
export const SyringeCounts = new DicomTag(0x0018, 0x1045);
/** (0018,1046) VR=DS VM=1-n Contrast Flow Rate */
export const ContrastFlowRate = new DicomTag(0x0018, 0x1046);
/** (0018,1047) VR=DS VM=1-n Contrast Flow Duration */
export const ContrastFlowDuration = new DicomTag(0x0018, 0x1047);
/** (0018,1048) VR=CS VM=1 Contrast/Bolus Ingredient */
export const ContrastBolusIngredient = new DicomTag(0x0018, 0x1048);
/** (0018,1049) VR=DS VM=1 Contrast/Bolus Ingredient Concentration */
export const ContrastBolusIngredientConcentration = new DicomTag(0x0018, 0x1049);
/** (0018,1050) VR=DS VM=1 Spatial Resolution */
export const SpatialResolution = new DicomTag(0x0018, 0x1050);
/** (0018,1060) VR=DS VM=1 Trigger Time */
export const TriggerTime = new DicomTag(0x0018, 0x1060);
/** (0018,1061) VR=LO VM=1 Trigger Source or Type */
export const TriggerSourceOrType = new DicomTag(0x0018, 0x1061);
/** (0018,1062) VR=IS VM=1 Nominal Interval */
export const NominalInterval = new DicomTag(0x0018, 0x1062);
/** (0018,1063) VR=DS VM=1 Frame Time */
export const FrameTime = new DicomTag(0x0018, 0x1063);
/** (0018,1064) VR=LO VM=1 Cardiac Framing Type */
export const CardiacFramingType = new DicomTag(0x0018, 0x1064);
/** (0018,1065) VR=DS VM=1-n Frame Time Vector */
export const FrameTimeVector = new DicomTag(0x0018, 0x1065);
/** (0018,1066) VR=DS VM=1 Frame Delay */
export const FrameDelay = new DicomTag(0x0018, 0x1066);
/** (0018,1067) VR=DS VM=1 Image Trigger Delay */
export const ImageTriggerDelay = new DicomTag(0x0018, 0x1067);
/** (0018,1068) VR=DS VM=1 Multiplex Group Time Offset */
export const MultiplexGroupTimeOffset = new DicomTag(0x0018, 0x1068);
/** (0018,1069) VR=DS VM=1 Trigger Time Offset */
export const TriggerTimeOffset = new DicomTag(0x0018, 0x1069);
/** (0018,106A) VR=CS VM=1 Synchronization Trigger */
export const SynchronizationTrigger = new DicomTag(0x0018, 0x106A);
/** (0018,106C) VR=US VM=2 Synchronization Channel */
export const SynchronizationChannel = new DicomTag(0x0018, 0x106C);
/** (0018,106E) VR=UL VM=1 Trigger Sample Position */
export const TriggerSamplePosition = new DicomTag(0x0018, 0x106E);
/** (0018,1070) VR=LO VM=1 Radiopharmaceutical Route */
export const RadiopharmaceuticalRoute = new DicomTag(0x0018, 0x1070);
/** (0018,1071) VR=DS VM=1 Radiopharmaceutical Volume */
export const RadiopharmaceuticalVolume = new DicomTag(0x0018, 0x1071);
/** (0018,1072) VR=TM VM=1 Radiopharmaceutical Start Time */
export const RadiopharmaceuticalStartTime = new DicomTag(0x0018, 0x1072);
/** (0018,1073) VR=TM VM=1 Radiopharmaceutical Stop Time */
export const RadiopharmaceuticalStopTime = new DicomTag(0x0018, 0x1073);
/** (0018,1074) VR=DS VM=1 Radionuclide Total Dose */
export const RadionuclideTotalDose = new DicomTag(0x0018, 0x1074);
/** (0018,1075) VR=DS VM=1 Radionuclide Half Life */
export const RadionuclideHalfLife = new DicomTag(0x0018, 0x1075);
/** (0018,1076) VR=DS VM=1 Radionuclide Positron Fraction */
export const RadionuclidePositronFraction = new DicomTag(0x0018, 0x1076);
/** (0018,1077) VR=DS VM=1 Radiopharmaceutical Specific Activity */
export const RadiopharmaceuticalSpecificActivity = new DicomTag(0x0018, 0x1077);
/** (0018,1078) VR=DT VM=1 Radiopharmaceutical Start DateTime */
export const RadiopharmaceuticalStartDateTime = new DicomTag(0x0018, 0x1078);
/** (0018,1079) VR=DT VM=1 Radiopharmaceutical Stop DateTime */
export const RadiopharmaceuticalStopDateTime = new DicomTag(0x0018, 0x1079);
/** (0018,1080) VR=CS VM=1 Beat Rejection Flag */
export const BeatRejectionFlag = new DicomTag(0x0018, 0x1080);
/** (0018,1081) VR=IS VM=1 Low R-R Value */
export const LowRRValue = new DicomTag(0x0018, 0x1081);
/** (0018,1082) VR=IS VM=1 High R-R Value */
export const HighRRValue = new DicomTag(0x0018, 0x1082);
/** (0018,1083) VR=IS VM=1 Intervals Acquired */
export const IntervalsAcquired = new DicomTag(0x0018, 0x1083);
/** (0018,1084) VR=IS VM=1 Intervals Rejected */
export const IntervalsRejected = new DicomTag(0x0018, 0x1084);
/** (0018,1085) VR=LO VM=1 PVC Rejection */
export const PVCRejection = new DicomTag(0x0018, 0x1085);
/** (0018,1086) VR=IS VM=1 Skip Beats */
export const SkipBeats = new DicomTag(0x0018, 0x1086);
/** (0018,1088) VR=IS VM=1 Heart Rate */
export const HeartRate = new DicomTag(0x0018, 0x1088);
/** (0018,1090) VR=IS VM=1 Cardiac Number of Images */
export const CardiacNumberOfImages = new DicomTag(0x0018, 0x1090);
/** (0018,1094) VR=IS VM=1 Trigger Window */
export const TriggerWindow = new DicomTag(0x0018, 0x1094);
/** (0018,1100) VR=DS VM=1 Reconstruction Diameter */
export const ReconstructionDiameter = new DicomTag(0x0018, 0x1100);
/** (0018,1110) VR=DS VM=1 Distance Source to Detector */
export const DistanceSourceToDetector = new DicomTag(0x0018, 0x1110);
/** (0018,1111) VR=DS VM=1 Distance Source to Patient */
export const DistanceSourceToPatient = new DicomTag(0x0018, 0x1111);
/** (0018,1114) VR=DS VM=1 Estimated Radiographic Magnification Factor */
export const EstimatedRadiographicMagnificationFactor = new DicomTag(0x0018, 0x1114);
/** (0018,1120) VR=DS VM=1 Gantry/Detector Tilt */
export const GantryDetectorTilt = new DicomTag(0x0018, 0x1120);
/** (0018,1121) VR=DS VM=1 Gantry/Detector Slew */
export const GantryDetectorSlew = new DicomTag(0x0018, 0x1121);
/** (0018,1130) VR=DS VM=1 Table Height */
export const TableHeight = new DicomTag(0x0018, 0x1130);
/** (0018,1131) VR=DS VM=1 Table Traverse */
export const TableTraverse = new DicomTag(0x0018, 0x1131);
/** (0018,1134) VR=CS VM=1 Table Motion */
export const TableMotion = new DicomTag(0x0018, 0x1134);
/** (0018,1135) VR=DS VM=1-n Table Vertical Increment */
export const TableVerticalIncrement = new DicomTag(0x0018, 0x1135);
/** (0018,1136) VR=DS VM=1-n Table Lateral Increment */
export const TableLateralIncrement = new DicomTag(0x0018, 0x1136);
/** (0018,1137) VR=DS VM=1-n Table Longitudinal Increment */
export const TableLongitudinalIncrement = new DicomTag(0x0018, 0x1137);
/** (0018,1138) VR=DS VM=1 Table Angle */
export const TableAngle = new DicomTag(0x0018, 0x1138);
/** (0018,113A) VR=CS VM=1 Table Type */
export const TableType = new DicomTag(0x0018, 0x113A);
/** (0018,1140) VR=CS VM=1 Rotation Direction */
export const RotationDirection = new DicomTag(0x0018, 0x1140);
/** (0018,1141) VR=DS VM=1 Angular Position (Retired) */
export const AngularPosition = new DicomTag(0x0018, 0x1141);
/** (0018,1142) VR=DS VM=1-n Radial Position */
export const RadialPosition = new DicomTag(0x0018, 0x1142);
/** (0018,1143) VR=DS VM=1 Scan Arc */
export const ScanArc = new DicomTag(0x0018, 0x1143);
/** (0018,1144) VR=DS VM=1 Angular Step */
export const AngularStep = new DicomTag(0x0018, 0x1144);
/** (0018,1145) VR=DS VM=1 Center of Rotation Offset */
export const CenterOfRotationOffset = new DicomTag(0x0018, 0x1145);
/** (0018,1146) VR=DS VM=1-n Rotation Offset (Retired) */
export const RotationOffset = new DicomTag(0x0018, 0x1146);
/** (0018,1147) VR=CS VM=1 Field of View Shape */
export const FieldOfViewShape = new DicomTag(0x0018, 0x1147);
/** (0018,1149) VR=IS VM=1-2 Field of View Dimension(s) */
export const FieldOfViewDimensions = new DicomTag(0x0018, 0x1149);
/** (0018,1150) VR=IS VM=1 Exposure Time */
export const ExposureTime = new DicomTag(0x0018, 0x1150);
/** (0018,1151) VR=IS VM=1 X-Ray Tube Current */
export const XRayTubeCurrent = new DicomTag(0x0018, 0x1151);
/** (0018,1152) VR=IS VM=1 Exposure */
export const Exposure = new DicomTag(0x0018, 0x1152);
/** (0018,1153) VR=IS VM=1 Exposure in µAs */
export const ExposureInuAs = new DicomTag(0x0018, 0x1153);
/** (0018,1154) VR=DS VM=1 Average Pulse Width */
export const AveragePulseWidth = new DicomTag(0x0018, 0x1154);
/** (0018,1155) VR=CS VM=1 Radiation Setting */
export const RadiationSetting = new DicomTag(0x0018, 0x1155);
/** (0018,1156) VR=CS VM=1 Rectification Type */
export const RectificationType = new DicomTag(0x0018, 0x1156);
/** (0018,115A) VR=CS VM=1 Radiation Mode */
export const RadiationMode = new DicomTag(0x0018, 0x115A);
/** (0018,115E) VR=DS VM=1 Image and Fluoroscopy Area Dose Product */
export const ImageAndFluoroscopyAreaDoseProduct = new DicomTag(0x0018, 0x115E);
/** (0018,1160) VR=SH VM=1 Filter Type */
export const FilterType = new DicomTag(0x0018, 0x1160);
/** (0018,1161) VR=LO VM=1-n Type of Filters */
export const TypeOfFilters = new DicomTag(0x0018, 0x1161);
/** (0018,1162) VR=DS VM=1 Intensifier Size */
export const IntensifierSize = new DicomTag(0x0018, 0x1162);
/** (0018,1164) VR=DS VM=2 Imager Pixel Spacing */
export const ImagerPixelSpacing = new DicomTag(0x0018, 0x1164);
/** (0018,1166) VR=CS VM=1-n Grid */
export const Grid = new DicomTag(0x0018, 0x1166);
/** (0018,1170) VR=IS VM=1 Generator Power */
export const GeneratorPower = new DicomTag(0x0018, 0x1170);
/** (0018,1180) VR=SH VM=1 Collimator/grid Name */
export const CollimatorGridName = new DicomTag(0x0018, 0x1180);
/** (0018,1181) VR=CS VM=1 Collimator Type */
export const CollimatorType = new DicomTag(0x0018, 0x1181);
/** (0018,1182) VR=IS VM=1-2 Focal Distance */
export const FocalDistance = new DicomTag(0x0018, 0x1182);
/** (0018,1183) VR=DS VM=1-2 X Focus Center */
export const XFocusCenter = new DicomTag(0x0018, 0x1183);
/** (0018,1184) VR=DS VM=1-2 Y Focus Center */
export const YFocusCenter = new DicomTag(0x0018, 0x1184);
/** (0018,1190) VR=DS VM=1-n Focal Spot(s) */
export const FocalSpots = new DicomTag(0x0018, 0x1190);
/** (0018,1191) VR=CS VM=1 Anode Target Material */
export const AnodeTargetMaterial = new DicomTag(0x0018, 0x1191);
/** (0018,11A0) VR=DS VM=1 Body Part Thickness */
export const BodyPartThickness = new DicomTag(0x0018, 0x11A0);
/** (0018,11A2) VR=DS VM=1 Compression Force */
export const CompressionForce = new DicomTag(0x0018, 0x11A2);
/** (0018,11A3) VR=DS VM=1 Compression Pressure */
export const CompressionPressure = new DicomTag(0x0018, 0x11A3);
/** (0018,11A4) VR=LO VM=1 Paddle Description */
export const PaddleDescription = new DicomTag(0x0018, 0x11A4);
/** (0018,11A5) VR=DS VM=1 Compression Contact Area */
export const CompressionContactArea = new DicomTag(0x0018, 0x11A5);
/** (0018,11B0) VR=LO VM=1 Acquisition Mode */
export const AcquisitionMode = new DicomTag(0x0018, 0x11B0);
/** (0018,11B1) VR=LO VM=1 Dose Mode Name */
export const DoseModeName = new DicomTag(0x0018, 0x11B1);
/** (0018,11B2) VR=CS VM=1 Acquired Subtraction Mask Flag */
export const AcquiredSubtractionMaskFlag = new DicomTag(0x0018, 0x11B2);
/** (0018,11B3) VR=CS VM=1 Fluoroscopy Persistence Flag */
export const FluoroscopyPersistenceFlag = new DicomTag(0x0018, 0x11B3);
/** (0018,11B4) VR=CS VM=1 Fluoroscopy Last Image Hold Persistence Flag */
export const FluoroscopyLastImageHoldPersistenceFlag = new DicomTag(0x0018, 0x11B4);
/** (0018,11B5) VR=IS VM=1 Upper Limit Number Of Persistent Fluoroscopy Frames */
export const UpperLimitNumberOfPersistentFluoroscopyFrames = new DicomTag(0x0018, 0x11B5);
/** (0018,11B6) VR=CS VM=1 Contrast/Bolus Auto Injection Trigger Flag */
export const ContrastBolusAutoInjectionTriggerFlag = new DicomTag(0x0018, 0x11B6);
/** (0018,11B7) VR=FD VM=1 Contrast/Bolus Injection Delay */
export const ContrastBolusInjectionDelay = new DicomTag(0x0018, 0x11B7);
/** (0018,11B8) VR=SQ VM=1 XA Acquisition Phase Details Sequence */
export const XAAcquisitionPhaseDetailsSequence = new DicomTag(0x0018, 0x11B8);
/** (0018,11B9) VR=FD VM=1 XA Acquisition Frame Rate */
export const XAAcquisitionFrameRate = new DicomTag(0x0018, 0x11B9);
/** (0018,11BA) VR=SQ VM=1 XA Plane Details Sequence */
export const XAPlaneDetailsSequence = new DicomTag(0x0018, 0x11BA);
/** (0018,11BB) VR=LO VM=1 Acquisition Field of View Label */
export const AcquisitionFieldOfViewLabel = new DicomTag(0x0018, 0x11BB);
/** (0018,11BC) VR=SQ VM=1 X-Ray Filter Details Sequence */
export const XRayFilterDetailsSequence = new DicomTag(0x0018, 0x11BC);
/** (0018,11BD) VR=FD VM=1 XA Acquisition Duration */
export const XAAcquisitionDuration = new DicomTag(0x0018, 0x11BD);
/** (0018,11BE) VR=CS VM=1 Reconstruction Pipeline Type */
export const ReconstructionPipelineType = new DicomTag(0x0018, 0x11BE);
/** (0018,11BF) VR=SQ VM=1 Image Filter Details Sequence */
export const ImageFilterDetailsSequence = new DicomTag(0x0018, 0x11BF);
/** (0018,11C0) VR=CS VM=1 Applied Mask Subtraction Flag */
export const AppliedMaskSubtractionFlag = new DicomTag(0x0018, 0x11C0);
/** (0018,11C1) VR=SQ VM=1 Requested Series Description Code Sequence */
export const RequestedSeriesDescriptionCodeSequence = new DicomTag(0x0018, 0x11C1);
/** (0018,1200) VR=DA VM=1-n Date of Last Calibration */
export const DateOfLastCalibration = new DicomTag(0x0018, 0x1200);
/** (0018,1201) VR=TM VM=1-n Time of Last Calibration */
export const TimeOfLastCalibration = new DicomTag(0x0018, 0x1201);
/** (0018,1202) VR=DT VM=1 DateTime of Last Calibration */
export const DateTimeOfLastCalibration = new DicomTag(0x0018, 0x1202);
/** (0018,1203) VR=DT VM=1 Calibration DateTime */
export const CalibrationDateTime = new DicomTag(0x0018, 0x1203);
/** (0018,1204) VR=DA VM=1 Date of Manufacture */
export const DateOfManufacture = new DicomTag(0x0018, 0x1204);
/** (0018,1205) VR=DA VM=1 Date of Installation */
export const DateOfInstallation = new DicomTag(0x0018, 0x1205);
/** (0018,1210) VR=SH VM=1-n Convolution Kernel */
export const ConvolutionKernel = new DicomTag(0x0018, 0x1210);
/** (0018,1240) VR=IS VM=1-n Upper/Lower Pixel Values (Retired) */
export const UpperLowerPixelValues = new DicomTag(0x0018, 0x1240);
/** (0018,1242) VR=IS VM=1 Actual Frame Duration */
export const ActualFrameDuration = new DicomTag(0x0018, 0x1242);
/** (0018,1243) VR=IS VM=1 Count Rate */
export const CountRate = new DicomTag(0x0018, 0x1243);
/** (0018,1244) VR=US VM=1 Preferred Playback Sequencing */
export const PreferredPlaybackSequencing = new DicomTag(0x0018, 0x1244);
/** (0018,1250) VR=SH VM=1 Receive Coil Name */
export const ReceiveCoilName = new DicomTag(0x0018, 0x1250);
/** (0018,1251) VR=SH VM=1 Transmit Coil Name */
export const TransmitCoilName = new DicomTag(0x0018, 0x1251);
/** (0018,1260) VR=SH VM=1 Plate Type */
export const PlateType = new DicomTag(0x0018, 0x1260);
/** (0018,1261) VR=LO VM=1 Phosphor Type */
export const PhosphorType = new DicomTag(0x0018, 0x1261);
/** (0018,1271) VR=FD VM=1 Water Equivalent Diameter */
export const WaterEquivalentDiameter = new DicomTag(0x0018, 0x1271);
/** (0018,1272) VR=SQ VM=1 Water Equivalent Diameter Calculation Method Code Sequence */
export const WaterEquivalentDiameterCalculationMethodCodeSequence = new DicomTag(0x0018, 0x1272);
/** (0018,1300) VR=DS VM=1 Scan Velocity */
export const ScanVelocity = new DicomTag(0x0018, 0x1300);
/** (0018,1301) VR=CS VM=1-n Whole Body Technique */
export const WholeBodyTechnique = new DicomTag(0x0018, 0x1301);
/** (0018,1302) VR=IS VM=1 Scan Length */
export const ScanLength = new DicomTag(0x0018, 0x1302);
/** (0018,1310) VR=US VM=4 Acquisition Matrix */
export const AcquisitionMatrix = new DicomTag(0x0018, 0x1310);
/** (0018,1312) VR=CS VM=1 In-plane Phase Encoding Direction */
export const InPlanePhaseEncodingDirection = new DicomTag(0x0018, 0x1312);
/** (0018,1314) VR=DS VM=1 Flip Angle */
export const FlipAngle = new DicomTag(0x0018, 0x1314);
/** (0018,1315) VR=CS VM=1 Variable Flip Angle Flag */
export const VariableFlipAngleFlag = new DicomTag(0x0018, 0x1315);
/** (0018,1316) VR=DS VM=1 SAR */
export const SAR = new DicomTag(0x0018, 0x1316);
/** (0018,1318) VR=DS VM=1 dB/dt */
export const dBdt = new DicomTag(0x0018, 0x1318);
/** (0018,1320) VR=FL VM=1 B1rms */
export const B1rms = new DicomTag(0x0018, 0x1320);
/** (0018,1400) VR=LO VM=1 Acquisition Device Processing Description */
export const AcquisitionDeviceProcessingDescription = new DicomTag(0x0018, 0x1400);
/** (0018,1401) VR=LO VM=1 Acquisition Device Processing Code */
export const AcquisitionDeviceProcessingCode = new DicomTag(0x0018, 0x1401);
/** (0018,1402) VR=CS VM=1 Cassette Orientation */
export const CassetteOrientation = new DicomTag(0x0018, 0x1402);
/** (0018,1403) VR=CS VM=1 Cassette Size */
export const CassetteSize = new DicomTag(0x0018, 0x1403);
/** (0018,1404) VR=US VM=1 Exposures on Plate */
export const ExposuresOnPlate = new DicomTag(0x0018, 0x1404);
/** (0018,1405) VR=IS VM=1 Relative X-Ray Exposure */
export const RelativeXRayExposure = new DicomTag(0x0018, 0x1405);
/** (0018,1411) VR=DS VM=1 Exposure Index */
export const ExposureIndex = new DicomTag(0x0018, 0x1411);
/** (0018,1412) VR=DS VM=1 Target Exposure Index */
export const TargetExposureIndex = new DicomTag(0x0018, 0x1412);
/** (0018,1413) VR=DS VM=1 Deviation Index */
export const DeviationIndex = new DicomTag(0x0018, 0x1413);
/** (0018,1450) VR=DS VM=1 Column Angulation */
export const ColumnAngulation = new DicomTag(0x0018, 0x1450);
/** (0018,1460) VR=DS VM=1 Tomo Layer Height */
export const TomoLayerHeight = new DicomTag(0x0018, 0x1460);
/** (0018,1470) VR=DS VM=1 Tomo Angle */
export const TomoAngle = new DicomTag(0x0018, 0x1470);
/** (0018,1480) VR=DS VM=1 Tomo Time */
export const TomoTime = new DicomTag(0x0018, 0x1480);
/** (0018,1490) VR=CS VM=1 Tomo Type */
export const TomoType = new DicomTag(0x0018, 0x1490);
/** (0018,1491) VR=CS VM=1 Tomo Class */
export const TomoClass = new DicomTag(0x0018, 0x1491);
/** (0018,1495) VR=IS VM=1 Number of Tomosynthesis Source Images */
export const NumberOfTomosynthesisSourceImages = new DicomTag(0x0018, 0x1495);
/** (0018,1500) VR=CS VM=1 Positioner Motion */
export const PositionerMotion = new DicomTag(0x0018, 0x1500);
/** (0018,1508) VR=CS VM=1 Positioner Type */
export const PositionerType = new DicomTag(0x0018, 0x1508);
/** (0018,1510) VR=DS VM=1 Positioner Primary Angle */
export const PositionerPrimaryAngle = new DicomTag(0x0018, 0x1510);
/** (0018,1511) VR=DS VM=1 Positioner Secondary Angle */
export const PositionerSecondaryAngle = new DicomTag(0x0018, 0x1511);
/** (0018,1520) VR=DS VM=1-n Positioner Primary Angle Increment */
export const PositionerPrimaryAngleIncrement = new DicomTag(0x0018, 0x1520);
/** (0018,1521) VR=DS VM=1-n Positioner Secondary Angle Increment */
export const PositionerSecondaryAngleIncrement = new DicomTag(0x0018, 0x1521);
/** (0018,1530) VR=DS VM=1 Detector Primary Angle */
export const DetectorPrimaryAngle = new DicomTag(0x0018, 0x1530);
/** (0018,1531) VR=DS VM=1 Detector Secondary Angle */
export const DetectorSecondaryAngle = new DicomTag(0x0018, 0x1531);
/** (0018,1600) VR=CS VM=1-3 Shutter Shape */
export const ShutterShape = new DicomTag(0x0018, 0x1600);
/** (0018,1602) VR=IS VM=1 Shutter Left Vertical Edge */
export const ShutterLeftVerticalEdge = new DicomTag(0x0018, 0x1602);
/** (0018,1604) VR=IS VM=1 Shutter Right Vertical Edge */
export const ShutterRightVerticalEdge = new DicomTag(0x0018, 0x1604);
/** (0018,1606) VR=IS VM=1 Shutter Upper Horizontal Edge */
export const ShutterUpperHorizontalEdge = new DicomTag(0x0018, 0x1606);
/** (0018,1608) VR=IS VM=1 Shutter Lower Horizontal Edge */
export const ShutterLowerHorizontalEdge = new DicomTag(0x0018, 0x1608);
/** (0018,1610) VR=IS VM=2 Center of Circular Shutter */
export const CenterOfCircularShutter = new DicomTag(0x0018, 0x1610);
/** (0018,1612) VR=IS VM=1 Radius of Circular Shutter */
export const RadiusOfCircularShutter = new DicomTag(0x0018, 0x1612);
/** (0018,1620) VR=IS VM=2-2n Vertices of the Polygonal Shutter */
export const VerticesOfThePolygonalShutter = new DicomTag(0x0018, 0x1620);
/** (0018,1622) VR=US VM=1 Shutter Presentation Value */
export const ShutterPresentationValue = new DicomTag(0x0018, 0x1622);
/** (0018,1623) VR=US VM=1 Shutter Overlay Group */
export const ShutterOverlayGroup = new DicomTag(0x0018, 0x1623);
/** (0018,1624) VR=US VM=3 Shutter Presentation Color CIELab Value */
export const ShutterPresentationColorCIELabValue = new DicomTag(0x0018, 0x1624);
/** (0018,1630) VR=CS VM=1 Outline Shape Type */
export const OutlineShapeType = new DicomTag(0x0018, 0x1630);
/** (0018,1631) VR=FD VM=1 Outline Left Vertical Edge */
export const OutlineLeftVerticalEdge = new DicomTag(0x0018, 0x1631);
/** (0018,1632) VR=FD VM=1 Outline Right Vertical Edge */
export const OutlineRightVerticalEdge = new DicomTag(0x0018, 0x1632);
/** (0018,1633) VR=FD VM=1 Outline Upper Horizontal Edge */
export const OutlineUpperHorizontalEdge = new DicomTag(0x0018, 0x1633);
/** (0018,1634) VR=FD VM=1 Outline Lower Horizontal Edge */
export const OutlineLowerHorizontalEdge = new DicomTag(0x0018, 0x1634);
/** (0018,1635) VR=FD VM=2 Center of Circular Outline */
export const CenterOfCircularOutline = new DicomTag(0x0018, 0x1635);
/** (0018,1636) VR=FD VM=1 Diameter of Circular Outline */
export const DiameterOfCircularOutline = new DicomTag(0x0018, 0x1636);
/** (0018,1637) VR=UL VM=1 Number of Polygonal Vertices */
export const NumberOfPolygonalVertices = new DicomTag(0x0018, 0x1637);
/** (0018,1638) VR=OF VM=1 Vertices of the Polygonal Outline */
export const VerticesOfThePolygonalOutline = new DicomTag(0x0018, 0x1638);
/** (0018,1700) VR=CS VM=1-3 Collimator Shape */
export const CollimatorShape = new DicomTag(0x0018, 0x1700);
/** (0018,1702) VR=IS VM=1 Collimator Left Vertical Edge */
export const CollimatorLeftVerticalEdge = new DicomTag(0x0018, 0x1702);
/** (0018,1704) VR=IS VM=1 Collimator Right Vertical Edge */
export const CollimatorRightVerticalEdge = new DicomTag(0x0018, 0x1704);
/** (0018,1706) VR=IS VM=1 Collimator Upper Horizontal Edge */
export const CollimatorUpperHorizontalEdge = new DicomTag(0x0018, 0x1706);
/** (0018,1708) VR=IS VM=1 Collimator Lower Horizontal Edge */
export const CollimatorLowerHorizontalEdge = new DicomTag(0x0018, 0x1708);
/** (0018,1710) VR=IS VM=2 Center of Circular Collimator */
export const CenterOfCircularCollimator = new DicomTag(0x0018, 0x1710);
/** (0018,1712) VR=IS VM=1 Radius of Circular Collimator */
export const RadiusOfCircularCollimator = new DicomTag(0x0018, 0x1712);
/** (0018,1720) VR=IS VM=2-2n Vertices of the Polygonal Collimator */
export const VerticesOfThePolygonalCollimator = new DicomTag(0x0018, 0x1720);
/** (0018,1800) VR=CS VM=1 Acquisition Time Synchronized */
export const AcquisitionTimeSynchronized = new DicomTag(0x0018, 0x1800);
/** (0018,1801) VR=SH VM=1 Time Source */
export const TimeSource = new DicomTag(0x0018, 0x1801);
/** (0018,1802) VR=CS VM=1 Time Distribution Protocol */
export const TimeDistributionProtocol = new DicomTag(0x0018, 0x1802);
/** (0018,1803) VR=LO VM=1 NTP Source Address */
export const NTPSourceAddress = new DicomTag(0x0018, 0x1803);
/** (0018,2001) VR=IS VM=1-n Page Number Vector */
export const PageNumberVector = new DicomTag(0x0018, 0x2001);
/** (0018,2002) VR=SH VM=1-n Frame Label Vector */
export const FrameLabelVector = new DicomTag(0x0018, 0x2002);
/** (0018,2003) VR=DS VM=1-n Frame Primary Angle Vector */
export const FramePrimaryAngleVector = new DicomTag(0x0018, 0x2003);
/** (0018,2004) VR=DS VM=1-n Frame Secondary Angle Vector */
export const FrameSecondaryAngleVector = new DicomTag(0x0018, 0x2004);
/** (0018,2005) VR=DS VM=1-n Slice Location Vector */
export const SliceLocationVector = new DicomTag(0x0018, 0x2005);
/** (0018,2006) VR=SH VM=1-n Display Window Label Vector */
export const DisplayWindowLabelVector = new DicomTag(0x0018, 0x2006);
/** (0018,2010) VR=DS VM=2 Nominal Scanned Pixel Spacing */
export const NominalScannedPixelSpacing = new DicomTag(0x0018, 0x2010);
/** (0018,2020) VR=CS VM=1 Digitizing Device Transport Direction */
export const DigitizingDeviceTransportDirection = new DicomTag(0x0018, 0x2020);
/** (0018,2030) VR=DS VM=1 Rotation of Scanned Film */
export const RotationOfScannedFilm = new DicomTag(0x0018, 0x2030);
/** (0018,2041) VR=SQ VM=1 Biopsy Target Sequence */
export const BiopsyTargetSequence = new DicomTag(0x0018, 0x2041);
/** (0018,2042) VR=UI VM=1 Target UID */
export const TargetUID = new DicomTag(0x0018, 0x2042);
/** (0018,2043) VR=FL VM=2 Localizing Cursor Position */
export const LocalizingCursorPosition = new DicomTag(0x0018, 0x2043);
/** (0018,2044) VR=FL VM=3 Calculated Target Position */
export const CalculatedTargetPosition = new DicomTag(0x0018, 0x2044);
/** (0018,2045) VR=SH VM=1 Target Label */
export const TargetLabel = new DicomTag(0x0018, 0x2045);
/** (0018,2046) VR=FL VM=1 Displayed Z Value */
export const DisplayedZValue = new DicomTag(0x0018, 0x2046);
/** (0018,3100) VR=CS VM=1 IVUS Acquisition */
export const IVUSAcquisition = new DicomTag(0x0018, 0x3100);
/** (0018,3101) VR=DS VM=1 IVUS Pullback Rate */
export const IVUSPullbackRate = new DicomTag(0x0018, 0x3101);
/** (0018,3102) VR=DS VM=1 IVUS Gated Rate */
export const IVUSGatedRate = new DicomTag(0x0018, 0x3102);
/** (0018,3103) VR=IS VM=1 IVUS Pullback Start Frame Number */
export const IVUSPullbackStartFrameNumber = new DicomTag(0x0018, 0x3103);
/** (0018,3104) VR=IS VM=1 IVUS Pullback Stop Frame Number */
export const IVUSPullbackStopFrameNumber = new DicomTag(0x0018, 0x3104);
/** (0018,3105) VR=IS VM=1-n Lesion Number */
export const LesionNumber = new DicomTag(0x0018, 0x3105);
/** (0018,4000) VR=LT VM=1 Acquisition Comments (Retired) */
export const AcquisitionComments = new DicomTag(0x0018, 0x4000);
/** (0018,5000) VR=SH VM=1-n Output Power */
export const OutputPower = new DicomTag(0x0018, 0x5000);
/** (0018,5010) VR=LO VM=1-n Transducer Data */
export const TransducerData = new DicomTag(0x0018, 0x5010);
/** (0018,5011) VR=SQ VM=1 Transducer Identification Sequence */
export const TransducerIdentificationSequence = new DicomTag(0x0018, 0x5011);
/** (0018,5012) VR=DS VM=1 Focus Depth */
export const FocusDepth = new DicomTag(0x0018, 0x5012);
/** (0018,5020) VR=LO VM=1 Processing Function */
export const ProcessingFunction = new DicomTag(0x0018, 0x5020);
/** (0018,5021) VR=LO VM=1 Postprocessing Function (Retired) */
export const PostprocessingFunction = new DicomTag(0x0018, 0x5021);
/** (0018,5022) VR=DS VM=1 Mechanical Index */
export const MechanicalIndex = new DicomTag(0x0018, 0x5022);
/** (0018,5024) VR=DS VM=1 Bone Thermal Index */
export const BoneThermalIndex = new DicomTag(0x0018, 0x5024);
/** (0018,5026) VR=DS VM=1 Cranial Thermal Index */
export const CranialThermalIndex = new DicomTag(0x0018, 0x5026);
/** (0018,5027) VR=DS VM=1 Soft Tissue Thermal Index */
export const SoftTissueThermalIndex = new DicomTag(0x0018, 0x5027);
/** (0018,5028) VR=DS VM=1 Soft Tissue-focus Thermal Index */
export const SoftTissueFocusThermalIndex = new DicomTag(0x0018, 0x5028);
/** (0018,5029) VR=DS VM=1 Soft Tissue-surface Thermal Index */
export const SoftTissueSurfaceThermalIndex = new DicomTag(0x0018, 0x5029);
/** (0018,5030) VR=DS VM=1 Dynamic Range (Retired) */
export const DynamicRange = new DicomTag(0x0018, 0x5030);
/** (0018,5040) VR=DS VM=1 Total Gain (Retired) */
export const TotalGain = new DicomTag(0x0018, 0x5040);
/** (0018,5050) VR=IS VM=1 Depth of Scan Field */
export const DepthOfScanField = new DicomTag(0x0018, 0x5050);
/** (0018,5100) VR=CS VM=1 Patient Position */
export const PatientPosition = new DicomTag(0x0018, 0x5100);
/** (0018,5101) VR=CS VM=1 View Position */
export const ViewPosition = new DicomTag(0x0018, 0x5101);
/** (0018,5104) VR=SQ VM=1 Projection Eponymous Name Code Sequence */
export const ProjectionEponymousNameCodeSequence = new DicomTag(0x0018, 0x5104);
/** (0018,5210) VR=DS VM=6 Image Transformation Matrix (Retired) */
export const ImageTransformationMatrix = new DicomTag(0x0018, 0x5210);
/** (0018,5212) VR=DS VM=3 Image Translation Vector (Retired) */
export const ImageTranslationVector = new DicomTag(0x0018, 0x5212);
/** (0018,6000) VR=DS VM=1 Sensitivity */
export const Sensitivity = new DicomTag(0x0018, 0x6000);
/** (0018,6011) VR=SQ VM=1 Sequence of Ultrasound Regions */
export const SequenceOfUltrasoundRegions = new DicomTag(0x0018, 0x6011);
/** (0018,6012) VR=US VM=1 Region Spatial Format */
export const RegionSpatialFormat = new DicomTag(0x0018, 0x6012);
/** (0018,6014) VR=US VM=1 Region Data Type */
export const RegionDataType = new DicomTag(0x0018, 0x6014);
/** (0018,6016) VR=UL VM=1 Region Flags */
export const RegionFlags = new DicomTag(0x0018, 0x6016);
/** (0018,6018) VR=UL VM=1 Region Location Min X0 */
export const RegionLocationMinX0 = new DicomTag(0x0018, 0x6018);
/** (0018,601A) VR=UL VM=1 Region Location Min Y0 */
export const RegionLocationMinY0 = new DicomTag(0x0018, 0x601A);
/** (0018,601C) VR=UL VM=1 Region Location Max X1 */
export const RegionLocationMaxX1 = new DicomTag(0x0018, 0x601C);
/** (0018,601E) VR=UL VM=1 Region Location Max Y1 */
export const RegionLocationMaxY1 = new DicomTag(0x0018, 0x601E);
/** (0018,6020) VR=SL VM=1 Reference Pixel X0 */
export const ReferencePixelX0 = new DicomTag(0x0018, 0x6020);
/** (0018,6022) VR=SL VM=1 Reference Pixel Y0 */
export const ReferencePixelY0 = new DicomTag(0x0018, 0x6022);
/** (0018,6024) VR=US VM=1 Physical Units X Direction */
export const PhysicalUnitsXDirection = new DicomTag(0x0018, 0x6024);
/** (0018,6026) VR=US VM=1 Physical Units Y Direction */
export const PhysicalUnitsYDirection = new DicomTag(0x0018, 0x6026);
/** (0018,6028) VR=FD VM=1 Reference Pixel Physical Value X */
export const ReferencePixelPhysicalValueX = new DicomTag(0x0018, 0x6028);
/** (0018,602A) VR=FD VM=1 Reference Pixel Physical Value Y */
export const ReferencePixelPhysicalValueY = new DicomTag(0x0018, 0x602A);
/** (0018,602C) VR=FD VM=1 Physical Delta X */
export const PhysicalDeltaX = new DicomTag(0x0018, 0x602C);
/** (0018,602E) VR=FD VM=1 Physical Delta Y */
export const PhysicalDeltaY = new DicomTag(0x0018, 0x602E);
/** (0018,6030) VR=UL VM=1 Transducer Frequency */
export const TransducerFrequency = new DicomTag(0x0018, 0x6030);
/** (0018,6031) VR=CS VM=1 Transducer Type */
export const TransducerType = new DicomTag(0x0018, 0x6031);
/** (0018,6032) VR=UL VM=1 Pulse Repetition Frequency */
export const PulseRepetitionFrequency = new DicomTag(0x0018, 0x6032);
/** (0018,6034) VR=FD VM=1 Doppler Correction Angle */
export const DopplerCorrectionAngle = new DicomTag(0x0018, 0x6034);
/** (0018,6036) VR=FD VM=1 Steering Angle */
export const SteeringAngle = new DicomTag(0x0018, 0x6036);
/** (0018,6038) VR=UL VM=1 Doppler Sample Volume X Position (Retired) (Retired) */
export const DopplerSampleVolumeXPositionRetired = new DicomTag(0x0018, 0x6038);
/** (0018,6039) VR=SL VM=1 Doppler Sample Volume X Position */
export const DopplerSampleVolumeXPosition = new DicomTag(0x0018, 0x6039);
/** (0018,603A) VR=UL VM=1 Doppler Sample Volume Y Position (Retired) (Retired) */
export const DopplerSampleVolumeYPositionRetired = new DicomTag(0x0018, 0x603A);
/** (0018,603B) VR=SL VM=1 Doppler Sample Volume Y Position */
export const DopplerSampleVolumeYPosition = new DicomTag(0x0018, 0x603B);
/** (0018,603C) VR=UL VM=1 TM-Line Position X0 (Retired) (Retired) */
export const TMLinePositionX0Retired = new DicomTag(0x0018, 0x603C);
/** (0018,603D) VR=SL VM=1 TM-Line Position X0 */
export const TMLinePositionX0 = new DicomTag(0x0018, 0x603D);
/** (0018,603E) VR=UL VM=1 TM-Line Position Y0 (Retired) (Retired) */
export const TMLinePositionY0Retired = new DicomTag(0x0018, 0x603E);
/** (0018,603F) VR=SL VM=1 TM-Line Position Y0 */
export const TMLinePositionY0 = new DicomTag(0x0018, 0x603F);
/** (0018,6040) VR=UL VM=1 TM-Line Position X1 (Retired) (Retired) */
export const TMLinePositionX1Retired = new DicomTag(0x0018, 0x6040);
/** (0018,6041) VR=SL VM=1 TM-Line Position X1 */
export const TMLinePositionX1 = new DicomTag(0x0018, 0x6041);
/** (0018,6042) VR=UL VM=1 TM-Line Position Y1 (Retired) (Retired) */
export const TMLinePositionY1Retired = new DicomTag(0x0018, 0x6042);
/** (0018,6043) VR=SL VM=1 TM-Line Position Y1 */
export const TMLinePositionY1 = new DicomTag(0x0018, 0x6043);
/** (0018,6044) VR=US VM=1 Pixel Component Organization */
export const PixelComponentOrganization = new DicomTag(0x0018, 0x6044);
/** (0018,6046) VR=UL VM=1 Pixel Component Mask */
export const PixelComponentMask = new DicomTag(0x0018, 0x6046);
/** (0018,6048) VR=UL VM=1 Pixel Component Range Start */
export const PixelComponentRangeStart = new DicomTag(0x0018, 0x6048);
/** (0018,604A) VR=UL VM=1 Pixel Component Range Stop */
export const PixelComponentRangeStop = new DicomTag(0x0018, 0x604A);
/** (0018,604C) VR=US VM=1 Pixel Component Physical Units */
export const PixelComponentPhysicalUnits = new DicomTag(0x0018, 0x604C);
/** (0018,604E) VR=US VM=1 Pixel Component Data Type */
export const PixelComponentDataType = new DicomTag(0x0018, 0x604E);
/** (0018,6050) VR=UL VM=1 Number of Table Break Points */
export const NumberOfTableBreakPoints = new DicomTag(0x0018, 0x6050);
/** (0018,6052) VR=UL VM=1-n Table of X Break Points */
export const TableOfXBreakPoints = new DicomTag(0x0018, 0x6052);
/** (0018,6054) VR=FD VM=1-n Table of Y Break Points */
export const TableOfYBreakPoints = new DicomTag(0x0018, 0x6054);
/** (0018,6056) VR=UL VM=1 Number of Table Entries */
export const NumberOfTableEntries = new DicomTag(0x0018, 0x6056);
/** (0018,6058) VR=UL VM=1-n Table of Pixel Values */
export const TableOfPixelValues = new DicomTag(0x0018, 0x6058);
/** (0018,605A) VR=FL VM=1-n Table of Parameter Values */
export const TableOfParameterValues = new DicomTag(0x0018, 0x605A);
/** (0018,6060) VR=FL VM=1-n R Wave Time Vector */
export const RWaveTimeVector = new DicomTag(0x0018, 0x6060);
/** (0018,6070) VR=US VM=1 Active Image Area Overlay Group */
export const ActiveImageAreaOverlayGroup = new DicomTag(0x0018, 0x6070);
/** (0018,7000) VR=CS VM=1 Detector Conditions Nominal Flag */
export const DetectorConditionsNominalFlag = new DicomTag(0x0018, 0x7000);
/** (0018,7001) VR=DS VM=1 Detector Temperature */
export const DetectorTemperature = new DicomTag(0x0018, 0x7001);
/** (0018,7004) VR=CS VM=1 Detector Type */
export const DetectorType = new DicomTag(0x0018, 0x7004);
/** (0018,7005) VR=CS VM=1 Detector Configuration */
export const DetectorConfiguration = new DicomTag(0x0018, 0x7005);
/** (0018,7006) VR=LT VM=1 Detector Description */
export const DetectorDescription = new DicomTag(0x0018, 0x7006);
/** (0018,7008) VR=LT VM=1 Detector Mode */
export const DetectorMode = new DicomTag(0x0018, 0x7008);
/** (0018,700A) VR=SH VM=1 Detector ID */
export const DetectorID = new DicomTag(0x0018, 0x700A);
/** (0018,700C) VR=DA VM=1 Date of Last Detector Calibration */
export const DateOfLastDetectorCalibration = new DicomTag(0x0018, 0x700C);
/** (0018,700E) VR=TM VM=1 Time of Last Detector Calibration */
export const TimeOfLastDetectorCalibration = new DicomTag(0x0018, 0x700E);
/** (0018,7010) VR=IS VM=1 Exposures on Detector Since Last Calibration */
export const ExposuresOnDetectorSinceLastCalibration = new DicomTag(0x0018, 0x7010);
/** (0018,7011) VR=IS VM=1 Exposures on Detector Since Manufactured */
export const ExposuresOnDetectorSinceManufactured = new DicomTag(0x0018, 0x7011);
/** (0018,7012) VR=DS VM=1 Detector Time Since Last Exposure */
export const DetectorTimeSinceLastExposure = new DicomTag(0x0018, 0x7012);
/** (0018,7014) VR=DS VM=1 Detector Active Time */
export const DetectorActiveTime = new DicomTag(0x0018, 0x7014);
/** (0018,7016) VR=DS VM=1 Detector Activation Offset From Exposure */
export const DetectorActivationOffsetFromExposure = new DicomTag(0x0018, 0x7016);
/** (0018,701A) VR=DS VM=2 Detector Binning */
export const DetectorBinning = new DicomTag(0x0018, 0x701A);
/** (0018,7020) VR=DS VM=2 Detector Element Physical Size */
export const DetectorElementPhysicalSize = new DicomTag(0x0018, 0x7020);
/** (0018,7022) VR=DS VM=2 Detector Element Spacing */
export const DetectorElementSpacing = new DicomTag(0x0018, 0x7022);
/** (0018,7024) VR=CS VM=1 Detector Active Shape */
export const DetectorActiveShape = new DicomTag(0x0018, 0x7024);
/** (0018,7026) VR=DS VM=1-2 Detector Active Dimension(s) */
export const DetectorActiveDimensions = new DicomTag(0x0018, 0x7026);
/** (0018,7028) VR=DS VM=2 Detector Active Origin */
export const DetectorActiveOrigin = new DicomTag(0x0018, 0x7028);
/** (0018,702A) VR=LO VM=1 Detector Manufacturer Name */
export const DetectorManufacturerName = new DicomTag(0x0018, 0x702A);
/** (0018,702B) VR=LO VM=1 Detector Manufacturer's Model Name */
export const DetectorManufacturerModelName = new DicomTag(0x0018, 0x702B);
/** (0018,7030) VR=DS VM=2 Field of View Origin */
export const FieldOfViewOrigin = new DicomTag(0x0018, 0x7030);
/** (0018,7032) VR=DS VM=1 Field of View Rotation */
export const FieldOfViewRotation = new DicomTag(0x0018, 0x7032);
/** (0018,7034) VR=CS VM=1 Field of View Horizontal Flip */
export const FieldOfViewHorizontalFlip = new DicomTag(0x0018, 0x7034);
/** (0018,7036) VR=FL VM=2 Pixel Data Area Origin Relative To FOV */
export const PixelDataAreaOriginRelativeToFOV = new DicomTag(0x0018, 0x7036);
/** (0018,7038) VR=FL VM=1 Pixel Data Area Rotation Angle Relative To FOV */
export const PixelDataAreaRotationAngleRelativeToFOV = new DicomTag(0x0018, 0x7038);
/** (0018,7040) VR=LT VM=1 Grid Absorbing Material */
export const GridAbsorbingMaterial = new DicomTag(0x0018, 0x7040);
/** (0018,7041) VR=LT VM=1 Grid Spacing Material */
export const GridSpacingMaterial = new DicomTag(0x0018, 0x7041);
/** (0018,7042) VR=DS VM=1 Grid Thickness */
export const GridThickness = new DicomTag(0x0018, 0x7042);
/** (0018,7044) VR=DS VM=1 Grid Pitch */
export const GridPitch = new DicomTag(0x0018, 0x7044);
/** (0018,7046) VR=IS VM=2 Grid Aspect Ratio */
export const GridAspectRatio = new DicomTag(0x0018, 0x7046);
/** (0018,7048) VR=DS VM=1 Grid Period */
export const GridPeriod = new DicomTag(0x0018, 0x7048);
/** (0018,704C) VR=DS VM=1 Grid Focal Distance */
export const GridFocalDistance = new DicomTag(0x0018, 0x704C);
/** (0018,7050) VR=CS VM=1-n Filter Material */
export const FilterMaterial = new DicomTag(0x0018, 0x7050);
/** (0018,7052) VR=DS VM=1-n Filter Thickness Minimum */
export const FilterThicknessMinimum = new DicomTag(0x0018, 0x7052);
/** (0018,7054) VR=DS VM=1-n Filter Thickness Maximum */
export const FilterThicknessMaximum = new DicomTag(0x0018, 0x7054);
/** (0018,7056) VR=FL VM=1-n Filter Beam Path Length Minimum */
export const FilterBeamPathLengthMinimum = new DicomTag(0x0018, 0x7056);
/** (0018,7058) VR=FL VM=1-n Filter Beam Path Length Maximum */
export const FilterBeamPathLengthMaximum = new DicomTag(0x0018, 0x7058);
/** (0018,7060) VR=CS VM=1 Exposure Control Mode */
export const ExposureControlMode = new DicomTag(0x0018, 0x7060);
/** (0018,7062) VR=LT VM=1 Exposure Control Mode Description */
export const ExposureControlModeDescription = new DicomTag(0x0018, 0x7062);
/** (0018,7064) VR=CS VM=1 Exposure Status */
export const ExposureStatus = new DicomTag(0x0018, 0x7064);
/** (0018,7065) VR=DS VM=1 Phototimer Setting */
export const PhototimerSetting = new DicomTag(0x0018, 0x7065);
/** (0018,8150) VR=DS VM=1 Exposure Time in µS */
export const ExposureTimeInuS = new DicomTag(0x0018, 0x8150);
/** (0018,8151) VR=DS VM=1 X-Ray Tube Current in µA */
export const XRayTubeCurrentInuA = new DicomTag(0x0018, 0x8151);
/** (0018,9004) VR=CS VM=1 Content Qualification */
export const ContentQualification = new DicomTag(0x0018, 0x9004);
/** (0018,9005) VR=SH VM=1 Pulse Sequence Name */
export const PulseSequenceName = new DicomTag(0x0018, 0x9005);
/** (0018,9006) VR=SQ VM=1 MR Imaging Modifier Sequence */
export const MRImagingModifierSequence = new DicomTag(0x0018, 0x9006);
/** (0018,9008) VR=CS VM=1 Echo Pulse Sequence */
export const EchoPulseSequence = new DicomTag(0x0018, 0x9008);
/** (0018,9009) VR=CS VM=1 Inversion Recovery */
export const InversionRecovery = new DicomTag(0x0018, 0x9009);
/** (0018,9010) VR=CS VM=1 Flow Compensation */
export const FlowCompensation = new DicomTag(0x0018, 0x9010);
/** (0018,9011) VR=CS VM=1 Multiple Spin Echo */
export const MultipleSpinEcho = new DicomTag(0x0018, 0x9011);
/** (0018,9012) VR=CS VM=1 Multi-planar Excitation */
export const MultiPlanarExcitation = new DicomTag(0x0018, 0x9012);
/** (0018,9014) VR=CS VM=1 Phase Contrast */
export const PhaseContrast = new DicomTag(0x0018, 0x9014);
/** (0018,9015) VR=CS VM=1 Time of Flight Contrast */
export const TimeOfFlightContrast = new DicomTag(0x0018, 0x9015);
/** (0018,9016) VR=CS VM=1 Spoiling */
export const Spoiling = new DicomTag(0x0018, 0x9016);
/** (0018,9017) VR=CS VM=1 Steady State Pulse Sequence */
export const SteadyStatePulseSequence = new DicomTag(0x0018, 0x9017);
/** (0018,9018) VR=CS VM=1 Echo Planar Pulse Sequence */
export const EchoPlanarPulseSequence = new DicomTag(0x0018, 0x9018);
/** (0018,9019) VR=FD VM=1 Tag Angle First Axis */
export const TagAngleFirstAxis = new DicomTag(0x0018, 0x9019);
/** (0018,9020) VR=CS VM=1 Magnetization Transfer */
export const MagnetizationTransfer = new DicomTag(0x0018, 0x9020);
/** (0018,9021) VR=CS VM=1 T2 Preparation */
export const T2Preparation = new DicomTag(0x0018, 0x9021);
/** (0018,9022) VR=CS VM=1 Blood Signal Nulling */
export const BloodSignalNulling = new DicomTag(0x0018, 0x9022);
/** (0018,9024) VR=CS VM=1 Saturation Recovery */
export const SaturationRecovery = new DicomTag(0x0018, 0x9024);
/** (0018,9025) VR=CS VM=1 Spectrally Selected Suppression */
export const SpectrallySelectedSuppression = new DicomTag(0x0018, 0x9025);
/** (0018,9026) VR=CS VM=1 Spectrally Selected Excitation */
export const SpectrallySelectedExcitation = new DicomTag(0x0018, 0x9026);
/** (0018,9027) VR=CS VM=1 Spatial Pre-saturation */
export const SpatialPresaturation = new DicomTag(0x0018, 0x9027);
/** (0018,9028) VR=CS VM=1 Tagging */
export const Tagging = new DicomTag(0x0018, 0x9028);
/** (0018,9029) VR=CS VM=1 Oversampling Phase */
export const OversamplingPhase = new DicomTag(0x0018, 0x9029);
/** (0018,9030) VR=FD VM=1 Tag Spacing First Dimension */
export const TagSpacingFirstDimension = new DicomTag(0x0018, 0x9030);
/** (0018,9032) VR=CS VM=1 Geometry of k-Space Traversal */
export const GeometryOfKSpaceTraversal = new DicomTag(0x0018, 0x9032);
/** (0018,9033) VR=CS VM=1 Segmented k-Space Traversal */
export const SegmentedKSpaceTraversal = new DicomTag(0x0018, 0x9033);
/** (0018,9034) VR=CS VM=1 Rectilinear Phase Encode Reordering */
export const RectilinearPhaseEncodeReordering = new DicomTag(0x0018, 0x9034);
/** (0018,9035) VR=FD VM=1 Tag Thickness */
export const TagThickness = new DicomTag(0x0018, 0x9035);
/** (0018,9036) VR=CS VM=1 Partial Fourier Direction */
export const PartialFourierDirection = new DicomTag(0x0018, 0x9036);
/** (0018,9037) VR=CS VM=1 Cardiac Synchronization Technique */
export const CardiacSynchronizationTechnique = new DicomTag(0x0018, 0x9037);
/** (0018,9041) VR=LO VM=1 Receive Coil Manufacturer Name */
export const ReceiveCoilManufacturerName = new DicomTag(0x0018, 0x9041);
/** (0018,9042) VR=SQ VM=1 MR Receive Coil Sequence */
export const MRReceiveCoilSequence = new DicomTag(0x0018, 0x9042);
/** (0018,9043) VR=CS VM=1 Receive Coil Type */
export const ReceiveCoilType = new DicomTag(0x0018, 0x9043);
/** (0018,9044) VR=CS VM=1 Quadrature Receive Coil */
export const QuadratureReceiveCoil = new DicomTag(0x0018, 0x9044);
/** (0018,9045) VR=SQ VM=1 Multi-Coil Definition Sequence */
export const MultiCoilDefinitionSequence = new DicomTag(0x0018, 0x9045);
/** (0018,9046) VR=LO VM=1 Multi-Coil Configuration */
export const MultiCoilConfiguration = new DicomTag(0x0018, 0x9046);
/** (0018,9047) VR=SH VM=1 Multi-Coil Element Name */
export const MultiCoilElementName = new DicomTag(0x0018, 0x9047);
/** (0018,9048) VR=CS VM=1 Multi-Coil Element Used */
export const MultiCoilElementUsed = new DicomTag(0x0018, 0x9048);
/** (0018,9049) VR=SQ VM=1 MR Transmit Coil Sequence */
export const MRTransmitCoilSequence = new DicomTag(0x0018, 0x9049);
/** (0018,9050) VR=LO VM=1 Transmit Coil Manufacturer Name */
export const TransmitCoilManufacturerName = new DicomTag(0x0018, 0x9050);
/** (0018,9051) VR=CS VM=1 Transmit Coil Type */
export const TransmitCoilType = new DicomTag(0x0018, 0x9051);
/** (0018,9052) VR=FD VM=1-2 Spectral Width */
export const SpectralWidth = new DicomTag(0x0018, 0x9052);
/** (0018,9053) VR=FD VM=1-2 Chemical Shift Reference */
export const ChemicalShiftReference = new DicomTag(0x0018, 0x9053);
/** (0018,9054) VR=CS VM=1 Volume Localization Technique */
export const VolumeLocalizationTechnique = new DicomTag(0x0018, 0x9054);
/** (0018,9058) VR=US VM=1 MR Acquisition Frequency Encoding Steps */
export const MRAcquisitionFrequencyEncodingSteps = new DicomTag(0x0018, 0x9058);
/** (0018,9059) VR=CS VM=1 De-coupling */
export const Decoupling = new DicomTag(0x0018, 0x9059);
/** (0018,9060) VR=CS VM=1-2 De-coupled Nucleus */
export const DecoupledNucleus = new DicomTag(0x0018, 0x9060);
/** (0018,9061) VR=FD VM=1-2 De-coupling Frequency */
export const DecouplingFrequency = new DicomTag(0x0018, 0x9061);
/** (0018,9062) VR=CS VM=1 De-coupling Method */
export const DecouplingMethod = new DicomTag(0x0018, 0x9062);
/** (0018,9063) VR=FD VM=1-2 De-coupling Chemical Shift Reference */
export const DecouplingChemicalShiftReference = new DicomTag(0x0018, 0x9063);
/** (0018,9064) VR=CS VM=1 k-space Filtering */
export const KSpaceFiltering = new DicomTag(0x0018, 0x9064);
/** (0018,9065) VR=CS VM=1-2 Time Domain Filtering */
export const TimeDomainFiltering = new DicomTag(0x0018, 0x9065);
/** (0018,9066) VR=US VM=1-2 Number of Zero Fills */
export const NumberOfZeroFills = new DicomTag(0x0018, 0x9066);
/** (0018,9067) VR=CS VM=1 Baseline Correction */
export const BaselineCorrection = new DicomTag(0x0018, 0x9067);
/** (0018,9069) VR=FD VM=1 Parallel Reduction Factor In-plane */
export const ParallelReductionFactorInPlane = new DicomTag(0x0018, 0x9069);
/** (0018,9070) VR=FD VM=1 Cardiac R-R Interval Specified */
export const CardiacRRIntervalSpecified = new DicomTag(0x0018, 0x9070);
/** (0018,9073) VR=FD VM=1 Acquisition Duration */
export const AcquisitionDuration = new DicomTag(0x0018, 0x9073);
/** (0018,9074) VR=DT VM=1 Frame Acquisition DateTime */
export const FrameAcquisitionDateTime = new DicomTag(0x0018, 0x9074);
/** (0018,9075) VR=CS VM=1 Diffusion Directionality */
export const DiffusionDirectionality = new DicomTag(0x0018, 0x9075);
/** (0018,9076) VR=SQ VM=1 Diffusion Gradient Direction Sequence */
export const DiffusionGradientDirectionSequence = new DicomTag(0x0018, 0x9076);
/** (0018,9077) VR=CS VM=1 Parallel Acquisition */
export const ParallelAcquisition = new DicomTag(0x0018, 0x9077);
/** (0018,9078) VR=CS VM=1 Parallel Acquisition Technique */
export const ParallelAcquisitionTechnique = new DicomTag(0x0018, 0x9078);
/** (0018,9079) VR=FD VM=1-n Inversion Times */
export const InversionTimes = new DicomTag(0x0018, 0x9079);
/** (0018,9080) VR=ST VM=1 Metabolite Map Description */
export const MetaboliteMapDescription = new DicomTag(0x0018, 0x9080);
/** (0018,9081) VR=CS VM=1 Partial Fourier */
export const PartialFourier = new DicomTag(0x0018, 0x9081);
/** (0018,9082) VR=FD VM=1 Effective Echo Time */
export const EffectiveEchoTime = new DicomTag(0x0018, 0x9082);
/** (0018,9083) VR=SQ VM=1 Metabolite Map Code Sequence */
export const MetaboliteMapCodeSequence = new DicomTag(0x0018, 0x9083);
/** (0018,9084) VR=SQ VM=1 Chemical Shift Sequence */
export const ChemicalShiftSequence = new DicomTag(0x0018, 0x9084);
/** (0018,9085) VR=CS VM=1 Cardiac Signal Source */
export const CardiacSignalSource = new DicomTag(0x0018, 0x9085);
/** (0018,9087) VR=FD VM=1 Diffusion b-value */
export const DiffusionBValue = new DicomTag(0x0018, 0x9087);
/** (0018,9089) VR=FD VM=3 Diffusion Gradient Orientation */
export const DiffusionGradientOrientation = new DicomTag(0x0018, 0x9089);
/** (0018,9090) VR=FD VM=3 Velocity Encoding Direction */
export const VelocityEncodingDirection = new DicomTag(0x0018, 0x9090);
/** (0018,9091) VR=FD VM=1 Velocity Encoding Minimum Value */
export const VelocityEncodingMinimumValue = new DicomTag(0x0018, 0x9091);
/** (0018,9092) VR=SQ VM=1 Velocity Encoding Acquisition Sequence */
export const VelocityEncodingAcquisitionSequence = new DicomTag(0x0018, 0x9092);
/** (0018,9093) VR=US VM=1 Number of k-Space Trajectories */
export const NumberOfKSpaceTrajectories = new DicomTag(0x0018, 0x9093);
/** (0018,9094) VR=CS VM=1 Coverage of k-Space */
export const CoverageOfKSpace = new DicomTag(0x0018, 0x9094);
/** (0018,9095) VR=UL VM=1 Spectroscopy Acquisition Phase Rows */
export const SpectroscopyAcquisitionPhaseRows = new DicomTag(0x0018, 0x9095);
/** (0018,9096) VR=FD VM=1 Parallel Reduction Factor In-plane (Retired) (Retired) */
export const ParallelReductionFactorInPlaneRetired = new DicomTag(0x0018, 0x9096);
/** (0018,9098) VR=FD VM=1-2 Transmitter Frequency */
export const TransmitterFrequency = new DicomTag(0x0018, 0x9098);
/** (0018,9100) VR=CS VM=1-2 Resonant Nucleus */
export const ResonantNucleus = new DicomTag(0x0018, 0x9100);
/** (0018,9101) VR=CS VM=1 Frequency Correction */
export const FrequencyCorrection = new DicomTag(0x0018, 0x9101);
/** (0018,9103) VR=SQ VM=1 MR Spectroscopy FOV/Geometry Sequence */
export const MRSpectroscopyFOVGeometrySequence = new DicomTag(0x0018, 0x9103);
/** (0018,9104) VR=FD VM=1 Slab Thickness */
export const SlabThickness = new DicomTag(0x0018, 0x9104);
/** (0018,9105) VR=FD VM=3 Slab Orientation */
export const SlabOrientation = new DicomTag(0x0018, 0x9105);
/** (0018,9106) VR=FD VM=3 Mid Slab Position */
export const MidSlabPosition = new DicomTag(0x0018, 0x9106);
/** (0018,9107) VR=SQ VM=1 MR Spatial Saturation Sequence */
export const MRSpatialSaturationSequence = new DicomTag(0x0018, 0x9107);
/** (0018,9112) VR=SQ VM=1 MR Timing and Related Parameters Sequence */
export const MRTimingAndRelatedParametersSequence = new DicomTag(0x0018, 0x9112);
/** (0018,9114) VR=SQ VM=1 MR Echo Sequence */
export const MREchoSequence = new DicomTag(0x0018, 0x9114);
/** (0018,9115) VR=SQ VM=1 MR Modifier Sequence */
export const MRModifierSequence = new DicomTag(0x0018, 0x9115);
/** (0018,9117) VR=SQ VM=1 MR Diffusion Sequence */
export const MRDiffusionSequence = new DicomTag(0x0018, 0x9117);
/** (0018,9118) VR=SQ VM=1 Cardiac Synchronization Sequence */
export const CardiacSynchronizationSequence = new DicomTag(0x0018, 0x9118);
/** (0018,9119) VR=SQ VM=1 MR Averages Sequence */
export const MRAveragesSequence = new DicomTag(0x0018, 0x9119);
/** (0018,9125) VR=SQ VM=1 MR FOV/Geometry Sequence */
export const MRFOVGeometrySequence = new DicomTag(0x0018, 0x9125);
/** (0018,9126) VR=SQ VM=1 Volume Localization Sequence */
export const VolumeLocalizationSequence = new DicomTag(0x0018, 0x9126);
/** (0018,9127) VR=UL VM=1 Spectroscopy Acquisition Data Columns */
export const SpectroscopyAcquisitionDataColumns = new DicomTag(0x0018, 0x9127);
/** (0018,9147) VR=CS VM=1 Diffusion Anisotropy Type */
export const DiffusionAnisotropyType = new DicomTag(0x0018, 0x9147);
/** (0018,9151) VR=DT VM=1 Frame Reference DateTime */
export const FrameReferenceDateTime = new DicomTag(0x0018, 0x9151);
/** (0018,9152) VR=SQ VM=1 MR Metabolite Map Sequence */
export const MRMetaboliteMapSequence = new DicomTag(0x0018, 0x9152);
/** (0018,9155) VR=FD VM=1 Parallel Reduction Factor out-of-plane */
export const ParallelReductionFactorOutOfPlane = new DicomTag(0x0018, 0x9155);
/** (0018,9159) VR=UL VM=1 Spectroscopy Acquisition Out-of-plane Phase Steps */
export const SpectroscopyAcquisitionOutOfPlanePhaseSteps = new DicomTag(0x0018, 0x9159);
/** (0018,9166) VR=CS VM=1 Bulk Motion Status (Retired) */
export const BulkMotionStatus = new DicomTag(0x0018, 0x9166);
/** (0018,9168) VR=FD VM=1 Parallel Reduction Factor Second In-plane */
export const ParallelReductionFactorSecondInPlane = new DicomTag(0x0018, 0x9168);
/** (0018,9169) VR=CS VM=1 Cardiac Beat Rejection Technique */
export const CardiacBeatRejectionTechnique = new DicomTag(0x0018, 0x9169);
/** (0018,9170) VR=CS VM=1 Respiratory Motion Compensation Technique */
export const RespiratoryMotionCompensationTechnique = new DicomTag(0x0018, 0x9170);
/** (0018,9171) VR=CS VM=1 Respiratory Signal Source */
export const RespiratorySignalSource = new DicomTag(0x0018, 0x9171);
/** (0018,9172) VR=CS VM=1 Bulk Motion Compensation Technique */
export const BulkMotionCompensationTechnique = new DicomTag(0x0018, 0x9172);
/** (0018,9173) VR=CS VM=1 Bulk Motion Signal Source */
export const BulkMotionSignalSource = new DicomTag(0x0018, 0x9173);
/** (0018,9174) VR=CS VM=1 Applicable Safety Standard Agency */
export const ApplicableSafetyStandardAgency = new DicomTag(0x0018, 0x9174);
/** (0018,9175) VR=LO VM=1 Applicable Safety Standard Description */
export const ApplicableSafetyStandardDescription = new DicomTag(0x0018, 0x9175);
/** (0018,9176) VR=SQ VM=1 Operating Mode Sequence */
export const OperatingModeSequence = new DicomTag(0x0018, 0x9176);
/** (0018,9177) VR=CS VM=1 Operating Mode Type */
export const OperatingModeType = new DicomTag(0x0018, 0x9177);
/** (0018,9178) VR=CS VM=1 Operating Mode */
export const OperatingMode = new DicomTag(0x0018, 0x9178);
/** (0018,9179) VR=CS VM=1 Specific Absorption Rate Definition */
export const SpecificAbsorptionRateDefinition = new DicomTag(0x0018, 0x9179);
/** (0018,9180) VR=CS VM=1 Gradient Output Type */
export const GradientOutputType = new DicomTag(0x0018, 0x9180);
/** (0018,9181) VR=FD VM=1 Specific Absorption Rate Value */
export const SpecificAbsorptionRateValue = new DicomTag(0x0018, 0x9181);
/** (0018,9182) VR=FD VM=1 Gradient Output */
export const GradientOutput = new DicomTag(0x0018, 0x9182);
/** (0018,9183) VR=CS VM=1 Flow Compensation Direction */
export const FlowCompensationDirection = new DicomTag(0x0018, 0x9183);
/** (0018,9184) VR=FD VM=1 Tagging Delay */
export const TaggingDelay = new DicomTag(0x0018, 0x9184);
/** (0018,9185) VR=ST VM=1 Respiratory Motion Compensation Technique Description */
export const RespiratoryMotionCompensationTechniqueDescription = new DicomTag(0x0018, 0x9185);
/** (0018,9186) VR=SH VM=1 Respiratory Signal Source ID */
export const RespiratorySignalSourceID = new DicomTag(0x0018, 0x9186);
/** (0018,9195) VR=FD VM=1 Chemical Shift Minimum Integration Limit in Hz (Retired) */
export const ChemicalShiftMinimumIntegrationLimitInHz = new DicomTag(0x0018, 0x9195);
/** (0018,9196) VR=FD VM=1 Chemical Shift Maximum Integration Limit in Hz (Retired) */
export const ChemicalShiftMaximumIntegrationLimitInHz = new DicomTag(0x0018, 0x9196);
/** (0018,9197) VR=SQ VM=1 MR Velocity Encoding Sequence */
export const MRVelocityEncodingSequence = new DicomTag(0x0018, 0x9197);
/** (0018,9198) VR=CS VM=1 First Order Phase Correction */
export const FirstOrderPhaseCorrection = new DicomTag(0x0018, 0x9198);
/** (0018,9199) VR=CS VM=1 Water Referenced Phase Correction */
export const WaterReferencedPhaseCorrection = new DicomTag(0x0018, 0x9199);
/** (0018,9200) VR=CS VM=1 MR Spectroscopy Acquisition Type */
export const MRSpectroscopyAcquisitionType = new DicomTag(0x0018, 0x9200);
/** (0018,9214) VR=CS VM=1 Respiratory Cycle Position */
export const RespiratoryCyclePosition = new DicomTag(0x0018, 0x9214);
/** (0018,9217) VR=FD VM=1 Velocity Encoding Maximum Value */
export const VelocityEncodingMaximumValue = new DicomTag(0x0018, 0x9217);
/** (0018,9218) VR=FD VM=1 Tag Spacing Second Dimension */
export const TagSpacingSecondDimension = new DicomTag(0x0018, 0x9218);
/** (0018,9219) VR=SS VM=1 Tag Angle Second Axis */
export const TagAngleSecondAxis = new DicomTag(0x0018, 0x9219);
/** (0018,9220) VR=FD VM=1 Frame Acquisition Duration */
export const FrameAcquisitionDuration = new DicomTag(0x0018, 0x9220);
/** (0018,9226) VR=SQ VM=1 MR Image Frame Type Sequence */
export const MRImageFrameTypeSequence = new DicomTag(0x0018, 0x9226);
/** (0018,9227) VR=SQ VM=1 MR Spectroscopy Frame Type Sequence */
export const MRSpectroscopyFrameTypeSequence = new DicomTag(0x0018, 0x9227);
/** (0018,9231) VR=US VM=1 MR Acquisition Phase Encoding Steps in-plane */
export const MRAcquisitionPhaseEncodingStepsInPlane = new DicomTag(0x0018, 0x9231);
/** (0018,9232) VR=US VM=1 MR Acquisition Phase Encoding Steps out-of-plane */
export const MRAcquisitionPhaseEncodingStepsOutOfPlane = new DicomTag(0x0018, 0x9232);
/** (0018,9234) VR=UL VM=1 Spectroscopy Acquisition Phase Columns */
export const SpectroscopyAcquisitionPhaseColumns = new DicomTag(0x0018, 0x9234);
/** (0018,9236) VR=CS VM=1 Cardiac Cycle Position */
export const CardiacCyclePosition = new DicomTag(0x0018, 0x9236);
/** (0018,9239) VR=SQ VM=1 Specific Absorption Rate Sequence */
export const SpecificAbsorptionRateSequence = new DicomTag(0x0018, 0x9239);
/** (0018,9240) VR=US VM=1 RF Echo Train Length */
export const RFEchoTrainLength = new DicomTag(0x0018, 0x9240);
/** (0018,9241) VR=US VM=1 Gradient Echo Train Length */
export const GradientEchoTrainLength = new DicomTag(0x0018, 0x9241);
/** (0018,9250) VR=CS VM=1 Arterial Spin Labeling Contrast */
export const ArterialSpinLabelingContrast = new DicomTag(0x0018, 0x9250);
/** (0018,9251) VR=SQ VM=1 MR Arterial Spin Labeling Sequence */
export const MRArterialSpinLabelingSequence = new DicomTag(0x0018, 0x9251);
/** (0018,9252) VR=LO VM=1 ASL Technique Description */
export const ASLTechniqueDescription = new DicomTag(0x0018, 0x9252);
/** (0018,9253) VR=US VM=1 ASL Slab Number */
export const ASLSlabNumber = new DicomTag(0x0018, 0x9253);
/** (0018,9254) VR=FD VM=1 ASL Slab Thickness */
export const ASLSlabThickness = new DicomTag(0x0018, 0x9254);
/** (0018,9255) VR=FD VM=3 ASL Slab Orientation */
export const ASLSlabOrientation = new DicomTag(0x0018, 0x9255);
/** (0018,9256) VR=FD VM=3 ASL Mid Slab Position */
export const ASLMidSlabPosition = new DicomTag(0x0018, 0x9256);
/** (0018,9257) VR=CS VM=1 ASL Context */
export const ASLContext = new DicomTag(0x0018, 0x9257);
/** (0018,9258) VR=UL VM=1 ASL Pulse Train Duration */
export const ASLPulseTrainDuration = new DicomTag(0x0018, 0x9258);
/** (0018,9259) VR=CS VM=1 ASL Crusher Flag */
export const ASLCrusherFlag = new DicomTag(0x0018, 0x9259);
/** (0018,925A) VR=FD VM=1 ASL Crusher Flow Limit */
export const ASLCrusherFlowLimit = new DicomTag(0x0018, 0x925A);
/** (0018,925B) VR=LO VM=1 ASL Crusher Description */
export const ASLCrusherDescription = new DicomTag(0x0018, 0x925B);
/** (0018,925C) VR=CS VM=1 ASL Bolus Cut-off Flag */
export const ASLBolusCutoffFlag = new DicomTag(0x0018, 0x925C);
/** (0018,925D) VR=SQ VM=1 ASL Bolus Cut-off Timing Sequence */
export const ASLBolusCutoffTimingSequence = new DicomTag(0x0018, 0x925D);
/** (0018,925E) VR=LO VM=1 ASL Bolus Cut-off Technique */
export const ASLBolusCutoffTechnique = new DicomTag(0x0018, 0x925E);
/** (0018,925F) VR=UL VM=1 ASL Bolus Cut-off Delay Time */
export const ASLBolusCutoffDelayTime = new DicomTag(0x0018, 0x925F);
/** (0018,9260) VR=SQ VM=1 ASL Slab Sequence */
export const ASLSlabSequence = new DicomTag(0x0018, 0x9260);
/** (0018,9295) VR=FD VM=1 Chemical Shift Minimum Integration Limit in ppm */
export const ChemicalShiftMinimumIntegrationLimitInppm = new DicomTag(0x0018, 0x9295);
/** (0018,9296) VR=FD VM=1 Chemical Shift Maximum Integration Limit in ppm */
export const ChemicalShiftMaximumIntegrationLimitInppm = new DicomTag(0x0018, 0x9296);
/** (0018,9297) VR=CS VM=1 Water Reference Acquisition */
export const WaterReferenceAcquisition = new DicomTag(0x0018, 0x9297);
/** (0018,9298) VR=IS VM=1 Echo Peak Position */
export const EchoPeakPosition = new DicomTag(0x0018, 0x9298);
/** (0018,9301) VR=SQ VM=1 CT Acquisition Type Sequence */
export const CTAcquisitionTypeSequence = new DicomTag(0x0018, 0x9301);
/** (0018,9302) VR=CS VM=1 Acquisition Type */
export const AcquisitionType = new DicomTag(0x0018, 0x9302);
/** (0018,9303) VR=FD VM=1 Tube Angle */
export const TubeAngle = new DicomTag(0x0018, 0x9303);
/** (0018,9304) VR=SQ VM=1 CT Acquisition Details Sequence */
export const CTAcquisitionDetailsSequence = new DicomTag(0x0018, 0x9304);
/** (0018,9305) VR=FD VM=1 Revolution Time */
export const RevolutionTime = new DicomTag(0x0018, 0x9305);
/** (0018,9306) VR=FD VM=1 Single Collimation Width */
export const SingleCollimationWidth = new DicomTag(0x0018, 0x9306);
/** (0018,9307) VR=FD VM=1 Total Collimation Width */
export const TotalCollimationWidth = new DicomTag(0x0018, 0x9307);
/** (0018,9308) VR=SQ VM=1 CT Table Dynamics Sequence */
export const CTTableDynamicsSequence = new DicomTag(0x0018, 0x9308);
/** (0018,9309) VR=FD VM=1 Table Speed */
export const TableSpeed = new DicomTag(0x0018, 0x9309);
/** (0018,9310) VR=FD VM=1 Table Feed per Rotation */
export const TableFeedPerRotation = new DicomTag(0x0018, 0x9310);
/** (0018,9311) VR=FD VM=1 Spiral Pitch Factor */
export const SpiralPitchFactor = new DicomTag(0x0018, 0x9311);
/** (0018,9312) VR=SQ VM=1 CT Geometry Sequence */
export const CTGeometrySequence = new DicomTag(0x0018, 0x9312);
/** (0018,9313) VR=FD VM=3 Data Collection Center (Patient) */
export const DataCollectionCenterPatient = new DicomTag(0x0018, 0x9313);
/** (0018,9314) VR=SQ VM=1 CT Reconstruction Sequence */
export const CTReconstructionSequence = new DicomTag(0x0018, 0x9314);
/** (0018,9315) VR=CS VM=1 Reconstruction Algorithm */
export const ReconstructionAlgorithm = new DicomTag(0x0018, 0x9315);
/** (0018,9316) VR=CS VM=1 Convolution Kernel Group */
export const ConvolutionKernelGroup = new DicomTag(0x0018, 0x9316);
/** (0018,9317) VR=FD VM=2 Reconstruction Field of View */
export const ReconstructionFieldOfView = new DicomTag(0x0018, 0x9317);
/** (0018,9318) VR=FD VM=3 Reconstruction Target Center (Patient) */
export const ReconstructionTargetCenterPatient = new DicomTag(0x0018, 0x9318);
/** (0018,9319) VR=FD VM=1 Reconstruction Angle */
export const ReconstructionAngle = new DicomTag(0x0018, 0x9319);
/** (0018,9320) VR=SH VM=1 Image Filter */
export const ImageFilter = new DicomTag(0x0018, 0x9320);
/** (0018,9321) VR=SQ VM=1 CT Exposure Sequence */
export const CTExposureSequence = new DicomTag(0x0018, 0x9321);
/** (0018,9322) VR=FD VM=2 Reconstruction Pixel Spacing */
export const ReconstructionPixelSpacing = new DicomTag(0x0018, 0x9322);
/** (0018,9323) VR=CS VM=1-n Exposure Modulation Type */
export const ExposureModulationType = new DicomTag(0x0018, 0x9323);
/** (0018,9324) VR=FD VM=1 Estimated Dose Saving (Retired) */
export const EstimatedDoseSaving = new DicomTag(0x0018, 0x9324);
/** (0018,9325) VR=SQ VM=1 CT X-Ray Details Sequence */
export const CTXRayDetailsSequence = new DicomTag(0x0018, 0x9325);
/** (0018,9326) VR=SQ VM=1 CT Position Sequence */
export const CTPositionSequence = new DicomTag(0x0018, 0x9326);
/** (0018,9327) VR=FD VM=1 Table Position */
export const TablePosition = new DicomTag(0x0018, 0x9327);
/** (0018,9328) VR=FD VM=1 Exposure Time in ms */
export const ExposureTimeInms = new DicomTag(0x0018, 0x9328);
/** (0018,9329) VR=SQ VM=1 CT Image Frame Type Sequence */
export const CTImageFrameTypeSequence = new DicomTag(0x0018, 0x9329);
/** (0018,9330) VR=FD VM=1 X-Ray Tube Current in mA */
export const XRayTubeCurrentInmA = new DicomTag(0x0018, 0x9330);
/** (0018,9332) VR=FD VM=1 Exposure in mAs */
export const ExposureInmAs = new DicomTag(0x0018, 0x9332);
/** (0018,9333) VR=CS VM=1 Constant Volume Flag */
export const ConstantVolumeFlag = new DicomTag(0x0018, 0x9333);
/** (0018,9334) VR=CS VM=1 Fluoroscopy Flag */
export const FluoroscopyFlag = new DicomTag(0x0018, 0x9334);
/** (0018,9335) VR=FD VM=1 Distance Source to Data Collection Center */
export const DistanceSourceToDataCollectionCenter = new DicomTag(0x0018, 0x9335);
/** (0018,9337) VR=US VM=1 Contrast/Bolus Agent Number */
export const ContrastBolusAgentNumber = new DicomTag(0x0018, 0x9337);
/** (0018,9338) VR=SQ VM=1 Contrast/Bolus Ingredient Code Sequence */
export const ContrastBolusIngredientCodeSequence = new DicomTag(0x0018, 0x9338);
/** (0018,9340) VR=SQ VM=1 Contrast Administration Profile Sequence */
export const ContrastAdministrationProfileSequence = new DicomTag(0x0018, 0x9340);
/** (0018,9341) VR=SQ VM=1 Contrast/Bolus Usage Sequence */
export const ContrastBolusUsageSequence = new DicomTag(0x0018, 0x9341);
/** (0018,9342) VR=CS VM=1 Contrast/Bolus Agent Administered */
export const ContrastBolusAgentAdministered = new DicomTag(0x0018, 0x9342);
/** (0018,9343) VR=CS VM=1 Contrast/Bolus Agent Detected */
export const ContrastBolusAgentDetected = new DicomTag(0x0018, 0x9343);
/** (0018,9344) VR=CS VM=1 Contrast/Bolus Agent Phase */
export const ContrastBolusAgentPhase = new DicomTag(0x0018, 0x9344);
/** (0018,9345) VR=FD VM=1 CTDIvol */
export const CTDIvol = new DicomTag(0x0018, 0x9345);
/** (0018,9346) VR=SQ VM=1 CTDI Phantom Type Code Sequence */
export const CTDIPhantomTypeCodeSequence = new DicomTag(0x0018, 0x9346);
/** (0018,9351) VR=FL VM=1 Calcium Scoring Mass Factor Patient */
export const CalciumScoringMassFactorPatient = new DicomTag(0x0018, 0x9351);
/** (0018,9352) VR=FL VM=3 Calcium Scoring Mass Factor Device */
export const CalciumScoringMassFactorDevice = new DicomTag(0x0018, 0x9352);
/** (0018,9353) VR=FL VM=1 Energy Weighting Factor */
export const EnergyWeightingFactor = new DicomTag(0x0018, 0x9353);
/** (0018,9360) VR=SQ VM=1 CT Additional X-Ray Source Sequence */
export const CTAdditionalXRaySourceSequence = new DicomTag(0x0018, 0x9360);
/** (0018,9361) VR=CS VM=1 Multi-energy CT Acquisition */
export const MultienergyCTAcquisition = new DicomTag(0x0018, 0x9361);
/** (0018,9362) VR=SQ VM=1 Multi-energy CT Acquisition Sequence */
export const MultienergyCTAcquisitionSequence = new DicomTag(0x0018, 0x9362);
/** (0018,9363) VR=SQ VM=1 Multi-energy CT Processing Sequence */
export const MultienergyCTProcessingSequence = new DicomTag(0x0018, 0x9363);
/** (0018,9364) VR=SQ VM=1 Multi-energy CT Characteristics Sequence */
export const MultienergyCTCharacteristicsSequence = new DicomTag(0x0018, 0x9364);
/** (0018,9365) VR=SQ VM=1 Multi-energy CT X-Ray Source Sequence */
export const MultienergyCTXRaySourceSequence = new DicomTag(0x0018, 0x9365);
/** (0018,9366) VR=US VM=1 X-Ray Source Index */
export const XRaySourceIndex = new DicomTag(0x0018, 0x9366);
/** (0018,9367) VR=UC VM=1 X-Ray Source ID */
export const XRaySourceID = new DicomTag(0x0018, 0x9367);
/** (0018,9368) VR=CS VM=1 Multi-energy Source Technique */
export const MultienergySourceTechnique = new DicomTag(0x0018, 0x9368);
/** (0018,9369) VR=DT VM=1 Source Start DateTime */
export const SourceStartDateTime = new DicomTag(0x0018, 0x9369);
/** (0018,936A) VR=DT VM=1 Source End DateTime */
export const SourceEndDateTime = new DicomTag(0x0018, 0x936A);
/** (0018,936B) VR=US VM=1 Switching Phase Number */
export const SwitchingPhaseNumber = new DicomTag(0x0018, 0x936B);
/** (0018,936C) VR=DS VM=1 Switching Phase Nominal Duration */
export const SwitchingPhaseNominalDuration = new DicomTag(0x0018, 0x936C);
/** (0018,936D) VR=DS VM=1 Switching Phase Transition Duration */
export const SwitchingPhaseTransitionDuration = new DicomTag(0x0018, 0x936D);
/** (0018,936E) VR=DS VM=1 Effective Bin Energy */
export const EffectiveBinEnergy = new DicomTag(0x0018, 0x936E);
/** (0018,936F) VR=SQ VM=1 Multi-energy CT X-Ray Detector Sequence */
export const MultienergyCTXRayDetectorSequence = new DicomTag(0x0018, 0x936F);
/** (0018,9370) VR=US VM=1 X-Ray Detector Index */
export const XRayDetectorIndex = new DicomTag(0x0018, 0x9370);
/** (0018,9371) VR=UC VM=1 X-Ray Detector ID */
export const XRayDetectorID = new DicomTag(0x0018, 0x9371);
/** (0018,9372) VR=CS VM=1 Multi-energy Detector Type */
export const MultienergyDetectorType = new DicomTag(0x0018, 0x9372);
/** (0018,9373) VR=ST VM=1 X-Ray Detector Label */
export const XRayDetectorLabel = new DicomTag(0x0018, 0x9373);
/** (0018,9374) VR=DS VM=1 Nominal Max Energy */
export const NominalMaxEnergy = new DicomTag(0x0018, 0x9374);
/** (0018,9375) VR=DS VM=1 Nominal Min Energy */
export const NominalMinEnergy = new DicomTag(0x0018, 0x9375);
/** (0018,9376) VR=US VM=1-n Referenced X-Ray Detector Index */
export const ReferencedXRayDetectorIndex = new DicomTag(0x0018, 0x9376);
/** (0018,9377) VR=US VM=1-n Referenced X-Ray Source Index */
export const ReferencedXRaySourceIndex = new DicomTag(0x0018, 0x9377);
/** (0018,9378) VR=US VM=1-n Referenced Path Index */
export const ReferencedPathIndex = new DicomTag(0x0018, 0x9378);
/** (0018,9379) VR=SQ VM=1 Multi-energy CT Path Sequence */
export const MultienergyCTPathSequence = new DicomTag(0x0018, 0x9379);
/** (0018,937A) VR=US VM=1 Multi-energy CT Path Index */
export const MultienergyCTPathIndex = new DicomTag(0x0018, 0x937A);
/** (0018,937B) VR=UT VM=1 Multi-energy Acquisition Description */
export const MultienergyAcquisitionDescription = new DicomTag(0x0018, 0x937B);
/** (0018,937C) VR=FD VM=1 Monoenergetic Energy Equivalent */
export const MonoenergeticEnergyEquivalent = new DicomTag(0x0018, 0x937C);
/** (0018,937D) VR=SQ VM=1 Material Code Sequence */
export const MaterialCodeSequence = new DicomTag(0x0018, 0x937D);
/** (0018,937E) VR=CS VM=1 Decomposition Method */
export const DecompositionMethod = new DicomTag(0x0018, 0x937E);
/** (0018,937F) VR=UT VM=1 Decomposition Description */
export const DecompositionDescription = new DicomTag(0x0018, 0x937F);
/** (0018,9380) VR=SQ VM=1 Decomposition Algorithm Identification Sequence */
export const DecompositionAlgorithmIdentificationSequence = new DicomTag(0x0018, 0x9380);
/** (0018,9381) VR=SQ VM=1 Decomposition Material Sequence */
export const DecompositionMaterialSequence = new DicomTag(0x0018, 0x9381);
/** (0018,9382) VR=SQ VM=1 Material Attenuation Sequence */
export const MaterialAttenuationSequence = new DicomTag(0x0018, 0x9382);
/** (0018,9383) VR=DS VM=1 Photon Energy */
export const PhotonEnergy = new DicomTag(0x0018, 0x9383);
/** (0018,9384) VR=DS VM=1 X-Ray Mass Attenuation Coefficient */
export const XRayMassAttenuationCoefficient = new DicomTag(0x0018, 0x9384);
/** (0018,9401) VR=SQ VM=1 Projection Pixel Calibration Sequence */
export const ProjectionPixelCalibrationSequence = new DicomTag(0x0018, 0x9401);
/** (0018,9402) VR=FL VM=1 Distance Source to Isocenter */
export const DistanceSourceToIsocenter = new DicomTag(0x0018, 0x9402);
/** (0018,9403) VR=FL VM=1 Distance Object to Table Top */
export const DistanceObjectToTableTop = new DicomTag(0x0018, 0x9403);
/** (0018,9404) VR=FL VM=2 Object Pixel Spacing in Center of Beam */
export const ObjectPixelSpacingInCenterOfBeam = new DicomTag(0x0018, 0x9404);
/** (0018,9405) VR=SQ VM=1 Positioner Position Sequence */
export const PositionerPositionSequence = new DicomTag(0x0018, 0x9405);
/** (0018,9406) VR=SQ VM=1 Table Position Sequence */
export const TablePositionSequence = new DicomTag(0x0018, 0x9406);
/** (0018,9407) VR=SQ VM=1 Collimator Shape Sequence */
export const CollimatorShapeSequence = new DicomTag(0x0018, 0x9407);
/** (0018,9410) VR=CS VM=1 Planes in Acquisition */
export const PlanesInAcquisition = new DicomTag(0x0018, 0x9410);
/** (0018,9412) VR=SQ VM=1 XA/XRF Frame Characteristics Sequence */
export const XAXRFFrameCharacteristicsSequence = new DicomTag(0x0018, 0x9412);
/** (0018,9417) VR=SQ VM=1 Frame Acquisition Sequence */
export const FrameAcquisitionSequence = new DicomTag(0x0018, 0x9417);
/** (0018,9420) VR=CS VM=1 X-Ray Receptor Type */
export const XRayReceptorType = new DicomTag(0x0018, 0x9420);
/** (0018,9423) VR=LO VM=1 Acquisition Protocol Name */
export const AcquisitionProtocolName = new DicomTag(0x0018, 0x9423);
/** (0018,9424) VR=LT VM=1 Acquisition Protocol Description */
export const AcquisitionProtocolDescription = new DicomTag(0x0018, 0x9424);
/** (0018,9425) VR=CS VM=1 Contrast/Bolus Ingredient Opaque */
export const ContrastBolusIngredientOpaque = new DicomTag(0x0018, 0x9425);
/** (0018,9426) VR=FL VM=1 Distance Receptor Plane to Detector Housing */
export const DistanceReceptorPlaneToDetectorHousing = new DicomTag(0x0018, 0x9426);
/** (0018,9427) VR=CS VM=1 Intensifier Active Shape */
export const IntensifierActiveShape = new DicomTag(0x0018, 0x9427);
/** (0018,9428) VR=FL VM=1-2 Intensifier Active Dimension(s) */
export const IntensifierActiveDimensions = new DicomTag(0x0018, 0x9428);
/** (0018,9429) VR=FL VM=2 Physical Detector Size */
export const PhysicalDetectorSize = new DicomTag(0x0018, 0x9429);
/** (0018,9430) VR=FL VM=2 Position of Isocenter Projection */
export const PositionOfIsocenterProjection = new DicomTag(0x0018, 0x9430);
/** (0018,9432) VR=SQ VM=1 Field of View Sequence */
export const FieldOfViewSequence = new DicomTag(0x0018, 0x9432);
/** (0018,9433) VR=LO VM=1 Field of View Description */
export const FieldOfViewDescription = new DicomTag(0x0018, 0x9433);
/** (0018,9434) VR=SQ VM=1 Exposure Control Sensing Regions Sequence */
export const ExposureControlSensingRegionsSequence = new DicomTag(0x0018, 0x9434);
/** (0018,9435) VR=CS VM=1 Exposure Control Sensing Region Shape */
export const ExposureControlSensingRegionShape = new DicomTag(0x0018, 0x9435);
/** (0018,9436) VR=SS VM=1 Exposure Control Sensing Region Left Vertical Edge */
export const ExposureControlSensingRegionLeftVerticalEdge = new DicomTag(0x0018, 0x9436);
/** (0018,9437) VR=SS VM=1 Exposure Control Sensing Region Right Vertical Edge */
export const ExposureControlSensingRegionRightVerticalEdge = new DicomTag(0x0018, 0x9437);
/** (0018,9438) VR=SS VM=1 Exposure Control Sensing Region Upper Horizontal Edge */
export const ExposureControlSensingRegionUpperHorizontalEdge = new DicomTag(0x0018, 0x9438);
/** (0018,9439) VR=SS VM=1 Exposure Control Sensing Region Lower Horizontal Edge */
export const ExposureControlSensingRegionLowerHorizontalEdge = new DicomTag(0x0018, 0x9439);
/** (0018,9440) VR=SS VM=2 Center of Circular Exposure Control Sensing Region */
export const CenterOfCircularExposureControlSensingRegion = new DicomTag(0x0018, 0x9440);
/** (0018,9441) VR=US VM=1 Radius of Circular Exposure Control Sensing Region */
export const RadiusOfCircularExposureControlSensingRegion = new DicomTag(0x0018, 0x9441);
/** (0018,9442) VR=SS VM=2-n Vertices of the Polygonal Exposure Control Sensing Region */
export const VerticesOfThePolygonalExposureControlSensingRegion = new DicomTag(0x0018, 0x9442);
/** (0018,9447) VR=FL VM=1 Column Angulation (Patient) */
export const ColumnAngulationPatient = new DicomTag(0x0018, 0x9447);
/** (0018,9449) VR=FL VM=1 Beam Angle */
export const BeamAngle = new DicomTag(0x0018, 0x9449);
/** (0018,9451) VR=SQ VM=1 Frame Detector Parameters Sequence */
export const FrameDetectorParametersSequence = new DicomTag(0x0018, 0x9451);
/** (0018,9452) VR=FL VM=1 Calculated Anatomy Thickness */
export const CalculatedAnatomyThickness = new DicomTag(0x0018, 0x9452);
/** (0018,9455) VR=SQ VM=1 Calibration Sequence */
export const CalibrationSequence = new DicomTag(0x0018, 0x9455);
/** (0018,9456) VR=SQ VM=1 Object Thickness Sequence */
export const ObjectThicknessSequence = new DicomTag(0x0018, 0x9456);
/** (0018,9457) VR=CS VM=1 Plane Identification */
export const PlaneIdentification = new DicomTag(0x0018, 0x9457);
/** (0018,9461) VR=FL VM=1-2 Field of View Dimension(s) in Float */
export const FieldOfViewDimensionsInFloat = new DicomTag(0x0018, 0x9461);
/** (0018,9462) VR=SQ VM=1 Isocenter Reference System Sequence */
export const IsocenterReferenceSystemSequence = new DicomTag(0x0018, 0x9462);
/** (0018,9463) VR=FL VM=1 Positioner Isocenter Primary Angle */
export const PositionerIsocenterPrimaryAngle = new DicomTag(0x0018, 0x9463);
/** (0018,9464) VR=FL VM=1 Positioner Isocenter Secondary Angle */
export const PositionerIsocenterSecondaryAngle = new DicomTag(0x0018, 0x9464);
/** (0018,9465) VR=FL VM=1 Positioner Isocenter Detector Rotation Angle */
export const PositionerIsocenterDetectorRotationAngle = new DicomTag(0x0018, 0x9465);
/** (0018,9466) VR=FL VM=1 Table X Position to Isocenter */
export const TableXPositionToIsocenter = new DicomTag(0x0018, 0x9466);
/** (0018,9467) VR=FL VM=1 Table Y Position to Isocenter */
export const TableYPositionToIsocenter = new DicomTag(0x0018, 0x9467);
/** (0018,9468) VR=FL VM=1 Table Z Position to Isocenter */
export const TableZPositionToIsocenter = new DicomTag(0x0018, 0x9468);
/** (0018,9469) VR=FL VM=1 Table Horizontal Rotation Angle */
export const TableHorizontalRotationAngle = new DicomTag(0x0018, 0x9469);
/** (0018,9470) VR=FL VM=1 Table Head Tilt Angle */
export const TableHeadTiltAngle = new DicomTag(0x0018, 0x9470);
/** (0018,9471) VR=FL VM=1 Table Cradle Tilt Angle */
export const TableCradleTiltAngle = new DicomTag(0x0018, 0x9471);
/** (0018,9472) VR=SQ VM=1 Frame Display Shutter Sequence */
export const FrameDisplayShutterSequence = new DicomTag(0x0018, 0x9472);
/** (0018,9473) VR=FL VM=1 Acquired Image Area Dose Product */
export const AcquiredImageAreaDoseProduct = new DicomTag(0x0018, 0x9473);
/** (0018,9474) VR=CS VM=1 C-arm Positioner Tabletop Relationship */
export const CArmPositionerTabletopRelationship = new DicomTag(0x0018, 0x9474);
/** (0018,9476) VR=SQ VM=1 X-Ray Geometry Sequence */
export const XRayGeometrySequence = new DicomTag(0x0018, 0x9476);
/** (0018,9477) VR=SQ VM=1 Irradiation Event Identification Sequence */
export const IrradiationEventIdentificationSequence = new DicomTag(0x0018, 0x9477);
/** (0018,9504) VR=SQ VM=1 X-Ray 3D Frame Type Sequence */
export const XRay3DFrameTypeSequence = new DicomTag(0x0018, 0x9504);
/** (0018,9506) VR=SQ VM=1 Contributing Sources Sequence */
export const ContributingSourcesSequence = new DicomTag(0x0018, 0x9506);
/** (0018,9507) VR=SQ VM=1 X-Ray 3D Acquisition Sequence */
export const XRay3DAcquisitionSequence = new DicomTag(0x0018, 0x9507);
/** (0018,9508) VR=FL VM=1 Primary Positioner Scan Arc */
export const PrimaryPositionerScanArc = new DicomTag(0x0018, 0x9508);
/** (0018,9509) VR=FL VM=1 Secondary Positioner Scan Arc */
export const SecondaryPositionerScanArc = new DicomTag(0x0018, 0x9509);
/** (0018,9510) VR=FL VM=1 Primary Positioner Scan Start Angle */
export const PrimaryPositionerScanStartAngle = new DicomTag(0x0018, 0x9510);
/** (0018,9511) VR=FL VM=1 Secondary Positioner Scan Start Angle */
export const SecondaryPositionerScanStartAngle = new DicomTag(0x0018, 0x9511);
/** (0018,9514) VR=FL VM=1 Primary Positioner Increment */
export const PrimaryPositionerIncrement = new DicomTag(0x0018, 0x9514);
/** (0018,9515) VR=FL VM=1 Secondary Positioner Increment */
export const SecondaryPositionerIncrement = new DicomTag(0x0018, 0x9515);
/** (0018,9516) VR=DT VM=1 Start Acquisition DateTime */
export const StartAcquisitionDateTime = new DicomTag(0x0018, 0x9516);
/** (0018,9517) VR=DT VM=1 End Acquisition DateTime */
export const EndAcquisitionDateTime = new DicomTag(0x0018, 0x9517);
/** (0018,9518) VR=SS VM=1 Primary Positioner Increment Sign */
export const PrimaryPositionerIncrementSign = new DicomTag(0x0018, 0x9518);
/** (0018,9519) VR=SS VM=1 Secondary Positioner Increment Sign */
export const SecondaryPositionerIncrementSign = new DicomTag(0x0018, 0x9519);
/** (0018,9524) VR=LO VM=1 Application Name */
export const ApplicationName = new DicomTag(0x0018, 0x9524);
/** (0018,9525) VR=LO VM=1 Application Version */
export const ApplicationVersion = new DicomTag(0x0018, 0x9525);
/** (0018,9526) VR=LO VM=1 Application Manufacturer */
export const ApplicationManufacturer = new DicomTag(0x0018, 0x9526);
/** (0018,9527) VR=CS VM=1 Algorithm Type */
export const AlgorithmType = new DicomTag(0x0018, 0x9527);
/** (0018,9528) VR=LO VM=1 Algorithm Description */
export const AlgorithmDescription = new DicomTag(0x0018, 0x9528);
/** (0018,9530) VR=SQ VM=1 X-Ray 3D Reconstruction Sequence */
export const XRay3DReconstructionSequence = new DicomTag(0x0018, 0x9530);
/** (0018,9531) VR=LO VM=1 Reconstruction Description */
export const ReconstructionDescription = new DicomTag(0x0018, 0x9531);
/** (0018,9538) VR=SQ VM=1 Per Projection Acquisition Sequence */
export const PerProjectionAcquisitionSequence = new DicomTag(0x0018, 0x9538);
/** (0018,9541) VR=SQ VM=1 Detector Position Sequence */
export const DetectorPositionSequence = new DicomTag(0x0018, 0x9541);
/** (0018,9542) VR=SQ VM=1 X-Ray Acquisition Dose Sequence */
export const XRayAcquisitionDoseSequence = new DicomTag(0x0018, 0x9542);
/** (0018,9543) VR=FD VM=1 X-Ray Source Isocenter Primary Angle */
export const XRaySourceIsocenterPrimaryAngle = new DicomTag(0x0018, 0x9543);
/** (0018,9544) VR=FD VM=1 X-Ray Source Isocenter Secondary Angle */
export const XRaySourceIsocenterSecondaryAngle = new DicomTag(0x0018, 0x9544);
/** (0018,9545) VR=FD VM=1 Breast Support Isocenter Primary Angle */
export const BreastSupportIsocenterPrimaryAngle = new DicomTag(0x0018, 0x9545);
/** (0018,9546) VR=FD VM=1 Breast Support Isocenter Secondary Angle */
export const BreastSupportIsocenterSecondaryAngle = new DicomTag(0x0018, 0x9546);
/** (0018,9547) VR=FD VM=1 Breast Support X Position to Isocenter */
export const BreastSupportXPositionToIsocenter = new DicomTag(0x0018, 0x9547);
/** (0018,9548) VR=FD VM=1 Breast Support Y Position to Isocenter */
export const BreastSupportYPositionToIsocenter = new DicomTag(0x0018, 0x9548);
/** (0018,9549) VR=FD VM=1 Breast Support Z Position to Isocenter */
export const BreastSupportZPositionToIsocenter = new DicomTag(0x0018, 0x9549);
/** (0018,9550) VR=FD VM=1 Detector Isocenter Primary Angle */
export const DetectorIsocenterPrimaryAngle = new DicomTag(0x0018, 0x9550);
/** (0018,9551) VR=FD VM=1 Detector Isocenter Secondary Angle */
export const DetectorIsocenterSecondaryAngle = new DicomTag(0x0018, 0x9551);
/** (0018,9552) VR=FD VM=1 Detector X Position to Isocenter */
export const DetectorXPositionToIsocenter = new DicomTag(0x0018, 0x9552);
/** (0018,9553) VR=FD VM=1 Detector Y Position to Isocenter */
export const DetectorYPositionToIsocenter = new DicomTag(0x0018, 0x9553);
/** (0018,9554) VR=FD VM=1 Detector Z Position to Isocenter */
export const DetectorZPositionToIsocenter = new DicomTag(0x0018, 0x9554);
/** (0018,9555) VR=SQ VM=1 X-Ray Grid Sequence */
export const XRayGridSequence = new DicomTag(0x0018, 0x9555);
/** (0018,9556) VR=SQ VM=1 X-Ray Filter Sequence */
export const XRayFilterSequence = new DicomTag(0x0018, 0x9556);
/** (0018,9557) VR=FD VM=3 Detector Active Area TLHC Position */
export const DetectorActiveAreaTLHCPosition = new DicomTag(0x0018, 0x9557);
/** (0018,9558) VR=FD VM=6 Detector Active Area Orientation */
export const DetectorActiveAreaOrientation = new DicomTag(0x0018, 0x9558);
/** (0018,9559) VR=CS VM=1 Positioner Primary Angle Direction */
export const PositionerPrimaryAngleDirection = new DicomTag(0x0018, 0x9559);
/** (0018,9601) VR=SQ VM=1 Diffusion b-matrix Sequence */
export const DiffusionBMatrixSequence = new DicomTag(0x0018, 0x9601);
/** (0018,9602) VR=FD VM=1 Diffusion b-value XX */
export const DiffusionBValueXX = new DicomTag(0x0018, 0x9602);
/** (0018,9603) VR=FD VM=1 Diffusion b-value XY */
export const DiffusionBValueXY = new DicomTag(0x0018, 0x9603);
/** (0018,9604) VR=FD VM=1 Diffusion b-value XZ */
export const DiffusionBValueXZ = new DicomTag(0x0018, 0x9604);
/** (0018,9605) VR=FD VM=1 Diffusion b-value YY */
export const DiffusionBValueYY = new DicomTag(0x0018, 0x9605);
/** (0018,9606) VR=FD VM=1 Diffusion b-value YZ */
export const DiffusionBValueYZ = new DicomTag(0x0018, 0x9606);
/** (0018,9607) VR=FD VM=1 Diffusion b-value ZZ */
export const DiffusionBValueZZ = new DicomTag(0x0018, 0x9607);
/** (0018,9621) VR=SQ VM=1 Functional MR Sequence */
export const FunctionalMRSequence = new DicomTag(0x0018, 0x9621);
/** (0018,9622) VR=CS VM=1 Functional Settling Phase Frames Present */
export const FunctionalSettlingPhaseFramesPresent = new DicomTag(0x0018, 0x9622);
/** (0018,9623) VR=DT VM=1 Functional Sync Pulse */
export const FunctionalSyncPulse = new DicomTag(0x0018, 0x9623);
/** (0018,9624) VR=CS VM=1 Settling Phase Frame */
export const SettlingPhaseFrame = new DicomTag(0x0018, 0x9624);
/** (0018,9701) VR=DT VM=1 Decay Correction DateTime */
export const DecayCorrectionDateTime = new DicomTag(0x0018, 0x9701);
/** (0018,9715) VR=FD VM=1 Start Density Threshold */
export const StartDensityThreshold = new DicomTag(0x0018, 0x9715);
/** (0018,9716) VR=FD VM=1 Start Relative Density Difference Threshold */
export const StartRelativeDensityDifferenceThreshold = new DicomTag(0x0018, 0x9716);
/** (0018,9717) VR=FD VM=1 Start Cardiac Trigger Count Threshold */
export const StartCardiacTriggerCountThreshold = new DicomTag(0x0018, 0x9717);
/** (0018,9718) VR=FD VM=1 Start Respiratory Trigger Count Threshold */
export const StartRespiratoryTriggerCountThreshold = new DicomTag(0x0018, 0x9718);
/** (0018,9719) VR=FD VM=1 Termination Counts Threshold */
export const TerminationCountsThreshold = new DicomTag(0x0018, 0x9719);
/** (0018,9720) VR=FD VM=1 Termination Density Threshold */
export const TerminationDensityThreshold = new DicomTag(0x0018, 0x9720);
/** (0018,9721) VR=FD VM=1 Termination Relative Density Threshold */
export const TerminationRelativeDensityThreshold = new DicomTag(0x0018, 0x9721);
/** (0018,9722) VR=FD VM=1 Termination Time Threshold */
export const TerminationTimeThreshold = new DicomTag(0x0018, 0x9722);
/** (0018,9723) VR=FD VM=1 Termination Cardiac Trigger Count Threshold */
export const TerminationCardiacTriggerCountThreshold = new DicomTag(0x0018, 0x9723);
/** (0018,9724) VR=FD VM=1 Termination Respiratory Trigger Count Threshold */
export const TerminationRespiratoryTriggerCountThreshold = new DicomTag(0x0018, 0x9724);
/** (0018,9725) VR=CS VM=1 Detector Geometry */
export const DetectorGeometry = new DicomTag(0x0018, 0x9725);
/** (0018,9726) VR=FD VM=1 Transverse Detector Separation */
export const TransverseDetectorSeparation = new DicomTag(0x0018, 0x9726);
/** (0018,9727) VR=FD VM=1 Axial Detector Dimension */
export const AxialDetectorDimension = new DicomTag(0x0018, 0x9727);
/** (0018,9729) VR=US VM=1 Radiopharmaceutical Agent Number */
export const RadiopharmaceuticalAgentNumber = new DicomTag(0x0018, 0x9729);
/** (0018,9732) VR=SQ VM=1 PET Frame Acquisition Sequence */
export const PETFrameAcquisitionSequence = new DicomTag(0x0018, 0x9732);
/** (0018,9733) VR=SQ VM=1 PET Detector Motion Details Sequence */
export const PETDetectorMotionDetailsSequence = new DicomTag(0x0018, 0x9733);
/** (0018,9734) VR=SQ VM=1 PET Table Dynamics Sequence */
export const PETTableDynamicsSequence = new DicomTag(0x0018, 0x9734);
/** (0018,9735) VR=SQ VM=1 PET Position Sequence */
export const PETPositionSequence = new DicomTag(0x0018, 0x9735);
/** (0018,9736) VR=SQ VM=1 PET Frame Correction Factors Sequence */
export const PETFrameCorrectionFactorsSequence = new DicomTag(0x0018, 0x9736);
/** (0018,9737) VR=SQ VM=1 Radiopharmaceutical Usage Sequence */
export const RadiopharmaceuticalUsageSequence = new DicomTag(0x0018, 0x9737);
/** (0018,9738) VR=CS VM=1 Attenuation Correction Source */
export const AttenuationCorrectionSource = new DicomTag(0x0018, 0x9738);
/** (0018,9739) VR=US VM=1 Number of Iterations */
export const NumberOfIterations = new DicomTag(0x0018, 0x9739);
/** (0018,9740) VR=US VM=1 Number of Subsets */
export const NumberOfSubsets = new DicomTag(0x0018, 0x9740);
/** (0018,9749) VR=SQ VM=1 PET Reconstruction Sequence */
export const PETReconstructionSequence = new DicomTag(0x0018, 0x9749);
/** (0018,9751) VR=SQ VM=1 PET Frame Type Sequence */
export const PETFrameTypeSequence = new DicomTag(0x0018, 0x9751);
/** (0018,9755) VR=CS VM=1 Time of Flight Information Used */
export const TimeOfFlightInformationUsed = new DicomTag(0x0018, 0x9755);
/** (0018,9756) VR=CS VM=1 Reconstruction Type */
export const ReconstructionType = new DicomTag(0x0018, 0x9756);
/** (0018,9758) VR=CS VM=1 Decay Corrected */
export const DecayCorrected = new DicomTag(0x0018, 0x9758);
/** (0018,9759) VR=CS VM=1 Attenuation Corrected */
export const AttenuationCorrected = new DicomTag(0x0018, 0x9759);
/** (0018,9760) VR=CS VM=1 Scatter Corrected */
export const ScatterCorrected = new DicomTag(0x0018, 0x9760);
/** (0018,9761) VR=CS VM=1 Dead Time Corrected */
export const DeadTimeCorrected = new DicomTag(0x0018, 0x9761);
/** (0018,9762) VR=CS VM=1 Gantry Motion Corrected */
export const GantryMotionCorrected = new DicomTag(0x0018, 0x9762);
/** (0018,9763) VR=CS VM=1 Patient Motion Corrected */
export const PatientMotionCorrected = new DicomTag(0x0018, 0x9763);
/** (0018,9764) VR=CS VM=1 Count Loss Normalization Corrected */
export const CountLossNormalizationCorrected = new DicomTag(0x0018, 0x9764);
/** (0018,9765) VR=CS VM=1 Randoms Corrected */
export const RandomsCorrected = new DicomTag(0x0018, 0x9765);
/** (0018,9766) VR=CS VM=1 Non-uniform Radial Sampling Corrected */
export const NonUniformRadialSamplingCorrected = new DicomTag(0x0018, 0x9766);
/** (0018,9767) VR=CS VM=1 Sensitivity Calibrated */
export const SensitivityCalibrated = new DicomTag(0x0018, 0x9767);
/** (0018,9768) VR=CS VM=1 Detector Normalization Correction */
export const DetectorNormalizationCorrection = new DicomTag(0x0018, 0x9768);
/** (0018,9769) VR=CS VM=1 Iterative Reconstruction Method */
export const IterativeReconstructionMethod = new DicomTag(0x0018, 0x9769);
/** (0018,9770) VR=CS VM=1 Attenuation Correction Temporal Relationship */
export const AttenuationCorrectionTemporalRelationship = new DicomTag(0x0018, 0x9770);
/** (0018,9771) VR=SQ VM=1 Patient Physiological State Sequence */
export const PatientPhysiologicalStateSequence = new DicomTag(0x0018, 0x9771);
/** (0018,9772) VR=SQ VM=1 Patient Physiological State Code Sequence */
export const PatientPhysiologicalStateCodeSequence = new DicomTag(0x0018, 0x9772);
/** (0018,9801) VR=FD VM=1-n Depth(s) of Focus */
export const DepthsOfFocus = new DicomTag(0x0018, 0x9801);
/** (0018,9803) VR=SQ VM=1 Excluded Intervals Sequence */
export const ExcludedIntervalsSequence = new DicomTag(0x0018, 0x9803);
/** (0018,9804) VR=DT VM=1 Exclusion Start DateTime */
export const ExclusionStartDateTime = new DicomTag(0x0018, 0x9804);
/** (0018,9805) VR=FD VM=1 Exclusion Duration */
export const ExclusionDuration = new DicomTag(0x0018, 0x9805);
/** (0018,9806) VR=SQ VM=1 US Image Description Sequence */
export const USImageDescriptionSequence = new DicomTag(0x0018, 0x9806);
/** (0018,9807) VR=SQ VM=1 Image Data Type Sequence */
export const ImageDataTypeSequence = new DicomTag(0x0018, 0x9807);
/** (0018,9808) VR=CS VM=1 Data Type */
export const DataType = new DicomTag(0x0018, 0x9808);
/** (0018,9809) VR=SQ VM=1 Transducer Scan Pattern Code Sequence */
export const TransducerScanPatternCodeSequence = new DicomTag(0x0018, 0x9809);
/** (0018,980B) VR=CS VM=1 Aliased Data Type */
export const AliasedDataType = new DicomTag(0x0018, 0x980B);
/** (0018,980C) VR=CS VM=1 Position Measuring Device Used */
export const PositionMeasuringDeviceUsed = new DicomTag(0x0018, 0x980C);
/** (0018,980D) VR=SQ VM=1 Transducer Geometry Code Sequence */
export const TransducerGeometryCodeSequence = new DicomTag(0x0018, 0x980D);
/** (0018,980E) VR=SQ VM=1 Transducer Beam Steering Code Sequence */
export const TransducerBeamSteeringCodeSequence = new DicomTag(0x0018, 0x980E);
/** (0018,980F) VR=SQ VM=1 Transducer Application Code Sequence */
export const TransducerApplicationCodeSequence = new DicomTag(0x0018, 0x980F);
/** (0018,9810) VR=US/SS VM=1 Zero Velocity Pixel Value */
export const ZeroVelocityPixelValue = new DicomTag(0x0018, 0x9810);
/** (0018,9821) VR=SQ VM=1 Photoacoustic Excitation Characteristics Sequence */
export const PhotoacousticExcitationCharacteristicsSequence = new DicomTag(0x0018, 0x9821);
/** (0018,9822) VR=FD VM=1 Excitation Spectral Width */
export const ExcitationSpectralWidth = new DicomTag(0x0018, 0x9822);
/** (0018,9823) VR=FD VM=1 Excitation Energy */
export const ExcitationEnergy = new DicomTag(0x0018, 0x9823);
/** (0018,9824) VR=FD VM=1 Excitation Pulse Duration */
export const ExcitationPulseDuration = new DicomTag(0x0018, 0x9824);
/** (0018,9825) VR=SQ VM=1 Excitation Wavelength Sequence */
export const ExcitationWavelengthSequence = new DicomTag(0x0018, 0x9825);
/** (0018,9826) VR=FD VM=1 Excitation Wavelength */
export const ExcitationWavelength = new DicomTag(0x0018, 0x9826);
/** (0018,9828) VR=CS VM=1 Illumination Translation Flag */
export const IlluminationTranslationFlag = new DicomTag(0x0018, 0x9828);
/** (0018,9829) VR=CS VM=1 Acoustic Coupling Medium Flag */
export const AcousticCouplingMediumFlag = new DicomTag(0x0018, 0x9829);
/** (0018,982A) VR=SQ VM=1 Acoustic Coupling Medium Code Sequence */
export const AcousticCouplingMediumCodeSequence = new DicomTag(0x0018, 0x982A);
/** (0018,982B) VR=FD VM=1 Acoustic Coupling Medium Temperature */
export const AcousticCouplingMediumTemperature = new DicomTag(0x0018, 0x982B);
/** (0018,982C) VR=SQ VM=1 Transducer Response Sequence */
export const TransducerResponseSequence = new DicomTag(0x0018, 0x982C);
/** (0018,982D) VR=FD VM=1 Center Frequency */
export const CenterFrequency = new DicomTag(0x0018, 0x982D);
/** (0018,982E) VR=FD VM=1 Fractional Bandwidth */
export const FractionalBandwidth = new DicomTag(0x0018, 0x982E);
/** (0018,982F) VR=FD VM=1 Lower Cutoff Frequency */
export const LowerCutoffFrequency = new DicomTag(0x0018, 0x982F);
/** (0018,9830) VR=FD VM=1 Upper Cutoff Frequency */
export const UpperCutoffFrequency = new DicomTag(0x0018, 0x9830);
/** (0018,9831) VR=SQ VM=1 Transducer Technology Sequence */
export const TransducerTechnologySequence = new DicomTag(0x0018, 0x9831);
/** (0018,9832) VR=SQ VM=1 Sound Speed Correction Mechanism Code Sequence */
export const SoundSpeedCorrectionMechanismCodeSequence = new DicomTag(0x0018, 0x9832);
/** (0018,9833) VR=FD VM=1 Object Sound Speed */
export const ObjectSoundSpeed = new DicomTag(0x0018, 0x9833);
/** (0018,9834) VR=FD VM=1 Acoustic Coupling Medium Sound Speed */
export const AcousticCouplingMediumSoundSpeed = new DicomTag(0x0018, 0x9834);
/** (0018,9835) VR=SQ VM=1 Photoacoustic Image Frame Type Sequence */
export const PhotoacousticImageFrameTypeSequence = new DicomTag(0x0018, 0x9835);
/** (0018,9836) VR=SQ VM=1 Image Data Type Code Sequence */
export const ImageDataTypeCodeSequence = new DicomTag(0x0018, 0x9836);
/** (0018,9900) VR=LO VM=1 Reference Location Label */
export const ReferenceLocationLabel = new DicomTag(0x0018, 0x9900);
/** (0018,9901) VR=UT VM=1 Reference Location Description */
export const ReferenceLocationDescription = new DicomTag(0x0018, 0x9901);
/** (0018,9902) VR=SQ VM=1 Reference Basis Code Sequence */
export const ReferenceBasisCodeSequence = new DicomTag(0x0018, 0x9902);
/** (0018,9903) VR=SQ VM=1 Reference Geometry Code Sequence */
export const ReferenceGeometryCodeSequence = new DicomTag(0x0018, 0x9903);
/** (0018,9904) VR=DS VM=1 Offset Distance */
export const OffsetDistance = new DicomTag(0x0018, 0x9904);
/** (0018,9905) VR=CS VM=1 Offset Direction */
export const OffsetDirection = new DicomTag(0x0018, 0x9905);
/** (0018,9906) VR=SQ VM=1 Potential Scheduled Protocol Code Sequence */
export const PotentialScheduledProtocolCodeSequence = new DicomTag(0x0018, 0x9906);
/** (0018,9907) VR=SQ VM=1 Potential Requested Procedure Code Sequence */
export const PotentialRequestedProcedureCodeSequence = new DicomTag(0x0018, 0x9907);
/** (0018,9908) VR=UC VM=1-n Potential Reasons for Procedure */
export const PotentialReasonsForProcedure = new DicomTag(0x0018, 0x9908);
/** (0018,9909) VR=SQ VM=1 Potential Reasons for Procedure Code Sequence */
export const PotentialReasonsForProcedureCodeSequence = new DicomTag(0x0018, 0x9909);
/** (0018,990A) VR=UC VM=1-n Potential Diagnostic Tasks */
export const PotentialDiagnosticTasks = new DicomTag(0x0018, 0x990A);
/** (0018,990B) VR=SQ VM=1 Contraindications Code Sequence */
export const ContraindicationsCodeSequence = new DicomTag(0x0018, 0x990B);
/** (0018,990C) VR=SQ VM=1 Referenced Defined Protocol Sequence */
export const ReferencedDefinedProtocolSequence = new DicomTag(0x0018, 0x990C);
/** (0018,990D) VR=SQ VM=1 Referenced Performed Protocol Sequence */
export const ReferencedPerformedProtocolSequence = new DicomTag(0x0018, 0x990D);
/** (0018,990E) VR=SQ VM=1 Predecessor Protocol Sequence */
export const PredecessorProtocolSequence = new DicomTag(0x0018, 0x990E);
/** (0018,990F) VR=UT VM=1 Protocol Planning Information */
export const ProtocolPlanningInformation = new DicomTag(0x0018, 0x990F);
/** (0018,9910) VR=UT VM=1 Protocol Design Rationale */
export const ProtocolDesignRationale = new DicomTag(0x0018, 0x9910);
/** (0018,9911) VR=SQ VM=1 Patient Specification Sequence */
export const PatientSpecificationSequence = new DicomTag(0x0018, 0x9911);
/** (0018,9912) VR=SQ VM=1 Model Specification Sequence */
export const ModelSpecificationSequence = new DicomTag(0x0018, 0x9912);
/** (0018,9913) VR=SQ VM=1 Parameters Specification Sequence */
export const ParametersSpecificationSequence = new DicomTag(0x0018, 0x9913);
/** (0018,9914) VR=SQ VM=1 Instruction Sequence */
export const InstructionSequence = new DicomTag(0x0018, 0x9914);
/** (0018,9915) VR=US VM=1 Instruction Index */
export const InstructionIndex = new DicomTag(0x0018, 0x9915);
/** (0018,9916) VR=LO VM=1 Instruction Text */
export const InstructionText = new DicomTag(0x0018, 0x9916);
/** (0018,9917) VR=UT VM=1 Instruction Description */
export const InstructionDescription = new DicomTag(0x0018, 0x9917);
/** (0018,9918) VR=CS VM=1 Instruction Performed Flag */
export const InstructionPerformedFlag = new DicomTag(0x0018, 0x9918);
/** (0018,9919) VR=DT VM=1 Instruction Performed DateTime */
export const InstructionPerformedDateTime = new DicomTag(0x0018, 0x9919);
/** (0018,991A) VR=UT VM=1 Instruction Performance Comment */
export const InstructionPerformanceComment = new DicomTag(0x0018, 0x991A);
/** (0018,991B) VR=SQ VM=1 Patient Positioning Instruction Sequence */
export const PatientPositioningInstructionSequence = new DicomTag(0x0018, 0x991B);
/** (0018,991C) VR=SQ VM=1 Positioning Method Code Sequence */
export const PositioningMethodCodeSequence = new DicomTag(0x0018, 0x991C);
/** (0018,991D) VR=SQ VM=1 Positioning Landmark Sequence */
export const PositioningLandmarkSequence = new DicomTag(0x0018, 0x991D);
/** (0018,991E) VR=UI VM=1 Target Frame of Reference UID */
export const TargetFrameOfReferenceUID = new DicomTag(0x0018, 0x991E);
/** (0018,991F) VR=SQ VM=1 Acquisition Protocol Element Specification Sequence */
export const AcquisitionProtocolElementSpecificationSequence = new DicomTag(0x0018, 0x991F);
/** (0018,9920) VR=SQ VM=1 Acquisition Protocol Element Sequence */
export const AcquisitionProtocolElementSequence = new DicomTag(0x0018, 0x9920);
/** (0018,9921) VR=US VM=1 Protocol Element Number */
export const ProtocolElementNumber = new DicomTag(0x0018, 0x9921);
/** (0018,9922) VR=LO VM=1 Protocol Element Name */
export const ProtocolElementName = new DicomTag(0x0018, 0x9922);
/** (0018,9923) VR=UT VM=1 Protocol Element Characteristics Summary */
export const ProtocolElementCharacteristicsSummary = new DicomTag(0x0018, 0x9923);
/** (0018,9924) VR=UT VM=1 Protocol Element Purpose */
export const ProtocolElementPurpose = new DicomTag(0x0018, 0x9924);
/** (0018,9930) VR=CS VM=1 Acquisition Motion */
export const AcquisitionMotion = new DicomTag(0x0018, 0x9930);
/** (0018,9931) VR=SQ VM=1 Acquisition Start Location Sequence */
export const AcquisitionStartLocationSequence = new DicomTag(0x0018, 0x9931);
/** (0018,9932) VR=SQ VM=1 Acquisition End Location Sequence */
export const AcquisitionEndLocationSequence = new DicomTag(0x0018, 0x9932);
/** (0018,9933) VR=SQ VM=1 Reconstruction Protocol Element Specification Sequence */
export const ReconstructionProtocolElementSpecificationSequence = new DicomTag(0x0018, 0x9933);
/** (0018,9934) VR=SQ VM=1 Reconstruction Protocol Element Sequence */
export const ReconstructionProtocolElementSequence = new DicomTag(0x0018, 0x9934);
/** (0018,9935) VR=SQ VM=1 Storage Protocol Element Specification Sequence */
export const StorageProtocolElementSpecificationSequence = new DicomTag(0x0018, 0x9935);
/** (0018,9936) VR=SQ VM=1 Storage Protocol Element Sequence */
export const StorageProtocolElementSequence = new DicomTag(0x0018, 0x9936);
/** (0018,9937) VR=LO VM=1 Requested Series Description */
export const RequestedSeriesDescription = new DicomTag(0x0018, 0x9937);
/** (0018,9938) VR=US VM=1-n Source Acquisition Protocol Element Number */
export const SourceAcquisitionProtocolElementNumber = new DicomTag(0x0018, 0x9938);
/** (0018,9939) VR=US VM=1-n Source Acquisition Beam Number */
export const SourceAcquisitionBeamNumber = new DicomTag(0x0018, 0x9939);
/** (0018,993A) VR=US VM=1-n Source Reconstruction Protocol Element Number */
export const SourceReconstructionProtocolElementNumber = new DicomTag(0x0018, 0x993A);
/** (0018,993B) VR=SQ VM=1 Reconstruction Start Location Sequence */
export const ReconstructionStartLocationSequence = new DicomTag(0x0018, 0x993B);
/** (0018,993C) VR=SQ VM=1 Reconstruction End Location Sequence */
export const ReconstructionEndLocationSequence = new DicomTag(0x0018, 0x993C);
/** (0018,993D) VR=SQ VM=1 Reconstruction Algorithm Sequence */
export const ReconstructionAlgorithmSequence = new DicomTag(0x0018, 0x993D);
/** (0018,993E) VR=SQ VM=1 Reconstruction Target Center Location Sequence */
export const ReconstructionTargetCenterLocationSequence = new DicomTag(0x0018, 0x993E);
/** (0018,9941) VR=UT VM=1 Image Filter Description */
export const ImageFilterDescription = new DicomTag(0x0018, 0x9941);
/** (0018,9942) VR=FD VM=1 CTDIvol Notification Trigger */
export const CTDIvolNotificationTrigger = new DicomTag(0x0018, 0x9942);
/** (0018,9943) VR=FD VM=1 DLP Notification Trigger */
export const DLPNotificationTrigger = new DicomTag(0x0018, 0x9943);
/** (0018,9944) VR=CS VM=1 Auto KVP Selection Type */
export const AutoKVPSelectionType = new DicomTag(0x0018, 0x9944);
/** (0018,9945) VR=FD VM=1 Auto KVP Upper Bound */
export const AutoKVPUpperBound = new DicomTag(0x0018, 0x9945);
/** (0018,9946) VR=FD VM=1 Auto KVP Lower Bound */
export const AutoKVPLowerBound = new DicomTag(0x0018, 0x9946);
/** (0018,9947) VR=CS VM=1 Protocol Defined Patient Position */
export const ProtocolDefinedPatientPosition = new DicomTag(0x0018, 0x9947);
/** (0018,A001) VR=SQ VM=1 Contributing Equipment Sequence */
export const ContributingEquipmentSequence = new DicomTag(0x0018, 0xA001);
/** (0018,A002) VR=DT VM=1 Contribution DateTime */
export const ContributionDateTime = new DicomTag(0x0018, 0xA002);
/** (0018,A003) VR=ST VM=1 Contribution Description */
export const ContributionDescription = new DicomTag(0x0018, 0xA003);
/** (0020,000D) VR=UI VM=1 Study Instance UID */
export const StudyInstanceUID = new DicomTag(0x0020, 0x000D);
/** (0020,000E) VR=UI VM=1 Series Instance UID */
export const SeriesInstanceUID = new DicomTag(0x0020, 0x000E);
/** (0020,0010) VR=SH VM=1 Study ID */
export const StudyID = new DicomTag(0x0020, 0x0010);
/** (0020,0011) VR=IS VM=1 Series Number */
export const SeriesNumber = new DicomTag(0x0020, 0x0011);
/** (0020,0012) VR=IS VM=1 Acquisition Number */
export const AcquisitionNumber = new DicomTag(0x0020, 0x0012);
/** (0020,0013) VR=IS VM=1 Instance Number */
export const InstanceNumber = new DicomTag(0x0020, 0x0013);
/** (0020,0014) VR=IS VM=1 Isotope Number (Retired) */
export const IsotopeNumber = new DicomTag(0x0020, 0x0014);
/** (0020,0015) VR=IS VM=1 Phase Number (Retired) */
export const PhaseNumber = new DicomTag(0x0020, 0x0015);
/** (0020,0016) VR=IS VM=1 Interval Number (Retired) */
export const IntervalNumber = new DicomTag(0x0020, 0x0016);
/** (0020,0017) VR=IS VM=1 Time Slot Number (Retired) */
export const TimeSlotNumber = new DicomTag(0x0020, 0x0017);
/** (0020,0018) VR=IS VM=1 Angle Number (Retired) */
export const AngleNumber = new DicomTag(0x0020, 0x0018);
/** (0020,0019) VR=IS VM=1 Item Number */
export const ItemNumber = new DicomTag(0x0020, 0x0019);
/** (0020,0020) VR=CS VM=2 Patient Orientation */
export const PatientOrientation = new DicomTag(0x0020, 0x0020);
/** (0020,0022) VR=IS VM=1 Overlay Number (Retired) */
export const OverlayNumber = new DicomTag(0x0020, 0x0022);
/** (0020,0024) VR=IS VM=1 Curve Number (Retired) */
export const CurveNumber = new DicomTag(0x0020, 0x0024);
/** (0020,0026) VR=IS VM=1 LUT Number (Retired) */
export const LUTNumber = new DicomTag(0x0020, 0x0026);
/** (0020,0027) VR=LO VM=1 Pyramid Label */
export const PyramidLabel = new DicomTag(0x0020, 0x0027);
/** (0020,0030) VR=DS VM=3 Image Position (Retired) */
export const ImagePosition = new DicomTag(0x0020, 0x0030);
/** (0020,0032) VR=DS VM=3 Image Position (Patient) */
export const ImagePositionPatient = new DicomTag(0x0020, 0x0032);
/** (0020,0035) VR=DS VM=6 Image Orientation (Retired) */
export const ImageOrientation = new DicomTag(0x0020, 0x0035);
/** (0020,0037) VR=DS VM=6 Image Orientation (Patient) */
export const ImageOrientationPatient = new DicomTag(0x0020, 0x0037);
/** (0020,0050) VR=DS VM=1 Location (Retired) */
export const Location = new DicomTag(0x0020, 0x0050);
/** (0020,0052) VR=UI VM=1 Frame of Reference UID */
export const FrameOfReferenceUID = new DicomTag(0x0020, 0x0052);
/** (0020,0060) VR=CS VM=1 Laterality */
export const Laterality = new DicomTag(0x0020, 0x0060);
/** (0020,0062) VR=CS VM=1 Image Laterality */
export const ImageLaterality = new DicomTag(0x0020, 0x0062);
/** (0020,0070) VR=LO VM=1 Image Geometry Type (Retired) */
export const ImageGeometryType = new DicomTag(0x0020, 0x0070);
/** (0020,0080) VR=CS VM=1-n Masking Image (Retired) */
export const MaskingImage = new DicomTag(0x0020, 0x0080);
/** (0020,00AA) VR=IS VM=1 Report Number (Retired) */
export const ReportNumber = new DicomTag(0x0020, 0x00AA);
/** (0020,0100) VR=IS VM=1 Temporal Position Identifier */
export const TemporalPositionIdentifier = new DicomTag(0x0020, 0x0100);
/** (0020,0105) VR=IS VM=1 Number of Temporal Positions */
export const NumberOfTemporalPositions = new DicomTag(0x0020, 0x0105);
/** (0020,0110) VR=DS VM=1 Temporal Resolution */
export const TemporalResolution = new DicomTag(0x0020, 0x0110);
/** (0020,0200) VR=UI VM=1 Synchronization Frame of Reference UID */
export const SynchronizationFrameOfReferenceUID = new DicomTag(0x0020, 0x0200);
/** (0020,0242) VR=UI VM=1 SOP Instance UID of Concatenation Source */
export const SOPInstanceUIDOfConcatenationSource = new DicomTag(0x0020, 0x0242);
/** (0020,1000) VR=IS VM=1 Series in Study (Retired) */
export const SeriesInStudy = new DicomTag(0x0020, 0x1000);
/** (0020,1001) VR=IS VM=1 Acquisitions in Series (Retired) */
export const AcquisitionsInSeries = new DicomTag(0x0020, 0x1001);
/** (0020,1002) VR=IS VM=1 Images in Acquisition */
export const ImagesInAcquisition = new DicomTag(0x0020, 0x1002);
/** (0020,1003) VR=IS VM=1 Images in Series (Retired) */
export const ImagesInSeries = new DicomTag(0x0020, 0x1003);
/** (0020,1004) VR=IS VM=1 Acquisitions in Study (Retired) */
export const AcquisitionsInStudy = new DicomTag(0x0020, 0x1004);
/** (0020,1005) VR=IS VM=1 Images in Study (Retired) */
export const ImagesInStudy = new DicomTag(0x0020, 0x1005);
/** (0020,1020) VR=LO VM=1-n Reference (Retired) */
export const Reference = new DicomTag(0x0020, 0x1020);
/** (0020,103F) VR=LO VM=1 Target Position Reference Indicator */
export const TargetPositionReferenceIndicator = new DicomTag(0x0020, 0x103F);
/** (0020,1040) VR=LO VM=1 Position Reference Indicator */
export const PositionReferenceIndicator = new DicomTag(0x0020, 0x1040);
/** (0020,1041) VR=DS VM=1 Slice Location */
export const SliceLocation = new DicomTag(0x0020, 0x1041);
/** (0020,1070) VR=IS VM=1-n Other Study Numbers (Retired) */
export const OtherStudyNumbers = new DicomTag(0x0020, 0x1070);
/** (0020,1200) VR=IS VM=1 Number of Patient Related Studies */
export const NumberOfPatientRelatedStudies = new DicomTag(0x0020, 0x1200);
/** (0020,1202) VR=IS VM=1 Number of Patient Related Series */
export const NumberOfPatientRelatedSeries = new DicomTag(0x0020, 0x1202);
/** (0020,1204) VR=IS VM=1 Number of Patient Related Instances */
export const NumberOfPatientRelatedInstances = new DicomTag(0x0020, 0x1204);
/** (0020,1206) VR=IS VM=1 Number of Study Related Series */
export const NumberOfStudyRelatedSeries = new DicomTag(0x0020, 0x1206);
/** (0020,1208) VR=IS VM=1 Number of Study Related Instances */
export const NumberOfStudyRelatedInstances = new DicomTag(0x0020, 0x1208);
/** (0020,1209) VR=IS VM=1 Number of Series Related Instances */
export const NumberOfSeriesRelatedInstances = new DicomTag(0x0020, 0x1209);
/** (0020,3401) VR=CS VM=1 Modifying Device ID (Retired) */
export const ModifyingDeviceID = new DicomTag(0x0020, 0x3401);
/** (0020,3402) VR=CS VM=1 Modified Image ID (Retired) */
export const ModifiedImageID = new DicomTag(0x0020, 0x3402);
/** (0020,3403) VR=DA VM=1 Modified Image Date (Retired) */
export const ModifiedImageDate = new DicomTag(0x0020, 0x3403);
/** (0020,3404) VR=LO VM=1 Modifying Device Manufacturer (Retired) */
export const ModifyingDeviceManufacturer = new DicomTag(0x0020, 0x3404);
/** (0020,3405) VR=TM VM=1 Modified Image Time (Retired) */
export const ModifiedImageTime = new DicomTag(0x0020, 0x3405);
/** (0020,3406) VR=LO VM=1 Modified Image Description (Retired) */
export const ModifiedImageDescription = new DicomTag(0x0020, 0x3406);
/** (0020,4000) VR=LT VM=1 Image Comments */
export const ImageComments = new DicomTag(0x0020, 0x4000);
/** (0020,5000) VR=AT VM=1-n Original Image Identification (Retired) */
export const OriginalImageIdentification = new DicomTag(0x0020, 0x5000);
/** (0020,5002) VR=LO VM=1-n Original Image Identification Nomenclature (Retired) */
export const OriginalImageIdentificationNomenclature = new DicomTag(0x0020, 0x5002);
/** (0020,9056) VR=SH VM=1 Stack ID */
export const StackID = new DicomTag(0x0020, 0x9056);
/** (0020,9057) VR=UL VM=1 In-Stack Position Number */
export const InStackPositionNumber = new DicomTag(0x0020, 0x9057);
/** (0020,9071) VR=SQ VM=1 Frame Anatomy Sequence */
export const FrameAnatomySequence = new DicomTag(0x0020, 0x9071);
/** (0020,9072) VR=CS VM=1 Frame Laterality */
export const FrameLaterality = new DicomTag(0x0020, 0x9072);
/** (0020,9111) VR=SQ VM=1 Frame Content Sequence */
export const FrameContentSequence = new DicomTag(0x0020, 0x9111);
/** (0020,9113) VR=SQ VM=1 Plane Position Sequence */
export const PlanePositionSequence = new DicomTag(0x0020, 0x9113);
/** (0020,9116) VR=SQ VM=1 Plane Orientation Sequence */
export const PlaneOrientationSequence = new DicomTag(0x0020, 0x9116);
/** (0020,9128) VR=UL VM=1 Temporal Position Index */
export const TemporalPositionIndex = new DicomTag(0x0020, 0x9128);
/** (0020,9153) VR=FD VM=1 Nominal Cardiac Trigger Delay Time */
export const NominalCardiacTriggerDelayTime = new DicomTag(0x0020, 0x9153);
/** (0020,9154) VR=FL VM=1 Nominal Cardiac Trigger Time Prior To R-Peak */
export const NominalCardiacTriggerTimePriorToRPeak = new DicomTag(0x0020, 0x9154);
/** (0020,9155) VR=FL VM=1 Actual Cardiac Trigger Time Prior To R-Peak */
export const ActualCardiacTriggerTimePriorToRPeak = new DicomTag(0x0020, 0x9155);
/** (0020,9156) VR=US VM=1 Frame Acquisition Number */
export const FrameAcquisitionNumber = new DicomTag(0x0020, 0x9156);
/** (0020,9157) VR=UL VM=1-n Dimension Index Values */
export const DimensionIndexValues = new DicomTag(0x0020, 0x9157);
/** (0020,9158) VR=LT VM=1 Frame Comments */
export const FrameComments = new DicomTag(0x0020, 0x9158);
/** (0020,9161) VR=UI VM=1 Concatenation UID */
export const ConcatenationUID = new DicomTag(0x0020, 0x9161);
/** (0020,9162) VR=US VM=1 In-concatenation Number */
export const InConcatenationNumber = new DicomTag(0x0020, 0x9162);
/** (0020,9163) VR=US VM=1 In-concatenation Total Number */
export const InConcatenationTotalNumber = new DicomTag(0x0020, 0x9163);
/** (0020,9164) VR=UI VM=1 Dimension Organization UID */
export const DimensionOrganizationUID = new DicomTag(0x0020, 0x9164);
/** (0020,9165) VR=AT VM=1 Dimension Index Pointer */
export const DimensionIndexPointer = new DicomTag(0x0020, 0x9165);
/** (0020,9167) VR=AT VM=1 Functional Group Pointer */
export const FunctionalGroupPointer = new DicomTag(0x0020, 0x9167);
/** (0020,9170) VR=SQ VM=1 Unassigned Shared Converted Attributes Sequence */
export const UnassignedSharedConvertedAttributesSequence = new DicomTag(0x0020, 0x9170);
/** (0020,9171) VR=SQ VM=1 Unassigned Per-Frame Converted Attributes Sequence */
export const UnassignedPerFrameConvertedAttributesSequence = new DicomTag(0x0020, 0x9171);
/** (0020,9172) VR=SQ VM=1 Conversion Source Attributes Sequence */
export const ConversionSourceAttributesSequence = new DicomTag(0x0020, 0x9172);
/** (0020,9213) VR=LO VM=1 Dimension Index Private Creator */
export const DimensionIndexPrivateCreator = new DicomTag(0x0020, 0x9213);
/** (0020,9221) VR=SQ VM=1 Dimension Organization Sequence */
export const DimensionOrganizationSequence = new DicomTag(0x0020, 0x9221);
/** (0020,9222) VR=SQ VM=1 Dimension Index Sequence */
export const DimensionIndexSequence = new DicomTag(0x0020, 0x9222);
/** (0020,9228) VR=UL VM=1 Concatenation Frame Offset Number */
export const ConcatenationFrameOffsetNumber = new DicomTag(0x0020, 0x9228);
/** (0020,9238) VR=LO VM=1 Functional Group Private Creator */
export const FunctionalGroupPrivateCreator = new DicomTag(0x0020, 0x9238);
/** (0020,9241) VR=FL VM=1 Nominal Percentage of Cardiac Phase */
export const NominalPercentageOfCardiacPhase = new DicomTag(0x0020, 0x9241);
/** (0020,9245) VR=FL VM=1 Nominal Percentage of Respiratory Phase */
export const NominalPercentageOfRespiratoryPhase = new DicomTag(0x0020, 0x9245);
/** (0020,9246) VR=FL VM=1 Starting Respiratory Amplitude */
export const StartingRespiratoryAmplitude = new DicomTag(0x0020, 0x9246);
/** (0020,9247) VR=CS VM=1 Starting Respiratory Phase */
export const StartingRespiratoryPhase = new DicomTag(0x0020, 0x9247);
/** (0020,9248) VR=FL VM=1 Ending Respiratory Amplitude */
export const EndingRespiratoryAmplitude = new DicomTag(0x0020, 0x9248);
/** (0020,9249) VR=CS VM=1 Ending Respiratory Phase */
export const EndingRespiratoryPhase = new DicomTag(0x0020, 0x9249);
/** (0020,9250) VR=CS VM=1 Respiratory Trigger Type */
export const RespiratoryTriggerType = new DicomTag(0x0020, 0x9250);
/** (0020,9251) VR=FD VM=1 R-R Interval Time Nominal */
export const RRIntervalTimeNominal = new DicomTag(0x0020, 0x9251);
/** (0020,9252) VR=FD VM=1 Actual Cardiac Trigger Delay Time */
export const ActualCardiacTriggerDelayTime = new DicomTag(0x0020, 0x9252);
/** (0020,9253) VR=SQ VM=1 Respiratory Synchronization Sequence */
export const RespiratorySynchronizationSequence = new DicomTag(0x0020, 0x9253);
/** (0020,9254) VR=FD VM=1 Respiratory Interval Time */
export const RespiratoryIntervalTime = new DicomTag(0x0020, 0x9254);
/** (0020,9255) VR=FD VM=1 Nominal Respiratory Trigger Delay Time */
export const NominalRespiratoryTriggerDelayTime = new DicomTag(0x0020, 0x9255);
/** (0020,9256) VR=FD VM=1 Respiratory Trigger Delay Threshold */
export const RespiratoryTriggerDelayThreshold = new DicomTag(0x0020, 0x9256);
/** (0020,9257) VR=FD VM=1 Actual Respiratory Trigger Delay Time */
export const ActualRespiratoryTriggerDelayTime = new DicomTag(0x0020, 0x9257);
/** (0020,9301) VR=FD VM=3 Image Position (Volume) */
export const ImagePositionVolume = new DicomTag(0x0020, 0x9301);
/** (0020,9302) VR=FD VM=6 Image Orientation (Volume) */
export const ImageOrientationVolume = new DicomTag(0x0020, 0x9302);
/** (0020,9307) VR=CS VM=1 Ultrasound Acquisition Geometry */
export const UltrasoundAcquisitionGeometry = new DicomTag(0x0020, 0x9307);
/** (0020,9308) VR=FD VM=3 Apex Position */
export const ApexPosition = new DicomTag(0x0020, 0x9308);
/** (0020,9309) VR=FD VM=16 Volume to Transducer Mapping Matrix */
export const VolumeToTransducerMappingMatrix = new DicomTag(0x0020, 0x9309);
/** (0020,930A) VR=FD VM=16 Volume to Table Mapping Matrix */
export const VolumeToTableMappingMatrix = new DicomTag(0x0020, 0x930A);
/** (0020,930B) VR=CS VM=1 Volume to Transducer Relationship */
export const VolumeToTransducerRelationship = new DicomTag(0x0020, 0x930B);
/** (0020,930C) VR=CS VM=1 Patient Frame of Reference Source */
export const PatientFrameOfReferenceSource = new DicomTag(0x0020, 0x930C);
/** (0020,930D) VR=FD VM=1 Temporal Position Time Offset */
export const TemporalPositionTimeOffset = new DicomTag(0x0020, 0x930D);
/** (0020,930E) VR=SQ VM=1 Plane Position (Volume) Sequence */
export const PlanePositionVolumeSequence = new DicomTag(0x0020, 0x930E);
/** (0020,930F) VR=SQ VM=1 Plane Orientation (Volume) Sequence */
export const PlaneOrientationVolumeSequence = new DicomTag(0x0020, 0x930F);
/** (0020,9310) VR=SQ VM=1 Temporal Position Sequence */
export const TemporalPositionSequence = new DicomTag(0x0020, 0x9310);
/** (0020,9311) VR=CS VM=1 Dimension Organization Type */
export const DimensionOrganizationType = new DicomTag(0x0020, 0x9311);
/** (0020,9312) VR=UI VM=1 Volume Frame of Reference UID */
export const VolumeFrameOfReferenceUID = new DicomTag(0x0020, 0x9312);
/** (0020,9313) VR=UI VM=1 Table Frame of Reference UID */
export const TableFrameOfReferenceUID = new DicomTag(0x0020, 0x9313);
/** (0020,9421) VR=LO VM=1 Dimension Description Label */
export const DimensionDescriptionLabel = new DicomTag(0x0020, 0x9421);
/** (0020,9450) VR=SQ VM=1 Patient Orientation in Frame Sequence */
export const PatientOrientationInFrameSequence = new DicomTag(0x0020, 0x9450);
/** (0020,9453) VR=LO VM=1 Frame Label */
export const FrameLabel = new DicomTag(0x0020, 0x9453);
/** (0020,9518) VR=US VM=1-n Acquisition Index */
export const AcquisitionIndex = new DicomTag(0x0020, 0x9518);
/** (0020,9529) VR=SQ VM=1 Contributing SOP Instances Reference Sequence */
export const ContributingSOPInstancesReferenceSequence = new DicomTag(0x0020, 0x9529);
/** (0020,9536) VR=US VM=1 Reconstruction Index */
export const ReconstructionIndex = new DicomTag(0x0020, 0x9536);
/** (0022,0001) VR=US VM=1 Light Path Filter Pass-Through Wavelength */
export const LightPathFilterPassThroughWavelength = new DicomTag(0x0022, 0x0001);
/** (0022,0002) VR=US VM=2 Light Path Filter Pass Band */
export const LightPathFilterPassBand = new DicomTag(0x0022, 0x0002);
/** (0022,0003) VR=US VM=1 Image Path Filter Pass-Through Wavelength */
export const ImagePathFilterPassThroughWavelength = new DicomTag(0x0022, 0x0003);
/** (0022,0004) VR=US VM=2 Image Path Filter Pass Band */
export const ImagePathFilterPassBand = new DicomTag(0x0022, 0x0004);
/** (0022,0005) VR=CS VM=1 Patient Eye Movement Commanded */
export const PatientEyeMovementCommanded = new DicomTag(0x0022, 0x0005);
/** (0022,0006) VR=SQ VM=1 Patient Eye Movement Command Code Sequence */
export const PatientEyeMovementCommandCodeSequence = new DicomTag(0x0022, 0x0006);
/** (0022,0007) VR=FL VM=1 Spherical Lens Power */
export const SphericalLensPower = new DicomTag(0x0022, 0x0007);
/** (0022,0008) VR=FL VM=1 Cylinder Lens Power */
export const CylinderLensPower = new DicomTag(0x0022, 0x0008);
/** (0022,0009) VR=FL VM=1 Cylinder Axis */
export const CylinderAxis = new DicomTag(0x0022, 0x0009);
/** (0022,000A) VR=FL VM=1 Emmetropic Magnification */
export const EmmetropicMagnification = new DicomTag(0x0022, 0x000A);
/** (0022,000B) VR=FL VM=1 Intra Ocular Pressure */
export const IntraOcularPressure = new DicomTag(0x0022, 0x000B);
/** (0022,000C) VR=FL VM=1 Horizontal Field of View */
export const HorizontalFieldOfView = new DicomTag(0x0022, 0x000C);
/** (0022,000D) VR=CS VM=1 Pupil Dilated */
export const PupilDilated = new DicomTag(0x0022, 0x000D);
/** (0022,000E) VR=FL VM=1 Degree of Dilation */
export const DegreeOfDilation = new DicomTag(0x0022, 0x000E);
/** (0022,000F) VR=FD VM=1 Vertex Distance */
export const VertexDistance = new DicomTag(0x0022, 0x000F);
/** (0022,0010) VR=FL VM=1 Stereo Baseline Angle */
export const StereoBaselineAngle = new DicomTag(0x0022, 0x0010);
/** (0022,0011) VR=FL VM=1 Stereo Baseline Displacement */
export const StereoBaselineDisplacement = new DicomTag(0x0022, 0x0011);
/** (0022,0012) VR=FL VM=1 Stereo Horizontal Pixel Offset */
export const StereoHorizontalPixelOffset = new DicomTag(0x0022, 0x0012);
/** (0022,0013) VR=FL VM=1 Stereo Vertical Pixel Offset */
export const StereoVerticalPixelOffset = new DicomTag(0x0022, 0x0013);
/** (0022,0014) VR=FL VM=1 Stereo Rotation */
export const StereoRotation = new DicomTag(0x0022, 0x0014);
/** (0022,0015) VR=SQ VM=1 Acquisition Device Type Code Sequence */
export const AcquisitionDeviceTypeCodeSequence = new DicomTag(0x0022, 0x0015);
/** (0022,0016) VR=SQ VM=1 Illumination Type Code Sequence */
export const IlluminationTypeCodeSequence = new DicomTag(0x0022, 0x0016);
/** (0022,0017) VR=SQ VM=1 Light Path Filter Type Stack Code Sequence */
export const LightPathFilterTypeStackCodeSequence = new DicomTag(0x0022, 0x0017);
/** (0022,0018) VR=SQ VM=1 Image Path Filter Type Stack Code Sequence */
export const ImagePathFilterTypeStackCodeSequence = new DicomTag(0x0022, 0x0018);
/** (0022,0019) VR=SQ VM=1 Lenses Code Sequence */
export const LensesCodeSequence = new DicomTag(0x0022, 0x0019);
/** (0022,001A) VR=SQ VM=1 Channel Description Code Sequence */
export const ChannelDescriptionCodeSequence = new DicomTag(0x0022, 0x001A);
/** (0022,001B) VR=SQ VM=1 Refractive State Sequence */
export const RefractiveStateSequence = new DicomTag(0x0022, 0x001B);
/** (0022,001C) VR=SQ VM=1 Mydriatic Agent Code Sequence */
export const MydriaticAgentCodeSequence = new DicomTag(0x0022, 0x001C);
/** (0022,001D) VR=SQ VM=1 Relative Image Position Code Sequence */
export const RelativeImagePositionCodeSequence = new DicomTag(0x0022, 0x001D);
/** (0022,001E) VR=FL VM=1 Camera Angle of View */
export const CameraAngleOfView = new DicomTag(0x0022, 0x001E);
/** (0022,0020) VR=SQ VM=1 Stereo Pairs Sequence */
export const StereoPairsSequence = new DicomTag(0x0022, 0x0020);
/** (0022,0021) VR=SQ VM=1 Left Image Sequence */
export const LeftImageSequence = new DicomTag(0x0022, 0x0021);
/** (0022,0022) VR=SQ VM=1 Right Image Sequence */
export const RightImageSequence = new DicomTag(0x0022, 0x0022);
/** (0022,0028) VR=CS VM=1 Stereo Pairs Present */
export const StereoPairsPresent = new DicomTag(0x0022, 0x0028);
/** (0022,0030) VR=FL VM=1 Axial Length of the Eye */
export const AxialLengthOfTheEye = new DicomTag(0x0022, 0x0030);
/** (0022,0031) VR=SQ VM=1 Ophthalmic Frame Location Sequence */
export const OphthalmicFrameLocationSequence = new DicomTag(0x0022, 0x0031);
/** (0022,0032) VR=FL VM=2-2n Reference Coordinates */
export const ReferenceCoordinates = new DicomTag(0x0022, 0x0032);
/** (0022,0035) VR=FL VM=1 Depth Spatial Resolution */
export const DepthSpatialResolution = new DicomTag(0x0022, 0x0035);
/** (0022,0036) VR=FL VM=1 Maximum Depth Distortion */
export const MaximumDepthDistortion = new DicomTag(0x0022, 0x0036);
/** (0022,0037) VR=FL VM=1 Along-scan Spatial Resolution */
export const AlongScanSpatialResolution = new DicomTag(0x0022, 0x0037);
/** (0022,0038) VR=FL VM=1 Maximum Along-scan Distortion */
export const MaximumAlongScanDistortion = new DicomTag(0x0022, 0x0038);
/** (0022,0039) VR=CS VM=1 Ophthalmic Image Orientation */
export const OphthalmicImageOrientation = new DicomTag(0x0022, 0x0039);
/** (0022,0041) VR=FL VM=1 Depth of Transverse Image */
export const DepthOfTransverseImage = new DicomTag(0x0022, 0x0041);
/** (0022,0042) VR=SQ VM=1 Mydriatic Agent Concentration Units Sequence */
export const MydriaticAgentConcentrationUnitsSequence = new DicomTag(0x0022, 0x0042);
/** (0022,0048) VR=FL VM=1 Across-scan Spatial Resolution */
export const AcrossScanSpatialResolution = new DicomTag(0x0022, 0x0048);
/** (0022,0049) VR=FL VM=1 Maximum Across-scan Distortion */
export const MaximumAcrossScanDistortion = new DicomTag(0x0022, 0x0049);
/** (0022,004E) VR=DS VM=1 Mydriatic Agent Concentration */
export const MydriaticAgentConcentration = new DicomTag(0x0022, 0x004E);
/** (0022,0055) VR=FL VM=1 Illumination Wave Length */
export const IlluminationWaveLength = new DicomTag(0x0022, 0x0055);
/** (0022,0056) VR=FL VM=1 Illumination Power */
export const IlluminationPower = new DicomTag(0x0022, 0x0056);
/** (0022,0057) VR=FL VM=1 Illumination Bandwidth */
export const IlluminationBandwidth = new DicomTag(0x0022, 0x0057);
/** (0022,0058) VR=SQ VM=1 Mydriatic Agent Sequence */
export const MydriaticAgentSequence = new DicomTag(0x0022, 0x0058);
/** (0022,1007) VR=SQ VM=1 Ophthalmic Axial Measurements Right Eye Sequence */
export const OphthalmicAxialMeasurementsRightEyeSequence = new DicomTag(0x0022, 0x1007);
/** (0022,1008) VR=SQ VM=1 Ophthalmic Axial Measurements Left Eye Sequence */
export const OphthalmicAxialMeasurementsLeftEyeSequence = new DicomTag(0x0022, 0x1008);
/** (0022,1009) VR=CS VM=1 Ophthalmic Axial Measurements Device Type */
export const OphthalmicAxialMeasurementsDeviceType = new DicomTag(0x0022, 0x1009);
/** (0022,1010) VR=CS VM=1 Ophthalmic Axial Length Measurements Type */
export const OphthalmicAxialLengthMeasurementsType = new DicomTag(0x0022, 0x1010);
/** (0022,1012) VR=SQ VM=1 Ophthalmic Axial Length Sequence */
export const OphthalmicAxialLengthSequence = new DicomTag(0x0022, 0x1012);
/** (0022,1019) VR=FL VM=1 Ophthalmic Axial Length */
export const OphthalmicAxialLength = new DicomTag(0x0022, 0x1019);
/** (0022,1024) VR=SQ VM=1 Lens Status Code Sequence */
export const LensStatusCodeSequence = new DicomTag(0x0022, 0x1024);
/** (0022,1025) VR=SQ VM=1 Vitreous Status Code Sequence */
export const VitreousStatusCodeSequence = new DicomTag(0x0022, 0x1025);
/** (0022,1028) VR=SQ VM=1 IOL Formula Code Sequence */
export const IOLFormulaCodeSequence = new DicomTag(0x0022, 0x1028);
/** (0022,1029) VR=LO VM=1 IOL Formula Detail */
export const IOLFormulaDetail = new DicomTag(0x0022, 0x1029);
/** (0022,1033) VR=FL VM=1 Keratometer Index */
export const KeratometerIndex = new DicomTag(0x0022, 0x1033);
/** (0022,1035) VR=SQ VM=1 Source of Ophthalmic Axial Length Code Sequence */
export const SourceOfOphthalmicAxialLengthCodeSequence = new DicomTag(0x0022, 0x1035);
/** (0022,1036) VR=SQ VM=1 Source of Corneal Size Data Code Sequence */
export const SourceOfCornealSizeDataCodeSequence = new DicomTag(0x0022, 0x1036);
/** (0022,1037) VR=FL VM=1 Target Refraction */
export const TargetRefraction = new DicomTag(0x0022, 0x1037);
/** (0022,1039) VR=CS VM=1 Refractive Procedure Occurred */
export const RefractiveProcedureOccurred = new DicomTag(0x0022, 0x1039);
/** (0022,1040) VR=SQ VM=1 Refractive Surgery Type Code Sequence */
export const RefractiveSurgeryTypeCodeSequence = new DicomTag(0x0022, 0x1040);
/** (0022,1044) VR=SQ VM=1 Ophthalmic Ultrasound Method Code Sequence */
export const OphthalmicUltrasoundMethodCodeSequence = new DicomTag(0x0022, 0x1044);
/** (0022,1045) VR=SQ VM=1 Surgically Induced Astigmatism Sequence */
export const SurgicallyInducedAstigmatismSequence = new DicomTag(0x0022, 0x1045);
/** (0022,1046) VR=CS VM=1 Type of Optical Correction */
export const TypeOfOpticalCorrection = new DicomTag(0x0022, 0x1046);
/** (0022,1047) VR=SQ VM=1 Toric IOL Power Sequence */
export const ToricIOLPowerSequence = new DicomTag(0x0022, 0x1047);
/** (0022,1048) VR=SQ VM=1 Predicted Toric Error Sequence */
export const PredictedToricErrorSequence = new DicomTag(0x0022, 0x1048);
/** (0022,1049) VR=CS VM=1 Pre-Selected for Implantation */
export const PreSelectedForImplantation = new DicomTag(0x0022, 0x1049);
/** (0022,104A) VR=SQ VM=1 Toric IOL Power for Exact Emmetropia Sequence */
export const ToricIOLPowerForExactEmmetropiaSequence = new DicomTag(0x0022, 0x104A);
/** (0022,104B) VR=SQ VM=1 Toric IOL Power for Exact Target Refraction Sequence */
export const ToricIOLPowerForExactTargetRefractionSequence = new DicomTag(0x0022, 0x104B);
/** (0022,1050) VR=SQ VM=1 Ophthalmic Axial Length Measurements Sequence */
export const OphthalmicAxialLengthMeasurementsSequence = new DicomTag(0x0022, 0x1050);
/** (0022,1053) VR=FL VM=1 IOL Power */
export const IOLPower = new DicomTag(0x0022, 0x1053);
/** (0022,1054) VR=FL VM=1 Predicted Refractive Error */
export const PredictedRefractiveError = new DicomTag(0x0022, 0x1054);
/** (0022,1059) VR=FL VM=1 Ophthalmic Axial Length Velocity */
export const OphthalmicAxialLengthVelocity = new DicomTag(0x0022, 0x1059);
/** (0022,1065) VR=LO VM=1 Lens Status Description */
export const LensStatusDescription = new DicomTag(0x0022, 0x1065);
/** (0022,1066) VR=LO VM=1 Vitreous Status Description */
export const VitreousStatusDescription = new DicomTag(0x0022, 0x1066);
/** (0022,1090) VR=SQ VM=1 IOL Power Sequence */
export const IOLPowerSequence = new DicomTag(0x0022, 0x1090);
/** (0022,1092) VR=SQ VM=1 Lens Constant Sequence */
export const LensConstantSequence = new DicomTag(0x0022, 0x1092);
/** (0022,1093) VR=LO VM=1 IOL Manufacturer */
export const IOLManufacturer = new DicomTag(0x0022, 0x1093);
/** (0022,1094) VR=LO VM=1 Lens Constant Description (Retired) */
export const LensConstantDescription = new DicomTag(0x0022, 0x1094);
/** (0022,1095) VR=LO VM=1 Implant Name */
export const ImplantName = new DicomTag(0x0022, 0x1095);
/** (0022,1096) VR=SQ VM=1 Keratometry Measurement Type Code Sequence */
export const KeratometryMeasurementTypeCodeSequence = new DicomTag(0x0022, 0x1096);
/** (0022,1097) VR=LO VM=1 Implant Part Number */
export const ImplantPartNumber = new DicomTag(0x0022, 0x1097);
/** (0022,1100) VR=SQ VM=1 Referenced Ophthalmic Axial Measurements Sequence */
export const ReferencedOphthalmicAxialMeasurementsSequence = new DicomTag(0x0022, 0x1100);
/** (0022,1101) VR=SQ VM=1 Ophthalmic Axial Length Measurements Segment Name Code Sequence */
export const OphthalmicAxialLengthMeasurementsSegmentNameCodeSequence = new DicomTag(0x0022, 0x1101);
/** (0022,1103) VR=SQ VM=1 Refractive Error Before Refractive Surgery Code Sequence */
export const RefractiveErrorBeforeRefractiveSurgeryCodeSequence = new DicomTag(0x0022, 0x1103);
/** (0022,1121) VR=FL VM=1 IOL Power For Exact Emmetropia */
export const IOLPowerForExactEmmetropia = new DicomTag(0x0022, 0x1121);
/** (0022,1122) VR=FL VM=1 IOL Power For Exact Target Refraction */
export const IOLPowerForExactTargetRefraction = new DicomTag(0x0022, 0x1122);
/** (0022,1125) VR=SQ VM=1 Anterior Chamber Depth Definition Code Sequence */
export const AnteriorChamberDepthDefinitionCodeSequence = new DicomTag(0x0022, 0x1125);
/** (0022,1127) VR=SQ VM=1 Lens Thickness Sequence */
export const LensThicknessSequence = new DicomTag(0x0022, 0x1127);
/** (0022,1128) VR=SQ VM=1 Anterior Chamber Depth Sequence */
export const AnteriorChamberDepthSequence = new DicomTag(0x0022, 0x1128);
/** (0022,112A) VR=SQ VM=1 Calculation Comment Sequence */
export const CalculationCommentSequence = new DicomTag(0x0022, 0x112A);
/** (0022,112B) VR=CS VM=1 Calculation Comment Type */
export const CalculationCommentType = new DicomTag(0x0022, 0x112B);
/** (0022,112C) VR=LT VM=1 Calculation Comment */
export const CalculationComment = new DicomTag(0x0022, 0x112C);
/** (0022,1130) VR=FL VM=1 Lens Thickness */
export const LensThickness = new DicomTag(0x0022, 0x1130);
/** (0022,1131) VR=FL VM=1 Anterior Chamber Depth */
export const AnteriorChamberDepth = new DicomTag(0x0022, 0x1131);
/** (0022,1132) VR=SQ VM=1 Source of Lens Thickness Data Code Sequence */
export const SourceOfLensThicknessDataCodeSequence = new DicomTag(0x0022, 0x1132);
/** (0022,1133) VR=SQ VM=1 Source of Anterior Chamber Depth Data Code Sequence */
export const SourceOfAnteriorChamberDepthDataCodeSequence = new DicomTag(0x0022, 0x1133);
/** (0022,1134) VR=SQ VM=1 Source of Refractive Measurements Sequence */
export const SourceOfRefractiveMeasurementsSequence = new DicomTag(0x0022, 0x1134);
/** (0022,1135) VR=SQ VM=1 Source of Refractive Measurements Code Sequence */
export const SourceOfRefractiveMeasurementsCodeSequence = new DicomTag(0x0022, 0x1135);
/** (0022,1140) VR=CS VM=1 Ophthalmic Axial Length Measurement Modified */
export const OphthalmicAxialLengthMeasurementModified = new DicomTag(0x0022, 0x1140);
/** (0022,1150) VR=SQ VM=1 Ophthalmic Axial Length Data Source Code Sequence */
export const OphthalmicAxialLengthDataSourceCodeSequence = new DicomTag(0x0022, 0x1150);
/** (0022,1153) VR=SQ VM=1 Ophthalmic Axial Length Acquisition Method Code Sequence (Retired) */
export const OphthalmicAxialLengthAcquisitionMethodCodeSequence = new DicomTag(0x0022, 0x1153);
/** (0022,1155) VR=FL VM=1 Signal to Noise Ratio */
export const SignalToNoiseRatio = new DicomTag(0x0022, 0x1155);
/** (0022,1159) VR=LO VM=1 Ophthalmic Axial Length Data Source Description */
export const OphthalmicAxialLengthDataSourceDescription = new DicomTag(0x0022, 0x1159);
/** (0022,1210) VR=SQ VM=1 Ophthalmic Axial Length Measurements Total Length Sequence */
export const OphthalmicAxialLengthMeasurementsTotalLengthSequence = new DicomTag(0x0022, 0x1210);
/** (0022,1211) VR=SQ VM=1 Ophthalmic Axial Length Measurements Segmental Length Sequence */
export const OphthalmicAxialLengthMeasurementsSegmentalLengthSequence = new DicomTag(0x0022, 0x1211);
/** (0022,1212) VR=SQ VM=1 Ophthalmic Axial Length Measurements Length Summation Sequence */
export const OphthalmicAxialLengthMeasurementsLengthSummationSequence = new DicomTag(0x0022, 0x1212);
/** (0022,1220) VR=SQ VM=1 Ultrasound Ophthalmic Axial Length Measurements Sequence */
export const UltrasoundOphthalmicAxialLengthMeasurementsSequence = new DicomTag(0x0022, 0x1220);
/** (0022,1225) VR=SQ VM=1 Optical Ophthalmic Axial Length Measurements Sequence */
export const OpticalOphthalmicAxialLengthMeasurementsSequence = new DicomTag(0x0022, 0x1225);
/** (0022,1230) VR=SQ VM=1 Ultrasound Selected Ophthalmic Axial Length Sequence */
export const UltrasoundSelectedOphthalmicAxialLengthSequence = new DicomTag(0x0022, 0x1230);
/** (0022,1250) VR=SQ VM=1 Ophthalmic Axial Length Selection Method Code Sequence */
export const OphthalmicAxialLengthSelectionMethodCodeSequence = new DicomTag(0x0022, 0x1250);
/** (0022,1255) VR=SQ VM=1 Optical Selected Ophthalmic Axial Length Sequence */
export const OpticalSelectedOphthalmicAxialLengthSequence = new DicomTag(0x0022, 0x1255);
/** (0022,1257) VR=SQ VM=1 Selected Segmental Ophthalmic Axial Length Sequence */
export const SelectedSegmentalOphthalmicAxialLengthSequence = new DicomTag(0x0022, 0x1257);
/** (0022,1260) VR=SQ VM=1 Selected Total Ophthalmic Axial Length Sequence */
export const SelectedTotalOphthalmicAxialLengthSequence = new DicomTag(0x0022, 0x1260);
/** (0022,1262) VR=SQ VM=1 Ophthalmic Axial Length Quality Metric Sequence */
export const OphthalmicAxialLengthQualityMetricSequence = new DicomTag(0x0022, 0x1262);
/** (0022,1265) VR=SQ VM=1 Ophthalmic Axial Length Quality Metric Type Code Sequence (Retired) */
export const OphthalmicAxialLengthQualityMetricTypeCodeSequence = new DicomTag(0x0022, 0x1265);
/** (0022,1273) VR=LO VM=1 Ophthalmic Axial Length Quality Metric Type Description (Retired) */
export const OphthalmicAxialLengthQualityMetricTypeDescription = new DicomTag(0x0022, 0x1273);
/** (0022,1300) VR=SQ VM=1 Intraocular Lens Calculations Right Eye Sequence */
export const IntraocularLensCalculationsRightEyeSequence = new DicomTag(0x0022, 0x1300);
/** (0022,1310) VR=SQ VM=1 Intraocular Lens Calculations Left Eye Sequence */
export const IntraocularLensCalculationsLeftEyeSequence = new DicomTag(0x0022, 0x1310);
/** (0022,1330) VR=SQ VM=1 Referenced Ophthalmic Axial Length Measurement QC Image Sequence */
export const ReferencedOphthalmicAxialLengthMeasurementQCImageSequence = new DicomTag(0x0022, 0x1330);
/** (0022,1415) VR=CS VM=1 Ophthalmic Mapping Device Type */
export const OphthalmicMappingDeviceType = new DicomTag(0x0022, 0x1415);
/** (0022,1420) VR=SQ VM=1 Acquisition Method Code Sequence */
export const AcquisitionMethodCodeSequence = new DicomTag(0x0022, 0x1420);
/** (0022,1423) VR=SQ VM=1 Acquisition Method Algorithm Sequence */
export const AcquisitionMethodAlgorithmSequence = new DicomTag(0x0022, 0x1423);
/** (0022,1436) VR=SQ VM=1 Ophthalmic Thickness Map Type Code Sequence */
export const OphthalmicThicknessMapTypeCodeSequence = new DicomTag(0x0022, 0x1436);
/** (0022,1443) VR=SQ VM=1 Ophthalmic Thickness Mapping Normals Sequence */
export const OphthalmicThicknessMappingNormalsSequence = new DicomTag(0x0022, 0x1443);
/** (0022,1445) VR=SQ VM=1 Retinal Thickness Definition Code Sequence */
export const RetinalThicknessDefinitionCodeSequence = new DicomTag(0x0022, 0x1445);
/** (0022,1450) VR=SQ VM=1 Pixel Value Mapping to Coded Concept Sequence */
export const PixelValueMappingToCodedConceptSequence = new DicomTag(0x0022, 0x1450);
/** (0022,1452) VR=US/SS VM=1 Mapped Pixel Value */
export const MappedPixelValue = new DicomTag(0x0022, 0x1452);
/** (0022,1454) VR=LO VM=1 Pixel Value Mapping Explanation */
export const PixelValueMappingExplanation = new DicomTag(0x0022, 0x1454);
/** (0022,1458) VR=SQ VM=1 Ophthalmic Thickness Map Quality Threshold Sequence */
export const OphthalmicThicknessMapQualityThresholdSequence = new DicomTag(0x0022, 0x1458);
/** (0022,1460) VR=FL VM=1 Ophthalmic Thickness Map Threshold Quality Rating */
export const OphthalmicThicknessMapThresholdQualityRating = new DicomTag(0x0022, 0x1460);
/** (0022,1463) VR=FL VM=2 Anatomic Structure Reference Point */
export const AnatomicStructureReferencePoint = new DicomTag(0x0022, 0x1463);
/** (0022,1465) VR=SQ VM=1 Registration to Localizer Sequence */
export const RegistrationToLocalizerSequence = new DicomTag(0x0022, 0x1465);
/** (0022,1466) VR=CS VM=1 Registered Localizer Units */
export const RegisteredLocalizerUnits = new DicomTag(0x0022, 0x1466);
/** (0022,1467) VR=FL VM=2 Registered Localizer Top Left Hand Corner */
export const RegisteredLocalizerTopLeftHandCorner = new DicomTag(0x0022, 0x1467);
/** (0022,1468) VR=FL VM=2 Registered Localizer Bottom Right Hand Corner */
export const RegisteredLocalizerBottomRightHandCorner = new DicomTag(0x0022, 0x1468);
/** (0022,1470) VR=SQ VM=1 Ophthalmic Thickness Map Quality Rating Sequence */
export const OphthalmicThicknessMapQualityRatingSequence = new DicomTag(0x0022, 0x1470);
/** (0022,1472) VR=SQ VM=1 Relevant OPT Attributes Sequence */
export const RelevantOPTAttributesSequence = new DicomTag(0x0022, 0x1472);
/** (0022,1512) VR=SQ VM=1 Transformation Method Code Sequence */
export const TransformationMethodCodeSequence = new DicomTag(0x0022, 0x1512);
/** (0022,1513) VR=SQ VM=1 Transformation Algorithm Sequence */
export const TransformationAlgorithmSequence = new DicomTag(0x0022, 0x1513);
/** (0022,1515) VR=CS VM=1 Ophthalmic Axial Length Method */
export const OphthalmicAxialLengthMethod = new DicomTag(0x0022, 0x1515);
/** (0022,1517) VR=FL VM=1 Ophthalmic FOV */
export const OphthalmicFOV = new DicomTag(0x0022, 0x1517);
/** (0022,1518) VR=SQ VM=1 Two Dimensional to Three Dimensional Map Sequence */
export const TwoDimensionalToThreeDimensionalMapSequence = new DicomTag(0x0022, 0x1518);
/** (0022,1525) VR=SQ VM=1 Wide Field Ophthalmic Photography Quality Rating Sequence */
export const WideFieldOphthalmicPhotographyQualityRatingSequence = new DicomTag(0x0022, 0x1525);
/** (0022,1526) VR=SQ VM=1 Wide Field Ophthalmic Photography Quality Threshold Sequence */
export const WideFieldOphthalmicPhotographyQualityThresholdSequence = new DicomTag(0x0022, 0x1526);
/** (0022,1527) VR=FL VM=1 Wide Field Ophthalmic Photography Threshold Quality Rating */
export const WideFieldOphthalmicPhotographyThresholdQualityRating = new DicomTag(0x0022, 0x1527);
/** (0022,1528) VR=FL VM=1 X Coordinates Center Pixel View Angle */
export const XCoordinatesCenterPixelViewAngle = new DicomTag(0x0022, 0x1528);
/** (0022,1529) VR=FL VM=1 Y Coordinates Center Pixel View Angle */
export const YCoordinatesCenterPixelViewAngle = new DicomTag(0x0022, 0x1529);
/** (0022,1530) VR=UL VM=1 Number of Map Points */
export const NumberOfMapPoints = new DicomTag(0x0022, 0x1530);
/** (0022,1531) VR=OF VM=1 Two Dimensional to Three Dimensional Map Data */
export const TwoDimensionalToThreeDimensionalMapData = new DicomTag(0x0022, 0x1531);
/** (0022,1612) VR=SQ VM=1 Derivation Algorithm Sequence */
export const DerivationAlgorithmSequence = new DicomTag(0x0022, 0x1612);
/** (0022,1615) VR=SQ VM=1 Ophthalmic Image Type Code Sequence */
export const OphthalmicImageTypeCodeSequence = new DicomTag(0x0022, 0x1615);
/** (0022,1616) VR=LO VM=1 Ophthalmic Image Type Description */
export const OphthalmicImageTypeDescription = new DicomTag(0x0022, 0x1616);
/** (0022,1618) VR=SQ VM=1 Scan Pattern Type Code Sequence */
export const ScanPatternTypeCodeSequence = new DicomTag(0x0022, 0x1618);
/** (0022,1620) VR=SQ VM=1 Referenced Surface Mesh Identification Sequence */
export const ReferencedSurfaceMeshIdentificationSequence = new DicomTag(0x0022, 0x1620);
/** (0022,1622) VR=CS VM=1 Ophthalmic Volumetric Properties Flag */
export const OphthalmicVolumetricPropertiesFlag = new DicomTag(0x0022, 0x1622);
/** (0022,1623) VR=FL VM=1 Ophthalmic Anatomic Reference Point Frame Coordinate */
export const OphthalmicAnatomicReferencePointFrameCoordinate = new DicomTag(0x0022, 0x1623);
/** (0022,1624) VR=FL VM=1 Ophthalmic Anatomic Reference Point X-Coordinate */
export const OphthalmicAnatomicReferencePointXCoordinate = new DicomTag(0x0022, 0x1624);
/** (0022,1626) VR=FL VM=1 Ophthalmic Anatomic Reference Point Y-Coordinate */
export const OphthalmicAnatomicReferencePointYCoordinate = new DicomTag(0x0022, 0x1626);
/** (0022,1627) VR=SQ VM=1 Ophthalmic En Face Volume Descriptor Sequence */
export const OphthalmicEnFaceVolumeDescriptorSequence = new DicomTag(0x0022, 0x1627);
/** (0022,1628) VR=SQ VM=1 Ophthalmic En Face Image Quality Rating Sequence */
export const OphthalmicEnFaceImageQualityRatingSequence = new DicomTag(0x0022, 0x1628);
/** (0022,1629) VR=CS VM=1 Ophthalmic En Face Volume Descriptor Scope */
export const OphthalmicEnFaceVolumeDescriptorScope = new DicomTag(0x0022, 0x1629);
/** (0022,1630) VR=DS VM=1 Quality Threshold */
export const QualityThreshold = new DicomTag(0x0022, 0x1630);
/** (0022,1632) VR=SQ VM=1 Ophthalmic Anatomic Reference Point Sequence */
export const OphthalmicAnatomicReferencePointSequence = new DicomTag(0x0022, 0x1632);
/** (0022,1633) VR=CS VM=1 Ophthalmic Anatomic Reference Point Localization Type */
export const OphthalmicAnatomicReferencePointLocalizationType = new DicomTag(0x0022, 0x1633);
/** (0022,1634) VR=IS VM=1 Primary Anatomic Structure Item Index */
export const PrimaryAnatomicStructureItemIndex = new DicomTag(0x0022, 0x1634);
/** (0022,1640) VR=SQ VM=1 OCT B-scan Analysis Acquisition Parameters Sequence */
export const OCTBscanAnalysisAcquisitionParametersSequence = new DicomTag(0x0022, 0x1640);
/** (0022,1642) VR=UL VM=1 Number of B-scans Per Frame */
export const NumberOfBscansPerFrame = new DicomTag(0x0022, 0x1642);
/** (0022,1643) VR=FL VM=1 B-scan Slab Thickness */
export const BscanSlabThickness = new DicomTag(0x0022, 0x1643);
/** (0022,1644) VR=FL VM=1 Distance Between B-scan Slabs */
export const DistanceBetweenBscanSlabs = new DicomTag(0x0022, 0x1644);
/** (0022,1645) VR=FL VM=1 B-scan Cycle Time */
export const BscanCycleTime = new DicomTag(0x0022, 0x1645);
/** (0022,1646) VR=FL VM=1-n B-scan Cycle Time Vector */
export const BscanCycleTimeVector = new DicomTag(0x0022, 0x1646);
/** (0022,1649) VR=FL VM=1 A-scan Rate */
export const AscanRate = new DicomTag(0x0022, 0x1649);
/** (0022,1650) VR=FL VM=1 B-scan Rate */
export const BscanRate = new DicomTag(0x0022, 0x1650);
/** (0022,1658) VR=UL VM=1 Surface Mesh Z-Pixel Offset */
export const SurfaceMeshZPixelOffset = new DicomTag(0x0022, 0x1658);
/** (0024,0010) VR=FL VM=1 Visual Field Horizontal Extent */
export const VisualFieldHorizontalExtent = new DicomTag(0x0024, 0x0010);
/** (0024,0011) VR=FL VM=1 Visual Field Vertical Extent */
export const VisualFieldVerticalExtent = new DicomTag(0x0024, 0x0011);
/** (0024,0012) VR=CS VM=1 Visual Field Shape */
export const VisualFieldShape = new DicomTag(0x0024, 0x0012);
/** (0024,0016) VR=SQ VM=1 Screening Test Mode Code Sequence */
export const ScreeningTestModeCodeSequence = new DicomTag(0x0024, 0x0016);
/** (0024,0018) VR=FL VM=1 Maximum Stimulus Luminance */
export const MaximumStimulusLuminance = new DicomTag(0x0024, 0x0018);
/** (0024,0020) VR=FL VM=1 Background Luminance */
export const BackgroundLuminance = new DicomTag(0x0024, 0x0020);
/** (0024,0021) VR=SQ VM=1 Stimulus Color Code Sequence */
export const StimulusColorCodeSequence = new DicomTag(0x0024, 0x0021);
/** (0024,0024) VR=SQ VM=1 Background Illumination Color Code Sequence */
export const BackgroundIlluminationColorCodeSequence = new DicomTag(0x0024, 0x0024);
/** (0024,0025) VR=FL VM=1 Stimulus Area */
export const StimulusArea = new DicomTag(0x0024, 0x0025);
/** (0024,0028) VR=FL VM=1 Stimulus Presentation Time */
export const StimulusPresentationTime = new DicomTag(0x0024, 0x0028);
/** (0024,0032) VR=SQ VM=1 Fixation Sequence */
export const FixationSequence = new DicomTag(0x0024, 0x0032);
/** (0024,0033) VR=SQ VM=1 Fixation Monitoring Code Sequence */
export const FixationMonitoringCodeSequence = new DicomTag(0x0024, 0x0033);
/** (0024,0034) VR=SQ VM=1 Visual Field Catch Trial Sequence */
export const VisualFieldCatchTrialSequence = new DicomTag(0x0024, 0x0034);
/** (0024,0035) VR=US VM=1 Fixation Checked Quantity */
export const FixationCheckedQuantity = new DicomTag(0x0024, 0x0035);
/** (0024,0036) VR=US VM=1 Patient Not Properly Fixated Quantity */
export const PatientNotProperlyFixatedQuantity = new DicomTag(0x0024, 0x0036);
/** (0024,0037) VR=CS VM=1 Presented Visual Stimuli Data Flag */
export const PresentedVisualStimuliDataFlag = new DicomTag(0x0024, 0x0037);
/** (0024,0038) VR=US VM=1 Number of Visual Stimuli */
export const NumberOfVisualStimuli = new DicomTag(0x0024, 0x0038);
/** (0024,0039) VR=CS VM=1 Excessive Fixation Losses Data Flag */
export const ExcessiveFixationLossesDataFlag = new DicomTag(0x0024, 0x0039);
/** (0024,0040) VR=CS VM=1 Excessive Fixation Losses */
export const ExcessiveFixationLosses = new DicomTag(0x0024, 0x0040);
/** (0024,0042) VR=US VM=1 Stimuli Retesting Quantity */
export const StimuliRetestingQuantity = new DicomTag(0x0024, 0x0042);
/** (0024,0044) VR=LT VM=1 Comments on Patient's Performance of Visual Field */
export const CommentsOnPatientPerformanceOfVisualField = new DicomTag(0x0024, 0x0044);
/** (0024,0045) VR=CS VM=1 False Negatives Estimate Flag */
export const FalseNegativesEstimateFlag = new DicomTag(0x0024, 0x0045);
/** (0024,0046) VR=FL VM=1 False Negatives Estimate */
export const FalseNegativesEstimate = new DicomTag(0x0024, 0x0046);
/** (0024,0048) VR=US VM=1 Negative Catch Trials Quantity */
export const NegativeCatchTrialsQuantity = new DicomTag(0x0024, 0x0048);
/** (0024,0050) VR=US VM=1 False Negatives Quantity */
export const FalseNegativesQuantity = new DicomTag(0x0024, 0x0050);
/** (0024,0051) VR=CS VM=1 Excessive False Negatives Data Flag */
export const ExcessiveFalseNegativesDataFlag = new DicomTag(0x0024, 0x0051);
/** (0024,0052) VR=CS VM=1 Excessive False Negatives */
export const ExcessiveFalseNegatives = new DicomTag(0x0024, 0x0052);
/** (0024,0053) VR=CS VM=1 False Positives Estimate Flag */
export const FalsePositivesEstimateFlag = new DicomTag(0x0024, 0x0053);
/** (0024,0054) VR=FL VM=1 False Positives Estimate */
export const FalsePositivesEstimate = new DicomTag(0x0024, 0x0054);
/** (0024,0055) VR=CS VM=1 Catch Trials Data Flag */
export const CatchTrialsDataFlag = new DicomTag(0x0024, 0x0055);
/** (0024,0056) VR=US VM=1 Positive Catch Trials Quantity */
export const PositiveCatchTrialsQuantity = new DicomTag(0x0024, 0x0056);
/** (0024,0057) VR=CS VM=1 Test Point Normals Data Flag */
export const TestPointNormalsDataFlag = new DicomTag(0x0024, 0x0057);
/** (0024,0058) VR=SQ VM=1 Test Point Normals Sequence */
export const TestPointNormalsSequence = new DicomTag(0x0024, 0x0058);
/** (0024,0059) VR=CS VM=1 Global Deviation Probability Normals Flag */
export const GlobalDeviationProbabilityNormalsFlag = new DicomTag(0x0024, 0x0059);
/** (0024,0060) VR=US VM=1 False Positives Quantity */
export const FalsePositivesQuantity = new DicomTag(0x0024, 0x0060);
/** (0024,0061) VR=CS VM=1 Excessive False Positives Data Flag */
export const ExcessiveFalsePositivesDataFlag = new DicomTag(0x0024, 0x0061);
/** (0024,0062) VR=CS VM=1 Excessive False Positives */
export const ExcessiveFalsePositives = new DicomTag(0x0024, 0x0062);
/** (0024,0063) VR=CS VM=1 Visual Field Test Normals Flag */
export const VisualFieldTestNormalsFlag = new DicomTag(0x0024, 0x0063);
/** (0024,0064) VR=SQ VM=1 Results Normals Sequence */
export const ResultsNormalsSequence = new DicomTag(0x0024, 0x0064);
/** (0024,0065) VR=SQ VM=1 Age Corrected Sensitivity Deviation Algorithm Sequence */
export const AgeCorrectedSensitivityDeviationAlgorithmSequence = new DicomTag(0x0024, 0x0065);
/** (0024,0066) VR=FL VM=1 Global Deviation From Normal */
export const GlobalDeviationFromNormal = new DicomTag(0x0024, 0x0066);
/** (0024,0067) VR=SQ VM=1 Generalized Defect Sensitivity Deviation Algorithm Sequence */
export const GeneralizedDefectSensitivityDeviationAlgorithmSequence = new DicomTag(0x0024, 0x0067);
/** (0024,0068) VR=FL VM=1 Localized Deviation From Normal */
export const LocalizedDeviationFromNormal = new DicomTag(0x0024, 0x0068);
/** (0024,0069) VR=LO VM=1 Patient Reliability Indicator */
export const PatientReliabilityIndicator = new DicomTag(0x0024, 0x0069);
/** (0024,0070) VR=FL VM=1 Visual Field Mean Sensitivity */
export const VisualFieldMeanSensitivity = new DicomTag(0x0024, 0x0070);
/** (0024,0071) VR=FL VM=1 Global Deviation Probability */
export const GlobalDeviationProbability = new DicomTag(0x0024, 0x0071);
/** (0024,0072) VR=CS VM=1 Local Deviation Probability Normals Flag */
export const LocalDeviationProbabilityNormalsFlag = new DicomTag(0x0024, 0x0072);
/** (0024,0073) VR=FL VM=1 Localized Deviation Probability */
export const LocalizedDeviationProbability = new DicomTag(0x0024, 0x0073);
/** (0024,0074) VR=CS VM=1 Short Term Fluctuation Calculated */
export const ShortTermFluctuationCalculated = new DicomTag(0x0024, 0x0074);
/** (0024,0075) VR=FL VM=1 Short Term Fluctuation */
export const ShortTermFluctuation = new DicomTag(0x0024, 0x0075);
/** (0024,0076) VR=CS VM=1 Short Term Fluctuation Probability Calculated */
export const ShortTermFluctuationProbabilityCalculated = new DicomTag(0x0024, 0x0076);
/** (0024,0077) VR=FL VM=1 Short Term Fluctuation Probability */
export const ShortTermFluctuationProbability = new DicomTag(0x0024, 0x0077);
/** (0024,0078) VR=CS VM=1 Corrected Localized Deviation From Normal Calculated */
export const CorrectedLocalizedDeviationFromNormalCalculated = new DicomTag(0x0024, 0x0078);
/** (0024,0079) VR=FL VM=1 Corrected Localized Deviation From Normal */
export const CorrectedLocalizedDeviationFromNormal = new DicomTag(0x0024, 0x0079);
/** (0024,0080) VR=CS VM=1 Corrected Localized Deviation From Normal Probability Calculated */
export const CorrectedLocalizedDeviationFromNormalProbabilityCalculated = new DicomTag(0x0024, 0x0080);
/** (0024,0081) VR=FL VM=1 Corrected Localized Deviation From Normal Probability */
export const CorrectedLocalizedDeviationFromNormalProbability = new DicomTag(0x0024, 0x0081);
/** (0024,0083) VR=SQ VM=1 Global Deviation Probability Sequence */
export const GlobalDeviationProbabilitySequence = new DicomTag(0x0024, 0x0083);
/** (0024,0085) VR=SQ VM=1 Localized Deviation Probability Sequence */
export const LocalizedDeviationProbabilitySequence = new DicomTag(0x0024, 0x0085);
/** (0024,0086) VR=CS VM=1 Foveal Sensitivity Measured */
export const FovealSensitivityMeasured = new DicomTag(0x0024, 0x0086);
/** (0024,0087) VR=FL VM=1 Foveal Sensitivity */
export const FovealSensitivity = new DicomTag(0x0024, 0x0087);
/** (0024,0088) VR=FL VM=1 Visual Field Test Duration */
export const VisualFieldTestDuration = new DicomTag(0x0024, 0x0088);
/** (0024,0089) VR=SQ VM=1 Visual Field Test Point Sequence */
export const VisualFieldTestPointSequence = new DicomTag(0x0024, 0x0089);
/** (0024,0090) VR=FL VM=1 Visual Field Test Point X-Coordinate */
export const VisualFieldTestPointXCoordinate = new DicomTag(0x0024, 0x0090);
/** (0024,0091) VR=FL VM=1 Visual Field Test Point Y-Coordinate */
export const VisualFieldTestPointYCoordinate = new DicomTag(0x0024, 0x0091);
/** (0024,0092) VR=FL VM=1 Age Corrected Sensitivity Deviation Value */
export const AgeCorrectedSensitivityDeviationValue = new DicomTag(0x0024, 0x0092);
/** (0024,0093) VR=CS VM=1 Stimulus Results */
export const StimulusResults = new DicomTag(0x0024, 0x0093);
/** (0024,0094) VR=FL VM=1 Sensitivity Value */
export const SensitivityValue = new DicomTag(0x0024, 0x0094);
/** (0024,0095) VR=CS VM=1 Retest Stimulus Seen */
export const RetestStimulusSeen = new DicomTag(0x0024, 0x0095);
/** (0024,0096) VR=FL VM=1 Retest Sensitivity Value */
export const RetestSensitivityValue = new DicomTag(0x0024, 0x0096);
/** (0024,0097) VR=SQ VM=1 Visual Field Test Point Normals Sequence */
export const VisualFieldTestPointNormalsSequence = new DicomTag(0x0024, 0x0097);
/** (0024,0098) VR=FL VM=1 Quantified Defect */
export const QuantifiedDefect = new DicomTag(0x0024, 0x0098);
/** (0024,0100) VR=FL VM=1 Age Corrected Sensitivity Deviation Probability Value */
export const AgeCorrectedSensitivityDeviationProbabilityValue = new DicomTag(0x0024, 0x0100);
/** (0024,0102) VR=CS VM=1 Generalized Defect Corrected Sensitivity Deviation Flag */
export const GeneralizedDefectCorrectedSensitivityDeviationFlag = new DicomTag(0x0024, 0x0102);
/** (0024,0103) VR=FL VM=1 Generalized Defect Corrected Sensitivity Deviation Value */
export const GeneralizedDefectCorrectedSensitivityDeviationValue = new DicomTag(0x0024, 0x0103);
/** (0024,0104) VR=FL VM=1 Generalized Defect Corrected Sensitivity Deviation Probability Value */
export const GeneralizedDefectCorrectedSensitivityDeviationProbabilityValue = new DicomTag(0x0024, 0x0104);
/** (0024,0105) VR=FL VM=1 Minimum Sensitivity Value */
export const MinimumSensitivityValue = new DicomTag(0x0024, 0x0105);
/** (0024,0106) VR=CS VM=1 Blind Spot Localized */
export const BlindSpotLocalized = new DicomTag(0x0024, 0x0106);
/** (0024,0107) VR=FL VM=1 Blind Spot X-Coordinate */
export const BlindSpotXCoordinate = new DicomTag(0x0024, 0x0107);
/** (0024,0108) VR=FL VM=1 Blind Spot Y-Coordinate */
export const BlindSpotYCoordinate = new DicomTag(0x0024, 0x0108);
/** (0024,0110) VR=SQ VM=1 Visual Acuity Measurement Sequence */
export const VisualAcuityMeasurementSequence = new DicomTag(0x0024, 0x0110);
/** (0024,0112) VR=SQ VM=1 Refractive Parameters Used on Patient Sequence */
export const RefractiveParametersUsedOnPatientSequence = new DicomTag(0x0024, 0x0112);
/** (0024,0113) VR=CS VM=1 Measurement Laterality */
export const MeasurementLaterality = new DicomTag(0x0024, 0x0113);
/** (0024,0114) VR=SQ VM=1 Ophthalmic Patient Clinical Information Left Eye Sequence */
export const OphthalmicPatientClinicalInformationLeftEyeSequence = new DicomTag(0x0024, 0x0114);
/** (0024,0115) VR=SQ VM=1 Ophthalmic Patient Clinical Information Right Eye Sequence */
export const OphthalmicPatientClinicalInformationRightEyeSequence = new DicomTag(0x0024, 0x0115);
/** (0024,0117) VR=CS VM=1 Foveal Point Normative Data Flag */
export const FovealPointNormativeDataFlag = new DicomTag(0x0024, 0x0117);
/** (0024,0118) VR=FL VM=1 Foveal Point Probability Value */
export const FovealPointProbabilityValue = new DicomTag(0x0024, 0x0118);
/** (0024,0120) VR=CS VM=1 Screening Baseline Measured */
export const ScreeningBaselineMeasured = new DicomTag(0x0024, 0x0120);
/** (0024,0122) VR=SQ VM=1 Screening Baseline Measured Sequence */
export const ScreeningBaselineMeasuredSequence = new DicomTag(0x0024, 0x0122);
/** (0024,0124) VR=CS VM=1 Screening Baseline Type */
export const ScreeningBaselineType = new DicomTag(0x0024, 0x0124);
/** (0024,0126) VR=FL VM=1 Screening Baseline Value */
export const ScreeningBaselineValue = new DicomTag(0x0024, 0x0126);
/** (0024,0202) VR=LO VM=1 Algorithm Source */
export const AlgorithmSource = new DicomTag(0x0024, 0x0202);
/** (0024,0306) VR=LO VM=1 Data Set Name */
export const DataSetName = new DicomTag(0x0024, 0x0306);
/** (0024,0307) VR=LO VM=1 Data Set Version */
export const DataSetVersion = new DicomTag(0x0024, 0x0307);
/** (0024,0308) VR=LO VM=1 Data Set Source */
export const DataSetSource = new DicomTag(0x0024, 0x0308);
/** (0024,0309) VR=LO VM=1 Data Set Description */
export const DataSetDescription = new DicomTag(0x0024, 0x0309);
/** (0024,0317) VR=SQ VM=1 Visual Field Test Reliability Global Index Sequence */
export const VisualFieldTestReliabilityGlobalIndexSequence = new DicomTag(0x0024, 0x0317);
/** (0024,0320) VR=SQ VM=1 Visual Field Global Results Index Sequence */
export const VisualFieldGlobalResultsIndexSequence = new DicomTag(0x0024, 0x0320);
/** (0024,0325) VR=SQ VM=1 Data Observation Sequence */
export const DataObservationSequence = new DicomTag(0x0024, 0x0325);
/** (0024,0338) VR=CS VM=1 Index Normals Flag */
export const IndexNormalsFlag = new DicomTag(0x0024, 0x0338);
/** (0024,0341) VR=FL VM=1 Index Probability */
export const IndexProbability = new DicomTag(0x0024, 0x0341);
/** (0024,0344) VR=SQ VM=1 Index Probability Sequence */
export const IndexProbabilitySequence = new DicomTag(0x0024, 0x0344);
/** (0028,0002) VR=US VM=1 Samples per Pixel */
export const SamplesPerPixel = new DicomTag(0x0028, 0x0002);
/** (0028,0003) VR=US VM=1 Samples per Pixel Used */
export const SamplesPerPixelUsed = new DicomTag(0x0028, 0x0003);
/** (0028,0004) VR=CS VM=1 Photometric Interpretation */
export const PhotometricInterpretation = new DicomTag(0x0028, 0x0004);
/** (0028,0005) VR=US VM=1 Image Dimensions (Retired) */
export const ImageDimensions = new DicomTag(0x0028, 0x0005);
/** (0028,0006) VR=US VM=1 Planar Configuration */
export const PlanarConfiguration = new DicomTag(0x0028, 0x0006);
/** (0028,0008) VR=IS VM=1 Number of Frames */
export const NumberOfFrames = new DicomTag(0x0028, 0x0008);
/** (0028,0009) VR=AT VM=1-n Frame Increment Pointer */
export const FrameIncrementPointer = new DicomTag(0x0028, 0x0009);
/** (0028,000A) VR=AT VM=1-n Frame Dimension Pointer */
export const FrameDimensionPointer = new DicomTag(0x0028, 0x000A);
/** (0028,0010) VR=US VM=1 Rows */
export const Rows = new DicomTag(0x0028, 0x0010);
/** (0028,0011) VR=US VM=1 Columns */
export const Columns = new DicomTag(0x0028, 0x0011);
/** (0028,0012) VR=US VM=1 Planes (Retired) */
export const Planes = new DicomTag(0x0028, 0x0012);
/** (0028,0014) VR=US VM=1 Ultrasound Color Data Present */
export const UltrasoundColorDataPresent = new DicomTag(0x0028, 0x0014);
/** (0028,0030) VR=DS VM=2 Pixel Spacing */
export const PixelSpacing = new DicomTag(0x0028, 0x0030);
/** (0028,0031) VR=DS VM=2 Zoom Factor */
export const ZoomFactor = new DicomTag(0x0028, 0x0031);
/** (0028,0032) VR=DS VM=2 Zoom Center */
export const ZoomCenter = new DicomTag(0x0028, 0x0032);
/** (0028,0034) VR=IS VM=2 Pixel Aspect Ratio */
export const PixelAspectRatio = new DicomTag(0x0028, 0x0034);
/** (0028,0040) VR=CS VM=1 Image Format (Retired) */
export const ImageFormat = new DicomTag(0x0028, 0x0040);
/** (0028,0050) VR=LO VM=1-n Manipulated Image (Retired) */
export const ManipulatedImage = new DicomTag(0x0028, 0x0050);
/** (0028,0051) VR=CS VM=1-n Corrected Image */
export const CorrectedImage = new DicomTag(0x0028, 0x0051);
/** (0028,005F) VR=LO VM=1 Compression Recognition Code (Retired) */
export const CompressionRecognitionCode = new DicomTag(0x0028, 0x005F);
/** (0028,0060) VR=CS VM=1 Compression Code (Retired) */
export const CompressionCode = new DicomTag(0x0028, 0x0060);
/** (0028,0061) VR=SH VM=1 Compression Originator (Retired) */
export const CompressionOriginator = new DicomTag(0x0028, 0x0061);
/** (0028,0062) VR=LO VM=1 Compression Label (Retired) */
export const CompressionLabel = new DicomTag(0x0028, 0x0062);
/** (0028,0063) VR=SH VM=1 Compression Description (Retired) */
export const CompressionDescription = new DicomTag(0x0028, 0x0063);
/** (0028,0065) VR=CS VM=1-n Compression Sequence (Retired) */
export const CompressionSequence = new DicomTag(0x0028, 0x0065);
/** (0028,0066) VR=AT VM=1-n Compression Step Pointers (Retired) */
export const CompressionStepPointers = new DicomTag(0x0028, 0x0066);
/** (0028,0068) VR=US VM=1 Repeat Interval (Retired) */
export const RepeatInterval = new DicomTag(0x0028, 0x0068);
/** (0028,0069) VR=US VM=1 Bits Grouped (Retired) */
export const BitsGrouped = new DicomTag(0x0028, 0x0069);
/** (0028,0070) VR=US VM=1-n Perimeter Table (Retired) */
export const PerimeterTable = new DicomTag(0x0028, 0x0070);
/** (0028,0071) VR=US/SS VM=1 Perimeter Value (Retired) */
export const PerimeterValue = new DicomTag(0x0028, 0x0071);
/** (0028,0080) VR=US VM=1 Predictor Rows (Retired) */
export const PredictorRows = new DicomTag(0x0028, 0x0080);
/** (0028,0081) VR=US VM=1 Predictor Columns (Retired) */
export const PredictorColumns = new DicomTag(0x0028, 0x0081);
/** (0028,0082) VR=US VM=1-n Predictor Constants (Retired) */
export const PredictorConstants = new DicomTag(0x0028, 0x0082);
/** (0028,0090) VR=CS VM=1 Blocked Pixels (Retired) */
export const BlockedPixels = new DicomTag(0x0028, 0x0090);
/** (0028,0091) VR=US VM=1 Block Rows (Retired) */
export const BlockRows = new DicomTag(0x0028, 0x0091);
/** (0028,0092) VR=US VM=1 Block Columns (Retired) */
export const BlockColumns = new DicomTag(0x0028, 0x0092);
/** (0028,0093) VR=US VM=1 Row Overlap (Retired) */
export const RowOverlap = new DicomTag(0x0028, 0x0093);
/** (0028,0094) VR=US VM=1 Column Overlap (Retired) */
export const ColumnOverlap = new DicomTag(0x0028, 0x0094);
/** (0028,0100) VR=US VM=1 Bits Allocated */
export const BitsAllocated = new DicomTag(0x0028, 0x0100);
/** (0028,0101) VR=US VM=1 Bits Stored */
export const BitsStored = new DicomTag(0x0028, 0x0101);
/** (0028,0102) VR=US VM=1 High Bit */
export const HighBit = new DicomTag(0x0028, 0x0102);
/** (0028,0103) VR=US VM=1 Pixel Representation */
export const PixelRepresentation = new DicomTag(0x0028, 0x0103);
/** (0028,0104) VR=US/SS VM=1 Smallest Valid Pixel Value (Retired) */
export const SmallestValidPixelValue = new DicomTag(0x0028, 0x0104);
/** (0028,0105) VR=US/SS VM=1 Largest Valid Pixel Value (Retired) */
export const LargestValidPixelValue = new DicomTag(0x0028, 0x0105);
/** (0028,0106) VR=US/SS VM=1 Smallest Image Pixel Value */
export const SmallestImagePixelValue = new DicomTag(0x0028, 0x0106);
/** (0028,0107) VR=US/SS VM=1 Largest Image Pixel Value */
export const LargestImagePixelValue = new DicomTag(0x0028, 0x0107);
/** (0028,0108) VR=US/SS VM=1 Smallest Pixel Value in Series */
export const SmallestPixelValueInSeries = new DicomTag(0x0028, 0x0108);
/** (0028,0109) VR=US/SS VM=1 Largest Pixel Value in Series */
export const LargestPixelValueInSeries = new DicomTag(0x0028, 0x0109);
/** (0028,0110) VR=US/SS VM=1 Smallest Image Pixel Value in Plane (Retired) */
export const SmallestImagePixelValueInPlane = new DicomTag(0x0028, 0x0110);
/** (0028,0111) VR=US/SS VM=1 Largest Image Pixel Value in Plane (Retired) */
export const LargestImagePixelValueInPlane = new DicomTag(0x0028, 0x0111);
/** (0028,0120) VR=US/SS VM=1 Pixel Padding Value */
export const PixelPaddingValue = new DicomTag(0x0028, 0x0120);
/** (0028,0121) VR=US/SS VM=1 Pixel Padding Range Limit */
export const PixelPaddingRangeLimit = new DicomTag(0x0028, 0x0121);
/** (0028,0122) VR=FL VM=1 Float Pixel Padding Value */
export const FloatPixelPaddingValue = new DicomTag(0x0028, 0x0122);
/** (0028,0123) VR=FD VM=1 Double Float Pixel Padding Value */
export const DoubleFloatPixelPaddingValue = new DicomTag(0x0028, 0x0123);
/** (0028,0124) VR=FL VM=1 Float Pixel Padding Range Limit */
export const FloatPixelPaddingRangeLimit = new DicomTag(0x0028, 0x0124);
/** (0028,0125) VR=FD VM=1 Double Float Pixel Padding Range Limit */
export const DoubleFloatPixelPaddingRangeLimit = new DicomTag(0x0028, 0x0125);
/** (0028,0200) VR=US VM=1 Image Location (Retired) */
export const ImageLocation = new DicomTag(0x0028, 0x0200);
/** (0028,0300) VR=CS VM=1 Quality Control Image */
export const QualityControlImage = new DicomTag(0x0028, 0x0300);
/** (0028,0301) VR=CS VM=1 Burned In Annotation */
export const BurnedInAnnotation = new DicomTag(0x0028, 0x0301);
/** (0028,0302) VR=CS VM=1 Recognizable Visual Features */
export const RecognizableVisualFeatures = new DicomTag(0x0028, 0x0302);
/** (0028,0303) VR=CS VM=1 Longitudinal Temporal Information Modified */
export const LongitudinalTemporalInformationModified = new DicomTag(0x0028, 0x0303);
/** (0028,0304) VR=UI VM=1 Referenced Color Palette Instance UID */
export const ReferencedColorPaletteInstanceUID = new DicomTag(0x0028, 0x0304);
/** (0028,0400) VR=LO VM=1 Transform Label (Retired) */
export const TransformLabel = new DicomTag(0x0028, 0x0400);
/** (0028,0401) VR=LO VM=1 Transform Version Number (Retired) */
export const TransformVersionNumber = new DicomTag(0x0028, 0x0401);
/** (0028,0402) VR=US VM=1 Number of Transform Steps (Retired) */
export const NumberOfTransformSteps = new DicomTag(0x0028, 0x0402);
/** (0028,0403) VR=LO VM=1-n Sequence of Compressed Data (Retired) */
export const SequenceOfCompressedData = new DicomTag(0x0028, 0x0403);
/** (0028,0404) VR=AT VM=1-n Details of Coefficients (Retired) */
export const DetailsOfCoefficients = new DicomTag(0x0028, 0x0404);
/** (0028,0700) VR=LO VM=1 DCT Label (Retired) */
export const DCTLabel = new DicomTag(0x0028, 0x0700);
/** (0028,0701) VR=CS VM=1-n Data Block Description (Retired) */
export const DataBlockDescription = new DicomTag(0x0028, 0x0701);
/** (0028,0702) VR=AT VM=1-n Data Block (Retired) */
export const DataBlock = new DicomTag(0x0028, 0x0702);
/** (0028,0710) VR=US VM=1 Normalization Factor Format (Retired) */
export const NormalizationFactorFormat = new DicomTag(0x0028, 0x0710);
/** (0028,0720) VR=US VM=1 Zonal Map Number Format (Retired) */
export const ZonalMapNumberFormat = new DicomTag(0x0028, 0x0720);
/** (0028,0721) VR=AT VM=1-n Zonal Map Location (Retired) */
export const ZonalMapLocation = new DicomTag(0x0028, 0x0721);
/** (0028,0722) VR=US VM=1 Zonal Map Format (Retired) */
export const ZonalMapFormat = new DicomTag(0x0028, 0x0722);
/** (0028,0730) VR=US VM=1 Adaptive Map Format (Retired) */
export const AdaptiveMapFormat = new DicomTag(0x0028, 0x0730);
/** (0028,0740) VR=US VM=1 Code Number Format (Retired) */
export const CodeNumberFormat = new DicomTag(0x0028, 0x0740);
/** (0028,0A02) VR=CS VM=1 Pixel Spacing Calibration Type */
export const PixelSpacingCalibrationType = new DicomTag(0x0028, 0x0A02);
/** (0028,0A04) VR=LO VM=1 Pixel Spacing Calibration Description */
export const PixelSpacingCalibrationDescription = new DicomTag(0x0028, 0x0A04);
/** (0028,1040) VR=CS VM=1 Pixel Intensity Relationship */
export const PixelIntensityRelationship = new DicomTag(0x0028, 0x1040);
/** (0028,1041) VR=SS VM=1 Pixel Intensity Relationship Sign */
export const PixelIntensityRelationshipSign = new DicomTag(0x0028, 0x1041);
/** (0028,1050) VR=DS VM=1-n Window Center */
export const WindowCenter = new DicomTag(0x0028, 0x1050);
/** (0028,1051) VR=DS VM=1-n Window Width */
export const WindowWidth = new DicomTag(0x0028, 0x1051);
/** (0028,1052) VR=DS VM=1 Rescale Intercept */
export const RescaleIntercept = new DicomTag(0x0028, 0x1052);
/** (0028,1053) VR=DS VM=1 Rescale Slope */
export const RescaleSlope = new DicomTag(0x0028, 0x1053);
/** (0028,1054) VR=LO VM=1 Rescale Type */
export const RescaleType = new DicomTag(0x0028, 0x1054);
/** (0028,1055) VR=LO VM=1-n Window Center & Width Explanation */
export const WindowCenterWidthExplanation = new DicomTag(0x0028, 0x1055);
/** (0028,1056) VR=CS VM=1 VOI LUT Function */
export const VOILUTFunction = new DicomTag(0x0028, 0x1056);
/** (0028,1080) VR=CS VM=1 Gray Scale (Retired) */
export const GrayScale = new DicomTag(0x0028, 0x1080);
/** (0028,1090) VR=CS VM=1 Recommended Viewing Mode */
export const RecommendedViewingMode = new DicomTag(0x0028, 0x1090);
/** (0028,1100) VR=US/SS VM=3 Gray Lookup Table Descriptor (Retired) */
export const GrayLookupTableDescriptor = new DicomTag(0x0028, 0x1100);
/** (0028,1101) VR=US/SS VM=3 Red Palette Color Lookup Table Descriptor */
export const RedPaletteColorLookupTableDescriptor = new DicomTag(0x0028, 0x1101);
/** (0028,1102) VR=US/SS VM=3 Green Palette Color Lookup Table Descriptor */
export const GreenPaletteColorLookupTableDescriptor = new DicomTag(0x0028, 0x1102);
/** (0028,1103) VR=US/SS VM=3 Blue Palette Color Lookup Table Descriptor */
export const BluePaletteColorLookupTableDescriptor = new DicomTag(0x0028, 0x1103);
/** (0028,1104) VR=US VM=3 Alpha Palette Color Lookup Table Descriptor */
export const AlphaPaletteColorLookupTableDescriptor = new DicomTag(0x0028, 0x1104);
/** (0028,1111) VR=US/SS VM=4 Large Red Palette Color Lookup Table Descriptor (Retired) */
export const LargeRedPaletteColorLookupTableDescriptor = new DicomTag(0x0028, 0x1111);
/** (0028,1112) VR=US/SS VM=4 Large Green Palette Color Lookup Table Descriptor (Retired) */
export const LargeGreenPaletteColorLookupTableDescriptor = new DicomTag(0x0028, 0x1112);
/** (0028,1113) VR=US/SS VM=4 Large Blue Palette Color Lookup Table Descriptor (Retired) */
export const LargeBluePaletteColorLookupTableDescriptor = new DicomTag(0x0028, 0x1113);
/** (0028,1199) VR=UI VM=1 Palette Color Lookup Table UID */
export const PaletteColorLookupTableUID = new DicomTag(0x0028, 0x1199);
/** (0028,1200) VR=US/SS/OW VM=1-n or 1 Gray Lookup Table Data (Retired) */
export const GrayLookupTableData = new DicomTag(0x0028, 0x1200);
/** (0028,1201) VR=OW VM=1 Red Palette Color Lookup Table Data */
export const RedPaletteColorLookupTableData = new DicomTag(0x0028, 0x1201);
/** (0028,1202) VR=OW VM=1 Green Palette Color Lookup Table Data */
export const GreenPaletteColorLookupTableData = new DicomTag(0x0028, 0x1202);
/** (0028,1203) VR=OW VM=1 Blue Palette Color Lookup Table Data */
export const BluePaletteColorLookupTableData = new DicomTag(0x0028, 0x1203);
/** (0028,1204) VR=OW VM=1 Alpha Palette Color Lookup Table Data */
export const AlphaPaletteColorLookupTableData = new DicomTag(0x0028, 0x1204);
/** (0028,1211) VR=OW VM=1 Large Red Palette Color Lookup Table Data (Retired) */
export const LargeRedPaletteColorLookupTableData = new DicomTag(0x0028, 0x1211);
/** (0028,1212) VR=OW VM=1 Large Green Palette Color Lookup Table Data (Retired) */
export const LargeGreenPaletteColorLookupTableData = new DicomTag(0x0028, 0x1212);
/** (0028,1213) VR=OW VM=1 Large Blue Palette Color Lookup Table Data (Retired) */
export const LargeBluePaletteColorLookupTableData = new DicomTag(0x0028, 0x1213);
/** (0028,1214) VR=UI VM=1 Large Palette Color Lookup Table UID (Retired) */
export const LargePaletteColorLookupTableUID = new DicomTag(0x0028, 0x1214);
/** (0028,1221) VR=OW VM=1 Segmented Red Palette Color Lookup Table Data */
export const SegmentedRedPaletteColorLookupTableData = new DicomTag(0x0028, 0x1221);
/** (0028,1222) VR=OW VM=1 Segmented Green Palette Color Lookup Table Data */
export const SegmentedGreenPaletteColorLookupTableData = new DicomTag(0x0028, 0x1222);
/** (0028,1223) VR=OW VM=1 Segmented Blue Palette Color Lookup Table Data */
export const SegmentedBluePaletteColorLookupTableData = new DicomTag(0x0028, 0x1223);
/** (0028,1224) VR=OW VM=1 Segmented Alpha Palette Color Lookup Table Data */
export const SegmentedAlphaPaletteColorLookupTableData = new DicomTag(0x0028, 0x1224);
/** (0028,1230) VR=SQ VM=1 Stored Value Color Range Sequence */
export const StoredValueColorRangeSequence = new DicomTag(0x0028, 0x1230);
/** (0028,1231) VR=FD VM=1 Minimum Stored Value Mapped */
export const MinimumStoredValueMapped = new DicomTag(0x0028, 0x1231);
/** (0028,1232) VR=FD VM=1 Maximum Stored Value Mapped */
export const MaximumStoredValueMapped = new DicomTag(0x0028, 0x1232);
/** (0028,1300) VR=CS VM=1 Breast Implant Present */
export const BreastImplantPresent = new DicomTag(0x0028, 0x1300);
/** (0028,1350) VR=CS VM=1 Partial View */
export const PartialView = new DicomTag(0x0028, 0x1350);
/** (0028,1351) VR=ST VM=1 Partial View Description */
export const PartialViewDescription = new DicomTag(0x0028, 0x1351);
/** (0028,1352) VR=SQ VM=1 Partial View Code Sequence */
export const PartialViewCodeSequence = new DicomTag(0x0028, 0x1352);
/** (0028,135A) VR=CS VM=1 Spatial Locations Preserved */
export const SpatialLocationsPreserved = new DicomTag(0x0028, 0x135A);
/** (0028,1401) VR=SQ VM=1 Data Frame Assignment Sequence */
export const DataFrameAssignmentSequence = new DicomTag(0x0028, 0x1401);
/** (0028,1402) VR=CS VM=1 Data Path Assignment */
export const DataPathAssignment = new DicomTag(0x0028, 0x1402);
/** (0028,1403) VR=US VM=1 Bits Mapped to Color Lookup Table */
export const BitsMappedToColorLookupTable = new DicomTag(0x0028, 0x1403);
/** (0028,1404) VR=SQ VM=1 Blending LUT 1 Sequence */
export const BlendingLUT1Sequence = new DicomTag(0x0028, 0x1404);
/** (0028,1405) VR=CS VM=1 Blending LUT 1 Transfer Function */
export const BlendingLUT1TransferFunction = new DicomTag(0x0028, 0x1405);
/** (0028,1406) VR=FD VM=1 Blending Weight Constant */
export const BlendingWeightConstant = new DicomTag(0x0028, 0x1406);
/** (0028,1407) VR=US VM=3 Blending Lookup Table Descriptor */
export const BlendingLookupTableDescriptor = new DicomTag(0x0028, 0x1407);
/** (0028,1408) VR=OW VM=1 Blending Lookup Table Data */
export const BlendingLookupTableData = new DicomTag(0x0028, 0x1408);
/** (0028,140B) VR=SQ VM=1 Enhanced Palette Color Lookup Table Sequence */
export const EnhancedPaletteColorLookupTableSequence = new DicomTag(0x0028, 0x140B);
/** (0028,140C) VR=SQ VM=1 Blending LUT 2 Sequence */
export const BlendingLUT2Sequence = new DicomTag(0x0028, 0x140C);
/** (0028,140D) VR=CS VM=1 Blending LUT 2 Transfer Function */
export const BlendingLUT2TransferFunction = new DicomTag(0x0028, 0x140D);
/** (0028,140E) VR=CS VM=1 Data Path ID */
export const DataPathID = new DicomTag(0x0028, 0x140E);
/** (0028,140F) VR=CS VM=1 RGB LUT Transfer Function */
export const RGBLUTTransferFunction = new DicomTag(0x0028, 0x140F);
/** (0028,1410) VR=CS VM=1 Alpha LUT Transfer Function */
export const AlphaLUTTransferFunction = new DicomTag(0x0028, 0x1410);
/** (0028,2000) VR=OB VM=1 ICC Profile */
export const ICCProfile = new DicomTag(0x0028, 0x2000);
/** (0028,2002) VR=CS VM=1 Color Space */
export const ColorSpace = new DicomTag(0x0028, 0x2002);
/** (0028,2110) VR=CS VM=1 Lossy Image Compression */
export const LossyImageCompression = new DicomTag(0x0028, 0x2110);
/** (0028,2112) VR=DS VM=1-n Lossy Image Compression Ratio */
export const LossyImageCompressionRatio = new DicomTag(0x0028, 0x2112);
/** (0028,2114) VR=CS VM=1-n Lossy Image Compression Method */
export const LossyImageCompressionMethod = new DicomTag(0x0028, 0x2114);
/** (0028,3000) VR=SQ VM=1 Modality LUT Sequence */
export const ModalityLUTSequence = new DicomTag(0x0028, 0x3000);
/** (0028,3001) VR=SQ VM=1 Variable Modality LUT Sequence */
export const VariableModalityLUTSequence = new DicomTag(0x0028, 0x3001);
/** (0028,3002) VR=US/SS VM=3 LUT Descriptor */
export const LUTDescriptor = new DicomTag(0x0028, 0x3002);
/** (0028,3003) VR=LO VM=1 LUT Explanation */
export const LUTExplanation = new DicomTag(0x0028, 0x3003);
/** (0028,3004) VR=LO VM=1 Modality LUT Type */
export const ModalityLUTType = new DicomTag(0x0028, 0x3004);
/** (0028,3006) VR=US/OW VM=1-n or 1 LUT Data */
export const LUTData = new DicomTag(0x0028, 0x3006);
/** (0028,3010) VR=SQ VM=1 VOI LUT Sequence */
export const VOILUTSequence = new DicomTag(0x0028, 0x3010);
/** (0028,3110) VR=SQ VM=1 Softcopy VOI LUT Sequence */
export const SoftcopyVOILUTSequence = new DicomTag(0x0028, 0x3110);
/** (0028,4000) VR=LT VM=1 Image Presentation Comments (Retired) */
export const ImagePresentationComments = new DicomTag(0x0028, 0x4000);
/** (0028,5000) VR=SQ VM=1 Bi-Plane Acquisition Sequence (Retired) */
export const BiPlaneAcquisitionSequence = new DicomTag(0x0028, 0x5000);
/** (0028,6010) VR=US VM=1 Representative Frame Number */
export const RepresentativeFrameNumber = new DicomTag(0x0028, 0x6010);
/** (0028,6020) VR=US VM=1-n Frame Numbers of Interest (FOI) */
export const FrameNumbersOfInterest = new DicomTag(0x0028, 0x6020);
/** (0028,6022) VR=LO VM=1-n Frame of Interest Description */
export const FrameOfInterestDescription = new DicomTag(0x0028, 0x6022);
/** (0028,6023) VR=CS VM=1-n Frame of Interest Type */
export const FrameOfInterestType = new DicomTag(0x0028, 0x6023);
/** (0028,6030) VR=US VM=1-n Mask Pointer(s) (Retired) */
export const MaskPointers = new DicomTag(0x0028, 0x6030);
/** (0028,6040) VR=US VM=1-n R Wave Pointer */
export const RWavePointer = new DicomTag(0x0028, 0x6040);
/** (0028,6100) VR=SQ VM=1 Mask Subtraction Sequence */
export const MaskSubtractionSequence = new DicomTag(0x0028, 0x6100);
/** (0028,6101) VR=CS VM=1 Mask Operation */
export const MaskOperation = new DicomTag(0x0028, 0x6101);
/** (0028,6102) VR=US VM=2-2n Applicable Frame Range */
export const ApplicableFrameRange = new DicomTag(0x0028, 0x6102);
/** (0028,6110) VR=US VM=1-n Mask Frame Numbers */
export const MaskFrameNumbers = new DicomTag(0x0028, 0x6110);
/** (0028,6112) VR=US VM=1 Contrast Frame Averaging */
export const ContrastFrameAveraging = new DicomTag(0x0028, 0x6112);
/** (0028,6114) VR=FL VM=2 Mask Sub-pixel Shift */
export const MaskSubPixelShift = new DicomTag(0x0028, 0x6114);
/** (0028,6120) VR=SS VM=1 TID Offset */
export const TIDOffset = new DicomTag(0x0028, 0x6120);
/** (0028,6190) VR=ST VM=1 Mask Operation Explanation */
export const MaskOperationExplanation = new DicomTag(0x0028, 0x6190);
/** (0028,7000) VR=SQ VM=1 Equipment Administrator Sequence */
export const EquipmentAdministratorSequence = new DicomTag(0x0028, 0x7000);
/** (0028,7001) VR=US VM=1 Number of Display Subsystems */
export const NumberOfDisplaySubsystems = new DicomTag(0x0028, 0x7001);
/** (0028,7002) VR=US VM=1 Current Configuration ID */
export const CurrentConfigurationID = new DicomTag(0x0028, 0x7002);
/** (0028,7003) VR=US VM=1 Display Subsystem ID */
export const DisplaySubsystemID = new DicomTag(0x0028, 0x7003);
/** (0028,7004) VR=SH VM=1 Display Subsystem Name */
export const DisplaySubsystemName = new DicomTag(0x0028, 0x7004);
/** (0028,7005) VR=LO VM=1 Display Subsystem Description */
export const DisplaySubsystemDescription = new DicomTag(0x0028, 0x7005);
/** (0028,7006) VR=CS VM=1 System Status */
export const SystemStatus = new DicomTag(0x0028, 0x7006);
/** (0028,7007) VR=LO VM=1 System Status Comment */
export const SystemStatusComment = new DicomTag(0x0028, 0x7007);
/** (0028,7008) VR=SQ VM=1 Target Luminance Characteristics Sequence */
export const TargetLuminanceCharacteristicsSequence = new DicomTag(0x0028, 0x7008);
/** (0028,7009) VR=US VM=1 Luminance Characteristics ID */
export const LuminanceCharacteristicsID = new DicomTag(0x0028, 0x7009);
/** (0028,700A) VR=SQ VM=1 Display Subsystem Configuration Sequence */
export const DisplaySubsystemConfigurationSequence = new DicomTag(0x0028, 0x700A);
/** (0028,700B) VR=US VM=1 Configuration ID */
export const ConfigurationID = new DicomTag(0x0028, 0x700B);
/** (0028,700C) VR=SH VM=1 Configuration Name */
export const ConfigurationName = new DicomTag(0x0028, 0x700C);
/** (0028,700D) VR=LO VM=1 Configuration Description */
export const ConfigurationDescription = new DicomTag(0x0028, 0x700D);
/** (0028,700E) VR=US VM=1 Referenced Target Luminance Characteristics ID */
export const ReferencedTargetLuminanceCharacteristicsID = new DicomTag(0x0028, 0x700E);
/** (0028,700F) VR=SQ VM=1 QA Results Sequence */
export const QAResultsSequence = new DicomTag(0x0028, 0x700F);
/** (0028,7010) VR=SQ VM=1 Display Subsystem QA Results Sequence */
export const DisplaySubsystemQAResultsSequence = new DicomTag(0x0028, 0x7010);
/** (0028,7011) VR=SQ VM=1 Configuration QA Results Sequence */
export const ConfigurationQAResultsSequence = new DicomTag(0x0028, 0x7011);
/** (0028,7012) VR=SQ VM=1 Measurement Equipment Sequence */
export const MeasurementEquipmentSequence = new DicomTag(0x0028, 0x7012);
/** (0028,7013) VR=CS VM=1-n Measurement Functions */
export const MeasurementFunctions = new DicomTag(0x0028, 0x7013);
/** (0028,7014) VR=CS VM=1 Measurement Equipment Type */
export const MeasurementEquipmentType = new DicomTag(0x0028, 0x7014);
/** (0028,7015) VR=SQ VM=1 Visual Evaluation Result Sequence */
export const VisualEvaluationResultSequence = new DicomTag(0x0028, 0x7015);
/** (0028,7016) VR=SQ VM=1 Display Calibration Result Sequence */
export const DisplayCalibrationResultSequence = new DicomTag(0x0028, 0x7016);
/** (0028,7017) VR=US VM=1 DDL Value */
export const DDLValue = new DicomTag(0x0028, 0x7017);
/** (0028,7018) VR=FL VM=2 CIExy White Point */
export const CIExyWhitePoint = new DicomTag(0x0028, 0x7018);
/** (0028,7019) VR=CS VM=1 Display Function Type */
export const DisplayFunctionType = new DicomTag(0x0028, 0x7019);
/** (0028,701A) VR=FL VM=1 Gamma Value */
export const GammaValue = new DicomTag(0x0028, 0x701A);
/** (0028,701B) VR=US VM=1 Number of Luminance Points */
export const NumberOfLuminancePoints = new DicomTag(0x0028, 0x701B);
/** (0028,701C) VR=SQ VM=1 Luminance Response Sequence */
export const LuminanceResponseSequence = new DicomTag(0x0028, 0x701C);
/** (0028,701D) VR=FL VM=1 Target Minimum Luminance */
export const TargetMinimumLuminance = new DicomTag(0x0028, 0x701D);
/** (0028,701E) VR=FL VM=1 Target Maximum Luminance */
export const TargetMaximumLuminance = new DicomTag(0x0028, 0x701E);
/** (0028,701F) VR=FL VM=1 Luminance Value */
export const LuminanceValue = new DicomTag(0x0028, 0x701F);
/** (0028,7020) VR=LO VM=1 Luminance Response Description */
export const LuminanceResponseDescription = new DicomTag(0x0028, 0x7020);
/** (0028,7021) VR=CS VM=1 White Point Flag */
export const WhitePointFlag = new DicomTag(0x0028, 0x7021);
/** (0028,7022) VR=SQ VM=1 Display Device Type Code Sequence */
export const DisplayDeviceTypeCodeSequence = new DicomTag(0x0028, 0x7022);
/** (0028,7023) VR=SQ VM=1 Display Subsystem Sequence */
export const DisplaySubsystemSequence = new DicomTag(0x0028, 0x7023);
/** (0028,7024) VR=SQ VM=1 Luminance Result Sequence */
export const LuminanceResultSequence = new DicomTag(0x0028, 0x7024);
/** (0028,7025) VR=CS VM=1 Ambient Light Value Source */
export const AmbientLightValueSource = new DicomTag(0x0028, 0x7025);
/** (0028,7026) VR=CS VM=1-n Measured Characteristics */
export const MeasuredCharacteristics = new DicomTag(0x0028, 0x7026);
/** (0028,7027) VR=SQ VM=1 Luminance Uniformity Result Sequence */
export const LuminanceUniformityResultSequence = new DicomTag(0x0028, 0x7027);
/** (0028,7028) VR=SQ VM=1 Visual Evaluation Test Sequence */
export const VisualEvaluationTestSequence = new DicomTag(0x0028, 0x7028);
/** (0028,7029) VR=CS VM=1 Test Result */
export const TestResult = new DicomTag(0x0028, 0x7029);
/** (0028,702A) VR=LO VM=1 Test Result Comment */
export const TestResultComment = new DicomTag(0x0028, 0x702A);
/** (0028,702B) VR=CS VM=1 Test Image Validation */
export const TestImageValidation = new DicomTag(0x0028, 0x702B);
/** (0028,702C) VR=SQ VM=1 Test Pattern Code Sequence */
export const TestPatternCodeSequence = new DicomTag(0x0028, 0x702C);
/** (0028,702D) VR=SQ VM=1 Measurement Pattern Code Sequence */
export const MeasurementPatternCodeSequence = new DicomTag(0x0028, 0x702D);
/** (0028,702E) VR=SQ VM=1 Visual Evaluation Method Code Sequence */
export const VisualEvaluationMethodCodeSequence = new DicomTag(0x0028, 0x702E);
/** (0028,7FE0) VR=UR VM=1 Pixel Data Provider URL */
export const PixelDataProviderURL = new DicomTag(0x0028, 0x7FE0);
/** (0028,9001) VR=UL VM=1 Data Point Rows */
export const DataPointRows = new DicomTag(0x0028, 0x9001);
/** (0028,9002) VR=UL VM=1 Data Point Columns */
export const DataPointColumns = new DicomTag(0x0028, 0x9002);
/** (0028,9003) VR=CS VM=1 Signal Domain Columns */
export const SignalDomainColumns = new DicomTag(0x0028, 0x9003);
/** (0028,9099) VR=US VM=1 Largest Monochrome Pixel Value (Retired) */
export const LargestMonochromePixelValue = new DicomTag(0x0028, 0x9099);
/** (0028,9108) VR=CS VM=1 Data Representation */
export const DataRepresentation = new DicomTag(0x0028, 0x9108);
/** (0028,9110) VR=SQ VM=1 Pixel Measures Sequence */
export const PixelMeasuresSequence = new DicomTag(0x0028, 0x9110);
/** (0028,9132) VR=SQ VM=1 Frame VOI LUT Sequence */
export const FrameVOILUTSequence = new DicomTag(0x0028, 0x9132);
/** (0028,9145) VR=SQ VM=1 Pixel Value Transformation Sequence */
export const PixelValueTransformationSequence = new DicomTag(0x0028, 0x9145);
/** (0028,9235) VR=CS VM=1 Signal Domain Rows */
export const SignalDomainRows = new DicomTag(0x0028, 0x9235);
/** (0028,9411) VR=FL VM=1 Display Filter Percentage */
export const DisplayFilterPercentage = new DicomTag(0x0028, 0x9411);
/** (0028,9415) VR=SQ VM=1 Frame Pixel Shift Sequence */
export const FramePixelShiftSequence = new DicomTag(0x0028, 0x9415);
/** (0028,9416) VR=US VM=1 Subtraction Item ID */
export const SubtractionItemID = new DicomTag(0x0028, 0x9416);
/** (0028,9422) VR=SQ VM=1 Pixel Intensity Relationship LUT Sequence */
export const PixelIntensityRelationshipLUTSequence = new DicomTag(0x0028, 0x9422);
/** (0028,9443) VR=SQ VM=1 Frame Pixel Data Properties Sequence */
export const FramePixelDataPropertiesSequence = new DicomTag(0x0028, 0x9443);
/** (0028,9444) VR=CS VM=1 Geometrical Properties */
export const GeometricalProperties = new DicomTag(0x0028, 0x9444);
/** (0028,9445) VR=FL VM=1 Geometric Maximum Distortion */
export const GeometricMaximumDistortion = new DicomTag(0x0028, 0x9445);
/** (0028,9446) VR=CS VM=1-n Image Processing Applied */
export const ImageProcessingApplied = new DicomTag(0x0028, 0x9446);
/** (0028,9454) VR=CS VM=1 Mask Selection Mode */
export const MaskSelectionMode = new DicomTag(0x0028, 0x9454);
/** (0028,9474) VR=CS VM=1 LUT Function */
export const LUTFunction = new DicomTag(0x0028, 0x9474);
/** (0028,9478) VR=FL VM=1 Mask Visibility Percentage */
export const MaskVisibilityPercentage = new DicomTag(0x0028, 0x9478);
/** (0028,9501) VR=SQ VM=1 Pixel Shift Sequence */
export const PixelShiftSequence = new DicomTag(0x0028, 0x9501);
/** (0028,9502) VR=SQ VM=1 Region Pixel Shift Sequence */
export const RegionPixelShiftSequence = new DicomTag(0x0028, 0x9502);
/** (0028,9503) VR=SS VM=2-2n Vertices of the Region */
export const VerticesOfTheRegion = new DicomTag(0x0028, 0x9503);
/** (0028,9505) VR=SQ VM=1 Multi-frame Presentation Sequence */
export const MultiFramePresentationSequence = new DicomTag(0x0028, 0x9505);
/** (0028,9506) VR=US VM=2-2n Pixel Shift Frame Range */
export const PixelShiftFrameRange = new DicomTag(0x0028, 0x9506);
/** (0028,9507) VR=US VM=2-2n LUT Frame Range */
export const LUTFrameRange = new DicomTag(0x0028, 0x9507);
/** (0028,9520) VR=DS VM=16 Image to Equipment Mapping Matrix */
export const ImageToEquipmentMappingMatrix = new DicomTag(0x0028, 0x9520);
/** (0028,9537) VR=CS VM=1 Equipment Coordinate System Identification */
export const EquipmentCoordinateSystemIdentification = new DicomTag(0x0028, 0x9537);
/** (0032,000A) VR=CS VM=1 Study Status ID (Retired) */
export const StudyStatusID = new DicomTag(0x0032, 0x000A);
/** (0032,000C) VR=CS VM=1 Study Priority ID (Retired) */
export const StudyPriorityID = new DicomTag(0x0032, 0x000C);
/** (0032,0012) VR=LO VM=1 Study ID Issuer (Retired) */
export const StudyIDIssuer = new DicomTag(0x0032, 0x0012);
/** (0032,0032) VR=DA VM=1 Study Verified Date (Retired) */
export const StudyVerifiedDate = new DicomTag(0x0032, 0x0032);
/** (0032,0033) VR=TM VM=1 Study Verified Time (Retired) */
export const StudyVerifiedTime = new DicomTag(0x0032, 0x0033);
/** (0032,0034) VR=DA VM=1 Study Read Date (Retired) */
export const StudyReadDate = new DicomTag(0x0032, 0x0034);
/** (0032,0035) VR=TM VM=1 Study Read Time (Retired) */
export const StudyReadTime = new DicomTag(0x0032, 0x0035);
/** (0032,1000) VR=DA VM=1 Scheduled Study Start Date (Retired) */
export const ScheduledStudyStartDate = new DicomTag(0x0032, 0x1000);
/** (0032,1001) VR=TM VM=1 Scheduled Study Start Time (Retired) */
export const ScheduledStudyStartTime = new DicomTag(0x0032, 0x1001);
/** (0032,1010) VR=DA VM=1 Scheduled Study Stop Date (Retired) */
export const ScheduledStudyStopDate = new DicomTag(0x0032, 0x1010);
/** (0032,1011) VR=TM VM=1 Scheduled Study Stop Time (Retired) */
export const ScheduledStudyStopTime = new DicomTag(0x0032, 0x1011);
/** (0032,1020) VR=LO VM=1 Scheduled Study Location (Retired) */
export const ScheduledStudyLocation = new DicomTag(0x0032, 0x1020);
/** (0032,1021) VR=AE VM=1-n Scheduled Study Location AE Title (Retired) */
export const ScheduledStudyLocationAETitle = new DicomTag(0x0032, 0x1021);
/** (0032,1030) VR=LO VM=1 Reason for Study (Retired) */
export const ReasonForStudy = new DicomTag(0x0032, 0x1030);
/** (0032,1031) VR=SQ VM=1 Requesting Physician Identification Sequence */
export const RequestingPhysicianIdentificationSequence = new DicomTag(0x0032, 0x1031);
/** (0032,1032) VR=PN VM=1 Requesting Physician */
export const RequestingPhysician = new DicomTag(0x0032, 0x1032);
/** (0032,1033) VR=LO VM=1 Requesting Service */
export const RequestingService = new DicomTag(0x0032, 0x1033);
/** (0032,1034) VR=SQ VM=1 Requesting Service Code Sequence */
export const RequestingServiceCodeSequence = new DicomTag(0x0032, 0x1034);
/** (0032,1040) VR=DA VM=1 Study Arrival Date (Retired) */
export const StudyArrivalDate = new DicomTag(0x0032, 0x1040);
/** (0032,1041) VR=TM VM=1 Study Arrival Time (Retired) */
export const StudyArrivalTime = new DicomTag(0x0032, 0x1041);
/** (0032,1050) VR=DA VM=1 Study Completion Date (Retired) */
export const StudyCompletionDate = new DicomTag(0x0032, 0x1050);
/** (0032,1051) VR=TM VM=1 Study Completion Time (Retired) */
export const StudyCompletionTime = new DicomTag(0x0032, 0x1051);
/** (0032,1055) VR=CS VM=1 Study Component Status ID (Retired) */
export const StudyComponentStatusID = new DicomTag(0x0032, 0x1055);
/** (0032,1060) VR=LO VM=1 Requested Procedure Description */
export const RequestedProcedureDescription = new DicomTag(0x0032, 0x1060);
/** (0032,1064) VR=SQ VM=1 Requested Procedure Code Sequence */
export const RequestedProcedureCodeSequence = new DicomTag(0x0032, 0x1064);
/** (0032,1065) VR=SQ VM=1 Requested Laterality Code Sequence */
export const RequestedLateralityCodeSequence = new DicomTag(0x0032, 0x1065);
/** (0032,1066) VR=UT VM=1 Reason for Visit */
export const ReasonForVisit = new DicomTag(0x0032, 0x1066);
/** (0032,1067) VR=SQ VM=1 Reason for Visit Code Sequence */
export const ReasonForVisitCodeSequence = new DicomTag(0x0032, 0x1067);
/** (0032,1070) VR=LO VM=1 Requested Contrast Agent */
export const RequestedContrastAgent = new DicomTag(0x0032, 0x1070);
/** (0032,4000) VR=LT VM=1 Study Comments (Retired) */
export const StudyComments = new DicomTag(0x0032, 0x4000);
/** (0034,0001) VR=SQ VM=1 Flow Identifier Sequence */
export const FlowIdentifierSequence = new DicomTag(0x0034, 0x0001);
/** (0034,0002) VR=OB VM=1 Flow Identifier */
export const FlowIdentifier = new DicomTag(0x0034, 0x0002);
/** (0034,0003) VR=UI VM=1 Flow Transfer Syntax UID */
export const FlowTransferSyntaxUID = new DicomTag(0x0034, 0x0003);
/** (0034,0004) VR=UL VM=1 Flow RTP Sampling Rate */
export const FlowRTPSamplingRate = new DicomTag(0x0034, 0x0004);
/** (0034,0005) VR=OB VM=1 Source Identifier */
export const SourceIdentifier = new DicomTag(0x0034, 0x0005);
/** (0034,0007) VR=OB VM=1 Frame Origin Timestamp */
export const FrameOriginTimestamp = new DicomTag(0x0034, 0x0007);
/** (0034,0008) VR=CS VM=1 Includes Imaging Subject */
export const IncludesImagingSubject = new DicomTag(0x0034, 0x0008);
/** (0034,0009) VR=SQ VM=1 Frame Usefulness Group Sequence */
export const FrameUsefulnessGroupSequence = new DicomTag(0x0034, 0x0009);
/** (0034,000A) VR=SQ VM=1 Real-Time Bulk Data Flow Sequence */
export const RealTimeBulkDataFlowSequence = new DicomTag(0x0034, 0x000A);
/** (0034,000B) VR=SQ VM=1 Camera Position Group Sequence */
export const CameraPositionGroupSequence = new DicomTag(0x0034, 0x000B);
/** (0034,000C) VR=CS VM=1 Includes Information */
export const IncludesInformation = new DicomTag(0x0034, 0x000C);
/** (0034,000D) VR=SQ VM=1 Time of Frame Group Sequence */
export const TimeOfFrameGroupSequence = new DicomTag(0x0034, 0x000D);
/** (0038,0004) VR=SQ VM=1 Referenced Patient Alias Sequence (Retired) */
export const ReferencedPatientAliasSequence = new DicomTag(0x0038, 0x0004);
/** (0038,0008) VR=CS VM=1 Visit Status ID */
export const VisitStatusID = new DicomTag(0x0038, 0x0008);
/** (0038,0010) VR=LO VM=1 Admission ID */
export const AdmissionID = new DicomTag(0x0038, 0x0010);
/** (0038,0011) VR=LO VM=1 Issuer of Admission ID (Retired) */
export const IssuerOfAdmissionID = new DicomTag(0x0038, 0x0011);
/** (0038,0014) VR=SQ VM=1 Issuer of Admission ID Sequence */
export const IssuerOfAdmissionIDSequence = new DicomTag(0x0038, 0x0014);
/** (0038,0016) VR=LO VM=1 Route of Admissions */
export const RouteOfAdmissions = new DicomTag(0x0038, 0x0016);
/** (0038,001A) VR=DA VM=1 Scheduled Admission Date (Retired) */
export const ScheduledAdmissionDate = new DicomTag(0x0038, 0x001A);
/** (0038,001B) VR=TM VM=1 Scheduled Admission Time (Retired) */
export const ScheduledAdmissionTime = new DicomTag(0x0038, 0x001B);
/** (0038,001C) VR=DA VM=1 Scheduled Discharge Date (Retired) */
export const ScheduledDischargeDate = new DicomTag(0x0038, 0x001C);
/** (0038,001D) VR=TM VM=1 Scheduled Discharge Time (Retired) */
export const ScheduledDischargeTime = new DicomTag(0x0038, 0x001D);
/** (0038,001E) VR=LO VM=1 Scheduled Patient Institution Residence (Retired) */
export const ScheduledPatientInstitutionResidence = new DicomTag(0x0038, 0x001E);
/** (0038,0020) VR=DA VM=1 Admitting Date */
export const AdmittingDate = new DicomTag(0x0038, 0x0020);
/** (0038,0021) VR=TM VM=1 Admitting Time */
export const AdmittingTime = new DicomTag(0x0038, 0x0021);
/** (0038,0030) VR=DA VM=1 Discharge Date (Retired) */
export const DischargeDate = new DicomTag(0x0038, 0x0030);
/** (0038,0032) VR=TM VM=1 Discharge Time (Retired) */
export const DischargeTime = new DicomTag(0x0038, 0x0032);
/** (0038,0040) VR=LO VM=1 Discharge Diagnosis Description (Retired) */
export const DischargeDiagnosisDescription = new DicomTag(0x0038, 0x0040);
/** (0038,0044) VR=SQ VM=1 Discharge Diagnosis Code Sequence (Retired) */
export const DischargeDiagnosisCodeSequence = new DicomTag(0x0038, 0x0044);
/** (0038,0050) VR=LO VM=1 Special Needs */
export const SpecialNeeds = new DicomTag(0x0038, 0x0050);
/** (0038,0060) VR=LO VM=1 Service Episode ID */
export const ServiceEpisodeID = new DicomTag(0x0038, 0x0060);
/** (0038,0061) VR=LO VM=1 Issuer of Service Episode ID (Retired) */
export const IssuerOfServiceEpisodeID = new DicomTag(0x0038, 0x0061);
/** (0038,0062) VR=LO VM=1 Service Episode Description */
export const ServiceEpisodeDescription = new DicomTag(0x0038, 0x0062);
/** (0038,0064) VR=SQ VM=1 Issuer of Service Episode ID Sequence */
export const IssuerOfServiceEpisodeIDSequence = new DicomTag(0x0038, 0x0064);
/** (0038,0100) VR=SQ VM=1 Pertinent Documents Sequence */
export const PertinentDocumentsSequence = new DicomTag(0x0038, 0x0100);
/** (0038,0101) VR=SQ VM=1 Pertinent Resources Sequence */
export const PertinentResourcesSequence = new DicomTag(0x0038, 0x0101);
/** (0038,0102) VR=LO VM=1 Resource Description */
export const ResourceDescription = new DicomTag(0x0038, 0x0102);
/** (0038,0300) VR=LO VM=1 Current Patient Location */
export const CurrentPatientLocation = new DicomTag(0x0038, 0x0300);
/** (0038,0400) VR=LO VM=1 Patient's Institution Residence */
export const PatientInstitutionResidence = new DicomTag(0x0038, 0x0400);
/** (0038,0500) VR=LO VM=1 Patient State */
export const PatientState = new DicomTag(0x0038, 0x0500);
/** (0038,0502) VR=SQ VM=1 Patient Clinical Trial Participation Sequence */
export const PatientClinicalTrialParticipationSequence = new DicomTag(0x0038, 0x0502);
/** (0038,4000) VR=LT VM=1 Visit Comments */
export const VisitComments = new DicomTag(0x0038, 0x4000);
/** (003A,0004) VR=CS VM=1 Waveform Originality */
export const WaveformOriginality = new DicomTag(0x003A, 0x0004);
/** (003A,0005) VR=US VM=1 Number of Waveform Channels */
export const NumberOfWaveformChannels = new DicomTag(0x003A, 0x0005);
/** (003A,0010) VR=UL VM=1 Number of Waveform Samples */
export const NumberOfWaveformSamples = new DicomTag(0x003A, 0x0010);
/** (003A,001A) VR=DS VM=1 Sampling Frequency */
export const SamplingFrequency = new DicomTag(0x003A, 0x001A);
/** (003A,0020) VR=SH VM=1 Multiplex Group Label */
export const MultiplexGroupLabel = new DicomTag(0x003A, 0x0020);
/** (003A,0200) VR=SQ VM=1 Channel Definition Sequence */
export const ChannelDefinitionSequence = new DicomTag(0x003A, 0x0200);
/** (003A,0202) VR=IS VM=1 Waveform Channel Number */
export const WaveformChannelNumber = new DicomTag(0x003A, 0x0202);
/** (003A,0203) VR=SH VM=1 Channel Label */
export const ChannelLabel = new DicomTag(0x003A, 0x0203);
/** (003A,0205) VR=CS VM=1-n Channel Status */
export const ChannelStatus = new DicomTag(0x003A, 0x0205);
/** (003A,0208) VR=SQ VM=1 Channel Source Sequence */
export const ChannelSourceSequence = new DicomTag(0x003A, 0x0208);
/** (003A,0209) VR=SQ VM=1 Channel Source Modifiers Sequence */
export const ChannelSourceModifiersSequence = new DicomTag(0x003A, 0x0209);
/** (003A,020A) VR=SQ VM=1 Source Waveform Sequence */
export const SourceWaveformSequence = new DicomTag(0x003A, 0x020A);
/** (003A,020C) VR=LO VM=1 Channel Derivation Description */
export const ChannelDerivationDescription = new DicomTag(0x003A, 0x020C);
/** (003A,0210) VR=DS VM=1 Channel Sensitivity */
export const ChannelSensitivity = new DicomTag(0x003A, 0x0210);
/** (003A,0211) VR=SQ VM=1 Channel Sensitivity Units Sequence */
export const ChannelSensitivityUnitsSequence = new DicomTag(0x003A, 0x0211);
/** (003A,0212) VR=DS VM=1 Channel Sensitivity Correction Factor */
export const ChannelSensitivityCorrectionFactor = new DicomTag(0x003A, 0x0212);
/** (003A,0213) VR=DS VM=1 Channel Baseline */
export const ChannelBaseline = new DicomTag(0x003A, 0x0213);
/** (003A,0214) VR=DS VM=1 Channel Time Skew */
export const ChannelTimeSkew = new DicomTag(0x003A, 0x0214);
/** (003A,0215) VR=DS VM=1 Channel Sample Skew */
export const ChannelSampleSkew = new DicomTag(0x003A, 0x0215);
/** (003A,0218) VR=DS VM=1 Channel Offset */
export const ChannelOffset = new DicomTag(0x003A, 0x0218);
/** (003A,021A) VR=US VM=1 Waveform Bits Stored */
export const WaveformBitsStored = new DicomTag(0x003A, 0x021A);
/** (003A,0220) VR=DS VM=1 Filter Low Frequency */
export const FilterLowFrequency = new DicomTag(0x003A, 0x0220);
/** (003A,0221) VR=DS VM=1 Filter High Frequency */
export const FilterHighFrequency = new DicomTag(0x003A, 0x0221);
/** (003A,0222) VR=DS VM=1 Notch Filter Frequency */
export const NotchFilterFrequency = new DicomTag(0x003A, 0x0222);
/** (003A,0223) VR=DS VM=1 Notch Filter Bandwidth */
export const NotchFilterBandwidth = new DicomTag(0x003A, 0x0223);
/** (003A,0230) VR=FL VM=1 Waveform Data Display Scale */
export const WaveformDataDisplayScale = new DicomTag(0x003A, 0x0230);
/** (003A,0231) VR=US VM=3 Waveform Display Background CIELab Value */
export const WaveformDisplayBackgroundCIELabValue = new DicomTag(0x003A, 0x0231);
/** (003A,0240) VR=SQ VM=1 Waveform Presentation Group Sequence */
export const WaveformPresentationGroupSequence = new DicomTag(0x003A, 0x0240);
/** (003A,0241) VR=US VM=1 Presentation Group Number */
export const PresentationGroupNumber = new DicomTag(0x003A, 0x0241);
/** (003A,0242) VR=SQ VM=1 Channel Display Sequence */
export const ChannelDisplaySequence = new DicomTag(0x003A, 0x0242);
/** (003A,0244) VR=US VM=3 Channel Recommended Display CIELab Value */
export const ChannelRecommendedDisplayCIELabValue = new DicomTag(0x003A, 0x0244);
/** (003A,0245) VR=FL VM=1 Channel Position */
export const ChannelPosition = new DicomTag(0x003A, 0x0245);
/** (003A,0246) VR=CS VM=1 Display Shading Flag */
export const DisplayShadingFlag = new DicomTag(0x003A, 0x0246);
/** (003A,0247) VR=FL VM=1 Fractional Channel Display Scale */
export const FractionalChannelDisplayScale = new DicomTag(0x003A, 0x0247);
/** (003A,0248) VR=FL VM=1 Absolute Channel Display Scale */
export const AbsoluteChannelDisplayScale = new DicomTag(0x003A, 0x0248);
/** (003A,0300) VR=SQ VM=1 Multiplexed Audio Channels Description Code Sequence */
export const MultiplexedAudioChannelsDescriptionCodeSequence = new DicomTag(0x003A, 0x0300);
/** (003A,0301) VR=IS VM=1 Channel Identification Code */
export const ChannelIdentificationCode = new DicomTag(0x003A, 0x0301);
/** (003A,0302) VR=CS VM=1 Channel Mode */
export const ChannelMode = new DicomTag(0x003A, 0x0302);
/** (003A,0310) VR=UI VM=1 Multiplex Group UID */
export const MultiplexGroupUID = new DicomTag(0x003A, 0x0310);
/** (003A,0311) VR=DS VM=1 Powerline Frequency */
export const PowerlineFrequency = new DicomTag(0x003A, 0x0311);
/** (003A,0312) VR=SQ VM=1 Channel Impedance Sequence */
export const ChannelImpedanceSequence = new DicomTag(0x003A, 0x0312);
/** (003A,0313) VR=DS VM=1 Impedance Value */
export const ImpedanceValue = new DicomTag(0x003A, 0x0313);
/** (003A,0314) VR=DT VM=1 Impedance Measurement DateTime */
export const ImpedanceMeasurementDateTime = new DicomTag(0x003A, 0x0314);
/** (003A,0315) VR=DS VM=1 Impedance Measurement Frequency */
export const ImpedanceMeasurementFrequency = new DicomTag(0x003A, 0x0315);
/** (003A,0316) VR=CS VM=1 Impedance Measurement Current Type */
export const ImpedanceMeasurementCurrentType = new DicomTag(0x003A, 0x0316);
/** (003A,0317) VR=CS VM=1 Waveform Amplifier Type */
export const WaveformAmplifierType = new DicomTag(0x003A, 0x0317);
/** (003A,0318) VR=SQ VM=1 Filter Low Frequency Characteristics Sequence */
export const FilterLowFrequencyCharacteristicsSequence = new DicomTag(0x003A, 0x0318);
/** (003A,0319) VR=SQ VM=1 Filter High Frequency Characteristics Sequence */
export const FilterHighFrequencyCharacteristicsSequence = new DicomTag(0x003A, 0x0319);
/** (003A,0320) VR=SQ VM=1 Summarized Filter Lookup Table Sequence */
export const SummarizedFilterLookupTableSequence = new DicomTag(0x003A, 0x0320);
/** (003A,0321) VR=SQ VM=1 Notch Filter Characteristics Sequence */
export const NotchFilterCharacteristicsSequence = new DicomTag(0x003A, 0x0321);
/** (003A,0322) VR=CS VM=1 Waveform Filter Type */
export const WaveformFilterType = new DicomTag(0x003A, 0x0322);
/** (003A,0323) VR=SQ VM=1 Analog Filter Characteristics Sequence */
export const AnalogFilterCharacteristicsSequence = new DicomTag(0x003A, 0x0323);
/** (003A,0324) VR=DS VM=1 Analog Filter Roll Off */
export const AnalogFilterRollOff = new DicomTag(0x003A, 0x0324);
/** (003A,0325) VR=SQ VM=1 Analog Filter Type Code Sequence */
export const AnalogFilterTypeCodeSequence = new DicomTag(0x003A, 0x0325);
/** (003A,0326) VR=SQ VM=1 Digital Filter Characteristics Sequence */
export const DigitalFilterCharacteristicsSequence = new DicomTag(0x003A, 0x0326);
/** (003A,0327) VR=IS VM=1 Digital Filter Order */
export const DigitalFilterOrder = new DicomTag(0x003A, 0x0327);
/** (003A,0328) VR=SQ VM=1 Digital Filter Type Code Sequence */
export const DigitalFilterTypeCodeSequence = new DicomTag(0x003A, 0x0328);
/** (003A,0329) VR=ST VM=1 Waveform Filter Description */
export const WaveformFilterDescription = new DicomTag(0x003A, 0x0329);
/** (003A,032A) VR=SQ VM=1 Filter Lookup Table Sequence */
export const FilterLookupTableSequence = new DicomTag(0x003A, 0x032A);
/** (003A,032B) VR=ST VM=1 Filter Lookup Table Description */
export const FilterLookupTableDescription = new DicomTag(0x003A, 0x032B);
/** (003A,032C) VR=SQ VM=1 Frequency Encoding Code Sequence */
export const FrequencyEncodingCodeSequence = new DicomTag(0x003A, 0x032C);
/** (003A,032D) VR=SQ VM=1 Magnitude Encoding Code Sequence */
export const MagnitudeEncodingCodeSequence = new DicomTag(0x003A, 0x032D);
/** (003A,032E) VR=OD VM=1 Filter Lookup Table Data */
export const FilterLookupTableData = new DicomTag(0x003A, 0x032E);
/** (0040,0001) VR=AE VM=1-n Scheduled Station AE Title */
export const ScheduledStationAETitle = new DicomTag(0x0040, 0x0001);
/** (0040,0002) VR=DA VM=1 Scheduled Procedure Step Start Date */
export const ScheduledProcedureStepStartDate = new DicomTag(0x0040, 0x0002);
/** (0040,0003) VR=TM VM=1 Scheduled Procedure Step Start Time */
export const ScheduledProcedureStepStartTime = new DicomTag(0x0040, 0x0003);
/** (0040,0004) VR=DA VM=1 Scheduled Procedure Step End Date */
export const ScheduledProcedureStepEndDate = new DicomTag(0x0040, 0x0004);
/** (0040,0005) VR=TM VM=1 Scheduled Procedure Step End Time */
export const ScheduledProcedureStepEndTime = new DicomTag(0x0040, 0x0005);
/** (0040,0006) VR=PN VM=1 Scheduled Performing Physician's Name */
export const ScheduledPerformingPhysicianName = new DicomTag(0x0040, 0x0006);
/** (0040,0007) VR=LO VM=1 Scheduled Procedure Step Description */
export const ScheduledProcedureStepDescription = new DicomTag(0x0040, 0x0007);
/** (0040,0008) VR=SQ VM=1 Scheduled Protocol Code Sequence */
export const ScheduledProtocolCodeSequence = new DicomTag(0x0040, 0x0008);
/** (0040,0009) VR=SH VM=1 Scheduled Procedure Step ID */
export const ScheduledProcedureStepID = new DicomTag(0x0040, 0x0009);
/** (0040,000A) VR=SQ VM=1 Stage Code Sequence */
export const StageCodeSequence = new DicomTag(0x0040, 0x000A);
/** (0040,000B) VR=SQ VM=1 Scheduled Performing Physician Identification Sequence */
export const ScheduledPerformingPhysicianIdentificationSequence = new DicomTag(0x0040, 0x000B);
/** (0040,0010) VR=SH VM=1-n Scheduled Station Name */
export const ScheduledStationName = new DicomTag(0x0040, 0x0010);
/** (0040,0011) VR=SH VM=1 Scheduled Procedure Step Location */
export const ScheduledProcedureStepLocation = new DicomTag(0x0040, 0x0011);
/** (0040,0012) VR=LO VM=1 Pre-Medication */
export const PreMedication = new DicomTag(0x0040, 0x0012);
/** (0040,0020) VR=CS VM=1 Scheduled Procedure Step Status */
export const ScheduledProcedureStepStatus = new DicomTag(0x0040, 0x0020);
/** (0040,0026) VR=SQ VM=1 Order Placer Identifier Sequence */
export const OrderPlacerIdentifierSequence = new DicomTag(0x0040, 0x0026);
/** (0040,0027) VR=SQ VM=1 Order Filler Identifier Sequence */
export const OrderFillerIdentifierSequence = new DicomTag(0x0040, 0x0027);
/** (0040,0031) VR=UT VM=1 Local Namespace Entity ID */
export const LocalNamespaceEntityID = new DicomTag(0x0040, 0x0031);
/** (0040,0032) VR=UT VM=1 Universal Entity ID */
export const UniversalEntityID = new DicomTag(0x0040, 0x0032);
/** (0040,0033) VR=CS VM=1 Universal Entity ID Type */
export const UniversalEntityIDType = new DicomTag(0x0040, 0x0033);
/** (0040,0035) VR=CS VM=1 Identifier Type Code */
export const IdentifierTypeCode = new DicomTag(0x0040, 0x0035);
/** (0040,0036) VR=SQ VM=1 Assigning Facility Sequence */
export const AssigningFacilitySequence = new DicomTag(0x0040, 0x0036);
/** (0040,0039) VR=SQ VM=1 Assigning Jurisdiction Code Sequence */
export const AssigningJurisdictionCodeSequence = new DicomTag(0x0040, 0x0039);
/** (0040,003A) VR=SQ VM=1 Assigning Agency or Department Code Sequence */
export const AssigningAgencyOrDepartmentCodeSequence = new DicomTag(0x0040, 0x003A);
/** (0040,0100) VR=SQ VM=1 Scheduled Procedure Step Sequence */
export const ScheduledProcedureStepSequence = new DicomTag(0x0040, 0x0100);
/** (0040,0220) VR=SQ VM=1 Referenced Non-Image Composite SOP Instance Sequence */
export const ReferencedNonImageCompositeSOPInstanceSequence = new DicomTag(0x0040, 0x0220);
/** (0040,0241) VR=AE VM=1 Performed Station AE Title */
export const PerformedStationAETitle = new DicomTag(0x0040, 0x0241);
/** (0040,0242) VR=SH VM=1 Performed Station Name */
export const PerformedStationName = new DicomTag(0x0040, 0x0242);
/** (0040,0243) VR=SH VM=1 Performed Location */
export const PerformedLocation = new DicomTag(0x0040, 0x0243);
/** (0040,0244) VR=DA VM=1 Performed Procedure Step Start Date */
export const PerformedProcedureStepStartDate = new DicomTag(0x0040, 0x0244);
/** (0040,0245) VR=TM VM=1 Performed Procedure Step Start Time */
export const PerformedProcedureStepStartTime = new DicomTag(0x0040, 0x0245);
/** (0040,0250) VR=DA VM=1 Performed Procedure Step End Date */
export const PerformedProcedureStepEndDate = new DicomTag(0x0040, 0x0250);
/** (0040,0251) VR=TM VM=1 Performed Procedure Step End Time */
export const PerformedProcedureStepEndTime = new DicomTag(0x0040, 0x0251);
/** (0040,0252) VR=CS VM=1 Performed Procedure Step Status */
export const PerformedProcedureStepStatus = new DicomTag(0x0040, 0x0252);
/** (0040,0253) VR=SH VM=1 Performed Procedure Step ID */
export const PerformedProcedureStepID = new DicomTag(0x0040, 0x0253);
/** (0040,0254) VR=LO VM=1 Performed Procedure Step Description */
export const PerformedProcedureStepDescription = new DicomTag(0x0040, 0x0254);
/** (0040,0255) VR=LO VM=1 Performed Procedure Type Description */
export const PerformedProcedureTypeDescription = new DicomTag(0x0040, 0x0255);
/** (0040,0260) VR=SQ VM=1 Performed Protocol Code Sequence */
export const PerformedProtocolCodeSequence = new DicomTag(0x0040, 0x0260);
/** (0040,0261) VR=CS VM=1 Performed Protocol Type */
export const PerformedProtocolType = new DicomTag(0x0040, 0x0261);
/** (0040,0270) VR=SQ VM=1 Scheduled Step Attributes Sequence */
export const ScheduledStepAttributesSequence = new DicomTag(0x0040, 0x0270);
/** (0040,0275) VR=SQ VM=1 Request Attributes Sequence */
export const RequestAttributesSequence = new DicomTag(0x0040, 0x0275);
/** (0040,0280) VR=ST VM=1 Comments on the Performed Procedure Step */
export const CommentsOnThePerformedProcedureStep = new DicomTag(0x0040, 0x0280);
/** (0040,0281) VR=SQ VM=1 Performed Procedure Step Discontinuation Reason Code Sequence */
export const PerformedProcedureStepDiscontinuationReasonCodeSequence = new DicomTag(0x0040, 0x0281);
/** (0040,0293) VR=SQ VM=1 Quantity Sequence */
export const QuantitySequence = new DicomTag(0x0040, 0x0293);
/** (0040,0294) VR=DS VM=1 Quantity */
export const Quantity = new DicomTag(0x0040, 0x0294);
/** (0040,0295) VR=SQ VM=1 Measuring Units Sequence */
export const MeasuringUnitsSequence = new DicomTag(0x0040, 0x0295);
/** (0040,0296) VR=SQ VM=1 Billing Item Sequence */
export const BillingItemSequence = new DicomTag(0x0040, 0x0296);
/** (0040,0300) VR=US VM=1 Total Time of Fluoroscopy (Retired) */
export const TotalTimeOfFluoroscopy = new DicomTag(0x0040, 0x0300);
/** (0040,0301) VR=US VM=1 Total Number of Exposures (Retired) */
export const TotalNumberOfExposures = new DicomTag(0x0040, 0x0301);
/** (0040,0302) VR=US VM=1 Entrance Dose */
export const EntranceDose = new DicomTag(0x0040, 0x0302);
/** (0040,0303) VR=US VM=1-2 Exposed Area */
export const ExposedArea = new DicomTag(0x0040, 0x0303);
/** (0040,0306) VR=DS VM=1 Distance Source to Entrance */
export const DistanceSourceToEntrance = new DicomTag(0x0040, 0x0306);
/** (0040,0307) VR=DS VM=1 Distance Source to Support (Retired) */
export const DistanceSourceToSupport = new DicomTag(0x0040, 0x0307);
/** (0040,030E) VR=SQ VM=1 Exposure Dose Sequence (Retired) */
export const ExposureDoseSequence = new DicomTag(0x0040, 0x030E);
/** (0040,0310) VR=ST VM=1 Comments on Radiation Dose */
export const CommentsOnRadiationDose = new DicomTag(0x0040, 0x0310);
/** (0040,0312) VR=DS VM=1 X-Ray Output */
export const XRayOutput = new DicomTag(0x0040, 0x0312);
/** (0040,0314) VR=DS VM=1 Half Value Layer */
export const HalfValueLayer = new DicomTag(0x0040, 0x0314);
/** (0040,0316) VR=DS VM=1 Organ Dose */
export const OrganDose = new DicomTag(0x0040, 0x0316);
/** (0040,0318) VR=CS VM=1 Organ Exposed */
export const OrganExposed = new DicomTag(0x0040, 0x0318);
/** (0040,0320) VR=SQ VM=1 Billing Procedure Step Sequence */
export const BillingProcedureStepSequence = new DicomTag(0x0040, 0x0320);
/** (0040,0321) VR=SQ VM=1 Film Consumption Sequence */
export const FilmConsumptionSequence = new DicomTag(0x0040, 0x0321);
/** (0040,0324) VR=SQ VM=1 Billing Supplies and Devices Sequence */
export const BillingSuppliesAndDevicesSequence = new DicomTag(0x0040, 0x0324);
/** (0040,0330) VR=SQ VM=1 Referenced Procedure Step Sequence (Retired) */
export const ReferencedProcedureStepSequence = new DicomTag(0x0040, 0x0330);
/** (0040,0340) VR=SQ VM=1 Performed Series Sequence */
export const PerformedSeriesSequence = new DicomTag(0x0040, 0x0340);
/** (0040,0400) VR=LT VM=1 Comments on the Scheduled Procedure Step */
export const CommentsOnTheScheduledProcedureStep = new DicomTag(0x0040, 0x0400);
/** (0040,0440) VR=SQ VM=1 Protocol Context Sequence */
export const ProtocolContextSequence = new DicomTag(0x0040, 0x0440);
/** (0040,0441) VR=SQ VM=1 Content Item Modifier Sequence */
export const ContentItemModifierSequence = new DicomTag(0x0040, 0x0441);
/** (0040,0500) VR=SQ VM=1 Scheduled Specimen Sequence */
export const ScheduledSpecimenSequence = new DicomTag(0x0040, 0x0500);
/** (0040,050A) VR=LO VM=1 Specimen Accession Number (Retired) */
export const SpecimenAccessionNumber = new DicomTag(0x0040, 0x050A);
/** (0040,0512) VR=LO VM=1 Container Identifier */
export const ContainerIdentifier = new DicomTag(0x0040, 0x0512);
/** (0040,0513) VR=SQ VM=1 Issuer of the Container Identifier Sequence */
export const IssuerOfTheContainerIdentifierSequence = new DicomTag(0x0040, 0x0513);
/** (0040,0515) VR=SQ VM=1 Alternate Container Identifier Sequence */
export const AlternateContainerIdentifierSequence = new DicomTag(0x0040, 0x0515);
/** (0040,0518) VR=SQ VM=1 Container Type Code Sequence */
export const ContainerTypeCodeSequence = new DicomTag(0x0040, 0x0518);
/** (0040,051A) VR=LO VM=1 Container Description */
export const ContainerDescription = new DicomTag(0x0040, 0x051A);
/** (0040,0520) VR=SQ VM=1 Container Component Sequence */
export const ContainerComponentSequence = new DicomTag(0x0040, 0x0520);
/** (0040,0550) VR=SQ VM=1 Specimen Sequence (Retired) */
export const SpecimenSequence = new DicomTag(0x0040, 0x0550);
/** (0040,0551) VR=LO VM=1 Specimen Identifier */
export const SpecimenIdentifier = new DicomTag(0x0040, 0x0551);
/** (0040,0552) VR=SQ VM=1 Specimen Description Sequence (Trial) (Retired) */
export const SpecimenDescriptionSequenceTrial = new DicomTag(0x0040, 0x0552);
/** (0040,0553) VR=ST VM=1 Specimen Description (Trial) (Retired) */
export const SpecimenDescriptionTrial = new DicomTag(0x0040, 0x0553);
/** (0040,0554) VR=UI VM=1 Specimen UID */
export const SpecimenUID = new DicomTag(0x0040, 0x0554);
/** (0040,0555) VR=SQ VM=1 Acquisition Context Sequence */
export const AcquisitionContextSequence = new DicomTag(0x0040, 0x0555);
/** (0040,0556) VR=ST VM=1 Acquisition Context Description */
export const AcquisitionContextDescription = new DicomTag(0x0040, 0x0556);
/** (0040,059A) VR=SQ VM=1 Specimen Type Code Sequence */
export const SpecimenTypeCodeSequence = new DicomTag(0x0040, 0x059A);
/** (0040,0560) VR=SQ VM=1 Specimen Description Sequence */
export const SpecimenDescriptionSequence = new DicomTag(0x0040, 0x0560);
/** (0040,0562) VR=SQ VM=1 Issuer of the Specimen Identifier Sequence */
export const IssuerOfTheSpecimenIdentifierSequence = new DicomTag(0x0040, 0x0562);
/** (0040,0600) VR=LO VM=1 Specimen Short Description */
export const SpecimenShortDescription = new DicomTag(0x0040, 0x0600);
/** (0040,0602) VR=UT VM=1 Specimen Detailed Description */
export const SpecimenDetailedDescription = new DicomTag(0x0040, 0x0602);
/** (0040,0610) VR=SQ VM=1 Specimen Preparation Sequence */
export const SpecimenPreparationSequence = new DicomTag(0x0040, 0x0610);
/** (0040,0612) VR=SQ VM=1 Specimen Preparation Step Content Item Sequence */
export const SpecimenPreparationStepContentItemSequence = new DicomTag(0x0040, 0x0612);
/** (0040,0620) VR=SQ VM=1 Specimen Localization Content Item Sequence */
export const SpecimenLocalizationContentItemSequence = new DicomTag(0x0040, 0x0620);
/** (0040,06FA) VR=LO VM=1 Slide Identifier (Retired) */
export const SlideIdentifier = new DicomTag(0x0040, 0x06FA);
/** (0040,0710) VR=SQ VM=1 Whole Slide Microscopy Image Frame Type Sequence */
export const WholeSlideMicroscopyImageFrameTypeSequence = new DicomTag(0x0040, 0x0710);
/** (0040,071A) VR=SQ VM=1 Image Center Point Coordinates Sequence */
export const ImageCenterPointCoordinatesSequence = new DicomTag(0x0040, 0x071A);
/** (0040,072A) VR=DS VM=1 X Offset in Slide Coordinate System */
export const XOffsetInSlideCoordinateSystem = new DicomTag(0x0040, 0x072A);
/** (0040,073A) VR=DS VM=1 Y Offset in Slide Coordinate System */
export const YOffsetInSlideCoordinateSystem = new DicomTag(0x0040, 0x073A);
/** (0040,074A) VR=DS VM=1 Z Offset in Slide Coordinate System */
export const ZOffsetInSlideCoordinateSystem = new DicomTag(0x0040, 0x074A);
/** (0040,08D8) VR=SQ VM=1 Pixel Spacing Sequence (Retired) */
export const PixelSpacingSequence = new DicomTag(0x0040, 0x08D8);
/** (0040,08DA) VR=SQ VM=1 Coordinate System Axis Code Sequence (Retired) */
export const CoordinateSystemAxisCodeSequence = new DicomTag(0x0040, 0x08DA);
/** (0040,08EA) VR=SQ VM=1 Measurement Units Code Sequence */
export const MeasurementUnitsCodeSequence = new DicomTag(0x0040, 0x08EA);
/** (0040,09F8) VR=SQ VM=1 Vital Stain Code Sequence (Trial) (Retired) */
export const VitalStainCodeSequenceTrial = new DicomTag(0x0040, 0x09F8);
/** (0040,1001) VR=SH VM=1 Requested Procedure ID */
export const RequestedProcedureID = new DicomTag(0x0040, 0x1001);
/** (0040,1002) VR=LO VM=1 Reason for the Requested Procedure */
export const ReasonForTheRequestedProcedure = new DicomTag(0x0040, 0x1002);
/** (0040,1003) VR=SH VM=1 Requested Procedure Priority */
export const RequestedProcedurePriority = new DicomTag(0x0040, 0x1003);
/** (0040,1004) VR=LO VM=1 Patient Transport Arrangements */
export const PatientTransportArrangements = new DicomTag(0x0040, 0x1004);
/** (0040,1005) VR=LO VM=1 Requested Procedure Location */
export const RequestedProcedureLocation = new DicomTag(0x0040, 0x1005);
/** (0040,1006) VR=SH VM=1 Placer Order Number / Procedure (Retired) */
export const PlacerOrderNumberProcedure = new DicomTag(0x0040, 0x1006);
/** (0040,1007) VR=SH VM=1 Filler Order Number / Procedure (Retired) */
export const FillerOrderNumberProcedure = new DicomTag(0x0040, 0x1007);
/** (0040,1008) VR=LO VM=1 Confidentiality Code */
export const ConfidentialityCode = new DicomTag(0x0040, 0x1008);
/** (0040,1009) VR=SH VM=1 Reporting Priority */
export const ReportingPriority = new DicomTag(0x0040, 0x1009);
/** (0040,100A) VR=SQ VM=1 Reason for Requested Procedure Code Sequence */
export const ReasonForRequestedProcedureCodeSequence = new DicomTag(0x0040, 0x100A);
/** (0040,1010) VR=PN VM=1-n Names of Intended Recipients of Results */
export const NamesOfIntendedRecipientsOfResults = new DicomTag(0x0040, 0x1010);
/** (0040,1011) VR=SQ VM=1 Intended Recipients of Results Identification Sequence */
export const IntendedRecipientsOfResultsIdentificationSequence = new DicomTag(0x0040, 0x1011);
/** (0040,1012) VR=SQ VM=1 Reason For Performed Procedure Code Sequence */
export const ReasonForPerformedProcedureCodeSequence = new DicomTag(0x0040, 0x1012);
/** (0040,1060) VR=LO VM=1 Requested Procedure Description (Trial) (Retired) */
export const RequestedProcedureDescriptionTrial = new DicomTag(0x0040, 0x1060);
/** (0040,1101) VR=SQ VM=1 Person Identification Code Sequence */
export const PersonIdentificationCodeSequence = new DicomTag(0x0040, 0x1101);
/** (0040,1102) VR=ST VM=1 Person's Address */
export const PersonAddress = new DicomTag(0x0040, 0x1102);
/** (0040,1103) VR=LO VM=1-n Person's Telephone Numbers */
export const PersonTelephoneNumbers = new DicomTag(0x0040, 0x1103);
/** (0040,1104) VR=LT VM=1 Person's Telecom Information */
export const PersonTelecomInformation = new DicomTag(0x0040, 0x1104);
/** (0040,1400) VR=LT VM=1 Requested Procedure Comments */
export const RequestedProcedureComments = new DicomTag(0x0040, 0x1400);
/** (0040,2001) VR=LO VM=1 Reason for the Imaging Service Request (Retired) */
export const ReasonForTheImagingServiceRequest = new DicomTag(0x0040, 0x2001);
/** (0040,2004) VR=DA VM=1 Issue Date of Imaging Service Request */
export const IssueDateOfImagingServiceRequest = new DicomTag(0x0040, 0x2004);
/** (0040,2005) VR=TM VM=1 Issue Time of Imaging Service Request */
export const IssueTimeOfImagingServiceRequest = new DicomTag(0x0040, 0x2005);
/** (0040,2006) VR=SH VM=1 Placer Order Number / Imaging Service Request (Retired) (Retired) */
export const PlacerOrderNumberImagingServiceRequestRetired = new DicomTag(0x0040, 0x2006);
/** (0040,2007) VR=SH VM=1 Filler Order Number / Imaging Service Request (Retired) (Retired) */
export const FillerOrderNumberImagingServiceRequestRetired = new DicomTag(0x0040, 0x2007);
/** (0040,2008) VR=PN VM=1 Order Entered By */
export const OrderEnteredBy = new DicomTag(0x0040, 0x2008);
/** (0040,2009) VR=SH VM=1 Order Enterer's Location */
export const OrderEntererLocation = new DicomTag(0x0040, 0x2009);
/** (0040,2010) VR=SH VM=1 Order Callback Phone Number */
export const OrderCallbackPhoneNumber = new DicomTag(0x0040, 0x2010);
/** (0040,2011) VR=LT VM=1 Order Callback Telecom Information */
export const OrderCallbackTelecomInformation = new DicomTag(0x0040, 0x2011);
/** (0040,2016) VR=LO VM=1 Placer Order Number / Imaging Service Request */
export const PlacerOrderNumberImagingServiceRequest = new DicomTag(0x0040, 0x2016);
/** (0040,2017) VR=LO VM=1 Filler Order Number / Imaging Service Request */
export const FillerOrderNumberImagingServiceRequest = new DicomTag(0x0040, 0x2017);
/** (0040,2400) VR=LT VM=1 Imaging Service Request Comments */
export const ImagingServiceRequestComments = new DicomTag(0x0040, 0x2400);
/** (0040,3001) VR=LO VM=1 Confidentiality Constraint on Patient Data Description */
export const ConfidentialityConstraintOnPatientDataDescription = new DicomTag(0x0040, 0x3001);
/** (0040,4001) VR=CS VM=1 General Purpose Scheduled Procedure Step Status (Retired) */
export const GeneralPurposeScheduledProcedureStepStatus = new DicomTag(0x0040, 0x4001);
/** (0040,4002) VR=CS VM=1 General Purpose Performed Procedure Step Status (Retired) */
export const GeneralPurposePerformedProcedureStepStatus = new DicomTag(0x0040, 0x4002);
/** (0040,4003) VR=CS VM=1 General Purpose Scheduled Procedure Step Priority (Retired) */
export const GeneralPurposeScheduledProcedureStepPriority = new DicomTag(0x0040, 0x4003);
/** (0040,4004) VR=SQ VM=1 Scheduled Processing Applications Code Sequence (Retired) */
export const ScheduledProcessingApplicationsCodeSequence = new DicomTag(0x0040, 0x4004);
/** (0040,4005) VR=DT VM=1 Scheduled Procedure Step Start DateTime */
export const ScheduledProcedureStepStartDateTime = new DicomTag(0x0040, 0x4005);
/** (0040,4006) VR=CS VM=1 Multiple Copies Flag (Retired) */
export const MultipleCopiesFlag = new DicomTag(0x0040, 0x4006);
/** (0040,4007) VR=SQ VM=1 Performed Processing Applications Code Sequence (Retired) */
export const PerformedProcessingApplicationsCodeSequence = new DicomTag(0x0040, 0x4007);
/** (0040,4008) VR=DT VM=1 Scheduled Procedure Step Expiration DateTime */
export const ScheduledProcedureStepExpirationDateTime = new DicomTag(0x0040, 0x4008);
/** (0040,4009) VR=SQ VM=1 Human Performer Code Sequence */
export const HumanPerformerCodeSequence = new DicomTag(0x0040, 0x4009);
/** (0040,4010) VR=DT VM=1 Scheduled Procedure Step Modification DateTime */
export const ScheduledProcedureStepModificationDateTime = new DicomTag(0x0040, 0x4010);
/** (0040,4011) VR=DT VM=1 Expected Completion DateTime */
export const ExpectedCompletionDateTime = new DicomTag(0x0040, 0x4011);
/** (0040,4015) VR=SQ VM=1 Resulting General Purpose Performed Procedure Steps Sequence (Retired) */
export const ResultingGeneralPurposePerformedProcedureStepsSequence = new DicomTag(0x0040, 0x4015);
/** (0040,4016) VR=SQ VM=1 Referenced General Purpose Scheduled Procedure Step Sequence (Retired) */
export const ReferencedGeneralPurposeScheduledProcedureStepSequence = new DicomTag(0x0040, 0x4016);
/** (0040,4018) VR=SQ VM=1 Scheduled Workitem Code Sequence */
export const ScheduledWorkitemCodeSequence = new DicomTag(0x0040, 0x4018);
/** (0040,4019) VR=SQ VM=1 Performed Workitem Code Sequence */
export const PerformedWorkitemCodeSequence = new DicomTag(0x0040, 0x4019);
/** (0040,4020) VR=CS VM=1 Input Availability Flag (Retired) */
export const InputAvailabilityFlag = new DicomTag(0x0040, 0x4020);
/** (0040,4021) VR=SQ VM=1 Input Information Sequence */
export const InputInformationSequence = new DicomTag(0x0040, 0x4021);
/** (0040,4022) VR=SQ VM=1 Relevant Information Sequence (Retired) */
export const RelevantInformationSequence = new DicomTag(0x0040, 0x4022);
/** (0040,4023) VR=UI VM=1 Referenced General Purpose Scheduled Procedure Step Transaction UID (Retired) */
export const ReferencedGeneralPurposeScheduledProcedureStepTransactionUID = new DicomTag(0x0040, 0x4023);
/** (0040,4025) VR=SQ VM=1 Scheduled Station Name Code Sequence */
export const ScheduledStationNameCodeSequence = new DicomTag(0x0040, 0x4025);
/** (0040,4026) VR=SQ VM=1 Scheduled Station Class Code Sequence */
export const ScheduledStationClassCodeSequence = new DicomTag(0x0040, 0x4026);
/** (0040,4027) VR=SQ VM=1 Scheduled Station Geographic Location Code Sequence */
export const ScheduledStationGeographicLocationCodeSequence = new DicomTag(0x0040, 0x4027);
/** (0040,4028) VR=SQ VM=1 Performed Station Name Code Sequence */
export const PerformedStationNameCodeSequence = new DicomTag(0x0040, 0x4028);
/** (0040,4029) VR=SQ VM=1 Performed Station Class Code Sequence */
export const PerformedStationClassCodeSequence = new DicomTag(0x0040, 0x4029);
/** (0040,4030) VR=SQ VM=1 Performed Station Geographic Location Code Sequence */
export const PerformedStationGeographicLocationCodeSequence = new DicomTag(0x0040, 0x4030);
/** (0040,4031) VR=SQ VM=1 Requested Subsequent Workitem Code Sequence (Retired) */
export const RequestedSubsequentWorkitemCodeSequence = new DicomTag(0x0040, 0x4031);
/** (0040,4032) VR=SQ VM=1 Non-DICOM Output Code Sequence (Retired) */
export const NonDICOMOutputCodeSequence = new DicomTag(0x0040, 0x4032);
/** (0040,4033) VR=SQ VM=1 Output Information Sequence */
export const OutputInformationSequence = new DicomTag(0x0040, 0x4033);
/** (0040,4034) VR=SQ VM=1 Scheduled Human Performers Sequence */
export const ScheduledHumanPerformersSequence = new DicomTag(0x0040, 0x4034);
/** (0040,4035) VR=SQ VM=1 Actual Human Performers Sequence */
export const ActualHumanPerformersSequence = new DicomTag(0x0040, 0x4035);
/** (0040,4036) VR=LO VM=1 Human Performer's Organization */
export const HumanPerformerOrganization = new DicomTag(0x0040, 0x4036);
/** (0040,4037) VR=PN VM=1 Human Performer's Name */
export const HumanPerformerName = new DicomTag(0x0040, 0x4037);
/** (0040,4040) VR=CS VM=1 Raw Data Handling */
export const RawDataHandling = new DicomTag(0x0040, 0x4040);
/** (0040,4041) VR=CS VM=1 Input Readiness State */
export const InputReadinessState = new DicomTag(0x0040, 0x4041);
/** (0040,4050) VR=DT VM=1 Performed Procedure Step Start DateTime */
export const PerformedProcedureStepStartDateTime = new DicomTag(0x0040, 0x4050);
/** (0040,4051) VR=DT VM=1 Performed Procedure Step End DateTime */
export const PerformedProcedureStepEndDateTime = new DicomTag(0x0040, 0x4051);
/** (0040,4052) VR=DT VM=1 Procedure Step Cancellation DateTime */
export const ProcedureStepCancellationDateTime = new DicomTag(0x0040, 0x4052);
/** (0040,4070) VR=SQ VM=1 Output Destination Sequence */
export const OutputDestinationSequence = new DicomTag(0x0040, 0x4070);
/** (0040,4071) VR=SQ VM=1 DICOM Storage Sequence */
export const DICOMStorageSequence = new DicomTag(0x0040, 0x4071);
/** (0040,4072) VR=SQ VM=1 STOW-RS Storage Sequence */
export const STOWRSStorageSequence = new DicomTag(0x0040, 0x4072);
/** (0040,4073) VR=UR VM=1 Storage URL */
export const StorageURL = new DicomTag(0x0040, 0x4073);
/** (0040,4074) VR=SQ VM=1 XDS Storage Sequence */
export const XDSStorageSequence = new DicomTag(0x0040, 0x4074);
/** (0040,8302) VR=DS VM=1 Entrance Dose in mGy */
export const EntranceDoseInmGy = new DicomTag(0x0040, 0x8302);
/** (0040,8303) VR=CS VM=1 Entrance Dose Derivation */
export const EntranceDoseDerivation = new DicomTag(0x0040, 0x8303);
/** (0040,9092) VR=SQ VM=1 Parametric Map Frame Type Sequence */
export const ParametricMapFrameTypeSequence = new DicomTag(0x0040, 0x9092);
/** (0040,9094) VR=SQ VM=1 Referenced Image Real World Value Mapping Sequence */
export const ReferencedImageRealWorldValueMappingSequence = new DicomTag(0x0040, 0x9094);
/** (0040,9096) VR=SQ VM=1 Real World Value Mapping Sequence */
export const RealWorldValueMappingSequence = new DicomTag(0x0040, 0x9096);
/** (0040,9098) VR=SQ VM=1 Pixel Value Mapping Code Sequence */
export const PixelValueMappingCodeSequence = new DicomTag(0x0040, 0x9098);
/** (0040,9210) VR=SH VM=1 LUT Label */
export const LUTLabel = new DicomTag(0x0040, 0x9210);
/** (0040,9211) VR=US/SS VM=1 Real World Value Last Value Mapped */
export const RealWorldValueLastValueMapped = new DicomTag(0x0040, 0x9211);
/** (0040,9212) VR=FD VM=1-n Real World Value LUT Data */
export const RealWorldValueLUTData = new DicomTag(0x0040, 0x9212);
/** (0040,9213) VR=FD VM=1 Double Float Real World Value Last Value Mapped */
export const DoubleFloatRealWorldValueLastValueMapped = new DicomTag(0x0040, 0x9213);
/** (0040,9214) VR=FD VM=1 Double Float Real World Value First Value Mapped */
export const DoubleFloatRealWorldValueFirstValueMapped = new DicomTag(0x0040, 0x9214);
/** (0040,9216) VR=US/SS VM=1 Real World Value First Value Mapped */
export const RealWorldValueFirstValueMapped = new DicomTag(0x0040, 0x9216);
/** (0040,9220) VR=SQ VM=1 Quantity Definition Sequence */
export const QuantityDefinitionSequence = new DicomTag(0x0040, 0x9220);
/** (0040,9224) VR=FD VM=1 Real World Value Intercept */
export const RealWorldValueIntercept = new DicomTag(0x0040, 0x9224);
/** (0040,9225) VR=FD VM=1 Real World Value Slope */
export const RealWorldValueSlope = new DicomTag(0x0040, 0x9225);
/** (0040,A007) VR=CS VM=1 Findings Flag (Trial) (Retired) */
export const FindingsFlagTrial = new DicomTag(0x0040, 0xA007);
/** (0040,A010) VR=CS VM=1 Relationship Type */
export const RelationshipType = new DicomTag(0x0040, 0xA010);
/** (0040,A020) VR=SQ VM=1 Findings Sequence (Trial) (Retired) */
export const FindingsSequenceTrial = new DicomTag(0x0040, 0xA020);
/** (0040,A021) VR=UI VM=1 Findings Group UID (Trial) (Retired) */
export const FindingsGroupUIDTrial = new DicomTag(0x0040, 0xA021);
/** (0040,A022) VR=UI VM=1 Referenced Findings Group UID (Trial) (Retired) */
export const ReferencedFindingsGroupUIDTrial = new DicomTag(0x0040, 0xA022);
/** (0040,A023) VR=DA VM=1 Findings Group Recording Date (Trial) (Retired) */
export const FindingsGroupRecordingDateTrial = new DicomTag(0x0040, 0xA023);
/** (0040,A024) VR=TM VM=1 Findings Group Recording Time (Trial) (Retired) */
export const FindingsGroupRecordingTimeTrial = new DicomTag(0x0040, 0xA024);
/** (0040,A026) VR=SQ VM=1 Findings Source Category Code Sequence (Trial) (Retired) */
export const FindingsSourceCategoryCodeSequenceTrial = new DicomTag(0x0040, 0xA026);
/** (0040,A027) VR=LO VM=1 Verifying Organization */
export const VerifyingOrganization = new DicomTag(0x0040, 0xA027);
/** (0040,A028) VR=SQ VM=1 Documenting Organization Identifier Code Sequence (Trial) (Retired) */
export const DocumentingOrganizationIdentifierCodeSequenceTrial = new DicomTag(0x0040, 0xA028);
/** (0040,A030) VR=DT VM=1 Verification DateTime */
export const VerificationDateTime = new DicomTag(0x0040, 0xA030);
/** (0040,A032) VR=DT VM=1 Observation DateTime */
export const ObservationDateTime = new DicomTag(0x0040, 0xA032);
/** (0040,A033) VR=DT VM=1 Observation Start DateTime */
export const ObservationStartDateTime = new DicomTag(0x0040, 0xA033);
/** (0040,A034) VR=DT VM=1 Effective Start DateTime */
export const EffectiveStartDateTime = new DicomTag(0x0040, 0xA034);
/** (0040,A035) VR=DT VM=1 Effective Stop DateTime */
export const EffectiveStopDateTime = new DicomTag(0x0040, 0xA035);
/** (0040,A040) VR=CS VM=1 Value Type */
export const ValueType = new DicomTag(0x0040, 0xA040);
/** (0040,A043) VR=SQ VM=1 Concept Name Code Sequence */
export const ConceptNameCodeSequence = new DicomTag(0x0040, 0xA043);
/** (0040,A047) VR=LO VM=1 Measurement Precision Description (Trial) (Retired) */
export const MeasurementPrecisionDescriptionTrial = new DicomTag(0x0040, 0xA047);
/** (0040,A050) VR=CS VM=1 Continuity Of Content */
export const ContinuityOfContent = new DicomTag(0x0040, 0xA050);
/** (0040,A057) VR=CS VM=1-n Urgency or Priority Alerts (Trial) (Retired) */
export const UrgencyOrPriorityAlertsTrial = new DicomTag(0x0040, 0xA057);
/** (0040,A060) VR=LO VM=1 Sequencing Indicator (Trial) (Retired) */
export const SequencingIndicatorTrial = new DicomTag(0x0040, 0xA060);
/** (0040,A066) VR=SQ VM=1 Document Identifier Code Sequence (Trial) (Retired) */
export const DocumentIdentifierCodeSequenceTrial = new DicomTag(0x0040, 0xA066);
/** (0040,A067) VR=PN VM=1 Document Author (Trial) (Retired) */
export const DocumentAuthorTrial = new DicomTag(0x0040, 0xA067);
/** (0040,A068) VR=SQ VM=1 Document Author Identifier Code Sequence (Trial) (Retired) */
export const DocumentAuthorIdentifierCodeSequenceTrial = new DicomTag(0x0040, 0xA068);
/** (0040,A070) VR=SQ VM=1 Identifier Code Sequence (Trial) (Retired) */
export const IdentifierCodeSequenceTrial = new DicomTag(0x0040, 0xA070);
/** (0040,A073) VR=SQ VM=1 Verifying Observer Sequence */
export const VerifyingObserverSequence = new DicomTag(0x0040, 0xA073);
/** (0040,A074) VR=OB VM=1 Object Binary Identifier (Trial) (Retired) */
export const ObjectBinaryIdentifierTrial = new DicomTag(0x0040, 0xA074);
/** (0040,A075) VR=PN VM=1 Verifying Observer Name */
export const VerifyingObserverName = new DicomTag(0x0040, 0xA075);
/** (0040,A076) VR=SQ VM=1 Documenting Observer Identifier Code Sequence (Trial) (Retired) */
export const DocumentingObserverIdentifierCodeSequenceTrial = new DicomTag(0x0040, 0xA076);
/** (0040,A078) VR=SQ VM=1 Author Observer Sequence */
export const AuthorObserverSequence = new DicomTag(0x0040, 0xA078);
/** (0040,A07A) VR=SQ VM=1 Participant Sequence */
export const ParticipantSequence = new DicomTag(0x0040, 0xA07A);
/** (0040,A07C) VR=SQ VM=1 Custodial Organization Sequence */
export const CustodialOrganizationSequence = new DicomTag(0x0040, 0xA07C);
/** (0040,A080) VR=CS VM=1 Participation Type */
export const ParticipationType = new DicomTag(0x0040, 0xA080);
/** (0040,A082) VR=DT VM=1 Participation DateTime */
export const ParticipationDateTime = new DicomTag(0x0040, 0xA082);
/** (0040,A084) VR=CS VM=1 Observer Type */
export const ObserverType = new DicomTag(0x0040, 0xA084);
/** (0040,A085) VR=SQ VM=1 Procedure Identifier Code Sequence (Trial) (Retired) */
export const ProcedureIdentifierCodeSequenceTrial = new DicomTag(0x0040, 0xA085);
/** (0040,A088) VR=SQ VM=1 Verifying Observer Identification Code Sequence */
export const VerifyingObserverIdentificationCodeSequence = new DicomTag(0x0040, 0xA088);
/** (0040,A089) VR=OB VM=1 Object Directory Binary Identifier (Trial) (Retired) */
export const ObjectDirectoryBinaryIdentifierTrial = new DicomTag(0x0040, 0xA089);
/** (0040,A090) VR=SQ VM=1 Equivalent CDA Document Sequence (Retired) */
export const EquivalentCDADocumentSequence = new DicomTag(0x0040, 0xA090);
/** (0040,A0B0) VR=US VM=2-2n Referenced Waveform Channels */
export const ReferencedWaveformChannels = new DicomTag(0x0040, 0xA0B0);
/** (0040,A110) VR=DA VM=1 Date of Document or Verbal Transaction (Trial) (Retired) */
export const DateOfDocumentOrVerbalTransactionTrial = new DicomTag(0x0040, 0xA110);
/** (0040,A112) VR=TM VM=1 Time of Document Creation or Verbal Transaction (Trial) (Retired) */
export const TimeOfDocumentCreationOrVerbalTransactionTrial = new DicomTag(0x0040, 0xA112);
/** (0040,A120) VR=DT VM=1 DateTime */
export const DateTime = new DicomTag(0x0040, 0xA120);
/** (0040,A121) VR=DA VM=1 Date */
export const Date = new DicomTag(0x0040, 0xA121);
/** (0040,A122) VR=TM VM=1 Time */
export const Time = new DicomTag(0x0040, 0xA122);
/** (0040,A123) VR=PN VM=1 Person Name */
export const PersonName = new DicomTag(0x0040, 0xA123);
/** (0040,A124) VR=UI VM=1 UID */
export const UID = new DicomTag(0x0040, 0xA124);
/** (0040,A125) VR=CS VM=2 Report Status ID (Trial) (Retired) */
export const ReportStatusIDTrial = new DicomTag(0x0040, 0xA125);
/** (0040,A130) VR=CS VM=1 Temporal Range Type */
export const TemporalRangeType = new DicomTag(0x0040, 0xA130);
/** (0040,A132) VR=UL VM=1-n Referenced Sample Positions */
export const ReferencedSamplePositions = new DicomTag(0x0040, 0xA132);
/** (0040,A136) VR=US VM=1-n Referenced Frame Numbers (Retired) */
export const ReferencedFrameNumbers = new DicomTag(0x0040, 0xA136);
/** (0040,A138) VR=DS VM=1-n Referenced Time Offsets */
export const ReferencedTimeOffsets = new DicomTag(0x0040, 0xA138);
/** (0040,A13A) VR=DT VM=1-n Referenced DateTime */
export const ReferencedDateTime = new DicomTag(0x0040, 0xA13A);
/** (0040,A160) VR=UT VM=1 Text Value */
export const TextValue = new DicomTag(0x0040, 0xA160);
/** (0040,A161) VR=FD VM=1-n Floating Point Value */
export const FloatingPointValue = new DicomTag(0x0040, 0xA161);
/** (0040,A162) VR=SL VM=1-n Rational Numerator Value */
export const RationalNumeratorValue = new DicomTag(0x0040, 0xA162);
/** (0040,A163) VR=UL VM=1-n Rational Denominator Value */
export const RationalDenominatorValue = new DicomTag(0x0040, 0xA163);
/** (0040,A167) VR=SQ VM=1 Observation Category Code Sequence (Trial) (Retired) */
export const ObservationCategoryCodeSequenceTrial = new DicomTag(0x0040, 0xA167);
/** (0040,A168) VR=SQ VM=1 Concept Code Sequence */
export const ConceptCodeSequence = new DicomTag(0x0040, 0xA168);
/** (0040,A16A) VR=ST VM=1 Bibliographic Citation (Trial) (Retired) */
export const BibliographicCitationTrial = new DicomTag(0x0040, 0xA16A);
/** (0040,A170) VR=SQ VM=1 Purpose of Reference Code Sequence */
export const PurposeOfReferenceCodeSequence = new DicomTag(0x0040, 0xA170);
/** (0040,A171) VR=UI VM=1 Observation UID */
export const ObservationUID = new DicomTag(0x0040, 0xA171);
/** (0040,A172) VR=UI VM=1 Referenced Observation UID (Trial) (Retired) */
export const ReferencedObservationUIDTrial = new DicomTag(0x0040, 0xA172);
/** (0040,A173) VR=CS VM=1 Referenced Observation Class (Trial) (Retired) */
export const ReferencedObservationClassTrial = new DicomTag(0x0040, 0xA173);
/** (0040,A174) VR=CS VM=1 Referenced Object Observation Class (Trial) (Retired) */
export const ReferencedObjectObservationClassTrial = new DicomTag(0x0040, 0xA174);
/** (0040,A180) VR=US VM=1 Annotation Group Number */
export const AnnotationGroupNumber = new DicomTag(0x0040, 0xA180);
/** (0040,A192) VR=DA VM=1 Observation Date (Trial) (Retired) */
export const ObservationDateTrial = new DicomTag(0x0040, 0xA192);
/** (0040,A193) VR=TM VM=1 Observation Time (Trial) (Retired) */
export const ObservationTimeTrial = new DicomTag(0x0040, 0xA193);
/** (0040,A194) VR=CS VM=1 Measurement Automation (Trial) (Retired) */
export const MeasurementAutomationTrial = new DicomTag(0x0040, 0xA194);
/** (0040,A195) VR=SQ VM=1 Modifier Code Sequence */
export const ModifierCodeSequence = new DicomTag(0x0040, 0xA195);
/** (0040,A224) VR=ST VM=1 Identification Description (Trial) (Retired) */
export const IdentificationDescriptionTrial = new DicomTag(0x0040, 0xA224);
/** (0040,A290) VR=CS VM=1 Coordinates Set Geometric Type (Trial) (Retired) */
export const CoordinatesSetGeometricTypeTrial = new DicomTag(0x0040, 0xA290);
/** (0040,A296) VR=SQ VM=1 Algorithm Code Sequence (Trial) (Retired) */
export const AlgorithmCodeSequenceTrial = new DicomTag(0x0040, 0xA296);
/** (0040,A297) VR=ST VM=1 Algorithm Description (Trial) (Retired) */
export const AlgorithmDescriptionTrial = new DicomTag(0x0040, 0xA297);
/** (0040,A29A) VR=SL VM=2-2n Pixel Coordinates Set (Trial) (Retired) */
export const PixelCoordinatesSetTrial = new DicomTag(0x0040, 0xA29A);
/** (0040,A300) VR=SQ VM=1 Measured Value Sequence */
export const MeasuredValueSequence = new DicomTag(0x0040, 0xA300);
/** (0040,A301) VR=SQ VM=1 Numeric Value Qualifier Code Sequence */
export const NumericValueQualifierCodeSequence = new DicomTag(0x0040, 0xA301);
/** (0040,A307) VR=PN VM=1 Current Observer (Trial) (Retired) */
export const CurrentObserverTrial = new DicomTag(0x0040, 0xA307);
/** (0040,A30A) VR=DS VM=1-n Numeric Value */
export const NumericValue = new DicomTag(0x0040, 0xA30A);
/** (0040,A313) VR=SQ VM=1 Referenced Accession Sequence (Trial) (Retired) */
export const ReferencedAccessionSequenceTrial = new DicomTag(0x0040, 0xA313);
/** (0040,A33A) VR=ST VM=1 Report Status Comment (Trial) (Retired) */
export const ReportStatusCommentTrial = new DicomTag(0x0040, 0xA33A);
/** (0040,A340) VR=SQ VM=1 Procedure Context Sequence (Trial) (Retired) */
export const ProcedureContextSequenceTrial = new DicomTag(0x0040, 0xA340);
/** (0040,A352) VR=PN VM=1 Verbal Source (Trial) (Retired) */
export const VerbalSourceTrial = new DicomTag(0x0040, 0xA352);
/** (0040,A353) VR=ST VM=1 Address (Trial) (Retired) */
export const AddressTrial = new DicomTag(0x0040, 0xA353);
/** (0040,A354) VR=LO VM=1 Telephone Number (Trial) (Retired) */
export const TelephoneNumberTrial = new DicomTag(0x0040, 0xA354);
/** (0040,A358) VR=SQ VM=1 Verbal Source Identifier Code Sequence (Trial) (Retired) */
export const VerbalSourceIdentifierCodeSequenceTrial = new DicomTag(0x0040, 0xA358);
/** (0040,A360) VR=SQ VM=1 Predecessor Documents Sequence */
export const PredecessorDocumentsSequence = new DicomTag(0x0040, 0xA360);
/** (0040,A370) VR=SQ VM=1 Referenced Request Sequence */
export const ReferencedRequestSequence = new DicomTag(0x0040, 0xA370);
/** (0040,A372) VR=SQ VM=1 Performed Procedure Code Sequence */
export const PerformedProcedureCodeSequence = new DicomTag(0x0040, 0xA372);
/** (0040,A375) VR=SQ VM=1 Current Requested Procedure Evidence Sequence */
export const CurrentRequestedProcedureEvidenceSequence = new DicomTag(0x0040, 0xA375);
/** (0040,A380) VR=SQ VM=1 Report Detail Sequence (Trial) (Retired) */
export const ReportDetailSequenceTrial = new DicomTag(0x0040, 0xA380);
/** (0040,A385) VR=SQ VM=1 Pertinent Other Evidence Sequence */
export const PertinentOtherEvidenceSequence = new DicomTag(0x0040, 0xA385);
/** (0040,A390) VR=SQ VM=1 HL7 Structured Document Reference Sequence */
export const HL7StructuredDocumentReferenceSequence = new DicomTag(0x0040, 0xA390);
/** (0040,A402) VR=UI VM=1 Observation Subject UID (Trial) (Retired) */
export const ObservationSubjectUIDTrial = new DicomTag(0x0040, 0xA402);
/** (0040,A403) VR=CS VM=1 Observation Subject Class (Trial) (Retired) */
export const ObservationSubjectClassTrial = new DicomTag(0x0040, 0xA403);
/** (0040,A404) VR=SQ VM=1 Observation Subject Type Code Sequence (Trial) (Retired) */
export const ObservationSubjectTypeCodeSequenceTrial = new DicomTag(0x0040, 0xA404);
/** (0040,A491) VR=CS VM=1 Completion Flag */
export const CompletionFlag = new DicomTag(0x0040, 0xA491);
/** (0040,A492) VR=LO VM=1 Completion Flag Description */
export const CompletionFlagDescription = new DicomTag(0x0040, 0xA492);
/** (0040,A493) VR=CS VM=1 Verification Flag */
export const VerificationFlag = new DicomTag(0x0040, 0xA493);
/** (0040,A494) VR=CS VM=1 Archive Requested */
export const ArchiveRequested = new DicomTag(0x0040, 0xA494);
/** (0040,A496) VR=CS VM=1 Preliminary Flag */
export const PreliminaryFlag = new DicomTag(0x0040, 0xA496);
/** (0040,A504) VR=SQ VM=1 Content Template Sequence */
export const ContentTemplateSequence = new DicomTag(0x0040, 0xA504);
/** (0040,A525) VR=SQ VM=1 Identical Documents Sequence */
export const IdenticalDocumentsSequence = new DicomTag(0x0040, 0xA525);
/** (0040,A600) VR=CS VM=1 Observation Subject Context Flag (Trial) (Retired) */
export const ObservationSubjectContextFlagTrial = new DicomTag(0x0040, 0xA600);
/** (0040,A601) VR=CS VM=1 Observer Context Flag (Trial) (Retired) */
export const ObserverContextFlagTrial = new DicomTag(0x0040, 0xA601);
/** (0040,A603) VR=CS VM=1 Procedure Context Flag (Trial) (Retired) */
export const ProcedureContextFlagTrial = new DicomTag(0x0040, 0xA603);
/** (0040,A730) VR=SQ VM=1 Content Sequence */
export const ContentSequence = new DicomTag(0x0040, 0xA730);
/** (0040,A731) VR=SQ VM=1 Relationship Sequence (Trial) (Retired) */
export const RelationshipSequenceTrial = new DicomTag(0x0040, 0xA731);
/** (0040,A732) VR=SQ VM=1 Relationship Type Code Sequence (Trial) (Retired) */
export const RelationshipTypeCodeSequenceTrial = new DicomTag(0x0040, 0xA732);
/** (0040,A744) VR=SQ VM=1 Language Code Sequence (Trial) (Retired) */
export const LanguageCodeSequenceTrial = new DicomTag(0x0040, 0xA744);
/** (0040,A801) VR=SQ VM=1 Tabulated Values Sequence */
export const TabulatedValuesSequence = new DicomTag(0x0040, 0xA801);
/** (0040,A802) VR=UL VM=1 Number of Table Rows */
export const NumberOfTableRows = new DicomTag(0x0040, 0xA802);
/** (0040,A803) VR=UL VM=1 Number of Table Columns */
export const NumberOfTableColumns = new DicomTag(0x0040, 0xA803);
/** (0040,A804) VR=UL VM=1 Table Row Number */
export const TableRowNumber = new DicomTag(0x0040, 0xA804);
/** (0040,A805) VR=UL VM=1 Table Column Number */
export const TableColumnNumber = new DicomTag(0x0040, 0xA805);
/** (0040,A806) VR=SQ VM=1 Table Row Definition Sequence */
export const TableRowDefinitionSequence = new DicomTag(0x0040, 0xA806);
/** (0040,A807) VR=SQ VM=1 Table Column Definition Sequence */
export const TableColumnDefinitionSequence = new DicomTag(0x0040, 0xA807);
/** (0040,A808) VR=SQ VM=1 Cell Values Sequence */
export const CellValuesSequence = new DicomTag(0x0040, 0xA808);
/** (0040,A992) VR=ST VM=1 Uniform Resource Locator (Trial) (Retired) */
export const UniformResourceLocatorTrial = new DicomTag(0x0040, 0xA992);
/** (0040,B020) VR=SQ VM=1 Waveform Annotation Sequence */
export const WaveformAnnotationSequence = new DicomTag(0x0040, 0xB020);
/** (0040,B030) VR=SQ VM=1 Structured Waveform Annotation Sequence */
export const StructuredWaveformAnnotationSequence = new DicomTag(0x0040, 0xB030);
/** (0040,B031) VR=SQ VM=1 Waveform Annotation Display Selection Sequence */
export const WaveformAnnotationDisplaySelectionSequence = new DicomTag(0x0040, 0xB031);
/** (0040,B032) VR=US VM=1 Referenced Montage Index */
export const ReferencedMontageIndex = new DicomTag(0x0040, 0xB032);
/** (0040,B033) VR=SQ VM=1 Waveform Textual Annotation Sequence */
export const WaveformTextualAnnotationSequence = new DicomTag(0x0040, 0xB033);
/** (0040,B034) VR=DT VM=1 Annotation DateTime */
export const AnnotationDateTime = new DicomTag(0x0040, 0xB034);
/** (0040,B035) VR=SQ VM=1 Displayed Waveform Segment Sequence */
export const DisplayedWaveformSegmentSequence = new DicomTag(0x0040, 0xB035);
/** (0040,B036) VR=DT VM=1 Segment Definition DateTime */
export const SegmentDefinitionDateTime = new DicomTag(0x0040, 0xB036);
/** (0040,B037) VR=SQ VM=1 Montage Activation Sequence */
export const MontageActivationSequence = new DicomTag(0x0040, 0xB037);
/** (0040,B038) VR=DS VM=1 Montage Activation Time Offset */
export const MontageActivationTimeOffset = new DicomTag(0x0040, 0xB038);
/** (0040,B039) VR=SQ VM=1 Waveform Montage Sequence */
export const WaveformMontageSequence = new DicomTag(0x0040, 0xB039);
/** (0040,B03A) VR=IS VM=1 Referenced Montage Channel Number */
export const ReferencedMontageChannelNumber = new DicomTag(0x0040, 0xB03A);
/** (0040,B03B) VR=LT VM=1 Montage Name */
export const MontageName = new DicomTag(0x0040, 0xB03B);
/** (0040,B03C) VR=SQ VM=1 Montage Channel Sequence */
export const MontageChannelSequence = new DicomTag(0x0040, 0xB03C);
/** (0040,B03D) VR=US VM=1 Montage Index */
export const MontageIndex = new DicomTag(0x0040, 0xB03D);
/** (0040,B03E) VR=IS VM=1 Montage Channel Number */
export const MontageChannelNumber = new DicomTag(0x0040, 0xB03E);
/** (0040,B03F) VR=LO VM=1 Montage Channel Label */
export const MontageChannelLabel = new DicomTag(0x0040, 0xB03F);
/** (0040,B040) VR=SQ VM=1 Montage Channel Source Code Sequence */
export const MontageChannelSourceCodeSequence = new DicomTag(0x0040, 0xB040);
/** (0040,B041) VR=SQ VM=1 Contributing Channel Sources Sequence */
export const ContributingChannelSourcesSequence = new DicomTag(0x0040, 0xB041);
/** (0040,B042) VR=FL VM=1 Channel Weight */
export const ChannelWeight = new DicomTag(0x0040, 0xB042);
/** (0040,DB00) VR=CS VM=1 Template Identifier */
export const TemplateIdentifier = new DicomTag(0x0040, 0xDB00);
/** (0040,DB06) VR=DT VM=1 Template Version (Retired) */
export const TemplateVersion = new DicomTag(0x0040, 0xDB06);
/** (0040,DB07) VR=DT VM=1 Template Local Version (Retired) */
export const TemplateLocalVersion = new DicomTag(0x0040, 0xDB07);
/** (0040,DB0B) VR=CS VM=1 Template Extension Flag (Retired) */
export const TemplateExtensionFlag = new DicomTag(0x0040, 0xDB0B);
/** (0040,DB0C) VR=UI VM=1 Template Extension Organization UID (Retired) */
export const TemplateExtensionOrganizationUID = new DicomTag(0x0040, 0xDB0C);
/** (0040,DB0D) VR=UI VM=1 Template Extension Creator UID (Retired) */
export const TemplateExtensionCreatorUID = new DicomTag(0x0040, 0xDB0D);
/** (0040,DB73) VR=UL VM=1-n Referenced Content Item Identifier */
export const ReferencedContentItemIdentifier = new DicomTag(0x0040, 0xDB73);
/** (0040,E001) VR=ST VM=1 HL7 Instance Identifier */
export const HL7InstanceIdentifier = new DicomTag(0x0040, 0xE001);
/** (0040,E004) VR=DT VM=1 HL7 Document Effective Time */
export const HL7DocumentEffectiveTime = new DicomTag(0x0040, 0xE004);
/** (0040,E006) VR=SQ VM=1 HL7 Document Type Code Sequence */
export const HL7DocumentTypeCodeSequence = new DicomTag(0x0040, 0xE006);
/** (0040,E008) VR=SQ VM=1 Document Class Code Sequence */
export const DocumentClassCodeSequence = new DicomTag(0x0040, 0xE008);
/** (0040,E010) VR=UR VM=1 Retrieve URI */
export const RetrieveURI = new DicomTag(0x0040, 0xE010);
/** (0040,E011) VR=UI VM=1 Retrieve Location UID */
export const RetrieveLocationUID = new DicomTag(0x0040, 0xE011);
/** (0040,E020) VR=CS VM=1 Type of Instances */
export const TypeOfInstances = new DicomTag(0x0040, 0xE020);
/** (0040,E021) VR=SQ VM=1 DICOM Retrieval Sequence */
export const DICOMRetrievalSequence = new DicomTag(0x0040, 0xE021);
/** (0040,E022) VR=SQ VM=1 DICOM Media Retrieval Sequence */
export const DICOMMediaRetrievalSequence = new DicomTag(0x0040, 0xE022);
/** (0040,E023) VR=SQ VM=1 WADO Retrieval Sequence */
export const WADORetrievalSequence = new DicomTag(0x0040, 0xE023);
/** (0040,E024) VR=SQ VM=1 XDS Retrieval Sequence */
export const XDSRetrievalSequence = new DicomTag(0x0040, 0xE024);
/** (0040,E025) VR=SQ VM=1 WADO-RS Retrieval Sequence */
export const WADORSRetrievalSequence = new DicomTag(0x0040, 0xE025);
/** (0040,E030) VR=UI VM=1 Repository Unique ID */
export const RepositoryUniqueID = new DicomTag(0x0040, 0xE030);
/** (0040,E031) VR=UI VM=1 Home Community ID */
export const HomeCommunityID = new DicomTag(0x0040, 0xE031);
/** (0042,0010) VR=ST VM=1 Document Title */
export const DocumentTitle = new DicomTag(0x0042, 0x0010);
/** (0042,0011) VR=OB VM=1 Encapsulated Document */
export const EncapsulatedDocument = new DicomTag(0x0042, 0x0011);
/** (0042,0012) VR=LO VM=1 MIME Type of Encapsulated Document */
export const MIMETypeOfEncapsulatedDocument = new DicomTag(0x0042, 0x0012);
/** (0042,0013) VR=SQ VM=1 Source Instance Sequence */
export const SourceInstanceSequence = new DicomTag(0x0042, 0x0013);
/** (0042,0014) VR=LO VM=1-n List of MIME Types */
export const ListOfMIMETypes = new DicomTag(0x0042, 0x0014);
/** (0042,0015) VR=UL VM=1 Encapsulated Document Length */
export const EncapsulatedDocumentLength = new DicomTag(0x0042, 0x0015);
/** (0044,0001) VR=ST VM=1 Product Package Identifier */
export const ProductPackageIdentifier = new DicomTag(0x0044, 0x0001);
/** (0044,0002) VR=CS VM=1 Substance Administration Approval */
export const SubstanceAdministrationApproval = new DicomTag(0x0044, 0x0002);
/** (0044,0003) VR=LT VM=1 Approval Status Further Description */
export const ApprovalStatusFurtherDescription = new DicomTag(0x0044, 0x0003);
/** (0044,0004) VR=DT VM=1 Approval Status DateTime */
export const ApprovalStatusDateTime = new DicomTag(0x0044, 0x0004);
/** (0044,0007) VR=SQ VM=1 Product Type Code Sequence */
export const ProductTypeCodeSequence = new DicomTag(0x0044, 0x0007);
/** (0044,0008) VR=LO VM=1-n Product Name */
export const ProductName = new DicomTag(0x0044, 0x0008);
/** (0044,0009) VR=LT VM=1 Product Description */
export const ProductDescription = new DicomTag(0x0044, 0x0009);
/** (0044,000A) VR=LO VM=1 Product Lot Identifier */
export const ProductLotIdentifier = new DicomTag(0x0044, 0x000A);
/** (0044,000B) VR=DT VM=1 Product Expiration DateTime */
export const ProductExpirationDateTime = new DicomTag(0x0044, 0x000B);
/** (0044,0010) VR=DT VM=1 Substance Administration DateTime */
export const SubstanceAdministrationDateTime = new DicomTag(0x0044, 0x0010);
/** (0044,0011) VR=LO VM=1 Substance Administration Notes */
export const SubstanceAdministrationNotes = new DicomTag(0x0044, 0x0011);
/** (0044,0012) VR=LO VM=1 Substance Administration Device ID */
export const SubstanceAdministrationDeviceID = new DicomTag(0x0044, 0x0012);
/** (0044,0013) VR=SQ VM=1 Product Parameter Sequence */
export const ProductParameterSequence = new DicomTag(0x0044, 0x0013);
/** (0044,0019) VR=SQ VM=1 Substance Administration Parameter Sequence */
export const SubstanceAdministrationParameterSequence = new DicomTag(0x0044, 0x0019);
/** (0044,0100) VR=SQ VM=1 Approval Sequence */
export const ApprovalSequence = new DicomTag(0x0044, 0x0100);
/** (0044,0101) VR=SQ VM=1 Assertion Code Sequence */
export const AssertionCodeSequence = new DicomTag(0x0044, 0x0101);
/** (0044,0102) VR=UI VM=1 Assertion UID */
export const AssertionUID = new DicomTag(0x0044, 0x0102);
/** (0044,0103) VR=SQ VM=1 Asserter Identification Sequence */
export const AsserterIdentificationSequence = new DicomTag(0x0044, 0x0103);
/** (0044,0104) VR=DT VM=1 Assertion DateTime */
export const AssertionDateTime = new DicomTag(0x0044, 0x0104);
/** (0044,0105) VR=DT VM=1 Assertion Expiration DateTime */
export const AssertionExpirationDateTime = new DicomTag(0x0044, 0x0105);
/** (0044,0106) VR=UT VM=1 Assertion Comments */
export const AssertionComments = new DicomTag(0x0044, 0x0106);
/** (0044,0107) VR=SQ VM=1 Related Assertion Sequence */
export const RelatedAssertionSequence = new DicomTag(0x0044, 0x0107);
/** (0044,0108) VR=UI VM=1 Referenced Assertion UID */
export const ReferencedAssertionUID = new DicomTag(0x0044, 0x0108);
/** (0044,0109) VR=SQ VM=1 Approval Subject Sequence */
export const ApprovalSubjectSequence = new DicomTag(0x0044, 0x0109);
/** (0044,010A) VR=SQ VM=1 Organizational Role Code Sequence */
export const OrganizationalRoleCodeSequence = new DicomTag(0x0044, 0x010A);
/** (0044,0110) VR=SQ VM=1 RT Assertions Sequence */
export const RTAssertionsSequence = new DicomTag(0x0044, 0x0110);
/** (0046,0012) VR=LO VM=1 Lens Description */
export const LensDescription = new DicomTag(0x0046, 0x0012);
/** (0046,0014) VR=SQ VM=1 Right Lens Sequence */
export const RightLensSequence = new DicomTag(0x0046, 0x0014);
/** (0046,0015) VR=SQ VM=1 Left Lens Sequence */
export const LeftLensSequence = new DicomTag(0x0046, 0x0015);
/** (0046,0016) VR=SQ VM=1 Unspecified Laterality Lens Sequence */
export const UnspecifiedLateralityLensSequence = new DicomTag(0x0046, 0x0016);
/** (0046,0018) VR=SQ VM=1 Cylinder Sequence */
export const CylinderSequence = new DicomTag(0x0046, 0x0018);
/** (0046,0028) VR=SQ VM=1 Prism Sequence */
export const PrismSequence = new DicomTag(0x0046, 0x0028);
/** (0046,0030) VR=FD VM=1 Horizontal Prism Power */
export const HorizontalPrismPower = new DicomTag(0x0046, 0x0030);
/** (0046,0032) VR=CS VM=1 Horizontal Prism Base */
export const HorizontalPrismBase = new DicomTag(0x0046, 0x0032);
/** (0046,0034) VR=FD VM=1 Vertical Prism Power */
export const VerticalPrismPower = new DicomTag(0x0046, 0x0034);
/** (0046,0036) VR=CS VM=1 Vertical Prism Base */
export const VerticalPrismBase = new DicomTag(0x0046, 0x0036);
/** (0046,0038) VR=CS VM=1 Lens Segment Type */
export const LensSegmentType = new DicomTag(0x0046, 0x0038);
/** (0046,0040) VR=FD VM=1 Optical Transmittance */
export const OpticalTransmittance = new DicomTag(0x0046, 0x0040);
/** (0046,0042) VR=FD VM=1 Channel Width */
export const ChannelWidth = new DicomTag(0x0046, 0x0042);
/** (0046,0044) VR=FD VM=1 Pupil Size */
export const PupilSize = new DicomTag(0x0046, 0x0044);
/** (0046,0046) VR=FD VM=1 Corneal Size */
export const CornealSize = new DicomTag(0x0046, 0x0046);
/** (0046,0047) VR=SQ VM=1 Corneal Size Sequence */
export const CornealSizeSequence = new DicomTag(0x0046, 0x0047);
/** (0046,0050) VR=SQ VM=1 Autorefraction Right Eye Sequence */
export const AutorefractionRightEyeSequence = new DicomTag(0x0046, 0x0050);
/** (0046,0052) VR=SQ VM=1 Autorefraction Left Eye Sequence */
export const AutorefractionLeftEyeSequence = new DicomTag(0x0046, 0x0052);
/** (0046,0060) VR=FD VM=1 Distance Pupillary Distance */
export const DistancePupillaryDistance = new DicomTag(0x0046, 0x0060);
/** (0046,0062) VR=FD VM=1 Near Pupillary Distance */
export const NearPupillaryDistance = new DicomTag(0x0046, 0x0062);
/** (0046,0063) VR=FD VM=1 Intermediate Pupillary Distance */
export const IntermediatePupillaryDistance = new DicomTag(0x0046, 0x0063);
/** (0046,0064) VR=FD VM=1 Other Pupillary Distance */
export const OtherPupillaryDistance = new DicomTag(0x0046, 0x0064);
/** (0046,0070) VR=SQ VM=1 Keratometry Right Eye Sequence */
export const KeratometryRightEyeSequence = new DicomTag(0x0046, 0x0070);
/** (0046,0071) VR=SQ VM=1 Keratometry Left Eye Sequence */
export const KeratometryLeftEyeSequence = new DicomTag(0x0046, 0x0071);
/** (0046,0074) VR=SQ VM=1 Steep Keratometric Axis Sequence */
export const SteepKeratometricAxisSequence = new DicomTag(0x0046, 0x0074);
/** (0046,0075) VR=FD VM=1 Radius of Curvature */
export const RadiusOfCurvature = new DicomTag(0x0046, 0x0075);
/** (0046,0076) VR=FD VM=1 Keratometric Power */
export const KeratometricPower = new DicomTag(0x0046, 0x0076);
/** (0046,0077) VR=FD VM=1 Keratometric Axis */
export const KeratometricAxis = new DicomTag(0x0046, 0x0077);
/** (0046,0080) VR=SQ VM=1 Flat Keratometric Axis Sequence */
export const FlatKeratometricAxisSequence = new DicomTag(0x0046, 0x0080);
/** (0046,0092) VR=CS VM=1 Background Color */
export const BackgroundColor = new DicomTag(0x0046, 0x0092);
/** (0046,0094) VR=CS VM=1 Optotype */
export const Optotype = new DicomTag(0x0046, 0x0094);
/** (0046,0095) VR=CS VM=1 Optotype Presentation */
export const OptotypePresentation = new DicomTag(0x0046, 0x0095);
/** (0046,0097) VR=SQ VM=1 Subjective Refraction Right Eye Sequence */
export const SubjectiveRefractionRightEyeSequence = new DicomTag(0x0046, 0x0097);
/** (0046,0098) VR=SQ VM=1 Subjective Refraction Left Eye Sequence */
export const SubjectiveRefractionLeftEyeSequence = new DicomTag(0x0046, 0x0098);
/** (0046,0100) VR=SQ VM=1 Add Near Sequence */
export const AddNearSequence = new DicomTag(0x0046, 0x0100);
/** (0046,0101) VR=SQ VM=1 Add Intermediate Sequence */
export const AddIntermediateSequence = new DicomTag(0x0046, 0x0101);
/** (0046,0102) VR=SQ VM=1 Add Other Sequence */
export const AddOtherSequence = new DicomTag(0x0046, 0x0102);
/** (0046,0104) VR=FD VM=1 Add Power */
export const AddPower = new DicomTag(0x0046, 0x0104);
/** (0046,0106) VR=FD VM=1 Viewing Distance */
export const ViewingDistance = new DicomTag(0x0046, 0x0106);
/** (0046,0110) VR=SQ VM=1 Cornea Measurements Sequence */
export const CorneaMeasurementsSequence = new DicomTag(0x0046, 0x0110);
/** (0046,0111) VR=SQ VM=1 Source of Cornea Measurement Data Code Sequence */
export const SourceOfCorneaMeasurementDataCodeSequence = new DicomTag(0x0046, 0x0111);
/** (0046,0112) VR=SQ VM=1 Steep Corneal Axis Sequence */
export const SteepCornealAxisSequence = new DicomTag(0x0046, 0x0112);
/** (0046,0113) VR=SQ VM=1 Flat Corneal Axis Sequence */
export const FlatCornealAxisSequence = new DicomTag(0x0046, 0x0113);
/** (0046,0114) VR=FD VM=1 Corneal Power */
export const CornealPower = new DicomTag(0x0046, 0x0114);
/** (0046,0115) VR=FD VM=1 Corneal Axis */
export const CornealAxis = new DicomTag(0x0046, 0x0115);
/** (0046,0116) VR=SQ VM=1 Cornea Measurement Method Code Sequence */
export const CorneaMeasurementMethodCodeSequence = new DicomTag(0x0046, 0x0116);
/** (0046,0117) VR=FL VM=1 Refractive Index of Cornea */
export const RefractiveIndexOfCornea = new DicomTag(0x0046, 0x0117);
/** (0046,0118) VR=FL VM=1 Refractive Index of Aqueous Humor */
export const RefractiveIndexOfAqueousHumor = new DicomTag(0x0046, 0x0118);
/** (0046,0121) VR=SQ VM=1 Visual Acuity Type Code Sequence */
export const VisualAcuityTypeCodeSequence = new DicomTag(0x0046, 0x0121);
/** (0046,0122) VR=SQ VM=1 Visual Acuity Right Eye Sequence */
export const VisualAcuityRightEyeSequence = new DicomTag(0x0046, 0x0122);
/** (0046,0123) VR=SQ VM=1 Visual Acuity Left Eye Sequence */
export const VisualAcuityLeftEyeSequence = new DicomTag(0x0046, 0x0123);
/** (0046,0124) VR=SQ VM=1 Visual Acuity Both Eyes Open Sequence */
export const VisualAcuityBothEyesOpenSequence = new DicomTag(0x0046, 0x0124);
/** (0046,0125) VR=CS VM=1 Viewing Distance Type */
export const ViewingDistanceType = new DicomTag(0x0046, 0x0125);
/** (0046,0135) VR=SS VM=2 Visual Acuity Modifiers */
export const VisualAcuityModifiers = new DicomTag(0x0046, 0x0135);
/** (0046,0137) VR=FD VM=1 Decimal Visual Acuity */
export const DecimalVisualAcuity = new DicomTag(0x0046, 0x0137);
/** (0046,0139) VR=LO VM=1 Optotype Detailed Definition */
export const OptotypeDetailedDefinition = new DicomTag(0x0046, 0x0139);
/** (0046,0145) VR=SQ VM=1 Referenced Refractive Measurements Sequence */
export const ReferencedRefractiveMeasurementsSequence = new DicomTag(0x0046, 0x0145);
/** (0046,0146) VR=FD VM=1 Sphere Power */
export const SpherePower = new DicomTag(0x0046, 0x0146);
/** (0046,0147) VR=FD VM=1 Cylinder Power */
export const CylinderPower = new DicomTag(0x0046, 0x0147);
/** (0046,0201) VR=CS VM=1 Corneal Topography Surface */
export const CornealTopographySurface = new DicomTag(0x0046, 0x0201);
/** (0046,0202) VR=FL VM=2 Corneal Vertex Location */
export const CornealVertexLocation = new DicomTag(0x0046, 0x0202);
/** (0046,0203) VR=FL VM=1 Pupil Centroid X-Coordinate */
export const PupilCentroidXCoordinate = new DicomTag(0x0046, 0x0203);
/** (0046,0204) VR=FL VM=1 Pupil Centroid Y-Coordinate */
export const PupilCentroidYCoordinate = new DicomTag(0x0046, 0x0204);
/** (0046,0205) VR=FL VM=1 Equivalent Pupil Radius */
export const EquivalentPupilRadius = new DicomTag(0x0046, 0x0205);
/** (0046,0207) VR=SQ VM=1 Corneal Topography Map Type Code Sequence */
export const CornealTopographyMapTypeCodeSequence = new DicomTag(0x0046, 0x0207);
/** (0046,0208) VR=IS VM=2-2n Vertices of the Outline of Pupil */
export const VerticesOfTheOutlineOfPupil = new DicomTag(0x0046, 0x0208);
/** (0046,0210) VR=SQ VM=1 Corneal Topography Mapping Normals Sequence */
export const CornealTopographyMappingNormalsSequence = new DicomTag(0x0046, 0x0210);
/** (0046,0211) VR=SQ VM=1 Maximum Corneal Curvature Sequence */
export const MaximumCornealCurvatureSequence = new DicomTag(0x0046, 0x0211);
/** (0046,0212) VR=FL VM=1 Maximum Corneal Curvature */
export const MaximumCornealCurvature = new DicomTag(0x0046, 0x0212);
/** (0046,0213) VR=FL VM=2 Maximum Corneal Curvature Location */
export const MaximumCornealCurvatureLocation = new DicomTag(0x0046, 0x0213);
/** (0046,0215) VR=SQ VM=1 Minimum Keratometric Sequence */
export const MinimumKeratometricSequence = new DicomTag(0x0046, 0x0215);
/** (0046,0218) VR=SQ VM=1 Simulated Keratometric Cylinder Sequence */
export const SimulatedKeratometricCylinderSequence = new DicomTag(0x0046, 0x0218);
/** (0046,0220) VR=FL VM=1 Average Corneal Power */
export const AverageCornealPower = new DicomTag(0x0046, 0x0220);
/** (0046,0224) VR=FL VM=1 Corneal I-S Value */
export const CornealISValue = new DicomTag(0x0046, 0x0224);
/** (0046,0227) VR=FL VM=1 Analyzed Area */
export const AnalyzedArea = new DicomTag(0x0046, 0x0227);
/** (0046,0230) VR=FL VM=1 Surface Regularity Index */
export const SurfaceRegularityIndex = new DicomTag(0x0046, 0x0230);
/** (0046,0232) VR=FL VM=1 Surface Asymmetry Index */
export const SurfaceAsymmetryIndex = new DicomTag(0x0046, 0x0232);
/** (0046,0234) VR=FL VM=1 Corneal Eccentricity Index */
export const CornealEccentricityIndex = new DicomTag(0x0046, 0x0234);
/** (0046,0236) VR=FL VM=1 Keratoconus Prediction Index */
export const KeratoconusPredictionIndex = new DicomTag(0x0046, 0x0236);
/** (0046,0238) VR=FL VM=1 Decimal Potential Visual Acuity */
export const DecimalPotentialVisualAcuity = new DicomTag(0x0046, 0x0238);
/** (0046,0242) VR=CS VM=1 Corneal Topography Map Quality Evaluation */
export const CornealTopographyMapQualityEvaluation = new DicomTag(0x0046, 0x0242);
/** (0046,0244) VR=SQ VM=1 Source Image Corneal Processed Data Sequence */
export const SourceImageCornealProcessedDataSequence = new DicomTag(0x0046, 0x0244);
/** (0046,0247) VR=FL VM=3 Corneal Point Location */
export const CornealPointLocation = new DicomTag(0x0046, 0x0247);
/** (0046,0248) VR=CS VM=1 Corneal Point Estimated */
export const CornealPointEstimated = new DicomTag(0x0046, 0x0248);
/** (0046,0249) VR=FL VM=1 Axial Power */
export const AxialPower = new DicomTag(0x0046, 0x0249);
/** (0046,0250) VR=FL VM=1 Tangential Power */
export const TangentialPower = new DicomTag(0x0046, 0x0250);
/** (0046,0251) VR=FL VM=1 Refractive Power */
export const RefractivePower = new DicomTag(0x0046, 0x0251);
/** (0046,0252) VR=FL VM=1 Relative Elevation */
export const RelativeElevation = new DicomTag(0x0046, 0x0252);
/** (0046,0253) VR=FL VM=1 Corneal Wavefront */
export const CornealWavefront = new DicomTag(0x0046, 0x0253);
/** (0048,0001) VR=FL VM=1 Imaged Volume Width */
export const ImagedVolumeWidth = new DicomTag(0x0048, 0x0001);
/** (0048,0002) VR=FL VM=1 Imaged Volume Height */
export const ImagedVolumeHeight = new DicomTag(0x0048, 0x0002);
/** (0048,0003) VR=FL VM=1 Imaged Volume Depth */
export const ImagedVolumeDepth = new DicomTag(0x0048, 0x0003);
/** (0048,0006) VR=UL VM=1 Total Pixel Matrix Columns */
export const TotalPixelMatrixColumns = new DicomTag(0x0048, 0x0006);
/** (0048,0007) VR=UL VM=1 Total Pixel Matrix Rows */
export const TotalPixelMatrixRows = new DicomTag(0x0048, 0x0007);
/** (0048,0008) VR=SQ VM=1 Total Pixel Matrix Origin Sequence */
export const TotalPixelMatrixOriginSequence = new DicomTag(0x0048, 0x0008);
/** (0048,0010) VR=CS VM=1 Specimen Label in Image */
export const SpecimenLabelInImage = new DicomTag(0x0048, 0x0010);
/** (0048,0011) VR=CS VM=1 Focus Method */
export const FocusMethod = new DicomTag(0x0048, 0x0011);
/** (0048,0012) VR=CS VM=1 Extended Depth of Field */
export const ExtendedDepthOfField = new DicomTag(0x0048, 0x0012);
/** (0048,0013) VR=US VM=1 Number of Focal Planes */
export const NumberOfFocalPlanes = new DicomTag(0x0048, 0x0013);
/** (0048,0014) VR=FL VM=1 Distance Between Focal Planes */
export const DistanceBetweenFocalPlanes = new DicomTag(0x0048, 0x0014);
/** (0048,0015) VR=US VM=3 Recommended Absent Pixel CIELab Value */
export const RecommendedAbsentPixelCIELabValue = new DicomTag(0x0048, 0x0015);
/** (0048,0100) VR=SQ VM=1 Illuminator Type Code Sequence */
export const IlluminatorTypeCodeSequence = new DicomTag(0x0048, 0x0100);
/** (0048,0102) VR=DS VM=6 Image Orientation (Slide) */
export const ImageOrientationSlide = new DicomTag(0x0048, 0x0102);
/** (0048,0105) VR=SQ VM=1 Optical Path Sequence */
export const OpticalPathSequence = new DicomTag(0x0048, 0x0105);
/** (0048,0106) VR=SH VM=1 Optical Path Identifier */
export const OpticalPathIdentifier = new DicomTag(0x0048, 0x0106);
/** (0048,0107) VR=ST VM=1 Optical Path Description */
export const OpticalPathDescription = new DicomTag(0x0048, 0x0107);
/** (0048,0108) VR=SQ VM=1 Illumination Color Code Sequence */
export const IlluminationColorCodeSequence = new DicomTag(0x0048, 0x0108);
/** (0048,0110) VR=SQ VM=1 Specimen Reference Sequence */
export const SpecimenReferenceSequence = new DicomTag(0x0048, 0x0110);
/** (0048,0111) VR=DS VM=1 Condenser Lens Power */
export const CondenserLensPower = new DicomTag(0x0048, 0x0111);
/** (0048,0112) VR=DS VM=1 Objective Lens Power */
export const ObjectiveLensPower = new DicomTag(0x0048, 0x0112);
/** (0048,0113) VR=DS VM=1 Objective Lens Numerical Aperture */
export const ObjectiveLensNumericalAperture = new DicomTag(0x0048, 0x0113);
/** (0048,0114) VR=CS VM=1 Confocal Mode */
export const ConfocalMode = new DicomTag(0x0048, 0x0114);
/** (0048,0115) VR=CS VM=1 Tissue Location */
export const TissueLocation = new DicomTag(0x0048, 0x0115);
/** (0048,0116) VR=SQ VM=1 Confocal Microscopy Image Frame Type Sequence */
export const ConfocalMicroscopyImageFrameTypeSequence = new DicomTag(0x0048, 0x0116);
/** (0048,0117) VR=FD VM=1 Image Acquisition Depth */
export const ImageAcquisitionDepth = new DicomTag(0x0048, 0x0117);
/** (0048,0120) VR=SQ VM=1 Palette Color Lookup Table Sequence */
export const PaletteColorLookupTableSequence = new DicomTag(0x0048, 0x0120);
/** (0048,0200) VR=SQ VM=1 Referenced Image Navigation Sequence (Retired) */
export const ReferencedImageNavigationSequence = new DicomTag(0x0048, 0x0200);
/** (0048,0201) VR=US VM=2 Top Left Hand Corner of Localizer Area (Retired) */
export const TopLeftHandCornerOfLocalizerArea = new DicomTag(0x0048, 0x0201);
/** (0048,0202) VR=US VM=2 Bottom Right Hand Corner of Localizer Area (Retired) */
export const BottomRightHandCornerOfLocalizerArea = new DicomTag(0x0048, 0x0202);
/** (0048,0207) VR=SQ VM=1 Optical Path Identification Sequence */
export const OpticalPathIdentificationSequence = new DicomTag(0x0048, 0x0207);
/** (0048,021A) VR=SQ VM=1 Plane Position (Slide) Sequence */
export const PlanePositionSlideSequence = new DicomTag(0x0048, 0x021A);
/** (0048,021E) VR=SL VM=1 Column Position In Total Image Pixel Matrix */
export const ColumnPositionInTotalImagePixelMatrix = new DicomTag(0x0048, 0x021E);
/** (0048,021F) VR=SL VM=1 Row Position In Total Image Pixel Matrix */
export const RowPositionInTotalImagePixelMatrix = new DicomTag(0x0048, 0x021F);
/** (0048,0301) VR=CS VM=1 Pixel Origin Interpretation */
export const PixelOriginInterpretation = new DicomTag(0x0048, 0x0301);
/** (0048,0302) VR=UL VM=1 Number of Optical Paths */
export const NumberOfOpticalPaths = new DicomTag(0x0048, 0x0302);
/** (0048,0303) VR=UL VM=1 Total Pixel Matrix Focal Planes */
export const TotalPixelMatrixFocalPlanes = new DicomTag(0x0048, 0x0303);
/** (0048,0304) VR=CS VM=1 Tiles Overlap */
export const TilesOverlap = new DicomTag(0x0048, 0x0304);
/** (0050,0004) VR=CS VM=1 Calibration Image */
export const CalibrationImage = new DicomTag(0x0050, 0x0004);
/** (0050,0010) VR=SQ VM=1 Device Sequence */
export const DeviceSequence = new DicomTag(0x0050, 0x0010);
/** (0050,0012) VR=SQ VM=1 Container Component Type Code Sequence */
export const ContainerComponentTypeCodeSequence = new DicomTag(0x0050, 0x0012);
/** (0050,0013) VR=FD VM=1 Container Component Thickness */
export const ContainerComponentThickness = new DicomTag(0x0050, 0x0013);
/** (0050,0014) VR=DS VM=1 Device Length */
export const DeviceLength = new DicomTag(0x0050, 0x0014);
/** (0050,0015) VR=FD VM=1 Container Component Width */
export const ContainerComponentWidth = new DicomTag(0x0050, 0x0015);
/** (0050,0016) VR=DS VM=1 Device Diameter */
export const DeviceDiameter = new DicomTag(0x0050, 0x0016);
/** (0050,0017) VR=CS VM=1 Device Diameter Units */
export const DeviceDiameterUnits = new DicomTag(0x0050, 0x0017);
/** (0050,0018) VR=DS VM=1 Device Volume */
export const DeviceVolume = new DicomTag(0x0050, 0x0018);
/** (0050,0019) VR=DS VM=1 Inter-Marker Distance */
export const InterMarkerDistance = new DicomTag(0x0050, 0x0019);
/** (0050,001A) VR=CS VM=1 Container Component Material */
export const ContainerComponentMaterial = new DicomTag(0x0050, 0x001A);
/** (0050,001B) VR=LO VM=1 Container Component ID */
export const ContainerComponentID = new DicomTag(0x0050, 0x001B);
/** (0050,001C) VR=FD VM=1 Container Component Length */
export const ContainerComponentLength = new DicomTag(0x0050, 0x001C);
/** (0050,001D) VR=FD VM=1 Container Component Diameter */
export const ContainerComponentDiameter = new DicomTag(0x0050, 0x001D);
/** (0050,001E) VR=LO VM=1 Container Component Description */
export const ContainerComponentDescription = new DicomTag(0x0050, 0x001E);
/** (0050,0020) VR=LO VM=1 Device Description */
export const DeviceDescription = new DicomTag(0x0050, 0x0020);
/** (0050,0021) VR=ST VM=1 Long Device Description */
export const LongDeviceDescription = new DicomTag(0x0050, 0x0021);
/** (0052,0001) VR=FL VM=1 Contrast/Bolus Ingredient Percent by Volume */
export const ContrastBolusIngredientPercentByVolume = new DicomTag(0x0052, 0x0001);
/** (0052,0002) VR=FD VM=1 OCT Focal Distance */
export const OCTFocalDistance = new DicomTag(0x0052, 0x0002);
/** (0052,0003) VR=FD VM=1 Beam Spot Size */
export const BeamSpotSize = new DicomTag(0x0052, 0x0003);
/** (0052,0004) VR=FD VM=1 Effective Refractive Index */
export const EffectiveRefractiveIndex = new DicomTag(0x0052, 0x0004);
/** (0052,0006) VR=CS VM=1 OCT Acquisition Domain */
export const OCTAcquisitionDomain = new DicomTag(0x0052, 0x0006);
/** (0052,0007) VR=FD VM=1 OCT Optical Center Wavelength */
export const OCTOpticalCenterWavelength = new DicomTag(0x0052, 0x0007);
/** (0052,0008) VR=FD VM=1 Axial Resolution */
export const AxialResolution = new DicomTag(0x0052, 0x0008);
/** (0052,0009) VR=FD VM=1 Ranging Depth */
export const RangingDepth = new DicomTag(0x0052, 0x0009);
/** (0052,0011) VR=FD VM=1 A-line Rate */
export const ALineRate = new DicomTag(0x0052, 0x0011);
/** (0052,0012) VR=US VM=1 A-lines Per Frame */
export const ALinesPerFrame = new DicomTag(0x0052, 0x0012);
/** (0052,0013) VR=FD VM=1 Catheter Rotational Rate */
export const CatheterRotationalRate = new DicomTag(0x0052, 0x0013);
/** (0052,0014) VR=FD VM=1 A-line Pixel Spacing */
export const ALinePixelSpacing = new DicomTag(0x0052, 0x0014);
/** (0052,0016) VR=SQ VM=1 Mode of Percutaneous Access Sequence */
export const ModeOfPercutaneousAccessSequence = new DicomTag(0x0052, 0x0016);
/** (0052,0025) VR=SQ VM=1 Intravascular OCT Frame Type Sequence */
export const IntravascularOCTFrameTypeSequence = new DicomTag(0x0052, 0x0025);
/** (0052,0026) VR=CS VM=1 OCT Z Offset Applied */
export const OCTZOffsetApplied = new DicomTag(0x0052, 0x0026);
/** (0052,0027) VR=SQ VM=1 Intravascular Frame Content Sequence */
export const IntravascularFrameContentSequence = new DicomTag(0x0052, 0x0027);
/** (0052,0028) VR=FD VM=1 Intravascular Longitudinal Distance */
export const IntravascularLongitudinalDistance = new DicomTag(0x0052, 0x0028);
/** (0052,0029) VR=SQ VM=1 Intravascular OCT Frame Content Sequence */
export const IntravascularOCTFrameContentSequence = new DicomTag(0x0052, 0x0029);
/** (0052,0030) VR=SS VM=1 OCT Z Offset Correction */
export const OCTZOffsetCorrection = new DicomTag(0x0052, 0x0030);
/** (0052,0031) VR=CS VM=1 Catheter Direction of Rotation */
export const CatheterDirectionOfRotation = new DicomTag(0x0052, 0x0031);
/** (0052,0033) VR=FD VM=1 Seam Line Location */
export const SeamLineLocation = new DicomTag(0x0052, 0x0033);
/** (0052,0034) VR=FD VM=1 First A-line Location */
export const FirstALineLocation = new DicomTag(0x0052, 0x0034);
/** (0052,0036) VR=US VM=1 Seam Line Index */
export const SeamLineIndex = new DicomTag(0x0052, 0x0036);
/** (0052,0038) VR=US VM=1 Number of Padded A-lines */
export const NumberOfPaddedALines = new DicomTag(0x0052, 0x0038);
/** (0052,0039) VR=CS VM=1 Interpolation Type */
export const InterpolationType = new DicomTag(0x0052, 0x0039);
/** (0052,003A) VR=CS VM=1 Refractive Index Applied */
export const RefractiveIndexApplied = new DicomTag(0x0052, 0x003A);
/** (0054,0010) VR=US VM=1-n Energy Window Vector */
export const EnergyWindowVector = new DicomTag(0x0054, 0x0010);
/** (0054,0011) VR=US VM=1 Number of Energy Windows */
export const NumberOfEnergyWindows = new DicomTag(0x0054, 0x0011);
/** (0054,0012) VR=SQ VM=1 Energy Window Information Sequence */
export const EnergyWindowInformationSequence = new DicomTag(0x0054, 0x0012);
/** (0054,0013) VR=SQ VM=1 Energy Window Range Sequence */
export const EnergyWindowRangeSequence = new DicomTag(0x0054, 0x0013);
/** (0054,0014) VR=DS VM=1 Energy Window Lower Limit */
export const EnergyWindowLowerLimit = new DicomTag(0x0054, 0x0014);
/** (0054,0015) VR=DS VM=1 Energy Window Upper Limit */
export const EnergyWindowUpperLimit = new DicomTag(0x0054, 0x0015);
/** (0054,0016) VR=SQ VM=1 Radiopharmaceutical Information Sequence */
export const RadiopharmaceuticalInformationSequence = new DicomTag(0x0054, 0x0016);
/** (0054,0017) VR=IS VM=1 Residual Syringe Counts */
export const ResidualSyringeCounts = new DicomTag(0x0054, 0x0017);
/** (0054,0018) VR=SH VM=1 Energy Window Name */
export const EnergyWindowName = new DicomTag(0x0054, 0x0018);
/** (0054,0020) VR=US VM=1-n Detector Vector */
export const DetectorVector = new DicomTag(0x0054, 0x0020);
/** (0054,0021) VR=US VM=1 Number of Detectors */
export const NumberOfDetectors = new DicomTag(0x0054, 0x0021);
/** (0054,0022) VR=SQ VM=1 Detector Information Sequence */
export const DetectorInformationSequence = new DicomTag(0x0054, 0x0022);
/** (0054,0030) VR=US VM=1-n Phase Vector */
export const PhaseVector = new DicomTag(0x0054, 0x0030);
/** (0054,0031) VR=US VM=1 Number of Phases */
export const NumberOfPhases = new DicomTag(0x0054, 0x0031);
/** (0054,0032) VR=SQ VM=1 Phase Information Sequence */
export const PhaseInformationSequence = new DicomTag(0x0054, 0x0032);
/** (0054,0033) VR=US VM=1 Number of Frames in Phase */
export const NumberOfFramesInPhase = new DicomTag(0x0054, 0x0033);
/** (0054,0036) VR=IS VM=1 Phase Delay */
export const PhaseDelay = new DicomTag(0x0054, 0x0036);
/** (0054,0038) VR=IS VM=1 Pause Between Frames */
export const PauseBetweenFrames = new DicomTag(0x0054, 0x0038);
/** (0054,0039) VR=CS VM=1 Phase Description */
export const PhaseDescription = new DicomTag(0x0054, 0x0039);
/** (0054,0050) VR=US VM=1-n Rotation Vector */
export const RotationVector = new DicomTag(0x0054, 0x0050);
/** (0054,0051) VR=US VM=1 Number of Rotations */
export const NumberOfRotations = new DicomTag(0x0054, 0x0051);
/** (0054,0052) VR=SQ VM=1 Rotation Information Sequence */
export const RotationInformationSequence = new DicomTag(0x0054, 0x0052);
/** (0054,0053) VR=US VM=1 Number of Frames in Rotation */
export const NumberOfFramesInRotation = new DicomTag(0x0054, 0x0053);
/** (0054,0060) VR=US VM=1-n R-R Interval Vector */
export const RRIntervalVector = new DicomTag(0x0054, 0x0060);
/** (0054,0061) VR=US VM=1 Number of R-R Intervals */
export const NumberOfRRIntervals = new DicomTag(0x0054, 0x0061);
/** (0054,0062) VR=SQ VM=1 Gated Information Sequence */
export const GatedInformationSequence = new DicomTag(0x0054, 0x0062);
/** (0054,0063) VR=SQ VM=1 Data Information Sequence */
export const DataInformationSequence = new DicomTag(0x0054, 0x0063);
/** (0054,0070) VR=US VM=1-n Time Slot Vector */
export const TimeSlotVector = new DicomTag(0x0054, 0x0070);
/** (0054,0071) VR=US VM=1 Number of Time Slots */
export const NumberOfTimeSlots = new DicomTag(0x0054, 0x0071);
/** (0054,0072) VR=SQ VM=1 Time Slot Information Sequence */
export const TimeSlotInformationSequence = new DicomTag(0x0054, 0x0072);
/** (0054,0073) VR=DS VM=1 Time Slot Time */
export const TimeSlotTime = new DicomTag(0x0054, 0x0073);
/** (0054,0080) VR=US VM=1-n Slice Vector */
export const SliceVector = new DicomTag(0x0054, 0x0080);
/** (0054,0081) VR=US VM=1 Number of Slices */
export const NumberOfSlices = new DicomTag(0x0054, 0x0081);
/** (0054,0090) VR=US VM=1-n Angular View Vector */
export const AngularViewVector = new DicomTag(0x0054, 0x0090);
/** (0054,0100) VR=US VM=1-n Time Slice Vector */
export const TimeSliceVector = new DicomTag(0x0054, 0x0100);
/** (0054,0101) VR=US VM=1 Number of Time Slices */
export const NumberOfTimeSlices = new DicomTag(0x0054, 0x0101);
/** (0054,0200) VR=DS VM=1 Start Angle */
export const StartAngle = new DicomTag(0x0054, 0x0200);
/** (0054,0202) VR=CS VM=1 Type of Detector Motion */
export const TypeOfDetectorMotion = new DicomTag(0x0054, 0x0202);
/** (0054,0210) VR=IS VM=1-n Trigger Vector */
export const TriggerVector = new DicomTag(0x0054, 0x0210);
/** (0054,0211) VR=US VM=1 Number of Triggers in Phase */
export const NumberOfTriggersInPhase = new DicomTag(0x0054, 0x0211);
/** (0054,0220) VR=SQ VM=1 View Code Sequence */
export const ViewCodeSequence = new DicomTag(0x0054, 0x0220);
/** (0054,0222) VR=SQ VM=1 View Modifier Code Sequence */
export const ViewModifierCodeSequence = new DicomTag(0x0054, 0x0222);
/** (0054,0300) VR=SQ VM=1 Radionuclide Code Sequence */
export const RadionuclideCodeSequence = new DicomTag(0x0054, 0x0300);
/** (0054,0302) VR=SQ VM=1 Administration Route Code Sequence */
export const AdministrationRouteCodeSequence = new DicomTag(0x0054, 0x0302);
/** (0054,0304) VR=SQ VM=1 Radiopharmaceutical Code Sequence */
export const RadiopharmaceuticalCodeSequence = new DicomTag(0x0054, 0x0304);
/** (0054,0306) VR=SQ VM=1 Calibration Data Sequence */
export const CalibrationDataSequence = new DicomTag(0x0054, 0x0306);
/** (0054,0308) VR=US VM=1 Energy Window Number */
export const EnergyWindowNumber = new DicomTag(0x0054, 0x0308);
/** (0054,0400) VR=SH VM=1 Image ID */
export const ImageID = new DicomTag(0x0054, 0x0400);
/** (0054,0410) VR=SQ VM=1 Patient Orientation Code Sequence */
export const PatientOrientationCodeSequence = new DicomTag(0x0054, 0x0410);
/** (0054,0412) VR=SQ VM=1 Patient Orientation Modifier Code Sequence */
export const PatientOrientationModifierCodeSequence = new DicomTag(0x0054, 0x0412);
/** (0054,0414) VR=SQ VM=1 Patient Gantry Relationship Code Sequence */
export const PatientGantryRelationshipCodeSequence = new DicomTag(0x0054, 0x0414);
/** (0054,0500) VR=CS VM=1 Slice Progression Direction */
export const SliceProgressionDirection = new DicomTag(0x0054, 0x0500);
/** (0054,0501) VR=CS VM=1 Scan Progression Direction */
export const ScanProgressionDirection = new DicomTag(0x0054, 0x0501);
/** (0054,1000) VR=CS VM=2 Series Type */
export const SeriesType = new DicomTag(0x0054, 0x1000);
/** (0054,1001) VR=CS VM=1 Units */
export const Units = new DicomTag(0x0054, 0x1001);
/** (0054,1002) VR=CS VM=1 Counts Source */
export const CountsSource = new DicomTag(0x0054, 0x1002);
/** (0054,1004) VR=CS VM=1 Reprojection Method */
export const ReprojectionMethod = new DicomTag(0x0054, 0x1004);
/** (0054,1006) VR=CS VM=1 SUV Type */
export const SUVType = new DicomTag(0x0054, 0x1006);
/** (0054,1100) VR=CS VM=1 Randoms Correction Method */
export const RandomsCorrectionMethod = new DicomTag(0x0054, 0x1100);
/** (0054,1101) VR=LO VM=1 Attenuation Correction Method */
export const AttenuationCorrectionMethod = new DicomTag(0x0054, 0x1101);
/** (0054,1102) VR=CS VM=1 Decay Correction */
export const DecayCorrection = new DicomTag(0x0054, 0x1102);
/** (0054,1103) VR=LO VM=1 Reconstruction Method */
export const ReconstructionMethod = new DicomTag(0x0054, 0x1103);
/** (0054,1104) VR=LO VM=1 Detector Lines of Response Used */
export const DetectorLinesOfResponseUsed = new DicomTag(0x0054, 0x1104);
/** (0054,1105) VR=LO VM=1 Scatter Correction Method */
export const ScatterCorrectionMethod = new DicomTag(0x0054, 0x1105);
/** (0054,1200) VR=DS VM=1 Axial Acceptance */
export const AxialAcceptance = new DicomTag(0x0054, 0x1200);
/** (0054,1201) VR=IS VM=2 Axial Mash */
export const AxialMash = new DicomTag(0x0054, 0x1201);
/** (0054,1202) VR=IS VM=1 Transverse Mash */
export const TransverseMash = new DicomTag(0x0054, 0x1202);
/** (0054,1203) VR=DS VM=2 Detector Element Size */
export const DetectorElementSize = new DicomTag(0x0054, 0x1203);
/** (0054,1210) VR=DS VM=1 Coincidence Window Width */
export const CoincidenceWindowWidth = new DicomTag(0x0054, 0x1210);
/** (0054,1220) VR=CS VM=1-n Secondary Counts Type */
export const SecondaryCountsType = new DicomTag(0x0054, 0x1220);
/** (0054,1300) VR=DS VM=1 Frame Reference Time */
export const FrameReferenceTime = new DicomTag(0x0054, 0x1300);
/** (0054,1310) VR=IS VM=1 Primary (Prompts) Counts Accumulated */
export const PrimaryPromptsCountsAccumulated = new DicomTag(0x0054, 0x1310);
/** (0054,1311) VR=IS VM=1-n Secondary Counts Accumulated */
export const SecondaryCountsAccumulated = new DicomTag(0x0054, 0x1311);
/** (0054,1320) VR=DS VM=1 Slice Sensitivity Factor */
export const SliceSensitivityFactor = new DicomTag(0x0054, 0x1320);
/** (0054,1321) VR=DS VM=1 Decay Factor */
export const DecayFactor = new DicomTag(0x0054, 0x1321);
/** (0054,1322) VR=DS VM=1 Dose Calibration Factor */
export const DoseCalibrationFactor = new DicomTag(0x0054, 0x1322);
/** (0054,1323) VR=DS VM=1 Scatter Fraction Factor */
export const ScatterFractionFactor = new DicomTag(0x0054, 0x1323);
/** (0054,1324) VR=DS VM=1 Dead Time Factor */
export const DeadTimeFactor = new DicomTag(0x0054, 0x1324);
/** (0054,1330) VR=US VM=1 Image Index */
export const ImageIndex = new DicomTag(0x0054, 0x1330);
/** (0054,1400) VR=CS VM=1-n Counts Included (Retired) */
export const CountsIncluded = new DicomTag(0x0054, 0x1400);
/** (0054,1401) VR=CS VM=1 Dead Time Correction Flag (Retired) */
export const DeadTimeCorrectionFlag = new DicomTag(0x0054, 0x1401);
/** (0060,3000) VR=SQ VM=1 Histogram Sequence */
export const HistogramSequence = new DicomTag(0x0060, 0x3000);
/** (0060,3002) VR=US VM=1 Histogram Number of Bins */
export const HistogramNumberOfBins = new DicomTag(0x0060, 0x3002);
/** (0060,3004) VR=US/SS VM=1 Histogram First Bin Value */
export const HistogramFirstBinValue = new DicomTag(0x0060, 0x3004);
/** (0060,3006) VR=US/SS VM=1 Histogram Last Bin Value */
export const HistogramLastBinValue = new DicomTag(0x0060, 0x3006);
/** (0060,3008) VR=US VM=1 Histogram Bin Width */
export const HistogramBinWidth = new DicomTag(0x0060, 0x3008);
/** (0060,3010) VR=LO VM=1 Histogram Explanation */
export const HistogramExplanation = new DicomTag(0x0060, 0x3010);
/** (0060,3020) VR=UL VM=1-n Histogram Data */
export const HistogramData = new DicomTag(0x0060, 0x3020);
/** (0062,0001) VR=CS VM=1 Segmentation Type */
export const SegmentationType = new DicomTag(0x0062, 0x0001);
/** (0062,0002) VR=SQ VM=1 Segment Sequence */
export const SegmentSequence = new DicomTag(0x0062, 0x0002);
/** (0062,0003) VR=SQ VM=1 Segmented Property Category Code Sequence */
export const SegmentedPropertyCategoryCodeSequence = new DicomTag(0x0062, 0x0003);
/** (0062,0004) VR=US VM=1 Segment Number */
export const SegmentNumber = new DicomTag(0x0062, 0x0004);
/** (0062,0005) VR=LO VM=1 Segment Label */
export const SegmentLabel = new DicomTag(0x0062, 0x0005);
/** (0062,0006) VR=ST VM=1 Segment Description */
export const SegmentDescription = new DicomTag(0x0062, 0x0006);
/** (0062,0007) VR=SQ VM=1 Segmentation Algorithm Identification Sequence */
export const SegmentationAlgorithmIdentificationSequence = new DicomTag(0x0062, 0x0007);
/** (0062,0008) VR=CS VM=1 Segment Algorithm Type */
export const SegmentAlgorithmType = new DicomTag(0x0062, 0x0008);
/** (0062,0009) VR=LO VM=1-n Segment Algorithm Name */
export const SegmentAlgorithmName = new DicomTag(0x0062, 0x0009);
/** (0062,000A) VR=SQ VM=1 Segment Identification Sequence */
export const SegmentIdentificationSequence = new DicomTag(0x0062, 0x000A);
/** (0062,000B) VR=US VM=1-n Referenced Segment Number */
export const ReferencedSegmentNumber = new DicomTag(0x0062, 0x000B);
/** (0062,000C) VR=US VM=1 Recommended Display Grayscale Value */
export const RecommendedDisplayGrayscaleValue = new DicomTag(0x0062, 0x000C);
/** (0062,000D) VR=US VM=3 Recommended Display CIELab Value */
export const RecommendedDisplayCIELabValue = new DicomTag(0x0062, 0x000D);
/** (0062,000E) VR=US VM=1 Maximum Fractional Value */
export const MaximumFractionalValue = new DicomTag(0x0062, 0x000E);
/** (0062,000F) VR=SQ VM=1 Segmented Property Type Code Sequence */
export const SegmentedPropertyTypeCodeSequence = new DicomTag(0x0062, 0x000F);
/** (0062,0010) VR=CS VM=1 Segmentation Fractional Type */
export const SegmentationFractionalType = new DicomTag(0x0062, 0x0010);
/** (0062,0011) VR=SQ VM=1 Segmented Property Type Modifier Code Sequence */
export const SegmentedPropertyTypeModifierCodeSequence = new DicomTag(0x0062, 0x0011);
/** (0062,0012) VR=SQ VM=1 Used Segments Sequence */
export const UsedSegmentsSequence = new DicomTag(0x0062, 0x0012);
/** (0062,0013) VR=CS VM=1 Segments Overlap */
export const SegmentsOverlap = new DicomTag(0x0062, 0x0013);
/** (0062,0020) VR=UT VM=1 Tracking ID */
export const TrackingID = new DicomTag(0x0062, 0x0020);
/** (0062,0021) VR=UI VM=1 Tracking UID */
export const TrackingUID = new DicomTag(0x0062, 0x0021);
/** (0064,0002) VR=SQ VM=1 Deformable Registration Sequence */
export const DeformableRegistrationSequence = new DicomTag(0x0064, 0x0002);
/** (0064,0003) VR=UI VM=1 Source Frame of Reference UID */
export const SourceFrameOfReferenceUID = new DicomTag(0x0064, 0x0003);
/** (0064,0005) VR=SQ VM=1 Deformable Registration Grid Sequence */
export const DeformableRegistrationGridSequence = new DicomTag(0x0064, 0x0005);
/** (0064,0007) VR=UL VM=3 Grid Dimensions */
export const GridDimensions = new DicomTag(0x0064, 0x0007);
/** (0064,0008) VR=FD VM=3 Grid Resolution */
export const GridResolution = new DicomTag(0x0064, 0x0008);
/** (0064,0009) VR=OF VM=1 Vector Grid Data */
export const VectorGridData = new DicomTag(0x0064, 0x0009);
/** (0064,000F) VR=SQ VM=1 Pre Deformation Matrix Registration Sequence */
export const PreDeformationMatrixRegistrationSequence = new DicomTag(0x0064, 0x000F);
/** (0064,0010) VR=SQ VM=1 Post Deformation Matrix Registration Sequence */
export const PostDeformationMatrixRegistrationSequence = new DicomTag(0x0064, 0x0010);
/** (0066,0001) VR=UL VM=1 Number of Surfaces */
export const NumberOfSurfaces = new DicomTag(0x0066, 0x0001);
/** (0066,0002) VR=SQ VM=1 Surface Sequence */
export const SurfaceSequence = new DicomTag(0x0066, 0x0002);
/** (0066,0003) VR=UL VM=1 Surface Number */
export const SurfaceNumber = new DicomTag(0x0066, 0x0003);
/** (0066,0004) VR=LT VM=1 Surface Comments */
export const SurfaceComments = new DicomTag(0x0066, 0x0004);
/** (0066,0005) VR=FL VM=1 Surface Offset */
export const SurfaceOffset = new DicomTag(0x0066, 0x0005);
/** (0066,0009) VR=CS VM=1 Surface Processing */
export const SurfaceProcessing = new DicomTag(0x0066, 0x0009);
/** (0066,000A) VR=FL VM=1 Surface Processing Ratio */
export const SurfaceProcessingRatio = new DicomTag(0x0066, 0x000A);
/** (0066,000B) VR=LO VM=1 Surface Processing Description */
export const SurfaceProcessingDescription = new DicomTag(0x0066, 0x000B);
/** (0066,000C) VR=FL VM=1 Recommended Presentation Opacity */
export const RecommendedPresentationOpacity = new DicomTag(0x0066, 0x000C);
/** (0066,000D) VR=CS VM=1 Recommended Presentation Type */
export const RecommendedPresentationType = new DicomTag(0x0066, 0x000D);
/** (0066,000E) VR=CS VM=1 Finite Volume */
export const FiniteVolume = new DicomTag(0x0066, 0x000E);
/** (0066,0010) VR=CS VM=1 Manifold */
export const Manifold = new DicomTag(0x0066, 0x0010);
/** (0066,0011) VR=SQ VM=1 Surface Points Sequence */
export const SurfacePointsSequence = new DicomTag(0x0066, 0x0011);
/** (0066,0012) VR=SQ VM=1 Surface Points Normals Sequence */
export const SurfacePointsNormalsSequence = new DicomTag(0x0066, 0x0012);
/** (0066,0013) VR=SQ VM=1 Surface Mesh Primitives Sequence */
export const SurfaceMeshPrimitivesSequence = new DicomTag(0x0066, 0x0013);
/** (0066,0015) VR=UL VM=1 Number of Surface Points */
export const NumberOfSurfacePoints = new DicomTag(0x0066, 0x0015);
/** (0066,0016) VR=OF VM=1 Point Coordinates Data */
export const PointCoordinatesData = new DicomTag(0x0066, 0x0016);
/** (0066,0017) VR=FL VM=3 Point Position Accuracy */
export const PointPositionAccuracy = new DicomTag(0x0066, 0x0017);
/** (0066,0018) VR=FL VM=1 Mean Point Distance */
export const MeanPointDistance = new DicomTag(0x0066, 0x0018);
/** (0066,0019) VR=FL VM=1 Maximum Point Distance */
export const MaximumPointDistance = new DicomTag(0x0066, 0x0019);
/** (0066,001A) VR=FL VM=6 Points Bounding Box Coordinates */
export const PointsBoundingBoxCoordinates = new DicomTag(0x0066, 0x001A);
/** (0066,001B) VR=FL VM=3 Axis of Rotation */
export const AxisOfRotation = new DicomTag(0x0066, 0x001B);
/** (0066,001C) VR=FL VM=3 Center of Rotation */
export const CenterOfRotation = new DicomTag(0x0066, 0x001C);
/** (0066,001E) VR=UL VM=1 Number of Vectors */
export const NumberOfVectors = new DicomTag(0x0066, 0x001E);
/** (0066,001F) VR=US VM=1 Vector Dimensionality */
export const VectorDimensionality = new DicomTag(0x0066, 0x001F);
/** (0066,0020) VR=FL VM=1-n Vector Accuracy */
export const VectorAccuracy = new DicomTag(0x0066, 0x0020);
/** (0066,0021) VR=OF VM=1 Vector Coordinate Data */
export const VectorCoordinateData = new DicomTag(0x0066, 0x0021);
/** (0066,0022) VR=OD VM=1 Double Point Coordinates Data */
export const DoublePointCoordinatesData = new DicomTag(0x0066, 0x0022);
/** (0066,0023) VR=OW VM=1 Triangle Point Index List (Retired) */
export const TrianglePointIndexList = new DicomTag(0x0066, 0x0023);
/** (0066,0024) VR=OW VM=1 Edge Point Index List (Retired) */
export const EdgePointIndexList = new DicomTag(0x0066, 0x0024);
/** (0066,0025) VR=OW VM=1 Vertex Point Index List (Retired) */
export const VertexPointIndexList = new DicomTag(0x0066, 0x0025);
/** (0066,0026) VR=SQ VM=1 Triangle Strip Sequence */
export const TriangleStripSequence = new DicomTag(0x0066, 0x0026);
/** (0066,0027) VR=SQ VM=1 Triangle Fan Sequence */
export const TriangleFanSequence = new DicomTag(0x0066, 0x0027);
/** (0066,0028) VR=SQ VM=1 Line Sequence */
export const LineSequence = new DicomTag(0x0066, 0x0028);
/** (0066,0029) VR=OW VM=1 Primitive Point Index List (Retired) */
export const PrimitivePointIndexList = new DicomTag(0x0066, 0x0029);
/** (0066,002A) VR=UL VM=1 Surface Count */
export const SurfaceCount = new DicomTag(0x0066, 0x002A);
/** (0066,002B) VR=SQ VM=1 Referenced Surface Sequence */
export const ReferencedSurfaceSequence = new DicomTag(0x0066, 0x002B);
/** (0066,002C) VR=UL VM=1 Referenced Surface Number */
export const ReferencedSurfaceNumber = new DicomTag(0x0066, 0x002C);
/** (0066,002D) VR=SQ VM=1 Segment Surface Generation Algorithm Identification Sequence */
export const SegmentSurfaceGenerationAlgorithmIdentificationSequence = new DicomTag(0x0066, 0x002D);
/** (0066,002E) VR=SQ VM=1 Segment Surface Source Instance Sequence */
export const SegmentSurfaceSourceInstanceSequence = new DicomTag(0x0066, 0x002E);
/** (0066,002F) VR=SQ VM=1 Algorithm Family Code Sequence */
export const AlgorithmFamilyCodeSequence = new DicomTag(0x0066, 0x002F);
/** (0066,0030) VR=SQ VM=1 Algorithm Name Code Sequence */
export const AlgorithmNameCodeSequence = new DicomTag(0x0066, 0x0030);
/** (0066,0031) VR=LO VM=1 Algorithm Version */
export const AlgorithmVersion = new DicomTag(0x0066, 0x0031);
/** (0066,0032) VR=LT VM=1 Algorithm Parameters */
export const AlgorithmParameters = new DicomTag(0x0066, 0x0032);
/** (0066,0034) VR=SQ VM=1 Facet Sequence */
export const FacetSequence = new DicomTag(0x0066, 0x0034);
/** (0066,0035) VR=SQ VM=1 Surface Processing Algorithm Identification Sequence */
export const SurfaceProcessingAlgorithmIdentificationSequence = new DicomTag(0x0066, 0x0035);
/** (0066,0036) VR=LO VM=1 Algorithm Name */
export const AlgorithmName = new DicomTag(0x0066, 0x0036);
/** (0066,0037) VR=FL VM=1 Recommended Point Radius */
export const RecommendedPointRadius = new DicomTag(0x0066, 0x0037);
/** (0066,0038) VR=FL VM=1 Recommended Line Thickness */
export const RecommendedLineThickness = new DicomTag(0x0066, 0x0038);
/** (0066,0040) VR=OL VM=1 Long Primitive Point Index List */
export const LongPrimitivePointIndexList = new DicomTag(0x0066, 0x0040);
/** (0066,0041) VR=OL VM=1 Long Triangle Point Index List */
export const LongTrianglePointIndexList = new DicomTag(0x0066, 0x0041);
/** (0066,0042) VR=OL VM=1 Long Edge Point Index List */
export const LongEdgePointIndexList = new DicomTag(0x0066, 0x0042);
/** (0066,0043) VR=OL VM=1 Long Vertex Point Index List */
export const LongVertexPointIndexList = new DicomTag(0x0066, 0x0043);
/** (0066,0101) VR=SQ VM=1 Track Set Sequence */
export const TrackSetSequence = new DicomTag(0x0066, 0x0101);
/** (0066,0102) VR=SQ VM=1 Track Sequence */
export const TrackSequence = new DicomTag(0x0066, 0x0102);
/** (0066,0103) VR=OW VM=1 Recommended Display CIELab Value List */
export const RecommendedDisplayCIELabValueList = new DicomTag(0x0066, 0x0103);
/** (0066,0104) VR=SQ VM=1 Tracking Algorithm Identification Sequence */
export const TrackingAlgorithmIdentificationSequence = new DicomTag(0x0066, 0x0104);
/** (0066,0105) VR=UL VM=1 Track Set Number */
export const TrackSetNumber = new DicomTag(0x0066, 0x0105);
/** (0066,0106) VR=LO VM=1 Track Set Label */
export const TrackSetLabel = new DicomTag(0x0066, 0x0106);
/** (0066,0107) VR=UT VM=1 Track Set Description */
export const TrackSetDescription = new DicomTag(0x0066, 0x0107);
/** (0066,0108) VR=SQ VM=1 Track Set Anatomical Type Code Sequence */
export const TrackSetAnatomicalTypeCodeSequence = new DicomTag(0x0066, 0x0108);
/** (0066,0121) VR=SQ VM=1 Measurements Sequence */
export const MeasurementsSequence = new DicomTag(0x0066, 0x0121);
/** (0066,0124) VR=SQ VM=1 Track Set Statistics Sequence */
export const TrackSetStatisticsSequence = new DicomTag(0x0066, 0x0124);
/** (0066,0125) VR=OF VM=1 Floating Point Values */
export const FloatingPointValues = new DicomTag(0x0066, 0x0125);
/** (0066,0129) VR=OL VM=1 Track Point Index List */
export const TrackPointIndexList = new DicomTag(0x0066, 0x0129);
/** (0066,0130) VR=SQ VM=1 Track Statistics Sequence */
export const TrackStatisticsSequence = new DicomTag(0x0066, 0x0130);
/** (0066,0132) VR=SQ VM=1 Measurement Values Sequence */
export const MeasurementValuesSequence = new DicomTag(0x0066, 0x0132);
/** (0066,0133) VR=SQ VM=1 Diffusion Acquisition Code Sequence */
export const DiffusionAcquisitionCodeSequence = new DicomTag(0x0066, 0x0133);
/** (0066,0134) VR=SQ VM=1 Diffusion Model Code Sequence */
export const DiffusionModelCodeSequence = new DicomTag(0x0066, 0x0134);
/** (0068,6210) VR=LO VM=1 Implant Size */
export const ImplantSize = new DicomTag(0x0068, 0x6210);
/** (0068,6221) VR=LO VM=1 Implant Template Version */
export const ImplantTemplateVersion = new DicomTag(0x0068, 0x6221);
/** (0068,6222) VR=SQ VM=1 Replaced Implant Template Sequence */
export const ReplacedImplantTemplateSequence = new DicomTag(0x0068, 0x6222);
/** (0068,6223) VR=CS VM=1 Implant Type */
export const ImplantType = new DicomTag(0x0068, 0x6223);
/** (0068,6224) VR=SQ VM=1 Derivation Implant Template Sequence */
export const DerivationImplantTemplateSequence = new DicomTag(0x0068, 0x6224);
/** (0068,6225) VR=SQ VM=1 Original Implant Template Sequence */
export const OriginalImplantTemplateSequence = new DicomTag(0x0068, 0x6225);
/** (0068,6226) VR=DT VM=1 Effective DateTime */
export const EffectiveDateTime = new DicomTag(0x0068, 0x6226);
/** (0068,6230) VR=SQ VM=1 Implant Target Anatomy Sequence */
export const ImplantTargetAnatomySequence = new DicomTag(0x0068, 0x6230);
/** (0068,6260) VR=SQ VM=1 Information From Manufacturer Sequence */
export const InformationFromManufacturerSequence = new DicomTag(0x0068, 0x6260);
/** (0068,6265) VR=SQ VM=1 Notification From Manufacturer Sequence */
export const NotificationFromManufacturerSequence = new DicomTag(0x0068, 0x6265);
/** (0068,6270) VR=DT VM=1 Information Issue DateTime */
export const InformationIssueDateTime = new DicomTag(0x0068, 0x6270);
/** (0068,6280) VR=ST VM=1 Information Summary */
export const InformationSummary = new DicomTag(0x0068, 0x6280);
/** (0068,62A0) VR=SQ VM=1 Implant Regulatory Disapproval Code Sequence */
export const ImplantRegulatoryDisapprovalCodeSequence = new DicomTag(0x0068, 0x62A0);
/** (0068,62A5) VR=FD VM=1 Overall Template Spatial Tolerance */
export const OverallTemplateSpatialTolerance = new DicomTag(0x0068, 0x62A5);
/** (0068,62C0) VR=SQ VM=1 HPGL Document Sequence */
export const HPGLDocumentSequence = new DicomTag(0x0068, 0x62C0);
/** (0068,62D0) VR=US VM=1 HPGL Document ID */
export const HPGLDocumentID = new DicomTag(0x0068, 0x62D0);
/** (0068,62D5) VR=LO VM=1 HPGL Document Label */
export const HPGLDocumentLabel = new DicomTag(0x0068, 0x62D5);
/** (0068,62E0) VR=SQ VM=1 View Orientation Code Sequence */
export const ViewOrientationCodeSequence = new DicomTag(0x0068, 0x62E0);
/** (0068,62F0) VR=SQ VM=1 View Orientation Modifier Code Sequence */
export const ViewOrientationModifierCodeSequence = new DicomTag(0x0068, 0x62F0);
/** (0068,62F2) VR=FD VM=1 HPGL Document Scaling */
export const HPGLDocumentScaling = new DicomTag(0x0068, 0x62F2);
/** (0068,6300) VR=OB VM=1 HPGL Document */
export const HPGLDocument = new DicomTag(0x0068, 0x6300);
/** (0068,6310) VR=US VM=1 HPGL Contour Pen Number */
export const HPGLContourPenNumber = new DicomTag(0x0068, 0x6310);
/** (0068,6320) VR=SQ VM=1 HPGL Pen Sequence */
export const HPGLPenSequence = new DicomTag(0x0068, 0x6320);
/** (0068,6330) VR=US VM=1 HPGL Pen Number */
export const HPGLPenNumber = new DicomTag(0x0068, 0x6330);
/** (0068,6340) VR=LO VM=1 HPGL Pen Label */
export const HPGLPenLabel = new DicomTag(0x0068, 0x6340);
/** (0068,6345) VR=ST VM=1 HPGL Pen Description */
export const HPGLPenDescription = new DicomTag(0x0068, 0x6345);
/** (0068,6346) VR=FD VM=2 Recommended Rotation Point */
export const RecommendedRotationPoint = new DicomTag(0x0068, 0x6346);
/** (0068,6347) VR=FD VM=4 Bounding Rectangle */
export const BoundingRectangle = new DicomTag(0x0068, 0x6347);
/** (0068,6350) VR=US VM=1-n Implant Template 3D Model Surface Number */
export const ImplantTemplate3DModelSurfaceNumber = new DicomTag(0x0068, 0x6350);
/** (0068,6360) VR=SQ VM=1 Surface Model Description Sequence */
export const SurfaceModelDescriptionSequence = new DicomTag(0x0068, 0x6360);
/** (0068,6380) VR=LO VM=1 Surface Model Label */
export const SurfaceModelLabel = new DicomTag(0x0068, 0x6380);
/** (0068,6390) VR=FD VM=1 Surface Model Scaling Factor */
export const SurfaceModelScalingFactor = new DicomTag(0x0068, 0x6390);
/** (0068,63A0) VR=SQ VM=1 Materials Code Sequence */
export const MaterialsCodeSequence = new DicomTag(0x0068, 0x63A0);
/** (0068,63A4) VR=SQ VM=1 Coating Materials Code Sequence */
export const CoatingMaterialsCodeSequence = new DicomTag(0x0068, 0x63A4);
/** (0068,63A8) VR=SQ VM=1 Implant Type Code Sequence */
export const ImplantTypeCodeSequence = new DicomTag(0x0068, 0x63A8);
/** (0068,63AC) VR=SQ VM=1 Fixation Method Code Sequence */
export const FixationMethodCodeSequence = new DicomTag(0x0068, 0x63AC);
/** (0068,63B0) VR=SQ VM=1 Mating Feature Sets Sequence */
export const MatingFeatureSetsSequence = new DicomTag(0x0068, 0x63B0);
/** (0068,63C0) VR=US VM=1 Mating Feature Set ID */
export const MatingFeatureSetID = new DicomTag(0x0068, 0x63C0);
/** (0068,63D0) VR=LO VM=1 Mating Feature Set Label */
export const MatingFeatureSetLabel = new DicomTag(0x0068, 0x63D0);
/** (0068,63E0) VR=SQ VM=1 Mating Feature Sequence */
export const MatingFeatureSequence = new DicomTag(0x0068, 0x63E0);
/** (0068,63F0) VR=US VM=1 Mating Feature ID */
export const MatingFeatureID = new DicomTag(0x0068, 0x63F0);
/** (0068,6400) VR=SQ VM=1 Mating Feature Degree of Freedom Sequence */
export const MatingFeatureDegreeOfFreedomSequence = new DicomTag(0x0068, 0x6400);
/** (0068,6410) VR=US VM=1 Degree of Freedom ID */
export const DegreeOfFreedomID = new DicomTag(0x0068, 0x6410);
/** (0068,6420) VR=CS VM=1 Degree of Freedom Type */
export const DegreeOfFreedomType = new DicomTag(0x0068, 0x6420);
/** (0068,6430) VR=SQ VM=1 2D Mating Feature Coordinates Sequence */
export const TwoDMatingFeatureCoordinatesSequence = new DicomTag(0x0068, 0x6430);
/** (0068,6440) VR=US VM=1 Referenced HPGL Document ID */
export const ReferencedHPGLDocumentID = new DicomTag(0x0068, 0x6440);
/** (0068,6450) VR=FD VM=2 2D Mating Point */
export const TwoDMatingPoint = new DicomTag(0x0068, 0x6450);
/** (0068,6460) VR=FD VM=4 2D Mating Axes */
export const TwoDMatingAxes = new DicomTag(0x0068, 0x6460);
/** (0068,6470) VR=SQ VM=1 2D Degree of Freedom Sequence */
export const TwoDDegreeOfFreedomSequence = new DicomTag(0x0068, 0x6470);
/** (0068,6490) VR=FD VM=3 3D Degree of Freedom Axis */
export const ThreeDDegreeOfFreedomAxis = new DicomTag(0x0068, 0x6490);
/** (0068,64A0) VR=FD VM=2 Range of Freedom */
export const RangeOfFreedom = new DicomTag(0x0068, 0x64A0);
/** (0068,64C0) VR=FD VM=3 3D Mating Point */
export const ThreeDMatingPoint = new DicomTag(0x0068, 0x64C0);
/** (0068,64D0) VR=FD VM=9 3D Mating Axes */
export const ThreeDMatingAxes = new DicomTag(0x0068, 0x64D0);
/** (0068,64F0) VR=FD VM=3 2D Degree of Freedom Axis */
export const TwoDDegreeOfFreedomAxis = new DicomTag(0x0068, 0x64F0);
/** (0068,6500) VR=SQ VM=1 Planning Landmark Point Sequence */
export const PlanningLandmarkPointSequence = new DicomTag(0x0068, 0x6500);
/** (0068,6510) VR=SQ VM=1 Planning Landmark Line Sequence */
export const PlanningLandmarkLineSequence = new DicomTag(0x0068, 0x6510);
/** (0068,6520) VR=SQ VM=1 Planning Landmark Plane Sequence */
export const PlanningLandmarkPlaneSequence = new DicomTag(0x0068, 0x6520);
/** (0068,6530) VR=US VM=1 Planning Landmark ID */
export const PlanningLandmarkID = new DicomTag(0x0068, 0x6530);
/** (0068,6540) VR=LO VM=1 Planning Landmark Description */
export const PlanningLandmarkDescription = new DicomTag(0x0068, 0x6540);
/** (0068,6545) VR=SQ VM=1 Planning Landmark Identification Code Sequence */
export const PlanningLandmarkIdentificationCodeSequence = new DicomTag(0x0068, 0x6545);
/** (0068,6550) VR=SQ VM=1 2D Point Coordinates Sequence */
export const TwoDPointCoordinatesSequence = new DicomTag(0x0068, 0x6550);
/** (0068,6560) VR=FD VM=2 2D Point Coordinates */
export const TwoDPointCoordinates = new DicomTag(0x0068, 0x6560);
/** (0068,6590) VR=FD VM=3 3D Point Coordinates */
export const ThreeDPointCoordinates = new DicomTag(0x0068, 0x6590);
/** (0068,65A0) VR=SQ VM=1 2D Line Coordinates Sequence */
export const TwoDLineCoordinatesSequence = new DicomTag(0x0068, 0x65A0);
/** (0068,65B0) VR=FD VM=4 2D Line Coordinates */
export const TwoDLineCoordinates = new DicomTag(0x0068, 0x65B0);
/** (0068,65D0) VR=FD VM=6 3D Line Coordinates */
export const ThreeDLineCoordinates = new DicomTag(0x0068, 0x65D0);
/** (0068,65E0) VR=SQ VM=1 2D Plane Coordinates Sequence */
export const TwoDPlaneCoordinatesSequence = new DicomTag(0x0068, 0x65E0);
/** (0068,65F0) VR=FD VM=4 2D Plane Intersection */
export const TwoDPlaneIntersection = new DicomTag(0x0068, 0x65F0);
/** (0068,6610) VR=FD VM=3 3D Plane Origin */
export const ThreeDPlaneOrigin = new DicomTag(0x0068, 0x6610);
/** (0068,6620) VR=FD VM=3 3D Plane Normal */
export const ThreeDPlaneNormal = new DicomTag(0x0068, 0x6620);
/** (0068,7001) VR=CS VM=1 Model Modification */
export const ModelModification = new DicomTag(0x0068, 0x7001);
/** (0068,7002) VR=CS VM=1 Model Mirroring */
export const ModelMirroring = new DicomTag(0x0068, 0x7002);
/** (0068,7003) VR=SQ VM=1 Model Usage Code Sequence */
export const ModelUsageCodeSequence = new DicomTag(0x0068, 0x7003);
/** (0068,7004) VR=UI VM=1 Model Group UID */
export const ModelGroupUID = new DicomTag(0x0068, 0x7004);
/** (0068,7005) VR=UR VM=1 Relative URI Reference Within Encapsulated Document */
export const RelativeURIReferenceWithinEncapsulatedDocument = new DicomTag(0x0068, 0x7005);
/** (006A,0001) VR=CS VM=1 Annotation Coordinate Type */
export const AnnotationCoordinateType = new DicomTag(0x006A, 0x0001);
/** (006A,0002) VR=SQ VM=1 Annotation Group Sequence */
export const AnnotationGroupSequence = new DicomTag(0x006A, 0x0002);
/** (006A,0003) VR=UI VM=1 Annotation Group UID */
export const AnnotationGroupUID = new DicomTag(0x006A, 0x0003);
/** (006A,0005) VR=LO VM=1 Annotation Group Label */
export const AnnotationGroupLabel = new DicomTag(0x006A, 0x0005);
/** (006A,0006) VR=UT VM=1 Annotation Group Description */
export const AnnotationGroupDescription = new DicomTag(0x006A, 0x0006);
/** (006A,0007) VR=CS VM=1 Annotation Group Generation Type */
export const AnnotationGroupGenerationType = new DicomTag(0x006A, 0x0007);
/** (006A,0008) VR=SQ VM=1 Annotation Group Algorithm Identification Sequence */
export const AnnotationGroupAlgorithmIdentificationSequence = new DicomTag(0x006A, 0x0008);
/** (006A,0009) VR=SQ VM=1 Annotation Property Category Code Sequence */
export const AnnotationPropertyCategoryCodeSequence = new DicomTag(0x006A, 0x0009);
/** (006A,000A) VR=SQ VM=1 Annotation Property Type Code Sequence */
export const AnnotationPropertyTypeCodeSequence = new DicomTag(0x006A, 0x000A);
/** (006A,000B) VR=SQ VM=1 Annotation Property Type Modifier Code Sequence */
export const AnnotationPropertyTypeModifierCodeSequence = new DicomTag(0x006A, 0x000B);
/** (006A,000C) VR=UL VM=1 Number of Annotations */
export const NumberOfAnnotations = new DicomTag(0x006A, 0x000C);
/** (006A,000D) VR=CS VM=1 Annotation Applies to All Optical Paths */
export const AnnotationAppliesToAllOpticalPaths = new DicomTag(0x006A, 0x000D);
/** (006A,000E) VR=SH VM=1-n Referenced Optical Path Identifier */
export const ReferencedOpticalPathIdentifier = new DicomTag(0x006A, 0x000E);
/** (006A,000F) VR=CS VM=1 Annotation Applies to All Z Planes */
export const AnnotationAppliesToAllZPlanes = new DicomTag(0x006A, 0x000F);
/** (006A,0010) VR=FD VM=1-n Common Z Coordinate Value */
export const CommonZCoordinateValue = new DicomTag(0x006A, 0x0010);
/** (006A,0011) VR=OL VM=1 Annotation Index List */
export const AnnotationIndexList = new DicomTag(0x006A, 0x0011);
/** (0070,0001) VR=SQ VM=1 Graphic Annotation Sequence */
export const GraphicAnnotationSequence = new DicomTag(0x0070, 0x0001);
/** (0070,0002) VR=CS VM=1 Graphic Layer */
export const GraphicLayer = new DicomTag(0x0070, 0x0002);
/** (0070,0003) VR=CS VM=1 Bounding Box Annotation Units */
export const BoundingBoxAnnotationUnits = new DicomTag(0x0070, 0x0003);
/** (0070,0004) VR=CS VM=1 Anchor Point Annotation Units */
export const AnchorPointAnnotationUnits = new DicomTag(0x0070, 0x0004);
/** (0070,0005) VR=CS VM=1 Graphic Annotation Units */
export const GraphicAnnotationUnits = new DicomTag(0x0070, 0x0005);
/** (0070,0006) VR=ST VM=1 Unformatted Text Value */
export const UnformattedTextValue = new DicomTag(0x0070, 0x0006);
/** (0070,0008) VR=SQ VM=1 Text Object Sequence */
export const TextObjectSequence = new DicomTag(0x0070, 0x0008);
/** (0070,0009) VR=SQ VM=1 Graphic Object Sequence */
export const GraphicObjectSequence = new DicomTag(0x0070, 0x0009);
/** (0070,0010) VR=FL VM=2 Bounding Box Top Left Hand Corner */
export const BoundingBoxTopLeftHandCorner = new DicomTag(0x0070, 0x0010);
/** (0070,0011) VR=FL VM=2 Bounding Box Bottom Right Hand Corner */
export const BoundingBoxBottomRightHandCorner = new DicomTag(0x0070, 0x0011);
/** (0070,0012) VR=CS VM=1 Bounding Box Text Horizontal Justification */
export const BoundingBoxTextHorizontalJustification = new DicomTag(0x0070, 0x0012);
/** (0070,0014) VR=FL VM=2 Anchor Point */
export const AnchorPoint = new DicomTag(0x0070, 0x0014);
/** (0070,0015) VR=CS VM=1 Anchor Point Visibility */
export const AnchorPointVisibility = new DicomTag(0x0070, 0x0015);
/** (0070,0020) VR=US VM=1 Graphic Dimensions */
export const GraphicDimensions = new DicomTag(0x0070, 0x0020);
/** (0070,0021) VR=US VM=1 Number of Graphic Points */
export const NumberOfGraphicPoints = new DicomTag(0x0070, 0x0021);
/** (0070,0022) VR=FL VM=2-n Graphic Data */
export const GraphicData = new DicomTag(0x0070, 0x0022);
/** (0070,0023) VR=CS VM=1 Graphic Type */
export const GraphicType = new DicomTag(0x0070, 0x0023);
/** (0070,0024) VR=CS VM=1 Graphic Filled */
export const GraphicFilled = new DicomTag(0x0070, 0x0024);
/** (0070,0040) VR=IS VM=1 Image Rotation (Retired) (Retired) */
export const ImageRotationRetired = new DicomTag(0x0070, 0x0040);
/** (0070,0041) VR=CS VM=1 Image Horizontal Flip */
export const ImageHorizontalFlip = new DicomTag(0x0070, 0x0041);
/** (0070,0042) VR=US VM=1 Image Rotation */
export const ImageRotation = new DicomTag(0x0070, 0x0042);
/** (0070,0050) VR=US VM=2 Displayed Area Top Left Hand Corner (Trial) (Retired) */
export const DisplayedAreaTopLeftHandCornerTrial = new DicomTag(0x0070, 0x0050);
/** (0070,0051) VR=US VM=2 Displayed Area Bottom Right Hand Corner (Trial) (Retired) */
export const DisplayedAreaBottomRightHandCornerTrial = new DicomTag(0x0070, 0x0051);
/** (0070,0052) VR=SL VM=2 Displayed Area Top Left Hand Corner */
export const DisplayedAreaTopLeftHandCorner = new DicomTag(0x0070, 0x0052);
/** (0070,0053) VR=SL VM=2 Displayed Area Bottom Right Hand Corner */
export const DisplayedAreaBottomRightHandCorner = new DicomTag(0x0070, 0x0053);
/** (0070,005A) VR=SQ VM=1 Displayed Area Selection Sequence */
export const DisplayedAreaSelectionSequence = new DicomTag(0x0070, 0x005A);
/** (0070,0060) VR=SQ VM=1 Graphic Layer Sequence */
export const GraphicLayerSequence = new DicomTag(0x0070, 0x0060);
/** (0070,0062) VR=IS VM=1 Graphic Layer Order */
export const GraphicLayerOrder = new DicomTag(0x0070, 0x0062);
/** (0070,0066) VR=US VM=1 Graphic Layer Recommended Display Grayscale Value */
export const GraphicLayerRecommendedDisplayGrayscaleValue = new DicomTag(0x0070, 0x0066);
/** (0070,0067) VR=US VM=3 Graphic Layer Recommended Display RGB Value (Retired) */
export const GraphicLayerRecommendedDisplayRGBValue = new DicomTag(0x0070, 0x0067);
/** (0070,0068) VR=LO VM=1 Graphic Layer Description */
export const GraphicLayerDescription = new DicomTag(0x0070, 0x0068);
/** (0070,0080) VR=CS VM=1 Content Label */
export const ContentLabel = new DicomTag(0x0070, 0x0080);
/** (0070,0081) VR=LO VM=1 Content Description */
export const ContentDescription = new DicomTag(0x0070, 0x0081);
/** (0070,0082) VR=DA VM=1 Presentation Creation Date */
export const PresentationCreationDate = new DicomTag(0x0070, 0x0082);
/** (0070,0083) VR=TM VM=1 Presentation Creation Time */
export const PresentationCreationTime = new DicomTag(0x0070, 0x0083);
/** (0070,0084) VR=PN VM=1 Content Creator's Name */
export const ContentCreatorName = new DicomTag(0x0070, 0x0084);
/** (0070,0086) VR=SQ VM=1 Content Creator's Identification Code Sequence */
export const ContentCreatorIdentificationCodeSequence = new DicomTag(0x0070, 0x0086);
/** (0070,0087) VR=SQ VM=1 Alternate Content Description Sequence */
export const AlternateContentDescriptionSequence = new DicomTag(0x0070, 0x0087);
/** (0070,0100) VR=CS VM=1 Presentation Size Mode */
export const PresentationSizeMode = new DicomTag(0x0070, 0x0100);
/** (0070,0101) VR=DS VM=2 Presentation Pixel Spacing */
export const PresentationPixelSpacing = new DicomTag(0x0070, 0x0101);
/** (0070,0102) VR=IS VM=2 Presentation Pixel Aspect Ratio */
export const PresentationPixelAspectRatio = new DicomTag(0x0070, 0x0102);
/** (0070,0103) VR=FL VM=1 Presentation Pixel Magnification Ratio */
export const PresentationPixelMagnificationRatio = new DicomTag(0x0070, 0x0103);
/** (0070,0207) VR=LO VM=1 Graphic Group Label */
export const GraphicGroupLabel = new DicomTag(0x0070, 0x0207);
/** (0070,0208) VR=ST VM=1 Graphic Group Description */
export const GraphicGroupDescription = new DicomTag(0x0070, 0x0208);
/** (0070,0209) VR=SQ VM=1 Compound Graphic Sequence */
export const CompoundGraphicSequence = new DicomTag(0x0070, 0x0209);
/** (0070,0226) VR=UL VM=1 Compound Graphic Instance ID */
export const CompoundGraphicInstanceID = new DicomTag(0x0070, 0x0226);
/** (0070,0227) VR=LO VM=1 Font Name */
export const FontName = new DicomTag(0x0070, 0x0227);
/** (0070,0228) VR=CS VM=1 Font Name Type */
export const FontNameType = new DicomTag(0x0070, 0x0228);
/** (0070,0229) VR=LO VM=1 CSS Font Name */
export const CSSFontName = new DicomTag(0x0070, 0x0229);
/** (0070,0230) VR=FD VM=1 Rotation Angle */
export const RotationAngle = new DicomTag(0x0070, 0x0230);
/** (0070,0231) VR=SQ VM=1 Text Style Sequence */
export const TextStyleSequence = new DicomTag(0x0070, 0x0231);
/** (0070,0232) VR=SQ VM=1 Line Style Sequence */
export const LineStyleSequence = new DicomTag(0x0070, 0x0232);
/** (0070,0233) VR=SQ VM=1 Fill Style Sequence */
export const FillStyleSequence = new DicomTag(0x0070, 0x0233);
/** (0070,0234) VR=SQ VM=1 Graphic Group Sequence */
export const GraphicGroupSequence = new DicomTag(0x0070, 0x0234);
/** (0070,0241) VR=US VM=3 Text Color CIELab Value */
export const TextColorCIELabValue = new DicomTag(0x0070, 0x0241);
/** (0070,0242) VR=CS VM=1 Horizontal Alignment */
export const HorizontalAlignment = new DicomTag(0x0070, 0x0242);
/** (0070,0243) VR=CS VM=1 Vertical Alignment */
export const VerticalAlignment = new DicomTag(0x0070, 0x0243);
/** (0070,0244) VR=CS VM=1 Shadow Style */
export const ShadowStyle = new DicomTag(0x0070, 0x0244);
/** (0070,0245) VR=FL VM=1 Shadow Offset X */
export const ShadowOffsetX = new DicomTag(0x0070, 0x0245);
/** (0070,0246) VR=FL VM=1 Shadow Offset Y */
export const ShadowOffsetY = new DicomTag(0x0070, 0x0246);
/** (0070,0247) VR=US VM=3 Shadow Color CIELab Value */
export const ShadowColorCIELabValue = new DicomTag(0x0070, 0x0247);
/** (0070,0248) VR=CS VM=1 Underlined */
export const Underlined = new DicomTag(0x0070, 0x0248);
/** (0070,0249) VR=CS VM=1 Bold */
export const Bold = new DicomTag(0x0070, 0x0249);
/** (0070,0250) VR=CS VM=1 Italic */
export const Italic = new DicomTag(0x0070, 0x0250);
/** (0070,0251) VR=US VM=3 Pattern On Color CIELab Value */
export const PatternOnColorCIELabValue = new DicomTag(0x0070, 0x0251);
/** (0070,0252) VR=US VM=3 Pattern Off Color CIELab Value */
export const PatternOffColorCIELabValue = new DicomTag(0x0070, 0x0252);
/** (0070,0253) VR=FL VM=1 Line Thickness */
export const LineThickness = new DicomTag(0x0070, 0x0253);
/** (0070,0254) VR=CS VM=1 Line Dashing Style */
export const LineDashingStyle = new DicomTag(0x0070, 0x0254);
/** (0070,0255) VR=UL VM=1 Line Pattern */
export const LinePattern = new DicomTag(0x0070, 0x0255);
/** (0070,0256) VR=OB VM=1 Fill Pattern */
export const FillPattern = new DicomTag(0x0070, 0x0256);
/** (0070,0257) VR=CS VM=1 Fill Mode */
export const FillMode = new DicomTag(0x0070, 0x0257);
/** (0070,0258) VR=FL VM=1 Shadow Opacity */
export const ShadowOpacity = new DicomTag(0x0070, 0x0258);
/** (0070,0261) VR=FL VM=1 Gap Length */
export const GapLength = new DicomTag(0x0070, 0x0261);
/** (0070,0262) VR=FL VM=1 Diameter of Visibility */
export const DiameterOfVisibility = new DicomTag(0x0070, 0x0262);
/** (0070,0273) VR=FL VM=2 Rotation Point */
export const RotationPoint = new DicomTag(0x0070, 0x0273);
/** (0070,0274) VR=CS VM=1 Tick Alignment */
export const TickAlignment = new DicomTag(0x0070, 0x0274);
/** (0070,0278) VR=CS VM=1 Show Tick Label */
export const ShowTickLabel = new DicomTag(0x0070, 0x0278);
/** (0070,0279) VR=CS VM=1 Tick Label Alignment */
export const TickLabelAlignment = new DicomTag(0x0070, 0x0279);
/** (0070,0282) VR=CS VM=1 Compound Graphic Units */
export const CompoundGraphicUnits = new DicomTag(0x0070, 0x0282);
/** (0070,0284) VR=FL VM=1 Pattern On Opacity */
export const PatternOnOpacity = new DicomTag(0x0070, 0x0284);
/** (0070,0285) VR=FL VM=1 Pattern Off Opacity */
export const PatternOffOpacity = new DicomTag(0x0070, 0x0285);
/** (0070,0287) VR=SQ VM=1 Major Ticks Sequence */
export const MajorTicksSequence = new DicomTag(0x0070, 0x0287);
/** (0070,0288) VR=FL VM=1 Tick Position */
export const TickPosition = new DicomTag(0x0070, 0x0288);
/** (0070,0289) VR=SH VM=1 Tick Label */
export const TickLabel = new DicomTag(0x0070, 0x0289);
/** (0070,0294) VR=CS VM=1 Compound Graphic Type */
export const CompoundGraphicType = new DicomTag(0x0070, 0x0294);
/** (0070,0295) VR=UL VM=1 Graphic Group ID */
export const GraphicGroupID = new DicomTag(0x0070, 0x0295);
/** (0070,0306) VR=CS VM=1 Shape Type */
export const ShapeType = new DicomTag(0x0070, 0x0306);
/** (0070,0308) VR=SQ VM=1 Registration Sequence */
export const RegistrationSequence = new DicomTag(0x0070, 0x0308);
/** (0070,0309) VR=SQ VM=1 Matrix Registration Sequence */
export const MatrixRegistrationSequence = new DicomTag(0x0070, 0x0309);
/** (0070,030A) VR=SQ VM=1 Matrix Sequence */
export const MatrixSequence = new DicomTag(0x0070, 0x030A);
/** (0070,030B) VR=FD VM=16 Frame of Reference to Displayed Coordinate System Transformation Matrix */
export const FrameOfReferenceToDisplayedCoordinateSystemTransformationMatrix = new DicomTag(0x0070, 0x030B);
/** (0070,030C) VR=CS VM=1 Frame of Reference Transformation Matrix Type */
export const FrameOfReferenceTransformationMatrixType = new DicomTag(0x0070, 0x030C);
/** (0070,030D) VR=SQ VM=1 Registration Type Code Sequence */
export const RegistrationTypeCodeSequence = new DicomTag(0x0070, 0x030D);
/** (0070,030F) VR=ST VM=1 Fiducial Description */
export const FiducialDescription = new DicomTag(0x0070, 0x030F);
/** (0070,0310) VR=SH VM=1 Fiducial Identifier */
export const FiducialIdentifier = new DicomTag(0x0070, 0x0310);
/** (0070,0311) VR=SQ VM=1 Fiducial Identifier Code Sequence */
export const FiducialIdentifierCodeSequence = new DicomTag(0x0070, 0x0311);
/** (0070,0312) VR=FD VM=1 Contour Uncertainty Radius */
export const ContourUncertaintyRadius = new DicomTag(0x0070, 0x0312);
/** (0070,0314) VR=SQ VM=1 Used Fiducials Sequence */
export const UsedFiducialsSequence = new DicomTag(0x0070, 0x0314);
/** (0070,0315) VR=SQ VM=1 Used RT Structure Set ROI Sequence */
export const UsedRTStructureSetROISequence = new DicomTag(0x0070, 0x0315);
/** (0070,0318) VR=SQ VM=1 Graphic Coordinates Data Sequence */
export const GraphicCoordinatesDataSequence = new DicomTag(0x0070, 0x0318);
/** (0070,031A) VR=UI VM=1 Fiducial UID */
export const FiducialUID = new DicomTag(0x0070, 0x031A);
/** (0070,031B) VR=UI VM=1 Referenced Fiducial UID */
export const ReferencedFiducialUID = new DicomTag(0x0070, 0x031B);
/** (0070,031C) VR=SQ VM=1 Fiducial Set Sequence */
export const FiducialSetSequence = new DicomTag(0x0070, 0x031C);
/** (0070,031E) VR=SQ VM=1 Fiducial Sequence */
export const FiducialSequence = new DicomTag(0x0070, 0x031E);
/** (0070,031F) VR=SQ VM=1 Fiducials Property Category Code Sequence */
export const FiducialsPropertyCategoryCodeSequence = new DicomTag(0x0070, 0x031F);
/** (0070,0401) VR=US VM=3 Graphic Layer Recommended Display CIELab Value */
export const GraphicLayerRecommendedDisplayCIELabValue = new DicomTag(0x0070, 0x0401);
/** (0070,0402) VR=SQ VM=1 Blending Sequence */
export const BlendingSequence = new DicomTag(0x0070, 0x0402);
/** (0070,0403) VR=FL VM=1 Relative Opacity */
export const RelativeOpacity = new DicomTag(0x0070, 0x0403);
/** (0070,0404) VR=SQ VM=1 Referenced Spatial Registration Sequence */
export const ReferencedSpatialRegistrationSequence = new DicomTag(0x0070, 0x0404);
/** (0070,0405) VR=CS VM=1 Blending Position */
export const BlendingPosition = new DicomTag(0x0070, 0x0405);
/** (0070,1101) VR=UI VM=1 Presentation Display Collection UID */
export const PresentationDisplayCollectionUID = new DicomTag(0x0070, 0x1101);
/** (0070,1102) VR=UI VM=1 Presentation Sequence Collection UID */
export const PresentationSequenceCollectionUID = new DicomTag(0x0070, 0x1102);
/** (0070,1103) VR=US VM=1 Presentation Sequence Position Index */
export const PresentationSequencePositionIndex = new DicomTag(0x0070, 0x1103);
/** (0070,1104) VR=SQ VM=1 Rendered Image Reference Sequence */
export const RenderedImageReferenceSequence = new DicomTag(0x0070, 0x1104);
/** (0070,1201) VR=SQ VM=1 Volumetric Presentation State Input Sequence */
export const VolumetricPresentationStateInputSequence = new DicomTag(0x0070, 0x1201);
/** (0070,1202) VR=CS VM=1 Presentation Input Type */
export const PresentationInputType = new DicomTag(0x0070, 0x1202);
/** (0070,1203) VR=US VM=1 Input Sequence Position Index */
export const InputSequencePositionIndex = new DicomTag(0x0070, 0x1203);
/** (0070,1204) VR=CS VM=1 Crop */
export const Crop = new DicomTag(0x0070, 0x1204);
/** (0070,1205) VR=US VM=1-n Cropping Specification Index */
export const CroppingSpecificationIndex = new DicomTag(0x0070, 0x1205);
/** (0070,1206) VR=CS VM=1 Compositing Method (Retired) */
export const CompositingMethod = new DicomTag(0x0070, 0x1206);
/** (0070,1207) VR=US VM=1 Volumetric Presentation Input Number */
export const VolumetricPresentationInputNumber = new DicomTag(0x0070, 0x1207);
/** (0070,1208) VR=CS VM=1 Image Volume Geometry */
export const ImageVolumeGeometry = new DicomTag(0x0070, 0x1208);
/** (0070,1209) VR=UI VM=1 Volumetric Presentation Input Set UID */
export const VolumetricPresentationInputSetUID = new DicomTag(0x0070, 0x1209);
/** (0070,120A) VR=SQ VM=1 Volumetric Presentation Input Set Sequence */
export const VolumetricPresentationInputSetSequence = new DicomTag(0x0070, 0x120A);
/** (0070,120B) VR=CS VM=1 Global Crop */
export const GlobalCrop = new DicomTag(0x0070, 0x120B);
/** (0070,120C) VR=US VM=1-n Global Cropping Specification Index */
export const GlobalCroppingSpecificationIndex = new DicomTag(0x0070, 0x120C);
/** (0070,120D) VR=CS VM=1 Rendering Method */
export const RenderingMethod = new DicomTag(0x0070, 0x120D);
/** (0070,1301) VR=SQ VM=1 Volume Cropping Sequence */
export const VolumeCroppingSequence = new DicomTag(0x0070, 0x1301);
/** (0070,1302) VR=CS VM=1 Volume Cropping Method */
export const VolumeCroppingMethod = new DicomTag(0x0070, 0x1302);
/** (0070,1303) VR=FD VM=6 Bounding Box Crop */
export const BoundingBoxCrop = new DicomTag(0x0070, 0x1303);
/** (0070,1304) VR=SQ VM=1 Oblique Cropping Plane Sequence */
export const ObliqueCroppingPlaneSequence = new DicomTag(0x0070, 0x1304);
/** (0070,1305) VR=FD VM=4 Plane */
export const Plane = new DicomTag(0x0070, 0x1305);
/** (0070,1306) VR=FD VM=3 Plane Normal */
export const PlaneNormal = new DicomTag(0x0070, 0x1306);
/** (0070,1309) VR=US VM=1 Cropping Specification Number */
export const CroppingSpecificationNumber = new DicomTag(0x0070, 0x1309);
/** (0070,1501) VR=CS VM=1 Multi-Planar Reconstruction Style */
export const MultiPlanarReconstructionStyle = new DicomTag(0x0070, 0x1501);
/** (0070,1502) VR=CS VM=1 MPR Thickness Type */
export const MPRThicknessType = new DicomTag(0x0070, 0x1502);
/** (0070,1503) VR=FD VM=1 MPR Slab Thickness */
export const MPRSlabThickness = new DicomTag(0x0070, 0x1503);
/** (0070,1505) VR=FD VM=3 MPR Top Left Hand Corner */
export const MPRTopLeftHandCorner = new DicomTag(0x0070, 0x1505);
/** (0070,1507) VR=FD VM=3 MPR View Width Direction */
export const MPRViewWidthDirection = new DicomTag(0x0070, 0x1507);
/** (0070,1508) VR=FD VM=1 MPR View Width */
export const MPRViewWidth = new DicomTag(0x0070, 0x1508);
/** (0070,150C) VR=UL VM=1 Number of Volumetric Curve Points */
export const NumberOfVolumetricCurvePoints = new DicomTag(0x0070, 0x150C);
/** (0070,150D) VR=OD VM=1 Volumetric Curve Points */
export const VolumetricCurvePoints = new DicomTag(0x0070, 0x150D);
/** (0070,1511) VR=FD VM=3 MPR View Height Direction */
export const MPRViewHeightDirection = new DicomTag(0x0070, 0x1511);
/** (0070,1512) VR=FD VM=1 MPR View Height */
export const MPRViewHeight = new DicomTag(0x0070, 0x1512);
/** (0070,1602) VR=CS VM=1 Render Projection */
export const RenderProjection = new DicomTag(0x0070, 0x1602);
/** (0070,1603) VR=FD VM=3 Viewpoint Position */
export const ViewpointPosition = new DicomTag(0x0070, 0x1603);
/** (0070,1604) VR=FD VM=3 Viewpoint LookAt Point */
export const ViewpointLookAtPoint = new DicomTag(0x0070, 0x1604);
/** (0070,1605) VR=FD VM=3 Viewpoint Up Direction */
export const ViewpointUpDirection = new DicomTag(0x0070, 0x1605);
/** (0070,1606) VR=FD VM=6 Render Field of View */
export const RenderFieldOfView = new DicomTag(0x0070, 0x1606);
/** (0070,1607) VR=FD VM=1 Sampling Step Size */
export const SamplingStepSize = new DicomTag(0x0070, 0x1607);
/** (0070,1701) VR=CS VM=1 Shading Style */
export const ShadingStyle = new DicomTag(0x0070, 0x1701);
/** (0070,1702) VR=FD VM=1 Ambient Reflection Intensity */
export const AmbientReflectionIntensity = new DicomTag(0x0070, 0x1702);
/** (0070,1703) VR=FD VM=3 Light Direction */
export const LightDirection = new DicomTag(0x0070, 0x1703);
/** (0070,1704) VR=FD VM=1 Diffuse Reflection Intensity */
export const DiffuseReflectionIntensity = new DicomTag(0x0070, 0x1704);
/** (0070,1705) VR=FD VM=1 Specular Reflection Intensity */
export const SpecularReflectionIntensity = new DicomTag(0x0070, 0x1705);
/** (0070,1706) VR=FD VM=1 Shininess */
export const Shininess = new DicomTag(0x0070, 0x1706);
/** (0070,1801) VR=SQ VM=1 Presentation State Classification Component Sequence */
export const PresentationStateClassificationComponentSequence = new DicomTag(0x0070, 0x1801);
/** (0070,1802) VR=CS VM=1 Component Type */
export const ComponentType = new DicomTag(0x0070, 0x1802);
/** (0070,1803) VR=SQ VM=1 Component Input Sequence */
export const ComponentInputSequence = new DicomTag(0x0070, 0x1803);
/** (0070,1804) VR=US VM=1 Volumetric Presentation Input Index */
export const VolumetricPresentationInputIndex = new DicomTag(0x0070, 0x1804);
/** (0070,1805) VR=SQ VM=1 Presentation State Compositor Component Sequence */
export const PresentationStateCompositorComponentSequence = new DicomTag(0x0070, 0x1805);
/** (0070,1806) VR=SQ VM=1 Weighting Transfer Function Sequence */
export const WeightingTransferFunctionSequence = new DicomTag(0x0070, 0x1806);
/** (0070,1807) VR=US VM=3 Weighting Lookup Table Descriptor (Retired) */
export const WeightingLookupTableDescriptor = new DicomTag(0x0070, 0x1807);
/** (0070,1808) VR=OB VM=1 Weighting Lookup Table Data (Retired) */
export const WeightingLookupTableData = new DicomTag(0x0070, 0x1808);
/** (0070,1901) VR=SQ VM=1 Volumetric Annotation Sequence */
export const VolumetricAnnotationSequence = new DicomTag(0x0070, 0x1901);
/** (0070,1903) VR=SQ VM=1 Referenced Structured Context Sequence */
export const ReferencedStructuredContextSequence = new DicomTag(0x0070, 0x1903);
/** (0070,1904) VR=UI VM=1 Referenced Content Item */
export const ReferencedContentItem = new DicomTag(0x0070, 0x1904);
/** (0070,1905) VR=SQ VM=1 Volumetric Presentation Input Annotation Sequence */
export const VolumetricPresentationInputAnnotationSequence = new DicomTag(0x0070, 0x1905);
/** (0070,1907) VR=CS VM=1 Annotation Clipping */
export const AnnotationClipping = new DicomTag(0x0070, 0x1907);
/** (0070,1A01) VR=CS VM=1 Presentation Animation Style */
export const PresentationAnimationStyle = new DicomTag(0x0070, 0x1A01);
/** (0070,1A03) VR=FD VM=1 Recommended Animation Rate */
export const RecommendedAnimationRate = new DicomTag(0x0070, 0x1A03);
/** (0070,1A04) VR=SQ VM=1 Animation Curve Sequence */
export const AnimationCurveSequence = new DicomTag(0x0070, 0x1A04);
/** (0070,1A05) VR=FD VM=1 Animation Step Size */
export const AnimationStepSize = new DicomTag(0x0070, 0x1A05);
/** (0070,1A06) VR=FD VM=1 Swivel Range */
export const SwivelRange = new DicomTag(0x0070, 0x1A06);
/** (0070,1A07) VR=OD VM=1 Volumetric Curve Up Directions */
export const VolumetricCurveUpDirections = new DicomTag(0x0070, 0x1A07);
/** (0070,1A08) VR=SQ VM=1 Volume Stream Sequence */
export const VolumeStreamSequence = new DicomTag(0x0070, 0x1A08);
/** (0070,1A09) VR=LO VM=1 RGBA Transfer Function Description */
export const RGBATransferFunctionDescription = new DicomTag(0x0070, 0x1A09);
/** (0070,1B01) VR=SQ VM=1 Advanced Blending Sequence */
export const AdvancedBlendingSequence = new DicomTag(0x0070, 0x1B01);
/** (0070,1B02) VR=US VM=1 Blending Input Number */
export const BlendingInputNumber = new DicomTag(0x0070, 0x1B02);
/** (0070,1B03) VR=SQ VM=1 Blending Display Input Sequence */
export const BlendingDisplayInputSequence = new DicomTag(0x0070, 0x1B03);
/** (0070,1B04) VR=SQ VM=1 Blending Display Sequence */
export const BlendingDisplaySequence = new DicomTag(0x0070, 0x1B04);
/** (0070,1B06) VR=CS VM=1 Blending Mode */
export const BlendingMode = new DicomTag(0x0070, 0x1B06);
/** (0070,1B07) VR=CS VM=1 Time Series Blending */
export const TimeSeriesBlending = new DicomTag(0x0070, 0x1B07);
/** (0070,1B08) VR=CS VM=1 Geometry for Display */
export const GeometryForDisplay = new DicomTag(0x0070, 0x1B08);
/** (0070,1B11) VR=SQ VM=1 Threshold Sequence */
export const ThresholdSequence = new DicomTag(0x0070, 0x1B11);
/** (0070,1B12) VR=SQ VM=1 Threshold Value Sequence */
export const ThresholdValueSequence = new DicomTag(0x0070, 0x1B12);
/** (0070,1B13) VR=CS VM=1 Threshold Type */
export const ThresholdType = new DicomTag(0x0070, 0x1B13);
/** (0070,1B14) VR=FD VM=1 Threshold Value */
export const ThresholdValue = new DicomTag(0x0070, 0x1B14);
/** (0072,0002) VR=SH VM=1 Hanging Protocol Name */
export const HangingProtocolName = new DicomTag(0x0072, 0x0002);
/** (0072,0004) VR=LO VM=1 Hanging Protocol Description */
export const HangingProtocolDescription = new DicomTag(0x0072, 0x0004);
/** (0072,0006) VR=CS VM=1 Hanging Protocol Level */
export const HangingProtocolLevel = new DicomTag(0x0072, 0x0006);
/** (0072,0008) VR=LO VM=1 Hanging Protocol Creator */
export const HangingProtocolCreator = new DicomTag(0x0072, 0x0008);
/** (0072,000A) VR=DT VM=1 Hanging Protocol Creation DateTime */
export const HangingProtocolCreationDateTime = new DicomTag(0x0072, 0x000A);
/** (0072,000C) VR=SQ VM=1 Hanging Protocol Definition Sequence */
export const HangingProtocolDefinitionSequence = new DicomTag(0x0072, 0x000C);
/** (0072,000E) VR=SQ VM=1 Hanging Protocol User Identification Code Sequence */
export const HangingProtocolUserIdentificationCodeSequence = new DicomTag(0x0072, 0x000E);
/** (0072,0010) VR=LO VM=1 Hanging Protocol User Group Name */
export const HangingProtocolUserGroupName = new DicomTag(0x0072, 0x0010);
/** (0072,0012) VR=SQ VM=1 Source Hanging Protocol Sequence */
export const SourceHangingProtocolSequence = new DicomTag(0x0072, 0x0012);
/** (0072,0014) VR=US VM=1 Number of Priors Referenced */
export const NumberOfPriorsReferenced = new DicomTag(0x0072, 0x0014);
/** (0072,0020) VR=SQ VM=1 Image Sets Sequence */
export const ImageSetsSequence = new DicomTag(0x0072, 0x0020);
/** (0072,0022) VR=SQ VM=1 Image Set Selector Sequence */
export const ImageSetSelectorSequence = new DicomTag(0x0072, 0x0022);
/** (0072,0024) VR=CS VM=1 Image Set Selector Usage Flag */
export const ImageSetSelectorUsageFlag = new DicomTag(0x0072, 0x0024);
/** (0072,0026) VR=AT VM=1 Selector Attribute */
export const SelectorAttribute = new DicomTag(0x0072, 0x0026);
/** (0072,0028) VR=US VM=1 Selector Value Number */
export const SelectorValueNumber = new DicomTag(0x0072, 0x0028);
/** (0072,0030) VR=SQ VM=1 Time Based Image Sets Sequence */
export const TimeBasedImageSetsSequence = new DicomTag(0x0072, 0x0030);
/** (0072,0032) VR=US VM=1 Image Set Number */
export const ImageSetNumber = new DicomTag(0x0072, 0x0032);
/** (0072,0034) VR=CS VM=1 Image Set Selector Category */
export const ImageSetSelectorCategory = new DicomTag(0x0072, 0x0034);
/** (0072,0038) VR=US VM=2 Relative Time */
export const RelativeTime = new DicomTag(0x0072, 0x0038);
/** (0072,003A) VR=CS VM=1 Relative Time Units */
export const RelativeTimeUnits = new DicomTag(0x0072, 0x003A);
/** (0072,003C) VR=SS VM=2 Abstract Prior Value */
export const AbstractPriorValue = new DicomTag(0x0072, 0x003C);
/** (0072,003E) VR=SQ VM=1 Abstract Prior Code Sequence */
export const AbstractPriorCodeSequence = new DicomTag(0x0072, 0x003E);
/** (0072,0040) VR=LO VM=1 Image Set Label */
export const ImageSetLabel = new DicomTag(0x0072, 0x0040);
/** (0072,0050) VR=CS VM=1 Selector Attribute VR */
export const SelectorAttributeVR = new DicomTag(0x0072, 0x0050);
/** (0072,0052) VR=AT VM=1-n Selector Sequence Pointer */
export const SelectorSequencePointer = new DicomTag(0x0072, 0x0052);
/** (0072,0054) VR=LO VM=1-n Selector Sequence Pointer Private Creator */
export const SelectorSequencePointerPrivateCreator = new DicomTag(0x0072, 0x0054);
/** (0072,0056) VR=LO VM=1 Selector Attribute Private Creator */
export const SelectorAttributePrivateCreator = new DicomTag(0x0072, 0x0056);
/** (0072,005E) VR=AE VM=1-n Selector AE Value */
export const SelectorAEValue = new DicomTag(0x0072, 0x005E);
/** (0072,005F) VR=AS VM=1-n Selector AS Value */
export const SelectorASValue = new DicomTag(0x0072, 0x005F);
/** (0072,0060) VR=AT VM=1-n Selector AT Value */
export const SelectorATValue = new DicomTag(0x0072, 0x0060);
/** (0072,0061) VR=DA VM=1-n Selector DA Value */
export const SelectorDAValue = new DicomTag(0x0072, 0x0061);
/** (0072,0062) VR=CS VM=1-n Selector CS Value */
export const SelectorCSValue = new DicomTag(0x0072, 0x0062);
/** (0072,0063) VR=DT VM=1-n Selector DT Value */
export const SelectorDTValue = new DicomTag(0x0072, 0x0063);
/** (0072,0064) VR=IS VM=1-n Selector IS Value */
export const SelectorISValue = new DicomTag(0x0072, 0x0064);
/** (0072,0065) VR=OB VM=1 Selector OB Value */
export const SelectorOBValue = new DicomTag(0x0072, 0x0065);
/** (0072,0066) VR=LO VM=1-n Selector LO Value */
export const SelectorLOValue = new DicomTag(0x0072, 0x0066);
/** (0072,0067) VR=OF VM=1 Selector OF Value */
export const SelectorOFValue = new DicomTag(0x0072, 0x0067);
/** (0072,0068) VR=LT VM=1 Selector LT Value */
export const SelectorLTValue = new DicomTag(0x0072, 0x0068);
/** (0072,0069) VR=OW VM=1 Selector OW Value */
export const SelectorOWValue = new DicomTag(0x0072, 0x0069);
/** (0072,006A) VR=PN VM=1-n Selector PN Value */
export const SelectorPNValue = new DicomTag(0x0072, 0x006A);
/** (0072,006B) VR=TM VM=1-n Selector TM Value */
export const SelectorTMValue = new DicomTag(0x0072, 0x006B);
/** (0072,006C) VR=SH VM=1-n Selector SH Value */
export const SelectorSHValue = new DicomTag(0x0072, 0x006C);
/** (0072,006D) VR=UN VM=1 Selector UN Value */
export const SelectorUNValue = new DicomTag(0x0072, 0x006D);
/** (0072,006E) VR=ST VM=1 Selector ST Value */
export const SelectorSTValue = new DicomTag(0x0072, 0x006E);
/** (0072,006F) VR=UC VM=1-n Selector UC Value */
export const SelectorUCValue = new DicomTag(0x0072, 0x006F);
/** (0072,0070) VR=UT VM=1 Selector UT Value */
export const SelectorUTValue = new DicomTag(0x0072, 0x0070);
/** (0072,0071) VR=UR VM=1 Selector UR Value */
export const SelectorURValue = new DicomTag(0x0072, 0x0071);
/** (0072,0072) VR=DS VM=1-n Selector DS Value */
export const SelectorDSValue = new DicomTag(0x0072, 0x0072);
/** (0072,0073) VR=OD VM=1 Selector OD Value */
export const SelectorODValue = new DicomTag(0x0072, 0x0073);
/** (0072,0074) VR=FD VM=1-n Selector FD Value */
export const SelectorFDValue = new DicomTag(0x0072, 0x0074);
/** (0072,0075) VR=OL VM=1 Selector OL Value */
export const SelectorOLValue = new DicomTag(0x0072, 0x0075);
/** (0072,0076) VR=FL VM=1-n Selector FL Value */
export const SelectorFLValue = new DicomTag(0x0072, 0x0076);
/** (0072,0078) VR=UL VM=1-n Selector UL Value */
export const SelectorULValue = new DicomTag(0x0072, 0x0078);
/** (0072,007A) VR=US VM=1-n Selector US Value */
export const SelectorUSValue = new DicomTag(0x0072, 0x007A);
/** (0072,007C) VR=SL VM=1-n Selector SL Value */
export const SelectorSLValue = new DicomTag(0x0072, 0x007C);
/** (0072,007E) VR=SS VM=1-n Selector SS Value */
export const SelectorSSValue = new DicomTag(0x0072, 0x007E);
/** (0072,007F) VR=UI VM=1-n Selector UI Value */
export const SelectorUIValue = new DicomTag(0x0072, 0x007F);
/** (0072,0080) VR=SQ VM=1 Selector Code Sequence Value */
export const SelectorCodeSequenceValue = new DicomTag(0x0072, 0x0080);
/** (0072,0081) VR=OV VM=1 Selector OV Value */
export const SelectorOVValue = new DicomTag(0x0072, 0x0081);
/** (0072,0082) VR=SV VM=1-n Selector SV Value */
export const SelectorSVValue = new DicomTag(0x0072, 0x0082);
/** (0072,0083) VR=UV VM=1-n Selector UV Value */
export const SelectorUVValue = new DicomTag(0x0072, 0x0083);
/** (0072,0100) VR=US VM=1 Number of Screens */
export const NumberOfScreens = new DicomTag(0x0072, 0x0100);
/** (0072,0102) VR=SQ VM=1 Nominal Screen Definition Sequence */
export const NominalScreenDefinitionSequence = new DicomTag(0x0072, 0x0102);
/** (0072,0104) VR=US VM=1 Number of Vertical Pixels */
export const NumberOfVerticalPixels = new DicomTag(0x0072, 0x0104);
/** (0072,0106) VR=US VM=1 Number of Horizontal Pixels */
export const NumberOfHorizontalPixels = new DicomTag(0x0072, 0x0106);
/** (0072,0108) VR=FD VM=4 Display Environment Spatial Position */
export const DisplayEnvironmentSpatialPosition = new DicomTag(0x0072, 0x0108);
/** (0072,010A) VR=US VM=1 Screen Minimum Grayscale Bit Depth */
export const ScreenMinimumGrayscaleBitDepth = new DicomTag(0x0072, 0x010A);
/** (0072,010C) VR=US VM=1 Screen Minimum Color Bit Depth */
export const ScreenMinimumColorBitDepth = new DicomTag(0x0072, 0x010C);
/** (0072,010E) VR=US VM=1 Application Maximum Repaint Time */
export const ApplicationMaximumRepaintTime = new DicomTag(0x0072, 0x010E);
/** (0072,0200) VR=SQ VM=1 Display Sets Sequence */
export const DisplaySetsSequence = new DicomTag(0x0072, 0x0200);
/** (0072,0202) VR=US VM=1 Display Set Number */
export const DisplaySetNumber = new DicomTag(0x0072, 0x0202);
/** (0072,0203) VR=LO VM=1 Display Set Label */
export const DisplaySetLabel = new DicomTag(0x0072, 0x0203);
/** (0072,0204) VR=US VM=1 Display Set Presentation Group */
export const DisplaySetPresentationGroup = new DicomTag(0x0072, 0x0204);
/** (0072,0206) VR=LO VM=1 Display Set Presentation Group Description */
export const DisplaySetPresentationGroupDescription = new DicomTag(0x0072, 0x0206);
/** (0072,0208) VR=CS VM=1 Partial Data Display Handling */
export const PartialDataDisplayHandling = new DicomTag(0x0072, 0x0208);
/** (0072,0210) VR=SQ VM=1 Synchronized Scrolling Sequence */
export const SynchronizedScrollingSequence = new DicomTag(0x0072, 0x0210);
/** (0072,0212) VR=US VM=2-n Display Set Scrolling Group */
export const DisplaySetScrollingGroup = new DicomTag(0x0072, 0x0212);
/** (0072,0214) VR=SQ VM=1 Navigation Indicator Sequence */
export const NavigationIndicatorSequence = new DicomTag(0x0072, 0x0214);
/** (0072,0216) VR=US VM=1 Navigation Display Set */
export const NavigationDisplaySet = new DicomTag(0x0072, 0x0216);
/** (0072,0218) VR=US VM=1-n Reference Display Sets */
export const ReferenceDisplaySets = new DicomTag(0x0072, 0x0218);
/** (0072,0300) VR=SQ VM=1 Image Boxes Sequence */
export const ImageBoxesSequence = new DicomTag(0x0072, 0x0300);
/** (0072,0302) VR=US VM=1 Image Box Number */
export const ImageBoxNumber = new DicomTag(0x0072, 0x0302);
/** (0072,0304) VR=CS VM=1 Image Box Layout Type */
export const ImageBoxLayoutType = new DicomTag(0x0072, 0x0304);
/** (0072,0306) VR=US VM=1 Image Box Tile Horizontal Dimension */
export const ImageBoxTileHorizontalDimension = new DicomTag(0x0072, 0x0306);
/** (0072,0308) VR=US VM=1 Image Box Tile Vertical Dimension */
export const ImageBoxTileVerticalDimension = new DicomTag(0x0072, 0x0308);
/** (0072,0310) VR=CS VM=1 Image Box Scroll Direction */
export const ImageBoxScrollDirection = new DicomTag(0x0072, 0x0310);
/** (0072,0312) VR=CS VM=1 Image Box Small Scroll Type */
export const ImageBoxSmallScrollType = new DicomTag(0x0072, 0x0312);
/** (0072,0314) VR=US VM=1 Image Box Small Scroll Amount */
export const ImageBoxSmallScrollAmount = new DicomTag(0x0072, 0x0314);
/** (0072,0316) VR=CS VM=1 Image Box Large Scroll Type */
export const ImageBoxLargeScrollType = new DicomTag(0x0072, 0x0316);
/** (0072,0318) VR=US VM=1 Image Box Large Scroll Amount */
export const ImageBoxLargeScrollAmount = new DicomTag(0x0072, 0x0318);
/** (0072,0320) VR=US VM=1 Image Box Overlap Priority */
export const ImageBoxOverlapPriority = new DicomTag(0x0072, 0x0320);
/** (0072,0330) VR=FD VM=1 Cine Relative to Real-Time */
export const CineRelativeToRealTime = new DicomTag(0x0072, 0x0330);
/** (0072,0400) VR=SQ VM=1 Filter Operations Sequence */
export const FilterOperationsSequence = new DicomTag(0x0072, 0x0400);
/** (0072,0402) VR=CS VM=1 Filter-by Category */
export const FilterByCategory = new DicomTag(0x0072, 0x0402);
/** (0072,0404) VR=CS VM=1 Filter-by Attribute Presence */
export const FilterByAttributePresence = new DicomTag(0x0072, 0x0404);
/** (0072,0406) VR=CS VM=1 Filter-by Operator */
export const FilterByOperator = new DicomTag(0x0072, 0x0406);
/** (0072,0420) VR=US VM=3 Structured Display Background CIELab Value */
export const StructuredDisplayBackgroundCIELabValue = new DicomTag(0x0072, 0x0420);
/** (0072,0421) VR=US VM=3 Empty Image Box CIELab Value */
export const EmptyImageBoxCIELabValue = new DicomTag(0x0072, 0x0421);
/** (0072,0422) VR=SQ VM=1 Structured Display Image Box Sequence */
export const StructuredDisplayImageBoxSequence = new DicomTag(0x0072, 0x0422);
/** (0072,0424) VR=SQ VM=1 Structured Display Text Box Sequence */
export const StructuredDisplayTextBoxSequence = new DicomTag(0x0072, 0x0424);
/** (0072,0427) VR=SQ VM=1 Referenced First Frame Sequence */
export const ReferencedFirstFrameSequence = new DicomTag(0x0072, 0x0427);
/** (0072,0430) VR=SQ VM=1 Image Box Synchronization Sequence */
export const ImageBoxSynchronizationSequence = new DicomTag(0x0072, 0x0430);
/** (0072,0432) VR=US VM=2-n Synchronized Image Box List */
export const SynchronizedImageBoxList = new DicomTag(0x0072, 0x0432);
/** (0072,0434) VR=CS VM=1 Type of Synchronization */
export const TypeOfSynchronization = new DicomTag(0x0072, 0x0434);
/** (0072,0500) VR=CS VM=1 Blending Operation Type */
export const BlendingOperationType = new DicomTag(0x0072, 0x0500);
/** (0072,0510) VR=CS VM=1 Reformatting Operation Type */
export const ReformattingOperationType = new DicomTag(0x0072, 0x0510);
/** (0072,0512) VR=FD VM=1 Reformatting Thickness */
export const ReformattingThickness = new DicomTag(0x0072, 0x0512);
/** (0072,0514) VR=FD VM=1 Reformatting Interval */
export const ReformattingInterval = new DicomTag(0x0072, 0x0514);
/** (0072,0516) VR=CS VM=1 Reformatting Operation Initial View Direction */
export const ReformattingOperationInitialViewDirection = new DicomTag(0x0072, 0x0516);
/** (0072,0520) VR=CS VM=1-n 3D Rendering Type */
export const ThreeDRenderingType = new DicomTag(0x0072, 0x0520);
/** (0072,0600) VR=SQ VM=1 Sorting Operations Sequence */
export const SortingOperationsSequence = new DicomTag(0x0072, 0x0600);
/** (0072,0602) VR=CS VM=1 Sort-by Category */
export const SortByCategory = new DicomTag(0x0072, 0x0602);
/** (0072,0604) VR=CS VM=1 Sorting Direction */
export const SortingDirection = new DicomTag(0x0072, 0x0604);
/** (0072,0700) VR=CS VM=2 Display Set Patient Orientation */
export const DisplaySetPatientOrientation = new DicomTag(0x0072, 0x0700);
/** (0072,0702) VR=CS VM=1 VOI Type */
export const VOIType = new DicomTag(0x0072, 0x0702);
/** (0072,0704) VR=CS VM=1 Pseudo-Color Type */
export const PseudoColorType = new DicomTag(0x0072, 0x0704);
/** (0072,0705) VR=SQ VM=1 Pseudo-Color Palette Instance Reference Sequence */
export const PseudoColorPaletteInstanceReferenceSequence = new DicomTag(0x0072, 0x0705);
/** (0072,0706) VR=CS VM=1 Show Grayscale Inverted */
export const ShowGrayscaleInverted = new DicomTag(0x0072, 0x0706);
/** (0072,0710) VR=CS VM=1 Show Image True Size Flag */
export const ShowImageTrueSizeFlag = new DicomTag(0x0072, 0x0710);
/** (0072,0712) VR=CS VM=1 Show Graphic Annotation Flag */
export const ShowGraphicAnnotationFlag = new DicomTag(0x0072, 0x0712);
/** (0072,0714) VR=CS VM=1 Show Patient Demographics Flag */
export const ShowPatientDemographicsFlag = new DicomTag(0x0072, 0x0714);
/** (0072,0716) VR=CS VM=1 Show Acquisition Techniques Flag */
export const ShowAcquisitionTechniquesFlag = new DicomTag(0x0072, 0x0716);
/** (0072,0717) VR=CS VM=1 Display Set Horizontal Justification */
export const DisplaySetHorizontalJustification = new DicomTag(0x0072, 0x0717);
/** (0072,0718) VR=CS VM=1 Display Set Vertical Justification */
export const DisplaySetVerticalJustification = new DicomTag(0x0072, 0x0718);
/** (0074,0120) VR=FD VM=1 Continuation Start Meterset */
export const ContinuationStartMeterset = new DicomTag(0x0074, 0x0120);
/** (0074,0121) VR=FD VM=1 Continuation End Meterset */
export const ContinuationEndMeterset = new DicomTag(0x0074, 0x0121);
/** (0074,1000) VR=CS VM=1 Procedure Step State */
export const ProcedureStepState = new DicomTag(0x0074, 0x1000);
/** (0074,1002) VR=SQ VM=1 Procedure Step Progress Information Sequence */
export const ProcedureStepProgressInformationSequence = new DicomTag(0x0074, 0x1002);
/** (0074,1004) VR=DS VM=1 Procedure Step Progress */
export const ProcedureStepProgress = new DicomTag(0x0074, 0x1004);
/** (0074,1006) VR=ST VM=1 Procedure Step Progress Description */
export const ProcedureStepProgressDescription = new DicomTag(0x0074, 0x1006);
/** (0074,1007) VR=SQ VM=1 Procedure Step Progress Parameters Sequence */
export const ProcedureStepProgressParametersSequence = new DicomTag(0x0074, 0x1007);
/** (0074,1008) VR=SQ VM=1 Procedure Step Communications URI Sequence */
export const ProcedureStepCommunicationsURISequence = new DicomTag(0x0074, 0x1008);
/** (0074,100A) VR=UR VM=1 Contact URI */
export const ContactURI = new DicomTag(0x0074, 0x100A);
/** (0074,100C) VR=LO VM=1 Contact Display Name */
export const ContactDisplayName = new DicomTag(0x0074, 0x100C);
/** (0074,100E) VR=SQ VM=1 Procedure Step Discontinuation Reason Code Sequence */
export const ProcedureStepDiscontinuationReasonCodeSequence = new DicomTag(0x0074, 0x100E);
/** (0074,1020) VR=SQ VM=1 Beam Task Sequence */
export const BeamTaskSequence = new DicomTag(0x0074, 0x1020);
/** (0074,1022) VR=CS VM=1 Beam Task Type */
export const BeamTaskType = new DicomTag(0x0074, 0x1022);
/** (0074,1024) VR=IS VM=1 Beam Order Index (Trial) (Retired) */
export const BeamOrderIndexTrial = new DicomTag(0x0074, 0x1024);
/** (0074,1025) VR=CS VM=1 Autosequence Flag */
export const AutosequenceFlag = new DicomTag(0x0074, 0x1025);
/** (0074,1026) VR=FD VM=1 Table Top Vertical Adjusted Position */
export const TableTopVerticalAdjustedPosition = new DicomTag(0x0074, 0x1026);
/** (0074,1027) VR=FD VM=1 Table Top Longitudinal Adjusted Position */
export const TableTopLongitudinalAdjustedPosition = new DicomTag(0x0074, 0x1027);
/** (0074,1028) VR=FD VM=1 Table Top Lateral Adjusted Position */
export const TableTopLateralAdjustedPosition = new DicomTag(0x0074, 0x1028);
/** (0074,102A) VR=FD VM=1 Patient Support Adjusted Angle */
export const PatientSupportAdjustedAngle = new DicomTag(0x0074, 0x102A);
/** (0074,102B) VR=FD VM=1 Table Top Eccentric Adjusted Angle */
export const TableTopEccentricAdjustedAngle = new DicomTag(0x0074, 0x102B);
/** (0074,102C) VR=FD VM=1 Table Top Pitch Adjusted Angle */
export const TableTopPitchAdjustedAngle = new DicomTag(0x0074, 0x102C);
/** (0074,102D) VR=FD VM=1 Table Top Roll Adjusted Angle */
export const TableTopRollAdjustedAngle = new DicomTag(0x0074, 0x102D);
/** (0074,1030) VR=SQ VM=1 Delivery Verification Image Sequence */
export const DeliveryVerificationImageSequence = new DicomTag(0x0074, 0x1030);
/** (0074,1032) VR=CS VM=1 Verification Image Timing */
export const VerificationImageTiming = new DicomTag(0x0074, 0x1032);
/** (0074,1034) VR=CS VM=1 Double Exposure Flag */
export const DoubleExposureFlag = new DicomTag(0x0074, 0x1034);
/** (0074,1036) VR=CS VM=1 Double Exposure Ordering */
export const DoubleExposureOrdering = new DicomTag(0x0074, 0x1036);
/** (0074,1038) VR=DS VM=1 Double Exposure Meterset (Trial) (Retired) */
export const DoubleExposureMetersetTrial = new DicomTag(0x0074, 0x1038);
/** (0074,103A) VR=DS VM=4 Double Exposure Field Delta (Trial) (Retired) */
export const DoubleExposureFieldDeltaTrial = new DicomTag(0x0074, 0x103A);
/** (0074,1040) VR=SQ VM=1 Related Reference RT Image Sequence */
export const RelatedReferenceRTImageSequence = new DicomTag(0x0074, 0x1040);
/** (0074,1042) VR=SQ VM=1 General Machine Verification Sequence */
export const GeneralMachineVerificationSequence = new DicomTag(0x0074, 0x1042);
/** (0074,1044) VR=SQ VM=1 Conventional Machine Verification Sequence */
export const ConventionalMachineVerificationSequence = new DicomTag(0x0074, 0x1044);
/** (0074,1046) VR=SQ VM=1 Ion Machine Verification Sequence */
export const IonMachineVerificationSequence = new DicomTag(0x0074, 0x1046);
/** (0074,1048) VR=SQ VM=1 Failed Attributes Sequence */
export const FailedAttributesSequence = new DicomTag(0x0074, 0x1048);
/** (0074,104A) VR=SQ VM=1 Overridden Attributes Sequence */
export const OverriddenAttributesSequence = new DicomTag(0x0074, 0x104A);
/** (0074,104C) VR=SQ VM=1 Conventional Control Point Verification Sequence */
export const ConventionalControlPointVerificationSequence = new DicomTag(0x0074, 0x104C);
/** (0074,104E) VR=SQ VM=1 Ion Control Point Verification Sequence */
export const IonControlPointVerificationSequence = new DicomTag(0x0074, 0x104E);
/** (0074,1050) VR=SQ VM=1 Attribute Occurrence Sequence */
export const AttributeOccurrenceSequence = new DicomTag(0x0074, 0x1050);
/** (0074,1052) VR=AT VM=1 Attribute Occurrence Pointer */
export const AttributeOccurrencePointer = new DicomTag(0x0074, 0x1052);
/** (0074,1054) VR=UL VM=1 Attribute Item Selector */
export const AttributeItemSelector = new DicomTag(0x0074, 0x1054);
/** (0074,1056) VR=LO VM=1 Attribute Occurrence Private Creator */
export const AttributeOccurrencePrivateCreator = new DicomTag(0x0074, 0x1056);
/** (0074,1057) VR=IS VM=1-n Selector Sequence Pointer Items */
export const SelectorSequencePointerItems = new DicomTag(0x0074, 0x1057);
/** (0074,1200) VR=CS VM=1 Scheduled Procedure Step Priority */
export const ScheduledProcedureStepPriority = new DicomTag(0x0074, 0x1200);
/** (0074,1202) VR=LO VM=1 Worklist Label */
export const WorklistLabel = new DicomTag(0x0074, 0x1202);
/** (0074,1204) VR=LO VM=1 Procedure Step Label */
export const ProcedureStepLabel = new DicomTag(0x0074, 0x1204);
/** (0074,1210) VR=SQ VM=1 Scheduled Processing Parameters Sequence */
export const ScheduledProcessingParametersSequence = new DicomTag(0x0074, 0x1210);
/** (0074,1212) VR=SQ VM=1 Performed Processing Parameters Sequence */
export const PerformedProcessingParametersSequence = new DicomTag(0x0074, 0x1212);
/** (0074,1216) VR=SQ VM=1 Unified Procedure Step Performed Procedure Sequence */
export const UnifiedProcedureStepPerformedProcedureSequence = new DicomTag(0x0074, 0x1216);
/** (0074,1220) VR=SQ VM=1 Related Procedure Step Sequence (Retired) */
export const RelatedProcedureStepSequence = new DicomTag(0x0074, 0x1220);
/** (0074,1222) VR=LO VM=1 Procedure Step Relationship Type (Retired) */
export const ProcedureStepRelationshipType = new DicomTag(0x0074, 0x1222);
/** (0074,1224) VR=SQ VM=1 Replaced Procedure Step Sequence */
export const ReplacedProcedureStepSequence = new DicomTag(0x0074, 0x1224);
/** (0074,1230) VR=LO VM=1 Deletion Lock */
export const DeletionLock = new DicomTag(0x0074, 0x1230);
/** (0074,1234) VR=AE VM=1 Receiving AE */
export const ReceivingAE = new DicomTag(0x0074, 0x1234);
/** (0074,1236) VR=AE VM=1 Requesting AE */
export const RequestingAE = new DicomTag(0x0074, 0x1236);
/** (0074,1238) VR=LT VM=1 Reason for Cancellation */
export const ReasonForCancellation = new DicomTag(0x0074, 0x1238);
/** (0074,1242) VR=CS VM=1 SCP Status */
export const SCPStatus = new DicomTag(0x0074, 0x1242);
/** (0074,1244) VR=CS VM=1 Subscription List Status */
export const SubscriptionListStatus = new DicomTag(0x0074, 0x1244);
/** (0074,1246) VR=CS VM=1 Unified Procedure Step List Status */
export const UnifiedProcedureStepListStatus = new DicomTag(0x0074, 0x1246);
/** (0074,1324) VR=UL VM=1 Beam Order Index */
export const BeamOrderIndex = new DicomTag(0x0074, 0x1324);
/** (0074,1338) VR=FD VM=1 Double Exposure Meterset */
export const DoubleExposureMeterset = new DicomTag(0x0074, 0x1338);
/** (0074,133A) VR=FD VM=4 Double Exposure Field Delta */
export const DoubleExposureFieldDelta = new DicomTag(0x0074, 0x133A);
/** (0074,1401) VR=SQ VM=1 Brachy Task Sequence */
export const BrachyTaskSequence = new DicomTag(0x0074, 0x1401);
/** (0074,1402) VR=DS VM=1 Continuation Start Total Reference Air Kerma */
export const ContinuationStartTotalReferenceAirKerma = new DicomTag(0x0074, 0x1402);
/** (0074,1403) VR=DS VM=1 Continuation End Total Reference Air Kerma */
export const ContinuationEndTotalReferenceAirKerma = new DicomTag(0x0074, 0x1403);
/** (0074,1404) VR=IS VM=1 Continuation Pulse Number */
export const ContinuationPulseNumber = new DicomTag(0x0074, 0x1404);
/** (0074,1405) VR=SQ VM=1 Channel Delivery Order Sequence */
export const ChannelDeliveryOrderSequence = new DicomTag(0x0074, 0x1405);
/** (0074,1406) VR=IS VM=1 Referenced Channel Number */
export const ReferencedChannelNumber = new DicomTag(0x0074, 0x1406);
/** (0074,1407) VR=DS VM=1 Start Cumulative Time Weight */
export const StartCumulativeTimeWeight = new DicomTag(0x0074, 0x1407);
/** (0074,1408) VR=DS VM=1 End Cumulative Time Weight */
export const EndCumulativeTimeWeight = new DicomTag(0x0074, 0x1408);
/** (0074,1409) VR=SQ VM=1 Omitted Channel Sequence */
export const OmittedChannelSequence = new DicomTag(0x0074, 0x1409);
/** (0074,140A) VR=CS VM=1 Reason for Channel Omission */
export const ReasonForChannelOmission = new DicomTag(0x0074, 0x140A);
/** (0074,140B) VR=LO VM=1 Reason for Channel Omission Description */
export const ReasonForChannelOmissionDescription = new DicomTag(0x0074, 0x140B);
/** (0074,140C) VR=IS VM=1 Channel Delivery Order Index */
export const ChannelDeliveryOrderIndex = new DicomTag(0x0074, 0x140C);
/** (0074,140D) VR=SQ VM=1 Channel Delivery Continuation Sequence */
export const ChannelDeliveryContinuationSequence = new DicomTag(0x0074, 0x140D);
/** (0074,140E) VR=SQ VM=1 Omitted Application Setup Sequence */
export const OmittedApplicationSetupSequence = new DicomTag(0x0074, 0x140E);
/** (0076,0001) VR=LO VM=1 Implant Assembly Template Name */
export const ImplantAssemblyTemplateName = new DicomTag(0x0076, 0x0001);
/** (0076,0003) VR=LO VM=1 Implant Assembly Template Issuer */
export const ImplantAssemblyTemplateIssuer = new DicomTag(0x0076, 0x0003);
/** (0076,0006) VR=LO VM=1 Implant Assembly Template Version */
export const ImplantAssemblyTemplateVersion = new DicomTag(0x0076, 0x0006);
/** (0076,0008) VR=SQ VM=1 Replaced Implant Assembly Template Sequence */
export const ReplacedImplantAssemblyTemplateSequence = new DicomTag(0x0076, 0x0008);
/** (0076,000A) VR=CS VM=1 Implant Assembly Template Type */
export const ImplantAssemblyTemplateType = new DicomTag(0x0076, 0x000A);
/** (0076,000C) VR=SQ VM=1 Original Implant Assembly Template Sequence */
export const OriginalImplantAssemblyTemplateSequence = new DicomTag(0x0076, 0x000C);
/** (0076,000E) VR=SQ VM=1 Derivation Implant Assembly Template Sequence */
export const DerivationImplantAssemblyTemplateSequence = new DicomTag(0x0076, 0x000E);
/** (0076,0010) VR=SQ VM=1 Implant Assembly Template Target Anatomy Sequence */
export const ImplantAssemblyTemplateTargetAnatomySequence = new DicomTag(0x0076, 0x0010);
/** (0076,0020) VR=SQ VM=1 Procedure Type Code Sequence */
export const ProcedureTypeCodeSequence = new DicomTag(0x0076, 0x0020);
/** (0076,0030) VR=LO VM=1 Surgical Technique */
export const SurgicalTechnique = new DicomTag(0x0076, 0x0030);
/** (0076,0032) VR=SQ VM=1 Component Types Sequence */
export const ComponentTypesSequence = new DicomTag(0x0076, 0x0032);
/** (0076,0034) VR=SQ VM=1 Component Type Code Sequence */
export const ComponentTypeCodeSequence = new DicomTag(0x0076, 0x0034);
/** (0076,0036) VR=CS VM=1 Exclusive Component Type */
export const ExclusiveComponentType = new DicomTag(0x0076, 0x0036);
/** (0076,0038) VR=CS VM=1 Mandatory Component Type */
export const MandatoryComponentType = new DicomTag(0x0076, 0x0038);
/** (0076,0040) VR=SQ VM=1 Component Sequence */
export const ComponentSequence = new DicomTag(0x0076, 0x0040);
/** (0076,0055) VR=US VM=1 Component ID */
export const ComponentID = new DicomTag(0x0076, 0x0055);
/** (0076,0060) VR=SQ VM=1 Component Assembly Sequence */
export const ComponentAssemblySequence = new DicomTag(0x0076, 0x0060);
/** (0076,0070) VR=US VM=1 Component 1 Referenced ID */
export const Component1ReferencedID = new DicomTag(0x0076, 0x0070);
/** (0076,0080) VR=US VM=1 Component 1 Referenced Mating Feature Set ID */
export const Component1ReferencedMatingFeatureSetID = new DicomTag(0x0076, 0x0080);
/** (0076,0090) VR=US VM=1 Component 1 Referenced Mating Feature ID */
export const Component1ReferencedMatingFeatureID = new DicomTag(0x0076, 0x0090);
/** (0076,00A0) VR=US VM=1 Component 2 Referenced ID */
export const Component2ReferencedID = new DicomTag(0x0076, 0x00A0);
/** (0076,00B0) VR=US VM=1 Component 2 Referenced Mating Feature Set ID */
export const Component2ReferencedMatingFeatureSetID = new DicomTag(0x0076, 0x00B0);
/** (0076,00C0) VR=US VM=1 Component 2 Referenced Mating Feature ID */
export const Component2ReferencedMatingFeatureID = new DicomTag(0x0076, 0x00C0);
/** (0078,0001) VR=LO VM=1 Implant Template Group Name */
export const ImplantTemplateGroupName = new DicomTag(0x0078, 0x0001);
/** (0078,0010) VR=ST VM=1 Implant Template Group Description */
export const ImplantTemplateGroupDescription = new DicomTag(0x0078, 0x0010);
/** (0078,0020) VR=LO VM=1 Implant Template Group Issuer */
export const ImplantTemplateGroupIssuer = new DicomTag(0x0078, 0x0020);
/** (0078,0024) VR=LO VM=1 Implant Template Group Version */
export const ImplantTemplateGroupVersion = new DicomTag(0x0078, 0x0024);
/** (0078,0026) VR=SQ VM=1 Replaced Implant Template Group Sequence */
export const ReplacedImplantTemplateGroupSequence = new DicomTag(0x0078, 0x0026);
/** (0078,0028) VR=SQ VM=1 Implant Template Group Target Anatomy Sequence */
export const ImplantTemplateGroupTargetAnatomySequence = new DicomTag(0x0078, 0x0028);
/** (0078,002A) VR=SQ VM=1 Implant Template Group Members Sequence */
export const ImplantTemplateGroupMembersSequence = new DicomTag(0x0078, 0x002A);
/** (0078,002E) VR=US VM=1 Implant Template Group Member ID */
export const ImplantTemplateGroupMemberID = new DicomTag(0x0078, 0x002E);
/** (0078,0050) VR=FD VM=3 3D Implant Template Group Member Matching Point */
export const ThreeDImplantTemplateGroupMemberMatchingPoint = new DicomTag(0x0078, 0x0050);
/** (0078,0060) VR=FD VM=9 3D Implant Template Group Member Matching Axes */
export const ThreeDImplantTemplateGroupMemberMatchingAxes = new DicomTag(0x0078, 0x0060);
/** (0078,0070) VR=SQ VM=1 Implant Template Group Member Matching 2D Coordinates Sequence */
export const ImplantTemplateGroupMemberMatching2DCoordinatesSequence = new DicomTag(0x0078, 0x0070);
/** (0078,0090) VR=FD VM=2 2D Implant Template Group Member Matching Point */
export const TwoDImplantTemplateGroupMemberMatchingPoint = new DicomTag(0x0078, 0x0090);
/** (0078,00A0) VR=FD VM=4 2D Implant Template Group Member Matching Axes */
export const TwoDImplantTemplateGroupMemberMatchingAxes = new DicomTag(0x0078, 0x00A0);
/** (0078,00B0) VR=SQ VM=1 Implant Template Group Variation Dimension Sequence */
export const ImplantTemplateGroupVariationDimensionSequence = new DicomTag(0x0078, 0x00B0);
/** (0078,00B2) VR=LO VM=1 Implant Template Group Variation Dimension Name */
export const ImplantTemplateGroupVariationDimensionName = new DicomTag(0x0078, 0x00B2);
/** (0078,00B4) VR=SQ VM=1 Implant Template Group Variation Dimension Rank Sequence */
export const ImplantTemplateGroupVariationDimensionRankSequence = new DicomTag(0x0078, 0x00B4);
/** (0078,00B6) VR=US VM=1 Referenced Implant Template Group Member ID */
export const ReferencedImplantTemplateGroupMemberID = new DicomTag(0x0078, 0x00B6);
/** (0078,00B8) VR=US VM=1 Implant Template Group Variation Dimension Rank */
export const ImplantTemplateGroupVariationDimensionRank = new DicomTag(0x0078, 0x00B8);
/** (0080,0001) VR=SQ VM=1 Surface Scan Acquisition Type Code Sequence */
export const SurfaceScanAcquisitionTypeCodeSequence = new DicomTag(0x0080, 0x0001);
/** (0080,0002) VR=SQ VM=1 Surface Scan Mode Code Sequence */
export const SurfaceScanModeCodeSequence = new DicomTag(0x0080, 0x0002);
/** (0080,0003) VR=SQ VM=1 Registration Method Code Sequence */
export const RegistrationMethodCodeSequence = new DicomTag(0x0080, 0x0003);
/** (0080,0004) VR=FD VM=1 Shot Duration Time */
export const ShotDurationTime = new DicomTag(0x0080, 0x0004);
/** (0080,0005) VR=FD VM=1 Shot Offset Time */
export const ShotOffsetTime = new DicomTag(0x0080, 0x0005);
/** (0080,0006) VR=US VM=1-n Surface Point Presentation Value Data */
export const SurfacePointPresentationValueData = new DicomTag(0x0080, 0x0006);
/** (0080,0007) VR=US VM=3-3n Surface Point Color CIELab Value Data */
export const SurfacePointColorCIELabValueData = new DicomTag(0x0080, 0x0007);
/** (0080,0008) VR=SQ VM=1 UV Mapping Sequence */
export const UVMappingSequence = new DicomTag(0x0080, 0x0008);
/** (0080,0009) VR=SH VM=1 Texture Label */
export const TextureLabel = new DicomTag(0x0080, 0x0009);
/** (0080,0010) VR=OF VM=1 U Value Data */
export const UValueData = new DicomTag(0x0080, 0x0010);
/** (0080,0011) VR=OF VM=1 V Value Data */
export const VValueData = new DicomTag(0x0080, 0x0011);
/** (0080,0012) VR=SQ VM=1 Referenced Texture Sequence */
export const ReferencedTextureSequence = new DicomTag(0x0080, 0x0012);
/** (0080,0013) VR=SQ VM=1 Referenced Surface Data Sequence */
export const ReferencedSurfaceDataSequence = new DicomTag(0x0080, 0x0013);
/** (0082,0001) VR=CS VM=1 Assessment Summary */
export const AssessmentSummary = new DicomTag(0x0082, 0x0001);
/** (0082,0003) VR=UT VM=1 Assessment Summary Description */
export const AssessmentSummaryDescription = new DicomTag(0x0082, 0x0003);
/** (0082,0004) VR=SQ VM=1 Assessed SOP Instance Sequence */
export const AssessedSOPInstanceSequence = new DicomTag(0x0082, 0x0004);
/** (0082,0005) VR=SQ VM=1 Referenced Comparison SOP Instance Sequence */
export const ReferencedComparisonSOPInstanceSequence = new DicomTag(0x0082, 0x0005);
/** (0082,0006) VR=UL VM=1 Number of Assessment Observations */
export const NumberOfAssessmentObservations = new DicomTag(0x0082, 0x0006);
/** (0082,0007) VR=SQ VM=1 Assessment Observations Sequence */
export const AssessmentObservationsSequence = new DicomTag(0x0082, 0x0007);
/** (0082,0008) VR=CS VM=1 Observation Significance */
export const ObservationSignificance = new DicomTag(0x0082, 0x0008);
/** (0082,000A) VR=UT VM=1 Observation Description */
export const ObservationDescription = new DicomTag(0x0082, 0x000A);
/** (0082,000C) VR=SQ VM=1 Structured Constraint Observation Sequence */
export const StructuredConstraintObservationSequence = new DicomTag(0x0082, 0x000C);
/** (0082,0010) VR=SQ VM=1 Assessed Attribute Value Sequence */
export const AssessedAttributeValueSequence = new DicomTag(0x0082, 0x0010);
/** (0082,0016) VR=LO VM=1 Assessment Set ID */
export const AssessmentSetID = new DicomTag(0x0082, 0x0016);
/** (0082,0017) VR=SQ VM=1 Assessment Requester Sequence */
export const AssessmentRequesterSequence = new DicomTag(0x0082, 0x0017);
/** (0082,0018) VR=LO VM=1 Selector Attribute Name */
export const SelectorAttributeName = new DicomTag(0x0082, 0x0018);
/** (0082,0019) VR=LO VM=1 Selector Attribute Keyword */
export const SelectorAttributeKeyword = new DicomTag(0x0082, 0x0019);
/** (0082,0021) VR=SQ VM=1 Assessment Type Code Sequence */
export const AssessmentTypeCodeSequence = new DicomTag(0x0082, 0x0021);
/** (0082,0022) VR=SQ VM=1 Observation Basis Code Sequence */
export const ObservationBasisCodeSequence = new DicomTag(0x0082, 0x0022);
/** (0082,0023) VR=LO VM=1 Assessment Label */
export const AssessmentLabel = new DicomTag(0x0082, 0x0023);
/** (0082,0032) VR=CS VM=1 Constraint Type */
export const ConstraintType = new DicomTag(0x0082, 0x0032);
/** (0082,0033) VR=UT VM=1 Specification Selection Guidance */
export const SpecificationSelectionGuidance = new DicomTag(0x0082, 0x0033);
/** (0082,0034) VR=SQ VM=1 Constraint Value Sequence */
export const ConstraintValueSequence = new DicomTag(0x0082, 0x0034);
/** (0082,0035) VR=SQ VM=1 Recommended Default Value Sequence */
export const RecommendedDefaultValueSequence = new DicomTag(0x0082, 0x0035);
/** (0082,0036) VR=CS VM=1 Constraint Violation Significance */
export const ConstraintViolationSignificance = new DicomTag(0x0082, 0x0036);
/** (0082,0037) VR=UT VM=1 Constraint Violation Condition */
export const ConstraintViolationCondition = new DicomTag(0x0082, 0x0037);
/** (0082,0038) VR=CS VM=1 Modifiable Constraint Flag */
export const ModifiableConstraintFlag = new DicomTag(0x0082, 0x0038);
/** (0088,0130) VR=SH VM=1 Storage Media File-set ID */
export const StorageMediaFileSetID = new DicomTag(0x0088, 0x0130);
/** (0088,0140) VR=UI VM=1 Storage Media File-set UID */
export const StorageMediaFileSetUID = new DicomTag(0x0088, 0x0140);
/** (0088,0200) VR=SQ VM=1 Icon Image Sequence */
export const IconImageSequence = new DicomTag(0x0088, 0x0200);
/** (0088,0904) VR=LO VM=1 Topic Title (Retired) */
export const TopicTitle = new DicomTag(0x0088, 0x0904);
/** (0088,0906) VR=ST VM=1 Topic Subject (Retired) */
export const TopicSubject = new DicomTag(0x0088, 0x0906);
/** (0088,0910) VR=LO VM=1 Topic Author (Retired) */
export const TopicAuthor = new DicomTag(0x0088, 0x0910);
/** (0088,0912) VR=LO VM=1-32 Topic Keywords (Retired) */
export const TopicKeywords = new DicomTag(0x0088, 0x0912);
/** (0100,0410) VR=CS VM=1 SOP Instance Status */
export const SOPInstanceStatus = new DicomTag(0x0100, 0x0410);
/** (0100,0420) VR=DT VM=1 SOP Authorization DateTime */
export const SOPAuthorizationDateTime = new DicomTag(0x0100, 0x0420);
/** (0100,0424) VR=LT VM=1 SOP Authorization Comment */
export const SOPAuthorizationComment = new DicomTag(0x0100, 0x0424);
/** (0100,0426) VR=LO VM=1 Authorization Equipment Certification Number */
export const AuthorizationEquipmentCertificationNumber = new DicomTag(0x0100, 0x0426);
/** (0400,0005) VR=US VM=1 MAC ID Number */
export const MACIDNumber = new DicomTag(0x0400, 0x0005);
/** (0400,0010) VR=UI VM=1 MAC Calculation Transfer Syntax UID */
export const MACCalculationTransferSyntaxUID = new DicomTag(0x0400, 0x0010);
/** (0400,0015) VR=CS VM=1 MAC Algorithm */
export const MACAlgorithm = new DicomTag(0x0400, 0x0015);
/** (0400,0020) VR=AT VM=1-n Data Elements Signed */
export const DataElementsSigned = new DicomTag(0x0400, 0x0020);
/** (0400,0100) VR=UI VM=1 Digital Signature UID */
export const DigitalSignatureUID = new DicomTag(0x0400, 0x0100);
/** (0400,0105) VR=DT VM=1 Digital Signature DateTime */
export const DigitalSignatureDateTime = new DicomTag(0x0400, 0x0105);
/** (0400,0110) VR=CS VM=1 Certificate Type */
export const CertificateType = new DicomTag(0x0400, 0x0110);
/** (0400,0115) VR=OB VM=1 Certificate of Signer */
export const CertificateOfSigner = new DicomTag(0x0400, 0x0115);
/** (0400,0120) VR=OB VM=1 Signature */
export const Signature = new DicomTag(0x0400, 0x0120);
/** (0400,0305) VR=CS VM=1 Certified Timestamp Type */
export const CertifiedTimestampType = new DicomTag(0x0400, 0x0305);
/** (0400,0310) VR=OB VM=1 Certified Timestamp */
export const CertifiedTimestamp = new DicomTag(0x0400, 0x0310);
/** (0400,0401) VR=SQ VM=1 Digital Signature Purpose Code Sequence */
export const DigitalSignaturePurposeCodeSequence = new DicomTag(0x0400, 0x0401);
/** (0400,0402) VR=SQ VM=1 Referenced Digital Signature Sequence */
export const ReferencedDigitalSignatureSequence = new DicomTag(0x0400, 0x0402);
/** (0400,0403) VR=SQ VM=1 Referenced SOP Instance MAC Sequence */
export const ReferencedSOPInstanceMACSequence = new DicomTag(0x0400, 0x0403);
/** (0400,0404) VR=OB VM=1 MAC */
export const MAC = new DicomTag(0x0400, 0x0404);
/** (0400,0500) VR=SQ VM=1 Encrypted Attributes Sequence */
export const EncryptedAttributesSequence = new DicomTag(0x0400, 0x0500);
/** (0400,0510) VR=UI VM=1 Encrypted Content Transfer Syntax UID */
export const EncryptedContentTransferSyntaxUID = new DicomTag(0x0400, 0x0510);
/** (0400,0520) VR=OB VM=1 Encrypted Content */
export const EncryptedContent = new DicomTag(0x0400, 0x0520);
/** (0400,0550) VR=SQ VM=1 Modified Attributes Sequence */
export const ModifiedAttributesSequence = new DicomTag(0x0400, 0x0550);
/** (0400,0551) VR=SQ VM=1 Nonconforming Modified Attributes Sequence */
export const NonconformingModifiedAttributesSequence = new DicomTag(0x0400, 0x0551);
/** (0400,0552) VR=OB VM=1 Nonconforming Data Element Value */
export const NonconformingDataElementValue = new DicomTag(0x0400, 0x0552);
/** (0400,0561) VR=SQ VM=1 Original Attributes Sequence */
export const OriginalAttributesSequence = new DicomTag(0x0400, 0x0561);
/** (0400,0562) VR=DT VM=1 Attribute Modification DateTime */
export const AttributeModificationDateTime = new DicomTag(0x0400, 0x0562);
/** (0400,0563) VR=LO VM=1 Modifying System */
export const ModifyingSystem = new DicomTag(0x0400, 0x0563);
/** (0400,0564) VR=LO VM=1 Source of Previous Values */
export const SourceOfPreviousValues = new DicomTag(0x0400, 0x0564);
/** (0400,0565) VR=CS VM=1 Reason for the Attribute Modification */
export const ReasonForTheAttributeModification = new DicomTag(0x0400, 0x0565);
/** (0400,0600) VR=CS VM=1 Instance Origin Status */
export const InstanceOriginStatus = new DicomTag(0x0400, 0x0600);
/** (2000,0010) VR=IS VM=1 Number of Copies */
export const NumberOfCopies = new DicomTag(0x2000, 0x0010);
/** (2000,001E) VR=SQ VM=1 Printer Configuration Sequence */
export const PrinterConfigurationSequence = new DicomTag(0x2000, 0x001E);
/** (2000,0020) VR=CS VM=1 Print Priority */
export const PrintPriority = new DicomTag(0x2000, 0x0020);
/** (2000,0030) VR=CS VM=1 Medium Type */
export const MediumType = new DicomTag(0x2000, 0x0030);
/** (2000,0040) VR=CS VM=1 Film Destination */
export const FilmDestination = new DicomTag(0x2000, 0x0040);
/** (2000,0050) VR=LO VM=1 Film Session Label */
export const FilmSessionLabel = new DicomTag(0x2000, 0x0050);
/** (2000,0060) VR=IS VM=1 Memory Allocation */
export const MemoryAllocation = new DicomTag(0x2000, 0x0060);
/** (2000,0061) VR=IS VM=1 Maximum Memory Allocation */
export const MaximumMemoryAllocation = new DicomTag(0x2000, 0x0061);
/** (2000,0062) VR=CS VM=1 Color Image Printing Flag (Retired) */
export const ColorImagePrintingFlag = new DicomTag(0x2000, 0x0062);
/** (2000,0063) VR=CS VM=1 Collation Flag (Retired) */
export const CollationFlag = new DicomTag(0x2000, 0x0063);
/** (2000,0065) VR=CS VM=1 Annotation Flag (Retired) */
export const AnnotationFlag = new DicomTag(0x2000, 0x0065);
/** (2000,0067) VR=CS VM=1 Image Overlay Flag (Retired) */
export const ImageOverlayFlag = new DicomTag(0x2000, 0x0067);
/** (2000,0069) VR=CS VM=1 Presentation LUT Flag (Retired) */
export const PresentationLUTFlag = new DicomTag(0x2000, 0x0069);
/** (2000,006A) VR=CS VM=1 Image Box Presentation LUT Flag (Retired) */
export const ImageBoxPresentationLUTFlag = new DicomTag(0x2000, 0x006A);
/** (2000,00A0) VR=US VM=1 Memory Bit Depth */
export const MemoryBitDepth = new DicomTag(0x2000, 0x00A0);
/** (2000,00A1) VR=US VM=1 Printing Bit Depth */
export const PrintingBitDepth = new DicomTag(0x2000, 0x00A1);
/** (2000,00A2) VR=SQ VM=1 Media Installed Sequence */
export const MediaInstalledSequence = new DicomTag(0x2000, 0x00A2);
/** (2000,00A4) VR=SQ VM=1 Other Media Available Sequence */
export const OtherMediaAvailableSequence = new DicomTag(0x2000, 0x00A4);
/** (2000,00A8) VR=SQ VM=1 Supported Image Display Formats Sequence */
export const SupportedImageDisplayFormatsSequence = new DicomTag(0x2000, 0x00A8);
/** (2000,0500) VR=SQ VM=1 Referenced Film Box Sequence */
export const ReferencedFilmBoxSequence = new DicomTag(0x2000, 0x0500);
/** (2000,0510) VR=SQ VM=1 Referenced Stored Print Sequence (Retired) */
export const ReferencedStoredPrintSequence = new DicomTag(0x2000, 0x0510);
/** (2010,0010) VR=ST VM=1 Image Display Format */
export const ImageDisplayFormat = new DicomTag(0x2010, 0x0010);
/** (2010,0030) VR=CS VM=1 Annotation Display Format ID */
export const AnnotationDisplayFormatID = new DicomTag(0x2010, 0x0030);
/** (2010,0040) VR=CS VM=1 Film Orientation */
export const FilmOrientation = new DicomTag(0x2010, 0x0040);
/** (2010,0050) VR=CS VM=1 Film Size ID */
export const FilmSizeID = new DicomTag(0x2010, 0x0050);
/** (2010,0052) VR=CS VM=1 Printer Resolution ID */
export const PrinterResolutionID = new DicomTag(0x2010, 0x0052);
/** (2010,0054) VR=CS VM=1 Default Printer Resolution ID */
export const DefaultPrinterResolutionID = new DicomTag(0x2010, 0x0054);
/** (2010,0060) VR=CS VM=1 Magnification Type */
export const MagnificationType = new DicomTag(0x2010, 0x0060);
/** (2010,0080) VR=CS VM=1 Smoothing Type */
export const SmoothingType = new DicomTag(0x2010, 0x0080);
/** (2010,00A6) VR=CS VM=1 Default Magnification Type */
export const DefaultMagnificationType = new DicomTag(0x2010, 0x00A6);
/** (2010,00A7) VR=CS VM=1-n Other Magnification Types Available */
export const OtherMagnificationTypesAvailable = new DicomTag(0x2010, 0x00A7);
/** (2010,00A8) VR=CS VM=1 Default Smoothing Type */
export const DefaultSmoothingType = new DicomTag(0x2010, 0x00A8);
/** (2010,00A9) VR=CS VM=1-n Other Smoothing Types Available */
export const OtherSmoothingTypesAvailable = new DicomTag(0x2010, 0x00A9);
/** (2010,0100) VR=CS VM=1 Border Density */
export const BorderDensity = new DicomTag(0x2010, 0x0100);
/** (2010,0110) VR=CS VM=1 Empty Image Density */
export const EmptyImageDensity = new DicomTag(0x2010, 0x0110);
/** (2010,0120) VR=US VM=1 Min Density */
export const MinDensity = new DicomTag(0x2010, 0x0120);
/** (2010,0130) VR=US VM=1 Max Density */
export const MaxDensity = new DicomTag(0x2010, 0x0130);
/** (2010,0140) VR=CS VM=1 Trim */
export const Trim = new DicomTag(0x2010, 0x0140);
/** (2010,0150) VR=ST VM=1 Configuration Information */
export const ConfigurationInformation = new DicomTag(0x2010, 0x0150);
/** (2010,0152) VR=LT VM=1 Configuration Information Description */
export const ConfigurationInformationDescription = new DicomTag(0x2010, 0x0152);
/** (2010,0154) VR=IS VM=1 Maximum Collated Films */
export const MaximumCollatedFilms = new DicomTag(0x2010, 0x0154);
/** (2010,015E) VR=US VM=1 Illumination */
export const Illumination = new DicomTag(0x2010, 0x015E);
/** (2010,0160) VR=US VM=1 Reflected Ambient Light */
export const ReflectedAmbientLight = new DicomTag(0x2010, 0x0160);
/** (2010,0376) VR=DS VM=2 Printer Pixel Spacing */
export const PrinterPixelSpacing = new DicomTag(0x2010, 0x0376);
/** (2010,0500) VR=SQ VM=1 Referenced Film Session Sequence */
export const ReferencedFilmSessionSequence = new DicomTag(0x2010, 0x0500);
/** (2010,0510) VR=SQ VM=1 Referenced Image Box Sequence */
export const ReferencedImageBoxSequence = new DicomTag(0x2010, 0x0510);
/** (2010,0520) VR=SQ VM=1 Referenced Basic Annotation Box Sequence */
export const ReferencedBasicAnnotationBoxSequence = new DicomTag(0x2010, 0x0520);
/** (2020,0010) VR=US VM=1 Image Box Position */
export const ImageBoxPosition = new DicomTag(0x2020, 0x0010);
/** (2020,0020) VR=CS VM=1 Polarity */
export const Polarity = new DicomTag(0x2020, 0x0020);
/** (2020,0030) VR=DS VM=1 Requested Image Size */
export const RequestedImageSize = new DicomTag(0x2020, 0x0030);
/** (2020,0040) VR=CS VM=1 Requested Decimate/Crop Behavior */
export const RequestedDecimateCropBehavior = new DicomTag(0x2020, 0x0040);
/** (2020,0050) VR=CS VM=1 Requested Resolution ID */
export const RequestedResolutionID = new DicomTag(0x2020, 0x0050);
/** (2020,00A0) VR=CS VM=1 Requested Image Size Flag */
export const RequestedImageSizeFlag = new DicomTag(0x2020, 0x00A0);
/** (2020,00A2) VR=CS VM=1 Decimate/Crop Result */
export const DecimateCropResult = new DicomTag(0x2020, 0x00A2);
/** (2020,0110) VR=SQ VM=1 Basic Grayscale Image Sequence */
export const BasicGrayscaleImageSequence = new DicomTag(0x2020, 0x0110);
/** (2020,0111) VR=SQ VM=1 Basic Color Image Sequence */
export const BasicColorImageSequence = new DicomTag(0x2020, 0x0111);
/** (2020,0130) VR=SQ VM=1 Referenced Image Overlay Box Sequence (Retired) */
export const ReferencedImageOverlayBoxSequence = new DicomTag(0x2020, 0x0130);
/** (2020,0140) VR=SQ VM=1 Referenced VOI LUT Box Sequence (Retired) */
export const ReferencedVOILUTBoxSequence = new DicomTag(0x2020, 0x0140);
/** (2030,0010) VR=US VM=1 Annotation Position */
export const AnnotationPosition = new DicomTag(0x2030, 0x0010);
/** (2030,0020) VR=LO VM=1 Text String */
export const TextString = new DicomTag(0x2030, 0x0020);
/** (2040,0010) VR=SQ VM=1 Referenced Overlay Plane Sequence (Retired) */
export const ReferencedOverlayPlaneSequence = new DicomTag(0x2040, 0x0010);
/** (2040,0011) VR=US VM=1-99 Referenced Overlay Plane Groups (Retired) */
export const ReferencedOverlayPlaneGroups = new DicomTag(0x2040, 0x0011);
/** (2040,0020) VR=SQ VM=1 Overlay Pixel Data Sequence (Retired) */
export const OverlayPixelDataSequence = new DicomTag(0x2040, 0x0020);
/** (2040,0060) VR=CS VM=1 Overlay Magnification Type (Retired) */
export const OverlayMagnificationType = new DicomTag(0x2040, 0x0060);
/** (2040,0070) VR=CS VM=1 Overlay Smoothing Type (Retired) */
export const OverlaySmoothingType = new DicomTag(0x2040, 0x0070);
/** (2040,0072) VR=CS VM=1 Overlay or Image Magnification (Retired) */
export const OverlayOrImageMagnification = new DicomTag(0x2040, 0x0072);
/** (2040,0074) VR=US VM=1 Magnify to Number of Columns (Retired) */
export const MagnifyToNumberOfColumns = new DicomTag(0x2040, 0x0074);
/** (2040,0080) VR=CS VM=1 Overlay Foreground Density (Retired) */
export const OverlayForegroundDensity = new DicomTag(0x2040, 0x0080);
/** (2040,0082) VR=CS VM=1 Overlay Background Density (Retired) */
export const OverlayBackgroundDensity = new DicomTag(0x2040, 0x0082);
/** (2040,0090) VR=CS VM=1 Overlay Mode (Retired) */
export const OverlayMode = new DicomTag(0x2040, 0x0090);
/** (2040,0100) VR=CS VM=1 Threshold Density (Retired) */
export const ThresholdDensity = new DicomTag(0x2040, 0x0100);
/** (2040,0500) VR=SQ VM=1 Referenced Image Box Sequence (Retired) (Retired) */
export const ReferencedImageBoxSequenceRetired = new DicomTag(0x2040, 0x0500);
/** (2050,0010) VR=SQ VM=1 Presentation LUT Sequence */
export const PresentationLUTSequence = new DicomTag(0x2050, 0x0010);
/** (2050,0020) VR=CS VM=1 Presentation LUT Shape */
export const PresentationLUTShape = new DicomTag(0x2050, 0x0020);
/** (2050,0500) VR=SQ VM=1 Referenced Presentation LUT Sequence */
export const ReferencedPresentationLUTSequence = new DicomTag(0x2050, 0x0500);
/** (2100,0010) VR=SH VM=1 Print Job ID (Retired) */
export const PrintJobID = new DicomTag(0x2100, 0x0010);
/** (2100,0020) VR=CS VM=1 Execution Status */
export const ExecutionStatus = new DicomTag(0x2100, 0x0020);
/** (2100,0030) VR=CS VM=1 Execution Status Info */
export const ExecutionStatusInfo = new DicomTag(0x2100, 0x0030);
/** (2100,0040) VR=DA VM=1 Creation Date */
export const CreationDate = new DicomTag(0x2100, 0x0040);
/** (2100,0050) VR=TM VM=1 Creation Time */
export const CreationTime = new DicomTag(0x2100, 0x0050);
/** (2100,0070) VR=AE VM=1 Originator */
export const Originator = new DicomTag(0x2100, 0x0070);
/** (2100,0140) VR=AE VM=1 Destination AE */
export const DestinationAE = new DicomTag(0x2100, 0x0140);
/** (2100,0160) VR=SH VM=1 Owner ID */
export const OwnerID = new DicomTag(0x2100, 0x0160);
/** (2100,0170) VR=IS VM=1 Number of Films */
export const NumberOfFilms = new DicomTag(0x2100, 0x0170);
/** (2100,0500) VR=SQ VM=1 Referenced Print Job Sequence (Pull Stored Print) (Retired) */
export const ReferencedPrintJobSequencePullStoredPrint = new DicomTag(0x2100, 0x0500);
/** (2110,0010) VR=CS VM=1 Printer Status */
export const PrinterStatus = new DicomTag(0x2110, 0x0010);
/** (2110,0020) VR=CS VM=1 Printer Status Info */
export const PrinterStatusInfo = new DicomTag(0x2110, 0x0020);
/** (2110,0030) VR=LO VM=1 Printer Name */
export const PrinterName = new DicomTag(0x2110, 0x0030);
/** (2110,0099) VR=SH VM=1 Print Queue ID (Retired) */
export const PrintQueueID = new DicomTag(0x2110, 0x0099);
/** (2120,0010) VR=CS VM=1 Queue Status (Retired) */
export const QueueStatus = new DicomTag(0x2120, 0x0010);
/** (2120,0050) VR=SQ VM=1 Print Job Description Sequence (Retired) */
export const PrintJobDescriptionSequence = new DicomTag(0x2120, 0x0050);
/** (2120,0070) VR=SQ VM=1 Referenced Print Job Sequence (Retired) */
export const ReferencedPrintJobSequence = new DicomTag(0x2120, 0x0070);
/** (2130,0010) VR=SQ VM=1 Print Management Capabilities Sequence (Retired) */
export const PrintManagementCapabilitiesSequence = new DicomTag(0x2130, 0x0010);
/** (2130,0015) VR=SQ VM=1 Printer Characteristics Sequence (Retired) */
export const PrinterCharacteristicsSequence = new DicomTag(0x2130, 0x0015);
/** (2130,0030) VR=SQ VM=1 Film Box Content Sequence (Retired) */
export const FilmBoxContentSequence = new DicomTag(0x2130, 0x0030);
/** (2130,0040) VR=SQ VM=1 Image Box Content Sequence (Retired) */
export const ImageBoxContentSequence = new DicomTag(0x2130, 0x0040);
/** (2130,0050) VR=SQ VM=1 Annotation Content Sequence (Retired) */
export const AnnotationContentSequence = new DicomTag(0x2130, 0x0050);
/** (2130,0060) VR=SQ VM=1 Image Overlay Box Content Sequence (Retired) */
export const ImageOverlayBoxContentSequence = new DicomTag(0x2130, 0x0060);
/** (2130,0080) VR=SQ VM=1 Presentation LUT Content Sequence (Retired) */
export const PresentationLUTContentSequence = new DicomTag(0x2130, 0x0080);
/** (2130,00A0) VR=SQ VM=1 Proposed Study Sequence */
export const ProposedStudySequence = new DicomTag(0x2130, 0x00A0);
/** (2130,00C0) VR=SQ VM=1 Original Image Sequence */
export const OriginalImageSequence = new DicomTag(0x2130, 0x00C0);
/** (2200,0001) VR=CS VM=1 Label Using Information Extracted From Instances */
export const LabelUsingInformationExtractedFromInstances = new DicomTag(0x2200, 0x0001);
/** (2200,0002) VR=UT VM=1 Label Text */
export const LabelText = new DicomTag(0x2200, 0x0002);
/** (2200,0003) VR=CS VM=1 Label Style Selection */
export const LabelStyleSelection = new DicomTag(0x2200, 0x0003);
/** (2200,0004) VR=LT VM=1 Media Disposition */
export const MediaDisposition = new DicomTag(0x2200, 0x0004);
/** (2200,0005) VR=LT VM=1 Barcode Value */
export const BarcodeValue = new DicomTag(0x2200, 0x0005);
/** (2200,0006) VR=CS VM=1 Barcode Symbology */
export const BarcodeSymbology = new DicomTag(0x2200, 0x0006);
/** (2200,0007) VR=CS VM=1 Allow Media Splitting */
export const AllowMediaSplitting = new DicomTag(0x2200, 0x0007);
/** (2200,0008) VR=CS VM=1 Include Non-DICOM Objects */
export const IncludeNonDICOMObjects = new DicomTag(0x2200, 0x0008);
/** (2200,0009) VR=CS VM=1 Include Display Application */
export const IncludeDisplayApplication = new DicomTag(0x2200, 0x0009);
/** (2200,000A) VR=CS VM=1 Preserve Composite Instances After Media Creation */
export const PreserveCompositeInstancesAfterMediaCreation = new DicomTag(0x2200, 0x000A);
/** (2200,000B) VR=US VM=1 Total Number of Pieces of Media Created */
export const TotalNumberOfPiecesOfMediaCreated = new DicomTag(0x2200, 0x000B);
/** (2200,000C) VR=LO VM=1 Requested Media Application Profile */
export const RequestedMediaApplicationProfile = new DicomTag(0x2200, 0x000C);
/** (2200,000D) VR=SQ VM=1 Referenced Storage Media Sequence */
export const ReferencedStorageMediaSequence = new DicomTag(0x2200, 0x000D);
/** (2200,000E) VR=AT VM=1-n Failure Attributes */
export const FailureAttributes = new DicomTag(0x2200, 0x000E);
/** (2200,000F) VR=CS VM=1 Allow Lossy Compression */
export const AllowLossyCompression = new DicomTag(0x2200, 0x000F);
/** (2200,0020) VR=CS VM=1 Request Priority */
export const RequestPriority = new DicomTag(0x2200, 0x0020);
/** (3002,0002) VR=SH VM=1 RT Image Label */
export const RTImageLabel = new DicomTag(0x3002, 0x0002);
/** (3002,0003) VR=LO VM=1 RT Image Name */
export const RTImageName = new DicomTag(0x3002, 0x0003);
/** (3002,0004) VR=ST VM=1 RT Image Description */
export const RTImageDescription = new DicomTag(0x3002, 0x0004);
/** (3002,000A) VR=CS VM=1 Reported Values Origin */
export const ReportedValuesOrigin = new DicomTag(0x3002, 0x000A);
/** (3002,000C) VR=CS VM=1 RT Image Plane */
export const RTImagePlane = new DicomTag(0x3002, 0x000C);
/** (3002,000D) VR=DS VM=3 X-Ray Image Receptor Translation */
export const XRayImageReceptorTranslation = new DicomTag(0x3002, 0x000D);
/** (3002,000E) VR=DS VM=1 X-Ray Image Receptor Angle */
export const XRayImageReceptorAngle = new DicomTag(0x3002, 0x000E);
/** (3002,0010) VR=DS VM=6 RT Image Orientation */
export const RTImageOrientation = new DicomTag(0x3002, 0x0010);
/** (3002,0011) VR=DS VM=2 Image Plane Pixel Spacing */
export const ImagePlanePixelSpacing = new DicomTag(0x3002, 0x0011);
/** (3002,0012) VR=DS VM=2 RT Image Position */
export const RTImagePosition = new DicomTag(0x3002, 0x0012);
/** (3002,0020) VR=SH VM=1 Radiation Machine Name */
export const RadiationMachineName = new DicomTag(0x3002, 0x0020);
/** (3002,0022) VR=DS VM=1 Radiation Machine SAD */
export const RadiationMachineSAD = new DicomTag(0x3002, 0x0022);
/** (3002,0024) VR=DS VM=1 Radiation Machine SSD */
export const RadiationMachineSSD = new DicomTag(0x3002, 0x0024);
/** (3002,0026) VR=DS VM=1 RT Image SID */
export const RTImageSID = new DicomTag(0x3002, 0x0026);
/** (3002,0028) VR=DS VM=1 Source to Reference Object Distance */
export const SourceToReferenceObjectDistance = new DicomTag(0x3002, 0x0028);
/** (3002,0029) VR=IS VM=1 Fraction Number */
export const FractionNumber = new DicomTag(0x3002, 0x0029);
/** (3002,0030) VR=SQ VM=1 Exposure Sequence */
export const ExposureSequence = new DicomTag(0x3002, 0x0030);
/** (3002,0032) VR=DS VM=1 Meterset Exposure */
export const MetersetExposure = new DicomTag(0x3002, 0x0032);
/** (3002,0034) VR=DS VM=4 Diaphragm Position */
export const DiaphragmPosition = new DicomTag(0x3002, 0x0034);
/** (3002,0040) VR=SQ VM=1 Fluence Map Sequence */
export const FluenceMapSequence = new DicomTag(0x3002, 0x0040);
/** (3002,0041) VR=CS VM=1 Fluence Data Source */
export const FluenceDataSource = new DicomTag(0x3002, 0x0041);
/** (3002,0042) VR=DS VM=1 Fluence Data Scale */
export const FluenceDataScale = new DicomTag(0x3002, 0x0042);
/** (3002,0050) VR=SQ VM=1 Primary Fluence Mode Sequence */
export const PrimaryFluenceModeSequence = new DicomTag(0x3002, 0x0050);
/** (3002,0051) VR=CS VM=1 Fluence Mode */
export const FluenceMode = new DicomTag(0x3002, 0x0051);
/** (3002,0052) VR=SH VM=1 Fluence Mode ID */
export const FluenceModeID = new DicomTag(0x3002, 0x0052);
/** (3002,0100) VR=IS VM=1 Selected Frame Number */
export const SelectedFrameNumber = new DicomTag(0x3002, 0x0100);
/** (3002,0101) VR=SQ VM=1 Selected Frame Functional Groups Sequence */
export const SelectedFrameFunctionalGroupsSequence = new DicomTag(0x3002, 0x0101);
/** (3002,0102) VR=SQ VM=1 RT Image Frame General Content Sequence */
export const RTImageFrameGeneralContentSequence = new DicomTag(0x3002, 0x0102);
/** (3002,0103) VR=SQ VM=1 RT Image Frame Context Sequence */
export const RTImageFrameContextSequence = new DicomTag(0x3002, 0x0103);
/** (3002,0104) VR=SQ VM=1 RT Image Scope Sequence */
export const RTImageScopeSequence = new DicomTag(0x3002, 0x0104);
/** (3002,0105) VR=CS VM=1 Beam Modifier Coordinates Presence Flag */
export const BeamModifierCoordinatesPresenceFlag = new DicomTag(0x3002, 0x0105);
/** (3002,0106) VR=FD VM=1 Start Cumulative Meterset */
export const StartCumulativeMeterset = new DicomTag(0x3002, 0x0106);
/** (3002,0107) VR=FD VM=1 Stop Cumulative Meterset */
export const StopCumulativeMeterset = new DicomTag(0x3002, 0x0107);
/** (3002,0108) VR=SQ VM=1 RT Acquisition Patient Position Sequence */
export const RTAcquisitionPatientPositionSequence = new DicomTag(0x3002, 0x0108);
/** (3002,0109) VR=SQ VM=1 RT Image Frame Imaging Device Position Sequence */
export const RTImageFrameImagingDevicePositionSequence = new DicomTag(0x3002, 0x0109);
/** (3002,010A) VR=SQ VM=1 RT Image Frame kV Radiation Acquisition Sequence */
export const RTImageFramekVRadiationAcquisitionSequence = new DicomTag(0x3002, 0x010A);
/** (3002,010B) VR=SQ VM=1 RT Image Frame MV Radiation Acquisition Sequence */
export const RTImageFrameMVRadiationAcquisitionSequence = new DicomTag(0x3002, 0x010B);
/** (3002,010C) VR=SQ VM=1 RT Image Frame Radiation Acquisition Sequence */
export const RTImageFrameRadiationAcquisitionSequence = new DicomTag(0x3002, 0x010C);
/** (3002,010D) VR=SQ VM=1 Imaging Source Position Sequence */
export const ImagingSourcePositionSequence = new DicomTag(0x3002, 0x010D);
/** (3002,010E) VR=SQ VM=1 Image Receptor Position Sequence */
export const ImageReceptorPositionSequence = new DicomTag(0x3002, 0x010E);
/** (3002,010F) VR=FD VM=16 Device Position to Equipment Mapping Matrix */
export const DevicePositionToEquipmentMappingMatrix = new DicomTag(0x3002, 0x010F);
/** (3002,0110) VR=SQ VM=1 Device Position Parameter Sequence */
export const DevicePositionParameterSequence = new DicomTag(0x3002, 0x0110);
/** (3002,0111) VR=CS VM=1 Imaging Source Location Specification Type */
export const ImagingSourceLocationSpecificationType = new DicomTag(0x3002, 0x0111);
/** (3002,0112) VR=SQ VM=1 Imaging Device Location Matrix Sequence */
export const ImagingDeviceLocationMatrixSequence = new DicomTag(0x3002, 0x0112);
/** (3002,0113) VR=SQ VM=1 Imaging Device Location Parameter Sequence */
export const ImagingDeviceLocationParameterSequence = new DicomTag(0x3002, 0x0113);
/** (3002,0114) VR=SQ VM=1 Imaging Aperture Sequence */
export const ImagingApertureSequence = new DicomTag(0x3002, 0x0114);
/** (3002,0115) VR=CS VM=1 Imaging Aperture Specification Type */
export const ImagingApertureSpecificationType = new DicomTag(0x3002, 0x0115);
/** (3002,0116) VR=US VM=1 Number of Acquisition Devices */
export const NumberOfAcquisitionDevices = new DicomTag(0x3002, 0x0116);
/** (3002,0117) VR=SQ VM=1 Acquisition Device Sequence */
export const AcquisitionDeviceSequence = new DicomTag(0x3002, 0x0117);
/** (3002,0118) VR=SQ VM=1 Acquisition Task Sequence */
export const AcquisitionTaskSequence = new DicomTag(0x3002, 0x0118);
/** (3002,0119) VR=SQ VM=1 Acquisition Task Workitem Code Sequence */
export const AcquisitionTaskWorkitemCodeSequence = new DicomTag(0x3002, 0x0119);
/** (3002,011A) VR=SQ VM=1 Acquisition Subtask Sequence */
export const AcquisitionSubtaskSequence = new DicomTag(0x3002, 0x011A);
/** (3002,011B) VR=SQ VM=1 Subtask Workitem Code Sequence */
export const SubtaskWorkitemCodeSequence = new DicomTag(0x3002, 0x011B);
/** (3002,011C) VR=US VM=1 Acquisition Task Index */
export const AcquisitionTaskIndex = new DicomTag(0x3002, 0x011C);
/** (3002,011D) VR=US VM=1 Acquisition Subtask Index */
export const AcquisitionSubtaskIndex = new DicomTag(0x3002, 0x011D);
/** (3002,011E) VR=SQ VM=1 Referenced Baseline Parameters RT Radiation Instance Sequence */
export const ReferencedBaselineParametersRTRadiationInstanceSequence = new DicomTag(0x3002, 0x011E);
/** (3002,011F) VR=SQ VM=1 Position Acquisition Template Identification Sequence */
export const PositionAcquisitionTemplateIdentificationSequence = new DicomTag(0x3002, 0x011F);
/** (3002,0120) VR=ST VM=1 Position Acquisition Template ID */
export const PositionAcquisitionTemplateID = new DicomTag(0x3002, 0x0120);
/** (3002,0121) VR=LO VM=1 Position Acquisition Template Name */
export const PositionAcquisitionTemplateName = new DicomTag(0x3002, 0x0121);
/** (3002,0122) VR=SQ VM=1 Position Acquisition Template Code Sequence */
export const PositionAcquisitionTemplateCodeSequence = new DicomTag(0x3002, 0x0122);
/** (3002,0123) VR=LT VM=1 Position Acquisition Template Description */
export const PositionAcquisitionTemplateDescription = new DicomTag(0x3002, 0x0123);
/** (3002,0124) VR=SQ VM=1 Acquisition Task Applicability Sequence */
export const AcquisitionTaskApplicabilitySequence = new DicomTag(0x3002, 0x0124);
/** (3002,0125) VR=SQ VM=1 Projection Imaging Acquisition Parameter Sequence */
export const ProjectionImagingAcquisitionParameterSequence = new DicomTag(0x3002, 0x0125);
/** (3002,0126) VR=SQ VM=1 CT Imaging Acquisition Parameter Sequence */
export const CTImagingAcquisitionParameterSequence = new DicomTag(0x3002, 0x0126);
/** (3002,0127) VR=SQ VM=1 KV Imaging Generation Parameters Sequence */
export const KVImagingGenerationParametersSequence = new DicomTag(0x3002, 0x0127);
/** (3002,0128) VR=SQ VM=1 MV Imaging Generation Parameters Sequence */
export const MVImagingGenerationParametersSequence = new DicomTag(0x3002, 0x0128);
/** (3002,0129) VR=CS VM=1 Acquisition Signal Type */
export const AcquisitionSignalType = new DicomTag(0x3002, 0x0129);
/** (3002,012A) VR=CS VM=1 Acquisition Method */
export const AcquisitionMethod = new DicomTag(0x3002, 0x012A);
/** (3002,012B) VR=SQ VM=1 Scan Start Position Sequence */
export const ScanStartPositionSequence = new DicomTag(0x3002, 0x012B);
/** (3002,012C) VR=SQ VM=1 Scan Stop Position Sequence */
export const ScanStopPositionSequence = new DicomTag(0x3002, 0x012C);
/** (3002,012D) VR=FD VM=1 Imaging Source to Beam Modifier Definition Plane Distance */
export const ImagingSourceToBeamModifierDefinitionPlaneDistance = new DicomTag(0x3002, 0x012D);
/** (3002,012E) VR=CS VM=1 Scan Arc Type */
export const ScanArcType = new DicomTag(0x3002, 0x012E);
/** (3002,012F) VR=CS VM=1 Detector Positioning Type */
export const DetectorPositioningType = new DicomTag(0x3002, 0x012F);
/** (3002,0130) VR=SQ VM=1 Additional RT Accessory Device Sequence */
export const AdditionalRTAccessoryDeviceSequence = new DicomTag(0x3002, 0x0130);
/** (3002,0131) VR=SQ VM=1 Device-Specific Acquisition Parameter Sequence */
export const DeviceSpecificAcquisitionParameterSequence = new DicomTag(0x3002, 0x0131);
/** (3002,0132) VR=SQ VM=1 Referenced Position Reference Instance Sequence */
export const ReferencedPositionReferenceInstanceSequence = new DicomTag(0x3002, 0x0132);
/** (3002,0133) VR=SQ VM=1 Energy Derivation Code Sequence */
export const EnergyDerivationCodeSequence = new DicomTag(0x3002, 0x0133);
/** (3002,0134) VR=FD VM=1 Maximum Cumulative Meterset Exposure */
export const MaximumCumulativeMetersetExposure = new DicomTag(0x3002, 0x0134);
/** (3002,0135) VR=SQ VM=1 Acquisition Initiation Sequence */
export const AcquisitionInitiationSequence = new DicomTag(0x3002, 0x0135);
/** (3002,0136) VR=SQ VM=1 RT Cone-Beam Imaging Geometry Sequence */
export const RTConeBeamImagingGeometrySequence = new DicomTag(0x3002, 0x0136);
/** (3004,0001) VR=CS VM=1 DVH Type */
export const DVHType = new DicomTag(0x3004, 0x0001);
/** (3004,0002) VR=CS VM=1 Dose Units */
export const DoseUnits = new DicomTag(0x3004, 0x0002);
/** (3004,0004) VR=CS VM=1 Dose Type */
export const DoseType = new DicomTag(0x3004, 0x0004);
/** (3004,0005) VR=CS VM=1 Spatial Transform of Dose */
export const SpatialTransformOfDose = new DicomTag(0x3004, 0x0005);
/** (3004,0006) VR=LO VM=1 Dose Comment */
export const DoseComment = new DicomTag(0x3004, 0x0006);
/** (3004,0008) VR=DS VM=3 Normalization Point */
export const NormalizationPoint = new DicomTag(0x3004, 0x0008);
/** (3004,000A) VR=CS VM=1 Dose Summation Type */
export const DoseSummationType = new DicomTag(0x3004, 0x000A);
/** (3004,000C) VR=DS VM=2-n Grid Frame Offset Vector */
export const GridFrameOffsetVector = new DicomTag(0x3004, 0x000C);
/** (3004,000E) VR=DS VM=1 Dose Grid Scaling */
export const DoseGridScaling = new DicomTag(0x3004, 0x000E);
/** (3004,0010) VR=SQ VM=1 RT Dose ROI Sequence (Retired) */
export const RTDoseROISequence = new DicomTag(0x3004, 0x0010);
/** (3004,0012) VR=DS VM=1 Dose Value */
export const DoseValue = new DicomTag(0x3004, 0x0012);
/** (3004,0014) VR=CS VM=1-3 Tissue Heterogeneity Correction */
export const TissueHeterogeneityCorrection = new DicomTag(0x3004, 0x0014);
/** (3004,0016) VR=SQ VM=1 Recommended Isodose Level Sequence */
export const RecommendedIsodoseLevelSequence = new DicomTag(0x3004, 0x0016);
/** (3004,0040) VR=DS VM=3 DVH Normalization Point */
export const DVHNormalizationPoint = new DicomTag(0x3004, 0x0040);
/** (3004,0042) VR=DS VM=1 DVH Normalization Dose Value */
export const DVHNormalizationDoseValue = new DicomTag(0x3004, 0x0042);
/** (3004,0050) VR=SQ VM=1 DVH Sequence */
export const DVHSequence = new DicomTag(0x3004, 0x0050);
/** (3004,0052) VR=DS VM=1 DVH Dose Scaling */
export const DVHDoseScaling = new DicomTag(0x3004, 0x0052);
/** (3004,0054) VR=CS VM=1 DVH Volume Units */
export const DVHVolumeUnits = new DicomTag(0x3004, 0x0054);
/** (3004,0056) VR=IS VM=1 DVH Number of Bins */
export const DVHNumberOfBins = new DicomTag(0x3004, 0x0056);
/** (3004,0058) VR=DS VM=2-2n DVH Data */
export const DVHData = new DicomTag(0x3004, 0x0058);
/** (3004,0060) VR=SQ VM=1 DVH Referenced ROI Sequence */
export const DVHReferencedROISequence = new DicomTag(0x3004, 0x0060);
/** (3004,0062) VR=CS VM=1 DVH ROI Contribution Type */
export const DVHROIContributionType = new DicomTag(0x3004, 0x0062);
/** (3004,0070) VR=DS VM=1 DVH Minimum Dose */
export const DVHMinimumDose = new DicomTag(0x3004, 0x0070);
/** (3004,0072) VR=DS VM=1 DVH Maximum Dose */
export const DVHMaximumDose = new DicomTag(0x3004, 0x0072);
/** (3004,0074) VR=DS VM=1 DVH Mean Dose */
export const DVHMeanDose = new DicomTag(0x3004, 0x0074);
/** (3004,0080) VR=SQ VM=1 Dose Calculation Model Sequence */
export const DoseCalculationModelSequence = new DicomTag(0x3004, 0x0080);
/** (3004,0081) VR=SQ VM=1 Dose Calculation Algorithm Sequence */
export const DoseCalculationAlgorithmSequence = new DicomTag(0x3004, 0x0081);
/** (3004,0082) VR=CS VM=1 Commissioning Status */
export const CommissioningStatus = new DicomTag(0x3004, 0x0082);
/** (3004,0083) VR=SQ VM=1 Dose Calculation Model Parameter Sequence */
export const DoseCalculationModelParameterSequence = new DicomTag(0x3004, 0x0083);
/** (3004,0084) VR=CS VM=1 Dose Deposition Calculation Medium */
export const DoseDepositionCalculationMedium = new DicomTag(0x3004, 0x0084);
/** (3006,0002) VR=SH VM=1 Structure Set Label */
export const StructureSetLabel = new DicomTag(0x3006, 0x0002);
/** (3006,0004) VR=LO VM=1 Structure Set Name */
export const StructureSetName = new DicomTag(0x3006, 0x0004);
/** (3006,0006) VR=ST VM=1 Structure Set Description */
export const StructureSetDescription = new DicomTag(0x3006, 0x0006);
/** (3006,0008) VR=DA VM=1 Structure Set Date */
export const StructureSetDate = new DicomTag(0x3006, 0x0008);
/** (3006,0009) VR=TM VM=1 Structure Set Time */
export const StructureSetTime = new DicomTag(0x3006, 0x0009);
/** (3006,0010) VR=SQ VM=1 Referenced Frame of Reference Sequence */
export const ReferencedFrameOfReferenceSequence = new DicomTag(0x3006, 0x0010);
/** (3006,0012) VR=SQ VM=1 RT Referenced Study Sequence */
export const RTReferencedStudySequence = new DicomTag(0x3006, 0x0012);
/** (3006,0014) VR=SQ VM=1 RT Referenced Series Sequence */
export const RTReferencedSeriesSequence = new DicomTag(0x3006, 0x0014);
/** (3006,0016) VR=SQ VM=1 Contour Image Sequence */
export const ContourImageSequence = new DicomTag(0x3006, 0x0016);
/** (3006,0018) VR=SQ VM=1 Predecessor Structure Set Sequence */
export const PredecessorStructureSetSequence = new DicomTag(0x3006, 0x0018);
/** (3006,0020) VR=SQ VM=1 Structure Set ROI Sequence */
export const StructureSetROISequence = new DicomTag(0x3006, 0x0020);
/** (3006,0022) VR=IS VM=1 ROI Number */
export const ROINumber = new DicomTag(0x3006, 0x0022);
/** (3006,0024) VR=UI VM=1 Referenced Frame of Reference UID */
export const ReferencedFrameOfReferenceUID = new DicomTag(0x3006, 0x0024);
/** (3006,0026) VR=LO VM=1 ROI Name */
export const ROIName = new DicomTag(0x3006, 0x0026);
/** (3006,0028) VR=ST VM=1 ROI Description */
export const ROIDescription = new DicomTag(0x3006, 0x0028);
/** (3006,002A) VR=IS VM=3 ROI Display Color */
export const ROIDisplayColor = new DicomTag(0x3006, 0x002A);
/** (3006,002C) VR=DS VM=1 ROI Volume */
export const ROIVolume = new DicomTag(0x3006, 0x002C);
/** (3006,002D) VR=DT VM=1 ROI DateTime */
export const ROIDateTime = new DicomTag(0x3006, 0x002D);
/** (3006,002E) VR=DT VM=1 ROI Observation DateTime */
export const ROIObservationDateTime = new DicomTag(0x3006, 0x002E);
/** (3006,0030) VR=SQ VM=1 RT Related ROI Sequence */
export const RTRelatedROISequence = new DicomTag(0x3006, 0x0030);
/** (3006,0033) VR=CS VM=1 RT ROI Relationship */
export const RTROIRelationship = new DicomTag(0x3006, 0x0033);
/** (3006,0036) VR=CS VM=1 ROI Generation Algorithm */
export const ROIGenerationAlgorithm = new DicomTag(0x3006, 0x0036);
/** (3006,0037) VR=SQ VM=1 ROI Derivation Algorithm Identification Sequence */
export const ROIDerivationAlgorithmIdentificationSequence = new DicomTag(0x3006, 0x0037);
/** (3006,0038) VR=LO VM=1 ROI Generation Description */
export const ROIGenerationDescription = new DicomTag(0x3006, 0x0038);
/** (3006,0039) VR=SQ VM=1 ROI Contour Sequence */
export const ROIContourSequence = new DicomTag(0x3006, 0x0039);
/** (3006,0040) VR=SQ VM=1 Contour Sequence */
export const ContourSequence = new DicomTag(0x3006, 0x0040);
/** (3006,0042) VR=CS VM=1 Contour Geometric Type */
export const ContourGeometricType = new DicomTag(0x3006, 0x0042);
/** (3006,0044) VR=DS VM=1 Contour Slab Thickness (Retired) */
export const ContourSlabThickness = new DicomTag(0x3006, 0x0044);
/** (3006,0045) VR=DS VM=3 Contour Offset Vector (Retired) */
export const ContourOffsetVector = new DicomTag(0x3006, 0x0045);
/** (3006,0046) VR=IS VM=1 Number of Contour Points */
export const NumberOfContourPoints = new DicomTag(0x3006, 0x0046);
/** (3006,0048) VR=IS VM=1 Contour Number */
export const ContourNumber = new DicomTag(0x3006, 0x0048);
/** (3006,0049) VR=IS VM=1-n Attached Contours (Retired) */
export const AttachedContours = new DicomTag(0x3006, 0x0049);
/** (3006,004A) VR=SQ VM=1 Source Pixel Planes Characteristics Sequence */
export const SourcePixelPlanesCharacteristicsSequence = new DicomTag(0x3006, 0x004A);
/** (3006,004B) VR=SQ VM=1 Source Series Sequence */
export const SourceSeriesSequence = new DicomTag(0x3006, 0x004B);
/** (3006,004C) VR=SQ VM=1 Source Series Information Sequence */
export const SourceSeriesInformationSequence = new DicomTag(0x3006, 0x004C);
/** (3006,004D) VR=SQ VM=1 ROI Creator Sequence */
export const ROICreatorSequence = new DicomTag(0x3006, 0x004D);
/** (3006,004E) VR=SQ VM=1 ROI Interpreter Sequence */
export const ROIInterpreterSequence = new DicomTag(0x3006, 0x004E);
/** (3006,004F) VR=SQ VM=1 ROI Observation Context Code Sequence */
export const ROIObservationContextCodeSequence = new DicomTag(0x3006, 0x004F);
/** (3006,0050) VR=DS VM=3-3n Contour Data */
export const ContourData = new DicomTag(0x3006, 0x0050);
/** (3006,0080) VR=SQ VM=1 RT ROI Observations Sequence */
export const RTROIObservationsSequence = new DicomTag(0x3006, 0x0080);
/** (3006,0082) VR=IS VM=1 Observation Number */
export const ObservationNumber = new DicomTag(0x3006, 0x0082);
/** (3006,0084) VR=IS VM=1 Referenced ROI Number */
export const ReferencedROINumber = new DicomTag(0x3006, 0x0084);
/** (3006,0085) VR=SH VM=1 ROI Observation Label (Retired) */
export const ROIObservationLabel = new DicomTag(0x3006, 0x0085);
/** (3006,0086) VR=SQ VM=1 RT ROI Identification Code Sequence */
export const RTROIIdentificationCodeSequence = new DicomTag(0x3006, 0x0086);
/** (3006,0088) VR=ST VM=1 ROI Observation Description (Retired) */
export const ROIObservationDescription = new DicomTag(0x3006, 0x0088);
/** (3006,00A0) VR=SQ VM=1 Related RT ROI Observations Sequence */
export const RelatedRTROIObservationsSequence = new DicomTag(0x3006, 0x00A0);
/** (3006,00A4) VR=CS VM=1 RT ROI Interpreted Type */
export const RTROIInterpretedType = new DicomTag(0x3006, 0x00A4);
/** (3006,00A6) VR=PN VM=1 ROI Interpreter */
export const ROIInterpreter = new DicomTag(0x3006, 0x00A6);
/** (3006,00B0) VR=SQ VM=1 ROI Physical Properties Sequence */
export const ROIPhysicalPropertiesSequence = new DicomTag(0x3006, 0x00B0);
/** (3006,00B2) VR=CS VM=1 ROI Physical Property */
export const ROIPhysicalProperty = new DicomTag(0x3006, 0x00B2);
/** (3006,00B4) VR=DS VM=1 ROI Physical Property Value */
export const ROIPhysicalPropertyValue = new DicomTag(0x3006, 0x00B4);
/** (3006,00B6) VR=SQ VM=1 ROI Elemental Composition Sequence */
export const ROIElementalCompositionSequence = new DicomTag(0x3006, 0x00B6);
/** (3006,00B7) VR=US VM=1 ROI Elemental Composition Atomic Number */
export const ROIElementalCompositionAtomicNumber = new DicomTag(0x3006, 0x00B7);
/** (3006,00B8) VR=FL VM=1 ROI Elemental Composition Atomic Mass Fraction */
export const ROIElementalCompositionAtomicMassFraction = new DicomTag(0x3006, 0x00B8);
/** (3006,00B9) VR=SQ VM=1 Additional RT ROI Identification Code Sequence (Retired) */
export const AdditionalRTROIIdentificationCodeSequence = new DicomTag(0x3006, 0x00B9);
/** (3006,00C0) VR=SQ VM=1 Frame of Reference Relationship Sequence (Retired) */
export const FrameOfReferenceRelationshipSequence = new DicomTag(0x3006, 0x00C0);
/** (3006,00C2) VR=UI VM=1 Related Frame of Reference UID (Retired) */
export const RelatedFrameOfReferenceUID = new DicomTag(0x3006, 0x00C2);
/** (3006,00C4) VR=CS VM=1 Frame of Reference Transformation Type (Retired) */
export const FrameOfReferenceTransformationType = new DicomTag(0x3006, 0x00C4);
/** (3006,00C6) VR=DS VM=16 Frame of Reference Transformation Matrix */
export const FrameOfReferenceTransformationMatrix = new DicomTag(0x3006, 0x00C6);
/** (3006,00C8) VR=LO VM=1 Frame of Reference Transformation Comment */
export const FrameOfReferenceTransformationComment = new DicomTag(0x3006, 0x00C8);
/** (3006,00C9) VR=SQ VM=1 Patient Location Coordinates Sequence */
export const PatientLocationCoordinatesSequence = new DicomTag(0x3006, 0x00C9);
/** (3006,00CA) VR=SQ VM=1 Patient Location Coordinates Code Sequence */
export const PatientLocationCoordinatesCodeSequence = new DicomTag(0x3006, 0x00CA);
/** (3006,00CB) VR=SQ VM=1 Patient Support Position Sequence */
export const PatientSupportPositionSequence = new DicomTag(0x3006, 0x00CB);
/** (3008,0010) VR=SQ VM=1 Measured Dose Reference Sequence */
export const MeasuredDoseReferenceSequence = new DicomTag(0x3008, 0x0010);
/** (3008,0012) VR=ST VM=1 Measured Dose Description */
export const MeasuredDoseDescription = new DicomTag(0x3008, 0x0012);
/** (3008,0014) VR=CS VM=1 Measured Dose Type */
export const MeasuredDoseType = new DicomTag(0x3008, 0x0014);
/** (3008,0016) VR=DS VM=1 Measured Dose Value */
export const MeasuredDoseValue = new DicomTag(0x3008, 0x0016);
/** (3008,0020) VR=SQ VM=1 Treatment Session Beam Sequence */
export const TreatmentSessionBeamSequence = new DicomTag(0x3008, 0x0020);
/** (3008,0021) VR=SQ VM=1 Treatment Session Ion Beam Sequence */
export const TreatmentSessionIonBeamSequence = new DicomTag(0x3008, 0x0021);
/** (3008,0022) VR=IS VM=1 Current Fraction Number */
export const CurrentFractionNumber = new DicomTag(0x3008, 0x0022);
/** (3008,0024) VR=DA VM=1 Treatment Control Point Date */
export const TreatmentControlPointDate = new DicomTag(0x3008, 0x0024);
/** (3008,0025) VR=TM VM=1 Treatment Control Point Time */
export const TreatmentControlPointTime = new DicomTag(0x3008, 0x0025);
/** (3008,002A) VR=CS VM=1 Treatment Termination Status */
export const TreatmentTerminationStatus = new DicomTag(0x3008, 0x002A);
/** (3008,002B) VR=SH VM=1 Treatment Termination Code (Retired) */
export const TreatmentTerminationCode = new DicomTag(0x3008, 0x002B);
/** (3008,002C) VR=CS VM=1 Treatment Verification Status */
export const TreatmentVerificationStatus = new DicomTag(0x3008, 0x002C);
/** (3008,0030) VR=SQ VM=1 Referenced Treatment Record Sequence */
export const ReferencedTreatmentRecordSequence = new DicomTag(0x3008, 0x0030);
/** (3008,0032) VR=DS VM=1 Specified Primary Meterset */
export const SpecifiedPrimaryMeterset = new DicomTag(0x3008, 0x0032);
/** (3008,0033) VR=DS VM=1 Specified Secondary Meterset */
export const SpecifiedSecondaryMeterset = new DicomTag(0x3008, 0x0033);
/** (3008,0036) VR=DS VM=1 Delivered Primary Meterset */
export const DeliveredPrimaryMeterset = new DicomTag(0x3008, 0x0036);
/** (3008,0037) VR=DS VM=1 Delivered Secondary Meterset */
export const DeliveredSecondaryMeterset = new DicomTag(0x3008, 0x0037);
/** (3008,003A) VR=DS VM=1 Specified Treatment Time */
export const SpecifiedTreatmentTime = new DicomTag(0x3008, 0x003A);
/** (3008,003B) VR=DS VM=1 Delivered Treatment Time */
export const DeliveredTreatmentTime = new DicomTag(0x3008, 0x003B);
/** (3008,0040) VR=SQ VM=1 Control Point Delivery Sequence */
export const ControlPointDeliverySequence = new DicomTag(0x3008, 0x0040);
/** (3008,0041) VR=SQ VM=1 Ion Control Point Delivery Sequence */
export const IonControlPointDeliverySequence = new DicomTag(0x3008, 0x0041);
/** (3008,0042) VR=DS VM=1 Specified Meterset */
export const SpecifiedMeterset = new DicomTag(0x3008, 0x0042);
/** (3008,0044) VR=DS VM=1 Delivered Meterset */
export const DeliveredMeterset = new DicomTag(0x3008, 0x0044);
/** (3008,0045) VR=FL VM=1 Meterset Rate Set */
export const MetersetRateSet = new DicomTag(0x3008, 0x0045);
/** (3008,0046) VR=FL VM=1 Meterset Rate Delivered */
export const MetersetRateDelivered = new DicomTag(0x3008, 0x0046);
/** (3008,0047) VR=FL VM=1-n Scan Spot Metersets Delivered */
export const ScanSpotMetersetsDelivered = new DicomTag(0x3008, 0x0047);
/** (3008,0048) VR=DS VM=1 Dose Rate Delivered */
export const DoseRateDelivered = new DicomTag(0x3008, 0x0048);
/** (3008,0050) VR=SQ VM=1 Treatment Summary Calculated Dose Reference Sequence */
export const TreatmentSummaryCalculatedDoseReferenceSequence = new DicomTag(0x3008, 0x0050);
/** (3008,0052) VR=DS VM=1 Cumulative Dose to Dose Reference */
export const CumulativeDoseToDoseReference = new DicomTag(0x3008, 0x0052);
/** (3008,0054) VR=DA VM=1 First Treatment Date */
export const FirstTreatmentDate = new DicomTag(0x3008, 0x0054);
/** (3008,0056) VR=DA VM=1 Most Recent Treatment Date */
export const MostRecentTreatmentDate = new DicomTag(0x3008, 0x0056);
/** (3008,005A) VR=IS VM=1 Number of Fractions Delivered */
export const NumberOfFractionsDelivered = new DicomTag(0x3008, 0x005A);
/** (3008,0060) VR=SQ VM=1 Override Sequence */
export const OverrideSequence = new DicomTag(0x3008, 0x0060);
/** (3008,0061) VR=AT VM=1 Parameter Sequence Pointer */
export const ParameterSequencePointer = new DicomTag(0x3008, 0x0061);
/** (3008,0062) VR=AT VM=1 Override Parameter Pointer */
export const OverrideParameterPointer = new DicomTag(0x3008, 0x0062);
/** (3008,0063) VR=IS VM=1 Parameter Item Index */
export const ParameterItemIndex = new DicomTag(0x3008, 0x0063);
/** (3008,0064) VR=IS VM=1 Measured Dose Reference Number */
export const MeasuredDoseReferenceNumber = new DicomTag(0x3008, 0x0064);
/** (3008,0065) VR=AT VM=1 Parameter Pointer */
export const ParameterPointer = new DicomTag(0x3008, 0x0065);
/** (3008,0066) VR=ST VM=1 Override Reason */
export const OverrideReason = new DicomTag(0x3008, 0x0066);
/** (3008,0067) VR=US VM=1 Parameter Value Number */
export const ParameterValueNumber = new DicomTag(0x3008, 0x0067);
/** (3008,0068) VR=SQ VM=1 Corrected Parameter Sequence */
export const CorrectedParameterSequence = new DicomTag(0x3008, 0x0068);
/** (3008,006A) VR=FL VM=1 Correction Value */
export const CorrectionValue = new DicomTag(0x3008, 0x006A);
/** (3008,0070) VR=SQ VM=1 Calculated Dose Reference Sequence */
export const CalculatedDoseReferenceSequence = new DicomTag(0x3008, 0x0070);
/** (3008,0072) VR=IS VM=1 Calculated Dose Reference Number */
export const CalculatedDoseReferenceNumber = new DicomTag(0x3008, 0x0072);
/** (3008,0074) VR=ST VM=1 Calculated Dose Reference Description */
export const CalculatedDoseReferenceDescription = new DicomTag(0x3008, 0x0074);
/** (3008,0076) VR=DS VM=1 Calculated Dose Reference Dose Value */
export const CalculatedDoseReferenceDoseValue = new DicomTag(0x3008, 0x0076);
/** (3008,0078) VR=DS VM=1 Start Meterset */
export const StartMeterset = new DicomTag(0x3008, 0x0078);
/** (3008,007A) VR=DS VM=1 End Meterset */
export const EndMeterset = new DicomTag(0x3008, 0x007A);
/** (3008,0080) VR=SQ VM=1 Referenced Measured Dose Reference Sequence */
export const ReferencedMeasuredDoseReferenceSequence = new DicomTag(0x3008, 0x0080);
/** (3008,0082) VR=IS VM=1 Referenced Measured Dose Reference Number */
export const ReferencedMeasuredDoseReferenceNumber = new DicomTag(0x3008, 0x0082);
/** (3008,0090) VR=SQ VM=1 Referenced Calculated Dose Reference Sequence */
export const ReferencedCalculatedDoseReferenceSequence = new DicomTag(0x3008, 0x0090);
/** (3008,0092) VR=IS VM=1 Referenced Calculated Dose Reference Number */
export const ReferencedCalculatedDoseReferenceNumber = new DicomTag(0x3008, 0x0092);
/** (3008,00A0) VR=SQ VM=1 Beam Limiting Device Leaf Pairs Sequence */
export const BeamLimitingDeviceLeafPairsSequence = new DicomTag(0x3008, 0x00A0);
/** (3008,00A1) VR=SQ VM=1 Enhanced RT Beam Limiting Device Sequence */
export const EnhancedRTBeamLimitingDeviceSequence = new DicomTag(0x3008, 0x00A1);
/** (3008,00A2) VR=SQ VM=1 Enhanced RT Beam Limiting Opening Sequence */
export const EnhancedRTBeamLimitingOpeningSequence = new DicomTag(0x3008, 0x00A2);
/** (3008,00A3) VR=CS VM=1 Enhanced RT Beam Limiting Device Definition Flag */
export const EnhancedRTBeamLimitingDeviceDefinitionFlag = new DicomTag(0x3008, 0x00A3);
/** (3008,00A4) VR=FD VM=2-2n Parallel RT Beam Delimiter Opening Extents */
export const ParallelRTBeamDelimiterOpeningExtents = new DicomTag(0x3008, 0x00A4);
/** (3008,00B0) VR=SQ VM=1 Recorded Wedge Sequence */
export const RecordedWedgeSequence = new DicomTag(0x3008, 0x00B0);
/** (3008,00C0) VR=SQ VM=1 Recorded Compensator Sequence */
export const RecordedCompensatorSequence = new DicomTag(0x3008, 0x00C0);
/** (3008,00D0) VR=SQ VM=1 Recorded Block Sequence */
export const RecordedBlockSequence = new DicomTag(0x3008, 0x00D0);
/** (3008,00D1) VR=SQ VM=1 Recorded Block Slab Sequence */
export const RecordedBlockSlabSequence = new DicomTag(0x3008, 0x00D1);
/** (3008,00E0) VR=SQ VM=1 Treatment Summary Measured Dose Reference Sequence */
export const TreatmentSummaryMeasuredDoseReferenceSequence = new DicomTag(0x3008, 0x00E0);
/** (3008,00F0) VR=SQ VM=1 Recorded Snout Sequence */
export const RecordedSnoutSequence = new DicomTag(0x3008, 0x00F0);
/** (3008,00F2) VR=SQ VM=1 Recorded Range Shifter Sequence */
export const RecordedRangeShifterSequence = new DicomTag(0x3008, 0x00F2);
/** (3008,00F4) VR=SQ VM=1 Recorded Lateral Spreading Device Sequence */
export const RecordedLateralSpreadingDeviceSequence = new DicomTag(0x3008, 0x00F4);
/** (3008,00F6) VR=SQ VM=1 Recorded Range Modulator Sequence */
export const RecordedRangeModulatorSequence = new DicomTag(0x3008, 0x00F6);
/** (3008,0100) VR=SQ VM=1 Recorded Source Sequence */
export const RecordedSourceSequence = new DicomTag(0x3008, 0x0100);
/** (3008,0105) VR=LO VM=1 Source Serial Number */
export const SourceSerialNumber = new DicomTag(0x3008, 0x0105);
/** (3008,0110) VR=SQ VM=1 Treatment Session Application Setup Sequence */
export const TreatmentSessionApplicationSetupSequence = new DicomTag(0x3008, 0x0110);
/** (3008,0116) VR=CS VM=1 Application Setup Check */
export const ApplicationSetupCheck = new DicomTag(0x3008, 0x0116);
/** (3008,0120) VR=SQ VM=1 Recorded Brachy Accessory Device Sequence */
export const RecordedBrachyAccessoryDeviceSequence = new DicomTag(0x3008, 0x0120);
/** (3008,0122) VR=IS VM=1 Referenced Brachy Accessory Device Number */
export const ReferencedBrachyAccessoryDeviceNumber = new DicomTag(0x3008, 0x0122);
/** (3008,0130) VR=SQ VM=1 Recorded Channel Sequence */
export const RecordedChannelSequence = new DicomTag(0x3008, 0x0130);
/** (3008,0132) VR=DS VM=1 Specified Channel Total Time */
export const SpecifiedChannelTotalTime = new DicomTag(0x3008, 0x0132);
/** (3008,0134) VR=DS VM=1 Delivered Channel Total Time */
export const DeliveredChannelTotalTime = new DicomTag(0x3008, 0x0134);
/** (3008,0136) VR=IS VM=1 Specified Number of Pulses */
export const SpecifiedNumberOfPulses = new DicomTag(0x3008, 0x0136);
/** (3008,0138) VR=IS VM=1 Delivered Number of Pulses */
export const DeliveredNumberOfPulses = new DicomTag(0x3008, 0x0138);
/** (3008,013A) VR=DS VM=1 Specified Pulse Repetition Interval */
export const SpecifiedPulseRepetitionInterval = new DicomTag(0x3008, 0x013A);
/** (3008,013C) VR=DS VM=1 Delivered Pulse Repetition Interval */
export const DeliveredPulseRepetitionInterval = new DicomTag(0x3008, 0x013C);
/** (3008,0140) VR=SQ VM=1 Recorded Source Applicator Sequence */
export const RecordedSourceApplicatorSequence = new DicomTag(0x3008, 0x0140);
/** (3008,0142) VR=IS VM=1 Referenced Source Applicator Number */
export const ReferencedSourceApplicatorNumber = new DicomTag(0x3008, 0x0142);
/** (3008,0150) VR=SQ VM=1 Recorded Channel Shield Sequence */
export const RecordedChannelShieldSequence = new DicomTag(0x3008, 0x0150);
/** (3008,0152) VR=IS VM=1 Referenced Channel Shield Number */
export const ReferencedChannelShieldNumber = new DicomTag(0x3008, 0x0152);
/** (3008,0160) VR=SQ VM=1 Brachy Control Point Delivered Sequence */
export const BrachyControlPointDeliveredSequence = new DicomTag(0x3008, 0x0160);
/** (3008,0162) VR=DA VM=1 Safe Position Exit Date */
export const SafePositionExitDate = new DicomTag(0x3008, 0x0162);
/** (3008,0164) VR=TM VM=1 Safe Position Exit Time */
export const SafePositionExitTime = new DicomTag(0x3008, 0x0164);
/** (3008,0166) VR=DA VM=1 Safe Position Return Date */
export const SafePositionReturnDate = new DicomTag(0x3008, 0x0166);
/** (3008,0168) VR=TM VM=1 Safe Position Return Time */
export const SafePositionReturnTime = new DicomTag(0x3008, 0x0168);
/** (3008,0171) VR=SQ VM=1 Pulse Specific Brachy Control Point Delivered Sequence */
export const PulseSpecificBrachyControlPointDeliveredSequence = new DicomTag(0x3008, 0x0171);
/** (3008,0172) VR=US VM=1 Pulse Number */
export const PulseNumber = new DicomTag(0x3008, 0x0172);
/** (3008,0173) VR=SQ VM=1 Brachy Pulse Control Point Delivered Sequence */
export const BrachyPulseControlPointDeliveredSequence = new DicomTag(0x3008, 0x0173);
/** (3008,0200) VR=CS VM=1 Current Treatment Status */
export const CurrentTreatmentStatus = new DicomTag(0x3008, 0x0200);
/** (3008,0202) VR=ST VM=1 Treatment Status Comment */
export const TreatmentStatusComment = new DicomTag(0x3008, 0x0202);
/** (3008,0220) VR=SQ VM=1 Fraction Group Summary Sequence */
export const FractionGroupSummarySequence = new DicomTag(0x3008, 0x0220);
/** (3008,0223) VR=IS VM=1 Referenced Fraction Number */
export const ReferencedFractionNumber = new DicomTag(0x3008, 0x0223);
/** (3008,0224) VR=CS VM=1 Fraction Group Type */
export const FractionGroupType = new DicomTag(0x3008, 0x0224);
/** (3008,0230) VR=CS VM=1 Beam Stopper Position */
export const BeamStopperPosition = new DicomTag(0x3008, 0x0230);
/** (3008,0240) VR=SQ VM=1 Fraction Status Summary Sequence */
export const FractionStatusSummarySequence = new DicomTag(0x3008, 0x0240);
/** (3008,0250) VR=DA VM=1 Treatment Date */
export const TreatmentDate = new DicomTag(0x3008, 0x0250);
/** (3008,0251) VR=TM VM=1 Treatment Time */
export const TreatmentTime = new DicomTag(0x3008, 0x0251);
/** (300A,0002) VR=SH VM=1 RT Plan Label */
export const RTPlanLabel = new DicomTag(0x300A, 0x0002);
/** (300A,0003) VR=LO VM=1 RT Plan Name */
export const RTPlanName = new DicomTag(0x300A, 0x0003);
/** (300A,0004) VR=ST VM=1 RT Plan Description */
export const RTPlanDescription = new DicomTag(0x300A, 0x0004);
/** (300A,0006) VR=DA VM=1 RT Plan Date */
export const RTPlanDate = new DicomTag(0x300A, 0x0006);
/** (300A,0007) VR=TM VM=1 RT Plan Time */
export const RTPlanTime = new DicomTag(0x300A, 0x0007);
/** (300A,0009) VR=LO VM=1-n Treatment Protocols */
export const TreatmentProtocols = new DicomTag(0x300A, 0x0009);
/** (300A,000A) VR=CS VM=1 Plan Intent */
export const PlanIntent = new DicomTag(0x300A, 0x000A);
/** (300A,000B) VR=LO VM=1-n Treatment Sites (Retired) */
export const TreatmentSites = new DicomTag(0x300A, 0x000B);
/** (300A,000C) VR=CS VM=1 RT Plan Geometry */
export const RTPlanGeometry = new DicomTag(0x300A, 0x000C);
/** (300A,000E) VR=ST VM=1 Prescription Description */
export const PrescriptionDescription = new DicomTag(0x300A, 0x000E);
/** (300A,0010) VR=SQ VM=1 Dose Reference Sequence */
export const DoseReferenceSequence = new DicomTag(0x300A, 0x0010);
/** (300A,0012) VR=IS VM=1 Dose Reference Number */
export const DoseReferenceNumber = new DicomTag(0x300A, 0x0012);
/** (300A,0013) VR=UI VM=1 Dose Reference UID */
export const DoseReferenceUID = new DicomTag(0x300A, 0x0013);
/** (300A,0014) VR=CS VM=1 Dose Reference Structure Type */
export const DoseReferenceStructureType = new DicomTag(0x300A, 0x0014);
/** (300A,0015) VR=CS VM=1 Nominal Beam Energy Unit */
export const NominalBeamEnergyUnit = new DicomTag(0x300A, 0x0015);
/** (300A,0016) VR=LO VM=1 Dose Reference Description */
export const DoseReferenceDescription = new DicomTag(0x300A, 0x0016);
/** (300A,0018) VR=DS VM=3 Dose Reference Point Coordinates */
export const DoseReferencePointCoordinates = new DicomTag(0x300A, 0x0018);
/** (300A,001A) VR=DS VM=1 Nominal Prior Dose */
export const NominalPriorDose = new DicomTag(0x300A, 0x001A);
/** (300A,0020) VR=CS VM=1 Dose Reference Type */
export const DoseReferenceType = new DicomTag(0x300A, 0x0020);
/** (300A,0021) VR=DS VM=1 Constraint Weight */
export const ConstraintWeight = new DicomTag(0x300A, 0x0021);
/** (300A,0022) VR=DS VM=1 Delivery Warning Dose */
export const DeliveryWarningDose = new DicomTag(0x300A, 0x0022);
/** (300A,0023) VR=DS VM=1 Delivery Maximum Dose */
export const DeliveryMaximumDose = new DicomTag(0x300A, 0x0023);
/** (300A,0025) VR=DS VM=1 Target Minimum Dose */
export const TargetMinimumDose = new DicomTag(0x300A, 0x0025);
/** (300A,0026) VR=DS VM=1 Target Prescription Dose */
export const TargetPrescriptionDose = new DicomTag(0x300A, 0x0026);
/** (300A,0027) VR=DS VM=1 Target Maximum Dose */
export const TargetMaximumDose = new DicomTag(0x300A, 0x0027);
/** (300A,0028) VR=DS VM=1 Target Underdose Volume Fraction */
export const TargetUnderdoseVolumeFraction = new DicomTag(0x300A, 0x0028);
/** (300A,002A) VR=DS VM=1 Organ at Risk Full-volume Dose */
export const OrganAtRiskFullVolumeDose = new DicomTag(0x300A, 0x002A);
/** (300A,002B) VR=DS VM=1 Organ at Risk Limit Dose */
export const OrganAtRiskLimitDose = new DicomTag(0x300A, 0x002B);
/** (300A,002C) VR=DS VM=1 Organ at Risk Maximum Dose */
export const OrganAtRiskMaximumDose = new DicomTag(0x300A, 0x002C);
/** (300A,002D) VR=DS VM=1 Organ at Risk Overdose Volume Fraction */
export const OrganAtRiskOverdoseVolumeFraction = new DicomTag(0x300A, 0x002D);
/** (300A,0040) VR=SQ VM=1 Tolerance Table Sequence */
export const ToleranceTableSequence = new DicomTag(0x300A, 0x0040);
/** (300A,0042) VR=IS VM=1 Tolerance Table Number */
export const ToleranceTableNumber = new DicomTag(0x300A, 0x0042);
/** (300A,0043) VR=SH VM=1 Tolerance Table Label */
export const ToleranceTableLabel = new DicomTag(0x300A, 0x0043);
/** (300A,0044) VR=DS VM=1 Gantry Angle Tolerance */
export const GantryAngleTolerance = new DicomTag(0x300A, 0x0044);
/** (300A,0046) VR=DS VM=1 Beam Limiting Device Angle Tolerance */
export const BeamLimitingDeviceAngleTolerance = new DicomTag(0x300A, 0x0046);
/** (300A,0048) VR=SQ VM=1 Beam Limiting Device Tolerance Sequence */
export const BeamLimitingDeviceToleranceSequence = new DicomTag(0x300A, 0x0048);
/** (300A,004A) VR=DS VM=1 Beam Limiting Device Position Tolerance */
export const BeamLimitingDevicePositionTolerance = new DicomTag(0x300A, 0x004A);
/** (300A,004B) VR=FL VM=1 Snout Position Tolerance */
export const SnoutPositionTolerance = new DicomTag(0x300A, 0x004B);
/** (300A,004C) VR=DS VM=1 Patient Support Angle Tolerance */
export const PatientSupportAngleTolerance = new DicomTag(0x300A, 0x004C);
/** (300A,004E) VR=DS VM=1 Table Top Eccentric Angle Tolerance */
export const TableTopEccentricAngleTolerance = new DicomTag(0x300A, 0x004E);
/** (300A,004F) VR=FL VM=1 Table Top Pitch Angle Tolerance */
export const TableTopPitchAngleTolerance = new DicomTag(0x300A, 0x004F);
/** (300A,0050) VR=FL VM=1 Table Top Roll Angle Tolerance */
export const TableTopRollAngleTolerance = new DicomTag(0x300A, 0x0050);
/** (300A,0051) VR=DS VM=1 Table Top Vertical Position Tolerance */
export const TableTopVerticalPositionTolerance = new DicomTag(0x300A, 0x0051);
/** (300A,0052) VR=DS VM=1 Table Top Longitudinal Position Tolerance */
export const TableTopLongitudinalPositionTolerance = new DicomTag(0x300A, 0x0052);
/** (300A,0053) VR=DS VM=1 Table Top Lateral Position Tolerance */
export const TableTopLateralPositionTolerance = new DicomTag(0x300A, 0x0053);
/** (300A,0054) VR=UI VM=1 Table Top Position Alignment UID */
export const TableTopPositionAlignmentUID = new DicomTag(0x300A, 0x0054);
/** (300A,0055) VR=CS VM=1 RT Plan Relationship */
export const RTPlanRelationship = new DicomTag(0x300A, 0x0055);
/** (300A,0070) VR=SQ VM=1 Fraction Group Sequence */
export const FractionGroupSequence = new DicomTag(0x300A, 0x0070);
/** (300A,0071) VR=IS VM=1 Fraction Group Number */
export const FractionGroupNumber = new DicomTag(0x300A, 0x0071);
/** (300A,0072) VR=LO VM=1 Fraction Group Description */
export const FractionGroupDescription = new DicomTag(0x300A, 0x0072);
/** (300A,0078) VR=IS VM=1 Number of Fractions Planned */
export const NumberOfFractionsPlanned = new DicomTag(0x300A, 0x0078);
/** (300A,0079) VR=IS VM=1 Number of Fraction Pattern Digits Per Day */
export const NumberOfFractionPatternDigitsPerDay = new DicomTag(0x300A, 0x0079);
/** (300A,007A) VR=IS VM=1 Repeat Fraction Cycle Length */
export const RepeatFractionCycleLength = new DicomTag(0x300A, 0x007A);
/** (300A,007B) VR=LT VM=1 Fraction Pattern */
export const FractionPattern = new DicomTag(0x300A, 0x007B);
/** (300A,0080) VR=IS VM=1 Number of Beams */
export const NumberOfBeams = new DicomTag(0x300A, 0x0080);
/** (300A,0082) VR=DS VM=3 Beam Dose Specification Point (Retired) */
export const BeamDoseSpecificationPoint = new DicomTag(0x300A, 0x0082);
/** (300A,0083) VR=UI VM=1 Referenced Dose Reference UID */
export const ReferencedDoseReferenceUID = new DicomTag(0x300A, 0x0083);
/** (300A,0084) VR=DS VM=1 Beam Dose */
export const BeamDose = new DicomTag(0x300A, 0x0084);
/** (300A,0086) VR=DS VM=1 Beam Meterset */
export const BeamMeterset = new DicomTag(0x300A, 0x0086);
/** (300A,0088) VR=FL VM=1 Beam Dose Point Depth */
export const BeamDosePointDepth = new DicomTag(0x300A, 0x0088);
/** (300A,0089) VR=FL VM=1 Beam Dose Point Equivalent Depth */
export const BeamDosePointEquivalentDepth = new DicomTag(0x300A, 0x0089);
/** (300A,008A) VR=FL VM=1 Beam Dose Point SSD */
export const BeamDosePointSSD = new DicomTag(0x300A, 0x008A);
/** (300A,008B) VR=CS VM=1 Beam Dose Meaning */
export const BeamDoseMeaning = new DicomTag(0x300A, 0x008B);
/** (300A,008C) VR=SQ VM=1 Beam Dose Verification Control Point Sequence */
export const BeamDoseVerificationControlPointSequence = new DicomTag(0x300A, 0x008C);
/** (300A,008D) VR=FL VM=1 Average Beam Dose Point Depth (Retired) */
export const AverageBeamDosePointDepth = new DicomTag(0x300A, 0x008D);
/** (300A,008E) VR=FL VM=1 Average Beam Dose Point Equivalent Depth (Retired) */
export const AverageBeamDosePointEquivalentDepth = new DicomTag(0x300A, 0x008E);
/** (300A,008F) VR=FL VM=1 Average Beam Dose Point SSD (Retired) */
export const AverageBeamDosePointSSD = new DicomTag(0x300A, 0x008F);
/** (300A,0090) VR=CS VM=1 Beam Dose Type */
export const BeamDoseType = new DicomTag(0x300A, 0x0090);
/** (300A,0091) VR=DS VM=1 Alternate Beam Dose */
export const AlternateBeamDose = new DicomTag(0x300A, 0x0091);
/** (300A,0092) VR=CS VM=1 Alternate Beam Dose Type */
export const AlternateBeamDoseType = new DicomTag(0x300A, 0x0092);
/** (300A,0093) VR=CS VM=1 Depth Value Averaging Flag */
export const DepthValueAveragingFlag = new DicomTag(0x300A, 0x0093);
/** (300A,0094) VR=DS VM=1 Beam Dose Point Source to External Contour Distance */
export const BeamDosePointSourceToExternalContourDistance = new DicomTag(0x300A, 0x0094);
/** (300A,00A0) VR=IS VM=1 Number of Brachy Application Setups */
export const NumberOfBrachyApplicationSetups = new DicomTag(0x300A, 0x00A0);
/** (300A,00A2) VR=DS VM=3 Brachy Application Setup Dose Specification Point */
export const BrachyApplicationSetupDoseSpecificationPoint = new DicomTag(0x300A, 0x00A2);
/** (300A,00A4) VR=DS VM=1 Brachy Application Setup Dose */
export const BrachyApplicationSetupDose = new DicomTag(0x300A, 0x00A4);
/** (300A,00B0) VR=SQ VM=1 Beam Sequence */
export const BeamSequence = new DicomTag(0x300A, 0x00B0);
/** (300A,00B2) VR=SH VM=1 Treatment Machine Name */
export const TreatmentMachineName = new DicomTag(0x300A, 0x00B2);
/** (300A,00B3) VR=CS VM=1 Primary Dosimeter Unit */
export const PrimaryDosimeterUnit = new DicomTag(0x300A, 0x00B3);
/** (300A,00B4) VR=DS VM=1 Source-Axis Distance */
export const SourceAxisDistance = new DicomTag(0x300A, 0x00B4);
/** (300A,00B6) VR=SQ VM=1 Beam Limiting Device Sequence */
export const BeamLimitingDeviceSequence = new DicomTag(0x300A, 0x00B6);
/** (300A,00B8) VR=CS VM=1 RT Beam Limiting Device Type */
export const RTBeamLimitingDeviceType = new DicomTag(0x300A, 0x00B8);
/** (300A,00BA) VR=DS VM=1 Source to Beam Limiting Device Distance */
export const SourceToBeamLimitingDeviceDistance = new DicomTag(0x300A, 0x00BA);
/** (300A,00BB) VR=FL VM=1 Isocenter to Beam Limiting Device Distance */
export const IsocenterToBeamLimitingDeviceDistance = new DicomTag(0x300A, 0x00BB);
/** (300A,00BC) VR=IS VM=1 Number of Leaf/Jaw Pairs */
export const NumberOfLeafJawPairs = new DicomTag(0x300A, 0x00BC);
/** (300A,00BE) VR=DS VM=3-n Leaf Position Boundaries */
export const LeafPositionBoundaries = new DicomTag(0x300A, 0x00BE);
/** (300A,00C0) VR=IS VM=1 Beam Number */
export const BeamNumber = new DicomTag(0x300A, 0x00C0);
/** (300A,00C2) VR=LO VM=1 Beam Name */
export const BeamName = new DicomTag(0x300A, 0x00C2);
/** (300A,00C3) VR=ST VM=1 Beam Description */
export const BeamDescription = new DicomTag(0x300A, 0x00C3);
/** (300A,00C4) VR=CS VM=1 Beam Type */
export const BeamType = new DicomTag(0x300A, 0x00C4);
/** (300A,00C5) VR=FD VM=1 Beam Delivery Duration Limit */
export const BeamDeliveryDurationLimit = new DicomTag(0x300A, 0x00C5);
/** (300A,00C6) VR=CS VM=1 Radiation Type */
export const RadiationType = new DicomTag(0x300A, 0x00C6);
/** (300A,00C7) VR=CS VM=1 High-Dose Technique Type */
export const HighDoseTechniqueType = new DicomTag(0x300A, 0x00C7);
/** (300A,00C8) VR=IS VM=1 Reference Image Number */
export const ReferenceImageNumber = new DicomTag(0x300A, 0x00C8);
/** (300A,00CA) VR=SQ VM=1 Planned Verification Image Sequence */
export const PlannedVerificationImageSequence = new DicomTag(0x300A, 0x00CA);
/** (300A,00CC) VR=LO VM=1-n Imaging Device-Specific Acquisition Parameters */
export const ImagingDeviceSpecificAcquisitionParameters = new DicomTag(0x300A, 0x00CC);
/** (300A,00CE) VR=CS VM=1 Treatment Delivery Type */
export const TreatmentDeliveryType = new DicomTag(0x300A, 0x00CE);
/** (300A,00D0) VR=IS VM=1 Number of Wedges */
export const NumberOfWedges = new DicomTag(0x300A, 0x00D0);
/** (300A,00D1) VR=SQ VM=1 Wedge Sequence */
export const WedgeSequence = new DicomTag(0x300A, 0x00D1);
/** (300A,00D2) VR=IS VM=1 Wedge Number */
export const WedgeNumber = new DicomTag(0x300A, 0x00D2);
/** (300A,00D3) VR=CS VM=1 Wedge Type */
export const WedgeType = new DicomTag(0x300A, 0x00D3);
/** (300A,00D4) VR=SH VM=1 Wedge ID */
export const WedgeID = new DicomTag(0x300A, 0x00D4);
/** (300A,00D5) VR=IS VM=1 Wedge Angle */
export const WedgeAngle = new DicomTag(0x300A, 0x00D5);
/** (300A,00D6) VR=DS VM=1 Wedge Factor */
export const WedgeFactor = new DicomTag(0x300A, 0x00D6);
/** (300A,00D7) VR=FL VM=1 Total Wedge Tray Water-Equivalent Thickness */
export const TotalWedgeTrayWaterEquivalentThickness = new DicomTag(0x300A, 0x00D7);
/** (300A,00D8) VR=DS VM=1 Wedge Orientation */
export const WedgeOrientation = new DicomTag(0x300A, 0x00D8);
/** (300A,00D9) VR=FL VM=1 Isocenter to Wedge Tray Distance */
export const IsocenterToWedgeTrayDistance = new DicomTag(0x300A, 0x00D9);
/** (300A,00DA) VR=DS VM=1 Source to Wedge Tray Distance */
export const SourceToWedgeTrayDistance = new DicomTag(0x300A, 0x00DA);
/** (300A,00DB) VR=FL VM=1 Wedge Thin Edge Position */
export const WedgeThinEdgePosition = new DicomTag(0x300A, 0x00DB);
/** (300A,00DC) VR=SH VM=1 Bolus ID */
export const BolusID = new DicomTag(0x300A, 0x00DC);
/** (300A,00DD) VR=ST VM=1 Bolus Description */
export const BolusDescription = new DicomTag(0x300A, 0x00DD);
/** (300A,00DE) VR=DS VM=1 Effective Wedge Angle */
export const EffectiveWedgeAngle = new DicomTag(0x300A, 0x00DE);
/** (300A,00E0) VR=IS VM=1 Number of Compensators */
export const NumberOfCompensators = new DicomTag(0x300A, 0x00E0);
/** (300A,00E1) VR=SH VM=1 Material ID */
export const MaterialID = new DicomTag(0x300A, 0x00E1);
/** (300A,00E2) VR=DS VM=1 Total Compensator Tray Factor */
export const TotalCompensatorTrayFactor = new DicomTag(0x300A, 0x00E2);
/** (300A,00E3) VR=SQ VM=1 Compensator Sequence */
export const CompensatorSequence = new DicomTag(0x300A, 0x00E3);
/** (300A,00E4) VR=IS VM=1 Compensator Number */
export const CompensatorNumber = new DicomTag(0x300A, 0x00E4);
/** (300A,00E5) VR=SH VM=1 Compensator ID */
export const CompensatorID = new DicomTag(0x300A, 0x00E5);
/** (300A,00E6) VR=DS VM=1 Source to Compensator Tray Distance */
export const SourceToCompensatorTrayDistance = new DicomTag(0x300A, 0x00E6);
/** (300A,00E7) VR=IS VM=1 Compensator Rows */
export const CompensatorRows = new DicomTag(0x300A, 0x00E7);
/** (300A,00E8) VR=IS VM=1 Compensator Columns */
export const CompensatorColumns = new DicomTag(0x300A, 0x00E8);
/** (300A,00E9) VR=DS VM=2 Compensator Pixel Spacing */
export const CompensatorPixelSpacing = new DicomTag(0x300A, 0x00E9);
/** (300A,00EA) VR=DS VM=2 Compensator Position */
export const CompensatorPosition = new DicomTag(0x300A, 0x00EA);
/** (300A,00EB) VR=DS VM=1-n Compensator Transmission Data */
export const CompensatorTransmissionData = new DicomTag(0x300A, 0x00EB);
/** (300A,00EC) VR=DS VM=1-n Compensator Thickness Data */
export const CompensatorThicknessData = new DicomTag(0x300A, 0x00EC);
/** (300A,00ED) VR=IS VM=1 Number of Boli */
export const NumberOfBoli = new DicomTag(0x300A, 0x00ED);
/** (300A,00EE) VR=CS VM=1 Compensator Type */
export const CompensatorType = new DicomTag(0x300A, 0x00EE);
/** (300A,00EF) VR=SH VM=1 Compensator Tray ID */
export const CompensatorTrayID = new DicomTag(0x300A, 0x00EF);
/** (300A,00F0) VR=IS VM=1 Number of Blocks */
export const NumberOfBlocks = new DicomTag(0x300A, 0x00F0);
/** (300A,00F2) VR=DS VM=1 Total Block Tray Factor */
export const TotalBlockTrayFactor = new DicomTag(0x300A, 0x00F2);
/** (300A,00F3) VR=FL VM=1 Total Block Tray Water-Equivalent Thickness */
export const TotalBlockTrayWaterEquivalentThickness = new DicomTag(0x300A, 0x00F3);
/** (300A,00F4) VR=SQ VM=1 Block Sequence */
export const BlockSequence = new DicomTag(0x300A, 0x00F4);
/** (300A,00F5) VR=SH VM=1 Block Tray ID */
export const BlockTrayID = new DicomTag(0x300A, 0x00F5);
/** (300A,00F6) VR=DS VM=1 Source to Block Tray Distance */
export const SourceToBlockTrayDistance = new DicomTag(0x300A, 0x00F6);
/** (300A,00F7) VR=FL VM=1 Isocenter to Block Tray Distance */
export const IsocenterToBlockTrayDistance = new DicomTag(0x300A, 0x00F7);
/** (300A,00F8) VR=CS VM=1 Block Type */
export const BlockType = new DicomTag(0x300A, 0x00F8);
/** (300A,00F9) VR=LO VM=1 Accessory Code */
export const AccessoryCode = new DicomTag(0x300A, 0x00F9);
/** (300A,00FA) VR=CS VM=1 Block Divergence */
export const BlockDivergence = new DicomTag(0x300A, 0x00FA);
/** (300A,00FB) VR=CS VM=1 Block Mounting Position */
export const BlockMountingPosition = new DicomTag(0x300A, 0x00FB);
/** (300A,00FC) VR=IS VM=1 Block Number */
export const BlockNumber = new DicomTag(0x300A, 0x00FC);
/** (300A,00FE) VR=LO VM=1 Block Name */
export const BlockName = new DicomTag(0x300A, 0x00FE);
/** (300A,0100) VR=DS VM=1 Block Thickness */
export const BlockThickness = new DicomTag(0x300A, 0x0100);
/** (300A,0102) VR=DS VM=1 Block Transmission */
export const BlockTransmission = new DicomTag(0x300A, 0x0102);
/** (300A,0104) VR=IS VM=1 Block Number of Points */
export const BlockNumberOfPoints = new DicomTag(0x300A, 0x0104);
/** (300A,0106) VR=DS VM=2-2n Block Data */
export const BlockData = new DicomTag(0x300A, 0x0106);
/** (300A,0107) VR=SQ VM=1 Applicator Sequence */
export const ApplicatorSequence = new DicomTag(0x300A, 0x0107);
/** (300A,0108) VR=SH VM=1 Applicator ID */
export const ApplicatorID = new DicomTag(0x300A, 0x0108);
/** (300A,0109) VR=CS VM=1 Applicator Type */
export const ApplicatorType = new DicomTag(0x300A, 0x0109);
/** (300A,010A) VR=LO VM=1 Applicator Description */
export const ApplicatorDescription = new DicomTag(0x300A, 0x010A);
/** (300A,010C) VR=DS VM=1 Cumulative Dose Reference Coefficient */
export const CumulativeDoseReferenceCoefficient = new DicomTag(0x300A, 0x010C);
/** (300A,010E) VR=DS VM=1 Final Cumulative Meterset Weight */
export const FinalCumulativeMetersetWeight = new DicomTag(0x300A, 0x010E);
/** (300A,0110) VR=IS VM=1 Number of Control Points */
export const NumberOfControlPoints = new DicomTag(0x300A, 0x0110);
/** (300A,0111) VR=SQ VM=1 Control Point Sequence */
export const ControlPointSequence = new DicomTag(0x300A, 0x0111);
/** (300A,0112) VR=IS VM=1 Control Point Index */
export const ControlPointIndex = new DicomTag(0x300A, 0x0112);
/** (300A,0114) VR=DS VM=1 Nominal Beam Energy */
export const NominalBeamEnergy = new DicomTag(0x300A, 0x0114);
/** (300A,0115) VR=DS VM=1 Dose Rate Set */
export const DoseRateSet = new DicomTag(0x300A, 0x0115);
/** (300A,0116) VR=SQ VM=1 Wedge Position Sequence */
export const WedgePositionSequence = new DicomTag(0x300A, 0x0116);
/** (300A,0118) VR=CS VM=1 Wedge Position */
export const WedgePosition = new DicomTag(0x300A, 0x0118);
/** (300A,011A) VR=SQ VM=1 Beam Limiting Device Position Sequence */
export const BeamLimitingDevicePositionSequence = new DicomTag(0x300A, 0x011A);
/** (300A,011C) VR=DS VM=2-2n Leaf/Jaw Positions */
export const LeafJawPositions = new DicomTag(0x300A, 0x011C);
/** (300A,011E) VR=DS VM=1 Gantry Angle */
export const GantryAngle = new DicomTag(0x300A, 0x011E);
/** (300A,011F) VR=CS VM=1 Gantry Rotation Direction */
export const GantryRotationDirection = new DicomTag(0x300A, 0x011F);
/** (300A,0120) VR=DS VM=1 Beam Limiting Device Angle */
export const BeamLimitingDeviceAngle = new DicomTag(0x300A, 0x0120);
/** (300A,0121) VR=CS VM=1 Beam Limiting Device Rotation Direction */
export const BeamLimitingDeviceRotationDirection = new DicomTag(0x300A, 0x0121);
/** (300A,0122) VR=DS VM=1 Patient Support Angle */
export const PatientSupportAngle = new DicomTag(0x300A, 0x0122);
/** (300A,0123) VR=CS VM=1 Patient Support Rotation Direction */
export const PatientSupportRotationDirection = new DicomTag(0x300A, 0x0123);
/** (300A,0124) VR=DS VM=1 Table Top Eccentric Axis Distance */
export const TableTopEccentricAxisDistance = new DicomTag(0x300A, 0x0124);
/** (300A,0125) VR=DS VM=1 Table Top Eccentric Angle */
export const TableTopEccentricAngle = new DicomTag(0x300A, 0x0125);
/** (300A,0126) VR=CS VM=1 Table Top Eccentric Rotation Direction */
export const TableTopEccentricRotationDirection = new DicomTag(0x300A, 0x0126);
/** (300A,0128) VR=DS VM=1 Table Top Vertical Position */
export const TableTopVerticalPosition = new DicomTag(0x300A, 0x0128);
/** (300A,0129) VR=DS VM=1 Table Top Longitudinal Position */
export const TableTopLongitudinalPosition = new DicomTag(0x300A, 0x0129);
/** (300A,012A) VR=DS VM=1 Table Top Lateral Position */
export const TableTopLateralPosition = new DicomTag(0x300A, 0x012A);
/** (300A,012C) VR=DS VM=3 Isocenter Position */
export const IsocenterPosition = new DicomTag(0x300A, 0x012C);
/** (300A,012E) VR=DS VM=3 Surface Entry Point */
export const SurfaceEntryPoint = new DicomTag(0x300A, 0x012E);
/** (300A,0130) VR=DS VM=1 Source to Surface Distance */
export const SourceToSurfaceDistance = new DicomTag(0x300A, 0x0130);
/** (300A,0131) VR=FL VM=1 Average Beam Dose Point Source to External Contour Distance */
export const AverageBeamDosePointSourceToExternalContourDistance = new DicomTag(0x300A, 0x0131);
/** (300A,0132) VR=FL VM=1 Source to External Contour Distance */
export const SourceToExternalContourDistance = new DicomTag(0x300A, 0x0132);
/** (300A,0133) VR=FL VM=3 External Contour Entry Point */
export const ExternalContourEntryPoint = new DicomTag(0x300A, 0x0133);
/** (300A,0134) VR=DS VM=1 Cumulative Meterset Weight */
export const CumulativeMetersetWeight = new DicomTag(0x300A, 0x0134);
/** (300A,0140) VR=FL VM=1 Table Top Pitch Angle */
export const TableTopPitchAngle = new DicomTag(0x300A, 0x0140);
/** (300A,0142) VR=CS VM=1 Table Top Pitch Rotation Direction */
export const TableTopPitchRotationDirection = new DicomTag(0x300A, 0x0142);
/** (300A,0144) VR=FL VM=1 Table Top Roll Angle */
export const TableTopRollAngle = new DicomTag(0x300A, 0x0144);
/** (300A,0146) VR=CS VM=1 Table Top Roll Rotation Direction */
export const TableTopRollRotationDirection = new DicomTag(0x300A, 0x0146);
/** (300A,0148) VR=FL VM=1 Head Fixation Angle */
export const HeadFixationAngle = new DicomTag(0x300A, 0x0148);
/** (300A,014A) VR=FL VM=1 Gantry Pitch Angle */
export const GantryPitchAngle = new DicomTag(0x300A, 0x014A);
/** (300A,014C) VR=CS VM=1 Gantry Pitch Rotation Direction */
export const GantryPitchRotationDirection = new DicomTag(0x300A, 0x014C);
/** (300A,014E) VR=FL VM=1 Gantry Pitch Angle Tolerance */
export const GantryPitchAngleTolerance = new DicomTag(0x300A, 0x014E);
/** (300A,0150) VR=CS VM=1 Fixation Eye */
export const FixationEye = new DicomTag(0x300A, 0x0150);
/** (300A,0151) VR=DS VM=1 Chair Head Frame Position */
export const ChairHeadFramePosition = new DicomTag(0x300A, 0x0151);
/** (300A,0152) VR=DS VM=1 Head Fixation Angle Tolerance */
export const HeadFixationAngleTolerance = new DicomTag(0x300A, 0x0152);
/** (300A,0153) VR=DS VM=1 Chair Head Frame Position Tolerance */
export const ChairHeadFramePositionTolerance = new DicomTag(0x300A, 0x0153);
/** (300A,0154) VR=DS VM=1 Fixation Light Azimuthal Angle Tolerance */
export const FixationLightAzimuthalAngleTolerance = new DicomTag(0x300A, 0x0154);
/** (300A,0155) VR=DS VM=1 Fixation Light Polar Angle Tolerance */
export const FixationLightPolarAngleTolerance = new DicomTag(0x300A, 0x0155);
/** (300A,0180) VR=SQ VM=1 Patient Setup Sequence */
export const PatientSetupSequence = new DicomTag(0x300A, 0x0180);
/** (300A,0182) VR=IS VM=1 Patient Setup Number */
export const PatientSetupNumber = new DicomTag(0x300A, 0x0182);
/** (300A,0183) VR=LO VM=1 Patient Setup Label */
export const PatientSetupLabel = new DicomTag(0x300A, 0x0183);
/** (300A,0184) VR=LO VM=1 Patient Additional Position */
export const PatientAdditionalPosition = new DicomTag(0x300A, 0x0184);
/** (300A,0190) VR=SQ VM=1 Fixation Device Sequence */
export const FixationDeviceSequence = new DicomTag(0x300A, 0x0190);
/** (300A,0192) VR=CS VM=1 Fixation Device Type */
export const FixationDeviceType = new DicomTag(0x300A, 0x0192);
/** (300A,0194) VR=SH VM=1 Fixation Device Label */
export const FixationDeviceLabel = new DicomTag(0x300A, 0x0194);
/** (300A,0196) VR=ST VM=1 Fixation Device Description */
export const FixationDeviceDescription = new DicomTag(0x300A, 0x0196);
/** (300A,0198) VR=SH VM=1 Fixation Device Position */
export const FixationDevicePosition = new DicomTag(0x300A, 0x0198);
/** (300A,0199) VR=FL VM=1 Fixation Device Pitch Angle */
export const FixationDevicePitchAngle = new DicomTag(0x300A, 0x0199);
/** (300A,019A) VR=FL VM=1 Fixation Device Roll Angle */
export const FixationDeviceRollAngle = new DicomTag(0x300A, 0x019A);
/** (300A,01A0) VR=SQ VM=1 Shielding Device Sequence */
export const ShieldingDeviceSequence = new DicomTag(0x300A, 0x01A0);
/** (300A,01A2) VR=CS VM=1 Shielding Device Type */
export const ShieldingDeviceType = new DicomTag(0x300A, 0x01A2);
/** (300A,01A4) VR=SH VM=1 Shielding Device Label */
export const ShieldingDeviceLabel = new DicomTag(0x300A, 0x01A4);
/** (300A,01A6) VR=ST VM=1 Shielding Device Description */
export const ShieldingDeviceDescription = new DicomTag(0x300A, 0x01A6);
/** (300A,01A8) VR=SH VM=1 Shielding Device Position */
export const ShieldingDevicePosition = new DicomTag(0x300A, 0x01A8);
/** (300A,01B0) VR=CS VM=1 Setup Technique */
export const SetupTechnique = new DicomTag(0x300A, 0x01B0);
/** (300A,01B2) VR=ST VM=1 Setup Technique Description */
export const SetupTechniqueDescription = new DicomTag(0x300A, 0x01B2);
/** (300A,01B4) VR=SQ VM=1 Setup Device Sequence */
export const SetupDeviceSequence = new DicomTag(0x300A, 0x01B4);
/** (300A,01B6) VR=CS VM=1 Setup Device Type */
export const SetupDeviceType = new DicomTag(0x300A, 0x01B6);
/** (300A,01B8) VR=SH VM=1 Setup Device Label */
export const SetupDeviceLabel = new DicomTag(0x300A, 0x01B8);
/** (300A,01BA) VR=ST VM=1 Setup Device Description */
export const SetupDeviceDescription = new DicomTag(0x300A, 0x01BA);
/** (300A,01BC) VR=DS VM=1 Setup Device Parameter */
export const SetupDeviceParameter = new DicomTag(0x300A, 0x01BC);
/** (300A,01D0) VR=ST VM=1 Setup Reference Description */
export const SetupReferenceDescription = new DicomTag(0x300A, 0x01D0);
/** (300A,01D2) VR=DS VM=1 Table Top Vertical Setup Displacement */
export const TableTopVerticalSetupDisplacement = new DicomTag(0x300A, 0x01D2);
/** (300A,01D4) VR=DS VM=1 Table Top Longitudinal Setup Displacement */
export const TableTopLongitudinalSetupDisplacement = new DicomTag(0x300A, 0x01D4);
/** (300A,01D6) VR=DS VM=1 Table Top Lateral Setup Displacement */
export const TableTopLateralSetupDisplacement = new DicomTag(0x300A, 0x01D6);
/** (300A,0200) VR=CS VM=1 Brachy Treatment Technique */
export const BrachyTreatmentTechnique = new DicomTag(0x300A, 0x0200);
/** (300A,0202) VR=CS VM=1 Brachy Treatment Type */
export const BrachyTreatmentType = new DicomTag(0x300A, 0x0202);
/** (300A,0206) VR=SQ VM=1 Treatment Machine Sequence */
export const TreatmentMachineSequence = new DicomTag(0x300A, 0x0206);
/** (300A,0210) VR=SQ VM=1 Source Sequence */
export const SourceSequence = new DicomTag(0x300A, 0x0210);
/** (300A,0212) VR=IS VM=1 Source Number */
export const SourceNumber = new DicomTag(0x300A, 0x0212);
/** (300A,0214) VR=CS VM=1 Source Type */
export const SourceType = new DicomTag(0x300A, 0x0214);
/** (300A,0216) VR=LO VM=1 Source Manufacturer */
export const SourceManufacturer = new DicomTag(0x300A, 0x0216);
/** (300A,0218) VR=DS VM=1 Active Source Diameter */
export const ActiveSourceDiameter = new DicomTag(0x300A, 0x0218);
/** (300A,021A) VR=DS VM=1 Active Source Length */
export const ActiveSourceLength = new DicomTag(0x300A, 0x021A);
/** (300A,021B) VR=SH VM=1 Source Model ID */
export const SourceModelID = new DicomTag(0x300A, 0x021B);
/** (300A,021C) VR=LO VM=1 Source Description */
export const SourceDescription = new DicomTag(0x300A, 0x021C);
/** (300A,0222) VR=DS VM=1 Source Encapsulation Nominal Thickness */
export const SourceEncapsulationNominalThickness = new DicomTag(0x300A, 0x0222);
/** (300A,0224) VR=DS VM=1 Source Encapsulation Nominal Transmission */
export const SourceEncapsulationNominalTransmission = new DicomTag(0x300A, 0x0224);
/** (300A,0226) VR=LO VM=1 Source Isotope Name */
export const SourceIsotopeName = new DicomTag(0x300A, 0x0226);
/** (300A,0228) VR=DS VM=1 Source Isotope Half Life */
export const SourceIsotopeHalfLife = new DicomTag(0x300A, 0x0228);
/** (300A,0229) VR=CS VM=1 Source Strength Units */
export const SourceStrengthUnits = new DicomTag(0x300A, 0x0229);
/** (300A,022A) VR=DS VM=1 Reference Air Kerma Rate */
export const ReferenceAirKermaRate = new DicomTag(0x300A, 0x022A);
/** (300A,022B) VR=DS VM=1 Source Strength */
export const SourceStrength = new DicomTag(0x300A, 0x022B);
/** (300A,022C) VR=DA VM=1 Source Strength Reference Date */
export const SourceStrengthReferenceDate = new DicomTag(0x300A, 0x022C);
/** (300A,022E) VR=TM VM=1 Source Strength Reference Time */
export const SourceStrengthReferenceTime = new DicomTag(0x300A, 0x022E);
/** (300A,0230) VR=SQ VM=1 Application Setup Sequence */
export const ApplicationSetupSequence = new DicomTag(0x300A, 0x0230);
/** (300A,0232) VR=CS VM=1 Application Setup Type */
export const ApplicationSetupType = new DicomTag(0x300A, 0x0232);
/** (300A,0234) VR=IS VM=1 Application Setup Number */
export const ApplicationSetupNumber = new DicomTag(0x300A, 0x0234);
/** (300A,0236) VR=LO VM=1 Application Setup Name */
export const ApplicationSetupName = new DicomTag(0x300A, 0x0236);
/** (300A,0238) VR=LO VM=1 Application Setup Manufacturer */
export const ApplicationSetupManufacturer = new DicomTag(0x300A, 0x0238);
/** (300A,0240) VR=IS VM=1 Template Number */
export const TemplateNumber = new DicomTag(0x300A, 0x0240);
/** (300A,0242) VR=SH VM=1 Template Type */
export const TemplateType = new DicomTag(0x300A, 0x0242);
/** (300A,0244) VR=LO VM=1 Template Name */
export const TemplateName = new DicomTag(0x300A, 0x0244);
/** (300A,0250) VR=DS VM=1 Total Reference Air Kerma */
export const TotalReferenceAirKerma = new DicomTag(0x300A, 0x0250);
/** (300A,0260) VR=SQ VM=1 Brachy Accessory Device Sequence */
export const BrachyAccessoryDeviceSequence = new DicomTag(0x300A, 0x0260);
/** (300A,0262) VR=IS VM=1 Brachy Accessory Device Number */
export const BrachyAccessoryDeviceNumber = new DicomTag(0x300A, 0x0262);
/** (300A,0263) VR=SH VM=1 Brachy Accessory Device ID */
export const BrachyAccessoryDeviceID = new DicomTag(0x300A, 0x0263);
/** (300A,0264) VR=CS VM=1 Brachy Accessory Device Type */
export const BrachyAccessoryDeviceType = new DicomTag(0x300A, 0x0264);
/** (300A,0266) VR=LO VM=1 Brachy Accessory Device Name */
export const BrachyAccessoryDeviceName = new DicomTag(0x300A, 0x0266);
/** (300A,026A) VR=DS VM=1 Brachy Accessory Device Nominal Thickness */
export const BrachyAccessoryDeviceNominalThickness = new DicomTag(0x300A, 0x026A);
/** (300A,026C) VR=DS VM=1 Brachy Accessory Device Nominal Transmission */
export const BrachyAccessoryDeviceNominalTransmission = new DicomTag(0x300A, 0x026C);
/** (300A,0271) VR=DS VM=1 Channel Effective Length */
export const ChannelEffectiveLength = new DicomTag(0x300A, 0x0271);
/** (300A,0272) VR=DS VM=1 Channel Inner Length */
export const ChannelInnerLength = new DicomTag(0x300A, 0x0272);
/** (300A,0273) VR=SH VM=1 Afterloader Channel ID */
export const AfterloaderChannelID = new DicomTag(0x300A, 0x0273);
/** (300A,0274) VR=DS VM=1 Source Applicator Tip Length */
export const SourceApplicatorTipLength = new DicomTag(0x300A, 0x0274);
/** (300A,0280) VR=SQ VM=1 Channel Sequence */
export const ChannelSequence = new DicomTag(0x300A, 0x0280);
/** (300A,0282) VR=IS VM=1 Channel Number */
export const ChannelNumber = new DicomTag(0x300A, 0x0282);
/** (300A,0284) VR=DS VM=1 Channel Length */
export const ChannelLength = new DicomTag(0x300A, 0x0284);
/** (300A,0286) VR=DS VM=1 Channel Total Time */
export const ChannelTotalTime = new DicomTag(0x300A, 0x0286);
/** (300A,0288) VR=CS VM=1 Source Movement Type */
export const SourceMovementType = new DicomTag(0x300A, 0x0288);
/** (300A,028A) VR=IS VM=1 Number of Pulses */
export const NumberOfPulses = new DicomTag(0x300A, 0x028A);
/** (300A,028C) VR=DS VM=1 Pulse Repetition Interval */
export const PulseRepetitionInterval = new DicomTag(0x300A, 0x028C);
/** (300A,0290) VR=IS VM=1 Source Applicator Number */
export const SourceApplicatorNumber = new DicomTag(0x300A, 0x0290);
/** (300A,0291) VR=SH VM=1 Source Applicator ID */
export const SourceApplicatorID = new DicomTag(0x300A, 0x0291);
/** (300A,0292) VR=CS VM=1 Source Applicator Type */
export const SourceApplicatorType = new DicomTag(0x300A, 0x0292);
/** (300A,0294) VR=LO VM=1 Source Applicator Name */
export const SourceApplicatorName = new DicomTag(0x300A, 0x0294);
/** (300A,0296) VR=DS VM=1 Source Applicator Length */
export const SourceApplicatorLength = new DicomTag(0x300A, 0x0296);
/** (300A,0298) VR=LO VM=1 Source Applicator Manufacturer */
export const SourceApplicatorManufacturer = new DicomTag(0x300A, 0x0298);
/** (300A,029C) VR=DS VM=1 Source Applicator Wall Nominal Thickness */
export const SourceApplicatorWallNominalThickness = new DicomTag(0x300A, 0x029C);
/** (300A,029E) VR=DS VM=1 Source Applicator Wall Nominal Transmission */
export const SourceApplicatorWallNominalTransmission = new DicomTag(0x300A, 0x029E);
/** (300A,02A0) VR=DS VM=1 Source Applicator Step Size */
export const SourceApplicatorStepSize = new DicomTag(0x300A, 0x02A0);
/** (300A,02A1) VR=IS VM=1 Applicator Shape Referenced ROI Number */
export const ApplicatorShapeReferencedROINumber = new DicomTag(0x300A, 0x02A1);
/** (300A,02A2) VR=IS VM=1 Transfer Tube Number */
export const TransferTubeNumber = new DicomTag(0x300A, 0x02A2);
/** (300A,02A4) VR=DS VM=1 Transfer Tube Length */
export const TransferTubeLength = new DicomTag(0x300A, 0x02A4);
/** (300A,02B0) VR=SQ VM=1 Channel Shield Sequence */
export const ChannelShieldSequence = new DicomTag(0x300A, 0x02B0);
/** (300A,02B2) VR=IS VM=1 Channel Shield Number */
export const ChannelShieldNumber = new DicomTag(0x300A, 0x02B2);
/** (300A,02B3) VR=SH VM=1 Channel Shield ID */
export const ChannelShieldID = new DicomTag(0x300A, 0x02B3);
/** (300A,02B4) VR=LO VM=1 Channel Shield Name */
export const ChannelShieldName = new DicomTag(0x300A, 0x02B4);
/** (300A,02B8) VR=DS VM=1 Channel Shield Nominal Thickness */
export const ChannelShieldNominalThickness = new DicomTag(0x300A, 0x02B8);
/** (300A,02BA) VR=DS VM=1 Channel Shield Nominal Transmission */
export const ChannelShieldNominalTransmission = new DicomTag(0x300A, 0x02BA);
/** (300A,02C8) VR=DS VM=1 Final Cumulative Time Weight */
export const FinalCumulativeTimeWeight = new DicomTag(0x300A, 0x02C8);
/** (300A,02D0) VR=SQ VM=1 Brachy Control Point Sequence */
export const BrachyControlPointSequence = new DicomTag(0x300A, 0x02D0);
/** (300A,02D2) VR=DS VM=1 Control Point Relative Position */
export const ControlPointRelativePosition = new DicomTag(0x300A, 0x02D2);
/** (300A,02D4) VR=DS VM=3 Control Point 3D Position */
export const ControlPoint3DPosition = new DicomTag(0x300A, 0x02D4);
/** (300A,02D6) VR=DS VM=1 Cumulative Time Weight */
export const CumulativeTimeWeight = new DicomTag(0x300A, 0x02D6);
/** (300A,02E0) VR=CS VM=1 Compensator Divergence */
export const CompensatorDivergence = new DicomTag(0x300A, 0x02E0);
/** (300A,02E1) VR=CS VM=1 Compensator Mounting Position */
export const CompensatorMountingPosition = new DicomTag(0x300A, 0x02E1);
/** (300A,02E2) VR=DS VM=1-n Source to Compensator Distance */
export const SourceToCompensatorDistance = new DicomTag(0x300A, 0x02E2);
/** (300A,02E3) VR=FL VM=1 Total Compensator Tray Water-Equivalent Thickness */
export const TotalCompensatorTrayWaterEquivalentThickness = new DicomTag(0x300A, 0x02E3);
/** (300A,02E4) VR=FL VM=1 Isocenter to Compensator Tray Distance */
export const IsocenterToCompensatorTrayDistance = new DicomTag(0x300A, 0x02E4);
/** (300A,02E5) VR=FL VM=1 Compensator Column Offset */
export const CompensatorColumnOffset = new DicomTag(0x300A, 0x02E5);
/** (300A,02E6) VR=FL VM=1-n Isocenter to Compensator Distances */
export const IsocenterToCompensatorDistances = new DicomTag(0x300A, 0x02E6);
/** (300A,02E7) VR=FL VM=1 Compensator Relative Stopping Power Ratio */
export const CompensatorRelativeStoppingPowerRatio = new DicomTag(0x300A, 0x02E7);
/** (300A,02E8) VR=FL VM=1 Compensator Milling Tool Diameter */
export const CompensatorMillingToolDiameter = new DicomTag(0x300A, 0x02E8);
/** (300A,02EA) VR=SQ VM=1 Ion Range Compensator Sequence */
export const IonRangeCompensatorSequence = new DicomTag(0x300A, 0x02EA);
/** (300A,02EB) VR=LT VM=1 Compensator Description */
export const CompensatorDescription = new DicomTag(0x300A, 0x02EB);
/** (300A,02EC) VR=CS VM=1 Compensator Surface Representation Flag */
export const CompensatorSurfaceRepresentationFlag = new DicomTag(0x300A, 0x02EC);
/** (300A,0302) VR=IS VM=1 Radiation Mass Number */
export const RadiationMassNumber = new DicomTag(0x300A, 0x0302);
/** (300A,0304) VR=IS VM=1 Radiation Atomic Number */
export const RadiationAtomicNumber = new DicomTag(0x300A, 0x0304);
/** (300A,0306) VR=SS VM=1 Radiation Charge State */
export const RadiationChargeState = new DicomTag(0x300A, 0x0306);
/** (300A,0308) VR=CS VM=1 Scan Mode */
export const ScanMode = new DicomTag(0x300A, 0x0308);
/** (300A,0309) VR=CS VM=1 Modulated Scan Mode Type */
export const ModulatedScanModeType = new DicomTag(0x300A, 0x0309);
/** (300A,030A) VR=FL VM=2 Virtual Source-Axis Distances */
export const VirtualSourceAxisDistances = new DicomTag(0x300A, 0x030A);
/** (300A,030C) VR=SQ VM=1 Snout Sequence */
export const SnoutSequence = new DicomTag(0x300A, 0x030C);
/** (300A,030D) VR=FL VM=1 Snout Position */
export const SnoutPosition = new DicomTag(0x300A, 0x030D);
/** (300A,030F) VR=SH VM=1 Snout ID */
export const SnoutID = new DicomTag(0x300A, 0x030F);
/** (300A,0312) VR=IS VM=1 Number of Range Shifters */
export const NumberOfRangeShifters = new DicomTag(0x300A, 0x0312);
/** (300A,0314) VR=SQ VM=1 Range Shifter Sequence */
export const RangeShifterSequence = new DicomTag(0x300A, 0x0314);
/** (300A,0316) VR=IS VM=1 Range Shifter Number */
export const RangeShifterNumber = new DicomTag(0x300A, 0x0316);
/** (300A,0318) VR=SH VM=1 Range Shifter ID */
export const RangeShifterID = new DicomTag(0x300A, 0x0318);
/** (300A,0320) VR=CS VM=1 Range Shifter Type */
export const RangeShifterType = new DicomTag(0x300A, 0x0320);
/** (300A,0322) VR=LO VM=1 Range Shifter Description */
export const RangeShifterDescription = new DicomTag(0x300A, 0x0322);
/** (300A,0330) VR=IS VM=1 Number of Lateral Spreading Devices */
export const NumberOfLateralSpreadingDevices = new DicomTag(0x300A, 0x0330);
/** (300A,0332) VR=SQ VM=1 Lateral Spreading Device Sequence */
export const LateralSpreadingDeviceSequence = new DicomTag(0x300A, 0x0332);
/** (300A,0334) VR=IS VM=1 Lateral Spreading Device Number */
export const LateralSpreadingDeviceNumber = new DicomTag(0x300A, 0x0334);
/** (300A,0336) VR=SH VM=1 Lateral Spreading Device ID */
export const LateralSpreadingDeviceID = new DicomTag(0x300A, 0x0336);
/** (300A,0338) VR=CS VM=1 Lateral Spreading Device Type */
export const LateralSpreadingDeviceType = new DicomTag(0x300A, 0x0338);
/** (300A,033A) VR=LO VM=1 Lateral Spreading Device Description */
export const LateralSpreadingDeviceDescription = new DicomTag(0x300A, 0x033A);
/** (300A,033C) VR=FL VM=1 Lateral Spreading Device Water Equivalent Thickness */
export const LateralSpreadingDeviceWaterEquivalentThickness = new DicomTag(0x300A, 0x033C);
/** (300A,0340) VR=IS VM=1 Number of Range Modulators */
export const NumberOfRangeModulators = new DicomTag(0x300A, 0x0340);
/** (300A,0342) VR=SQ VM=1 Range Modulator Sequence */
export const RangeModulatorSequence = new DicomTag(0x300A, 0x0342);
/** (300A,0344) VR=IS VM=1 Range Modulator Number */
export const RangeModulatorNumber = new DicomTag(0x300A, 0x0344);
/** (300A,0346) VR=SH VM=1 Range Modulator ID */
export const RangeModulatorID = new DicomTag(0x300A, 0x0346);
/** (300A,0348) VR=CS VM=1 Range Modulator Type */
export const RangeModulatorType = new DicomTag(0x300A, 0x0348);
/** (300A,034A) VR=LO VM=1 Range Modulator Description */
export const RangeModulatorDescription = new DicomTag(0x300A, 0x034A);
/** (300A,034C) VR=SH VM=1 Beam Current Modulation ID */
export const BeamCurrentModulationID = new DicomTag(0x300A, 0x034C);
/** (300A,0350) VR=CS VM=1 Patient Support Type */
export const PatientSupportType = new DicomTag(0x300A, 0x0350);
/** (300A,0352) VR=SH VM=1 Patient Support ID */
export const PatientSupportID = new DicomTag(0x300A, 0x0352);
/** (300A,0354) VR=LO VM=1 Patient Support Accessory Code */
export const PatientSupportAccessoryCode = new DicomTag(0x300A, 0x0354);
/** (300A,0355) VR=LO VM=1 Tray Accessory Code */
export const TrayAccessoryCode = new DicomTag(0x300A, 0x0355);
/** (300A,0356) VR=FL VM=1 Fixation Light Azimuthal Angle */
export const FixationLightAzimuthalAngle = new DicomTag(0x300A, 0x0356);
/** (300A,0358) VR=FL VM=1 Fixation Light Polar Angle */
export const FixationLightPolarAngle = new DicomTag(0x300A, 0x0358);
/** (300A,035A) VR=FL VM=1 Meterset Rate */
export const MetersetRate = new DicomTag(0x300A, 0x035A);
/** (300A,0360) VR=SQ VM=1 Range Shifter Settings Sequence */
export const RangeShifterSettingsSequence = new DicomTag(0x300A, 0x0360);
/** (300A,0362) VR=LO VM=1 Range Shifter Setting */
export const RangeShifterSetting = new DicomTag(0x300A, 0x0362);
/** (300A,0364) VR=FL VM=1 Isocenter to Range Shifter Distance */
export const IsocenterToRangeShifterDistance = new DicomTag(0x300A, 0x0364);
/** (300A,0366) VR=FL VM=1 Range Shifter Water Equivalent Thickness */
export const RangeShifterWaterEquivalentThickness = new DicomTag(0x300A, 0x0366);
/** (300A,0370) VR=SQ VM=1 Lateral Spreading Device Settings Sequence */
export const LateralSpreadingDeviceSettingsSequence = new DicomTag(0x300A, 0x0370);
/** (300A,0372) VR=LO VM=1 Lateral Spreading Device Setting */
export const LateralSpreadingDeviceSetting = new DicomTag(0x300A, 0x0372);
/** (300A,0374) VR=FL VM=1 Isocenter to Lateral Spreading Device Distance */
export const IsocenterToLateralSpreadingDeviceDistance = new DicomTag(0x300A, 0x0374);
/** (300A,0380) VR=SQ VM=1 Range Modulator Settings Sequence */
export const RangeModulatorSettingsSequence = new DicomTag(0x300A, 0x0380);
/** (300A,0382) VR=FL VM=1 Range Modulator Gating Start Value */
export const RangeModulatorGatingStartValue = new DicomTag(0x300A, 0x0382);
/** (300A,0384) VR=FL VM=1 Range Modulator Gating Stop Value */
export const RangeModulatorGatingStopValue = new DicomTag(0x300A, 0x0384);
/** (300A,0386) VR=FL VM=1 Range Modulator Gating Start Water Equivalent Thickness */
export const RangeModulatorGatingStartWaterEquivalentThickness = new DicomTag(0x300A, 0x0386);
/** (300A,0388) VR=FL VM=1 Range Modulator Gating Stop Water Equivalent Thickness */
export const RangeModulatorGatingStopWaterEquivalentThickness = new DicomTag(0x300A, 0x0388);
/** (300A,038A) VR=FL VM=1 Isocenter to Range Modulator Distance */
export const IsocenterToRangeModulatorDistance = new DicomTag(0x300A, 0x038A);
/** (300A,038F) VR=FL VM=1-n Scan Spot Time Offset */
export const ScanSpotTimeOffset = new DicomTag(0x300A, 0x038F);
/** (300A,0390) VR=SH VM=1 Scan Spot Tune ID */
export const ScanSpotTuneID = new DicomTag(0x300A, 0x0390);
/** (300A,0391) VR=IS VM=1-n Scan Spot Prescribed Indices */
export const ScanSpotPrescribedIndices = new DicomTag(0x300A, 0x0391);
/** (300A,0392) VR=IS VM=1 Number of Scan Spot Positions */
export const NumberOfScanSpotPositions = new DicomTag(0x300A, 0x0392);
/** (300A,0393) VR=CS VM=1 Scan Spot Reordered */
export const ScanSpotReordered = new DicomTag(0x300A, 0x0393);
/** (300A,0394) VR=FL VM=1-n Scan Spot Position Map */
export const ScanSpotPositionMap = new DicomTag(0x300A, 0x0394);
/** (300A,0395) VR=CS VM=1 Scan Spot Reordering Allowed */
export const ScanSpotReorderingAllowed = new DicomTag(0x300A, 0x0395);
/** (300A,0396) VR=FL VM=1-n Scan Spot Meterset Weights */
export const ScanSpotMetersetWeights = new DicomTag(0x300A, 0x0396);
/** (300A,0398) VR=FL VM=2 Scanning Spot Size */
export const ScanningSpotSize = new DicomTag(0x300A, 0x0398);
/** (300A,0399) VR=FL VM=2-2n Scan Spot Sizes Delivered */
export const ScanSpotSizesDelivered = new DicomTag(0x300A, 0x0399);
/** (300A,039A) VR=IS VM=1 Number of Paintings */
export const NumberOfPaintings = new DicomTag(0x300A, 0x039A);
/** (300A,039B) VR=FL VM=1-n Scan Spot Gantry Angles */
export const ScanSpotGantryAngles = new DicomTag(0x300A, 0x039B);
/** (300A,039C) VR=FL VM=1-n Scan Spot Patient Support Angles */
export const ScanSpotPatientSupportAngles = new DicomTag(0x300A, 0x039C);
/** (300A,03A0) VR=SQ VM=1 Ion Tolerance Table Sequence */
export const IonToleranceTableSequence = new DicomTag(0x300A, 0x03A0);
/** (300A,03A2) VR=SQ VM=1 Ion Beam Sequence */
export const IonBeamSequence = new DicomTag(0x300A, 0x03A2);
/** (300A,03A4) VR=SQ VM=1 Ion Beam Limiting Device Sequence */
export const IonBeamLimitingDeviceSequence = new DicomTag(0x300A, 0x03A4);
/** (300A,03A6) VR=SQ VM=1 Ion Block Sequence */
export const IonBlockSequence = new DicomTag(0x300A, 0x03A6);
/** (300A,03A8) VR=SQ VM=1 Ion Control Point Sequence */
export const IonControlPointSequence = new DicomTag(0x300A, 0x03A8);
/** (300A,03AA) VR=SQ VM=1 Ion Wedge Sequence */
export const IonWedgeSequence = new DicomTag(0x300A, 0x03AA);
/** (300A,03AC) VR=SQ VM=1 Ion Wedge Position Sequence */
export const IonWedgePositionSequence = new DicomTag(0x300A, 0x03AC);
/** (300A,0401) VR=SQ VM=1 Referenced Setup Image Sequence */
export const ReferencedSetupImageSequence = new DicomTag(0x300A, 0x0401);
/** (300A,0402) VR=ST VM=1 Setup Image Comment */
export const SetupImageComment = new DicomTag(0x300A, 0x0402);
/** (300A,0410) VR=SQ VM=1 Motion Synchronization Sequence */
export const MotionSynchronizationSequence = new DicomTag(0x300A, 0x0410);
/** (300A,0412) VR=FL VM=3 Control Point Orientation */
export const ControlPointOrientation = new DicomTag(0x300A, 0x0412);
/** (300A,0420) VR=SQ VM=1 General Accessory Sequence */
export const GeneralAccessorySequence = new DicomTag(0x300A, 0x0420);
/** (300A,0421) VR=SH VM=1 General Accessory ID */
export const GeneralAccessoryID = new DicomTag(0x300A, 0x0421);
/** (300A,0422) VR=ST VM=1 General Accessory Description */
export const GeneralAccessoryDescription = new DicomTag(0x300A, 0x0422);
/** (300A,0423) VR=CS VM=1 General Accessory Type */
export const GeneralAccessoryType = new DicomTag(0x300A, 0x0423);
/** (300A,0424) VR=IS VM=1 General Accessory Number */
export const GeneralAccessoryNumber = new DicomTag(0x300A, 0x0424);
/** (300A,0425) VR=FL VM=1 Source to General Accessory Distance */
export const SourceToGeneralAccessoryDistance = new DicomTag(0x300A, 0x0425);
/** (300A,0426) VR=DS VM=1 Isocenter to General Accessory Distance */
export const IsocenterToGeneralAccessoryDistance = new DicomTag(0x300A, 0x0426);
/** (300A,0431) VR=SQ VM=1 Applicator Geometry Sequence */
export const ApplicatorGeometrySequence = new DicomTag(0x300A, 0x0431);
/** (300A,0432) VR=CS VM=1 Applicator Aperture Shape */
export const ApplicatorApertureShape = new DicomTag(0x300A, 0x0432);
/** (300A,0433) VR=FL VM=1 Applicator Opening */
export const ApplicatorOpening = new DicomTag(0x300A, 0x0433);
/** (300A,0434) VR=FL VM=1 Applicator Opening X */
export const ApplicatorOpeningX = new DicomTag(0x300A, 0x0434);
/** (300A,0435) VR=FL VM=1 Applicator Opening Y */
export const ApplicatorOpeningY = new DicomTag(0x300A, 0x0435);
/** (300A,0436) VR=FL VM=1 Source to Applicator Mounting Position Distance */
export const SourceToApplicatorMountingPositionDistance = new DicomTag(0x300A, 0x0436);
/** (300A,0440) VR=IS VM=1 Number of Block Slab Items */
export const NumberOfBlockSlabItems = new DicomTag(0x300A, 0x0440);
/** (300A,0441) VR=SQ VM=1 Block Slab Sequence */
export const BlockSlabSequence = new DicomTag(0x300A, 0x0441);
/** (300A,0442) VR=DS VM=1 Block Slab Thickness */
export const BlockSlabThickness = new DicomTag(0x300A, 0x0442);
/** (300A,0443) VR=US VM=1 Block Slab Number */
export const BlockSlabNumber = new DicomTag(0x300A, 0x0443);
/** (300A,0450) VR=SQ VM=1 Device Motion Control Sequence */
export const DeviceMotionControlSequence = new DicomTag(0x300A, 0x0450);
/** (300A,0451) VR=CS VM=1 Device Motion Execution Mode */
export const DeviceMotionExecutionMode = new DicomTag(0x300A, 0x0451);
/** (300A,0452) VR=CS VM=1 Device Motion Observation Mode */
export const DeviceMotionObservationMode = new DicomTag(0x300A, 0x0452);
/** (300A,0453) VR=SQ VM=1 Device Motion Parameter Code Sequence */
export const DeviceMotionParameterCodeSequence = new DicomTag(0x300A, 0x0453);
/** (300A,0501) VR=FL VM=1 Distal Depth Fraction */
export const DistalDepthFraction = new DicomTag(0x300A, 0x0501);
/** (300A,0502) VR=FL VM=1 Distal Depth */
export const DistalDepth = new DicomTag(0x300A, 0x0502);
/** (300A,0503) VR=FL VM=2 Nominal Range Modulation Fractions */
export const NominalRangeModulationFractions = new DicomTag(0x300A, 0x0503);
/** (300A,0504) VR=FL VM=2 Nominal Range Modulated Region Depths */
export const NominalRangeModulatedRegionDepths = new DicomTag(0x300A, 0x0504);
/** (300A,0505) VR=SQ VM=1 Depth Dose Parameters Sequence */
export const DepthDoseParametersSequence = new DicomTag(0x300A, 0x0505);
/** (300A,0506) VR=SQ VM=1 Delivered Depth Dose Parameters Sequence */
export const DeliveredDepthDoseParametersSequence = new DicomTag(0x300A, 0x0506);
/** (300A,0507) VR=FL VM=1 Delivered Distal Depth Fraction */
export const DeliveredDistalDepthFraction = new DicomTag(0x300A, 0x0507);
/** (300A,0508) VR=FL VM=1 Delivered Distal Depth */
export const DeliveredDistalDepth = new DicomTag(0x300A, 0x0508);
/** (300A,0509) VR=FL VM=2 Delivered Nominal Range Modulation Fractions */
export const DeliveredNominalRangeModulationFractions = new DicomTag(0x300A, 0x0509);
/** (300A,0510) VR=FL VM=2 Delivered Nominal Range Modulated Region Depths */
export const DeliveredNominalRangeModulatedRegionDepths = new DicomTag(0x300A, 0x0510);
/** (300A,0511) VR=CS VM=1 Delivered Reference Dose Definition */
export const DeliveredReferenceDoseDefinition = new DicomTag(0x300A, 0x0511);
/** (300A,0512) VR=CS VM=1 Reference Dose Definition */
export const ReferenceDoseDefinition = new DicomTag(0x300A, 0x0512);
/** (300A,0600) VR=US VM=1 RT Control Point Index */
export const RTControlPointIndex = new DicomTag(0x300A, 0x0600);
/** (300A,0601) VR=US VM=1 Radiation Generation Mode Index */
export const RadiationGenerationModeIndex = new DicomTag(0x300A, 0x0601);
/** (300A,0602) VR=US VM=1 Referenced Defined Device Index */
export const ReferencedDefinedDeviceIndex = new DicomTag(0x300A, 0x0602);
/** (300A,0603) VR=US VM=1 Radiation Dose Identification Index */
export const RadiationDoseIdentificationIndex = new DicomTag(0x300A, 0x0603);
/** (300A,0604) VR=US VM=1 Number of RT Control Points */
export const NumberOfRTControlPoints = new DicomTag(0x300A, 0x0604);
/** (300A,0605) VR=US VM=1 Referenced Radiation Generation Mode Index */
export const ReferencedRadiationGenerationModeIndex = new DicomTag(0x300A, 0x0605);
/** (300A,0606) VR=US VM=1 Treatment Position Index */
export const TreatmentPositionIndex = new DicomTag(0x300A, 0x0606);
/** (300A,0607) VR=US VM=1 Referenced Device Index */
export const ReferencedDeviceIndex = new DicomTag(0x300A, 0x0607);
/** (300A,0608) VR=LO VM=1 Treatment Position Group Label */
export const TreatmentPositionGroupLabel = new DicomTag(0x300A, 0x0608);
/** (300A,0609) VR=UI VM=1 Treatment Position Group UID */
export const TreatmentPositionGroupUID = new DicomTag(0x300A, 0x0609);
/** (300A,060A) VR=SQ VM=1 Treatment Position Group Sequence */
export const TreatmentPositionGroupSequence = new DicomTag(0x300A, 0x060A);
/** (300A,060B) VR=US VM=1 Referenced Treatment Position Index */
export const ReferencedTreatmentPositionIndex = new DicomTag(0x300A, 0x060B);
/** (300A,060C) VR=US VM=1 Referenced Radiation Dose Identification Index */
export const ReferencedRadiationDoseIdentificationIndex = new DicomTag(0x300A, 0x060C);
/** (300A,060D) VR=FD VM=1 RT Accessory Holder Water-Equivalent Thickness */
export const RTAccessoryHolderWaterEquivalentThickness = new DicomTag(0x300A, 0x060D);
/** (300A,060E) VR=US VM=1 Referenced RT Accessory Holder Device Index */
export const ReferencedRTAccessoryHolderDeviceIndex = new DicomTag(0x300A, 0x060E);
/** (300A,060F) VR=CS VM=1 RT Accessory Holder Slot Existence Flag */
export const RTAccessoryHolderSlotExistenceFlag = new DicomTag(0x300A, 0x060F);
/** (300A,0610) VR=SQ VM=1 RT Accessory Holder Slot Sequence */
export const RTAccessoryHolderSlotSequence = new DicomTag(0x300A, 0x0610);
/** (300A,0611) VR=LO VM=1 RT Accessory Holder Slot ID */
export const RTAccessoryHolderSlotID = new DicomTag(0x300A, 0x0611);
/** (300A,0612) VR=FD VM=1 RT Accessory Holder Slot Distance */
export const RTAccessoryHolderSlotDistance = new DicomTag(0x300A, 0x0612);
/** (300A,0613) VR=FD VM=1 RT Accessory Slot Distance */
export const RTAccessorySlotDistance = new DicomTag(0x300A, 0x0613);
/** (300A,0614) VR=SQ VM=1 RT Accessory Holder Definition Sequence */
export const RTAccessoryHolderDefinitionSequence = new DicomTag(0x300A, 0x0614);
/** (300A,0615) VR=LO VM=1 RT Accessory Device Slot ID */
export const RTAccessoryDeviceSlotID = new DicomTag(0x300A, 0x0615);
/** (300A,0616) VR=SQ VM=1 RT Radiation Sequence */
export const RTRadiationSequence = new DicomTag(0x300A, 0x0616);
/** (300A,0617) VR=SQ VM=1 Radiation Dose Sequence */
export const RadiationDoseSequence = new DicomTag(0x300A, 0x0617);
/** (300A,0618) VR=SQ VM=1 Radiation Dose Identification Sequence */
export const RadiationDoseIdentificationSequence = new DicomTag(0x300A, 0x0618);
/** (300A,0619) VR=LO VM=1 Radiation Dose Identification Label */
export const RadiationDoseIdentificationLabel = new DicomTag(0x300A, 0x0619);
/** (300A,061A) VR=CS VM=1 Reference Dose Type */
export const ReferenceDoseType = new DicomTag(0x300A, 0x061A);
/** (300A,061B) VR=CS VM=1 Primary Dose Value Indicator */
export const PrimaryDoseValueIndicator = new DicomTag(0x300A, 0x061B);
/** (300A,061C) VR=SQ VM=1 Dose Values Sequence */
export const DoseValuesSequence = new DicomTag(0x300A, 0x061C);
/** (300A,061D) VR=CS VM=1-n Dose Value Purpose */
export const DoseValuePurpose = new DicomTag(0x300A, 0x061D);
/** (300A,061E) VR=FD VM=3 Reference Dose Point Coordinates */
export const ReferenceDosePointCoordinates = new DicomTag(0x300A, 0x061E);
/** (300A,061F) VR=SQ VM=1 Radiation Dose Values Parameters Sequence */
export const RadiationDoseValuesParametersSequence = new DicomTag(0x300A, 0x061F);
/** (300A,0620) VR=SQ VM=1 Meterset to Dose Mapping Sequence */
export const MetersetToDoseMappingSequence = new DicomTag(0x300A, 0x0620);
/** (300A,0621) VR=SQ VM=1 Expected In-Vivo Measurement Values Sequence */
export const ExpectedInVivoMeasurementValuesSequence = new DicomTag(0x300A, 0x0621);
/** (300A,0622) VR=US VM=1 Expected In-Vivo Measurement Value Index */
export const ExpectedInVivoMeasurementValueIndex = new DicomTag(0x300A, 0x0622);
/** (300A,0623) VR=LO VM=1 Radiation Dose In-Vivo Measurement Label */
export const RadiationDoseInVivoMeasurementLabel = new DicomTag(0x300A, 0x0623);
/** (300A,0624) VR=FD VM=2 Radiation Dose Central Axis Displacement */
export const RadiationDoseCentralAxisDisplacement = new DicomTag(0x300A, 0x0624);
/** (300A,0625) VR=FD VM=1 Radiation Dose Value */
export const RadiationDoseValue = new DicomTag(0x300A, 0x0625);
/** (300A,0626) VR=FD VM=1 Radiation Dose Source to Skin Distance */
export const RadiationDoseSourceToSkinDistance = new DicomTag(0x300A, 0x0626);
/** (300A,0627) VR=FD VM=3 Radiation Dose Measurement Point Coordinates */
export const RadiationDoseMeasurementPointCoordinates = new DicomTag(0x300A, 0x0627);
/** (300A,0628) VR=FD VM=1 Radiation Dose Source to External Contour Distance */
export const RadiationDoseSourceToExternalContourDistance = new DicomTag(0x300A, 0x0628);
/** (300A,0629) VR=SQ VM=1 RT Tolerance Set Sequence */
export const RTToleranceSetSequence = new DicomTag(0x300A, 0x0629);
/** (300A,062A) VR=LO VM=1 RT Tolerance Set Label */
export const RTToleranceSetLabel = new DicomTag(0x300A, 0x062A);
/** (300A,062B) VR=SQ VM=1 Attribute Tolerance Values Sequence */
export const AttributeToleranceValuesSequence = new DicomTag(0x300A, 0x062B);
/** (300A,062C) VR=FD VM=1 Tolerance Value */
export const ToleranceValue = new DicomTag(0x300A, 0x062C);
/** (300A,062D) VR=SQ VM=1 Patient Support Position Tolerance Sequence */
export const PatientSupportPositionToleranceSequence = new DicomTag(0x300A, 0x062D);
/** (300A,062E) VR=FD VM=1 Treatment Time Limit */
export const TreatmentTimeLimit = new DicomTag(0x300A, 0x062E);
/** (300A,062F) VR=SQ VM=1 C-Arm Photon-Electron Control Point Sequence */
export const CArmPhotonElectronControlPointSequence = new DicomTag(0x300A, 0x062F);
/** (300A,0630) VR=SQ VM=1 Referenced RT Radiation Sequence */
export const ReferencedRTRadiationSequence = new DicomTag(0x300A, 0x0630);
/** (300A,0631) VR=SQ VM=1 Referenced RT Instance Sequence */
export const ReferencedRTInstanceSequence = new DicomTag(0x300A, 0x0631);
/** (300A,0632) VR=SQ VM=1 Referenced RT Patient Setup Sequence (Retired) */
export const ReferencedRTPatientSetupSequence = new DicomTag(0x300A, 0x0632);
/** (300A,0634) VR=FD VM=1 Source to Patient Surface Distance */
export const SourceToPatientSurfaceDistance = new DicomTag(0x300A, 0x0634);
/** (300A,0635) VR=SQ VM=1 Treatment Machine Special Mode Code Sequence */
export const TreatmentMachineSpecialModeCodeSequence = new DicomTag(0x300A, 0x0635);
/** (300A,0636) VR=US VM=1 Intended Number of Fractions */
export const IntendedNumberOfFractions = new DicomTag(0x300A, 0x0636);
/** (300A,0637) VR=CS VM=1 RT Radiation Set Intent */
export const RTRadiationSetIntent = new DicomTag(0x300A, 0x0637);
/** (300A,0638) VR=CS VM=1 RT Radiation Physical and Geometric Content Detail Flag */
export const RTRadiationPhysicalAndGeometricContentDetailFlag = new DicomTag(0x300A, 0x0638);
/** (300A,0639) VR=CS VM=1 RT Record Flag */
export const RTRecordFlag = new DicomTag(0x300A, 0x0639);
/** (300A,063A) VR=SQ VM=1 Treatment Device Identification Sequence */
export const TreatmentDeviceIdentificationSequence = new DicomTag(0x300A, 0x063A);
/** (300A,063B) VR=SQ VM=1 Referenced RT Physician Intent Sequence */
export const ReferencedRTPhysicianIntentSequence = new DicomTag(0x300A, 0x063B);
/** (300A,063C) VR=FD VM=1 Cumulative Meterset */
export const CumulativeMeterset = new DicomTag(0x300A, 0x063C);
/** (300A,063D) VR=FD VM=1 Delivery Rate */
export const DeliveryRate = new DicomTag(0x300A, 0x063D);
/** (300A,063E) VR=SQ VM=1 Delivery Rate Unit Sequence */
export const DeliveryRateUnitSequence = new DicomTag(0x300A, 0x063E);
/** (300A,063F) VR=SQ VM=1 Treatment Position Sequence */
export const TreatmentPositionSequence = new DicomTag(0x300A, 0x063F);
/** (300A,0640) VR=FD VM=1 Radiation Source-Axis Distance */
export const RadiationSourceAxisDistance = new DicomTag(0x300A, 0x0640);
/** (300A,0641) VR=US VM=1 Number of RT Beam Limiting Devices */
export const NumberOfRTBeamLimitingDevices = new DicomTag(0x300A, 0x0641);
/** (300A,0642) VR=FD VM=1 RT Beam Limiting Device Proximal Distance */
export const RTBeamLimitingDeviceProximalDistance = new DicomTag(0x300A, 0x0642);
/** (300A,0643) VR=FD VM=1 RT Beam Limiting Device Distal Distance */
export const RTBeamLimitingDeviceDistalDistance = new DicomTag(0x300A, 0x0643);
/** (300A,0644) VR=SQ VM=1 Parallel RT Beam Delimiter Device Orientation Label Code Sequence */
export const ParallelRTBeamDelimiterDeviceOrientationLabelCodeSequence = new DicomTag(0x300A, 0x0644);
/** (300A,0645) VR=FD VM=1 Beam Modifier Orientation Angle */
export const BeamModifierOrientationAngle = new DicomTag(0x300A, 0x0645);
/** (300A,0646) VR=SQ VM=1 Fixed RT Beam Delimiter Device Sequence */
export const FixedRTBeamDelimiterDeviceSequence = new DicomTag(0x300A, 0x0646);
/** (300A,0647) VR=SQ VM=1 Parallel RT Beam Delimiter Device Sequence */
export const ParallelRTBeamDelimiterDeviceSequence = new DicomTag(0x300A, 0x0647);
/** (300A,0648) VR=US VM=1 Number of Parallel RT Beam Delimiters */
export const NumberOfParallelRTBeamDelimiters = new DicomTag(0x300A, 0x0648);
/** (300A,0649) VR=FD VM=2-n Parallel RT Beam Delimiter Boundaries */
export const ParallelRTBeamDelimiterBoundaries = new DicomTag(0x300A, 0x0649);
/** (300A,064A) VR=FD VM=2-n Parallel RT Beam Delimiter Positions */
export const ParallelRTBeamDelimiterPositions = new DicomTag(0x300A, 0x064A);
/** (300A,064B) VR=FD VM=2 RT Beam Limiting Device Offset */
export const RTBeamLimitingDeviceOffset = new DicomTag(0x300A, 0x064B);
/** (300A,064C) VR=SQ VM=1 RT Beam Delimiter Geometry Sequence */
export const RTBeamDelimiterGeometrySequence = new DicomTag(0x300A, 0x064C);
/** (300A,064D) VR=SQ VM=1 RT Beam Limiting Device Definition Sequence */
export const RTBeamLimitingDeviceDefinitionSequence = new DicomTag(0x300A, 0x064D);
/** (300A,064E) VR=CS VM=1 Parallel RT Beam Delimiter Opening Mode */
export const ParallelRTBeamDelimiterOpeningMode = new DicomTag(0x300A, 0x064E);
/** (300A,064F) VR=CS VM=1-n Parallel RT Beam Delimiter Leaf Mounting Side */
export const ParallelRTBeamDelimiterLeafMountingSide = new DicomTag(0x300A, 0x064F);
/** (300A,0650) VR=UI VM=1 Patient Setup UID (Retired) */
export const PatientSetupUID = new DicomTag(0x300A, 0x0650);
/** (300A,0651) VR=SQ VM=1 Wedge Definition Sequence */
export const WedgeDefinitionSequence = new DicomTag(0x300A, 0x0651);
/** (300A,0652) VR=FD VM=1 Radiation Beam Wedge Angle */
export const RadiationBeamWedgeAngle = new DicomTag(0x300A, 0x0652);
/** (300A,0653) VR=FD VM=1 Radiation Beam Wedge Thin Edge Distance */
export const RadiationBeamWedgeThinEdgeDistance = new DicomTag(0x300A, 0x0653);
/** (300A,0654) VR=FD VM=1 Radiation Beam Effective Wedge Angle */
export const RadiationBeamEffectiveWedgeAngle = new DicomTag(0x300A, 0x0654);
/** (300A,0655) VR=US VM=1 Number of Wedge Positions */
export const NumberOfWedgePositions = new DicomTag(0x300A, 0x0655);
/** (300A,0656) VR=SQ VM=1 RT Beam Limiting Device Opening Sequence */
export const RTBeamLimitingDeviceOpeningSequence = new DicomTag(0x300A, 0x0656);
/** (300A,0657) VR=US VM=1 Number of RT Beam Limiting Device Openings */
export const NumberOfRTBeamLimitingDeviceOpenings = new DicomTag(0x300A, 0x0657);
/** (300A,0658) VR=SQ VM=1 Radiation Dosimeter Unit Sequence */
export const RadiationDosimeterUnitSequence = new DicomTag(0x300A, 0x0658);
/** (300A,0659) VR=SQ VM=1 RT Device Distance Reference Location Code Sequence */
export const RTDeviceDistanceReferenceLocationCodeSequence = new DicomTag(0x300A, 0x0659);
/** (300A,065A) VR=SQ VM=1 Radiation Device Configuration and Commissioning Key Sequence */
export const RadiationDeviceConfigurationAndCommissioningKeySequence = new DicomTag(0x300A, 0x065A);
/** (300A,065B) VR=SQ VM=1 Patient Support Position Parameter Sequence */
export const PatientSupportPositionParameterSequence = new DicomTag(0x300A, 0x065B);
/** (300A,065C) VR=CS VM=1 Patient Support Position Specification Method */
export const PatientSupportPositionSpecificationMethod = new DicomTag(0x300A, 0x065C);
/** (300A,065D) VR=SQ VM=1 Patient Support Position Device Parameter Sequence */
export const PatientSupportPositionDeviceParameterSequence = new DicomTag(0x300A, 0x065D);
/** (300A,065E) VR=US VM=1 Device Order Index */
export const DeviceOrderIndex = new DicomTag(0x300A, 0x065E);
/** (300A,065F) VR=US VM=1 Patient Support Position Parameter Order Index */
export const PatientSupportPositionParameterOrderIndex = new DicomTag(0x300A, 0x065F);
/** (300A,0660) VR=SQ VM=1 Patient Support Position Device Tolerance Sequence */
export const PatientSupportPositionDeviceToleranceSequence = new DicomTag(0x300A, 0x0660);
/** (300A,0661) VR=US VM=1 Patient Support Position Tolerance Order Index */
export const PatientSupportPositionToleranceOrderIndex = new DicomTag(0x300A, 0x0661);
/** (300A,0662) VR=SQ VM=1 Compensator Definition Sequence */
export const CompensatorDefinitionSequence = new DicomTag(0x300A, 0x0662);
/** (300A,0663) VR=CS VM=1 Compensator Map Orientation */
export const CompensatorMapOrientation = new DicomTag(0x300A, 0x0663);
/** (300A,0664) VR=OF VM=1 Compensator Proximal Thickness Map */
export const CompensatorProximalThicknessMap = new DicomTag(0x300A, 0x0664);
/** (300A,0665) VR=OF VM=1 Compensator Distal Thickness Map */
export const CompensatorDistalThicknessMap = new DicomTag(0x300A, 0x0665);
/** (300A,0666) VR=FD VM=1 Compensator Base Plane Offset */
export const CompensatorBasePlaneOffset = new DicomTag(0x300A, 0x0666);
/** (300A,0667) VR=SQ VM=1 Compensator Shape Fabrication Code Sequence */
export const CompensatorShapeFabricationCodeSequence = new DicomTag(0x300A, 0x0667);
/** (300A,0668) VR=SQ VM=1 Compensator Shape Sequence */
export const CompensatorShapeSequence = new DicomTag(0x300A, 0x0668);
/** (300A,0669) VR=FD VM=1 Radiation Beam Compensator Milling Tool Diameter */
export const RadiationBeamCompensatorMillingToolDiameter = new DicomTag(0x300A, 0x0669);
/** (300A,066A) VR=SQ VM=1 Block Definition Sequence */
export const BlockDefinitionSequence = new DicomTag(0x300A, 0x066A);
/** (300A,066B) VR=OF VM=1 Block Edge Data */
export const BlockEdgeData = new DicomTag(0x300A, 0x066B);
/** (300A,066C) VR=CS VM=1 Block Orientation */
export const BlockOrientation = new DicomTag(0x300A, 0x066C);
/** (300A,066D) VR=FD VM=1 Radiation Beam Block Thickness */
export const RadiationBeamBlockThickness = new DicomTag(0x300A, 0x066D);
/** (300A,066E) VR=FD VM=1 Radiation Beam Block Slab Thickness */
export const RadiationBeamBlockSlabThickness = new DicomTag(0x300A, 0x066E);
/** (300A,066F) VR=SQ VM=1 Block Edge Data Sequence */
export const BlockEdgeDataSequence = new DicomTag(0x300A, 0x066F);
/** (300A,0670) VR=US VM=1 Number of RT Accessory Holders */
export const NumberOfRTAccessoryHolders = new DicomTag(0x300A, 0x0670);
/** (300A,0671) VR=SQ VM=1 General Accessory Definition Sequence */
export const GeneralAccessoryDefinitionSequence = new DicomTag(0x300A, 0x0671);
/** (300A,0672) VR=US VM=1 Number of General Accessories */
export const NumberOfGeneralAccessories = new DicomTag(0x300A, 0x0672);
/** (300A,0673) VR=SQ VM=1 Bolus Definition Sequence */
export const BolusDefinitionSequence = new DicomTag(0x300A, 0x0673);
/** (300A,0674) VR=US VM=1 Number of Boluses */
export const NumberOfBoluses = new DicomTag(0x300A, 0x0674);
/** (300A,0675) VR=UI VM=1 Equipment Frame of Reference UID */
export const EquipmentFrameOfReferenceUID = new DicomTag(0x300A, 0x0675);
/** (300A,0676) VR=ST VM=1 Equipment Frame of Reference Description */
export const EquipmentFrameOfReferenceDescription = new DicomTag(0x300A, 0x0676);
/** (300A,0677) VR=SQ VM=1 Equipment Reference Point Coordinates Sequence */
export const EquipmentReferencePointCoordinatesSequence = new DicomTag(0x300A, 0x0677);
/** (300A,0678) VR=SQ VM=1 Equipment Reference Point Code Sequence */
export const EquipmentReferencePointCodeSequence = new DicomTag(0x300A, 0x0678);
/** (300A,0679) VR=FD VM=1 RT Beam Limiting Device Angle */
export const RTBeamLimitingDeviceAngle = new DicomTag(0x300A, 0x0679);
/** (300A,067A) VR=FD VM=1 Source Roll Angle */
export const SourceRollAngle = new DicomTag(0x300A, 0x067A);
/** (300A,067B) VR=SQ VM=1 Radiation GenerationMode Sequence */
export const RadiationGenerationModeSequence = new DicomTag(0x300A, 0x067B);
/** (300A,067C) VR=SH VM=1 Radiation GenerationMode Label */
export const RadiationGenerationModeLabel = new DicomTag(0x300A, 0x067C);
/** (300A,067D) VR=ST VM=1 Radiation GenerationMode Description */
export const RadiationGenerationModeDescription = new DicomTag(0x300A, 0x067D);
/** (300A,067E) VR=SQ VM=1 Radiation GenerationMode Machine Code Sequence */
export const RadiationGenerationModeMachineCodeSequence = new DicomTag(0x300A, 0x067E);
/** (300A,067F) VR=SQ VM=1 Radiation Type Code Sequence */
export const RadiationTypeCodeSequence = new DicomTag(0x300A, 0x067F);
/** (300A,0680) VR=DS VM=1 Nominal Energy */
export const NominalEnergy = new DicomTag(0x300A, 0x0680);
/** (300A,0681) VR=DS VM=1 Minimum Nominal Energy */
export const MinimumNominalEnergy = new DicomTag(0x300A, 0x0681);
/** (300A,0682) VR=DS VM=1 Maximum Nominal Energy */
export const MaximumNominalEnergy = new DicomTag(0x300A, 0x0682);
/** (300A,0683) VR=SQ VM=1 Radiation Fluence Modifier Code Sequence */
export const RadiationFluenceModifierCodeSequence = new DicomTag(0x300A, 0x0683);
/** (300A,0684) VR=SQ VM=1 Energy Unit Code Sequence */
export const EnergyUnitCodeSequence = new DicomTag(0x300A, 0x0684);
/** (300A,0685) VR=US VM=1 Number of Radiation GenerationModes */
export const NumberOfRadiationGenerationModes = new DicomTag(0x300A, 0x0685);
/** (300A,0686) VR=SQ VM=1 Patient Support Devices Sequence */
export const PatientSupportDevicesSequence = new DicomTag(0x300A, 0x0686);
/** (300A,0687) VR=US VM=1 Number of Patient Support Devices */
export const NumberOfPatientSupportDevices = new DicomTag(0x300A, 0x0687);
/** (300A,0688) VR=FD VM=1 RT Beam Modifier Definition Distance */
export const RTBeamModifierDefinitionDistance = new DicomTag(0x300A, 0x0688);
/** (300A,0689) VR=SQ VM=1 Beam Area Limit Sequence */
export const BeamAreaLimitSequence = new DicomTag(0x300A, 0x0689);
/** (300A,068A) VR=SQ VM=1 Referenced RT Prescription Sequence */
export const ReferencedRTPrescriptionSequence = new DicomTag(0x300A, 0x068A);
/** (300A,068B) VR=CS VM=1 Dose Value Interpretation */
export const DoseValueInterpretation = new DicomTag(0x300A, 0x068B);
/** (300A,0700) VR=UI VM=1 Treatment Session UID */
export const TreatmentSessionUID = new DicomTag(0x300A, 0x0700);
/** (300A,0701) VR=CS VM=1 RT Radiation Usage */
export const RTRadiationUsage = new DicomTag(0x300A, 0x0701);
/** (300A,0702) VR=SQ VM=1 Referenced RT Radiation Set Sequence */
export const ReferencedRTRadiationSetSequence = new DicomTag(0x300A, 0x0702);
/** (300A,0703) VR=SQ VM=1 Referenced RT Radiation Record Sequence */
export const ReferencedRTRadiationRecordSequence = new DicomTag(0x300A, 0x0703);
/** (300A,0704) VR=US VM=1 RT Radiation Set Delivery Number */
export const RTRadiationSetDeliveryNumber = new DicomTag(0x300A, 0x0704);
/** (300A,0705) VR=US VM=1 Clinical Fraction Number */
export const ClinicalFractionNumber = new DicomTag(0x300A, 0x0705);
/** (300A,0706) VR=CS VM=1 RT Treatment Fraction Completion Status */
export const RTTreatmentFractionCompletionStatus = new DicomTag(0x300A, 0x0706);
/** (300A,0707) VR=CS VM=1 RT Radiation Set Usage */
export const RTRadiationSetUsage = new DicomTag(0x300A, 0x0707);
/** (300A,0708) VR=CS VM=1 Treatment Delivery Continuation Flag */
export const TreatmentDeliveryContinuationFlag = new DicomTag(0x300A, 0x0708);
/** (300A,0709) VR=CS VM=1 Treatment Record Content Origin */
export const TreatmentRecordContentOrigin = new DicomTag(0x300A, 0x0709);
/** (300A,0714) VR=CS VM=1 RT Treatment Termination Status */
export const RTTreatmentTerminationStatus = new DicomTag(0x300A, 0x0714);
/** (300A,0715) VR=SQ VM=1 RT Treatment Termination Reason Code Sequence */
export const RTTreatmentTerminationReasonCodeSequence = new DicomTag(0x300A, 0x0715);
/** (300A,0716) VR=SQ VM=1 Machine-Specific Treatment Termination Code Sequence */
export const MachineSpecificTreatmentTerminationCodeSequence = new DicomTag(0x300A, 0x0716);
/** (300A,0722) VR=SQ VM=1 RT Radiation Salvage Record Control Point Sequence */
export const RTRadiationSalvageRecordControlPointSequence = new DicomTag(0x300A, 0x0722);
/** (300A,0723) VR=CS VM=1 Starting Meterset Value Known Flag */
export const StartingMetersetValueKnownFlag = new DicomTag(0x300A, 0x0723);
/** (300A,0730) VR=ST VM=1 Treatment Termination Description */
export const TreatmentTerminationDescription = new DicomTag(0x300A, 0x0730);
/** (300A,0731) VR=SQ VM=1 Treatment Tolerance Violation Sequence */
export const TreatmentToleranceViolationSequence = new DicomTag(0x300A, 0x0731);
/** (300A,0732) VR=CS VM=1 Treatment Tolerance Violation Category */
export const TreatmentToleranceViolationCategory = new DicomTag(0x300A, 0x0732);
/** (300A,0733) VR=SQ VM=1 Treatment Tolerance Violation Attribute Sequence */
export const TreatmentToleranceViolationAttributeSequence = new DicomTag(0x300A, 0x0733);
/** (300A,0734) VR=ST VM=1 Treatment Tolerance Violation Description */
export const TreatmentToleranceViolationDescription = new DicomTag(0x300A, 0x0734);
/** (300A,0735) VR=ST VM=1 Treatment Tolerance Violation Identification */
export const TreatmentToleranceViolationIdentification = new DicomTag(0x300A, 0x0735);
/** (300A,0736) VR=DT VM=1 Treatment Tolerance Violation DateTime */
export const TreatmentToleranceViolationDateTime = new DicomTag(0x300A, 0x0736);
/** (300A,073A) VR=DT VM=1 Recorded RT Control Point DateTime */
export const RecordedRTControlPointDateTime = new DicomTag(0x300A, 0x073A);
/** (300A,073B) VR=US VM=1 Referenced Radiation RT Control Point Index */
export const ReferencedRadiationRTControlPointIndex = new DicomTag(0x300A, 0x073B);
/** (300A,073E) VR=SQ VM=1 Alternate Value Sequence */
export const AlternateValueSequence = new DicomTag(0x300A, 0x073E);
/** (300A,073F) VR=SQ VM=1 Confirmation Sequence */
export const ConfirmationSequence = new DicomTag(0x300A, 0x073F);
/** (300A,0740) VR=SQ VM=1 Interlock Sequence */
export const InterlockSequence = new DicomTag(0x300A, 0x0740);
/** (300A,0741) VR=DT VM=1 Interlock DateTime */
export const InterlockDateTime = new DicomTag(0x300A, 0x0741);
/** (300A,0742) VR=ST VM=1 Interlock Description */
export const InterlockDescription = new DicomTag(0x300A, 0x0742);
/** (300A,0743) VR=SQ VM=1 Interlock Originating Device Sequence */
export const InterlockOriginatingDeviceSequence = new DicomTag(0x300A, 0x0743);
/** (300A,0744) VR=SQ VM=1 Interlock Code Sequence */
export const InterlockCodeSequence = new DicomTag(0x300A, 0x0744);
/** (300A,0745) VR=SQ VM=1 Interlock Resolution Code Sequence */
export const InterlockResolutionCodeSequence = new DicomTag(0x300A, 0x0745);
/** (300A,0746) VR=SQ VM=1 Interlock Resolution User Sequence */
export const InterlockResolutionUserSequence = new DicomTag(0x300A, 0x0746);
/** (300A,0760) VR=DT VM=1 Override DateTime */
export const OverrideDateTime = new DicomTag(0x300A, 0x0760);
/** (300A,0761) VR=SQ VM=1 Treatment Tolerance Violation Type Code Sequence */
export const TreatmentToleranceViolationTypeCodeSequence = new DicomTag(0x300A, 0x0761);
/** (300A,0762) VR=SQ VM=1 Treatment Tolerance Violation Cause Code Sequence */
export const TreatmentToleranceViolationCauseCodeSequence = new DicomTag(0x300A, 0x0762);
/** (300A,0772) VR=SQ VM=1 Measured Meterset to Dose Mapping Sequence */
export const MeasuredMetersetToDoseMappingSequence = new DicomTag(0x300A, 0x0772);
/** (300A,0773) VR=US VM=1 Referenced Expected In-Vivo Measurement Value Index */
export const ReferencedExpectedInVivoMeasurementValueIndex = new DicomTag(0x300A, 0x0773);
/** (300A,0774) VR=SQ VM=1 Dose Measurement Device Code Sequence */
export const DoseMeasurementDeviceCodeSequence = new DicomTag(0x300A, 0x0774);
/** (300A,0780) VR=SQ VM=1 Additional Parameter Recording Instance Sequence */
export const AdditionalParameterRecordingInstanceSequence = new DicomTag(0x300A, 0x0780);
/** (300A,0783) VR=ST VM=1 Interlock Origin Description */
export const InterlockOriginDescription = new DicomTag(0x300A, 0x0783);
/** (300A,0784) VR=SQ VM=1 RT Patient Position Scope Sequence */
export const RTPatientPositionScopeSequence = new DicomTag(0x300A, 0x0784);
/** (300A,0785) VR=UI VM=1 Referenced Treatment Position Group UID */
export const ReferencedTreatmentPositionGroupUID = new DicomTag(0x300A, 0x0785);
/** (300A,0786) VR=US VM=1 Radiation Order Index */
export const RadiationOrderIndex = new DicomTag(0x300A, 0x0786);
/** (300A,0787) VR=SQ VM=1 Omitted Radiation Sequence */
export const OmittedRadiationSequence = new DicomTag(0x300A, 0x0787);
/** (300A,0788) VR=SQ VM=1 Reason for Omission Code Sequence */
export const ReasonForOmissionCodeSequence = new DicomTag(0x300A, 0x0788);
/** (300A,0789) VR=SQ VM=1 RT Delivery Start Patient Position Sequence */
export const RTDeliveryStartPatientPositionSequence = new DicomTag(0x300A, 0x0789);
/** (300A,078A) VR=SQ VM=1 RT Treatment Preparation Patient Position Sequence */
export const RTTreatmentPreparationPatientPositionSequence = new DicomTag(0x300A, 0x078A);
/** (300A,078B) VR=SQ VM=1 Referenced RT Treatment Preparation Sequence */
export const ReferencedRTTreatmentPreparationSequence = new DicomTag(0x300A, 0x078B);
/** (300A,078C) VR=SQ VM=1 Referenced Patient Setup Photo Sequence */
export const ReferencedPatientSetupPhotoSequence = new DicomTag(0x300A, 0x078C);
/** (300A,078D) VR=SQ VM=1 Patient Treatment Preparation Method Code Sequence */
export const PatientTreatmentPreparationMethodCodeSequence = new DicomTag(0x300A, 0x078D);
/** (300A,078E) VR=LT VM=1 Patient Treatment Preparation Procedure Parameter Description */
export const PatientTreatmentPreparationProcedureParameterDescription = new DicomTag(0x300A, 0x078E);
/** (300A,078F) VR=SQ VM=1 Patient Treatment Preparation Device Sequence */
export const PatientTreatmentPreparationDeviceSequence = new DicomTag(0x300A, 0x078F);
/** (300A,0790) VR=SQ VM=1 Patient Treatment Preparation Procedure Sequence */
export const PatientTreatmentPreparationProcedureSequence = new DicomTag(0x300A, 0x0790);
/** (300A,0791) VR=SQ VM=1 Patient Treatment Preparation Procedure Code Sequence */
export const PatientTreatmentPreparationProcedureCodeSequence = new DicomTag(0x300A, 0x0791);
/** (300A,0792) VR=LT VM=1 Patient Treatment Preparation Method Description */
export const PatientTreatmentPreparationMethodDescription = new DicomTag(0x300A, 0x0792);
/** (300A,0793) VR=SQ VM=1 Patient Treatment Preparation Procedure Parameter Sequence */
export const PatientTreatmentPreparationProcedureParameterSequence = new DicomTag(0x300A, 0x0793);
/** (300A,0794) VR=LT VM=1 Patient Setup Photo Description */
export const PatientSetupPhotoDescription = new DicomTag(0x300A, 0x0794);
/** (300A,0795) VR=US VM=1 Patient Treatment Preparation Procedure Index */
export const PatientTreatmentPreparationProcedureIndex = new DicomTag(0x300A, 0x0795);
/** (300A,0796) VR=US VM=1 Referenced Patient Setup Procedure Index */
export const ReferencedPatientSetupProcedureIndex = new DicomTag(0x300A, 0x0796);
/** (300A,0797) VR=SQ VM=1 RT Radiation Task Sequence */
export const RTRadiationTaskSequence = new DicomTag(0x300A, 0x0797);
/** (300A,0798) VR=SQ VM=1 RT Patient Position Displacement Sequence */
export const RTPatientPositionDisplacementSequence = new DicomTag(0x300A, 0x0798);
/** (300A,0799) VR=SQ VM=1 RT Patient Position Sequence */
export const RTPatientPositionSequence = new DicomTag(0x300A, 0x0799);
/** (300A,079A) VR=LO VM=1 Displacement Reference Label */
export const DisplacementReferenceLabel = new DicomTag(0x300A, 0x079A);
/** (300A,079B) VR=FD VM=16 Displacement Matrix */
export const DisplacementMatrix = new DicomTag(0x300A, 0x079B);
/** (300A,079C) VR=SQ VM=1 Patient Support Displacement Sequence */
export const PatientSupportDisplacementSequence = new DicomTag(0x300A, 0x079C);
/** (300A,079D) VR=SQ VM=1 Displacement Reference Location Code Sequence */
export const DisplacementReferenceLocationCodeSequence = new DicomTag(0x300A, 0x079D);
/** (300A,079E) VR=CS VM=1 RT Radiation Set Delivery Usage */
export const RTRadiationSetDeliveryUsage = new DicomTag(0x300A, 0x079E);
/** (300A,079F) VR=SQ VM=1 Patient Treatment Preparation Sequence */
export const PatientTreatmentPreparationSequence = new DicomTag(0x300A, 0x079F);
/** (300A,07A0) VR=SQ VM=1 Patient to Equipment Relationship Sequence */
export const PatientToEquipmentRelationshipSequence = new DicomTag(0x300A, 0x07A0);
/** (300A,07A1) VR=SQ VM=1 Imaging Equipment to Treatment Delivery Device Relationship Sequence */
export const ImagingEquipmentToTreatmentDeliveryDeviceRelationshipSequence = new DicomTag(0x300A, 0x07A1);
/** (300C,0002) VR=SQ VM=1 Referenced RT Plan Sequence */
export const ReferencedRTPlanSequence = new DicomTag(0x300C, 0x0002);
/** (300C,0004) VR=SQ VM=1 Referenced Beam Sequence */
export const ReferencedBeamSequence = new DicomTag(0x300C, 0x0004);
/** (300C,0006) VR=IS VM=1 Referenced Beam Number */
export const ReferencedBeamNumber = new DicomTag(0x300C, 0x0006);
/** (300C,0007) VR=IS VM=1 Referenced Reference Image Number */
export const ReferencedReferenceImageNumber = new DicomTag(0x300C, 0x0007);
/** (300C,0008) VR=DS VM=1 Start Cumulative Meterset Weight */
export const StartCumulativeMetersetWeight = new DicomTag(0x300C, 0x0008);
/** (300C,0009) VR=DS VM=1 End Cumulative Meterset Weight */
export const EndCumulativeMetersetWeight = new DicomTag(0x300C, 0x0009);
/** (300C,000A) VR=SQ VM=1 Referenced Brachy Application Setup Sequence */
export const ReferencedBrachyApplicationSetupSequence = new DicomTag(0x300C, 0x000A);
/** (300C,000C) VR=IS VM=1 Referenced Brachy Application Setup Number */
export const ReferencedBrachyApplicationSetupNumber = new DicomTag(0x300C, 0x000C);
/** (300C,000E) VR=IS VM=1 Referenced Source Number */
export const ReferencedSourceNumber = new DicomTag(0x300C, 0x000E);
/** (300C,0020) VR=SQ VM=1 Referenced Fraction Group Sequence */
export const ReferencedFractionGroupSequence = new DicomTag(0x300C, 0x0020);
/** (300C,0022) VR=IS VM=1 Referenced Fraction Group Number */
export const ReferencedFractionGroupNumber = new DicomTag(0x300C, 0x0022);
/** (300C,0040) VR=SQ VM=1 Referenced Verification Image Sequence */
export const ReferencedVerificationImageSequence = new DicomTag(0x300C, 0x0040);
/** (300C,0042) VR=SQ VM=1 Referenced Reference Image Sequence */
export const ReferencedReferenceImageSequence = new DicomTag(0x300C, 0x0042);
/** (300C,0050) VR=SQ VM=1 Referenced Dose Reference Sequence */
export const ReferencedDoseReferenceSequence = new DicomTag(0x300C, 0x0050);
/** (300C,0051) VR=IS VM=1 Referenced Dose Reference Number */
export const ReferencedDoseReferenceNumber = new DicomTag(0x300C, 0x0051);
/** (300C,0055) VR=SQ VM=1 Brachy Referenced Dose Reference Sequence */
export const BrachyReferencedDoseReferenceSequence = new DicomTag(0x300C, 0x0055);
/** (300C,0060) VR=SQ VM=1 Referenced Structure Set Sequence */
export const ReferencedStructureSetSequence = new DicomTag(0x300C, 0x0060);
/** (300C,006A) VR=IS VM=1 Referenced Patient Setup Number */
export const ReferencedPatientSetupNumber = new DicomTag(0x300C, 0x006A);
/** (300C,0080) VR=SQ VM=1 Referenced Dose Sequence */
export const ReferencedDoseSequence = new DicomTag(0x300C, 0x0080);
/** (300C,00A0) VR=IS VM=1 Referenced Tolerance Table Number */
export const ReferencedToleranceTableNumber = new DicomTag(0x300C, 0x00A0);
/** (300C,00B0) VR=SQ VM=1 Referenced Bolus Sequence */
export const ReferencedBolusSequence = new DicomTag(0x300C, 0x00B0);
/** (300C,00C0) VR=IS VM=1 Referenced Wedge Number */
export const ReferencedWedgeNumber = new DicomTag(0x300C, 0x00C0);
/** (300C,00D0) VR=IS VM=1 Referenced Compensator Number */
export const ReferencedCompensatorNumber = new DicomTag(0x300C, 0x00D0);
/** (300C,00E0) VR=IS VM=1 Referenced Block Number */
export const ReferencedBlockNumber = new DicomTag(0x300C, 0x00E0);
/** (300C,00F0) VR=IS VM=1 Referenced Control Point Index */
export const ReferencedControlPointIndex = new DicomTag(0x300C, 0x00F0);
/** (300C,00F2) VR=SQ VM=1 Referenced Control Point Sequence */
export const ReferencedControlPointSequence = new DicomTag(0x300C, 0x00F2);
/** (300C,00F4) VR=IS VM=1 Referenced Start Control Point Index */
export const ReferencedStartControlPointIndex = new DicomTag(0x300C, 0x00F4);
/** (300C,00F6) VR=IS VM=1 Referenced Stop Control Point Index */
export const ReferencedStopControlPointIndex = new DicomTag(0x300C, 0x00F6);
/** (300C,0100) VR=IS VM=1 Referenced Range Shifter Number */
export const ReferencedRangeShifterNumber = new DicomTag(0x300C, 0x0100);
/** (300C,0102) VR=IS VM=1 Referenced Lateral Spreading Device Number */
export const ReferencedLateralSpreadingDeviceNumber = new DicomTag(0x300C, 0x0102);
/** (300C,0104) VR=IS VM=1 Referenced Range Modulator Number */
export const ReferencedRangeModulatorNumber = new DicomTag(0x300C, 0x0104);
/** (300C,0111) VR=SQ VM=1 Omitted Beam Task Sequence */
export const OmittedBeamTaskSequence = new DicomTag(0x300C, 0x0111);
/** (300C,0112) VR=CS VM=1 Reason for Omission */
export const ReasonForOmission = new DicomTag(0x300C, 0x0112);
/** (300C,0113) VR=LO VM=1 Reason for Omission Description */
export const ReasonForOmissionDescription = new DicomTag(0x300C, 0x0113);
/** (300C,0114) VR=SQ VM=1 Prescription Overview Sequence */
export const PrescriptionOverviewSequence = new DicomTag(0x300C, 0x0114);
/** (300C,0115) VR=FL VM=1 Total Prescription Dose */
export const TotalPrescriptionDose = new DicomTag(0x300C, 0x0115);
/** (300C,0116) VR=SQ VM=1 Plan Overview Sequence */
export const PlanOverviewSequence = new DicomTag(0x300C, 0x0116);
/** (300C,0117) VR=US VM=1 Plan Overview Index */
export const PlanOverviewIndex = new DicomTag(0x300C, 0x0117);
/** (300C,0118) VR=US VM=1 Referenced Plan Overview Index */
export const ReferencedPlanOverviewIndex = new DicomTag(0x300C, 0x0118);
/** (300C,0119) VR=US VM=1 Number of Fractions Included */
export const NumberOfFractionsIncluded = new DicomTag(0x300C, 0x0119);
/** (300C,0120) VR=SQ VM=1 Dose Calibration Conditions Sequence */
export const DoseCalibrationConditionsSequence = new DicomTag(0x300C, 0x0120);
/** (300C,0121) VR=FD VM=1 Absorbed Dose to Meterset Ratio */
export const AbsorbedDoseToMetersetRatio = new DicomTag(0x300C, 0x0121);
/** (300C,0122) VR=FD VM=2 Delineated Radiation Field Size */
export const DelineatedRadiationFieldSize = new DicomTag(0x300C, 0x0122);
/** (300C,0123) VR=CS VM=1 Dose Calibration Conditions Verified Flag */
export const DoseCalibrationConditionsVerifiedFlag = new DicomTag(0x300C, 0x0123);
/** (300C,0124) VR=FD VM=1 Calibration Reference Point Depth */
export const CalibrationReferencePointDepth = new DicomTag(0x300C, 0x0124);
/** (300C,0125) VR=SQ VM=1 Gating Beam Hold Transition Sequence */
export const GatingBeamHoldTransitionSequence = new DicomTag(0x300C, 0x0125);
/** (300C,0126) VR=CS VM=1 Beam Hold Transition */
export const BeamHoldTransition = new DicomTag(0x300C, 0x0126);
/** (300C,0127) VR=DT VM=1 Beam Hold Transition DateTime */
export const BeamHoldTransitionDateTime = new DicomTag(0x300C, 0x0127);
/** (300C,0128) VR=SQ VM=1 Beam Hold Originating Device Sequence */
export const BeamHoldOriginatingDeviceSequence = new DicomTag(0x300C, 0x0128);
/** (300C,0129) VR=CS VM=1 Beam Hold Transition Trigger Source */
export const BeamHoldTransitionTriggerSource = new DicomTag(0x300C, 0x0129);
/** (300E,0002) VR=CS VM=1 Approval Status */
export const ApprovalStatus = new DicomTag(0x300E, 0x0002);
/** (300E,0004) VR=DA VM=1 Review Date */
export const ReviewDate = new DicomTag(0x300E, 0x0004);
/** (300E,0005) VR=TM VM=1 Review Time */
export const ReviewTime = new DicomTag(0x300E, 0x0005);
/** (300E,0008) VR=PN VM=1 Reviewer Name */
export const ReviewerName = new DicomTag(0x300E, 0x0008);
/** (3010,0001) VR=SQ VM=1 Radiobiological Dose Effect Sequence */
export const RadiobiologicalDoseEffectSequence = new DicomTag(0x3010, 0x0001);
/** (3010,0002) VR=CS VM=1 Radiobiological Dose Effect Flag */
export const RadiobiologicalDoseEffectFlag = new DicomTag(0x3010, 0x0002);
/** (3010,0003) VR=SQ VM=1 Effective Dose Calculation Method Category Code Sequence */
export const EffectiveDoseCalculationMethodCategoryCodeSequence = new DicomTag(0x3010, 0x0003);
/** (3010,0004) VR=SQ VM=1 Effective Dose Calculation Method Code Sequence */
export const EffectiveDoseCalculationMethodCodeSequence = new DicomTag(0x3010, 0x0004);
/** (3010,0005) VR=LO VM=1 Effective Dose Calculation Method Description */
export const EffectiveDoseCalculationMethodDescription = new DicomTag(0x3010, 0x0005);
/** (3010,0006) VR=UI VM=1 Conceptual Volume UID */
export const ConceptualVolumeUID = new DicomTag(0x3010, 0x0006);
/** (3010,0007) VR=SQ VM=1 Originating SOP Instance Reference Sequence */
export const OriginatingSOPInstanceReferenceSequence = new DicomTag(0x3010, 0x0007);
/** (3010,0008) VR=SQ VM=1 Conceptual Volume Constituent Sequence */
export const ConceptualVolumeConstituentSequence = new DicomTag(0x3010, 0x0008);
/** (3010,0009) VR=SQ VM=1 Equivalent Conceptual Volume Instance Reference Sequence */
export const EquivalentConceptualVolumeInstanceReferenceSequence = new DicomTag(0x3010, 0x0009);
/** (3010,000A) VR=SQ VM=1 Equivalent Conceptual Volumes Sequence */
export const EquivalentConceptualVolumesSequence = new DicomTag(0x3010, 0x000A);
/** (3010,000B) VR=UI VM=1 Referenced Conceptual Volume UID */
export const ReferencedConceptualVolumeUID = new DicomTag(0x3010, 0x000B);
/** (3010,000C) VR=UT VM=1 Conceptual Volume Combination Expression */
export const ConceptualVolumeCombinationExpression = new DicomTag(0x3010, 0x000C);
/** (3010,000D) VR=US VM=1 Conceptual Volume Constituent Index */
export const ConceptualVolumeConstituentIndex = new DicomTag(0x3010, 0x000D);
/** (3010,000E) VR=CS VM=1 Conceptual Volume Combination Flag */
export const ConceptualVolumeCombinationFlag = new DicomTag(0x3010, 0x000E);
/** (3010,000F) VR=ST VM=1 Conceptual Volume Combination Description */
export const ConceptualVolumeCombinationDescription = new DicomTag(0x3010, 0x000F);
/** (3010,0010) VR=CS VM=1 Conceptual Volume Segmentation Defined Flag */
export const ConceptualVolumeSegmentationDefinedFlag = new DicomTag(0x3010, 0x0010);
/** (3010,0011) VR=SQ VM=1 Conceptual Volume Segmentation Reference Sequence */
export const ConceptualVolumeSegmentationReferenceSequence = new DicomTag(0x3010, 0x0011);
/** (3010,0012) VR=SQ VM=1 Conceptual Volume Constituent Segmentation Reference Sequence */
export const ConceptualVolumeConstituentSegmentationReferenceSequence = new DicomTag(0x3010, 0x0012);
/** (3010,0013) VR=UI VM=1 Constituent Conceptual Volume UID */
export const ConstituentConceptualVolumeUID = new DicomTag(0x3010, 0x0013);
/** (3010,0014) VR=SQ VM=1 Derivation Conceptual Volume Sequence */
export const DerivationConceptualVolumeSequence = new DicomTag(0x3010, 0x0014);
/** (3010,0015) VR=UI VM=1 Source Conceptual Volume UID */
export const SourceConceptualVolumeUID = new DicomTag(0x3010, 0x0015);
/** (3010,0016) VR=SQ VM=1 Conceptual Volume Derivation Algorithm Sequence */
export const ConceptualVolumeDerivationAlgorithmSequence = new DicomTag(0x3010, 0x0016);
/** (3010,0017) VR=ST VM=1 Conceptual Volume Description */
export const ConceptualVolumeDescription = new DicomTag(0x3010, 0x0017);
/** (3010,0018) VR=SQ VM=1 Source Conceptual Volume Sequence */
export const SourceConceptualVolumeSequence = new DicomTag(0x3010, 0x0018);
/** (3010,0019) VR=SQ VM=1 Author Identification Sequence */
export const AuthorIdentificationSequence = new DicomTag(0x3010, 0x0019);
/** (3010,001A) VR=LO VM=1 Manufacturer's Model Version */
export const ManufacturerModelVersion = new DicomTag(0x3010, 0x001A);
/** (3010,001B) VR=UC VM=1 Device Alternate Identifier */
export const DeviceAlternateIdentifier = new DicomTag(0x3010, 0x001B);
/** (3010,001C) VR=CS VM=1 Device Alternate Identifier Type */
export const DeviceAlternateIdentifierType = new DicomTag(0x3010, 0x001C);
/** (3010,001D) VR=LT VM=1 Device Alternate Identifier Format */
export const DeviceAlternateIdentifierFormat = new DicomTag(0x3010, 0x001D);
/** (3010,001E) VR=LO VM=1 Segmentation Creation Template Label */
export const SegmentationCreationTemplateLabel = new DicomTag(0x3010, 0x001E);
/** (3010,001F) VR=UI VM=1 Segmentation Template UID */
export const SegmentationTemplateUID = new DicomTag(0x3010, 0x001F);
/** (3010,0020) VR=US VM=1 Referenced Segment Reference Index */
export const ReferencedSegmentReferenceIndex = new DicomTag(0x3010, 0x0020);
/** (3010,0021) VR=SQ VM=1 Segment Reference Sequence */
export const SegmentReferenceSequence = new DicomTag(0x3010, 0x0021);
/** (3010,0022) VR=US VM=1 Segment Reference Index */
export const SegmentReferenceIndex = new DicomTag(0x3010, 0x0022);
/** (3010,0023) VR=SQ VM=1 Direct Segment Reference Sequence */
export const DirectSegmentReferenceSequence = new DicomTag(0x3010, 0x0023);
/** (3010,0024) VR=SQ VM=1 Combination Segment Reference Sequence */
export const CombinationSegmentReferenceSequence = new DicomTag(0x3010, 0x0024);
/** (3010,0025) VR=SQ VM=1 Conceptual Volume Sequence */
export const ConceptualVolumeSequence = new DicomTag(0x3010, 0x0025);
/** (3010,0026) VR=SQ VM=1 Segmented RT Accessory Device Sequence */
export const SegmentedRTAccessoryDeviceSequence = new DicomTag(0x3010, 0x0026);
/** (3010,0027) VR=SQ VM=1 Segment Characteristics Sequence */
export const SegmentCharacteristicsSequence = new DicomTag(0x3010, 0x0027);
/** (3010,0028) VR=SQ VM=1 Related Segment Characteristics Sequence */
export const RelatedSegmentCharacteristicsSequence = new DicomTag(0x3010, 0x0028);
/** (3010,0029) VR=US VM=1 Segment Characteristics Precedence */
export const SegmentCharacteristicsPrecedence = new DicomTag(0x3010, 0x0029);
/** (3010,002A) VR=SQ VM=1 RT Segment Annotation Sequence */
export const RTSegmentAnnotationSequence = new DicomTag(0x3010, 0x002A);
/** (3010,002B) VR=SQ VM=1 Segment Annotation Category Code Sequence */
export const SegmentAnnotationCategoryCodeSequence = new DicomTag(0x3010, 0x002B);
/** (3010,002C) VR=SQ VM=1 Segment Annotation Type Code Sequence */
export const SegmentAnnotationTypeCodeSequence = new DicomTag(0x3010, 0x002C);
/** (3010,002D) VR=LO VM=1 Device Label */
export const DeviceLabel = new DicomTag(0x3010, 0x002D);
/** (3010,002E) VR=SQ VM=1 Device Type Code Sequence */
export const DeviceTypeCodeSequence = new DicomTag(0x3010, 0x002E);
/** (3010,002F) VR=SQ VM=1 Segment Annotation Type Modifier Code Sequence */
export const SegmentAnnotationTypeModifierCodeSequence = new DicomTag(0x3010, 0x002F);
/** (3010,0030) VR=SQ VM=1 Patient Equipment Relationship Code Sequence */
export const PatientEquipmentRelationshipCodeSequence = new DicomTag(0x3010, 0x0030);
/** (3010,0031) VR=UI VM=1 Referenced Fiducials UID */
export const ReferencedFiducialsUID = new DicomTag(0x3010, 0x0031);
/** (3010,0032) VR=SQ VM=1 Patient Treatment Orientation Sequence */
export const PatientTreatmentOrientationSequence = new DicomTag(0x3010, 0x0032);
/** (3010,0033) VR=SH VM=1 User Content Label */
export const UserContentLabel = new DicomTag(0x3010, 0x0033);
/** (3010,0034) VR=LO VM=1 User Content Long Label */
export const UserContentLongLabel = new DicomTag(0x3010, 0x0034);
/** (3010,0035) VR=SH VM=1 Entity Label */
export const EntityLabel = new DicomTag(0x3010, 0x0035);
/** (3010,0036) VR=LO VM=1 Entity Name */
export const EntityName = new DicomTag(0x3010, 0x0036);
/** (3010,0037) VR=ST VM=1 Entity Description */
export const EntityDescription = new DicomTag(0x3010, 0x0037);
/** (3010,0038) VR=LO VM=1 Entity Long Label */
export const EntityLongLabel = new DicomTag(0x3010, 0x0038);
/** (3010,0039) VR=US VM=1 Device Index */
export const DeviceIndex = new DicomTag(0x3010, 0x0039);
/** (3010,003A) VR=US VM=1 RT Treatment Phase Index */
export const RTTreatmentPhaseIndex = new DicomTag(0x3010, 0x003A);
/** (3010,003B) VR=UI VM=1 RT Treatment Phase UID */
export const RTTreatmentPhaseUID = new DicomTag(0x3010, 0x003B);
/** (3010,003C) VR=US VM=1 RT Prescription Index */
export const RTPrescriptionIndex = new DicomTag(0x3010, 0x003C);
/** (3010,003D) VR=US VM=1 RT Segment Annotation Index */
export const RTSegmentAnnotationIndex = new DicomTag(0x3010, 0x003D);
/** (3010,003E) VR=US VM=1 Basis RT Treatment Phase Index */
export const BasisRTTreatmentPhaseIndex = new DicomTag(0x3010, 0x003E);
/** (3010,003F) VR=US VM=1 Related RT Treatment Phase Index */
export const RelatedRTTreatmentPhaseIndex = new DicomTag(0x3010, 0x003F);
/** (3010,0040) VR=US VM=1 Referenced RT Treatment Phase Index */
export const ReferencedRTTreatmentPhaseIndex = new DicomTag(0x3010, 0x0040);
/** (3010,0041) VR=US VM=1 Referenced RT Prescription Index */
export const ReferencedRTPrescriptionIndex = new DicomTag(0x3010, 0x0041);
/** (3010,0042) VR=US VM=1 Referenced Parent RT Prescription Index */
export const ReferencedParentRTPrescriptionIndex = new DicomTag(0x3010, 0x0042);
/** (3010,0043) VR=ST VM=1 Manufacturer's Device Identifier */
export const ManufacturerDeviceIdentifier = new DicomTag(0x3010, 0x0043);
/** (3010,0044) VR=SQ VM=1 Instance-Level Referenced Performed Procedure Step Sequence */
export const InstanceLevelReferencedPerformedProcedureStepSequence = new DicomTag(0x3010, 0x0044);
/** (3010,0045) VR=CS VM=1 RT Treatment Phase Intent Presence Flag */
export const RTTreatmentPhaseIntentPresenceFlag = new DicomTag(0x3010, 0x0045);
/** (3010,0046) VR=CS VM=1 Radiotherapy Treatment Type */
export const RadiotherapyTreatmentType = new DicomTag(0x3010, 0x0046);
/** (3010,0047) VR=CS VM=1-n Teletherapy Radiation Type */
export const TeletherapyRadiationType = new DicomTag(0x3010, 0x0047);
/** (3010,0048) VR=CS VM=1-n Brachytherapy Source Type */
export const BrachytherapySourceType = new DicomTag(0x3010, 0x0048);
/** (3010,0049) VR=SQ VM=1 Referenced RT Treatment Phase Sequence */
export const ReferencedRTTreatmentPhaseSequence = new DicomTag(0x3010, 0x0049);
/** (3010,004A) VR=SQ VM=1 Referenced Direct Segment Instance Sequence */
export const ReferencedDirectSegmentInstanceSequence = new DicomTag(0x3010, 0x004A);
/** (3010,004B) VR=SQ VM=1 Intended RT Treatment Phase Sequence */
export const IntendedRTTreatmentPhaseSequence = new DicomTag(0x3010, 0x004B);
/** (3010,004C) VR=DA VM=1 Intended Phase Start Date */
export const IntendedPhaseStartDate = new DicomTag(0x3010, 0x004C);
/** (3010,004D) VR=DA VM=1 Intended Phase End Date */
export const IntendedPhaseEndDate = new DicomTag(0x3010, 0x004D);
/** (3010,004E) VR=SQ VM=1 RT Treatment Phase Interval Sequence */
export const RTTreatmentPhaseIntervalSequence = new DicomTag(0x3010, 0x004E);
/** (3010,004F) VR=CS VM=1 Temporal Relationship Interval Anchor */
export const TemporalRelationshipIntervalAnchor = new DicomTag(0x3010, 0x004F);
/** (3010,0050) VR=FD VM=1 Minimum Number of Interval Days */
export const MinimumNumberOfIntervalDays = new DicomTag(0x3010, 0x0050);
/** (3010,0051) VR=FD VM=1 Maximum Number of Interval Days */
export const MaximumNumberOfIntervalDays = new DicomTag(0x3010, 0x0051);
/** (3010,0052) VR=UI VM=1-n Pertinent SOP Classes in Study */
export const PertinentSOPClassesInStudy = new DicomTag(0x3010, 0x0052);
/** (3010,0053) VR=UI VM=1-n Pertinent SOP Classes in Series */
export const PertinentSOPClassesInSeries = new DicomTag(0x3010, 0x0053);
/** (3010,0054) VR=LO VM=1 RT Prescription Label */
export const RTPrescriptionLabel = new DicomTag(0x3010, 0x0054);
/** (3010,0055) VR=SQ VM=1 RT Physician Intent Predecessor Sequence */
export const RTPhysicianIntentPredecessorSequence = new DicomTag(0x3010, 0x0055);
/** (3010,0056) VR=LO VM=1 RT Treatment Approach Label */
export const RTTreatmentApproachLabel = new DicomTag(0x3010, 0x0056);
/** (3010,0057) VR=SQ VM=1 RT Physician Intent Sequence */
export const RTPhysicianIntentSequence = new DicomTag(0x3010, 0x0057);
/** (3010,0058) VR=US VM=1 RT Physician Intent Index */
export const RTPhysicianIntentIndex = new DicomTag(0x3010, 0x0058);
/** (3010,0059) VR=CS VM=1 RT Treatment Intent Type */
export const RTTreatmentIntentType = new DicomTag(0x3010, 0x0059);
/** (3010,005A) VR=UT VM=1 RT Physician Intent Narrative */
export const RTPhysicianIntentNarrative = new DicomTag(0x3010, 0x005A);
/** (3010,005B) VR=SQ VM=1 RT Protocol Code Sequence */
export const RTProtocolCodeSequence = new DicomTag(0x3010, 0x005B);
/** (3010,005C) VR=ST VM=1 Reason for Superseding */
export const ReasonForSuperseding = new DicomTag(0x3010, 0x005C);
/** (3010,005D) VR=SQ VM=1 RT Diagnosis Code Sequence */
export const RTDiagnosisCodeSequence = new DicomTag(0x3010, 0x005D);
/** (3010,005E) VR=US VM=1 Referenced RT Physician Intent Index */
export const ReferencedRTPhysicianIntentIndex = new DicomTag(0x3010, 0x005E);
/** (3010,005F) VR=SQ VM=1 RT Physician Intent Input Instance Sequence */
export const RTPhysicianIntentInputInstanceSequence = new DicomTag(0x3010, 0x005F);
/** (3010,0060) VR=SQ VM=1 RT Anatomic Prescription Sequence */
export const RTAnatomicPrescriptionSequence = new DicomTag(0x3010, 0x0060);
/** (3010,0061) VR=UT VM=1 Prior Treatment Dose Description */
export const PriorTreatmentDoseDescription = new DicomTag(0x3010, 0x0061);
/** (3010,0062) VR=SQ VM=1 Prior Treatment Reference Sequence */
export const PriorTreatmentReferenceSequence = new DicomTag(0x3010, 0x0062);
/** (3010,0063) VR=CS VM=1 Dosimetric Objective Evaluation Scope */
export const DosimetricObjectiveEvaluationScope = new DicomTag(0x3010, 0x0063);
/** (3010,0064) VR=SQ VM=1 Therapeutic Role Category Code Sequence */
export const TherapeuticRoleCategoryCodeSequence = new DicomTag(0x3010, 0x0064);
/** (3010,0065) VR=SQ VM=1 Therapeutic Role Type Code Sequence */
export const TherapeuticRoleTypeCodeSequence = new DicomTag(0x3010, 0x0065);
/** (3010,0066) VR=US VM=1 Conceptual Volume Optimization Precedence */
export const ConceptualVolumeOptimizationPrecedence = new DicomTag(0x3010, 0x0066);
/** (3010,0067) VR=SQ VM=1 Conceptual Volume Category Code Sequence */
export const ConceptualVolumeCategoryCodeSequence = new DicomTag(0x3010, 0x0067);
/** (3010,0068) VR=CS VM=1 Conceptual Volume Blocking Constraint */
export const ConceptualVolumeBlockingConstraint = new DicomTag(0x3010, 0x0068);
/** (3010,0069) VR=SQ VM=1 Conceptual Volume Type Code Sequence */
export const ConceptualVolumeTypeCodeSequence = new DicomTag(0x3010, 0x0069);
/** (3010,006A) VR=SQ VM=1 Conceptual Volume Type Modifier Code Sequence */
export const ConceptualVolumeTypeModifierCodeSequence = new DicomTag(0x3010, 0x006A);
/** (3010,006B) VR=SQ VM=1 RT Prescription Sequence */
export const RTPrescriptionSequence = new DicomTag(0x3010, 0x006B);
/** (3010,006C) VR=SQ VM=1 Dosimetric Objective Sequence */
export const DosimetricObjectiveSequence = new DicomTag(0x3010, 0x006C);
/** (3010,006D) VR=SQ VM=1 Dosimetric Objective Type Code Sequence */
export const DosimetricObjectiveTypeCodeSequence = new DicomTag(0x3010, 0x006D);
/** (3010,006E) VR=UI VM=1 Dosimetric Objective UID */
export const DosimetricObjectiveUID = new DicomTag(0x3010, 0x006E);
/** (3010,006F) VR=UI VM=1 Referenced Dosimetric Objective UID */
export const ReferencedDosimetricObjectiveUID = new DicomTag(0x3010, 0x006F);
/** (3010,0070) VR=SQ VM=1 Dosimetric Objective Parameter Sequence */
export const DosimetricObjectiveParameterSequence = new DicomTag(0x3010, 0x0070);
/** (3010,0071) VR=SQ VM=1 Referenced Dosimetric Objectives Sequence */
export const ReferencedDosimetricObjectivesSequence = new DicomTag(0x3010, 0x0071);
/** (3010,0073) VR=CS VM=1 Absolute Dosimetric Objective Flag */
export const AbsoluteDosimetricObjectiveFlag = new DicomTag(0x3010, 0x0073);
/** (3010,0074) VR=FD VM=1 Dosimetric Objective Weight */
export const DosimetricObjectiveWeight = new DicomTag(0x3010, 0x0074);
/** (3010,0075) VR=CS VM=1 Dosimetric Objective Purpose */
export const DosimetricObjectivePurpose = new DicomTag(0x3010, 0x0075);
/** (3010,0076) VR=SQ VM=1 Planning Input Information Sequence */
export const PlanningInputInformationSequence = new DicomTag(0x3010, 0x0076);
/** (3010,0077) VR=LO VM=1 Treatment Site */
export const TreatmentSite = new DicomTag(0x3010, 0x0077);
/** (3010,0078) VR=SQ VM=1 Treatment Site Code Sequence */
export const TreatmentSiteCodeSequence = new DicomTag(0x3010, 0x0078);
/** (3010,0079) VR=SQ VM=1 Fraction Pattern Sequence */
export const FractionPatternSequence = new DicomTag(0x3010, 0x0079);
/** (3010,007A) VR=UT VM=1 Treatment Technique Notes */
export const TreatmentTechniqueNotes = new DicomTag(0x3010, 0x007A);
/** (3010,007B) VR=UT VM=1 Prescription Notes */
export const PrescriptionNotes = new DicomTag(0x3010, 0x007B);
/** (3010,007C) VR=IS VM=1 Number of Interval Fractions */
export const NumberOfIntervalFractions = new DicomTag(0x3010, 0x007C);
/** (3010,007D) VR=US VM=1 Number of Fractions */
export const NumberOfFractions = new DicomTag(0x3010, 0x007D);
/** (3010,007E) VR=US VM=1 Intended Delivery Duration */
export const IntendedDeliveryDuration = new DicomTag(0x3010, 0x007E);
/** (3010,007F) VR=UT VM=1 Fractionation Notes */
export const FractionationNotes = new DicomTag(0x3010, 0x007F);
/** (3010,0080) VR=SQ VM=1 RT Treatment Technique Code Sequence */
export const RTTreatmentTechniqueCodeSequence = new DicomTag(0x3010, 0x0080);
/** (3010,0081) VR=SQ VM=1 Prescription Notes Sequence */
export const PrescriptionNotesSequence = new DicomTag(0x3010, 0x0081);
/** (3010,0082) VR=SQ VM=1 Fraction-Based Relationship Sequence */
export const FractionBasedRelationshipSequence = new DicomTag(0x3010, 0x0082);
/** (3010,0083) VR=CS VM=1 Fraction-Based Relationship Interval Anchor */
export const FractionBasedRelationshipIntervalAnchor = new DicomTag(0x3010, 0x0083);
/** (3010,0084) VR=FD VM=1 Minimum Hours between Fractions */
export const MinimumHoursBetweenFractions = new DicomTag(0x3010, 0x0084);
/** (3010,0085) VR=TM VM=1-n Intended Fraction Start Time */
export const IntendedFractionStartTime = new DicomTag(0x3010, 0x0085);
/** (3010,0086) VR=LT VM=1 Intended Start Day of Week */
export const IntendedStartDayOfWeek = new DicomTag(0x3010, 0x0086);
/** (3010,0087) VR=SQ VM=1 Weekday Fraction Pattern Sequence */
export const WeekdayFractionPatternSequence = new DicomTag(0x3010, 0x0087);
/** (3010,0088) VR=SQ VM=1 Delivery Time Structure Code Sequence */
export const DeliveryTimeStructureCodeSequence = new DicomTag(0x3010, 0x0088);
/** (3010,0089) VR=SQ VM=1 Treatment Site Modifier Code Sequence */
export const TreatmentSiteModifierCodeSequence = new DicomTag(0x3010, 0x0089);
/** (3010,0090) VR=CS VM=1 Robotic Base Location Indicator (Retired) */
export const RoboticBaseLocationIndicator = new DicomTag(0x3010, 0x0090);
/** (3010,0091) VR=SQ VM=1 Robotic Path Node Set Code Sequence */
export const RoboticPathNodeSetCodeSequence = new DicomTag(0x3010, 0x0091);
/** (3010,0092) VR=UL VM=1 Robotic Node Identifier */
export const RoboticNodeIdentifier = new DicomTag(0x3010, 0x0092);
/** (3010,0093) VR=FD VM=3 RT Treatment Source Coordinates */
export const RTTreatmentSourceCoordinates = new DicomTag(0x3010, 0x0093);
/** (3010,0094) VR=FD VM=1 Radiation Source Coordinate SystemYaw Angle */
export const RadiationSourceCoordinateSystemYawAngle = new DicomTag(0x3010, 0x0094);
/** (3010,0095) VR=FD VM=1 Radiation Source Coordinate SystemRoll Angle */
export const RadiationSourceCoordinateSystemRollAngle = new DicomTag(0x3010, 0x0095);
/** (3010,0096) VR=FD VM=1 Radiation Source Coordinate System Pitch Angle */
export const RadiationSourceCoordinateSystemPitchAngle = new DicomTag(0x3010, 0x0096);
/** (3010,0097) VR=SQ VM=1 Robotic Path Control Point Sequence */
export const RoboticPathControlPointSequence = new DicomTag(0x3010, 0x0097);
/** (3010,0098) VR=SQ VM=1 Tomotherapeutic Control Point Sequence */
export const TomotherapeuticControlPointSequence = new DicomTag(0x3010, 0x0098);
/** (3010,0099) VR=FD VM=1-n Tomotherapeutic Leaf Open Durations */
export const TomotherapeuticLeafOpenDurations = new DicomTag(0x3010, 0x0099);
/** (3010,009A) VR=FD VM=1-n Tomotherapeutic Leaf Initial Closed Durations */
export const TomotherapeuticLeafInitialClosedDurations = new DicomTag(0x3010, 0x009A);
/** (3010,00A0) VR=SQ VM=1 Conceptual Volume Identification Sequence */
export const ConceptualVolumeIdentificationSequence = new DicomTag(0x3010, 0x00A0);
/** (4000,0010) VR=LT VM=1 Arbitrary (Retired) */
export const Arbitrary = new DicomTag(0x4000, 0x0010);
/** (4000,4000) VR=LT VM=1 Text Comments (Retired) */
export const TextComments = new DicomTag(0x4000, 0x4000);
/** (4008,0040) VR=SH VM=1 Results ID (Retired) */
export const ResultsID = new DicomTag(0x4008, 0x0040);
/** (4008,0042) VR=LO VM=1 Results ID Issuer (Retired) */
export const ResultsIDIssuer = new DicomTag(0x4008, 0x0042);
/** (4008,0050) VR=SQ VM=1 Referenced Interpretation Sequence (Retired) */
export const ReferencedInterpretationSequence = new DicomTag(0x4008, 0x0050);
/** (4008,00FF) VR=CS VM=1 Report Production Status (Trial) (Retired) */
export const ReportProductionStatusTrial = new DicomTag(0x4008, 0x00FF);
/** (4008,0100) VR=DA VM=1 Interpretation Recorded Date (Retired) */
export const InterpretationRecordedDate = new DicomTag(0x4008, 0x0100);
/** (4008,0101) VR=TM VM=1 Interpretation Recorded Time (Retired) */
export const InterpretationRecordedTime = new DicomTag(0x4008, 0x0101);
/** (4008,0102) VR=PN VM=1 Interpretation Recorder (Retired) */
export const InterpretationRecorder = new DicomTag(0x4008, 0x0102);
/** (4008,0103) VR=LO VM=1 Reference to Recorded Sound (Retired) */
export const ReferenceToRecordedSound = new DicomTag(0x4008, 0x0103);
/** (4008,0108) VR=DA VM=1 Interpretation Transcription Date (Retired) */
export const InterpretationTranscriptionDate = new DicomTag(0x4008, 0x0108);
/** (4008,0109) VR=TM VM=1 Interpretation Transcription Time (Retired) */
export const InterpretationTranscriptionTime = new DicomTag(0x4008, 0x0109);
/** (4008,010A) VR=PN VM=1 Interpretation Transcriber (Retired) */
export const InterpretationTranscriber = new DicomTag(0x4008, 0x010A);
/** (4008,010B) VR=ST VM=1 Interpretation Text (Retired) */
export const InterpretationText = new DicomTag(0x4008, 0x010B);
/** (4008,010C) VR=PN VM=1 Interpretation Author (Retired) */
export const InterpretationAuthor = new DicomTag(0x4008, 0x010C);
/** (4008,0111) VR=SQ VM=1 Interpretation Approver Sequence (Retired) */
export const InterpretationApproverSequence = new DicomTag(0x4008, 0x0111);
/** (4008,0112) VR=DA VM=1 Interpretation Approval Date (Retired) */
export const InterpretationApprovalDate = new DicomTag(0x4008, 0x0112);
/** (4008,0113) VR=TM VM=1 Interpretation Approval Time (Retired) */
export const InterpretationApprovalTime = new DicomTag(0x4008, 0x0113);
/** (4008,0114) VR=PN VM=1 Physician Approving Interpretation (Retired) */
export const PhysicianApprovingInterpretation = new DicomTag(0x4008, 0x0114);
/** (4008,0115) VR=LT VM=1 Interpretation Diagnosis Description (Retired) */
export const InterpretationDiagnosisDescription = new DicomTag(0x4008, 0x0115);
/** (4008,0117) VR=SQ VM=1 Interpretation Diagnosis Code Sequence (Retired) */
export const InterpretationDiagnosisCodeSequence = new DicomTag(0x4008, 0x0117);
/** (4008,0118) VR=SQ VM=1 Results Distribution List Sequence (Retired) */
export const ResultsDistributionListSequence = new DicomTag(0x4008, 0x0118);
/** (4008,0119) VR=PN VM=1 Distribution Name (Retired) */
export const DistributionName = new DicomTag(0x4008, 0x0119);
/** (4008,011A) VR=LO VM=1 Distribution Address (Retired) */
export const DistributionAddress = new DicomTag(0x4008, 0x011A);
/** (4008,0200) VR=SH VM=1 Interpretation ID (Retired) */
export const InterpretationID = new DicomTag(0x4008, 0x0200);
/** (4008,0202) VR=LO VM=1 Interpretation ID Issuer (Retired) */
export const InterpretationIDIssuer = new DicomTag(0x4008, 0x0202);
/** (4008,0210) VR=CS VM=1 Interpretation Type ID (Retired) */
export const InterpretationTypeID = new DicomTag(0x4008, 0x0210);
/** (4008,0212) VR=CS VM=1 Interpretation Status ID (Retired) */
export const InterpretationStatusID = new DicomTag(0x4008, 0x0212);
/** (4008,0300) VR=ST VM=1 Impressions (Retired) */
export const Impressions = new DicomTag(0x4008, 0x0300);
/** (4008,4000) VR=ST VM=1 Results Comments (Retired) */
export const ResultsComments = new DicomTag(0x4008, 0x4000);
/** (4010,0001) VR=CS VM=1 Low Energy Detectors */
export const LowEnergyDetectors = new DicomTag(0x4010, 0x0001);
/** (4010,0002) VR=CS VM=1 High Energy Detectors */
export const HighEnergyDetectors = new DicomTag(0x4010, 0x0002);
/** (4010,0004) VR=SQ VM=1 Detector Geometry Sequence */
export const DetectorGeometrySequence = new DicomTag(0x4010, 0x0004);
/** (4010,1001) VR=SQ VM=1 Threat ROI Voxel Sequence */
export const ThreatROIVoxelSequence = new DicomTag(0x4010, 0x1001);
/** (4010,1004) VR=FL VM=3 Threat ROI Base */
export const ThreatROIBase = new DicomTag(0x4010, 0x1004);
/** (4010,1005) VR=FL VM=3 Threat ROI Extents */
export const ThreatROIExtents = new DicomTag(0x4010, 0x1005);
/** (4010,1006) VR=OB VM=1 Threat ROI Bitmap */
export const ThreatROIBitmap = new DicomTag(0x4010, 0x1006);
/** (4010,1007) VR=SH VM=1 Route Segment ID */
export const RouteSegmentID = new DicomTag(0x4010, 0x1007);
/** (4010,1008) VR=CS VM=1 Gantry Type */
export const GantryType = new DicomTag(0x4010, 0x1008);
/** (4010,1009) VR=CS VM=1 OOI Owner Type */
export const OOIOwnerType = new DicomTag(0x4010, 0x1009);
/** (4010,100A) VR=SQ VM=1 Route Segment Sequence */
export const RouteSegmentSequence = new DicomTag(0x4010, 0x100A);
/** (4010,1010) VR=US VM=1 Potential Threat Object ID */
export const PotentialThreatObjectID = new DicomTag(0x4010, 0x1010);
/** (4010,1011) VR=SQ VM=1 Threat Sequence */
export const ThreatSequence = new DicomTag(0x4010, 0x1011);
/** (4010,1012) VR=CS VM=1 Threat Category */
export const ThreatCategory = new DicomTag(0x4010, 0x1012);
/** (4010,1013) VR=LT VM=1 Threat Category Description */
export const ThreatCategoryDescription = new DicomTag(0x4010, 0x1013);
/** (4010,1014) VR=CS VM=1 ATD Ability Assessment */
export const ATDAbilityAssessment = new DicomTag(0x4010, 0x1014);
/** (4010,1015) VR=CS VM=1 ATD Assessment Flag */
export const ATDAssessmentFlag = new DicomTag(0x4010, 0x1015);
/** (4010,1016) VR=FL VM=1 ATD Assessment Probability */
export const ATDAssessmentProbability = new DicomTag(0x4010, 0x1016);
/** (4010,1017) VR=FL VM=1 Mass */
export const Mass = new DicomTag(0x4010, 0x1017);
/** (4010,1018) VR=FL VM=1 Density */
export const Density = new DicomTag(0x4010, 0x1018);
/** (4010,1019) VR=FL VM=1 Z Effective */
export const ZEffective = new DicomTag(0x4010, 0x1019);
/** (4010,101A) VR=SH VM=1 Boarding Pass ID */
export const BoardingPassID = new DicomTag(0x4010, 0x101A);
/** (4010,101B) VR=FL VM=3 Center of Mass */
export const CenterOfMass = new DicomTag(0x4010, 0x101B);
/** (4010,101C) VR=FL VM=3 Center of PTO */
export const CenterOfPTO = new DicomTag(0x4010, 0x101C);
/** (4010,101D) VR=FL VM=6-n Bounding Polygon */
export const BoundingPolygon = new DicomTag(0x4010, 0x101D);
/** (4010,101E) VR=SH VM=1 Route Segment Start Location ID */
export const RouteSegmentStartLocationID = new DicomTag(0x4010, 0x101E);
/** (4010,101F) VR=SH VM=1 Route Segment End Location ID */
export const RouteSegmentEndLocationID = new DicomTag(0x4010, 0x101F);
/** (4010,1020) VR=CS VM=1 Route Segment Location ID Type */
export const RouteSegmentLocationIDType = new DicomTag(0x4010, 0x1020);
/** (4010,1021) VR=CS VM=1-n Abort Reason */
export const AbortReason = new DicomTag(0x4010, 0x1021);
/** (4010,1023) VR=FL VM=1 Volume of PTO */
export const VolumeOfPTO = new DicomTag(0x4010, 0x1023);
/** (4010,1024) VR=CS VM=1 Abort Flag */
export const AbortFlag = new DicomTag(0x4010, 0x1024);
/** (4010,1025) VR=DT VM=1 Route Segment Start Time */
export const RouteSegmentStartTime = new DicomTag(0x4010, 0x1025);
/** (4010,1026) VR=DT VM=1 Route Segment End Time */
export const RouteSegmentEndTime = new DicomTag(0x4010, 0x1026);
/** (4010,1027) VR=CS VM=1 TDR Type */
export const TDRType = new DicomTag(0x4010, 0x1027);
/** (4010,1028) VR=CS VM=1 International Route Segment */
export const InternationalRouteSegment = new DicomTag(0x4010, 0x1028);
/** (4010,1029) VR=LO VM=1-n Threat Detection Algorithm and Version */
export const ThreatDetectionAlgorithmAndVersion = new DicomTag(0x4010, 0x1029);
/** (4010,102A) VR=SH VM=1 Assigned Location */
export const AssignedLocation = new DicomTag(0x4010, 0x102A);
/** (4010,102B) VR=DT VM=1 Alarm Decision Time */
export const AlarmDecisionTime = new DicomTag(0x4010, 0x102B);
/** (4010,1031) VR=CS VM=1 Alarm Decision */
export const AlarmDecision = new DicomTag(0x4010, 0x1031);
/** (4010,1033) VR=US VM=1 Number of Total Objects */
export const NumberOfTotalObjects = new DicomTag(0x4010, 0x1033);
/** (4010,1034) VR=US VM=1 Number of Alarm Objects */
export const NumberOfAlarmObjects = new DicomTag(0x4010, 0x1034);
/** (4010,1037) VR=SQ VM=1 PTO Representation Sequence */
export const PTORepresentationSequence = new DicomTag(0x4010, 0x1037);
/** (4010,1038) VR=SQ VM=1 ATD Assessment Sequence */
export const ATDAssessmentSequence = new DicomTag(0x4010, 0x1038);
/** (4010,1039) VR=CS VM=1 TIP Type */
export const TIPType = new DicomTag(0x4010, 0x1039);
/** (4010,103A) VR=CS VM=1 DICOS Version */
export const DICOSVersion = new DicomTag(0x4010, 0x103A);
/** (4010,1041) VR=DT VM=1 OOI Owner Creation Time */
export const OOIOwnerCreationTime = new DicomTag(0x4010, 0x1041);
/** (4010,1042) VR=CS VM=1 OOI Type */
export const OOIType = new DicomTag(0x4010, 0x1042);
/** (4010,1043) VR=FL VM=3 OOI Size */
export const OOISize = new DicomTag(0x4010, 0x1043);
/** (4010,1044) VR=CS VM=1 Acquisition Status */
export const AcquisitionStatus = new DicomTag(0x4010, 0x1044);
/** (4010,1045) VR=SQ VM=1 Basis Materials Code Sequence */
export const BasisMaterialsCodeSequence = new DicomTag(0x4010, 0x1045);
/** (4010,1046) VR=CS VM=1 Phantom Type */
export const PhantomType = new DicomTag(0x4010, 0x1046);
/** (4010,1047) VR=SQ VM=1 OOI Owner Sequence */
export const OOIOwnerSequence = new DicomTag(0x4010, 0x1047);
/** (4010,1048) VR=CS VM=1 Scan Type */
export const ScanType = new DicomTag(0x4010, 0x1048);
/** (4010,1051) VR=LO VM=1 Itinerary ID */
export const ItineraryID = new DicomTag(0x4010, 0x1051);
/** (4010,1052) VR=SH VM=1 Itinerary ID Type */
export const ItineraryIDType = new DicomTag(0x4010, 0x1052);
/** (4010,1053) VR=LO VM=1 Itinerary ID Assigning Authority */
export const ItineraryIDAssigningAuthority = new DicomTag(0x4010, 0x1053);
/** (4010,1054) VR=SH VM=1 Route ID */
export const RouteID = new DicomTag(0x4010, 0x1054);
/** (4010,1055) VR=SH VM=1 Route ID Assigning Authority */
export const RouteIDAssigningAuthority = new DicomTag(0x4010, 0x1055);
/** (4010,1056) VR=CS VM=1 Inbound Arrival Type */
export const InboundArrivalType = new DicomTag(0x4010, 0x1056);
/** (4010,1058) VR=SH VM=1 Carrier ID */
export const CarrierID = new DicomTag(0x4010, 0x1058);
/** (4010,1059) VR=CS VM=1 Carrier ID Assigning Authority */
export const CarrierIDAssigningAuthority = new DicomTag(0x4010, 0x1059);
/** (4010,1060) VR=FL VM=3 Source Orientation */
export const SourceOrientation = new DicomTag(0x4010, 0x1060);
/** (4010,1061) VR=FL VM=3 Source Position */
export const SourcePosition = new DicomTag(0x4010, 0x1061);
/** (4010,1062) VR=FL VM=1 Belt Height */
export const BeltHeight = new DicomTag(0x4010, 0x1062);
/** (4010,1064) VR=SQ VM=1 Algorithm Routing Code Sequence */
export const AlgorithmRoutingCodeSequence = new DicomTag(0x4010, 0x1064);
/** (4010,1067) VR=CS VM=1 Transport Classification */
export const TransportClassification = new DicomTag(0x4010, 0x1067);
/** (4010,1068) VR=LT VM=1 OOI Type Descriptor */
export const OOITypeDescriptor = new DicomTag(0x4010, 0x1068);
/** (4010,1069) VR=FL VM=1 Total Processing Time */
export const TotalProcessingTime = new DicomTag(0x4010, 0x1069);
/** (4010,106C) VR=OB VM=1 Detector Calibration Data */
export const DetectorCalibrationData = new DicomTag(0x4010, 0x106C);
/** (4010,106D) VR=CS VM=1 Additional Screening Performed */
export const AdditionalScreeningPerformed = new DicomTag(0x4010, 0x106D);
/** (4010,106E) VR=CS VM=1 Additional Inspection Selection Criteria */
export const AdditionalInspectionSelectionCriteria = new DicomTag(0x4010, 0x106E);
/** (4010,106F) VR=SQ VM=1 Additional Inspection Method Sequence */
export const AdditionalInspectionMethodSequence = new DicomTag(0x4010, 0x106F);
/** (4010,1070) VR=CS VM=1 AIT Device Type */
export const AITDeviceType = new DicomTag(0x4010, 0x1070);
/** (4010,1071) VR=SQ VM=1 QR Measurements Sequence */
export const QRMeasurementsSequence = new DicomTag(0x4010, 0x1071);
/** (4010,1072) VR=SQ VM=1 Target Material Sequence */
export const TargetMaterialSequence = new DicomTag(0x4010, 0x1072);
/** (4010,1073) VR=FD VM=1 SNR Threshold */
export const SNRThreshold = new DicomTag(0x4010, 0x1073);
/** (4010,1075) VR=DS VM=1 Image Scale Representation */
export const ImageScaleRepresentation = new DicomTag(0x4010, 0x1075);
/** (4010,1076) VR=SQ VM=1 Referenced PTO Sequence */
export const ReferencedPTOSequence = new DicomTag(0x4010, 0x1076);
/** (4010,1077) VR=SQ VM=1 Referenced TDR Instance Sequence */
export const ReferencedTDRInstanceSequence = new DicomTag(0x4010, 0x1077);
/** (4010,1078) VR=ST VM=1 PTO Location Description */
export const PTOLocationDescription = new DicomTag(0x4010, 0x1078);
/** (4010,1079) VR=SQ VM=1 Anomaly Locator Indicator Sequence */
export const AnomalyLocatorIndicatorSequence = new DicomTag(0x4010, 0x1079);
/** (4010,107A) VR=FL VM=3 Anomaly Locator Indicator */
export const AnomalyLocatorIndicator = new DicomTag(0x4010, 0x107A);
/** (4010,107B) VR=SQ VM=1 PTO Region Sequence */
export const PTORegionSequence = new DicomTag(0x4010, 0x107B);
/** (4010,107C) VR=CS VM=1 Inspection Selection Criteria */
export const InspectionSelectionCriteria = new DicomTag(0x4010, 0x107C);
/** (4010,107D) VR=SQ VM=1 Secondary Inspection Method Sequence */
export const SecondaryInspectionMethodSequence = new DicomTag(0x4010, 0x107D);
/** (4010,107E) VR=DS VM=6 PRCS to RCS Orientation */
export const PRCSToRCSOrientation = new DicomTag(0x4010, 0x107E);
/** (4FFE,0001) VR=SQ VM=1 MAC Parameters Sequence */
export const MACParametersSequence = new DicomTag(0x4FFE, 0x0001);
/** (5200,9229) VR=SQ VM=1 Shared Functional Groups Sequence */
export const SharedFunctionalGroupsSequence = new DicomTag(0x5200, 0x9229);
/** (5200,9230) VR=SQ VM=1 Per-Frame Functional Groups Sequence */
export const PerFrameFunctionalGroupsSequence = new DicomTag(0x5200, 0x9230);
/** (5400,0100) VR=SQ VM=1 Waveform Sequence */
export const WaveformSequence = new DicomTag(0x5400, 0x0100);
/** (5400,0110) VR=OB/OW VM=1 Channel Minimum Value */
export const ChannelMinimumValue = new DicomTag(0x5400, 0x0110);
/** (5400,0112) VR=OB/OW VM=1 Channel Maximum Value */
export const ChannelMaximumValue = new DicomTag(0x5400, 0x0112);
/** (5400,1004) VR=US VM=1 Waveform Bits Allocated */
export const WaveformBitsAllocated = new DicomTag(0x5400, 0x1004);
/** (5400,1006) VR=CS VM=1 Waveform Sample Interpretation */
export const WaveformSampleInterpretation = new DicomTag(0x5400, 0x1006);
/** (5400,100A) VR=OB/OW VM=1 Waveform Padding Value */
export const WaveformPaddingValue = new DicomTag(0x5400, 0x100A);
/** (5400,1010) VR=OB/OW VM=1 Waveform Data */
export const WaveformData = new DicomTag(0x5400, 0x1010);
/** (5600,0010) VR=OF VM=1 First Order Phase Correction Angle */
export const FirstOrderPhaseCorrectionAngle = new DicomTag(0x5600, 0x0010);
/** (5600,0020) VR=OF VM=1 Spectroscopy Data */
export const SpectroscopyData = new DicomTag(0x5600, 0x0020);
/** (7FE0,0001) VR=OV VM=1 Extended Offset Table */
export const ExtendedOffsetTable = new DicomTag(0x7FE0, 0x0001);
/** (7FE0,0002) VR=OV VM=1 Extended Offset Table Lengths */
export const ExtendedOffsetTableLengths = new DicomTag(0x7FE0, 0x0002);
/** (7FE0,0003) VR=UV VM=1 Encapsulated Pixel Data Value Total Length */
export const EncapsulatedPixelDataValueTotalLength = new DicomTag(0x7FE0, 0x0003);
/** (7FE0,0008) VR=OF VM=1 Float Pixel Data */
export const FloatPixelData = new DicomTag(0x7FE0, 0x0008);
/** (7FE0,0009) VR=OD VM=1 Double Float Pixel Data */
export const DoubleFloatPixelData = new DicomTag(0x7FE0, 0x0009);
/** (7FE0,0010) VR=OB/OW VM=1 Pixel Data */
export const PixelData = new DicomTag(0x7FE0, 0x0010);
/** (7FE0,0020) VR=OW VM=1 Coefficients SDVN (Retired) */
export const CoefficientsSDVN = new DicomTag(0x7FE0, 0x0020);
/** (7FE0,0030) VR=OW VM=1 Coefficients SDHN (Retired) */
export const CoefficientsSDHN = new DicomTag(0x7FE0, 0x0030);
/** (7FE0,0040) VR=OW VM=1 Coefficients SDDN (Retired) */
export const CoefficientsSDDN = new DicomTag(0x7FE0, 0x0040);
/** (FFFA,FFFA) VR=SQ VM=1 Digital Signatures Sequence */
export const DigitalSignaturesSequence = new DicomTag(0xFFFA, 0xFFFA);
/** (FFFC,FFFC) VR=OB VM=1 Data Set Trailing Padding */
export const DataSetTrailingPadding = new DicomTag(0xFFFC, 0xFFFC);
/** (FFFE,E000) VR=UN VM=1 Item */
export const Item = new DicomTag(0xFFFE, 0xE000);
/** (FFFE,E00D) VR=UN VM=1 Item Delimitation Item */
export const ItemDelimitationItem = new DicomTag(0xFFFE, 0xE00D);
/** (FFFE,E0DD) VR=UN VM=1 Sequence Delimitation Item */
export const SequenceDelimitationItem = new DicomTag(0xFFFE, 0xE0DD);
/** (0006,0001) VR=SQ VM=1 Current Frame Functional Groups Sequence */
export const CurrentFrameFunctionalGroupsSequence = new DicomTag(0x0006, 0x0001);
