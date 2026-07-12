import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiActionPermissionRequirement } from "@/lib/ai/types/actions";
import { evaluateAiPermission } from "@/lib/ai/permissions/ai-permission-layer";
import { createHostError } from "@/lib/ai/host/utils";
import type { AiHostError, AiHostRiskLevel } from "@/lib/ai/host/types";

/**
 * Host security — tenant / workspace / organization / permission aware.
 * No business rules.
 */
export class AiHostSecurityEngine {
  evaluatePermission(
    context: AiRuntimeContext,
    requirement: AiActionPermissionRequirement,
  ): { allowed: true } | { allowed: false; error: AiHostError } {
    const decision = evaluateAiPermission({ context, requirement });
    if (!decision.allowed) {
      return {
        allowed: false,
        error: createHostError("permission_denied", decision.message, {
          reason: decision.reason,
        }),
      };
    }
    return { allowed: true };
  }

  assertTenantScope(
    context: AiRuntimeContext,
    plan: { workspaceId: string | null; organizationId: string | null },
  ): { ok: true } | { ok: false; error: AiHostError } {
    if (plan.organizationId && context.organizationId && plan.organizationId !== context.organizationId) {
      return {
        ok: false,
        error: createHostError("tenant_mismatch", "Organization scope mismatch."),
      };
    }
    if (plan.workspaceId && context.workspaceId && plan.workspaceId !== context.workspaceId) {
      return {
        ok: false,
        error: createHostError("workspace_mismatch", "Workspace scope mismatch."),
      };
    }
    return { ok: true };
  }

  canApprove(
    risk: AiHostRiskLevel,
    actorRoles: string[] = [],
  ): { allowed: boolean; required: "user" | "manager" | "administrator" } {
    const roles = new Set(actorRoles.map((role) => role.toLowerCase()));
    const isAdmin = roles.has("administrator") || roles.has("admin") || roles.has("owner");
    const isManager = isAdmin || roles.has("manager") || roles.has("engagement_manager");

    if (risk === "critical") {
      return { allowed: isAdmin, required: "administrator" };
    }
    if (risk === "high") {
      return { allowed: isManager || isAdmin, required: "manager" };
    }
    return { allowed: true, required: "user" };
  }
}
