import { loadPlatformFeatureFlags, loadOrganizationOptions } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { FeatureFlagManager } from "@/components/platform-console/managers/feature-flag-manager";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformFeatureFlagsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const [flags, organizations] = await Promise.all([
    loadPlatformFeatureFlags(),
    loadOrganizationOptions(),
  ]);
  // Module access flags are managed on the Modules page; keep them out of here.
  const productFlags = flags.filter((flag) => !flag.flagCode.startsWith("module:"));

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.featureFlags.title}
        description={t.pages.featureFlags.description}
      />
      <FeatureFlagManager flags={productFlags} organizations={organizations} />
    </div>
  );
}
