import { describe, expect, it } from "vitest";
import {
  assertAuditPlanningReady,
  isAuditPlanningReady,
} from "./audit-planning";

describe("audit-planning", () => {
  const ready = {
    engagementId: "eng-1",
    scopeDefined: true,
    riskAssessed: true,
    materialitySet: true,
    teamAssigned: true,
    strategyApproved: true,
  };

  it("requires a complete planning package before fieldwork", () => {
    expect(isAuditPlanningReady(ready)).toBe(true);
    expect(() => assertAuditPlanningReady(ready)).not.toThrow();
    expect(() =>
      assertAuditPlanningReady({ ...ready, strategyApproved: false }),
    ).toThrowError(/incomplete/i);
  });
});
