"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  approveReportSectionAction,
  returnReportSectionAction,
  reopenReportSectionAction,
  updateReportSectionAction,
} from "@/lib/actions/reporting";
import { useEngagementWorkspace } from "@/lib/engagement/use-engagement-workspace";
import type { ReportSectionView } from "@/lib/reporting/reporting-workspace-view";
import { Button, Input } from "@/components/ui";
import { WorkspaceNoticeBanner, WorkspacePanel, WorkspaceStatusBadge } from "@/components/workspace";

type ReportSectionRowLabels = {
  unassigned: string;
  assignReviewer: string;
  dueDate: string;
  priority: string;
  severity: string;
  status: string;
  returnNotesTitle: string;
  returnNotesPlaceholder: string;
  assignAction: string;
  returnAction: string;
  returnConfirmAction: string;
  approveAction: string;
  reopenAction: string;
  cancelAction: string;
  errorGeneric: string;
  priorities: Record<string, string>;
  severities: Record<string, string>;
  sectionStatuses: Record<string, string>;
  sectionTypes: Record<string, string>;
};

type ReportSectionRowProps = {
  packageId: string;
  packageVersion: number;
  item: ReportSectionView;
  isArchived: boolean;
  canReview: boolean;
  labels: ReportSectionRowLabels;
};

export function ReportSectionRow({
  packageId,
  packageVersion,
  item,
  isArchived,
  canReview,
  labels,
}: ReportSectionRowProps) {
  const router = useRouter();
  const { engagement } = useEngagementWorkspace();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [returnNotes, setReturnNotes] = useState("");
  const [returnMode, setReturnMode] = useState(false);
  const [dueDate, setDueDate] = useState(item.dueDate?.slice(0, 10) ?? "");
  const [priority, setPriority] = useState(item.priority ?? "medium");
  const [severity, setSeverity] = useState(item.severity ?? "medium");

  const memberName = (userId: string | null) => {
    if (!userId) return labels.unassigned;
    const member = engagement.members.find((m) => m.userId === userId);
    return member?.displayName ?? userId;
  };

  const refresh = () => {
    setReturnMode(false);
    setReturnNotes("");
    router.refresh();
  };

  const run = (action: () => Promise<{ success: boolean; error?: { message: string } }>) => {
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

  const update = (patch: {
    assignedReviewerId?: string | null;
    priority?: string | null;
    severity?: string | null;
    dueDate?: string | null;
  }) => {
    run(() =>
      updateReportSectionAction({
        packageId,
        packageVersion,
        itemId: item.id,
        itemVersion: item.version,
        ...patch,
      }),
    );
  };

  const showActions =
    canReview &&
    !isArchived &&
    ["pending", "under_review", "returned"].includes(item.sectionStatus);
  const showReopen = canReview && !isArchived && item.sectionStatus === "resolved";

  return (
    <div className="space-y-3 px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">{item.title}</p>
          <p className="text-xs text-muted-foreground">
            {labels.sectionTypes[item.sectionType] ?? item.sectionType}
            {item.description ? ` · ${item.description}` : null}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {labels.assignReviewer}: {memberName(item.assignedReviewerId)}
            {item.dueDate ? ` · ${labels.dueDate}: ${item.dueDate.slice(0, 10)}` : null}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <WorkspaceStatusBadge
            label={labels.sectionStatuses[item.sectionStatus] ?? item.sectionStatus}
            variant={
              item.sectionStatus === "resolved"
                ? "success"
                : item.sectionStatus === "returned"
                  ? "warning"
                  : "default"
            }
          />
          {item.priority ? (
            <WorkspaceStatusBadge
              label={labels.priorities[item.priority] ?? item.priority}
              variant="outline"
            />
          ) : null}
          {item.severity ? (
            <WorkspaceStatusBadge
              label={labels.severities[item.severity] ?? item.severity}
              variant={item.severity === "high" || item.severity === "critical" ? "destructive" : "secondary"}
            />
          ) : null}
        </div>
      </div>

      {item.returnNotes && item.sectionStatus === "returned" ? (
        <WorkspaceNoticeBanner
          variant="warning"
          title={labels.returnNotesTitle}
          description={item.returnNotes}
          role="alert"
        />
      ) : null}

      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

      {!isArchived && canReview ? (
        <WorkspacePanel variant="muted" padding="sm" className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            {labels.assignReviewer}
            <select
              className="h-9 rounded-lg border border-border/60 bg-background px-2 text-sm text-foreground"
              value={item.assignedReviewerId ?? ""}
              onChange={(event) => update({ assignedReviewerId: event.target.value || null })}
              disabled={isPending}
            >
              <option value="">{labels.unassigned}</option>
              {engagement.members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            {labels.priority}
            <select
              className="h-9 rounded-lg border border-border/60 bg-background px-2 text-sm text-foreground"
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
                update({ priority: event.target.value });
              }}
              disabled={isPending}
            >
              {Object.entries(labels.priorities).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            {labels.severity}
            <select
              className="h-9 rounded-lg border border-border/60 bg-background px-2 text-sm text-foreground"
              value={severity}
              onChange={(event) => {
                setSeverity(event.target.value);
                update({ severity: event.target.value });
              }}
              disabled={isPending}
            >
              {Object.entries(labels.severities).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            {labels.dueDate}
            <Input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              onBlur={() => {
                if (dueDate !== (item.dueDate?.slice(0, 10) ?? "")) {
                  update({ dueDate: dueDate || null });
                }
              }}
              disabled={isPending}
            />
          </label>
        </WorkspacePanel>
      ) : null}

      {showActions ? (
        <div className="flex flex-wrap items-center gap-2">
          {returnMode ? (
            <>
              <Input
                value={returnNotes}
                onChange={(event) => setReturnNotes(event.target.value)}
                placeholder={labels.returnNotesPlaceholder}
                className="max-w-md"
                disabled={isPending}
              />
              <Button
                type="button"
                variant="secondary"
                disabled={isPending}
                onClick={() =>
                  run(() =>
                    returnReportSectionAction({
                      packageId,
                      packageVersion,
                      itemId: item.id,
                      itemVersion: item.version,
                      returnNotes: returnNotes.trim() || null,
                    }),
                  )
                }
              >
                {labels.returnConfirmAction}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setReturnMode(false)} disabled={isPending}>
                {labels.cancelAction}
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="secondary" onClick={() => setReturnMode(true)} disabled={isPending}>
                {labels.returnAction}
              </Button>
              <Button
                type="button"
                onClick={() =>
                  run(() =>
                    approveReportSectionAction({
                      packageId,
                      packageVersion,
                      itemId: item.id,
                      itemVersion: item.version,
                    }),
                  )
                }
                disabled={isPending}
              >
                {labels.approveAction}
              </Button>
            </>
          )}
        </div>
      ) : null}

      {showReopen ? (
        <Button
          type="button"
          variant="secondary"
          disabled={isPending}
          onClick={() =>
            run(() =>
              reopenReportSectionAction({
                packageId,
                packageVersion,
                itemId: item.id,
                itemVersion: item.version,
              }),
            )
          }
        >
          {labels.reopenAction}
        </Button>
      ) : null}
    </div>
  );
}
