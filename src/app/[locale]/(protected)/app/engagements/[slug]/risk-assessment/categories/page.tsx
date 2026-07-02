import { RiskCategoriesExperience } from "@/components/risk-assessment";
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
  const planningApproved = riskResult.ok ? riskResult.planningApproved : false;
  const canUpdate = user ? authorizePermissionCodes(user.permissionCodes, RISK_ASSESSMENT_PERMISSIONS.UPDATE) : false;
  return (
    <RiskCategoriesExperience
      locale={locale}
      canCreate={canCreate}
      planningApproved={planningApproved}
      emptyLabels={dictionary.riskAssessment.empty}
      workspaceLabels={dictionary.riskAssessment.workspace}
      workflowLabels={dictionary.riskAssessment.workflow}
      archivedReadOnlyLabel={dictionary.riskAssessment.workspace.archivedDescription}
      canUpdate={canUpdate}
      labels={dictionary.riskAssessment.categories}
      addLabels={{
        namePlaceholder: dictionary.riskAssessment.categories.namePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.categories.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.categories.addAction,
      }}
    />
  );
}
