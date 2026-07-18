import type { BootstrapClient, BootstrapStep } from "../types";
import { DEFAULT_PLAN_TEMPLATES } from "../constants";

/**
 * Ensures the default subscription plan templates exist (solo / business /
 * enterprise). These are platform-global blueprints, not tenant plan instances.
 */
export async function ensureDefaultPlans(client: BootstrapClient): Promise<BootstrapStep> {
  const codes = DEFAULT_PLAN_TEMPLATES.map((p) => p.planCode);

  const { data: existing, error: readError } = await client
    .from("platform_plan_templates")
    .select("plan_code")
    .in("plan_code", codes);

  if (readError) {
    return {
      key: "plans",
      label: "Default Plans",
      status: "failed",
      detail: `Failed to read plan templates: ${readError.message}`,
    };
  }

  const existingCodes = new Set((existing ?? []).map((row) => row.plan_code));
  const missing = DEFAULT_PLAN_TEMPLATES.filter((p) => !existingCodes.has(p.planCode));

  if (missing.length === 0) {
    return {
      key: "plans",
      label: "Default Plans",
      status: "verified",
      detail: `${codes.length} default plan templates present`,
    };
  }

  const { error: insertError } = await client.from("platform_plan_templates").insert(
    missing.map((plan) => ({
      plan_code: plan.planCode,
      plan_name: plan.planName,
      tenant_type: plan.tenantType,
      seat_limit: plan.seatLimit,
      module_entitlements: plan.moduleEntitlements,
      usage_limits: plan.usageLimits,
      is_default: true,
    })),
  );

  if (insertError) {
    return {
      key: "plans",
      label: "Default Plans",
      status: "failed",
      detail: `Failed to seed plan templates: ${insertError.message}`,
    };
  }

  return {
    key: "plans",
    label: "Default Plans",
    status: "created",
    detail: `Seeded ${missing.length} default plan templates`,
  };
}

/** Counts how many default plan templates currently exist. */
export async function countDefaultPlans(client: BootstrapClient): Promise<number> {
  const codes = DEFAULT_PLAN_TEMPLATES.map((p) => p.planCode);
  const { data, error } = await client
    .from("platform_plan_templates")
    .select("plan_code")
    .in("plan_code", codes);
  if (error) return 0;
  return (data ?? []).length;
}
