"use server";

import { FINANCIAL_REPORTING_PERMISSIONS } from "@/constants/financial-reporting";
import {
  createFinancialReportingAction,
  createFrRepositoryContext,
} from "@/lib/actions/financial-reporting/financial-reporting-action";
import { createServerClient } from "@/lib/supabase/server";
import { GeneralLedgerExplorationRepository } from "@/repositories/general-ledger-exploration/general-ledger-exploration-repository";
import { ValidationError } from "@/lib/errors";

export type ImportGeneralLedgerExplorationInput = {
  engagementId: string;
  trialBalancePackageId?: string | null;
  sourceImportSessionId?: string | null;
  rows: Array<{
    accountCode: string;
    accountName: string;
    openingBalance?: number;
    movementDebit?: number;
    movementCredit?: number;
    closingBalance?: number;
  }>;
};

export type ImportGeneralLedgerExplorationResult = {
  importedCount: number;
};

export const importGeneralLedgerExplorationAction = createFinancialReportingAction<
  ImportGeneralLedgerExplorationInput,
  ImportGeneralLedgerExplorationResult
>(
  { module: "financial-reporting.general-ledger-exploration.import" },
  FINANCIAL_REPORTING_PERMISSIONS.GENERAL_LEDGER_EXPLORE,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    if (!input.rows?.length) throw new ValidationError("At least one GL row is required");

    for (const row of input.rows) {
      if (!row.accountCode.trim() || !row.accountName.trim()) {
        throw new ValidationError("Each GL row requires account code and name");
      }
    }

    const supabase = await createServerClient();
    const repository = new GeneralLedgerExplorationRepository(
      supabase,
      createFrRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const imported = await repository.importRows(
      input.rows.map((row) => ({
        organization_id: context.organizationId,
        workspace_id: context.workspaceId,
        engagement_id: input.engagementId,
        trial_balance_package_id: input.trialBalancePackageId ?? null,
        source_import_session_id: input.sourceImportSessionId ?? null,
        account_code: row.accountCode.trim(),
        account_name: row.accountName.trim(),
        opening_balance: row.openingBalance ?? 0,
        movement_debit: row.movementDebit ?? 0,
        movement_credit: row.movementCredit ?? 0,
        closing_balance: row.closingBalance ?? 0,
      })),
    );

    return { importedCount: imported.length };
  },
);
