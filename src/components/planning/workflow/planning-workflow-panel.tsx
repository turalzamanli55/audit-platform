"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  approvePlanningAction,
  returnPlanningAction,
  revisePlanningAction,
  submitPlanningForReviewAction,
} from "@/lib/actions/planning";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";

type PlanningWorkflowPanelProps = {
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  labels: Dictionary["planning"]["workflow"];
  statusLabels: Dictionary["planning"]["statuses"];
};

export function PlanningWorkflowPanel({
  canSubmit,
  canReview,
  canApprove,
  labels,
  statusLabels,
}: PlanningWorkflowPanelProps) {
  const router = useRouter();
  const { plan } = usePlanningWorkspace();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<"idle" | "return" | "revise">("idle");

  if (!plan || plan.isArchived) {
    return null;
  }

  const status = plan.planningStatus;
  const showSubmit = canSubmit && (status === "in_progress" || status === "returned");
  const showReturn = canReview && status === "pending_review";
  const showApprove = canApprove && status === "pending_review";
  const showRevise = canApprove && status === "approved" && plan.isLocked;

  const refresh = () => {
    setMode("idle");
    setNotes("");
    router.refresh();
  };

  const runAction = (action: () => Promise<{ success: boolean; error?: { message: string } }>) => {
    startTransition(async () => {
      setError(null);
      const result = await action();
      if (!result.success) {
        setError(result.error?.message ?? labels.errorGeneric);
        return;
      }
      refresh();
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-xs">
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {labels.eyebrow}
            </p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              {statusLabels[status]}
            </p>
          </div>
          {plan.isLocked ? (
            <span className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              {labels.lockedBadge}
            </span>
          ) : null}
        </div>

        {plan.returnNotes && status === "returned" ? (
          <Alert variant="warning" title={labels.returnNotesTitle}>
            {plan.returnNotes}
          </Alert>
        ) : null}

        {error ? <Alert variant="error">{error}</Alert> : null}

        {mode === "return" || mode === "revise" ? (
          <div className="space-y-3">
            <label htmlFor="workflow-notes" className="text-sm font-medium text-foreground">
              {mode === "return" ? labels.returnNotesLabel : labels.reviseNotesLabel}
            </label>
            <Input
              id="workflow-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={
                mode === "return" ? labels.returnNotesPlaceholder : labels.reviseNotesPlaceholder
              }
            />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {showSubmit ? (
            <Button
              type="button"
              disabled={isPending}
              onClick={() =>
                runAction(() =>
                  submitPlanningForReviewAction({ planId: plan.id, version: plan.version }),
                )
              }
            >
              {labels.submitAction}
            </Button>
          ) : null}

          {showReturn ? (
            mode === "return" ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    runAction(() =>
                      returnPlanningAction({
                        planId: plan.id,
                        version: plan.version,
                        notes: notes.trim() || null,
                      }),
                    )
                  }
                >
                  {labels.returnConfirmAction}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setMode("idle")}>
                  {labels.cancelAction}
                </Button>
              </>
            ) : (
              <Button type="button" variant="secondary" onClick={() => setMode("return")}>
                {labels.returnAction}
              </Button>
            )
          ) : null}

          {showApprove ? (
            <Button
              type="button"
              disabled={isPending}
              onClick={() =>
                runAction(() =>
                  approvePlanningAction({ planId: plan.id, version: plan.version }),
                )
              }
            >
              {labels.approveAction}
            </Button>
          ) : null}

          {showRevise ? (
            mode === "revise" ? (
              <>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    runAction(() =>
                      revisePlanningAction({
                        planId: plan.id,
                        version: plan.version,
                        notes: notes.trim() || null,
                      }),
                    )
                  }
                >
                  {labels.reviseConfirmAction}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setMode("idle")}>
                  {labels.cancelAction}
                </Button>
              </>
            ) : (
              <Button type="button" variant="secondary" onClick={() => setMode("revise")}>
                {labels.reviseAction}
              </Button>
            )
          ) : null}
        </div>

        {status === "pending_review" && !canReview && !canApprove ? (
          <p className="text-sm text-muted-foreground">{labels.pendingReviewNotice}</p>
        ) : null}
      </div>
    </div>
  );
}
