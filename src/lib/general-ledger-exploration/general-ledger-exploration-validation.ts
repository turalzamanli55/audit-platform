import { ValidationError } from "@/lib/errors";

/** General ledger exploration validation + import helpers. */
export type GeneralLedgerExplorationRow = {
  accountCode: string;
  accountName: string;
  closingBalance: number;
};

export function assertGeneralLedgerExplorationRow(row: GeneralLedgerExplorationRow): void {
  if (!row.accountCode.trim() || !row.accountName.trim()) {
    throw new ValidationError("GL exploration rows require account code and name");
  }
}

export function validateGeneralLedgerExplorationImport(
  rows: GeneralLedgerExplorationRow[],
): void {
  if (rows.length === 0) {
    throw new ValidationError("GL exploration import requires at least one row");
  }
  for (const row of rows) assertGeneralLedgerExplorationRow(row);
}
