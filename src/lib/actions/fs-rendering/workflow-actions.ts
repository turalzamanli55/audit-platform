"use server";

import { FS_RENDERING_PERMISSIONS } from "@/constants/fs-rendering";
import { createFsRenderingAction } from "@/lib/actions/fs-rendering/fs-rendering-action";
import { createServerClient } from "@/lib/supabase/server";
import { FsRenderingRepository } from "@/repositories/fs-rendering/fs-rendering-repository";
import { FsMappingRepository } from "@/repositories/fs-mapping/fs-mapping-repository";
import type { RepositoryContext } from "@/types/context";
import { fsRenderingEngine, nextRenderWorkflowStatus } from "@/lib/fs-rendering/engine";
import { appendHistory, buildRenderHistoryEntry } from "@/lib/fs-rendering/history";
import {
  createRenderVersionDraft,
  publishRenderVersion,
  rollbackRenderVersion,
} from "@/lib/fs-rendering/versions";
import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type { FsRenderLayoutMode } from "@/types/fs-rendering";
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

async function loadContext(presentationId: string, context: {
  userId: string;
  organizationId: string;
  workspaceId: string;
}) {
  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const repo = new FsRenderingRepository(supabase, ctx);
  const presentation = await repo.requirePresentation(presentationId);
  const mappingRepo = new FsMappingRepository(supabase, ctx);
  const mappingSet = await mappingRepo.findSetByEngagementId(presentation.engagementId);
  const dataset = (mappingSet?.datasetJson as FsNormalizedDataset | null) ?? null;
  return { repo, presentation, dataset };
}

export const rebuildFsPresentationAction = createFsRenderingAction<
  { presentationId: string; layoutMode?: FsRenderLayoutMode },
  { renderedStatements: number; coveragePct: number }
>({ module: "fs_rendering.update" }, FS_RENDERING_PERMISSIONS.UPDATE, async (input, context) => {
  const { repo, presentation, dataset } = await loadContext(input.presentationId, context);
  const nextPresentation = {
    ...presentation,
    layoutMode: input.layoutMode ?? presentation.layoutMode,
  };
  const run = fsRenderingEngine.run({ presentation: nextPresentation, dataset });
  const history = appendHistory(
    presentation.historyJson,
    buildRenderHistoryEntry({
      action: "rendered",
      actorUserId: context.userId,
      summary: "Rebuilt financial statement presentation render",
    }),
  );
  await repo.updatePresentation(presentation.id, {
    layout_mode: nextPresentation.layoutMode,
    render_json: run.bundle,
    validation_json: run.validation,
    summary_json: run.metrics,
    rendered_statement_count: run.validation.renderedStatementCount,
    validation_error_count: run.validation.errors.length,
    validation_warning_count: run.validation.warnings.length,
    presentation_coverage_pct: run.validation.presentationCoveragePct,
    history_json: history,
  });
  return {
    renderedStatements: run.validation.renderedStatementCount,
    coveragePct: run.validation.presentationCoveragePct,
  };
});

export const validateFsPresentationAction = createFsRenderingAction<
  { presentationId: string },
  { ok: boolean; errorCount: number; warningCount: number }
>({ module: "fs_rendering.validate" }, FS_RENDERING_PERMISSIONS.VALIDATE, async (input, context) => {
  const { repo, presentation, dataset } = await loadContext(input.presentationId, context);
  const next = nextRenderWorkflowStatus(presentation.presentationStatus, "validate");
  if (!next) throw new ValidationError("Presentation cannot be validated from current status");
  const run = fsRenderingEngine.run({ presentation, dataset });
  const history = appendHistory(
    presentation.historyJson,
    buildRenderHistoryEntry({
      action: "validated",
      actorUserId: context.userId,
      summary: run.validation.ok ? "Presentation validated" : "Presentation validated with errors",
      detailsJson: { ok: run.validation.ok },
    }),
  );
  await repo.updatePresentation(presentation.id, {
    presentation_status: next,
    validated_at: new Date().toISOString(),
    validated_by: context.userId,
    render_json: run.bundle,
    validation_json: run.validation,
    summary_json: run.metrics,
    rendered_statement_count: run.validation.renderedStatementCount,
    validation_error_count: run.validation.errors.length,
    validation_warning_count: run.validation.warnings.length,
    presentation_coverage_pct: run.validation.presentationCoveragePct,
    history_json: history,
  });
  return {
    ok: run.validation.ok,
    errorCount: run.validation.errors.length,
    warningCount: run.validation.warnings.length,
  };
});

export const approveFsPresentationAction = createFsRenderingAction<
  { presentationId: string },
  { presentationId: string }
>({ module: "fs_rendering.approve" }, FS_RENDERING_PERMISSIONS.APPROVE, async (input, context) => {
  const { repo, presentation } = await loadContext(input.presentationId, context);
  const next = nextRenderWorkflowStatus(presentation.presentationStatus, "approve");
  if (!next) throw new ValidationError("Presentation must be validated before approval");
  const history = appendHistory(
    presentation.historyJson,
    buildRenderHistoryEntry({
      action: "approved",
      actorUserId: context.userId,
      summary: "Presentation approved",
    }),
  );
  await repo.updatePresentation(presentation.id, {
    presentation_status: next,
    approved_at: new Date().toISOString(),
    approved_by: context.userId,
    history_json: history,
  });
  return { presentationId: presentation.id };
});

export const publishFsPresentationAction = createFsRenderingAction<
  { presentationId: string; changeSummary?: string },
  { versionNumber: number }
>({ module: "fs_rendering.publish" }, FS_RENDERING_PERMISSIONS.PUBLISH, async (input, context) => {
  const { repo, presentation, dataset } = await loadContext(input.presentationId, context);
  const next = nextRenderWorkflowStatus(presentation.presentationStatus, "publish");
  if (!next) throw new ValidationError("Presentation must be approved before publish");
  const run = fsRenderingEngine.run({ presentation, dataset });
  const versions = await repo.listVersions(presentation.id);
  const versionNumber = (versions[0]?.versionNumber ?? 0) + 1;
  let draft = createRenderVersionDraft({
    presentation,
    versionNumber,
    snapshot: { presentation, bundle: run.bundle, validation: run.validation },
    changeSummary: input.changeSummary ?? "Published presentation version",
    createdBy: context.userId,
  });
  draft = publishRenderVersion({ ...draft, id: "pending" }, context.userId);
  await repo.insertVersion(draft);
  const history = appendHistory(
    presentation.historyJson,
    buildRenderHistoryEntry({
      action: "published",
      actorUserId: context.userId,
      summary: `Published render version ${versionNumber}`,
    }),
  );
  await repo.updatePresentation(presentation.id, {
    presentation_status: next,
    published_at: new Date().toISOString(),
    published_by: context.userId,
    presentation_version: versionNumber,
    version_count: presentation.versionCount + 1,
    render_json: run.bundle,
    validation_json: run.validation,
    summary_json: run.metrics,
    history_json: history,
  });
  return { versionNumber };
});

export const archiveFsPresentationAction = createFsRenderingAction<
  { presentationId: string },
  { presentationId: string }
>({ module: "fs_rendering.archive" }, FS_RENDERING_PERMISSIONS.ARCHIVE, async (input, context) => {
  const { repo, presentation } = await loadContext(input.presentationId, context);
  const history = appendHistory(
    presentation.historyJson,
    buildRenderHistoryEntry({
      action: "archived",
      actorUserId: context.userId,
      summary: "Presentation archived",
    }),
  );
  await repo.updatePresentation(presentation.id, {
    presentation_status: "archived",
    archived_at: new Date().toISOString(),
    archived_by: context.userId,
    history_json: history,
  });
  return { presentationId: presentation.id };
});

export const rollbackFsPresentationVersionAction = createFsRenderingAction<
  { presentationId: string; versionNumber: number },
  { versionNumber: number }
>({ module: "fs_rendering.update" }, FS_RENDERING_PERMISSIONS.UPDATE, async (input, context) => {
  const { repo, presentation } = await loadContext(input.presentationId, context);
  const versions = await repo.listVersions(presentation.id);
  const target = versions.find((version) => version.versionNumber === input.versionNumber);
  if (!target) throw new ValidationError("Version not found");
  const nextVersionNumber = (versions[0]?.versionNumber ?? 0) + 1;
  const rolled = rollbackRenderVersion({
    presentation,
    fromVersion: target,
    nextVersionNumber,
    actorUserId: context.userId,
  });
  await repo.insertVersion(rolled);
  const snapshot = target.snapshotJson as {
    bundle?: unknown;
    validation?: unknown;
  };
  const history = appendHistory(
    presentation.historyJson,
    buildRenderHistoryEntry({
      action: "rolled_back",
      actorUserId: context.userId,
      summary: `Rolled back to version ${input.versionNumber}`,
    }),
  );
  await repo.updatePresentation(presentation.id, {
    presentation_status: "draft",
    presentation_version: nextVersionNumber,
    version_count: presentation.versionCount + 1,
    render_json: snapshot.bundle ?? presentation.renderJson,
    validation_json: snapshot.validation ?? presentation.validationJson,
    history_json: history,
  });
  return { versionNumber: nextVersionNumber };
});
