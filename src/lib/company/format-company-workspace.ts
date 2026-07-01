import type { CompanyAddress, CompanyContact, CompanySettings } from "@/types/company";
import type { Dictionary } from "@/i18n/get-dictionary";

const EM_DASH = "—";

export function formatFrameworkLabel(
  framework: string,
  labels: Pick<Dictionary["companies"], "frameworkIfrs" | "frameworkLocalGaap" | "frameworkOther">,
): string {
  switch (framework) {
    case "IFRS":
      return labels.frameworkIfrs;
    case "LOCAL_GAAP":
      return labels.frameworkLocalGaap;
    default:
      return labels.frameworkOther;
  }
}

export function formatEntityTypeLabel(
  entityType: CompanySettings["entity_type"],
  labels: Dictionary["companies"]["create"]["entityTypes"],
): string {
  return labels[entityType] ?? entityType;
}

export function formatIndustryLabel(
  industry: CompanySettings["industry_classification"],
  labels: Dictionary["companies"]["create"]["industries"],
): string {
  return labels[industry] ?? industry;
}

export function formatFiscalYearEnd(
  settings: CompanySettings,
  months: string[],
): string {
  const monthIndex = settings.fiscal_year_end_month - 1;
  const month = months[monthIndex] ?? String(settings.fiscal_year_end_month);
  return `${month} ${settings.fiscal_year_end_day}`;
}

export function formatAddress(address: CompanyAddress | null | undefined): string | null {
  if (!address) {
    return null;
  }

  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.region,
    address.postal_code,
    address.country,
  ].filter((part) => typeof part === "string" && part.trim().length > 0);

  return parts.length > 0 ? parts.join(", ") : null;
}

export function formatContact(contact: CompanyContact | null | undefined): string | null {
  if (!contact) {
    return null;
  }

  const parts = [contact.name, contact.title, contact.email, contact.phone].filter(
    (part) => typeof part === "string" && part.trim().length > 0,
  );

  return parts.length > 0 ? parts.join(" · ") : null;
}

export function formatOptionalText(value: string | null | undefined): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return EM_DASH;
}

export function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
