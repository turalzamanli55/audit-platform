import "server-only";

import { createServiceClient } from "@/lib/supabase/service";
import type { TablesInsert, Json } from "@/types/supabase";
import { createLogger } from "@/lib/logger";

export type AuditEventInput = {
  action: string;
  resourceType: string;
  resourceId?: string | null;
  organizationId?: string | null;
  workspaceId?: string | null;
  userId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function emitAuditEvent(input: AuditEventInput): Promise<void> {
  const log = createLogger({ module: "audit" });

  const payload: TablesInsert<"audit_logs"> = {
    action: input.action,
    resource_type: input.resourceType,
    resource_id: input.resourceId ?? null,
    organization_id: input.organizationId ?? null,
    workspace_id: input.workspaceId ?? null,
    user_id: input.userId ?? null,
    metadata: (input.metadata ?? {}) as Json,
    ip_address: input.ipAddress ?? null,
    user_agent: input.userAgent ?? null,
  };

  try {
    const client = createServiceClient();
    const { error } = await client.from("audit_logs").insert(payload);
    if (error) {
      log.error("audit.emit.failed", error, { action: input.action });
    }
  } catch (error) {
    log.error(
      "audit.emit.failed",
      error instanceof Error ? error : new Error(String(error)),
      { action: input.action },
    );
  }
}

export const AUDIT_ACTIONS = {
  REGISTER: "auth.register",
  LOGIN: "auth.login",
  LOGOUT: "auth.logout",
  ORGANIZATION_CREATED: "organization.created",
  WORKSPACE_CREATED: "workspace.created",
  MEMBERSHIP_CREATED: "membership.created",
} as const;
