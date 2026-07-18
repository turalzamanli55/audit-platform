import { loadPlatformTenants } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

export default async function PlatformOrganizationsPage() {
  const organizations = await loadPlatformTenants();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Organizations"
        description="Organization records backing every tenant. Managed exclusively by the Platform Owner."
      />
      <DataTable
        columns={["Organization", "Slug", "Tenant Model", "Platform Managed"]}
        empty="No organizations yet."
        rows={organizations.map((org) => [
          <span key="n" className="font-medium text-foreground">
            {org.name}
          </span>,
          <span key="s" className="text-muted-foreground">
            {org.slug}
          </span>,
          <StatusPill key="t" label={org.tenantType} tone="neutral" />,
          org.platformManaged ? "Yes" : "No",
        ])}
      />
    </div>
  );
}
