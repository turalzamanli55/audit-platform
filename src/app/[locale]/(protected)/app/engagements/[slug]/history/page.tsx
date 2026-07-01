import { EngagementHistoryExperience } from "@/components/engagement/history";
import { EngagementErrorState } from "@/components/engagement";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementActivity } from "@/lib/engagement/load-engagement-activity";
import {
  generateEngagementWorkspaceMetadata,
  requireEngagementWorkspace,
} from "@/lib/engagement/engagement-workspace-page";

type EngagementHistoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: EngagementHistoryPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateEngagementWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function EngagementHistoryPage({ params }: EngagementHistoryPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const engagement = await requireEngagementWorkspace(slug);
  const activityResult = await loadEngagementActivity(engagement.id);

  if (!activityResult.ok) {
    return (
      <EngagementErrorState
        title={dictionary.engagements.history.errorTitle}
        description={dictionary.engagements.history.errorDescription}
      />
    );
  }

  return (
    <EngagementHistoryExperience
      engagement={engagement}
      activity={activityResult.activity}
      locale={locale}
      labels={dictionary.engagements.history}
      engagementsLabels={dictionary.engagements}
    />
  );
}
