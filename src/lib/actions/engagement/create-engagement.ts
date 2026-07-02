"use server";

import { headers } from "next/headers";
import { ENGAGEMENT_PERMISSIONS, AUDIT_RESOURCE_TYPE, ENGAGEMENT_ACTIVITY_ACTIONS } from "@/constants/engagement";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createEngagementAction as defineEngagementAction } from "@/lib/actions/engagement/engagement-action";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";
import { validateCreateEngagementInput } from "@/lib/engagement/validation";
import { NotFoundError } from "@/lib/errors";

import type { EngagementMemberRole, EngagementReportingFramework, EngagementType } from "@/types/engagement";

export type CreateEngagementActionInput = {
  name: string;
  companyId: string;
  engagementCode?: string | null;
  engagementType: EngagementType;
  reportingFramework: EngagementReportingFramework;
  periodStart?: string | null;
  periodEnd?: string | null;
  plannedStart?: string | null;
  plannedEnd?: string | null;
  description?: string | null;
  notes?: string | null;
  members?: Array<{ userId: string; memberRole: EngagementMemberRole }>;
};

export type CreateEngagementActionResult = {
  engagementId: string;
  slug: string;
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

export const createEngagementAction = defineEngagementAction<
  CreateEngagementActionInput,
  CreateEngagementActionResult
>({ module: "engagement.create" }, ENGAGEMENT_PERMISSIONS.CREATE, async (input, context) => {
  const validated = validateCreateEngagementInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );

  const companyRepository = new CompanyRepository(supabase, repositoryContext);
  const company = await companyRepository.findById(validated.companyId);
  if (!company || company.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Client company not found");
  }

  const repository = new EngagementRepository(supabase, repositoryContext);
  const slug = await repository.resolveUniqueSlug(context.workspaceId, validated.slug);

  const engagement = await repository.create({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: validated.companyId,
    name: validated.name,
    slug,
    engagement_code: validated.engagementCode,
    engagement_type: validated.engagementType,
    reporting_framework: validated.reportingFramework,
    period_start: validated.periodStart,
    period_end: validated.periodEnd,
    planned_start: validated.plannedStart,
    planned_end: validated.plannedEnd,
    description: validated.description,
    notes: validated.notes,
  });

  const requestedMembers = input.members ?? [];
  const assignedUserIds = new Set<string>([context.userId]);

  for (const member of requestedMembers) {
    if (!member.userId || assignedUserIds.has(member.userId)) {
      continue;
    }

    await repository.addMember({
      engagementId: engagement.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: member.userId,
      memberRole: member.memberRole,
    });

    await repository.logActivity({
      engagementId: engagement.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      action: ENGAGEMENT_ACTIVITY_ACTIONS.MEMBER_ADDED,
      summary: "Team member assigned during engagement creation",
      metadata: { userId: member.userId, memberRole: member.memberRole },
    });

    assignedUserIds.add(member.userId);
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.ENGAGEMENT_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: engagement.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      slug: engagement.slug,
      companyId: engagement.company_id,
    },
  });

  return {
    engagementId: engagement.id,
    slug: engagement.slug,
    version: engagement.version,
  };
});
