"use server";

import { headers } from "next/headers";
import { FS_MAPPING_PERMISSIONS, AUDIT_RESOURCE_TYPE } from "@/constants/fs-mapping";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFsMappingAction } from "@/lib/actions/fs-mapping/fs-mapping-action";
import { createServerClient } from "@/lib/supabase/server";
import { FsMappingRepository } from "@/repositories/fs-mapping/fs-mapping-repository";
import { TrialBalanceRepository } from "@/repositories/trial-balance/trial-balance-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";
import { fsMappingEngine } from "@/lib/fs-mapping/engine";
import { seedRulesForStandard } from "@/lib/fs-mapping/rules";
import { buildHistoryRecord } from "@/lib/fs-mapping/history";
import type { FsMappingStandard } from "@/types/fs-mapping";
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

export type CreateFsMappingSetInput = {
  engagementId: string;
  name: string;
  description?: string | null;
  standard?: FsMappingStandard;
  seedDefaultRules?: boolean;
};

export const createFsMappingSetAction = createFsMappingAction<
  CreateFsMappingSetInput,
  { mappingSetId: string }
>({ module: "fs_mapping.create" }, FS_MAPPING_PERMISSIONS.CREATE, async (input, context) => {
  if (!input.name.trim()) throw new ValidationError("Mapping set name is required");

  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const engagements = new EngagementRepository(supabase, ctx);
  const engagement = await engagements.findById(input.engagementId);
  if (!engagement) throw new ValidationError("Engagement not found");
  if (engagement.workspace_id !== context.workspaceId) {
    throw new ValidationError("Engagement workspace mismatch");
  }

  const existing = new FsMappingRepository(supabase, ctx);
  const prior = await existing.findSetByEngagementId(input.engagementId);
  if (prior) throw new ValidationError("A mapping set already exists for this engagement");

  const tb = new TrialBalanceRepository(supabase, ctx);
  const tbPackage = await tb.findByEngagementId(input.engagementId);

  const created = await existing.createSet({
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: engagement.company_id,
    engagementId: input.engagementId,
    trialBalancePackageId: tbPackage?.id ?? null,
    name: input.name.trim(),
    description: input.description ?? null,
    standard: input.standard ?? "ifrs",
  });

  if (input.seedDefaultRules !== false) {
    const seeds = seedRulesForStandard({
      standard: created.standard,
      mappingSetId: created.id,
      organizationId: created.organizationId,
      workspaceId: created.workspaceId,
      engagementId: created.engagementId,
    });
    await existing.replaceRules(created.id, seeds);
  }

  if (tbPackage) {
    const lines = await tb.listLines(tbPackage.id);
    const rules = await existing.listRules(created.id);
    const run = fsMappingEngine.run({
      mappingSet: created,
      accounts: lines.map((line) => ({
        id: line.id,
        accountCode: line.account_code,
        accountName: line.account_name,
        debit: Number(line.closing_debit ?? 0),
        credit: Number(line.closing_credit ?? 0),
        netAmount: Number(line.adjusted_closing_balance ?? line.closing_balance ?? 0),
      })),
      rules,
    });
    await existing.replaceLines(created.id, run.lines);
    await existing.updateSet(created.id, {
      coverage_pct: run.validation.coveragePct,
      mapped_account_count: run.validation.mappedCount,
      unmapped_account_count: run.validation.unmappedCount,
      validation_error_count: run.validation.errors.length,
      validation_warning_count: run.validation.warnings.length,
      validation_json: run.validation,
      dataset_json: run.dataset,
      summary_json: run.metrics,
    });
  }

  await existing.insertHistory(
    buildHistoryRecord({
      mappingSetId: created.id,
      organizationId: created.organizationId,
      workspaceId: created.workspaceId,
      engagementId: created.engagementId,
      action: "created",
      actorUserId: context.userId,
      summary: `Created mapping set "${created.name}"`,
    }),
  );

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FS_MAPPING_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: created.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
  });

  return { mappingSetId: created.id };
});
