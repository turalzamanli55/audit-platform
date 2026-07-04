import "server-only";

import type { Locale } from "@/i18n";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { getCurrentUser, getTenantBootstrap } from "@/lib/auth/server";
import { readCompanySlugCookie } from "@/lib/auth/tenant-cookies";
import { loadCompanyList } from "@/lib/company/load-company-list";
import { loadEngagementList } from "@/lib/engagement/load-engagement-list";
import { resolveActiveCompany } from "@/lib/company/resolve-active-company";
import { loadFieldworkDashboardMetrics } from "@/lib/fieldwork/load-fieldwork-dashboard-metrics";
import { loadMaterialityDashboardMetrics } from "@/lib/materiality/load-materiality-dashboard-metrics";
import { loadRiskAssessmentDashboardMetrics } from "@/lib/risk-assessment/load-risk-assessment-dashboard-metrics";
import {
  loadDashboardFeed,
  type DashboardEngagementPreview,
  type DashboardFeed,
} from "./load-dashboard-feed";
import { resolveTimeOfDay } from "./workspace-greeting";

export type DashboardWorkspaceCompany = {
  id: string;
  name: string;
  slug: string;
};

export type DashboardWorkspaceViewModel = {
  locale: Locale;
  labels: DashboardWorkspaceLabels;
  userName: string;
  organizationName: string;
  workspaceName: string;
  companyName: string | null;
  formattedDate: string;
  timeOfDay: string;
  companies: DashboardWorkspaceCompany[];
  companyCount: number;
  continueCompany: DashboardWorkspaceCompany | null;
  kpi: {
    companies: string;
    engagements: string;
    openTasks: string;
    reports: string;
    aiSuggestions: string;
    live: {
      companies: boolean;
      engagements: boolean;
      openTasks: boolean;
      reports: boolean;
      aiSuggestions: boolean;
    };
  };
  feed: DashboardFeed;
  recentEngagements: DashboardEngagementPreview[];
};

function resolveTimeOfDayFromLabels(
  hour: number,
  labels: DashboardWorkspaceLabels["welcome"],
): string {
  return resolveTimeOfDay(hour, labels);
}

export async function loadDashboardWorkspace(
  locale: Locale,
  labels: DashboardWorkspaceLabels,
): Promise<DashboardWorkspaceViewModel> {
  const [
    user,
    bootstrap,
    companyResult,
    preferredCompanySlug,
    engagementResult,
    fieldworkMetrics,
    riskAssessmentMetrics,
    materialityMetrics,
  ] =
    await Promise.all([
    getCurrentUser(locale),
    getTenantBootstrap(),
    loadCompanyList(),
    readCompanySlugCookie(),
    loadEngagementList(),
    loadFieldworkDashboardMetrics(),
    loadRiskAssessmentDashboardMetrics(),
    loadMaterialityDashboardMetrics(),
  ]);

  const organizations = bootstrap?.organizations ?? [];
  const workspaces = bootstrap?.workspaces ?? [];
  const currentOrg = organizations.find((o) => o.id === bootstrap?.currentOrganizationId);
  const currentWorkspace = workspaces.find((w) => w.id === bootstrap?.currentWorkspaceId);

  const companies =
    companyResult.ok
      ? companyResult.items.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
        }))
      : [];

  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  const userName = user?.displayName?.trim() || user?.email?.split("@")[0] || "there";
  const companyCount = companies.length;
  const engagementItems = engagementResult.ok ? engagementResult.items : [];
  const engagementCount = engagementItems.length;

  const activeCompany = resolveActiveCompany(companies, "", preferredCompanySlug);

  const feed = await loadDashboardFeed({
    locale,
    labels,
    companyCount,
    engagements: engagementItems,
    fieldworkMetrics,
    riskMetrics: riskAssessmentMetrics,
    materialityMetrics,
  });

  const openTasksCount =
    (fieldworkMetrics?.pendingReview ?? 0) +
    (fieldworkMetrics?.assignedToMe ?? 0) +
    (riskAssessmentMetrics?.pendingReview ?? 0) +
    (riskAssessmentMetrics?.openItems ?? 0) +
    (materialityMetrics?.pendingReview ?? 0) +
    (materialityMetrics?.draftPackages ?? 0) +
    (fieldworkMetrics?.openFindings ?? 0);

  const hasFieldworkOrRisk = Boolean(fieldworkMetrics || riskAssessmentMetrics || materialityMetrics);

  return {
    locale,
    labels,
    userName,
    organizationName: currentOrg?.name ?? "—",
    workspaceName: currentWorkspace?.name ?? "—",
    companyName: activeCompany?.name ?? null,
    formattedDate,
    timeOfDay: resolveTimeOfDayFromLabels(now.getHours(), labels.welcome),
    companies,
    companyCount,
    continueCompany: activeCompany,
    recentEngagements: feed.recentEngagements,
    feed,
    kpi: {
      companies: companyCount > 0 ? String(companyCount) : "—",
      engagements: engagementCount > 0 ? String(engagementCount) : "—",
      openTasks: hasFieldworkOrRisk ? String(openTasksCount) : feed.tasks.length > 0 ? String(feed.tasks.length) : "—",
      reports: "—",
      aiSuggestions: "—",
      live: {
        companies: companyCount > 0,
        engagements: engagementCount > 0,
        openTasks: hasFieldworkOrRisk || feed.tasks.length > 0,
        reports: false,
        aiSuggestions: false,
      },
    },
  };
}
