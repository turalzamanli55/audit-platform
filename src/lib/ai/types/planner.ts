import type { AiPlannerIntent } from "@/lib/ai/constants";
import type { AiActionKind } from "@/lib/ai/constants";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiModuleKnowledge } from "@/lib/ai/types/knowledge";

export type AiPlannerInput = {
  utterance: string;
  context: AiRuntimeContext;
  availableModules: AiModuleKnowledge[];
  availableActionIds: string[];
};

export type AiPlannerDecision = {
  intent: AiPlannerIntent;
  confidence: number;
  rationale: string;
  /** Suggested registered action id when intent requires one. */
  suggestedActionId: string | null;
  suggestedActionKind: AiActionKind | null;
  suggestedPayload: Record<string, unknown>;
  targetModuleId: string | null;
};
