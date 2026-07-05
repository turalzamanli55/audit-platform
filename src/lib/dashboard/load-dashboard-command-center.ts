import "server-only";

import type { Locale } from "@/i18n";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import type {
  DashboardActivityRow,
  DashboardApprovalRow,
  DashboardCommandCenterData,
  DashboardCommentRow,
  DashboardEngagementRow,
} from "@/types/dashboard-command-center";
import { createServerClient } from "@/lib/supabase/server";
import { unwrapSupabaseList } from "@/utils/supabase-result";
import type { EngagementListItem } from "@/lib/engagement/engagement-list-item";
import type { FieldworkDashboardMetrics } from "@/lib/fieldwork/load-fieldwork-dashboard-metrics";
import type { MaterialityDashboardMetrics } from "@/lib/materiality/load-materiality-dashboard-metrics";
import type { RiskAssessmentDashboardMetrics } from "@/lib/risk-assessment/load-risk-assessment-dashboard-metrics";
import type { ReviewDashboardMetrics } from "@/lib/review/load-review-dashboard-metrics";
import type { DashboardPlanningMetrics } from "./load-dashboard-feed";
import type { DashboardWorkspaceActivityItem } from "@/i18n/dashboard-workspace-types";

type AuditLogRow = {
  id: string;
  action: string;
  created_at: string;
  user_id: string | null;
  metadata: unknown;
};

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

function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function engagementMap(engagements: EngagementListItem[]) {
  return new Map(engagements.map((e) => [e.id, e]));
}

function buildEngagementRows(
  locale: Locale,
  engagements: EngagementListItem[],
  filter: (e: EngagementListItem) => boolean,
): DashboardEngagementRow[] {
  const now = Date.now();
  return engagements
    .filter(filter)
    .slice(0, 6)
    .map((e) => {
      const isOverdue = e.periodEnd ? new Date(e.periodEnd).getTime() < now : false;
      const daysOverdue =
        isOverdue && e.periodEnd
          ? Math.max(1, Math.ceil((now - new Date(e.periodEnd).getTime()) / 86_400_000))
          : undefined;
      return {
        id: e.id,
        slug: e.slug,
        name: e.name,
        companyName: e.companyName,
        lifecycleStatus: e.lifecycleStatus,
        periodEnd: e.periodEnd,
        href: `/${locale}/app/engagements/${e.slug}`,
        isOverdue,
        daysOverdue,
      };
    });
}

async function loadRecentComments(
  locale: Locale,
  workspaceId: string,
  engagementById: Map<string, EngagementListItem>,
  labels: DashboardWorkspaceLabels["commandCenter"],
): Promise<DashboardCommentRow[]> {
  const supabase = await createServerClient();
  const items: DashboardCommentRow[] = [];

  const [matResult, riskResult] = await Promise.all([
    supabase
      .from("materiality_comments")
      .select("id, body, created_at, engagement_id")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("risk_notes")
      .select("id, body, created_at, engagement_id")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  for (const row of (matResult.data ?? []) as Array<{
    id: string;
    body: string;
    created_at: string;
    engagement_id: string;
  }>) {
    const eng = engagementById.get(row.engagement_id);
    if (!eng) continue;
    items.push({
      id: row.id,
      module: labels.moduleMateriality,
      body: row.body.trim().slice(0, 120),
      createdAt: row.created_at,
      time: formatRelativeTime(locale, row.created_at),
      href: `/${locale}/app/engagements/${eng.slug}/materiality/comments`,
    });
  }

  for (const row of (riskResult.data ?? []) as Array<{
    id: string;
    body: string;
    created_at: string;
    engagement_id: string;
  }>) {
    const eng = engagementById.get(row.engagement_id);
    if (!eng) continue;
    items.push({
      id: row.id,
      module: labels.moduleRisk,
      body: row.body.trim().slice(0, 120),
      createdAt: row.created_at,
      time: formatRelativeTime(locale, row.created_at),
      href: `/${locale}/app/engagements/${eng.slug}/risk-assessment/comments`,
    });
  }

  return items
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);
}

async function loadPendingApprovals(
  locale: Locale,
  workspaceId: string,
  engagementById: Map<string, EngagementListItem>,
  labels: DashboardWorkspaceLabels["commandCenter"],
): Promise<DashboardApprovalRow[]> {
  const supabase = await createServerClient();
  const items: DashboardApprovalRow[] = [];

  const [plans, materiality, risks] = await Promise.all([
    supabase
      .from("audit_plans")
      .select("id, planning_status, engagement_id")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .eq("planning_status", "pending_review"),
    supabase
      .from("materiality_packages")
      .select("id, package_status, engagement_id")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .in("package_status", ["submitted", "under_review"]),
    supabase
      .from("risk_assessments")
      .select("id, assessment_status, engagement_id")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .in("assessment_status", ["submitted", "under_review"]),
  ]);

  for (const row of (plans.data ?? []) as Array<{
    id: string;
    planning_status: string;
    engagement_id: string;
  }>) {
    const eng = engagementById.get(row.engagement_id);
    if (!eng) continue;
    items.push({
      id: `plan-${row.id}`,
      module: labels.modulePlanning,
      label: labels.approvalPlanning.replace("{engagement}", eng.name),
      status: row.planning_status,
      href: `/${locale}/app/engagements/${eng.slug}/planning`,
    });
  }

  for (const row of (materiality.data ?? []) as Array<{
    id: string;
    package_status: string;
    engagement_id: string;
  }>) {
    const eng = engagementById.get(row.engagement_id);
    if (!eng) continue;
    items.push({
      id: `mat-${row.id}`,
      module: labels.moduleMateriality,
      label: labels.approvalMateriality.replace("{engagement}", eng.name),
      status: row.package_status,
      href: `/${locale}/app/engagements/${eng.slug}/materiality`,
    });
  }

  for (const row of (risks.data ?? []) as Array<{
    id: string;
    assessment_status: string;
    engagement_id: string;
  }>) {
    const eng = engagementById.get(row.engagement_id);
    if (!eng) continue;
    items.push({
      id: `risk-${row.id}`,
      module: labels.moduleRisk,
      label: labels.approvalRisk.replace("{engagement}", eng.name),
      status: row.assessment_status,
      href: `/${locale}/app/engagements/${eng.slug}/risk-assessment`,
    });
  }

  return items.slice(0, 8);
}

async function loadAuditTrail(
  locale: Locale,
  workspaceId: string,
  labels: DashboardWorkspaceLabels,
): Promise<DashboardActivityRow[]> {
  const supabase = await createServerClient();
  const result = await supabase
    .from("audit_logs")
    .select("id, action, created_at, user_id, metadata")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(20);

  const rows = unwrapSupabaseList(result) as AuditLogRow[];

  return rows.map((row) => {
    const metadata =
      typeof row.metadata === "object" && row.metadata !== null && !Array.isArray(row.metadata)
        ? (row.metadata as Record<string, unknown>)
        : {};
    const name =
      (typeof metadata.userName === "string" && metadata.userName) ||
      (typeof metadata.actorName === "string" && metadata.actorName) ||
      null;

    const title = labels.activity.actions[row.action] ?? labels.activity.actions.default ?? row.action;

    return {
      id: row.id,
      title,
      description: labels.activity.descriptions.generic,
      time: formatRelativeTime(locale, row.created_at),
      tone: row.action.includes("approved") || row.action.includes("created")
        ? "success"
        : row.action.includes("submitted") || row.action.includes("updated")
          ? "info"
          : "default",
      actor: name,
      isToday: isToday(row.created_at),
    };
  });
}

export async function loadDashboardCommandCenter(input: {
  locale: Locale;
  labels: DashboardWorkspaceLabels;
  companyCount: number;
  engagements: EngagementListItem[];
  fieldworkMetrics: FieldworkDashboardMetrics | null;
  riskMetrics: RiskAssessmentDashboardMetrics | null;
  materialityMetrics: MaterialityDashboardMetrics | null;
  reviewMetrics?: ReviewDashboardMetrics | null;
  planningMetrics: DashboardPlanningMetrics | null;
  activity: DashboardWorkspaceActivityItem[];
  workspaceId: string | null;
}): Promise<DashboardCommandCenterData> {
  const {
    locale,
    labels,
    companyCount,
    engagements,
    fieldworkMetrics,
    riskMetrics,
    materialityMetrics,
    planningMetrics,
    workspaceId,
  } = input;

  const cc = labels.commandCenter;
  const engagementById = engagementMap(engagements);
  const now = Date.now();

  const activeEngagements = engagements.filter(
    (e) => !e.isArchived && !["closed", "completed"].includes(e.lifecycleStatus),
  );
  const overdueEngagements = engagements.filter(
    (e) => e.periodEnd && new Date(e.periodEnd).getTime() < now && !e.isArchived,
  );

  const planningPending = planningMetrics?.pendingReview ?? 0;
  const materialityPending = materialityMetrics?.pendingReview ?? 0;
  const riskPending = riskMetrics?.pendingReview ?? 0;
  const fieldworkPending = fieldworkMetrics?.pendingReview ?? 0;

  const [auditTrail, recentComments, pendingApprovals] = workspaceId
    ? await Promise.all([
        loadAuditTrail(locale, workspaceId, labels),
        loadRecentComments(locale, workspaceId, engagementById, cc),
        loadPendingApprovals(locale, workspaceId, engagementById, cc),
      ])
    : [[], [], []];

  const todayActivity = auditTrail.filter((row) => row.isToday);

  const attention: DashboardCommandCenterData["attention"] = [];

  if (planningPending > 0) {
    attention.push({
      id: "planning-review",
      label: cc.attentionPlanning.replace("{count}", String(planningPending)),
      href: `/${locale}/app/engagements`,
      module: cc.modulePlanning,
      priority: "high",
    });
  }
  if (materialityPending > 0) {
    attention.push({
      id: "materiality-review",
      label: cc.attentionMateriality.replace("{count}", String(materialityPending)),
      href: `/${locale}/app/engagements`,
      module: cc.moduleMateriality,
      priority: "high",
    });
  }
  if (riskPending > 0) {
    attention.push({
      id: "risk-review",
      label: cc.attentionRisk.replace("{count}", String(riskPending)),
      href: `/${locale}/app/engagements`,
      module: cc.moduleRisk,
      priority: "high",
    });
  }
  if (fieldworkPending > 0) {
    attention.push({
      id: "fieldwork-review",
      label: cc.attentionFieldwork.replace("{count}", String(fieldworkPending)),
      href: `/${locale}/app/engagements`,
      module: cc.moduleFieldwork,
      priority: "high",
    });
  }
  if (overdueEngagements.length > 0) {
    attention.push({
      id: "overdue",
      label: cc.attentionOverdue.replace("{count}", String(overdueEngagements.length)),
      href: `/${locale}/app/engagements`,
      module: cc.moduleEngagements,
      priority: "high",
    });
  }
  if ((fieldworkMetrics?.openFindings ?? 0) > 0) {
    attention.push({
      id: "findings",
      label: cc.attentionFindings.replace("{count}", String(fieldworkMetrics!.openFindings)),
      href: `/${locale}/app/engagements`,
      module: cc.moduleFieldwork,
      priority: "medium",
    });
  }

  return {
    attention,
    attentionCount: attention.length,
    overdueCount: overdueEngagements.length,
    executive: [
      {
        id: "companies",
        label: cc.kpiCompanies,
        value: String(companyCount),
        hint: cc.hintCompanies,
        href: `/${locale}/app/companies`,
      },
      {
        id: "engagements",
        label: cc.kpiEngagements,
        value: String(engagements.length),
        hint: cc.hintEngagements,
        href: `/${locale}/app/engagements`,
      },
      {
        id: "active",
        label: cc.kpiActiveEngagements,
        value: String(activeEngagements.length),
        hint: cc.hintActive,
        href: `/${locale}/app/engagements`,
      },
      {
        id: "attention",
        label: cc.kpiRequiresAttention,
        value: String(attention.length),
        hint: cc.hintAttention,
        variant: attention.length > 0 ? "warning" : "success",
        href: attention.length > 0 ? `/${locale}/app/engagements` : undefined,
      },
    ],
    review: [
      {
        id: "planning-pending",
        label: cc.kpiPlanningReview,
        value: String(planningPending),
        hint: cc.hintPlanningReview,
        variant: planningPending > 0 ? "warning" : "default",
        href: `/${locale}/app/engagements`,
      },
      {
        id: "materiality-pending",
        label: cc.kpiMaterialityReview,
        value: String(materialityPending),
        hint: cc.hintMaterialityReview,
        variant: materialityPending > 0 ? "warning" : "default",
        href: `/${locale}/app/engagements`,
      },
      {
        id: "risk-pending",
        label: cc.kpiRiskReview,
        value: String(riskPending),
        hint: cc.hintRiskReview,
        variant: riskPending > 0 ? "warning" : "default",
        href: `/${locale}/app/engagements`,
      },
      {
        id: "fieldwork-pending",
        label: cc.kpiFieldworkReview,
        value: String(fieldworkPending),
        hint: cc.hintFieldworkReview,
        variant: fieldworkPending > 0 ? "warning" : "default",
        href: `/${locale}/app/engagements`,
      },
    ],
    operational: [
      {
        id: "assigned",
        label: cc.kpiAssignedToMe,
        value: String(fieldworkMetrics?.assignedToMe ?? 0),
        hint: cc.hintAssigned,
        href: `/${locale}/app/engagements`,
      },
      {
        id: "findings",
        label: cc.kpiOpenFindings,
        value: String(fieldworkMetrics?.openFindings ?? 0),
        hint: cc.hintFindings,
        variant: (fieldworkMetrics?.openFindings ?? 0) > 0 ? "destructive" : "default",
        href: `/${locale}/app/engagements`,
      },
      {
        id: "risk-open",
        label: cc.kpiOpenRiskItems,
        value: String(riskMetrics?.openItems ?? 0),
        hint: cc.hintRiskItems,
        href: `/${locale}/app/engagements`,
      },
      {
        id: "overdue",
        label: cc.kpiOverdue,
        value: String(overdueEngagements.length),
        hint: cc.hintOverdue,
        variant: overdueEngagements.length > 0 ? "destructive" : "default",
        href: `/${locale}/app/engagements`,
      },
    ],
    moduleHealth: [
      {
        id: "planning",
        label: cc.modulePlanning,
        pendingReview: planningPending,
        inProgress: planningMetrics?.inProgress ?? 0,
        approved: planningMetrics?.approved ?? 0,
        href: `/${locale}/app/engagements`,
      },
      {
        id: "materiality",
        label: cc.moduleMateriality,
        pendingReview: materialityPending,
        inProgress: materialityMetrics?.draftPackages ?? 0,
        approved: materialityMetrics?.approvedPackages ?? 0,
        href: `/${locale}/app/engagements`,
      },
      {
        id: "risk",
        label: cc.moduleRisk,
        pendingReview: riskPending,
        inProgress: riskMetrics?.openItems ?? 0,
        approved: 0,
        href: `/${locale}/app/engagements`,
      },
      {
        id: "fieldwork",
        label: cc.moduleFieldwork,
        pendingReview: fieldworkPending,
        inProgress: fieldworkMetrics?.assignedToMe ?? 0,
        approved: 0,
        href: `/${locale}/app/engagements`,
      },
    ],
    overdueEngagements: buildEngagementRows(locale, engagements, (e) =>
      Boolean(e.periodEnd && new Date(e.periodEnd).getTime() < now && !e.isArchived),
    ),
    activeEngagements: buildEngagementRows(
      locale,
      [...activeEngagements].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      () => true,
    ),
    todayActivity,
    auditTrail,
    recentComments,
    pendingApprovals,
  };
}
