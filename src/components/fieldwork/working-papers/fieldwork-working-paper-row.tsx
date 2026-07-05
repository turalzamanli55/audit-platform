"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  clearFieldworkWorkingPaperAction,
  returnFieldworkWorkingPaperAction,
  submitFieldworkWorkingPaperAction,
  updateWorkingPaperAction,
} from "@/lib/actions/fieldwork";
import { useEngagementWorkspace } from "@/lib/engagement/use-engagement-workspace";
import type { FieldworkWorkingPaperView } from "@/types/fieldwork";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";

type FieldworkWorkingPaperRowProps = {
  packageId: string;
  paper: FieldworkWorkingPaperView;
  isArchived: boolean;
  canAssign: boolean;
  canUpdate: boolean;
  canReview: boolean;
  fieldworkLabels: Dictionary["fieldwork"];
  onAddTickmark: () => void;
};

export function FieldworkWorkingPaperRow({
  packageId,
  paper,
  isArchived,
  canAssign,
  canUpdate,
  canReview,
  fieldworkLabels,
  onAddTickmark,
}: FieldworkWorkingPaperRowProps) {
  const router = useRouter();
  const { engagement } = useEngagementWorkspace();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<"idle" | "return" | "clear">("idle");
  const wpLabels = fieldworkLabels.workingPapers;
  const workflow = fieldworkLabels.workflow;

  const memberName = (userId: string | null) => {
    if (!userId) return fieldworkLabels.procedures.unassigned;
    return engagement.members.find((m) => m.userId === userId)?.displayName ?? wpLabels.assignAuditor;
  };

  const run = (action: () => Promise<{ success: boolean; error?: { message: string } }>) => {
    startTransition(async () => {
      setError(null);
      const result = await action();
      if (!result.success) {
        setError(result.error?.message ?? workflow.errorGeneric);
        return;
      }
      setMode("idle");
      setNotes("");
      router.refresh();
    });
  };

  const assignPaper = (assignedAuditorId: string | null) => {
    run(() =>
      updateWorkingPaperAction({
        packageId,
        workingPaperId: paper.id,
        workingPaperVersion: paper.version,
        assignedAuditorId,
      }),
    );
  };

  const status = paper.paperStatus;
  const showSubmit = canUpdate && !isArchived && (status === "in_progress" || status === "returned");
  const showReturn = canReview && !isArchived && (status === "submitted" || status === "under_review");
  const showClear = canReview && !isArchived && (status === "submitted" || status === "under_review");

  return (
    <div className="space-y-3 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium text-foreground">{paper.title}</p>
          <p className="text-xs text-muted-foreground">
            {paper.procedureTitle} {fieldworkLabels.common.separator}{" "}
            {fieldworkLabels.workingPaperStatuses[paper.paperStatus]}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {wpLabels.assignAuditor}: {memberName(paper.assignedAuditorId)}
          </p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onAddTickmark} disabled={isArchived}>
          {fieldworkLabels.actions.addTickmark}
        </Button>
      </div>

      {paper.returnNotes && status === "returned" ? (
        <Alert variant="warning" title={workflow.returnNotesTitle}>
          {paper.returnNotes}
        </Alert>
      ) : null}

      {paper.tickmarks.length > 0 ? (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {paper.tickmarks.map((tickmark) => (
            <li key={tickmark.id}>
              <span className="font-medium text-foreground">{tickmark.symbol}</span>{" "}
              {fieldworkLabels.common.tickmarkMeaningSeparator} {tickmark.meaning}
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <Alert variant="error">{error}</Alert> : null}

      {!isArchived && canAssign ? (
        <select
          className="h-9 w-full rounded-lg border border-border/60 bg-background px-2 text-sm sm:max-w-xs"
          value={paper.assignedAuditorId ?? ""}
          onChange={(event) => assignPaper(event.target.value || null)}
          disabled={isPending}
        >
          <option value="">{wpLabels.assignAuditor}</option>
          {engagement.members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.displayName}
            </option>
          ))}
        </select>
      ) : null}

      {mode === "return" || mode === "clear" ? (
        <Input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={
            mode === "return" ? workflow.returnNotesPlaceholder : workflow.clearanceNotesPlaceholder
          }
        />
      ) : null}

      {!isArchived ? (
        <div className="flex flex-wrap gap-2">
          {showSubmit ? (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() =>
                run(() =>
                  submitFieldworkWorkingPaperAction({
                    packageId,
                    workingPaperId: paper.id,
                    workingPaperVersion: paper.version,
                  }),
                )
              }
            >
              {workflow.submitAction}
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
                      returnFieldworkWorkingPaperAction({
                        packageId,
                        workingPaperId: paper.id,
                        workingPaperVersion: paper.version,
                        notes: notes.trim() || null,
                      }),
                    )
                  }
                >
                  {workflow.returnConfirmAction}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setMode("idle")}>
                  {workflow.cancelAction}
                </Button>
              </>
            ) : (
              <Button type="button" size="sm" variant="secondary" onClick={() => setMode("return")}>
                {workflow.returnAction}
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
                      clearFieldworkWorkingPaperAction({
                        packageId,
                        workingPaperId: paper.id,
                        workingPaperVersion: paper.version,
                        notes: notes.trim() || null,
                      }),
                    )
                  }
                >
                  {workflow.clearConfirmAction}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setMode("idle")}>
                  {workflow.cancelAction}
                </Button>
              </>
            ) : (
              <Button type="button" size="sm" onClick={() => setMode("clear")}>
                {workflow.clearAction}
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
