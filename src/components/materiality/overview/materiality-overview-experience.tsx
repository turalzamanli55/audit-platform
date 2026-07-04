"use client";

import { MaterialityCreateExperience } from "@/components/materiality/create/materiality-create-experience";
import { MaterialityWorkflowPanel } from "@/components/materiality/workflow/materiality-workflow-panel";
import { MaterialityWorkspaceSectionShell } from "@/components/materiality/workspace/materiality-workspace-section-shell";
import { buildMaterialityOverviewCards } from "@/lib/materiality/materiality-workspace-display";
import { useMaterialityWorkspace } from "@/lib/materiality/use-materiality-workspace";

type MaterialityOverviewLabels = {
  title: string;
  description: string;
  statusTitle: string;
  statusDescription: string;
  progress: string;
  workflowTitle: string;
  workflowDescription: string;
  thresholdsPreviewTitle: string;
  thresholdsPreviewDescription: string;
};

type MaterialityOverviewExperienceProps = {
  canCreate: boolean;
  canSubmit?: boolean;
  canReview?: boolean;
  canApprove?: boolean;
  planningApproved: boolean;
  workspaceLabels: {
    summaryStatus: string;
    summaryVersion: string;
    summaryProgress: string;
    summaryOverall: string;
    summaryBenchmarks: string;
    summaryPendingReview: string;
    planningGateDescription: string;
  };
  createLabels: {
    title: string;
    description: string;
    createAction: string;
    creating: string;
    forbiddenDescription: string;
  };
  thresholdLabels: {
    overall: string;
    performance: string;
    trivial: string;
    notSet: string;
  };
  statusLabels: Record<string, string>;
  labels: MaterialityOverviewLabels & {
    benchmarksPreviewTitle?: string;
    benchmarksPreviewDescription?: string;
  };
  workflowLabels: {
    submitAction: string;
    returnAction: string;
    returnConfirmAction: string;
    approveAction: string;
    cancelAction: string;
    returnNotesLabel: string;
    returnNotesPlaceholder: string;
    readOnlyNotice: string;
    submittedNotice: string;
    approvedNotice: string;
    returnedNotice: string;
    errorGeneric: string;
  };
};

export function MaterialityOverviewExperience({
  canCreate,
  canSubmit = true,
  canReview = true,
  canApprove = true,
  planningApproved,
  workspaceLabels,
  createLabels,
  thresholdLabels,
  statusLabels,
  labels,
  workflowLabels,
}: MaterialityOverviewExperienceProps) {
  const { materiality } = useMaterialityWorkspace();

  if (!materiality) {
    return (
      <MaterialityCreateExperience
        canCreate={canCreate}
        planningApproved={planningApproved}
        labels={createLabels}
        gateLabels={{ planningGateDescription: workspaceLabels.planningGateDescription }}
      />
    );
  }

  const cards = buildMaterialityOverviewCards(materiality, workspaceLabels, statusLabels);

  const thresholdItems = [
    {
      id: "overall",
      label: thresholdLabels.overall,
      value:
        materiality.overallMateriality != null
          ? new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: materiality.currencyCode,
              maximumFractionDigits: 0,
            }).format(materiality.overallMateriality)
          : thresholdLabels.notSet,
    },
    {
      id: "performance",
      label: thresholdLabels.performance,
      value:
        materiality.performanceMateriality != null
          ? new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: materiality.currencyCode,
              maximumFractionDigits: 0,
            }).format(materiality.performanceMateriality)
          : thresholdLabels.notSet,
    },
    {
      id: "trivial",
      label: thresholdLabels.trivial,
      value:
        materiality.trivialThreshold != null
          ? new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: materiality.currencyCode,
              maximumFractionDigits: 0,
            }).format(materiality.trivialThreshold)
          : thresholdLabels.notSet,
    },
  ];

  return (
    <div className="space-y-10">
      <MaterialityWorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="materiality-overview"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {cards.map((card) => (
            <div key={card.id} className="rounded-2xl border border-border/50 bg-card/80 p-5 shadow-xs">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{card.value}</p>
              {card.hint ? <p className="mt-1 text-sm text-muted-foreground">{card.hint}</p> : null}
            </div>
          ))}
        </div>
      </MaterialityWorkspaceSectionShell>

      <MaterialityWorkflowPanel
        materiality={materiality}
        canSubmit={canSubmit}
        canReview={canReview}
        canApprove={canApprove}
        labels={{
          ...workflowLabels,
          title: labels.workflowTitle,
          description: labels.workflowDescription,
        }}
      />

      <MaterialityWorkspaceSectionShell
        title={labels.thresholdsPreviewTitle}
        description={labels.thresholdsPreviewDescription}
        headingId="materiality-thresholds-preview"
      >
        <div className="grid gap-3 rounded-2xl border border-border/50 bg-card/80 p-5 sm:grid-cols-3">
          {thresholdItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/50 bg-card px-4 py-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </MaterialityWorkspaceSectionShell>

      <MaterialityWorkspaceSectionShell
        title={labels.statusTitle}
        description={labels.statusDescription}
        headingId="materiality-status-summary"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: workspaceLabels.summaryStatus, value: statusLabels[materiality.packageStatus] ?? materiality.packageStatus },
            { label: workspaceLabels.summaryVersion, value: String(materiality.packageVersion) },
            { label: workspaceLabels.summaryPendingReview, value: String(materiality.pendingReviewCount) },
            { label: workspaceLabels.summaryBenchmarks, value: String(materiality.benchmarks.length) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border/50 bg-card px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 rounded-2xl border border-border/50 bg-card/80 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{labels.progress}</span>
            <span className="font-medium text-foreground">{materiality.progressPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/80 transition-all duration-300"
              style={{ width: `${materiality.progressPct}%` }}
              role="progressbar"
              aria-valuenow={materiality.progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={labels.progress}
            />
          </div>
        </div>
      </MaterialityWorkspaceSectionShell>

      {materiality.benchmarks.length > 0 ? (
        <MaterialityWorkspaceSectionShell
          title={labels.benchmarksPreviewTitle ?? "Benchmark preview"}
          description={labels.benchmarksPreviewDescription ?? "Selected benchmark and comparison basis."}
          headingId="materiality-benchmarks-preview"
        >
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Benchmark</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">%</th>
                  <th className="px-4 py-3 font-medium">Calculated</th>
                </tr>
              </thead>
              <tbody>
                {materiality.benchmarks.slice(0, 5).map((benchmark) => (
                  <tr
                    key={benchmark.id}
                    className={`border-b border-border/30 last:border-0 ${
                      benchmark.isSelected ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {benchmark.benchmarkLabel ?? benchmark.benchmarkType}
                      {benchmark.isSelected ? (
                        <span className="ml-2 text-xs text-primary">●</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: materiality.currencyCode,
                        maximumFractionDigits: 0,
                      }).format(benchmark.benchmarkAmount)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{benchmark.percentage}%</td>
                    <td className="px-4 py-3 text-foreground">
                      {benchmark.calculatedMateriality != null
                        ? new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: materiality.currencyCode,
                            maximumFractionDigits: 0,
                          }).format(benchmark.calculatedMateriality)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MaterialityWorkspaceSectionShell>
      ) : null}
    </div>
  );
}
