import {
  loadPlatformLicenses,
  loadPlatformSubscriptions,
  loadOrganizationOptions,
} from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { LicenseManager } from "@/components/platform-console/managers/license-manager";

export const dynamic = "force-dynamic";

export default async function PlatformLicensesPage() {
  const [licenses, subscriptions, organizations] = await Promise.all([
    loadPlatformLicenses(),
    loadPlatformSubscriptions(),
    loadOrganizationOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Licenses"
        description="Assign license templates to tenants, compute seat usage and expiration, and revoke licenses."
      />
      <LicenseManager licenses={licenses} subscriptions={subscriptions} organizations={organizations} />
    </div>
  );
}
