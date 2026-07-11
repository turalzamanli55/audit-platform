import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { FinancialStatementsWorkspaceError, FinancialStatementsWorkspaceShell } from "@/components/financial-statements";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import {
  buildFinancialStatementsWorkspaceNavGroups,
  buildFinancialStatementsWorkspaceNavItems,
} from "@/lib/financial-statements/financial-statements-workspace-display";
import { loadFinancialStatementsWorkspacePage } from "@/lib/financial-statements/financial-statements-workspace-page";

type Props = { children: ReactNode; params: Promise<{ locale: string; slug: string }> };

export default async function ReportingLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.financialStatements.workspace;
  const reportingLabels = dictionary.financialStatements;

  const [engagementResult, reportingResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadFinancialStatementsWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) notFound();

  if (!reportingResult.ok) {
    if (reportingResult.reason === "not_found") notFound();
    if (reportingResult.reason === "forbidden") {
      return (
        <FinancialStatementsWorkspaceError
          title={reportingLabels.forbiddenTitle}
          description={reportingLabels.forbiddenDescription}
        />
      );
    }
    if (reportingResult.reason === "no_workspace") {
      return (
        <FinancialStatementsWorkspaceError
          title={reportingLabels.noWorkspaceTitle}
          description={reportingLabels.noWorkspaceDescription}
        />
      );
    }
    return (
      <FinancialStatementsWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <FinancialStatementsWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialFinancialStatements={reportingResult.financialStatements}
      prerequisitesMet={reportingResult.prerequisitesMet}
      opinionApproved={reportingResult.opinionApproved}
      engagementId={engagementResult.engagement.id}
      navItems={buildFinancialStatementsWorkspaceNavItems(locale, slug, labels)}
      navGroups={buildFinancialStatementsWorkspaceNavGroups(locale, slug, labels)}
      navAriaLabel={labels.navAriaLabel}
      labels={{
        breadcrumbFinancialStatements: labels.breadcrumbFinancialStatements,
        heroEyebrow: labels.heroEyebrow,
        summaryProgress: labels.summaryProgress,
        summaryVersion: labels.summaryVersion,
        summaryPending: labels.summaryPending,
        summaryOutstandingItems: labels.summaryOutstandingItems,
        summaryPendingReviewBadge: labels.summaryPendingReviewBadge,
        backToEngagement: labels.backToEngagement,
        fieldworkGateTitle: labels.fieldworkGateTitle,
        fieldworkGateDescription: labels.fieldworkGateDescription,
        archivedTitle: labels.archivedTitle,
        archivedDescription: labels.archivedDescription,
        progress: labels.progress,
      }}
      statusLabels={reportingLabels.statuses}
      engagementsLabels={dictionary.engagements}
    >
      {children}
    </FinancialStatementsWorkspaceShell>
  );
}
