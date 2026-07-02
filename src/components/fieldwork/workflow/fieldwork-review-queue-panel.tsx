"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import { FieldworkWorkspaceSectionShell } from "@/components/fieldwork/workspace/fieldwork-workspace-section-shell";

type FieldworkReviewQueuePanelProps = {
  fieldwork: FieldworkWorkspaceView;
  labels: Dictionary["fieldwork"]["workflow"];
  fieldworkLabels: Dictionary["fieldwork"];
};

export function FieldworkReviewQueuePanel({
  fieldwork,
  labels,
  fieldworkLabels,
}: FieldworkReviewQueuePanelProps) {
  const pending = fieldwork.procedures.filter((p) =>
    ["submitted_for_review", "review_in_progress"].includes(p.procedureStatus),
  );

  return (
    <FieldworkWorkspaceSectionShell
      title={labels.queueTitle}
      description={labels.queueDescription}
      headingId="fieldwork-review-queue"
    >
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-5">
        <p className="text-sm text-muted-foreground">
          {labels.pendingReviewCount}:{" "}
          <span className="font-medium text-foreground">{fieldwork.pendingReviewCount}</span>
        </p>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{labels.queueEmpty}</p>
        ) : (
          <ul className="mt-4 divide-y divide-border/40">
            {pending.map((procedure) => (
              <li key={procedure.id} className="py-3 first:pt-0 last:pb-0">
                <p className="font-medium text-foreground">{procedure.title}</p>
                <p className="text-xs text-muted-foreground">
                  {fieldworkLabels.procedureStatuses[procedure.procedureStatus]}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FieldworkWorkspaceSectionShell>
  );
}
