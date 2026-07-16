import { describe, expect, it } from "vitest";
import { assertAuditReportReady, isAuditReportReady } from "./audit-report-generation";

describe("audit-report-generation", () => {
  it("requires opinion, findings, FS, and representation letter", () => {
    const ready = {
      opinionApproved: true,
      findingsClosedOrAccepted: true,
      financialStatementsApproved: true,
      representationLetterReceived: true,
    };
    expect(isAuditReportReady(ready)).toBe(true);
    expect(() => assertAuditReportReady(ready)).not.toThrow();
    expect(() =>
      assertAuditReportReady({ ...ready, opinionApproved: false }),
    ).toThrowError(/cannot be generated/i);
  });
});
