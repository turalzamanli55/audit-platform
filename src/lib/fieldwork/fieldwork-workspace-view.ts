import type {
  FieldworkEvidenceView,
  FieldworkFindingView,
  FieldworkNoteView,
  FieldworkPackageStatus,
  FieldworkProcedureGroupView,
  FieldworkProcedureView,
  FieldworkProgramView,
  FieldworkWorkingPaperView,
} from "@/types/fieldwork";

export type FieldworkWorkspaceView = {
  id: string;
  engagementId: string;
  engagementSlug: string;
  engagementName: string;
  companyName: string;
  auditPlanId: string;
  packageStatus: FieldworkPackageStatus;
  programVersion: number;
  progressPct: number;
  program: FieldworkProgramView | null;
  procedures: FieldworkProcedureView[];
  procedureGroups: FieldworkProcedureGroupView[];
  workingPapers: FieldworkWorkingPaperView[];
  evidence: FieldworkEvidenceView[];
  findings: FieldworkFindingView[];
  notes: FieldworkNoteView[];
  auditorNotes: FieldworkNoteView[];
  reviewNotes: FieldworkNoteView[];
  clearanceNotes: FieldworkNoteView[];
  internalComments: FieldworkNoteView[];
  tickmarkLibrary: import("@/types/fieldwork").FieldworkTickmarkLibraryView[];
  pendingReviewCount: number;
  status: string;
  version: number;
  isArchived: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FieldworkWorkspaceLoadResult =
  | { ok: true; fieldwork: FieldworkWorkspaceView | null; engagementSlug: string; planningApproved: boolean }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export type FieldworkWorkspaceSection =
  | "overview"
  | "program"
  | "procedure-groups"
  | "procedures"
  | "working-papers"
  | "evidence"
  | "findings"
  | "notes"
  | "review-notes"
  | "comments"
  | "history"
  | "settings";
