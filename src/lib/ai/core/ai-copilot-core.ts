import { AI_FOUNDATION_VERSION } from "@/lib/ai/constants";
import { AiContextEngine } from "@/lib/ai/context/ai-context-engine";
import { AiKnowledgeEngine } from "@/lib/ai/knowledge/ai-knowledge-engine";
import { AiActionRegistry } from "@/lib/ai/actions/ai-action-registry";
import { AiConversationManager } from "@/lib/ai/conversation/ai-conversation-manager";
import { AiPlanner } from "@/lib/ai/planner/ai-planner";
import { AiPromptBuilder } from "@/lib/ai/prompts/ai-prompt-builder";
import { evaluateAiPermission } from "@/lib/ai/permissions/ai-permission-layer";
import { NullAiProvider } from "@/lib/ai/providers/null-provider";
import { LlmPlatform } from "@/lib/ai/providers/llm-platform";
import { AiCopilotPanelContractImpl } from "@/lib/ai/ui/contracts";
import {
  AiSkillRegistry,
  AiSkillResolver,
  AiSkillExecutor,
  createPopulatedAiSkillRegistry,
} from "@/lib/ai/skills";
import type { AiProvider } from "@/lib/ai/types/provider";
import type { AiContextCollectionInput } from "@/lib/ai/types/context";
import type { AiCopilotTurnPreview, AiCopilotTurnRequest } from "@/lib/ai/types/ui";
import type { AiActionRequest, AiActionResult } from "@/lib/ai/types/actions";
import type {
  AiSkillExecuteRequest,
  AiSkillExecuteResult,
  AiSkillResolveRequest,
  AiSkillResolveResult,
  AiSkillResult,
} from "@/lib/ai/skills/contracts/types";

export type AiCopilotCoreDeps = {
  contextEngine?: AiContextEngine;
  knowledgeEngine?: AiKnowledgeEngine;
  actionRegistry?: AiActionRegistry;
  conversationManager?: AiConversationManager;
  planner?: AiPlanner;
  promptBuilder?: AiPromptBuilder;
  provider?: AiProvider;
  llmPlatform?: LlmPlatform;
  skillRegistry?: AiSkillRegistry;
  skillResolver?: AiSkillResolver;
  skillExecutor?: AiSkillExecutor;
  panelContract?: AiCopilotPanelContractImpl;
};

/**
 * AI Copilot Core — orchestrates the enterprise foundation + Skills Engine.
 * No LLM vendor calls. Skills return structured objects only.
 */
export class AiCopilotCore {
  readonly version = AI_FOUNDATION_VERSION;
  readonly contextEngine: AiContextEngine;
  readonly knowledgeEngine: AiKnowledgeEngine;
  readonly actionRegistry: AiActionRegistry;
  readonly conversationManager: AiConversationManager;
  readonly planner: AiPlanner;
  readonly promptBuilder: AiPromptBuilder;
  readonly provider: AiProvider;
  readonly llmPlatform: LlmPlatform;
  readonly skillRegistry: AiSkillRegistry;
  readonly skillResolver: AiSkillResolver;
  readonly skillExecutor: AiSkillExecutor;
  readonly panelContract: AiCopilotPanelContractImpl;

  constructor(deps: AiCopilotCoreDeps = {}) {
    this.contextEngine = deps.contextEngine ?? new AiContextEngine();
    this.knowledgeEngine = deps.knowledgeEngine ?? new AiKnowledgeEngine();
    this.actionRegistry = deps.actionRegistry ?? new AiActionRegistry();
    this.conversationManager = deps.conversationManager ?? new AiConversationManager();
    this.planner = deps.planner ?? new AiPlanner();
    this.promptBuilder = deps.promptBuilder ?? new AiPromptBuilder();
    this.provider = deps.provider ?? new NullAiProvider();
    this.llmPlatform = deps.llmPlatform ?? new LlmPlatform();
    this.skillRegistry = deps.skillRegistry ?? createPopulatedAiSkillRegistry();
    this.skillResolver =
      deps.skillResolver ?? new AiSkillResolver(this.skillRegistry);
    this.skillExecutor =
      deps.skillExecutor ?? new AiSkillExecutor(this.skillRegistry, this.knowledgeEngine);
    this.panelContract = deps.panelContract ?? new AiCopilotPanelContractImpl();
  }

  /**
   * Builds a governed turn preview: context → plan → skill resolve → prompt.
   * Does not call an LLM. Does not execute actions.
   */
  previewTurn(
    contextInput: AiContextCollectionInput,
    request: AiCopilotTurnRequest,
  ): AiCopilotTurnPreview {
    const context = this.contextEngine.collect(contextInput);
    const session = this.conversationManager.ensureSession(context);
    this.conversationManager.append({ role: "user", content: request.utterance });

    const modules = this.knowledgeEngine.listModules();
    const planner = this.planner.plan({
      utterance: request.utterance,
      context,
      availableModules: modules,
      availableActionIds: this.actionRegistry.listIds(),
    });

    const skillResolution = this.skillResolver.resolve({
      context,
      utterance: request.utterance,
      planner,
      limit: 5,
    });

    let skillResult: AiSkillResult | null = null;
    if (skillResolution.selected) {
      const executed = this.skillExecutor.execute({
        skillId: skillResolution.selected.skill.id,
        context,
        utterance: request.utterance,
        planner,
      });
      if (executed.ok) {
        skillResult = executed.result;
      }
    }

    const relevantKnowledge = planner.targetModuleId
      ? modules.filter(
          (module) =>
            module.id === planner.targetModuleId ||
            module.relatedModules.includes(planner.targetModuleId as (typeof module.relatedModules)[number]),
        )
      : modules.filter((module) => module.id === context.moduleId).concat(modules.slice(0, 3));

    const prompt = this.promptBuilder.build({
      userUtterance: request.utterance,
      context,
      knowledge: relevantKnowledge.length > 0 ? relevantKnowledge : modules.slice(0, 5),
      conversation: session.messages,
      memory: this.conversationManager.getMemory().list(),
      planner,
      skillContext: skillResult?.structuredContext ?? null,
    });

    return {
      planner,
      prompt,
      providerAvailable: this.provider.getCapability().configured,
      skillResolution,
      skillResult,
    };
  }

  resolveSkills(request: AiSkillResolveRequest): AiSkillResolveResult {
    return this.skillResolver.resolve(request);
  }

  executeSkill(request: AiSkillExecuteRequest): AiSkillExecuteResult {
    return this.skillExecutor.execute(request);
  }

  dispatchAction(request: AiActionRequest): AiActionResult {
    return this.actionRegistry.execute(request);
  }

  evaluatePermission = evaluateAiPermission;
}
