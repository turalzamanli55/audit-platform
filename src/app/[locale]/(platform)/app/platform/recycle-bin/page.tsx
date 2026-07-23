import { loadPlatformRecycleBin } from "@/lib/platform-console/governance-data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { PlatformRecycleBinClient } from "@/components/governance/platform-recycle-bin-client";
import { getPlatformLabels } from "@/i18n/platform-labels";
import { governanceLabelsFromPlatform } from "@/lib/object-lifecycle/labels";

export const dynamic = "force-dynamic";

export default async function PlatformRecycleBinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const items = await loadPlatformRecycleBin({ limit: 200 });

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.nav.recycleBin}
        description={t.pages.recycleBin.description}
      />
      <PlatformRecycleBinClient
        items={items}
        labels={governanceLabelsFromPlatform(t)}
        locale={locale}
      />
    </div>
  );
}
