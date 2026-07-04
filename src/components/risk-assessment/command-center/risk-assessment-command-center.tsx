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
import { RiskAssessmentWorkflowPanel } from "@/components/risk-assessment/workflow/risk-assessment-workflow-panel";
import { useRiskAssessmentWorkspace } from "@/lib/risk-assessment/use-risk-assessment-workspace";
import type { RiskAssessmentCommandCenterData } from "@/types/risk-assessment-command-center";
import type { Dictionary } from "@/i18n/get-dictionary";
import { IconArrowRight } from "@/components/ui/icons";

type RiskAssessmentCommandCenterProps = {
  locale: string;
  slug: string;
  commandCenter: RiskAssessmentCommandCenterData;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  labels: Dictionary["riskAssessment"]["workspace"];
  riskLabels: Dictionary["riskAssessment"];
};

export function RiskAssessmentCommandCenter({
  locale,
  slug,
  commandCenter,
  canSubmit,
  canReview,
  canApprove,
  labels,
  riskLabels,
}: RiskAssessmentCommandCenterProps) {
  const cc = labels.commandCenter;
  const base = `/${locale}/app/engagements/${slug}/risk-assessment`;
  const { riskAssessment } = useRiskAssessmentWorkspace();
  const progressPct = riskAssessment?.progressPct ?? 0;

  if (!riskAssessment) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/40 bg-gradient-to-br from-card via-card to-muted/15 p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {cc.heroTitle}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={commandCenter.riskHealthVariant}>{commandCenter.riskHealth}</Badge>
              <Badge variant={commandCenter.approvalVariant}>{commandCenter.approvalStatus}</Badge>
              <Badge variant="outline">
                {cc.packageVersion} {riskAssessment.assessmentVersion}
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
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
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
              { href: `${base}/heatmap`, label: labels.navHeatmap },
              { href: `${base}/matrix`, label: labels.navMatrix },
              { href: `${base}/significant-risks`, label: labels.navSignificantRisks },
              { href: `${base}/responses`, label: labels.navResponses },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-border/50 px-3 py-2 text-xs font-medium transition-colors hover:bg-card sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RiskAssessmentWorkflowPanel
        riskAssessment={riskAssessment}
        canSubmit={canSubmit}
        canReview={canReview}
        canApprove={canApprove}
        labels={{
          ...riskLabels.workflow,
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
      <CommandKpiRow title={cc.summaryTitle} items={commandCenter.riskSummary} />
      <CommandKpiRow title={cc.metricsTitle} items={commandCenter.riskMetrics} />
      <CommandKpiRow title={cc.kpisTitle} items={commandCenter.riskKpis} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          {commandCenter.reviewQueueCount > 0 ? (
            <CommandCard title={cc.reviewQueueTitle} description={cc.reviewQueueDescription}>
              <div className="rounded-xl border border-warning/40 bg-warning/5 px-4 py-4">
                <p className="text-sm font-medium text-foreground">
                  {riskLabels.workflow.submittedNotice}
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

          <CommandCard title={cc.heatmapTitle} description={cc.heatmapDescription}>
            <div className="grid gap-3 sm:grid-cols-5">
              {commandCenter.heatmapBuckets.map((bucket) => (
                <Link
                  key={bucket.rating ?? "none"}
                  href={`${base}/heatmap`}
                  className={`rounded-xl border px-3 py-3 text-center transition-opacity hover:opacity-90 ${bucket.cssClass}`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide">{bucket.label}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">{bucket.count}</p>
                </Link>
              ))}
            </div>
          </CommandCard>

          <CommandCard title={cc.matrixTitle} description={cc.matrixDescription}>
            {commandCenter.matrixPreview.length === 0 ? (
              <CommandEmpty title={cc.emptyMatrix} description={cc.emptyMatrixDescription} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-left text-[10px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-medium">{cc.accountColumn}</th>
                      <th className="px-3 py-2 font-medium">{cc.assertionColumn}</th>
                      <th className="px-3 py-2 font-medium">{cc.ratingColumn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commandCenter.matrixPreview.map((cell) => (
                      <tr key={cell.id} className="border-b border-border/30 last:border-0">
                        <td className="px-3 py-2.5 font-medium text-foreground">{cell.accountName}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{cell.assertion}</td>
                        <td className="px-3 py-2.5">
                          <Link
                            href={cell.href}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium ${
                              cell.rating === "significant"
                                ? "border-destructive/30 bg-destructive/10 text-destructive"
                                : cell.rating === "high"
                                  ? "border-warning/30 bg-warning/10 text-warning"
                                  : "border-border/50 bg-muted/30 text-foreground"
                            }`}
                          >
                            {cell.ratingLabel}
                            {cell.isSignificant ? (
                              <span className="text-[10px] text-destructive">●</span>
                            ) : null}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Link
              href={`${base}/matrix`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {cc.viewMatrix}
              <IconArrowRight width={12} height={12} />
            </Link>
          </CommandCard>

          <CommandCard title={cc.distributionTitle} description={cc.distributionDescription}>
            {commandCenter.categoryDistribution.length === 0 ? (
              <CommandEmpty title={cc.emptyCategories} description={cc.emptyCategoriesDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.categoryDistribution.map((category) => (
                  <li key={category.id}>
                    <CommandListRow
                      href={category.href}
                      title={category.name}
                      meta={String(category.count)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.significantTitle} description={cc.significantDescription}>
            {commandCenter.significantRisks.length === 0 ? (
              <CommandEmpty title={cc.emptySignificant} description={cc.emptySignificantDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.significantRisks.map((risk) => (
                  <li key={risk.id}>
                    <CommandListRow
                      href={risk.href}
                      title={risk.title}
                      subtitle={`${risk.riskType} · ${risk.residualRating ?? cc.notSet}`}
                      badge={
                        <Badge variant="destructive" className="text-[10px]">
                          {cc.significant}
                        </Badge>
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.openResponsesTitle} description={cc.openResponsesDescription}>
            {commandCenter.openResponses.length === 0 ? (
              <CommandEmpty title={cc.emptyOpenResponses} description={cc.emptyOpenResponsesDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.openResponses.map((risk) => (
                  <li key={risk.id}>
                    <CommandListRow href={risk.href} title={risk.title} subtitle={risk.riskType} />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.outstandingProceduresTitle} description={cc.outstandingProceduresDescription}>
            {commandCenter.outstandingProcedures.length === 0 ? (
              <CommandEmpty
                title={cc.emptyProcedures}
                description={cc.emptyProceduresDescription}
              />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.outstandingProcedures.map((risk) => (
                  <li key={risk.id}>
                    <CommandListRow href={risk.href} title={risk.title} subtitle={risk.riskType} />
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
          <CommandCard title={cc.responsesTitle} description={cc.responsesDescription}>
            {commandCenter.responses.length === 0 ? (
              <CommandEmpty title={cc.emptyResponsesList} description={cc.emptyResponsesListDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.responses.map((response) => (
                  <li key={response.id}>
                    <CommandListRow
                      href={response.href}
                      title={response.riskTitle}
                      subtitle={`${response.responseType} · ${response.description}`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.proceduresTitle} description={cc.proceduresDescription}>
            {commandCenter.procedures.length === 0 ? (
              <CommandEmpty title={cc.emptyProceduresList} description={cc.emptyProceduresListDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.procedures.map((procedure) => (
                  <li key={procedure.id}>
                    <CommandListRow
                      href={procedure.href}
                      title={procedure.riskTitle}
                      subtitle={procedure.procedureReference}
                    />
                  </li>
                ))}
              </ul>
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
              href={`${base}/review-notes`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {cc.viewReviewNotes}
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
