import { COMPANY_SETTINGS_SCHEMA_VERSION } from "@/constants/company";
import type { CompanySettings } from "@/types/company";
import type { Json } from "@/types/supabase";

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  reporting_framework: "IFRS",
  functional_currency: "USD",
  presentation_currency: null,
  fiscal_year_end_month: 12,
  fiscal_year_end_day: 31,
  jurisdiction: "",
  industry_classification: "general",
  entity_type: "standalone",
  parent_company_id: null,
  registered_address: null,
  operating_address: null,
  primary_finance_contact: null,
  external_auditor_contact: null,
  branding: {
    trade_name: null,
    logo_url: null,
  },
  preferences: {
    default_locale: null,
    data_import_source: null,
    rounding_convention: null,
  },
  validation: {
    schema_version: COMPANY_SETTINGS_SCHEMA_VERSION,
    validated_at: null,
    validated_by: null,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseCompanySettings(raw: Json | CompanySettings | null | undefined): CompanySettings {
  if (!isRecord(raw)) {
    return { ...DEFAULT_COMPANY_SETTINGS };
  }

  const record = raw as Record<string, unknown>;

  const legacyFramework =
    typeof record.reporting_framework === "string"
      ? record.reporting_framework
      : typeof record.reporting_currency === "string"
        ? "OTHER"
        : DEFAULT_COMPANY_SETTINGS.reporting_framework;

  const legacyIndustry =
    typeof record.industry_classification === "string"
      ? record.industry_classification
      : typeof record.industry_code === "string"
        ? record.industry_code
        : DEFAULT_COMPANY_SETTINGS.industry_classification;

  return {
    ...DEFAULT_COMPANY_SETTINGS,
    reporting_framework: legacyFramework as CompanySettings["reporting_framework"],
    functional_currency:
      typeof record.functional_currency === "string"
        ? record.functional_currency
        : DEFAULT_COMPANY_SETTINGS.functional_currency,
    presentation_currency:
      typeof record.presentation_currency === "string" ? record.presentation_currency : null,
    fiscal_year_end_month:
      typeof record.fiscal_year_end_month === "number"
        ? record.fiscal_year_end_month
        : DEFAULT_COMPANY_SETTINGS.fiscal_year_end_month,
    fiscal_year_end_day:
      typeof record.fiscal_year_end_day === "number"
        ? record.fiscal_year_end_day
        : DEFAULT_COMPANY_SETTINGS.fiscal_year_end_day,
    jurisdiction:
      typeof record.jurisdiction === "string" ? record.jurisdiction : DEFAULT_COMPANY_SETTINGS.jurisdiction,
    industry_classification: legacyIndustry as CompanySettings["industry_classification"],
    entity_type:
      typeof record.entity_type === "string"
        ? (record.entity_type as CompanySettings["entity_type"])
        : DEFAULT_COMPANY_SETTINGS.entity_type,
    parent_company_id:
      typeof record.parent_company_id === "string" ? record.parent_company_id : null,
    registered_address: isRecord(record.registered_address)
      ? (record.registered_address as CompanySettings["registered_address"])
      : null,
    operating_address: isRecord(record.operating_address)
      ? (record.operating_address as CompanySettings["operating_address"])
      : null,
    primary_finance_contact: isRecord(record.primary_finance_contact)
      ? (record.primary_finance_contact as CompanySettings["primary_finance_contact"])
      : null,
    external_auditor_contact: isRecord(record.external_auditor_contact)
      ? (record.external_auditor_contact as CompanySettings["external_auditor_contact"])
      : null,
    branding: isRecord(record.branding)
      ? (record.branding as CompanySettings["branding"])
      : DEFAULT_COMPANY_SETTINGS.branding,
    preferences: isRecord(record.preferences)
      ? (record.preferences as CompanySettings["preferences"])
      : DEFAULT_COMPANY_SETTINGS.preferences,
    validation: isRecord(record.validation)
      ? {
          schema_version:
            typeof record.validation.schema_version === "number"
              ? record.validation.schema_version
              : COMPANY_SETTINGS_SCHEMA_VERSION,
          validated_at:
            typeof record.validation.validated_at === "string" ? record.validation.validated_at : null,
          validated_by:
            typeof record.validation.validated_by === "string" ? record.validation.validated_by : null,
        }
      : DEFAULT_COMPANY_SETTINGS.validation,
  };
}

export function mergeCompanySettings(
  current: CompanySettings,
  patch: Partial<CompanySettings>,
): CompanySettings {
  return {
    ...current,
    ...patch,
    branding: patch.branding ? { ...current.branding, ...patch.branding } : current.branding,
    preferences: patch.preferences
      ? { ...current.preferences, ...patch.preferences }
      : current.preferences,
    validation: {
      ...current.validation,
      ...patch.validation,
      schema_version: COMPANY_SETTINGS_SCHEMA_VERSION,
    },
  };
}

export function companySettingsToJson(settings: CompanySettings): Json {
  return settings as unknown as Json;
}
