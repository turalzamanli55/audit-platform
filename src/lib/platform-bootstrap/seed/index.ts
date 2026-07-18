import type { BootstrapClient, BootstrapStep } from "../types";
import { ensurePlatformPermissions } from "../permissions";
import { ensurePlatformRoles } from "../roles";
import { ensureDefaultPlans } from "../plans";
import { ensureLicenseTemplates } from "../licenses";
import { ensureDefaultFeatureFlags } from "../feature-flags";

/**
 * Runs the platform seed steps in dependency order:
 * permissions → roles (grants) → plans → licenses → feature flags.
 * Every step is idempotent.
 */
export async function runPlatformSeed(client: BootstrapClient): Promise<BootstrapStep[]> {
  const permissions = await ensurePlatformPermissions(client);
  const roles = await ensurePlatformRoles(client);
  const plans = await ensureDefaultPlans(client);
  const licenses = await ensureLicenseTemplates(client);
  const featureFlags = await ensureDefaultFeatureFlags(client);

  return [permissions, roles, plans, licenses, featureFlags];
}
