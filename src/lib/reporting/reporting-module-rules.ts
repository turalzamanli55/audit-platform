import { LOCKED_REPORTING_STATUSES } from "@/constants/reporting";
import { ValidationError } from "@/lib/errors";

const SUBMITTABLE_PACKAGE_STATUSES = ["draft", "returned"] as const;
const RETURNABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;
const APPROVABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;

export type ReportingWorkflowTarget = {
  package_status: string;
  deleted_at?: string | null;
};

export type ReportingSubmitCheck = {
  pendingCount: number;
  returnedCount: number;
  totalItems: number;
};

export type ComputeReportingProgressInput = {
  totalItems: number;
  resolvedCount: number;
  pendingCount: number;
  returnedCount: number;
  hasSummaryNotes: boolean;
  packageStatus: string;
};

export function isReportingApproved(
  reportingPackage: Pick<ReportingWorkflowTarget, "package_status">,
): boolean {
  return reportingPackage.package_status === "approved";
}

export function assertReportingApprovedForOpinion(
  reportingPackage: Pick<ReportingWorkflowTarget, "package_status"> | null,
): void {
  if (!reportingPackage || !isReportingApproved(reportingPackage)) {
    throw new ValidationError(
      "Audit opinion cannot begin until engagement reporting is approved.",
    );
  }
}

export function assertPackageEditable(reportingPackage: ReportingWorkflowTarget): void {
  if (
    LOCKED_REPORTING_STATUSES.includes(
      reportingPackage.package_status as (typeof LOCKED_REPORTING_STATUSES)[number],
    ) ||
    reportingPackage.deleted_at
  ) {
    throw new ValidationError("Approved or archived reporting packages are read-only.");
  }
}

export function assertCanSubmit(
  reportingPackage: Pick<ReportingWorkflowTarget, "package_status">,
): void {
  if (
    !SUBMITTABLE_PACKAGE_STATUSES.includes(
      reportingPackage.package_status as (typeof SUBMITTABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only draft or returned reporting packages can be submitted.");
  }
}

export function assertCanReturn(
  reportingPackage: Pick<ReportingWorkflowTarget, "package_status">,
): void {
  if (
    !RETURNABLE_PACKAGE_STATUSES.includes(
      reportingPackage.package_status as (typeof RETURNABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted reporting packages can be returned.");
  }
}

export function assertCanApprove(
  reportingPackage: Pick<ReportingWorkflowTarget, "package_status">,
): void {
  if (
    !APPROVABLE_PACKAGE_STATUSES.includes(
      reportingPackage.package_status as (typeof APPROVABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted reporting packages can be approved.");
  }
}

export function assertSubmitPrerequisites(check: ReportingSubmitCheck): void {
  if (check.totalItems === 0) {
    throw new ValidationError("At least one report section must exist before submission.");
  }
  if (check.pendingCount > 0) {
    throw new ValidationError("All report sections must be resolved before submission.");
  }
  if (check.returnedCount > 0) {
    throw new ValidationError("Returned report sections must be addressed before submission.");
  }
}

export function computeReportingProgress(input: ComputeReportingProgressInput): number {
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
