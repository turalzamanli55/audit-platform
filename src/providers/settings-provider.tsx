"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n";
import {
  loadStoredSettings,
  saveStoredSettings,
} from "@/lib/dashboard/dashboard-preferences-storage";
import {
  DEFAULT_DASHBOARD_PREFERENCES,
  type DashboardCommandHandlers,
  type DashboardPreferences,
} from "@/types/dashboard-preferences";
import type { SettingsContextValue, UserSettings } from "@/types/settings";
import type { ThemeMode } from "@/types/theme";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  locale: "az",
  timezone: "Asia/Baku",
  emailNotifications: true,
  inAppNotifications: true,
  digestFrequency: "immediate",
  dashboard: DEFAULT_DASHBOARD_PREFERENCES,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

type SettingsProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

export function SettingsProvider({ children, initialLocale = "az" }: SettingsProviderProps) {
  const [settings, setSettings] = useState<UserSettings>({
    ...DEFAULT_SETTINGS,
    locale: initialLocale,
  });
  const [hydrated, setHydrated] = useState(false);
  const [dashboardCommands, setDashboardCommands] = useState<DashboardCommandHandlers | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;

      const stored = loadStoredSettings();
      if (stored) {
        setSettings((current) => ({
          ...current,
          ...stored,
          locale: initialLocale,
          dashboard: stored.dashboard ?? DEFAULT_DASHBOARD_PREFERENCES,
        }));
      }

      setHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [initialLocale]);

  useEffect(() => {
    if (!hydrated) return;
    saveStoredSettings(settings);
  }, [settings, hydrated]);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS, locale: initialLocale });
  }, [initialLocale]);

  const updateDashboardPreferences = useCallback(
    (updater: (current: DashboardPreferences) => DashboardPreferences) => {
      setSettings((prev) => ({
        ...prev,
        dashboard: updater(prev.dashboard),
      }));
    },
    [],
  );

  const resetDashboardPreferences = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      dashboard: DEFAULT_DASHBOARD_PREFERENCES,
    }));
  }, []);

  const registerDashboardCommands = useCallback((handlers: DashboardCommandHandlers | null) => {
    setDashboardCommands(handlers);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      hydrated,
      updateSettings,
      resetSettings,
      updateDashboardPreferences,
      resetDashboardPreferences,
      registerDashboardCommands,
      dashboardCommands,
    }),
    [
      settings,
      hydrated,
      updateSettings,
      resetSettings,
      updateDashboardPreferences,
      resetDashboardPreferences,
      registerDashboardCommands,
      dashboardCommands,
    ],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}

export type { ThemeMode };
