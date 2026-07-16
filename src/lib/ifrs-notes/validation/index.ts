import type {
  IfrsNoteCrossReference,
  IfrsNoteItem,
  IfrsNotePackage,
  IfrsNoteSection,
  IfrsNoteValidationReport,
} from "@/types/ifrs-notes";

/**
 * Validation Engine — missing/duplicate notes, broken refs, IFRS mapping gaps.
 */
export function validateIfrsNotes(input: {
  package: IfrsNotePackage;
  sections: IfrsNoteSection[];
  items: IfrsNoteItem[];
  crossReferences: Array<
    Pick<
      IfrsNoteCrossReference,
      | "fromSectionId"
      | "toSectionId"
      | "statementLineCode"
      | "disclosureCode"
      | "referenceLabel"
    >
  >;
}): IfrsNoteValidationReport {
  const errors = [];
  const warnings = [];

  const applicable = input.sections.filter((section) => section.isApplicable);
  const required = applicable.filter((section) => section.isRequired);
  const completed = required.filter((section) => section.isCompleted);
  const missing = required.filter((section) => !section.isCompleted);

  for (const section of missing) {
    warnings.push({
      code: "missing_notes",
      severity: "warning" as const,
      message: `Required note ${section.noteCode} (${section.title}) is incomplete.`,
      entityType: "section" as const,
      entityId: section.id,
      noteCode: section.noteCode,
    });
  }

  const codes = new Map<string, number>();
  for (const section of input.sections) {
    codes.set(section.noteCode, (codes.get(section.noteCode) ?? 0) + 1);
    if (!section.standardRef?.trim()) {
      errors.push({
        code: "invalid_ifrs_mapping",
        severity: "error" as const,
        message: `Note ${section.noteCode} is missing IFRS/IAS standard mapping.`,
        entityType: "section" as const,
        entityId: section.id,
        noteCode: section.noteCode,
      });
    }
    const sectionItems = input.items.filter((item) => item.sectionId === section.id);
    if (section.isApplicable && sectionItems.length === 0) {
      errors.push({
        code: "missing_sections",
        severity: "error" as const,
        message: `Note ${section.noteCode} has no content items.`,
        entityType: "section" as const,
        entityId: section.id,
        noteCode: section.noteCode,
      });
    }
    if (
      section.isApplicable &&
      section.isRequired &&
      !sectionItems.some((item) => item.itemKind === "paragraph" && item.bodyText.trim())
    ) {
      warnings.push({
        code: "missing_disclosures",
        severity: "warning" as const,
        message: `Note ${section.noteCode} is missing narrative disclosure content.`,
        entityType: "section" as const,
        entityId: section.id,
        noteCode: section.noteCode,
      });
    }
  }

  for (const [code, count] of codes) {
    if (count > 1) {
      errors.push({
        code: "duplicate_notes",
        severity: "error" as const,
        message: `Duplicate note code ${code}.`,
        entityType: "section" as const,
        noteCode: code,
      });
    }
  }

  const sectionIds = new Set(input.sections.map((section) => section.id));
  const sectionCodes = new Set(input.sections.map((section) => section.noteCode));
  for (const reference of input.crossReferences) {
    if (reference.fromSectionId && !sectionIds.has(reference.fromSectionId)) {
      errors.push({
        code: "broken_references",
        severity: "error" as const,
        message: `Broken cross reference from missing section for ${reference.referenceLabel}.`,
        entityType: "cross_reference" as const,
      });
    }
    if (reference.toSectionId && !sectionIds.has(reference.toSectionId)) {
      errors.push({
        code: "broken_references",
        severity: "error" as const,
        message: `Broken cross reference to missing section for ${reference.referenceLabel}.`,
        entityType: "cross_reference" as const,
      });
    }
    if (reference.disclosureCode && !sectionCodes.has(reference.disclosureCode)) {
      warnings.push({
        code: "broken_references",
        severity: "warning" as const,
        message: `Cross reference disclosure ${reference.disclosureCode} is not present.`,
        entityType: "cross_reference" as const,
      });
    }
  }

  for (const section of input.sections.filter((entry) => !entry.isApplicable && !entry.isRequired)) {
    warnings.push({
      code: "unused_notes",
      severity: "warning" as const,
      message: `Note ${section.noteCode} is unused/not applicable for current dataset.`,
      entityType: "section" as const,
      entityId: section.id,
      noteCode: section.noteCode,
    });
  }

  if (input.sections.length === 0) {
    errors.push({
      code: "missing_notes",
      severity: "error" as const,
      message: "IFRS note package has no sections.",
      entityType: "package" as const,
      entityId: input.package.id,
    });
  }

  const coveragePct =
    required.length === 0
      ? 100
      : Number(((completed.length / required.length) * 100).toFixed(2));

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    requiredCount: required.length,
    completedCount: completed.length,
    missingCount: missing.length,
    coveragePct,
  };
}
