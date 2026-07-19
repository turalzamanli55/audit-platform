import {
  loadPlatformLicenses,
  loadPlatformSubscriptions,
  loadOrganizationOptions,
} from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { LicenseManager } from "@/components/platform-console/managers/license-manager";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformLicensesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const [licenses, subscriptions, organizations] = await Promise.all([
    loadPlatformLicenses(),
    loadPlatformSubscriptions(),
    loadOrganizationOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.licenses.title}
        description={t.pages.licenses.description}
      />
      <LicenseManager licenses={licenses} subscriptions={subscriptions} organizations={organizations} />
    </div>
  );
}
