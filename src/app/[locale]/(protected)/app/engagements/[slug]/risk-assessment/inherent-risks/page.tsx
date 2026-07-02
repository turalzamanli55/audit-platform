import { RiskRegisterExperience } from "@/components/risk-assessment";
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
    <RiskRegisterExperience
      locale={locale}
      canCreate={canCreate}
      planningApproved={planningApproved}
      emptyLabels={dictionary.riskAssessment.empty}
      workspaceLabels={dictionary.riskAssessment.workspace}
      workflowLabels={dictionary.riskAssessment.workflow}
      archivedReadOnlyLabel={dictionary.riskAssessment.workspace.archivedDescription}
      canUpdate={canUpdate}
      labels={dictionary.riskAssessment.inherentRisks}
      riskType="inherent"
      maps={{
        riskTypes: dictionary.riskAssessment.riskTypes,
        ratings: dictionary.riskAssessment.ratingLevels,
        likelihoods: dictionary.riskAssessment.likelihoods,
        impacts: dictionary.riskAssessment.impacts,
        assertions: dictionary.riskAssessment.assertions,
        responseTypes: dictionary.riskAssessment.responseTypes,
        noteTypes: dictionary.riskAssessment.noteTypes,
      }}
      addLabels={{
        titlePlaceholder: dictionary.riskAssessment.inherentRisks.titlePlaceholder,
        descriptionPlaceholder: dictionary.riskAssessment.inherentRisks.descriptionPlaceholder,
        addAction: dictionary.riskAssessment.inherentRisks.addAction,
        categoryLabel: dictionary.riskAssessment.inherentRisks.categoryLabel,
        riskTypeLabel: dictionary.riskAssessment.inherentRisks.riskTypeLabel,
        likelihoodLabel: dictionary.riskAssessment.inherentRisks.likelihoodLabel,
        impactLabel: dictionary.riskAssessment.inherentRisks.impactLabel,
        inherentRatingLabel: dictionary.riskAssessment.inherentRisks.inherentRatingLabel,
      }}
    />
  );
}
