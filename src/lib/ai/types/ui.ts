import type { AiPromptObject } from "@/lib/ai/types/prompts";
import type { AiActionInstruction } from "@/lib/ai/types/actions";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";
import type { AiSkillResolveResult, AiSkillResult } from "@/lib/ai/skills/contracts/types";
import type { KgBuiltContext, KgRetrievalResult } from "@/lib/ai/knowledge-graph/types";
import type { AiToolLlmDefinition, AiToolResolveResult } from "@/lib/ai/tools/types";
import type { AiOrchestratorResult } from "@/lib/ai/orchestrator/types";
import type { AiPipelineObservability, AiPipelineTrace } from "@/lib/ai/pipeline/types";
import type { AiHostExecutionPlan } from "@/lib/ai/host/types";

/**
 * UI contracts — host applications implement visual surfaces separately.
 */
export type AiCopilotHostAdapter = {
  /** Optional: surface a non-visual readiness signal for the host shell. */
  onFoundationReady?: (version: string) => void;
  /** Optional: apply an action instruction produced by the registry. */
  applyInstruction?: (instruction: AiActionInstruction) => void | Promise<void>;
};

export type AiCopilotPanelContract = {
  /** Reserved for future visual surface — must not render chat yet. */
  readonly kind: "ai-copilot-panel-contract";
  bindHost(adapter: AiCopilotHostAdapter): void;
};

export type AiCopilotTurnRequest = {
  utterance: string;
};

export type AiCopilotTurnPreview = {
  planner: AiPlannerDecision;
  prompt: AiPromptObject;
  /** True when a provider is attached; foundation ships with none. */
  providerAvailable: boolean;
  /** Skills Engine resolution for this turn — never UI. */
  skillResolution?: AiSkillResolveResult;
  /** Structured skill output when a skill was selected — never UI. */
  skillResult?: AiSkillResult | null;
  /** Knowledge graph retrieval for this turn — never UI. */
  knowledgeRetrieval?: KgRetrievalResult;
  /** Structured knowledge context built for the prompt — never UI. */
  knowledgeGraphContext?: KgBuiltContext | null;
  /** Tool Runtime resolution — LLM may only see availableTools definitions. */
  toolResolution?: AiToolResolveResult;
  /** Tool definitions safe for LLM consumption — schemas only. */
  availableTools?: AiToolLlmDefinition[];
  /** Full Orchestrator result for this turn — coordination only, never UI. */
  orchestration?: AiOrchestratorResult;
  /** Integration pipeline trace + observability — workspace and everywhere share this. */
  pipeline?: {
    trace: AiPipelineTrace;
    observability: AiPipelineObservability;
    hostExecutionPlan: AiHostExecutionPlan | null;
    memoryHitCount: number;
    workspaceModuleId: string | null;
  };
};
