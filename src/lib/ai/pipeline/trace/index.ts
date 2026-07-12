import type { AiPipelineGraphEdge, AiPipelineStepId } from "@/lib/ai/pipeline/types";

/** Canonical production pipeline graph — existing layers only. */
export const AI_PIPELINE_GRAPH: readonly AiPipelineGraphEdge[] = [
  { from: "conversation", to: "memory_resolver" },
  { from: "memory_resolver", to: "memory_ranking" },
  { from: "memory_ranking", to: "context_resolver" },
  { from: "context_resolver", to: "planner" },
  { from: "planner", to: "orchestrator" },
  { from: "orchestrator", to: "skill_resolver" },
  { from: "skill_resolver", to: "knowledge_graph" },
  { from: "knowledge_graph", to: "tool_resolver" },
  { from: "tool_resolver", to: "host_planner" },
  { from: "host_planner", to: "prompt_builder" },
  { from: "prompt_builder", to: "llm_platform" },
  { from: "llm_platform", to: "structured_response" },
] as const;

export function pipelineStepLabel(stepId: AiPipelineStepId): string {
  switch (stepId) {
    case "conversation":
      return "Conversation";
    case "memory_resolver":
      return "Memory Resolver";
    case "memory_ranking":
      return "Memory Ranking";
    case "context_resolver":
      return "Context Resolver";
    case "planner":
      return "Planner";
    case "orchestrator":
      return "AI Orchestrator";
    case "skill_resolver":
      return "Skill Resolver";
    case "knowledge_graph":
      return "Knowledge Graph";
    case "tool_resolver":
      return "Tool Resolver";
    case "host_planner":
      return "Host Execution Planner";
    case "prompt_builder":
      return "Prompt Builder";
    case "llm_platform":
      return "LLM Platform";
    case "structured_response":
      return "Structured Response";
    default:
      return stepId;
  }
}
