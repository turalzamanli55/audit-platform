import "server-only";

import type { Locale } from "@/i18n";
import type {
  DashboardWorkspaceActivityItem,
  DashboardWorkspaceLabels,
  DashboardWorkspaceTaskItem,
} from "@/i18n/dashboard-workspace-types";
import { AUDIT_ACTIONS } from "@/lib/audit/constants";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { createServerClient } from "@/lib/supabase/server";
import type { EngagementListItem } from "@/lib/engagement/engagement-list-item";
import type { FieldworkDashboardMetrics } from "@/lib/fieldwork/load-fieldwork-dashboard-metrics";
import type { MaterialityDashboardMetrics } from "@/lib/materiality/load-materiality-dashboard-metrics";
import type { RiskAssessmentDashboardMetrics } from "@/lib/risk-assessment/load-risk-assessment-dashboard-metrics";
import { unwrapSupabaseList } from "@/utils/supabase-result";

export type DashboardEngagementPreview = {
  id: string;
  slug: string;
  name: string;
  companyName: string;
  plannedEnd: string | null;
};

export type DashboardPlanningMetrics = {
  inProgress: number;
  pendingReview: number;
  approved: number;
};

export type DashboardFeed = {
  activity: DashboardWorkspaceActivityItem[];
  tasks: DashboardWorkspaceTaskItem[];
  insights: DashboardWorkspaceLabels["insights"]["metrics"];
  recentEngagements: DashboardEngagementPreview[];
  calendarItems: DashboardWorkspaceLabels["calendar"]["items"];
  planningMetrics: DashboardPlanningMetrics | null;
  pendingReviews: number;
  openFindings: number;
};

type AuditLogRow = {
  id: string;
  action: string;
  created_at: string;
  metadata: unknown;
};

function parseMetadata(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function formatRelativeTime(locale: Locale, createdAt: string): string {
  const date = new Date(createdAt);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60_000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, "day");
  }

  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date);
}

function resolveActivityTone(action: string): DashboardWorkspaceActivityItem["tone"] {
  if (
    action.includes("created") ||
    action.includes("approved") ||
    action.includes("cleared") ||
    action.includes("restored")
  ) {
    return "success";
  }
  if (
    action.includes("submitted") ||
    action.includes("updated") ||
    action.includes("assigned") ||
    action.includes("added")
  ) {
    return "info";
  }
  return "default";
}

function resolveActivityTitle(
  action: string,
  actionLabels: Record<string, string>,
): string {
  return actionLabels[action] ?? actionLabels.default ?? action;
}

function resolveActivityDescription(
  action: string,
  metadata: Record<string, unknown>,
  descriptions: DashboardWorkspaceLabels["activity"]["descriptions"],
): string {
  const name =
    (typeof metadata.name === "string" && metadata.name) ||
    (typeof metadata.engagementName === "string" && metadata.engagementName) ||
    (typeof metadata.companyName === "string" && metadata.companyName) ||
    null;

  if (name) {
    return descriptions.withName.replace("{name}", name);
  }

  if (action.startsWith("company.")) return descriptions.company;
  if (action.startsWith("engagement.")) return descriptions.engagement;
  if (action.startsWith("planning.")) return descriptions.planning;
  if (action.startsWith("fieldwork.")) return descriptions.fieldwork;
  if (action.startsWith("risk_assessment.")) return descriptions.riskAssessment;
  if (action.startsWith("materiality.")) return descriptions.materiality;
  return descriptions.generic;
}

async function loadWorkspaceAuditActivity(
  locale: Locale,
  labels: DashboardWorkspaceLabels["activity"],
  workspaceId: string,
): Promise<DashboardWorkspaceActivityItem[]> {
  const supabase = await createServerClient();
  const result = await supabase
    .from("audit_logs")
    .select("id, action, created_at, metadata")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(12);

  const rows = unwrapSupabaseList(result) as AuditLogRow[];

  return rows.map((row) => {
    const metadata = parseMetadata(row.metadata);
    return {
      id: row.id,
      title: resolveActivityTitle(row.action, labels.actions),
      description: resolveActivityDescription(row.action, metadata, labels.descriptions),
      time: formatRelativeTime(locale, row.created_at),
      tone: resolveActivityTone(row.action),
    };
  });
}

async function loadPlanningMetrics(
  workspaceId: string,
  organizationId: string,
): Promise<DashboardPlanningMetrics | null> {
  const supabase = await createServerClient();
  const result = await supabase
    .from("audit_plans")
    .select("planning_status")
    .eq("workspace_id", workspaceId)
    .eq("organization_id", organizationId)
    .is("deleted_at", null);

  const rows = unwrapSupabaseList(result) as Array<{ planning_status: string }>;
  if (rows.length === 0) return null;

  return rows.reduce<DashboardPlanningMetrics>(
    (acc, row) => {
      if (row.planning_status === "approved") acc.approved += 1;
      else if (["submitted", "under_review"].includes(row.planning_status)) acc.pendingReview += 1;
      else if (row.planning_status !== "archived") acc.inProgress += 1;
      return acc;
    },
    { inProgress: 0, pendingReview: 0, approved: 0 },
  );
}

function buildTaskItems(
  labels: DashboardWorkspaceLabels["tasks"],
  fieldworkMetrics: FieldworkDashboardMetrics | null,
  riskMetrics: RiskAssessmentDashboardMetrics | null,
  materialityMetrics: MaterialityDashboardMetrics | null,
): DashboardWorkspaceTaskItem[] {
  const items: DashboardWorkspaceTaskItem[] = [];
  let index = 0;

  if (fieldworkMetrics && fieldworkMetrics.pendingReview > 0) {
    items.push({
      id: `fw-review-${index++}`,
      title: labels.reviewFieldwork.replace("{count}", String(fieldworkMetrics.pendingReview)),
      status: labels.statusOpen,
      priority: labels.priorityHigh,
      due: labels.dueSoon,
      statusVariant: "warning",
      priorityVariant: "destructive",
    });
  }

  if (fieldworkMetrics && fieldworkMetrics.assignedToMe > 0) {
    items.push({
      id: `fw-assigned-${index++}`,
      title: labels.assignedProcedures.replace("{count}", String(fieldworkMetrics.assignedToMe)),
      status: labels.statusInProgress,
      priority: labels.priorityMedium,
      due: labels.dueSoon,
      statusVariant: "warning",
      priorityVariant: "warning",
    });
  }

  if (fieldworkMetrics && fieldworkMetrics.openFindings > 0) {
    items.push({
      id: `fw-findings-${index++}`,
      title: labels.openFindings.replace("{count}", String(fieldworkMetrics.openFindings)),
      status: labels.statusOpen,
      priority: labels.priorityHigh,
      due: labels.dueSoon,
      statusVariant: "default",
      priorityVariant: "destructive",
    });
  }

  if (riskMetrics && riskMetrics.pendingReview > 0) {
    items.push({
      id: `risk-review-${index++}`,
      title: labels.reviewRisk.replace("{count}", String(riskMetrics.pendingReview)),
      status: labels.statusOpen,
      priority: labels.priorityHigh,
      due: labels.dueSoon,
      statusVariant: "warning",
      priorityVariant: "destructive",
    });
  }

  if (riskMetrics && riskMetrics.openItems > 0) {
    items.push({
      id: `risk-open-${index++}`,
      title: labels.openRiskItems.replace("{count}", String(riskMetrics.openItems)),
      status: labels.statusInProgress,
      priority: labels.priorityMedium,
      due: labels.dueSoon,
      statusVariant: "default",
      priorityVariant: "warning",
    });
  }

  if (materialityMetrics && materialityMetrics.pendingReview > 0) {
    items.push({
      id: `mat-review-${index++}`,
      title: labels.reviewMateriality.replace("{count}", String(materialityMetrics.pendingReview)),
      status: labels.statusOpen,
      priority: labels.priorityHigh,
      due: labels.dueSoon,
      statusVariant: "warning",
      priorityVariant: "destructive",
    });
  }

  if (materialityMetrics && materialityMetrics.draftPackages > 0) {
    items.push({
      id: `mat-draft-${index++}`,
      title: labels.draftMateriality.replace("{count}", String(materialityMetrics.draftPackages)),
      status: labels.statusInProgress,
      priority: labels.priorityMedium,
      due: labels.dueSoon,
      statusVariant: "default",
      priorityVariant: "warning",
    });
  }

  return items.slice(0, 8);
}

function buildInsightsMetrics(
  labels: DashboardWorkspaceLabels["insights"],
  companyCount: number,
  engagementCount: number,
  fieldworkMetrics: FieldworkDashboardMetrics | null,
  riskMetrics: RiskAssessmentDashboardMetrics | null,
  materialityMetrics: MaterialityDashboardMetrics | null,
  planningMetrics: DashboardPlanningMetrics | null,
): DashboardWorkspaceLabels["insights"]["metrics"] {
  const pendingReviews =
    (fieldworkMetrics?.pendingReview ?? 0) +
    (riskMetrics?.pendingReview ?? 0) +
    (materialityMetrics?.pendingReview ?? 0);
  const openFindings = fieldworkMetrics?.openFindings ?? 0;
  const significantRisks = riskMetrics?.significantRiskCount ?? 0;
  const planningActive = planningMetrics
    ? planningMetrics.inProgress + planningMetrics.pendingReview
    : 0;

  return [
    {
      id: "companies",
      label: labels.metricCompanies,
      value: companyCount > 0 ? String(companyCount) : "—",
      trend: labels.trendActive,
    },
    {
      id: "engagements",
      label: labels.metricEngagements,
      value: engagementCount > 0 ? String(engagementCount) : "—",
      trend: labels.trendActive,
    },
    {
      id: "reviews",
      label: labels.metricReviews,
      value: pendingReviews > 0 ? String(pendingReviews) : "—",
      trend: pendingReviews > 0 ? labels.trendAttention : labels.trendClear,
    },
    {
      id: "planning",
      label: labels.metricPlanning,
      value: planningActive > 0 ? String(planningActive) : "—",
      trend: planningMetrics?.approved
        ? labels.trendApproved.replace("{count}", String(planningMetrics.approved))
        : labels.trendActive,
    },
    {
      id: "findings",
      label: labels.metricFindings,
      value: openFindings > 0 ? String(openFindings) : "—",
      trend: openFindings > 0 ? labels.trendAttention : labels.trendClear,
    },
    {
      id: "risks",
      label: labels.metricSignificantRisks,
      value: significantRisks > 0 ? String(significantRisks) : "—",
      trend: significantRisks > 0 ? labels.trendAttention : labels.trendClear,
    },
    {
      id: "materiality",
      label: labels.metricMateriality,
      value:
        materialityMetrics && materialityMetrics.approvedPackages > 0
          ? String(materialityMetrics.approvedPackages)
          : materialityMetrics && materialityMetrics.draftPackages > 0
            ? String(materialityMetrics.draftPackages)
            : "—",
      trend:
        materialityMetrics && materialityMetrics.pendingReview > 0
          ? labels.trendAttention
          : materialityMetrics && materialityMetrics.approvedPackages > 0
            ? labels.trendApproved.replace(
                "{count}",
                String(materialityMetrics.approvedPackages),
              )
            : labels.trendClear,
    },
  ];
}

function buildCalendarItems(
  locale: Locale,
  labels: DashboardWorkspaceLabels["calendar"],
  engagements: EngagementListItem[],
): DashboardWorkspaceLabels["calendar"]["items"] {
  const now = Date.now();
  const upcoming = engagements
    .filter((item) => item.periodEnd && !item.isArchived)
    .map((item) => ({
      item,
      end: new Date(item.periodEnd as string).getTime(),
    }))
    .filter((entry) => entry.end >= now - 86_400_000)
    .sort((a, b) => a.end - b.end)
    .slice(0, 5);

  return upcoming.map(({ item, end }) => ({
    id: item.id,
    title: labels.itemTitle
      .replace("{engagement}", item.name)
      .replace("{company}", item.companyName),
    date: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(end)),
    tone: end - now < 7 * 86_400_000 ? ("warning" as const) : ("default" as const),
  }));
}

function buildRecentEngagements(engagements: EngagementListItem[]): DashboardEngagementPreview[] {
  return [...engagements]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      companyName: item.companyName,
      lifecycleStatus: item.lifecycleStatus,
      plannedEnd: item.periodEnd,
    }));
}

export async function loadDashboardFeed(input: {
  locale: Locale;
  labels: DashboardWorkspaceLabels;
  companyCount: number;
  engagements: EngagementListItem[];
  fieldworkMetrics: FieldworkDashboardMetrics | null;
  riskMetrics: RiskAssessmentDashboardMetrics | null;
  materialityMetrics: MaterialityDashboardMetrics | null;
}): Promise<DashboardFeed> {
  const { locale, labels, companyCount, engagements, fieldworkMetrics, riskMetrics, materialityMetrics } =
    input;

  const user = await getCurrentUser();
  const workspace = await getWorkspaceContext();

  const activity =
    workspace.isResolved && workspace.workspaceId
      ? await loadWorkspaceAuditActivity(locale, labels.activity, workspace.workspaceId)
      : [];

  const planningMetrics =
    workspace.isResolved && workspace.workspaceId && user?.organizationId
      ? await loadPlanningMetrics(workspace.workspaceId, user.organizationId)
      : null;

  const pendingReviews =
    (fieldworkMetrics?.pendingReview ?? 0) +
    (riskMetrics?.pendingReview ?? 0) +
    (materialityMetrics?.pendingReview ?? 0);
  const openFindings = fieldworkMetrics?.openFindings ?? 0;

  return {
    activity,
    tasks: buildTaskItems(labels.tasks, fieldworkMetrics, riskMetrics, materialityMetrics),
    insights: buildInsightsMetrics(
      labels.insights,
      companyCount,
      engagements.length,
      fieldworkMetrics,
      riskMetrics,
      materialityMetrics,
      planningMetrics,
    ),
    recentEngagements: buildRecentEngagements(engagements),
    calendarItems: buildCalendarItems(locale, labels.calendar, engagements),
    planningMetrics,
    pendingReviews,
    openFindings,
  };
}

export const DASHBOARD_AUDIT_ACTION_KEYS = Object.values(AUDIT_ACTIONS);
