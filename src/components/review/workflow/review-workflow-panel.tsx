"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import type { ReviewWorkspaceView } from "@/lib/review/review-workspace-view";
import { ReviewWorkspaceSectionShell } from "@/components/review/workspace/review-workspace-section-shell";
import { WorkspaceFormPanel, WorkspaceNoticeBanner } from "@/components/workspace";

type ReviewWorkflowLabels = {
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

type ReviewWorkflowHandlers = {
  onSubmit?: () => Promise<{ success: boolean; error?: { message?: string } }>;
  onReturn?: (notes: string | null) => Promise<{ success: boolean; error?: { message?: string } }>;
  onApprove?: () => Promise<{ success: boolean; error?: { message?: string } }>;
};

type ReviewWorkflowPanelProps = {
  review: ReviewWorkspaceView;
  labels: ReviewWorkflowLabels;
  handlers?: ReviewWorkflowHandlers;
  canSubmit?: boolean;
  canReview?: boolean;
  canApprove?: boolean;
  isPending?: boolean;
  onComplete?: () => void;
};

export function ReviewWorkflowPanel({
  review,
  labels,
  handlers,
  canSubmit = true,
  canReview = true,
  canApprove = true,
  isPending = false,
  onComplete,
}: ReviewWorkflowPanelProps) {
  const [error, setError] = useState<string | null>(null);
  const [returnMode, setReturnMode] = useState(false);
  const [returnNotes, setReturnNotes] = useState("");
  const [localPending, setLocalPending] = useState(false);

  const pending = isPending || localPending;
  const isArchived = review.isArchived;
  const statusAllowsSubmit = ["draft", "returned"].includes(review.packageStatus);
  const statusAllowsReview = ["submitted", "under_review"].includes(review.packageStatus);

  const run = async (action: () => Promise<{ success: boolean; error?: { message?: string } }>) => {
    setLocalPending(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) {
        setError(result.error?.message ?? labels.errorGeneric);
        return;
      }
      onComplete?.();
    } finally {
      setLocalPending(false);
    }
  };

  const submit = () => {
    if (!handlers?.onSubmit) return;
    void run(handlers.onSubmit);
  };

  const sendBack = () => {
    if (!handlers?.onReturn) return;
    void run(async () => {
      const result = await handlers.onReturn!(returnNotes.trim() || null);
      if (result.success) {
        setReturnMode(false);
        setReturnNotes("");
      }
      return result;
    });
  };

  const approve = () => {
    if (!handlers?.onApprove) return;
    void run(handlers.onApprove);
  };

  return (
    <ReviewWorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="review-workflow"
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

        {!isArchived && handlers ? (
          <div className="flex flex-wrap items-center gap-2">
            {canSubmit && handlers.onSubmit ? (
              <Button type="button" onClick={submit} disabled={pending || !statusAllowsSubmit}>
                {labels.submitAction}
              </Button>
            ) : null}

            {canReview && handlers.onReturn ? (
              returnMode ? (
                <>
                  <Input
                    value={returnNotes}
                    onChange={(event) => setReturnNotes(event.target.value)}
                    placeholder={labels.returnNotesPlaceholder}
                    aria-label={labels.returnNotesLabel}
                    className="max-w-md"
                  />
                  <Button type="button" variant="secondary" onClick={sendBack} disabled={pending}>
                    {labels.returnConfirmAction}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setReturnMode(false)}
                    disabled={pending}
                  >
                    {labels.cancelAction}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setReturnMode(true)}
                  disabled={pending || !statusAllowsReview}
                >
                  {labels.returnAction}
                </Button>
              )
            ) : null}

            {canApprove && handlers.onApprove ? (
              <Button type="button" onClick={approve} disabled={pending || !statusAllowsReview}>
                {labels.approveAction}
              </Button>
            ) : null}
          </div>
        ) : null}
      </WorkspaceFormPanel>
    </ReviewWorkspaceSectionShell>
  );
}
