"use server";

import { headers } from "next/headers";
import { COMPANY_PERMISSIONS, AUDIT_RESOURCE_TYPE } from "@/constants/company";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createCompanyAction } from "@/lib/actions/company/company-action";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type RestoreCompanyActionInput = {
  companyId: string;
  version: number;
  restoreReason?: string | null;
};

export type RestoreCompanyActionResult = {
  companyId: string;
  version: number;
  status: string;
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

export const restoreCompanyAction = createCompanyAction<
  RestoreCompanyActionInput,
  RestoreCompanyActionResult
>({ module: "company.restore" }, COMPANY_PERMISSIONS.ADMINISTER, async (input, context) => {
  if (!input.companyId) {
    throw new ValidationError("Company is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Company version is required");
  }

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const repository = new CompanyRepository(supabase, repositoryContext);

  await repository.validateWorkspaceOwnership(input.companyId, context.workspaceId);

  const company = await repository.restore(input.companyId, input.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.COMPANY_RESTORED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: company.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      version: company.version,
      restoreReason: input.restoreReason ?? null,
    },
  });

  return {
    companyId: company.id,
    version: company.version,
    status: company.status,
  };
});
