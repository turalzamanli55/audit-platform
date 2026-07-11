import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ReportingWorkspaceError, ReportingWorkspaceShell } from "@/components/reporting";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import {
  buildReportingWorkspaceNavGroups,
  buildReportingWorkspaceNavItems,
} from "@/lib/reporting/reporting-workspace-display";
import { loadReportingWorkspacePage } from "@/lib/reporting/reporting-workspace-page";

type Props = { children: ReactNode; params: Promise<{ locale: string; slug: string }> };

export default async function ReportingLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.reporting.workspace;
  const reportingLabels = dictionary.reporting;

  const [engagementResult, reportingResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadReportingWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) notFound();

  if (!reportingResult.ok) {
    if (reportingResult.reason === "not_found") notFound();
    if (reportingResult.reason === "forbidden") {
      return (
        <ReportingWorkspaceError
          title={reportingLabels.forbiddenTitle}
          description={reportingLabels.forbiddenDescription}
        />
      );
    }
    if (reportingResult.reason === "no_workspace") {
      return (
        <ReportingWorkspaceError
          title={reportingLabels.noWorkspaceTitle}
          description={reportingLabels.noWorkspaceDescription}
        />
      );
    }
    return (
      <ReportingWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <ReportingWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialReporting={reportingResult.reporting}
      prerequisitesMet={reportingResult.prerequisitesMet}
      completionApproved={reportingResult.completionApproved}
      engagementId={engagementResult.engagement.id}
      navItems={buildReportingWorkspaceNavItems(locale, slug, labels)}
      navGroups={buildReportingWorkspaceNavGroups(locale, slug, labels)}
      navAriaLabel={labels.navAriaLabel}
      labels={{
        breadcrumbReview: labels.breadcrumbReview,
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
    </ReportingWorkspaceShell>
  );
}
