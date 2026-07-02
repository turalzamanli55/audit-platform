import { RiskHistoryExperience } from "@/components/risk-assessment";
import { getDictionary, type Locale } from "@/i18n";
import { generateRiskAssessmentWorkspaceMetadata } from "@/lib/risk-assessment/risk-assessment-workspace-page";
import { RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadRiskAssessmentWorkspaceCached } from "@/lib/risk-assessment/load-risk-assessment-workspace";
import { loadRiskAssessmentActivityCached } from "@/lib/risk-assessment/load-risk-assessment-activity";

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
  const planningApproved = riskResult.ok ? riskResult.planningApproved : false;
  const activityResult = await loadRiskAssessmentActivityCached(slug);
  const activity = activityResult.ok ? activityResult.activity : { entries: [] };
  return (
    <RiskHistoryExperience
      locale={locale}
      canCreate={canCreate}
      planningApproved={planningApproved}
      emptyLabels={dictionary.riskAssessment.empty}
      workspaceLabels={dictionary.riskAssessment.workspace}
      workflowLabels={dictionary.riskAssessment.workflow}
      archivedReadOnlyLabel={dictionary.riskAssessment.workspace.archivedDescription}
      labels={dictionary.riskAssessment.history}
      activity={activity}
      historyLabels={{
        versionLabel: dictionary.riskAssessment.history.versionLabel,
        updatedLabel: dictionary.riskAssessment.history.updatedLabel,
        actions: dictionary.riskAssessment.history.actions,
      }}
    />
  );
}
