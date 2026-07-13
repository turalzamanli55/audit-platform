"use server";

import { headers } from "next/headers";
import {
  FS_RENDERING_AUDIT_RESOURCE_TYPE,
  FS_RENDERING_PERMISSIONS,
} from "@/constants/fs-rendering";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFsRenderingAction } from "@/lib/actions/fs-rendering/fs-rendering-action";
import { createServerClient } from "@/lib/supabase/server";
import { FsRenderingRepository } from "@/repositories/fs-rendering/fs-rendering-repository";
import { FsMappingRepository } from "@/repositories/fs-mapping/fs-mapping-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";
import { fsRenderingEngine } from "@/lib/fs-rendering/engine";
import { buildSystemLayouts } from "@/lib/fs-rendering/layouts";
import { appendHistory, buildRenderHistoryEntry } from "@/lib/fs-rendering/history";
import { mapMappingStandardToRenderStandard } from "@/lib/fs-rendering/standards";
import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type { FsRenderStandard } from "@/types/fs-rendering";
import { ValidationError } from "@/lib/errors";

function repoContext(
  userId: string,
  organizationId: string,
  workspaceId: string,
): RepositoryContext {
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

export type CreateFsPresentationInput = {
  engagementId: string;
  name: string;
  description?: string | null;
  standard?: FsRenderStandard;
};

export const createFsPresentationAction = createFsRenderingAction<
  CreateFsPresentationInput,
  { presentationId: string }
>({ module: "fs_rendering.create" }, FS_RENDERING_PERMISSIONS.CREATE, async (input, context) => {
  if (!input.name.trim()) throw new ValidationError("Presentation name is required");

  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const engagements = new EngagementRepository(supabase, ctx);
  const engagement = await engagements.findById(input.engagementId);
  if (!engagement) throw new ValidationError("Engagement not found");
  if (engagement.workspace_id !== context.workspaceId) {
    throw new ValidationError("Engagement workspace mismatch");
  }

  const repo = new FsRenderingRepository(supabase, ctx);
  const prior = await repo.findPresentationByEngagementId(input.engagementId);
  if (prior) throw new ValidationError("A presentation already exists for this engagement");

  const mappingRepo = new FsMappingRepository(supabase, ctx);
  const mappingSet = await mappingRepo.findSetByEngagementId(input.engagementId);
  const standard =
    input.standard ??
    (mappingSet ? mapMappingStandardToRenderStandard(mappingSet.standard) : "ifrs");

  let layouts = await repo.listLayouts(context.workspaceId);
  if (layouts.length === 0) {
    for (const blueprint of buildSystemLayouts(standard)) {
      await repo.createLayout({
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        companyId: engagement.company_id,
        engagementId: engagement.id,
        layoutCode: blueprint.layoutCode,
        layoutName: blueprint.layoutName,
        layoutMode: blueprint.layoutMode,
        standard: blueprint.standard,
        isSystem: true,
        formattingJson: blueprint.formatting,
      });
    }
    layouts = await repo.listLayouts(context.workspaceId);
  }

  const preferredLayout =
    layouts.find((layout) => layout.layoutMode === "expanded") ?? layouts[0] ?? null;

  const created = await repo.createPresentation({
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: engagement.company_id,
    engagementId: input.engagementId,
    mappingSetId: mappingSet?.id ?? null,
    layoutId: preferredLayout?.id ?? null,
    name: input.name.trim(),
    description: input.description ?? null,
    standard,
    layoutMode: preferredLayout?.layoutMode ?? "expanded",
  });

  const dataset = (mappingSet?.datasetJson as FsNormalizedDataset | null) ?? null;
  const run = fsRenderingEngine.run({ presentation: created, dataset });
  const history = appendHistory(
    [],
    buildRenderHistoryEntry({
      action: "created",
      actorUserId: context.userId,
      summary: `Created presentation "${created.name}"`,
    }),
  );

  await repo.updatePresentation(created.id, {
    render_json: run.bundle,
    validation_json: run.validation,
    summary_json: run.metrics,
    rendered_statement_count: run.validation.renderedStatementCount,
    validation_error_count: run.validation.errors.length,
    validation_warning_count: run.validation.warnings.length,
    presentation_coverage_pct: run.validation.presentationCoveragePct,
    history_json: history,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FS_RENDERING_CREATED,
    resourceType: FS_RENDERING_AUDIT_RESOURCE_TYPE,
    resourceId: created.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
  });

  return { presentationId: created.id };
});
