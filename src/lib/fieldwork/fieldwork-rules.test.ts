import { describe, expect, it } from "vitest";
import type { AuditPlan } from "@/repositories/planning/planning-repository";
import {
  assertFieldworkGate,
  assertPackageEditable,
  computeFieldworkProgress,
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
    expect(isProcedureComplete("in_progress")).toBe(false);
  });
});
