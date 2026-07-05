import { EngagementBreadcrumb } from "@/components/engagement";
import { Alert } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { WorkspaceBackLink, WorkspaceHero } from "@/components/workspace";
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
        <Alert variant="warning" title={labels.planningGateTitle}>
          {labels.planningGateDescription}
        </Alert>
      ) : null}
      {materiality?.isArchived ? (
        <Alert variant="warning" title={labels.archivedTitle}>
          {labels.archivedDescription}
        </Alert>
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
            <Badge variant={statusVariant}>
              {statusLabels[materiality.packageStatus] ?? materiality.packageStatus}
            </Badge>
            <Badge variant="outline">
              {labels.summaryOverall}:{" "}
              {formatCurrency(materiality.overallMateriality, materiality.currencyCode)}
            </Badge>
            {materiality.pendingReviewCount > 0 ? (
              <Badge variant="warning">
                {labels.summaryPendingReviewBadge.replace(
                  "{count}",
                  String(materiality.pendingReviewCount),
                )}
              </Badge>
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
