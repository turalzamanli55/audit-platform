import "server-only";

import { createServiceClient } from "@/lib/supabase/service";
import { parseUserAgent } from "./user-agent";
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
  status: string;
  platformManaged: boolean;
  createdAt: string;
};

/** Lists tenant organizations with their tenant model. */
export async function loadPlatformTenants(): Promise<TenantRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("organizations")
    .select("id, name, slug, tenant_type, status, platform_owner_managed, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: String(row.slug),
    tenantType: row.tenant_type,
    status: row.status,
    platformManaged: row.platform_owner_managed,
    createdAt: row.created_at,
  }));
}

export type OrganizationOption = { id: string; name: string };

/** Lightweight organization options for admin form dropdowns. */
export async function loadOrganizationOptions(): Promise<OrganizationOption[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("organizations")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .limit(500);
  return (data ?? []).map((row) => ({ id: row.id, name: row.name }));
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
  id: string;
  flagCode: string;
  flagState: string;
  scope: string;
  organizationId: string | null;
};

/** Lists feature flags across all scopes (including `module:*` flags). */
export async function loadPlatformFeatureFlags(): Promise<FeatureFlagRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("saas_feature_flags")
    .select("id, flag_code, flag_state, organization_id, workspace_id, user_id")
    .is("deleted_at", null)
    .order("flag_code", { ascending: true })
    .limit(200);

  return (data ?? [])
    .map((row) => ({
      id: row.id,
      flagCode: row.flag_code,
      flagState: row.flag_state,
      scope: row.user_id
        ? "user"
        : row.workspace_id
          ? "workspace"
          : row.organization_id
            ? "tenant"
            : "platform",
      organizationId: row.organization_id,
    }));
}

export type SubscriptionRow = {
  id: string;
  organizationId: string;
  planCode: string;
  tenantType: string;
  subscriptionStatus: string;
  seatLimit: number;
  seatsUsed: number;
  endsAt: string | null;
};

/** Lists tenant subscription instances. */
export async function loadPlatformSubscriptions(): Promise<SubscriptionRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("subscription_and_licensing_plans")
    .select("id, organization_id, plan_code, tenant_type, subscription_status, seat_limit, seats_used, ends_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []).map((row) => ({
    id: row.id,
    organizationId: row.organization_id,
    planCode: row.plan_code,
    tenantType: row.tenant_type,
    subscriptionStatus: row.subscription_status,
    seatLimit: row.seat_limit,
    seatsUsed: row.seats_used,
    endsAt: row.ends_at,
  }));
}

export type InvitationRow = {
  id: string;
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
    .select("id, email, role_slug, invitation_status, expires_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []).map((row) => ({
    id: row.id,
    email: String(row.email),
    roleSlug: row.role_slug,
    invitationStatus: row.invitation_status,
    expiresAt: row.expires_at,
  }));
}

export type PlatformUserRow = {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  suspended: boolean;
  isPlatformOwner: boolean;
};

/** Lists auth users via the admin API (first page). */
export async function loadPlatformUsers(): Promise<PlatformUserRow[]> {
  const client = createServiceClient();
  const rows: PlatformUserRow[] = [];
  const perPage = 200;

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });
    if (error) break;
    for (const user of data.users) {
      const metadata = (user.app_metadata ?? {}) as Record<string, unknown>;
      const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
      const bannedUntil = (user as { banned_until?: string | null }).banned_until ?? null;
      rows.push({
        id: user.id,
        email: user.email ?? "—",
        fullName: typeof userMeta.full_name === "string" ? userMeta.full_name : null,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? null,
        suspended: Boolean(bannedUntil && new Date(bannedUntil).getTime() > Date.now()),
        isPlatformOwner: metadata.platform_role === "platform_owner",
      });
    }
    if (data.users.length < perPage) break;
  }

  return rows;
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

export type ActivityRow = {
  id: string;
  eventCode: string;
  severity: string;
  actorEmail: string;
  organizationName: string;
  createdAt: string;
};

/** Rich activity feed (security/audit events) with resolved actor and company. */
export async function loadPlatformActivity(): Promise<ActivityRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("security_event_monitoring_events")
    .select("id, event_code, severity, actor_user_id, organization_id, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = data ?? [];

  const orgIds = Array.from(new Set(rows.map((r) => r.organization_id).filter((v): v is string => Boolean(v))));
  const orgNameById = new Map<string, string>();
  if (orgIds.length > 0) {
    const { data: orgs } = await client.from("organizations").select("id, name").in("id", orgIds);
    for (const org of orgs ?? []) orgNameById.set(org.id, org.name);
  }

  const actorIds = Array.from(new Set(rows.map((r) => r.actor_user_id).filter((v): v is string => Boolean(v))));
  const emailById = new Map<string, string>();
  await Promise.all(
    actorIds.map(async (id) => {
      const { data: user } = await client.auth.admin.getUserById(id);
      if (user.user?.email) emailById.set(id, user.user.email);
    }),
  );

  return rows.map((row) => ({
    id: row.id,
    eventCode: row.event_code,
    severity: row.severity,
    actorEmail: (row.actor_user_id ? emailById.get(row.actor_user_id) : null) ?? "System",
    organizationName: (row.organization_id ? orgNameById.get(row.organization_id) : null) ?? "Platform",
    createdAt: row.created_at,
  }));
}

export type PlatformMetrics = {
  totalTenants: number;
  enterpriseTenants: number;
  businessTenants: number;
  soloTenants: number;
  organizations: number;
  users: number;
  activeSubscriptions: number;
  activeLicenses: number;
  expiredLicenses: number;
  expiringLicenses: number;
  seatsPurchased: number;
  seatsUsed: number;
  seatsAvailable: number;
  securityEvents: number;
  criticalEvents: number;
  auditEvents: number;
  recentLogins: number;
  storageBuckets: number;
  platformVersion: string;
  environment: string;
  databaseHealthy: boolean;
};

type CountableTable =
  | "organizations"
  | "subscription_and_licensing_plans"
  | "security_event_monitoring_events"
  | "audit_logs";

async function countWhere(
  client: ReturnType<typeof createServiceClient>,
  table: CountableTable,
  filter?: { column: string; value: string },
): Promise<number> {
  let query = client.from(table).select("*", { count: "exact", head: true }).is("deleted_at", null);
  if (filter) query = query.eq(filter.column, filter.value);
  const { count, error } = await query;
  return error ? 0 : count ?? 0;
}

/** Real business metrics for the Platform Dashboard (all values read from the database). */
export async function loadPlatformMetrics(): Promise<PlatformMetrics> {
  const client = createServiceClient();
  const { PLATFORM_VERSION } = await import("./version");
  const now = Date.now();
  const in30Days = new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString();
  const nowIso = new Date(now).toISOString();
  const since24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  const [
    totalTenants,
    enterpriseTenants,
    businessTenants,
    soloTenants,
    activeSubscriptions,
    securityEvents,
    criticalEvents,
    auditEvents,
    users,
    subscriptions,
  ] = await Promise.all([
    countWhere(client, "organizations"),
    countWhere(client, "organizations", { column: "tenant_type", value: "enterprise" }),
    countWhere(client, "organizations", { column: "tenant_type", value: "business" }),
    countWhere(client, "organizations", { column: "tenant_type", value: "solo" }),
    countWhere(client, "subscription_and_licensing_plans", { column: "subscription_status", value: "active" }),
    countWhere(client, "security_event_monitoring_events"),
    countWhere(client, "security_event_monitoring_events", { column: "severity", value: "critical" }),
    countWhere(client, "audit_logs"),
    loadPlatformUsers().then((rows) => rows.length),
    loadPlatformSubscriptions(),
  ]);

  // Seat aggregation across non-terminated subscriptions.
  const liveSubs = subscriptions.filter((s) => s.subscriptionStatus !== "cancelled");
  const seatsPurchased = liveSubs.reduce((sum, s) => sum + s.seatLimit, 0);
  const seatsUsed = liveSubs.reduce((sum, s) => sum + s.seatsUsed, 0);
  const seatsAvailable = Math.max(seatsPurchased - seatsUsed, 0);

  // License expiration (real, from subscription ends_at / status).
  const expiredLicenses = subscriptions.filter(
    (s) => s.subscriptionStatus === "expired" || (s.endsAt !== null && s.endsAt < nowIso),
  ).length;
  const expiringLicenses = subscriptions.filter(
    (s) =>
      s.subscriptionStatus !== "cancelled" &&
      s.subscriptionStatus !== "expired" &&
      s.endsAt !== null &&
      s.endsAt >= nowIso &&
      s.endsAt <= in30Days,
  ).length;

  // Recent authentication activity (real login events in the last 24h).
  const recentLoginQuery = await client
    .from("audit_logs")
    .select("id", { count: "exact", head: true })
    .eq("action", "auth.login")
    .gte("created_at", since24h);
  const recentLogins = recentLoginQuery.error ? 0 : recentLoginQuery.count ?? 0;

  // Storage: count of configured storage buckets (real infrastructure metric).
  let storageBuckets = 0;
  try {
    const buckets = await client.storage.listBuckets();
    storageBuckets = buckets.data?.length ?? 0;
  } catch {
    storageBuckets = 0;
  }

  const probe = await client.from("organizations").select("id", { head: true, count: "exact" });

  return {
    totalTenants,
    enterpriseTenants,
    businessTenants,
    soloTenants,
    organizations: totalTenants,
    users,
    activeSubscriptions,
    activeLicenses: activeSubscriptions,
    expiredLicenses,
    expiringLicenses,
    seatsPurchased,
    seatsUsed,
    seatsAvailable,
    securityEvents,
    criticalEvents,
    auditEvents,
    recentLogins,
    storageBuckets,
    platformVersion: PLATFORM_VERSION,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    databaseHealthy: !probe.error,
  };
}

export type LoginHistoryRow = {
  id: string;
  userId: string | null;
  email: string;
  ip: string;
  device: string;
  browser: string;
  result: string;
  createdAt: string;
};

/** Real login history sourced from authentication audit events. */
export async function loadPlatformLoginHistory(): Promise<LoginHistoryRow[]> {
  const client = createServiceClient();
  const { data } = await client
    .from("audit_logs")
    .select("id, user_id, action, ip_address, user_agent, metadata, created_at")
    .in("action", ["auth.login", "auth.logout", "auth.register"])
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];
  const userIds = Array.from(new Set(rows.map((r) => r.user_id).filter((v): v is string => Boolean(v))));
  const emailById = new Map<string, string>();
  await Promise.all(
    userIds.map(async (id) => {
      const { data: user } = await client.auth.admin.getUserById(id);
      if (user.user?.email) emailById.set(id, user.user.email);
    }),
  );

  return rows.map((row) => {
    const { device, browser } = parseUserAgent(row.user_agent);
    const meta = (row.metadata ?? {}) as Record<string, unknown>;
    const metaEmail = typeof meta.email === "string" ? meta.email : null;
    return {
      id: row.id,
      userId: row.user_id,
      email: (row.user_id ? emailById.get(row.user_id) : null) ?? metaEmail ?? "—",
      ip: row.ip_address ? String(row.ip_address) : "—",
      device,
      browser,
      result:
        row.action === "auth.login"
          ? "Success"
          : row.action === "auth.logout"
            ? "Sign-out"
            : "Registered",
      createdAt: row.created_at,
    };
  });
}
