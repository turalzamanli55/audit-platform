import { ValidationError } from "@/lib/errors";
import { isValidEmail, toSlug } from "@/utils/auth-validation";
import type { CompanyWizardDraft, CompanyWizardStep } from "./company-wizard-draft";
import {
  isEntityType,
  isIndustryClassification,
  isReportingFramework,
  isValidCurrencyCode,
  isValidFiscalYearEnd,
  normalizeLegalName,
  validateCompanySettings,
  validateCreateCompanyInput,
} from "./validation";

export type WizardFieldErrors = Partial<Record<keyof CompanyWizardDraft | "submit", string>>;

function messageFromError(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.message;
  }
  return "Invalid value";
}

export function validateWizardStep(
  step: CompanyWizardStep,
  draft: CompanyWizardDraft,
): WizardFieldErrors {
  switch (step) {
    case 1:
      return validateIdentityStep(draft);
    case 2:
      return validateJurisdictionStep(draft);
    case 3:
      return validateFinancialStep(draft);
    case 4:
      return validateContactsStep(draft);
    case 5:
      return validateReviewStep(draft);
    default:
      return {};
  }
}

function validateIdentityStep(draft: CompanyWizardDraft): WizardFieldErrors {
  const errors: WizardFieldErrors = {};

  const legalName = normalizeLegalName(draft.legalName);
  if (!legalName) {
    errors.legalName = "Legal name is required";
  } else if (!toSlug(legalName)) {
    errors.legalName = "Legal name must contain valid characters";
  }

  if (draft.name.trim() && !normalizeLegalName(draft.name)) {
    errors.name = "Company name cannot be empty";
  }

  if (!isEntityType(draft.entityType)) {
    errors.entityType = "Entity type is required";
  }

  if (draft.entityType === "subsidiary" && !draft.parentCompanyId.trim()) {
    errors.parentCompanyId = "Parent company is required for subsidiaries";
  }

  if (!isIndustryClassification(draft.industryClassification)) {
    errors.industryClassification = "Industry classification is required";
  }

  return errors;
}

function validateJurisdictionStep(draft: CompanyWizardDraft): WizardFieldErrors {
  const errors: WizardFieldErrors = { ...validateIdentityStep(draft) };

  if (!draft.jurisdiction.trim()) {
    errors.jurisdiction = "Jurisdiction is required";
  }

  return errors;
}

function validateFinancialStep(draft: CompanyWizardDraft): WizardFieldErrors {
  const errors: WizardFieldErrors = { ...validateJurisdictionStep(draft) };

  try {
    validateCompanySettings({
      reporting_framework: draft.reportingFramework,
      functional_currency: draft.functionalCurrency,
      presentation_currency: draft.presentationCurrency.trim() || null,
      fiscal_year_end_month: draft.fiscalYearEndMonth,
      fiscal_year_end_day: draft.fiscalYearEndDay,
      jurisdiction: draft.jurisdiction,
      industry_classification: draft.industryClassification,
      entity_type: draft.entityType,
      parent_company_id: draft.parentCompanyId.trim() || null,
    });
  } catch (error) {
    const message = messageFromError(error);
    if (!isReportingFramework(draft.reportingFramework)) {
      errors.reportingFramework = message;
    } else if (!isValidCurrencyCode(draft.functionalCurrency)) {
      errors.functionalCurrency = message;
    } else if (
      draft.presentationCurrency.trim() &&
      !isValidCurrencyCode(draft.presentationCurrency)
    ) {
      errors.presentationCurrency = message;
    } else if (!isValidFiscalYearEnd(draft.fiscalYearEndMonth, draft.fiscalYearEndDay)) {
      errors.fiscalYearEndMonth = message;
      errors.fiscalYearEndDay = message;
    } else {
      errors.submit = message;
    }
  }

  return errors;
}

function validateContactsStep(draft: CompanyWizardDraft): WizardFieldErrors {
  const errors: WizardFieldErrors = { ...validateFinancialStep(draft) };

  if (draft.financeContactEmail.trim() && !isValidEmail(draft.financeContactEmail.trim())) {
    errors.financeContactEmail = "Enter a valid email address";
  }

  if (draft.auditorContactEmail.trim() && !isValidEmail(draft.auditorContactEmail.trim())) {
    errors.auditorContactEmail = "Enter a valid email address";
  }

  return errors;
}

function validateReviewStep(draft: CompanyWizardDraft): WizardFieldErrors {
  const errors: WizardFieldErrors = { ...validateContactsStep(draft) };

  try {
    validateCreateCompanyInput({
      legalName: draft.legalName,
      name: draft.name || draft.legalName,
      registrationNumber: draft.registrationNumber || null,
      description: draft.description || null,
      settings: {
        reporting_framework: draft.reportingFramework,
        functional_currency: draft.functionalCurrency,
        presentation_currency: draft.presentationCurrency.trim() || null,
        fiscal_year_end_month: draft.fiscalYearEndMonth,
        fiscal_year_end_day: draft.fiscalYearEndDay,
        jurisdiction: draft.jurisdiction,
        industry_classification: draft.industryClassification,
        entity_type: draft.entityType,
        parent_company_id: draft.parentCompanyId.trim() || null,
      },
    });
  } catch (error) {
    errors.submit = messageFromError(error);
  }

  return errors;
}

export function hasWizardFieldErrors(errors: WizardFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
