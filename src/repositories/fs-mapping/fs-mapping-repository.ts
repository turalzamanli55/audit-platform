import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "@/repositories/base/base-repository";
import { NotFoundError } from "@/lib/errors";
import type {
  FsMappingHistoryRecord,
  FsMappingLine,
  FsMappingRule,
  FsMappingSet,
  FsMappingVersion,
} from "@/types/fs-mapping";

type DbClient = SupabaseClient<Database>;

/** Untyped table access until supabase codegen includes FSME tables. */
function table(client: DbClient, name: string) {
  return (client as unknown as { from: (relation: string) => ReturnType<DbClient["from"]> }).from(
    name,
  );
}

function mapSet(row: Record<string, unknown>): FsMappingSet {
  return {
    id: String(row.id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    companyId: String(row.company_id),
    engagementId: String(row.engagement_id),
    trialBalancePackageId: (row.trial_balance_package_id as string | null) ?? null,
    name: String(row.name),
    description: (row.description as string | null) ?? null,
    standard: row.standard as FsMappingSet["standard"],
    setStatus: row.set_status as FsMappingSet["setStatus"],
    setVersion: Number(row.set_version),
    comparativeMode: row.comparative_mode as FsMappingSet["comparativeMode"],
    coveragePct: Number(row.coverage_pct),
    mappedAccountCount: Number(row.mapped_account_count),
    unmappedAccountCount: Number(row.unmapped_account_count),
    validationErrorCount: Number(row.validation_error_count),
    validationWarningCount: Number(row.validation_warning_count),
    versionCount: Number(row.version_count),
    summaryJson: (row.summary_json as Record<string, unknown>) ?? {},
    validationJson: (row.validation_json as Record<string, unknown>) ?? {},
    datasetJson: (row.dataset_json as Record<string, unknown>) ?? {},
    validatedAt: (row.validated_at as string | null) ?? null,
    validatedBy: (row.validated_by as string | null) ?? null,
    approvedAt: (row.approved_at as string | null) ?? null,
    approvedBy: (row.approved_by as string | null) ?? null,
    publishedAt: (row.published_at as string | null) ?? null,
    publishedBy: (row.published_by as string | null) ?? null,
    archivedAt: (row.archived_at as string | null) ?? null,
    archivedBy: (row.archived_by as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    createdBy: (row.created_by as string | null) ?? null,
    updatedBy: (row.updated_by as string | null) ?? null,
    deletedAt: (row.deleted_at as string | null) ?? null,
    version: Number(row.version),
  };
}

function mapRule(row: Record<string, unknown>): FsMappingRule {
  return {
    id: String(row.id),
    mappingSetId: String(row.mapping_set_id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    engagementId: String(row.engagement_id),
    ruleCode: String(row.rule_code),
    ruleName: String(row.rule_name),
    ruleType: row.rule_type as FsMappingRule["ruleType"],
    sourceAccountCodes: (row.source_account_codes as string[]) ?? [],
    targetLineCode: String(row.target_line_code),
    targetSection: row.target_section as FsMappingRule["targetSection"],
    classification: row.classification as FsMappingRule["classification"],
    aggregationMethod: row.aggregation_method as FsMappingRule["aggregationMethod"],
    formulaExpression: (row.formula_expression as string | null) ?? null,
    conditionExpression: (row.condition_expression as string | null) ?? null,
    weight: row.weight == null ? null : Number(row.weight),
    sortOrder: Number(row.sort_order),
    isActive: Boolean(row.is_active),
    allowsNegative: Boolean(row.allows_negative),
    metadataJson: (row.metadata_json as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    version: Number(row.version),
  };
}

function mapLine(row: Record<string, unknown>): FsMappingLine {
  return {
    id: String(row.id),
    mappingSetId: String(row.mapping_set_id),
    mappingRuleId: (row.mapping_rule_id as string | null) ?? null,
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    engagementId: String(row.engagement_id),
    trialBalanceLineId: (row.trial_balance_line_id as string | null) ?? null,
    accountCode: String(row.account_code),
    accountName: String(row.account_name),
    classification: row.classification as FsMappingLine["classification"],
    classificationConfidence: Number(row.classification_confidence),
    statementSection: row.statement_section as FsMappingLine["statementSection"],
    targetLineCode: (row.target_line_code as string | null) ?? null,
    targetLineLabel: (row.target_line_label as string | null) ?? null,
    parentLineCode: (row.parent_line_code as string | null) ?? null,
    hierarchyLevel: Number(row.hierarchy_level),
    aggregationMethod: row.aggregation_method as FsMappingLine["aggregationMethod"],
    currentYearAmount: Number(row.current_year_amount),
    previousYearAmount: row.previous_year_amount == null ? null : Number(row.previous_year_amount),
    multiYearAmounts: (row.multi_year_amounts as Array<{ year: number; amount: number }>) ?? [],
    isMapped: Boolean(row.is_mapped),
    isOrphan: Boolean(row.is_orphan),
    isCalculated: Boolean(row.is_calculated),
    sortOrder: Number(row.sort_order),
    metadataJson: (row.metadata_json as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    version: Number(row.version),
  };
}

export class FsMappingRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findSetByEngagementId(engagementId: string): Promise<FsMappingSet | null> {
    const result = await table(this.client, "financial_statement_mapping_sets")
      .select("*")
      .eq("engagement_id", engagementId)
      .is("deleted_at", null)
      .maybeSingle();
    if (result.error) throw result.error;
    return result.data ? mapSet(result.data as Record<string, unknown>) : null;
  }

  async requireSet(id: string): Promise<FsMappingSet> {
    const result = await table(this.client, "financial_statement_mapping_sets")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) throw new NotFoundError("FS mapping set not found");
    return mapSet(result.data as Record<string, unknown>);
  }

  async createSet(input: {
    organizationId: string;
    workspaceId: string;
    companyId: string;
    engagementId: string;
    trialBalancePackageId?: string | null;
    name: string;
    description?: string | null;
    standard: FsMappingSet["standard"];
    comparativeMode?: FsMappingSet["comparativeMode"];
  }): Promise<FsMappingSet> {
    const result = await table(this.client, "financial_statement_mapping_sets")
      .insert({
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        company_id: input.companyId,
        engagement_id: input.engagementId,
        trial_balance_package_id: input.trialBalancePackageId ?? null,
        name: input.name,
        description: input.description ?? null,
        standard: input.standard,
        comparative_mode: input.comparativeMode ?? "current_year",
        created_by: this.userId,
        updated_by: this.userId,
      } as never)
      .select("*")
      .single();
    if (result.error) throw result.error;
    return mapSet(result.data as Record<string, unknown>);
  }

  async updateSet(id: string, patch: Record<string, unknown>): Promise<FsMappingSet> {
    const result = await table(this.client, "financial_statement_mapping_sets")
      .update({ ...patch, updated_by: this.userId } as never)
      .eq("id", id)
      .is("deleted_at", null)
      .select("*")
      .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) throw new NotFoundError("FS mapping set not found");
    return mapSet(result.data as Record<string, unknown>);
  }

  async listRules(mappingSetId: string): Promise<FsMappingRule[]> {
    const result = await table(this.client, "financial_statement_mapping_rules")
      .select("*")
      .eq("mapping_set_id", mappingSetId)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapRule);
  }

  async replaceRules(mappingSetId: string, rules: Array<Omit<FsMappingRule, "id" | "createdAt" | "updatedAt" | "version">>): Promise<FsMappingRule[]> {
    await table(this.client, "financial_statement_mapping_rules")
      .update({ deleted_at: new Date().toISOString(), deleted_by: this.userId } as never)
      .eq("mapping_set_id", mappingSetId)
      .is("deleted_at", null);

    if (rules.length === 0) return [];
    const rows = rules.map((rule) => ({
      mapping_set_id: mappingSetId,
      organization_id: rule.organizationId,
      workspace_id: rule.workspaceId,
      engagement_id: rule.engagementId,
      rule_code: rule.ruleCode,
      rule_name: rule.ruleName,
      rule_type: rule.ruleType,
      source_account_codes: rule.sourceAccountCodes,
      target_line_code: rule.targetLineCode,
      target_section: rule.targetSection,
      classification: rule.classification,
      aggregation_method: rule.aggregationMethod,
      formula_expression: rule.formulaExpression,
      condition_expression: rule.conditionExpression,
      weight: rule.weight,
      sort_order: rule.sortOrder,
      is_active: rule.isActive,
      allows_negative: rule.allowsNegative,
      metadata_json: rule.metadataJson,
      created_by: this.userId,
      updated_by: this.userId,
    }));
    const result = await table(this.client, "financial_statement_mapping_rules")
      .insert(rows as never)
      .select("*");
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapRule);
  }

  async listLines(mappingSetId: string): Promise<FsMappingLine[]> {
    const result = await table(this.client, "financial_statement_mapping_lines")
      .select("*")
      .eq("mapping_set_id", mappingSetId)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapLine);
  }

  async replaceLines(mappingSetId: string, lines: FsMappingLine[]): Promise<FsMappingLine[]> {
    await table(this.client, "financial_statement_mapping_lines")
      .delete()
      .eq("mapping_set_id", mappingSetId);

    if (lines.length === 0) return [];
    const rows = lines.map((line, index) => ({
      mapping_set_id: mappingSetId,
      mapping_rule_id: line.mappingRuleId,
      organization_id: line.organizationId,
      workspace_id: line.workspaceId,
      engagement_id: line.engagementId,
      trial_balance_line_id: line.trialBalanceLineId,
      account_code: line.accountCode,
      account_name: line.accountName,
      classification: line.classification,
      classification_confidence: line.classificationConfidence,
      statement_section: line.statementSection,
      target_line_code: line.targetLineCode,
      target_line_label: line.targetLineLabel,
      parent_line_code: line.parentLineCode,
      hierarchy_level: line.hierarchyLevel,
      aggregation_method: line.aggregationMethod,
      current_year_amount: line.currentYearAmount,
      previous_year_amount: line.previousYearAmount,
      multi_year_amounts: line.multiYearAmounts,
      is_mapped: line.isMapped,
      is_orphan: line.isOrphan,
      is_calculated: line.isCalculated,
      sort_order: line.sortOrder ?? index,
      metadata_json: line.metadataJson,
      created_by: this.userId,
      updated_by: this.userId,
    }));

    const inserted: FsMappingLine[] = [];
    const chunkSize = 300;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const result = await table(this.client, "financial_statement_mapping_lines")
        .insert(chunk as never)
        .select("*");
      if (result.error) throw result.error;
      inserted.push(...((result.data as Record<string, unknown>[]) ?? []).map(mapLine));
    }
    return inserted;
  }

  async listVersions(mappingSetId: string): Promise<FsMappingVersion[]> {
    const result = await table(this.client, "financial_statement_mapping_versions")
      .select("*")
      .eq("mapping_set_id", mappingSetId)
      .order("version_number", { ascending: false });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map((row) => ({
      id: String(row.id),
      mappingSetId: String(row.mapping_set_id),
      organizationId: String(row.organization_id),
      workspaceId: String(row.workspace_id),
      engagementId: String(row.engagement_id),
      versionNumber: Number(row.version_number),
      versionStatus: row.version_status as FsMappingVersion["versionStatus"],
      changeSummary: (row.change_summary as string | null) ?? null,
      snapshotJson: (row.snapshot_json as Record<string, unknown>) ?? {},
      rolledBackFromVersion:
        row.rolled_back_from_version == null ? null : Number(row.rolled_back_from_version),
      publishedAt: (row.published_at as string | null) ?? null,
      publishedBy: (row.published_by as string | null) ?? null,
      archivedAt: (row.archived_at as string | null) ?? null,
      archivedBy: (row.archived_by as string | null) ?? null,
      createdAt: String(row.created_at),
      createdBy: (row.created_by as string | null) ?? null,
    }));
  }

  async insertVersion(version: Omit<FsMappingVersion, "id">): Promise<FsMappingVersion> {
    const result = await table(this.client, "financial_statement_mapping_versions")
      .insert({
        mapping_set_id: version.mappingSetId,
        organization_id: version.organizationId,
        workspace_id: version.workspaceId,
        engagement_id: version.engagementId,
        version_number: version.versionNumber,
        version_status: version.versionStatus,
        change_summary: version.changeSummary,
        snapshot_json: version.snapshotJson,
        rolled_back_from_version: version.rolledBackFromVersion,
        published_at: version.publishedAt,
        published_by: version.publishedBy,
        archived_at: version.archivedAt,
        archived_by: version.archivedBy,
        created_by: version.createdBy ?? this.userId,
      } as never)
      .select("*")
      .single();
    if (result.error) throw result.error;
    const row = result.data as Record<string, unknown>;
    return {
      id: String(row.id),
      ...version,
    };
  }

  async listHistory(mappingSetId: string, limit = 100): Promise<FsMappingHistoryRecord[]> {
    const result = await table(this.client, "financial_statement_mapping_history")
      .select("*")
      .eq("mapping_set_id", mappingSetId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map((row) => ({
      id: String(row.id),
      mappingSetId: String(row.mapping_set_id),
      organizationId: String(row.organization_id),
      workspaceId: String(row.workspace_id),
      engagementId: String(row.engagement_id),
      action: String(row.action),
      actorUserId: (row.actor_user_id as string | null) ?? null,
      entityType: (row.entity_type as string | null) ?? null,
      entityId: (row.entity_id as string | null) ?? null,
      summary: String(row.summary),
      detailsJson: (row.details_json as Record<string, unknown>) ?? {},
      createdAt: String(row.created_at),
    }));
  }

  async insertHistory(record: Omit<FsMappingHistoryRecord, "id" | "createdAt">): Promise<void> {
    const result = await table(this.client, "financial_statement_mapping_history").insert({
      mapping_set_id: record.mappingSetId,
      organization_id: record.organizationId,
      workspace_id: record.workspaceId,
      engagement_id: record.engagementId,
      action: record.action,
      actor_user_id: record.actorUserId ?? this.userId,
      entity_type: record.entityType,
      entity_id: record.entityId,
      summary: record.summary,
      details_json: record.detailsJson,
    } as never);
    if (result.error) throw result.error;
  }
}
