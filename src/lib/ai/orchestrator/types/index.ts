/**
 * Enterprise AI Orchestrator — type contracts.
 * Coordinates Planner, Skills, Knowledge Graph, Tool Runtime, Prompt Builder, LLM Platform.
 * Contains no business rules. Never calls repositories or server actions.
 */

import type { AiModuleId } from "@/lib/ai/constants";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";
import type { AiPromptObject } from "@/lib/ai/types/prompts";
import type { AiConversationMessage } from "@/lib/ai/types/conversation";
import type { AiMemoryEntry } from "@/lib/ai/types/memory";
import type { AiSkillResolveResult, AiSkillResult } from "@/lib/ai/skills/contracts/types";
import type { KgBuiltContext, KgRetrievalResult } from "@/lib/ai/knowledge-graph/types";
import type { AiToolLlmDefinition, AiToolResolveResult } from "@/lib/ai/tools/types";

export const AI_ORCHESTRATOR_VERSION = "1.0.0" as const;

export const AI_ORCHESTRATOR_INTENT_KINDS = [
  "question",
  "navigation",
  "explanation",
  "analysis",
  "validation",
  "workflow",
  "search",
  "recommendation",
  "reporting",
  "accounting",
  "audit",
  "planning",
  "risk",
  "import",
  "settings",
  "mixed",
] as const;

export type AiOrchestratorIntentKind = (typeof AI_ORCHESTRATOR_INTENT_KINDS)[number];

export const AI_ORCHESTRATOR_STATES = [
  "created",
  "planning",
  "resolving",
  "waiting",
  "executing",
  "completed",
  "failed",
  "cancelled",
] as const;

export type AiOrchestratorState = (typeof AI_ORCHESTRATOR_STATES)[number];

export const AI_ORCHESTRATOR_STRATEGIES = [
  "simple",
  "fast",
  "deep",
  "audit",
  "accounting",
  "import",
  "validation",
] as const;

export type AiOrchestratorStrategyId = (typeof AI_ORCHESTRATOR_STRATEGIES)[number];

export const AI_ORCHESTRATOR_STEP_KINDS = [
  "analyze_intent",
  "resolve_skill",
  "resolve_knowledge",
  "resolve_tools",
  "load_module_context",
  "merge_context",
  "build_prompt",
  "invoke_llm",
  "collect_result",
] as const;

export type AiOrchestratorStepKind = (typeof AI_ORCHESTRATOR_STEP_KINDS)[number];

export const AI_ORCHESTRATOR_STEP_STATUSES = [
  "pending",
  "ready",
  "running",
  "succeeded",
  "failed",
  "skipped",
  "cancelled",
  "waiting",
] as const;

export type AiOrchestratorStepStatus = (typeof AI_ORCHESTRATOR_STEP_STATUSES)[number];

export const AI_ORCHESTRATOR_PIPELINE_MODES = [
  "sequential",
  "parallel",
  "conditional",
] as const;

export type AiOrchestratorPipelineMode = (typeof AI_ORCHESTRATOR_PIPELINE_MODES)[number];

export type AiOrchestratorError = {
  code: string;
  message: string;
  stepId?: string;
  details?: Record<string, unknown>;
};

export type AiOrchestratorIntent = {
  primary: AiOrchestratorIntentKind;
  secondary: AiOrchestratorIntentKind[];
  confidence: number;
  rationale: string;
  signals: string[];
  mixed: boolean;
};

export type AiOrchestratorStep = {
  id: string;
  order: number;
  kind: AiOrchestratorStepKind;
  description: string;
  dependencies: string[];
  skillId: string | null;
  knowledgeQuery: string | null;
  toolIds: string[];
  moduleId: AiModuleId | "*" | null;
  expectedOutput: string;
  status: AiOrchestratorStepStatus;
  pipelineMode: AiOrchestratorPipelineMode;
  retryLimit: number;
  retryCount: number;
  conditionalOn?: {
    stepId: string;
    statusIn: AiOrchestratorStepStatus[];
  };
  startedAt: string | null;
  completedAt: string | null;
  durationMs: number | null;
  output: Record<string, unknown> | null;
  error: AiOrchestratorError | null;
};

export type AiOrchestratorExecutionPlan = {
  id: string;
  strategy: AiOrchestratorStrategyId;
  intent: AiOrchestratorIntent;
  planner: AiPlannerDecision | null;
  steps: AiOrchestratorStep[];
  pipelineMode: AiOrchestratorPipelineMode;
  createdAt: string;
};

export type AiOrchestratorLlmInvocation = {
  status: "deferred" | "skipped" | "failed";
  reason: string;
  providerInvoked: false;
};

export type AiOrchestratorUsage = {
  skills: string[];
  knowledgeNodeIds: string[];
  tools: string[];
  stepsExecuted: number;
  stepsSkipped: number;
  retries: number;
};

export type AiOrchestratorResult = {
  executionId: string;
  state: AiOrchestratorState;
  success: boolean;
  summary: string;
  intent: AiOrchestratorIntent;
  strategy: AiOrchestratorStrategyId;
  plan: AiOrchestratorExecutionPlan;
  steps: AiOrchestratorStep[];
  skillResolution: AiSkillResolveResult | null;
  skillResult: AiSkillResult | null;
  knowledgeRetrieval: KgRetrievalResult | null;
  knowledgeGraphContext: KgBuiltContext | null;
  toolResolution: AiToolResolveResult | null;
  availableTools: AiToolLlmDefinition[];
  prompt: AiPromptObject | null;
  llmInvocation: AiOrchestratorLlmInvocation;
  usage: AiOrchestratorUsage;
  warnings: string[];
  errors: AiOrchestratorError[];
  durationMs: number;
  producedAt: string;
};

export type AiOrchestratorRequest = {
  utterance: string;
  context: AiRuntimeContext;
  planner?: AiPlannerDecision | null;
  strategy?: AiOrchestratorStrategyId;
  conversationId?: string | null;
  sessionId?: string | null;
  userId?: string | null;
  conversation?: AiConversationMessage[];
  memory?: AiMemoryEntry[];
  /** When true, stop after planning without executing resolve/build steps. */
  planOnly?: boolean;
  /** Max retries per retryable step. */
  maxRetries?: number;
  /** Cancel token checked between steps. */
  cancelRequested?: boolean;
};

export type AiOrchestratorHistoryRecord = {
  id: string;
  executionId: string;
  conversationId: string | null;
  sessionId: string | null;
  userId: string | null;
  utterance: string;
  state: AiOrchestratorState;
  strategy: AiOrchestratorStrategyId;
  intentPrimary: AiOrchestratorIntentKind;
  planId: string;
  stepCount: number;
  success: boolean;
  summary: string;
  errors: AiOrchestratorError[];
  durationMs: number;
  usage: AiOrchestratorUsage;
  recordedAt: string;
};

export type AiOrchestratorTelemetrySnapshot = {
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  cancelledCount: number;
  totalDurationMs: number;
  averageDurationMs: number;
  totalSteps: number;
  totalRetries: number;
  skillResolutions: number;
  knowledgeResolutions: number;
  toolResolutions: number;
  successRate: number;
  failureRate: number;
};

export type AiOrchestratorRuntimeSnapshot = {
  executionId: string;
  state: AiOrchestratorState;
  plan: AiOrchestratorExecutionPlan | null;
  currentStepId: string | null;
  startedAt: string;
  updatedAt: string;
};
