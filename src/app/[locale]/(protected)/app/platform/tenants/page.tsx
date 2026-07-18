import { loadPlatformTenants } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

export default async function PlatformTenantsPage() {
  const tenants = await loadPlatformTenants();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Tenants"
        description="Every audit firm is an isolated tenant. The Platform Owner provisions, configures, and manages all tenants."
      />
      <DataTable
        columns={["Tenant", "Slug", "Model", "Managed", "Created"]}
        empty="No tenants provisioned yet."
        rows={tenants.map((tenant) => [
          <span key="n" className="font-medium text-foreground">
            {tenant.name}
          </span>,
          <span key="s" className="text-muted-foreground">
            {tenant.slug}
          </span>,
          <StatusPill key="t" label={tenant.tenantType} tone="neutral" />,
          tenant.platformManaged ? "Yes" : "No",
          new Date(tenant.createdAt).toLocaleDateString(),
        ])}
      />
    </div>
  );
}
