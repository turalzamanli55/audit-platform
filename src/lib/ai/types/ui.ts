import type { AiPromptObject } from "@/lib/ai/types/prompts";
import type { AiActionInstruction } from "@/lib/ai/types/actions";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";
import type { AiSkillResolveResult, AiSkillResult } from "@/lib/ai/skills/contracts/types";

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
};
