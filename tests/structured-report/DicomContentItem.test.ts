import { describe, expect, it } from "vitest";
import { DicomUID } from "../../src/core/DicomUID.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import {
  DicomCodeItem,
  DicomContentItem,
  DicomMeasuredValue,
  DicomReferencedSOP,
  DicomRelationship,
  DicomValueType,
} from "../../src/structured-report/index.js";

describe("StructuredReport DicomContentItem", () => {
  it("returns no children when content sequence is absent", () => {
    const item = new DicomContentItem(
      new DicomCodeItem("113820", "DCM", "CT Acquisition Type"),
      DicomRelationship.Contains,
      new DicomCodeItem("113805", "DCM", "Constant Angle Acquisition"),
    );

    expect([...item.children()]).toEqual([]);
  });

  it("adds and reads child nodes with CODE value type", () => {
    const parent = new DicomContentItem(
      new DicomCodeItem("113820", "DCM", "CT Acquisition Type"),
      DicomRelationship.Contains,
      new DicomCodeItem("113805", "DCM", "Constant Angle Acquisition"),
    );

    parent.add(
      new DicomCodeItem("113961", "DCM", "Reconstruction Algorithm"),
      DicomRelationship.Contains,
      new DicomCodeItem("113962", "DCM", "Filtered Back Projection"),
    );

    const children = [...parent.children()];
    expect(children).toHaveLength(1);
    expect(children[0]?.code?.equals(new DicomCodeItem("113961", "DCM", "ignored"))).toBe(true);
    expect((children[0]?.get<DicomCodeItem>() ?? null)?.equals(new DicomCodeItem("113962", "DCM", "ignored"))).toBe(true);
  });

  it("supports numeric, UID and referenced SOP payloads", () => {
    const units = new DicomCodeItem("mm", "UCUM", "millimeter");
    const numeric = new DicomMeasuredValue(12.5, units);
    const numericItem = new DicomContentItem(
      new DicomCodeItem("121206", "DCM", "Distance"),
      DicomRelationship.Contains,
      numeric,
    );
    expect(numericItem.get<DicomMeasuredValue>()?.value).toBe(12.5);

    const uid = DicomUID.parse("1.2.840.10008.5.1.4.1.1.88.11");
    const uidItem = new DicomContentItem(
      new DicomCodeItem("112039", "DCM", "Referenced SOP Class UID"),
      DicomRelationship.Contains,
      uid,
    );
    expect(uidItem.get<DicomUID>()?.uid).toBe(uid.uid);

    const referenced = new DicomReferencedSOP(
      DicomUID.parse("1.2.826.0.1.3680043.2.1125.900.1"),
      DicomUID.parse("1.2.840.10008.5.1.4.1.1.2"),
    );
    const imageItem = new DicomContentItem(
      new DicomCodeItem("111030", "DCM", "Image Library"),
      DicomRelationship.Contains,
      DicomValueType.Image,
      referenced,
    );
    expect(imageItem.get<DicomReferencedSOP>()?.instance?.uid).toBe("1.2.826.0.1.3680043.2.1125.900.1");
  });

  it("can create wrappers from sequence payloads", () => {
    const code = new DicomCodeItem("113820", "DCM", "CT Acquisition Type");
    const codeFromSeq = new DicomCodeItem(new DicomSequence(DicomTags.ConceptCodeSequence, code));
    expect(codeFromSeq.equals(code)).toBe(true);

    const measured = new DicomMeasuredValue(1.23, new DicomCodeItem("mm", "UCUM", "millimeter"));
    const measuredFromSeq = new DicomMeasuredValue(new DicomSequence(DicomTags.MeasuredValueSequence, measured));
    expect(measuredFromSeq.value).toBe(1.23);

    const sop = new DicomReferencedSOP(
      DicomUID.parse("1.2.826.0.1.3680043.2.1125.910.1"),
      DicomUID.parse("1.2.840.10008.5.1.4.1.1.2"),
    );
    const sopFromSeq = new DicomReferencedSOP(new DicomSequence(DicomTags.ReferencedSOPSequence, sop));
    expect(sopFromSeq.sopClass?.uid).toBe("1.2.840.10008.5.1.4.1.1.2");
  });
});
