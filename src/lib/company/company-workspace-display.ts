import type { Dictionary } from "@/i18n/get-dictionary";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import type { CompanyWorkspaceSection } from "@/lib/company/company-workspace-view";
import type { WorkspaceNavItem } from "@/lib/workspace/workspace-nav";
import {
  formatDate,
  formatEntityTypeLabel,
  formatFiscalYearEnd,
  formatFrameworkLabel,
  formatIndustryLabel,
  formatOptionalText,
} from "@/lib/company/format-company-workspace";

export type CompanyWorkspaceNavItem = WorkspaceNavItem<CompanyWorkspaceSection>;
export type CompanyWorkspaceLabels = Dictionary["companies"]["workspace"];

export function buildCompanyWorkspaceNavItems(
  locale: string,
  slug: string,
  labels: CompanyWorkspaceLabels,
): CompanyWorkspaceNavItem[] {
  const base = `/${locale}/app/companies/${slug}`;

  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "identity", label: labels.navIdentity, href: `${base}/identity` },
    { id: "financial", label: labels.navFinancial, href: `${base}/financial` },
    { id: "import", label: labels.navImport, href: `${base}/import` },
    { id: "compliance", label: labels.navCompliance, href: `${base}/compliance` },
    { id: "contacts", label: labels.navContacts, href: `${base}/contacts` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildWorkspaceHeroLabels(
  labels: CompanyWorkspaceLabels,
  companiesLabels: Dictionary["companies"],
  commonLabels: Dictionary["common"],
): {
  breadcrumbRoot: string;
  eyebrow: string;
  tradeName: string;
  statusActive: string;
  statusInactive: string;
  statusArchived: string;
  statusSuspended: string;
  archivedTitle: string;
  archivedDescription: string;
  backToLabel: string;
} {
  return {
    breadcrumbRoot: companiesLabels.breadcrumbRoot,
    eyebrow: labels.heroEyebrow,
    tradeName: companiesLabels.create.tradeName,
    statusActive: companiesLabels.filterActive,
    statusInactive: companiesLabels.filterInactive,
    statusArchived: companiesLabels.filterArchived,
    statusSuspended: companiesLabels.filterSuspended,
    archivedTitle: labels.archivedBannerTitle,
    archivedDescription: labels.archivedBannerDescription,
    backToLabel: commonLabels.backTo,
  };
}

export function buildOverviewSummaryCards(
  company: CompanyWorkspaceView,
  locale: string,
  labels: CompanyWorkspaceLabels,
  companiesLabels: Dictionary["companies"],
) {
  const { settings } = company;

  return [
    {
      id: "framework",
      label: labels.summaryFramework,
      value: formatFrameworkLabel(settings.reporting_framework, companiesLabels),
    },
    {
      id: "currency",
      label: labels.summaryCurrency,
      value: settings.functional_currency,
      hint: settings.presentation_currency
        ? `${labels.summaryPresentationCurrency}: ${settings.presentation_currency}`
        : undefined,
    },
    {
      id: "fiscal",
      label: labels.summaryFiscalYear,
      value: formatFiscalYearEnd(settings, companiesLabels.create.months),
    },
    {
      id: "entity",
      label: labels.summaryEntityType,
      value: formatEntityTypeLabel(settings.entity_type, companiesLabels.create.entityTypes),
      hint: formatIndustryLabel(
        settings.industry_classification,
        companiesLabels.create.industries,
      ),
    },
  ];
}

export function buildOverviewMetadataItems(
  company: CompanyWorkspaceView,
  locale: string,
  labels: CompanyWorkspaceLabels,
  companiesLabels: Dictionary["companies"],
) {
  const { settings } = company;

  return [
    {
      id: "legal-name",
      label: companiesLabels.columnLegalName,
      value: formatOptionalText(company.legalName),
    },
    {
      id: "registration",
      label: companiesLabels.create.registrationNumber,
      value: formatOptionalText(company.registrationNumber),
    },
    {
      id: "jurisdiction",
      label: companiesLabels.create.jurisdiction,
      value: formatOptionalText(settings.jurisdiction),
    },
    {
      id: "slug",
      label: labels.metadataSlug,
      value: company.slug,
    },
    {
      id: "created",
      label: labels.metadataCreated,
      value: formatDate(company.createdAt, locale),
    },
    {
      id: "updated",
      label: companiesLabels.columnUpdated,
      value: formatDate(company.updatedAt, locale),
    },
  ];
}

export function workspaceSectionTitle(
  section: CompanyWorkspaceSection,
  labels: CompanyWorkspaceLabels,
): string {
  switch (section) {
    case "overview":
      return labels.sections.overview.title;
    case "identity":
      return labels.sections.identity.title;
    case "financial":
      return labels.sections.financial.title;
    case "import":
      return labels.sections.import.title;
    case "compliance":
      return labels.sections.compliance.title;
    case "contacts":
      return labels.sections.contacts.title;
    case "history":
      return labels.sections.history.title;
    case "settings":
      return labels.sections.settings.title;
    default:
      return section;
  }
}
