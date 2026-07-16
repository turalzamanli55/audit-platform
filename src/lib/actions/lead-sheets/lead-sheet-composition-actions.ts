"use server";

import { headers } from "next/headers";
import {
  AUDIT_RESOURCE_TYPE,
  LEAD_SHEET_FS_AREAS,
  LEAD_SHEET_PERMISSIONS,
  type LeadSheetFsArea,
  type LeadSheetStatus,
} from "@/constants/lead-sheets";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createLeadSheetAction as defineLeadSheetAction } from "@/lib/actions/lead-sheets/lead-sheet-action";
import {
  assertLeadSheetApprovable,
  assertLeadSheetReconcilesToTrialBalance,
  composeLeadSheetLines,
  deriveLeadSheetStatus,
  type LeadSheetLineInput,
} from "@/lib/lead-sheets/lead-sheet-composition";
import { createServerClient } from "@/lib/supabase/server";
import { LeadSheetCompositionRepository } from "@/repositories/lead-sheets/lead-sheet-composition-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

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

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export type ComposeLeadSheetInput = {
  engagementId: string;
  trialBalancePackageId: string;
  fsArea: string;
  name: string;
  lines: LeadSheetLineInput[];
};

export type ComposeLeadSheetResult = {
  leadSheetId: string;
  sheetStatus: string;
  totalReported: number;
  totalTested: number;
  unreconciledDifference: number;
  flags: Array<{ accountCode: string; code: string; message: string }>;
  lineCount: number;
};

export const composeLeadSheetAction = defineLeadSheetAction<
  ComposeLeadSheetInput,
  ComposeLeadSheetResult
>({ module: "lead-sheet.compose" }, LEAD_SHEET_PERMISSIONS.CREATE, async (input, context) => {
  if (!input.engagementId) {
    throw new ValidationError("Engagement is required");
  }
  if (!input.trialBalancePackageId) {
    throw new ValidationError("Trial balance package is required");
  }
  if (!input.name?.trim()) {
    throw new ValidationError("Lead sheet name is required");
  }
  if (!(LEAD_SHEET_FS_AREAS as readonly string[]).includes(input.fsArea)) {
    throw new ValidationError(
      `Financial statement area must be one of: ${LEAD_SHEET_FS_AREAS.join(", ")}`,
    );
  }

  const supabase = await createServerClient();
  const repository = new LeadSheetCompositionRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  const tbPackage = await repository.findTrialBalancePackageById(
    input.trialBalancePackageId,
  );
  if (!tbPackage || tbPackage.workspace_id !== context.workspaceId) {
    throw new ValidationError("Trial balance package not found in this workspace");
  }
  if (tbPackage.engagement_id !== input.engagementId) {
    throw new ValidationError("Trial balance package belongs to a different engagement");
  }

  const composition = composeLeadSheetLines(input.lines);

  // Reconcile against the adjusted trial balance for the linked lines
  // (bible rule: lead sheet totals must reconcile to trial balance).
  const linkedLineIds = input.lines
    .map((line) => line.trialBalanceLineId)
    .filter((id): id is string => Boolean(id));
  const tbLines = await repository.listTrialBalanceLinesByIds(tbPackage.id, [
    ...new Set(linkedLineIds),
  ]);
  if (tbLines.length !== new Set(linkedLineIds).size) {
    throw new ValidationError(
      "One or more linked trial balance lines do not belong to the selected package",
    );
  }
  if (tbLines.length > 0) {
    const trialBalanceTotal = round2(
      tbLines.reduce((sum, line) => sum + line.adjusted_closing_balance, 0),
    );
    assertLeadSheetReconcilesToTrialBalance(composition.totals, trialBalanceTotal);
  }

  const sheetStatus = deriveLeadSheetStatus(composition);
  const sheet = await repository.createLeadSheet({
    engagementId: input.engagementId,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    trialBalancePackageId: tbPackage.id,
    fsArea: input.fsArea as LeadSheetFsArea,
    name: input.name.trim(),
    sheetStatus,
    totalReported: composition.totals.totalReported,
    totalTested: composition.totals.totalTested,
    unreconciledDifference: composition.totals.unreconciledDifference,
    reconciliationNote:
      composition.flags.length > 0
        ? composition.flags.map((flag) => flag.message).join("; ")
        : null,
  });
  await repository.insertLines(sheet, composition.lines);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.LEAD_SHEET_COMPOSED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: sheet.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      engagementId: input.engagementId,
      fsArea: input.fsArea,
      sheetStatus,
      lineCount: composition.lines.length,
      flags: composition.flags.map((flag) => flag.code),
    },
  });

  return {
    leadSheetId: sheet.id,
    sheetStatus,
    totalReported: composition.totals.totalReported,
    totalTested: composition.totals.totalTested,
    unreconciledDifference: composition.totals.unreconciledDifference,
    flags: composition.flags,
    lineCount: composition.lines.length,
  };
});

export type ApproveLeadSheetInput = {
  leadSheetId: string;
  version: number;
};

export type ApproveLeadSheetResult = {
  leadSheetId: string;
  sheetStatus: string;
};

export const approveLeadSheetAction = defineLeadSheetAction<
  ApproveLeadSheetInput,
  ApproveLeadSheetResult
>({ module: "lead-sheet.approve" }, LEAD_SHEET_PERMISSIONS.APPROVE, async (input, context) => {
  if (!input.leadSheetId) {
    throw new ValidationError("Lead sheet is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Lead sheet version is required");
  }

  const supabase = await createServerClient();
  const repository = new LeadSheetCompositionRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  const sheet = await repository.requireInWorkspace(input.leadSheetId, context.workspaceId);
  assertLeadSheetApprovable(sheet.sheet_status as LeadSheetStatus);

  const updated = await repository.updateStatus(sheet.id, input.version, "approved");

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.LEAD_SHEET_APPROVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { engagementId: updated.engagement_id, fsArea: updated.fs_area },
  });

  return { leadSheetId: updated.id, sheetStatus: updated.sheet_status };
});

export type ListLeadSheetsInput = {
  engagementId: string;
};

export type ListLeadSheetsResult = {
  engagementId: string;
  leadSheets: Array<{
    id: string;
    name: string;
    fsArea: string;
    sheetStatus: string;
    totalReported: number;
    totalTested: number;
    unreconciledDifference: number;
    version: number;
    createdAt: string;
  }>;
};

export const listLeadSheetsAction = defineLeadSheetAction<
  ListLeadSheetsInput,
  ListLeadSheetsResult
>({ module: "lead-sheet.list" }, LEAD_SHEET_PERMISSIONS.READ, async (input, context) => {
  if (!input.engagementId) {
    throw new ValidationError("Engagement is required");
  }

  const supabase = await createServerClient();
  const repository = new LeadSheetCompositionRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  const sheets = await repository.listByEngagement(input.engagementId);

  return {
    engagementId: input.engagementId,
    leadSheets: sheets
      .filter((sheet) => sheet.workspace_id === context.workspaceId)
      .map((sheet) => ({
        id: sheet.id,
        name: sheet.name,
        fsArea: sheet.fs_area,
        sheetStatus: sheet.sheet_status,
        totalReported: sheet.total_reported,
        totalTested: sheet.total_tested,
        unreconciledDifference: sheet.unreconciled_difference,
        version: sheet.version,
        createdAt: sheet.created_at,
      })),
  };
});
