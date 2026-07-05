"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  assignFieldworkProcedureAction,
  clearFieldworkProcedureAction,
  completeFieldworkProcedureAction,
  returnFieldworkProcedureAction,
  submitFieldworkProcedureAction,
  updateFieldworkProcedureAction,
} from "@/lib/actions/fieldwork";
import { useEngagementWorkspace } from "@/lib/engagement/use-engagement-workspace";
import type { FieldworkProcedureView } from "@/types/fieldwork";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import { WorkspaceNoticeBanner, WorkspacePanel } from "@/components/workspace";

type FieldworkProcedureRowProps = {
  packageId: string;
  procedure: FieldworkProcedureView;
  isArchived: boolean;
  canAssign: boolean;
  canUpdate: boolean;
  canReview: boolean;
  fieldworkLabels: Dictionary["fieldwork"];
};

export function FieldworkProcedureRow({
  packageId,
  procedure,
  isArchived,
  canAssign,
  canUpdate,
  canReview,
  fieldworkLabels,
}: FieldworkProcedureRowProps) {
  const router = useRouter();
  const { engagement } = useEngagementWorkspace();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<"idle" | "return" | "clear">("idle");
  const [dueDate, setDueDate] = useState(procedure.dueDate ?? "");

  const memberName = (userId: string | null) => {
    if (!userId) return fieldworkLabels.procedures.unassigned;
    const member = engagement.members.find((m) => m.userId === userId);
    return member?.displayName ?? userId;
  };

  const refresh = () => {
    setMode("idle");
    setNotes("");
    router.refresh();
  };

  const run = (action: () => Promise<{ success: boolean; error?: { message: string } }>) => {
    startTransition(async () => {
      setError(null);
      const result = await action();
      if (!result.success) {
        setError(result.error?.message ?? fieldworkLabels.workflow.errorGeneric);
        return;
      }
      refresh();
    });
  };

  const assign = (assignedAuditorId: string | null) => {
    run(() =>
      assignFieldworkProcedureAction({
        packageId,
        procedureId: procedure.id,
        procedureVersion: procedure.version,
        assignedAuditorId,
        dueDate: dueDate || null,
      }),
    );
  };

  const status = procedure.procedureStatus;
  const showSubmit =
    canUpdate &&
    !isArchived &&
    (status === "in_progress" || status === "pending_evidence" || status === "returned");
  const showReturn = canReview && !isArchived && (status === "submitted_for_review" || status === "review_in_progress");
  const showClear = canReview && !isArchived && (status === "submitted_for_review" || status === "review_in_progress");
  const showComplete = canUpdate && !isArchived && status === "review_cleared";

  return (
    <div className="space-y-3 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium text-foreground">{procedure.title}</p>
          <p className="text-xs text-muted-foreground">
            {fieldworkLabels.procedureTypes[procedure.procedureType]}{" "}
            {fieldworkLabels.common.separator}{" "}
            {fieldworkLabels.procedureStatuses[procedure.procedureStatus]}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {fieldworkLabels.procedures.assignedTo}: {memberName(procedure.assignedAuditorId)}
            {procedure.dueDate
              ? ` ${fieldworkLabels.common.separator} ${fieldworkLabels.procedures.dueDate}: ${procedure.dueDate}`
              : null}
          </p>
        </div>
        <span className="text-sm font-medium">{procedure.completionPct}%</span>
      </div>

      {procedure.returnNotes && status === "returned" ? (
        <WorkspaceNoticeBanner
          variant="warning"
          title={fieldworkLabels.workflow.returnNotesTitle}
          description={procedure.returnNotes}
          role="alert"
        />
      ) : null}

      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

      {!isArchived && canAssign ? (
        <WorkspacePanel variant="muted" padding="sm" className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            {fieldworkLabels.procedures.assignAuditor}
            <select
              className="h-9 rounded-lg border border-border/60 bg-background px-2 text-sm text-foreground"
              value={procedure.assignedAuditorId ?? ""}
              onChange={(event) => assign(event.target.value || null)}
              disabled={isPending}
            >
              <option value="">{fieldworkLabels.procedures.unassigned}</option>
              {engagement.members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            {fieldworkLabels.procedures.dueDate}
            <Input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              onBlur={() => {
                if (dueDate !== (procedure.dueDate ?? "")) {
                  run(() =>
                    updateFieldworkProcedureAction({
                      packageId,
                      procedureId: procedure.id,
                      procedureVersion: procedure.version,
                      dueDate: dueDate || null,
                    }),
                  );
                }
              }}
            />
          </label>
        </WorkspacePanel>
      ) : null}

      {mode === "return" || mode === "clear" ? (
        <Input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={
            mode === "return"
              ? fieldworkLabels.workflow.returnNotesPlaceholder
              : fieldworkLabels.workflow.clearanceNotesPlaceholder
          }
        />
      ) : null}

      {!isArchived ? (
        <div className="flex flex-wrap gap-2">
          {canUpdate && status === "not_started" ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isPending}
              onClick={() =>
                run(() =>
                  updateFieldworkProcedureAction({
                    packageId,
                    procedureId: procedure.id,
                    procedureVersion: procedure.version,
                    procedureStatus: "in_progress",
                  }),
                )
              }
            >
              {fieldworkLabels.actions.start}
            </Button>
          ) : null}

          {showSubmit ? (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() =>
                run(() =>
                  submitFieldworkProcedureAction({
                    packageId,
                    procedureId: procedure.id,
                    procedureVersion: procedure.version,
                  }),
                )
              }
            >
              {fieldworkLabels.workflow.submitAction}
            </Button>
          ) : null}

          {showReturn ? (
            mode === "return" ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    run(() =>
                      returnFieldworkProcedureAction({
                        packageId,
                        procedureId: procedure.id,
                        procedureVersion: procedure.version,
                        notes: notes.trim() || null,
                      }),
                    )
                  }
                >
                  {fieldworkLabels.workflow.returnConfirmAction}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setMode("idle")}>
                  {fieldworkLabels.workflow.cancelAction}
                </Button>
              </>
            ) : (
              <Button type="button" size="sm" variant="secondary" onClick={() => setMode("return")}>
                {fieldworkLabels.workflow.returnAction}
              </Button>
            )
          ) : null}

          {showClear ? (
            mode === "clear" ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    run(() =>
                      clearFieldworkProcedureAction({
                        packageId,
                        procedureId: procedure.id,
                        procedureVersion: procedure.version,
                        notes: notes.trim() || null,
                      }),
                    )
                  }
                >
                  {fieldworkLabels.workflow.clearConfirmAction}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setMode("idle")}>
                  {fieldworkLabels.workflow.cancelAction}
                </Button>
              </>
            ) : (
              <Button type="button" size="sm" onClick={() => setMode("clear")}>
                {fieldworkLabels.workflow.clearAction}
              </Button>
            )
          ) : null}

          {showComplete ? (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() =>
                run(() =>
                  completeFieldworkProcedureAction({
                    packageId,
                    procedureId: procedure.id,
                    procedureVersion: procedure.version,
                  }),
                )
              }
            >
              {fieldworkLabels.actions.complete}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
