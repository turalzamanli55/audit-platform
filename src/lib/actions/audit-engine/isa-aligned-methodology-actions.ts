"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE, type IsaPhase } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import {
  createAuditEngineAction,
  createRepositoryContext,
} from "@/lib/actions/audit-engine/audit-engine-action";
import { createServerClient } from "@/lib/supabase/server";
import { IsaAlignedMethodologyRepository } from "@/repositories/audit-engine/isa-aligned-methodology-repository";
import { ValidationError } from "@/lib/errors";

export type AdvanceIsaAlignedMethodologyInput = {
  engagementId: string;
  completedPhases: IsaPhase[];
  nextPhase: IsaPhase;
};

export type AdvanceIsaAlignedMethodologyResult = {
  engagementId: string;
  nextPhase: IsaPhase;
  remainingPhase: IsaPhase | null;
  hasAuditProgram: boolean;
};

export const advanceIsaAlignedMethodologyAction = createAuditEngineAction<
  AdvanceIsaAlignedMethodologyInput,
  AdvanceIsaAlignedMethodologyResult
>(
  { module: "audit-engine.isa-aligned-methodology.advance" },
  AUDIT_ENGINE_PERMISSIONS.ISA_METHODOLOGY,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");

    const supabase = await createServerClient();
    const repository = new IsaAlignedMethodologyRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    repository.assertPhaseAdvance(input.completedPhases, input.nextPhase);
    const program = await repository.findAuditProgramByEngagement(input.engagementId);
    const remainingPhase = repository.resolveNextIsaPhase([
      ...input.completedPhases,
      input.nextPhase,
    ]);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.PLANNING_UPDATED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.engagementId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        capability: "isa-aligned-methodology",
        nextPhase: input.nextPhase,
        hasAuditProgram: Boolean(program),
      },
    });

    return {
      engagementId: input.engagementId,
      nextPhase: input.nextPhase,
      remainingPhase,
      hasAuditProgram: Boolean(program),
    };
  },
);
