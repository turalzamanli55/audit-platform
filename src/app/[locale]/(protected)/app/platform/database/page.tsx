import { loadPlatformDashboard } from "@/lib/platform-console/data";
import { PlatformPageHeader, StatCard } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

function label(level: string): string {
  if (level === "ok") return "Operational";
  if (level === "warn") return "Attention";
  return "Down";
}

export default async function PlatformDatabasePage() {
  const { health } = await loadPlatformDashboard();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Database"
        description="Database connectivity, migration state, and platform data footprint."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Database Status" value={label(health.databaseStatus)} tone={health.databaseStatus} />
        <StatCard label="Migration Status" value={label(health.migrationStatus)} tone={health.migrationStatus} />
        <StatCard label="Tenants" value={String(health.summary.tenants)} />
        <StatCard label="Subscriptions" value={String(health.summary.subscriptions)} />
        <StatCard label="Plan Templates" value={String(health.summary.plans)} />
        <StatCard label="License Templates" value={String(health.summary.licenseTemplates)} />
        <StatCard label="Feature Flags" value={String(health.summary.featureFlags)} />
        <StatCard label="Invitations" value={String(health.summary.invitations)} />
      </div>
    </div>
  );
}
