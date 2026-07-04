import { RiskAssessmentOverviewExperience } from "@/components/risk-assessment";
import { getDictionary, type Locale } from "@/i18n";
import { generateRiskAssessmentWorkspaceMetadata } from "@/lib/risk-assessment/risk-assessment-workspace-page";
import { RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadRiskAssessmentActivityCached } from "@/lib/risk-assessment/load-risk-assessment-activity";
import { loadRiskAssessmentCommandCenter } from "@/lib/risk-assessment/load-risk-assessment-command-center";
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
  const [riskResult, activityResult] = await Promise.all([
    loadRiskAssessmentWorkspaceCached(slug),
    loadRiskAssessmentActivityCached(slug),
  ]);

  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.CREATE)
    : false;
  const canSubmit = user
    ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.SUBMIT)
    : false;
  const canReview = user
    ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.REVIEW)
    : false;
  const canApprove = user
    ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.APPROVE)
    : false;

  const planningApproved = riskResult.ok ? riskResult.planningApproved : false;
  const riskAssessment = riskResult.ok ? riskResult.riskAssessment : null;
  const activity = activityResult.ok
    ? activityResult.activity
    : { entries: [] };

  const commandCenter = riskAssessment
    ? loadRiskAssessmentCommandCenter({
        locale,
        riskAssessment,
        activity,
        labels: dictionary.riskAssessment.workspace.commandCenter,
        riskLabels: dictionary.riskAssessment,
      })
    : null;

  return (
    <RiskAssessmentOverviewExperience
      locale={locale}
      slug={slug}
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      planningApproved={planningApproved}
      hasRiskAssessment={Boolean(riskAssessment)}
      commandCenter={commandCenter}
      labels={dictionary.riskAssessment.workspace}
      riskLabels={dictionary.riskAssessment}
    />
  );
}
