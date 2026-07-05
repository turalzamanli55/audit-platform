import { EngagementBreadcrumb } from "@/components/engagement";
import {
  WorkspaceBackLink,
  WorkspaceHero,
  WorkspaceNoticeBanner,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";

type RiskAssessmentHeroLabels = {
  breadcrumbRiskAssessment: string;
  heroEyebrow: string;
  summaryProgress: string;
  summaryVersion: string;
  summarySignificant: string;
  summaryPendingReview?: string;
  summaryPendingReviewBadge: string;
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
        <WorkspaceNoticeBanner
          title={labels.planningGateTitle}
          description={labels.planningGateDescription}
        />
      ) : null}
      {!materialityApproved ? (
        <WorkspaceNoticeBanner
          title={labels.materialityGateTitle}
          description={labels.materialityGateDescription}
        />
      ) : null}
      {riskAssessment?.isArchived ? (
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
            <WorkspaceStatusBadge
              label={
                statusLabels[riskAssessment.assessmentStatus] ?? riskAssessment.assessmentStatus
              }
              variant={statusVariant}
            />
            <WorkspaceStatusBadge
              label={`${labels.summarySignificant}: ${riskAssessment.significantRiskCount}`}
              variant="outline"
            />
            {riskAssessment.pendingReviewCount > 0 ? (
              <WorkspaceStatusBadge
                label={labels.summaryPendingReviewBadge.replace(
                  "{count}",
                  String(riskAssessment.pendingReviewCount),
                )}
                variant="warning"
              />
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
