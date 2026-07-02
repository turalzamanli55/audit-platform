import { PlanningOverviewExperience } from "@/components/planning";
import { PLANNING_PERMISSIONS } from "@/constants/planning";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { generatePlanningWorkspaceMetadata } from "@/lib/planning/planning-workspace-page";

type PlanningOverviewPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PlanningOverviewPageProps) {
  const { locale: localeParam, slug } = await params;
  return generatePlanningWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function PlanningOverviewPage({ params }: PlanningOverviewPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const engagementResult = await loadEngagementWorkspacePage(slug);

  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.CREATE)
    : false;
  const canUpdate = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.UPDATE)
    : false;

  return (
    <PlanningOverviewExperience
      locale={locale}
      canCreate={canCreate}
      canUpdate={canUpdate}
      engagementReportingFramework={
        engagementResult.ok ? engagementResult.engagement.reportingFramework : null
      }
      labels={dictionary.planning.workspace}
      planningLabels={dictionary.planning}
    />
  );
}
