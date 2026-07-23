import "server-only";

import { createServiceClient } from "@/lib/supabase/service";
import { loadRecycleBin } from "@/lib/object-lifecycle";
import { computeRetention } from "@/lib/object-lifecycle/retention";
import { getOrganizationRetentionDays } from "@/lib/object-lifecycle/legal-hold";
import type { LifecycleObjectType } from "@/lib/object-lifecycle";

export async function loadPlatformRecycleBin(options?: {
  organizationId?: string | null;
  objectTypes?: LifecycleObjectType[];
  limit?: number;
}) {
  const client = createServiceClient();
  return loadRecycleBin(client, options);
}

export async function loadCompanyRecycleBin(organizationId: string, limit = 200) {
  const client = createServiceClient();
  return loadRecycleBin(client, { organizationId, limit });
}

export async function loadRetentionDashboard() {
  const client = createServiceClient();
  const items = await loadRecycleBin(client, { limit: 500 });
  const ready = [];
  for (const item of items) {
    const orgId = item.organizationId ?? (item.objectType === "organization" ? item.id : null);
    const days = orgId ? await getOrganizationRetentionDays(client, orgId) : null;
    const retention = computeRetention(item.deletedAt, days);
    if (retention.eligibleForPermanentDelete && !item.legalHoldEnabled) {
      ready.push(item);
    }
  }

  const byType: Record<string, number> = {};
  for (const item of ready) {
    byType[item.objectType] = (byType[item.objectType] ?? 0) + 1;
  }

  return { ready, byType, totalReady: ready.length };
}
