import { loadPlatformPlans, loadPlatformTenants } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { EntityManager } from "@/components/platform-console/managers/entity-manager";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformTenantsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const [tenants, plans] = await Promise.all([loadPlatformTenants(), loadPlatformPlans()]);

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.nav.companies}
        description={t.pages.tenants.description}
      />
      <EntityManager
        entities={tenants}
        mode="tenant"
        detailBasePath={`/${locale}/app/platform`}
        plans={plans}
      />
    </div>
  );
}
