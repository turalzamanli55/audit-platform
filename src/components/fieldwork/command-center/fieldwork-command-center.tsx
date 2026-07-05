"use client";

import Link from "next/link";
import { WorkspaceProgressBar, WorkspaceStatusBadge, workspaceTokens } from "@/components/workspace";
import {
  CommandCard,
  CommandEmpty,
  CommandKpiRow,
  CommandListRow,
} from "@/components/dashboard/command-center/command-center-primitives";
import { PlanningWorkflowPipeline } from "@/components/planning/command-center/planning-workflow-pipeline";
import { useFieldworkWorkspace } from "@/lib/fieldwork/use-fieldwork-workspace";
import type { FieldworkCommandCenterData } from "@/types/fieldwork-command-center";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/ui/cn";
import {
  formatFieldworkDocumentType,
  formatFieldworkFindingSeverity,
  formatFieldworkNoteType,
} from "@/lib/fieldwork/fieldwork-workspace-display";
import { IconArrowRight } from "@/components/ui/icons";

type FieldworkCommandCenterProps = {
  locale: string;
  slug: string;
  commandCenter: FieldworkCommandCenterData;
  labels: Dictionary["fieldwork"]["workspace"];
  fieldworkLabels: Dictionary["fieldwork"];
};

export function FieldworkCommandCenter({
  locale,
  slug,
  commandCenter,
  labels,
  fieldworkLabels,
}: FieldworkCommandCenterProps) {
  const cc = labels.commandCenter;
  const base = `/${locale}/app/engagements/${slug}/fieldwork`;
  const { fieldwork } = useFieldworkWorkspace();
  const progressPct = fieldwork?.progressPct ?? 0;

  if (!fieldwork) return null;

  return (
    <div className="space-y-6">
      <section className={workspaceTokens.commandHero}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className={workspaceTokens.heroEyebrow}>
              {cc.heroTitle}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <WorkspaceStatusBadge
                label={commandCenter.fieldworkHealth}
                variant={commandCenter.fieldworkHealthVariant}
              />
              <WorkspaceStatusBadge
                label={fieldworkLabels.statuses[fieldwork.packageStatus]}
                variant="outline"
              />
              <WorkspaceStatusBadge
                label={`${cc.programVersion} ${fieldwork.programVersion}`}
                variant="outline"
              />
              {commandCenter.lastUpdated ? (
                <WorkspaceStatusBadge
                  label={`${cc.lastUpdate}: ${commandCenter.lastUpdated}`}
                  variant="secondary"
                />
              ) : null}
            </div>
            <WorkspaceProgressBar label={labels.summaryProgress} value={progressPct} />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { href: `${base}/procedures`, label: labels.navProcedures },
              { href: `${base}/working-papers`, label: labels.navWorkingPapers },
              { href: `${base}/evidence`, label: labels.navEvidence },
              { href: `${base}/findings`, label: labels.navFindings },
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

      <CommandCard title={cc.workflowTitle} description={cc.workflowDescription}>
        <PlanningWorkflowPipeline
          steps={commandCenter.workflowSteps}
          currentStepId={commandCenter.currentWorkflowStep}
        />
      </CommandCard>

      <CommandKpiRow title={cc.executiveTitle} items={commandCenter.executive} />
      <CommandKpiRow title={cc.executionTitle} items={commandCenter.executionProgress} />
      <CommandKpiRow title={cc.kpisTitle} items={commandCenter.fieldworkKpis} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          {commandCenter.reviewQueueCount > 0 ? (
            <CommandCard title={cc.reviewQueueTitle} description={cc.reviewQueueDescription}>
              <ul className="divide-y divide-border/40">
                {commandCenter.reviewQueue.map((item) => (
                  <li key={item.id}>
                    <CommandListRow
                      href={item.href}
                      title={item.title}
                      subtitle={item.status}
                      meta={`${item.completionPct}%`}
                    />
                  </li>
                ))}
              </ul>
              <Link
                href={`${base}/procedures`}
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {fieldworkLabels.workflow.openProcedureAction}
                <IconArrowRight width={12} height={12} />
              </Link>
            </CommandCard>
          ) : (
            <CommandCard title={cc.reviewQueueTitle} description={cc.reviewQueueDescription}>
              <CommandEmpty title={cc.emptyReviewQueue} description={cc.emptyReviewQueueDescription} />
            </CommandCard>
          )}

          <CommandCard title={cc.procedureProgressTitle} description={cc.procedureProgressDescription}>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {commandCenter.procedureStatusBuckets.map((bucket) => (
                <Link
                  key={bucket.id}
                  href={bucket.href}
                  className={workspaceTokens.bucketTile}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {bucket.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">{bucket.count}</p>
                </Link>
              ))}
            </div>
          </CommandCard>

          <CommandCard title={cc.paperProgressTitle} description={cc.paperProgressDescription}>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {commandCenter.workingPaperStatusBuckets.map((bucket) => (
                <Link
                  key={bucket.id}
                  href={bucket.href}
                  className={workspaceTokens.bucketTile}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {bucket.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">{bucket.count}</p>
                </Link>
              ))}
            </div>
          </CommandCard>

          <CommandCard title={cc.evidenceStatusTitle} description={cc.evidenceStatusDescription}>
            <div className="grid gap-2 sm:grid-cols-3">
              {commandCenter.evidenceStatusBuckets.map((bucket) => (
                <Link
                  key={bucket.id}
                  href={bucket.href}
                  className={workspaceTokens.bucketTile}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {bucket.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">{bucket.count}</p>
                </Link>
              ))}
            </div>
          </CommandCard>

          <CommandCard title={cc.outstandingTitle} description={cc.outstandingDescription}>
            {commandCenter.outstandingProcedures.length === 0 ? (
              <CommandEmpty title={cc.emptyOutstanding} description={cc.emptyOutstandingDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.outstandingProcedures.map((item) => (
                  <li key={item.id}>
                    <CommandListRow
                      href={item.href}
                      title={item.title}
                      subtitle={item.status}
                      meta={`${item.completionPct}%`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.findingsTitle} description={cc.findingsDescription}>
            {commandCenter.openFindings.length === 0 ? (
              <CommandEmpty title={cc.emptyFindings} description={cc.emptyFindingsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.openFindings.map((finding) => (
                  <li key={finding.id}>
                    <CommandListRow
                      href={finding.href}
                      title={finding.title}
                      subtitle={`${formatFieldworkFindingSeverity(finding.severity, fieldworkLabels.findingSeverities, cc.unspecified)} ${fieldworkLabels.common.separator} ${finding.status}`}
                      meta={finding.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.severityTitle} description={cc.severityDescription}>
            {commandCenter.severityDistribution.length === 0 ? (
              <CommandEmpty title={cc.emptySeverity} description={cc.emptySeverityDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.severityDistribution.map((bucket) => (
                  <li key={bucket.severity}>
                    <CommandListRow
                      href={`${base}/findings`}
                      title={formatFieldworkFindingSeverity(
                        bucket.severity,
                        fieldworkLabels.findingSeverities,
                        cc.unspecified,
                      )}
                      meta={String(bucket.count)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.activityTitle} description={cc.activityDescription}>
            {commandCenter.recentActivity.length === 0 ? (
              <CommandEmpty title={cc.emptyActivity} description={cc.emptyActivityDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.recentActivity.map((item) => (
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
          <CommandCard title={cc.assignedWorkTitle} description={cc.assignedWorkDescription}>
            {commandCenter.assignedWork.length === 0 ? (
              <CommandEmpty title={cc.emptyAssigned} description={cc.emptyAssignedDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.assignedWork.map((item) => (
                  <li key={item.id}>
                    <CommandListRow
                      href={item.href}
                      title={item.title}
                      subtitle={item.assignedAuditorId ? `${cc.assigned}: ${item.assignedAuditorId.slice(0, 8)}…` : cc.unassigned}
                      meta={item.dueDate ?? undefined}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.workingPapersTitle} description={cc.workingPapersDescription}>
            {commandCenter.workingPapers.length === 0 ? (
              <CommandEmpty title={cc.emptyPapers} description={cc.emptyPapersDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.workingPapers.map((paper) => (
                  <li key={paper.id}>
                    <CommandListRow
                      href={paper.href}
                      title={paper.title}
                      subtitle={`${paper.procedureTitle} ${fieldworkLabels.common.separator} ${paper.status}`}
                      meta={paper.referenceCode ?? undefined}
                      badge={
                        paper.tickmarkCount > 0 ? (
                          <WorkspaceStatusBadge
                            label={`${paper.tickmarkCount} ${cc.tickmarkAbbrev}`}
                            variant="outline"
                          />
                        ) : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.recentDocumentsTitle} description={cc.recentDocumentsDescription}>
            {commandCenter.recentDocuments.length === 0 ? (
              <CommandEmpty title={cc.emptyDocuments} description={cc.emptyDocumentsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.recentDocuments.map((doc) => (
                  <li key={doc.id}>
                    <CommandListRow
                      href={doc.href}
                      title={doc.title}
                      subtitle={doc.procedureTitle}
                      meta={doc.referenceCode ?? undefined}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.evidenceTitle} description={cc.evidenceDescription}>
            {commandCenter.evidence.length === 0 ? (
              <CommandEmpty title={cc.emptyEvidence} description={cc.emptyEvidenceDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.evidence.map((item) => (
                  <li key={item.id}>
                    <CommandListRow
                      href={item.href}
                      title={item.name}
                      subtitle={`${formatFieldworkDocumentType(item.documentType, fieldworkLabels.evidence.documentTypes)} ${fieldworkLabels.common.separator} ${item.status}`}
                      meta={item.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.timelineTitle} description={cc.timelineDescription}>
            {commandCenter.timeline.length === 0 ? (
              <CommandEmpty title={cc.emptyTimeline} description={cc.emptyTimelineDescription} />
            ) : (
              <ol className="relative space-y-4 border-l border-border/50 pl-4">
                {commandCenter.timeline.map((item) => (
                  <li key={item.id} className="relative">
                    <span className="absolute -left-[1.3rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                    <Link href={item.href} className="block rounded-xl border border-border/40 px-3 py-2.5 hover:bg-card">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      {item.date ? (
                        <time className="mt-1 block text-[10px] text-muted-foreground">{item.date}</time>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </CommandCard>

          <CommandCard title={cc.reviewNotesTitle} description={cc.reviewNotesDescription}>
            {commandCenter.reviewNotes.length === 0 ? (
              <CommandEmpty title={cc.emptyReviewNotes} description={cc.emptyReviewNotesDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.reviewNotes.map((note) => (
                  <li key={note.id}>
                    <CommandListRow href={note.href} title={formatFieldworkNoteType(note.type, fieldworkLabels.noteTypes)} subtitle={note.body} meta={note.time} />
                  </li>
                ))}
              </ul>
            )}
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
                      title={formatFieldworkNoteType(comment.type, fieldworkLabels.noteTypes)}
                      subtitle={comment.body}
                      meta={comment.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>
        </div>
      </div>
    </div>
  );
}
