import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { FS_MAPPING_PERMISSIONS } from "@/constants/fs-mapping";
import { FsMappingRepository } from "@/repositories/fs-mapping/fs-mapping-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";
import type {
  FsMappingDashboardMetrics,
  FsMappingHistoryRecord,
  FsMappingLine,
  FsMappingRule,
  FsMappingSet,
  FsMappingVersion,
  FsNormalizedDataset,
  FsValidationReport,
} from "@/types/fs-mapping";
import { buildMappingHierarchy, buildStatementTree } from "@/lib/fs-mapping/hierarchy";
import { searchMappingEntities } from "@/lib/fs-mapping/resolver";

export type FsMappingWorkspaceLoadResult =
  | {
      ok: true;
      engagementSlug: string;
      engagementId: string;
      companyId: string;
      mappingSet: FsMappingSet | null;
      rules: FsMappingRule[];
      lines: FsMappingLine[];
      versions: FsMappingVersion[];
      history: FsMappingHistoryRecord[];
      metrics: FsMappingDashboardMetrics | null;
      validation: FsValidationReport | null;
      dataset: FsNormalizedDataset | null;
      hierarchy: ReturnType<typeof buildMappingHierarchy>;
      statementTree: ReturnType<typeof buildStatementTree>;
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

async function loadFsMappingWorkspace(engagementSlug: string): Promise<FsMappingWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };
    if (!user.permissionCodes.includes(FS_MAPPING_PERMISSIONS.READ)) {
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

    const repo = new FsMappingRepository(supabase, ctx);
    const mappingSet = await repo.findSetByEngagementId(engagement.id);
    const rules = mappingSet ? await repo.listRules(mappingSet.id) : [];
    const lines = mappingSet ? await repo.listLines(mappingSet.id) : [];
    const versions = mappingSet ? await repo.listVersions(mappingSet.id) : [];
    const history = mappingSet ? await repo.listHistory(mappingSet.id) : [];
    const validation = (mappingSet?.validationJson as FsValidationReport | null) ?? null;
    const dataset = (mappingSet?.datasetJson as FsNormalizedDataset | null) ?? null;
    const metrics = mappingSet
      ? ({
          coveragePct: mappingSet.coveragePct,
          mappedAccounts: mappingSet.mappedAccountCount,
          unmappedAccounts: mappingSet.unmappedAccountCount,
          validationErrors: mappingSet.validationErrorCount,
          validationWarnings: mappingSet.validationWarningCount,
          versionCount: mappingSet.versionCount,
          setStatus: mappingSet.setStatus,
          standard: mappingSet.standard,
        } satisfies FsMappingDashboardMetrics)
      : null;

    return {
      ok: true,
      engagementSlug,
      engagementId: engagement.id,
      companyId: engagement.company_id,
      mappingSet,
      rules,
      lines,
      versions,
      history,
      metrics,
      validation,
      dataset,
      hierarchy: buildMappingHierarchy(lines),
      statementTree: buildStatementTree(dataset?.sections.flatMap((section) => section.lines) ?? []),
    };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export const loadFsMappingWorkspaceCached = cache(loadFsMappingWorkspace);

export function searchFsMappingWorkspace(
  workspace: Extract<FsMappingWorkspaceLoadResult, { ok: true }>,
  query: string,
) {
  return searchMappingEntities({
    query,
    set: workspace.mappingSet,
    rules: workspace.rules,
    lines: workspace.lines,
  });
}
