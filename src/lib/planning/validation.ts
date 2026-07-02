import {
  INTEGRATION_READINESS_STATUSES,
  PLANNING_STATUSES,
} from "@/constants/planning";
import type {
  IntegrationReadinessStatus,
  PlanningChecklistItem,
  PlanningDocument,
  PlanningStatus,
  PlanningTeamPlanning,
  PlanningTimelineMilestone,
} from "@/types/planning";
import { ValidationError } from "@/lib/errors";

export type CreatePlanningInput = {
  engagementId: string;
  financialReportingFramework?: string | null;
};

export type UpdatePlanningInput = {
  planningStatus?: PlanningStatus;
  auditStrategy?: string | null;
  engagementObjectives?: string | null;
  scopeOfAudit?: string | null;
  financialReportingFramework?: string | null;
  planningNotes?: string | null;
  materialityStatus?: IntegrationReadinessStatus;
  riskStatus?: IntegrationReadinessStatus;
  timeline?: PlanningTimelineMilestone[];
  teamPlanning?: PlanningTeamPlanning;
  checklist?: PlanningChecklistItem[];
  documents?: PlanningDocument[];
};

function assertEnumValue<T extends string>(value: string, allowed: readonly T[], field: string): T {
  if (!allowed.includes(value as T)) {
    throw new ValidationError(`Invalid ${field}`);
  }
  return value as T;
}

function normalizeOptionalText(value?: string | null): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function validateCreatePlanningInput(input: CreatePlanningInput) {
  if (!input.engagementId?.trim()) {
    throw new ValidationError("Engagement is required");
  }

  return {
    engagementId: input.engagementId.trim(),
    financialReportingFramework: normalizeOptionalText(input.financialReportingFramework),
  };
}

export function validateUpdatePlanningInput(input: UpdatePlanningInput) {
  const planningStatus = input.planningStatus
    ? assertEnumValue(input.planningStatus, PLANNING_STATUSES, "planning status")
    : undefined;

  const materialityStatus = input.materialityStatus
    ? assertEnumValue(input.materialityStatus, INTEGRATION_READINESS_STATUSES, "materiality status")
    : undefined;

  const riskStatus = input.riskStatus
    ? assertEnumValue(input.riskStatus, INTEGRATION_READINESS_STATUSES, "risk status")
    : undefined;

  return {
    planningStatus,
    auditStrategy: input.auditStrategy !== undefined ? normalizeOptionalText(input.auditStrategy) : undefined,
    engagementObjectives:
      input.engagementObjectives !== undefined
        ? normalizeOptionalText(input.engagementObjectives)
        : undefined,
    scopeOfAudit:
      input.scopeOfAudit !== undefined ? normalizeOptionalText(input.scopeOfAudit) : undefined,
    financialReportingFramework:
      input.financialReportingFramework !== undefined
        ? normalizeOptionalText(input.financialReportingFramework)
        : undefined,
    planningNotes:
      input.planningNotes !== undefined ? normalizeOptionalText(input.planningNotes) : undefined,
    materialityStatus,
    riskStatus,
    timeline: input.timeline,
    teamPlanning: input.teamPlanning,
    checklist: input.checklist,
    documents: input.documents,
  };
}

export function computeChecklistProgress(checklist: PlanningChecklistItem[]): number {
  if (checklist.length === 0) return 0;
  const completed = checklist.filter((item) => item.completed).length;
  return Math.round((completed / checklist.length) * 100);
}
