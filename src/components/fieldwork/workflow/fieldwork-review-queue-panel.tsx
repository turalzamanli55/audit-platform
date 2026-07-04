"use client";

import Link from "next/link";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import {
  WorkspaceList,
  WorkspaceListItem,
  WorkspacePanel,
  WorkspaceSectionShell,
} from "@/components/workspace";

type FieldworkReviewQueuePanelProps = {
  fieldwork: FieldworkWorkspaceView;
  locale: string;
  engagementSlug: string;
  labels: Dictionary["fieldwork"]["workflow"];
  fieldworkLabels: Dictionary["fieldwork"];
};

export function FieldworkReviewQueuePanel({
  fieldwork,
  locale,
  engagementSlug,
  labels,
  fieldworkLabels,
}: FieldworkReviewQueuePanelProps) {
  const pending = fieldwork.procedures.filter((p) =>
    ["submitted_for_review", "review_in_progress"].includes(p.procedureStatus),
  );
  const proceduresHref = `/${locale}/app/engagements/${engagementSlug}/fieldwork/procedures`;

  return (
    <WorkspaceSectionShell
      title={labels.queueTitle}
      description={labels.queueDescription}
      headingId="fieldwork-review-queue"
    >
      <WorkspacePanel>
        <p className="text-sm text-muted-foreground">
          {labels.pendingReviewCount}:{" "}
          <span className="font-medium text-foreground">{fieldwork.pendingReviewCount}</span>
        </p>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{labels.queueEmpty}</p>
        ) : (
          <WorkspaceList className="mt-4 border-0 bg-transparent">
            {pending.map((procedure) => (
              <WorkspaceListItem key={procedure.id} className="px-0">
                <Link
                  href={`${proceduresHref}?procedure=${procedure.id}`}
                  className="group block rounded-lg transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="font-medium text-foreground group-hover:text-primary">
                    {procedure.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fieldworkLabels.procedureStatuses[procedure.procedureStatus]} ·{" "}
                    {labels.openProcedureAction}
                  </p>
                </Link>
              </WorkspaceListItem>
            ))}
          </WorkspaceList>
        )}
      </WorkspacePanel>
    </WorkspaceSectionShell>
  );
}
