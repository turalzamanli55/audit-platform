import type { PlanningStatus } from "@/types/planning";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { PlanningWorkspaceView, PlanningWorkspaceSection } from "@/lib/planning/planning-workspace-view";
import type { PlanningWorkspaceNavGroup, PlanningWorkspaceNavItem } from "@/components/planning/workspace/planning-workspace-sidebar";
import { PLANNING_ACTIVITY_ACTIONS } from "@/constants/planning";
import { formatOptionalText } from "@/lib/engagement/format-engagement-workspace";

export type PlanningWorkspaceLabels = Dictionary["planning"]["workspace"];

export function computePlanningProgress(
  planOrStatus: PlanningWorkspaceView | PlanningStatus,
): number {
  if (typeof planOrStatus === "string") {
    const statusProgress: Record<PlanningStatus, number> = {
      not_started: 0,
      in_progress: 25,
      pending_review: 60,
      returned: 40,
      approved: 100,
      superseded: 100,
    };
    return statusProgress[planOrStatus] ?? 0;
  }
  return planOrStatus.kpiProgress;
}

export function buildPlanningWorkspaceNavItems(
  locale: string,
  engagementSlug: string,
  labels: PlanningWorkspaceLabels,
): PlanningWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/planning`;

  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "strategy", label: labels.navStrategy, href: `${base}/strategy` },
    { id: "objectives", label: labels.navObjectives, href: `${base}/objectives` },
    { id: "scope", label: labels.navScope, href: `${base}/scope` },
    { id: "framework", label: labels.navFramework, href: `${base}/framework` },
    { id: "materiality", label: labels.navMateriality, href: `${base}/materiality` },
    { id: "risk", label: labels.navRisk, href: `${base}/risk` },
    { id: "team", label: labels.navTeam, href: `${base}/team` },
    { id: "timeline", label: labels.navTimeline, href: `${base}/timeline` },
    { id: "notes", label: labels.navNotes, href: `${base}/notes` },
    { id: "checklist", label: labels.navChecklist, href: `${base}/checklist` },
    { id: "documents", label: labels.navDocuments, href: `${base}/documents` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildPlanningWorkspaceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: PlanningWorkspaceLabels,
): PlanningWorkspaceNavGroup[] {
  const items = buildPlanningWorkspaceNavItems(locale, engagementSlug, labels);
  const byId = (id: PlanningWorkspaceSection) => items.find((item) => item.id === id)!;

  const contentIds = ["overview", "strategy", "objectives", "scope", "framework"] as const;
  const integrationIds = ["materiality", "risk"] as const;
  const executionIds = ["team", "timeline", "notes", "checklist", "documents"] as const;
  const adminIds = ["history", "settings"] as const;

  return [
    {
      id: "content",
      label: labels.navGroups.content,
      items: contentIds.map(byId),
    },
    {
      id: "integrations",
      label: labels.navGroups.integrations,
      items: integrationIds.map(byId),
    },
    {
      id: "execution",
      label: labels.navGroups.execution,
      items: executionIds.map(byId),
    },
    {
      id: "admin",
      label: labels.navGroups.admin,
      items: adminIds.map(byId),
    },
  ];
}

export function workspaceSectionTitle(
  section: PlanningWorkspaceSection,
  labels: PlanningWorkspaceLabels,
): string {
  return labels.sections[section]?.title ?? section;
}

export function workspaceSectionDescription(
  section: PlanningWorkspaceSection,
  labels: PlanningWorkspaceLabels,
): string | undefined {
  return labels.sections[section]?.description;
}

export function buildPlanningStatusItems(
  plan: PlanningWorkspaceView,
  labels: PlanningWorkspaceLabels,
  planningLabels: Dictionary["planning"],
) {
  return [
    {
      id: "status",
      label: labels.status.planningStatus,
      value: planningLabels.statuses[plan.planningStatus],
    },
    {
      id: "version",
      label: labels.status.planVersion,
      value: String(plan.planVersion),
    },
    {
      id: "checklist",
      label: labels.status.checklistProgress,
      value: `${plan.checklistProgress}%`,
    },
    {
      id: "kpi",
      label: labels.status.kpiProgress,
      value: `${plan.kpiProgress}%`,
    },
    {
      id: "materiality",
      label: labels.status.materiality,
      value: planningLabels.integrationStatuses[plan.materialityStatus],
    },
    {
      id: "risk",
      label: labels.status.risk,
      value: planningLabels.integrationStatuses[plan.riskStatus],
    },
  ];
}

export function buildPlanningOverviewCards(
  plan: PlanningWorkspaceView,
  labels: PlanningWorkspaceLabels,
  planningLabels: Dictionary["planning"],
) {
  return [
    {
      id: "status",
      label: labels.summaryStatus,
      value: planningLabels.statuses[plan.planningStatus],
      hint: `${labels.summaryVersion}: ${plan.planVersion}`,
    },
    {
      id: "framework",
      label: labels.summaryFramework,
      value: formatOptionalText(plan.financialReportingFramework),
    },
    {
      id: "checklist",
      label: labels.summaryChecklist,
      value: `${plan.checklistProgress}%`,
    },
    {
      id: "integration",
      label: labels.summaryIntegration,
      value: `${planningLabels.integrationStatuses[plan.materialityStatus]} · ${planningLabels.integrationStatuses[plan.riskStatus]}`,
    },
  ];
}

export function formatPlanningActivityAction(
  action: string,
  actionLabels: Dictionary["planning"]["history"]["actions"],
): string {
  const map: Record<string, string> = {
    [PLANNING_ACTIVITY_ACTIONS.CREATED]: actionLabels.created,
    [PLANNING_ACTIVITY_ACTIONS.UPDATED]: actionLabels.updated,
    [PLANNING_ACTIVITY_ACTIONS.STATUS_CHANGED]: actionLabels.statusChanged,
    [PLANNING_ACTIVITY_ACTIONS.ARCHIVED]: actionLabels.archived,
    [PLANNING_ACTIVITY_ACTIONS.RESTORED]: actionLabels.restored,
    [PLANNING_ACTIVITY_ACTIONS.CHECKLIST_UPDATED]: actionLabels.checklistUpdated,
    [PLANNING_ACTIVITY_ACTIONS.TIMELINE_UPDATED]: actionLabels.timelineUpdated,
    [PLANNING_ACTIVITY_ACTIONS.SUBMITTED]: actionLabels.submitted,
    [PLANNING_ACTIVITY_ACTIONS.RETURNED]: actionLabels.returned,
    [PLANNING_ACTIVITY_ACTIONS.APPROVED]: actionLabels.approved,
    [PLANNING_ACTIVITY_ACTIONS.REVISED]: actionLabels.revised,
    [PLANNING_ACTIVITY_ACTIONS.COMMENT_ADDED]: actionLabels.commentAdded,
    [PLANNING_ACTIVITY_ACTIONS.DOCUMENT_ADDED]: actionLabels.documentAdded,
    [PLANNING_ACTIVITY_ACTIONS.DOCUMENT_REMOVED]: actionLabels.documentRemoved,
  };

  return map[action] ?? action;
}
