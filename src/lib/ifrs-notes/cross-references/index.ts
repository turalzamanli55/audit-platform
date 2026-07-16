import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type {
  IfrsNoteCrossReference,
  IfrsNotePackage,
  IfrsNoteSection,
} from "@/types/ifrs-notes";

export type BuiltCrossReferenceSeed = {
  fromNoteCode: string;
  toNoteCode: string | null;
  statementLineCode: string | null;
  disclosureCode: string | null;
  sourceAccountCode: string | null;
  referenceLabel: string;
  metadataJson: Record<string, unknown>;
};

/**
 * Cross Reference Engine — FS line ↔ note ↔ disclosure ↔ related note ↔ account.
 */
export function buildCrossReferences(input: {
  package: IfrsNotePackage;
  sections: IfrsNoteSection[];
  dataset: FsNormalizedDataset | null;
}): BuiltCrossReferenceSeed[] {
  const refs: BuiltCrossReferenceSeed[] = [];
  const lines = (input.dataset?.sections ?? []).flatMap((section) => section.lines);

  for (const section of input.sections.filter((entry) => entry.isApplicable)) {
    const triggers = (section.metadataJson.triggerClassifications as string[] | undefined) ?? [];
    const matchedLines = lines.filter((line) =>
      triggers.length === 0 ? false : triggers.includes(line.classification),
    );
    for (const line of matchedLines.slice(0, 5)) {
      refs.push({
        fromNoteCode: section.noteCode,
        toNoteCode: null,
        statementLineCode: line.lineCode,
        disclosureCode: section.noteCode,
        sourceAccountCode: line.sourceAccountCodes[0] ?? null,
        referenceLabel: `${section.noteCode} <-> ${line.lineCode}`,
        metadataJson: {
          lineLabel: line.lineLabel,
          noteType: section.noteType,
        },
      });
    }

    if (
      section.noteType === "accounting_policies" ||
      section.noteType === "judgements" ||
      section.noteType === "estimates"
    ) {
      const related = input.sections.find(
        (entry) => entry.isApplicable && entry.noteType === "revenue",
      );
      if (related) {
        refs.push({
          fromNoteCode: section.noteCode,
          toNoteCode: related.noteCode,
          statementLineCode: null,
          disclosureCode: related.noteCode,
          sourceAccountCode: null,
          referenceLabel: `${section.noteCode} -> ${related.noteCode}`,
          metadataJson: { relatedNoteType: related.noteType },
        });
      }
    }
  }

  return refs;
}

export function materializeCrossReferences(input: {
  package: IfrsNotePackage;
  sections: IfrsNoteSection[];
  seeds: BuiltCrossReferenceSeed[];
  idFactory: () => string;
}): IfrsNoteCrossReference[] {
  const now = new Date().toISOString();
  const byCode = new Map(input.sections.map((section) => [section.noteCode, section]));
  return input.seeds.map((seed) => ({
    id: input.idFactory(),
    packageId: input.package.id,
    organizationId: input.package.organizationId,
    workspaceId: input.package.workspaceId,
    engagementId: input.package.engagementId,
    fromSectionId: byCode.get(seed.fromNoteCode)?.id ?? null,
    fromItemId: null,
    toSectionId: seed.toNoteCode ? (byCode.get(seed.toNoteCode)?.id ?? null) : null,
    statementLineCode: seed.statementLineCode,
    disclosureCode: seed.disclosureCode,
    sourceAccountCode: seed.sourceAccountCode,
    referenceLabel: seed.referenceLabel,
    metadataJson: seed.metadataJson,
    createdAt: now,
    updatedAt: now,
    version: 1,
  }));
}
