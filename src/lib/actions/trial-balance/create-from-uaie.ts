"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, TRIAL_BALANCE_ACTIVITY_ACTIONS, TRIAL_BALANCE_PERMISSIONS } from "@/constants/trial-balance";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createTrialBalanceAction } from "@/lib/actions/trial-balance/trial-balance-action";
import { buildTrialBalanceFromNormalizedRows } from "@/lib/trial-balance/build-from-uaie";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { UaieRepository } from "@/repositories/uaie/uaie-repository";
import { TrialBalanceRepository } from "@/repositories/trial-balance/trial-balance-repository";
import type { RepositoryContext } from "@/types/context";
import type { Json } from "@/types/supabase";
import { NotFoundError, ValidationError } from "@/lib/errors";

function createRepositoryContext(
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

export const createTrialBalanceFromUaieAction = createTrialBalanceAction<
  {
    engagementId: string;
    importSessionId: string;
    fiscalYear?: number;
    functionalCurrency?: string;
  },
  { packageId: string; accountCount: number; isBalanced: boolean }
>({ module: "trialBalance.create" }, TRIAL_BALANCE_PERMISSIONS.CREATE, async (input, context) => {
  if (!input.engagementId) throw new ValidationError("Engagement is required");
  if (!input.importSessionId) throw new ValidationError("Import session is required");

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const engagementRepository = new EngagementRepository(supabase, repositoryContext);
  const uaieRepository = new UaieRepository(supabase, repositoryContext);
  const tbRepository = new TrialBalanceRepository(supabase, repositoryContext);

  const engagement = await engagementRepository.findById(input.engagementId);
  if (!engagement || engagement.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Engagement not found");
  }

  const existing = await tbRepository.findByEngagementId(engagement.id);
  if (existing) {
    throw new ValidationError("A trial balance package already exists for this engagement");
  }

  const session = await uaieRepository.requireSession(input.importSessionId);
  if (session.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Import session not found");
  }
  if (session.company_id !== engagement.company_id) {
    throw new ValidationError("Import session company does not match engagement company");
  }
  if (session.import_status !== "staged" && session.import_status !== "validated") {
    throw new ValidationError("Only staged or validated UAIE imports can build a trial balance");
  }

  const rows = await uaieRepository.listNormalizedRows(session.id, 20000);
  if (rows.length === 0) {
    throw new ValidationError("Import session has no normalized accounting rows");
  }

  const functionalCurrency =
    input.functionalCurrency?.trim() ||
    session.detected_currency ||
    "AZN";
  const fiscalYear = input.fiscalYear ?? new Date().getFullYear();

  const built = buildTrialBalanceFromNormalizedRows(
    rows.map((row) => ({
      rowNumber: row.row_number,
      accountCode: row.account_code,
      accountName: row.account_name,
      debit: row.debit == null ? null : Number(row.debit),
      credit: row.credit == null ? null : Number(row.credit),
      balance: row.balance == null ? null : Number(row.balance),
      currencyCode: row.currency_code,
      isValid: row.is_valid,
    })),
    { functionalCurrency },
  );

  const pkg = await tbRepository.createPackage({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: engagement.company_id,
    engagement_id: engagement.id,
    import_session_id: session.id,
    fiscal_year: fiscalYear,
    period_label: `FY${fiscalYear}`,
    period_type: "yearly",
    functional_currency: functionalCurrency,
    presentation_currency: functionalCurrency,
    package_status: built.isBalanced ? "validated" : "draft",
    is_balanced: built.isBalanced,
    out_of_balance_amount: built.outOfBalanceAmount,
    account_count: built.summary.accountCount,
    warning_count: built.summary.warningCount,
    error_count: built.summary.errorCount,
    mapped_count: built.summary.mappedCount,
    unmapped_count: built.summary.unmappedCount,
    summary_json: built.summary as unknown as Json,
    validation_json: { issues: built.issues } as Json,
  });

  await tbRepository.replaceLines(pkg, built.lines);
  await tbRepository.replacePeriods(pkg, [
    {
      periodType: "opening",
      periodLabel: `Opening ${fiscalYear}`,
      fiscalYear,
      sortOrder: 0,
    },
    {
      periodType: "current",
      periodLabel: `Current ${fiscalYear}`,
      fiscalYear,
      sortOrder: 1,
    },
    {
      periodType: "closing",
      periodLabel: `Closing ${fiscalYear}`,
      fiscalYear,
      sortOrder: 2,
    },
    {
      periodType: "prior_year",
      periodLabel: `FY${fiscalYear - 1}`,
      fiscalYear: fiscalYear - 1,
      isComparative: true,
      sortOrder: 3,
    },
  ]);

  await tbRepository.createVersion({
    packageId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    versionNumber: 1,
    changeSummary: "Initial trial balance built from UAIE normalized dataset",
    snapshotJson: {
      accountCount: built.summary.accountCount,
      isBalanced: built.isBalanced,
      importSessionId: session.id,
    } as Json,
  });

  await tbRepository.logActivity({
    packageId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: engagement.company_id,
    engagementId: engagement.id,
    action: TRIAL_BALANCE_ACTIVITY_ACTIONS.IMPORTED,
    summary: `Built trial balance from ${session.source_filename}`,
    metadata: {
      importSessionId: session.id,
      accountCount: built.summary.accountCount,
      isBalanced: built.isBalanced,
    } as Json,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.TRIAL_BALANCE_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { engagementId: engagement.id, importSessionId: session.id },
  });

  return {
    packageId: pkg.id,
    accountCount: built.summary.accountCount,
    isBalanced: built.isBalanced,
  };
});
