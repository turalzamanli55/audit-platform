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
import {
  KnowledgeGraphEngine,
  bootstrapKnowledgeGraphEngine,
} from "@/lib/ai/knowledge-graph";
import { AiToolRuntime, bootstrapAiToolRuntime } from "@/lib/ai/tools";
import {
  AiOrchestratorEngine,
  bootstrapAiOrchestrator,
  type AiOrchestratorRequest,
  type AiOrchestratorResult,
} from "@/lib/ai/orchestrator";
import {
  AiIntegrationPipeline,
  type AiPipelineRequest,
  type AiPipelineResult,
} from "@/lib/ai/pipeline";
import {
  bootstrapEnterpriseMemoryEngine,
  type EnterpriseMemoryEngine,
} from "@/lib/ai/memory-engine/engine";
import {
  bootstrapAiHostExecutionRuntime,
  type AiHostExecutionRuntime,
} from "@/lib/ai/host/runtime";
import type { AiProvider } from "@/lib/ai/types/provider";
import type { AiContextCollectionInput } from "@/lib/ai/types/context";
import type { AiCopilotTurnPreview, AiCopilotTurnRequest } from "@/lib/ai/types/ui";
import type { AiActionRequest, AiActionResult } from "@/lib/ai/types/actions";
import type {
  AiSkillExecuteRequest,
  AiSkillExecuteResult,
  AiSkillResolveRequest,
  AiSkillResolveResult,
} from "@/lib/ai/skills/contracts/types";
import type {
  KgBuiltContext,
  KgRetrievalRequest,
  KgRetrievalResult,
} from "@/lib/ai/knowledge-graph/types";
import type {
  AiToolExecuteRequest,
  AiToolResolveRequest,
  AiToolResolveResult,
  AiToolResult,
} from "@/lib/ai/tools/types";

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
  knowledgeGraph?: KnowledgeGraphEngine;
  toolRuntime?: AiToolRuntime;
  orchestrator?: AiOrchestratorEngine;
  memoryEngine?: EnterpriseMemoryEngine;
  hostRuntime?: AiHostExecutionRuntime;
  integrationPipeline?: AiIntegrationPipeline;
  panelContract?: AiCopilotPanelContractImpl;
};

/**
 * AI Copilot Core — foundation + Skills + Knowledge Graph + Tool Runtime + Orchestrator.
 * Orchestrator coordinates pipelines; LLM never executes business logic.
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
  readonly knowledgeGraph: KnowledgeGraphEngine;
  readonly toolRuntime: AiToolRuntime;
  readonly orchestrator: AiOrchestratorEngine;
  readonly memoryEngine: EnterpriseMemoryEngine;
  readonly hostRuntime: AiHostExecutionRuntime;
  readonly integrationPipeline: AiIntegrationPipeline;
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
    this.knowledgeGraph = deps.knowledgeGraph ?? bootstrapKnowledgeGraphEngine();
    this.toolRuntime = deps.toolRuntime ?? bootstrapAiToolRuntime();
    this.orchestrator =
      deps.orchestrator ??
      bootstrapAiOrchestrator({
        planner: this.planner,
        promptBuilder: this.promptBuilder,
        knowledgeEngine: this.knowledgeEngine,
        skillResolver: this.skillResolver,
        skillExecutor: this.skillExecutor,
        knowledgeGraph: this.knowledgeGraph,
        toolRuntime: this.toolRuntime,
        llmPlatform: this.llmPlatform,
      });
    this.memoryEngine = deps.memoryEngine ?? bootstrapEnterpriseMemoryEngine();
    this.hostRuntime = deps.hostRuntime ?? bootstrapAiHostExecutionRuntime();
    this.integrationPipeline =
      deps.integrationPipeline ??
      new AiIntegrationPipeline({
        core: this,
        memoryEngine: this.memoryEngine,
        hostRuntime: this.hostRuntime,
      });
    this.panelContract = deps.panelContract ?? new AiCopilotPanelContractImpl();
  }

  /**
   * Production integration pipeline — shared by AI Workspace and AI Everywhere.
   */
  runPipeline(request: AiPipelineRequest): AiPipelineResult {
    return this.integrationPipeline.execute(request);
  }

  /**
   * Governed turn preview via Integration Pipeline (backward-compatible wrapper).
   */
  previewTurn(
    contextInput: AiContextCollectionInput,
    request: AiCopilotTurnRequest,
  ): AiCopilotTurnPreview {
    const result = this.runPipeline({
      utterance: request.utterance,
      contextInput,
      surface: "workspace",
    });
    return result.preview;
  }

  orchestrate(request: AiOrchestratorRequest): AiOrchestratorResult {
    return this.orchestrator.run(request);
  }

  resolveSkills(request: AiSkillResolveRequest): AiSkillResolveResult {
    return this.skillResolver.resolve(request);
  }

  executeSkill(request: AiSkillExecuteRequest): AiSkillExecuteResult {
    return this.skillExecutor.execute(request);
  }

  resolveTools(request: AiToolResolveRequest): AiToolResolveResult {
    return this.toolRuntime.resolve(request);
  }

  executeTool(request: AiToolExecuteRequest): AiToolResult {
    return this.toolRuntime.execute(request);
  }

  retrieveKnowledge(request: KgRetrievalRequest): KgRetrievalResult {
    return this.knowledgeGraph.retrieve(request);
  }

  buildKnowledgeContext(request: KgRetrievalRequest): KgBuiltContext {
    return this.knowledgeGraph.buildContext(request);
  }

  dispatchAction(request: AiActionRequest): AiActionResult {
    return this.actionRegistry.execute(request);
  }

  evaluatePermission = evaluateAiPermission;
}
