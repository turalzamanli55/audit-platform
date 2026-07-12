/**
 * AI Skills Engine — contracts only.
 * Skills never return UI. Skills never call LLMs. Skills never mutate data.
 */

import type { AiModuleId, AiPlannerIntent } from "@/lib/ai/constants";
import type { AiActionPermissionRequirement } from "@/lib/ai/types/actions";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiModuleKnowledge } from "@/lib/ai/types/knowledge";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";

export const AI_SKILL_CATEGORIES = [
  "explanation",
  "navigation",
  "workflow",
  "analysis",
  "validation",
  "search",
  "recommendation",
  "knowledge",
  "context",
  "planning",
  "audit",
  "import",
  "accounting",
] as const;

export type AiSkillCategory = (typeof AI_SKILL_CATEGORIES)[number];

export const AI_SKILL_CAPABILITIES = [
  "explain",
  "navigate",
  "summarize",
  "analyze",
  "validate",
  "search",
  "recommend",
  "timeline",
  "workflow",
  "status",
  "list",
] as const;

export type AiSkillCapability = (typeof AI_SKILL_CAPABILITIES)[number];

export type AiSkillVisibility = "public" | "internal" | "hidden";

export type AiSkillSeverity = "info" | "success" | "warning" | "critical";

/** Documentation-oriented JSON Schema fragment — not executed against a validator runtime. */
export type AiSkillJsonSchema = {
  type: "object";
  required?: string[];
  properties: Record<
    string,
    {
      type: "string" | "number" | "boolean" | "array" | "object" | "null";
      description?: string;
      items?: { type: string };
    }
  >;
};

export type AiSkillDefinition = {
  id: string;
  name: string;
  moduleId: AiModuleId;
  description: string;
  permission: AiActionPermissionRequirement;
  capabilities: readonly AiSkillCapability[];
  inputSchema: AiSkillJsonSchema;
  outputSchema: AiSkillJsonSchema;
  category: AiSkillCategory;
  /** Higher wins when multiple skills match. */
  priority: number;
  visibility: AiSkillVisibility;
  /** Phrases used by the Skill Resolver for intent matching. */
  intentHints: readonly string[];
  /** Optional planner intents this skill aligns with. */
  plannerIntents?: readonly AiPlannerIntent[];
  /** Optional Action Registry ids for recommendedActions metadata only. */
  relatedActionIds?: readonly string[];
};

export type AiSkillRecommendedAction = {
  label: string;
  kind: string;
  actionId?: string;
  estimatedResult?: string;
};

export type AiSkillReference = {
  type: "module" | "route" | "knowledge" | "workflow" | "entity" | "document";
  id: string;
  label: string;
};

/**
 * Structured skill output — never UI components, never free-form LLM text.
 */
export type AiSkillResult = {
  skillId: string;
  title: string;
  description: string;
  severity: AiSkillSeverity;
  confidence: number;
  recommendedActions: AiSkillRecommendedAction[];
  relatedModules: AiModuleId[];
  references: AiSkillReference[];
  /**
   * Structured context for Prompt Builder / LLM Platform.
   * Never a vendor prompt string.
   */
  structuredContext: Record<string, unknown>;
  knowledge: AiModuleKnowledge | null;
  context: AiRuntimeContext;
  producedAt: string;
};

export type AiSkillExecutionInput = {
  skill: AiSkillDefinition;
  context: AiRuntimeContext;
  knowledge: AiModuleKnowledge | null;
  utterance?: string;
  payload?: Record<string, unknown>;
  planner?: AiPlannerDecision | null;
};

export type AiSkillHandler = (input: AiSkillExecutionInput) => AiSkillResult;

export type AiSkillRegistration = {
  definition: AiSkillDefinition;
  handler: AiSkillHandler;
};

export type AiSkillResolveRequest = {
  context: AiRuntimeContext;
  utterance?: string;
  planner?: AiPlannerDecision | null;
  /** When set, restrict candidates to these module ids. */
  moduleIds?: AiModuleId[];
  limit?: number;
};

export type AiSkillResolveMatch = {
  skill: AiSkillDefinition;
  score: number;
  reasons: string[];
};

export type AiSkillResolveResult = {
  matches: AiSkillResolveMatch[];
  selected: AiSkillResolveMatch | null;
  resolvedAt: string;
};

export type AiSkillExecuteRequest = {
  skillId: string;
  context: AiRuntimeContext;
  utterance?: string;
  payload?: Record<string, unknown>;
  planner?: AiPlannerDecision | null;
};

export type AiSkillExecuteResult =
  | { ok: true; result: AiSkillResult }
  | {
      ok: false;
      reason:
        | "unknown_skill"
        | "forbidden"
        | "missing_workspace"
        | "missing_organization"
        | "missing_company"
        | "missing_engagement"
        | "unauthenticated";
      message: string;
    };
