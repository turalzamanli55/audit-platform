import type { AuditPlan } from "@/repositories/planning/planning-repository";
import type { FieldworkPackage } from "@/repositories/fieldwork/fieldwork-repository";
import type { AuditProcedure } from "@/repositories/fieldwork/fieldwork-repository";
import { COMPLETE_PROCEDURE_STATUSES } from "@/constants/fieldwork";
import { ValidationError } from "@/lib/errors";
import { assertReviewApprovedForCompletion } from "@/lib/review/review-rules";

const SUBMITTABLE_PROCEDURE_STATUSES = [
  "in_progress",
  "pending_evidence",
  "returned",
] as const;

const REVIEWABLE_PROCEDURE_STATUSES = ["submitted_for_review", "review_in_progress"] as const;

export function isPlanningApproved(plan: Pick<AuditPlan, "planning_status">): boolean {
  return plan.planning_status === "approved";
}

export function assertFieldworkGate(
  plan: AuditPlan | null,
  lifecycleStatus: string,
  riskAssessment?: { assessment_status: string } | null,
): void {
  if (!plan || !isPlanningApproved(plan)) {
    throw new ValidationError(
      "Fieldwork cannot begin until audit planning is approved (ENG-03).",
    );
  }

  if (riskAssessment && riskAssessment.assessment_status !== "approved") {
    throw new ValidationError(
      "Fieldwork cannot begin until risk assessment is approved (RA-02).",
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

export function assertCanSubmitProcedure(procedure: Pick<AuditProcedure, "procedure_status">): void {
  if (
    !SUBMITTABLE_PROCEDURE_STATUSES.includes(
      procedure.procedure_status as (typeof SUBMITTABLE_PROCEDURE_STATUSES)[number],
    )
  ) {
    throw new ValidationError(
      "Only in-progress, pending-evidence, or returned procedures can be submitted for review.",
    );
  }
}

export function assertCanReturnProcedure(procedure: Pick<AuditProcedure, "procedure_status">): void {
  if (
    !REVIEWABLE_PROCEDURE_STATUSES.includes(
      procedure.procedure_status as (typeof REVIEWABLE_PROCEDURE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only procedures pending review can be returned.");
  }
}

export function assertCanClearProcedure(procedure: Pick<AuditProcedure, "procedure_status">): void {
  if (
    !REVIEWABLE_PROCEDURE_STATUSES.includes(
      procedure.procedure_status as (typeof REVIEWABLE_PROCEDURE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only procedures pending review can be cleared.");
  }
}

export function assertCanCompleteProcedure(procedure: Pick<AuditProcedure, "procedure_status">): void {
  if (procedure.procedure_status !== "review_cleared") {
    throw new ValidationError(
      "Procedures require review clearance before completion (WP-02).",
    );
  }
}

export function countCompleteProcedures(
  procedures: Pick<AuditProcedure, "procedure_status">[],
): number {
  return procedures.filter((p) => isProcedureComplete(p.procedure_status)).length;
}

const SUBMITTABLE_WP_STATUSES = ["in_progress", "returned"] as const;
const REVIEWABLE_WP_STATUSES = ["submitted", "under_review"] as const;

export function assertCanSubmitWorkingPaper(
  paper: Pick<import("@/repositories/fieldwork/fieldwork-repository").WorkingPaper, "paper_status">,
): void {
  if (
    !SUBMITTABLE_WP_STATUSES.includes(
      paper.paper_status as (typeof SUBMITTABLE_WP_STATUSES)[number],
    )
  ) {
    throw new ValidationError(
      "Only in-progress or returned working papers can be submitted for review.",
    );
  }
}

export function assertCanReturnWorkingPaper(
  paper: Pick<import("@/repositories/fieldwork/fieldwork-repository").WorkingPaper, "paper_status">,
): void {
  if (
    !REVIEWABLE_WP_STATUSES.includes(
      paper.paper_status as (typeof REVIEWABLE_WP_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only working papers pending review can be returned.");
  }
}

export function assertCanClearWorkingPaper(
  paper: Pick<import("@/repositories/fieldwork/fieldwork-repository").WorkingPaper, "paper_status">,
): void {
  if (
    !REVIEWABLE_WP_STATUSES.includes(
      paper.paper_status as (typeof REVIEWABLE_WP_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only working papers pending review can be cleared.");
  }
}

export function assertFieldworkCompletionRequiresReview(
  reviewPackage: { package_status: string } | null,
): void {
  assertReviewApprovedForCompletion(reviewPackage);
}

export { assertEngagementCompletionGate } from "@/lib/completion/completion-rules";
