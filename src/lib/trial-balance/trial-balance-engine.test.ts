import { describe, expect, it } from "vitest";
import { classifyTrialBalanceAccount } from "./classify";
import { buildTrialBalanceFromNormalizedRows } from "./build-from-uaie";

describe("trial balance classification", () => {
  it("classifies cash as current asset", () => {
    const result = classifyTrialBalanceAccount("1110", "Cash on hand");
    expect(result.accountType).toBe("asset");
    expect(result.leadSchedule).toBe("cash");
    expect(result.confidence).toBeGreaterThanOrEqual(78);
  });

  it("builds balanced lines from normalized rows", () => {
    const built = buildTrialBalanceFromNormalizedRows([
      {
        rowNumber: 1,
        accountCode: "1110",
        accountName: "Cash",
        debit: 100,
        credit: 0,
        balance: 100,
        currencyCode: "AZN",
        isValid: true,
      },
      {
        rowNumber: 2,
        accountCode: "3100",
        accountName: "Capital",
        debit: 0,
        credit: 100,
        balance: -100,
        currencyCode: "AZN",
        isValid: true,
      },
    ]);
    expect(built.lines).toHaveLength(2);
    expect(built.isBalanced).toBe(true);
    expect(built.summary.accountCount).toBe(2);
  });
});
