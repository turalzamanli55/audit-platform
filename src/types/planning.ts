import type { Enums } from "@/types/supabase";

export type PlanningStatus = Enums<"planning_status">;
export type IntegrationReadinessStatus = Enums<"integration_readiness_status">;

export type PlanningChecklistItem = {
  id: string;
  key: string;
  completed: boolean;
};

export type PlanningTimelineMilestone = {
  id: string;
  key: string;
  startDate: string | null;
  endDate: string | null;
};

export type PlanningTeamPlanning = {
  estimatedHours?: number | null;
  notes?: string | null;
};

export type PlanningDocument = {
  id: string;
  name: string;
  documentType: string;
  status: "placeholder" | "uploaded";
  createdAt: string;
  fileSize?: number | null;
  mimeType?: string | null;
};

export type PlanningComment = {
  id: string;
  commentType: "review" | "general" | "return";
  body: string;
  authorId: string | null;
  createdAt: string;
  resolvedAt: string | null;
};

export type PlanningRevisionEntry = {
  planVersion: number;
  planningStatus: PlanningStatus;
  revisedAt: string;
  revisedBy: string | null;
  summary?: string | null;
};
