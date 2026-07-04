"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Alert, Button, Input } from "@/components/ui";
import {
  approveMaterialityPackageAction,
  returnMaterialityPackageAction,
  submitMaterialityPackageAction,
} from "@/lib/actions/materiality";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import { MaterialityWorkspaceSectionShell } from "@/components/materiality/workspace/materiality-workspace-section-shell";

type MaterialityWorkflowLabels = {
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

type MaterialityWorkflowPanelProps = {
  materiality: MaterialityWorkspaceView;
  labels: MaterialityWorkflowLabels;
  canSubmit?: boolean;
  canReview?: boolean;
  canApprove?: boolean;
};

export function MaterialityWorkflowPanel({
  materiality,
  labels,
  canSubmit = true,
  canReview = true,
  canApprove = true,
}: MaterialityWorkflowPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [returnMode, setReturnMode] = useState(false);
  const [returnNotes, setReturnNotes] = useState("");

  const isArchived = materiality.isArchived;
  const statusAllowsSubmit = ["draft", "returned"].includes(materiality.packageStatus);
  const statusAllowsReview = ["submitted", "under_review"].includes(materiality.packageStatus);

  const submit = () => {
    startTransition(async () => {
      setError(null);
      const result = await submitMaterialityPackageAction({
        packageId: materiality.id,
        version: materiality.version,
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
      const result = await returnMaterialityPackageAction({
        packageId: materiality.id,
        version: materiality.version,
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
      const result = await approveMaterialityPackageAction({
        packageId: materiality.id,
        version: materiality.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? labels.errorGeneric);
        return;
      }
      router.refresh();
    });
  };

  return (
    <MaterialityWorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="materiality-workflow"
    >
      <div className="space-y-4 rounded-2xl border border-border/50 bg-card/80 p-5">
        {error ? <Alert variant="error">{error}</Alert> : null}

        {isArchived ? <Alert variant="warning">{labels.readOnlyNotice}</Alert> : null}
        {materiality.packageStatus === "approved" ? (
          <Alert variant="success">{labels.approvedNotice}</Alert>
        ) : null}
        {materiality.packageStatus === "submitted" ? (
          <Alert variant="info">{labels.submittedNotice}</Alert>
        ) : null}
        {materiality.packageStatus === "returned" ? (
          <Alert variant="warning">{labels.returnedNotice}</Alert>
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
      </div>
    </MaterialityWorkspaceSectionShell>
  );
}
