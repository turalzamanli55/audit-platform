export const DASHBOARD_WIDGET_IDS = [
  "welcome",
  "kpi",
  "quick-actions",
  "activity",
  "continue",
  "tasks",
  "pinned",
  "ai",
  "calendar",
  "notifications",
  "insights",
  "shortcuts",
  "tips",
] as const;

export type DashboardWidgetId = (typeof DASHBOARD_WIDGET_IDS)[number];

export type DashboardWidgetColumn = "hero" | "main" | "side";

export type DashboardWidgetSize = "default" | "wide";

export type DashboardDensity = "comfortable" | "compact";

export type DashboardWidgetPreference = {
  visible: boolean;
  pinned: boolean;
  collapsed: boolean;
  expanded: boolean;
  size: DashboardWidgetSize;
  order: number;
  column: DashboardWidgetColumn;
};

export type DashboardPreferences = {
  version: 1;
  density: DashboardDensity;
  sidebarCollapsed: boolean;
  widgets: Record<DashboardWidgetId, DashboardWidgetPreference>;
  favoriteWidgetIds: DashboardWidgetId[];
  favoriteCompanyIds: string[];
  recentCompanyIds: string[];
  favoriteEngagementIds: string[];
  recentEngagementIds: string[];
  favoriteReportIds: string[];
};

export type DashboardCommandHandlers = {
  customize: () => void;
  reset: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  searchCompanies: () => void;
  searchEngagements: () => void;
  openCalendar: () => void;
  openAi: () => void;
};

const HERO_WIDGETS: DashboardWidgetId[] = ["welcome", "kpi", "quick-actions"];
const MAIN_WIDGETS: DashboardWidgetId[] = ["activity", "continue", "tasks", "pinned"];
const SIDE_WIDGETS: DashboardWidgetId[] = [
  "calendar",
  "notifications",
  "insights",
];
const OPTIONAL_SIDE_WIDGETS: DashboardWidgetId[] = ["ai", "shortcuts", "tips"];

function buildDefaultWidgets(): Record<DashboardWidgetId, DashboardWidgetPreference> {
  const widgets = {} as Record<DashboardWidgetId, DashboardWidgetPreference>;

  HERO_WIDGETS.forEach((id, index) => {
    widgets[id] = {
      visible: true,
      pinned: false,
      collapsed: false,
      expanded: false,
      size: "default",
      order: index,
      column: "hero",
    };
  });

  MAIN_WIDGETS.forEach((id, index) => {
    widgets[id] = {
      visible: true,
      pinned: false,
      collapsed: false,
      expanded: false,
      size: "default",
      order: index,
      column: "main",
    };
  });

  SIDE_WIDGETS.forEach((id, index) => {
    widgets[id] = {
      visible: true,
      pinned: false,
      collapsed: false,
      expanded: false,
      size: "default",
      order: index,
      column: "side",
    };
  });

  OPTIONAL_SIDE_WIDGETS.forEach((id, index) => {
    widgets[id] = {
      visible: false,
      pinned: false,
      collapsed: false,
      expanded: false,
      size: "default",
      order: SIDE_WIDGETS.length + index,
      column: "side",
    };
  });

  return widgets;
}

export const DEFAULT_DASHBOARD_PREFERENCES: DashboardPreferences = {
  version: 1,
  density: "comfortable",
  sidebarCollapsed: false,
  widgets: buildDefaultWidgets(),
  favoriteWidgetIds: [],
  favoriteCompanyIds: [],
  recentCompanyIds: [],
  favoriteEngagementIds: [],
  recentEngagementIds: [],
  favoriteReportIds: [],
};

export function isDashboardWidgetId(value: string): value is DashboardWidgetId {
  return (DASHBOARD_WIDGET_IDS as readonly string[]).includes(value);
}

export function sortWidgetsByPreference(
  widgets: DashboardWidgetId[],
  preferences: Record<DashboardWidgetId, DashboardWidgetPreference>,
): DashboardWidgetId[] {
  return [...widgets].sort((left, right) => {
    const leftPref = preferences[left];
    const rightPref = preferences[right];
    if (leftPref.pinned !== rightPref.pinned) {
      return leftPref.pinned ? -1 : 1;
    }
    return leftPref.order - rightPref.order;
  });
}
