import { loadPlatformDashboard } from "@/lib/platform-console/data";
import { PlatformPageHeader, StatCard } from "@/components/platform-console/platform-primitives";
import { getPlatformLabels, type PlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

function label(level: string, t: PlatformLabels): string {
  if (level === "ok") return t.common.operational;
  if (level === "warn") return t.common.attention;
  return t.common.down;
}

export default async function PlatformDatabasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const { health } = await loadPlatformDashboard();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.database.title}
        description={t.pages.database.description}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t.pages.database.dbStatus} value={label(health.databaseStatus, t)} tone={health.databaseStatus} />
        <StatCard label={t.pages.database.migrationStatus} value={label(health.migrationStatus, t)} tone={health.migrationStatus} />
        <StatCard label={t.pages.database.tenants} value={String(health.summary.tenants)} />
        <StatCard label={t.pages.database.subscriptions} value={String(health.summary.subscriptions)} />
        <StatCard label={t.pages.database.planTemplates} value={String(health.summary.plans)} />
        <StatCard label={t.pages.database.licenseTemplates} value={String(health.summary.licenseTemplates)} />
        <StatCard label={t.pages.database.featureFlags} value={String(health.summary.featureFlags)} />
        <StatCard label={t.pages.database.invitations} value={String(health.summary.invitations)} />
      </div>
    </div>
  );
}
