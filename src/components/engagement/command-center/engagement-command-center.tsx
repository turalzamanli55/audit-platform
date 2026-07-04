"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui";
import {
  CommandCard,
  CommandEmpty,
  CommandKpiRow,
  CommandListRow,
} from "@/components/dashboard/command-center/command-center-primitives";
import { EngagementAuditPipeline } from "./engagement-audit-pipeline";
import { updateEngagementAction } from "@/lib/actions/engagement/update-engagement";
import { useEngagementWorkspace } from "@/lib/engagement/use-engagement-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { EngagementCommandCenterData } from "@/types/engagement-command-center";
import { IconArrowRight, IconUsers } from "@/components/ui/icons";

type EngagementCommandCenterProps = {
  locale: string;
  canUpdate: boolean;
  commandCenter: EngagementCommandCenterData;
  labels: Dictionary["engagements"]["workspace"];
  engagementsLabels: Dictionary["engagements"];
  overviewLabels: Dictionary["engagements"]["overview"];
};

export function EngagementCommandCenter({
  locale,
  canUpdate,
  commandCenter,
  labels,
  engagementsLabels,
  overviewLabels,
}: EngagementCommandCenterProps) {
  const cc = labels.commandCenter;
  const router = useRouter();
  const { engagement, refreshEngagement } = useEngagementWorkspace();
  const [editingDescription, setEditingDescription] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const description = isEditing
    ? (editingDescription ?? "")
    : (engagement.description ?? "");
  const canEdit = canUpdate && !engagement.isArchived;
  const isDirty = isEditing && editingDescription !== (engagement.description ?? "");
  const base = `/${locale}/app/engagements/${engagement.slug}`;

  const saveDescription = () => {
    startTransition(async () => {
      setError(null);
      const result = await updateEngagementAction({
        engagementId: engagement.id,
        version: engagement.version,
        description: description.trim() || null,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      refreshEngagement({
        ...engagement,
        description: description.trim() || null,
        version: result.data.version,
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
      setEditingDescription(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/40 bg-gradient-to-br from-card via-card to-muted/15 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {cc.heroTitle}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {commandCenter.overallCompletionPct}%
              </span>
              <span className="text-sm text-muted-foreground">{cc.overallCompletion}</span>
            </div>
            <div className="h-2 max-w-md overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${commandCenter.overallCompletionPct}%` }}
                role="progressbar"
                aria-valuenow={commandCenter.overallCompletionPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            {commandCenter.deadlineLabel ? (
              <Badge
                variant={commandCenter.isOverdue ? "destructive" : "secondary"}
                className="rounded-full"
              >
                {commandCenter.isOverdue ? cc.overdue : cc.deadline}: {commandCenter.deadlineLabel}
              </Badge>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`${base}/planning`}
              className="rounded-xl border border-border/50 px-3 py-2 text-xs font-medium hover:bg-card"
            >
              {labels.navPlanning}
            </Link>
            <Link
              href={`${base}/fieldwork`}
              className="rounded-xl border border-border/50 px-3 py-2 text-xs font-medium hover:bg-card"
            >
              {labels.navFieldwork}
            </Link>
            <Link
              href={`${base}/members`}
              className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/15"
            >
              {labels.navMembers}
            </Link>
          </div>
        </div>
      </section>

      <CommandKpiRow title={cc.executiveTitle} items={commandCenter.executive} />
      <CommandKpiRow title={cc.auditHealthTitle} items={commandCenter.auditHealth} />
      <CommandKpiRow title={cc.auditMetricsTitle} items={commandCenter.auditMetrics} />

      <CommandCard title={cc.pipelineTitle} description={cc.pipelineDescription}>
        <EngagementAuditPipeline
          phases={commandCenter.pipeline}
          ownerLabel={cc.owner}
          lastUpdateLabel={cc.lastUpdate}
        />
      </CommandCard>

      {commandCenter.reviewQueue.length > 0 ? (
        <CommandCard title={cc.reviewQueueTitle} description={cc.reviewQueueDescription}>
          <ul className="flex flex-wrap gap-2">
            {commandCenter.reviewQueue.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-warning/40 bg-warning/5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-warning/10"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </CommandCard>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          {commandCenter.outstandingIssues.length > 0 ? (
            <CommandCard title={cc.outstandingTitle} description={cc.outstandingDescription}>
              <ul className="divide-y divide-border/40">
                {commandCenter.outstandingIssues.map((issue) => (
                  <li key={issue.id}>
                    <CommandListRow
                      href={issue.href}
                      title={issue.label}
                      meta={String(issue.count)}
                      badge={
                        <Badge variant={issue.variant} className="text-[10px]">
                          {issue.count}
                        </Badge>
                      }
                    />
                  </li>
                ))}
              </ul>
            </CommandCard>
          ) : null}

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
          </CommandCard>

          <CommandCard title={cc.timelineTitle} description={cc.timelineDescription}>
            {commandCenter.auditTimeline.length === 0 ? (
              <CommandEmpty title={cc.emptyTimeline} description={cc.emptyTimelineDescription} />
            ) : (
              <ol className="relative space-y-0 border-l border-border/50 pl-4">
                {commandCenter.auditTimeline.slice(0, 10).map((item) => (
                  <li key={item.id} className="relative pb-4 pl-4 last:pb-0">
                    <span
                      className="absolute -left-[1.125rem] top-1.5 h-2 w-2 rounded-full bg-primary"
                      aria-hidden
                    />
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
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

          <CommandCard title={cc.documentsTitle} description={cc.documentsDescription}>
            {commandCenter.recentDocuments.length === 0 ? (
              <CommandEmpty title={cc.emptyDocuments} description={cc.emptyDocumentsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.recentDocuments.map((doc) => (
                  <li key={doc.id}>
                    <CommandListRow
                      href={doc.href}
                      title={doc.name}
                      subtitle={doc.documentType}
                      meta={doc.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>
        </div>

        <div className="space-y-5">
          <CommandCard title={labels.client.title} description={labels.client.description}>
            <dl className="space-y-3">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {labels.client.companyName}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {commandCenter.client.companySlug ? (
                    <Link
                      href={`/${locale}/app/companies/${commandCenter.client.companySlug}`}
                      className="text-primary hover:underline"
                    >
                      {commandCenter.client.companyName}
                    </Link>
                  ) : (
                    commandCenter.client.companyName
                  )}
                </dd>
              </div>
              {[
                [engagementsLabels.columnCode, commandCenter.client.engagementCode ?? "—"],
                [labels.summaryFramework, commandCenter.client.reportingFramework],
                [cc.reportingPeriod, commandCenter.client.periodRange ?? "—"],
                [cc.plannedSchedule, commandCenter.client.plannedRange ?? "—"],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-sm text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </CommandCard>

          {commandCenter.companyHealth ? (
            <CommandCard title={cc.companyHealthTitle} description={cc.companyHealthDescription}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{cc.validationStatus}</span>
                  <Badge variant={commandCenter.companyHealth.statusVariant}>
                    {commandCenter.companyHealth.statusLabel}
                  </Badge>
                </div>
                <CommandListRow
                  title={cc.framework}
                  subtitle={commandCenter.companyHealth.framework}
                />
                {commandCenter.companyHealth.jurisdiction ? (
                  <CommandListRow
                    title={cc.jurisdiction}
                    subtitle={commandCenter.companyHealth.jurisdiction}
                  />
                ) : null}
              </div>
            </CommandCard>
          ) : null}

          <CommandCard title={cc.teamTitle} description={cc.teamDescription}>
            {commandCenter.team.length === 0 ? (
              <CommandEmpty title={cc.emptyTeam} description={cc.emptyTeamDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.team.map((member) => (
                  <li key={member.id}>
                    <CommandListRow
                      href={`${base}/members`}
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
          </CommandCard>

          <CommandCard title={cc.decisionsTitle} description={cc.decisionsDescription}>
            {commandCenter.recentDecisions.length === 0 ? (
              <CommandEmpty title={cc.emptyDecisions} description={cc.emptyDecisionsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.recentDecisions.map((decision) => (
                  <li key={decision.id}>
                    <CommandListRow
                      title={decision.label}
                      subtitle={decision.module}
                      meta={decision.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.commentsTitle} description={cc.commentsDescription}>
            {commandCenter.recentComments.length === 0 ? (
              <CommandEmpty title={cc.emptyComments} description={cc.emptyCommentsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.recentComments.map((comment) => (
                  <li key={comment.id}>
                    <CommandListRow
                      href={comment.href}
                      title={comment.body}
                      subtitle={comment.module}
                      meta={comment.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={labels.sections.overview.highlightsTitle}>
            {error ? (
              <div className="mb-4">
                <Alert variant="error">{error}</Alert>
              </div>
            ) : null}
            {isEditing && canEdit ? (
              <div className="space-y-4">
                <label htmlFor="engagement-description" className="text-sm font-medium text-foreground">
                  {engagementsLabels.create.description}
                </label>
                <Input
                  id="engagement-description"
                  value={description}
                  onChange={(event) => setEditingDescription(event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={saveDescription} disabled={isPending || !isDirty}>
                    {overviewLabels.saveDescription}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingDescription(null);
                      setIsEditing(false);
                      setError(null);
                    }}
                    disabled={isPending}
                  >
                    {overviewLabels.cancelEdit}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {engagement.description?.trim() || labels.sections.overview.noDescription}
                </p>
                {canEdit ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingDescription(engagement.description ?? "");
                      setIsEditing(true);
                    }}
                  >
                    {overviewLabels.editDescription}
                  </Button>
                ) : null}
              </div>
            )}
          </CommandCard>
        </div>
      </div>
    </div>
  );
}
