import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ReviewWorkspaceError, ReviewWorkspaceShell } from "@/components/review";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { buildReviewWorkspaceNavGroups, buildReviewWorkspaceNavItems } from "@/lib/review/review-workspace-display";
import { loadReviewWorkspacePage } from "@/lib/review/review-workspace-page";

type Props = { children: ReactNode; params: Promise<{ locale: string; slug: string }> };

export default async function ReviewLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.review.workspace;
  const reviewLabels = dictionary.review;

  const [engagementResult, reviewResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadReviewWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) notFound();

  if (!reviewResult.ok) {
    if (reviewResult.reason === "not_found") notFound();
    if (reviewResult.reason === "forbidden") {
      return (
        <ReviewWorkspaceError
          title={reviewLabels.forbiddenTitle}
          description={reviewLabels.forbiddenDescription}
        />
      );
    }
    if (reviewResult.reason === "no_workspace") {
      return (
        <ReviewWorkspaceError
          title={reviewLabels.noWorkspaceTitle}
          description={reviewLabels.noWorkspaceDescription}
        />
      );
    }
    return (
      <ReviewWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <ReviewWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialReview={reviewResult.review}
      fieldworkStarted={reviewResult.fieldworkStarted}
      fieldworkSubstantiallyComplete={reviewResult.fieldworkSubstantiallyComplete}
      engagementId={engagementResult.engagement.id}
      navItems={buildReviewWorkspaceNavItems(locale, slug, labels)}
      navGroups={buildReviewWorkspaceNavGroups(locale, slug, labels)}
      navAriaLabel={labels.navAriaLabel}
      labels={{
        breadcrumbReview: labels.breadcrumbReview,
        heroEyebrow: labels.heroEyebrow,
        summaryProgress: labels.summaryProgress,
        summaryVersion: labels.summaryVersion,
        summaryPending: labels.summaryPending,
        summaryOpenFindings: labels.summaryOpenFindings,
        summaryPendingReviewBadge: labels.summaryPendingReviewBadge,
        backToEngagement: labels.backToEngagement,
        fieldworkGateTitle: labels.fieldworkGateTitle,
        fieldworkGateDescription: labels.fieldworkGateDescription,
        archivedTitle: labels.archivedTitle,
        archivedDescription: labels.archivedDescription,
        progress: labels.progress,
      }}
      statusLabels={reviewLabels.statuses}
      engagementsLabels={dictionary.engagements}
    >
      {children}
    </ReviewWorkspaceShell>
  );
}
