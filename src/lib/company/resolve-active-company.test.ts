import { describe, expect, it } from "vitest";
import {
  resolveActiveCompany,
  resolveCompanySlugFromPath,
} from "./resolve-active-company";

describe("resolveCompanySlugFromPath", () => {
  it("extracts slug from company workspace routes", () => {
    expect(resolveCompanySlugFromPath("/en/app/companies/acme-corp")).toBe("acme-corp");
    expect(resolveCompanySlugFromPath("/en/app/companies/acme-corp/settings")).toBe("acme-corp");
  });

  it("returns null when path is not a company route", () => {
    expect(resolveCompanySlugFromPath("/en/app/dashboard")).toBeNull();
    expect(resolveCompanySlugFromPath("/en/app/companies")).toBeNull();
  });
});

describe("resolveActiveCompany", () => {
  const companies = [
    { id: "1", slug: "alpha", name: "Alpha" },
    { id: "2", slug: "beta", name: "Beta" },
  ];

  it("prefers company from URL path", () => {
    expect(
      resolveActiveCompany(companies, "/en/app/companies/beta", "alpha"),
    ).toEqual(companies[1]);
  });

  it("falls back to preferred slug when path has no match", () => {
    expect(
      resolveActiveCompany(companies, "/en/app/dashboard", "beta"),
    ).toEqual(companies[1]);
  });

  it("falls back to first company when no path or preference", () => {
    expect(resolveActiveCompany(companies, "/en/app/dashboard")).toEqual(companies[0]);
  });

  it("returns null for empty list", () => {
    expect(resolveActiveCompany([], "/en/app/companies/alpha")).toBeNull();
  });
});
