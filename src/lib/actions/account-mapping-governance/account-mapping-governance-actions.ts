"use server";

import { FINANCIAL_REPORTING_PERMISSIONS } from "@/constants/financial-reporting";
import {
  createFinancialReportingAction,
  createFrRepositoryContext,
} from "@/lib/actions/financial-reporting/financial-reporting-action";
import { createServerClient } from "@/lib/supabase/server";
import { AccountMappingGovernanceRepository } from "@/repositories/account-mapping-governance/account-mapping-governance-repository";
import { ValidationError } from "@/lib/errors";

export type GovernAccountMappingInput = {
  engagementId: string;
  accountCode: string;
  fsLineCode: string;
  mappingSetId?: string | null;
  governanceStatus?: "draft" | "validated" | "approved" | "published";
};

export type GovernAccountMappingResult = {
  entryId: string;
  governanceStatus: string;
};

export const governAccountMappingAction = createFinancialReportingAction<
  GovernAccountMappingInput,
  GovernAccountMappingResult
>(
  { module: "financial-reporting.account-mapping-governance.govern" },
  FINANCIAL_REPORTING_PERMISSIONS.ACCOUNT_MAPPING_GOVERN,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    if (!input.accountCode.trim() || !input.fsLineCode.trim()) {
      throw new ValidationError("Account code and FS line code are required");
    }

    const supabase = await createServerClient();
    const repository = new AccountMappingGovernanceRepository(
      supabase,
      createFrRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const entry = await repository.upsertEntry({
      organization_id: context.organizationId,
      workspace_id: context.workspaceId,
      engagement_id: input.engagementId,
      mapping_set_id: input.mappingSetId ?? null,
      account_code: input.accountCode.trim(),
      fs_line_code: input.fsLineCode.trim(),
      governance_status: input.governanceStatus ?? "draft",
    });

    return { entryId: entry.id, governanceStatus: entry.governance_status };
  },
);
