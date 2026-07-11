import "server-only";

import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import type { ReviewWorkspaceView } from "@/lib/review/review-workspace-view";
import type { CompletionWorkspaceView } from "@/lib/completion/completion-workspace-view";
import type { ReportingWorkspaceView } from "@/lib/reporting/reporting-workspace-view";
import { loadEngagementActivity } from "@/lib/engagement/load-engagement-activity";
import { loadCompanyWorkspacePage } from "@/lib/company/company-workspace-page";
import { resolveUserProfiles } from "@/lib/user/resolve-user-profiles";
import {
  buildEngagementAttentionItems,
  buildEngagementPhaseCards,
} from "@/components/engagement/workspace/engagement-phase-dashboard";
import type {
  EngagementActivityRow,
  EngagementCommandCenterData,
  EngagementCommandKpi,
  EngagementPipelinePhase,
} from "@/types/engagement-command-center";

type CommandCenterLabels = Dictionary["engagements"]["workspace"]["commandCenter"];

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

async function resolveOwnerName(userId: string | null | undefined): Promise<string | null> {
  if (!userId) return null;
  const profiles = await resolveUserProfiles([userId]);
  return profiles.get(userId)?.displayName ?? null;
}

export async function loadEngagementCommandCenter(input: {
  locale: Locale;
  engagement: EngagementWorkspaceView;
  plan: PlanningWorkspaceView | null;
  materiality: MaterialityWorkspaceView | null;
  riskAssessment: RiskAssessmentWorkspaceView | null;
  fieldwork: FieldworkWorkspaceView | null;
  review: ReviewWorkspaceView | null;
  completion: CompletionWorkspaceView | null;
  reporting: ReportingWorkspaceView | null;
  labels: CommandCenterLabels;
  workspaceLabels: Dictionary["engagements"]["workspace"];
  engagementsLabels: Dictionary["engagements"];
  planningLabels: Dictionary["planning"];
  materialityLabels: Dictionary["materiality"];
  riskLabels: Dictionary["riskAssessment"];
  fieldworkLabels: Dictionary["fieldwork"];
  reviewLabels: Dictionary["review"];
  completionLabels: Dictionary["completion"];
  reportingLabels: Dictionary["reporting"];
}): Promise<EngagementCommandCenterData> {
  const {
    locale,
    engagement,
    plan,
    materiality,
    riskAssessment,
    fieldwork,
    review,
    completion,
    reporting,
    labels,
    workspaceLabels,
    engagementsLabels,
    planningLabels,
    materialityLabels,
    riskLabels,
    fieldworkLabels,
    reviewLabels,
    completionLabels,
    reportingLabels,
  } = input;

  const base = `/${locale}/app/engagements/${engagement.slug}`;
  const activityResult = await loadEngagementActivity(engagement.id);
  const activityEntries = activityResult.ok ? activityResult.activity.entries : [];

  const companyResult = engagement.companySlug
    ? await loadCompanyWorkspacePage(engagement.companySlug)
    : null;
  const company = companyResult?.ok ? companyResult.company : null;

  const phaseCards = buildEngagementPhaseCards({
    locale,
    slug: engagement.slug,
    labels: {
      planning: workspaceLabels.planning,
      materiality: workspaceLabels.materiality,
      riskAssessment: workspaceLabels.riskAssessment,
      fieldwork: workspaceLabels.fieldwork,
      review: workspaceLabels.review,
      phaseEmpty: workspaceLabels.phaseEmpty,
    },
    planningLabels,
    materialityLabels,
    riskLabels,
    fieldworkLabels,
    reviewLabels,
    plan,
    materiality,
    riskAssessment,
    fieldwork,
    review,
  });

  const planOwner = await resolveOwnerName(plan?.approvedBy ?? plan?.submittedBy);

  const pendingReviews =
    review?.pendingCount ??
    ((plan?.planningStatus === "pending_review" ? 1 : 0) +
      (materiality?.pendingReviewCount ?? 0) +
      (riskAssessment?.pendingReviewCount ?? 0) +
      (fieldwork?.pendingReviewCount ?? 0));

  const openFindings = review?.openFindingsCount ?? fieldwork?.findings.filter((f) => f.findingStatus === "open").length ?? 0;

  const moduleProgress = phaseCards.map((c) => c.progressPct);
  const reviewProgress = review?.progressPct ?? (
    pendingReviews === 0
      ? fieldwork && ["substantially_complete", "in_progress"].includes(fieldwork.packageStatus)
        ? 100
        : 50
      : Math.max(0, 100 - pendingReviews * 25)
  );

  const completionProgress = completion?.progressPct ?? (
    review?.packageStatus === "approved" ? 25 : 0
  );
  const reportingProgress = reporting?.progressPct ?? (
    completion?.packageStatus === "approved" ? 25 : 0
  );

  const overallCompletionPct = Math.round(
    [...moduleProgress, reviewProgress, completionProgress, reportingProgress].reduce(
      (a, b) => a + b,
      0,
    ) /
      (moduleProgress.length + 3),
  );

  const pipeline: EngagementPipelinePhase[] = [
    ...phaseCards.map((card) => ({
      id: card.id,
      label: card.title,
      statusLabel: card.statusLabel,
      statusVariant: card.statusVariant,
      progressPct: card.progressPct,
      owner: card.id === "planning" ? planOwner : null,
      lastUpdate:
        card.id === "planning"
          ? formatDate(locale, plan?.updatedAt ?? null) ?? "—"
          : card.id === "materiality"
            ? formatDate(locale, materiality?.updatedAt ?? null) ?? "—"
            : card.id === "risk-assessment"
              ? formatDate(locale, riskAssessment?.updatedAt ?? null) ?? "—"
              : formatDate(locale, fieldwork?.updatedAt ?? null) ?? "—",
      lastUpdateRelative:
        card.id === "planning"
          ? plan
            ? formatRelativeTime(locale, plan.updatedAt)
            : "—"
          : card.id === "materiality"
            ? materiality
              ? formatRelativeTime(locale, materiality.updatedAt)
              : "—"
            : card.id === "risk-assessment"
              ? riskAssessment
                ? formatRelativeTime(locale, riskAssessment.updatedAt)
                : "—"
              : fieldwork
                ? formatRelativeTime(locale, fieldwork.updatedAt)
                : "—",
      href: card.href,
      ctaLabel: card.ctaLabel,
      isActive: !card.isEmpty && card.progressPct < 100,
      isEmpty: card.isEmpty,
    })),
    {
      id: "review",
      label: labels.phaseReview,
      statusLabel: review
        ? reviewLabels.statuses[review.packageStatus]
        : pendingReviews > 0
          ? labels.statusReview
          : labels.statusClear,
      statusVariant:
        review?.packageStatus === "approved"
          ? "success"
          : pendingReviews > 0 || review?.packageStatus === "returned"
            ? "warning"
            : "default",
      progressPct: reviewProgress,
      owner: null,
      lastUpdate: formatDate(locale, review?.updatedAt ?? engagement.updatedAt) ?? "—",
      lastUpdateRelative: formatRelativeTime(locale, review?.updatedAt ?? engagement.updatedAt),
      href: `${base}/review`,
      ctaLabel: labels.openReviewQueue,
      isActive: Boolean(review && review.packageStatus !== "approved"),
      isEmpty: !review,
    },
    {
      id: "completion",
      label: labels.phaseCompletion,
      statusLabel: completion
        ? completionLabels.statuses[completion.packageStatus]
        : labels.statusClear,
      statusVariant:
        completion?.packageStatus === "approved"
          ? "success"
          : completion?.packageStatus === "returned"
            ? "warning"
            : "default",
      progressPct: completionProgress,
      owner: null,
      lastUpdate: formatDate(locale, completion?.updatedAt ?? engagement.updatedAt) ?? "—",
      lastUpdateRelative: formatRelativeTime(locale, completion?.updatedAt ?? engagement.updatedAt),
      href: `${base}/completion`,
      ctaLabel: labels.openCompletion,
      isActive: Boolean(completion && completion.packageStatus !== "approved"),
      isEmpty: !completion,
    },
    {
      id: "reporting",
      label: labels.phaseReporting,
      statusLabel: reporting
        ? reportingLabels.statuses[reporting.packageStatus]
        : labels.statusClear,
      statusVariant:
        reporting?.packageStatus === "approved"
          ? "success"
          : reporting?.packageStatus === "returned"
            ? "warning"
            : "default",
      progressPct: reportingProgress,
      owner: null,
      lastUpdate: formatDate(locale, reporting?.updatedAt ?? engagement.updatedAt) ?? "—",
      lastUpdateRelative: formatRelativeTime(locale, reporting?.updatedAt ?? engagement.updatedAt),
      href: `${base}/reporting`,
      ctaLabel: labels.openReporting,
      isActive: Boolean(reporting && reporting.packageStatus !== "approved"),
      isEmpty: !reporting,
    },
  ];

  const attentionItems = buildEngagementAttentionItems({
    locale,
    slug: engagement.slug,
    plan,
    materiality,
    riskAssessment,
    fieldwork,
    labels: workspaceLabels.phaseDashboard,
  });

  const reviewQueue = attentionItems.map((item) => ({
    id: item.id,
    module: item.id,
    label: item.label,
    href: item.href,
  }));

  const outstandingIssues: EngagementCommandCenterData["outstandingIssues"] = [];
  if (openFindings > 0) {
    outstandingIssues.push({
      id: "findings",
      label: labels.issueFindings,
      count: openFindings,
      href: `${base}/fieldwork/findings`,
      variant: "destructive",
    });
  }
  if ((riskAssessment?.openItemsCount ?? 0) > 0) {
    outstandingIssues.push({
      id: "risk",
      label: labels.issueRiskItems,
      count: riskAssessment!.openItemsCount,
      href: `${base}/risk-assessment`,
      variant: "warning",
    });
  }
  if ((materiality?.openItemsCount ?? 0) > 0) {
    outstandingIssues.push({
      id: "materiality",
      label: labels.issueMaterialityItems,
      count: materiality!.openItemsCount,
      href: `${base}/materiality`,
      variant: "warning",
    });
  }

  const auditHealth: EngagementCommandKpi[] = [
    {
      id: "health",
      label: labels.kpiAuditHealth,
      value:
        attentionItems.length === 0
          ? labels.healthOnTrack
          : attentionItems.length <= 2
            ? labels.healthMonitor
            : labels.healthAttention,
      hint: labels.hintAuditHealth,
      variant:
        attentionItems.length === 0
          ? "success"
          : attentionItems.length <= 2
            ? "warning"
            : "destructive",
    },
    {
      id: "completion",
      label: labels.kpiCompletion,
      value: `${overallCompletionPct}%`,
      hint: labels.hintCompletion,
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
      href: `${base}/fieldwork/findings`,
    },
  ];

  const executive: EngagementCommandKpi[] = [
    {
      id: "lifecycle",
      label: labels.kpiLifecycle,
      value: engagementsLabels.lifecycleStatuses[engagement.lifecycleStatus],
      hint: labels.hintLifecycle,
    },
    {
      id: "planning",
      label: labels.kpiPlanning,
      value: plan ? `${plan.kpiProgress}%` : "—",
      hint: labels.hintPlanning,
      href: `${base}/planning`,
    },
    {
      id: "fieldwork",
      label: labels.kpiFieldwork,
      value: fieldwork ? `${fieldwork.progressPct}%` : "—",
      hint: labels.hintFieldwork,
      href: `${base}/fieldwork`,
    },
    {
      id: "team",
      label: labels.kpiTeam,
      value: String(engagement.memberCount),
      hint: labels.hintTeam,
      href: `${base}/members`,
    },
  ];

  const auditMetrics: EngagementCommandKpi[] = [
    {
      id: "materiality",
      label: labels.kpiMateriality,
      value: materiality ? `${materiality.progressPct}%` : "—",
      hint: labels.hintMateriality,
      href: `${base}/materiality`,
    },
    {
      id: "risk",
      label: labels.kpiRisk,
      value: riskAssessment ? `${riskAssessment.progressPct}%` : "—",
      hint: labels.hintRisk,
      href: `${base}/risk-assessment`,
    },
    {
      id: "procedures",
      label: labels.kpiProcedures,
      value: fieldwork ? String(fieldwork.procedures.length) : "0",
      hint: labels.hintProcedures,
      href: `${base}/fieldwork/procedures`,
    },
    {
      id: "significant",
      label: labels.kpiSignificantRisks,
      value: riskAssessment ? String(riskAssessment.significantRiskCount) : "0",
      hint: labels.hintSignificant,
      href: `${base}/risk-assessment/significant-risks`,
    },
  ];

  const mapActivity = (entries: typeof activityEntries): EngagementActivityRow[] =>
    entries.slice(0, 12).map((entry) => ({
      id: entry.id,
      title: entry.summary ?? entry.action,
      description: entry.action,
      time: formatRelativeTime(locale, entry.createdAt),
    }));

  const recentDocuments =
    plan?.documents.slice(0, 6).map((doc) => ({
      id: doc.id,
      name: doc.name,
      documentType: doc.documentType,
      time: formatRelativeTime(locale, doc.createdAt),
      href: `${base}/planning/documents`,
    })) ?? [];

  const recentComments = [
    ...(materiality?.comments.slice(0, 3).map((c) => ({
      id: c.id,
      module: labels.moduleMateriality,
      body: c.body.trim().slice(0, 120),
      time: formatRelativeTime(locale, c.createdAt),
      href: `${base}/materiality/comments`,
    })) ?? []),
    ...(riskAssessment?.notes.slice(0, 3).map((n) => ({
      id: n.id,
      module: labels.moduleRisk,
      body: n.body.trim().slice(0, 120),
      time: formatRelativeTime(locale, n.createdAt),
      href: `${base}/risk-assessment/comments`,
    })) ?? []),
  ].slice(0, 6);

  const recentDecisions: EngagementCommandCenterData["recentDecisions"] = [];
  if (plan?.approvedAt) {
    recentDecisions.push({
      id: "plan-approved",
      label: labels.decisionPlanningApproved,
      time: formatRelativeTime(locale, plan.approvedAt),
      module: labels.modulePlanning,
    });
  }
  if (materiality?.approvedAt) {
    recentDecisions.push({
      id: "mat-approved",
      label: labels.decisionMaterialityApproved,
      time: formatRelativeTime(locale, materiality.approvedAt),
      module: labels.moduleMateriality,
    });
  }
  if (riskAssessment?.approvedAt) {
    recentDecisions.push({
      id: "risk-approved",
      label: labels.decisionRiskApproved,
      time: formatRelativeTime(locale, riskAssessment.approvedAt),
      module: labels.moduleRisk,
    });
  }

  const deadlineIso = engagement.plannedEnd ?? engagement.periodEnd;
  const isOverdue = deadlineIso ? new Date(deadlineIso).getTime() < Date.now() : false;

  return {
    executive,
    auditHealth,
    overallCompletionPct,
    pipeline,
    reviewQueue,
    outstandingIssues,
    auditMetrics,
    recentActivity: mapActivity(activityEntries).slice(0, 6),
    recentDocuments,
    recentComments,
    recentDecisions,
    auditTimeline: mapActivity(activityEntries),
    upcomingDeadline: deadlineIso,
    deadlineLabel: formatDate(locale, deadlineIso),
    isOverdue,
    client: {
      companyName: engagement.companyName,
      companySlug: engagement.companySlug,
      engagementCode: engagement.engagementCode,
      reportingFramework: engagement.reportingFramework,
      periodRange:
        [engagement.periodStart, engagement.periodEnd].filter(Boolean).join(" – ") || null,
      plannedRange:
        [engagement.plannedStart, engagement.plannedEnd].filter(Boolean).join(" – ") || null,
    },
    companyHealth: company
      ? {
          statusLabel: company.settings.validation?.validated_at
            ? labels.companyValidated
            : labels.companyPending,
          statusVariant: company.settings.validation?.validated_at ? "success" : "warning",
          framework: engagementsLabels.create.frameworks[company.settings.reporting_framework],
          jurisdiction: company.settings.jurisdiction,
        }
      : null,
    team: engagement.members.map((m) => ({
      id: m.id,
      displayName: m.displayName,
      role: m.memberRole.replace(/_/g, " "),
      email: m.email,
    })),
    pendingReviews,
    openFindings,
    attentionCount: attentionItems.length + outstandingIssues.length,
  };
}
