import { EngagementWorkspaceOverviewExperience } from "@/components/engagement/overview/engagement-workspace-overview-experience";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { generateEngagementWorkspaceMetadata } from "@/lib/engagement/engagement-workspace-page";
import { loadPlanningWorkspacePage } from "@/lib/planning/planning-workspace-page";

type EngagementWorkspaceOverviewPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: EngagementWorkspaceOverviewPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateEngagementWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function EngagementWorkspaceOverviewPage({
  params,
}: EngagementWorkspaceOverviewPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const planningResult = await loadPlanningWorkspacePage(slug);
  const canUpdate = user
    ? authorizePermissionCodes(user.permissionCodes, ENGAGEMENT_PERMISSIONS.UPDATE)
    : false;

  const plan = planningResult.ok ? planningResult.plan : null;

  return (
    <EngagementWorkspaceOverviewExperience
      locale={locale}
      canUpdate={canUpdate}
      plan={plan}
      labels={dictionary.engagements.workspace}
      engagementsLabels={dictionary.engagements}
      overviewLabels={dictionary.engagements.overview}
      planningLabels={dictionary.planning}
    />
  );
}
