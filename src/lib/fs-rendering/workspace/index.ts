import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { FS_RENDERING_PERMISSIONS } from "@/constants/fs-rendering";
import { FsRenderingRepository } from "@/repositories/fs-rendering/fs-rendering-repository";
import { FsMappingRepository } from "@/repositories/fs-mapping/fs-mapping-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";
import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type {
  FsRenderDashboardMetrics,
  FsRenderHistoryEntry,
  FsRenderLayout,
  FsRenderPresentation,
  FsRenderValidationReport,
  FsRenderVersion,
  FsRenderedStatementBundle,
} from "@/types/fs-rendering";
import { fsRenderingEngine } from "@/lib/fs-rendering/engine";
import { searchRenderEntities } from "@/lib/fs-rendering/resolver";

export type FsRenderingWorkspaceLoadResult =
  | {
      ok: true;
      engagementSlug: string;
      engagementId: string;
      companyId: string;
      presentation: FsRenderPresentation | null;
      layouts: FsRenderLayout[];
      versions: FsRenderVersion[];
      history: FsRenderHistoryEntry[];
      dataset: FsNormalizedDataset | null;
      bundle: FsRenderedStatementBundle | null;
      validation: FsRenderValidationReport | null;
      metrics: FsRenderDashboardMetrics | null;
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

async function loadFsRenderingWorkspace(
  engagementSlug: string,
): Promise<FsRenderingWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };
    if (!user.permissionCodes.includes(FS_RENDERING_PERMISSIONS.READ)) {
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

    const renderRepo = new FsRenderingRepository(supabase, ctx);
    const mappingRepo = new FsMappingRepository(supabase, ctx);
    const presentation = await renderRepo.findPresentationByEngagementId(engagement.id);
    const layouts = await renderRepo.listLayouts(workspace.workspaceId);
    const versions = presentation ? await renderRepo.listVersions(presentation.id) : [];
    const mappingSet = await mappingRepo.findSetByEngagementId(engagement.id);
    const dataset = (mappingSet?.datasetJson as FsNormalizedDataset | null) ?? null;

    let bundle: FsRenderedStatementBundle | null = null;
    let validation: FsRenderValidationReport | null = null;
    let metrics: FsRenderDashboardMetrics | null = null;

    if (presentation) {
      const stored = presentation.renderJson as unknown as FsRenderedStatementBundle | null;
      if (stored?.statements) {
        bundle = stored;
        validation = (presentation.validationJson as FsRenderValidationReport | null) ?? null;
        metrics = {
          renderedStatements: presentation.renderedStatementCount,
          validationStatus:
            presentation.validationErrorCount > 0
              ? "errors"
              : presentation.validationWarningCount > 0
                ? "warnings"
                : dataset
                  ? "ok"
                  : "empty",
          presentationCoveragePct: presentation.presentationCoveragePct,
          renderingErrors: presentation.validationErrorCount,
          warnings: presentation.validationWarningCount,
          presentationStatus: presentation.presentationStatus,
          standard: presentation.standard,
          layoutMode: presentation.layoutMode,
        };
      } else {
        const run = fsRenderingEngine.run({ presentation, dataset });
        bundle = run.bundle;
        validation = run.validation;
        metrics = run.metrics;
      }
    }

    return {
      ok: true,
      engagementSlug,
      engagementId: engagement.id,
      companyId: engagement.company_id,
      presentation,
      layouts,
      versions,
      history: presentation?.historyJson ?? [],
      dataset,
      bundle,
      validation,
      metrics,
    };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export const loadFsRenderingWorkspaceCached = cache(loadFsRenderingWorkspace);

export function searchFsRenderingWorkspace(
  workspace: Extract<FsRenderingWorkspaceLoadResult, { ok: true }>,
  query: string,
) {
  return searchRenderEntities({
    query,
    presentation: workspace.presentation,
    layouts: workspace.layouts,
    bundle: workspace.bundle,
  });
}
