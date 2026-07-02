import Link from "next/link";
import { EngagementBreadcrumb } from "@/components/engagement";
import { Alert } from "@/components/ui";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";

type RiskAssessmentHeroLabels = {
  breadcrumbRiskAssessment: string;
  heroEyebrow: string;
  summaryProgress: string;
  backToEngagement: string;
  planningGateTitle: string;
  planningGateDescription: string;
  archivedTitle: string;
  archivedDescription: string;
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
  labels,
  statusLabels,
  engagementsLabels,
}: RiskAssessmentWorkspaceHeroProps) {
  const engagementsPath = `/${locale}/app/engagements`;
  const engagementPath = `${engagementsPath}/${engagementSlug}`;

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

      {riskAssessment?.isArchived ? (
        <Alert variant="warning" title={labels.archivedTitle}>
          {labels.archivedDescription}
        </Alert>
      ) : null}

      <div className="flex flex-col gap-4 border-b border-border/50 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {labels.heroEyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {engagementName}
          </h1>
          {riskAssessment ? (
            <p className="text-sm text-muted-foreground">
              {statusLabels[riskAssessment.assessmentStatus] ?? riskAssessment.assessmentStatus} ·{" "}
              {labels.summaryProgress} {riskAssessment.progressPct}%
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">{labels.planningGateDescription}</p>
          )}
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
