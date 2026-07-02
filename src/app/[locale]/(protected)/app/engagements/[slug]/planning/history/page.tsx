import { PlanningHistoryExperience } from "@/components/planning";
import { getDictionary, type Locale } from "@/i18n";
import { loadPlanningActivityCached } from "@/lib/planning/load-planning-activity";
import { loadPlanningWorkspaceCached } from "@/lib/planning/load-planning-workspace";
import { generatePlanningWorkspaceMetadata } from "@/lib/planning/planning-workspace-page";

type PlanningHistoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PlanningHistoryPageProps) {
  const { locale: localeParam, slug } = await params;
  return generatePlanningWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function PlanningHistoryPage({ params }: PlanningHistoryPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  const [planningResult, activityResult] = await Promise.all([
    loadPlanningWorkspaceCached(slug),
    loadPlanningActivityCached(slug),
  ]);

  const plan = planningResult.ok ? planningResult.plan : null;
  const activity = activityResult.ok
    ? activityResult.activity
    : { entries: [], summary: { total: 0, created: 0, updated: 0, archived: 0, restored: 0 } };

  return (
    <PlanningHistoryExperience
      plan={plan}
      activity={activity}
      locale={locale}
      labels={dictionary.planning.history}
    />
  );
}
