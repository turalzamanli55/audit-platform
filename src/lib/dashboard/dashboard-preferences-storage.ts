import { siteConfig } from "@/config/site";
import {
  DEFAULT_DASHBOARD_PREFERENCES,
  type DashboardPreferences,
  type DashboardWidgetId,
  isDashboardWidgetId,
} from "@/types/dashboard-preferences";
import type { UserSettings } from "@/types/settings";

const SETTINGS_STORAGE_KEY = `${siteConfig.name.toLowerCase().replace(/\s+/g, "-")}:user-settings`;
const SETTINGS_STORAGE_VERSION = 1;

type StoredSettings = {
  version: number;
  settings: Partial<UserSettings>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function mergeDashboardPreferences(
  partial?: Partial<DashboardPreferences>,
): DashboardPreferences {
  if (!partial) return DEFAULT_DASHBOARD_PREFERENCES;

  const widgets = { ...DEFAULT_DASHBOARD_PREFERENCES.widgets };
  if (partial.widgets) {
    for (const [id, value] of Object.entries(partial.widgets)) {
      if (isDashboardWidgetId(id) && isRecord(value)) {
        widgets[id] = { ...widgets[id], ...value };
      }
    }
  }

  return {
    ...DEFAULT_DASHBOARD_PREFERENCES,
    ...partial,
    widgets,
    favoriteWidgetIds: (partial.favoriteWidgetIds ?? []).filter(isDashboardWidgetId),
  };
}

export function loadStoredSettings(): Partial<UserSettings> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredSettings;
    if (!isRecord(parsed) || parsed.version !== SETTINGS_STORAGE_VERSION) {
      return null;
    }

    const settings = parsed.settings;
    if (!isRecord(settings)) return null;

    return {
      ...settings,
      dashboard: mergeDashboardPreferences(settings.dashboard as Partial<DashboardPreferences>),
    };
  } catch {
    return null;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return;

  const payload: StoredSettings = {
    version: SETTINGS_STORAGE_VERSION,
    settings,
  };

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
}

export function updateWidgetPreference(
  preferences: DashboardPreferences,
  widgetId: DashboardWidgetId,
  partial: Partial<DashboardPreferences["widgets"][DashboardWidgetId]>,
): DashboardPreferences {
  return {
    ...preferences,
    widgets: {
      ...preferences.widgets,
      [widgetId]: {
        ...preferences.widgets[widgetId],
        ...partial,
      },
    },
  };
}

export function moveWidget(
  preferences: DashboardPreferences,
  widgetId: DashboardWidgetId,
  direction: "up" | "down",
): DashboardPreferences {
  const widget = preferences.widgets[widgetId];
  const columnWidgets = Object.entries(preferences.widgets)
    .filter(([, value]) => value.column === widget.column)
    .sort(([, left], [, right]) => left.order - right.order)
    .map(([id]) => id as DashboardWidgetId);

  const index = columnWidgets.indexOf(widgetId);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= columnWidgets.length) {
    return preferences;
  }

  const targetId = columnWidgets[targetIndex]!;
  const nextWidgets = { ...preferences.widgets };
  const currentOrder = nextWidgets[widgetId].order;
  nextWidgets[widgetId] = { ...nextWidgets[widgetId], order: nextWidgets[targetId].order };
  nextWidgets[targetId] = { ...nextWidgets[targetId], order: currentOrder };

  return { ...preferences, widgets: nextWidgets };
}

export function trackRecentCompany(
  preferences: DashboardPreferences,
  companyId: string,
  limit = 6,
): DashboardPreferences {
  const next = [companyId, ...preferences.recentCompanyIds.filter((id) => id !== companyId)].slice(
    0,
    limit,
  );
  return { ...preferences, recentCompanyIds: next };
}

export function toggleFavoriteCompany(
  preferences: DashboardPreferences,
  companyId: string,
): DashboardPreferences {
  const exists = preferences.favoriteCompanyIds.includes(companyId);
  return {
    ...preferences,
    favoriteCompanyIds: exists
      ? preferences.favoriteCompanyIds.filter((id) => id !== companyId)
      : [...preferences.favoriteCompanyIds, companyId],
  };
}

export function toggleFavoriteWidget(
  preferences: DashboardPreferences,
  widgetId: DashboardWidgetId,
): DashboardPreferences {
  const exists = preferences.favoriteWidgetIds.includes(widgetId);
  return {
    ...preferences,
    favoriteWidgetIds: exists
      ? preferences.favoriteWidgetIds.filter((id) => id !== widgetId)
      : [...preferences.favoriteWidgetIds, widgetId],
  };
}
