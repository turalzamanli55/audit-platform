"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n";
import type { SettingsContextValue, UserSettings } from "@/types/settings";
import type { ThemeMode } from "@/types/theme";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  locale: "az",
  timezone: "Asia/Baku",
  emailNotifications: true,
  inAppNotifications: true,
  digestFrequency: "immediate",
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

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS, locale: initialLocale });
  }, [initialLocale]);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, updateSettings, resetSettings }),
    [settings, updateSettings, resetSettings],
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
