import type { AuditPlan } from "@/repositories/planning/planning-repository";
import type { PlanningChecklistItem } from "@/types/planning";
import { LOCKED_PLANNING_STATUSES } from "@/constants/planning";
import { ValidationError } from "@/lib/errors";

export function isPlanLocked(plan: Pick<AuditPlan, "planning_status">): boolean {
  return LOCKED_PLANNING_STATUSES.includes(
    plan.planning_status as (typeof LOCKED_PLANNING_STATUSES)[number],
  );
}

export function assertPlanEditable(plan: AuditPlan): void {
  if (isPlanLocked(plan)) {
    throw new ValidationError(
      "Approved audit plans are locked. Create a revision to make changes.",
    );
  }
  if (plan.planning_status === "pending_review") {
    throw new ValidationError("Audit plan is pending review and cannot be edited.");
  }
}

const SUBMITTABLE_STATUSES = ["in_progress", "returned"] as const;

export function assertCanSubmit(plan: AuditPlan): void {
  if (!SUBMITTABLE_STATUSES.includes(plan.planning_status as (typeof SUBMITTABLE_STATUSES)[number])) {
    throw new ValidationError("Only in-progress or returned plans can be submitted for review.");
  }
}

export function assertSubmissionPrerequisites(plan: AuditPlan): void {
  if (!plan.audit_strategy?.trim()) {
    throw new ValidationError("Audit strategy must be documented before submission.");
  }
  if (!plan.engagement_objectives?.trim()) {
    throw new ValidationError("Engagement objectives must be documented before submission.");
  }
  if (!plan.scope_of_audit?.trim()) {
    throw new ValidationError("Scope of audit must be documented before submission.");
  }
  if (!plan.financial_reporting_framework?.trim()) {
    throw new ValidationError("Financial reporting framework must be confirmed before submission.");
  }

  const materialityReady =
    plan.materiality_status === "integrated" || plan.materiality_status === "placeholder";
  const riskReady = plan.risk_status === "integrated";

  if (!materialityReady) {
    throw new ValidationError("Materiality must be documented or reviewed before submission.");
  }
  if (!riskReady) {
    throw new ValidationError("Risk assessment must be integrated before submission.");
  }

  const checklist = (plan.checklist ?? []) as PlanningChecklistItem[];
  const requiredIncomplete = checklist.filter((item) => !item.completed);
  if (requiredIncomplete.length > 0) {
    throw new ValidationError(
      `Planning checklist incomplete: ${requiredIncomplete.length} item(s) remaining.`,
    );
  }
}

export function assertCanReturn(plan: AuditPlan): void {
  if (plan.planning_status !== "pending_review") {
    throw new ValidationError("Only plans pending review can be returned.");
  }
}

export function assertCanApprove(plan: AuditPlan): void {
  if (plan.planning_status !== "pending_review") {
    throw new ValidationError("Only plans pending review can be approved.");
  }
}

export function assertCanRevise(plan: AuditPlan): void {
  if (plan.planning_status !== "approved") {
    throw new ValidationError("Only approved plans can be revised.");
  }
}

export function assertEngagementAllowsPlanning(lifecycleStatus: string): void {
  const blocked = ["closed", "completed"];
  if (blocked.includes(lifecycleStatus)) {
    throw new ValidationError("Planning cannot be initiated on closed or completed engagements.");
  }
}

export function computePlanningKpiProgress(plan: AuditPlan): number {
  const checklist = (plan.checklist ?? []) as PlanningChecklistItem[];
  const checklistPct =
    checklist.length === 0
      ? 0
      : Math.round((checklist.filter((i) => i.completed).length / checklist.length) * 100);

  const contentFields = [
    plan.audit_strategy,
    plan.engagement_objectives,
    plan.scope_of_audit,
    plan.financial_reporting_framework,
  ];
  const contentPct = Math.round(
    (contentFields.filter((f) => f?.trim()).length / contentFields.length) * 100,
  );

  const integrationPct =
    (plan.materiality_status !== "not_configured" ? 50 : 0) +
    (plan.risk_status !== "not_configured" ? 50 : 0);

  switch (plan.planning_status) {
    case "approved":
    case "superseded":
      return 100;
    case "pending_review":
      return Math.min(95, Math.round((checklistPct + contentPct + integrationPct) / 3));
    case "returned":
      return Math.round((checklistPct + contentPct) / 2);
    default:
      return Math.round((checklistPct + contentPct + integrationPct) / 3);
  }
}
