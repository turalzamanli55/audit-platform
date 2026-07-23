import { loadRetentionDashboard } from "@/lib/platform-console/governance-data";
import { PlatformPageHeader, StatCard } from "@/components/platform-console/platform-primitives";
import { PlatformRecycleBinClient } from "@/components/governance/platform-recycle-bin-client";
import { getPlatformLabels } from "@/i18n/platform-labels";
import { governanceLabelsFromPlatform } from "@/lib/object-lifecycle/labels";

export const dynamic = "force-dynamic";

export default async function PlatformRetentionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const { ready, byType, totalReady } = await loadRetentionDashboard();
  const labels = governanceLabelsFromPlatform(t);

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.nav.retention}
        description={t.pages.retention.description}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={t.governance.readyTotal} value={String(totalReady)} tone={totalReady > 0 ? "warn" : "ok"} />
        <StatCard label={t.governance.objectTypes.organization} value={String(byType.organization ?? 0)} />
        <StatCard label={t.governance.objectTypes.engagement} value={String(byType.engagement ?? 0)} />
        <StatCard label={t.governance.objectTypes.company} value={String(byType.company ?? 0)} />
      </div>
      <PlatformRecycleBinClient items={ready} labels={labels} locale={locale} />
    </div>
  );
}
