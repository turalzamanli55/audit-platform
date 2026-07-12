/**
 * Enterprise AI Foundation + LLM Platform + Skills + Knowledge Graph + Tool Runtime + Orchestrator
 *
 * Copilot Core → Context → Knowledge Engine → Actions → Conversation →
 * Planner → AI Orchestrator → Intent → Execution Plan → Steps →
 * Skill / Knowledge / Tool pipelines → Prompt Builder → LLM Platform (deferred)
 */

export {
  AI_FOUNDATION_VERSION,
  LLM_PLATFORM_VERSION,
  AI_MODULES,
  AI_ACTION_KINDS,
  AI_PLANNER_INTENTS,
} from "@/lib/ai/constants";
export type { AiModuleId, AiActionKind, AiPlannerIntent } from "@/lib/ai/constants";

export * from "@/lib/ai/types";
export * from "@/lib/ai/utils";
export * from "@/lib/ai/core";
export * from "@/lib/ai/context";
export * from "@/lib/ai/knowledge";
export * from "@/lib/ai/knowledge-graph";
export * from "@/lib/ai/actions";
export * from "@/lib/ai/conversation";
export * from "@/lib/ai/memory";
export * from "@/lib/ai/planner";
export * from "@/lib/ai/prompts";
export * from "@/lib/ai/permissions";
export * from "@/lib/ai/providers";
export * from "@/lib/ai/skills";
export * from "@/lib/ai/tools";
export * from "@/lib/ai/orchestrator";
export * from "@/lib/ai/context-resolvers";
export * from "@/lib/ai/ui";
export * from "@/lib/ai/registry";
