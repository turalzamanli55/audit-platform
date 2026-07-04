import Link from "next/link";
import { EngagementBreadcrumb } from "@/components/engagement";
import { Alert } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import { formatCurrency } from "@/lib/materiality/materiality-workspace-display";

type MaterialityHeroLabels = {
  breadcrumbMateriality: string;
  heroEyebrow: string;
  summaryProgress: string;
  summaryVersion: string;
  summaryOverall: string;
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

  return (
    <div className="space-y-6">
      <EngagementBreadcrumb
        items={[
          { label: engagementsLabels.breadcrumbRoot, href: engagementsPath },
          { label: engagementName, href: engagementPath },
          { label: labels.breadcrumbMateriality },
        ]}
      />

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

      <div className="flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {labels.heroEyebrow}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight">
              {engagementName}
            </h1>
            {materiality ? (
              <p className="text-sm text-muted-foreground">
                {labels.summaryVersion} {materiality.packageVersion}
                {materiality.overallMateriality != null
                  ? ` · ${formatCurrency(materiality.overallMateriality, materiality.currencyCode)}`
                  : ""}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{labels.planningGateDescription}</p>
            )}
          </div>

          {materiality ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant}>
                {statusLabels[materiality.packageStatus] ?? materiality.packageStatus}
              </Badge>
              <Badge variant="outline">
                {labels.summaryOverall}:{" "}
                {formatCurrency(materiality.overallMateriality, materiality.currencyCode)}
              </Badge>
              {materiality.pendingReviewCount > 0 ? (
                <Badge variant="warning">{materiality.pendingReviewCount} pending review</Badge>
              ) : null}
            </div>
          ) : null}

          {materiality ? (
            <div className="max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{labels.progress}</span>
                <span className="font-medium tabular-nums text-foreground">
                  {materiality.progressPct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${materiality.progressPct}%` }}
                  role="progressbar"
                  aria-valuenow={materiality.progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          ) : null}
        </div>

        <Link
          href={engagementPath}
          className="inline-flex h-10 shrink-0 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {labels.backToEngagement}
        </Link>
      </div>
    </div>
  );
}
