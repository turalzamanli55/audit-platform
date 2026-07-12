import type {
  AiSkillCapability,
  AiSkillCategory,
  AiSkillDefinition,
  AiSkillExecutionInput,
  AiSkillHandler,
  AiSkillJsonSchema,
  AiSkillRecommendedAction,
  AiSkillReference,
  AiSkillRegistration,
  AiSkillResult,
  AiSkillSeverity,
  AiSkillVisibility,
} from "@/lib/ai/skills/contracts/types";
import type { AiModuleId, AiPlannerIntent } from "@/lib/ai/constants";
import type { AiActionPermissionRequirement } from "@/lib/ai/types/actions";

const DEFAULT_INPUT_SCHEMA: AiSkillJsonSchema = {
  type: "object",
  properties: {
    utterance: { type: "string", description: "Optional user utterance." },
    focusId: { type: "string", description: "Optional entity or section focus." },
  },
};

const DEFAULT_OUTPUT_SCHEMA: AiSkillJsonSchema = {
  type: "object",
  required: ["title", "description", "severity", "confidence", "structuredContext"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    severity: { type: "string" },
    confidence: { type: "number" },
    recommendedActions: { type: "array" },
    relatedModules: { type: "array" },
    references: { type: "array" },
    structuredContext: { type: "object" },
  },
};

export type DefineAiSkillInput = {
  id: string;
  name: string;
  moduleId: AiModuleId;
  description: string;
  category: AiSkillCategory;
  capabilities: readonly AiSkillCapability[];
  intentHints: readonly string[];
  permission?: AiActionPermissionRequirement;
  priority?: number;
  visibility?: AiSkillVisibility;
  plannerIntents?: readonly AiPlannerIntent[];
  relatedActionIds?: readonly string[];
  inputSchema?: AiSkillJsonSchema;
  outputSchema?: AiSkillJsonSchema;
  /**
   * Skill-specific structured context only.
   * Must not call LLMs, mutate data, navigate, or execute actions.
   */
  buildContext: (input: AiSkillExecutionInput) => {
    title: string;
    description: string;
    severity?: AiSkillSeverity;
    confidence?: number;
    structuredContext: Record<string, unknown>;
    recommendedActions?: AiSkillRecommendedAction[];
    relatedModules?: AiModuleId[];
    references?: AiSkillReference[];
  };
};

/**
 * Factory for module skills — shared permission/output wiring, no duplicated handlers.
 */
export function defineAiSkill(input: DefineAiSkillInput): AiSkillRegistration {
  const definition: AiSkillDefinition = {
    id: input.id,
    name: input.name,
    moduleId: input.moduleId,
    description: input.description,
    permission: input.permission ?? { requireWorkspace: true, requireOrganization: true },
    capabilities: input.capabilities,
    inputSchema: input.inputSchema ?? DEFAULT_INPUT_SCHEMA,
    outputSchema: input.outputSchema ?? DEFAULT_OUTPUT_SCHEMA,
    category: input.category,
    priority: input.priority ?? 50,
    visibility: input.visibility ?? "public",
    intentHints: input.intentHints,
    plannerIntents: input.plannerIntents,
    relatedActionIds: input.relatedActionIds,
  };

  const handler: AiSkillHandler = (execution) => {
    const built = input.buildContext(execution);
    const knowledge = execution.knowledge;
    const relatedModules =
      built.relatedModules ??
      ([execution.skill.moduleId, ...(knowledge?.relatedModules ?? [])] as AiModuleId[]);

    const recommendedActions: AiSkillRecommendedAction[] =
      built.recommendedActions ??
      (definition.relatedActionIds ?? []).map((actionId) => ({
        actionId,
        label: actionId,
        kind: "registered_action",
        estimatedResult: "Instruction envelope only — not executed by Skills Engine.",
      }));

    const references: AiSkillReference[] = built.references ?? [
      {
        type: "module",
        id: definition.moduleId,
        label: knowledge?.name ?? definition.moduleId,
      },
      {
        type: "knowledge",
        id: definition.moduleId,
        label: knowledge?.purpose ?? definition.description,
      },
    ];

    const result: AiSkillResult = {
      skillId: definition.id,
      title: built.title,
      description: built.description,
      severity: built.severity ?? "info",
      confidence: built.confidence ?? 0.72,
      recommendedActions,
      relatedModules: [...new Set(relatedModules)],
      references,
      structuredContext: {
        skillId: definition.id,
        skillName: definition.name,
        category: definition.category,
        moduleId: definition.moduleId,
        utterance: execution.utterance ?? null,
        payload: execution.payload ?? null,
        plannerIntent: execution.planner?.intent ?? null,
        knowledgePurpose: knowledge?.purpose ?? null,
        knowledgeWorkflow: knowledge?.workflow ?? [],
        knowledgeInputs: knowledge?.inputs ?? [],
        knowledgeOutputs: knowledge?.outputs ?? [],
        route: execution.context.route,
        workspaceId: execution.context.workspaceId,
        organizationId: execution.context.organizationId,
        companyId: execution.context.companyId,
        engagementId: execution.context.engagementId,
        workflowId: execution.context.workflowId,
        ...built.structuredContext,
      },
      knowledge,
      context: execution.context,
      producedAt: new Date().toISOString(),
    };

    return result;
  };

  return { definition, handler };
}

export function workspaceReadPermission(
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
