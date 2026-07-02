import type {
  PlanningChecklistItem,
  PlanningDocument,
  PlanningStatus,
  PlanningTeamPlanning,
  PlanningTimelineMilestone,
  IntegrationReadinessStatus,
} from "@/types/planning";

export type PlanningWorkspaceView = {
  id: string;
  engagementId: string;
  engagementSlug: string;
  engagementName: string;
  companyName: string;
  planningStatus: PlanningStatus;
  planVersion: number;
  auditStrategy: string | null;
  engagementObjectives: string | null;
  scopeOfAudit: string | null;
  financialReportingFramework: string | null;
  planningNotes: string | null;
  materialityStatus: IntegrationReadinessStatus;
  riskStatus: IntegrationReadinessStatus;
  timeline: PlanningTimelineMilestone[];
  teamPlanning: PlanningTeamPlanning;
  checklist: PlanningChecklistItem[];
  documents: PlanningDocument[];
  checklistProgress: number;
  status: string;
  version: number;
  isArchived: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PlanningWorkspaceLoadResult =
  | { ok: true; plan: PlanningWorkspaceView | null; engagementSlug: string }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export type PlanningWorkspaceSection =
  | "overview"
  | "strategy"
  | "objectives"
  | "scope"
  | "framework"
  | "materiality"
  | "risk"
  | "team"
  | "timeline"
  | "notes"
  | "checklist"
  | "documents"
  | "history"
  | "settings";
