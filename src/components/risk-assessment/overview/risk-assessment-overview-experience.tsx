"use client";

import { RiskAssessmentCreateExperience } from "@/components/risk-assessment/create/risk-assessment-create-experience";
import { RiskAssessmentWorkflowPanel } from "@/components/risk-assessment/workflow/risk-assessment-workflow-panel";
import { RiskAssessmentWorkspaceSectionShell } from "@/components/risk-assessment/workspace/risk-assessment-workspace-section-shell";
import {
  buildRiskAssessmentOverviewCards,
  buildRiskHeatmapData,
} from "@/lib/risk-assessment/risk-assessment-workspace-display";
import { useRiskAssessmentWorkspace } from "@/lib/risk-assessment/use-risk-assessment-workspace";

type RiskOverviewLabels = {
  title: string;
  description: string;
  statusTitle: string;
  statusDescription: string;
  progress: string;
  workflowTitle: string;
  workflowDescription: string;
  heatmapPreviewTitle: string;
  heatmapPreviewDescription: string;
};

type RiskAssessmentOverviewExperienceProps = {
  canCreate: boolean;
  canSubmit?: boolean;
  canReview?: boolean;
  canApprove?: boolean;
  planningApproved: boolean;
  unratedLabel?: string;
  workspaceLabels: {
    summaryStatus: string;
    summaryVersion: string;
    summaryProgress: string;
    summarySignificant: string;
    summaryPendingReview: string;
    summaryOpenItems: string;
    planningGateDescription: string;
  };
  createLabels: {
    title: string;
    description: string;
    createAction: string;
    creating: string;
    forbiddenDescription: string;
  };
  statusLabels: Record<string, string>;
  labels: RiskOverviewLabels;
  workflowLabels: {
    submitAction: string;
    returnAction: string;
    returnConfirmAction: string;
    approveAction: string;
    acknowledgeAction: string;
    cancelAction: string;
    returnNotesLabel: string;
    returnNotesPlaceholder: string;
    readOnlyNotice: string;
    submittedNotice: string;
    approvedNotice: string;
    acknowledgedNotice: string;
    pendingAcknowledgmentNotice: string;
    errorGeneric: string;
  };
  ratingLabels: Record<string, string>;
};

export function RiskAssessmentOverviewExperience({
  canCreate,
  canSubmit = true,
  canReview = true,
  canApprove = true,
  planningApproved,
  unratedLabel,
  workspaceLabels,
  createLabels,
  statusLabels,
  labels,
  workflowLabels,
  ratingLabels,
}: RiskAssessmentOverviewExperienceProps) {
  const { riskAssessment } = useRiskAssessmentWorkspace();

  if (!riskAssessment) {
    return (
      <RiskAssessmentCreateExperience
        canCreate={canCreate}
        planningApproved={planningApproved}
        labels={createLabels}
        gateLabels={{ planningGateDescription: workspaceLabels.planningGateDescription }}
      />
    );
  }

  const cards = buildRiskAssessmentOverviewCards(riskAssessment, workspaceLabels, statusLabels);
  const heatmapBuckets = buildRiskHeatmapData(riskAssessment.heatmap);

  return (
    <div className="space-y-10">
      <RiskAssessmentWorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="risk-overview"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {cards.map((card) => (
            <div key={card.id} className="rounded-2xl border border-border/50 bg-card/80 p-5 shadow-xs">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{card.value}</p>
              {card.hint ? <p className="mt-1 text-sm text-muted-foreground">{card.hint}</p> : null}
            </div>
          ))}
        </div>
      </RiskAssessmentWorkspaceSectionShell>

      <RiskAssessmentWorkflowPanel
        riskAssessment={riskAssessment}
        canSubmit={canSubmit}
        canReview={canReview}
        canApprove={canApprove}
        labels={{
          ...workflowLabels,
          title: labels.workflowTitle,
          description: labels.workflowDescription,
        }}
      />

      <RiskAssessmentWorkspaceSectionShell
        title={labels.heatmapPreviewTitle}
        description={labels.heatmapPreviewDescription}
        headingId="risk-heatmap-preview"
      >
        <div className="grid gap-3 rounded-2xl border border-border/50 bg-card/80 p-5 sm:grid-cols-5">
          {heatmapBuckets.map((bucket) => (
            <div
              key={bucket.rating ?? "none"}
              className={`rounded-xl border px-3 py-3 text-center ${bucket.cssClass}`}
            >
              <p className="text-xs uppercase tracking-wide">
                {bucket.rating ? (ratingLabels[bucket.rating] ?? bucket.rating) : (unratedLabel ?? "—")}
              </p>
              <p className="mt-1 text-lg font-semibold">{bucket.count}</p>
            </div>
          ))}
        </div>
      </RiskAssessmentWorkspaceSectionShell>

      <RiskAssessmentWorkspaceSectionShell
        title={labels.statusTitle}
        description={labels.statusDescription}
        headingId="risk-status-summary"
      >
        <div className="space-y-3 rounded-2xl border border-border/50 bg-card/80 p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{labels.progress}</span>
            <span className="font-medium text-foreground">{riskAssessment.progressPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/80 transition-all duration-300"
              style={{ width: `${riskAssessment.progressPct}%` }}
              role="progressbar"
              aria-valuenow={riskAssessment.progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={labels.progress}
            />
          </div>
        </div>
      </RiskAssessmentWorkspaceSectionShell>
    </div>
  );
}
