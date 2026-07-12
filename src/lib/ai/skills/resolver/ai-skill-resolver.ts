import type { AiSkillRegistry } from "@/lib/ai/skills/registry/ai-skill-registry";
import type {
  AiSkillDefinition,
  AiSkillResolveMatch,
  AiSkillResolveRequest,
  AiSkillResolveResult,
} from "@/lib/ai/skills/contracts/types";
import { evaluateAiPermission } from "@/lib/ai/permissions/ai-permission-layer";

/**
 * Skill Resolver — selects skills from context, intent, permissions, and planner.
 * Never calls LLMs. Never executes skills.
 */
export class AiSkillResolver {
  constructor(private readonly registry: AiSkillRegistry) {}

  resolve(request: AiSkillResolveRequest): AiSkillResolveResult {
    const limit = request.limit ?? 5;
    const utterance = (request.utterance ?? "").trim().toLowerCase();
    const candidates = this.registry
      .list({ visibility: "public" })
      .filter((skill) => {
        if (request.moduleIds && !request.moduleIds.includes(skill.moduleId)) return false;
        const permission = evaluateAiPermission({
          context: request.context,
          requirement: skill.permission,
        });
        return permission.allowed;
      });

    const scored = candidates
      .map((skill) => this.score(skill, utterance, request))
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score || b.skill.priority - a.skill.priority);

    const matches = scored.slice(0, limit);
    return {
      matches,
      selected: matches[0] ?? null,
      resolvedAt: new Date().toISOString(),
    };
  }

  private score(
    skill: AiSkillDefinition,
    utterance: string,
    request: AiSkillResolveRequest,
  ): AiSkillResolveMatch {
    let score = 0;
    const reasons: string[] = [];

    if (request.context.moduleId === skill.moduleId) {
      score += 35;
      reasons.push("current_module");
    }

    if (request.context.route.includes(skill.moduleId)) {
      score += 10;
      reasons.push("route");
    }

    if (request.context.workflowId && skill.category === "workflow") {
      score += 8;
      reasons.push("workflow");
    }

    if (request.planner?.intent && skill.plannerIntents?.includes(request.planner.intent)) {
      score += 25;
      reasons.push("planner_intent");
    }

    if (request.planner?.targetModuleId === skill.moduleId) {
      score += 15;
      reasons.push("planner_target_module");
    }

    if (utterance) {
      for (const hint of skill.intentHints) {
        const normalized = hint.toLowerCase();
        if (utterance.includes(normalized) || normalized.split(" ").every((token) => utterance.includes(token))) {
          score += 20;
          reasons.push(`hint:${hint}`);
          break;
        }
      }
      if (utterance.includes(skill.moduleId.replace(/-/g, " ")) || utterance.includes(skill.name.toLowerCase())) {
        score += 12;
        reasons.push("name_match");
      }
    }

    score += Math.min(skill.priority / 10, 10);

    if (request.context.workspaceId) {
      score += 2;
      reasons.push("workspace");
    }

    return { skill, score, reasons };
  }
}
