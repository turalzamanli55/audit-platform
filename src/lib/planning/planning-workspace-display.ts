import type { PlanningStatus } from "@/types/planning";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { PlanningWorkspaceView, PlanningWorkspaceSection } from "@/lib/planning/planning-workspace-view";
import type { PlanningWorkspaceNavItem } from "@/components/planning/workspace/planning-workspace-sidebar";
import { formatOptionalText } from "@/lib/engagement/format-engagement-workspace";

export type PlanningWorkspaceLabels = Dictionary["planning"]["workspace"];

const PLANNING_STATUS_PROGRESS: Record<PlanningStatus, number> = {
  not_started: 0,
  in_progress: 25,
  pending_review: 60,
  returned: 40,
  approved: 100,
  superseded: 100,
};

export function computePlanningProgress(status: PlanningStatus): number {
  return PLANNING_STATUS_PROGRESS[status] ?? 0;
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
