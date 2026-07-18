import { loadOrganizationOptions, loadPlatformFeatureFlags } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { ModuleManager } from "@/components/platform-console/managers/module-manager";

export const dynamic = "force-dynamic";

export default async function PlatformModulesPage() {
  const [organizations, flags] = await Promise.all([
    loadOrganizationOptions(),
    loadPlatformFeatureFlags(),
  ]);
  const moduleFlags = flags.filter((flag) => flag.flagCode.startsWith("module:"));

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Modules"
        description="Enable or disable modules per platform, tenant, workspace, or user. Overrides layer on top of plan entitlements."
      />
      <ModuleManager organizations={organizations} moduleFlags={moduleFlags} />
    </div>
  );
}
