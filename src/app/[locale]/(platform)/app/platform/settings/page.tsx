import { loadPlatformDashboard } from "@/lib/platform-console/data";
import { getPlatformOwnerIdentity } from "@/lib/auth/server";
import { PLATFORM_OWNER_EMAIL } from "@/lib/platform-bootstrap";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

export default async function PlatformSettingsPage() {
  const [{ health, validation }, owner] = await Promise.all([
    loadPlatformDashboard(),
    getPlatformOwnerIdentity(),
  ]);

  const rows: [string, string][] = [
    ["Platform Owner", owner?.email ?? PLATFORM_OWNER_EMAIL],
    ["Environment", health.environment],
    ["Deployment", health.deploymentStatus],
    ["Bootstrap Completed", health.bootstrapCompleted ? "Yes" : "No"],
    ["System Ready", validation.systemReady ? "Yes" : "No"],
  ];

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Settings"
        description="Platform-level configuration and the current bootstrap state."
      />
      <DataTable
        columns={["Setting", "Value"]}
        rows={rows.map(([key, value]) => [
          <span key="k" className="font-medium text-foreground">
            {key}
          </span>,
          value,
        ])}
      />
      <div>
        <StatusPill label={validation.systemReady ? "System Ready" : "Not Ready"} tone={validation.systemReady ? "ok" : "warn"} />
      </div>
    </div>
  );
}
