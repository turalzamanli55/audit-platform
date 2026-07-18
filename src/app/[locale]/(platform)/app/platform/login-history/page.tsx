import { loadPlatformLoginHistory } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

function resultTone(result: string): "ok" | "warn" | "down" | "neutral" {
  if (result === "Success") return "ok";
  if (result === "Sign-out") return "neutral";
  if (result === "Registered") return "warn";
  return "down";
}

export default async function PlatformLoginHistoryPage() {
  const events = await loadPlatformLoginHistory();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Login History"
        description="Real authentication events across every tenant, sourced from the audit log."
      />
      <DataTable
        columns={["Date", "User", "IP", "Device", "Browser", "Result"]}
        empty="No authentication events recorded yet."
        rows={events.map((event) => [
          new Date(event.createdAt).toLocaleString(),
          <span key="u" className="font-medium text-foreground">
            {event.email}
          </span>,
          <span key="ip" className="text-muted-foreground">
            {event.ip}
          </span>,
          event.device,
          event.browser,
          <StatusPill key="r" label={event.result} tone={resultTone(event.result)} />,
        ])}
      />
    </div>
  );
}
