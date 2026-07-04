import { EngagementBreadcrumb } from "@/components/engagement";
import { Alert } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { WorkspaceBackLink, WorkspaceHero } from "@/components/workspace";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";

type RiskAssessmentHeroLabels = {
  breadcrumbRiskAssessment: string;
  heroEyebrow: string;
  summaryProgress: string;
  summaryVersion: string;
  summarySignificant: string;
  summaryPendingReview?: string;
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

  const alerts = (
    <>
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
    </>
  );

  return (
    <WorkspaceHero
      breadcrumb={
        <EngagementBreadcrumb
          items={[
            { label: engagementsLabels.breadcrumbRoot, href: engagementsPath },
            { label: engagementName, href: engagementPath },
            { label: labels.breadcrumbRiskAssessment },
          ]}
        />
      }
      alerts={alerts}
      eyebrow={labels.heroEyebrow}
      title={engagementName}
      subtitle={
        riskAssessment
          ? `${labels.summaryVersion} ${riskAssessment.assessmentVersion}`
          : labels.planningGateDescription
      }
      badges={
        riskAssessment ? (
          <>
            <Badge variant={statusVariant}>
              {statusLabels[riskAssessment.assessmentStatus] ?? riskAssessment.assessmentStatus}
            </Badge>
            <Badge variant="outline">
              {labels.summarySignificant}: {riskAssessment.significantRiskCount}
            </Badge>
            {riskAssessment.pendingReviewCount > 0 ? (
              <Badge variant="warning">
                {riskAssessment.pendingReviewCount}{" "}
                {labels.summaryPendingReview ?? "pending review"}
              </Badge>
            ) : null}
          </>
        ) : undefined
      }
      progress={
        riskAssessment
          ? { label: labels.progress, value: riskAssessment.progressPct }
          : undefined
      }
      action={<WorkspaceBackLink href={engagementPath} label={labels.backToEngagement} />}
    />
  );
}
