import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";
import type { AiModuleKnowledge } from "@/lib/ai/types/knowledge";
import type { AiConversationMessage } from "@/lib/ai/types/conversation";
import type { AiMemoryEntry } from "@/lib/ai/types/memory";
import type { AiSkillResolveResult, AiSkillResult } from "@/lib/ai/skills/contracts/types";
import type { KgBuiltContext, KgRetrievalResult } from "@/lib/ai/knowledge-graph/types";
import type { AiToolLlmDefinition, AiToolResolveResult } from "@/lib/ai/tools/types";
import type {
  AiOrchestratorIntent,
  AiOrchestratorStep,
  AiOrchestratorStrategyId,
} from "@/lib/ai/orchestrator/types";

export type AiOrchestratorBuiltContext = {
  utterance: string;
  runtime: AiRuntimeContext;
  planner: AiPlannerDecision | null;
  intent: AiOrchestratorIntent | null;
  strategy: AiOrchestratorStrategyId | null;
  moduleKnowledge: AiModuleKnowledge[];
  conversation: AiConversationMessage[];
  memory: AiMemoryEntry[];
  skillResolution: AiSkillResolveResult | null;
  skillResult: AiSkillResult | null;
  knowledgeRetrieval: KgRetrievalResult | null;
  knowledgeGraphContext: KgBuiltContext | null;
  toolResolution: AiToolResolveResult | null;
  availableTools: AiToolLlmDefinition[];
  moduleSweepOutputs: Record<string, unknown>[];
  stepOutputs: Record<string, Record<string, unknown> | null>;
};

/**
 * Context Builder — assembles orchestration context envelopes only.
 */
export class AiOrchestratorContextBuilder {
  createEmpty(input: {
    utterance: string;
    runtime: AiRuntimeContext;
    planner?: AiPlannerDecision | null;
    conversation?: AiConversationMessage[];
    memory?: AiMemoryEntry[];
    moduleKnowledge?: AiModuleKnowledge[];
  }): AiOrchestratorBuiltContext {
    return {
      utterance: input.utterance,
      runtime: input.runtime,
      planner: input.planner ?? null,
      intent: null,
      strategy: null,
      moduleKnowledge: input.moduleKnowledge ?? [],
      conversation: input.conversation ?? [],
      memory: input.memory ?? [],
      skillResolution: null,
      skillResult: null,
      knowledgeRetrieval: null,
      knowledgeGraphContext: null,
      toolResolution: null,
      availableTools: [],
      moduleSweepOutputs: [],
      stepOutputs: {},
    };
  }

  recordStepOutput(ctx: AiOrchestratorBuiltContext, step: AiOrchestratorStep): void {
    ctx.stepOutputs[step.id] = step.output;
    if (step.kind === "load_module_context" && step.output) {
      ctx.moduleSweepOutputs.push(step.output);
    }
  }

  mergeModuleSweep(ctx: AiOrchestratorBuiltContext): Record<string, unknown> {
    return {
      moduleCount: ctx.moduleSweepOutputs.length,
      modules: ctx.moduleSweepOutputs.map((entry) => entry.moduleId ?? null),
      merged: true,
    };
  }
}
