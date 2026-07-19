import { loadPlatformDashboard } from "@/lib/platform-console/data";
import { getPlatformOwnerIdentity } from "@/lib/auth/server";
import { PLATFORM_OWNER_EMAIL } from "@/lib/platform-bootstrap";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const [{ health, validation }, owner] = await Promise.all([
    loadPlatformDashboard(),
    getPlatformOwnerIdentity(),
  ]);

  const rows: [string, string][] = [
    [t.pages.settings.owner, owner?.email ?? PLATFORM_OWNER_EMAIL],
    [t.pages.settings.environment, health.environment],
    [t.pages.settings.deployment, health.deploymentStatus],
    [t.pages.settings.bootstrapCompleted, health.bootstrapCompleted ? t.common.yes : t.common.no],
    [t.pages.settings.systemReady, validation.systemReady ? t.common.yes : t.common.no],
  ];

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.settings.title}
        description={t.pages.settings.description}
      />
      <DataTable
        columns={[t.common.setting, t.common.value]}
        rows={rows.map(([key, value]) => [
          <span key="k" className="font-medium text-foreground">
            {key}
          </span>,
          value,
        ])}
      />
      <div>
        <StatusPill label={validation.systemReady ? t.common.systemReady : t.common.notReady} tone={validation.systemReady ? "ok" : "warn"} />
      </div>
    </div>
  );
}
