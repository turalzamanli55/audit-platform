import type { EngagementLifecycleStatus } from "@/types/engagement";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { EngagementWorkspaceNavItem } from "@/components/engagement/workspace/engagement-workspace-sidebar";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import {
  formatDate,
  formatDateRange,
  formatEngagementTypeLabel,
  formatFrameworkLabel,
  formatLifecycleStatusLabel,
  formatOptionalText,
} from "@/lib/engagement/format-engagement-workspace";
import { isProcedureComplete } from "@/lib/fieldwork/fieldwork-rules";

export type EngagementWorkspaceSection =
  | "overview"
  | "members"
  | "planning"
  | "materiality"
  | "risk-assessment"
  | "fieldwork"
  | "review"
  | "completion"
  | "history"
  | "settings";
export type EngagementWorkspaceLabels = Dictionary["engagements"]["workspace"];

const LIFECYCLE_PROGRESS: Record<EngagementLifecycleStatus, number> = {
  draft: 10,
  planning: 20,
  fieldwork: 55,
  review: 75,
  completed: 90,
  closed: 100,
};

export function computeLifecycleProgress(
  lifecycleStatus: EngagementLifecycleStatus,
  riskAssessmentStatus?: string | null,
): number {
  if (lifecycleStatus === "planning") {
    return riskAssessmentStatus && riskAssessmentStatus !== "not_started" ? 35 : 20;
  }
  return LIFECYCLE_PROGRESS[lifecycleStatus] ?? 0;
}

export function buildPlanningSummaryItems(
  engagement: EngagementWorkspaceView,
  locale: string,
  labels: EngagementWorkspaceLabels,
  engagementsLabels: Dictionary["engagements"],
  plan?: PlanningWorkspaceView | null,
  planningLabels?: Dictionary["planning"],
) {
  if (plan && planningLabels) {
    return [
      {
        id: "status",
        label: labels.planning.planningStatus,
        value: planningLabels.statuses[plan.planningStatus],
      },
      {
        id: "progress",
        label: labels.planning.planningProgress,
        value: `${plan.kpiProgress}%`,
      },
      {
        id: "version",
        label: labels.planning.planVersion,
        value: String(plan.planVersion),
      },
      {
        id: "checklist",
        label: labels.planning.checklistProgress,
        value: `${plan.checklistProgress}%`,
      },
      {
        id: "framework",
        label: labels.planning.reportingFramework,
        value: formatOptionalText(plan.financialReportingFramework),
      },
    ];
  }

  return [
    {
      id: "lifecycle",
      label: labels.planning.lifecycleStage,
      value: formatLifecycleStatusLabel(
        engagement.lifecycleStatus,
        engagementsLabels.lifecycleStatuses,
      ),
    },
    {
      id: "period",
      label: labels.planning.financialYear,
      value: formatDateRange(engagement.periodStart, engagement.periodEnd, locale),
    },
    {
      id: "planned",
      label: labels.planning.plannedSchedule,
      value: formatDateRange(engagement.plannedStart, engagement.plannedEnd, locale),
    },
    {
      id: "members",
      label: labels.planning.teamSize,
      value: String(engagement.memberCount),
    },
  ];
}

export function buildFieldworkSummaryItems(
  engagement: EngagementWorkspaceView,
  locale: string,
  labels: EngagementWorkspaceLabels,
  engagementsLabels: Dictionary["engagements"],
  fieldwork?: FieldworkWorkspaceView | null,
  fieldworkLabels?: Dictionary["fieldwork"],
) {
  if (fieldwork && fieldworkLabels) {
    return [
      {
        id: "status",
        label: labels.fieldwork.fieldworkStatus,
        value: fieldworkLabels.statuses[fieldwork.packageStatus],
      },
      {
        id: "progress",
        label: labels.fieldwork.fieldworkProgress,
        value: `${fieldwork.progressPct}%`,
      },
      {
        id: "procedures",
        label: labels.fieldwork.proceduresComplete,
        value: `${fieldwork.procedures.filter((p) => isProcedureComplete(p.procedureStatus)).length}/${fieldwork.procedures.length}`,
      },
      {
        id: "findings",
        label: labels.fieldwork.findingsCount,
        value: String(fieldwork.findings.length),
      },
      {
        id: "evidence",
        label: labels.fieldwork.evidenceCount,
        value: String(fieldwork.evidence.length),
      },
    ];
  }

  return [
    {
      id: "lifecycle",
      label: labels.fieldwork.lifecycleStage,
      value: formatLifecycleStatusLabel(
        engagement.lifecycleStatus,
        engagementsLabels.lifecycleStatuses,
      ),
    },
    {
      id: "period",
      label: labels.fieldwork.financialYear,
      value: formatDateRange(engagement.periodStart, engagement.periodEnd, locale),
    },
    {
      id: "planned",
      label: labels.fieldwork.plannedSchedule,
      value: formatDateRange(engagement.plannedStart, engagement.plannedEnd, locale),
    },
    {
      id: "members",
      label: labels.fieldwork.teamSize,
      value: String(engagement.memberCount),
    },
  ];
}

export function buildMaterialitySummaryItems(
  engagement: EngagementWorkspaceView,
  locale: string,
  labels: EngagementWorkspaceLabels,
  engagementsLabels: Dictionary["engagements"],
  materiality?: MaterialityWorkspaceView | null,
  materialityLabels?: Dictionary["materiality"],
) {
  if (materiality && materialityLabels) {
    return [
      {
        id: "status",
        label: labels.materiality.materialityStatus,
        value: materialityLabels.statuses[materiality.packageStatus],
      },
      {
        id: "progress",
        label: labels.materiality.materialityProgress,
        value: `${materiality.progressPct}%`,
      },
      {
        id: "version",
        label: labels.materiality.packageVersion,
        value: String(materiality.packageVersion),
      },
      {
        id: "overall",
        label: labels.materiality.overallMateriality,
        value:
          materiality.overallMateriality != null
            ? new Intl.NumberFormat(locale, {
                style: "currency",
                currency: materiality.currencyCode,
                maximumFractionDigits: 0,
              }).format(materiality.overallMateriality)
            : formatOptionalText(null),
      },
      {
        id: "benchmarks",
        label: labels.materiality.benchmarkCount,
        value: String(materiality.benchmarks.length),
      },
    ];
  }

  return [
    {
      id: "lifecycle",
      label: labels.materiality.lifecycleStage,
      value: formatLifecycleStatusLabel(
        engagement.lifecycleStatus,
        engagementsLabels.lifecycleStatuses,
      ),
    },
    {
      id: "period",
      label: labels.materiality.financialYear,
      value: formatDateRange(engagement.periodStart, engagement.periodEnd, locale),
    },
    {
      id: "planned",
      label: labels.materiality.plannedSchedule,
      value: formatDateRange(engagement.plannedStart, engagement.plannedEnd, locale),
    },
    {
      id: "members",
      label: labels.materiality.teamSize,
      value: String(engagement.memberCount),
    },
  ];
}

export function buildRiskAssessmentSummaryItems(
  engagement: EngagementWorkspaceView,
  locale: string,
  labels: EngagementWorkspaceLabels,
  engagementsLabels: Dictionary["engagements"],
  riskAssessment?: RiskAssessmentWorkspaceView | null,
  riskLabels?: Dictionary["riskAssessment"],
) {
  if (riskAssessment && riskLabels) {
    return [
      {
        id: "status",
        label: labels.riskAssessment.riskStatus,
        value: riskLabels.statuses[riskAssessment.assessmentStatus],
      },
      {
        id: "progress",
        label: labels.riskAssessment.riskProgress,
        value: `${riskAssessment.progressPct}%`,
      },
      {
        id: "version",
        label: labels.riskAssessment.assessmentVersion,
        value: String(riskAssessment.assessmentVersion),
      },
      {
        id: "significant",
        label: labels.riskAssessment.significantRisks,
        value: String(riskAssessment.significantRiskCount),
      },
      {
        id: "pendingReview",
        label: labels.riskAssessment.pendingReview,
        value: String(riskAssessment.pendingReviewCount),
      },
    ];
  }

  return [
    {
      id: "lifecycle",
      label: labels.riskAssessment.lifecycleStage,
      value: formatLifecycleStatusLabel(
        engagement.lifecycleStatus,
        engagementsLabels.lifecycleStatuses,
      ),
    },
    {
      id: "period",
      label: labels.riskAssessment.financialYear,
      value: formatDateRange(engagement.periodStart, engagement.periodEnd, locale),
    },
    {
      id: "planned",
      label: labels.riskAssessment.plannedSchedule,
      value: formatDateRange(engagement.plannedStart, engagement.plannedEnd, locale),
    },
    {
      id: "members",
      label: labels.riskAssessment.teamSize,
      value: String(engagement.memberCount),
    },
  ];
}

export function buildClientInformationItems(
  engagement: EngagementWorkspaceView,
  locale: string,
  labels: EngagementWorkspaceLabels,
) {
  return [
    {
      id: "client",
      label: labels.client.companyName,
      value: engagement.companyName,
    },
    {
      id: "slug",
      label: labels.client.companySlug,
      value: engagement.companySlug || formatOptionalText(null),
    },
    {
      id: "engagement",
      label: labels.client.engagementName,
      value: engagement.name,
    },
    {
      id: "code",
      label: labels.client.engagementCode,
      value: formatOptionalText(engagement.engagementCode),
    },
  ];
}

export function buildEngagementInformationItems(
  engagement: EngagementWorkspaceView,
  locale: string,
  labels: EngagementWorkspaceLabels,
  engagementsLabels: Dictionary["engagements"],
) {
  return [
    {
      id: "type",
      label: engagementsLabels.columnType,
      value: formatEngagementTypeLabel(
        engagement.engagementType,
        engagementsLabels.create.engagementTypes,
      ),
    },
    {
      id: "framework",
      label: engagementsLabels.columnFramework,
      value: formatFrameworkLabel(engagement.reportingFramework, engagementsLabels),
    },
    {
      id: "lifecycle",
      label: engagementsLabels.columnLifecycle,
      value: formatLifecycleStatusLabel(
        engagement.lifecycleStatus,
        engagementsLabels.lifecycleStatuses,
      ),
    },
    {
      id: "status",
      label: engagementsLabels.columnStatus,
      value: engagement.isArchived
        ? engagementsLabels.filterArchived
        : engagementsLabels.filterActive,
    },
    {
      id: "period",
      label: labels.information.reportingPeriod,
      value: formatDateRange(engagement.periodStart, engagement.periodEnd, locale),
    },
    {
      id: "notes",
      label: labels.information.internalNotes,
      value: formatOptionalText(engagement.notes),
    },
  ];
}

export function buildEngagementWorkspaceNavItems(
  locale: string,
  slug: string,
  labels: EngagementWorkspaceLabels,
): EngagementWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${slug}`;

  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "members", label: labels.navMembers, href: `${base}/members` },
    { id: "planning", label: labels.navPlanning, href: `${base}/planning` },
    { id: "materiality", label: labels.navMateriality, href: `${base}/materiality` },
    { id: "risk-assessment", label: labels.navRiskAssessment, href: `${base}/risk-assessment` },
    { id: "fieldwork", label: labels.navFieldwork, href: `${base}/fieldwork` },
    { id: "review", label: labels.navReview, href: `${base}/review` },
    { id: "completion", label: labels.navCompletion, href: `${base}/completion` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildWorkspaceHeroLabels(
  labels: EngagementWorkspaceLabels,
  engagementsLabels: Dictionary["engagements"],
): {
  breadcrumbRoot: string;
  eyebrow: string;
  engagementCode: string;
  statusActive: string;
  statusInactive: string;
  statusArchived: string;
  statusSuspended: string;
  archivedTitle: string;
  archivedDescription: string;
} {
  return {
    breadcrumbRoot: engagementsLabels.breadcrumbRoot,
    eyebrow: labels.heroEyebrow,
    engagementCode: engagementsLabels.columnCode,
    statusActive: engagementsLabels.filterActive,
    statusInactive: engagementsLabels.filterInactive,
    statusArchived: engagementsLabels.filterArchived,
    statusSuspended: engagementsLabels.filterSuspended,
    archivedTitle: engagementsLabels.settings.lifecycle.archivedBannerTitle,
    archivedDescription: engagementsLabels.settings.lifecycle.archivedBannerDescription,
  };
}

export function buildOverviewSummaryCards(
  engagement: EngagementWorkspaceView,
  locale: string,
  labels: EngagementWorkspaceLabels,
  engagementsLabels: Dictionary["engagements"],
) {
  return [
    {
      id: "client",
      label: labels.summaryClient,
      value: engagement.companyName,
      hint: engagement.engagementCode
        ? `${labels.summaryCode}: ${engagement.engagementCode}`
        : undefined,
    },
    {
      id: "type",
      label: labels.summaryType,
      value: formatEngagementTypeLabel(
        engagement.engagementType,
        engagementsLabels.create.engagementTypes,
      ),
    },
    {
      id: "lifecycle",
      label: labels.summaryLifecycle,
      value: formatLifecycleStatusLabel(
        engagement.lifecycleStatus,
        engagementsLabels.lifecycleStatuses,
      ),
    },
    {
      id: "framework",
      label: labels.summaryFramework,
      value: formatFrameworkLabel(engagement.reportingFramework, engagementsLabels),
      hint: formatDateRange(engagement.periodStart, engagement.periodEnd, locale),
    },
  ];
}

export function buildOverviewMetadataItems(
  engagement: EngagementWorkspaceView,
  locale: string,
  labels: EngagementWorkspaceLabels,
  engagementsLabels: Dictionary["engagements"],
) {
  return [
    {
      id: "client",
      label: engagementsLabels.columnClient,
      value: engagement.companyName,
    },
    {
      id: "code",
      label: engagementsLabels.columnCode,
      value: formatOptionalText(engagement.engagementCode),
    },
    {
      id: "planned",
      label: labels.metadataPlannedDates,
      value: formatDateRange(engagement.plannedStart, engagement.plannedEnd, locale),
    },
    {
      id: "members",
      label: labels.metadataMembers,
      value: String(engagement.memberCount),
    },
    {
      id: "slug",
      label: labels.metadataSlug,
      value: engagement.slug,
    },
    {
      id: "created",
      label: labels.metadataCreated,
      value: formatDate(engagement.createdAt, locale),
    },
    {
      id: "updated",
      label: engagementsLabels.columnUpdated,
      value: formatDate(engagement.updatedAt, locale),
    },
  ];
}

export function workspaceSectionTitle(
  section: EngagementWorkspaceSection,
  labels: EngagementWorkspaceLabels,
): string {
  switch (section) {
    case "overview":
      return labels.sections.overview.title;
    case "members":
      return labels.sections.members.title;
    case "planning":
      return labels.navPlanning;
    case "materiality":
      return labels.navMateriality;
    case "risk-assessment":
      return labels.navRiskAssessment;
    case "fieldwork":
      return labels.navFieldwork;
    case "history":
      return labels.sections.history.title;
    case "settings":
      return labels.sections.settings.title;
    default:
      return section;
  }
}
