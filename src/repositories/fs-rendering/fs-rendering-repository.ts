import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "@/repositories/base/base-repository";
import { NotFoundError } from "@/lib/errors";
import type {
  FsRenderFormattingOptions,
  FsRenderHistoryEntry,
  FsRenderLayout,
  FsRenderPresentation,
  FsRenderVersion,
} from "@/types/fs-rendering";
import { DEFAULT_FS_RENDER_FORMATTING } from "@/constants/fs-rendering";

function mapLayout(row: Record<string, unknown>): FsRenderLayout {
  return {
    id: String(row.id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    companyId: (row.company_id as string | null) ?? null,
    engagementId: (row.engagement_id as string | null) ?? null,
    layoutCode: String(row.layout_code),
    layoutName: String(row.layout_name),
    layoutMode: row.layout_mode as FsRenderLayout["layoutMode"],
    standard: row.standard as FsRenderLayout["standard"],
    isSystem: Boolean(row.is_system),
    formattingJson: {
      ...DEFAULT_FS_RENDER_FORMATTING,
      ...((row.formatting_json as FsRenderFormattingOptions | null) ?? {}),
    },
    metadataJson: (row.metadata_json as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    createdBy: (row.created_by as string | null) ?? null,
    updatedBy: (row.updated_by as string | null) ?? null,
    deletedAt: (row.deleted_at as string | null) ?? null,
    version: Number(row.version),
  };
}

function mapPresentation(row: Record<string, unknown>): FsRenderPresentation {
  return {
    id: String(row.id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    companyId: String(row.company_id),
    engagementId: String(row.engagement_id),
    mappingSetId: (row.mapping_set_id as string | null) ?? null,
    layoutId: (row.layout_id as string | null) ?? null,
    name: String(row.name),
    description: (row.description as string | null) ?? null,
    standard: row.standard as FsRenderPresentation["standard"],
    presentationStatus: row.presentation_status as FsRenderPresentation["presentationStatus"],
    layoutMode: row.layout_mode as FsRenderPresentation["layoutMode"],
    comparativeMode: row.comparative_mode as FsRenderPresentation["comparativeMode"],
    currencyCode: String(row.currency_code ?? "AZN"),
    presentationVersion: Number(row.presentation_version),
    versionCount: Number(row.version_count),
    renderedStatementCount: Number(row.rendered_statement_count),
    validationErrorCount: Number(row.validation_error_count),
    validationWarningCount: Number(row.validation_warning_count),
    presentationCoveragePct: Number(row.presentation_coverage_pct),
    formattingJson: {
      ...DEFAULT_FS_RENDER_FORMATTING,
      ...((row.formatting_json as FsRenderFormattingOptions | null) ?? {}),
    },
    validationJson: (row.validation_json as Record<string, unknown>) ?? {},
    renderJson: (row.render_json as Record<string, unknown>) ?? {},
    historyJson: (row.history_json as FsRenderHistoryEntry[]) ?? [],
    summaryJson: (row.summary_json as Record<string, unknown>) ?? {},
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

function mapVersion(row: Record<string, unknown>): FsRenderVersion {
  return {
    id: String(row.id),
    presentationId: String(row.presentation_id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    engagementId: String(row.engagement_id),
    versionNumber: Number(row.version_number),
    versionStatus: row.version_status as FsRenderVersion["versionStatus"],
    changeSummary: (row.change_summary as string | null) ?? null,
    snapshotJson: (row.snapshot_json as Record<string, unknown>) ?? {},
    rolledBackFromVersion: row.rolled_back_from_version == null ? null : Number(row.rolled_back_from_version),
    publishedAt: (row.published_at as string | null) ?? null,
    publishedBy: (row.published_by as string | null) ?? null,
    archivedAt: (row.archived_at as string | null) ?? null,
    archivedBy: (row.archived_by as string | null) ?? null,
    createdAt: String(row.created_at),
    createdBy: (row.created_by as string | null) ?? null,
  };
}

export class FsRenderingRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listLayouts(workspaceId: string): Promise<FsRenderLayout[]> {
    const result = await this.client.from("financial_statement_layouts")
      .select("*")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null)
      .order("layout_code", { ascending: true });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapLayout);
  }

  async createLayout(input: {
    organizationId: string;
    workspaceId: string;
    companyId?: string | null;
    engagementId?: string | null;
    layoutCode: string;
    layoutName: string;
    layoutMode: FsRenderLayout["layoutMode"];
    standard: FsRenderLayout["standard"];
    isSystem?: boolean;
    formattingJson?: FsRenderFormattingOptions;
  }): Promise<FsRenderLayout> {
    const result = await this.client.from("financial_statement_layouts")
      .insert({
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        company_id: input.companyId ?? null,
        engagement_id: input.engagementId ?? null,
        layout_code: input.layoutCode,
        layout_name: input.layoutName,
        layout_mode: input.layoutMode,
        standard: input.standard,
        is_system: input.isSystem ?? false,
        formatting_json: input.formattingJson ?? DEFAULT_FS_RENDER_FORMATTING,
        created_by: this.userId,
        updated_by: this.userId,
      } as never)
      .select("*")
      .single();
    if (result.error) throw result.error;
    return mapLayout(result.data as Record<string, unknown>);
  }

  async findPresentationByEngagementId(engagementId: string): Promise<FsRenderPresentation | null> {
    const result = await this.client.from("financial_statement_presentations")
      .select("*")
      .eq("engagement_id", engagementId)
      .is("deleted_at", null)
      .maybeSingle();
    if (result.error) throw result.error;
    return result.data ? mapPresentation(result.data as Record<string, unknown>) : null;
  }

  async requirePresentation(id: string): Promise<FsRenderPresentation> {
    const result = await this.client.from("financial_statement_presentations")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) throw new NotFoundError("FS presentation not found");
    return mapPresentation(result.data as Record<string, unknown>);
  }

  async createPresentation(input: {
    organizationId: string;
    workspaceId: string;
    companyId: string;
    engagementId: string;
    mappingSetId?: string | null;
    layoutId?: string | null;
    name: string;
    description?: string | null;
    standard: FsRenderPresentation["standard"];
    layoutMode?: FsRenderPresentation["layoutMode"];
    comparativeMode?: FsRenderPresentation["comparativeMode"];
    currencyCode?: string;
  }): Promise<FsRenderPresentation> {
    const result = await this.client.from("financial_statement_presentations")
      .insert({
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        company_id: input.companyId,
        engagement_id: input.engagementId,
        mapping_set_id: input.mappingSetId ?? null,
        layout_id: input.layoutId ?? null,
        name: input.name,
        description: input.description ?? null,
        standard: input.standard,
        layout_mode: input.layoutMode ?? "expanded",
        comparative_mode: input.comparativeMode ?? "current_period",
        currency_code: input.currencyCode ?? "AZN",
        formatting_json: DEFAULT_FS_RENDER_FORMATTING,
        created_by: this.userId,
        updated_by: this.userId,
      } as never)
      .select("*")
      .single();
    if (result.error) throw result.error;
    return mapPresentation(result.data as Record<string, unknown>);
  }

  async updatePresentation(id: string, patch: Record<string, unknown>): Promise<FsRenderPresentation> {
    const result = await this.client.from("financial_statement_presentations")
      .update({ ...patch, updated_by: this.userId } as never)
      .eq("id", id)
      .is("deleted_at", null)
      .select("*")
      .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) throw new NotFoundError("FS presentation not found");
    return mapPresentation(result.data as Record<string, unknown>);
  }

  async listVersions(presentationId: string): Promise<FsRenderVersion[]> {
    const result = await this.client.from("financial_statement_render_versions")
      .select("*")
      .eq("presentation_id", presentationId)
      .order("version_number", { ascending: false });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapVersion);
  }

  async insertVersion(version: Omit<FsRenderVersion, "id">): Promise<FsRenderVersion> {
    const result = await this.client.from("financial_statement_render_versions")
      .insert({
        presentation_id: version.presentationId,
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
        created_by: version.createdBy,
      } as never)
      .select("*")
      .single();
    if (result.error) throw result.error;
    return mapVersion(result.data as Record<string, unknown>);
  }
}
