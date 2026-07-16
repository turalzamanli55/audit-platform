import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { IFRS_NOTES_PERMISSIONS } from "@/constants/ifrs-notes";
import { IfrsNotesRepository } from "@/repositories/ifrs-notes/ifrs-notes-repository";
import { FsMappingRepository } from "@/repositories/fs-mapping/fs-mapping-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";
import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type {
  IfrsNoteComment,
  IfrsNoteCrossReference,
  IfrsNoteHistoryRecord,
  IfrsNoteItem,
  IfrsNotePackage,
  IfrsNoteSection,
  IfrsNoteStructure,
  IfrsNoteValidationReport,
  IfrsNoteVersion,
  IfrsNotesDashboardMetrics,
} from "@/types/ifrs-notes";
import { ifrsNotesEngine } from "@/lib/ifrs-notes/engine";
import { buildNoteStructure } from "@/lib/ifrs-notes/sections";
import { searchIfrsNoteEntities } from "@/lib/ifrs-notes/resolver";

export type IfrsNotesWorkspaceLoadResult =
  | {
      ok: true;
      engagementSlug: string;
      engagementId: string;
      companyId: string;
      notePackage: IfrsNotePackage | null;
      sections: IfrsNoteSection[];
      items: IfrsNoteItem[];
      crossReferences: IfrsNoteCrossReference[];
      versions: IfrsNoteVersion[];
      comments: IfrsNoteComment[];
      history: IfrsNoteHistoryRecord[];
      dataset: FsNormalizedDataset | null;
      structure: IfrsNoteStructure | null;
      validation: IfrsNoteValidationReport | null;
      metrics: IfrsNotesDashboardMetrics | null;
    }
  | {
      ok: false;
      reason: "unauthenticated" | "not_found" | "forbidden" | "no_workspace" | "error";
    };

function repoContext(userId: string, organizationId: string, workspaceId: string): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId, isResolved: true },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

async function loadIfrsNotesWorkspace(
  engagementSlug: string,
): Promise<IfrsNotesWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };
    if (!user.permissionCodes.includes(IFRS_NOTES_PERMISSIONS.READ)) {
      return { ok: false, reason: "forbidden" };
    }
    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const ctx = repoContext(user.id, user.organizationId, workspace.workspaceId);
    const engagements = new EngagementRepository(supabase, ctx);
    const engagement = await engagements.findBySlug(workspace.workspaceId, engagementSlug);
    if (!engagement || engagement.workspace_id !== workspace.workspaceId) {
      return { ok: false, reason: "not_found" };
    }

    const notesRepo = new IfrsNotesRepository(supabase, ctx);
    const mappingRepo = new FsMappingRepository(supabase, ctx);
    const notePackage = await notesRepo.findPackageByEngagementId(engagement.id);
    const mappingSet = await mappingRepo.findSetByEngagementId(engagement.id);
    const dataset = (mappingSet?.datasetJson as FsNormalizedDataset | null) ?? null;

    const sections = notePackage ? await notesRepo.listSections(notePackage.id) : [];
    const items = notePackage ? await notesRepo.listItems(notePackage.id) : [];
    const crossReferences = notePackage
      ? await notesRepo.listCrossReferences(notePackage.id)
      : [];
    const versions = notePackage ? await notesRepo.listVersions(notePackage.id) : [];
    const comments = notePackage ? await notesRepo.listComments(notePackage.id) : [];
    const history = notePackage ? await notesRepo.listHistory(notePackage.id) : [];

    let structure: IfrsNoteStructure | null = null;
    let validation: IfrsNoteValidationReport | null = null;
    let metrics: IfrsNotesDashboardMetrics | null = null;

    if (notePackage) {
      const storedStructure = notePackage.structureJson as unknown as IfrsNoteStructure | null;
      if (storedStructure?.sections?.length) {
        structure = storedStructure;
      } else if (sections.length > 0) {
        structure = buildNoteStructure({ sections, items, crossReferences });
      } else {
        const run = ifrsNotesEngine.run({ package: notePackage, dataset });
        structure = run.structure;
        validation = run.validation;
        metrics = run.metrics;
      }

      validation =
        validation ??
        ((notePackage.validationJson as IfrsNoteValidationReport | null) ?? null);
      metrics =
        metrics ??
        ({
          requiredNotes: notePackage.requiredNoteCount,
          completedNotes: notePackage.completedNoteCount,
          missingNotes: notePackage.missingNoteCount,
          validationErrors: notePackage.validationErrorCount,
          warnings: notePackage.validationWarningCount,
          coveragePct: notePackage.coveragePct,
          packageStatus: notePackage.packageStatus,
          standard: notePackage.standard,
        } satisfies IfrsNotesDashboardMetrics);
    }

    return {
      ok: true,
      engagementSlug,
      engagementId: engagement.id,
      companyId: engagement.company_id,
      notePackage,
      sections,
      items,
      crossReferences,
      versions,
      comments,
      history,
      dataset,
      structure,
      validation,
      metrics,
    };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export const loadIfrsNotesWorkspaceCached = cache(loadIfrsNotesWorkspace);

export function searchIfrsNotesWorkspace(
  workspace: Extract<IfrsNotesWorkspaceLoadResult, { ok: true }>,
  query: string,
) {
  return searchIfrsNoteEntities({
    query,
    notePackage: workspace.notePackage,
    structure: workspace.structure,
    sections: workspace.sections,
    items: workspace.items,
    crossReferences: workspace.crossReferences,
  });
}
