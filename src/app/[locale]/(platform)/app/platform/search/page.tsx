import { loadGlobalSearchIndex } from "@/lib/platform-console/detail-data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { GlobalSearch } from "@/components/platform-console/global-search";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformSearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const items = await loadGlobalSearchIndex();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.search.title}
        description={t.pages.search.description}
      />
      <GlobalSearch items={items} basePath={`/${locale}/app/platform`} />
    </div>
  );
}
