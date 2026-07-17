import { describe, expect, it } from "vitest";
import { validateGeneralLedgerExplorationImport } from "./general-ledger-exploration-validation";
import { prepareGeneralLedgerExplorationImport } from "./general-ledger-exploration-import";

describe("general-ledger-exploration", () => {
  it("validates and prepares GL import rows", () => {
    const rows = [{ accountCode: " 1000 ", accountName: " Cash ", closingBalance: 10 }];
    expect(() => validateGeneralLedgerExplorationImport(rows)).not.toThrow();
    expect(prepareGeneralLedgerExplorationImport(rows)[0]?.accountCode).toBe("1000");
    expect(() => validateGeneralLedgerExplorationImport([])).toThrowError(/at least one/);
  });
});
