import { resolveApplicableDisclosures } from "@/lib/ifrs-notes/disclosures";
import { buildNoteDrafts } from "@/lib/ifrs-notes/notes";
import { buildNoteStructure, materializeDraftSections } from "@/lib/ifrs-notes/sections";
import {
  buildCrossReferences,
  materializeCrossReferences,
} from "@/lib/ifrs-notes/cross-references";
import { validateIfrsNotes } from "@/lib/ifrs-notes/validation";
import type {
  IfrsNotePackageStatus,
  IfrsNotesEngineInput,
  IfrsNotesEngineResult,
} from "@/types/ifrs-notes";

let tempIdCounter = 0;

function defaultIdFactory(): string {
  tempIdCounter += 1;
  return `ifrs-note-tmp-${tempIdCounter}`;
}

/**
 * Enterprise IFRS Notes Engine
 * Normalized Dataset → Disclosure Resolver → Requirement Resolver →
 * Note Structure → Sections → Cross References → Validation → Workspace model
 *
 * Does not generate PDFs, Word, XBRL, AI explanations, or audit opinions.
 */
export class IfrsNotesEngine {
  run(input: IfrsNotesEngineInput): IfrsNotesEngineResult {
    const idFactory = input.idFactory ?? defaultIdFactory;
    const requirements = resolveApplicableDisclosures({
      standard: input.package.standard,
      dataset: input.dataset,
    });

    const drafts = buildNoteDrafts({
      package: input.package,
      requirements,
    });

    const { sections, items } = materializeDraftSections(drafts, idFactory);
    const seeds = buildCrossReferences({
      package: input.package,
      sections,
      dataset: input.dataset,
    });
    const crossReferences = materializeCrossReferences({
      package: input.package,
      sections,
      seeds,
      idFactory,
    });

    const structure = buildNoteStructure({
      sections,
      items,
      crossReferences,
    });

    const validation = validateIfrsNotes({
      package: input.package,
      sections,
      items,
      crossReferences,
    });

    const metrics = {
      requiredNotes: validation.requiredCount,
      completedNotes: validation.completedCount,
      missingNotes: validation.missingCount,
      validationErrors: validation.errors.length,
      warnings: validation.warnings.length,
      coveragePct: validation.coveragePct,
      packageStatus: input.package.packageStatus,
      standard: input.package.standard,
    };

    return {
      requirements,
      sectionDrafts: drafts.map((draft) => draft.section),
      itemDrafts: drafts.flatMap((draft) =>
        draft.items.map((item) => ({ ...item, noteCode: draft.section.noteCode })),
      ),
      crossReferenceDrafts: crossReferences.map(
        ({ id: _id, createdAt: _c, updatedAt: _u, version: _v, ...draft }) => draft,
      ),
      sections,
      items,
      crossReferences,
      structure,
      validation,
      metrics,
    };
  }
}

export function nextIfrsNoteWorkflowStatus(
  current: IfrsNotePackageStatus,
  action:
    | "validate"
    | "submit_review"
    | "manager_review"
    | "partner_review"
    | "approve"
    | "publish"
    | "archive"
    | "reopen",
): IfrsNotePackageStatus | null {
  switch (action) {
    case "validate":
      return current === "draft" || current === "validated" ? "validated" : null;
    case "submit_review":
      return current === "validated" ? "in_review" : null;
    case "manager_review":
      return current === "in_review" ? "manager_review" : null;
    case "partner_review":
      return current === "manager_review" ? "partner_review" : null;
    case "approve":
      return current === "partner_review" || current === "validated" ? "approved" : null;
    case "publish":
      return current === "approved" ? "published" : null;
    case "archive":
      return current !== "archived" ? "archived" : null;
    case "reopen":
      return current === "validated" ||
        current === "in_review" ||
        current === "manager_review" ||
        current === "partner_review" ||
        current === "approved"
        ? "draft"
        : null;
    default:
      return null;
  }
}

export const ifrsNotesEngine = new IfrsNotesEngine();
