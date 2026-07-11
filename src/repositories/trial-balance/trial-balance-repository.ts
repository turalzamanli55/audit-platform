import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter, requireRow } from "../base/repository-helpers";
import { NotFoundError } from "@/lib/errors";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";
import type { TrialBalanceBuiltLine, TrialBalanceValidationIssue } from "@/types/trial-balance";

export type TrialBalancePackage = Tables<"trial_balance_packages">;
export type TrialBalanceLine = Tables<"trial_balance_lines">;
export type TrialBalanceAdjustment = Tables<"trial_balance_adjustments">;
export type TrialBalanceMapping = Tables<"trial_balance_mappings">;
export type TrialBalancePeriod = Tables<"trial_balance_periods">;
export type TrialBalanceVersion = Tables<"trial_balance_versions">;

export class TrialBalanceRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findByEngagementId(engagementId: string): Promise<TrialBalancePackage | null> {
    const result = await applyActiveFilter(
      this.client.from("trial_balance_packages").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findById(id: string): Promise<TrialBalancePackage | null> {
    const result = await applyActiveFilter(
      this.client.from("trial_balance_packages").select("*").eq("id", id),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async requirePackage(id: string): Promise<TrialBalancePackage> {
    const pkg = await this.findById(id);
    if (!pkg) throw new NotFoundError("Trial balance package not found");
    return pkg;
  }

  async createPackage(input: TablesInsert<"trial_balance_packages">): Promise<TrialBalancePackage> {
    const result = await this.client
      .from("trial_balance_packages")
      .insert({ ...input, created_by: this.userId, updated_by: this.userId })
      .select("*")
      .single();
    return requireRow(unwrapSupabaseResult(result), "TrialBalancePackage");
  }

  async updatePackage(
    id: string,
    patch: Partial<TrialBalancePackage>,
  ): Promise<TrialBalancePackage> {
    const result = await applyActiveFilter(
      this.client
        .from("trial_balance_packages")
        .update({ ...patch, updated_by: this.userId })
        .eq("id", id)
        .select("*"),
    ).maybeSingle();
    return requireRow(unwrapSupabaseMaybeSingle(result), "TrialBalancePackage", id);
  }

  async replaceLines(
    pkg: TrialBalancePackage,
    lines: TrialBalanceBuiltLine[],
  ): Promise<TrialBalanceLine[]> {
    await this.client.from("trial_balance_lines").delete().eq("package_id", pkg.id);
    if (lines.length === 0) return [];

    const inserted: TrialBalanceLine[] = [];
    const chunkSize = 400;
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize);
      const result = await this.client
        .from("trial_balance_lines")
        .insert(
          chunk.map((line, index) => ({
            package_id: pkg.id,
            organization_id: pkg.organization_id,
            workspace_id: pkg.workspace_id,
            company_id: pkg.company_id,
            engagement_id: pkg.engagement_id,
            account_code: line.accountCode,
            account_name: line.accountName,
            account_level: line.accountLevel,
            account_type: line.accountType,
            category: line.category,
            subcategory: line.subcategory,
            classification_confidence: line.classificationConfidence,
            opening_debit: line.openingDebit,
            opening_credit: line.openingCredit,
            movement_debit: line.movementDebit,
            movement_credit: line.movementCredit,
            closing_debit: line.closingDebit,
            closing_credit: line.closingCredit,
            closing_balance: line.closingBalance,
            adjusted_closing_balance: line.closingBalance,
            original_currency: line.originalCurrency,
            exchange_rate: line.exchangeRate,
            functional_amount: line.functionalAmount,
            presentation_amount: line.presentationAmount,
            fx_gain_loss: line.fxGainLoss,
            lead_schedule: line.leadSchedule,
            fs_statement: line.fsStatement,
            is_mapped: line.isMapped,
            is_orphan: line.isOrphan,
            source_row_number: line.sourceRowNumber,
            sort_order: line.sortOrder || i + index,
            created_by: this.userId,
            updated_by: this.userId,
          })),
        )
        .select("*");
      inserted.push(...unwrapSupabaseList(result));
    }

    // Wire parent_line_id after insert
    const byCode = new Map(inserted.map((line) => [line.account_code, line]));
    for (const built of lines) {
      if (!built.parentAccountCode) continue;
      const child = byCode.get(built.accountCode);
      const parent = byCode.get(built.parentAccountCode);
      if (child && parent) {
        await this.client
          .from("trial_balance_lines")
          .update({ parent_line_id: parent.id })
          .eq("id", child.id);
        child.parent_line_id = parent.id;
      }
    }

    return inserted;
  }

  async listLines(packageId: string): Promise<TrialBalanceLine[]> {
    const result = await applyActiveFilter(
      this.client
        .from("trial_balance_lines")
        .select("*")
        .eq("package_id", packageId)
        .order("account_code", { ascending: true }),
    );
    return unwrapSupabaseList(result);
  }

  async updateLine(id: string, patch: Partial<TrialBalanceLine>): Promise<TrialBalanceLine> {
    const result = await applyActiveFilter(
      this.client
        .from("trial_balance_lines")
        .update({ ...patch, updated_by: this.userId })
        .eq("id", id)
        .select("*"),
    ).maybeSingle();
    return requireRow(unwrapSupabaseMaybeSingle(result), "TrialBalanceLine", id);
  }

  async createAdjustment(
    input: TablesInsert<"trial_balance_adjustments">,
  ): Promise<TrialBalanceAdjustment> {
    const result = await this.client
      .from("trial_balance_adjustments")
      .insert({ ...input, created_by: this.userId, updated_by: this.userId })
      .select("*")
      .single();
    return requireRow(unwrapSupabaseResult(result), "TrialBalanceAdjustment");
  }

  async listAdjustments(packageId: string): Promise<TrialBalanceAdjustment[]> {
    const result = await applyActiveFilter(
      this.client
        .from("trial_balance_adjustments")
        .select("*")
        .eq("package_id", packageId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async updateAdjustment(
    id: string,
    patch: Partial<TrialBalanceAdjustment>,
  ): Promise<TrialBalanceAdjustment> {
    const result = await applyActiveFilter(
      this.client
        .from("trial_balance_adjustments")
        .update({ ...patch, updated_by: this.userId })
        .eq("id", id)
        .select("*"),
    ).maybeSingle();
    return requireRow(unwrapSupabaseMaybeSingle(result), "TrialBalanceAdjustment", id);
  }

  async upsertMapping(
    input: TablesInsert<"trial_balance_mappings">,
  ): Promise<TrialBalanceMapping> {
    const result = await this.client
      .from("trial_balance_mappings")
      .insert({ ...input, created_by: this.userId, updated_by: this.userId })
      .select("*")
      .single();
    return requireRow(unwrapSupabaseResult(result), "TrialBalanceMapping");
  }

  async listMappings(packageId: string): Promise<TrialBalanceMapping[]> {
    const result = await applyActiveFilter(
      this.client.from("trial_balance_mappings").select("*").eq("package_id", packageId),
    );
    return unwrapSupabaseList(result);
  }

  async replacePeriods(
    pkg: TrialBalancePackage,
    periods: Array<{
      periodType: TrialBalancePeriod["period_type"];
      periodLabel: string;
      fiscalYear: number;
      isComparative?: boolean;
      sortOrder?: number;
    }>,
  ): Promise<void> {
    await this.client.from("trial_balance_periods").delete().eq("package_id", pkg.id);
    if (periods.length === 0) return;
    await this.client.from("trial_balance_periods").insert(
      periods.map((period, index) => ({
        package_id: pkg.id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        period_type: period.periodType,
        period_label: period.periodLabel,
        fiscal_year: period.fiscalYear,
        is_comparative: period.isComparative ?? false,
        sort_order: period.sortOrder ?? index,
      })),
    );
  }

  async listPeriods(packageId: string): Promise<TrialBalancePeriod[]> {
    const result = await this.client
      .from("trial_balance_periods")
      .select("*")
      .eq("package_id", packageId)
      .order("sort_order", { ascending: true });
    return unwrapSupabaseList(result);
  }

  async createVersion(input: {
    packageId: string;
    organizationId: string;
    workspaceId: string;
    versionNumber: number;
    changeSummary: string;
    snapshotJson: Json;
    diffJson?: Json;
  }): Promise<TrialBalanceVersion> {
    const result = await this.client
      .from("trial_balance_versions")
      .insert({
        package_id: input.packageId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        version_number: input.versionNumber,
        change_summary: input.changeSummary,
        snapshot_json: input.snapshotJson,
        diff_json: input.diffJson ?? {},
        created_by: this.userId,
      })
      .select("*")
      .single();
    return requireRow(unwrapSupabaseResult(result), "TrialBalanceVersion");
  }

  async listVersions(packageId: string): Promise<TrialBalanceVersion[]> {
    const result = await this.client
      .from("trial_balance_versions")
      .select("*")
      .eq("package_id", packageId)
      .order("version_number", { ascending: false });
    return unwrapSupabaseList(result);
  }

  async logActivity(input: {
    packageId: string;
    organizationId: string;
    workspaceId: string;
    companyId: string;
    engagementId: string;
    action: string;
    summary?: string;
    metadata?: Json;
  }): Promise<void> {
    await this.client.from("trial_balance_activity").insert({
      package_id: input.packageId,
      organization_id: input.organizationId,
      workspace_id: input.workspaceId,
      company_id: input.companyId,
      engagement_id: input.engagementId,
      action: input.action,
      summary: input.summary ?? null,
      metadata: input.metadata ?? {},
      created_by: this.userId,
    });
  }

  async listActivity(packageId: string, limit = 100) {
    const result = await this.client
      .from("trial_balance_activity")
      .select("*")
      .eq("package_id", packageId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async applyValidationSnapshot(
    pkg: TrialBalancePackage,
    issues: TrialBalanceValidationIssue[],
    summary: {
      accountCount: number;
      warningCount: number;
      errorCount: number;
      mappedCount: number;
      unmappedCount: number;
      isBalanced: boolean;
      outOfBalanceAmount: number;
      adjustmentCount?: number;
    },
  ): Promise<TrialBalancePackage> {
    return this.updatePackage(pkg.id, {
      is_balanced: summary.isBalanced,
      out_of_balance_amount: summary.outOfBalanceAmount,
      account_count: summary.accountCount,
      warning_count: summary.warningCount,
      error_count: summary.errorCount,
      mapped_count: summary.mappedCount,
      unmapped_count: summary.unmappedCount,
      adjustment_count: summary.adjustmentCount ?? pkg.adjustment_count,
      validation_json: { issues } as Json,
      summary_json: summary as unknown as Json,
    });
  }
}
