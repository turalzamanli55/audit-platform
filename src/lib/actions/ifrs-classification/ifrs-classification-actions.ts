"use server";

import { FINANCIAL_REPORTING_PERMISSIONS } from "@/constants/financial-reporting";
import {
  createFinancialReportingAction,
  createFrRepositoryContext,
} from "@/lib/actions/financial-reporting/financial-reporting-action";
import {
  classifyIfrsAccount,
  type IfrsClassificationInput,
} from "@/lib/ifrs-classification/ifrs-classification";
import { createServerClient } from "@/lib/supabase/server";
import { IfrsClassificationRepository } from "@/repositories/ifrs-classification/ifrs-classification-repository";
import { ValidationError } from "@/lib/errors";

export type ClassifyIfrsAccountsInput = {
  accounts: IfrsClassificationInput[];
  persistRules?: boolean;
  standard?: string;
};

export type ClassifyIfrsAccountsResult = {
  classifications: Array<{ accountCode: string; ifrsClass: string }>;
  persistedRules: number;
};

export const classifyIfrsAccountsAction = createFinancialReportingAction<
  ClassifyIfrsAccountsInput,
  ClassifyIfrsAccountsResult
>(
  { module: "financial-reporting.ifrs-classification.classify" },
  FINANCIAL_REPORTING_PERMISSIONS.IFRS_CLASSIFY,
  async (input, context) => {
    if (!input.accounts?.length) {
      throw new ValidationError("At least one account is required");
    }

    const classifications = input.accounts.map((account) => ({
      accountCode: account.accountCode,
      ifrsClass: classifyIfrsAccount(account),
    }));

    let persistedRules = 0;
    if (input.persistRules) {
      const supabase = await createServerClient();
      const repository = new IfrsClassificationRepository(
        supabase,
        createFrRepositoryContext(context.userId, context.organizationId, context.workspaceId),
      );
      for (const row of classifications) {
        await repository.createRule({
          organization_id: context.organizationId,
          workspace_id: context.workspaceId,
          standard: input.standard ?? "ifrs",
          account_pattern: row.accountCode,
          ifrs_class: row.ifrsClass,
          statement_area: row.ifrsClass,
        });
        persistedRules += 1;
      }
    }

    return { classifications, persistedRules };
  },
);
