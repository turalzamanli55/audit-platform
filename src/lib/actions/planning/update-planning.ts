"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, PLANNING_PERMISSIONS } from "@/constants/planning";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createPlanningAction as definePlanningAction } from "@/lib/actions/planning/planning-action";
import { validateUpdatePlanningInput } from "@/lib/planning/validation";
import { createServerClient } from "@/lib/supabase/server";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import type {
  PlanningChecklistItem,
  PlanningDocument,
  PlanningTeamPlanning,
  PlanningTimelineMilestone,
} from "@/types/planning";
import { ValidationError } from "@/lib/errors";

export type UpdatePlanningActionInput = {
  planId: string;
  version: number;
  planningStatus?: import("@/types/planning").PlanningStatus;
  auditStrategy?: string | null;
  engagementObjectives?: string | null;
  scopeOfAudit?: string | null;
  financialReportingFramework?: string | null;
  planningNotes?: string | null;
  materialityStatus?: import("@/types/planning").IntegrationReadinessStatus;
  riskStatus?: import("@/types/planning").IntegrationReadinessStatus;
  timeline?: PlanningTimelineMilestone[];
  teamPlanning?: PlanningTeamPlanning;
  checklist?: PlanningChecklistItem[];
  documents?: PlanningDocument[];
};

export type UpdatePlanningActionResult = {
  planId: string;
  version: number;
};

function createRepositoryContext(
  userId: string,
  organizationId: string,
  workspaceId: string,
): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId, isResolved: true },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export const updatePlanningAction = definePlanningAction<
  UpdatePlanningActionInput,
  UpdatePlanningActionResult
>({ module: "planning.update" }, PLANNING_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.planId) {
    throw new ValidationError("Planning record is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Planning version is required");
  }

  const validated = validateUpdatePlanningInput(input);

  const supabase = await createServerClient();
  const repository = new PlanningRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  await repository.validateWorkspaceOwnership(input.planId, context.workspaceId);

  const plan = await repository.update(input.planId, input.version, {
    planning_status: validated.planningStatus,
    audit_strategy: validated.auditStrategy,
    engagement_objectives: validated.engagementObjectives,
    scope_of_audit: validated.scopeOfAudit,
    financial_reporting_framework: validated.financialReportingFramework,
    planning_notes: validated.planningNotes,
    materiality_status: validated.materialityStatus,
    risk_status: validated.riskStatus,
    timeline: validated.timeline as never,
    team_planning: validated.teamPlanning as never,
    checklist: validated.checklist as never,
    documents: validated.documents as never,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.PLANNING_UPDATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: plan.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: plan.version },
  });

  return {
    planId: plan.id,
    version: plan.version,
  };
});
