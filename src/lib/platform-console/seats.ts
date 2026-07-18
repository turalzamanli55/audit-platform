import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { ValidationError } from "@/lib/errors";

type Service = SupabaseClient<Database>;

export type SeatUsage = {
  subscriptionId: string | null;
  seatLimit: number;
  seatsUsed: number;
  seatsAvailable: number;
};

/**
 * Computes real seat usage for an organization by counting active
 * organization-scoped memberships against the live subscription seat limit.
 * When a company has no subscription there is nothing to enforce.
 */
export async function getSeatUsage(service: Service, organizationId: string): Promise<SeatUsage> {
  const subscription = await service
    .from("subscription_and_licensing_plans")
    .select("id, seat_limit, subscription_status")
    .eq("organization_id", organizationId)
    .is("deleted_at", null)
    .in("subscription_status", ["active", "trial"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const seatLimit = subscription.data?.seat_limit ?? 0;

  const { count } = await service
    .from("memberships")
    .select("user_id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("membership_scope", "organization")
    .is("deleted_at", null);

  const seatsUsed = count ?? 0;

  return {
    subscriptionId: subscription.data?.id ?? null,
    seatLimit,
    seatsUsed,
    seatsAvailable: Math.max(seatLimit - seatsUsed, 0),
  };
}

/**
 * Throws when the company has an active license and no seats remain.
 * Companies without a license are not seat-restricted.
 */
export async function assertSeatAvailable(service: Service, organizationId: string): Promise<SeatUsage> {
  const usage = await getSeatUsage(service, organizationId);
  if (usage.subscriptionId && usage.seatsAvailable <= 0) {
    throw new ValidationError(
      `No seats available (${usage.seatsUsed}/${usage.seatLimit} used). Increase the license seat count or free a seat before adding users.`,
    );
  }
  return usage;
}

/**
 * Re-synchronizes the subscription seat counter with the real membership count.
 * Keeps the Purchased / Used / Available figures accurate after any change.
 */
export async function syncSeatUsage(service: Service, organizationId: string): Promise<void> {
  const usage = await getSeatUsage(service, organizationId);
  if (!usage.subscriptionId) return;
  const clamped = Math.min(usage.seatsUsed, usage.seatLimit);
  await service
    .from("subscription_and_licensing_plans")
    .update({ seats_used: clamped })
    .eq("id", usage.subscriptionId);
}
