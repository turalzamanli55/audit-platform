import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "@/repositories/base/base-repository";
import { NotFoundError } from "@/lib/errors";
import type {
  IfrsNoteComment,
  IfrsNoteCrossReference,
  IfrsNoteCrossReferenceDraft,
  IfrsNoteHistoryRecord,
  IfrsNoteItem,
  IfrsNoteItemDraft,
  IfrsNotePackage,
  IfrsNoteSection,
  IfrsNoteSectionDraft,
  IfrsNoteStandard,
  IfrsNoteVersion,
} from "@/types/ifrs-notes";

function mapPackage(row: Record<string, unknown>): IfrsNotePackage {
  return {
    id: String(row.id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    companyId: String(row.company_id),
    engagementId: String(row.engagement_id),
    mappingSetId: (row.mapping_set_id as string | null) ?? null,
    name: String(row.name),
    description: (row.description as string | null) ?? null,
    standard: row.standard as IfrsNoteStandard,
    packageStatus: row.package_status as IfrsNotePackage["packageStatus"],
    packageVersion: Number(row.package_version),
    versionCount: Number(row.version_count),
    requiredNoteCount: Number(row.required_note_count),
    completedNoteCount: Number(row.completed_note_count),
    missingNoteCount: Number(row.missing_note_count),
    validationErrorCount: Number(row.validation_error_count),
    validationWarningCount: Number(row.validation_warning_count),
    coveragePct: Number(row.coverage_pct),
    summaryJson: (row.summary_json as Record<string, unknown>) ?? {},
    validationJson: (row.validation_json as Record<string, unknown>) ?? {},
    structureJson: (row.structure_json as Record<string, unknown>) ?? {},
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

function mapSection(row: Record<string, unknown>): IfrsNoteSection {
  return {
    id: String(row.id),
    packageId: String(row.package_id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    engagementId: String(row.engagement_id),
    noteType: row.note_type as IfrsNoteSection["noteType"],
    noteCode: String(row.note_code),
    title: String(row.title),
    standardRef: (row.standard_ref as string | null) ?? null,
    disclosureKind: row.disclosure_kind as IfrsNoteSection["disclosureKind"],
    sortOrder: Number(row.sort_order),
    isRequired: Boolean(row.is_required),
    isCompleted: Boolean(row.is_completed),
    isApplicable: Boolean(row.is_applicable),
    parentSectionId: (row.parent_section_id as string | null) ?? null,
    metadataJson: (row.metadata_json as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    version: Number(row.version),
  };
}

function mapItem(row: Record<string, unknown>): IfrsNoteItem {
  return {
    id: String(row.id),
    packageId: String(row.package_id),
    sectionId: String(row.section_id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    engagementId: String(row.engagement_id),
    itemKind: row.item_kind as IfrsNoteItem["itemKind"],
    itemCode: String(row.item_code),
    title: (row.title as string | null) ?? null,
    bodyText: String(row.body_text ?? ""),
    tableJson: (row.table_json as unknown[]) ?? [],
    listJson: (row.list_json as unknown[]) ?? [],
    sortOrder: Number(row.sort_order),
    isEditable: Boolean(row.is_editable),
    metadataJson: (row.metadata_json as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    version: Number(row.version),
  };
}

function mapCrossReference(row: Record<string, unknown>): IfrsNoteCrossReference {
  return {
    id: String(row.id),
    packageId: String(row.package_id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    engagementId: String(row.engagement_id),
    fromSectionId: (row.from_section_id as string | null) ?? null,
    fromItemId: (row.from_item_id as string | null) ?? null,
    toSectionId: (row.to_section_id as string | null) ?? null,
    statementLineCode: (row.statement_line_code as string | null) ?? null,
    disclosureCode: (row.disclosure_code as string | null) ?? null,
    sourceAccountCode: (row.source_account_code as string | null) ?? null,
    referenceLabel: String(row.reference_label),
    metadataJson: (row.metadata_json as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    version: Number(row.version),
  };
}

function mapVersion(row: Record<string, unknown>): IfrsNoteVersion {
  return {
    id: String(row.id),
    packageId: String(row.package_id),
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    engagementId: String(row.engagement_id),
    versionNumber: Number(row.version_number),
    versionStatus: row.version_status as IfrsNoteVersion["versionStatus"],
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
  };
}

function mapComment(row: Record<string, unknown>): IfrsNoteComment {
  return {
    id: String(row.id),
    packageId: String(row.package_id),
    sectionId: (row.section_id as string | null) ?? null,
    itemId: (row.item_id as string | null) ?? null,
    organizationId: String(row.organization_id),
    workspaceId: String(row.workspace_id),
    engagementId: String(row.engagement_id),
    body: String(row.body),
    authorUserId: (row.author_user_id as string | null) ?? null,
    resolvedAt: (row.resolved_at as string | null) ?? null,
    resolvedBy: (row.resolved_by as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    version: Number(row.version),
  };
}

function mapHistory(row: Record<string, unknown>): IfrsNoteHistoryRecord {
  return {
    id: String(row.id),
    packageId: String(row.package_id),
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
  };
}

export class IfrsNotesRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findPackageByEngagementId(engagementId: string): Promise<IfrsNotePackage | null> {
    const result = await this.client.from("ifrs_note_packages")
      .select("*")
      .eq("engagement_id", engagementId)
      .is("deleted_at", null)
      .maybeSingle();
    if (result.error) throw result.error;
    return result.data ? mapPackage(result.data as Record<string, unknown>) : null;
  }

  async requirePackage(id: string): Promise<IfrsNotePackage> {
    const result = await this.client.from("ifrs_note_packages")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) throw new NotFoundError("IFRS note package not found");
    return mapPackage(result.data as Record<string, unknown>);
  }

  async createPackage(input: {
    organizationId: string;
    workspaceId: string;
    companyId: string;
    engagementId: string;
    mappingSetId?: string | null;
    name: string;
    description?: string | null;
    standard: IfrsNoteStandard;
  }): Promise<IfrsNotePackage> {
    const result = await this.client.from("ifrs_note_packages")
      .insert({
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        company_id: input.companyId,
        engagement_id: input.engagementId,
        mapping_set_id: input.mappingSetId ?? null,
        name: input.name,
        description: input.description ?? null,
        standard: input.standard,
        created_by: this.userId,
        updated_by: this.userId,
      } as never)
      .select("*")
      .single();
    if (result.error) throw result.error;
    return mapPackage(result.data as Record<string, unknown>);
  }

  async updatePackage(id: string, patch: Record<string, unknown>): Promise<IfrsNotePackage> {
    const result = await this.client.from("ifrs_note_packages")
      .update({ ...patch, updated_by: this.userId } as never)
      .eq("id", id)
      .is("deleted_at", null)
      .select("*")
      .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) throw new NotFoundError("IFRS note package not found");
    return mapPackage(result.data as Record<string, unknown>);
  }

  async listSections(packageId: string): Promise<IfrsNoteSection[]> {
    const result = await this.client.from("ifrs_note_sections")
      .select("*")
      .eq("package_id", packageId)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapSection);
  }

  async listItems(packageId: string): Promise<IfrsNoteItem[]> {
    const result = await this.client.from("ifrs_note_items")
      .select("*")
      .eq("package_id", packageId)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapItem);
  }

  async listCrossReferences(packageId: string): Promise<IfrsNoteCrossReference[]> {
    const result = await this.client.from("ifrs_note_cross_references")
      .select("*")
      .eq("package_id", packageId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapCrossReference);
  }

  async softDeletePackageContents(packageId: string): Promise<void> {
    const now = new Date().toISOString();
    for (const name of [
      "ifrs_note_cross_references",
      "ifrs_note_items",
      "ifrs_note_sections",
    ] as const) {
      const result = await this.client.from(name)
        .update({ deleted_at: now, deleted_by: this.userId } as never)
        .eq("package_id", packageId)
        .is("deleted_at", null);
      if (result.error) throw result.error;
    }
  }

  async replacePackageContents(input: {
    packageId: string;
    sections: IfrsNoteSectionDraft[];
    items: Array<IfrsNoteItemDraft & { noteCode: string }>;
    crossReferences: IfrsNoteCrossReferenceDraft[];
  }): Promise<{
    sections: IfrsNoteSection[];
    items: IfrsNoteItem[];
    crossReferences: IfrsNoteCrossReference[];
  }> {
    await this.softDeletePackageContents(input.packageId);

    const sectionRows = input.sections.map((section) => ({
      package_id: section.packageId,
      organization_id: section.organizationId,
      workspace_id: section.workspaceId,
      engagement_id: section.engagementId,
      note_type: section.noteType,
      note_code: section.noteCode,
      title: section.title,
      standard_ref: section.standardRef,
      disclosure_kind: section.disclosureKind,
      sort_order: section.sortOrder,
      is_required: section.isRequired,
      is_completed: section.isCompleted,
      is_applicable: section.isApplicable,
      parent_section_id: section.parentSectionId,
      metadata_json: section.metadataJson,
      created_by: this.userId,
      updated_by: this.userId,
    }));

    const sectionInsert = await this.client.from("ifrs_note_sections")
      .insert(sectionRows as never)
      .select("*");
    if (sectionInsert.error) throw sectionInsert.error;
    const sections = ((sectionInsert.data as Record<string, unknown>[]) ?? []).map(mapSection);
    const sectionIdByCode = new Map(sections.map((section) => [section.noteCode, section.id]));

    const itemRows = input.items.map((item) => ({
      package_id: item.packageId,
      section_id: sectionIdByCode.get(item.noteCode),
      organization_id: item.organizationId,
      workspace_id: item.workspaceId,
      engagement_id: item.engagementId,
      item_kind: item.itemKind,
      item_code: item.itemCode,
      title: item.title,
      body_text: item.bodyText,
      table_json: item.tableJson,
      list_json: item.listJson,
      sort_order: item.sortOrder,
      is_editable: item.isEditable,
      metadata_json: item.metadataJson,
      created_by: this.userId,
      updated_by: this.userId,
    }));

    const itemInsert = await this.client.from("ifrs_note_items")
      .insert(itemRows as never)
      .select("*");
    if (itemInsert.error) throw itemInsert.error;
    const items = ((itemInsert.data as Record<string, unknown>[]) ?? []).map(mapItem);

    const xrefRows = input.crossReferences.map((reference) => {
      const fromMatch = reference.referenceLabel.match(/^([A-Z0-9]+)/);
      const toMatch = reference.referenceLabel.match(/->\s*([A-Z0-9]+)/);
      const fromSectionId = fromMatch ? (sectionIdByCode.get(fromMatch[1]!) ?? null) : null;
      const toSectionId = toMatch ? (sectionIdByCode.get(toMatch[1]!) ?? null) : null;
      return {
        package_id: reference.packageId,
        organization_id: reference.organizationId,
        workspace_id: reference.workspaceId,
        engagement_id: reference.engagementId,
        from_section_id: fromSectionId,
        from_item_id: null,
        to_section_id: toSectionId,
        statement_line_code: reference.statementLineCode,
        disclosure_code: reference.disclosureCode,
        source_account_code: reference.sourceAccountCode,
        reference_label: reference.referenceLabel,
        metadata_json: reference.metadataJson,
        created_by: this.userId,
        updated_by: this.userId,
      };
    });

    let crossReferences: IfrsNoteCrossReference[] = [];
    if (xrefRows.length > 0) {
      const xrefInsert = await this.client.from("ifrs_note_cross_references")
        .insert(xrefRows as never)
        .select("*");
      if (xrefInsert.error) throw xrefInsert.error;
      crossReferences = ((xrefInsert.data as Record<string, unknown>[]) ?? []).map(
        mapCrossReference,
      );
    }

    return { sections, items, crossReferences };
  }

  async listVersions(packageId: string): Promise<IfrsNoteVersion[]> {
    const result = await this.client.from("ifrs_note_versions")
      .select("*")
      .eq("package_id", packageId)
      .order("version_number", { ascending: false });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapVersion);
  }

  async insertVersion(version: Omit<IfrsNoteVersion, "id">): Promise<IfrsNoteVersion> {
    const result = await this.client.from("ifrs_note_versions")
      .insert({
        package_id: version.packageId,
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

  async listComments(packageId: string): Promise<IfrsNoteComment[]> {
    const result = await this.client.from("ifrs_note_comments")
      .select("*")
      .eq("package_id", packageId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapComment);
  }

  async listHistory(packageId: string): Promise<IfrsNoteHistoryRecord[]> {
    const result = await this.client.from("ifrs_note_history")
      .select("*")
      .eq("package_id", packageId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (result.error) throw result.error;
    return ((result.data as Record<string, unknown>[]) ?? []).map(mapHistory);
  }

  async insertHistory(record: Omit<IfrsNoteHistoryRecord, "id">): Promise<IfrsNoteHistoryRecord> {
    const result = await this.client.from("ifrs_note_history")
      .insert({
        package_id: record.packageId,
        organization_id: record.organizationId,
        workspace_id: record.workspaceId,
        engagement_id: record.engagementId,
        action: record.action,
        actor_user_id: record.actorUserId,
        entity_type: record.entityType,
        entity_id: record.entityId,
        summary: record.summary,
        details_json: record.detailsJson,
      } as never)
      .select("*")
      .single();
    if (result.error) throw result.error;
    return mapHistory(result.data as Record<string, unknown>);
  }
}
