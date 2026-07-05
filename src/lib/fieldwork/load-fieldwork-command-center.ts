import "server-only";

import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import { COMPLETE_PROCEDURE_STATUSES } from "@/constants/fieldwork";
import {
  formatFieldworkActivityAction,
  formatFieldworkDocumentType,
  formatFieldworkFindingSeverity,
  formatFieldworkNoteType,
} from "@/lib/fieldwork/fieldwork-workspace-display";
import type { FieldworkActivityView } from "@/lib/fieldwork/load-fieldwork-activity";
import { isProcedureComplete } from "@/lib/fieldwork/fieldwork-rules";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type {
  FieldworkCommandCenterData,
  FieldworkCommandKpi,
  FieldworkWorkflowStep,
} from "@/types/fieldwork-command-center";

type CommandCenterLabels = Dictionary["fieldwork"]["workspace"]["commandCenter"];

const WORKFLOW_STEP_IDS = [
  "not_started",
  "in_progress",
  "submitted",
  "returned",
  "review_cleared",
  "completed",
] as const;

function formatRelativeTime(locale: Locale, createdAt: string): string {
  const date = new Date(createdAt);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60_000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, "day");
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date);
}

function formatDateTime(locale: Locale, iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatDate(locale: Locale, iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );
}

function resolveCurrentWorkflowStep(fieldwork: FieldworkWorkspaceView): string {
  const procedures = fieldwork.procedures;
  const hasReturned = procedures.some((p) => p.procedureStatus === "returned");
  const hasPendingReview = procedures.some((p) =>
    ["submitted_for_review", "review_in_progress"].includes(p.procedureStatus),
  );
  const hasReviewCleared = procedures.some((p) => p.procedureStatus === "review_cleared");
  const allComplete =
    procedures.length > 0 &&
    procedures.every((p) => isProcedureComplete(p.procedureStatus));

  if (fieldwork.packageStatus === "substantially_complete" || allComplete) return "completed";
  if (hasReviewCleared && !hasPendingReview && !hasReturned) return "review_cleared";
  if (hasReturned) return "returned";
  if (hasPendingReview) return "submitted";
  if (procedures.some((p) => !["not_started", "deferred"].includes(p.procedureStatus))) {
    return "in_progress";
  }
  return "not_started";
}

function buildWorkflowSteps(
  fieldwork: FieldworkWorkspaceView,
  labels: CommandCenterLabels,
): { steps: FieldworkWorkflowStep[]; current: string } {
  const current = resolveCurrentWorkflowStep(fieldwork);
  const currentIndex = WORKFLOW_STEP_IDS.indexOf(current as (typeof WORKFLOW_STEP_IDS)[number]);

  const stepLabels: Record<string, string> = {
    not_started: labels.stepNotStarted,
    in_progress: labels.stepInProgress,
    submitted: labels.stepSubmitted,
    returned: labels.stepReturned,
    review_cleared: labels.stepReviewCleared,
    completed: labels.stepCompleted,
  };

  const steps: FieldworkWorkflowStep[] = WORKFLOW_STEP_IDS.map((id, index) => ({
    id,
    label: stepLabels[id] ?? id,
    status:
      index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));

  return { steps, current };
}

export function loadFieldworkCommandCenter(input: {
  locale: Locale;
  fieldwork: FieldworkWorkspaceView;
  activity: FieldworkActivityView;
  labels: CommandCenterLabels;
  fieldworkLabels: Dictionary["fieldwork"];
}): FieldworkCommandCenterData {
  const { locale, fieldwork, activity, labels, fieldworkLabels } = input;
  const base = `/${locale}/app/engagements/${fieldwork.engagementSlug}/fieldwork`;

  const completeCount = fieldwork.procedures.filter((p) =>
    isProcedureComplete(p.procedureStatus),
  ).length;
  const openFindings = fieldwork.findings.filter((f) => f.findingStatus === "open");
  const resolvedFindings = fieldwork.findings.filter((f) =>
    ["resolved", "closed"].includes(f.findingStatus),
  );
  const outstandingProcedures = fieldwork.procedures.filter(
    (p) => !isProcedureComplete(p.procedureStatus),
  );
  const reviewQueue = fieldwork.procedures.filter((p) =>
    ["submitted_for_review", "review_in_progress"].includes(p.procedureStatus),
  );

  const procedureIdsWithEvidence = new Set(
    fieldwork.evidence.map((e) => e.procedureId).filter((id): id is string => Boolean(id)),
  );
  const evidenceCoveragePct =
    fieldwork.procedures.length > 0
      ? Math.round((procedureIdsWithEvidence.size / fieldwork.procedures.length) * 100)
      : 0;

  const completePaperStatuses = new Set(["complete", "cleared"]);
  const completePapers = fieldwork.workingPapers.filter((p) =>
    completePaperStatuses.has(p.paperStatus),
  );
  const paperProgressPct =
    fieldwork.workingPapers.length > 0
      ? Math.round((completePapers.length / fieldwork.workingPapers.length) * 100)
      : 0;

  const assignedAuditorIds = new Set(
    [
      ...fieldwork.procedures.map((p) => p.assignedAuditorId),
      ...fieldwork.workingPapers.map((p) => p.assignedAuditorId),
    ].filter((id): id is string => Boolean(id)),
  );

  const tickmarkCount =
    fieldwork.workingPapers.reduce((sum, paper) => sum + paper.tickmarks.length, 0) +
    fieldwork.tickmarkLibrary.length;

  const { steps: workflowSteps, current: currentWorkflowStep } = buildWorkflowSteps(
    fieldwork,
    labels,
  );

  const reviewQueueCount = fieldwork.pendingReviewCount;
  const openItemsScore =
    outstandingProcedures.length + openFindings.length + reviewQueueCount;

  const fieldworkHealth =
    openItemsScore === 0
      ? labels.healthOnTrack
      : openItemsScore <= 3
        ? labels.healthMonitor
        : labels.healthAttention;

  const fieldworkHealthVariant =
    openItemsScore === 0 ? "success" : openItemsScore <= 3 ? "warning" : "destructive";

  const executive: FieldworkCommandKpi[] = [
    {
      id: "health",
      label: labels.kpiHealth,
      value: fieldworkHealth,
      hint: labels.hintHealth,
      variant: fieldworkHealthVariant,
    },
    {
      id: "progress",
      label: labels.kpiProgress,
      value: `${fieldwork.progressPct}%`,
      hint: labels.hintProgress,
    },
    {
      id: "procedures",
      label: labels.kpiProcedures,
      value: `${completeCount}/${fieldwork.procedures.length}`,
      hint: labels.hintProcedures,
      href: `${base}/procedures`,
    },
    {
      id: "papers",
      label: labels.kpiWorkingPapers,
      value: String(fieldwork.workingPapers.length),
      hint: `${paperProgressPct}% ${labels.complete}`,
      href: `${base}/working-papers`,
    },
    {
      id: "evidence",
      label: labels.kpiEvidence,
      value: String(fieldwork.evidence.length),
      hint: `${evidenceCoveragePct}% ${labels.coverage}`,
      href: `${base}/evidence`,
    },
    {
      id: "findings",
      label: labels.kpiOpenFindings,
      value: String(openFindings.length),
      hint: labels.hintOpenFindings,
      variant: openFindings.length > 0 ? "warning" : "default",
      href: `${base}/findings`,
    },
  ];

  const executionProgress: FieldworkCommandKpi[] = [
    {
      id: "resolved",
      label: labels.kpiResolvedFindings,
      value: String(resolvedFindings.length),
      hint: labels.hintResolvedFindings,
      href: `${base}/findings`,
    },
    {
      id: "pending-review",
      label: labels.kpiPendingReview,
      value: String(reviewQueueCount),
      hint: labels.hintPendingReview,
      variant: reviewQueueCount > 0 ? "warning" : "default",
    },
    {
      id: "outstanding",
      label: labels.kpiOutstanding,
      value: String(outstandingProcedures.length),
      hint: labels.hintOutstanding,
      variant: outstandingProcedures.length > 0 ? "warning" : "default",
      href: `${base}/procedures`,
    },
    {
      id: "auditors",
      label: labels.kpiAuditors,
      value: String(assignedAuditorIds.size),
      hint: labels.hintAuditors,
      href: `${base}/procedures`,
    },
    {
      id: "notes",
      label: labels.kpiOpenNotes,
      value: String(fieldwork.auditorNotes.length),
      hint: labels.hintOpenNotes,
      href: `${base}/notes`,
    },
    {
      id: "review-notes",
      label: labels.kpiReviewNotes,
      value: String(fieldwork.reviewNotes.length),
      hint: labels.hintReviewNotes,
      href: `${base}/review-notes`,
    },
  ];

  const fieldworkKpis: FieldworkCommandKpi[] = [
    {
      id: "status",
      label: labels.kpiStatus,
      value: fieldworkLabels.statuses[fieldwork.packageStatus],
      hint: `${labels.programVersion} ${fieldwork.programVersion}`,
    },
    {
      id: "tickmarks",
      label: labels.kpiTickmarks,
      value: String(tickmarkCount),
      hint: labels.hintTickmarks,
      href: `${base}/working-papers`,
    },
    {
      id: "comments",
      label: labels.kpiComments,
      value: String(fieldwork.internalComments.length),
      hint: labels.hintComments,
      href: `${base}/comments`,
    },
    {
      id: "program",
      label: labels.kpiProgram,
      value: fieldwork.program
        ? fieldworkLabels.programStatuses[fieldwork.program.programStatus]
        : labels.notSet,
      hint: labels.hintProgram,
      href: `${base}/program`,
    },
    {
      id: "groups",
      label: labels.kpiGroups,
      value: String(fieldwork.procedureGroups.length),
      hint: labels.hintGroups,
      href: `${base}/procedure-groups`,
    },
    {
      id: "last-update",
      label: labels.kpiLastUpdate,
      value: formatDateTime(locale, fieldwork.updatedAt) ?? labels.notSet,
      hint: labels.hintLastUpdate,
    },
  ];

  const countByProcedureStatus = (status: string) =>
    fieldwork.procedures.filter((p) => p.procedureStatus === status).length;

  const procedureStatusBuckets = [
    "not_started",
    "in_progress",
    "submitted_for_review",
    "returned",
    "review_cleared",
    "complete",
  ].map((status) => ({
    id: status,
    label:
      fieldworkLabels.procedureStatuses[
        status as keyof typeof fieldworkLabels.procedureStatuses
      ] ?? status,
    count: countByProcedureStatus(status),
    href: `${base}/procedures`,
  }));

  const countByPaperStatus = (status: string) =>
    fieldwork.workingPapers.filter((p) => p.paperStatus === status).length;

  const workingPaperStatusBuckets = ["draft", "in_progress", "submitted", "cleared", "complete"].map(
    (status) => ({
      id: status,
      label:
        fieldworkLabels.workingPaperStatuses[
          status as keyof typeof fieldworkLabels.workingPaperStatuses
        ] ?? status,
      count: countByPaperStatus(status),
      href: `${base}/working-papers`,
    }),
  );

  const countByEvidenceStatus = (status: string) =>
    fieldwork.evidence.filter((e) => e.evidenceStatus === status).length;

  const evidenceStatusBuckets = ["pending", "recorded", "verified"].map((status) => ({
    id: status,
    label:
      fieldworkLabels.evidenceStatuses[status as keyof typeof fieldworkLabels.evidenceStatuses] ??
      status,
    count: countByEvidenceStatus(status),
    href: `${base}/evidence`,
  }));

  const severityMap = new Map<string, number>();
  for (const finding of fieldwork.findings) {
    const key = formatFieldworkFindingSeverity(
      finding.severity,
      fieldworkLabels.findingSeverities,
      labels.unspecified,
    );
    severityMap.set(key, (severityMap.get(key) ?? 0) + 1);
  }
  const severityDistribution = [...severityMap.entries()].map(([severity, count]) => ({
    severity,
    count,
  }));

  const mapProcedure = (procedure: FieldworkWorkspaceView["procedures"][number]) => ({
    id: procedure.id,
    title: procedure.title,
    status: fieldworkLabels.procedureStatuses[procedure.procedureStatus] ?? procedure.procedureStatus,
    completionPct: procedure.completionPct,
    assignedAuditorId: procedure.assignedAuditorId,
    dueDate: formatDate(locale, procedure.dueDate),
    href: `${base}/procedures`,
  });

  const mapPaper = (paper: FieldworkWorkspaceView["workingPapers"][number]) => ({
    id: paper.id,
    title: paper.title,
    referenceCode: paper.referenceCode,
    status: fieldworkLabels.workingPaperStatuses[paper.paperStatus] ?? paper.paperStatus,
    procedureTitle: paper.procedureTitle,
    tickmarkCount: paper.tickmarks.length,
    href: `${base}/working-papers`,
  });

  const workingPapers = fieldwork.workingPapers.slice(0, 6).map(mapPaper);
  const recentDocuments = fieldwork.workingPapers.slice(0, 4).map(mapPaper);

  const evidence = fieldwork.evidence.slice(0, 6).map((item) => ({
    id: item.id,
    name: item.name,
    status: fieldworkLabels.evidenceStatuses[item.evidenceStatus] ?? item.evidenceStatus,
    documentType: formatFieldworkDocumentType(item.documentType, fieldworkLabels.evidence.documentTypes),
    time: formatRelativeTime(locale, item.createdAt),
    href: `${base}/evidence`,
  }));

  const mapFinding = (finding: FieldworkWorkspaceView["findings"][number]) => ({
    id: finding.id,
    title: finding.title,
    severity: formatFieldworkFindingSeverity(
      finding.severity,
      fieldworkLabels.findingSeverities,
      labels.unspecified,
    ),
    status: fieldworkLabels.findingStatuses[finding.findingStatus] ?? finding.findingStatus,
    time: formatRelativeTime(locale, finding.createdAt),
    href: `${base}/findings`,
  });

  const mapNote = (note: FieldworkWorkspaceView["notes"][number], href: string) => ({
    id: note.id,
    body: note.body.trim().slice(0, 140),
    type: formatFieldworkNoteType(note.noteType, fieldworkLabels.noteTypes),
    time: formatRelativeTime(locale, note.createdAt),
    href,
  });

  const activityFromDb = activity.entries.map((entry) => ({
    id: entry.id,
    title: formatFieldworkActivityAction(entry.action, fieldworkLabels.history.actions),
    description: entry.summary?.trim() || entry.action,
    time: formatRelativeTime(locale, entry.createdAt),
  }));

  const timeline = [
    ...fieldwork.procedures
      .filter((p) => p.dueDate)
      .slice(0, 4)
      .map((p) => ({
        id: `due-${p.id}`,
        label: p.title,
        date: formatDate(locale, p.dueDate),
        href: `${base}/procedures`,
      })),
    ...activityFromDb.slice(0, 4).map((entry) => ({
      id: `activity-${entry.id}`,
      label: entry.title,
      date: entry.time,
      href: `${base}/history`,
    })),
  ].slice(0, 8);

  return {
    executive,
    executionProgress,
    fieldworkKpis,
    workflowSteps,
    currentWorkflowStep,
    procedureStatusBuckets,
    workingPaperStatusBuckets,
    evidenceStatusBuckets,
    severityDistribution,
    reviewQueue: reviewQueue.map(mapProcedure),
    assignedWork: fieldwork.procedures
      .filter((p) => p.assignedAuditorId)
      .slice(0, 6)
      .map(mapProcedure),
    outstandingProcedures: outstandingProcedures.slice(0, 6).map(mapProcedure),
    workingPapers,
    recentDocuments,
    evidence,
    openFindings: openFindings.slice(0, 6).map(mapFinding),
    resolvedFindings: resolvedFindings.slice(0, 6).map(mapFinding),
    comments: fieldwork.internalComments.slice(0, 6).map((n) => mapNote(n, `${base}/comments`)),
    reviewNotes: fieldwork.reviewNotes.slice(0, 6).map((n) => mapNote(n, `${base}/review-notes`)),
    recentActivity: activityFromDb.slice(0, 6),
    activityFeed: activityFromDb.slice(0, 12),
    timeline,
    reviewQueueCount,
    fieldworkHealth,
    fieldworkHealthVariant,
    completionPct: fieldwork.progressPct,
    assignedAuditorCount: assignedAuditorIds.size,
    tickmarkCount,
    evidenceCount: fieldwork.evidence.length,
    openNotesCount: fieldwork.auditorNotes.length,
    lastUpdated: formatDateTime(locale, fieldwork.updatedAt),
  };
}
