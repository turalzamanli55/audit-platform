import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { FieldworkNoteType, ProcedureStatus } from "@/types/fieldwork";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  assertVersionMatch,
  requireRow,
} from "../base/repository-helpers";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";
import {
  DEFAULT_AUDIT_PROGRAM_TITLE,
  DEFAULT_PROCEDURE_GROUPS,
  FIELDWORK_ACTIVITY_ACTIONS,
} from "@/constants/fieldwork";

export type FieldworkPackage = Tables<"fieldwork_packages">;
export type AuditProgram = Tables<"audit_programs">;
export type ProcedureGroup = Tables<"procedure_groups">;
export type AuditProcedure = Tables<"audit_procedures">;
export type WorkingPaper = Tables<"working_papers">;
export type FieldworkEvidence = Tables<"fieldwork_evidence">;
export type FieldworkFinding = Tables<"fieldwork_findings">;
export type FieldworkNote = Tables<"fieldwork_notes">;
export type FieldworkActivity = Tables<"fieldwork_activity">;
export type FieldworkTickmarkLibraryEntry = Tables<"fieldwork_tickmark_library">;

export type CreateFieldworkPackageInput = Pick<
  TablesInsert<"fieldwork_packages">,
  "organization_id" | "workspace_id" | "engagement_id" | "audit_plan_id"
>;

export type UpdateFieldworkPackageInput = Partial<
  Pick<
    TablesUpdate<"fieldwork_packages">,
    "package_status" | "program_version" | "progress_pct" | "status"
  >
>;

export type LogFieldworkActivityInput = {
  fieldworkPackageId: string;
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  action: string;
  summary?: string | null;
  metadata?: Record<string, unknown>;
};

export type AddFieldworkNoteInput = {
  fieldworkPackageId: string;
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  body: string;
  noteType?: FieldworkNoteType;
  auditProcedureId?: string | null;
  workingPaperId?: string | null;
};

export class FieldworkRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findPackageById(id: string): Promise<FieldworkPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("fieldwork_packages").select("*").eq("id", id),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findPackageByIdAnyState(id: string): Promise<FieldworkPackage | null> {
    const result = await this.client
      .from("fieldwork_packages")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findPackageByEngagementId(engagementId: string): Promise<FieldworkPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("fieldwork_packages").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findPackageByEngagementIdAnyState(
    engagementId: string,
  ): Promise<FieldworkPackage | null> {
    const result = await this.client
      .from("fieldwork_packages")
      .select("*")
      .eq("engagement_id", engagementId)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async createPackage(input: CreateFieldworkPackageInput): Promise<FieldworkPackage> {
    const existing = await this.findPackageByEngagementId(input.engagement_id);
    if (existing) {
      throw new ValidationError("Fieldwork already exists for this engagement");
    }

    const result = await this.client
      .from("fieldwork_packages")
      .insert({
        ...input,
        package_status: "in_progress",
      })
      .select("*")
      .single();

    const pkg = requireRow(unwrapSupabaseResult(result), "FieldworkPackage");

    const program = await this.createDefaultProgram(pkg);

    for (const groupDef of DEFAULT_PROCEDURE_GROUPS) {
      const groupResult = await this.client
        .from("procedure_groups")
        .insert({
          audit_program_id: program.id,
          fieldwork_package_id: pkg.id,
          engagement_id: pkg.engagement_id,
          organization_id: pkg.organization_id,
          workspace_id: pkg.workspace_id,
          name: groupDef.name,
          description: groupDef.description,
          sort_order: groupDef.sortOrder,
        })
        .select("*")
        .single();

      const group = requireRow(unwrapSupabaseResult(groupResult), "ProcedureGroup");

      for (const [index, procedureDef] of groupDef.procedures.entries()) {
        await this.client.from("audit_procedures").insert({
          procedure_group_id: group.id,
          audit_program_id: program.id,
          fieldwork_package_id: pkg.id,
          engagement_id: pkg.engagement_id,
          organization_id: pkg.organization_id,
          workspace_id: pkg.workspace_id,
          title: procedureDef.title,
          procedure_type: procedureDef.procedureType,
          assertion: procedureDef.assertion,
          sort_order: index + 1,
        });
      }
    }

    await this.logActivity({
      fieldworkPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: FIELDWORK_ACTIVITY_ACTIONS.CREATED,
      summary: "Fieldwork package initiated from approved audit plan",
      metadata: { programId: program.id },
    });

    return pkg;
  }

  private async createDefaultProgram(pkg: FieldworkPackage): Promise<AuditProgram> {
    const result = await this.client
      .from("audit_programs")
      .insert({
        fieldwork_package_id: pkg.id,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        title: DEFAULT_AUDIT_PROGRAM_TITLE,
        program_status: "in_execution",
        program_version: 1,
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "AuditProgram");
  }

  async updatePackage(
    id: string,
    expectedVersion: number,
    input: UpdateFieldworkPackageInput,
  ): Promise<FieldworkPackage> {
    const existing = await this.findPackageById(id);
    if (!existing) throw new NotFoundError("Fieldwork package not found", { id });
    assertVersionMatch(existing.version, expectedVersion, "FieldworkPackage");

    const result = await applyActiveFilter(
      this.client
        .from("fieldwork_packages")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "FieldworkPackage", id);
  }

  async archivePackage(id: string, expectedVersion: number): Promise<FieldworkPackage> {
    const existing = await this.findPackageById(id);
    if (!existing) throw new NotFoundError("Fieldwork package not found", { id });
    assertVersionMatch(existing.version, expectedVersion, "FieldworkPackage");

    const result = await applyActiveFilter(
      this.client
        .from("fieldwork_packages")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
          package_status: "archived",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "FieldworkPackage", id);

    await this.logActivity({
      fieldworkPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: FIELDWORK_ACTIVITY_ACTIONS.ARCHIVED,
      summary: "Fieldwork package archived",
    });

    return pkg;
  }

  async restorePackage(id: string, expectedVersion: number): Promise<FieldworkPackage> {
    const existing = await this.findPackageByIdAnyState(id);
    if (!existing) throw new NotFoundError("Fieldwork package not found", { id });
    if (!existing.deleted_at && existing.status !== "archived") {
      throw new ValidationError("Fieldwork package is not archived");
    }
    assertVersionMatch(existing.version, expectedVersion, "FieldworkPackage");

    const result = await this.client
      .from("fieldwork_packages")
      .update({
        deleted_at: null,
        deleted_by: null,
        status: "active",
        package_status: "in_progress",
      })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select("*")
      .maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "FieldworkPackage", id);

    await this.logActivity({
      fieldworkPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: FIELDWORK_ACTIVITY_ACTIONS.RESTORED,
      summary: "Fieldwork package restored",
    });

    return pkg;
  }

  async listPrograms(fieldworkPackageId: string): Promise<AuditProgram[]> {
    const result = await applyActiveFilter(
      this.client
        .from("audit_programs")
        .select("*")
        .eq("fieldwork_package_id", fieldworkPackageId)
        .order("created_at", { ascending: true }),
    );
    return unwrapSupabaseList(result);
  }

  async listProcedureGroups(fieldworkPackageId: string): Promise<ProcedureGroup[]> {
    const result = await applyActiveFilter(
      this.client
        .from("procedure_groups")
        .select("*")
        .eq("fieldwork_package_id", fieldworkPackageId)
        .order("sort_order", { ascending: true }),
    );
    return unwrapSupabaseList(result);
  }

  async listProcedures(fieldworkPackageId: string): Promise<AuditProcedure[]> {
    const result = await applyActiveFilter(
      this.client
        .from("audit_procedures")
        .select("*")
        .eq("fieldwork_package_id", fieldworkPackageId)
        .order("sort_order", { ascending: true }),
    );
    return unwrapSupabaseList(result);
  }

  async listWorkingPapers(fieldworkPackageId: string): Promise<WorkingPaper[]> {
    const result = await applyActiveFilter(
      this.client
        .from("working_papers")
        .select("*")
        .eq("fieldwork_package_id", fieldworkPackageId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async listEvidence(fieldworkPackageId: string): Promise<FieldworkEvidence[]> {
    const result = await applyActiveFilter(
      this.client
        .from("fieldwork_evidence")
        .select("*")
        .eq("fieldwork_package_id", fieldworkPackageId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async listFindings(fieldworkPackageId: string): Promise<FieldworkFinding[]> {
    const result = await applyActiveFilter(
      this.client
        .from("fieldwork_findings")
        .select("*")
        .eq("fieldwork_package_id", fieldworkPackageId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async listNotes(
    fieldworkPackageId: string,
    noteType?: FieldworkNoteType,
  ): Promise<FieldworkNote[]> {
    let query = applyActiveFilter(
      this.client
        .from("fieldwork_notes")
        .select("*")
        .eq("fieldwork_package_id", fieldworkPackageId),
    );

    if (noteType) {
      query = query.eq("note_type", noteType);
    }

    const result = await query.order("created_at", { ascending: false });
    return unwrapSupabaseList(result);
  }

  async listActivity(fieldworkPackageId: string, limit = 100): Promise<FieldworkActivity[]> {
    const result = await applyActiveFilter(
      this.client
        .from("fieldwork_activity")
        .select("*")
        .eq("fieldwork_package_id", fieldworkPackageId)
        .order("created_at", { ascending: false })
        .limit(limit),
    );
    return unwrapSupabaseList(result);
  }

  async findProcedureById(procedureId: string): Promise<AuditProcedure | null> {
    const result = await applyActiveFilter(
      this.client.from("audit_procedures").select("*").eq("id", procedureId),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findWorkingPaperById(workingPaperId: string): Promise<WorkingPaper | null> {
    const result = await applyActiveFilter(
      this.client.from("working_papers").select("*").eq("id", workingPaperId),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async assignProcedure(
    procedureId: string,
    expectedVersion: number,
    assignedAuditorId: string | null,
    dueDate?: string | null,
  ): Promise<AuditProcedure> {
    const procedure = await this.updateProcedure(procedureId, expectedVersion, {
      assigned_auditor_id: assignedAuditorId,
      due_date: dueDate,
    });

    await this.logActivity({
      fieldworkPackageId: procedure.fieldwork_package_id,
      engagementId: procedure.engagement_id,
      organizationId: procedure.organization_id,
      workspaceId: procedure.workspace_id,
      action: FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_ASSIGNED,
      summary: assignedAuditorId
        ? "Audit procedure assigned to auditor"
        : "Audit procedure assignment cleared",
      metadata: { procedureId, assignedAuditorId },
    });

    return procedure;
  }

  async submitProcedureForReview(
    procedureId: string,
    expectedVersion: number,
  ): Promise<AuditProcedure> {
    const existing = await this.findProcedureById(procedureId);
    if (!existing) throw new NotFoundError("Audit procedure not found", { id: procedureId });
    assertVersionMatch(existing.version, expectedVersion, "AuditProcedure");

    const now = new Date().toISOString();
    const result = await applyActiveFilter(
      this.client
        .from("audit_procedures")
        .update({
          procedure_status: "submitted_for_review",
          completion_pct: this.computeProcedureCompletion("submitted_for_review"),
          submitted_at: now,
          submitted_by: this.userId,
          returned_at: null,
          returned_by: null,
          return_notes: null,
        })
        .eq("id", procedureId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const procedure = requireRow(unwrapSupabaseMaybeSingle(result), "AuditProcedure", procedureId);

    await this.logActivity({
      fieldworkPackageId: procedure.fieldwork_package_id,
      engagementId: procedure.engagement_id,
      organizationId: procedure.organization_id,
      workspaceId: procedure.workspace_id,
      action: FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_SUBMITTED,
      summary: `Procedure "${procedure.title}" submitted for review`,
      metadata: { procedureId },
    });

    await this.recomputeProgress(procedure.fieldwork_package_id);
    await this.recomputeGroupProgress(procedure.procedure_group_id);
    return procedure;
  }

  async returnProcedure(
    procedureId: string,
    expectedVersion: number,
    returnNotes: string | null,
  ): Promise<AuditProcedure> {
    const existing = await this.findProcedureById(procedureId);
    if (!existing) throw new NotFoundError("Audit procedure not found", { id: procedureId });
    assertVersionMatch(existing.version, expectedVersion, "AuditProcedure");

    const now = new Date().toISOString();
    const result = await applyActiveFilter(
      this.client
        .from("audit_procedures")
        .update({
          procedure_status: "returned",
          completion_pct: this.computeProcedureCompletion("returned"),
          returned_at: now,
          returned_by: this.userId,
          return_notes: returnNotes,
        })
        .eq("id", procedureId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const procedure = requireRow(unwrapSupabaseMaybeSingle(result), "AuditProcedure", procedureId);

    await this.logActivity({
      fieldworkPackageId: procedure.fieldwork_package_id,
      engagementId: procedure.engagement_id,
      organizationId: procedure.organization_id,
      workspaceId: procedure.workspace_id,
      action: FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_RETURNED,
      summary: `Procedure "${procedure.title}" returned for revision`,
      metadata: { procedureId, returnNotes },
    });

    await this.recomputeProgress(procedure.fieldwork_package_id);
    await this.recomputeGroupProgress(procedure.procedure_group_id);
    return procedure;
  }

  async clearProcedureReview(
    procedureId: string,
    expectedVersion: number,
    clearanceNotes: string | null,
  ): Promise<AuditProcedure> {
    const existing = await this.findProcedureById(procedureId);
    if (!existing) throw new NotFoundError("Audit procedure not found", { id: procedureId });
    assertVersionMatch(existing.version, expectedVersion, "AuditProcedure");

    const now = new Date().toISOString();
    const result = await applyActiveFilter(
      this.client
        .from("audit_procedures")
        .update({
          procedure_status: "review_cleared",
          completion_pct: this.computeProcedureCompletion("review_cleared"),
          cleared_at: now,
          cleared_by: this.userId,
          clearance_notes: clearanceNotes,
        })
        .eq("id", procedureId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const procedure = requireRow(unwrapSupabaseMaybeSingle(result), "AuditProcedure", procedureId);

    await this.logActivity({
      fieldworkPackageId: procedure.fieldwork_package_id,
      engagementId: procedure.engagement_id,
      organizationId: procedure.organization_id,
      workspaceId: procedure.workspace_id,
      action: FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_CLEARED,
      summary: `Procedure "${procedure.title}" review cleared`,
      metadata: { procedureId, clearanceNotes },
    });

    await this.recomputeProgress(procedure.fieldwork_package_id);
    await this.recomputeGroupProgress(procedure.procedure_group_id);
    return procedure;
  }

  async completeProcedure(procedureId: string, expectedVersion: number): Promise<AuditProcedure> {
    const procedure = await this.updateProcedure(procedureId, expectedVersion, {
      procedure_status: "complete",
      completion_pct: 100,
    });

    await this.logActivity({
      fieldworkPackageId: procedure.fieldwork_package_id,
      engagementId: procedure.engagement_id,
      organizationId: procedure.organization_id,
      workspaceId: procedure.workspace_id,
      action: FIELDWORK_ACTIVITY_ACTIONS.PROCEDURE_COMPLETED,
      summary: `Procedure "${procedure.title}" marked complete`,
      metadata: { procedureId },
    });

    await this.recomputeProgress(procedure.fieldwork_package_id);
    await this.recomputeGroupProgress(procedure.procedure_group_id);
    return procedure;
  }

  async updateWorkingPaper(
    workingPaperId: string,
    expectedVersion: number,
    patch: Partial<
      Pick<
        TablesUpdate<"working_papers">,
        | "title"
        | "reference_code"
        | "content_notes"
        | "paper_status"
        | "audit_procedure_id"
        | "assigned_auditor_id"
        | "tickmarks"
      >
    >,
  ): Promise<WorkingPaper> {
    const existing = await applyActiveFilter(
      this.client.from("working_papers").select("*").eq("id", workingPaperId),
    ).maybeSingle();
    const paper = requireRow(
      unwrapSupabaseMaybeSingle(existing),
      "WorkingPaper",
      workingPaperId,
    );
    assertVersionMatch(paper.version, expectedVersion, "WorkingPaper");

    const result = await applyActiveFilter(
      this.client
        .from("working_papers")
        .update(patch)
        .eq("id", workingPaperId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "WorkingPaper", workingPaperId);

    await this.logActivity({
      fieldworkPackageId: updated.fieldwork_package_id,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: FIELDWORK_ACTIVITY_ACTIONS.WORKING_PAPER_UPDATED,
      summary: `Working paper "${updated.title}" updated`,
      metadata: { workingPaperId },
    });

    return updated;
  }

  async listTickmarkLibrary(workspaceId: string): Promise<FieldworkTickmarkLibraryEntry[]> {
    const result = await applyActiveFilter(
      this.client
        .from("fieldwork_tickmark_library")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("sort_order", { ascending: true }),
    );
    return unwrapSupabaseList(result);
  }

  async addTickmarkLibraryEntry(input: {
    organizationId: string;
    workspaceId: string;
    symbol: string;
    meaning: string;
    sortOrder?: number;
  }): Promise<FieldworkTickmarkLibraryEntry> {
    const result = await this.client
      .from("fieldwork_tickmark_library")
      .insert({
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        symbol: input.symbol.trim(),
        meaning: input.meaning.trim(),
        sort_order: input.sortOrder ?? 0,
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "FieldworkTickmarkLibraryEntry");
  }

  async recomputeGroupProgress(procedureGroupId: string): Promise<void> {
    const groupResult = await applyActiveFilter(
      this.client.from("procedure_groups").select("*").eq("id", procedureGroupId),
    ).maybeSingle();
    const group = unwrapSupabaseMaybeSingle(groupResult);
    if (!group) return;

    const procedures = await applyActiveFilter(
      this.client
        .from("audit_procedures")
        .select("completion_pct")
        .eq("procedure_group_id", procedureGroupId),
    );
    const rows = unwrapSupabaseList(procedures);
    const progressPct =
      rows.length === 0
        ? 0
        : Math.round(rows.reduce((sum, p) => sum + p.completion_pct, 0) / rows.length);

    await applyActiveFilter(
      this.client
        .from("procedure_groups")
        .update({ progress_pct: progressPct })
        .eq("id", procedureGroupId),
    );
  }

  async addEvidenceWithStorage(input: {
    fieldworkPackageId: string;
    engagementId: string;
    organizationId: string;
    workspaceId: string;
    name: string;
    documentType?: string;
    auditProcedureId?: string | null;
    workingPaperId?: string | null;
    mimeType?: string | null;
    fileSize?: number | null;
    storagePath?: string | null;
    storageBucket?: string;
  }): Promise<FieldworkEvidence> {
    const result = await this.client
      .from("fieldwork_evidence")
      .insert({
        fieldwork_package_id: input.fieldworkPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        name: input.name.trim(),
        document_type: input.documentType?.trim() || "supporting_document",
        audit_procedure_id: input.auditProcedureId ?? null,
        working_paper_id: input.workingPaperId ?? null,
        mime_type: input.mimeType ?? null,
        file_size: input.fileSize ?? null,
        storage_path: input.storagePath ?? null,
        storage_bucket: input.storageBucket ?? "fieldwork-evidence",
        evidence_status: input.storagePath ? "verified" : "recorded",
      })
      .select("*")
      .single();

    const evidence = requireRow(unwrapSupabaseResult(result), "FieldworkEvidence");

    await this.logActivity({
      fieldworkPackageId: input.fieldworkPackageId,
      engagementId: input.engagementId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      action: FIELDWORK_ACTIVITY_ACTIONS.EVIDENCE_ADDED,
      summary: `Evidence "${evidence.name}" recorded`,
      metadata: { evidenceId: evidence.id, hasFile: Boolean(input.storagePath) },
    });

    return evidence;
  }

  async updateProcedure(
    procedureId: string,
    expectedVersion: number,
    patch: Partial<
      Pick<
        TablesUpdate<"audit_procedures">,
        | "procedure_status"
        | "assigned_auditor_id"
        | "due_date"
        | "completion_pct"
        | "description"
        | "title"
      >
    >,
  ): Promise<AuditProcedure> {
    const existing = await applyActiveFilter(
      this.client.from("audit_procedures").select("*").eq("id", procedureId),
    ).maybeSingle();
    const procedure = requireRow(
      unwrapSupabaseMaybeSingle(existing),
      "AuditProcedure",
      procedureId,
    );
    assertVersionMatch(procedure.version, expectedVersion, "AuditProcedure");

    const result = await applyActiveFilter(
      this.client
        .from("audit_procedures")
        .update(patch)
        .eq("id", procedureId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "AuditProcedure", procedureId);

    if (patch.procedure_status) {
      await this.recomputeGroupProgress(updated.procedure_group_id);
    }

    return updated;
  }

  async addWorkingPaper(input: {
    auditProcedureId: string;
    fieldworkPackageId: string;
    engagementId: string;
    organizationId: string;
    workspaceId: string;
    title: string;
    referenceCode?: string | null;
    contentNotes?: string | null;
  }): Promise<WorkingPaper> {
    const result = await this.client
      .from("working_papers")
      .insert({
        audit_procedure_id: input.auditProcedureId,
        fieldwork_package_id: input.fieldworkPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        title: input.title.trim(),
        reference_code: input.referenceCode ?? null,
        content_notes: input.contentNotes ?? null,
        paper_status: "in_progress",
      })
      .select("*")
      .single();

    const paper = requireRow(unwrapSupabaseResult(result), "WorkingPaper");

    await this.logActivity({
      fieldworkPackageId: input.fieldworkPackageId,
      engagementId: input.engagementId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      action: FIELDWORK_ACTIVITY_ACTIONS.WORKING_PAPER_ADDED,
      summary: `Working paper "${paper.title}" created`,
      metadata: { workingPaperId: paper.id, procedureId: input.auditProcedureId },
    });

    return paper;
  }

  async addEvidence(input: {
    fieldworkPackageId: string;
    engagementId: string;
    organizationId: string;
    workspaceId: string;
    name: string;
    documentType?: string;
    auditProcedureId?: string | null;
    workingPaperId?: string | null;
    mimeType?: string | null;
    fileSize?: number | null;
  }): Promise<FieldworkEvidence> {
    const result = await this.client
      .from("fieldwork_evidence")
      .insert({
        fieldwork_package_id: input.fieldworkPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        name: input.name.trim(),
        document_type: input.documentType?.trim() || "supporting_document",
        audit_procedure_id: input.auditProcedureId ?? null,
        working_paper_id: input.workingPaperId ?? null,
        mime_type: input.mimeType ?? null,
        file_size: input.fileSize ?? null,
        evidence_status: "recorded",
      })
      .select("*")
      .single();

    const evidence = requireRow(unwrapSupabaseResult(result), "FieldworkEvidence");

    await this.logActivity({
      fieldworkPackageId: input.fieldworkPackageId,
      engagementId: input.engagementId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      action: FIELDWORK_ACTIVITY_ACTIONS.EVIDENCE_ADDED,
      summary: `Evidence "${evidence.name}" recorded`,
      metadata: { evidenceId: evidence.id },
    });

    return evidence;
  }

  async addFinding(input: {
    fieldworkPackageId: string;
    engagementId: string;
    organizationId: string;
    workspaceId: string;
    title: string;
    description?: string | null;
    severity?: string;
    auditProcedureId?: string | null;
  }): Promise<FieldworkFinding> {
    const result = await this.client
      .from("fieldwork_findings")
      .insert({
        fieldwork_package_id: input.fieldworkPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        title: input.title.trim(),
        description: input.description ?? null,
        severity: input.severity ?? "informational",
        audit_procedure_id: input.auditProcedureId ?? null,
        finding_status: "open",
      })
      .select("*")
      .single();

    const finding = requireRow(unwrapSupabaseResult(result), "FieldworkFinding");

    await this.logActivity({
      fieldworkPackageId: input.fieldworkPackageId,
      engagementId: input.engagementId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      action: FIELDWORK_ACTIVITY_ACTIONS.FINDING_ADDED,
      summary: `Finding "${finding.title}" recorded`,
      metadata: { findingId: finding.id },
    });

    return finding;
  }

  async addNote(input: AddFieldworkNoteInput): Promise<FieldworkNote> {
    const result = await this.client
      .from("fieldwork_notes")
      .insert({
        fieldwork_package_id: input.fieldworkPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        body: input.body.trim(),
        note_type: input.noteType ?? "auditor",
        audit_procedure_id: input.auditProcedureId ?? null,
        working_paper_id: input.workingPaperId ?? null,
        author_id: this.userId,
      })
      .select("*")
      .single();

    const note = requireRow(unwrapSupabaseResult(result), "FieldworkNote");

    await this.logActivity({
      fieldworkPackageId: input.fieldworkPackageId,
      engagementId: input.engagementId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      action: FIELDWORK_ACTIVITY_ACTIONS.NOTE_ADDED,
      summary: "Fieldwork note added",
      metadata: { noteId: note.id, noteType: note.note_type },
    });

    return note;
  }

  async recomputeProgress(fieldworkPackageId: string): Promise<FieldworkPackage> {
    const pkg = await this.findPackageById(fieldworkPackageId);
    if (!pkg) throw new NotFoundError("Fieldwork package not found", { id: fieldworkPackageId });

    const procedures = await this.listProcedures(fieldworkPackageId);
    const progressPct =
      procedures.length === 0
        ? 0
        : Math.round(
            procedures.reduce((sum, p) => sum + p.completion_pct, 0) / procedures.length,
          );

    const result = await applyActiveFilter(
      this.client
        .from("fieldwork_packages")
        .update({ progress_pct: progressPct })
        .eq("id", fieldworkPackageId)
        .select("*"),
    ).maybeSingle();

    await Promise.all(
      (await this.listProcedureGroups(fieldworkPackageId)).map((group) =>
        this.recomputeGroupProgress(group.id),
      ),
    );

    return requireRow(unwrapSupabaseMaybeSingle(result), "FieldworkPackage", fieldworkPackageId);
  }

  async logActivity(input: LogFieldworkActivityInput): Promise<FieldworkActivity> {
    const result = await this.client
      .from("fieldwork_activity")
      .insert({
        fieldwork_package_id: input.fieldworkPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        actor_id: this.userId,
        action: input.action,
        summary: input.summary ?? null,
        metadata: (input.metadata ?? {}) as Database["public"]["Tables"]["fieldwork_activity"]["Insert"]["metadata"],
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "FieldworkActivity");
  }

  async validateWorkspaceOwnership(
    packageId: string,
    workspaceId: string,
  ): Promise<FieldworkPackage> {
    const pkg = await this.findPackageByIdAnyState(packageId);
    if (!pkg) throw new NotFoundError("Fieldwork package not found", { id: packageId });
    if (pkg.workspace_id !== workspaceId) {
      throw new AuthorizationError("Fieldwork package does not belong to the active workspace", {
        packageId,
        workspaceId,
      });
    }
    return pkg;
  }

  validateOptimisticLock(
    record: { version: number },
    expectedVersion: number,
    resource = "FieldworkPackage",
  ): void {
    assertVersionMatch(record.version, expectedVersion, resource);
  }

  computeProcedureCompletion(status: ProcedureStatus): number {
    switch (status) {
      case "complete":
      case "review_cleared":
        return 100;
      case "submitted_for_review":
      case "review_in_progress":
        return 85;
      case "returned":
        return 60;
      case "pending_evidence":
        return 45;
      case "in_progress":
        return 30;
      case "blocked":
      case "deferred":
        return 10;
      default:
        return 0;
    }
  }
}
