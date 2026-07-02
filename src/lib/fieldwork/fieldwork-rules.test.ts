import { describe, expect, it } from "vitest";
import type { AuditPlan } from "@/repositories/planning/planning-repository";
import {
  assertCanClearProcedure,
  assertCanCompleteProcedure,
  assertCanReturnProcedure,
  assertCanSubmitProcedure,
  assertFieldworkGate,
  assertPackageEditable,
  computeFieldworkProgress,
  countCompleteProcedures,
  isPlanningApproved,
  isProcedureComplete,
} from "@/lib/fieldwork/fieldwork-rules";
import { ValidationError } from "@/lib/errors";

function approvedPlan(): AuditPlan {
  return { planning_status: "approved" } as AuditPlan;
}

describe("fieldwork rules", () => {
  it("requires approved planning", () => {
    expect(isPlanningApproved(approvedPlan())).toBe(true);
    expect(isPlanningApproved({ planning_status: "in_progress" } as AuditPlan)).toBe(false);
  });

  it("enforces ENG-03 fieldwork gate", () => {
    expect(() => assertFieldworkGate(approvedPlan(), "fieldwork")).not.toThrow();
    expect(() => assertFieldworkGate(null, "fieldwork")).toThrow(ValidationError);
    expect(() => assertFieldworkGate(approvedPlan(), "planning")).toThrow(ValidationError);
  });

  it("requires approved risk assessment when provided", () => {
    expect(() =>
      assertFieldworkGate(approvedPlan(), "fieldwork", { assessment_status: "approved" }),
    ).not.toThrow();
    expect(() =>
      assertFieldworkGate(approvedPlan(), "fieldwork", { assessment_status: "submitted" }),
    ).toThrow(ValidationError);
  });

  it("blocks archived package edits", () => {
    expect(() =>
      assertPackageEditable({ package_status: "archived", deleted_at: null } as never),
    ).toThrow(ValidationError);
  });

  it("computes progress from procedures", () => {
    expect(computeFieldworkProgress([{ completion_pct: 50 }, { completion_pct: 100 }])).toBe(75);
  });

  it("detects complete procedures", () => {
    expect(isProcedureComplete("complete")).toBe(true);
    expect(isProcedureComplete("review_cleared")).toBe(true);
    expect(isProcedureComplete("in_progress")).toBe(false);
  });

  it("blocks complete without review clearance", () => {
    expect(() => assertCanCompleteProcedure({ procedure_status: "in_progress" } as never)).toThrow(
      ValidationError,
    );
    expect(() => assertCanCompleteProcedure({ procedure_status: "review_cleared" } as never)).not.toThrow();
  });

  it("enforces submit and return workflow", () => {
    expect(() => assertCanSubmitProcedure({ procedure_status: "in_progress" } as never)).not.toThrow();
    expect(() => assertCanSubmitProcedure({ procedure_status: "complete" } as never)).toThrow(ValidationError);
    expect(() => assertCanReturnProcedure({ procedure_status: "submitted_for_review" } as never)).not.toThrow();
    expect(() => assertCanClearProcedure({ procedure_status: "submitted_for_review" } as never)).not.toThrow();
  });

  it("counts complete procedures including review_cleared", () => {
    expect(
      countCompleteProcedures([
        { procedure_status: "complete" },
        { procedure_status: "review_cleared" },
        { procedure_status: "in_progress" },
      ] as never),
    ).toBe(2);
  });
});
