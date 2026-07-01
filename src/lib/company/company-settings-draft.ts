import type {
  CompanySettings,
  EntityType,
  IndustryClassification,
  ReportingFramework,
} from "@/types/company";
import { DEFAULT_COMPANY_SETTINGS } from "@/lib/company/settings";

export type CompanySettingsDraft = {
  jurisdiction: string;
  entityType: EntityType;
  parentCompanyId: string;
  industryClassification: IndustryClassification;
  registeredAddressLine1: string;
  registeredAddressLine2: string;
  registeredAddressCity: string;
  registeredAddressRegion: string;
  registeredAddressPostalCode: string;
  registeredAddressCountry: string;
  operatingAddressLine1: string;
  operatingAddressLine2: string;
  operatingAddressCity: string;
  operatingAddressRegion: string;
  operatingAddressPostalCode: string;
  operatingAddressCountry: string;
  reportingFramework: ReportingFramework;
  functionalCurrency: string;
  presentationCurrency: string;
  fiscalYearEndMonth: number;
  fiscalYearEndDay: number;
  financeContactName: string;
  financeContactEmail: string;
  financeContactPhone: string;
  financeContactTitle: string;
  auditorContactName: string;
  auditorContactEmail: string;
  auditorContactPhone: string;
  auditorContactTitle: string;
  tradeName: string;
  defaultLocale: string;
  dataImportSource: string;
  roundingConvention: string;
};

function addressField(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

export function settingsToDraft(settings: CompanySettings): CompanySettingsDraft {
  const registered = settings.registered_address;
  const operating = settings.operating_address;
  const finance = settings.primary_finance_contact;
  const auditor = settings.external_auditor_contact;
  const preferences = settings.preferences;

  return {
    jurisdiction: settings.jurisdiction?.trim() ?? "",
    entityType: settings.entity_type ?? DEFAULT_COMPANY_SETTINGS.entity_type,
    parentCompanyId: settings.parent_company_id?.trim() ?? "",
    industryClassification:
      settings.industry_classification ?? DEFAULT_COMPANY_SETTINGS.industry_classification,
    registeredAddressLine1: addressField(registered?.line1),
    registeredAddressLine2: addressField(registered?.line2),
    registeredAddressCity: addressField(registered?.city),
    registeredAddressRegion: addressField(registered?.region),
    registeredAddressPostalCode: addressField(registered?.postal_code),
    registeredAddressCountry: addressField(registered?.country),
    operatingAddressLine1: addressField(operating?.line1),
    operatingAddressLine2: addressField(operating?.line2),
    operatingAddressCity: addressField(operating?.city),
    operatingAddressRegion: addressField(operating?.region),
    operatingAddressPostalCode: addressField(operating?.postal_code),
    operatingAddressCountry: addressField(operating?.country),
    reportingFramework: settings.reporting_framework ?? DEFAULT_COMPANY_SETTINGS.reporting_framework,
    functionalCurrency: settings.functional_currency?.trim() ?? DEFAULT_COMPANY_SETTINGS.functional_currency,
    presentationCurrency: settings.presentation_currency?.trim() ?? "",
    fiscalYearEndMonth: settings.fiscal_year_end_month ?? DEFAULT_COMPANY_SETTINGS.fiscal_year_end_month,
    fiscalYearEndDay: settings.fiscal_year_end_day ?? DEFAULT_COMPANY_SETTINGS.fiscal_year_end_day,
    financeContactName: addressField(finance?.name),
    financeContactEmail: addressField(finance?.email),
    financeContactPhone: addressField(finance?.phone),
    financeContactTitle: addressField(finance?.title),
    auditorContactName: addressField(auditor?.name),
    auditorContactEmail: addressField(auditor?.email),
    auditorContactPhone: addressField(auditor?.phone),
    auditorContactTitle: addressField(auditor?.title),
    tradeName: addressField(settings.branding?.trade_name),
    defaultLocale: addressField(preferences?.default_locale),
    dataImportSource: addressField(preferences?.data_import_source),
    roundingConvention: addressField(preferences?.rounding_convention),
  };
}

function buildAddress(
  line1: string,
  line2: string,
  city: string,
  region: string,
  postalCode: string,
  country: string,
) {
  const hasValue =
    line1.trim() ||
    line2.trim() ||
    city.trim() ||
    region.trim() ||
    postalCode.trim() ||
    country.trim();

  if (!hasValue) {
    return null;
  }

  return {
    line1: line1.trim() || null,
    line2: line2.trim() || null,
    city: city.trim() || null,
    region: region.trim() || null,
    postal_code: postalCode.trim() || null,
    country: country.trim() || null,
  };
}

function buildContact(name: string, title: string, email: string, phone: string) {
  const hasValue = name.trim() || title.trim() || email.trim() || phone.trim();
  if (!hasValue) {
    return null;
  }

  return {
    name: name.trim() || null,
    title: title.trim() || null,
    email: email.trim() || null,
    phone: phone.trim() || null,
  };
}

export function draftToCompanySettings(
  draft: CompanySettingsDraft,
  validation: CompanySettings["validation"],
): CompanySettings {
  return {
    reporting_framework: draft.reportingFramework,
    functional_currency: draft.functionalCurrency.trim().toUpperCase(),
    presentation_currency: draft.presentationCurrency.trim()
      ? draft.presentationCurrency.trim().toUpperCase()
      : null,
    fiscal_year_end_month: draft.fiscalYearEndMonth,
    fiscal_year_end_day: draft.fiscalYearEndDay,
    jurisdiction: draft.jurisdiction.trim(),
    industry_classification: draft.industryClassification,
    entity_type: draft.entityType,
    parent_company_id:
      draft.entityType === "subsidiary" && draft.parentCompanyId.trim()
        ? draft.parentCompanyId.trim()
        : null,
    registered_address: buildAddress(
      draft.registeredAddressLine1,
      draft.registeredAddressLine2,
      draft.registeredAddressCity,
      draft.registeredAddressRegion,
      draft.registeredAddressPostalCode,
      draft.registeredAddressCountry,
    ),
    operating_address: buildAddress(
      draft.operatingAddressLine1,
      draft.operatingAddressLine2,
      draft.operatingAddressCity,
      draft.operatingAddressRegion,
      draft.operatingAddressPostalCode,
      draft.operatingAddressCountry,
    ),
    primary_finance_contact: buildContact(
      draft.financeContactName,
      draft.financeContactTitle,
      draft.financeContactEmail,
      draft.financeContactPhone,
    ),
    external_auditor_contact: buildContact(
      draft.auditorContactName,
      draft.auditorContactTitle,
      draft.auditorContactEmail,
      draft.auditorContactPhone,
    ),
    branding: {
      trade_name: draft.tradeName.trim() || null,
      logo_url: null,
    },
    preferences: {
      default_locale: draft.defaultLocale.trim() || null,
      data_import_source: draft.dataImportSource.trim() || null,
      rounding_convention: draft.roundingConvention.trim() || null,
    },
    validation,
  };
}

export function mergeSettingsDraft(
  current: CompanySettingsDraft,
  patch: Partial<CompanySettingsDraft>,
): CompanySettingsDraft {
  return { ...current, ...patch };
}

export function isSettingsDraftDirty(
  draft: CompanySettingsDraft,
  baseline: CompanySettingsDraft,
): boolean {
  return JSON.stringify(draft) !== JSON.stringify(baseline);
}

export function computeSettingsPatch(
  draft: CompanySettingsDraft,
  baselineSettings: CompanySettings,
): Partial<CompanySettings> {
  const baselineDraft = settingsToDraft(baselineSettings);
  const nextSettings = draftToCompanySettings(draft, baselineSettings.validation);
  const patch: Partial<CompanySettings> = {};

  if (draft.jurisdiction !== baselineDraft.jurisdiction) {
    patch.jurisdiction = nextSettings.jurisdiction;
  }
  if (draft.entityType !== baselineDraft.entityType) {
    patch.entity_type = nextSettings.entity_type;
  }
  if (draft.parentCompanyId !== baselineDraft.parentCompanyId) {
    patch.parent_company_id = nextSettings.parent_company_id;
  }
  if (draft.industryClassification !== baselineDraft.industryClassification) {
    patch.industry_classification = nextSettings.industry_classification;
  }
  if (
    draft.registeredAddressLine1 !== baselineDraft.registeredAddressLine1 ||
    draft.registeredAddressLine2 !== baselineDraft.registeredAddressLine2 ||
    draft.registeredAddressCity !== baselineDraft.registeredAddressCity ||
    draft.registeredAddressRegion !== baselineDraft.registeredAddressRegion ||
    draft.registeredAddressPostalCode !== baselineDraft.registeredAddressPostalCode ||
    draft.registeredAddressCountry !== baselineDraft.registeredAddressCountry
  ) {
    patch.registered_address = nextSettings.registered_address;
  }
  if (
    draft.operatingAddressLine1 !== baselineDraft.operatingAddressLine1 ||
    draft.operatingAddressLine2 !== baselineDraft.operatingAddressLine2 ||
    draft.operatingAddressCity !== baselineDraft.operatingAddressCity ||
    draft.operatingAddressRegion !== baselineDraft.operatingAddressRegion ||
    draft.operatingAddressPostalCode !== baselineDraft.operatingAddressPostalCode ||
    draft.operatingAddressCountry !== baselineDraft.operatingAddressCountry
  ) {
    patch.operating_address = nextSettings.operating_address;
  }
  if (draft.reportingFramework !== baselineDraft.reportingFramework) {
    patch.reporting_framework = nextSettings.reporting_framework;
  }
  if (draft.functionalCurrency !== baselineDraft.functionalCurrency) {
    patch.functional_currency = nextSettings.functional_currency;
  }
  if (draft.presentationCurrency !== baselineDraft.presentationCurrency) {
    patch.presentation_currency = nextSettings.presentation_currency;
  }
  if (
    draft.fiscalYearEndMonth !== baselineDraft.fiscalYearEndMonth ||
    draft.fiscalYearEndDay !== baselineDraft.fiscalYearEndDay
  ) {
    patch.fiscal_year_end_month = nextSettings.fiscal_year_end_month;
    patch.fiscal_year_end_day = nextSettings.fiscal_year_end_day;
  }
  if (
    draft.financeContactName !== baselineDraft.financeContactName ||
    draft.financeContactTitle !== baselineDraft.financeContactTitle ||
    draft.financeContactEmail !== baselineDraft.financeContactEmail ||
    draft.financeContactPhone !== baselineDraft.financeContactPhone
  ) {
    patch.primary_finance_contact = nextSettings.primary_finance_contact;
  }
  if (
    draft.auditorContactName !== baselineDraft.auditorContactName ||
    draft.auditorContactTitle !== baselineDraft.auditorContactTitle ||
    draft.auditorContactEmail !== baselineDraft.auditorContactEmail ||
    draft.auditorContactPhone !== baselineDraft.auditorContactPhone
  ) {
    patch.external_auditor_contact = nextSettings.external_auditor_contact;
  }
  if (draft.tradeName !== baselineDraft.tradeName) {
    patch.branding = nextSettings.branding;
  }
  if (
    draft.defaultLocale !== baselineDraft.defaultLocale ||
    draft.dataImportSource !== baselineDraft.dataImportSource ||
    draft.roundingConvention !== baselineDraft.roundingConvention
  ) {
    patch.preferences = nextSettings.preferences;
  }

  return patch;
}
