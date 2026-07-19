import { loadPlatformActivity } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { ActivityCenter } from "@/components/platform-console/activity-center";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformActivityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const events = await loadPlatformActivity();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.activity.title}
        description={t.pages.activity.description}
      />
      <ActivityCenter events={events} />
    </div>
  );
}
