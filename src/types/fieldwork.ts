import type { Enums } from "@/types/supabase";

export type FieldworkPackageStatus = Enums<"fieldwork_package_status">;
export type AuditProgramStatus = Enums<"audit_program_status">;
export type ProcedureType = Enums<"procedure_type">;
export type ProcedureStatus = Enums<"procedure_status">;
export type WorkingPaperStatus = Enums<"working_paper_status">;
export type FieldworkEvidenceStatus = Enums<"fieldwork_evidence_status">;
export type FieldworkFindingStatus = Enums<"fieldwork_finding_status">;
export type FieldworkNoteType = Enums<"fieldwork_note_type">;

export type FieldworkTickmark = {
  id: string;
  symbol: string;
  meaning: string;
  createdAt: string;
};

export type FieldworkProcedureView = {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  description: string | null;
  procedureType: ProcedureType;
  assertion: string | null;
  procedureStatus: ProcedureStatus;
  assignedAuditorId: string | null;
  dueDate: string | null;
  completionPct: number;
  sortOrder: number;
  version: number;
};

export type FieldworkProcedureGroupView = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  progressPct: number;
  procedures: FieldworkProcedureView[];
};

export type FieldworkWorkingPaperView = {
  id: string;
  procedureId: string;
  procedureTitle: string;
  title: string;
  referenceCode: string | null;
  paperStatus: WorkingPaperStatus;
  contentNotes: string | null;
  tickmarks: FieldworkTickmark[];
};

export type FieldworkEvidenceView = {
  id: string;
  name: string;
  documentType: string;
  evidenceStatus: FieldworkEvidenceStatus;
  procedureId: string | null;
  workingPaperId: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
};

export type FieldworkFindingView = {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  findingStatus: FieldworkFindingStatus;
  procedureId: string | null;
  createdAt: string;
};

export type FieldworkNoteView = {
  id: string;
  noteType: FieldworkNoteType;
  body: string;
  authorId: string | null;
  procedureId: string | null;
  workingPaperId: string | null;
  createdAt: string;
};

export type FieldworkProgramView = {
  id: string;
  title: string;
  description: string | null;
  programStatus: AuditProgramStatus;
  programVersion: number;
  groups: FieldworkProcedureGroupView[];
};
