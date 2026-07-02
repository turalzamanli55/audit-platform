import "server-only";

import { AUDIT_RESOURCE_TYPE } from "@/constants/company";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { AUDIT_ACTIONS } from "@/lib/audit/constants";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";
import { unwrapSupabaseList } from "@/utils/supabase-result";

export type CompanyActivityEntry = {
  id: string;
  action: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type CompanyActivitySummary = {
  total: number;
  created: number;
  updated: number;
  settingsUpdated: number;
  archived: number;
  restored: number;
};

export type CompanyActivityView = {
  entries: CompanyActivityEntry[];
  summary: CompanyActivitySummary;
};

export type CompanyActivityLoadResult =
  | { ok: true; activity: CompanyActivityView }
  | {
      ok: false;
      reason: "unauthenticated" | "forbidden" | "no_workspace" | "error";
    };

function parseMetadata(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function toEntry(row: Tables<"audit_logs">): CompanyActivityEntry {
  return {
    id: row.id,
    action: row.action,
    createdAt: row.created_at,
    metadata: parseMetadata(row.metadata),
  };
}

function buildSummary(entries: CompanyActivityEntry[]): CompanyActivitySummary {
  const summary: CompanyActivitySummary = {
    total: entries.length,
    created: 0,
    updated: 0,
    settingsUpdated: 0,
    archived: 0,
    restored: 0,
  };

  for (const entry of entries) {
    switch (entry.action) {
      case AUDIT_ACTIONS.COMPANY_CREATED:
        summary.created += 1;
        break;
      case AUDIT_ACTIONS.COMPANY_UPDATED:
        summary.updated += 1;
        break;
      case AUDIT_ACTIONS.COMPANY_SETTINGS_UPDATED:
        summary.settingsUpdated += 1;
        break;
      case AUDIT_ACTIONS.COMPANY_ARCHIVED:
        summary.archived += 1;
        break;
      case AUDIT_ACTIONS.COMPANY_RESTORED:
        summary.restored += 1;
        break;
      default:
        break;
    }
  }

  return summary;
}

export async function loadCompanyActivity(companyId: string): Promise<CompanyActivityLoadResult> {
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
    const result = await supabase
      .from("audit_logs")
      .select("*")
      .eq("resource_type", AUDIT_RESOURCE_TYPE)
      .eq("resource_id", companyId)
      .eq("workspace_id", workspace.workspaceId)
      .order("created_at", { ascending: false })
      .limit(100);

    const rows = unwrapSupabaseList(result);
    const entries = rows.map(toEntry);

    return {
      ok: true,
      activity: {
        entries,
        summary: buildSummary(entries),
      },
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
