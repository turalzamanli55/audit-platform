import { describe, expect, it } from "vitest";
import { ConflictError, ValidationError } from "@/lib/errors";
import {
  assertCompanyWorkspaceOwnership,
  assertSubsidiaryParent,
  detectUniquenessConflicts,
  isValidFiscalYearEnd,
  validateCompanySettings,
  validateCreateCompanyInput,
} from "@/lib/company/validation";

describe("company validation", () => {
  it("validates required company settings", () => {
    const settings = validateCompanySettings({
      reporting_framework: "IFRS",
      functional_currency: "USD",
      fiscal_year_end_month: 12,
      fiscal_year_end_day: 31,
      jurisdiction: "US",
      industry_classification: "general",
      entity_type: "standalone",
    });

    expect(settings.functional_currency).toBe("USD");
    expect(settings.jurisdiction).toBe("US");
  });

  it("rejects invalid fiscal year end dates", () => {
    expect(isValidFiscalYearEnd(2, 31)).toBe(false);
    expect(() =>
      validateCompanySettings({
        reporting_framework: "IFRS",
        functional_currency: "USD",
        fiscal_year_end_month: 2,
        fiscal_year_end_day: 31,
        jurisdiction: "US",
        industry_classification: "general",
        entity_type: "standalone",
      }),
    ).toThrow(ValidationError);
  });

  it("rejects duplicate legal names within a workspace", () => {
    expect(() =>
      detectUniquenessConflicts(
        [
          {
            id: "company-1",
            workspace_id: "ws-1",
            organization_id: "org-1",
            legal_name: "Acme Ltd",
            name: "Acme Ltd",
            registration_number: null,
            slug: "acme-ltd",
            deleted_at: null,
          },
        ],
        { legalName: "Acme Ltd" },
      ),
    ).toThrow(ConflictError);
  });

  it("enforces workspace ownership", () => {
    expect(() =>
      assertCompanyWorkspaceOwnership(
        { id: "company-1", workspace_id: "ws-1" },
        "ws-2",
      ),
    ).toThrow(ConflictError);
  });

  it("requires a parent company for subsidiaries", () => {
    expect(() =>
      assertSubsidiaryParent(
        {
          reporting_framework: "IFRS",
          functional_currency: "USD",
          fiscal_year_end_month: 12,
          fiscal_year_end_day: 31,
          jurisdiction: "US",
          industry_classification: "general",
          entity_type: "subsidiary",
          parent_company_id: "parent-1",
        },
        null,
        "org-1",
      ),
    ).toThrow(ValidationError);
  });

  it("validates create input and derives slug", () => {
    const result = validateCreateCompanyInput({
      legalName: "Acme Holdings",
      settings: {
        reporting_framework: "IFRS",
        functional_currency: "USD",
        fiscal_year_end_month: 12,
        fiscal_year_end_day: 31,
        jurisdiction: "US",
        industry_classification: "general",
        entity_type: "standalone",
      },
    });

    expect(result.slug).toBe("acme-holdings");
    expect(result.legalName).toBe("Acme Holdings");
  });
});
