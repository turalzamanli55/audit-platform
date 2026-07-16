import { describe, expect, it } from "vitest";
import {
  assertLeadSheetApprovable,
  assertLeadSheetReconcilesToTrialBalance,
  composeLeadSheetLines,
  deriveLeadSheetStatus,
  type LeadSheetLineInput,
} from "./lead-sheet-composition";

const reconciledLines: LeadSheetLineInput[] = [
  {
    accountCode: "1200",
    accountName: "Trade receivables",
    reportedAmount: 1500.5,
    testedAmount: 1500.5,
    trialBalanceLineId: "tbl-1",
    workingPaperId: "wp-1",
  },
  {
    accountCode: "1210",
    accountName: "Other receivables",
    reportedAmount: 499.5,
    testedAmount: 499.5,
    trialBalanceLineId: "tbl-2",
    workingPaperId: "wp-2",
  },
];

describe("lead sheet composition", () => {
  it("composes totals and marks fully tested sheets as reconciled", () => {
    const composition = composeLeadSheetLines(reconciledLines);
    expect(composition.totals.totalReported).toBe(2000);
    expect(composition.totals.totalTested).toBe(2000);
    expect(composition.totals.unreconciledDifference).toBe(0);
    expect(composition.flags).toEqual([]);
    expect(composition.reconciled).toBe(true);
    expect(deriveLeadSheetStatus(composition)).toBe("reconciled");
  });

  it("flags unlinked accounts", () => {
    const composition = composeLeadSheetLines([
      { ...reconciledLines[0]!, trialBalanceLineId: null },
      reconciledLines[1]!,
    ]);
    expect(composition.flags.map((flag) => flag.code)).toContain("unlinked_account");
    expect(composition.reconciled).toBe(false);
  });

  it("flags unexplained differences and accepts documented ones", () => {
    const withDifference = composeLeadSheetLines([
      { ...reconciledLines[0]!, testedAmount: 1400.5 },
      reconciledLines[1]!,
    ]);
    expect(withDifference.flags.map((flag) => flag.code)).toContain("unexplained_difference");
    expect(withDifference.totals.unreconciledDifference).toBe(100);

    const documented = composeLeadSheetLines([
      {
        ...reconciledLines[0]!,
        testedAmount: 1400.5,
        explanation: "Immaterial untested balance below testing threshold",
      },
      reconciledLines[1]!,
    ]);
    expect(documented.flags).toEqual([]);
    expect(documented.reconciled).toBe(false);
  });

  it("computes per-line differences with 2dp rounding", () => {
    const composition = composeLeadSheetLines([
      {
        ...reconciledLines[0]!,
        reportedAmount: 10.005,
        testedAmount: 10,
        explanation: "Rounding",
      },
      reconciledLines[1]!,
    ]);
    expect(composition.lines[0]!.difference).toBe(0.01);
  });

  it("requires at least one line and an account code", () => {
    expect(() => composeLeadSheetLines([])).toThrowError(/at least one line/);
    expect(() =>
      composeLeadSheetLines([{ ...reconciledLines[0]!, accountCode: "  " }]),
    ).toThrowError(/account code/);
  });

  it("asserts reconciliation to the trial balance total", () => {
    const composition = composeLeadSheetLines(reconciledLines);
    expect(() =>
      assertLeadSheetReconcilesToTrialBalance(composition.totals, 2000),
    ).not.toThrow();
    expect(() =>
      assertLeadSheetReconcilesToTrialBalance(composition.totals, 2100),
    ).toThrowError(/does not reconcile/);
  });

  it("only approves reconciled lead sheets", () => {
    expect(() => assertLeadSheetApprovable("reconciled")).not.toThrow();
    expect(() => assertLeadSheetApprovable("draft")).toThrowError(/reconciled/);
    expect(() => assertLeadSheetApprovable("approved")).toThrowError(/already/);
  });
});
