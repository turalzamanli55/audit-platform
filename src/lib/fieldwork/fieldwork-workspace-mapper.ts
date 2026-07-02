import type {
  AuditProgram,
  AuditProcedure,
  FieldworkEvidence,
  FieldworkFinding,
  FieldworkNote,
  FieldworkPackage,
  FieldworkTickmarkLibraryEntry,
  ProcedureGroup,
  WorkingPaper,
} from "@/repositories/fieldwork/fieldwork-repository";
import type { Engagement } from "@/repositories/engagement/engagement-repository";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type {
  FieldworkEvidenceView,
  FieldworkFindingView,
  FieldworkNoteView,
  FieldworkProcedureGroupView,
  FieldworkProcedureView,
  FieldworkProgramView,
  FieldworkTickmark,
  FieldworkTickmarkLibraryView,
  FieldworkWorkingPaperView,
} from "@/types/fieldwork";
import { computeFieldworkProgress } from "@/lib/fieldwork/fieldwork-rules";

function parseTickmarks(value: unknown): FieldworkTickmark[] {
  if (!Array.isArray(value)) return [];
  return value as FieldworkTickmark[];
}

export function toFieldworkWorkspaceView(
  pkg: FieldworkPackage,
  engagement: Engagement,
  companyName: string,
  programs: AuditProgram[],
  groups: ProcedureGroup[],
  procedures: AuditProcedure[],
  workingPapers: WorkingPaper[],
  evidence: FieldworkEvidence[],
  findings: FieldworkFinding[],
  notes: FieldworkNote[],
  tickmarkLibrary: FieldworkTickmarkLibraryEntry[] = [],
): FieldworkWorkspaceView {
  const groupMap = new Map(groups.map((group) => [group.id, group]));
  const procedureViews: FieldworkProcedureView[] = procedures.map((procedure) => ({
    id: procedure.id,
    groupId: procedure.procedure_group_id,
    groupName: groupMap.get(procedure.procedure_group_id)?.name ?? "—",
    title: procedure.title,
    description: procedure.description,
    procedureType: procedure.procedure_type,
    assertion: procedure.assertion,
    procedureStatus: procedure.procedure_status,
    assignedAuditorId: procedure.assigned_auditor_id,
    dueDate: procedure.due_date,
    completionPct: procedure.completion_pct,
    sortOrder: procedure.sort_order,
    version: procedure.version,
    returnNotes: procedure.return_notes ?? null,
    clearanceNotes: procedure.clearance_notes ?? null,
    submittedAt: procedure.submitted_at ?? null,
  }));

  const groupsView: FieldworkProcedureGroupView[] = groups.map((group) => {
    const groupProcedures = procedureViews.filter((p) => p.groupId === group.id);
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      sortOrder: group.sort_order,
      progressPct: group.progress_pct,
      procedures: groupProcedures,
    };
  });

  const program: FieldworkProgramView | null = programs[0]
    ? {
        id: programs[0].id,
        title: programs[0].title,
        description: programs[0].description,
        programStatus: programs[0].program_status,
        programVersion: programs[0].program_version,
        groups: groupsView,
      }
    : null;

  const procedureTitleMap = new Map(procedures.map((p) => [p.id, p.title]));

  const workingPaperViews: FieldworkWorkingPaperView[] = workingPapers.map((paper) => ({
    id: paper.id,
    procedureId: paper.audit_procedure_id,
    procedureTitle: procedureTitleMap.get(paper.audit_procedure_id) ?? "—",
    title: paper.title,
    referenceCode: paper.reference_code,
    paperStatus: paper.paper_status,
    contentNotes: paper.content_notes,
    assignedAuditorId: paper.assigned_auditor_id,
    tickmarks: parseTickmarks(paper.tickmarks),
    version: paper.version,
    returnNotes: paper.return_notes ?? null,
    clearanceNotes: paper.clearance_notes ?? null,
  }));

  const evidenceViews: FieldworkEvidenceView[] = evidence.map((item) => ({
    id: item.id,
    name: item.name,
    documentType: item.document_type,
    evidenceStatus: item.evidence_status,
    procedureId: item.audit_procedure_id,
    workingPaperId: item.working_paper_id,
    mimeType: item.mime_type,
    fileSize: item.file_size,
    storagePath: item.storage_path ?? null,
    storageBucket: item.storage_bucket ?? null,
    fileName: item.storage_path ? item.storage_path.split("/").pop() ?? null : null,
    createdAt: item.created_at,
  }));

  const findingViews: FieldworkFindingView[] = findings.map((finding) => ({
    id: finding.id,
    title: finding.title,
    description: finding.description,
    severity: finding.severity,
    findingStatus: finding.finding_status,
    procedureId: finding.audit_procedure_id,
    createdAt: finding.created_at,
  }));

  const noteViews: FieldworkNoteView[] = notes.map((note) => ({
    id: note.id,
    noteType: note.note_type,
    body: note.body,
    authorId: note.author_id,
    procedureId: note.audit_procedure_id,
    workingPaperId: note.working_paper_id,
    createdAt: note.created_at,
  }));

  const progressPct = computeFieldworkProgress(procedures);

  const tickmarkLibraryViews: FieldworkTickmarkLibraryView[] = tickmarkLibrary.map((entry) => ({
    id: entry.id,
    symbol: entry.symbol,
    meaning: entry.meaning,
    sortOrder: entry.sort_order,
  }));

  return {
    id: pkg.id,
    engagementId: pkg.engagement_id,
    engagementSlug: engagement.slug,
    engagementName: engagement.name,
    companyName,
    auditPlanId: pkg.audit_plan_id,
    packageStatus: pkg.package_status,
    programVersion: pkg.program_version,
    progressPct,
    program,
    procedures: procedureViews,
    procedureGroups: groupsView,
    workingPapers: workingPaperViews,
    evidence: evidenceViews,
    findings: findingViews,
    notes: noteViews,
    auditorNotes: noteViews.filter((n) => n.noteType === "auditor"),
    reviewNotes: noteViews.filter((n) => n.noteType === "review"),
    clearanceNotes: noteViews.filter((n) => n.noteType === "clearance"),
    internalComments: noteViews.filter((n) => n.noteType === "internal"),
    tickmarkLibrary: tickmarkLibraryViews,
    pendingReviewCount: procedureViews.filter((p) =>
      ["submitted_for_review", "review_in_progress"].includes(p.procedureStatus),
    ).length,
    status: pkg.status,
    version: pkg.version,
    isArchived: Boolean(pkg.deleted_at) || pkg.status === "archived",
    deletedAt: pkg.deleted_at,
    createdAt: pkg.created_at,
    updatedAt: pkg.updated_at,
  };
}
