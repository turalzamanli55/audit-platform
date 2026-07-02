import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { RiskAssessmentWorkspaceError, RiskAssessmentWorkspaceShell } from "@/components/risk-assessment";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { buildRiskAssessmentWorkspaceNavItems } from "@/lib/risk-assessment/risk-assessment-workspace-display";
import { loadRiskAssessmentWorkspacePage } from "@/lib/risk-assessment/risk-assessment-workspace-page";

type Props = { children: ReactNode; params: Promise<{ locale: string; slug: string }> };

export default async function RiskAssessmentLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.riskAssessment.workspace;
  const riskLabels = dictionary.riskAssessment;

  const [engagementResult, riskResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadRiskAssessmentWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) notFound();

  if (!riskResult.ok) {
    if (riskResult.reason === "not_found") notFound();
    if (riskResult.reason === "forbidden") {
      return (
        <RiskAssessmentWorkspaceError
          title={riskLabels.forbiddenTitle}
          description={riskLabels.forbiddenDescription}
        />
      );
    }
    if (riskResult.reason === "no_workspace") {
      return (
        <RiskAssessmentWorkspaceError
          title={riskLabels.noWorkspaceTitle}
          description={riskLabels.noWorkspaceDescription}
        />
      );
    }
    return (
      <RiskAssessmentWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <RiskAssessmentWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialRiskAssessment={riskResult.riskAssessment}
      planningApproved={riskResult.planningApproved}
      engagementId={engagementResult.engagement.id}
      navItems={buildRiskAssessmentWorkspaceNavItems(locale, slug, labels)}
      navAriaLabel={labels.navAriaLabel}
      labels={labels}
      riskLabels={riskLabels}
      statusLabels={riskLabels.statuses}
      engagementsLabels={dictionary.engagements}
    >
      {children}
    </RiskAssessmentWorkspaceShell>
  );
}
