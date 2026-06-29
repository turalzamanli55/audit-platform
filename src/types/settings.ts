import type { ThemeMode } from "./theme";
import type { Locale } from "@/i18n";

export type UserSettings = {
  theme: ThemeMode;
  locale: Locale;
  timezone: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  digestFrequency: "immediate" | "daily" | "weekly";
};

export type SettingsContextValue = {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
};
