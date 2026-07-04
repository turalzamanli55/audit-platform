import "server-only";

import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import { loadCompanyActivity } from "@/lib/company/load-company-activity";
import { loadEngagementList } from "@/lib/engagement/load-engagement-list";
import { AUDIT_ACTIONS } from "@/lib/audit/constants";
import { createServerClient } from "@/lib/supabase/server";
import { getWorkspaceContext } from "@/lib/auth/server";
import { resolveUserProfiles } from "@/lib/user/resolve-user-profiles";
import type { PlanningDocument } from "@/types/planning";
import type {
  CompanyActivityRow,
  CompanyCommentRow,
  CompanyDocumentRow,
  CompanyEngagementRow,
  CompanyModuleProgress,
  CompanyTeamMemberRow,
  CompanyWorkspaceCommandCenterData,
  CompanyWorkspaceKpi,
} from "@/types/company-workspace-command-center";
import { unwrapSupabaseList } from "@/utils/supabase-result";

type CommandCenterLabels = Dictionary["companies"]["workspace"]["commandCenter"];

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

function checklistProgress(checklist: unknown): number {
  if (!Array.isArray(checklist) || checklist.length === 0) return 0;
  const completed = checklist.filter(
    (item) => typeof item === "object" && item !== null && (item as { completed?: boolean }).completed,
  ).length;
  return Math.round((completed / checklist.length) * 100);
}

function statusProgress(status: string): number {
  switch (status) {
    case "approved":
      return 100;
    case "under_review":
    case "pending_review":
    case "submitted":
    case "submitted_for_review":
    case "review_in_progress":
      return 75;
    case "in_progress":
    case "returned":
      return 50;
    default:
      return 0;
  }
}

function buildEngagementRows(
  locale: Locale,
  engagements: Array<{
    id: string;
    slug: string;
    name: string;
    lifecycleStatus: string;
    periodEnd: string | null;
  }>,
  filter: (e: (typeof engagements)[number]) => boolean,
): CompanyEngagementRow[] {
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
        lifecycleStatus: e.lifecycleStatus,
        periodEnd: e.periodEnd,
        href: `/${locale}/app/engagements/${e.slug}`,
        isOverdue,
        daysOverdue,
      };
    });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export async function loadCompanyWorkspaceCommandCenter(
  locale: Locale,
  company: CompanyWorkspaceView,
  labels: CommandCenterLabels,
  companiesLabels: Dictionary["companies"],
): Promise<CompanyWorkspaceCommandCenterData> {
  const engagementResult = await loadEngagementList();
  const companyEngagements =
    engagementResult.ok
      ? engagementResult.items.filter((item) => item.companyId === company.id && !item.isArchived)
      : [];

  const engagementIds = companyEngagements.map((e) => e.id);
  const engagementById = new Map(companyEngagements.map((e) => [e.id, e]));
  const now = Date.now();

  const activityResult = await loadCompanyActivity(company.id);
  const activityEntries = activityResult.ok ? activityResult.activity.entries : [];

  const workspace = await getWorkspaceContext();
  const workspaceId = workspace.workspaceId;

  let plans: Array<{
    id: string;
    engagement_id: string;
    planning_status: string;
    checklist: unknown;
    documents: unknown;
    updated_at: string;
  }> = [];
  let materiality: Array<{
    id: string;
    engagement_id: string;
    package_status: string;
    progress_pct: number | null;
  }> = [];
  let risks: Array<{
    id: string;
    engagement_id: string;
    assessment_status: string;
    progress_pct: number | null;
  }> = [];
  let fieldwork: Array<{
    id: string;
    engagement_id: string;
    package_status: string;
    progress_pct: number | null;
  }> = [];
  let procedures: Array<{ procedure_status: string }> = [];
  let findings: Array<{ finding_status: string }> = [];
  let matComments: Array<{ id: string; body: string; created_at: string; engagement_id: string }> = [];
  let riskNotes: Array<{ id: string; body: string; created_at: string; engagement_id: string }> = [];
  let members: Array<{ user_id: string; member_role: string; engagement_id: string }> = [];

  if (workspaceId && engagementIds.length > 0) {
    const supabase = await createServerClient();
    const [plansResult, matResult, riskResult, fwResult, membersResult, matCommentsResult, riskNotesResult] =
      await Promise.all([
        supabase
          .from("audit_plans")
          .select("id, engagement_id, planning_status, checklist, documents, updated_at")
          .eq("workspace_id", workspaceId)
          .in("engagement_id", engagementIds)
          .is("deleted_at", null),
        supabase
          .from("materiality_packages")
          .select("id, engagement_id, package_status, progress_pct")
          .eq("workspace_id", workspaceId)
          .in("engagement_id", engagementIds)
          .is("deleted_at", null),
        supabase
          .from("risk_assessments")
          .select("id, engagement_id, assessment_status, progress_pct")
          .eq("workspace_id", workspaceId)
          .in("engagement_id", engagementIds)
          .is("deleted_at", null),
        supabase
          .from("fieldwork_packages")
          .select("id, engagement_id, package_status, progress_pct")
          .eq("workspace_id", workspaceId)
          .in("engagement_id", engagementIds)
          .is("deleted_at", null),
        supabase
          .from("engagement_members")
          .select("user_id, member_role, engagement_id")
          .in("engagement_id", engagementIds)
          .is("deleted_at", null),
        supabase
          .from("materiality_comments")
          .select("id, body, created_at, engagement_id")
          .eq("workspace_id", workspaceId)
          .in("engagement_id", engagementIds)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("risk_notes")
          .select("id, body, created_at, engagement_id")
          .eq("workspace_id", workspaceId)
          .in("engagement_id", engagementIds)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    plans = unwrapSupabaseList(plansResult) as typeof plans;
    materiality = unwrapSupabaseList(matResult) as typeof materiality;
    risks = unwrapSupabaseList(riskResult) as typeof risks;
    fieldwork = unwrapSupabaseList(fwResult) as typeof fieldwork;
    members = unwrapSupabaseList(membersResult) as typeof members;
    matComments = (matCommentsResult.data ?? []) as typeof matComments;
    riskNotes = (riskNotesResult.data ?? []) as typeof riskNotes;

    const fwIds = fieldwork.map((pkg) => pkg.id);
    if (fwIds.length > 0) {
      const [procResult, findResult] = await Promise.all([
        supabase
          .from("audit_procedures")
          .select("procedure_status")
          .in("fieldwork_package_id", fwIds)
          .is("deleted_at", null),
        supabase
          .from("fieldwork_findings")
          .select("finding_status")
          .in("fieldwork_package_id", fwIds)
          .is("deleted_at", null),
      ]);
      procedures = unwrapSupabaseList(procResult) as typeof procedures;
      findings = unwrapSupabaseList(findResult) as typeof findings;
    }
  }

  const planningPending = plans.filter((p) => p.planning_status === "pending_review").length;
  const materialityPending = materiality.filter((p) =>
    ["submitted", "under_review"].includes(p.package_status),
  ).length;
  const riskPending = risks.filter((p) =>
    ["submitted", "under_review"].includes(p.assessment_status),
  ).length;
  const fieldworkPending = procedures.filter((p) =>
    ["submitted_for_review", "review_in_progress"].includes(p.procedure_status),
  ).length;
  const pendingReviews = planningPending + materialityPending + riskPending + fieldworkPending;
  const openFindings = findings.filter((f) => f.finding_status === "open").length;

  const activeEngagements = companyEngagements.filter(
    (e) => !["closed", "completed"].includes(e.lifecycleStatus),
  );
  const overdueEngagements = companyEngagements.filter(
    (e) => e.periodEnd && new Date(e.periodEnd).getTime() < now,
  );

  const primaryEngagement =
    [...companyEngagements].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;

  const planningProgressPct = average(
    plans.map((plan) => Math.max(checklistProgress(plan.checklist), statusProgress(plan.planning_status))),
  );
  const materialityProgressPct = average(
    materiality.map((pkg) => pkg.progress_pct ?? statusProgress(pkg.package_status)),
  );
  const riskProgressPct = average(
    risks.map((risk) => risk.progress_pct ?? statusProgress(risk.assessment_status)),
  );
  const fieldworkProgressPct = average(
    fieldwork.map((pkg) => pkg.progress_pct ?? statusProgress(pkg.package_status)),
  );

  const moduleProgress: CompanyModuleProgress[] = [
    {
      id: "planning",
      label: labels.modulePlanning,
      progressPct: planningProgressPct,
      statusLabel: planningPending > 0 ? labels.statusReview : plans.length > 0 ? labels.statusActive : labels.statusNotStarted,
      statusVariant: planningPending > 0 ? "warning" : plans.some((p) => p.planning_status === "approved") ? "success" : "default",
      pendingReview: planningPending,
      inProgress: plans.filter((p) => p.planning_status === "in_progress").length,
      approved: plans.filter((p) => p.planning_status === "approved").length,
      href: primaryEngagement ? `/${locale}/app/engagements/${primaryEngagement.slug}/planning` : undefined,
    },
    {
      id: "materiality",
      label: labels.moduleMateriality,
      progressPct: materialityProgressPct,
      statusLabel: materialityPending > 0 ? labels.statusReview : materiality.length > 0 ? labels.statusActive : labels.statusNotStarted,
      statusVariant: materialityPending > 0 ? "warning" : materiality.some((p) => p.package_status === "approved") ? "success" : "default",
      pendingReview: materialityPending,
      inProgress: materiality.filter((p) => p.package_status === "draft").length,
      approved: materiality.filter((p) => p.package_status === "approved").length,
      href: primaryEngagement ? `/${locale}/app/engagements/${primaryEngagement.slug}/materiality` : undefined,
    },
    {
      id: "risk",
      label: labels.moduleRisk,
      progressPct: riskProgressPct,
      statusLabel: riskPending > 0 ? labels.statusReview : risks.length > 0 ? labels.statusActive : labels.statusNotStarted,
      statusVariant: riskPending > 0 ? "warning" : risks.some((p) => p.assessment_status === "approved") ? "success" : "default",
      pendingReview: riskPending,
      inProgress: risks.filter((p) => p.assessment_status === "in_progress").length,
      approved: risks.filter((p) => p.assessment_status === "approved").length,
      href: primaryEngagement ? `/${locale}/app/engagements/${primaryEngagement.slug}/risk-assessment` : undefined,
    },
    {
      id: "fieldwork",
      label: labels.moduleFieldwork,
      progressPct: fieldworkProgressPct,
      statusLabel: fieldworkPending > 0 ? labels.statusReview : fieldwork.length > 0 ? labels.statusActive : labels.statusNotStarted,
      statusVariant: fieldworkPending > 0 ? "warning" : fieldwork.some((p) => p.package_status === "substantially_complete") ? "success" : "default",
      pendingReview: fieldworkPending,
      inProgress: procedures.filter((p) => p.procedure_status === "in_progress").length,
      approved: procedures.filter((p) =>
        ["review_cleared", "complete"].includes(p.procedure_status),
      ).length,
      href: primaryEngagement ? `/${locale}/app/engagements/${primaryEngagement.slug}/fieldwork` : undefined,
    },
  ];

  const attentionCount =
    pendingReviews + overdueEngagements.length + openFindings + (company.isArchived ? 1 : 0);

  const healthScore =
    attentionCount === 0
      ? labels.healthOnTrack
      : attentionCount <= 3
        ? labels.healthMonitor
        : labels.healthAttention;

  const health: CompanyWorkspaceKpi[] = [
    {
      id: "health",
      label: labels.kpiHealth,
      value: healthScore,
      hint: labels.hintHealth,
      variant: attentionCount === 0 ? "success" : attentionCount <= 3 ? "warning" : "destructive",
    },
    {
      id: "engagements",
      label: labels.kpiActiveEngagements,
      value: String(activeEngagements.length),
      hint: labels.hintEngagements,
      href: `/${locale}/app/engagements`,
    },
    {
      id: "reviews",
      label: labels.kpiPendingReviews,
      value: String(pendingReviews),
      hint: labels.hintReviews,
      variant: pendingReviews > 0 ? "warning" : "default",
    },
    {
      id: "findings",
      label: labels.kpiOpenFindings,
      value: String(openFindings),
      hint: labels.hintFindings,
      variant: openFindings > 0 ? "destructive" : "default",
    },
  ];

  const executive: CompanyWorkspaceKpi[] = [
    {
      id: "overdue",
      label: labels.kpiOverdue,
      value: String(overdueEngagements.length),
      hint: labels.hintOverdue,
      variant: overdueEngagements.length > 0 ? "destructive" : "default",
    },
    {
      id: "planning",
      label: labels.kpiPlanningProgress,
      value: `${planningProgressPct}%`,
      hint: labels.hintPlanning,
    },
    {
      id: "fieldwork",
      label: labels.kpiFieldworkProgress,
      value: `${fieldworkProgressPct}%`,
      hint: labels.hintFieldwork,
    },
    {
      id: "team",
      label: labels.kpiTeamMembers,
      value: String(new Set(members.map((m) => m.user_id)).size),
      hint: labels.hintTeam,
    },
  ];

  const actionLabels: Record<string, string> = {
    [AUDIT_ACTIONS.COMPANY_CREATED]: labels.activityCreated,
    [AUDIT_ACTIONS.COMPANY_UPDATED]: labels.activityUpdated,
    [AUDIT_ACTIONS.COMPANY_SETTINGS_UPDATED]: labels.activitySettings,
    [AUDIT_ACTIONS.COMPANY_ARCHIVED]: labels.activityArchived,
    [AUDIT_ACTIONS.COMPANY_RESTORED]: labels.activityRestored,
  };

  const recentActivity: CompanyActivityRow[] = activityEntries.slice(0, 10).map((entry) => ({
    id: entry.id,
    title: actionLabels[entry.action] ?? entry.action,
    description: labels.activityGeneric,
    time: formatRelativeTime(locale, entry.createdAt),
  }));

  const recentDocuments: CompanyDocumentRow[] = [];
  for (const plan of plans) {
    const eng = engagementById.get(plan.engagement_id);
    if (!eng || !Array.isArray(plan.documents)) continue;
    for (const doc of plan.documents as PlanningDocument[]) {
      if (!doc?.id || !doc?.name) continue;
      recentDocuments.push({
        id: `${plan.id}-${doc.id}`,
        name: doc.name,
        engagementName: eng.name,
        documentType: doc.documentType,
        createdAt: doc.createdAt,
        time: formatRelativeTime(locale, doc.createdAt),
        href: `/${locale}/app/engagements/${eng.slug}/planning/documents`,
      });
    }
  }
  recentDocuments.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const recentComments: CompanyCommentRow[] = [];
  for (const row of matComments) {
    const eng = engagementById.get(row.engagement_id);
    if (!eng) continue;
    recentComments.push({
      id: row.id,
      module: labels.moduleMateriality,
      body: row.body.trim().slice(0, 120),
      engagementName: eng.name,
      time: formatRelativeTime(locale, row.created_at),
      href: `/${locale}/app/engagements/${eng.slug}/materiality/comments`,
    });
  }
  for (const row of riskNotes) {
    const eng = engagementById.get(row.engagement_id);
    if (!eng) continue;
    recentComments.push({
      id: row.id,
      module: labels.moduleRisk,
      body: row.body.trim().slice(0, 120),
      engagementName: eng.name,
      time: formatRelativeTime(locale, row.created_at),
      href: `/${locale}/app/engagements/${eng.slug}/risk-assessment/comments`,
    });
  }
  recentComments.sort((a, b) => b.time.localeCompare(a.time));

  const memberProfiles = await resolveUserProfiles([...new Set(members.map((m) => m.user_id))]);
  const teamMap = new Map<string, CompanyTeamMemberRow>();
  for (const member of members) {
    const existing = teamMap.get(member.user_id);
    const profile = memberProfiles.get(member.user_id);
    if (existing) {
      existing.engagementCount += 1;
      continue;
    }
    teamMap.set(member.user_id, {
      id: member.user_id,
      displayName: profile?.displayName ?? member.user_id,
      role: member.member_role.replace(/_/g, " "),
      engagementCount: 1,
    });
  }
  const teamMembers = [...teamMap.values()]
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .slice(0, 8);

  const months = companiesLabels.create.months;
  const fiscalMonth = months[company.settings.fiscal_year_end_month - 1] ?? String(company.settings.fiscal_year_end_month);

  return {
    health,
    executive,
    moduleProgress,
    activeEngagements: buildEngagementRows(locale, companyEngagements, () => true),
    pendingReviews,
    openFindings,
    recentActivity,
    recentDocuments: recentDocuments.slice(0, 6),
    recentComments: recentComments.slice(0, 6),
    teamMembers,
    upcomingDeadlines: buildEngagementRows(
      locale,
      [...companyEngagements]
        .filter((e) => e.periodEnd && new Date(e.periodEnd).getTime() >= now)
        .sort((a, b) => (a.periodEnd ?? "").localeCompare(b.periodEnd ?? "")),
      () => true,
    ),
    compliance: {
      statusLabel: company.settings.validation?.validated_at
        ? labels.complianceValidated
        : labels.compliancePending,
      statusVariant: company.settings.validation?.validated_at ? "success" : "warning",
      framework: companiesLabels.create.frameworks[company.settings.reporting_framework],
      jurisdiction: company.settings.jurisdiction,
      validatedAt: company.settings.validation?.validated_at ?? null,
      activeEngagements: activeEngagements.length,
    },
    financial: {
      framework: companiesLabels.create.frameworks[company.settings.reporting_framework],
      functionalCurrency: company.settings.functional_currency,
      presentationCurrency: company.settings.presentation_currency ?? null,
      fiscalYearEnd: `${fiscalMonth} ${company.settings.fiscal_year_end_day}`,
      entityType: companiesLabels.create.entityTypes[company.settings.entity_type],
      industry: companiesLabels.create.industries[company.settings.industry_classification],
    },
    attentionCount,
    primaryEngagementSlug: primaryEngagement?.slug ?? null,
  };
}
