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
import {
  WorkspaceCard,
  WorkspaceEmpty,
  WorkspaceFormPanel,
  WorkspaceList,
  WorkspaceListItem,
  WorkspaceSectionShell,
} from "@/components/workspace";

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
        <WorkspaceEmpty description={labels.emptyDescription} title={labels.title} />
      ) : (
        <WorkspaceList>
          {comments.map((comment) => (
            <WorkspaceListItem key={comment.id} className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  {commentTypeLabel(comment.commentType)}
                </span>
                <time className="text-xs text-muted-foreground">
                  {formatDateTime(comment.createdAt, locale)}
                </time>
              </div>
              <p className="text-sm text-foreground">{comment.body}</p>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}

      {canComment && !plan.isArchived && !plan.isLocked && plan.planningStatus !== "pending_review" ? (
        <WorkspaceFormPanel className="pt-2">
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
        </WorkspaceFormPanel>
      ) : plan.planningStatus === "pending_review" && canComment ? (
        <p className="text-sm text-muted-foreground">{labels.reviewModeNotice}</p>
      ) : null}
    </>
  );

  if (embedded) {
    return (
      <WorkspaceCard title={labels.title} description={labels.description}>
        {content}
      </WorkspaceCard>
    );
  }

  return (
    <WorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="planning-comments"
    >
      {content}
    </WorkspaceSectionShell>
  );
}
