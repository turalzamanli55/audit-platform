import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { ValidationError } from "@/lib/errors";
import {
  PLATFORM_OWNER_METADATA_KEY,
  PLATFORM_OWNER_METADATA_VALUE,
} from "@/lib/platform-bootstrap";

/**
 * Enforces tenant-level access at login time.
 *
 * The Platform Owner suspends a tenant by setting `organizations.status`. That
 * status change must actually prevent the tenant's users from authenticating —
 * otherwise "suspend tenant" is cosmetic. This guard is the enforcement point:
 * it runs after Supabase verifies the credentials and blocks any non-owner user
 * whose organizations are all suspended, archived, or soft-deleted.
 *
 * A user with no tenant membership (e.g. immediately after account creation,
 * before onboarding) is allowed through — there is no tenant to gate yet.
 */
export async function assertTenantLoginAllowed(
  service: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  // The Platform Owner lives above all tenants and is never gated by them.
  const { data: userData } = await service.auth.admin.getUserById(userId);
  const metadata = userData.user?.app_metadata as Record<string, unknown> | undefined;
  if (metadata?.[PLATFORM_OWNER_METADATA_KEY] === PLATFORM_OWNER_METADATA_VALUE) {
    return;
  }

  const { data: memberships } = await service
    .from("memberships")
    .select("organization_id, organizations!inner(status, deleted_at)")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .eq("status", "active");

  if (!memberships || memberships.length === 0) {
    return;
  }

  const hasActiveOrganization = memberships.some((row) => {
    const org = (row as { organizations?: { status?: string; deleted_at?: string | null } })
      .organizations;
    return Boolean(org && org.deleted_at === null && org.status === "active");
  });

  if (!hasActiveOrganization) {
    throw new ValidationError(
      "Your organization has been suspended. Contact your platform administrator.",
    );
  }
}
