"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  CommandCard,
  CommandEmpty,
  CommandKpiRow,
  CommandListRow,
} from "@/components/dashboard/command-center/command-center-primitives";
import { PlanningWorkflowPipeline } from "@/components/planning/command-center/planning-workflow-pipeline";
import { MaterialityWorkflowPanel } from "@/components/materiality/workflow/materiality-workflow-panel";
import { useMaterialityWorkspace } from "@/lib/materiality/use-materiality-workspace";
import type { MaterialityCommandCenterData } from "@/types/materiality-command-center";
import type { Dictionary } from "@/i18n/get-dictionary";
import { workspaceTokens } from "@/components/workspace";
import { cn } from "@/lib/ui/cn";
import { IconArrowRight } from "@/components/ui/icons";

type MaterialityCommandCenterProps = {
  locale: string;
  slug: string;
  commandCenter: MaterialityCommandCenterData;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  labels: Dictionary["materiality"]["workspace"];
  materialityLabels: Dictionary["materiality"];
};

export function MaterialityCommandCenter({
  locale,
  slug,
  commandCenter,
  canSubmit,
  canReview,
  canApprove,
  labels,
  materialityLabels,
}: MaterialityCommandCenterProps) {
  const cc = labels.commandCenter;
  const base = `/${locale}/app/engagements/${slug}/materiality`;
  const { materiality } = useMaterialityWorkspace();
  const progressPct = materiality?.progressPct ?? 0;

  if (!materiality) return null;

  return (
    <div className="space-y-6">
      <section className={workspaceTokens.commandHero}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className={workspaceTokens.heroEyebrow}>
              {cc.heroTitle}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {commandCenter.thresholds.map((threshold) => (
                <Link
                  key={threshold.id}
                  href={threshold.href}
                  className={workspaceTokens.actionLink}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {threshold.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-foreground">
                    {threshold.value}
                  </p>
                  {threshold.hint ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{threshold.hint}</p>
                  ) : null}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={commandCenter.approvalVariant}>{commandCenter.approvalStatus}</Badge>
              <Badge variant="outline">
                {cc.packageVersion} {materiality.packageVersion}
              </Badge>
              {commandCenter.lastUpdated ? (
                <Badge variant="secondary" className="rounded-full">
                  {cc.lastUpdate}: {commandCenter.lastUpdated}
                </Badge>
              ) : null}
            </div>
            <div className="max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{labels.progress}</span>
                <span className="font-medium tabular-nums text-foreground">{progressPct}%</span>
              </div>
              <div className={workspaceTokens.progressTrack}>
                <div
                  className={workspaceTokens.progressFill}
                  style={{ width: `${progressPct}%` }}
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { href: `${base}/benchmarks`, label: labels.navBenchmarks },
              { href: `${base}/calculations`, label: labels.navCalculations },
              { href: `${base}/versions`, label: labels.navVersions },
              { href: `${base}/comments`, label: labels.navComments },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(workspaceTokens.actionLink, "px-3 py-2 text-xs sm:text-sm")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MaterialityWorkflowPanel
        materiality={materiality}
        canSubmit={canSubmit}
        canReview={canReview}
        canApprove={canApprove}
        labels={{
          ...materialityLabels.workflow,
          title: labels.workflowTitle,
          description: labels.workflowDescription,
        }}
      />

      <CommandCard title={cc.workflowTitle} description={cc.workflowDescription}>
        <PlanningWorkflowPipeline
          steps={commandCenter.workflowSteps}
          currentStepId={commandCenter.currentWorkflowStep}
        />
      </CommandCard>

      <CommandKpiRow title={cc.executiveTitle} items={commandCenter.executive} />
      <CommandKpiRow title={cc.summaryTitle} items={commandCenter.materialitySummary} />
      <CommandKpiRow title={cc.metricsTitle} items={commandCenter.materialityMetrics} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          {commandCenter.reviewQueueCount > 0 ? (
            <CommandCard title={cc.approvalQueueTitle} description={cc.approvalQueueDescription}>
              <div className="rounded-xl border border-warning/40 bg-warning/5 px-4 py-4">
                <p className="text-sm font-medium text-foreground">
                  {materialityLabels.workflow.submittedNotice}
                </p>
                <Link
                  href={base}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  {cc.openWorkflow}
                  <IconArrowRight width={12} height={12} />
                </Link>
              </div>
            </CommandCard>
          ) : null}

          <CommandCard title={cc.calculationBreakdownTitle} description={cc.calculationBreakdownDescription}>
            {commandCenter.calculationFlow.length === 0 ? (
              <CommandEmpty
                title={cc.emptyCalculations}
                description={cc.emptyCalculationsDescription}
              />
            ) : (
              <div className="space-y-3">
                {commandCenter.calculationFlow.map((calc, index) => (
                  <div key={calc.id} className="flex items-stretch gap-2">
                    <div className="flex w-8 shrink-0 flex-col items-center">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                        {index + 1}
                      </span>
                      {index < commandCenter.calculationFlow.length - 1 ? (
                        <div className="mt-1 w-px flex-1 bg-border/60" aria-hidden />
                      ) : null}
                    </div>
                    <Link
                      href={calc.href}
                      className={`flex-1 ${workspaceTokens.bucketTile} px-4 py-3`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{calc.type}</p>
                        <Badge variant={calc.isManualOverride ? "warning" : "secondary"} className="text-[10px]">
                          {calc.method}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {calc.input} × {calc.percentage} = {calc.result}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CommandCard>

          <CommandCard title={cc.benchmarkComparisonTitle} description={cc.benchmarkComparisonDescription}>
            {commandCenter.benchmarkRanking.length === 0 ? (
              <CommandEmpty title={cc.emptyBenchmarks} description={cc.emptyBenchmarksDescription} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-left text-[10px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-medium">#</th>
                      <th className="px-3 py-2 font-medium">{cc.benchmarkColumn}</th>
                      <th className="px-3 py-2 font-medium">{cc.amountColumn}</th>
                      <th className="px-3 py-2 font-medium">%</th>
                      <th className="px-3 py-2 font-medium">{cc.calculatedColumn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commandCenter.benchmarkRanking.map((row) => (
                      <tr
                        key={row.id}
                        className={`border-b border-border/30 last:border-0 ${
                          row.isSelected ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="px-3 py-2.5 text-muted-foreground">{row.rank}</td>
                        <td className="px-3 py-2.5">
                          <Link href={row.href} className="font-medium text-foreground hover:underline">
                            {row.label}
                            {row.isSelected ? (
                              <Badge variant="success" className="ml-2 text-[10px]">
                                {cc.selected}
                              </Badge>
                            ) : null}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{row.amount}</td>
                        <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{row.percentage}</td>
                        <td className="px-3 py-2.5 tabular-nums font-medium text-foreground">{row.calculated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CommandCard>

          <CommandCard title={cc.calculationHistoryTitle} description={cc.calculationHistoryDescription}>
            {commandCenter.calculations.length === 0 ? (
              <CommandEmpty
                title={cc.emptyCalculations}
                description={cc.emptyCalculationsDescription}
              />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.calculations.map((calc) => (
                  <li key={calc.id}>
                    <CommandListRow
                      href={calc.href}
                      title={calc.type}
                      subtitle={`${calc.input} · ${calc.percentage} → ${calc.result}`}
                      meta={calc.time}
                      badge={
                        calc.isManualOverride ? (
                          <Badge variant="warning" className="text-[10px]">
                            {cc.override}
                          </Badge>
                        ) : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.recentChangesTitle} description={cc.recentChangesDescription}>
            {commandCenter.recentChanges.length === 0 ? (
              <CommandEmpty title={cc.emptyChanges} description={cc.emptyChangesDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.recentChanges.map((item) => (
                  <li key={item.id}>
                    <CommandListRow title={item.title} subtitle={item.description} meta={item.time} />
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`${base}/history`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {cc.viewHistory}
              <IconArrowRight width={12} height={12} />
            </Link>
          </CommandCard>
        </div>

        <div className="space-y-5">
          {commandCenter.selectedBenchmark ? (
            <CommandCard title={cc.selectedBenchmarkTitle} description={cc.selectedBenchmarkDescription}>
              <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">
                  {commandCenter.selectedBenchmark.label}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">{cc.amountColumn}</dt>
                    <dd className="font-medium tabular-nums">{commandCenter.selectedBenchmark.amount}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">{cc.percentageColumn}</dt>
                    <dd className="font-medium tabular-nums">{commandCenter.selectedBenchmark.percentage}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">{cc.calculatedColumn}</dt>
                    <dd className="text-lg font-semibold tabular-nums">
                      {commandCenter.selectedBenchmark.calculated}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">{cc.kpiMethod}</dt>
                    <dd className="text-sm text-foreground">{commandCenter.calculationMethod}</dd>
                  </div>
                </dl>
              </div>
            </CommandCard>
          ) : null}

          <CommandCard title={cc.versionTimelineTitle} description={cc.versionTimelineDescription}>
            {commandCenter.versionTimeline.length === 0 ? (
              <CommandEmpty title={cc.emptyVersions} description={cc.emptyVersionsDescription} />
            ) : (
              <ol className="relative space-y-4 border-l border-border/50 pl-4">
                {commandCenter.versionTimeline.map((version) => (
                  <li key={version.id} className="relative">
                    <span className="absolute -left-[1.3rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                    <Link href={version.href} className="block rounded-xl border border-border/40 px-3 py-2.5 hover:bg-card">
                      <p className="text-sm font-medium text-foreground">
                        {cc.versionLabel} {version.versionNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">{version.summary}</p>
                      <time className="mt-1 block text-[10px] text-muted-foreground">{version.time}</time>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </CommandCard>

          <CommandCard title={cc.reviewNotesTitle} description={cc.reviewNotesDescription}>
            {commandCenter.reviewComments.length === 0 ? (
              <CommandEmpty title={cc.emptyReviewNotes} description={cc.emptyReviewNotesDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.reviewComments.map((comment) => (
                  <li key={comment.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {comment.type}
                      </Badge>
                      <time className="text-[10px] text-muted-foreground">{comment.time}</time>
                    </div>
                    <p className="mt-2 text-sm text-foreground">{comment.body}</p>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`${base}/comments`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {cc.viewComments}
              <IconArrowRight width={12} height={12} />
            </Link>
          </CommandCard>

          <CommandCard title={cc.commentsTitle} description={cc.commentsDescription}>
            {commandCenter.comments.length === 0 ? (
              <CommandEmpty title={cc.emptyComments} description={cc.emptyCommentsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.comments.map((comment) => (
                  <li key={comment.id}>
                    <CommandListRow
                      href={comment.href}
                      title={comment.type}
                      subtitle={comment.body}
                      meta={comment.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.activityTitle} description={cc.activityDescription}>
            {commandCenter.activityFeed.length === 0 ? (
              <CommandEmpty title={cc.emptyActivity} description={cc.emptyActivityDescription} />
            ) : (
              <ol className="divide-y divide-border/40">
                {commandCenter.activityFeed.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground">{item.time}</time>
                  </li>
                ))}
              </ol>
            )}
          </CommandCard>
        </div>
      </div>
    </div>
  );
}
