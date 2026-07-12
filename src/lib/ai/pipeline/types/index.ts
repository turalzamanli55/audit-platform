/**
 * Enterprise AI Integration Pipeline — type contracts.
 * Connects existing layers only. No new AI engines.
 */

import type { AiContextCollectionInput } from "@/lib/ai/types/context";
import type { AiCopilotTurnPreview } from "@/lib/ai/types/ui";
import type { AiHostExecutionPlan } from "@/lib/ai/host/types";
import type { EmeMemoryContext } from "@/lib/ai/memory-engine/types";
import type { AiModuleContextResolution } from "@/lib/ai/context-resolvers/types";

export const AI_PIPELINE_VERSION = "1.0.0" as const;

export const AI_PIPELINE_SURFACES = ["workspace", "everywhere"] as const;
export type AiPipelineSurface = (typeof AI_PIPELINE_SURFACES)[number];

export const AI_PIPELINE_STEP_IDS = [
  "conversation",
  "memory_resolver",
  "memory_ranking",
  "context_resolver",
  "planner",
  "orchestrator",
  "skill_resolver",
  "knowledge_graph",
  "tool_resolver",
  "host_planner",
  "prompt_builder",
  "llm_platform",
  "structured_response",
] as const;

export type AiPipelineStepId = (typeof AI_PIPELINE_STEP_IDS)[number];

export type AiPipelineStepTrace = {
  stepId: AiPipelineStepId;
  label: string;
  status: "succeeded" | "failed" | "skipped";
  durationMs: number;
  metadata?: Record<string, unknown>;
};

export type AiPipelineGraphEdge = {
  from: AiPipelineStepId;
  to: AiPipelineStepId;
};

export type AiPipelineTrace = {
  executionId: string;
  surface: AiPipelineSurface;
  steps: AiPipelineStepTrace[];
  graph: AiPipelineGraphEdge[];
  totalDurationMs: number;
  producedAt: string;
};

export type AiPipelineObservability = {
  pipelineLatencyMs: number;
  memoryRetrievalMs: number;
  knowledgeRetrievalMs: number;
  skillSelectionMs: number;
  toolSelectionMs: number;
  hostPlanningMs: number;
  promptGenerationMs: number;
  orchestratorMs: number;
  llmDurationMs: number | null;
  streamingDurationMs: number | null;
  memoryHitCount: number;
  knowledgeHitCount: number;
  selectedSkillId: string | null;
  selectedToolId: string | null;
  promptTokenEstimate: number;
  provider: string | null;
};

export type AiPipelineDebugSnapshot = {
  pipeline: AiPipelineStepId[];
  memoryHits: number;
  knowledgeHits: number;
  selectedSkills: string[];
  selectedTools: string[];
  promptSize: number;
  provider: string | null;
  latencyMs: number;
};

export type AiPipelineRequest = {
  utterance: string;
  contextInput: AiContextCollectionInput;
  conversationId?: string | null;
  surface?: AiPipelineSurface;
  debug?: boolean;
  ingestLearning?: boolean;
};

export type AiPipelineStreamMetadata = {
  citations: Array<{ id: string; title: string; path?: string }>;
  knowledgeReferences: Array<{ id: string; title: string }>;
  toolPlans: Array<{ toolId: string; summary: string }>;
  hostExecutionPlanId: string | null;
  traceExecutionId: string;
};

export type AiPipelineResult = {
  preview: AiCopilotTurnPreview;
  trace: AiPipelineTrace;
  observability: AiPipelineObservability;
  memoryContext: EmeMemoryContext;
  workspaceResolution: AiModuleContextResolution;
  hostExecutionPlan: AiHostExecutionPlan | null;
  streamMetadata: AiPipelineStreamMetadata;
  debug?: AiPipelineDebugSnapshot;
};
