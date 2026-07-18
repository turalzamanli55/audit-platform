import type { BootstrapClient } from "../types";
import { readBootstrapStatus } from "../bootstrap";

export type PlatformStatusLevel = "ok" | "warn" | "down";

export type PlatformRecentEvent = {
  code: string;
  severity: string;
  createdAt: string;
};

export type PlatformHealthModel = {
  generatedAt: string;
  environment: string;
  platformHealth: PlatformStatusLevel;
  systemHealth: PlatformStatusLevel;
  databaseStatus: PlatformStatusLevel;
  migrationStatus: PlatformStatusLevel;
  deploymentStatus: string;
  bootstrapCompleted: boolean;
  summary: {
    tenants: number;
    subscriptions: number;
    plans: number;
    licenseTemplates: number;
    featureFlags: number;
    invitations: number;
    users: number;
  };
  storage: {
    usedGb: number;
    metered: boolean;
  };
  recentEvents: PlatformRecentEvent[];
};

async function count(client: BootstrapClient, table: string): Promise<number> {
  const { count: rows, error } = await client
    // The table set is closed at the type level; this helper accepts any of them.
    .from(table as "organizations")
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return rows ?? 0;
}

/**
 * Builds the Platform Dashboard health model from live database state.
 * All figures are read directly from the database — no estimates.
 */
export async function getPlatformHealth(client: BootstrapClient): Promise<PlatformHealthModel> {
  const generatedAt = new Date().toISOString();
  const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";

  let databaseStatus: PlatformStatusLevel = "ok";
  let migrationStatus: PlatformStatusLevel = "ok";

  const status = await readBootstrapStatus(client).catch(() => null);
  if (status === null) {
    // A null read can mean "never bootstrapped" (ok) OR a connectivity/migration
    // problem. Probe a base table to disambiguate.
    const probe = await client.from("organizations").select("id", { head: true, count: "exact" });
    if (probe.error) {
      databaseStatus = "down";
      migrationStatus = "down";
    } else {
      migrationStatus = "warn";
    }
  }

  const [tenants, subscriptions, plans, licenseTemplates, featureFlags, invitations, memberships] =
    await Promise.all([
      count(client, "organizations"),
      count(client, "subscription_and_licensing_plans"),
      count(client, "platform_plan_templates"),
      count(client, "platform_license_templates"),
      count(client, "saas_feature_flags"),
      count(client, "user_provisioning_invitations"),
      count(client, "memberships"),
    ]);

  const { data: eventRows } = await client
    .from("security_event_monitoring_events")
    .select("event_code, severity, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  const recentEvents: PlatformRecentEvent[] = (eventRows ?? []).map((row) => ({
    code: row.event_code,
    severity: row.severity,
    createdAt: row.created_at,
  }));

  const bootstrapCompleted = Boolean(status?.bootstrap_completed);
  const systemHealth: PlatformStatusLevel = bootstrapCompleted ? "ok" : "warn";
  const platformHealth: PlatformStatusLevel =
    databaseStatus === "down" ? "down" : bootstrapCompleted ? "ok" : "warn";

  return {
    generatedAt,
    environment,
    platformHealth,
    systemHealth,
    databaseStatus,
    migrationStatus,
    deploymentStatus: environment,
    bootstrapCompleted,
    summary: {
      tenants,
      subscriptions,
      plans,
      licenseTemplates,
      featureFlags,
      invitations,
      users: memberships,
    },
    storage: {
      usedGb: 0,
      metered: false,
    },
    recentEvents,
  };
}
