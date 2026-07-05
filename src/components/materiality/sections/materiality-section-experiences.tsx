"use client";

import type { ComponentProps } from "react";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addMaterialityCommentAction,
  archiveMaterialityPackageAction,
  restoreMaterialityPackageAction,
} from "@/lib/actions/materiality";
import { Button, Input } from "@/components/ui";
import {
  WorkspaceEmptyPanel,
  WorkspaceFormPanel,
  WorkspaceList,
  WorkspaceListItem,
  WorkspaceMetricCard,
  WorkspaceNoticeBanner,
  WorkspacePanel,
  WorkspaceTable,
} from "@/components/workspace";
import { MaterialityCalculatorPanel } from "@/components/materiality/calculator/materiality-calculator-panel";
import { MaterialityCreateExperience } from "@/components/materiality/create/materiality-create-experience";
import { MaterialityWorkspaceSectionShell } from "@/components/materiality/workspace/materiality-workspace-section-shell";
import { MaterialityWorkspaceReadonlyNotice } from "@/components/materiality/workspace/materiality-workspace-states";
import { formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import type { MaterialityActivityView } from "@/lib/materiality/materiality-workspace-view";
import {
  formatCurrency,
  formatMaterialityActivityAction,
  formatMaterialityActivitySummary,
} from "@/lib/materiality/materiality-workspace-display";
import { useMaterialityWorkspace } from "@/lib/materiality/use-materiality-workspace";
import type {
  MaterialityBenchmarkView,
  MaterialityCalculationView,
  MaterialityCommentView,
  MaterialityVersionView,
  MaterialityWorkspaceView,
} from "@/lib/materiality/materiality-workspace-view";
import type { MaterialityBenchmarkType, SpecificMaterialityItem } from "@/types/materiality";

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
  planningApproved?: boolean;
  emptyLabels: CreateLabels;
  workspaceLabels: { planningGateDescription: string; archivedDescription: string };
};

type BaseProps = GateProps & {
  labels: SectionLabels;
  workflowLabels: { errorGeneric: string };
  archivedReadOnlyLabel?: string;
  locale?: string;
};

function useWorkspaceOrCreate(props: GateProps) {
  const { materiality, planningApproved } = useMaterialityWorkspace();
  if (!materiality) {
    return (
      <MaterialityCreateExperience
        canCreate={props.canCreate ?? false}
        planningApproved={props.planningApproved ?? planningApproved}
        labels={props.emptyLabels}
        gateLabels={props.workspaceLabels}
      />
    );
  }
  return materiality;
}

function canMutate(materiality: MaterialityWorkspaceView, allowed: boolean) {
  return (
    allowed &&
    !materiality.isArchived &&
    materiality.packageStatus !== "approved" &&
    materiality.packageStatus !== "archived"
  );
}

function ArchivedNotice({ message }: { message: string }) {
  return <WorkspaceNoticeBanner variant="warning" description={message} role="status" />;
}

function useMutationError() {
  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);
  return { error, setError, clearError };
}

export function MaterialityOverallExperience(
  props: BaseProps & {
    canUpdate?: boolean;
    fieldLabels: {
      overallLabel: string;
      basisNotesLabel: string;
      notSetLabel: string;
    };
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("overallMateriality" in workspace)) return workspace;

  const value =
    workspace.overallMateriality != null
      ? formatCurrency(workspace.overallMateriality, workspace.currencyCode)
      : props.fieldLabels.notSetLabel;

  return (
    <MaterialityWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="materiality-overall"
    >
      {workspace.isArchived ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription} />
      ) : null}
      <div className="space-y-4">
        <WorkspaceMetricCard label={props.fieldLabels.overallLabel} value={value} />
        {workspace.basisNotes ? (
          <WorkspacePanel>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {props.fieldLabels.basisNotesLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{workspace.basisNotes}</p>
          </WorkspacePanel>
        ) : (
          <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
        )}
      </div>
    </MaterialityWorkspaceSectionShell>
  );
}

export function MaterialityPerformanceExperience(
  props: BaseProps & {
    canUpdate?: boolean;
    fieldLabels: {
      performanceLabel: string;
      percentageLabel: string;
      notSetLabel: string;
    };
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("performanceMateriality" in workspace)) return workspace;

  const value =
    workspace.performanceMateriality != null
      ? formatCurrency(workspace.performanceMateriality, workspace.currencyCode)
      : props.fieldLabels.notSetLabel;
  const hint =
    workspace.performanceMaterialityPct != null
      ? `${props.fieldLabels.percentageLabel}: ${workspace.performanceMaterialityPct}%`
      : null;

  return (
    <MaterialityWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="materiality-performance"
    >
      {workspace.isArchived ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription} />
      ) : null}
      {workspace.performanceMateriality != null ? (
        <WorkspaceMetricCard label={props.fieldLabels.performanceLabel} value={value} hint={hint} />
      ) : (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      )}
    </MaterialityWorkspaceSectionShell>
  );
}

export function MaterialitySpecificExperience(
  props: BaseProps & {
    canUpdate?: boolean;
    fieldLabels: { amountLabel: string; rationaleLabel: string };
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("specificMateriality" in workspace)) return workspace;

  const items = workspace.specificMateriality;

  return (
    <MaterialityWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="materiality-specific"
    >
      {workspace.isArchived ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription} />
      ) : null}
      {items.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {items.map((item: SpecificMaterialityItem) => (
            <WorkspaceListItem key={item.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  {item.rationale ? (
                    <p className="mt-1 text-sm text-muted-foreground">{item.rationale}</p>
                  ) : null}
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(item.amount, workspace.currencyCode)}
                </p>
              </div>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
    </MaterialityWorkspaceSectionShell>
  );
}

export function MaterialityBenchmarksExperience(
  props: BaseProps & {
    canUpdate?: boolean;
    benchmarkTypeLabels: Record<MaterialityBenchmarkType, string>;
    calculatorLabels: ComponentProps<typeof MaterialityCalculatorPanel>["labels"];
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("benchmarks" in workspace)) return workspace;

  return (
    <div className="space-y-10">
      <MaterialityWorkspaceSectionShell
        title={props.labels.title}
        description={props.labels.description}
        headingId="materiality-benchmarks"
      >
        {workspace.isArchived ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription} />
      ) : null}
        {workspace.benchmarks.length === 0 ? (
          <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
        ) : (
          <WorkspaceList>
            {workspace.benchmarks.map((benchmark: MaterialityBenchmarkView) => (
              <WorkspaceListItem key={benchmark.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {benchmark.benchmarkLabel ??
                        props.benchmarkTypeLabels[benchmark.benchmarkType] ??
                        benchmark.benchmarkType}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(benchmark.benchmarkAmount, workspace.currencyCode)} ·{" "}
                      {benchmark.percentage}%
                    </p>
                    {benchmark.rationale ? (
                      <p className="mt-2 text-sm text-muted-foreground">{benchmark.rationale}</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {benchmark.calculatedMateriality != null
                        ? formatCurrency(benchmark.calculatedMateriality, workspace.currencyCode)
                        : "—"}
                    </p>
                    {benchmark.isSelected ? (
                      <span className="mt-1 inline-block rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium">
                        Selected
                      </span>
                    ) : null}
                  </div>
                </div>
              </WorkspaceListItem>
            ))}
          </WorkspaceList>
        )}
      </MaterialityWorkspaceSectionShell>

      <MaterialityCalculatorPanel
        materiality={workspace}
        labels={props.calculatorLabels}
        canUpdate={canMutate(workspace, props.canUpdate ?? false)}
      />
    </div>
  );
}

export function MaterialityCalculationsExperience(
  props: BaseProps & {
    canUpdate?: boolean;
    calculationTypeLabels: Record<string, string>;
  },
) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("calculations" in workspace)) return workspace;

  return (
    <MaterialityWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="materiality-calculations"
    >
      {workspace.isArchived ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription} />
      ) : null}
      {workspace.calculations.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {workspace.calculations.map((calculation: MaterialityCalculationView) => (
            <WorkspaceListItem key={calculation.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {props.calculationTypeLabels[calculation.calculationType] ??
                      calculation.calculationType}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDateTime(calculation.createdAt, props.locale ?? "en")}
                  </p>
                  {calculation.isManualOverride && calculation.explanation ? (
                    <p className="mt-2 text-sm text-muted-foreground">{calculation.explanation}</p>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {calculation.resultAmount != null
                      ? formatCurrency(calculation.resultAmount, workspace.currencyCode)
                      : "—"}
                  </p>
                  {calculation.percentage != null ? (
                    <p className="mt-1 text-xs text-muted-foreground">{calculation.percentage}%</p>
                  ) : null}
                </div>
              </div>
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      )}
    </MaterialityWorkspaceSectionShell>
  );
}

export function MaterialityVersionsExperience(props: BaseProps) {
  const workspace = useWorkspaceOrCreate(props);
  if (typeof workspace !== "object" || !("versions" in workspace)) return workspace;

  return (
    <MaterialityWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="materiality-versions"
    >
      <WorkspaceTable<MaterialityVersionView>
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
    </MaterialityWorkspaceSectionShell>
  );
}

export function MaterialityCommentsExperience(
  props: BaseProps & {
    canUpdate?: boolean;
    noteLabels: { bodyPlaceholder: string; addAction: string };
    commentTypeLabels: Record<string, string>;
  },
) {
  const router = useRouter();
  const workspace = useWorkspaceOrCreate(props);
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const { error, setError, clearError } = useMutationError();

  if (typeof workspace !== "object" || !("comments" in workspace)) return workspace;
  const mutable = canMutate(workspace, props.canUpdate ?? false);

  const addComment = () => {
    if (!body.trim()) return;
    startTransition(async () => {
      clearError();
      const result = await addMaterialityCommentAction({
        packageId: workspace.id,
        version: workspace.version,
        body: body.trim(),
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setBody("");
      router.refresh();
    });
  };

  return (
    <MaterialityWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="materiality-comments"
    >
      {workspace.isArchived ? (
        <ArchivedNotice message={props.archivedReadOnlyLabel ?? props.workspaceLabels.archivedDescription} />
      ) : null}
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

      {mutable ? (
        <WorkspacePanel variant="form" className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={props.noteLabels.bodyPlaceholder}
            className="flex-1"
          />
          <Button type="button" onClick={addComment} disabled={isPending || !body.trim()}>
            {props.noteLabels.addAction}
          </Button>
        </WorkspacePanel>
      ) : (
        <MaterialityWorkspaceReadonlyNotice message={props.archivedReadOnlyLabel ?? ""} />
      )}

      {workspace.comments.length === 0 ? (
        <WorkspaceEmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {workspace.comments.map((comment: MaterialityCommentView) => (
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
    </MaterialityWorkspaceSectionShell>
  );
}

export function MaterialityHistoryExperience(
  props: BaseProps & {
    activity: MaterialityActivityView;
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
    <MaterialityWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="materiality-history"
    >
      <WorkspaceTable
        columns={[
          {
            id: "action",
            header: props.labels.columns?.action ?? props.labels.title,
            cell: (entry) =>
              formatMaterialityActivityAction(entry.action, props.historyLabels.actions),
          },
          {
            id: "summary",
            header: props.labels.columns?.summary ?? props.labels.description,
            cell: (entry) => formatMaterialityActivitySummary(entry.summary),
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
            cell: (entry) => (entry.versionNumber != null ? String(entry.versionNumber) : "—"),
            hideOnMobile: true,
          },
        ]}
        rows={props.activity.entries}
        keyFn={(entry) => entry.id}
        emptyTitle={props.labels.emptyTitle}
        emptyDescription={props.labels.emptyDescription}
      />
    </MaterialityWorkspaceSectionShell>
  );
}

export function MaterialitySettingsExperience(
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
      const result = await archiveMaterialityPackageAction({
        packageId: workspace.id,
        version: workspace.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setConfirmArchive(false);
      router.refresh();
    });
  };

  const restore = () => {
    startTransition(async () => {
      clearError();
      const result = await restoreMaterialityPackageAction({
        packageId: workspace.id,
        version: workspace.version,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.workflowLabels.errorGeneric);
        return;
      }
      setConfirmRestore(false);
      router.refresh();
    });
  };

  return (
    <MaterialityWorkspaceSectionShell
      title={props.labels.title}
      description={props.labels.description}
      headingId="materiality-settings"
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
        <MaterialityWorkspaceReadonlyNotice message={props.settingsLabels.readOnlyNotice} />
      ) : null}

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
    </MaterialityWorkspaceSectionShell>
  );
}
