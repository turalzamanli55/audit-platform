import { createServiceClient } from "@/lib/supabase/service";
import type { ActivityFeedEntry } from "@/components/governance/activity-feed";

/** Derive Activity Feed / version history from existing audit_logs — no second store. */
export async function loadAuditActivityFeed(options: {
  organizationId?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  limit?: number;
}): Promise<ActivityFeedEntry[]> {
  const client = createServiceClient();
  let query = client
    .from("audit_logs")
    .select("id, action, resource_type, resource_id, user_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 100);

  if (options.organizationId) query = query.eq("organization_id", options.organizationId);
  if (options.resourceType) query = query.eq("resource_type", options.resourceType);
  if (options.resourceId) query = query.eq("resource_id", options.resourceId);

  const { data } = await query;
  const userIds = [...new Set((data ?? []).map((r) => r.user_id).filter(Boolean))] as string[];
  const emailById = new Map<string, string>();
  await Promise.all(
    userIds.map(async (id) => {
      const { data: auth } = await client.auth.admin.getUserById(id);
      if (auth.user?.email) emailById.set(id, auth.user.email);
    }),
  );

  return (data ?? []).map((row) => {
    const meta = (row.metadata ?? {}) as Record<string, unknown>;
    const reason =
      typeof meta.deleteReasonCode === "string"
        ? meta.deleteReasonCode
        : typeof meta.archiveReason === "string"
          ? meta.archiveReason
          : typeof meta.reason === "string"
            ? meta.reason
            : null;
    return {
      id: row.id,
      timestamp: row.created_at,
      userLabel: (row.user_id && emailById.get(row.user_id)) || "System",
      actionLabel: row.action,
      objectLabel: row.resource_id
        ? `${row.resource_type}:${row.resource_id.slice(0, 8)}`
        : row.resource_type,
      reason,
    };
  });
}
