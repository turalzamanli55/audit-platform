/**
 * Enterprise AI Foundation — shared constants.
 * Provider-independent LLM Platform Layer is separate (`LLM_PLATFORM_VERSION`).
 * No vendor SDK wiring. No LLM network calls.
 */

export const AI_FOUNDATION_VERSION = "1.0.0" as const;
export { LLM_PLATFORM_VERSION } from "@/lib/ai/providers/llm-platform";

export const AI_MODULES = [
  "dashboard",
  "companies",
  "engagements",
  "planning",
  "materiality",
  "risk-assessment",
  "fieldwork",
  "review",
  "completion",
  "reporting",
  "opinion",
  "financial-statements",
  "trial-balance",
  "uaie",
  "import-intelligence",
  "settings",
  "users",
  "permissions",
] as const;

export type AiModuleId = (typeof AI_MODULES)[number];

export const AI_ACTION_KINDS = [
  "navigate",
  "open_module",
  "open_company",
  "open_engagement",
  "apply_filter",
  "open_modal",
  "open_drawer",
  "start_workflow",
  "continue_workflow",
  "search",
  "highlight_component",
  "show_documentation",
  "restart_tour",
  "explain",
  "suggest",
  "answer",
] as const;

export type AiActionKind = (typeof AI_ACTION_KINDS)[number];

export const AI_PLANNER_INTENTS = [
  "answer",
  "navigate",
  "suggest",
  "search",
  "open_module",
  "explain",
  "highlight_ui",
  "call_registered_action",
] as const;

export type AiPlannerIntent = (typeof AI_PLANNER_INTENTS)[number];
