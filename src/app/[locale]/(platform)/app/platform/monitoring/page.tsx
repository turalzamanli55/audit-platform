import { loadPlatformSecurityEvents } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

function severityTone(severity: string): "ok" | "warn" | "down" | "neutral" {
  if (severity === "critical") return "down";
  if (severity === "warning") return "warn";
  return "neutral";
}

export default async function PlatformMonitoringPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const events = await loadPlatformSecurityEvents();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.monitoring.title}
        description={t.pages.monitoring.description}
      />
      <DataTable
        columns={[t.common.event, t.common.severity, t.common.timestamp]}
        empty={t.pages.monitoring.empty}
        rows={events.map((event) => [
          <span key="e" className="font-medium text-foreground">
            {event.eventCode}
          </span>,
          <StatusPill key="s" label={event.severity} tone={severityTone(event.severity)} />,
          new Date(event.createdAt).toLocaleString(),
        ])}
      />
    </div>
  );
}
