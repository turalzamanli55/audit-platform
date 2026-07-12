import type {
  AiActionDefinition,
  AiActionInstruction,
  AiActionRequest,
  AiActionResult,
} from "@/lib/ai/types/actions";
import type { AiModuleId } from "@/lib/ai/constants";
import { evaluateAiPermission } from "@/lib/ai/permissions/ai-permission-layer";
import { AI_ACTION_DEFINITIONS } from "@/lib/ai/actions/action-definitions";

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asFilters(
  value: unknown,
): Record<string, string | number | boolean | null> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, string | number | boolean | null>;
}

/**
 * AI Action Registry — permission-gated instruction factory.
 * Never executes business mutations.
 */
export class AiActionRegistry {
  private readonly actions: Map<string, AiActionDefinition>;

  constructor(definitions: readonly AiActionDefinition[] = AI_ACTION_DEFINITIONS) {
    this.actions = new Map(definitions.map((action) => [action.id, action]));
  }

  list(): AiActionDefinition[] {
    return [...this.actions.values()];
  }

  get(actionId: string): AiActionDefinition | null {
    return this.actions.get(actionId) ?? null;
  }

  listIds(): string[] {
    return [...this.actions.keys()];
  }

  execute(request: AiActionRequest): AiActionResult {
    const definition = this.actions.get(request.actionId);
    if (!definition) {
      return {
        ok: false,
        reason: "unknown_action",
        message: `Unknown AI action: ${request.actionId}`,
      };
    }

    const permission = evaluateAiPermission({
      context: request.context,
      requirement: definition.permission,
    });
    if (!permission.allowed) {
      const reason =
        permission.reason === "missing_workspace"
          ? "missing_workspace"
          : permission.reason === "missing_organization"
            ? "missing_organization"
            : permission.reason === "missing_engagement"
              ? "missing_engagement"
              : permission.reason === "missing_company"
                ? "missing_company"
                : "forbidden";
      return { ok: false, reason, message: permission.message };
    }

    const payload = request.payload ?? {};
    const instruction = this.buildInstruction(definition, payload);
    if (!instruction) {
      return {
        ok: false,
        reason: "invalid_payload",
        message: `Invalid payload for action ${definition.id}`,
      };
    }

    return { ok: true, instruction };
  }

  private buildInstruction(
    definition: AiActionDefinition,
    payload: Record<string, unknown>,
  ): AiActionInstruction | null {
    switch (definition.kind) {
      case "navigate": {
        const href = asString(payload.href);
        return href ? { type: "navigate", href } : null;
      }
      case "open_module": {
        const moduleId = asString(payload.moduleId) as AiModuleId | null;
        const href = asString(payload.href);
        return moduleId && href ? { type: "open_module", moduleId, href } : null;
      }
      case "open_company": {
        const id = asString(payload.companyId) ?? asString(payload.id);
        const slug = asString(payload.slug) ?? undefined;
        const href =
          asString(payload.href) ??
          (slug ? `/app/companies/${slug}` : id ? `/app/companies/${id}` : null);
        return id && href
          ? { type: "open_entity", entityType: "company", id, slug, href }
          : null;
      }
      case "open_engagement": {
        const id = asString(payload.engagementId) ?? asString(payload.id);
        const slug = asString(payload.slug) ?? undefined;
        const href =
          asString(payload.href) ??
          (slug ? `/app/engagements/${slug}` : id ? `/app/engagements/${id}` : null);
        return id && href
          ? { type: "open_entity", entityType: "engagement", id, slug, href }
          : null;
      }
      case "apply_filter": {
        const filters = asFilters(payload.filters);
        return filters ? { type: "apply_filter", filters } : null;
      }
      case "open_modal": {
        const surfaceId = asString(payload.surfaceId);
        return surfaceId
          ? {
              type: "open_surface",
              surface: "modal",
              surfaceId,
              props: (payload.props as Record<string, unknown> | undefined) ?? undefined,
            }
          : null;
      }
      case "open_drawer": {
        const surfaceId = asString(payload.surfaceId);
        return surfaceId
          ? {
              type: "open_surface",
              surface: "drawer",
              surfaceId,
              props: (payload.props as Record<string, unknown> | undefined) ?? undefined,
            }
          : null;
      }
      case "start_workflow":
      case "continue_workflow": {
        const workflowId = asString(payload.workflowId);
        return workflowId
          ? {
              type: "workflow",
              mode: definition.kind === "start_workflow" ? "start" : "continue",
              workflowId,
            }
          : null;
      }
      case "search": {
        const query = asString(payload.query);
        return query
          ? { type: "search", query, scope: asString(payload.scope) ?? undefined }
          : null;
      }
      case "highlight_component": {
        const componentId = asString(payload.componentId);
        return componentId ? { type: "highlight", componentId } : null;
      }
      case "show_documentation": {
        const topicId = asString(payload.topicId);
        return topicId ? { type: "documentation", topicId } : null;
      }
      case "restart_tour": {
        const tourId = asString(payload.tourId);
        return tourId ? { type: "tour", tourId } : null;
      }
      case "explain":
      case "suggest":
      case "answer":
        return {
          type: "message",
          intent: definition.kind,
          text: asString(payload.text) ?? undefined,
          textKey: asString(payload.textKey) ?? undefined,
        };
      default:
        return null;
    }
  }
}

export { AI_ACTION_DEFINITIONS };
