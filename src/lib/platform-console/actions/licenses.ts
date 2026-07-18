"use server";

import { createPlatformAction } from "../platform-action";
import { recordPlatformEvent } from "../events";
import { ValidationError, NotFoundError } from "@/lib/errors";

export type AssignLicenseInput = {
  organizationId: string;
  licenseCode: string;
};

/**
 * Assigns a license template to a tenant by instantiating a subscription from
 * the template's default plan, computing expiration from the license duration.
 */
export const assignLicenseAction = createPlatformAction<AssignLicenseInput, { subscriptionId: string }>(
  { module: "platform.licenses.assign" },
  async (input, ctx) => {
    if (!input.licenseCode.trim()) throw new ValidationError("License code is required");

    const org = await ctx.service
      .from("organizations")
      .select("id, tenant_type")
      .eq("id", input.organizationId)
      .is("deleted_at", null)
      .maybeSingle();
    if (!org.data) throw new NotFoundError("Organization not found");

    const license = await ctx.service
      .from("platform_license_templates")
      .select("license_code, duration_days, is_trial, default_plan_code")
      .eq("license_code", input.licenseCode.trim())
      .is("deleted_at", null)
      .maybeSingle();
    if (!license.data) throw new NotFoundError("License template not found");

    const planCode = license.data.default_plan_code ?? "business";
    const plan = await ctx.service
      .from("platform_plan_templates")
      .select("tenant_type, seat_limit, module_entitlements, usage_limits")
      .eq("plan_code", planCode)
      .is("deleted_at", null)
      .maybeSingle();

    const endsAt = license.data.duration_days
      ? new Date(Date.now() + license.data.duration_days * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data, error } = await ctx.service
      .from("subscription_and_licensing_plans")
      .insert({
        organization_id: input.organizationId,
        plan_code: planCode,
        tenant_type: plan.data?.tenant_type ?? org.data.tenant_type,
        subscription_status: license.data.is_trial ? "trial" : "active",
        seat_limit: plan.data?.seat_limit ?? 1,
        seats_used: 0,
        ends_at: endsAt,
        trial_ends_at: license.data.is_trial ? endsAt : null,
        module_entitlements: plan.data?.module_entitlements ?? {},
        usage_limits: plan.data?.usage_limits ?? {},
        created_by: ctx.ownerUserId,
        updated_by: ctx.ownerUserId,
      })
      .select("id")
      .single();

    if (error || !data) throw new ValidationError(error?.message ?? "Failed to assign license");

    await recordPlatformEvent(ctx.service, {
      eventCode: "license.assigned",
      actorUserId: ctx.ownerUserId,
      organizationId: input.organizationId,
      details: { licenseCode: input.licenseCode, planCode, endsAt },
    });

    return { subscriptionId: data.id };
  },
);

export const revokeLicenseAction = createPlatformAction<{ subscriptionId: string }, { subscriptionId: string }>(
  { module: "platform.licenses.revoke" },
  async (input, ctx) => {
    const { data, error } = await ctx.service
      .from("subscription_and_licensing_plans")
      .update({
        subscription_status: "cancelled",
        ends_at: new Date().toISOString(),
        updated_by: ctx.ownerUserId,
      })
      .eq("id", input.subscriptionId)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new NotFoundError("Subscription not found");

    await recordPlatformEvent(ctx.service, {
      eventCode: "license.revoked",
      actorUserId: ctx.ownerUserId,
      severity: "warning",
      details: { subscriptionId: input.subscriptionId },
    });

    return { subscriptionId: input.subscriptionId };
  },
);
