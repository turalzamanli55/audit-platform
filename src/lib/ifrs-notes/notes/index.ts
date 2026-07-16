import type {
  IfrsDisclosureRequirement,
  IfrsNoteItem,
  IfrsNotePackage,
  IfrsNoteSection,
} from "@/types/ifrs-notes";
import { noteTypeLabel } from "@/lib/ifrs-notes/requirements";

export type BuiltNoteDraft = {
  section: Omit<IfrsNoteSection, "id" | "createdAt" | "updatedAt" | "version">;
  items: Array<Omit<IfrsNoteItem, "id" | "createdAt" | "updatedAt" | "version" | "sectionId">>;
};

/**
 * Note Structure Builder — sections + default editable paragraphs/tables.
 */
export function buildNoteDrafts(input: {
  package: IfrsNotePackage;
  requirements: IfrsDisclosureRequirement[];
}): BuiltNoteDraft[] {
  return input.requirements.map((requirement, index) => {
    const section: BuiltNoteDraft["section"] = {
      packageId: input.package.id,
      organizationId: input.package.organizationId,
      workspaceId: input.package.workspaceId,
      engagementId: input.package.engagementId,
      noteType: requirement.noteType,
      noteCode: requirement.noteCode,
      title: requirement.title,
      standardRef: requirement.standardRef,
      disclosureKind: requirement.disclosureKind,
      sortOrder: (index + 1) * 10,
      isRequired: requirement.isRequired,
      isCompleted: false,
      isApplicable:
        requirement.disclosureKind === "mandatory" || requirement.isRequired,
      parentSectionId: null,
      metadataJson: {
        standard: requirement.standard,
        triggerClassifications: requirement.triggerClassifications,
      },
    };

    const items: BuiltNoteDraft["items"] = [
      {
        packageId: input.package.id,
        organizationId: input.package.organizationId,
        workspaceId: input.package.workspaceId,
        engagementId: input.package.engagementId,
        itemKind: "paragraph",
        itemCode: `${requirement.noteCode}-P1`,
        title: "Disclosure narrative",
        bodyText: buildSeedNarrative(requirement),
        tableJson: [],
        listJson: [],
        sortOrder: 10,
        isEditable: true,
        metadataJson: {},
      },
      {
        packageId: input.package.id,
        organizationId: input.package.organizationId,
        workspaceId: input.package.workspaceId,
        engagementId: input.package.engagementId,
        itemKind: "table",
        itemCode: `${requirement.noteCode}-T1`,
        title: `${noteTypeLabel(requirement.noteType)} schedule`,
        bodyText: "",
        tableJson: [
          { label: "Opening", amount: null },
          { label: "Movements", amount: null },
          { label: "Closing", amount: null },
        ],
        listJson: [],
        sortOrder: 20,
        isEditable: true,
        metadataJson: {},
      },
    ];

    return { section, items };
  });
}

function buildSeedNarrative(requirement: IfrsDisclosureRequirement): string {
  return (
    `${requirement.title} (${requirement.standardRef}). ` +
    `This disclosure is ${requirement.disclosureKind}. ` +
    `Edit this structured note content in the IFRS Notes workspace. ` +
    `No PDF/Word/AI generation is performed by this engine.`
  );
}
