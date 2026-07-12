import type { AiActionPermissionRequirement } from "@/lib/ai/types/actions";
import type { AiRuntimeContext } from "@/lib/ai/types/context";

export type AiPermissionDecision =
  | { allowed: true }
  | {
      allowed: false;
      reason:
        | "unauthenticated"
        | "missing_workspace"
        | "missing_organization"
        | "missing_engagement"
        | "missing_company"
        | "missing_permission"
        | "tenant_mismatch";
      message: string;
    };

export type AiPermissionCheckInput = {
  context: AiRuntimeContext;
  requirement: AiActionPermissionRequirement;
};
