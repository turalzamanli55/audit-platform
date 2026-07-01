import { describe, expect, it } from "vitest";
import {
  DEFAULT_COMPANY_SETTINGS,
  mergeCompanySettings,
  parseCompanySettings,
} from "@/lib/company/settings";

describe("company settings", () => {
  it("parses legacy settings keys into the canonical structure", () => {
    const parsed = parseCompanySettings({
      reporting_currency: "EUR",
      functional_currency: "EUR",
      industry_code: "banking",
    });

    expect(parsed.functional_currency).toBe("EUR");
    expect(parsed.reporting_framework).toBe("OTHER");
    expect(parsed.industry_classification).toBe("banking");
  });

  it("merges nested branding and preferences without dropping defaults", () => {
    const merged = mergeCompanySettings(DEFAULT_COMPANY_SETTINGS, {
      branding: { trade_name: "Audit Co" },
      preferences: { default_locale: "en" },
    });

    expect(merged.branding?.trade_name).toBe("Audit Co");
    expect(merged.branding?.logo_url).toBeNull();
    expect(merged.preferences?.default_locale).toBe("en");
    expect(merged.validation?.schema_version).toBe(1);
  });
});
