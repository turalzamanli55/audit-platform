import { describe, expect, it } from "vitest";
import { assertAuditLogAccessFilter } from "./audit-log-access";

describe("audit-log-access", () => {
  it("validates tenant-scoped audit log filters", () => {
    expect(() =>
      assertAuditLogAccessFilter({ organizationId: "org-1", from: "2026-01-01", to: "2026-06-01" }),
    ).not.toThrow();
    expect(() => assertAuditLogAccessFilter({ organizationId: "" })).toThrowError(/Organization/);
    expect(() =>
      assertAuditLogAccessFilter({
        organizationId: "org-1",
        from: "2026-06-01",
        to: "2026-01-01",
      }),
    ).toThrowError(/date range/i);
  });
});
