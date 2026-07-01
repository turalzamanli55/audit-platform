import {
  ENTITY_TYPES,
  INDUSTRY_CLASSIFICATIONS,
  REPORTING_FRAMEWORKS,
} from "@/constants/company";
import { ConflictError, ValidationError } from "@/lib/errors";
import type {
  CompanySettings,
  CompanyUniquenessInput,
  EntityType,
  IndustryClassification,
  ReportingFramework,
} from "@/types/company";
import { toSlug } from "@/utils/auth-validation";

type CompanyOwnershipRecord = {
  id: string;
  workspace_id: string;
  organization_id: string;
  legal_name: string | null;
  name: string;
  registration_number: string | null;
  slug: string;
  deleted_at: string | null;
};

const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

export function normalizeLegalName(value: string): string {
  return value.trim();
}

export function isValidCurrencyCode(value: string): boolean {
  return CURRENCY_CODE_PATTERN.test(value.trim().toUpperCase());
}

export function isValidFiscalYearEnd(month: number, day: number): boolean {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return false;
  }
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return false;
  }

  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

export function isReportingFramework(value: string): value is ReportingFramework {
  return (REPORTING_FRAMEWORKS as readonly string[]).includes(value);
}

export function isEntityType(value: string): value is EntityType {
  return (ENTITY_TYPES as readonly string[]).includes(value);
}

export function isIndustryClassification(value: string): value is IndustryClassification {
  return (INDUSTRY_CLASSIFICATIONS as readonly string[]).includes(value);
}

export function validateCompanySettings(settings: Partial<CompanySettings>): CompanySettings {
  const reportingFramework = settings.reporting_framework;
  if (!reportingFramework || !isReportingFramework(reportingFramework)) {
    throw new ValidationError("Reporting framework is required");
  }

  const functionalCurrency = settings.functional_currency?.trim().toUpperCase();
  if (!functionalCurrency || !isValidCurrencyCode(functionalCurrency)) {
    throw new ValidationError("Functional currency is required and must be a valid ISO 4217 code");
  }

  const presentationCurrency = settings.presentation_currency?.trim().toUpperCase() ?? null;
  if (presentationCurrency && !isValidCurrencyCode(presentationCurrency)) {
    throw new ValidationError("Presentation currency must be a valid ISO 4217 code");
  }

  const fiscalMonth = settings.fiscal_year_end_month;
  const fiscalDay = settings.fiscal_year_end_day;
  if (
    fiscalMonth === undefined ||
    fiscalDay === undefined ||
    !isValidFiscalYearEnd(fiscalMonth, fiscalDay)
  ) {
    throw new ValidationError("Fiscal year end requires a valid month and day");
  }

  const jurisdiction = settings.jurisdiction?.trim();
  if (!jurisdiction) {
    throw new ValidationError("Jurisdiction is required");
  }

  const industry = settings.industry_classification;
  if (!industry || !isIndustryClassification(industry)) {
    throw new ValidationError("Industry classification is required");
  }

  const entityType = settings.entity_type;
  if (!entityType || !isEntityType(entityType)) {
    throw new ValidationError("Entity type is required");
  }

  if (entityType === "subsidiary" && !settings.parent_company_id) {
    throw new ValidationError("Subsidiary entities require a parent company");
  }

  return {
    reporting_framework: reportingFramework,
    functional_currency: functionalCurrency,
    presentation_currency: presentationCurrency,
    fiscal_year_end_month: fiscalMonth,
    fiscal_year_end_day: fiscalDay,
    jurisdiction,
    industry_classification: industry,
    entity_type: entityType,
    parent_company_id: settings.parent_company_id ?? null,
    registered_address: settings.registered_address ?? null,
    operating_address: settings.operating_address ?? null,
    primary_finance_contact: settings.primary_finance_contact ?? null,
    external_auditor_contact: settings.external_auditor_contact ?? null,
    branding: settings.branding ?? null,
    preferences: settings.preferences ?? null,
    validation: settings.validation,
  };
}

export type CreateCompanyValidationInput = {
  legalName: string;
  name?: string;
  registrationNumber?: string | null;
  description?: string | null;
  settings: Partial<CompanySettings>;
};

export function validateCreateCompanyInput(input: CreateCompanyValidationInput): {
  legalName: string;
  name: string;
  slug: string;
  registrationNumber: string | null;
  description: string | null;
  settings: CompanySettings;
} {
  const legalName = normalizeLegalName(input.legalName);
  if (!legalName) {
    throw new ValidationError("Legal name is required");
  }

  const name = normalizeLegalName(input.name ?? legalName);
  if (!name) {
    throw new ValidationError("Company name is required");
  }

  const slug = toSlug(legalName);
  if (!slug) {
    throw new ValidationError("Legal name must contain valid characters");
  }

  const settings = validateCompanySettings(input.settings);

  return {
    legalName,
    name,
    slug,
    registrationNumber: input.registrationNumber?.trim() || null,
    description: input.description?.trim() || null,
    settings,
  };
}

export type UpdateCompanyValidationInput = {
  name?: string;
  legalName?: string;
  registrationNumber?: string | null;
  description?: string | null;
};

export function validateUpdateCompanyInput(input: UpdateCompanyValidationInput): UpdateCompanyValidationInput {
  const result: UpdateCompanyValidationInput = {};

  if (input.name !== undefined) {
    const name = normalizeLegalName(input.name);
    if (!name) {
      throw new ValidationError("Company name cannot be empty");
    }
    result.name = name;
  }

  if (input.legalName !== undefined) {
    const legalName = normalizeLegalName(input.legalName);
    if (!legalName) {
      throw new ValidationError("Legal name cannot be empty");
    }
    result.legalName = legalName;
  }

  if (input.registrationNumber !== undefined) {
    result.registrationNumber = input.registrationNumber?.trim() || null;
  }

  if (input.description !== undefined) {
    result.description = input.description?.trim() || null;
  }

  return result;
}

export function assertCompanyWorkspaceOwnership(
  company: Pick<CompanyOwnershipRecord, "workspace_id" | "id">,
  workspaceId: string,
): void {
  if (company.workspace_id !== workspaceId) {
    throw new ConflictError("Company does not belong to the active workspace", {
      companyId: company.id,
      workspaceId,
    });
  }
}

export function assertSubsidiaryParent(
  settings: CompanySettings,
  parent: Pick<CompanyOwnershipRecord, "organization_id" | "deleted_at"> | null,
  organizationId: string,
): void {
  if (settings.entity_type !== "subsidiary") {
    return;
  }

  if (!settings.parent_company_id) {
    throw new ValidationError("Subsidiary entities require a parent company");
  }

  if (!parent) {
    throw new ValidationError("Parent company was not found");
  }

  if (parent.organization_id !== organizationId) {
    throw new ValidationError("Parent company must belong to the same organization");
  }

  if (parent.deleted_at) {
    throw new ValidationError("Parent company is not active");
  }
}

export function detectUniquenessConflicts(
  companies: CompanyOwnershipRecord[],
  input: CompanyUniquenessInput,
): void {
  const legalName = input.legalName ? normalizeLegalName(input.legalName).toLowerCase() : null;
  const registrationNumber = input.registrationNumber?.trim() || null;
  const slug = input.slug?.trim().toLowerCase() || null;

  for (const company of companies) {
    if (input.excludeCompanyId && company.id === input.excludeCompanyId) {
      continue;
    }

    if (legalName) {
      const existingLegal = normalizeLegalName(company.legal_name ?? company.name).toLowerCase();
      if (existingLegal === legalName) {
        throw new ConflictError("Legal name must be unique within the workspace");
      }
    }

    if (registrationNumber && company.registration_number === registrationNumber) {
      throw new ConflictError("Registration number must be unique within the workspace");
    }

    if (slug && company.slug.toLowerCase() === slug) {
      throw new ConflictError("Company slug must be unique within the workspace");
    }
  }
}
