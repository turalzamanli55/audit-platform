import type { CreateCompanyActionInput } from "@/lib/actions/company/create-company";
import { DEFAULT_COMPANY_SETTINGS } from "@/lib/company/settings";
import type {
  EntityType,
  IndustryClassification,
  ReportingFramework,
} from "@/types/company";

export const COMPANY_WIZARD_DRAFT_VERSION = 1;
export const COMPANY_WIZARD_DRAFT_STORAGE_KEY = "audit.company-wizard.draft";

export type CompanyWizardStep = 1 | 2 | 3 | 4 | 5;

export type CompanyWizardDraft = {
  version: number;
  step: CompanyWizardStep;
  legalName: string;
  name: string;
  tradeName: string;
  registrationNumber: string;
  description: string;
  entityType: EntityType;
  parentCompanyId: string;
  industryClassification: IndustryClassification;
  jurisdiction: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
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
};

export const DEFAULT_COMPANY_WIZARD_DRAFT: CompanyWizardDraft = {
  version: COMPANY_WIZARD_DRAFT_VERSION,
  step: 1,
  legalName: "",
  name: "",
  tradeName: "",
  registrationNumber: "",
  description: "",
  entityType: DEFAULT_COMPANY_SETTINGS.entity_type,
  parentCompanyId: "",
  industryClassification: DEFAULT_COMPANY_SETTINGS.industry_classification,
  jurisdiction: "",
  addressLine1: "",
  addressLine2: "",
  addressCity: "",
  addressRegion: "",
  addressPostalCode: "",
  addressCountry: "",
  reportingFramework: DEFAULT_COMPANY_SETTINGS.reporting_framework,
  functionalCurrency: DEFAULT_COMPANY_SETTINGS.functional_currency,
  presentationCurrency: "",
  fiscalYearEndMonth: DEFAULT_COMPANY_SETTINGS.fiscal_year_end_month,
  fiscalYearEndDay: DEFAULT_COMPANY_SETTINGS.fiscal_year_end_day,
  financeContactName: "",
  financeContactEmail: "",
  financeContactPhone: "",
  financeContactTitle: "",
  auditorContactName: "",
  auditorContactEmail: "",
  auditorContactPhone: "",
  auditorContactTitle: "",
};

export function draftToCreateCompanyInput(draft: CompanyWizardDraft): CreateCompanyActionInput {
  const registeredAddress =
    draft.addressLine1.trim() ||
    draft.addressLine2.trim() ||
    draft.addressCity.trim() ||
    draft.addressRegion.trim() ||
    draft.addressPostalCode.trim() ||
    draft.addressCountry.trim()
      ? {
          line1: draft.addressLine1.trim() || null,
          line2: draft.addressLine2.trim() || null,
          city: draft.addressCity.trim() || null,
          region: draft.addressRegion.trim() || null,
          postal_code: draft.addressPostalCode.trim() || null,
          country: draft.addressCountry.trim() || null,
        }
      : null;

  const primaryFinanceContact =
    draft.financeContactName.trim() ||
    draft.financeContactEmail.trim() ||
    draft.financeContactPhone.trim() ||
    draft.financeContactTitle.trim()
      ? {
          name: draft.financeContactName.trim() || null,
          email: draft.financeContactEmail.trim() || null,
          phone: draft.financeContactPhone.trim() || null,
          title: draft.financeContactTitle.trim() || null,
        }
      : null;

  const externalAuditorContact =
    draft.auditorContactName.trim() ||
    draft.auditorContactEmail.trim() ||
    draft.auditorContactPhone.trim() ||
    draft.auditorContactTitle.trim()
      ? {
          name: draft.auditorContactName.trim() || null,
          email: draft.auditorContactEmail.trim() || null,
          phone: draft.auditorContactPhone.trim() || null,
          title: draft.auditorContactTitle.trim() || null,
        }
      : null;

  return {
    legalName: draft.legalName,
    name: draft.name.trim() || undefined,
    registrationNumber: draft.registrationNumber.trim() || null,
    description: draft.description.trim() || null,
    jurisdiction: draft.jurisdiction,
    reportingFramework: draft.reportingFramework,
    functionalCurrency: draft.functionalCurrency,
    presentationCurrency: draft.presentationCurrency.trim() || null,
    fiscalYearEndMonth: draft.fiscalYearEndMonth,
    fiscalYearEndDay: draft.fiscalYearEndDay,
    industryClassification: draft.industryClassification,
    entityType: draft.entityType,
    parentCompanyId: draft.parentCompanyId.trim() || null,
    settings: {
      registered_address: registeredAddress,
      primary_finance_contact: primaryFinanceContact,
      external_auditor_contact: externalAuditorContact,
      branding: {
        trade_name: draft.tradeName.trim() || null,
        logo_url: null,
      },
    },
  };
}

export function mergeWizardDraft(
  current: CompanyWizardDraft,
  patch: Partial<CompanyWizardDraft>,
): CompanyWizardDraft {
  return {
    ...current,
    ...patch,
    version: COMPANY_WIZARD_DRAFT_VERSION,
  };
}
