import type { EngagementLifecycleStatus } from "@/types/engagement";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { EngagementWorkspaceNavItem } from "@/components/engagement/workspace/engagement-workspace-sidebar";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import {
  formatDate,
  formatDateRange,
  formatEngagementTypeLabel,
  formatFrameworkLabel,
  formatLifecycleStatusLabel,
  formatOptionalText,
} from "@/lib/engagement/format-engagement-workspace";
import { isProcedureComplete } from "@/lib/fieldwork/fieldwork-rules";

export type EngagementWorkspaceSection = "overview" | "members" | "planning" | "fieldwork" | "history" | "settings";
export type EngagementWorkspaceLabels = Dictionary["engagements"]["workspace"];

const LIFECYCLE_PROGRESS: Record<EngagementLifecycleStatus, number> = {
  draft: 10,
  planning: 25,
  fieldwork: 50,
  review: 75,
  completed: 90,
  closed: 100,
};

export function computeLifecycleProgress(
  lifecycleStatus: EngagementLifecycleStatus,
): number {
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
    { id: "fieldwork", label: labels.navFieldwork, href: `${base}/fieldwork` },
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
