"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  CommandCard,
  CommandEmpty,
  CommandKpiRow,
  CommandListRow,
} from "@/components/dashboard/command-center/command-center-primitives";
import { PlanningWorkflowPanel } from "@/components/planning/workflow/planning-workflow-panel";
import { PlanningCommentsSection } from "@/components/planning/comments/planning-comments-section";
import { PlanningWorkflowPipeline } from "./planning-workflow-pipeline";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import type { PlanningCommentView } from "@/lib/planning/load-planning-comments";
import type { PlanningCommandCenterData } from "@/types/planning-command-center";
import type { Dictionary } from "@/i18n/get-dictionary";
import { workspaceTokens } from "@/components/workspace";
import { cn } from "@/lib/ui/cn";
import { IconArrowRight, IconUsers } from "@/components/ui/icons";

type PlanningCommandCenterProps = {
  locale: string;
  slug: string;
  commandCenter: PlanningCommandCenterData;
  comments: PlanningCommentView[];
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  canComment: boolean;
  labels: Dictionary["planning"]["workspace"];
  planningLabels: Dictionary["planning"];
};

export function PlanningCommandCenter({
  locale,
  slug,
  commandCenter,
  comments,
  canSubmit,
  canReview,
  canApprove,
  canComment,
  labels,
  planningLabels,
}: PlanningCommandCenterProps) {
  const cc = labels.commandCenter;
  const base = `/${locale}/app/engagements/${slug}/planning`;
  const { plan } = usePlanningWorkspace();
  const progressPct = plan?.kpiProgress ?? 0;

  return (
    <div className="space-y-6">
      <section className={workspaceTokens.commandHero}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className={workspaceTokens.heroEyebrow}>
              {cc.heroTitle}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {progressPct}%
              </span>
              <Badge variant={commandCenter.approvalVariant}>{commandCenter.approvalStatus}</Badge>
              {commandCenter.deadlineLabel ? (
                <Badge
                  variant={commandCenter.isOverdue ? "destructive" : "secondary"}
                  className="rounded-full"
                >
                  {commandCenter.isOverdue ? cc.overdue : cc.deadline}: {commandCenter.deadlineLabel}
                </Badge>
              ) : null}
            </div>
            <div className={cn(workspaceTokens.progressTrack, "max-w-md")}>
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
          <div className="flex flex-wrap gap-2">
            {[
              { href: `${base}/strategy`, label: labels.navStrategy },
              { href: `${base}/checklist`, label: labels.navChecklist },
              { href: `${base}/documents`, label: labels.navDocuments },
              { href: `${base}/timeline`, label: labels.navTimeline },
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

      <PlanningWorkflowPanel
        canSubmit={canSubmit}
        canReview={canReview}
        canApprove={canApprove}
        labels={planningLabels.workflow}
        statusLabels={planningLabels.statuses}
      />

      <CommandCard title={cc.workflowTitle} description={cc.workflowDescription}>
        <PlanningWorkflowPipeline
          steps={commandCenter.workflowSteps}
          currentStepId={commandCenter.currentWorkflowStep}
        />
      </CommandCard>

      <CommandKpiRow title={cc.executiveTitle} items={commandCenter.executive} />
      <CommandKpiRow title={cc.healthTitle} items={commandCenter.planningHealth} />
      <CommandKpiRow title={cc.metricsTitle} items={commandCenter.planningMetrics} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          {commandCenter.reviewQueueCount > 0 ? (
            <CommandCard title={cc.reviewQueueTitle} description={cc.reviewQueueDescription}>
              <div className="rounded-xl border border-warning/40 bg-warning/5 px-4 py-4">
                <p className="text-sm font-medium text-foreground">{planningLabels.workflow.pendingReviewNotice}</p>
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

          <CommandCard title={cc.checklistTitle} description={cc.checklistDescription}>
            {commandCenter.checklistItems.length === 0 ? (
              <CommandEmpty title={cc.emptyChecklist} description={cc.emptyChecklistDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.checklistItems.map((item) => (
                  <li key={item.id}>
                    <CommandListRow
                      href={item.href}
                      title={item.label}
                      badge={
                        <Badge variant={item.completed ? "success" : "warning"} className="text-[10px]">
                          {item.completed ? cc.complete : cc.open}
                        </Badge>
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.outstandingTitle} description={cc.outstandingDescription}>
            {commandCenter.outstandingTasks.length === 0 ? (
              <CommandEmpty title={cc.emptyOutstanding} description={cc.emptyOutstandingDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.outstandingTasks.map((item) => (
                  <li key={item.id}>
                    <CommandListRow href={item.href} title={item.label} />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.activityTitle} description={cc.activityDescription}>
            {commandCenter.recentActivity.length === 0 ? (
              <CommandEmpty title={cc.emptyActivity} description={cc.emptyActivityDescription} />
            ) : (
              <ol className="divide-y divide-border/40">
                {commandCenter.recentActivity.map((item) => (
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
            <Link
              href={`${base}/history`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {cc.viewHistory}
              <IconArrowRight width={12} height={12} />
            </Link>
          </CommandCard>

          <CommandCard title={cc.changesTitle} description={cc.changesDescription}>
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
          </CommandCard>
        </div>

        <div className="space-y-5">
          <CommandCard title={cc.calendarTitle} description={cc.calendarDescription}>
            {commandCenter.timeline.length === 0 ? (
              <CommandEmpty title={cc.emptyTimeline} description={cc.emptyTimelineDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.timeline.map((milestone) => (
                  <li key={milestone.id}>
                    <CommandListRow
                      href={milestone.href}
                      title={milestone.label}
                      subtitle={[milestone.startDate, milestone.endDate].filter(Boolean).join(" – ")}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.documentsTitle} description={cc.documentsDescription}>
            {commandCenter.documents.length === 0 ? (
              <CommandEmpty title={cc.emptyDocuments} description={cc.emptyDocumentsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.documents.map((doc) => (
                  <li key={doc.id}>
                    <CommandListRow
                      href={doc.href}
                      title={doc.name}
                      subtitle={`${doc.documentType} · ${doc.status}`}
                      meta={doc.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.notesTitle} description={cc.notesDescription}>
            {commandCenter.hasNotes ? (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {commandCenter.notesPreview}
                </p>
                <Link
                  href={`${base}/notes`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  {cc.viewNotes}
                  <IconArrowRight width={12} height={12} />
                </Link>
              </div>
            ) : (
              <CommandEmpty title={cc.emptyNotes} description={cc.emptyNotesDescription} />
            )}
          </CommandCard>

          <CommandCard title={cc.teamTitle} description={cc.teamDescription}>
            {commandCenter.team.length === 0 ? (
              <CommandEmpty title={cc.emptyTeam} description={cc.emptyTeamDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.team.map((member) => (
                  <li key={member.id}>
                    <CommandListRow
                      href={`${base}/team`}
                      title={member.displayName}
                      subtitle={member.role}
                      badge={
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <IconUsers width={14} height={14} />
                        </span>
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
            {commandCenter.estimatedHours != null ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {cc.estimatedHours}: {commandCenter.estimatedHours}h
              </p>
            ) : null}
          </CommandCard>

          <PlanningCommentsSection
            comments={comments}
            canComment={canComment}
            locale={locale}
            labels={planningLabels.comments}
            embedded
          />
        </div>
      </div>
    </div>
  );
}
