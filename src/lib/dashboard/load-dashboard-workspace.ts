import "server-only";

import type { Locale } from "@/i18n";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { getCurrentUser, getTenantBootstrap } from "@/lib/auth/server";
import { loadCompanyList } from "@/lib/company/load-company-list";
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
  };
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
  const [user, bootstrap, companyResult] = await Promise.all([
    getCurrentUser(locale),
    getTenantBootstrap(),
    loadCompanyList(),
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

  return {
    locale,
    labels,
    userName,
    organizationName: currentOrg?.name ?? "—",
    workspaceName: currentWorkspace?.name ?? "—",
    companyName: companies[0]?.name ?? null,
    formattedDate,
    timeOfDay: resolveTimeOfDayFromLabels(now.getHours(), labels.welcome),
    companies,
    companyCount,
    continueCompany: companies[0] ?? null,
    kpi: {
      companies: companyCount > 0 ? String(companyCount) : "—",
      engagements: "—",
      openTasks: String(labels.tasks.items.length),
      reports: "—",
      aiSuggestions: String(labels.ai.suggestions.length),
    },
  };
}
