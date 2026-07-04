"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addPlanningCommentAction } from "@/lib/actions/planning";
import type { PlanningCommentView } from "@/lib/planning/load-planning-comments";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import { PlanningWorkspaceSectionShell } from "@/components/planning/workspace/planning-workspace-section-shell";

type PlanningCommentsSectionProps = {
  comments: PlanningCommentView[];
  canComment: boolean;
  locale: string;
  labels: Dictionary["planning"]["comments"];
  embedded?: boolean;
};

export function PlanningCommentsSection({
  comments,
  canComment,
  locale,
  labels,
  embedded = false,
}: PlanningCommentsSectionProps) {
  const router = useRouter();
  const { plan } = usePlanningWorkspace();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!plan) {
    return null;
  }

  const submit = () => {
    if (!body.trim()) return;

    startTransition(async () => {
      setError(null);
      const result = await addPlanningCommentAction({
        planId: plan.id,
        version: plan.version,
        body: body.trim(),
        commentType: "review",
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setBody("");
      router.refresh();
    });
  };

  const commentTypeLabel = (type: string) =>
    labels.types[type as keyof typeof labels.types] ?? labels.types.general;

  const content = (
    <>
      {error ? <Alert variant="error">{error}</Alert> : null}

      {comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">{labels.emptyDescription}</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {comments.map((comment) => (
            <li key={comment.id} className="space-y-1 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  {commentTypeLabel(comment.commentType)}
                </span>
                <time className="text-xs text-muted-foreground">
                  {formatDateTime(comment.createdAt, locale)}
                </time>
              </div>
              <p className="text-sm text-foreground">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      {canComment && !plan.isArchived && !plan.isLocked && plan.planningStatus !== "pending_review" ? (
        <div className="space-y-3 pt-2">
          <label htmlFor="planning-comment" className="text-sm font-medium text-foreground">
            {labels.addLabel}
          </label>
          <Input
            id="planning-comment"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={labels.addPlaceholder}
          />
          <Button type="button" onClick={submit} disabled={isPending || !body.trim()}>
            {labels.addAction}
          </Button>
        </div>
      ) : plan.planningStatus === "pending_review" && canComment ? (
        <p className="text-sm text-muted-foreground">{labels.reviewModeNotice}</p>
      ) : null}
    </>
  );

  if (embedded) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/90 shadow-xs">
        <div className="border-b border-border/40 px-4 py-3.5 sm:px-5">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{labels.title}</h3>
          <p className="text-xs text-muted-foreground">{labels.description}</p>
        </div>
        <div className="p-4 sm:p-5">{content}</div>
      </div>
    );
  }

  return (
    <PlanningWorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="planning-comments"
    >
      {content}
    </PlanningWorkspaceSectionShell>
  );
}
