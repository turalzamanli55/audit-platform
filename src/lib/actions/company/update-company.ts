"use server";

import { headers } from "next/headers";
import { COMPANY_PERMISSIONS, AUDIT_RESOURCE_TYPE } from "@/constants/company";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createCompanyAction } from "@/lib/actions/company/company-action";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";
import { validateUpdateCompanyInput } from "@/lib/company/validation";
import { toSlug } from "@/utils/auth-validation";
import { ValidationError } from "@/lib/errors";

export type UpdateCompanyActionInput = {
  companyId: string;
  version: number;
  name?: string;
  legalName?: string;
  registrationNumber?: string | null;
  description?: string | null;
};

export type UpdateCompanyActionResult = {
  companyId: string;
  version: number;
  slug: string;
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

export const updateCompanyAction = createCompanyAction<
  UpdateCompanyActionInput,
  UpdateCompanyActionResult
>({ module: "company.update" }, COMPANY_PERMISSIONS.ADMINISTER, async (input, context) => {
  if (!input.companyId) {
    throw new ValidationError("Company is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Company version is required");
  }

  const validated = validateUpdateCompanyInput({
    name: input.name,
    legalName: input.legalName,
    registrationNumber: input.registrationNumber,
    description: input.description,
  });

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const repository = new CompanyRepository(supabase, repositoryContext);

  await repository.validateWorkspaceOwnership(input.companyId, context.workspaceId);

  const updatePayload: Parameters<CompanyRepository["update"]>[2] = {};
  if (validated.name !== undefined) {
    updatePayload.name = validated.name;
  }
  if (validated.legalName !== undefined) {
    updatePayload.legal_name = validated.legalName;
    const slug = toSlug(validated.legalName);
    if (!slug) {
      throw new ValidationError("Legal name must contain valid characters");
    }
    updatePayload.slug = await repository.resolveUniqueSlug(
      context.workspaceId,
      slug,
      input.companyId,
    );
  }
  if (validated.registrationNumber !== undefined) {
    updatePayload.registration_number = validated.registrationNumber;
  }
  if (validated.description !== undefined) {
    updatePayload.description = validated.description;
  }

  const company = await repository.update(input.companyId, input.version, updatePayload);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.COMPANY_UPDATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: company.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      version: company.version,
      fields: Object.keys(updatePayload),
    },
  });

  return {
    companyId: company.id,
    version: company.version,
    slug: company.slug,
  };
});
