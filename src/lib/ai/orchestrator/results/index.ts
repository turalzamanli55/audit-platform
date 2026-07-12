import type {
  AiOrchestratorError,
  AiOrchestratorExecutionPlan,
  AiOrchestratorIntent,
  AiOrchestratorLlmInvocation,
  AiOrchestratorResult,
  AiOrchestratorState,
  AiOrchestratorStep,
  AiOrchestratorStrategyId,
  AiOrchestratorUsage,
} from "@/lib/ai/orchestrator/types";
import type { AiPromptObject } from "@/lib/ai/types/prompts";
import type { AiSkillResolveResult, AiSkillResult } from "@/lib/ai/skills/contracts/types";
import type { KgBuiltContext, KgRetrievalResult } from "@/lib/ai/knowledge-graph/types";
import type { AiToolLlmDefinition, AiToolResolveResult } from "@/lib/ai/tools/types";
import { createOrchestratorError } from "@/lib/ai/orchestrator/utils";

export function mapOrchestratorFailure(input: {
  executionId: string;
  state: AiOrchestratorState;
  summary: string;
  intent: AiOrchestratorIntent;
  strategy: AiOrchestratorStrategyId;
  plan: AiOrchestratorExecutionPlan;
  steps: AiOrchestratorStep[];
  errors: AiOrchestratorError[];
  durationMs: number;
  usage?: Partial<AiOrchestratorUsage>;
}): AiOrchestratorResult {
  return {
    executionId: input.executionId,
    state: input.state,
    success: false,
    summary: input.summary,
    intent: input.intent,
    strategy: input.strategy,
    plan: input.plan,
    steps: input.steps,
    skillResolution: null,
    skillResult: null,
    knowledgeRetrieval: null,
    knowledgeGraphContext: null,
    toolResolution: null,
    availableTools: [],
    prompt: null,
    llmInvocation: {
      status: "skipped",
      reason: "Orchestration failed before LLM stage.",
      providerInvoked: false,
    },
    usage: {
      skills: [],
      knowledgeNodeIds: [],
      tools: [],
      stepsExecuted: input.usage?.stepsExecuted ?? 0,
      stepsSkipped: input.usage?.stepsSkipped ?? 0,
      retries: input.usage?.retries ?? 0,
    },
    warnings: [],
    errors: input.errors.length
      ? input.errors
      : [createOrchestratorError("orchestrator_failed", input.summary)],
    durationMs: input.durationMs,
    producedAt: new Date().toISOString(),
  };
}

export function buildOrchestratorResult(input: {
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
}): AiOrchestratorResult {
  return {
    ...input,
    producedAt: new Date().toISOString(),
  };
}
