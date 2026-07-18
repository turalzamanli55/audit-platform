import type { BootstrapClient, ValidationCheck, ValidationReport } from "../types";
import { getPlatformOwnerUserId } from "../owner";
import { readBootstrapStatus } from "../bootstrap";
import { countPlatformRoles } from "../roles";
import { countPlatformPermissions } from "../permissions";
import { countDefaultPlans } from "../plans";
import { countLicenseTemplates } from "../licenses";
import { countDefaultFeatureFlags } from "../feature-flags";
import {
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_LICENSE_TEMPLATES,
  DEFAULT_PLAN_TEMPLATES,
  PLATFORM_PERMISSION_SEEDS,
  PLATFORM_ROLE_SEEDS,
} from "../constants";

/**
 * Validates the platform bootstrap contract. System Ready requires every check
 * to pass: Platform Owner, bootstrap completion, roles, permissions, plans,
 * feature flags, and license templates.
 */
export async function validatePlatformBootstrap(
  client: BootstrapClient,
): Promise<ValidationReport> {
  const [ownerId, statusRow, roles, permissions, plans, licenses, flags] = await Promise.all([
    getPlatformOwnerUserId(client),
    readBootstrapStatus(client),
    countPlatformRoles(client),
    countPlatformPermissions(client),
    countDefaultPlans(client),
    countLicenseTemplates(client),
    countDefaultFeatureFlags(client),
  ]);

  const checks: ValidationCheck[] = [
    {
      key: "owner",
      label: "Platform Owner exists",
      passed: Boolean(ownerId),
      detail: ownerId ? `owner user ${ownerId}` : "no Platform Owner provisioned",
    },
    {
      key: "bootstrap",
      label: "Bootstrap completed",
      passed: Boolean(statusRow?.bootstrap_completed),
      detail: statusRow?.completed_at ? `completed ${statusRow.completed_at}` : "not completed",
    },
    {
      key: "roles",
      label: "Roles seeded",
      passed: roles >= PLATFORM_ROLE_SEEDS.length,
      detail: `${roles}/${PLATFORM_ROLE_SEEDS.length} platform roles`,
    },
    {
      key: "permissions",
      label: "Permissions seeded",
      passed: permissions >= PLATFORM_PERMISSION_SEEDS.length,
      detail: `${permissions}/${PLATFORM_PERMISSION_SEEDS.length} platform permissions`,
    },
    {
      key: "plans",
      label: "Plans seeded",
      passed: plans >= DEFAULT_PLAN_TEMPLATES.length,
      detail: `${plans}/${DEFAULT_PLAN_TEMPLATES.length} default plans`,
    },
    {
      key: "feature_flags",
      label: "Feature Flags seeded",
      passed: flags >= DEFAULT_FEATURE_FLAGS.length,
      detail: `${flags}/${DEFAULT_FEATURE_FLAGS.length} default feature flags`,
    },
    {
      key: "licenses",
      label: "License Templates seeded",
      passed: licenses >= DEFAULT_LICENSE_TEMPLATES.length,
      detail: `${licenses}/${DEFAULT_LICENSE_TEMPLATES.length} default license templates`,
    },
  ];

  const systemReady = checks.every((check) => check.passed);

  return {
    ok: systemReady,
    checkedAt: new Date().toISOString(),
    systemReady,
    checks,
  };
}
