import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { LeadSheetStatus } from "@/constants/lead-sheets";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  assertVersionMatch,
  requireRow,
} from "../base/repository-helpers";
import { NotFoundError } from "@/lib/errors";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";

export type LeadSheet = Tables<"lead_sheets">;
export type LeadSheetLine = Tables<"lead_sheet_lines">;
export type TrialBalancePackage = Tables<"trial_balance_packages">;
export type TrialBalanceLine = Tables<"trial_balance_lines">;

export type CreateLeadSheetInput = {
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  trialBalancePackageId: string;
  fsArea: string;
  name: string;
  sheetStatus: LeadSheetStatus;
  totalReported: number;
  totalTested: number;
  unreconciledDifference: number;
  reconciliationNote?: string | null;
};

export type CreateLeadSheetLineInput = {
  accountCode: string;
  accountName: string;
  reportedAmount: number;
  testedAmount: number;
  difference: number;
  trialBalanceLineId?: string | null;
  workingPaperId?: string | null;
  explanation?: string | null;
};

/**
 * Lead sheet composition persistence (PROJECT_BIBLE §13.2 Audit,
 * Workflow 16 — Lead Sheet Generation).
 */
export class LeadSheetCompositionRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findTrialBalancePackageById(id: string): Promise<TrialBalancePackage | null> {
    const result = await applyActiveFilter(
      this.client.from("trial_balance_packages").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async listTrialBalanceLinesByIds(
    packageId: string,
    lineIds: string[],
  ): Promise<TrialBalanceLine[]> {
    if (lineIds.length === 0) {
      return [];
    }
    const result = await applyActiveFilter(
      this.client
        .from("trial_balance_lines")
        .select("*")
        .eq("package_id", packageId)
        .in("id", lineIds),
    );

    return unwrapSupabaseList(result);
  }

  async findById(id: string): Promise<LeadSheet | null> {
    const result = await applyActiveFilter(
      this.client.from("lead_sheets").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async requireInWorkspace(id: string, workspaceId: string): Promise<LeadSheet> {
    const sheet = requireRow(await this.findById(id), "LeadSheet", id);
    if (sheet.workspace_id !== workspaceId) {
      // Surface as not-found to avoid leaking cross-tenant existence.
      throw new NotFoundError("LeadSheet not found", { id });
    }
    return sheet;
  }

  async listByEngagement(engagementId: string): Promise<LeadSheet[]> {
    const result = await applyActiveFilter(
      this.client.from("lead_sheets").select("*").eq("engagement_id", engagementId),
    ).order("created_at", { ascending: false });

    return unwrapSupabaseList(result);
  }

  async listLines(leadSheetId: string): Promise<LeadSheetLine[]> {
    const result = await applyActiveFilter(
      this.client.from("lead_sheet_lines").select("*").eq("lead_sheet_id", leadSheetId),
    ).order("account_code", { ascending: true });

    return unwrapSupabaseList(result);
  }

  async createLeadSheet(input: CreateLeadSheetInput): Promise<LeadSheet> {
    const payload: TablesInsert<"lead_sheets"> = {
      engagement_id: input.engagementId,
      organization_id: input.organizationId,
      workspace_id: input.workspaceId,
      trial_balance_package_id: input.trialBalancePackageId,
      fs_area: input.fsArea,
      name: input.name,
      sheet_status: input.sheetStatus,
      total_reported: input.totalReported,
      total_tested: input.totalTested,
      unreconciled_difference: input.unreconciledDifference,
      reconciliation_note: input.reconciliationNote ?? null,
    };

    const result = await this.client.from("lead_sheets").insert(payload).select("*").single();

    return unwrapSupabaseResult(result);
  }

  async insertLines(
    sheet: LeadSheet,
    lines: CreateLeadSheetLineInput[],
  ): Promise<LeadSheetLine[]> {
    const payload: TablesInsert<"lead_sheet_lines">[] = lines.map((line) => ({
      lead_sheet_id: sheet.id,
      engagement_id: sheet.engagement_id,
      organization_id: sheet.organization_id,
      workspace_id: sheet.workspace_id,
      trial_balance_line_id: line.trialBalanceLineId ?? null,
      working_paper_id: line.workingPaperId ?? null,
      account_code: line.accountCode,
      account_name: line.accountName,
      reported_amount: line.reportedAmount,
      tested_amount: line.testedAmount,
      difference: line.difference,
      explanation: line.explanation ?? null,
    }));

    const result = await this.client
      .from("lead_sheet_lines")
      .insert(payload)
      .select("*");

    return unwrapSupabaseList(result);
  }

  async updateStatus(
    id: string,
    expectedVersion: number,
    sheetStatus: LeadSheetStatus,
    reconciliationNote?: string | null,
  ): Promise<LeadSheet> {
    const current = requireRow(await this.findById(id), "LeadSheet", id);
    assertVersionMatch(current.version, expectedVersion, "LeadSheet");

    const result = await this.client
      .from("lead_sheets")
      .update({
        sheet_status: sheetStatus,
        ...(reconciliationNote !== undefined ? { reconciliation_note: reconciliationNote } : {}),
      })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select("*")
      .single();

    return unwrapSupabaseResult(result);
  }
}
