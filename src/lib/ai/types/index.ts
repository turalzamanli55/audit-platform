export type { AiLocale, AiThemeMode, AiDeviceClass, AiRuntimeContext, AiContextCollectionInput } from "@/lib/ai/types/context";
export type { AiModuleKnowledge, AiKnowledgeSnapshot } from "@/lib/ai/types/knowledge";
export type {
  AiActionPermissionRequirement,
  AiActionDefinition,
  AiActionRequest,
  AiActionInstruction,
  AiActionResult,
} from "@/lib/ai/types/actions";
export type {
  AiConversationMessageRole,
  AiConversationMessage,
  AiConversationSession,
  AiConversationAppendInput,
} from "@/lib/ai/types/conversation";
export type { AiMemoryEntry, AiSessionMemorySnapshot } from "@/lib/ai/types/memory";
export type { AiPlannerInput, AiPlannerDecision } from "@/lib/ai/types/planner";
export type { AiPromptObject, AiPromptBuilderInput } from "@/lib/ai/types/prompts";
export type { AiPermissionDecision, AiPermissionCheckInput } from "@/lib/ai/types/permissions";
export type {
  AiCopilotHostAdapter,
  AiCopilotPanelContract,
  AiCopilotTurnRequest,
  AiCopilotTurnPreview,
} from "@/lib/ai/types/ui";
export type {
  AiProviderId,
  AiProviderCapability,
  AiProviderCompletionRequest,
  AiProviderCompletionResult,
  AiProvider,
} from "@/lib/ai/types/provider";
