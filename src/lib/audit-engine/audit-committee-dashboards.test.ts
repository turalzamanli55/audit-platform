import { describe, expect, it } from "vitest";
import {
  assertAuditCommitteeDashboardKpis,
  auditCommitteeRiskScore,
} from "./audit-committee-dashboards";

describe("audit-committee-dashboards", () => {
  it("scores committee risk from KPI completeness", () => {
    const kpis = {
      openFindings: 2,
      overdueRecommendations: 1,
      unclearedReviews: 1,
      opinionStatus: "pending" as const,
    };
    expect(auditCommitteeRiskScore(kpis)).toBe(2 * 2 + 1 * 3 + 1 * 4 + 5);
    expect(() => assertAuditCommitteeDashboardKpis(kpis)).not.toThrow();
    expect(() =>
      assertAuditCommitteeDashboardKpis({ ...kpis, openFindings: -1 }),
    ).toThrowError(/negative/i);
  });
});
