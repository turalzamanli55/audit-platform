import { RiskAssessmentOverviewExperience } from "@/components/risk-assessment";
import { getDictionary, type Locale } from "@/i18n";
import { generateRiskAssessmentWorkspaceMetadata } from "@/lib/risk-assessment/risk-assessment-workspace-page";
import { RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadRiskAssessmentWorkspaceCached } from "@/lib/risk-assessment/load-risk-assessment-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateRiskAssessmentWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const riskResult = await loadRiskAssessmentWorkspaceCached(slug);
  const canCreate = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.CREATE) : false;
  const canSubmit = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.SUBMIT) : false;
  const canReview = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.REVIEW) : false;
  const canApprove = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.APPROVE) : false;
  const planningApproved = riskResult.ok ? riskResult.planningApproved : false;
  return (
    <RiskAssessmentOverviewExperience
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      planningApproved={planningApproved}
      unratedLabel={dictionary.riskAssessment.heatmap.unratedLabel}
      workspaceLabels={dictionary.riskAssessment.workspace}
      createLabels={dictionary.riskAssessment.empty}
      statusLabels={dictionary.riskAssessment.statuses}
      labels={{
        title: dictionary.riskAssessment.workspace.title,
        description: dictionary.riskAssessment.workspace.description,
        statusTitle: dictionary.riskAssessment.workspace.statusTitle,
        statusDescription: dictionary.riskAssessment.workspace.statusDescription,
        progress: dictionary.riskAssessment.workspace.progress,
        workflowTitle: dictionary.riskAssessment.workspace.workflowTitle,
        workflowDescription: dictionary.riskAssessment.workspace.workflowDescription,
        heatmapPreviewTitle: dictionary.riskAssessment.workspace.heatmapPreviewTitle,
        heatmapPreviewDescription: dictionary.riskAssessment.workspace.heatmapPreviewDescription,
      }}
      workflowLabels={dictionary.riskAssessment.workflow}
      ratingLabels={dictionary.riskAssessment.ratingLevels}
    />
  );
}
