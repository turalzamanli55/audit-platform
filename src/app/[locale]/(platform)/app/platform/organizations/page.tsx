import { loadPlatformTenants } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { EntityManager } from "@/components/platform-console/managers/entity-manager";

export const dynamic = "force-dynamic";

export default async function PlatformOrganizationsPage() {
  const organizations = await loadPlatformTenants();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Organizations"
        description="Organization records back every tenant. Create, edit, archive, restore, and delete organizations here."
      />
      <EntityManager entities={organizations} mode="organization" />
    </div>
  );
}
