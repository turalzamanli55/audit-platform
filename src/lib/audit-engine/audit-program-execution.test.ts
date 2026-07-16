import { describe, expect, it } from "vitest";
import {
  assertAuditProgramProcedureTransition,
  canTransitionAuditProgramProcedure,
} from "./audit-program-execution";

describe("audit-program-execution", () => {
  it("enforces procedure lifecycle transitions", () => {
    expect(canTransitionAuditProgramProcedure("not_started", "in_progress")).toBe(true);
    expect(canTransitionAuditProgramProcedure("submitted", "cleared")).toBe(true);
    expect(canTransitionAuditProgramProcedure("cleared", "in_progress")).toBe(false);
    expect(() =>
      assertAuditProgramProcedureTransition("cleared", "submitted"),
    ).toThrowError(/Invalid audit program/);
  });
});
