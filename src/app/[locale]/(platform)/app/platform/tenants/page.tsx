import { loadPlatformTenants } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { EntityManager } from "@/components/platform-console/managers/entity-manager";

export const dynamic = "force-dynamic";

export default async function PlatformTenantsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tenants = await loadPlatformTenants();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Tenants"
        description="Every audit firm is an isolated tenant. Open a company to inspect its full administration workspace."
      />
      <EntityManager entities={tenants} mode="tenant" detailBasePath={`/${locale}/app/platform`} />
    </div>
  );
}
