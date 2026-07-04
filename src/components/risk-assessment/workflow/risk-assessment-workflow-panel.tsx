"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Alert, Button, Input } from "@/components/ui";
import {
  acknowledgeSignificantRisksAction,
  approveRiskAssessmentAction,
  returnRiskAssessmentAction,
  submitRiskAssessmentAction,
} from "@/lib/actions/risk-assessment";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import { RiskAssessmentWorkspaceSectionShell } from "@/components/risk-assessment/workspace/risk-assessment-workspace-section-shell";
import { WorkspaceFormPanel } from "@/components/workspace";

type RiskAssessmentWorkflowLabels = {
  title: string;
  description: string;
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

type RiskAssessmentWorkflowPanelProps = {
  riskAssessment: RiskAssessmentWorkspaceView;
  labels: RiskAssessmentWorkflowLabels;
  canSubmit?: boolean;
  canReview?: boolean;
  canApprove?: boolean;
};

export function RiskAssessmentWorkflowPanel({
  riskAssessment,
  labels,
  canSubmit = true,
  canReview = true,
  canApprove = true,
}: RiskAssessmentWorkflowPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [returnMode, setReturnMode] = useState(false);
  const [returnNotes, setReturnNotes] = useState("");

  const isArchived = riskAssessment.isArchived;
  const statusAllowsSubmit = ["not_started", "in_progress", "returned"].includes(
    riskAssessment.assessmentStatus,
  );
  const statusAllowsReview = ["submitted", "under_review"].includes(riskAssessment.assessmentStatus);
  const needsAcknowledgment =
    riskAssessment.significantRiskCount > 0 && !riskAssessment.significantRisksAcknowledgedAt;

  const submit = () => {
    startTransition(async () => {
      setError(null);
      const result = await submitRiskAssessmentAction({
        assessmentId: riskAssessment.id,
        version: riskAssessment.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? labels.errorGeneric);
        return;
      }
      router.refresh();
    });
  };

  const acknowledge = () => {
    startTransition(async () => {
      setError(null);
      const result = await acknowledgeSignificantRisksAction({
        assessmentId: riskAssessment.id,
        version: riskAssessment.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? labels.errorGeneric);
        return;
      }
      router.refresh();
    });
  };

  const sendBack = () => {
    startTransition(async () => {
      setError(null);
      const result = await returnRiskAssessmentAction({
        assessmentId: riskAssessment.id,
        version: riskAssessment.version,
        notes: returnNotes.trim() || null,
      });
      if (!result.success) {
        setError(result.error?.message ?? labels.errorGeneric);
        return;
      }
      setReturnMode(false);
      setReturnNotes("");
      router.refresh();
    });
  };

  const approve = () => {
    startTransition(async () => {
      setError(null);
      const result = await approveRiskAssessmentAction({
        assessmentId: riskAssessment.id,
        version: riskAssessment.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? labels.errorGeneric);
        return;
      }
      router.refresh();
    });
  };

  return (
    <RiskAssessmentWorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="risk-workflow"
    >
      <WorkspaceFormPanel>
        {error ? <Alert variant="error">{error}</Alert> : null}

        {isArchived ? <Alert variant="warning">{labels.readOnlyNotice}</Alert> : null}
        {riskAssessment.assessmentStatus === "approved" ? (
          <Alert variant="success">{labels.approvedNotice}</Alert>
        ) : null}
        {riskAssessment.assessmentStatus === "submitted" ? (
          <Alert variant="info">{labels.submittedNotice}</Alert>
        ) : null}
        {needsAcknowledgment ? (
          <Alert variant="warning">{labels.pendingAcknowledgmentNotice}</Alert>
        ) : null}
        {riskAssessment.significantRisksAcknowledgedAt ? (
          <Alert variant="success">{labels.acknowledgedNotice}</Alert>
        ) : null}

        {!isArchived ? (
          <div className="flex flex-wrap items-center gap-2">
            {canSubmit ? (
              <Button type="button" onClick={submit} disabled={isPending || !statusAllowsSubmit}>
                {labels.submitAction}
              </Button>
            ) : null}

            {canApprove && needsAcknowledgment && statusAllowsReview ? (
              <Button type="button" variant="secondary" onClick={acknowledge} disabled={isPending}>
                {labels.acknowledgeAction}
              </Button>
            ) : null}

            {canReview ? (
              returnMode ? (
                <>
                  <Input
                    value={returnNotes}
                    onChange={(event) => setReturnNotes(event.target.value)}
                    placeholder={labels.returnNotesPlaceholder}
                    aria-label={labels.returnNotesLabel}
                    className="max-w-md"
                  />
                  <Button type="button" variant="secondary" onClick={sendBack} disabled={isPending}>
                    {labels.returnConfirmAction}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setReturnMode(false)}
                    disabled={isPending}
                  >
                    {labels.cancelAction}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setReturnMode(true)}
                  disabled={isPending || !statusAllowsReview}
                >
                  {labels.returnAction}
                </Button>
              )
            ) : null}

            {canApprove ? (
              <Button
                type="button"
                onClick={approve}
                disabled={isPending || !statusAllowsReview || needsAcknowledgment}
              >
                {labels.approveAction}
              </Button>
            ) : null}
          </div>
        ) : null}
      </WorkspaceFormPanel>
    </RiskAssessmentWorkspaceSectionShell>
  );
}
