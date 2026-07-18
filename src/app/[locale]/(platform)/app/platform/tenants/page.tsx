import { loadPlatformTenants } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { EntityManager } from "@/components/platform-console/managers/entity-manager";

export const dynamic = "force-dynamic";

export default async function PlatformTenantsPage() {
  const tenants = await loadPlatformTenants();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Tenants"
        description="Every audit firm is an isolated tenant. Create, edit, suspend, activate, archive, and delete tenants here."
      />
      <EntityManager entities={tenants} mode="tenant" />
    </div>
  );
}
