import type { AuditPlan } from "@/repositories/planning/planning-repository";
import type { FieldworkPackage } from "@/repositories/fieldwork/fieldwork-repository";
import type { AuditProcedure } from "@/repositories/fieldwork/fieldwork-repository";
import { COMPLETE_PROCEDURE_STATUSES } from "@/constants/fieldwork";
import { ValidationError } from "@/lib/errors";

export function isPlanningApproved(plan: Pick<AuditPlan, "planning_status">): boolean {
  return plan.planning_status === "approved";
}

export function assertFieldworkGate(plan: AuditPlan | null, lifecycleStatus: string): void {
  if (!plan || !isPlanningApproved(plan)) {
    throw new ValidationError(
      "Fieldwork cannot begin until audit planning is approved (ENG-03).",
    );
  }

  const allowedLifecycles = ["fieldwork", "review", "completed"];
  if (!allowedLifecycles.includes(lifecycleStatus)) {
    throw new ValidationError(
      "Engagement must be in fieldwork lifecycle before opening the fieldwork workspace.",
    );
  }
}

export function assertPackageEditable(pkg: FieldworkPackage): void {
  if (pkg.package_status === "archived" || pkg.deleted_at) {
    throw new ValidationError("Archived fieldwork packages are read-only.");
  }
}

export function computeFieldworkProgress(procedures: Pick<AuditProcedure, "completion_pct">[]): number {
  if (procedures.length === 0) return 0;
  return Math.round(
    procedures.reduce((sum, procedure) => sum + procedure.completion_pct, 0) / procedures.length,
  );
}

export function computeProcedureProgressFromStatus(
  status: AuditProcedure["procedure_status"],
): number {
  switch (status) {
    case "complete":
    case "review_cleared":
      return 100;
    case "submitted_for_review":
    case "review_in_progress":
      return 85;
    case "returned":
      return 60;
    case "pending_evidence":
      return 45;
    case "in_progress":
      return 30;
    case "blocked":
    case "deferred":
      return 10;
    default:
      return 0;
  }
}

export function isProcedureComplete(status: AuditProcedure["procedure_status"]): boolean {
  return COMPLETE_PROCEDURE_STATUSES.includes(
    status as (typeof COMPLETE_PROCEDURE_STATUSES)[number],
  );
}
