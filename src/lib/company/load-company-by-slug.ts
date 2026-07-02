import "server-only";

import { COMPANY_PERMISSIONS } from "@/constants/company";
import { parseCompanySettings } from "@/lib/company/settings";
import type { CompanyListItem } from "@/lib/company/company-list-item";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";
import type { Company } from "@/repositories/company/company-repository";

export type CompanyDetailLoadResult =
  | {
      ok: true;
      company: CompanyListItem;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

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

async function toListItem(
  repository: CompanyRepository,
  company: Company,
): Promise<CompanyListItem> {
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
}

export async function loadCompanyBySlug(slug: string): Promise<CompanyDetailLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { ok: false, reason: "unauthenticated" };
    }

    requirePermissionCodes(user, COMPANY_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const repository = new CompanyRepository(
      supabase,
      createRepositoryContext(user.id, user.organizationId, workspace.workspaceId),
    );

    const company = await repository.findBySlugInWorkspace(workspace.workspaceId, slug);

    if (!company) {
      return { ok: false, reason: "not_found" };
    }

    return {
      ok: true,
      company: await toListItem(repository, company),
    };
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
}
