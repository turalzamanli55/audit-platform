import "server-only";

import { createServiceClient } from "@/lib/supabase/service";
import {
  getPlatformHealth,
  validatePlatformBootstrap,
  type PlatformHealthModel,
  type ValidationReport,
} from "@/lib/platform-bootstrap";

export type PlatformDashboardData = {
  health: PlatformHealthModel;
  validation: ValidationReport;
};

/** Loads the Platform Dashboard model (health + bootstrap validation). */
export async function loadPlatformDashboard(): Promise<PlatformDashboardData> {
  const client = createServiceClient();
  const [health, validation] = await Promise.all([
    getPlatformHealth(client),
    validatePlatformBootstrap(client),
  ]);
  return { health, validation };
}

export type TenantRow = {
  id: string;
  name: string;
  slug: string;
  tenantType: string;
  platformManaged: boolean;
  createdAt: string;
};

/** Lists tenant organizations with their tenant model. */
export async function loadPlatformTenants(): Promise<TenantRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("organizations")
    .select("id, name, slug, tenant_type, platform_owner_managed, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: String(row.slug),
    tenantType: row.tenant_type,
    platformManaged: row.platform_owner_managed,
    createdAt: row.created_at,
  }));
}

export type PlanRow = {
  planCode: string;
  planName: string;
  tenantType: string;
  seatLimit: number;
  isDefault: boolean;
};

/** Lists default subscription plan templates. */
export async function loadPlatformPlans(): Promise<PlanRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("platform_plan_templates")
    .select("plan_code, plan_name, tenant_type, seat_limit, is_default")
    .is("deleted_at", null)
    .order("seat_limit", { ascending: true });

  return (data ?? []).map((row) => ({
    planCode: row.plan_code,
    planName: row.plan_name,
    tenantType: row.tenant_type,
    seatLimit: row.seat_limit,
    isDefault: row.is_default,
  }));
}

export type LicenseRow = {
  licenseCode: string;
  licenseName: string;
  durationDays: number | null;
  isTrial: boolean;
  defaultPlanCode: string | null;
};

/** Lists default license templates. */
export async function loadPlatformLicenses(): Promise<LicenseRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("platform_license_templates")
    .select("license_code, license_name, duration_days, is_trial, default_plan_code")
    .is("deleted_at", null)
    .order("license_code", { ascending: true });

  return (data ?? []).map((row) => ({
    licenseCode: row.license_code,
    licenseName: row.license_name,
    durationDays: row.duration_days,
    isTrial: row.is_trial,
    defaultPlanCode: row.default_plan_code,
  }));
}

export type FeatureFlagRow = {
  flagCode: string;
  flagState: string;
  scope: string;
};

/** Lists feature flags across all scopes. */
export async function loadPlatformFeatureFlags(): Promise<FeatureFlagRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("saas_feature_flags")
    .select("flag_code, flag_state, organization_id, workspace_id, user_id")
    .is("deleted_at", null)
    .order("flag_code", { ascending: true })
    .limit(200);

  return (data ?? []).map((row) => ({
    flagCode: row.flag_code,
    flagState: row.flag_state,
    scope: row.user_id
      ? "user"
      : row.workspace_id
        ? "workspace"
        : row.organization_id
          ? "tenant"
          : "platform",
  }));
}

export type SubscriptionRow = {
  planCode: string;
  tenantType: string;
  subscriptionStatus: string;
  seatLimit: number;
  seatsUsed: number;
};

/** Lists tenant subscription instances. */
export async function loadPlatformSubscriptions(): Promise<SubscriptionRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("subscription_and_licensing_plans")
    .select("plan_code, tenant_type, subscription_status, seat_limit, seats_used")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []).map((row) => ({
    planCode: row.plan_code,
    tenantType: row.tenant_type,
    subscriptionStatus: row.subscription_status,
    seatLimit: row.seat_limit,
    seatsUsed: row.seats_used,
  }));
}

export type InvitationRow = {
  email: string;
  roleSlug: string;
  invitationStatus: string;
  expiresAt: string;
};

/** Lists user provisioning invitations. */
export async function loadPlatformInvitations(): Promise<InvitationRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("user_provisioning_invitations")
    .select("email, role_slug, invitation_status, expires_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []).map((row) => ({
    email: String(row.email),
    roleSlug: row.role_slug,
    invitationStatus: row.invitation_status,
    expiresAt: row.expires_at,
  }));
}

export type SecurityEventRow = {
  eventCode: string;
  severity: string;
  createdAt: string;
};

/** Lists recent security / monitoring events. */
export async function loadPlatformSecurityEvents(): Promise<SecurityEventRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("security_event_monitoring_events")
    .select("event_code, severity, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);

  return (data ?? []).map((row) => ({
    eventCode: row.event_code,
    severity: row.severity,
    createdAt: row.created_at,
  }));
}
