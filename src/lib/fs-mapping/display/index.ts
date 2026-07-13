import { FS_MAPPING_WORKSPACE_SECTIONS } from "@/constants/fs-mapping";
import type { FsMappingWorkspaceSection } from "@/types/fs-mapping";

export type FsMappingNavItem = {
  id: FsMappingWorkspaceSection;
  label: string;
  href: string;
};

export type FsMappingNavGroup = {
  id: "overview" | "structure" | "controls" | "governance";
  label: string;
  items: FsMappingNavItem[];
};

export type FsMappingWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navExplorer: string;
  navHierarchy: string;
  navStatementTree: string;
  navValidation: string;
  navVersions: string;
  navHistory: string;
  navSearch: string;
  navGroups: {
    overview: string;
    structure: string;
    controls: string;
    governance: string;
  };
  heroEyebrow: string;
  title: string;
  description: string;
  backToEngagement: string;
};

export function buildFsMappingNavItems(
  locale: string,
  engagementSlug: string,
  labels: FsMappingWorkspaceLabels,
): FsMappingNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/fs-mapping`;
  const labelMap: Record<FsMappingWorkspaceSection, string> = {
    overview: labels.navOverview,
    explorer: labels.navExplorer,
    hierarchy: labels.navHierarchy,
    "statement-tree": labels.navStatementTree,
    validation: labels.navValidation,
    versions: labels.navVersions,
    history: labels.navHistory,
    search: labels.navSearch,
  };
  return FS_MAPPING_WORKSPACE_SECTIONS.map((section) => ({
    id: section,
    label: labelMap[section],
    href: section === "overview" ? base : `${base}/${section}`,
  }));
}

export function buildFsMappingNavGroups(
  locale: string,
  engagementSlug: string,
  labels: FsMappingWorkspaceLabels,
): FsMappingNavGroup[] {
  const items = buildFsMappingNavItems(locale, engagementSlug, labels);
  const byId = Object.fromEntries(items.map((item) => [item.id, item])) as Record<
    FsMappingWorkspaceSection,
    FsMappingNavItem
  >;
  return [
    { id: "overview", label: labels.navGroups.overview, items: [byId.overview, byId.search] },
    {
      id: "structure",
      label: labels.navGroups.structure,
      items: [byId.explorer, byId.hierarchy, byId["statement-tree"]],
    },
    { id: "controls", label: labels.navGroups.controls, items: [byId.validation] },
    {
      id: "governance",
      label: labels.navGroups.governance,
      items: [byId.versions, byId.history],
    },
  ];
}
