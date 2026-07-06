import { LOCKED_COMPLETION_STATUSES } from "@/constants/completion";
import { ValidationError } from "@/lib/errors";

const SUBMITTABLE_PACKAGE_STATUSES = ["draft", "returned"] as const;
const RETURNABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;
const APPROVABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;

export type CompletionWorkflowTarget = {
  package_status: string;
  deleted_at?: string | null;
};

export type CompletionSubmitCheck = {
  pendingCount: number;
  returnedCount: number;
  totalItems: number;
};

export type ComputeCompletionProgressInput = {
  totalItems: number;
  resolvedCount: number;
  pendingCount: number;
  returnedCount: number;
  hasSummaryNotes: boolean;
  packageStatus: string;
};

export function isCompletionApproved(
  completionPackage: Pick<CompletionWorkflowTarget, "package_status">,
): boolean {
  return completionPackage.package_status === "approved";
}

export function assertCompletionApprovedForReporting(
  completionPackage: Pick<CompletionWorkflowTarget, "package_status"> | null,
): void {
  if (!completionPackage || !isCompletionApproved(completionPackage)) {
    throw new ValidationError(
      "Reporting cannot begin until engagement completion is approved.",
    );
  }
}

export function assertPackageEditable(completionPackage: CompletionWorkflowTarget): void {
  if (
    LOCKED_COMPLETION_STATUSES.includes(
      completionPackage.package_status as (typeof LOCKED_COMPLETION_STATUSES)[number],
    ) ||
    completionPackage.deleted_at
  ) {
    throw new ValidationError("Approved or archived completion packages are read-only.");
  }
}

export function assertCanSubmit(
  completionPackage: Pick<CompletionWorkflowTarget, "package_status">,
): void {
  if (
    !SUBMITTABLE_PACKAGE_STATUSES.includes(
      completionPackage.package_status as (typeof SUBMITTABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only draft or returned completion packages can be submitted.");
  }
}

export function assertCanReturn(
  completionPackage: Pick<CompletionWorkflowTarget, "package_status">,
): void {
  if (
    !RETURNABLE_PACKAGE_STATUSES.includes(
      completionPackage.package_status as (typeof RETURNABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted completion packages can be returned.");
  }
}

export function assertCanApprove(
  completionPackage: Pick<CompletionWorkflowTarget, "package_status">,
): void {
  if (
    !APPROVABLE_PACKAGE_STATUSES.includes(
      completionPackage.package_status as (typeof APPROVABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted completion packages can be approved.");
  }
}

export function assertSubmitPrerequisites(check: CompletionSubmitCheck): void {
  if (check.totalItems === 0) {
    throw new ValidationError("At least one completion item must exist before submission.");
  }
  if (check.pendingCount > 0) {
    throw new ValidationError("All completion items must be resolved before submission.");
  }
  if (check.returnedCount > 0) {
    throw new ValidationError("Returned completion items must be addressed before submission.");
  }
}

export function computeCompletionProgress(input: ComputeCompletionProgressInput): number {
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
