import type { BootstrapClient, BootstrapStep } from "../types";
import { DEFAULT_FEATURE_FLAGS } from "../constants";

/**
 * Ensures the default platform-scoped feature flags exist. Platform-scoped
 * flags have a null organization / workspace / user (they apply platform-wide).
 */
export async function ensureDefaultFeatureFlags(client: BootstrapClient): Promise<BootstrapStep> {
  const codes = DEFAULT_FEATURE_FLAGS.map((f) => f.flagCode);

  const { data: existing, error: readError } = await client
    .from("saas_feature_flags")
    .select("flag_code")
    .is("organization_id", null)
    .is("workspace_id", null)
    .is("user_id", null)
    .in("flag_code", codes);

  if (readError) {
    return {
      key: "feature_flags",
      label: "Default Feature Flags",
      status: "failed",
      detail: `Failed to read feature flags: ${readError.message}`,
    };
  }

  const existingCodes = new Set((existing ?? []).map((row) => row.flag_code));
  const missing = DEFAULT_FEATURE_FLAGS.filter((f) => !existingCodes.has(f.flagCode));

  if (missing.length === 0) {
    return {
      key: "feature_flags",
      label: "Default Feature Flags",
      status: "verified",
      detail: `${codes.length} default feature flags present`,
    };
  }

  const { error: insertError } = await client.from("saas_feature_flags").insert(
    missing.map((flag) => ({
      flag_code: flag.flagCode,
      flag_state: flag.flagState,
      organization_id: null,
      workspace_id: null,
      user_id: null,
    })),
  );

  if (insertError) {
    return {
      key: "feature_flags",
      label: "Default Feature Flags",
      status: "failed",
      detail: `Failed to seed feature flags: ${insertError.message}`,
    };
  }

  return {
    key: "feature_flags",
    label: "Default Feature Flags",
    status: "created",
    detail: `Seeded ${missing.length} default feature flags`,
  };
}

/** Counts how many default platform feature flags currently exist. */
export async function countDefaultFeatureFlags(client: BootstrapClient): Promise<number> {
  const codes = DEFAULT_FEATURE_FLAGS.map((f) => f.flagCode);
  const { data, error } = await client
    .from("saas_feature_flags")
    .select("flag_code")
    .is("organization_id", null)
    .is("workspace_id", null)
    .is("user_id", null)
    .in("flag_code", codes);
  if (error) return 0;
  return (data ?? []).length;
}
