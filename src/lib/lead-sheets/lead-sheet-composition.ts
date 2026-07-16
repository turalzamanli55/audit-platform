import { ValidationError } from "@/lib/errors";
import type { LeadSheetStatus } from "@/constants/lead-sheets";

/**
 * Lead sheet composition rules (PROJECT_BIBLE §13.2 Audit, Workflow 16 —
 * Lead Sheet Generation). Lead sheet totals must reconcile to the trial
 * balance; unlinked accounts are flagged; differences require documented
 * explanation.
 */

export type LeadSheetLineInput = {
  accountCode: string;
  accountName: string;
  reportedAmount: number;
  testedAmount: number;
  trialBalanceLineId?: string | null;
  workingPaperId?: string | null;
  explanation?: string | null;
};

export type LeadSheetTotals = {
  totalReported: number;
  totalTested: number;
  unreconciledDifference: number;
};

export type LeadSheetLineFlag = {
  accountCode: string;
  code: "unlinked_account" | "unexplained_difference";
  message: string;
};

export type LeadSheetComposition = {
  totals: LeadSheetTotals;
  lines: Array<LeadSheetLineInput & { difference: number }>;
  flags: LeadSheetLineFlag[];
  reconciled: boolean;
};

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function composeLeadSheetLines(lines: LeadSheetLineInput[]): LeadSheetComposition {
  if (lines.length === 0) {
    throw new ValidationError("A lead sheet requires at least one line");
  }

  const flags: LeadSheetLineFlag[] = [];
  const composed = lines.map((line) => {
    if (!line.accountCode.trim()) {
      throw new ValidationError("Every lead sheet line requires an account code");
    }
    const difference = round2(line.reportedAmount - line.testedAmount);

    if (!line.trialBalanceLineId) {
      flags.push({
        accountCode: line.accountCode,
        code: "unlinked_account",
        message: `Account ${line.accountCode} is not linked to a trial balance line`,
      });
    }
    if (difference !== 0 && !line.explanation?.trim()) {
      flags.push({
        accountCode: line.accountCode,
        code: "unexplained_difference",
        message: `Account ${line.accountCode} has an unexplained difference of ${difference}`,
      });
    }

    return { ...line, difference };
  });

  const totalReported = round2(
    composed.reduce((sum, line) => sum + line.reportedAmount, 0),
  );
  const totalTested = round2(composed.reduce((sum, line) => sum + line.testedAmount, 0));
  const unreconciledDifference = round2(totalReported - totalTested);

  return {
    totals: { totalReported, totalTested, unreconciledDifference },
    lines: composed,
    flags,
    reconciled: unreconciledDifference === 0 && flags.length === 0,
  };
}

/**
 * Lead sheet totals must reconcile to the trial balance total for the
 * financial statement area (PROJECT_BIBLE Workflow 16 business rule).
 */
export function assertLeadSheetReconcilesToTrialBalance(
  totals: LeadSheetTotals,
  trialBalanceTotal: number,
): void {
  const delta = round2(totals.totalReported - trialBalanceTotal);
  if (delta !== 0) {
    throw new ValidationError(
      `Lead sheet reported total ${totals.totalReported} does not reconcile to trial balance total ${trialBalanceTotal} (difference ${delta})`,
    );
  }
}

export function deriveLeadSheetStatus(composition: LeadSheetComposition): LeadSheetStatus {
  return composition.reconciled ? "reconciled" : "draft";
}

/** Only reconciled lead sheets can be approved. */
export function assertLeadSheetApprovable(status: LeadSheetStatus): void {
  if (status === "approved") {
    throw new ValidationError("Lead sheet is already approved");
  }
  if (status !== "reconciled") {
    throw new ValidationError("Only reconciled lead sheets can be approved");
  }
}
