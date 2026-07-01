import { describe, expect, it } from "vitest";
import {
  computeSettingsPatch,
  isSettingsDraftDirty,
  settingsToDraft,
} from "@/lib/company/company-settings-draft";
import { DEFAULT_COMPANY_SETTINGS } from "@/lib/company/settings";

describe("company-settings-draft", () => {
  const baseline = {
    ...DEFAULT_COMPANY_SETTINGS,
    jurisdiction: "AZ",
    branding: { trade_name: "Acme", logo_url: null },
    preferences: {
      default_locale: "en",
      data_import_source: null,
      rounding_convention: null,
    },
  };

  it("detects dirty drafts", () => {
    const draft = settingsToDraft(baseline);
    expect(isSettingsDraftDirty(draft, draft)).toBe(false);

    const changed = { ...draft, jurisdiction: "TR" };
    expect(isSettingsDraftDirty(changed, draft)).toBe(true);
  });

  it("computes a partial patch for changed fields only", () => {
    const draft = settingsToDraft(baseline);
    const changed = { ...draft, jurisdiction: "TR", functionalCurrency: "EUR" };

    const patch = computeSettingsPatch(changed, baseline);

    expect(patch).toEqual({
      jurisdiction: "TR",
      functional_currency: "EUR",
    });
  });

  it("includes contact patch when finance contact changes", () => {
    const draft = settingsToDraft(baseline);
    const changed = { ...draft, financeContactEmail: "finance@example.com" };
    const patch = computeSettingsPatch(changed, baseline);

    expect(patch.primary_finance_contact).toEqual({
      name: null,
      title: null,
      email: "finance@example.com",
      phone: null,
    });
  });
});
