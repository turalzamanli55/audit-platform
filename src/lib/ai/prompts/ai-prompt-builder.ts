import { AI_FOUNDATION_VERSION } from "@/lib/ai/constants";
import type { AiPromptBuilderInput, AiPromptObject } from "@/lib/ai/types/prompts";

const SYSTEM_DIRECTIVES = [
  "You are an assistant to qualified audit and finance professionals.",
  "Never present AI output as professional approval or an audit opinion.",
  "Prefer evidence-backed answers with explicit citations when data is available.",
  "Stay within the user's tenant, workspace, and permission scope.",
  "Respond in the user's active platform locale.",
  "Do not invent financial figures, IFRS conclusions, or engagement facts.",
] as const;

const PROFESSIONAL_TONE = [
  "Precise professional terminology",
  "Neutral and measured",
  "No false familiarity",
  "Uncertainty stated explicitly",
] as const;

/**
 * Enterprise prompt builder — provider-agnostic assembly only.
 * Composes conversation + memory + knowledge + skills + tools + workspace context.
 */
export class AiPromptBuilder {
  build(input: AiPromptBuilderInput): AiPromptObject {
    const skillContext = {
      ...(input.skillContext ?? {}),
      ...(input.workspaceContext
        ? {
            workspaceModule: input.workspaceContext.moduleId,
            workspaceDisplayName: input.workspaceContext.displayName,
            capabilityCount: input.workspaceContext.capabilities.length,
          }
        : {}),
      ...(input.memoryContext
        ? {
            memoryPreferences: input.memoryContext.preferences,
            memoryEntryCount: input.memoryContext.entries.length,
            memorySummaries: input.memoryContext.summaries.map((summary) => summary.summary),
          }
        : {}),
      ...(input.tools?.length ? { selectedToolIds: input.tools } : {}),
    };

    return {
      version: AI_FOUNDATION_VERSION,
      systemDirectives: [...SYSTEM_DIRECTIVES],
      professionalTone: [...PROFESSIONAL_TONE],
      context: input.context,
      knowledge: input.knowledge,
      conversation: input.conversation,
      memory: input.memory,
      permissions: {
        roleSlugs: input.context.roleSlugs,
        permissionCodes: input.context.permissionCodes,
        workspaceId: input.context.workspaceId,
        organizationId: input.context.organizationId,
      },
      planner: input.planner ?? null,
      skillContext: Object.keys(skillContext).length > 0 ? skillContext : null,
      knowledgeGraphContext: input.knowledgeGraphContext ?? null,
      availableTools: input.availableTools,
      tools: input.tools,
      workspaceContext: input.workspaceContext ?? null,
      memoryContext: input.memoryContext ?? null,
      userUtterance: input.userUtterance,
      assembledAt: new Date().toISOString(),
    };
  }
}
