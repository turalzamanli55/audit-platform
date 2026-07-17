export {
  validateGeneralLedgerExplorationImport,
  assertGeneralLedgerExplorationRow,
} from "./general-ledger-exploration-validation";

export function prepareGeneralLedgerExplorationImport(
  rows: Array<{ accountCode: string; accountName: string; closingBalance: number }>,
) {
  return rows.map((row) => ({
    ...row,
    accountCode: row.accountCode.trim(),
    accountName: row.accountName.trim(),
  }));
}
