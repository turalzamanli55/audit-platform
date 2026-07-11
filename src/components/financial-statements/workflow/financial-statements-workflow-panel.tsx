"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  approveFinancialStatementsAction,
  returnFinancialStatementsAction,
  submitFinancialStatementsAction,
} from "@/lib/actions/financial-statements";
import type { FinancialStatementsWorkspaceView } from "@/lib/financial-statements/financial-statements-workspace-view";
import { FinancialStatementsWorkspaceSectionShell } from "@/components/financial-statements/workspace/financial-statements-workspace-section-shell";
import { WorkspaceFormPanel, WorkspaceNoticeBanner } from "@/components/workspace";
import { Button, Input } from "@/components/ui";

type FinancialStatementsWorkflowLabels = {
  title: string;
  description: string;
  submitAction: string;
  returnAction: string;
  returnConfirmAction: string;
  approveAction: string;
  cancelAction: string;
  returnNotesLabel: string;
  returnNotesPlaceholder: string;
  readOnlyNotice: string;
  submittedNotice: string;
  approvedNotice: string;
  returnedNotice: string;
  errorGeneric: string;
};

type FinancialStatementsWorkflowPanelProps = {
  review: FinancialStatementsWorkspaceView;
  labels: FinancialStatementsWorkflowLabels;
  canSubmit?: boolean;
  canReview?: boolean;
  canApprove?: boolean;
};

export function FinancialStatementsWorkflowPanel({
  review,
  labels,
  canSubmit = true,
  canReview = true,
  canApprove = true,
}: FinancialStatementsWorkflowPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [returnMode, setReturnMode] = useState(false);
  const [returnNotes, setReturnNotes] = useState("");

  const isArchived = review.isArchived;
  const statusAllowsSubmit = ["draft", "returned"].includes(review.packageStatus);
  const statusAllowsReview = ["submitted", "under_review"].includes(review.packageStatus);

  const submit = () => {
    startTransition(async () => {
      setError(null);
      const result = await submitFinancialStatementsAction({
        packageId: review.id,
        version: review.version,
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
      const result = await returnFinancialStatementsAction({
        packageId: review.id,
        version: review.version,
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
      const result = await approveFinancialStatementsAction({
        packageId: review.id,
        version: review.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? labels.errorGeneric);
        return;
      }
      router.refresh();
    });
  };

  return (
    <FinancialStatementsWorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="financial-statements-workflow"
    >
      <WorkspaceFormPanel>
        {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

        {isArchived ? (
          <WorkspaceNoticeBanner variant="warning" description={labels.readOnlyNotice} role="alert" />
        ) : null}
        {review.packageStatus === "approved" ? (
          <WorkspaceNoticeBanner variant="success" description={labels.approvedNotice} role="status" />
        ) : null}
        {review.packageStatus === "submitted" ? (
          <WorkspaceNoticeBanner variant="info" description={labels.submittedNotice} role="status" />
        ) : null}
        {review.packageStatus === "returned" ? (
          <WorkspaceNoticeBanner variant="warning" description={labels.returnedNotice} role="status" />
        ) : null}

        {!isArchived ? (
          <div className="flex flex-wrap items-center gap-2">
            {canSubmit ? (
              <Button type="button" onClick={submit} disabled={isPending || !statusAllowsSubmit}>
                {labels.submitAction}
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
              <Button type="button" onClick={approve} disabled={isPending || !statusAllowsReview}>
                {labels.approveAction}
              </Button>
            ) : null}
          </div>
        ) : null}
      </WorkspaceFormPanel>
    </FinancialStatementsWorkspaceSectionShell>
  );
}

export function useFinancialStatementsWorkflowHandlers(review: FinancialStatementsWorkspaceView) {
  return useMemo(
    () => ({
      onSubmit: () =>
        submitFinancialStatementsAction({ packageId: review.id, version: review.version }),
      onReturn: (notes: string | null) =>
        returnFinancialStatementsAction({ packageId: review.id, version: review.version, notes }),
      onApprove: () =>
        approveFinancialStatementsAction({ packageId: review.id, version: review.version }),
    }),
    [review.id, review.version],
  );
}
