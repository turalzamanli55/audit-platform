import "server-only";

import { cache } from "react";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { parseCompanySettings } from "@/lib/company/settings";
import type { CompanyListItem, CompanyListLoadResult } from "@/lib/company/company-list-item";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";

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

export const loadCompanyList = cache(async function loadCompanyList(): Promise<CompanyListLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { ok: false, reason: "unauthenticated" };
    }

    requirePermissionCodes(user, COMPANY_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId) {
      return { ok: false, reason: "no_workspace" };
    }

    if (!user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const repository = new CompanyRepository(
      supabase,
      createRepositoryContext(user.id, user.organizationId, workspace.workspaceId),
    );

    const companies = await repository.listByWorkspace(workspace.workspaceId, {
      includeArchived: true,
    });

    const items: CompanyListItem[] = await Promise.all(
      companies.map(async (company) => {
        const settingsRow = await repository.getSettings(company.id);
        const settings = parseCompanySettings(settingsRow?.settings);

        return {
          id: company.id,
          slug: company.slug,
          name: company.name,
          legalName: company.legal_name ?? company.name,
          jurisdiction: settings.jurisdiction.trim() || "—",
          reportingFramework: settings.reporting_framework,
          status: company.status,
          updatedAt: company.updated_at,
          version: company.version,
          isArchived: Boolean(company.deleted_at) || company.status === "archived",
        };
      }),
    );

    return { ok: true, items };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return { ok: false, reason: "unauthenticated" };
    }
    if (error instanceof AuthorizationError) {
      return { ok: false, reason: "forbidden" };
    }
    if (error instanceof DatabaseError) {
      return { ok: false, reason: "error" };
    }
    return { ok: false, reason: "error" };
  }
});
