import { IFRS_NOTES_WORKSPACE_SECTIONS } from "@/constants/ifrs-notes";
import type { IfrsNotesWorkspaceSection } from "@/types/ifrs-notes";

export type IfrsNotesNavItem = {
  id: IfrsNotesWorkspaceSection;
  label: string;
  href: string;
};

export type IfrsNotesNavGroup = {
  id: "overview" | "notes" | "controls" | "governance";
  label: string;
  items: IfrsNotesNavItem[];
};

export type IfrsNotesWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navExplorer: string;
  navDisclosures: string;
  navCrossReferences: string;
  navValidation: string;
  navVersions: string;
  navHistory: string;
  navSearch: string;
  navGroups: {
    overview: string;
    notes: string;
    controls: string;
    governance: string;
  };
  heroEyebrow: string;
  title: string;
  description: string;
  backToEngagement: string;
};

export function buildIfrsNotesNavItems(
  locale: string,
  engagementSlug: string,
  labels: IfrsNotesWorkspaceLabels,
): IfrsNotesNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/ifrs-notes`;
  const labelMap: Record<IfrsNotesWorkspaceSection, string> = {
    overview: labels.navOverview,
    explorer: labels.navExplorer,
    disclosures: labels.navDisclosures,
    "cross-references": labels.navCrossReferences,
    validation: labels.navValidation,
    versions: labels.navVersions,
    history: labels.navHistory,
    search: labels.navSearch,
  };
  return IFRS_NOTES_WORKSPACE_SECTIONS.map((section) => ({
    id: section,
    label: labelMap[section],
    href: section === "overview" ? base : `${base}/${section}`,
  }));
}

export function buildIfrsNotesNavGroups(
  locale: string,
  engagementSlug: string,
  labels: IfrsNotesWorkspaceLabels,
): IfrsNotesNavGroup[] {
  const items = buildIfrsNotesNavItems(locale, engagementSlug, labels);
  const byId = Object.fromEntries(items.map((item) => [item.id, item])) as Record<
    IfrsNotesWorkspaceSection,
    IfrsNotesNavItem
  >;
  return [
    { id: "overview", label: labels.navGroups.overview, items: [byId.overview, byId.search] },
    {
      id: "notes",
      label: labels.navGroups.notes,
      items: [byId.explorer, byId.disclosures, byId["cross-references"]],
    },
    { id: "controls", label: labels.navGroups.controls, items: [byId.validation] },
    {
      id: "governance",
      label: labels.navGroups.governance,
      items: [byId.versions, byId.history],
    },
  ];
}
