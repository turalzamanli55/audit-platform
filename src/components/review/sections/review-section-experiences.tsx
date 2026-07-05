"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import {
  WorkspaceEmptyPanel,
  WorkspaceList,
  WorkspaceListItem,
  WorkspaceMetricCard,
  WorkspaceNoticeBanner,
  WorkspacePanel,
  WorkspaceTable,
} from "@/components/workspace";
import { ReviewCreateExperience } from "@/components/review/create/review-create-experience";
import { ReviewWorkspaceSectionShell } from "@/components/review/workspace/review-workspace-section-shell";
import { ReviewWorkspaceReadonlyNotice } from "@/components/review/workspace/review-workspace-states";
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
  onCreate?: () => Promise<{ success: boolean }>;
};

type BaseProps = GateProps & {
  labels: SectionLabels;
  archivedReadOnlyLabel?: string;
  locale?: string;
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
        onCreate={props.onCreate}
      />
    );
  }
  return review;
}

function ArchivedNotice({ message }: { message: string }) {
  return <WorkspaceNoticeBanner variant="warning" description={message} role="status" />;
}

function itemColumns(
  props: BaseProps & {
    sourceModuleLabels: Record<string, string>;
    itemStatusLabels: Record<string, string>;
  },
) {
  return [
    {
      id: "title",
      header: props.labels.columns?.title ?? props.labels.title,
      cell: (item: ReviewItemView) => item.title,
    },
    {
      id: "module",
      header: props.labels.columns?.module ?? props.labels.description,
      cell: (item: ReviewItemView) =>
        props.sourceModuleLabels[item.sourceModule] ?? item.sourceModule,
      hideOnMobile: true,
    },
    {
      id: "status",
      header: props.labels.columns?.status ?? props.labels.title,
      cell: (item: ReviewItemView) =>
        props.itemStatusLabels[item.itemStatus] ?? item.itemStatus,
    },
    {
      id: "severity",
      header: props.labels.columns?.severity ?? props.labels.description,
      cell: (item: ReviewItemView) => item.severity ?? "—",
      hideOnMobile: true,
    },
  ];
}

function ReviewItemsSection(
  props: BaseProps & {
    items: ReviewItemView[];
    headingId: string;
    sourceModuleLabels: Record<string, string>;
    itemStatusLabels: Record<string, string>;
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
      <WorkspaceTable<ReviewItemView>
        columns={itemColumns(props)}
        rows={props.items}
        keyFn={(item) => item.id}
        emptyTitle={props.labels.emptyTitle}
        emptyDescription={props.labels.emptyDescription}
      />
    </ReviewWorkspaceSectionShell>
  );
}

export function ReviewQueueExperience(
  props: BaseProps & {
    sourceModuleLabels: Record<string, string>;
    itemStatusLabels: Record<string, string>;
  },
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
  props: BaseProps & {
    sourceModuleLabels: Record<string, string>;
    itemStatusLabels: Record<string, string>;
  },
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
  props: BaseProps & {
    sourceModuleLabels: Record<string, string>;
    itemStatusLabels: Record<string, string>;
  },
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
  props: BaseProps & {
    sourceModuleLabels: Record<string, string>;
    itemStatusLabels: Record<string, string>;
  },
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

export function ReviewerNotesExperience(
  props: BaseProps & {
    commentTypeLabels: Record<string, string>;
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("reviewerNotes" in workspace)) return workspace;

  return (
    <ReviewWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="review-reviewer-notes"
    >
      {workspace.isArchived ? (
        <ArchivedNotice
          message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription}
        />
      ) : null}
      {workspace.reviewerNotes.length === 0 ? (
        <WorkspaceEmptyPanel
          title={props.labels.emptyTitle}
          description={props.labels.emptyDescription}
        />
      ) : (
        <WorkspaceList>
          {workspace.reviewerNotes.map((comment: ReviewCommentView) => (
            <WorkspaceListItem key={comment.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed text-foreground">{comment.body}</p>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {props.commentTypeLabels[comment.commentType] ?? comment.commentType}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDateTime(comment.createdAt, props.locale ?? "en")}
              </p>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
    </ReviewWorkspaceSectionShell>
  );
}

export function ReviewCommentsExperience(
  props: BaseProps & {
    commentTypeLabels: Record<string, string>;
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("comments" in workspace)) return workspace;

  return (
    <ReviewWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="review-comments"
    >
      {workspace.isArchived ? (
        <ArchivedNotice
          message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription}
        />
      ) : null}
      {workspace.comments.length === 0 ? (
        <WorkspaceEmptyPanel
          title={props.labels.emptyTitle}
          description={props.labels.emptyDescription}
        />
      ) : (
        <WorkspaceList>
          {workspace.comments.map((comment: ReviewCommentView) => (
            <WorkspaceListItem key={comment.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed text-foreground">{comment.body}</p>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {props.commentTypeLabels[comment.commentType] ?? comment.commentType}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDateTime(comment.createdAt, props.locale ?? "en")}
              </p>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
      {workspace.isArchived ? (
        <ReviewWorkspaceReadonlyNotice
          message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription}
        />
      ) : null}
    </ReviewWorkspaceSectionShell>
  );
}

export function ReviewVersionsExperience(props: BaseProps) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("versions" in workspace)) return workspace;

  return (
    <ReviewWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="review-versions"
    >
      <WorkspaceTable<ReviewVersionView>
        columns={[
          {
            id: "version",
            header: props.labels.columns?.version ?? props.labels.title,
            cell: (version) => `v${version.versionNumber}`,
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
    };
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("id" in workspace)) return workspace;

  return (
    <ReviewWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="review-history"
    >
      <WorkspaceTable
        columns={[
          {
            id: "action",
            header: props.labels.columns?.action ?? props.labels.title,
            cell: (entry) =>
              formatReviewActivityAction(entry.action, props.historyLabels.actions),
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
        rows={props.activity.entries}
        keyFn={(entry) => entry.id}
        emptyTitle={props.labels.emptyTitle}
        emptyDescription={props.labels.emptyDescription}
      />
    </ReviewWorkspaceSectionShell>
  );
}

export function ReviewSettingsExperience(
  props: BaseProps & {
    canArchive?: boolean;
    settingsLabels: {
      archiveAction: string;
      archiveConfirmAction: string;
      restoreAction: string;
      restoreConfirmAction: string;
      cancelAction: string;
      archivedBanner: string;
      readOnlyNotice: string;
    };
    onArchive?: () => Promise<{ success: boolean; error?: { message?: string } }>;
    onRestore?: () => Promise<{ success: boolean; error?: { message?: string } }>;
    onComplete?: () => void;
    workflowLabels?: { errorGeneric: string };
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (typeof workspace !== "object" || !("isArchived" in workspace)) return workspace;

  const run = async (action: () => Promise<{ success: boolean; error?: { message?: string } }>) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels?.errorGeneric ?? "");
        return;
      }
      props.onComplete?.();
    } finally {
      setIsPending(false);
    }
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

      {props.canArchive && (props.onArchive || props.onRestore) ? (
        <WorkspacePanel>
          <div className="flex flex-wrap gap-2">
            {workspace.isArchived && props.onRestore ? (
              confirmRestore ? (
                <>
                  <Button type="button" onClick={() => void run(props.onRestore!)} disabled={isPending}>
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
            ) : props.onArchive ? (
              confirmArchive ? (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => void run(props.onArchive!)}
                    disabled={isPending}
                  >
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
              )
            ) : null}
          </div>
        </WorkspacePanel>
      ) : null}
    </ReviewWorkspaceSectionShell>
  );
}
