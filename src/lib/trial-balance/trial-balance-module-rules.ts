import type { Tables } from "@/types/supabase";
import { ValidationError } from "@/lib/errors";
import type { TrialBalancePackageStatus } from "@/types/trial-balance";
import { LOCKED_TRIAL_BALANCE_STATUSES } from "@/constants/trial-balance";

export type TrialBalancePackageRecord = Tables<"trial_balance_packages">;

export function isTrialBalanceApproved(
  pkg: Pick<TrialBalancePackageRecord, "package_status"> | null | undefined,
): boolean {
  return pkg?.package_status === "approved" || pkg?.package_status === "locked";
}

export function assertTrialBalanceApprovedForFinancialStatements(
  pkg: Pick<TrialBalancePackageRecord, "package_status"> | null | undefined,
): void {
  if (!isTrialBalanceApproved(pkg)) {
    throw new ValidationError(
      "Trial Balance must be approved before Financial Statements can begin",
    );
  }
}

export function assertTrialBalanceEditable(
  pkg: Pick<TrialBalancePackageRecord, "package_status">,
): void {
  if ((LOCKED_TRIAL_BALANCE_STATUSES as readonly string[]).includes(pkg.package_status)) {
    throw new ValidationError("Locked or archived trial balance packages are read-only");
  }
}

export function canTransitionTrialBalanceStatus(
  from: TrialBalancePackageStatus,
  to: TrialBalancePackageStatus,
): boolean {
  const allowed: Record<TrialBalancePackageStatus, TrialBalancePackageStatus[]> = {
    draft: ["validated", "archived"],
    validated: ["submitted", "draft", "archived"],
    submitted: ["under_review", "returned", "archived"],
    under_review: ["approved", "returned", "archived"],
    returned: ["draft", "validated", "archived"],
    approved: ["locked", "archived"],
    locked: ["archived"],
    archived: [],
  };
  return allowed[from]?.includes(to) ?? false;
}
