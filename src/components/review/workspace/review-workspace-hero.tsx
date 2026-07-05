import { EngagementBreadcrumb } from "@/components/engagement";
import {
  WorkspaceBackLink,
  WorkspaceHero,
  WorkspaceNoticeBanner,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import { formatReviewCount } from "@/lib/review/review-workspace-display";
import type { ReviewWorkspaceView } from "@/lib/review/review-workspace-view";

type ReviewHeroLabels = {
  breadcrumbReview: string;
  heroEyebrow: string;
  summaryProgress: string;
  summaryVersion: string;
  summaryPending: string;
  summaryOpenFindings: string;
  summaryPendingReviewBadge: string;
  backToEngagement: string;
  fieldworkGateTitle: string;
  fieldworkGateDescription: string;
  archivedTitle: string;
  archivedDescription: string;
  progress: string;
};

type ReviewWorkspaceHeroProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  review: ReviewWorkspaceView | null;
  fieldworkStarted: boolean;
  labels: ReviewHeroLabels;
  statusLabels: Record<string, string>;
  engagementsLabels: { breadcrumbRoot: string };
};

export function ReviewWorkspaceHero({
  locale,
  engagementSlug,
  engagementName,
  review,
  fieldworkStarted,
  labels,
  statusLabels,
  engagementsLabels,
}: ReviewWorkspaceHeroProps) {
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
            { label: labels.breadcrumbReview },
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
              label={`${labels.summaryOpenFindings}: ${review.openFindingsCount}`}
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
