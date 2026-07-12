import { evaluateAiPermission } from "@/lib/ai/permissions/ai-permission-layer";
import type { AiActionPermissionRequirement } from "@/lib/ai/types/actions";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiToolAccessMode, AiToolDefinition } from "@/lib/ai/tools/types";

export type AiToolPermissionDecision =
  | { allowed: true }
  | { allowed: false; code: string; message: string };

/**
 * Tool permission engine — tenant / workspace / org / role / permission / ownership.
 */
export class AiToolPermissionEngine {
  evaluate(
    context: AiRuntimeContext,
    tool: AiToolDefinition,
    args: Record<string, unknown> = {},
  ): AiToolPermissionDecision {
    if (!context.userId) {
      return { allowed: false, code: "unauthenticated", message: "Authenticated user required." };
    }
    if (!context.organizationId) {
      return { allowed: false, code: "missing_organization", message: "Organization context required." };
    }
    if (!context.workspaceId) {
      return { allowed: false, code: "missing_workspace", message: "Workspace context required." };
    }

    const base = evaluateAiPermission({
      context,
      requirement: tool.permissions,
    });
    if (!base.allowed) {
      return { allowed: false, code: base.reason, message: base.message };
    }

    if (tool.accessMode === "ADMIN" || tool.accessMode === "SYSTEM") {
      const elevated = context.roleSlugs.some((role) =>
        ["admin", "owner", "workspace_admin", "system"].includes(role),
      );
      if (!elevated && !(tool.permissions.anyOf ?? []).some((code) => context.permissionCodes.includes(code))) {
        return {
          allowed: false,
          code: "missing_elevated_role",
          message: `${tool.accessMode} tools require elevated role or explicit permission.`,
        };
      }
    }

    if (tool.permissions.requireCompany || args.requireOwnership === true) {
      const ownerId = typeof args.ownerUserId === "string" ? args.ownerUserId : null;
      if (ownerId && ownerId !== context.userId) {
        const canOverride = context.permissionCodes.some((code) =>
          code.endsWith(".administer") || code.endsWith(".admin") || code.includes("approve"),
        );
        if (!canOverride) {
          return {
            allowed: false,
            code: "ownership_mismatch",
            message: "Caller does not own the target object.",
          };
        }
      }
    }

    return { allowed: true };
  }

  accessAllowsWrite(accessMode: AiToolAccessMode): boolean {
    return accessMode === "WRITE" || accessMode === "ADMIN" || accessMode === "SYSTEM";
  }
}

export function readPermission(anyOf?: string[]): AiActionPermissionRequirement {
  return {
    requireWorkspace: true,
    requireOrganization: true,
    ...(anyOf && anyOf.length > 0 ? { anyOf } : {}),
  };
}

export function writePermission(
  anyOf?: string[],
  extras?: Partial<AiActionPermissionRequirement>,
): AiActionPermissionRequirement {
  return {
    requireWorkspace: true,
    requireOrganization: true,
    ...(anyOf && anyOf.length > 0 ? { anyOf } : {}),
    ...extras,
  };
}
