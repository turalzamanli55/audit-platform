import { loadPlatformSecurityEvents } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

export default async function PlatformAuditLogsPage() {
  const events = await loadPlatformSecurityEvents();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Audit Logs"
        description="Platform-level audit and security event history. Tenant, workspace, and user scopes are captured centrally."
      />
      <DataTable
        columns={["Event", "Severity", "Recorded"]}
        empty="No audit events recorded."
        rows={events.map((event) => [
          <span key="e" className="font-medium text-foreground">
            {event.eventCode}
          </span>,
          <StatusPill
            key="s"
            label={event.severity}
            tone={event.severity === "critical" ? "down" : event.severity === "warning" ? "warn" : "neutral"}
          />,
          new Date(event.createdAt).toLocaleString(),
        ])}
      />
    </div>
  );
}
