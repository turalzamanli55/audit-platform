import type { Dictionary } from "@/i18n/get-dictionary";
import type { EngagementLifecycleStatus, EngagementType } from "@/types/engagement";

const EM_DASH = "—";

export function formatFrameworkLabel(
  framework: string,
  labels: Pick<
    Dictionary["engagements"],
    "frameworkIfrs" | "frameworkLocalGaap" | "frameworkOther"
  >,
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

export function formatEngagementTypeLabel(
  engagementType: EngagementType,
  labels: Dictionary["engagements"]["create"]["engagementTypes"],
): string {
  return labels[engagementType] ?? engagementType;
}

export function formatLifecycleStatusLabel(
  lifecycleStatus: EngagementLifecycleStatus,
  labels: Dictionary["engagements"]["lifecycleStatuses"],
): string {
  return labels[lifecycleStatus] ?? lifecycleStatus;
}

export function formatOptionalText(value: string | null | undefined): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return EM_DASH;
}

export function formatDate(value: string | null | undefined, locale: string): string {
  if (!value) {
    return EM_DASH;
  }

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

export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  locale: string,
): string {
  if (!start && !end) {
    return EM_DASH;
  }

  if (start && end) {
    return `${formatDate(start, locale)} – ${formatDate(end, locale)}`;
  }

  return formatDate(start ?? end, locale);
}
