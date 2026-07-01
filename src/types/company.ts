import {
  ENTITY_TYPES,
  INDUSTRY_CLASSIFICATIONS,
  REPORTING_FRAMEWORKS,
} from "@/constants/company";

export type ReportingFramework = (typeof REPORTING_FRAMEWORKS)[number];
export type EntityType = (typeof ENTITY_TYPES)[number];
export type IndustryClassification = (typeof INDUSTRY_CLASSIFICATIONS)[number];

export type CompanyAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  region?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

export type CompanyContact = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
};

export type CompanyBranding = {
  trade_name?: string | null;
  logo_url?: string | null;
};

export type CompanyPreferences = {
  default_locale?: string | null;
  data_import_source?: string | null;
  rounding_convention?: string | null;
};

export type CompanyValidationMetadata = {
  schema_version: number;
  validated_at?: string | null;
  validated_by?: string | null;
};

export type CompanySettings = {
  reporting_framework: ReportingFramework;
  functional_currency: string;
  presentation_currency?: string | null;
  fiscal_year_end_month: number;
  fiscal_year_end_day: number;
  jurisdiction: string;
  industry_classification: IndustryClassification;
  entity_type: EntityType;
  parent_company_id?: string | null;
  registered_address?: CompanyAddress | null;
  operating_address?: CompanyAddress | null;
  primary_finance_contact?: CompanyContact | null;
  external_auditor_contact?: CompanyContact | null;
  branding?: CompanyBranding | null;
  preferences?: CompanyPreferences | null;
  validation?: CompanyValidationMetadata;
};

export type CompanyUniquenessInput = {
  legalName?: string;
  registrationNumber?: string | null;
  slug?: string;
  excludeCompanyId?: string;
};
