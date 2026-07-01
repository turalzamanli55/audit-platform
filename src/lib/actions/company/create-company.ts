"use server";

import { headers } from "next/headers";
import { COMPANY_PERMISSIONS, AUDIT_RESOURCE_TYPE } from "@/constants/company";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createCompanyAction as defineCompanyAction } from "@/lib/actions/company/company-action";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";
import type { CompanySettings } from "@/types/company";
import {
  assertSubsidiaryParent,
  validateCreateCompanyInput,
} from "@/lib/company/validation";
import { ValidationError } from "@/lib/errors";

export type CreateCompanyActionInput = {
  legalName: string;
  name?: string;
  registrationNumber?: string | null;
  description?: string | null;
  jurisdiction: string;
  reportingFramework: CompanySettings["reporting_framework"];
  functionalCurrency: string;
  presentationCurrency?: string | null;
  fiscalYearEndMonth: number;
  fiscalYearEndDay: number;
  industryClassification: CompanySettings["industry_classification"];
  entityType: CompanySettings["entity_type"];
  parentCompanyId?: string | null;
  settings?: Partial<CompanySettings>;
};

export type CreateCompanyActionResult = {
  companyId: string;
  slug: string;
  version: number;
  settingsVersion: number;
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

export const createCompanyAction = defineCompanyAction<
  CreateCompanyActionInput,
  CreateCompanyActionResult
>({ module: "company.create" }, COMPANY_PERMISSIONS.ADMINISTER, async (input, context) => {
  const validated = validateCreateCompanyInput({
    legalName: input.legalName,
    name: input.name,
    registrationNumber: input.registrationNumber,
    description: input.description,
    settings: {
      jurisdiction: input.jurisdiction,
      reporting_framework: input.reportingFramework,
      functional_currency: input.functionalCurrency,
      presentation_currency: input.presentationCurrency ?? null,
      fiscal_year_end_month: input.fiscalYearEndMonth,
      fiscal_year_end_day: input.fiscalYearEndDay,
      industry_classification: input.industryClassification,
      entity_type: input.entityType,
      parent_company_id: input.parentCompanyId ?? null,
      ...input.settings,
    },
  });

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const repository = new CompanyRepository(supabase, repositoryContext);

  const slug = await repository.resolveUniqueSlug(context.workspaceId, validated.slug);

  if (validated.settings.entity_type === "subsidiary") {
    if (!validated.settings.parent_company_id) {
      throw new ValidationError("Subsidiary entities require a parent company");
    }

    const parent = await repository.findById(validated.settings.parent_company_id);
    assertSubsidiaryParent(validated.settings, parent, context.organizationId);
  }

  const created = await repository.create({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    name: validated.name,
    legal_name: validated.legalName,
    slug,
    registration_number: validated.registrationNumber,
    description: validated.description,
    settings: validated.settings,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.COMPANY_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: created.company.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      slug: created.company.slug,
      legalName: created.company.legal_name,
    },
  });

  return {
    companyId: created.company.id,
    slug: created.company.slug,
    version: created.company.version,
    settingsVersion: created.settingsRow.version,
  };
});
