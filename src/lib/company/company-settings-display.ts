import type { Locale } from "@/i18n";
import type {
  CompanySettingsSection,
  CompanySettingsNavItem,
} from "@/lib/company/company-settings-sections";

export function buildCompanySettingsNavItems(
  locale: string,
  slug: string,
  labels: Record<
    "navGeneral" | "navReporting" | "navFinancial" | "navContacts" | "navPreferences" | "navValidation",
    string
  >,
): CompanySettingsNavItem[] {
  const base = `/${locale}/app/companies/${slug}/settings`;

  return [
    { id: "general", label: labels.navGeneral, href: `${base}/general` },
    { id: "reporting", label: labels.navReporting, href: `${base}/reporting` },
    { id: "financial", label: labels.navFinancial, href: `${base}/financial` },
    { id: "contacts", label: labels.navContacts, href: `${base}/contacts` },
    { id: "preferences", label: labels.navPreferences, href: `${base}/preferences` },
    { id: "validation", label: labels.navValidation, href: `${base}/validation` },
  ];
}

export function companySettingsSectionPath(
  locale: Locale | string,
  slug: string,
  section: CompanySettingsSection,
): string {
  return `/${locale}/app/companies/${slug}/settings/${section}`;
}
