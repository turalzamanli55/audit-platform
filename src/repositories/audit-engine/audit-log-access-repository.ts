import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList } from "@/utils/supabase-result";
import {
  assertAuditLogAccessFilter,
  type AuditLogAccessFilter,
} from "@/lib/audit-engine/audit-log-access";

export type AuditLogRow = Tables<"audit_logs">;

/**
 * Audit log access repository — tenant-scoped read/export of audit_logs
 * (PROJECT_BIBLE §13.6 Administration).
 */
export class AuditLogAccessRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listByFilter(filter: AuditLogAccessFilter, limit = 200): Promise<AuditLogRow[]> {
    assertAuditLogAccessFilter(filter);

    let query = applyActiveFilter(
      this.client
        .from("audit_logs")
        .select("*")
        .eq("organization_id", filter.organizationId),
    );

    if (filter.workspaceId) {
      query = query.eq("workspace_id", filter.workspaceId);
    }
    if (filter.from) {
      query = query.gte("created_at", filter.from);
    }
    if (filter.to) {
      query = query.lte("created_at", filter.to);
    }
    if (filter.actionPrefix) {
      query = query.like("action", `${filter.actionPrefix}%`);
    }

    const result = await query.order("created_at", { ascending: false }).limit(limit);
    return unwrapSupabaseList(result);
  }

  exportAsJson(rows: AuditLogRow[]): string {
    return JSON.stringify(
      rows.map((row) => ({
        id: row.id,
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id,
        organizationId: row.organization_id,
        workspaceId: row.workspace_id,
        userId: row.user_id,
        createdAt: row.created_at,
        metadata: row.metadata,
      })),
      null,
      2,
    );
  }
}
