import { loadPlatformDashboard } from "@/lib/platform-console/data";
import {
  DataTable,
  PlatformPageHeader,
  PlatformSection,
  StatCard,
} from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

export default async function PlatformDevOpsPage() {
  const { health } = await loadPlatformDashboard();

  const profiles = [
    { name: "Cloud SaaS", detail: "Shared multi-tenant hosting" },
    { name: "Dedicated Cloud", detail: "Isolated single-tenant hosting" },
    { name: "On-Premise", detail: "Customer-managed deployment" },
  ];

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="DevOps"
        description="Deployment profile and platform operations. The same codebase serves every deployment profile."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Environment" value={health.environment} tone="neutral" />
        <StatCard label="Deployment" value={health.deploymentStatus} tone="neutral" />
        <StatCard label="Bootstrap" value={health.bootstrapCompleted ? "Complete" : "Pending"} tone={health.bootstrapCompleted ? "ok" : "warn"} />
      </div>
      <PlatformSection title="Supported Deployment Profiles">
        <DataTable
          columns={["Profile", "Description"]}
          rows={profiles.map((profile) => [
            <span key="n" className="font-medium text-foreground">
              {profile.name}
            </span>,
            <span key="d" className="text-muted-foreground">
              {profile.detail}
            </span>,
          ])}
        />
      </PlatformSection>
    </div>
  );
}
