/**
 * A single channel/component of a ColorSpace with chroma sub-sampling factors.
 * Corresponds to fo-dicom ColorSpace.Component nested class.
 */
export class ColorSpaceComponent {
  readonly name: string;
  readonly subSampleX: number;
  readonly subSampleY: number;

  constructor(name: string, subSampleX: number, subSampleY: number) {
    this.name = name;
    this.subSampleX = subSampleX;
    this.subSampleY = subSampleY;
  }
}

/**
 * Color space descriptor with named components and chroma sub-sampling ratios.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/ColorSpace.cs
 */
export class ColorSpace {
  readonly name: string;
  readonly components: readonly ColorSpaceComponent[];

  constructor(name: string, ...components: ColorSpaceComponent[]) {
    this.name = name;
    this.components = components;
  }

  equals(other: ColorSpace | null | undefined): boolean {
    return other?.name === this.name;
  }

  toString(): string {
    return this.name;
  }

  // ---------------------------------------------------------------------------
  // Standard color spaces (matching fo-dicom ColorSpace static instances)
  // ---------------------------------------------------------------------------

  static readonly OneBit = new ColorSpace(
    "1-bit",
    new ColorSpaceComponent("Value", 1, 1),
  );

  static readonly Grayscale = new ColorSpace(
    "Grayscale",
    new ColorSpaceComponent("Value", 1, 1),
  );

  static readonly Indexed = new ColorSpace(
    "Indexed",
    new ColorSpaceComponent("Value", 1, 1),
  );

  static readonly RGB = new ColorSpace(
    "RGB",
    new ColorSpaceComponent("Red", 1, 1),
    new ColorSpaceComponent("Green", 1, 1),
    new ColorSpaceComponent("Blue", 1, 1),
  );

  static readonly BGR = new ColorSpace(
    "BGR",
    new ColorSpaceComponent("Blue", 1, 1),
    new ColorSpaceComponent("Green", 1, 1),
    new ColorSpaceComponent("Red", 1, 1),
  );

  static readonly RGBA = new ColorSpace(
    "RGBA",
    new ColorSpaceComponent("Red", 1, 1),
    new ColorSpaceComponent("Green", 1, 1),
    new ColorSpaceComponent("Blue", 1, 1),
    new ColorSpaceComponent("Alpha", 1, 1),
  );

  static readonly YCbCrJPEG = new ColorSpace(
    "Y'CbCr 4:4:4 (JPEG)",
    new ColorSpaceComponent("Luminance", 1, 1),
    new ColorSpaceComponent("Blue Chroma", 1, 1),
    new ColorSpaceComponent("Red Chroma", 1, 1),
  );
}
