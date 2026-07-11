import { LOCKED_FINANCIAL_STATEMENT_STATUSES } from "@/constants/financial-statements";
import { ValidationError } from "@/lib/errors";

const PREPARABLE_PACKAGE_STATUSES = ["draft", "returned"] as const;
const SUBMITTABLE_PACKAGE_STATUSES = ["prepared", "returned"] as const;
const RETURNABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;
const APPROVABLE_PACKAGE_STATUSES = ["submitted", "under_review"] as const;
const PUBLISHABLE_PACKAGE_STATUSES = ["approved"] as const;

export type FinancialStatementsWorkflowTarget = {
  package_status: string;
  deleted_at?: string | null;
};

export type FinancialStatementsSubmitCheck = {
  pendingCount: number;
  returnedCount: number;
  totalItems: number;
};

export type ComputeFinancialStatementsProgressInput = {
  totalItems: number;
  resolvedCount: number;
  pendingCount: number;
  returnedCount: number;
  hasSummaryNotes: boolean;
  packageStatus: string;
};

export function isFinancialStatementsApproved(
  pkg: Pick<FinancialStatementsWorkflowTarget, "package_status">,
): boolean {
  return pkg.package_status === "approved" || pkg.package_status === "published";
}

export function assertFinancialStatementsApprovedForExport(
  pkg: Pick<FinancialStatementsWorkflowTarget, "package_status"> | null,
): void {
  if (!pkg || (pkg.package_status !== "approved" && pkg.package_status !== "published")) {
    throw new ValidationError(
      "Export cannot begin until financial statements are approved.",
    );
  }
}

export function assertPackageEditable(pkg: FinancialStatementsWorkflowTarget): void {
  if (
    LOCKED_FINANCIAL_STATEMENT_STATUSES.includes(
      pkg.package_status as (typeof LOCKED_FINANCIAL_STATEMENT_STATUSES)[number],
    ) ||
    pkg.deleted_at
  ) {
    throw new ValidationError("Published or archived financial statement packages are read-only.");
  }
}

export function assertCanPrepare(
  pkg: Pick<FinancialStatementsWorkflowTarget, "package_status">,
): void {
  if (
    !PREPARABLE_PACKAGE_STATUSES.includes(
      pkg.package_status as (typeof PREPARABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only draft or returned financial statement packages can be marked prepared.");
  }
}

export function assertCanSubmit(
  pkg: Pick<FinancialStatementsWorkflowTarget, "package_status">,
): void {
  if (
    !SUBMITTABLE_PACKAGE_STATUSES.includes(
      pkg.package_status as (typeof SUBMITTABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only prepared or returned financial statement packages can be submitted.");
  }
}

export function assertCanReturn(
  pkg: Pick<FinancialStatementsWorkflowTarget, "package_status">,
): void {
  if (
    !RETURNABLE_PACKAGE_STATUSES.includes(
      pkg.package_status as (typeof RETURNABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted financial statement packages can be returned.");
  }
}

export function assertCanApprove(
  pkg: Pick<FinancialStatementsWorkflowTarget, "package_status">,
): void {
  if (
    !APPROVABLE_PACKAGE_STATUSES.includes(
      pkg.package_status as (typeof APPROVABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted financial statement packages can be approved.");
  }
}

export function assertCanPublish(
  pkg: Pick<FinancialStatementsWorkflowTarget, "package_status">,
): void {
  if (
    !PUBLISHABLE_PACKAGE_STATUSES.includes(
      pkg.package_status as (typeof PUBLISHABLE_PACKAGE_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only approved financial statement packages can be published.");
  }
}

export function assertSubmitPrerequisites(check: FinancialStatementsSubmitCheck): void {
  if (check.totalItems === 0) {
    throw new ValidationError("At least one financial statement section must exist before submission.");
  }
  if (check.pendingCount > 0) {
    throw new ValidationError("All financial statement sections must be resolved before submission.");
  }
  if (check.returnedCount > 0) {
    throw new ValidationError("Returned financial statement sections must be addressed before submission.");
  }
}

export function computeFinancialStatementsProgress(
  input: ComputeFinancialStatementsProgressInput,
): number {
  const sections: number[] = [];

  if (input.totalItems === 0) {
    sections.push(0);
  } else {
    sections.push(Math.round((input.resolvedCount / input.totalItems) * 100));
  }

  sections.push(input.pendingCount === 0 ? 100 : Math.max(0, 100 - input.pendingCount * 10));
  sections.push(input.returnedCount === 0 ? 100 : Math.max(0, 100 - input.returnedCount * 15));
  sections.push(input.hasSummaryNotes ? 100 : 0);

  if (input.packageStatus === "published") {
    sections.push(100);
  } else if (input.packageStatus === "approved") {
    sections.push(95);
  } else if (input.packageStatus === "submitted" || input.packageStatus === "under_review") {
    sections.push(85);
  } else if (input.packageStatus === "prepared") {
    sections.push(60);
  } else if (input.packageStatus === "returned") {
    sections.push(50);
  } else {
    sections.push(25);
  }

  return Math.round(sections.reduce((sum, value) => sum + value, 0) / sections.length);
}
