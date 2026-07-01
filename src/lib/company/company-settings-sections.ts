export const COMPANY_SETTINGS_SECTIONS = [
  "general",
  "reporting",
  "financial",
  "contacts",
  "preferences",
  "validation",
] as const;

export type CompanySettingsSection = (typeof COMPANY_SETTINGS_SECTIONS)[number];

export type CompanySettingsSaveState = "idle" | "saving" | "saved" | "error";

export type CompanySettingsNavItem = {
  id: CompanySettingsSection;
  label: string;
  href: string;
};
