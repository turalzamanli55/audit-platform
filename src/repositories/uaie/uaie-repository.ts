import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  requireRow,
} from "../base/repository-helpers";
import { NotFoundError } from "@/lib/errors";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";
import type { UaieColumnMapping, UaieNormalizedRow, UaieValidationIssue } from "@/types/uaie";

export type UaieImportSession = Tables<"uaie_import_sessions">;
export type UaieMappingProfile = Tables<"uaie_mapping_profiles">;
export type UaieNormalizedRowRecord = Tables<"uaie_normalized_rows">;
export type UaieValidationIssueRecord = Tables<"uaie_validation_issues">;
export type UaieColumnMappingRecord = Tables<"uaie_column_mappings">;

export class UaieRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findSessionById(id: string): Promise<UaieImportSession | null> {
    const result = await applyActiveFilter(
      this.client.from("uaie_import_sessions").select("*").eq("id", id),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async listSessionsByCompany(companyId: string, limit = 40): Promise<UaieImportSession[]> {
    const result = await applyActiveFilter(
      this.client
        .from("uaie_import_sessions")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(limit),
    );
    return unwrapSupabaseList(result);
  }

  async createSession(input: TablesInsert<"uaie_import_sessions">): Promise<UaieImportSession> {
    const result = await this.client
      .from("uaie_import_sessions")
      .insert({
        ...input,
        created_by: this.userId,
        updated_by: this.userId,
      })
      .select("*")
      .single();
    return requireRow(unwrapSupabaseResult(result), "UaieImportSession");
  }

  async updateSession(
    id: string,
    patch: TablesInsert<"uaie_import_sessions"> extends infer _T
      ? Partial<UaieImportSession>
      : never,
  ): Promise<UaieImportSession> {
    const result = await applyActiveFilter(
      this.client
        .from("uaie_import_sessions")
        .update({ ...patch, updated_by: this.userId })
        .eq("id", id)
        .select("*"),
    ).maybeSingle();
    return requireRow(unwrapSupabaseMaybeSingle(result), "UaieImportSession", id);
  }

  async replaceSheetScans(
    session: UaieImportSession,
    scans: Array<{
      sheetName: string;
      sheetIndex: number;
      rowCount: number;
      columnCount: number;
      score: number;
      isSelected: boolean;
      previewJson: Json;
      headersJson: Json;
    }>,
  ): Promise<void> {
    await this.client.from("uaie_sheet_scans").delete().eq("import_session_id", session.id);
    if (scans.length === 0) return;
    const result = await this.client.from("uaie_sheet_scans").insert(
      scans.map((scan) => ({
        import_session_id: session.id,
        organization_id: session.organization_id,
        workspace_id: session.workspace_id,
        company_id: session.company_id,
        sheet_name: scan.sheetName,
        sheet_index: scan.sheetIndex,
        row_count: scan.rowCount,
        column_count: scan.columnCount,
        score: scan.score,
        is_selected: scan.isSelected,
        preview_json: scan.previewJson,
        headers_json: scan.headersJson,
      })),
    );
    if (result.error) throw result.error;
  }

  async replaceColumnMappings(
    session: UaieImportSession,
    mappings: UaieColumnMapping[],
  ): Promise<void> {
    await this.client.from("uaie_column_mappings").delete().eq("import_session_id", session.id);
    if (mappings.length === 0) return;
    const result = await this.client.from("uaie_column_mappings").insert(
      mappings.map((mapping) => ({
        import_session_id: session.id,
        organization_id: session.organization_id,
        workspace_id: session.workspace_id,
        company_id: session.company_id,
        source_column_index: mapping.sourceColumnIndex,
        source_header: mapping.sourceHeader,
        canonical_field: mapping.canonicalField,
        confidence: mapping.confidence,
        is_manual: mapping.isManual,
      })),
    );
    if (result.error) throw result.error;
  }

  async replaceValidationIssues(
    session: UaieImportSession,
    issues: UaieValidationIssue[],
  ): Promise<void> {
    await this.client.from("uaie_validation_issues").delete().eq("import_session_id", session.id);
    if (issues.length === 0) return;
    const result = await this.client.from("uaie_validation_issues").insert(
      issues.map((issue) => ({
        import_session_id: session.id,
        organization_id: session.organization_id,
        workspace_id: session.workspace_id,
        company_id: session.company_id,
        issue_code: issue.issueCode,
        severity: issue.severity,
        message: issue.message,
        row_number: issue.rowNumber ?? null,
        column_index: issue.columnIndex ?? null,
        account_code: issue.accountCode ?? null,
        metadata: (issue.metadata ?? {}) as Json,
      })),
    );
    if (result.error) throw result.error;
  }

  async replaceNormalizedRows(
    session: UaieImportSession,
    rows: UaieNormalizedRow[],
  ): Promise<void> {
    await this.client.from("uaie_normalized_rows").delete().eq("import_session_id", session.id);
    if (rows.length === 0) return;
    const chunkSize = 500;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const result = await this.client.from("uaie_normalized_rows").insert(
        chunk.map((row) => ({
          import_session_id: session.id,
          organization_id: session.organization_id,
          workspace_id: session.workspace_id,
          company_id: session.company_id,
          row_number: row.rowNumber,
          account_code: row.accountCode,
          account_name: row.accountName,
          debit: row.debit,
          credit: row.credit,
          balance: row.balance,
          currency_code: row.currencyCode,
          department: row.department,
          cost_center: row.costCenter,
          source_ref: row.sourceRef,
          is_valid: row.isValid,
        })),
      );
      if (result.error) throw result.error;
    }
  }

  async listNormalizedRows(sessionId: string, limit = 200): Promise<UaieNormalizedRowRecord[]> {
    const result = await this.client
      .from("uaie_normalized_rows")
      .select("*")
      .eq("import_session_id", sessionId)
      .order("row_number", { ascending: true })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async listValidationIssues(sessionId: string): Promise<UaieValidationIssueRecord[]> {
    const result = await this.client
      .from("uaie_validation_issues")
      .select("*")
      .eq("import_session_id", sessionId)
      .order("created_at", { ascending: true });
    return unwrapSupabaseList(result);
  }

  async listColumnMappings(sessionId: string): Promise<UaieColumnMappingRecord[]> {
    const result = await this.client
      .from("uaie_column_mappings")
      .select("*")
      .eq("import_session_id", sessionId)
      .order("source_column_index", { ascending: true });
    return unwrapSupabaseList(result);
  }

  async findMappingProfileByFingerprint(input: {
    workspaceId: string;
    companyId: string;
    layoutFingerprint?: string | null;
    headerHash?: string | null;
  }): Promise<UaieMappingProfile | null> {
    if (input.layoutFingerprint) {
      const byLayout = await applyActiveFilter(
        this.client
          .from("uaie_mapping_profiles")
          .select("*")
          .eq("workspace_id", input.workspaceId)
          .eq("layout_fingerprint", input.layoutFingerprint)
          .order("success_count", { ascending: false })
          .limit(1),
      ).maybeSingle();
      const row = unwrapSupabaseMaybeSingle(byLayout);
      if (row) return row;
    }
    if (input.headerHash) {
      const byHeader = await applyActiveFilter(
        this.client
          .from("uaie_mapping_profiles")
          .select("*")
          .eq("workspace_id", input.workspaceId)
          .eq("company_id", input.companyId)
          .eq("header_hash", input.headerHash)
          .order("success_count", { ascending: false })
          .limit(1),
      ).maybeSingle();
      return unwrapSupabaseMaybeSingle(byHeader);
    }
    return null;
  }

  async saveMappingProfile(input: {
    organizationId: string;
    workspaceId: string;
    companyId: string;
    profileName: string;
    detectedErp: UaieImportSession["detected_erp"];
    workbookHash: string | null;
    headerHash: string | null;
    layoutFingerprint: string | null;
    mappingJson: Json;
  }): Promise<UaieMappingProfile> {
    const result = await this.client
      .from("uaie_mapping_profiles")
      .insert({
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        company_id: input.companyId,
        profile_name: input.profileName,
        detected_erp: input.detectedErp,
        workbook_hash: input.workbookHash,
        header_hash: input.headerHash,
        layout_fingerprint: input.layoutFingerprint,
        mapping_json: input.mappingJson,
        success_count: 1,
        last_used_at: new Date().toISOString(),
        created_by: this.userId,
        updated_by: this.userId,
      })
      .select("*")
      .single();
    return requireRow(unwrapSupabaseResult(result), "UaieMappingProfile");
  }

  async incrementProfileSuccess(profileId: string): Promise<void> {
    const existing = await applyActiveFilter(
      this.client.from("uaie_mapping_profiles").select("*").eq("id", profileId),
    ).maybeSingle();
    const profile = unwrapSupabaseMaybeSingle(existing);
    if (!profile) return;
    await this.client
      .from("uaie_mapping_profiles")
      .update({
        success_count: (profile.success_count ?? 0) + 1,
        last_used_at: new Date().toISOString(),
        updated_by: this.userId,
      })
      .eq("id", profileId);
  }

  async archiveSession(id: string): Promise<UaieImportSession> {
    return this.updateSession(id, {
      import_status: "archived",
      deleted_at: new Date().toISOString(),
      deleted_by: this.userId,
      status: "archived",
    } as Partial<UaieImportSession>);
  }

  async cancelSession(id: string): Promise<UaieImportSession> {
    return this.updateSession(id, {
      import_status: "cancelled",
      completed_at: new Date().toISOString(),
    } as Partial<UaieImportSession>);
  }

  async logActivity(input: {
    sessionId: string;
    organizationId: string;
    workspaceId: string;
    companyId: string;
    action: string;
    summary?: string | null;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const result = await this.client.from("uaie_import_activity").insert({
      import_session_id: input.sessionId,
      organization_id: input.organizationId,
      workspace_id: input.workspaceId,
      company_id: input.companyId,
      action: input.action,
      summary: input.summary ?? null,
      metadata: (input.metadata ?? {}) as Json,
      created_by: this.userId,
    });
    if (result.error) throw result.error;
  }

  async requireSession(id: string): Promise<UaieImportSession> {
    const session = await this.findSessionById(id);
    if (!session) throw new NotFoundError("Import session not found", { id });
    return session;
  }
}
