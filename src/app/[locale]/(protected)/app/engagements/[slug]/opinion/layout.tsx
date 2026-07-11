import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { OpinionWorkspaceError, OpinionWorkspaceShell } from "@/components/opinion";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import {
  buildOpinionWorkspaceNavGroups,
  buildOpinionWorkspaceNavItems,
} from "@/lib/opinion/opinion-workspace-display";
import { loadOpinionWorkspacePage } from "@/lib/opinion/opinion-workspace-page";

type Props = { children: ReactNode; params: Promise<{ locale: string; slug: string }> };

export default async function ReportingLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.opinion.workspace;
  const reportingLabels = dictionary.opinion;

  const [engagementResult, reportingResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadOpinionWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) notFound();

  if (!reportingResult.ok) {
    if (reportingResult.reason === "not_found") notFound();
    if (reportingResult.reason === "forbidden") {
      return (
        <OpinionWorkspaceError
          title={reportingLabels.forbiddenTitle}
          description={reportingLabels.forbiddenDescription}
        />
      );
    }
    if (reportingResult.reason === "no_workspace") {
      return (
        <OpinionWorkspaceError
          title={reportingLabels.noWorkspaceTitle}
          description={reportingLabels.noWorkspaceDescription}
        />
      );
    }
    return (
      <OpinionWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <OpinionWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialOpinion={reportingResult.opinion}
      prerequisitesMet={reportingResult.prerequisitesMet}
      reportingApproved={reportingResult.reportingApproved}
      engagementId={engagementResult.engagement.id}
      navItems={buildOpinionWorkspaceNavItems(locale, slug, labels)}
      navGroups={buildOpinionWorkspaceNavGroups(locale, slug, labels)}
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
    </OpinionWorkspaceShell>
  );
}
