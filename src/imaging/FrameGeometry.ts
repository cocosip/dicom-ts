
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomTag } from "../core/DicomTag.js";
import * as DicomTags from "../core/DicomTag.generated.js";
import { Point2 } from "./math/Point2.js";
import { Point2D } from "./math/Point2D.js";
import { Point3D, Vector3D, isNearlyZero } from "./math/Geometry3D.js";
import { Matrix } from "./math/Matrix.js";
import { DicomImagingException } from "./DicomImagingException.js";

export enum FrameOrientation {
  None,
  Axial,
  Sagittal,
  Coronal,
}

export enum FrameGeometryType {
  None,
  Plane,
  Volume,
}

export class FrameGeometry {
  geometryType: FrameGeometryType = FrameGeometryType.None;
  frameOfReferenceUid: string = "";
  directionRow: Vector3D = Vector3D.AXIS_X;
  directionColumn: Vector3D = Vector3D.AXIS_Y;
  directionNormal: Vector3D = Vector3D.AXIS_Z;
  frameSize: Point2 = Point2.ORIGIN;
  pixelSpacingBetweenColumns: number = 0;
  pixelSpacingBetweenRows: number = 0;
  pointTopLeft: Point3D = Point3D.ZERO;
  pointTopRight: Point3D = Point3D.ZERO;
  pointBottomLeft: Point3D = Point3D.ZERO;
  pointBottomRight: Point3D = Point3D.ZERO;
  orientation: FrameOrientation = FrameOrientation.None;

  private imageToPatientSpace: Matrix | null = null;
  private patientToImageSpace: Matrix | null = null;

  get hasGeometryData(): boolean {
    return this.geometryType !== FrameGeometryType.None;
  }

  constructor(imageOrUid: DicomDataset | string, frame: number | number[] = 0, orientation?: number[], pixelSpacing?: number[], width?: number, height?: number) {
    if (imageOrUid instanceof DicomDataset) {
      this.initFromDataset(imageOrUid, typeof frame === "number" ? frame : 0);
    } else {
      // Constructor overload: (uid, position, orientation, spacing, width, height)
      // frame -> position (number[])
      // orientation -> orientation (number[])
      // pixelSpacing -> pixelSpacing (number[])
      // width -> width
      // height -> height
      const uid = imageOrUid;
      const pos = frame as number[];
      const orient = orientation!;
      const spacing = pixelSpacing!;
      const w = width!;
      const h = height!;
      
      this.initFromValues(uid, pos, orient, spacing, w, h);
    }
  }

  private initFromDataset(image: DicomDataset, frame: number) {
    // Functional groups handling omitted for brevity, assuming basic tags first
    // In a full port, we'd need DicomDatasetExtensions or similar to handle functional groups
    
    this.frameOfReferenceUid = image.getString(DicomTags.FrameOfReferenceUID) || "";
    this.frameSize = new Point2(
      image.getSingleValueOrDefault(DicomTags.Columns, 0),
      image.getSingleValueOrDefault(DicomTags.Rows, 0)
    );

    let pixelSpacing: number[] | undefined;
    if (image.contains(DicomTags.ImagerPixelSpacing)) {
      pixelSpacing = image.getValues(DicomTags.ImagerPixelSpacing);
    } else if (image.contains(DicomTags.PixelSpacing)) {
      pixelSpacing = image.getValues(DicomTags.PixelSpacing);
    } else if (image.contains(DicomTags.NominalScannedPixelSpacing)) {
      pixelSpacing = image.getValues(DicomTags.NominalScannedPixelSpacing);
    }

    if (pixelSpacing && pixelSpacing.length >= 2) {
      this.pixelSpacingBetweenRows = pixelSpacing[0] ?? 0;
      this.pixelSpacingBetweenColumns = pixelSpacing[1] ?? 0;
    }

    const patientPosition = image.tryGetValues<number>(DicomTags.ImagePositionPatient) || [];
    const patientOrientation = image.tryGetValues<number>(DicomTags.ImageOrientationPatient) || [];
    
    this.initializeCalculatedVolumeData(patientPosition, patientOrientation);
    this.initializeTransformationMatrices();
  }

  private initFromValues(uid: string, position: number[], orientation: number[], spacing: number[], width: number, height: number) {
    this.frameOfReferenceUid = uid;
    this.frameSize = new Point2(width, height);
    this.pixelSpacingBetweenRows = spacing[0] ?? 0;
    this.pixelSpacingBetweenColumns = spacing[1] ?? 0;
    
    this.initializeCalculatedVolumeData(position, orientation);
    this.initializeTransformationMatrices();
  }

  private initializeCalculatedVolumeData(imagePatientPosition: number[], imagePatientOrientation: number[]) {
    if ((!imagePatientPosition || imagePatientPosition.length === 0) && 
        (!imagePatientOrientation || imagePatientOrientation.length === 0)) {
      this.orientation = FrameOrientation.None;
      this.pointTopLeft = new Point3D(0, 0, 0);
      this.directionRow = new Vector3D(1, 0, 0);
      this.directionColumn = new Vector3D(0, 1, 0);
    } else {
      this.pointTopLeft = new Point3D(imagePatientPosition[0], imagePatientPosition[1], imagePatientPosition[2]);
      this.directionRow = new Vector3D(imagePatientOrientation[0], imagePatientOrientation[1], imagePatientOrientation[2]);
      this.directionColumn = new Vector3D(imagePatientOrientation[3], imagePatientOrientation[4], imagePatientOrientation[5]);
    }

    this.directionNormal = this.directionRow.cross(this.directionColumn);
    
    if (this.directionNormal.isZero) {
      this.orientation = FrameOrientation.None;
    } else {
      const axis = this.directionNormal.nearestAxis();
      if (axis.x !== 0) this.orientation = FrameOrientation.Sagittal;
      else if (axis.y !== 0) this.orientation = FrameOrientation.Coronal;
      else if (axis.z !== 0) this.orientation = FrameOrientation.Axial;
      else this.orientation = FrameOrientation.None;
    }

    // PointTopRight = PointTopLeft + DirectionRow * PixelSpacingBetweenColumns * FrameSize.X
    this.pointTopRight = this.pointTopLeft.plus(this.directionRow.scale(this.pixelSpacingBetweenColumns * this.frameSize.x));
    
    // PointBottomLeft = PointTopLeft + DirectionColumn * PixelSpacingBetweenRows * FrameSize.Y
    this.pointBottomLeft = this.pointTopLeft.plus(this.directionColumn.scale(this.pixelSpacingBetweenRows * this.frameSize.y));
    
    // PointBottomRight = PointBottomLeft + (PointTopRight - PointTopLeft)
    this.pointBottomRight = this.pointBottomLeft.plus(this.pointTopRight.minusPoint(this.pointTopLeft));
  }

  private initializeTransformationMatrices() {
    this.geometryType = FrameGeometryType.None;

    if (!isNearlyZero(this.pixelSpacingBetweenColumns) && !isNearlyZero(this.pixelSpacingBetweenRows)) {
      this.geometryType = FrameGeometryType.Plane;

      if (this.directionNormal.isZero) {
        this.imageToPatientSpace = Matrix.identity(4);
        this.imageToPatientSpace.set(0, 0, this.pixelSpacingBetweenColumns);
        this.imageToPatientSpace.set(1, 1, this.pixelSpacingBetweenRows);
      } else {
        this.imageToPatientSpace = Matrix.identity(4);
        
        // Column 0
        const col0 = this.directionRow.scale(this.pixelSpacingBetweenColumns);
        this.imageToPatientSpace.setColumn(0, [col0.x, col0.y, col0.z, 0]);
        
        // Column 1
        const col1 = this.directionColumn.scale(this.pixelSpacingBetweenRows);
        this.imageToPatientSpace.setColumn(1, [col1.x, col1.y, col1.z, 0]);
        
        // Column 2
        this.imageToPatientSpace.setColumn(2, [this.directionNormal.x, this.directionNormal.y, this.directionNormal.z, 0]);
        
        // Column 3
        this.imageToPatientSpace.setColumn(3, [this.pointTopLeft.x, this.pointTopLeft.y, this.pointTopLeft.z, 1]);
      }

      this.patientToImageSpace = this.imageToPatientSpace.invert();

      if (!this.pointTopLeft.equals(Point3D.ZERO) || 
          !this.directionRow.equals(Vector3D.AXIS_X) || 
          !this.directionColumn.equals(Vector3D.AXIS_Y)) {
        this.geometryType = FrameGeometryType.Volume;
      }
    }
  }

  transformImagePointToPatient(imagePoint: Point2): Point3D {
    if (this.geometryType === FrameGeometryType.None || !this.imageToPatientSpace) {
      throw new DicomImagingException("Cannot transform point in image without geometry data");
    }
    const transformed = this.imageToPatientSpace.multiplyVector([imagePoint.x, imagePoint.y, 0, 1]);
    return new Point3D(transformed[0], transformed[1], transformed[2]);
  }

  transformPatientPointToImage(patientPoint: Point3D): Point2D {
    if (this.geometryType === FrameGeometryType.None || !this.patientToImageSpace) {
      throw new DicomImagingException("Cannot transform point in image without geometry data");
    }
    const transformed = this.patientToImageSpace.multiplyVector([patientPoint.x, patientPoint.y, patientPoint.z, 1]);
    return new Point2D(transformed[0], transformed[1]);
  }
}

export class ImageLocalizer {
  static canDrawLocalizer(sourceFrame: FrameGeometry, destinationFrame: FrameGeometry): boolean {
    if (!sourceFrame || !destinationFrame) return false;
    if (sourceFrame.orientation === FrameOrientation.None || destinationFrame.orientation === FrameOrientation.None) return false;
    if (sourceFrame.orientation === destinationFrame.orientation) return false;
    if (!sourceFrame.frameOfReferenceUid || !destinationFrame.frameOfReferenceUid) return false;
    if (sourceFrame.frameOfReferenceUid !== destinationFrame.frameOfReferenceUid) return false;
    return true;
  }

  static calculateProjectionLocalizer(sourceFrame: DicomDataset, destinationFrame: DicomDataset): Point2[] {
    const localizerPoints: Point2[] = [];
    
    // Helper to extract geometry
    const getGeo = (ds: DicomDataset) => {
      const orient = ds.tryGetValues<number>(DicomTags.ImageOrientationPatient) || [1,0,0,0,1,0];
      const pos = ds.tryGetValues<number>(DicomTags.ImagePositionPatient) || [0,0,0];
      const spacing = ds.tryGetValues<number>(DicomTags.PixelSpacing) || [1,1];
      const rows = ds.getSingleValueOrDefault(DicomTags.Rows, 0);
      const cols = ds.getSingleValueOrDefault(DicomTags.Columns, 0);
      
      const rowDir = new Vector3D(orient[0], orient[1], orient[2]);
      const colDir = new Vector3D(orient[3], orient[4], orient[5]);
      const normalDir = rowDir.cross(colDir);
      const position = new Point3D(pos[0], pos[1], pos[2]);
      
      return { rowDir, colDir, normalDir, position, rows, cols, rowSpacing: spacing[0] ?? 1, colSpacing: spacing[1] ?? 1 };
    };

    const dst = getGeo(destinationFrame);
    const src = getGeo(sourceFrame);

    const srcRowLength = src.cols * src.rowSpacing;
    const srcColLength = src.rows * src.colSpacing;

    // Build 4 corners
    const pos: Point3D[] = [];
    // TLHC
    pos[0] = src.position;
    // TRHC
    pos[1] = src.position.plus(src.rowDir.scale(srcRowLength - 1));
    // BRHC
    pos[2] = src.position.plus(src.rowDir.scale(srcRowLength - 1)).plus(src.colDir.scale(srcColLength - 1));
    // BLHC
    pos[3] = src.position.plus(src.colDir.scale(srcColLength - 1));

    const rotation = new Matrix(3, 3);
    rotation.setRow(0, dst.rowDir.toArray());
    rotation.setRow(1, dst.colDir.toArray());
    rotation.setRow(2, dst.normalDir.toArray());

    for (let i = 0; i < 4; i++) {
      // move to origin of target
      const p = pos[i]!.minusPoint(dst.position);
      
      // rotate
      const rotated = rotation.multiplyVector(p.toArray());
      const rotatedPoint = new Point3D(rotated[0], rotated[1], rotated[2]);
      
      // project
      localizerPoints.push(new Point2(
        Math.floor(rotatedPoint.x / dst.colSpacing + 0.5),
        Math.floor(rotatedPoint.y / dst.rowSpacing + 0.5)
      ));
    }

    return localizerPoints;
  }

  static calculateIntersectionLocalizer(sourceFrame: FrameGeometry, destinationFrame: FrameGeometry): { startPoint: Point2, endPoint: Point2 } | null {
    if (destinationFrame.directionNormal.isZero) return null;

    const nP = destinationFrame.directionNormal.dot(destinationFrame.pointTopLeft.toVector());
    const nA = destinationFrame.directionNormal.dot(sourceFrame.pointTopLeft.toVector());
    const nB = destinationFrame.directionNormal.dot(sourceFrame.pointTopRight.toVector());
    const nC = destinationFrame.directionNormal.dot(sourceFrame.pointBottomRight.toVector());
    const nD = destinationFrame.directionNormal.dot(sourceFrame.pointBottomLeft.toVector());

    const lstProj: Point3D[] = [];
    const EPSILON = 1e-6;

    // segment AB
    if (Math.abs(nB - nA) > EPSILON) {
      const t = (nP - nA) / (nB - nA);
      if (t > 0 && t <= 1) {
        lstProj.push(sourceFrame.pointTopLeft.plus(sourceFrame.pointTopRight.minusPoint(sourceFrame.pointTopLeft).scale(t)));
      }
    }

    // segment BC
    if (Math.abs(nC - nB) > EPSILON) {
      const t = (nP - nB) / (nC - nB);
      if (t > 0 && t <= 1) {
        lstProj.push(sourceFrame.pointTopRight.plus(sourceFrame.pointBottomRight.minusPoint(sourceFrame.pointTopRight).scale(t)));
      }
    }

    // segment CD
    if (Math.abs(nD - nC) > EPSILON) {
      const t = (nP - nC) / (nD - nC);
      if (t > 0 && t <= 1) {
        lstProj.push(sourceFrame.pointBottomRight.plus(sourceFrame.pointBottomLeft.minusPoint(sourceFrame.pointBottomRight).scale(t)));
      }
    }

    // segment DA
    if (Math.abs(nA - nD) > EPSILON) {
      const t = (nP - nD) / (nA - nD);
      if (t > 0 && t <= 1) {
        lstProj.push(sourceFrame.pointBottomLeft.plus(sourceFrame.pointTopLeft.minusPoint(sourceFrame.pointBottomLeft).scale(t)));
      }
    }

    if (lstProj.length !== 2) return null;

    const startPoint = new Point2(
      Math.round(destinationFrame.transformPatientPointToImage(lstProj[0]!).x),
      Math.round(destinationFrame.transformPatientPointToImage(lstProj[0]!).y)
    );
    const endPoint = new Point2(
      Math.round(destinationFrame.transformPatientPointToImage(lstProj[1]!).x),
      Math.round(destinationFrame.transformPatientPointToImage(lstProj[1]!).y)
    );

    return { startPoint, endPoint };
  }
}
