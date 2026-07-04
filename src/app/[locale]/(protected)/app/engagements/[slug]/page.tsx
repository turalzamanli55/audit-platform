import { EngagementWorkspaceOverviewExperience } from "@/components/engagement/overview/engagement-workspace-overview-experience";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { generateEngagementWorkspaceMetadata } from "@/lib/engagement/engagement-workspace-page";
import { loadMaterialityWorkspacePage } from "@/lib/materiality/materiality-workspace-page";
import { loadPlanningWorkspacePage } from "@/lib/planning/planning-workspace-page";
import { loadFieldworkWorkspacePage } from "@/lib/fieldwork/fieldwork-workspace-page";
import { loadRiskAssessmentWorkspacePage } from "@/lib/risk-assessment/risk-assessment-workspace-page";

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
  const [planningResult, materialityResult, riskAssessmentResult, fieldworkResult] = await Promise.all([
    loadPlanningWorkspacePage(slug),
    loadMaterialityWorkspacePage(slug),
    loadRiskAssessmentWorkspacePage(slug),
    loadFieldworkWorkspacePage(slug),
  ]);
  const canUpdate = user
    ? authorizePermissionCodes(user.permissionCodes, ENGAGEMENT_PERMISSIONS.UPDATE)
    : false;

  const plan = planningResult.ok ? planningResult.plan : null;
  const materiality = materialityResult.ok ? materialityResult.materiality : null;
  const riskAssessment = riskAssessmentResult.ok ? riskAssessmentResult.riskAssessment : null;
  const fieldwork = fieldworkResult.ok ? fieldworkResult.fieldwork : null;

  return (
    <EngagementWorkspaceOverviewExperience
      locale={locale}
      canUpdate={canUpdate}
      plan={plan}
      materiality={materiality}
      riskAssessment={riskAssessment}
      fieldwork={fieldwork}
      labels={dictionary.engagements.workspace}
      engagementsLabels={dictionary.engagements}
      overviewLabels={dictionary.engagements.overview}
      planningLabels={dictionary.planning}
      materialityLabels={dictionary.materiality}
      riskLabels={dictionary.riskAssessment}
      fieldworkLabels={dictionary.fieldwork}
    />
  );
}
