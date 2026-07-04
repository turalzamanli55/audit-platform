"use client";

import type { ComponentProps } from "react";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addMaterialityCommentAction,
  archiveMaterialityPackageAction,
  restoreMaterialityPackageAction,
} from "@/lib/actions/materiality";
import { Alert, Button, Input } from "@/components/ui";
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
};

type GateProps = {
  canCreate?: boolean;
  planningApproved?: boolean;
  emptyLabels: CreateLabels;
  workspaceLabels: { planningGateDescription: string };
};

type BaseProps = GateProps & {
  labels: SectionLabels;
  workflowLabels: { errorGeneric: string };
  archivedReadOnlyLabel?: string;
  locale?: string;
};

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

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

function ArchivedNotice({ message }: { message?: string }) {
  return <Alert variant="warning">{message ?? "This section is read-only while archived."}</Alert>;
}

function useMutationError() {
  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);
  return { error, setError, clearError };
}

function ThresholdCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
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
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      <div className="space-y-4">
        <ThresholdCard label={props.fieldLabels.overallLabel} value={value} />
        {workspace.basisNotes ? (
          <div className="rounded-2xl border border-border/50 bg-card/80 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {props.fieldLabels.basisNotesLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{workspace.basisNotes}</p>
          </div>
        ) : (
          <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
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
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {workspace.performanceMateriality != null ? (
        <ThresholdCard label={props.fieldLabels.performanceLabel} value={value} hint={hint} />
      ) : (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
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
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {items.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <div className="space-y-3">
          {items.map((item: SpecificMaterialityItem) => (
            <div key={item.id} className="rounded-2xl border border-border/50 bg-card/80 p-5">
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
            </div>
          ))}
        </div>
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
        {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
        {workspace.benchmarks.length === 0 ? (
          <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
        ) : (
          <div className="space-y-3">
            {workspace.benchmarks.map((benchmark: MaterialityBenchmarkView) => (
              <div key={benchmark.id} className="rounded-2xl border border-border/50 bg-card/80 p-5">
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
              </div>
            ))}
          </div>
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
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {workspace.calculations.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <div className="space-y-3">
          {workspace.calculations.map((calculation: MaterialityCalculationView) => (
            <div key={calculation.id} className="rounded-2xl border border-border/50 bg-card/80 p-5">
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
            </div>
          ))}
        </div>
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
      {workspace.versions.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <div className="space-y-3">
          {workspace.versions.map((version: MaterialityVersionView) => (
            <div key={version.id} className="rounded-2xl border border-border/50 bg-card/80 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">v{version.versionNumber}</p>
                  {version.changeSummary ? (
                    <p className="mt-1 text-sm text-muted-foreground">{version.changeSummary}</p>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(version.createdAt, props.locale ?? "en")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
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
      {workspace.isArchived ? <ArchivedNotice message={props.archivedReadOnlyLabel} /> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      {mutable ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/80 p-5 sm:flex-row">
          <Input
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={props.noteLabels.bodyPlaceholder}
            className="flex-1"
          />
          <Button type="button" onClick={addComment} disabled={isPending || !body.trim()}>
            {props.noteLabels.addAction}
          </Button>
        </div>
      ) : (
        <MaterialityWorkspaceReadonlyNotice message={props.archivedReadOnlyLabel ?? ""} />
      )}

      {workspace.comments.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <div className="space-y-3">
          {workspace.comments.map((comment: MaterialityCommentView) => (
            <div key={comment.id} className="rounded-2xl border border-border/50 bg-card/80 p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed text-foreground">{comment.body}</p>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {props.commentTypeLabels[comment.commentType] ?? comment.commentType}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDateTime(comment.createdAt, props.locale ?? "en")}
              </p>
            </div>
          ))}
        </div>
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
      {props.activity.entries.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <div className="space-y-3">
          {props.activity.entries.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-border/50 bg-card/80 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {formatMaterialityActivityAction(entry.action, props.historyLabels.actions)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatMaterialityActivitySummary(entry.summary)}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{formatDateTime(entry.createdAt, props.locale ?? "en")}</p>
                  {entry.versionNumber != null ? (
                    <p className="mt-1">
                      {props.historyLabels.versionLabel}: {entry.versionNumber}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
      {error ? <Alert variant="error">{error}</Alert> : null}
      {workspace.isArchived ? (
        <Alert variant="warning">{props.settingsLabels.archivedBanner}</Alert>
      ) : null}
      {!props.canArchive ? (
        <MaterialityWorkspaceReadonlyNotice message={props.settingsLabels.readOnlyNotice} />
      ) : null}

      {props.canArchive ? (
        <div className="rounded-2xl border border-border/50 bg-card/80 p-5">
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
        </div>
      ) : null}
    </MaterialityWorkspaceSectionShell>
  );
}
