import type { FieldworkPackage } from "@/repositories/fieldwork/fieldwork-repository";
import type { AuditProcedure } from "@/repositories/fieldwork/fieldwork-repository";
import { LOCKED_REVIEW_STATUSES } from "@/constants/review";
import { ValidationError } from "@/lib/errors";

const SUBMITTABLE_PACKAGE_STATUSES = ["draft", "returned"] as const;
const RETURNABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;
const APPROVABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;

const PENDING_REVIEW_PROCEDURE_STATUSES = ["submitted_for_review", "review_in_progress"] as const;

export type ReviewWorkflowTarget = {
  package_status: string;
  deleted_at?: string | null;
};

export type ReviewGateFieldworkTarget = Pick<FieldworkPackage, "package_status"> | null;

export type ReviewSubmitCheck = {
  pendingCount: number;
  returnedCount: number;
  totalItems: number;
};

export type ComputeReviewProgressInput = {
  totalItems: number;
  resolvedCount: number;
  pendingCount: number;
  returnedCount: number;
  hasSummaryNotes: boolean;
  packageStatus: string;
};

export function isReviewApproved(
  reviewPackage: Pick<ReviewWorkflowTarget, "package_status">,
): boolean {
  return reviewPackage.package_status === "approved";
}

export function isFieldworkSubstantiallyComplete(
  fieldworkPackage: ReviewGateFieldworkTarget,
): boolean {
  return fieldworkPackage?.package_status === "substantially_complete";
}

export function hasFieldworkPendingReviews(
  procedures: Pick<AuditProcedure, "procedure_status">[],
): boolean {
  return procedures.some((procedure) =>
    PENDING_REVIEW_PROCEDURE_STATUSES.includes(
      procedure.procedure_status as (typeof PENDING_REVIEW_PROCEDURE_STATUSES)[number],
    ),
  );
}

export function assertReviewCreateGate(
  fieldworkPackage: ReviewGateFieldworkTarget,
  procedures: Pick<AuditProcedure, "procedure_status">[] = [],
): void {
  if (!fieldworkPackage) {
    throw new ValidationError(
      "Review cannot begin until fieldwork has been initiated for this engagement.",
    );
  }

  const substantiallyComplete = isFieldworkSubstantiallyComplete(fieldworkPackage);
  const inProgressWithPendingReviews =
    fieldworkPackage.package_status === "in_progress" && hasFieldworkPendingReviews(procedures);

  if (!substantiallyComplete && !inProgressWithPendingReviews) {
    throw new ValidationError(
      "Review cannot begin until fieldwork is substantially complete or has procedures pending review.",
    );
  }
}

export function assertReviewApprovedForCompletion(
  reviewPackage: Pick<ReviewWorkflowTarget, "package_status"> | null,
): void {
  if (!reviewPackage || !isReviewApproved(reviewPackage)) {
    throw new ValidationError(
      "Engagement completion requires an approved review package (ENG-05).",
    );
  }
}

export function assertPackageEditable(reviewPackage: ReviewWorkflowTarget): void {
  if (
    LOCKED_REVIEW_STATUSES.includes(
      reviewPackage.package_status as (typeof LOCKED_REVIEW_STATUSES)[number],
    ) ||
    reviewPackage.deleted_at
  ) {
    throw new ValidationError("Approved or archived review packages are read-only.");
  }
}

export function assertCanSubmit(
  reviewPackage: Pick<ReviewWorkflowTarget, "package_status">,
): void {
  if (
    !SUBMITTABLE_PACKAGE_STATUSES.includes(
      reviewPackage.package_status as (typeof SUBMITTABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only draft or returned review packages can be submitted.");
  }
}

export function assertCanReturn(
  reviewPackage: Pick<ReviewWorkflowTarget, "package_status">,
): void {
  if (
    !RETURNABLE_PACKAGE_STATUSES.includes(
      reviewPackage.package_status as (typeof RETURNABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted review packages can be returned.");
  }
}

export function assertCanApprove(
  reviewPackage: Pick<ReviewWorkflowTarget, "package_status">,
): void {
  if (
    !APPROVABLE_PACKAGE_STATUSES.includes(
      reviewPackage.package_status as (typeof APPROVABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted review packages can be approved.");
  }
}

export function assertSubmitPrerequisites(check: ReviewSubmitCheck): void {
  if (check.totalItems === 0) {
    throw new ValidationError("At least one review item must be synced before submission.");
  }
  if (check.pendingCount > 0) {
    throw new ValidationError("All review items must be resolved before submission.");
  }
  if (check.returnedCount > 0) {
    throw new ValidationError("Returned review items must be addressed before submission.");
  }
}

export function computeReviewProgress(input: ComputeReviewProgressInput): number {
  const sections: number[] = [];

  if (input.totalItems === 0) {
    sections.push(0);
  } else {
    sections.push(Math.round((input.resolvedCount / input.totalItems) * 100));
  }

  sections.push(input.pendingCount === 0 ? 100 : Math.max(0, 100 - input.pendingCount * 10));
  sections.push(input.returnedCount === 0 ? 100 : Math.max(0, 100 - input.returnedCount * 15));
  sections.push(input.hasSummaryNotes ? 100 : 0);

  if (input.packageStatus === "approved") {
    sections.push(100);
  } else if (input.packageStatus === "submitted" || input.packageStatus === "under_review") {
    sections.push(85);
  } else if (input.packageStatus === "returned") {
    sections.push(50);
  } else {
    sections.push(25);
  }

  return Math.round(sections.reduce((sum, value) => sum + value, 0) / sections.length);
}
