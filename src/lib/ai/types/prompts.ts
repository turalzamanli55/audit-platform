import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiModuleKnowledge } from "@/lib/ai/types/knowledge";
import type { AiConversationMessage } from "@/lib/ai/types/conversation";
import type { AiMemoryEntry } from "@/lib/ai/types/memory";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";

/**
 * Provider-agnostic prompt object.
 * No OpenAI / Claude / Gemini formatting.
 */
export type AiPromptObject = {
  version: string;
  systemDirectives: string[];
  professionalTone: string[];
  context: AiRuntimeContext;
  knowledge: AiModuleKnowledge[];
  conversation: AiConversationMessage[];
  memory: AiMemoryEntry[];
  permissions: {
    roleSlugs: string[];
    permissionCodes: string[];
    workspaceId: string | null;
    organizationId: string | null;
  };
  planner: AiPlannerDecision | null;
  /** Structured skill output context — never vendor prompt text. */
  skillContext: Record<string, unknown> | null;
  userUtterance: string;
  assembledAt: string;
};

export type AiPromptBuilderInput = {
  userUtterance: string;
  context: AiRuntimeContext;
  knowledge: AiModuleKnowledge[];
  conversation: AiConversationMessage[];
  memory: AiMemoryEntry[];
  planner?: AiPlannerDecision | null;
  skillContext?: Record<string, unknown> | null;
};
