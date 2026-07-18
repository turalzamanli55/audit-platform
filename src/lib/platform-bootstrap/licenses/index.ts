import type { BootstrapClient, BootstrapStep } from "../types";
import { DEFAULT_LICENSE_TEMPLATES } from "../constants";

/**
 * Ensures the default license templates exist. These are reusable license
 * blueprints the Platform Owner assigns when provisioning tenants.
 */
export async function ensureLicenseTemplates(client: BootstrapClient): Promise<BootstrapStep> {
  const codes = DEFAULT_LICENSE_TEMPLATES.map((l) => l.licenseCode);

  const { data: existing, error: readError } = await client
    .from("platform_license_templates")
    .select("license_code")
    .in("license_code", codes);

  if (readError) {
    return {
      key: "licenses",
      label: "Default License Templates",
      status: "failed",
      detail: `Failed to read license templates: ${readError.message}`,
    };
  }

  const existingCodes = new Set((existing ?? []).map((row) => row.license_code));
  const missing = DEFAULT_LICENSE_TEMPLATES.filter((l) => !existingCodes.has(l.licenseCode));

  if (missing.length === 0) {
    return {
      key: "licenses",
      label: "Default License Templates",
      status: "verified",
      detail: `${codes.length} default license templates present`,
    };
  }

  const { error: insertError } = await client.from("platform_license_templates").insert(
    missing.map((license) => ({
      license_code: license.licenseCode,
      license_name: license.licenseName,
      duration_days: license.durationDays,
      is_trial: license.isTrial,
      default_plan_code: license.defaultPlanCode,
      entitlements: license.entitlements,
      is_default: true,
    })),
  );

  if (insertError) {
    return {
      key: "licenses",
      label: "Default License Templates",
      status: "failed",
      detail: `Failed to seed license templates: ${insertError.message}`,
    };
  }

  return {
    key: "licenses",
    label: "Default License Templates",
    status: "created",
    detail: `Seeded ${missing.length} default license templates`,
  };
}

/** Counts how many default license templates currently exist. */
export async function countLicenseTemplates(client: BootstrapClient): Promise<number> {
  const codes = DEFAULT_LICENSE_TEMPLATES.map((l) => l.licenseCode);
  const { data, error } = await client
    .from("platform_license_templates")
    .select("license_code")
    .in("license_code", codes);
  if (error) return 0;
  return (data ?? []).length;
}
