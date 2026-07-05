import { EngagementBreadcrumb } from "@/components/engagement";
import {
  WorkspaceBackLink,
  WorkspaceHero,
  WorkspaceNoticeBanner,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import { formatCurrency } from "@/lib/materiality/materiality-workspace-display";

type MaterialityHeroLabels = {
  breadcrumbMateriality: string;
  heroEyebrow: string;
  summaryProgress: string;
  summaryVersion: string;
  summaryOverall: string;
  summaryPendingReview?: string;
  summaryPendingReviewBadge: string;
  backToEngagement: string;
  planningGateTitle: string;
  planningGateDescription: string;
  archivedTitle: string;
  archivedDescription: string;
  progress: string;
};

type MaterialityStatuses = Record<string, string>;

type EngagementLabels = {
  breadcrumbRoot: string;
};

type MaterialityWorkspaceHeroProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  materiality: MaterialityWorkspaceView | null;
  planningApproved: boolean;
  labels: MaterialityHeroLabels;
  statusLabels: MaterialityStatuses;
  engagementsLabels: EngagementLabels;
};

export function MaterialityWorkspaceHero({
  locale,
  engagementSlug,
  engagementName,
  materiality,
  planningApproved,
  labels,
  statusLabels,
  engagementsLabels,
}: MaterialityWorkspaceHeroProps) {
  const engagementsPath = `/${locale}/app/engagements`;
  const engagementPath = `${engagementsPath}/${engagementSlug}`;

  const statusVariant =
    materiality?.packageStatus === "approved"
      ? "success"
      : materiality?.packageStatus === "submitted" ||
          materiality?.packageStatus === "under_review"
        ? "warning"
        : materiality?.packageStatus === "returned"
          ? "destructive"
          : "secondary";

  const alerts = (
    <>
      {!planningApproved ? (
        <WorkspaceNoticeBanner
          title={labels.planningGateTitle}
          description={labels.planningGateDescription}
        />
      ) : null}
      {materiality?.isArchived ? (
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
            { label: labels.breadcrumbMateriality },
          ]}
        />
      }
      alerts={alerts}
      eyebrow={labels.heroEyebrow}
      title={engagementName}
      subtitle={
        materiality
          ? `${labels.summaryVersion} ${materiality.packageVersion}${
              materiality.overallMateriality != null
                ? ` · ${formatCurrency(materiality.overallMateriality, materiality.currencyCode)}`
                : ""
            }`
          : labels.planningGateDescription
      }
      badges={
        materiality ? (
          <>
            <WorkspaceStatusBadge
              label={statusLabels[materiality.packageStatus] ?? materiality.packageStatus}
              variant={statusVariant}
            />
            <WorkspaceStatusBadge
              label={`${labels.summaryOverall}: ${formatCurrency(materiality.overallMateriality, materiality.currencyCode)}`}
              variant="outline"
            />
            {materiality.pendingReviewCount > 0 ? (
              <WorkspaceStatusBadge
                label={labels.summaryPendingReviewBadge.replace(
                  "{count}",
                  String(materiality.pendingReviewCount),
                )}
                variant="warning"
              />
            ) : null}
          </>
        ) : undefined
      }
      progress={
        materiality ? { label: labels.progress, value: materiality.progressPct } : undefined
      }
      action={<WorkspaceBackLink href={engagementPath} label={labels.backToEngagement} />}
    />
  );
}
