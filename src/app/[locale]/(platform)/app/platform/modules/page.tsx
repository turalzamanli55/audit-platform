import { loadOrganizationOptions, loadPlatformFeatureFlags } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { ModuleManager } from "@/components/platform-console/managers/module-manager";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformModulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const [organizations, flags] = await Promise.all([
    loadOrganizationOptions(),
    loadPlatformFeatureFlags(),
  ]);
  const moduleFlags = flags.filter((flag) => flag.flagCode.startsWith("module:"));

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.modules.title}
        description={t.pages.modules.description}
      />
      <ModuleManager organizations={organizations} moduleFlags={moduleFlags} />
    </div>
  );
}
