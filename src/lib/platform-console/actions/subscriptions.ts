"use server";

import { createPlatformAction } from "../platform-action";
import { recordPlatformEvent } from "../events";
import { ValidationError, NotFoundError } from "@/lib/errors";
import type { Database } from "@/types/supabase";

type SubscriptionUpdate = Database["public"]["Tables"]["subscription_and_licensing_plans"]["Update"];

const TENANT_TYPES = new Set(["solo", "business", "enterprise"]);
const STATUSES = new Set(["trial", "active", "expired", "suspended", "cancelled"]);

export type CreateSubscriptionInput = {
  organizationId: string;
  planCode: string;
  tenantType: string;
  seatLimit: number;
  status?: string;
  endsAt?: string | null;
};

export const createSubscriptionAction = createPlatformAction<CreateSubscriptionInput, { id: string }>(
  { module: "platform.subscriptions.create" },
  async (input, ctx) => {
    if (!input.planCode.trim()) throw new ValidationError("Plan code is required");
    if (!TENANT_TYPES.has(input.tenantType)) throw new ValidationError("Invalid tenant type");
    if (!Number.isInteger(input.seatLimit) || input.seatLimit < 0) {
      throw new ValidationError("Seat limit must be a non-negative integer");
    }
    const status = input.status ?? "active";
    if (!STATUSES.has(status)) throw new ValidationError("Invalid subscription status");

    const org = await ctx.service
      .from("organizations")
      .select("id")
      .eq("id", input.organizationId)
      .is("deleted_at", null)
      .maybeSingle();
    if (!org.data) throw new NotFoundError("Organization not found");

    // Inherit module entitlements / usage limits from a matching plan template.
    const template = await ctx.service
      .from("platform_plan_templates")
      .select("module_entitlements, usage_limits")
      .eq("plan_code", input.planCode.trim())
      .is("deleted_at", null)
      .maybeSingle();

    const { data, error } = await ctx.service
      .from("subscription_and_licensing_plans")
      .insert({
        organization_id: input.organizationId,
        plan_code: input.planCode.trim(),
        tenant_type: input.tenantType,
        subscription_status: status,
        seat_limit: input.seatLimit,
        seats_used: 0,
        ends_at: input.endsAt ?? null,
        module_entitlements: template.data?.module_entitlements ?? {},
        usage_limits: template.data?.usage_limits ?? {},
        created_by: ctx.ownerUserId,
        updated_by: ctx.ownerUserId,
      })
      .select("id")
      .single();

    if (error || !data) throw new ValidationError(error?.message ?? "Failed to create subscription");

    await recordPlatformEvent(ctx.service, {
      eventCode: "subscription.created",
      actorUserId: ctx.ownerUserId,
      organizationId: input.organizationId,
      details: { planCode: input.planCode, seatLimit: input.seatLimit },
    });

    return { id: data.id };
  },
);

export type UpdateSubscriptionInput = {
  id: string;
  planCode?: string;
  seatLimit?: number;
  endsAt?: string | null;
  status?: string;
};

export const updateSubscriptionAction = createPlatformAction<UpdateSubscriptionInput, { id: string }>(
  { module: "platform.subscriptions.update" },
  async (input, ctx) => {
    const patch: SubscriptionUpdate = { updated_by: ctx.ownerUserId };

    if (input.planCode !== undefined) {
      if (!input.planCode.trim()) throw new ValidationError("Plan code cannot be empty");
      patch.plan_code = input.planCode.trim();
    }
    if (input.seatLimit !== undefined) {
      if (!Number.isInteger(input.seatLimit) || input.seatLimit < 0) {
        throw new ValidationError("Seat limit must be a non-negative integer");
      }
      patch.seat_limit = input.seatLimit;
    }
    if (input.endsAt !== undefined) {
      patch.ends_at = input.endsAt;
    }
    if (input.status !== undefined) {
      if (!STATUSES.has(input.status)) throw new ValidationError("Invalid subscription status");
      patch.subscription_status = input.status;
    }

    const { data, error } = await ctx.service
      .from("subscription_and_licensing_plans")
      .update(patch)
      .eq("id", input.id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new NotFoundError("Subscription not found");

    await recordPlatformEvent(ctx.service, {
      eventCode: "subscription.updated",
      actorUserId: ctx.ownerUserId,
      details: { subscriptionId: input.id },
    });

    return { id: input.id };
  },
);

function subscriptionStatusAction(module: string, status: string, eventCode: string, severity: "info" | "warning" = "info") {
  return createPlatformAction<{ id: string }, { id: string }>(
    { module },
    async (input, ctx) => {
      const patch: SubscriptionUpdate = { subscription_status: status, updated_by: ctx.ownerUserId };
      if (status === "expired" || status === "cancelled") {
        patch.ends_at = new Date().toISOString();
      }

      const { data, error } = await ctx.service
        .from("subscription_and_licensing_plans")
        .update(patch)
        .eq("id", input.id)
        .is("deleted_at", null)
        .select("id")
        .maybeSingle();

      if (error) throw new ValidationError(error.message);
      if (!data) throw new NotFoundError("Subscription not found");

      await recordPlatformEvent(ctx.service, {
        eventCode,
        actorUserId: ctx.ownerUserId,
        details: { subscriptionId: input.id },
        severity,
      });

      return { id: input.id };
    },
  );
}

export const pauseSubscriptionAction = subscriptionStatusAction("platform.subscriptions.pause", "suspended", "subscription.paused", "warning");
export const resumeSubscriptionAction = subscriptionStatusAction("platform.subscriptions.resume", "active", "subscription.resumed");
export const expireSubscriptionAction = subscriptionStatusAction("platform.subscriptions.expire", "expired", "subscription.expired", "warning");
export const cancelSubscriptionAction = subscriptionStatusAction("platform.subscriptions.cancel", "cancelled", "subscription.cancelled", "warning");
