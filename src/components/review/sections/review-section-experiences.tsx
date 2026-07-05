"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import {
  WorkspaceEmptyPanel,
  WorkspaceList,
  WorkspaceListItem,
  WorkspaceMetricCard,
  WorkspaceNoticeBanner,
  WorkspacePanel,
  WorkspaceStatusBadge,
  WorkspaceTable,
} from "@/components/workspace";
import { ReviewCreateExperience } from "@/components/review/create/review-create-experience";
import { ReviewItemRow } from "@/components/review/items/review-item-row";
import { ReviewWorkspaceSectionShell } from "@/components/review/workspace/review-workspace-section-shell";
import { ReviewWorkspaceReadonlyNotice } from "@/components/review/workspace/review-workspace-states";
import {
  archiveReviewAction,
  archiveReviewCommentAction,
  commentReviewAction,
  restoreReviewAction,
  restoreReviewCommentAction,
  restoreReviewVersionAction,
  resolveReviewCommentAction,
  unresolveReviewCommentAction,
  updateReviewCommentAction,
} from "@/lib/actions/review";
import { formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import type { ReviewActivityView } from "@/lib/review/review-workspace-view";
import {
  formatReviewActivityAction,
  formatReviewActivitySummary,
} from "@/lib/review/review-workspace-display";
import { useReviewWorkspace } from "@/lib/review/use-review-workspace";
import type {
  ReviewCommentView,
  ReviewItemView,
  ReviewVersionView,
  ReviewWorkspaceView,
} from "@/lib/review/review-workspace-view";

type CreateLabels = {
  title: string;
  description: string;
  createAction: string;
  creating: string;
  forbiddenDescription: string;
};

type SectionLabels = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  columns?: Record<string, string>;
};

type GateProps = {
  canCreate?: boolean;
  fieldworkStarted?: boolean;
  fieldworkSubstantiallyComplete?: boolean;
  emptyLabels: CreateLabels;
  workspaceLabels: {
    fieldworkGateDescription: string;
    fieldworkSubstantiallyCompleteDescription: string;
    archivedDescription: string;
  };
};

type BaseProps = GateProps & {
  labels: SectionLabels;
  archivedReadOnlyLabel?: string;
  locale?: string;
  canReview?: boolean;
  canComment?: boolean;
  canArchive?: boolean;
  workflowLabels?: { errorGeneric: string };
};

function useWorkspaceOrCreate(props: GateProps) {
  const { review, fieldworkStarted, fieldworkSubstantiallyComplete } = useReviewWorkspace();

  if (!review) {
    return (
      <ReviewCreateExperience
        canCreate={props.canCreate ?? false}
        fieldworkStarted={props.fieldworkStarted ?? fieldworkStarted}
        fieldworkSubstantiallyComplete={
          props.fieldworkSubstantiallyComplete ?? fieldworkSubstantiallyComplete
        }
        labels={props.emptyLabels}
        gateLabels={{
          fieldworkGateDescription: props.workspaceLabels.fieldworkGateDescription,
          fieldworkSubstantiallyCompleteDescription:
            props.workspaceLabels.fieldworkSubstantiallyCompleteDescription,
        }}
      />
    );
  }
  return review;
}

function ArchivedNotice({ message }: { message: string }) {
  return <WorkspaceNoticeBanner variant="warning" description={message} role="status" />;
}

function useMutationError() {
  const [error, setError] = useState<string | null>(null);
  return { error, setError, clearError: () => setError(null) };
}

type ItemLabels = {
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
  itemStatuses: Record<string, string>;
  sourceModules: Record<string, string>;
};

function ReviewItemsSection(
  props: BaseProps & {
    items: ReviewItemView[];
    headingId: string;
    itemLabels: ItemLabels;
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("items" in workspace)) return workspace;

  return (
    <ReviewWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId={props.headingId}
    >
      {workspace.isArchived ? (
        <ArchivedNotice
          message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription}
        />
      ) : null}
      {props.items.length === 0 ? (
        <WorkspaceEmptyPanel
          title={props.labels.emptyTitle}
          description={props.labels.emptyDescription}
        />
      ) : (
        <WorkspaceList>
          {props.items.map((item) => (
            <WorkspaceListItem key={item.id} className="p-0">
              <ReviewItemRow
                packageId={workspace.id}
                packageVersion={workspace.version}
                item={item}
                isArchived={workspace.isArchived}
                canReview={props.canReview ?? false}
                labels={props.itemLabels}
              />
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
    </ReviewWorkspaceSectionShell>
  );
}

export function ReviewQueueExperience(
  props: BaseProps & { itemLabels: ItemLabels },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("items" in workspace)) return workspace;

  return (
    <ReviewItemsSection
      {...props}
      items={workspace.items}
      headingId="review-queue"
    />
  );
}

export function OpenFindingsExperience(
  props: BaseProps & { itemLabels: ItemLabels },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("items" in workspace)) return workspace;

  const items = workspace.items.filter(
    (item: ReviewItemView) => item.sourceModule === "fieldwork" && Boolean(item.severity),
  );

  return (
    <ReviewItemsSection
      {...props}
      items={items}
      headingId="review-open-findings"
    />
  );
}

export function PendingReviewsExperience(
  props: BaseProps & { itemLabels: ItemLabels },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("items" in workspace)) return workspace;

  const items = workspace.items.filter((item: ReviewItemView) =>
    ["pending", "under_review"].includes(item.itemStatus),
  );

  return (
    <ReviewItemsSection
      {...props}
      items={items}
      headingId="review-pending-reviews"
    />
  );
}

export function ResolvedReviewsExperience(
  props: BaseProps & { itemLabels: ItemLabels },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("items" in workspace)) return workspace;

  const items = workspace.items.filter((item: ReviewItemView) => item.itemStatus === "resolved");

  return (
    <ReviewItemsSection
      {...props}
      items={items}
      headingId="review-resolved-reviews"
    />
  );
}

type NoteLabels = {
  bodyPlaceholder: string;
  addAction: string;
  editAction: string;
  saveAction: string;
  archiveAction: string;
  restoreAction: string;
  cancelAction: string;
  resolvedBadge: string;
  unresolvedBadge: string;
  replyAction: string;
  attachmentsLabel: string;
};

function ReviewNotesSection(
  props: BaseProps & {
    notes: ReviewCommentView[];
    commentType: "reviewer" | "review" | "internal";
    headingId: string;
    commentTypeLabels: Record<string, string>;
    noteLabels: NoteLabels;
    includeArchived?: boolean;
  },
) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();

  if (typeof workspace !== "object" || !("id" in workspace)) return workspace;

  const mutable = (props.canComment ?? false) && !workspace.isArchived;
  const visibleNotes = props.includeArchived
    ? props.notes
    : props.notes.filter((note) => !note.isArchived);

  const roots = visibleNotes.filter((note) => !note.parentCommentId);
  const childrenByParent = useMemo(() => {
    const map = new Map<string, ReviewCommentView[]>();
    for (const note of visibleNotes) {
      if (!note.parentCommentId) continue;
      const list = map.get(note.parentCommentId) ?? [];
      list.push(note);
      map.set(note.parentCommentId, list);
    }
    return map;
  }, [visibleNotes]);

  const addNote = () => {
    if (!body.trim()) return;
    startTransition(async () => {
      clearError();
      const result = await commentReviewAction({
        packageId: workspace.id,
        version: workspace.version,
        body: body.trim(),
        commentType: props.commentType,
        parentCommentId: replyParentId,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels?.errorGeneric ?? "");
        return;
      }
      setBody("");
      setReplyParentId(null);
      router.refresh();
    });
  };

  const saveEdit = (comment: ReviewCommentView) => {
    startTransition(async () => {
      clearError();
      const result = await updateReviewCommentAction({
        packageId: workspace.id,
        packageVersion: workspace.version,
        commentId: comment.id,
        commentVersion: comment.version,
        body: editBody.trim(),
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels?.errorGeneric ?? "");
        return;
      }
      setEditingId(null);
      setEditBody("");
      router.refresh();
    });
  };

  const archiveNote = (comment: ReviewCommentView) => {
    startTransition(async () => {
      clearError();
      const result = await archiveReviewCommentAction({
        packageId: workspace.id,
        packageVersion: workspace.version,
        commentId: comment.id,
        commentVersion: comment.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels?.errorGeneric ?? "");
        return;
      }
      router.refresh();
    });
  };

  const restoreNote = (comment: ReviewCommentView) => {
    startTransition(async () => {
      clearError();
      const result = await restoreReviewCommentAction({
        packageId: workspace.id,
        packageVersion: workspace.version,
        commentId: comment.id,
        commentVersion: comment.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels?.errorGeneric ?? "");
        return;
      }
      router.refresh();
    });
  };

  const toggleResolved = (comment: ReviewCommentView) => {
    startTransition(async () => {
      clearError();
      const action = comment.resolvedAt ? unresolveReviewCommentAction : resolveReviewCommentAction;
      const result = await action({
        packageId: workspace.id,
        packageVersion: workspace.version,
        commentId: comment.id,
        commentVersion: comment.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels?.errorGeneric ?? "");
        return;
      }
      router.refresh();
    });
  };

  const renderNote = (comment: ReviewCommentView, depth = 0) => (
    <WorkspaceListItem key={comment.id} className={depth > 0 ? "ml-4 border-l border-border/60 pl-4" : undefined}>
      <div className="flex items-start justify-between gap-3">
        {editingId === comment.id ? (
          <Input
            value={editBody}
            onChange={(event) => setEditBody(event.target.value)}
            className="flex-1"
          />
        ) : (
          <p className="text-sm leading-relaxed text-foreground">{comment.body}</p>
        )}
        <div className="flex shrink-0 flex-wrap items-center gap-1">
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {props.commentTypeLabels[comment.commentType] ?? comment.commentType}
          </span>
          {comment.resolvedAt ? (
            <WorkspaceStatusBadge label={props.noteLabels.resolvedBadge} variant="success" />
          ) : (
            <WorkspaceStatusBadge label={props.noteLabels.unresolvedBadge} variant="outline" />
          )}
          {comment.isArchived ? (
            <WorkspaceStatusBadge label={props.noteLabels.archiveAction} variant="warning" />
          ) : null}
        </div>
      </div>
      {comment.mentions.length > 0 ? (
        <p className="mt-1 text-xs text-muted-foreground">@{comment.mentions.join(" @")}</p>
      ) : null}
      {comment.attachments.length > 0 ? (
        <p className="mt-1 text-xs text-muted-foreground">
          {props.noteLabels.attachmentsLabel}: {comment.attachments.map((a) => a.name).join(", ")}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        {formatDateTime(comment.createdAt, props.locale ?? "en")}
      </p>
      {mutable ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {editingId === comment.id ? (
            <>
              <Button type="button" size="sm" onClick={() => saveEdit(comment)} disabled={isPending}>
                {props.noteLabels.saveAction}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)} disabled={isPending}>
                {props.noteLabels.cancelAction}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditingId(comment.id);
                  setEditBody(comment.body);
                }}
                disabled={isPending}
              >
                {props.noteLabels.editAction}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setReplyParentId(comment.id)} disabled={isPending}>
                {props.noteLabels.replyAction}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => toggleResolved(comment)} disabled={isPending}>
                {comment.resolvedAt ? props.noteLabels.unresolvedBadge : props.noteLabels.resolvedBadge}
              </Button>
              {comment.isArchived ? (
                <Button type="button" size="sm" variant="secondary" onClick={() => restoreNote(comment)} disabled={isPending}>
                  {props.noteLabels.restoreAction}
                </Button>
              ) : (
                <Button type="button" size="sm" variant="secondary" onClick={() => archiveNote(comment)} disabled={isPending}>
                  {props.noteLabels.archiveAction}
                </Button>
              )}
            </>
          )}
        </div>
      ) : null}
      {(childrenByParent.get(comment.id) ?? []).map((child) => renderNote(child, depth + 1))}
    </WorkspaceListItem>
  );

  return (
    <ReviewWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId={props.headingId}
    >
      {workspace.isArchived ? (
        <ArchivedNotice
          message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription}
        />
      ) : null}
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

      {mutable ? (
        <WorkspacePanel variant="form" className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={
              replyParentId
                ? `${props.noteLabels.replyAction}...`
                : props.noteLabels.bodyPlaceholder
            }
            className="flex-1"
          />
          <Button type="button" onClick={addNote} disabled={isPending || !body.trim()}>
            {props.noteLabels.addAction}
          </Button>
          {replyParentId ? (
            <Button type="button" variant="ghost" onClick={() => setReplyParentId(null)} disabled={isPending}>
              {props.noteLabels.cancelAction}
            </Button>
          ) : null}
        </WorkspacePanel>
      ) : (
        <ReviewWorkspaceReadonlyNotice
          message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription}
        />
      )}

      {visibleNotes.length === 0 ? (
        <WorkspaceEmptyPanel
          title={props.labels.emptyTitle}
          description={props.labels.emptyDescription}
        />
      ) : (
        <WorkspaceList>{roots.map((note) => renderNote(note))}</WorkspaceList>
      )}
    </ReviewWorkspaceSectionShell>
  );
}

export function ReviewerNotesExperience(
  props: BaseProps & {
    commentTypeLabels: Record<string, string>;
    noteLabels: NoteLabels;
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("reviewerNotes" in workspace)) return workspace;

  return (
    <ReviewNotesSection
      {...props}
      notes={workspace.reviewerNotes}
      commentType="reviewer"
      headingId="review-reviewer-notes"
    />
  );
}

export function ReviewCommentsExperience(
  props: BaseProps & {
    commentTypeLabels: Record<string, string>;
    noteLabels: NoteLabels;
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("comments" in workspace)) return workspace;

  return (
    <ReviewNotesSection
      {...props}
      notes={workspace.comments}
      commentType="review"
      headingId="review-comments"
    />
  );
}

export function ReviewVersionsExperience(
  props: BaseProps & {
    versionLabels: {
      latestBadge: string;
      compareAction: string;
      restoreAction: string;
      restoreConfirmAction: string;
      cancelAction: string;
      diffTitle: string;
      noDiff: string;
      errorGeneric: string;
    };
  },
) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [compareA, setCompareA] = useState<string>("");
  const [compareB, setCompareB] = useState<string>("");
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();

  if (typeof workspace !== "object" || !("versions" in workspace)) return workspace;

  const diffText = useMemo(() => {
    const a = workspace.versions.find((v) => v.id === compareA);
    const b = workspace.versions.find((v) => v.id === compareB);
    if (!a || !b) return null;
    const aJson = JSON.stringify(a.snapshot ?? {}, null, 2);
    const bJson = JSON.stringify(b.snapshot ?? {}, null, 2);
    if (aJson === bJson) return props.versionLabels.noDiff;
    return `v${a.versionNumber} ↔ v${b.versionNumber}\n\n--- v${a.versionNumber} ---\n${aJson}\n\n--- v${b.versionNumber} ---\n${bJson}`;
  }, [compareA, compareB, workspace.versions, props.versionLabels.noDiff]);

  const restore = () => {
    if (!restoreId) return;
    startTransition(async () => {
      clearError();
      const result = await restoreReviewVersionAction({
        packageId: workspace.id,
        version: workspace.version,
        versionId: restoreId,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.versionLabels.errorGeneric);
        return;
      }
      setRestoreId(null);
      router.refresh();
    });
  };

  return (
    <ReviewWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="review-versions"
    >
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

      <WorkspacePanel variant="form" className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          A
          <select
            className="h-9 rounded-lg border border-border/60 bg-background px-2 text-sm"
            value={compareA}
            onChange={(event) => setCompareA(event.target.value)}
          >
            <option value="">—</option>
            {workspace.versions.map((v) => (
              <option key={v.id} value={v.id}>
                v{v.versionNumber}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          B
          <select
            className="h-9 rounded-lg border border-border/60 bg-background px-2 text-sm"
            value={compareB}
            onChange={(event) => setCompareB(event.target.value)}
          >
            <option value="">—</option>
            {workspace.versions.map((v) => (
              <option key={v.id} value={v.id}>
                v{v.versionNumber}
              </option>
            ))}
          </select>
        </label>
      </WorkspacePanel>

      {diffText ? (
        <WorkspacePanel>
          <p className="mb-2 text-sm font-medium text-foreground">{props.versionLabels.diffTitle}</p>
          <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs text-foreground">{diffText}</pre>
        </WorkspacePanel>
      ) : null}

      <WorkspaceTable<ReviewVersionView>
        columns={[
          {
            id: "version",
            header: props.labels.columns?.version ?? props.labels.title,
            cell: (version) => (
              <span className="inline-flex items-center gap-2">
                v{version.versionNumber}
                {version.isLatest ? (
                  <WorkspaceStatusBadge label={props.versionLabels.latestBadge} variant="success" />
                ) : null}
              </span>
            ),
          },
          {
            id: "summary",
            header: props.labels.columns?.summary ?? props.labels.description,
            cell: (version) => version.changeSummary ?? "—",
          },
          {
            id: "created",
            header: props.labels.columns?.created ?? props.labels.title,
            cell: (version) => formatDateTime(version.createdAt, props.locale ?? "en"),
            hideOnMobile: true,
          },
          {
            id: "actions",
            header: props.labels.columns?.actions ?? "",
            cell: (version) =>
              !workspace.isArchived && !version.isLatest ? (
                restoreId === version.id ? (
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={restore} disabled={isPending}>
                      {props.versionLabels.restoreConfirmAction}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setRestoreId(null)} disabled={isPending}>
                      {props.versionLabels.cancelAction}
                    </Button>
                  </div>
                ) : (
                  <Button type="button" size="sm" variant="secondary" onClick={() => setRestoreId(version.id)}>
                    {props.versionLabels.restoreAction}
                  </Button>
                )
              ) : null,
            hideOnMobile: true,
          },
        ]}
        rows={workspace.versions}
        keyFn={(version) => version.id}
        emptyTitle={props.labels.emptyTitle}
        emptyDescription={props.labels.emptyDescription}
      />
    </ReviewWorkspaceSectionShell>
  );
}

export function ReviewHistoryExperience(
  props: BaseProps & {
    activity: ReviewActivityView;
    historyLabels: {
      versionLabel: string;
      updatedLabel: string;
      actions: Record<string, string>;
      filterActor: string;
      filterModule: string;
      filterAction: string;
      filterDate: string;
      all: string;
    };
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  const [actorFilter, setActorFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  if (typeof workspace !== "object" || !("id" in workspace)) return workspace;

  const actors = [...new Set(props.activity.entries.map((e) => e.actorName ?? "").filter(Boolean))];
  const modules = [...new Set(props.activity.entries.map((e) => e.sourceModule ?? "").filter(Boolean))];
  const actions = [...new Set(props.activity.entries.map((e) => e.action))];

  const filtered = props.activity.entries.filter((entry) => {
    if (actorFilter && (entry.actorName ?? "") !== actorFilter) return false;
    if (moduleFilter && (entry.sourceModule ?? "") !== moduleFilter) return false;
    if (actionFilter && entry.action !== actionFilter) return false;
    if (dateFilter && !entry.createdAt.startsWith(dateFilter)) return false;
    return true;
  });

  return (
    <ReviewWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="review-history"
    >
      <WorkspacePanel variant="form" className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          {props.historyLabels.filterActor}
          <select
            className="h-9 rounded-lg border border-border/60 bg-background px-2 text-sm"
            value={actorFilter}
            onChange={(event) => setActorFilter(event.target.value)}
          >
            <option value="">{props.historyLabels.all}</option>
            {actors.map((actor) => (
              <option key={actor} value={actor}>
                {actor}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          {props.historyLabels.filterModule}
          <select
            className="h-9 rounded-lg border border-border/60 bg-background px-2 text-sm"
            value={moduleFilter}
            onChange={(event) => setModuleFilter(event.target.value)}
          >
            <option value="">{props.historyLabels.all}</option>
            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          {props.historyLabels.filterAction}
          <select
            className="h-9 rounded-lg border border-border/60 bg-background px-2 text-sm"
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
          >
            <option value="">{props.historyLabels.all}</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {formatReviewActivityAction(action, props.historyLabels.actions)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          {props.historyLabels.filterDate}
          <Input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
        </label>
      </WorkspacePanel>

      <WorkspaceTable
        columns={[
          {
            id: "action",
            header: props.labels.columns?.action ?? props.labels.title,
            cell: (entry) =>
              formatReviewActivityAction(entry.action, props.historyLabels.actions),
          },
          {
            id: "actor",
            header: props.historyLabels.filterActor,
            cell: (entry) => entry.actorName ?? "—",
            hideOnMobile: true,
          },
          {
            id: "summary",
            header: props.labels.columns?.summary ?? props.labels.description,
            cell: (entry) => formatReviewActivitySummary(entry.summary),
          },
          {
            id: "created",
            header: props.labels.columns?.date ?? props.historyLabels.updatedLabel,
            cell: (entry) => formatDateTime(entry.createdAt, props.locale ?? "en"),
            hideOnMobile: true,
          },
          {
            id: "version",
            header: props.labels.columns?.version ?? props.historyLabels.versionLabel,
            cell: (entry) => (entry.packageVersion != null ? String(entry.packageVersion) : "—"),
            hideOnMobile: true,
          },
        ]}
        rows={filtered}
        keyFn={(entry) => entry.id}
        emptyTitle={props.labels.emptyTitle}
        emptyDescription={props.labels.emptyDescription}
      />
    </ReviewWorkspaceSectionShell>
  );
}

export function ReviewSettingsExperience(
  props: BaseProps & {
    settingsLabels: {
      archiveAction: string;
      archiveConfirmAction: string;
      restoreAction: string;
      restoreConfirmAction: string;
      cancelAction: string;
      archivedBanner: string;
      readOnlyNotice: string;
    };
  },
) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();

  if (typeof workspace !== "object" || !("isArchived" in workspace)) return workspace;

  const archive = () => {
    startTransition(async () => {
      clearError();
      const result = await archiveReviewAction({
        packageId: workspace.id,
        version: workspace.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels?.errorGeneric ?? "");
        return;
      }
      setConfirmArchive(false);
      router.refresh();
    });
  };

  const restore = () => {
    startTransition(async () => {
      clearError();
      const result = await restoreReviewAction({
        packageId: workspace.id,
        version: workspace.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels?.errorGeneric ?? "");
        return;
      }
      setConfirmRestore(false);
      router.refresh();
    });
  };

  return (
    <ReviewWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="review-settings"
    >
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
      {workspace.isArchived ? (
        <WorkspaceNoticeBanner
          variant="warning"
          description={props.settingsLabels.archivedBanner}
          role="status"
        />
      ) : null}
      {!props.canArchive ? (
        <ReviewWorkspaceReadonlyNotice message={props.settingsLabels.readOnlyNotice} />
      ) : null}

      {workspace.summaryNotes ? (
        <WorkspaceMetricCard label={props.labels.title} value={workspace.summaryNotes} />
      ) : (
        <WorkspaceEmptyPanel
          title={props.labels.emptyTitle}
          description={props.labels.emptyDescription}
        />
      )}

      {props.canArchive ? (
        <WorkspacePanel>
          <div className="flex flex-wrap gap-2">
            {workspace.isArchived ? (
              confirmRestore ? (
                <>
                  <Button type="button" onClick={restore} disabled={isPending}>
                    {props.settingsLabels.restoreConfirmAction}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setConfirmRestore(false)}
                    disabled={isPending}
                  >
                    {props.settingsLabels.cancelAction}
                  </Button>
                </>
              ) : (
                <Button type="button" variant="secondary" onClick={() => setConfirmRestore(true)}>
                  {props.settingsLabels.restoreAction}
                </Button>
              )
            ) : confirmArchive ? (
              <>
                <Button type="button" variant="destructive" onClick={archive} disabled={isPending}>
                  {props.settingsLabels.archiveConfirmAction}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmArchive(false)}
                  disabled={isPending}
                >
                  {props.settingsLabels.cancelAction}
                </Button>
              </>
            ) : (
              <Button type="button" variant="secondary" onClick={() => setConfirmArchive(true)}>
                {props.settingsLabels.archiveAction}
              </Button>
            )}
          </div>
        </WorkspacePanel>
      ) : null}
    </ReviewWorkspaceSectionShell>
  );
}
