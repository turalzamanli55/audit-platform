import "server-only";

import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import type { PlanningCommentView } from "@/lib/planning/load-planning-comments";
import type { PlanningActivityView } from "@/lib/planning/load-planning-activity";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import { formatPlanningActivityAction } from "@/lib/planning/planning-workspace-display";
import type {
  PlanningCommandCenterData,
  PlanningCommandKpi,
  PlanningWorkflowStep,
} from "@/types/planning-command-center";

type CommandCenterLabels = Dictionary["planning"]["workspace"]["commandCenter"];

const WORKFLOW_STEP_IDS = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "integrated",
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

function formatDate(locale: Locale, iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );
}

function resolveCurrentWorkflowStep(plan: PlanningWorkspaceView): string {
  if (
    plan.planningStatus === "approved" &&
    plan.materialityStatus === "integrated" &&
    plan.riskStatus === "integrated"
  ) {
    return "integrated";
  }
  if (plan.planningStatus === "approved" || plan.planningStatus === "superseded") {
    return "approved";
  }
  if (plan.planningStatus === "returned") return "returned";
  if (plan.planningStatus === "pending_review") return "under_review";
  if (plan.submittedAt) return "submitted";
  return "draft";
}

function buildWorkflowSteps(
  plan: PlanningWorkspaceView,
  labels: CommandCenterLabels,
): { steps: PlanningWorkflowStep[]; current: string } {
  const current = resolveCurrentWorkflowStep(plan);
  const currentIndex = WORKFLOW_STEP_IDS.indexOf(current as (typeof WORKFLOW_STEP_IDS)[number]);

  const stepLabels: Record<string, string> = {
    draft: labels.stepDraft,
    submitted: labels.stepSubmitted,
    under_review: labels.stepUnderReview,
    returned: labels.stepReturned,
    approved: labels.stepApproved,
    integrated: labels.stepIntegrated,
  };

  const steps: PlanningWorkflowStep[] = WORKFLOW_STEP_IDS.map((id, index) => ({
    id,
    label: stepLabels[id] ?? id,
    status:
      index < currentIndex
        ? "complete"
        : index === currentIndex
          ? "current"
          : "upcoming",
  }));

  return { steps, current };
}

export async function loadPlanningCommandCenter(input: {
  locale: Locale;
  plan: PlanningWorkspaceView;
  engagement: EngagementWorkspaceView;
  comments: PlanningCommentView[];
  activity: PlanningActivityView;
  labels: CommandCenterLabels;
  planningLabels: Dictionary["planning"];
}): Promise<PlanningCommandCenterData> {
  const { locale, plan, engagement, comments, activity, labels, planningLabels } = input;
  const base = `/${locale}/app/engagements/${engagement.slug}/planning`;

  const openChecklist = plan.checklist.filter((item) => !item.completed);
  const { steps: workflowSteps, current: currentWorkflowStep } = buildWorkflowSteps(plan, labels);

  const reviewQueueCount = plan.planningStatus === "pending_review" ? 1 : 0;
  const openChecklistCount = openChecklist.length;

  const approvalVariant =
    plan.planningStatus === "approved"
      ? "success"
      : plan.planningStatus === "pending_review"
        ? "warning"
        : plan.planningStatus === "returned"
          ? "destructive"
          : "default";

  const attentionScore =
    reviewQueueCount + openChecklistCount + (plan.planningStatus === "returned" ? 1 : 0);

  const planningHealth: PlanningCommandKpi[] = [
    {
      id: "health",
      label: labels.kpiHealth,
      value:
        attentionScore === 0
          ? labels.healthOnTrack
          : attentionScore <= 2
            ? labels.healthMonitor
            : labels.healthAttention,
      hint: labels.hintHealth,
      variant:
        attentionScore === 0
          ? "success"
          : attentionScore <= 2
            ? "warning"
            : "destructive",
    },
    {
      id: "progress",
      label: labels.kpiProgress,
      value: `${plan.kpiProgress}%`,
      hint: labels.hintProgress,
    },
    {
      id: "checklist",
      label: labels.kpiChecklist,
      value: `${plan.checklistProgress}%`,
      hint: labels.hintChecklist,
      href: `${base}/checklist`,
    },
    {
      id: "workflow",
      label: labels.kpiWorkflow,
      value: planningLabels.statuses[plan.planningStatus],
      hint: labels.hintWorkflow,
      variant: approvalVariant,
    },
  ];

  const executive: PlanningCommandKpi[] = [
    {
      id: "status",
      label: labels.kpiStatus,
      value: planningLabels.statuses[plan.planningStatus],
      hint: `${labels.planVersion} ${plan.planVersion}`,
    },
    {
      id: "framework",
      label: labels.kpiFramework,
      value: plan.financialReportingFramework?.trim() || "—",
      hint: labels.hintFramework,
      href: `${base}/framework`,
    },
    {
      id: "open-items",
      label: labels.kpiOpenItems,
      value: String(openChecklistCount),
      hint: labels.hintOpenItems,
      variant: openChecklistCount > 0 ? "warning" : "default",
      href: `${base}/checklist`,
    },
    {
      id: "documents",
      label: labels.kpiDocuments,
      value: String(plan.documents.length),
      hint: labels.hintDocuments,
      href: `${base}/documents`,
    },
  ];

  const planningMetrics: PlanningCommandKpi[] = [
    {
      id: "materiality",
      label: labels.kpiMateriality,
      value: planningLabels.integrationStatuses[plan.materialityStatus],
      hint: labels.hintMateriality,
      href: `/${locale}/app/engagements/${engagement.slug}/materiality`,
    },
    {
      id: "risk",
      label: labels.kpiRisk,
      value: planningLabels.integrationStatuses[plan.riskStatus],
      hint: labels.hintRisk,
      href: `/${locale}/app/engagements/${engagement.slug}/risk-assessment`,
    },
    {
      id: "comments",
      label: labels.kpiComments,
      value: String(comments.length),
      hint: labels.hintComments,
    },
    {
      id: "team",
      label: labels.kpiTeam,
      value: String(engagement.memberCount),
      hint: labels.hintTeam,
      href: `${base}/team`,
    },
  ];

  const checklistItems = plan.checklist.map((item) => ({
    id: item.id,
    label:
      planningLabels.checklist.items[item.key as keyof typeof planningLabels.checklist.items] ??
      item.key,
    completed: item.completed,
    href: `${base}/checklist`,
  }));

  const documents = plan.documents.slice(0, 6).map((doc) => ({
    id: doc.id,
    name: doc.name,
    documentType:
      planningLabels.documents.documentTypes[
        doc.documentType as keyof typeof planningLabels.documents.documentTypes
      ] ?? doc.documentType,
    status:
      planningLabels.documents.statuses[
        doc.status === "uploaded" ? "uploaded" : "pending"
      ] ?? doc.status,
    time: formatRelativeTime(locale, doc.createdAt),
    href: `${base}/documents`,
  }));

  const timeline = plan.timeline.map((milestone) => ({
    id: milestone.id,
    label:
      planningLabels.timeline.milestones[
        milestone.key as keyof typeof planningLabels.timeline.milestones
      ] ?? milestone.key,
    startDate: formatDate(locale, milestone.startDate),
    endDate: formatDate(locale, milestone.endDate),
    href: `${base}/timeline`,
  }));

  const now = Date.now();
  let upcomingDeadline: string | null = null;
  let deadlineLabel: string | null = null;
  let isOverdue = false;

  for (const milestone of plan.timeline) {
    if (!milestone.endDate) continue;
    const endMs = new Date(milestone.endDate).getTime();
    if (!upcomingDeadline || endMs < new Date(upcomingDeadline).getTime()) {
      upcomingDeadline = milestone.endDate;
      deadlineLabel = formatDate(locale, milestone.endDate);
      isOverdue = endMs < now;
    }
  }

  if (!upcomingDeadline && engagement.plannedEnd) {
    upcomingDeadline = engagement.plannedEnd;
    deadlineLabel = formatDate(locale, engagement.plannedEnd);
    isOverdue = new Date(engagement.plannedEnd).getTime() < now;
  }

  const mapActivity = activity.entries.map((entry) => ({
    id: entry.id,
    title: formatPlanningActivityAction(entry.action, planningLabels.history.actions),
    description: entry.summary ?? entry.action,
    time: formatRelativeTime(locale, entry.createdAt),
  }));

  const recentChanges = mapActivity
    .filter((_, index) => {
      const entry = activity.entries[index];
      return entry.action.includes("updated") || entry.action.includes("submitted") || entry.action.includes("approved");
    })
    .slice(0, 6);

  const commentRows = comments.slice(0, 6).map((comment) => ({
    id: comment.id,
    body: comment.body.trim().slice(0, 140),
    type:
      planningLabels.comments.types[
        comment.commentType as keyof typeof planningLabels.comments.types
      ] ?? comment.commentType,
    time: formatRelativeTime(locale, comment.createdAt),
  }));

  return {
    executive,
    planningHealth,
    planningMetrics,
    workflowSteps,
    currentWorkflowStep,
    openChecklistCount,
    checklistItems,
    documents,
    notesPreview: plan.planningNotes?.trim().slice(0, 200) ?? null,
    hasNotes: Boolean(plan.planningNotes?.trim()),
    timeline,
    upcomingDeadline,
    deadlineLabel,
    isOverdue,
    reviewQueueCount,
    approvalStatus: planningLabels.statuses[plan.planningStatus],
    approvalVariant,
    recentActivity: mapActivity.slice(0, 6),
    activityFeed: mapActivity.slice(0, 12),
    recentChanges,
    comments: commentRows,
    team: engagement.members.map((member) => ({
      id: member.id,
      displayName: member.displayName,
      role: member.memberRole.replace(/_/g, " "),
    })),
    outstandingTasks: checklistItems.filter((item) => !item.completed).slice(0, 6),
    estimatedHours: plan.teamPlanning.estimatedHours ?? null,
  };
}
