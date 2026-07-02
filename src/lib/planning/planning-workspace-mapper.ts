import type { AuditPlan } from "@/repositories/planning/planning-repository";
import type { Engagement } from "@/repositories/engagement/engagement-repository";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type {
  PlanningChecklistItem,
  PlanningDocument,
  PlanningTeamPlanning,
  PlanningTimelineMilestone,
} from "@/types/planning";
import { computeChecklistProgress } from "@/lib/planning/validation";

function parseJsonArray<T>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value as T[];
}

function parseTeamPlanning(value: unknown): PlanningTeamPlanning {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as PlanningTeamPlanning;
}

export function toPlanningWorkspaceView(
  plan: AuditPlan,
  engagement: Engagement,
  companyName: string,
): PlanningWorkspaceView {
  const checklist = parseJsonArray<PlanningChecklistItem>(plan.checklist);
  const timeline = parseJsonArray<PlanningTimelineMilestone>(plan.timeline);
  const documents = parseJsonArray<PlanningDocument>(plan.documents);
  const teamPlanning = parseTeamPlanning(plan.team_planning);

  return {
    id: plan.id,
    engagementId: plan.engagement_id,
    engagementSlug: engagement.slug,
    engagementName: engagement.name,
    companyName,
    planningStatus: plan.planning_status,
    planVersion: plan.plan_version,
    auditStrategy: plan.audit_strategy,
    engagementObjectives: plan.engagement_objectives,
    scopeOfAudit: plan.scope_of_audit,
    financialReportingFramework: plan.financial_reporting_framework,
    planningNotes: plan.planning_notes,
    materialityStatus: plan.materiality_status,
    riskStatus: plan.risk_status,
    timeline,
    teamPlanning,
    checklist,
    documents,
    checklistProgress: computeChecklistProgress(checklist),
    status: plan.status,
    version: plan.version,
    isArchived: Boolean(plan.deleted_at) || plan.status === "archived",
    deletedAt: plan.deleted_at,
    createdAt: plan.created_at,
    updatedAt: plan.updated_at,
  };
}
