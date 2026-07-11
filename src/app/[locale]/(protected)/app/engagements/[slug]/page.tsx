import { EngagementWorkspaceOverviewExperience } from "@/components/engagement/overview/engagement-workspace-overview-experience";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { generateEngagementWorkspaceMetadata } from "@/lib/engagement/engagement-workspace-page";
import { requireEngagementWorkspace } from "@/lib/engagement/engagement-workspace-page";
import { loadEngagementCommandCenter } from "@/lib/engagement/load-engagement-command-center";
import { loadMaterialityWorkspacePage } from "@/lib/materiality/materiality-workspace-page";
import { loadPlanningWorkspacePage } from "@/lib/planning/planning-workspace-page";
import { loadFieldworkWorkspacePage } from "@/lib/fieldwork/fieldwork-workspace-page";
import { loadReviewWorkspacePage } from "@/lib/review/review-workspace-page";
import { loadCompletionWorkspacePage } from "@/lib/completion/completion-workspace-page";
import { loadReportingWorkspacePage } from "@/lib/reporting/reporting-workspace-page";
import { loadOpinionWorkspacePage } from "@/lib/opinion/opinion-workspace-page";
import { loadFinancialStatementsWorkspacePage } from "@/lib/financial-statements/financial-statements-workspace-page";
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
  const [
    engagement,
    planningResult,
    materialityResult,
    riskAssessmentResult,
    fieldworkResult,
    reviewResult,
    completionResult,
    reportingResult,
    opinionResult,
    financialStatementsResult,
  ] = await Promise.all([
    requireEngagementWorkspace(slug),
    loadPlanningWorkspacePage(slug),
    loadMaterialityWorkspacePage(slug),
    loadRiskAssessmentWorkspacePage(slug),
    loadFieldworkWorkspacePage(slug),
    loadReviewWorkspacePage(slug),
    loadCompletionWorkspacePage(slug),
    loadReportingWorkspacePage(slug),
    loadOpinionWorkspacePage(slug),
    loadFinancialStatementsWorkspacePage(slug),
  ]);

  const canUpdate = user
    ? authorizePermissionCodes(user.permissionCodes, ENGAGEMENT_PERMISSIONS.UPDATE)
    : false;

  const plan = planningResult.ok ? planningResult.plan : null;
  const materiality = materialityResult.ok ? materialityResult.materiality : null;
  const riskAssessment = riskAssessmentResult.ok ? riskAssessmentResult.riskAssessment : null;
  const fieldwork = fieldworkResult.ok ? fieldworkResult.fieldwork : null;
  const review = reviewResult.ok ? reviewResult.review : null;
  const completion = completionResult.ok ? completionResult.completion : null;
  const reporting = reportingResult.ok ? reportingResult.reporting : null;
  const opinion = opinionResult.ok ? opinionResult.opinion : null;
  const financialStatements = financialStatementsResult.ok
    ? financialStatementsResult.financialStatements
    : null;

  const commandCenter = await loadEngagementCommandCenter({
    locale,
    engagement,
    plan,
    materiality,
    riskAssessment,
    fieldwork,
    review,
    completion,
    reporting,
    opinion,
    financialStatements,
    labels: dictionary.engagements.workspace.commandCenter,
    workspaceLabels: dictionary.engagements.workspace,
    engagementsLabels: dictionary.engagements,
    planningLabels: dictionary.planning,
    materialityLabels: dictionary.materiality,
    riskLabels: dictionary.riskAssessment,
    fieldworkLabels: dictionary.fieldwork,
    reviewLabels: dictionary.review,
    completionLabels: dictionary.completion,
    reportingLabels: dictionary.reporting,
    opinionLabels: dictionary.opinion,
    financialStatementsLabels: dictionary.financialStatements,
  });

  return (
    <EngagementWorkspaceOverviewExperience
      locale={locale}
      canUpdate={canUpdate}
      commandCenter={commandCenter}
      labels={dictionary.engagements.workspace}
      engagementsLabels={dictionary.engagements}
      overviewLabels={dictionary.engagements.overview}
    />
  );
}
