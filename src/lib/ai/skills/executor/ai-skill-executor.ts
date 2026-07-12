import type { AiSkillRegistry } from "@/lib/ai/skills/registry/ai-skill-registry";
import type { AiKnowledgeEngine } from "@/lib/ai/knowledge/ai-knowledge-engine";
import type {
  AiSkillExecuteRequest,
  AiSkillExecuteResult,
} from "@/lib/ai/skills/contracts/types";
import { evaluateAiPermission } from "@/lib/ai/permissions/ai-permission-layer";

/**
 * Skill Executor — produces structured skill objects only.
 * Never calls LLM. Never navigates. Never mutates data. Never executes Action Registry.
 */
export class AiSkillExecutor {
  constructor(
    private readonly registry: AiSkillRegistry,
    private readonly knowledgeEngine: AiKnowledgeEngine,
  ) {}

  execute(request: AiSkillExecuteRequest): AiSkillExecuteResult {
    const registration = this.registry.get(request.skillId);
    if (!registration) {
      return {
        ok: false,
        reason: "unknown_skill",
        message: `Unknown AI skill: ${request.skillId}`,
      };
    }

    const permission = evaluateAiPermission({
      context: request.context,
      requirement: registration.definition.permission,
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
                : permission.reason === "unauthenticated"
                  ? "unauthenticated"
                  : "forbidden";
      return { ok: false, reason, message: permission.message };
    }

    const knowledge =
      this.knowledgeEngine.getModule(registration.definition.moduleId) ??
      (request.context.moduleId
        ? this.knowledgeEngine.getModule(request.context.moduleId)
        : null);

    const result = registration.handler({
      skill: registration.definition,
      context: request.context,
      knowledge,
      utterance: request.utterance,
      payload: request.payload,
      planner: request.planner ?? null,
    });

    return { ok: true, result };
  }
}
