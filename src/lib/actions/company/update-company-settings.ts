"use server";

import { headers } from "next/headers";
import { COMPANY_PERMISSIONS, AUDIT_RESOURCE_TYPE } from "@/constants/company";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createCompanyAction } from "@/lib/actions/company/company-action";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";
import type { CompanySettings } from "@/types/company";
import {
  assertSubsidiaryParent,
  validateCompanySettings,
} from "@/lib/company/validation";
import { parseCompanySettings } from "@/lib/company/settings";
import { ValidationError } from "@/lib/errors";

export type UpdateCompanySettingsActionInput = {
  companyId: string;
  settingsVersion: number;
  settings: Partial<CompanySettings>;
};

export type UpdateCompanySettingsActionResult = {
  companyId: string;
  settingsVersion: number;
  settings: CompanySettings;
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

export const updateCompanySettingsAction = createCompanyAction<
  UpdateCompanySettingsActionInput,
  UpdateCompanySettingsActionResult
>(
  { module: "company.update-settings" },
  COMPANY_PERMISSIONS.CONFIGURE,
  async (input, context) => {
    if (!input.companyId) {
      throw new ValidationError("Company is required");
    }
    if (!Number.isInteger(input.settingsVersion) || input.settingsVersion < 1) {
      throw new ValidationError("Settings version is required");
    }

    const supabase = await createServerClient();
    const repositoryContext = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const repository = new CompanyRepository(supabase, repositoryContext);

    await repository.validateWorkspaceOwnership(input.companyId, context.workspaceId);

    const currentRow = await repository.getSettings(input.companyId);
    if (!currentRow) {
      throw new ValidationError("Company settings not found");
    }

    const current = parseCompanySettings(currentRow.settings);
    const mergedForValidation = { ...current, ...input.settings };
    const validated = validateCompanySettings(mergedForValidation);

    if (validated.entity_type === "subsidiary" && validated.parent_company_id) {
      const parent = await repository.findById(validated.parent_company_id);
      assertSubsidiaryParent(validated, parent, context.organizationId);
    }

    const updated = await repository.updateSettings(
      input.companyId,
      input.settingsVersion,
      input.settings,
    );

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.COMPANY_SETTINGS_UPDATED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: input.companyId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        settingsVersion: updated.settingsRow.version,
        fields: Object.keys(input.settings),
      },
    });

    return {
      companyId: input.companyId,
      settingsVersion: updated.settingsRow.version,
      settings: updated.settings,
    };
  },
);
