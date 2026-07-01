import type { ThemeMode } from "./theme";
import type { Locale } from "@/i18n";
import type { DashboardCommandHandlers, DashboardPreferences } from "./dashboard-preferences";

export type UserSettings = {
  theme: ThemeMode;
  locale: Locale;
  timezone: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  digestFrequency: "immediate" | "daily" | "weekly";
  dashboard: DashboardPreferences;
};

export type SettingsContextValue = {
  settings: UserSettings;
  hydrated: boolean;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
  updateDashboardPreferences: (
    updater: (current: DashboardPreferences) => DashboardPreferences,
  ) => void;
  resetDashboardPreferences: () => void;
  registerDashboardCommands: (handlers: DashboardCommandHandlers | null) => void;
  dashboardCommands: DashboardCommandHandlers | null;
};
