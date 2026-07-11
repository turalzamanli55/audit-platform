import { EngagementBreadcrumb } from "@/components/engagement";
import {
  WorkspaceBackLink,
  WorkspaceHero,
  WorkspaceNoticeBanner,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import { formatReviewCount } from "@/lib/financial-statements/financial-statements-workspace-display";
import type { FinancialStatementsWorkspaceView } from "@/lib/financial-statements/financial-statements-workspace-view";

type ReviewHeroLabels = {
  breadcrumbFinancialStatements: string;
  heroEyebrow: string;
  summaryProgress: string;
  summaryVersion: string;
  summaryPending: string;
  summaryOutstandingItems: string;
  summaryPendingReviewBadge: string;
  backToEngagement: string;
  fieldworkGateTitle: string;
  fieldworkGateDescription: string;
  archivedTitle: string;
  archivedDescription: string;
  progress: string;
};

type FinancialStatementsWorkspaceHeroProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  review: FinancialStatementsWorkspaceView | null;
  fieldworkStarted: boolean;
  labels: ReviewHeroLabels;
  statusLabels: Record<string, string>;
  engagementsLabels: { breadcrumbRoot: string };
};

export function FinancialStatementsWorkspaceHero({
  locale,
  engagementSlug,
  engagementName,
  review,
  fieldworkStarted,
  labels,
  statusLabels,
  engagementsLabels,
}: FinancialStatementsWorkspaceHeroProps) {
  const engagementsPath = `/${locale}/app/engagements`;
  const engagementPath = `${engagementsPath}/${engagementSlug}`;

  const statusVariant =
    review?.packageStatus === "approved"
      ? "success"
      : review?.packageStatus === "submitted" || review?.packageStatus === "under_review"
        ? "warning"
        : review?.packageStatus === "returned"
          ? "destructive"
          : "secondary";

  const alerts = (
    <>
      {!fieldworkStarted ? (
        <WorkspaceNoticeBanner
          title={labels.fieldworkGateTitle}
          description={labels.fieldworkGateDescription}
        />
      ) : null}
      {review?.isArchived ? (
        <WorkspaceNoticeBanner
          title={labels.archivedTitle}
          description={labels.archivedDescription}
        />
      ) : null}
    </>
  );

  return (
    <WorkspaceHero
      breadcrumb={
        <EngagementBreadcrumb
          items={[
            { label: engagementsLabels.breadcrumbRoot, href: engagementsPath },
            { label: engagementName, href: engagementPath },
            { label: labels.breadcrumbFinancialStatements },
          ]}
        />
      }
      alerts={alerts}
      eyebrow={labels.heroEyebrow}
      title={engagementName}
      subtitle={
        review
          ? `${labels.summaryVersion} ${review.packageVersion} · ${labels.summaryPending} ${review.pendingCount}`
          : labels.fieldworkGateDescription
      }
      badges={
        review ? (
          <>
            <WorkspaceStatusBadge
              label={statusLabels[review.packageStatus] ?? review.packageStatus}
              variant={statusVariant}
            />
            <WorkspaceStatusBadge
              label={`${labels.summaryPending}: ${review.pendingCount}`}
              variant="outline"
            />
            <WorkspaceStatusBadge
              label={`${labels.summaryOutstandingItems}: ${review.pendingSectionsCount}`}
              variant="outline"
            />
            {review.pendingReviewCount > 0 ? (
              <WorkspaceStatusBadge
                label={formatReviewCount(
                  labels.summaryPendingReviewBadge,
                  review.pendingReviewCount,
                )}
                variant="warning"
              />
            ) : null}
          </>
        ) : undefined
      }
      progress={review ? { label: labels.progress, value: review.progressPct } : undefined}
      action={<WorkspaceBackLink href={engagementPath} label={labels.backToEngagement} />}
    />
  );
}
