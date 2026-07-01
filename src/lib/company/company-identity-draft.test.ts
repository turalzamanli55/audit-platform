import { describe, expect, it } from "vitest";
import {
  computeCompanyUpdateInput,
  computeIdentitySettingsPatch,
  isIdentityDraftDirty,
  workspaceToIdentityDraft,
} from "@/lib/company/company-identity-draft";
import { DEFAULT_COMPANY_SETTINGS } from "@/lib/company/settings";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";

function createWorkspace(overrides: Partial<CompanyWorkspaceView> = {}): CompanyWorkspaceView {
  return {
    id: "company-1",
    slug: "acme",
    name: "Acme",
    legalName: "Acme LLC",
    registrationNumber: "REG-1",
    description: "Description",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    version: 2,
    settingsVersion: 3,
    isArchived: false,
    deletedAt: null,
    settings: { ...DEFAULT_COMPANY_SETTINGS, jurisdiction: "AZ" },
    ...overrides,
  };
}

describe("company-identity-draft", () => {
  it("detects dirty identity drafts", () => {
    const company = createWorkspace();
    const baseline = workspaceToIdentityDraft(company);
    const changed = { ...baseline, legalName: "Acme Holdings LLC" };
    expect(isIdentityDraftDirty(changed, baseline)).toBe(true);
  });

  it("computes company update input for changed record fields", () => {
    const company = createWorkspace();
    const baseline = workspaceToIdentityDraft(company);
    const changed = { ...baseline, name: "Acme Group" };
    const input = computeCompanyUpdateInput(changed, baseline, company.id, company.version);
    expect(input).toEqual({
      companyId: "company-1",
      version: 2,
      name: "Acme Group",
    });
  });

  it("computes settings patch for classification changes", () => {
    const company = createWorkspace();
    const baseline = workspaceToIdentityDraft(company);
    const changed = { ...baseline, industryClassification: "banking" };
    const patch = computeIdentitySettingsPatch(changed, baseline);
    expect(patch).toEqual({ industry_classification: "banking" });
  });
});
