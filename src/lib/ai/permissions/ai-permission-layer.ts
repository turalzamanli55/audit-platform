import { hasAllPermissionCodes, hasPermissionCode } from "@/lib/auth/permissions";
import type { AiPermissionCheckInput, AiPermissionDecision } from "@/lib/ai/types/permissions";

/**
 * Every AI action must pass tenant / workspace / role / permission gates
 * before the Action Registry returns an instruction.
 */
export function evaluateAiPermission(input: AiPermissionCheckInput): AiPermissionDecision {
  const { context, requirement } = input;

  if (!context.userId) {
    return { allowed: false, reason: "unauthenticated", message: "Authenticated user required." };
  }

  if (requirement.requireOrganization && !context.organizationId) {
    return {
      allowed: false,
      reason: "missing_organization",
      message: "Organization context required.",
    };
  }

  if (requirement.requireWorkspace && !context.workspaceId) {
    return {
      allowed: false,
      reason: "missing_workspace",
      message: "Workspace context required.",
    };
  }

  if (requirement.requireCompany && !context.companyId) {
    return {
      allowed: false,
      reason: "missing_company",
      message: "Company context required.",
    };
  }

  if (requirement.requireEngagement && !context.engagementId) {
    return {
      allowed: false,
      reason: "missing_engagement",
      message: "Engagement context required.",
    };
  }

  if (requirement.allOf && requirement.allOf.length > 0) {
    if (!hasAllPermissionCodes(context.permissionCodes, requirement.allOf)) {
      return {
        allowed: false,
        reason: "missing_permission",
        message: `Missing required permissions: ${requirement.allOf.join(", ")}`,
      };
    }
  }

  if (requirement.anyOf && requirement.anyOf.length > 0) {
    if (!hasPermissionCode(context.permissionCodes, requirement.anyOf)) {
      return {
        allowed: false,
        reason: "missing_permission",
        message: `Missing one of permissions: ${requirement.anyOf.join(", ")}`,
      };
    }
  }

  return { allowed: true };
}
