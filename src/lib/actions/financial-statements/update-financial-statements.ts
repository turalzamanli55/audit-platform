"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFinancialStatementsAction as defineCompletionAction } from "@/lib/actions/financial-statements/financial-statements-action";
import { validateUpdateFinancialStatementPackageInput } from "@/lib/financial-statements/validation";
import { createServerClient } from "@/lib/supabase/server";
import { FinancialStatementRepository } from "@/repositories/financial-statements/financial-statement-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type UpdateFinancialStatementPackageActionInput = {
  packageId: string;
  version: number;
  summaryNotes?: string | null;
};

export type UpdateFinancialStatementPackageActionResult = {
  packageId: string;
  version: number;
  progressPct: number;
};

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

export const updateFinancialStatementPackageAction = defineCompletionAction<
  UpdateFinancialStatementPackageActionInput,
  UpdateFinancialStatementPackageActionResult
>({ module: "financialStatements.update" }, FINANCIAL_STATEMENTS_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateUpdateFinancialStatementPackageInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);

  const pkg = await reviewRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (pkg.version !== validated.version) {
    throw new ValidationError("Review package was modified by another user");
  }

  const updated = await reviewRepository.updatePackage(validated.packageId, validated.version, {
    summary_notes: validated.summaryNotes,
  });

  await reviewRepository.syncItemsFromModules(updated.id);

  const refreshed = (await reviewRepository.findById(updated.id)) ?? updated;

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_UPDATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: refreshed.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: refreshed.version },
  });

  return {
    packageId: refreshed.id,
    version: refreshed.version,
    progressPct: refreshed.progress_pct,
  };
});
