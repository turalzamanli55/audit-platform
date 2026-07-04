import Link from "next/link";
import { EngagementBreadcrumb } from "@/components/engagement";
import { Alert } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";

type RiskAssessmentHeroLabels = {
  breadcrumbRiskAssessment: string;
  heroEyebrow: string;
  summaryProgress: string;
  summaryVersion: string;
  summarySignificant: string;
  backToEngagement: string;
  planningGateTitle: string;
  planningGateDescription: string;
  materialityGateTitle: string;
  materialityGateDescription: string;
  archivedTitle: string;
  archivedDescription: string;
  progress: string;
};

type RiskAssessmentStatuses = Record<string, string>;

type EngagementLabels = {
  breadcrumbRoot: string;
};

type RiskAssessmentWorkspaceHeroProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  riskAssessment: RiskAssessmentWorkspaceView | null;
  planningApproved: boolean;
  materialityApproved: boolean;
  labels: RiskAssessmentHeroLabels;
  statusLabels: RiskAssessmentStatuses;
  engagementsLabels: EngagementLabels;
};

export function RiskAssessmentWorkspaceHero({
  locale,
  engagementSlug,
  engagementName,
  riskAssessment,
  planningApproved,
  materialityApproved,
  labels,
  statusLabels,
  engagementsLabels,
}: RiskAssessmentWorkspaceHeroProps) {
  const engagementsPath = `/${locale}/app/engagements`;
  const engagementPath = `${engagementsPath}/${engagementSlug}`;

  const status = riskAssessment?.assessmentStatus as string | undefined;
  const statusVariant =
    status === "approved"
      ? "success"
      : status === "submitted" || status === "under_review"
        ? "warning"
        : status === "returned"
          ? "destructive"
          : "secondary";

  return (
    <div className="space-y-6">
      <EngagementBreadcrumb
        items={[
          { label: engagementsLabels.breadcrumbRoot, href: engagementsPath },
          { label: engagementName, href: engagementPath },
          { label: labels.breadcrumbRiskAssessment },
        ]}
      />

      {!planningApproved ? (
        <Alert variant="warning" title={labels.planningGateTitle}>
          {labels.planningGateDescription}
        </Alert>
      ) : null}

      {!materialityApproved ? (
        <Alert variant="warning" title={labels.materialityGateTitle}>
          {labels.materialityGateDescription}
        </Alert>
      ) : null}

      {riskAssessment?.isArchived ? (
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
            {riskAssessment ? (
              <p className="text-sm text-muted-foreground">
                {labels.summaryVersion} {riskAssessment.assessmentVersion}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{labels.planningGateDescription}</p>
            )}
          </div>

          {riskAssessment ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant}>
                {statusLabels[riskAssessment.assessmentStatus] ?? riskAssessment.assessmentStatus}
              </Badge>
              <Badge variant="outline">
                {labels.summarySignificant}: {riskAssessment.significantRiskCount}
              </Badge>
              {riskAssessment.pendingReviewCount > 0 ? (
                <Badge variant="warning">
                  {riskAssessment.pendingReviewCount} pending review
                </Badge>
              ) : null}
            </div>
          ) : null}

          {riskAssessment ? (
            <div className="max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{labels.progress}</span>
                <span className="font-medium tabular-nums text-foreground">
                  {riskAssessment.progressPct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${riskAssessment.progressPct}%` }}
                  role="progressbar"
                  aria-valuenow={riskAssessment.progressPct}
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
