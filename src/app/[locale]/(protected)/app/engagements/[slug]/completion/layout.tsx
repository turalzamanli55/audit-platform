import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CompletionWorkspaceError, CompletionWorkspaceShell } from "@/components/completion";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { buildCompletionWorkspaceNavGroups, buildCompletionWorkspaceNavItems } from "@/lib/completion/completion-workspace-display";
import { loadCompletionWorkspacePage } from "@/lib/completion/completion-workspace-page";

type Props = { children: ReactNode; params: Promise<{ locale: string; slug: string }> };

export default async function CompletionLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.completion.workspace;
  const completionLabels = dictionary.completion;

  const [engagementResult, completionResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadCompletionWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) notFound();

  if (!completionResult.ok) {
    if (completionResult.reason === "not_found") notFound();
    if (completionResult.reason === "forbidden") {
      return (
        <CompletionWorkspaceError
          title={completionLabels.forbiddenTitle}
          description={completionLabels.forbiddenDescription}
        />
      );
    }
    if (completionResult.reason === "no_workspace") {
      return (
        <CompletionWorkspaceError
          title={completionLabels.noWorkspaceTitle}
          description={completionLabels.noWorkspaceDescription}
        />
      );
    }
    return (
      <CompletionWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <CompletionWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialReview={completionResult.completion}
      fieldworkStarted={completionResult.prerequisitesMet}
      fieldworkSubstantiallyComplete={completionResult.reviewApproved}
      engagementId={engagementResult.engagement.id}
      navItems={buildCompletionWorkspaceNavItems(locale, slug, labels)}
      navGroups={buildCompletionWorkspaceNavGroups(locale, slug, labels)}
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
      statusLabels={completionLabels.statuses}
      engagementsLabels={dictionary.engagements}
    >
      {children}
    </CompletionWorkspaceShell>
  );
}
