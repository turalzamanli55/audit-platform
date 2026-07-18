import { loadPlatformFeatureFlags, loadOrganizationOptions } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { FeatureFlagManager } from "@/components/platform-console/managers/feature-flag-manager";

export const dynamic = "force-dynamic";

export default async function PlatformFeatureFlagsPage() {
  const [flags, organizations] = await Promise.all([
    loadPlatformFeatureFlags(),
    loadOrganizationOptions(),
  ]);
  // Module access flags are managed on the Modules page; keep them out of here.
  const productFlags = flags.filter((flag) => !flag.flagCode.startsWith("module:"));

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Feature Flags"
        description="Create, enable, disable, and retire platform and tenant scoped feature flags. Changes apply immediately."
      />
      <FeatureFlagManager flags={productFlags} organizations={organizations} />
    </div>
  );
}
