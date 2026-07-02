import { describe, expect, it } from "vitest";
import type { AuditPlan } from "@/repositories/planning/planning-repository";
import {
  assertCanApprove,
  assertCanReturn,
  assertCanRevise,
  assertCanSubmit,
  assertEngagementAllowsPlanning,
  assertPlanEditable,
  assertSubmissionPrerequisites,
  computePlanningKpiProgress,
  isPlanLocked,
} from "@/lib/planning/planning-rules";
import { ValidationError } from "@/lib/errors";

function basePlan(overrides: Partial<AuditPlan> = {}): AuditPlan {
  return {
    id: "plan-1",
    engagement_id: "eng-1",
    organization_id: "org-1",
    workspace_id: "ws-1",
    planning_status: "in_progress",
    plan_version: 1,
    audit_strategy: "Strategy",
    engagement_objectives: "Objectives",
    scope_of_audit: "Scope",
    financial_reporting_framework: "IFRS",
    materiality_status: "placeholder",
    risk_status: "integrated",
    checklist: [
      { id: "1", key: "objectives", completed: true },
      { id: "2", key: "scope", completed: true },
    ],
    revision_history: [],
    status: "active",
    version: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    deleted_at: null,
    deleted_by: null,
    created_by: null,
    updated_by: null,
    planning_notes: null,
    timeline: [],
    team_planning: {},
    documents: [],
    submitted_at: null,
    submitted_by: null,
    approved_at: null,
    approved_by: null,
    returned_at: null,
    returned_by: null,
    return_notes: null,
    ...overrides,
  } as AuditPlan;
}

describe("planning rules", () => {
  it("locks approved plans", () => {
    expect(isPlanLocked(basePlan({ planning_status: "approved" }))).toBe(true);
    expect(isPlanLocked(basePlan({ planning_status: "in_progress" }))).toBe(false);
  });

  it("blocks edits on locked or pending review plans", () => {
    expect(() => assertPlanEditable(basePlan({ planning_status: "approved" }))).toThrow(
      ValidationError,
    );
    expect(() => assertPlanEditable(basePlan({ planning_status: "pending_review" }))).toThrow(
      ValidationError,
    );
    expect(() => assertPlanEditable(basePlan())).not.toThrow();
  });

  it("enforces submission prerequisites", () => {
    expect(() => assertSubmissionPrerequisites(basePlan())).not.toThrow();
    expect(() =>
      assertSubmissionPrerequisites(basePlan({ audit_strategy: "" })),
    ).toThrow(ValidationError);
  });

  it("enforces workflow transitions", () => {
    expect(() => assertCanSubmit(basePlan())).not.toThrow();
    expect(() => assertCanSubmit(basePlan({ planning_status: "approved" }))).toThrow();
    expect(() => assertCanReturn(basePlan({ planning_status: "pending_review" }))).not.toThrow();
    expect(() => assertCanApprove(basePlan({ planning_status: "pending_review" }))).not.toThrow();
    expect(() => assertCanRevise(basePlan({ planning_status: "approved" }))).not.toThrow();
  });

  it("blocks planning on closed engagements", () => {
    expect(() => assertEngagementAllowsPlanning("planning")).not.toThrow();
    expect(() => assertEngagementAllowsPlanning("closed")).toThrow(ValidationError);
  });

  it("computes KPI progress from content and checklist", () => {
    const progress = computePlanningKpiProgress(basePlan());
    expect(progress).toBeGreaterThan(0);
    expect(computePlanningKpiProgress(basePlan({ planning_status: "approved" }))).toBe(100);
  });
});
