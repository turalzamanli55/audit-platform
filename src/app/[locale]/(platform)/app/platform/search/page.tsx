import { loadGlobalSearchIndex } from "@/lib/platform-console/detail-data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { GlobalSearch } from "@/components/platform-console/global-search";

export const dynamic = "force-dynamic";

export default async function PlatformSearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await loadGlobalSearchIndex();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Global Search"
        description="Instantly search every company, user, organization, workspace, engagement, invitation, license, and event."
      />
      <GlobalSearch items={items} basePath={`/${locale}/app/platform`} />
    </div>
  );
}
