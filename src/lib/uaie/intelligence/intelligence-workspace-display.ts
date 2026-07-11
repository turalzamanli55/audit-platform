import { UAIE_INTELLIGENCE_SECTIONS } from "@/constants/uaie";

export type UaieIntelligenceSection = (typeof UAIE_INTELLIGENCE_SECTIONS)[number];

export type UaieIntelligenceNavItem = {
  id: UaieIntelligenceSection;
  label: string;
  href: string;
};

export type UaieIntelligenceNavGroup = {
  id: "overview" | "learning" | "templates" | "governance" | "admin";
  label: string;
  items: UaieIntelligenceNavItem[];
};

export type UaieIntelligenceWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navSessions: string;
  navUnknownHeaders: string;
  navDictionary: string;
  navErpTemplates: string;
  navCustomerTemplates: string;
  navFingerprints: string;
  navMappings: string;
  navAnalytics: string;
  navHealth: string;
  navUnknownWords: string;
  navSuggestions: string;
  navTimeline: string;
  navHistory: string;
  navAdmin: string;
  navSearch: string;
  navGroups: {
    overview: string;
    learning: string;
    templates: string;
    governance: string;
    admin: string;
  };
  heroEyebrow: string;
  title: string;
  description: string;
  backToDashboard: string;
};

export function buildUaieIntelligenceNavItems(
  locale: string,
  labels: UaieIntelligenceWorkspaceLabels,
): UaieIntelligenceNavItem[] {
  const base = `/${locale}/app/import-intelligence`;
  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "sessions", label: labels.navSessions, href: `${base}/sessions` },
    { id: "unknown-headers", label: labels.navUnknownHeaders, href: `${base}/unknown-headers` },
    { id: "dictionary", label: labels.navDictionary, href: `${base}/dictionary` },
    { id: "erp-templates", label: labels.navErpTemplates, href: `${base}/erp-templates` },
    {
      id: "customer-templates",
      label: labels.navCustomerTemplates,
      href: `${base}/customer-templates`,
    },
    { id: "fingerprints", label: labels.navFingerprints, href: `${base}/fingerprints` },
    { id: "mappings", label: labels.navMappings, href: `${base}/mappings` },
    { id: "analytics", label: labels.navAnalytics, href: `${base}/analytics` },
    { id: "health", label: labels.navHealth, href: `${base}/health` },
    { id: "unknown-words", label: labels.navUnknownWords, href: `${base}/unknown-words` },
    { id: "suggestions", label: labels.navSuggestions, href: `${base}/suggestions` },
    { id: "timeline", label: labels.navTimeline, href: `${base}/timeline` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "admin", label: labels.navAdmin, href: `${base}/admin` },
    { id: "search", label: labels.navSearch, href: `${base}/search` },
  ];
}

export function buildUaieIntelligenceNavGroups(
  locale: string,
  labels: UaieIntelligenceWorkspaceLabels,
): UaieIntelligenceNavGroup[] {
  const items = buildUaieIntelligenceNavItems(locale, labels);
  const byId = Object.fromEntries(items.map((item) => [item.id, item])) as Record<
    UaieIntelligenceSection,
    UaieIntelligenceNavItem
  >;
  return [
    {
      id: "overview",
      label: labels.navGroups.overview,
      items: [byId.overview, byId.analytics, byId.sessions, byId.health],
    },
    {
      id: "learning",
      label: labels.navGroups.learning,
      items: [
        byId["unknown-headers"],
        byId.dictionary,
        byId["unknown-words"],
        byId.suggestions,
        byId.timeline,
      ],
    },
    {
      id: "templates",
      label: labels.navGroups.templates,
      items: [byId["erp-templates"], byId["customer-templates"], byId.fingerprints, byId.mappings],
    },
    {
      id: "governance",
      label: labels.navGroups.governance,
      items: [byId.history, byId.search],
    },
    {
      id: "admin",
      label: labels.navGroups.admin,
      items: [byId.admin],
    },
  ];
}
