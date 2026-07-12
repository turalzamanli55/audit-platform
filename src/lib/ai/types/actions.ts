import type { AiActionKind, AiModuleId } from "@/lib/ai/constants";
import type { AiRuntimeContext } from "@/lib/ai/types/context";

export type AiActionPermissionRequirement = {
  /** At least one of these permission codes must be present. */
  anyOf?: string[];
  /** All of these permission codes must be present. */
  allOf?: string[];
  /** When true, a resolved workspaceId is required. */
  requireWorkspace?: boolean;
  /** When true, a resolved organizationId is required. */
  requireOrganization?: boolean;
  /** When true, a resolved engagementId is required. */
  requireEngagement?: boolean;
  /** When true, a resolved companyId is required. */
  requireCompany?: boolean;
};

export type AiActionDefinition = {
  id: string;
  kind: AiActionKind;
  label: string;
  description: string;
  moduleIds: AiModuleId[] | "*";
  permission: AiActionPermissionRequirement;
  /** Payload schema keys expected by the action (documentation only). */
  payloadKeys: string[];
};

export type AiActionRequest = {
  actionId: string;
  payload?: Record<string, unknown>;
  context: AiRuntimeContext;
};

/**
 * Actions never mutate business data here.
 * They return an instruction envelope for the UI / orchestration layer.
 */
export type AiActionInstruction =
  | {
      type: "navigate";
      href: string;
    }
  | {
      type: "open_module";
      moduleId: AiModuleId;
      href: string;
    }
  | {
      type: "open_entity";
      entityType: "company" | "engagement";
      id: string;
      slug?: string;
      href: string;
    }
  | {
      type: "apply_filter";
      filters: Record<string, string | number | boolean | null>;
    }
  | {
      type: "open_surface";
      surface: "modal" | "drawer";
      surfaceId: string;
      props?: Record<string, unknown>;
    }
  | {
      type: "workflow";
      mode: "start" | "continue";
      workflowId: string;
    }
  | {
      type: "search";
      query: string;
      scope?: string;
    }
  | {
      type: "highlight";
      componentId: string;
    }
  | {
      type: "documentation";
      topicId: string;
    }
  | {
      type: "tour";
      tourId: string;
    }
  | {
      type: "message";
      intent: "answer" | "explain" | "suggest";
      textKey?: string;
      text?: string;
    };

export type AiActionResult =
  | { ok: true; instruction: AiActionInstruction }
  | {
      ok: false;
      reason:
        | "unknown_action"
        | "forbidden"
        | "missing_workspace"
        | "missing_organization"
        | "missing_engagement"
        | "missing_company"
        | "invalid_payload";
      message: string;
    };
