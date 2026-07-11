import { TRIAL_BALANCE_WORKSPACE_SECTIONS } from "@/constants/trial-balance";
import type { TrialBalanceWorkspaceSection } from "@/types/trial-balance";

export type TrialBalanceNavItem = {
  id: TrialBalanceWorkspaceSection;
  label: string;
  href: string;
};

export type TrialBalanceNavGroup = {
  id: "overview" | "accounts" | "controls" | "governance" | "admin";
  label: string;
  items: TrialBalanceNavItem[];
};

export type TrialBalanceWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navAccounts: string;
  navHierarchy: string;
  navAdjustments: string;
  navReclassifications: string;
  navMappings: string;
  navValidation: string;
  navCurrencies: string;
  navPeriods: string;
  navComparatives: string;
  navHistory: string;
  navVersions: string;
  navSettings: string;
  navSearch: string;
  navGroups: {
    overview: string;
    accounts: string;
    controls: string;
    governance: string;
    admin: string;
  };
  heroEyebrow: string;
  title: string;
  description: string;
  backToEngagement: string;
};

export function buildTrialBalanceNavItems(
  locale: string,
  engagementSlug: string,
  labels: TrialBalanceWorkspaceLabels,
): TrialBalanceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/trial-balance`;
  return TRIAL_BALANCE_WORKSPACE_SECTIONS.map((section) => {
    const labelMap: Record<TrialBalanceWorkspaceSection, string> = {
      overview: labels.navOverview,
      accounts: labels.navAccounts,
      hierarchy: labels.navHierarchy,
      adjustments: labels.navAdjustments,
      reclassifications: labels.navReclassifications,
      mappings: labels.navMappings,
      validation: labels.navValidation,
      currencies: labels.navCurrencies,
      periods: labels.navPeriods,
      comparatives: labels.navComparatives,
      history: labels.navHistory,
      versions: labels.navVersions,
      settings: labels.navSettings,
      search: labels.navSearch,
    };
    return {
      id: section,
      label: labelMap[section],
      href: section === "overview" ? base : `${base}/${section}`,
    };
  });
}

export function buildTrialBalanceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: TrialBalanceWorkspaceLabels,
): TrialBalanceNavGroup[] {
  const items = buildTrialBalanceNavItems(locale, engagementSlug, labels);
  const byId = Object.fromEntries(items.map((item) => [item.id, item])) as Record<
    TrialBalanceWorkspaceSection,
    TrialBalanceNavItem
  >;
  return [
    {
      id: "overview",
      label: labels.navGroups.overview,
      items: [byId.overview, byId.validation, byId.search],
    },
    {
      id: "accounts",
      label: labels.navGroups.accounts,
      items: [byId.accounts, byId.hierarchy, byId.mappings],
    },
    {
      id: "controls",
      label: labels.navGroups.controls,
      items: [byId.adjustments, byId.reclassifications, byId.currencies, byId.periods, byId.comparatives],
    },
    {
      id: "governance",
      label: labels.navGroups.governance,
      items: [byId.history, byId.versions],
    },
    {
      id: "admin",
      label: labels.navGroups.admin,
      items: [byId.settings],
    },
  ];
}
