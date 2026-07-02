import { describe, expect, it } from "vitest";
import { resolveActiveEngagement } from "./resolve-active-engagement";

const engagements = [
  { id: "1", slug: "alpha", companyId: "c1", name: "Alpha" },
  { id: "2", slug: "beta", companyId: "c2", name: "Beta" },
];

describe("resolveActiveEngagement", () => {
  it("prefers engagement slug from the current path", () => {
    const result = resolveActiveEngagement(
      engagements,
      "/en/app/engagements/beta",
      "alpha",
      "c1",
    );
    expect(result?.slug).toBe("beta");
  });

  it("filters by active company when no path slug is present", () => {
    const result = resolveActiveEngagement(
      engagements,
      "/en/app/dashboard",
      null,
      "c1",
    );
    expect(result?.slug).toBe("alpha");
  });

  it("returns null for unknown slug segments", () => {
    const result = resolveActiveEngagement(
      engagements,
      "/en/app/engagements/missing",
      null,
      null,
    );
    expect(result).toBeNull();
  });
});
