"use server";

import { FS_MAPPING_PERMISSIONS } from "@/constants/fs-mapping";
import { createFsMappingAction } from "@/lib/actions/fs-mapping/fs-mapping-action";
import { createServerClient } from "@/lib/supabase/server";
import { FsMappingRepository } from "@/repositories/fs-mapping/fs-mapping-repository";
import { TrialBalanceRepository } from "@/repositories/trial-balance/trial-balance-repository";
import type { RepositoryContext } from "@/types/context";
import { fsMappingEngine, nextWorkflowStatus } from "@/lib/fs-mapping/engine";
import { buildHistoryRecord } from "@/lib/fs-mapping/history";
import { createVersionDraft, publishVersion, rollbackVersion } from "@/lib/fs-mapping/versions";
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

async function loadEngineContext(mappingSetId: string, context: {
  userId: string;
  organizationId: string;
  workspaceId: string;
}) {
  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const repo = new FsMappingRepository(supabase, ctx);
  const mappingSet = await repo.requireSet(mappingSetId);
  const rules = await repo.listRules(mappingSetId);
  const tb = new TrialBalanceRepository(supabase, ctx);
  const tbPackage = mappingSet.trialBalancePackageId
    ? await tb.findById(mappingSet.trialBalancePackageId)
    : await tb.findByEngagementId(mappingSet.engagementId);
  const tbLines = tbPackage ? await tb.listLines(tbPackage.id) : [];
  return { repo, mappingSet, rules, tbLines };
}

export const rebuildFsMappingDatasetAction = createFsMappingAction<
  { mappingSetId: string },
  { coveragePct: number; mappedCount: number; unmappedCount: number }
>({ module: "fs_mapping.update" }, FS_MAPPING_PERMISSIONS.UPDATE, async (input, context) => {
  const { repo, mappingSet, rules, tbLines } = await loadEngineContext(input.mappingSetId, context);
  const run = fsMappingEngine.run({
    mappingSet,
    accounts: tbLines.map((line) => ({
      id: line.id,
      accountCode: line.account_code,
      accountName: line.account_name,
      debit: Number(line.closing_debit ?? 0),
      credit: Number(line.closing_credit ?? 0),
      netAmount: Number(line.adjusted_closing_balance ?? line.closing_balance ?? 0),
    })),
    rules,
  });
  await repo.replaceLines(mappingSet.id, run.lines);
  await repo.updateSet(mappingSet.id, {
    coverage_pct: run.validation.coveragePct,
    mapped_account_count: run.validation.mappedCount,
    unmapped_account_count: run.validation.unmappedCount,
    validation_error_count: run.validation.errors.length,
    validation_warning_count: run.validation.warnings.length,
    validation_json: run.validation,
    dataset_json: run.dataset,
    summary_json: run.metrics,
  });
  await repo.insertHistory(
    buildHistoryRecord({
      mappingSetId: mappingSet.id,
      organizationId: mappingSet.organizationId,
      workspaceId: mappingSet.workspaceId,
      engagementId: mappingSet.engagementId,
      action: "dataset_built",
      actorUserId: context.userId,
      summary: "Rebuilt normalized financial statement mapping dataset",
    }),
  );
  return {
    coveragePct: run.validation.coveragePct,
    mappedCount: run.validation.mappedCount,
    unmappedCount: run.validation.unmappedCount,
  };
});

export const validateFsMappingSetAction = createFsMappingAction<
  { mappingSetId: string },
  { ok: boolean; errorCount: number; warningCount: number }
>({ module: "fs_mapping.validate" }, FS_MAPPING_PERMISSIONS.VALIDATE, async (input, context) => {
  const { repo, mappingSet, rules, tbLines } = await loadEngineContext(input.mappingSetId, context);
  const run = fsMappingEngine.run({
    mappingSet,
    accounts: tbLines.map((line) => ({
      id: line.id,
      accountCode: line.account_code,
      accountName: line.account_name,
      netAmount: Number(line.adjusted_closing_balance ?? line.closing_balance ?? 0),
    })),
    rules,
  });
  const next = nextWorkflowStatus(mappingSet.setStatus, "validate");
  if (!next) throw new ValidationError("Mapping set cannot be validated from current status");
  await repo.replaceLines(mappingSet.id, run.lines);
  await repo.updateSet(mappingSet.id, {
    set_status: next,
    validated_at: new Date().toISOString(),
    validated_by: context.userId,
    coverage_pct: run.validation.coveragePct,
    mapped_account_count: run.validation.mappedCount,
    unmapped_account_count: run.validation.unmappedCount,
    validation_error_count: run.validation.errors.length,
    validation_warning_count: run.validation.warnings.length,
    validation_json: run.validation,
    dataset_json: run.dataset,
    summary_json: run.metrics,
  });
  await repo.insertHistory(
    buildHistoryRecord({
      mappingSetId: mappingSet.id,
      organizationId: mappingSet.organizationId,
      workspaceId: mappingSet.workspaceId,
      engagementId: mappingSet.engagementId,
      action: "validated",
      actorUserId: context.userId,
      summary: run.validation.ok ? "Mapping set validated" : "Mapping set validated with errors",
      detailsJson: { ok: run.validation.ok },
    }),
  );
  return {
    ok: run.validation.ok,
    errorCount: run.validation.errors.length,
    warningCount: run.validation.warnings.length,
  };
});

export const approveFsMappingSetAction = createFsMappingAction<
  { mappingSetId: string },
  { mappingSetId: string }
>({ module: "fs_mapping.approve" }, FS_MAPPING_PERMISSIONS.APPROVE, async (input, context) => {
  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const repo = new FsMappingRepository(supabase, ctx);
  const mappingSet = await repo.requireSet(input.mappingSetId);
  const next = nextWorkflowStatus(mappingSet.setStatus, "approve");
  if (!next) throw new ValidationError("Mapping set must be validated before approval");
  await repo.updateSet(mappingSet.id, {
    set_status: next,
    approved_at: new Date().toISOString(),
    approved_by: context.userId,
  });
  await repo.insertHistory(
    buildHistoryRecord({
      mappingSetId: mappingSet.id,
      organizationId: mappingSet.organizationId,
      workspaceId: mappingSet.workspaceId,
      engagementId: mappingSet.engagementId,
      action: "approved",
      actorUserId: context.userId,
      summary: "Mapping set approved",
    }),
  );
  return { mappingSetId: mappingSet.id };
});

export const publishFsMappingSetAction = createFsMappingAction<
  { mappingSetId: string; changeSummary?: string },
  { versionNumber: number }
>({ module: "fs_mapping.publish" }, FS_MAPPING_PERMISSIONS.PUBLISH, async (input, context) => {
  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const repo = new FsMappingRepository(supabase, ctx);
  const mappingSet = await repo.requireSet(input.mappingSetId);
  const next = nextWorkflowStatus(mappingSet.setStatus, "publish");
  if (!next) throw new ValidationError("Mapping set must be approved before publish");

  const rules = await repo.listRules(mappingSet.id);
  const lines = await repo.listLines(mappingSet.id);
  const versions = await repo.listVersions(mappingSet.id);
  const versionNumber = (versions[0]?.versionNumber ?? 0) + 1;
  let draft = createVersionDraft({
    mappingSet,
    versionNumber,
    changeSummary: input.changeSummary ?? `Published version ${versionNumber}`,
    createdBy: context.userId,
    snapshot: {
      set: mappingSet,
      rules,
      lines,
      dataset: (mappingSet.datasetJson as never) ?? null,
    },
  });
  draft = publishVersion({ ...draft, id: "pending" }, context.userId);
  await repo.insertVersion(draft);
  await repo.updateSet(mappingSet.id, {
    set_status: next,
    published_at: new Date().toISOString(),
    published_by: context.userId,
    set_version: versionNumber,
    version_count: mappingSet.versionCount + 1,
  });
  await repo.insertHistory(
    buildHistoryRecord({
      mappingSetId: mappingSet.id,
      organizationId: mappingSet.organizationId,
      workspaceId: mappingSet.workspaceId,
      engagementId: mappingSet.engagementId,
      action: "published",
      actorUserId: context.userId,
      summary: `Published mapping version ${versionNumber}`,
    }),
  );
  return { versionNumber };
});

export const archiveFsMappingSetAction = createFsMappingAction<
  { mappingSetId: string },
  { mappingSetId: string }
>({ module: "fs_mapping.archive" }, FS_MAPPING_PERMISSIONS.ARCHIVE, async (input, context) => {
  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const repo = new FsMappingRepository(supabase, ctx);
  const mappingSet = await repo.requireSet(input.mappingSetId);
  await repo.updateSet(mappingSet.id, {
    set_status: "archived",
    archived_at: new Date().toISOString(),
    archived_by: context.userId,
  });
  await repo.insertHistory(
    buildHistoryRecord({
      mappingSetId: mappingSet.id,
      organizationId: mappingSet.organizationId,
      workspaceId: mappingSet.workspaceId,
      engagementId: mappingSet.engagementId,
      action: "archived",
      actorUserId: context.userId,
      summary: "Mapping set archived",
    }),
  );
  return { mappingSetId: mappingSet.id };
});

export const rollbackFsMappingVersionAction = createFsMappingAction<
  { mappingSetId: string; versionNumber: number },
  { versionNumber: number }
>({ module: "fs_mapping.update" }, FS_MAPPING_PERMISSIONS.UPDATE, async (input, context) => {
  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const repo = new FsMappingRepository(supabase, ctx);
  const mappingSet = await repo.requireSet(input.mappingSetId);
  const versions = await repo.listVersions(mappingSet.id);
  const target = versions.find((version) => version.versionNumber === input.versionNumber);
  if (!target) throw new ValidationError("Version not found");
  const nextVersionNumber = (versions[0]?.versionNumber ?? 0) + 1;
  const rolled = rollbackVersion({
    mappingSet,
    fromVersion: target,
    nextVersionNumber,
    actorUserId: context.userId,
  });
  await repo.insertVersion(rolled);
  await repo.updateSet(mappingSet.id, {
    set_status: "draft",
    set_version: nextVersionNumber,
    version_count: mappingSet.versionCount + 1,
  });
  await repo.insertHistory(
    buildHistoryRecord({
      mappingSetId: mappingSet.id,
      organizationId: mappingSet.organizationId,
      workspaceId: mappingSet.workspaceId,
      engagementId: mappingSet.engagementId,
      action: "rolled_back",
      actorUserId: context.userId,
      summary: `Rolled back to version ${input.versionNumber}`,
    }),
  );
  return { versionNumber: nextVersionNumber };
});
