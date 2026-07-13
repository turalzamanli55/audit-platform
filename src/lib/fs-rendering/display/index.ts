import { FS_RENDERING_WORKSPACE_SECTIONS } from "@/constants/fs-rendering";
import type { FsRenderingWorkspaceSection } from "@/types/fs-rendering";

export type FsRenderingNavItem = {
  id: FsRenderingWorkspaceSection;
  label: string;
  href: string;
};

export type FsRenderingNavGroup = {
  id: "overview" | "render" | "controls" | "governance";
  label: string;
  items: FsRenderingNavItem[];
};

export type FsRenderingWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navExplorer: string;
  navPresentation: string;
  navLayout: string;
  navValidation: string;
  navVersions: string;
  navHistory: string;
  navSearch: string;
  navGroups: {
    overview: string;
    render: string;
    controls: string;
    governance: string;
  };
  heroEyebrow: string;
  title: string;
  description: string;
  backToEngagement: string;
};

export function buildFsRenderingNavItems(
  locale: string,
  engagementSlug: string,
  labels: FsRenderingWorkspaceLabels,
): FsRenderingNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/fs-rendering`;
  const labelMap: Record<FsRenderingWorkspaceSection, string> = {
    overview: labels.navOverview,
    explorer: labels.navExplorer,
    presentation: labels.navPresentation,
    layouts: labels.navLayout,
    validation: labels.navValidation,
    versions: labels.navVersions,
    history: labels.navHistory,
    search: labels.navSearch,
  };
  return FS_RENDERING_WORKSPACE_SECTIONS.map((section) => ({
    id: section,
    label: labelMap[section],
    href: section === "overview" ? base : `${base}/${section}`,
  }));
}

export function buildFsRenderingNavGroups(
  locale: string,
  engagementSlug: string,
  labels: FsRenderingWorkspaceLabels,
): FsRenderingNavGroup[] {
  const items = buildFsRenderingNavItems(locale, engagementSlug, labels);
  const byId = Object.fromEntries(items.map((item) => [item.id, item])) as Record<
    FsRenderingWorkspaceSection,
    FsRenderingNavItem
  >;
  return [
    { id: "overview", label: labels.navGroups.overview, items: [byId.overview, byId.search] },
    {
      id: "render",
      label: labels.navGroups.render,
      items: [byId.explorer, byId.presentation, byId.layouts],
    },
    { id: "controls", label: labels.navGroups.controls, items: [byId.validation] },
    {
      id: "governance",
      label: labels.navGroups.governance,
      items: [byId.versions, byId.history],
    },
  ];
}
