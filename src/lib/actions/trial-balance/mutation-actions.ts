"use server";

import { headers } from "next/headers";
import {
  AUDIT_RESOURCE_TYPE,
  TRIAL_BALANCE_ACTIVITY_ACTIONS,
  TRIAL_BALANCE_PERMISSIONS,
} from "@/constants/trial-balance";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createTrialBalanceAction } from "@/lib/actions/trial-balance/trial-balance-action";
import { assertTrialBalanceEditable } from "@/lib/trial-balance/trial-balance-rules";
import { createServerClient } from "@/lib/supabase/server";
import { TrialBalanceRepository } from "@/repositories/trial-balance/trial-balance-repository";
import type { RepositoryContext } from "@/types/context";
import type {
  TrialBalanceAdjustmentType,
  TrialBalanceFsStatement,
  TrialBalanceLeadSchedule,
  TrialBalanceMappingFramework,
} from "@/types/trial-balance";
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

export const createTrialBalanceAdjustmentAction = createTrialBalanceAction<
  {
    packageId: string;
    description: string;
    amount: number;
    adjustmentType?: TrialBalanceAdjustmentType;
    debitLineId?: string | null;
    creditLineId?: string | null;
    reason?: string | null;
  },
  { adjustmentId: string }
>({ module: "trialBalance.adjust" }, TRIAL_BALANCE_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.description?.trim()) throw new ValidationError("Description is required");
  if (!Number.isFinite(input.amount) || input.amount === 0) {
    throw new ValidationError("Adjustment amount must be a non-zero number");
  }

  const supabase = await createServerClient();
  const repository = new TrialBalanceRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );
  const pkg = await repository.requirePackage(input.packageId);
  if (pkg.workspace_id !== context.workspaceId) throw new NotFoundError("Trial balance not found");
  assertTrialBalanceEditable(pkg);

  const adjustment = await repository.createAdjustment({
    package_id: pkg.id,
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: pkg.company_id,
    engagement_id: pkg.engagement_id,
    adjustment_type: input.adjustmentType ?? "adjustment",
    adjustment_status: "proposed",
    description: input.description.trim(),
    reason: input.reason ?? null,
    debit_line_id: input.debitLineId ?? null,
    credit_line_id: input.creditLineId ?? null,
    amount: input.amount,
    currency_code: pkg.functional_currency,
    preserves_source: true,
  });

  if (input.debitLineId) {
    const lines = await repository.listLines(pkg.id);
    const debitLine = lines.find((line) => line.id === input.debitLineId);
    if (debitLine) {
      const next = Number(debitLine.adjusted_closing_balance) + input.amount;
      await repository.updateLine(debitLine.id, {
        adjusted_closing_balance: next,
        is_adjusted: true,
      });
    }
  }
  if (input.creditLineId) {
    const lines = await repository.listLines(pkg.id);
    const creditLine = lines.find((line) => line.id === input.creditLineId);
    if (creditLine) {
      const next = Number(creditLine.adjusted_closing_balance) - input.amount;
      await repository.updateLine(creditLine.id, {
        adjusted_closing_balance: next,
        is_adjusted: true,
      });
    }
  }

  await repository.updatePackage(pkg.id, {
    adjustment_count: pkg.adjustment_count + 1,
  } as never);

  await repository.logActivity({
    packageId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: pkg.company_id,
    engagementId: pkg.engagement_id,
    action: TRIAL_BALANCE_ACTIVITY_ACTIONS.ADJUSTED,
    summary: input.description.trim(),
    metadata: { adjustmentId: adjustment.id, amount: input.amount } as Json,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.TRIAL_BALANCE_ADJUSTED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: adjustment.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
  });

  return { adjustmentId: adjustment.id };
});

export const mapTrialBalanceAccountAction = createTrialBalanceAction<
  {
    packageId: string;
    lineId: string;
    framework: TrialBalanceMappingFramework;
    mappingCode?: string | null;
    mappingLabel?: string | null;
    leadSchedule?: TrialBalanceLeadSchedule;
    fsStatement?: TrialBalanceFsStatement;
  },
  { mappingId: string }
>({ module: "trialBalance.map" }, TRIAL_BALANCE_PERMISSIONS.UPDATE, async (input, context) => {
  const supabase = await createServerClient();
  const repository = new TrialBalanceRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );
  const pkg = await repository.requirePackage(input.packageId);
  assertTrialBalanceEditable(pkg);

  const mapping = await repository.upsertMapping({
    package_id: pkg.id,
    line_id: input.lineId,
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    framework: input.framework,
    mapping_code: input.mappingCode ?? null,
    mapping_label: input.mappingLabel ?? null,
    confidence: 100,
    is_manual: true,
  });

  await repository.updateLine(input.lineId, {
    is_mapped: true,
    lead_schedule: input.leadSchedule,
    fs_statement: input.fsStatement,
  } as never);

  await repository.logActivity({
    packageId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: pkg.company_id,
    engagementId: pkg.engagement_id,
    action: TRIAL_BALANCE_ACTIVITY_ACTIONS.MAPPED,
    summary: `Mapped account to ${input.framework}`,
    metadata: { lineId: input.lineId, mappingId: mapping.id } as Json,
  });

  return { mappingId: mapping.id };
});

export const mergeTrialBalanceAccountsAction = createTrialBalanceAction<
  { packageId: string; sourceLineId: string; targetLineId: string },
  { targetLineId: string }
>({ module: "trialBalance.merge" }, TRIAL_BALANCE_PERMISSIONS.UPDATE, async (input, context) => {
  if (input.sourceLineId === input.targetLineId) {
    throw new ValidationError("Source and target accounts must differ");
  }
  const supabase = await createServerClient();
  const repository = new TrialBalanceRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );
  const pkg = await repository.requirePackage(input.packageId);
  assertTrialBalanceEditable(pkg);
  const lines = await repository.listLines(pkg.id);
  const source = lines.find((line) => line.id === input.sourceLineId);
  const target = lines.find((line) => line.id === input.targetLineId);
  if (!source || !target) throw new NotFoundError("Accounts not found");

  await repository.updateLine(target.id, {
    opening_debit: Number(target.opening_debit) + Number(source.opening_debit),
    opening_credit: Number(target.opening_credit) + Number(source.opening_credit),
    movement_debit: Number(target.movement_debit) + Number(source.movement_debit),
    movement_credit: Number(target.movement_credit) + Number(source.movement_credit),
    closing_debit: Number(target.closing_debit) + Number(source.closing_debit),
    closing_credit: Number(target.closing_credit) + Number(source.closing_credit),
    closing_balance: Number(target.closing_balance) + Number(source.closing_balance),
    adjusted_closing_balance:
      Number(target.adjusted_closing_balance) + Number(source.adjusted_closing_balance),
    metadata_json: {
      ...(typeof target.metadata_json === "object" && target.metadata_json
        ? (target.metadata_json as object)
        : {}),
      mergedFrom: [
        ...(((target.metadata_json as { mergedFrom?: string[] } | null)?.mergedFrom ?? []) as string[]),
        source.account_code,
      ],
    } as Json,
  });

  await repository.updateLine(source.id, {
    deleted_at: new Date().toISOString(),
    deleted_by: context.userId,
    status: "archived",
    metadata_json: {
      mergedInto: target.account_code,
      preservesSource: true,
    } as Json,
  } as never);

  await repository.updatePackage(pkg.id, {
    account_count: Math.max(0, pkg.account_count - 1),
  } as never);

  await repository.logActivity({
    packageId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: pkg.company_id,
    engagementId: pkg.engagement_id,
    action: TRIAL_BALANCE_ACTIVITY_ACTIONS.MERGED,
    summary: `Merged ${source.account_code} into ${target.account_code}`,
  });

  return { targetLineId: target.id };
});

export const splitTrialBalanceAccountAction = createTrialBalanceAction<
  {
    packageId: string;
    sourceLineId: string;
    splits: Array<{ accountCode: string; accountName: string; amount: number }>;
  },
  { createdLineIds: string[] }
>({ module: "trialBalance.split" }, TRIAL_BALANCE_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.splits?.length) throw new ValidationError("At least one split is required");
  const supabase = await createServerClient();
  const repository = new TrialBalanceRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );
  const pkg = await repository.requirePackage(input.packageId);
  assertTrialBalanceEditable(pkg);
  const lines = await repository.listLines(pkg.id);
  const source = lines.find((line) => line.id === input.sourceLineId);
  if (!source) throw new NotFoundError("Source account not found");

  const total = input.splits.reduce((sum, split) => sum + split.amount, 0);
  if (Math.abs(total - Number(source.closing_balance)) > 0.01) {
    throw new ValidationError("Split amounts must equal the source closing balance");
  }

  const built = input.splits.map((split, index) => ({
    accountCode: split.accountCode.trim(),
    accountName: split.accountName.trim(),
    parentAccountCode: source.account_code,
    accountLevel: source.account_level + 1,
    accountType: source.account_type,
    category: source.category,
    subcategory: source.subcategory,
    classificationConfidence: source.classification_confidence,
    openingDebit: 0,
    openingCredit: 0,
    movementDebit: split.amount > 0 ? split.amount : 0,
    movementCredit: split.amount < 0 ? Math.abs(split.amount) : 0,
    closingDebit: split.amount > 0 ? split.amount : 0,
    closingCredit: split.amount < 0 ? Math.abs(split.amount) : 0,
    closingBalance: split.amount,
    originalCurrency: source.original_currency,
    exchangeRate: Number(source.exchange_rate),
    functionalAmount: split.amount * Number(source.exchange_rate),
    presentationAmount: split.amount * Number(source.exchange_rate),
    fxGainLoss: 0,
    leadSchedule: source.lead_schedule,
    fsStatement: source.fs_statement,
    isMapped: source.is_mapped,
    isOrphan: false,
    sourceRowNumber: source.source_row_number,
    sortOrder: source.sort_order + index + 1,
  }));

  const created = await repository.replaceLines(pkg, [
    ...lines
      .filter((line) => line.id !== source.id && !line.deleted_at)
      .map((line) => ({
        accountCode: line.account_code,
        accountName: line.account_name,
        parentAccountCode: null,
        accountLevel: line.account_level,
        accountType: line.account_type,
        category: line.category,
        subcategory: line.subcategory,
        classificationConfidence: Number(line.classification_confidence),
        openingDebit: Number(line.opening_debit),
        openingCredit: Number(line.opening_credit),
        movementDebit: Number(line.movement_debit),
        movementCredit: Number(line.movement_credit),
        closingDebit: Number(line.closing_debit),
        closingCredit: Number(line.closing_credit),
        closingBalance: Number(line.closing_balance),
        originalCurrency: line.original_currency,
        exchangeRate: Number(line.exchange_rate),
        functionalAmount: Number(line.functional_amount),
        presentationAmount: line.presentation_amount == null ? null : Number(line.presentation_amount),
        fxGainLoss: Number(line.fx_gain_loss),
        leadSchedule: line.lead_schedule,
        fsStatement: line.fs_statement,
        isMapped: line.is_mapped,
        isOrphan: line.is_orphan,
        sourceRowNumber: line.source_row_number,
        sortOrder: line.sort_order,
      })),
    {
      accountCode: source.account_code,
      accountName: source.account_name,
      parentAccountCode: null,
      accountLevel: source.account_level,
      accountType: source.account_type,
      category: source.category,
      subcategory: source.subcategory,
      classificationConfidence: Number(source.classification_confidence),
      openingDebit: Number(source.opening_debit),
      openingCredit: Number(source.opening_credit),
      movementDebit: 0,
      movementCredit: 0,
      closingDebit: 0,
      closingCredit: 0,
      closingBalance: 0,
      originalCurrency: source.original_currency,
      exchangeRate: Number(source.exchange_rate),
      functionalAmount: 0,
      presentationAmount: 0,
      fxGainLoss: 0,
      leadSchedule: source.lead_schedule,
      fsStatement: source.fs_statement,
      isMapped: source.is_mapped,
      isOrphan: false,
      sourceRowNumber: source.source_row_number,
      sortOrder: source.sort_order,
    },
    ...built,
  ]);

  await repository.logActivity({
    packageId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: pkg.company_id,
    engagementId: pkg.engagement_id,
    action: TRIAL_BALANCE_ACTIVITY_ACTIONS.SPLIT,
    summary: `Split ${source.account_code} into ${input.splits.length} accounts`,
  });

  return {
    createdLineIds: created
      .filter((line) => input.splits.some((split) => split.accountCode === line.account_code))
      .map((line) => line.id),
  };
});

export const rollForwardTrialBalanceAction = createTrialBalanceAction<
  { packageId: string; targetFiscalYear: number },
  { packageId: string }
>({ module: "trialBalance.rollForward" }, TRIAL_BALANCE_PERMISSIONS.CREATE, async (input, context) => {
  const supabase = await createServerClient();
  const repository = new TrialBalanceRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );
  const source = await repository.requirePackage(input.packageId);
  if (source.workspace_id !== context.workspaceId) throw new NotFoundError("Trial balance not found");
  if (source.package_status !== "approved" && source.package_status !== "locked") {
    throw new ValidationError("Only approved or locked packages can roll forward");
  }

  const existing = await repository.findByEngagementId(source.engagement_id);
  if (existing && existing.id !== source.id) {
    throw new ValidationError("Engagement already has an active trial balance package");
  }

  // Soft-archive current by marking rolled package stays; create new package for next year
  // For engagement uniqueness, we archive source first then create.
  await repository.updatePackage(source.id, {
    package_status: "archived",
    deleted_at: new Date().toISOString(),
    deleted_by: context.userId,
    status: "archived",
  } as never);

  const lines = await repository.listLines(source.id);
  const next = await repository.createPackage({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: source.company_id,
    engagement_id: source.engagement_id,
    import_session_id: source.import_session_id,
    fiscal_year: input.targetFiscalYear,
    period_label: `FY${input.targetFiscalYear}`,
    period_type: "yearly",
    functional_currency: source.functional_currency,
    presentation_currency: source.presentation_currency,
    package_status: "draft",
    rolled_forward_from_id: source.id,
    account_count: lines.length,
    mapped_count: lines.filter((line) => line.is_mapped).length,
    unmapped_count: lines.filter((line) => !line.is_mapped).length,
    is_balanced: true,
    summary_json: { rolledForwardFrom: source.id } as Json,
  });

  await repository.replaceLines(
    next,
    lines.map((line, index) => ({
      accountCode: line.account_code,
      accountName: line.account_name,
      parentAccountCode: null,
      accountLevel: line.account_level,
      accountType: line.account_type,
      category: line.category,
      subcategory: line.subcategory,
      classificationConfidence: Number(line.classification_confidence),
      openingDebit: Number(line.adjusted_closing_balance) >= 0 ? Number(line.adjusted_closing_balance) : 0,
      openingCredit:
        Number(line.adjusted_closing_balance) < 0
          ? Math.abs(Number(line.adjusted_closing_balance))
          : 0,
      movementDebit: 0,
      movementCredit: 0,
      closingDebit: Number(line.adjusted_closing_balance) >= 0 ? Number(line.adjusted_closing_balance) : 0,
      closingCredit:
        Number(line.adjusted_closing_balance) < 0
          ? Math.abs(Number(line.adjusted_closing_balance))
          : 0,
      closingBalance: Number(line.adjusted_closing_balance),
      originalCurrency: line.original_currency,
      exchangeRate: Number(line.exchange_rate),
      functionalAmount: Number(line.adjusted_closing_balance) * Number(line.exchange_rate),
      presentationAmount: Number(line.adjusted_closing_balance) * Number(line.exchange_rate),
      fxGainLoss: 0,
      leadSchedule: line.lead_schedule,
      fsStatement: line.fs_statement,
      isMapped: line.is_mapped,
      isOrphan: line.is_orphan,
      sourceRowNumber: line.source_row_number,
      sortOrder: index,
    })),
  );

  await repository.logActivity({
    packageId: next.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: next.company_id,
    engagementId: next.engagement_id,
    action: TRIAL_BALANCE_ACTIVITY_ACTIONS.ROLLED_FORWARD,
    summary: `Rolled forward from FY${source.fiscal_year} to FY${input.targetFiscalYear}`,
  });

  return { packageId: next.id };
});
