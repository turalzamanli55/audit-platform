"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import {
  createAuditEngineAction,
  createRepositoryContext,
} from "@/lib/actions/audit-engine/audit-engine-action";
import { createServerClient } from "@/lib/supabase/server";
import { AuditLogAccessRepository } from "@/repositories/audit-engine/audit-log-access-repository";
import type { AuditLogAccessFilter } from "@/lib/audit-engine/audit-log-access";

export type QueryAuditLogAccessInput = Omit<AuditLogAccessFilter, "organizationId"> & {
  exportJson?: boolean;
  limit?: number;
};

export type QueryAuditLogAccessResult = {
  count: number;
  exportJson?: string;
  entries: Array<{
    id: string;
    action: string;
    resourceType: string;
    createdAt: string;
  }>;
};

export const queryAuditLogAccessAction = createAuditEngineAction<
  QueryAuditLogAccessInput,
  QueryAuditLogAccessResult
>(
  { module: "audit-engine.audit-log-access.query" },
  AUDIT_ENGINE_PERMISSIONS.AUDIT_LOG_READ,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new AuditLogAccessRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const rows = await repository.listByFilter(
      {
        organizationId: context.organizationId,
        workspaceId: input.workspaceId ?? context.workspaceId,
        from: input.from,
        to: input.to,
        actionPrefix: input.actionPrefix,
      },
      input.limit ?? 100,
    );

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.TENANT_ISOLATION_VERIFIED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: context.workspaceId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { capability: "audit-log-access", count: rows.length },
    });

    return {
      count: rows.length,
      exportJson: input.exportJson ? repository.exportAsJson(rows) : undefined,
      entries: rows.map((row) => ({
        id: row.id,
        action: row.action,
        resourceType: row.resource_type,
        createdAt: row.created_at,
      })),
    };
  },
);
