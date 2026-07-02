import "server-only";

import { cache } from "react";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { parseCompanySettings } from "@/lib/company/settings";
import type {
  CompanyWorkspaceLoadResult,
  CompanyWorkspaceView,
} from "@/lib/company/company-workspace-view";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";
import type { Company } from "@/repositories/company/company-repository";

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

async function toWorkspaceView(
  repository: CompanyRepository,
  company: Company,
): Promise<CompanyWorkspaceView> {
  const settingsRow = await repository.getSettings(company.id);
  const settings = parseCompanySettings(settingsRow?.settings);

  return {
    id: company.id,
    slug: company.slug,
    name: company.name,
    legalName: company.legal_name ?? company.name,
    registrationNumber: company.registration_number,
    description: company.description,
    status: company.status,
    createdAt: company.created_at,
    updatedAt: company.updated_at,
    version: company.version,
    settingsVersion: settingsRow?.version ?? 1,
    isArchived: Boolean(company.deleted_at) || company.status === "archived",
    deletedAt: company.deleted_at,
    settings,
  };
}

export async function loadCompanyWorkspace(slug: string): Promise<CompanyWorkspaceLoadResult> {
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
      company: await toWorkspaceView(repository, company),
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

export const loadCompanyWorkspaceCached = cache(loadCompanyWorkspace);
