import type { AiToolRegistry } from "@/lib/ai/tools/registry";
import type {
  AiToolDefinition,
  AiToolResolveMatch,
  AiToolResolveRequest,
  AiToolResolveResult,
} from "@/lib/ai/tools/types";
import { AiToolPermissionEngine } from "@/lib/ai/tools/permissions";

/**
 * Tool Resolver — selects tools from planner, skill, module, permissions, route, context.
 */
export class AiToolResolver {
  private readonly permissions = new AiToolPermissionEngine();

  constructor(private readonly registry: AiToolRegistry) {}

  resolve(request: AiToolResolveRequest): AiToolResolveResult {
    const limit = request.limit ?? 5;
    const utterance = (request.utterance ?? "").trim().toLowerCase();

    const candidates = this.registry.listTools().filter((tool) => {
      if (request.category && tool.category !== request.category) return false;
      if (
        request.moduleIds &&
        tool.moduleId !== "*" &&
        !request.moduleIds.includes(tool.moduleId)
      ) {
        return false;
      }
      return this.permissions.evaluate(request.context, tool).allowed;
    });

    const scored = candidates
      .map((tool) => this.score(tool, utterance, request))
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score || a.tool.id.localeCompare(b.tool.id));

    const matches = scored.slice(0, limit);
    return {
      matches,
      selected: matches[0] ?? null,
      resolvedAt: new Date().toISOString(),
    };
  }

  private score(
    tool: AiToolDefinition,
    utterance: string,
    request: AiToolResolveRequest,
  ): AiToolResolveMatch {
    let score = 0;
    const reasons: string[] = [];

    if (request.context.moduleId && (tool.moduleId === "*" || tool.moduleId === request.context.moduleId)) {
      score += 20;
      reasons.push("current_module");
    }
    if (request.context.route.includes(String(tool.moduleId))) {
      score += 8;
      reasons.push("route");
    }
    if (request.planner?.intent && tool.plannerIntents?.includes(request.planner.intent)) {
      score += 25;
      reasons.push("planner_intent");
    }
    if (request.skillId && tool.id.includes(request.skillId.split(".")[0] ?? "")) {
      score += 10;
      reasons.push("skill");
    }
    if (utterance) {
      for (const hint of tool.intentHints) {
        if (utterance.includes(hint.toLowerCase())) {
          score += 22;
          reasons.push(`hint:${hint}`);
          break;
        }
      }
      if (utterance.includes(tool.name.toLowerCase()) || utterance.includes(tool.id)) {
        score += 12;
        reasons.push("name_match");
      }
    }
    if (request.workspaceContext?.moduleId && tool.moduleId === request.workspaceContext.moduleId) {
      score += 8;
      reasons.push("workspace_module");
    }
    if (
      request.knowledgeReferences?.some(
        (reference) => tool.id.includes(reference) || tool.moduleId === request.context.moduleId,
      )
    ) {
      score += 6;
      reasons.push("knowledge_reference");
    }
    if (request.memoryContext?.entries.some((entry) => entry.moduleId === tool.moduleId)) {
      score += 4;
      reasons.push("memory_context");
    }
    if (request.context.workspaceId) {
      score += 2;
      reasons.push("workspace");
    }
    return { tool, score, reasons };
  }
}
