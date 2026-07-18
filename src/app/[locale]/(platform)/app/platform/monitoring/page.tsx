import { loadPlatformSecurityEvents } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

function severityTone(severity: string): "ok" | "warn" | "down" | "neutral" {
  if (severity === "critical") return "down";
  if (severity === "warning") return "warn";
  return "neutral";
}

export default async function PlatformMonitoringPage() {
  const events = await loadPlatformSecurityEvents();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Monitoring"
        description="Live platform security and monitoring event stream across all tenants."
      />
      <DataTable
        columns={["Event", "Severity", "Timestamp"]}
        empty="No monitoring events recorded."
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
