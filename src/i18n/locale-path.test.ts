import { describe, expect, it } from "vitest";
import { listAlternateLocalePaths, replacePathLocale } from "./locale-path";

describe("replacePathLocale", () => {
  it("replaces the locale prefix while preserving the route", () => {
    expect(replacePathLocale("/en/app/dashboard", "az")).toBe("/az/app/dashboard");
  });

  it("adds a locale prefix when missing", () => {
    expect(replacePathLocale("/app/dashboard", "ru")).toBe("/ru/app/dashboard");
  });
});

describe("listAlternateLocalePaths", () => {
  it("returns the other locale variants for the current path", () => {
    const paths = listAlternateLocalePaths("/en/app/dashboard", "en");
    expect(paths).toEqual(["/az/app/dashboard", "/ru/app/dashboard", "/tr/app/dashboard"]);
  });
});
