/**
 * Platform Bootstrap constants — the single Platform Owner, platform roles,
 * platform permissions, and default plan / license / feature-flag catalogs.
 *
 * PROJECT_BIBLE.md is the source of truth: there is exactly ONE Platform Owner
 * who exists ABOVE all tenants and never belongs to any tenant.
 */

export const PLATFORM_OWNER_EMAIL = "admin@owner.dev";

export const PLATFORM_OWNER_METADATA_KEY = "platform_role";
export const PLATFORM_OWNER_METADATA_VALUE = "platform_owner";

export const BOOTSTRAP_PASSWORD_ENV_KEY = "BOOTSTRAP_OWNER_PASSWORD";

export type PlatformRoleSeed = {
  slug: string;
  name: string;
  description: string;
};

/** Platform-scoped system roles (organization_id IS NULL). */
export const PLATFORM_ROLE_SEEDS: PlatformRoleSeed[] = [
  { slug: "platform_owner", name: "Platform Owner", description: "Vendor platform operator with full platform access" },
  { slug: "organization_owner", name: "Organization Owner", description: "Top-level customer tenant administrator" },
  { slug: "organization_admin", name: "Organization Admin", description: "Delegated organization administrator" },
  { slug: "workspace_admin", name: "Workspace Admin", description: "Workspace-level administrator" },
  { slug: "manager", name: "Manager", description: "Operational manager with elevated workspace access" },
  { slug: "member", name: "Member", description: "Standard professional member" },
  { slug: "viewer", name: "Viewer", description: "Read-only member" },
];

export type PlatformPermissionSeed = {
  code: string;
  name: string;
  description: string;
  resource: string;
};

/** Platform-scoped permissions owned exclusively by the Platform Owner. */
export const PLATFORM_PERMISSION_SEEDS: PlatformPermissionSeed[] = [
  { code: "platform.administer", name: "Platform Administration", description: "Full platform operator administration", resource: "platform" },
  { code: "platform.tenants.manage", name: "Manage Tenants", description: "Provision, suspend, and manage tenant organizations", resource: "platform" },
  { code: "platform.licensing.manage", name: "Manage Licensing", description: "Manage plans, licenses, seats, and entitlements", resource: "platform" },
  { code: "platform.billing.manage", name: "Manage Billing", description: "Manage billing configuration and invoices", resource: "platform" },
  { code: "platform.monitoring.read", name: "Read Monitoring", description: "View platform monitoring and security events", resource: "platform" },
  { code: "platform.devops.manage", name: "Manage DevOps", description: "Manage deployment profiles and platform operations", resource: "platform" },
  { code: "platform.feature_flags.manage", name: "Manage Feature Flags", description: "Manage platform, tenant, and workspace feature flags", resource: "platform" },
  { code: "platform.impersonation.execute", name: "Execute Impersonation", description: "Securely impersonate tenant users for support", resource: "platform" },
];

export type PlanTemplateSeed = {
  planCode: string;
  planName: string;
  tenantType: "solo" | "business" | "enterprise";
  seatLimit: number;
  moduleEntitlements: Record<string, boolean>;
  usageLimits: Record<string, number>;
};

/** Default subscription plan templates (one per tenant model). */
export const DEFAULT_PLAN_TEMPLATES: PlanTemplateSeed[] = [
  {
    planCode: "solo",
    planName: "Solo",
    tenantType: "solo",
    seatLimit: 1,
    moduleEntitlements: { planning: true, materiality: true, risk: true, working_papers: true, reporting: true },
    usageLimits: { companies: 5, engagements: 10, storage_gb: 5, workspaces: 1 },
  },
  {
    planCode: "business",
    planName: "Business",
    tenantType: "business",
    seatLimit: 25,
    moduleEntitlements: {
      planning: true, materiality: true, risk: true, working_papers: true,
      lead_sheets: true, reporting: true, financial_statements: true, ifrs_notes: true,
    },
    usageLimits: { companies: 100, engagements: 500, storage_gb: 250, workspaces: 10 },
  },
  {
    planCode: "enterprise",
    planName: "Enterprise",
    tenantType: "enterprise",
    seatLimit: 1000,
    moduleEntitlements: {
      planning: true, materiality: true, risk: true, working_papers: true,
      lead_sheets: true, reporting: true, financial_statements: true, ifrs_notes: true,
      ai: true, ocr: true, import: true, analytics: true,
    },
    usageLimits: { companies: 100000, engagements: 500000, storage_gb: 10000, workspaces: 1000 },
  },
];

export type LicenseTemplateSeed = {
  licenseCode: string;
  licenseName: string;
  durationDays: number | null;
  isTrial: boolean;
  defaultPlanCode: string;
  entitlements: Record<string, string | number | boolean>;
};

/** Default license templates the Platform Owner can assign to tenants. */
export const DEFAULT_LICENSE_TEMPLATES: LicenseTemplateSeed[] = [
  { licenseCode: "trial-30", licenseName: "30-Day Trial", durationDays: 30, isTrial: true, defaultPlanCode: "business", entitlements: { support: "community" } },
  { licenseCode: "annual-standard", licenseName: "Annual Standard", durationDays: 365, isTrial: false, defaultPlanCode: "business", entitlements: { support: "standard" } },
  { licenseCode: "enterprise-perpetual", licenseName: "Enterprise Perpetual", durationDays: null, isTrial: false, defaultPlanCode: "enterprise", entitlements: { support: "premium", white_label: true, sso: true } },
];

export type FeatureFlagSeed = {
  flagCode: string;
  flagState: "enabled" | "disabled" | "preview" | "experimental" | "deprecated";
};

/** Default platform-scoped feature flags (organization_id IS NULL). */
export const DEFAULT_FEATURE_FLAGS: FeatureFlagSeed[] = [
  { flagCode: "ai_workspace", flagState: "preview" },
  { flagCode: "ocr_import", flagState: "enabled" },
  { flagCode: "marketplace", flagState: "experimental" },
  { flagCode: "white_label", flagState: "disabled" },
  { flagCode: "sso_integration", flagState: "disabled" },
  { flagCode: "impersonation", flagState: "enabled" },
  { flagCode: "custom_domain", flagState: "disabled" },
];
