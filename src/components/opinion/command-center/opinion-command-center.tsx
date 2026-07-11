import type { ComponentProps } from "react";
import Link from "next/link";
import {
  WorkspaceProgressBar,
  WorkspaceStatusBadge,
  WorkspaceTable,
  workspaceTokens,
} from "@/components/workspace";
import {
  CommandCard,
  CommandEmpty,
  CommandKpiRow,
  CommandListRow,
} from "@/components/dashboard/command-center/command-center-primitives";
import { PlanningWorkflowPipeline } from "@/components/planning/command-center/planning-workflow-pipeline";
import { OpinionWorkflowPanel } from "@/components/opinion/workflow/opinion-workflow-panel";
import { useOpinionWorkspace } from "@/lib/opinion/use-opinion-workspace";
import type { OpinionCommandCenterLabels } from "@/lib/opinion/opinion-workspace-display";
import type { OpinionCommandCenterData } from "@/types/opinion-command-center";
import { cn } from "@/lib/ui/cn";
import { IconArrowRight } from "@/components/ui/icons";

type OpinionWorkflowLabels = {
  title: string;
  description: string;
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

type OpinionCommandCenterProps = {
  locale: string;
  slug: string;
  commandCenter: OpinionCommandCenterData;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  labels: {
    progress: string;
    workflowTitle: string;
    workflowDescription: string;
    navOpinionType: string;
    navBasisForOpinion: string;
    navKeyAuditMatters: string;
    navEmphasisOfMatter: string;
    navOtherInformation: string;
    navComments: string;
    navHistory: string;
  };
  commandCenterLabels: OpinionCommandCenterLabels;
  statusLabels: Record<string, string>;
  workflowLabels: OpinionWorkflowLabels;
};

export function OpinionCommandCenter({
  locale,
  slug,
  commandCenter,
  canSubmit,
  canReview,
  canApprove,
  labels,
  commandCenterLabels: cc,
  workflowLabels,
}: OpinionCommandCenterProps) {
  const base = `/${locale}/app/engagements/${slug}/opinion`;
  const { review } = useOpinionWorkspace();
  const progressPct = review?.progressPct ?? 0;

  if (!review) return null;

  return (
    <div className="space-y-6">
      <section className={workspaceTokens.commandHero}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className={workspaceTokens.heroEyebrow}>{cc.heroTitle}</p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {commandCenter.executive.map((kpi) => (
                <Link
                  key={kpi.id}
                  href={kpi.href ?? base}
                  className={workspaceTokens.actionLink}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-foreground">
                    {kpi.value}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{kpi.hint}</p>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <WorkspaceStatusBadge
                label={commandCenter.approvalStatus}
                variant={commandCenter.approvalVariant}
              />
              <WorkspaceStatusBadge
                label={`${cc.packageVersion} ${review.packageVersion}`}
                variant="outline"
              />
              {commandCenter.lastUpdated ? (
                <WorkspaceStatusBadge
                  label={`${cc.lastUpdate}: ${commandCenter.lastUpdated}`}
                  variant="secondary"
                />
              ) : null}
            </div>
            <WorkspaceProgressBar label={labels.progress} value={progressPct} />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { href: `${base}/opinion-type`, label: labels.navOpinionType },
              { href: `${base}/basis-for-opinion`, label: labels.navBasisForOpinion },
              { href: `${base}/key-audit-matters`, label: labels.navKeyAuditMatters },
              { href: `${base}/emphasis-of-matter`, label: labels.navEmphasisOfMatter },
              { href: `${base}/other-information`, label: labels.navOtherInformation },
              { href: `${base}/comments`, label: labels.navComments },
            ].map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={cn(workspaceTokens.actionLink, "px-3 py-2 text-xs sm:text-sm")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <OpinionWorkflowPanel
        review={review}
        canSubmit={canSubmit}
        canReview={canReview}
        canApprove={canApprove}
        labels={{
          ...workflowLabels,
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
      <CommandKpiRow title={cc.summaryTitle} items={commandCenter.reviewSummary} />
      <CommandKpiRow title={cc.metricsTitle} items={commandCenter.reviewMetrics} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          <CommandCard title={cc.reviewQueueTitle} description={cc.reviewQueueDescription}>
            {commandCenter.reviewQueue.length === 0 ? (
              <CommandEmpty
                title={cc.emptyChecklist}
                description={cc.emptyChecklistDescription}
              />
            ) : (
              <WorkspaceTable
                columns={[
                  {
                    id: "title",
                    header: cc.titleColumn,
                    cell: (row) => (
                      <Link href={row.href} className="font-medium text-foreground hover:underline">
                        {row.title}
                      </Link>
                    ),
                  },
                  {
                    id: "module",
                    header: cc.moduleColumn,
                    cell: (row) => row.sectionType,
                    hideOnMobile: true,
                  },
                  {
                    id: "status",
                    header: cc.statusColumn,
                    cell: (row) => row.sectionStatus,
                  },
                  {
                    id: "severity",
                    header: cc.severityColumn,
                    cell: (row) => row.severity ?? "—",
                    hideOnMobile: true,
                  },
                ]}
                rows={commandCenter.reviewQueue}
                keyFn={(row) => row.id}
                emptyTitle={cc.emptyChecklist}
                emptyDescription={cc.emptyChecklistDescription}
              />
            )}
          </CommandCard>

          <CommandCard title={cc.returnedTitle} description={cc.returnedDescription}>
            {commandCenter.returnedItems.length === 0 ? (
              <CommandEmpty title={cc.emptyReturned} description={cc.emptyReturnedDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.returnedItems.map((item) => (
                  <li key={item.id}>
                    <CommandListRow
                      href={item.href}
                      title={item.title}
                      subtitle={item.sectionType}
                      meta={item.sectionStatus}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.resolvedTitle} description={cc.resolvedDescription}>
            {commandCenter.resolvedItems.length === 0 ? (
              <CommandEmpty title={cc.emptyResolved} description={cc.emptyResolvedDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.resolvedItems.map((item) => (
                  <li key={item.id}>
                    <CommandListRow
                      href={item.href}
                      title={item.title}
                      subtitle={item.sectionType}
                      meta={item.sectionStatus}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.findingsTitle} description={cc.findingsDescription}>
            {commandCenter.moduleBuckets.length === 0 ? (
              <CommandEmpty title={cc.emptyFindings} description={cc.emptyFindingsDescription} />
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {commandCenter.moduleBuckets.map((bucket) => (
                  <Link key={bucket.id} href={bucket.href} className={workspaceTokens.bucketTile}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {bucket.label}
                    </p>
                    <p className="mt-1 text-xl font-semibold tabular-nums">{bucket.count}</p>
                  </Link>
                ))}
              </div>
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
          {commandCenter.summaryNotes ? (
            <CommandCard title={cc.summaryTitle} description={cc.hintProgress}>
              <p className="text-sm leading-relaxed text-foreground">{commandCenter.summaryNotes}</p>
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
                    <Link
                      href={version.href}
                      className="block rounded-xl border border-border/40 px-3 py-2.5 hover:bg-card"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {cc.versionLabel} {version.versionNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">{version.summary}</p>
                      <time className="mt-1 block text-[10px] text-muted-foreground">
                        {version.time}
                      </time>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </CommandCard>

          <CommandCard title={cc.reviewNotesTitle} description={cc.reviewNotesDescription}>
            {commandCenter.completionComments.length === 0 ? (
              <CommandEmpty
                title={cc.emptyReviewNotes}
                description={cc.emptyReviewNotesDescription}
              />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.completionComments.map((comment) => (
                  <li key={comment.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <WorkspaceStatusBadge label={comment.type} variant="outline" />
                      <time className="text-[10px] text-muted-foreground">{comment.time}</time>
                    </div>
                    <p className="mt-2 text-sm text-foreground">{comment.body}</p>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`${base}/emphasis-of-matter`}
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
