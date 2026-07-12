import type { AiCopilotCore } from "@/lib/ai/core/ai-copilot-core";
import type { EnterpriseMemoryEngine } from "@/lib/ai/memory-engine/engine";
import type { AiHostExecutionRuntime } from "@/lib/ai/host/runtime";
import { resolveModuleContext } from "@/lib/ai/context-resolvers";
import {
  detectHostMutationOperation,
  isHostMutationSuggestion,
  resolveEntityTypeForModule,
  resolveSuggestedServerActionId,
} from "@/lib/ai/host/utils/mutation-suggest";
import type {
  AiPipelineDebugSnapshot,
  AiPipelineRequest,
  AiPipelineResult,
  AiPipelineStreamMetadata,
} from "@/lib/ai/pipeline/types";
import { AiPipelineTelemetry } from "@/lib/ai/pipeline/telemetry";
import type { AiCopilotTurnPreview } from "@/lib/ai/types/ui";
import type { AiHostExecutionPlan } from "@/lib/ai/host/types";
import { tokenEstimate } from "@/lib/ai/memory-engine/utils";

export type AiIntegrationPipelineDeps = {
  core: AiCopilotCore;
  memoryEngine: EnterpriseMemoryEngine;
  hostRuntime: AiHostExecutionRuntime;
};

/**
 * Enterprise AI Integration Pipeline — wires existing layers into one production flow.
 */
export class AiIntegrationPipeline {
  constructor(private readonly deps: AiIntegrationPipelineDeps) {}

  execute(request: AiPipelineRequest): AiPipelineResult {
    const telemetry = new AiPipelineTelemetry();
    const surface = request.surface ?? "workspace";
    const { core, memoryEngine, hostRuntime } = this.deps;

    telemetry.begin("conversation");
    const context = core.contextEngine.collect(request.contextInput);
    const session = core.conversationManager.ensureSession(context);
    core.conversationManager.append({ role: "user", content: request.utterance });
    memoryEngine.captureWorkspaceContext(context);
    telemetry.end("conversation", { conversationId: session.conversationId });

    telemetry.begin("memory_resolver");
    const memoryContext = memoryEngine.resolve({
      context,
      conversationId: request.conversationId ?? session.conversationId,
      moduleId: context.moduleId ?? undefined,
      limit: 48,
    });
    telemetry.end("memory_resolver", { hitCount: memoryContext.entries.length });

    telemetry.begin("memory_ranking");
    const promptMemory = memoryEngine.toPromptMemory({
      context,
      conversationId: request.conversationId ?? session.conversationId,
      moduleId: context.moduleId ?? undefined,
    });
    telemetry.end("memory_ranking", { hitCount: memoryContext.entries.length });

    telemetry.begin("context_resolver");
    const workspaceResolution = resolveModuleContext({
      context,
      selectedObjectType: context.selectedObjectType,
      selectedObjectId: context.selectedObjectId,
    });
    telemetry.end("context_resolver", { moduleId: workspaceResolution.moduleId });

    telemetry.begin("planner");
    const modules = core.knowledgeEngine.listModules();
    const planner = core.planner.plan({
      utterance: request.utterance,
      context,
      availableModules: modules,
      availableActionIds: core.actionRegistry.listIds(),
    });
    telemetry.end("planner", { intent: planner.intent, confidence: planner.confidence });

    telemetry.begin("orchestrator");
    const orchestration = core.orchestrator.run({
      utterance: request.utterance,
      context,
      planner,
      conversationId: session.conversationId,
      sessionId: session.conversationId,
      userId: context.userId,
      conversation: session.messages,
      memory: promptMemory,
      memoryContext,
      workspaceResolution,
    });
    telemetry.end("orchestrator", {
      success: orchestration.success,
      stepCount: orchestration.steps.length,
    });

    telemetry.begin("skill_resolver");
    telemetry.end("skill_resolver", {
      selectedSkillId: orchestration.skillResolution?.selected?.skill.id ?? null,
      candidateCount: orchestration.skillResolution?.matches.length ?? 0,
    });

    telemetry.begin("knowledge_graph");
    telemetry.end("knowledge_graph", {
      hitCount: orchestration.knowledgeRetrieval?.hits.length ?? 0,
      citationCount: orchestration.knowledgeGraphContext?.citations.length ?? 0,
    });

    telemetry.begin("tool_resolver");
    telemetry.end("tool_resolver", {
      selectedToolId: orchestration.toolResolution?.selected?.tool.id ?? null,
      candidateCount: orchestration.toolResolution?.matches.length ?? 0,
    });

    telemetry.begin("host_planner");
    const hostExecutionPlan = this.planHostExecution({
      hostRuntime,
      context,
      utterance: request.utterance,
      plannerIntent: planner.intent,
      toolId: orchestration.toolResolution?.selected?.tool.id ?? null,
      memoryContext,
      knowledgeCitationIds:
        orchestration.knowledgeGraphContext?.citations.map((citation) => citation.nodeId) ?? [],
    });
    telemetry.end("host_planner", {
      planned: Boolean(hostExecutionPlan),
      planId: hostExecutionPlan?.id ?? null,
    });

    telemetry.begin("prompt_builder");
    const prompt =
      orchestration.prompt ??
      core.promptBuilder.build({
        userUtterance: request.utterance,
        context,
        knowledge: modules.slice(0, 5),
        conversation: session.messages,
        memory: promptMemory,
        planner,
        skillContext: orchestration.skillResult?.structuredContext ?? null,
        knowledgeGraphContext: orchestration.knowledgeGraphContext,
        availableTools: orchestration.availableTools,
        workspaceContext: workspaceResolution,
        memoryContext,
        tools: orchestration.toolResolution?.matches.map((match) => match.tool.id) ?? [],
      });
    const promptSize = tokenEstimate(JSON.stringify(prompt));
    telemetry.setPromptTokenEstimate(promptSize);
    telemetry.end("prompt_builder", { promptSize });

    telemetry.begin("llm_platform");
    const defaultProvider = core.llmPlatform.defaultProvider();
    telemetry.setProvider(defaultProvider.id === "none" ? null : defaultProvider.id);
    telemetry.skip("llm_platform", "Deferred to server stream endpoint.");
    telemetry.end("llm_platform", { provider: defaultProvider.id, deferred: true });

    telemetry.begin("structured_response");
    const trace = telemetry.buildTrace(surface);
    const observability = telemetry.snapshot();
    const preview: AiCopilotTurnPreview = {
      planner: orchestration.plan.planner ?? planner,
      prompt,
      providerAvailable: core.provider.getCapability().configured || defaultProvider.id !== "none",
      skillResolution: orchestration.skillResolution ?? undefined,
      skillResult: orchestration.skillResult,
      knowledgeRetrieval: orchestration.knowledgeRetrieval ?? undefined,
      knowledgeGraphContext: orchestration.knowledgeGraphContext,
      toolResolution: orchestration.toolResolution ?? undefined,
      availableTools: orchestration.availableTools,
      orchestration,
      pipeline: {
        trace,
        observability,
        hostExecutionPlan,
        memoryHitCount: memoryContext.entries.length,
        workspaceModuleId: workspaceResolution.moduleId,
      },
    };
    telemetry.end("structured_response", { success: orchestration.success });

    if (request.ingestLearning !== false && orchestration.success) {
      memoryEngine.ingestLearningSignal(
        context,
        {
          kind: "repeated_prompt",
          key: `prompt:${planner.intent}`,
          value: request.utterance.slice(0, 200),
          confidence: 0.55,
          moduleId: context.moduleId ?? undefined,
        },
        session.conversationId,
      );
    }

    const streamMetadata: AiPipelineStreamMetadata = {
      citations:
        orchestration.knowledgeGraphContext?.citations.map((citation) => ({
          id: citation.nodeId,
          title: citation.title,
          path: citation.documentReference ?? undefined,
        })) ?? [],
      knowledgeReferences:
        orchestration.knowledgeRetrieval?.hits.map((hit) => ({
          id: hit.node.id,
          title: hit.node.title,
        })) ?? [],
      toolPlans:
        orchestration.toolResolution?.matches.slice(0, 5).map((match) => ({
          toolId: match.tool.id,
          summary: match.tool.description,
        })) ?? [],
      hostExecutionPlanId: hostExecutionPlan?.id ?? null,
      traceExecutionId: trace.executionId,
    };

    const debug: AiPipelineDebugSnapshot | undefined = request.debug
      ? {
          pipeline: trace.steps.map((step) => step.stepId),
          memoryHits: memoryContext.entries.length,
          knowledgeHits: orchestration.knowledgeRetrieval?.hits.length ?? 0,
          selectedSkills: orchestration.skillResolution?.matches.map((m) => m.skill.id) ?? [],
          selectedTools: orchestration.toolResolution?.matches.map((m) => m.tool.id) ?? [],
          promptSize,
          provider: observability.provider,
          latencyMs: observability.pipelineLatencyMs,
        }
      : undefined;

    return {
      preview,
      trace,
      observability,
      memoryContext,
      workspaceResolution,
      hostExecutionPlan,
      streamMetadata,
      debug,
    };
  }

  private planHostExecution(input: {
    hostRuntime: AiHostExecutionRuntime;
    context: ReturnType<AiCopilotCore["contextEngine"]["collect"]>;
    utterance: string;
    plannerIntent: string;
    toolId: string | null;
    memoryContext: ReturnType<EnterpriseMemoryEngine["resolve"]>;
    knowledgeCitationIds: string[];
  }): AiHostExecutionPlan | null {
    if (
      !isHostMutationSuggestion({
        utterance: input.utterance,
        plannerIntent: input.plannerIntent,
      })
    ) {
      return null;
    }
    const operation = detectHostMutationOperation(input.utterance);
    if (!operation) return null;
    const entityType = resolveEntityTypeForModule(input.context.moduleId);
    const serverActionId = resolveSuggestedServerActionId({
      moduleId: input.context.moduleId,
      operation,
      entityType,
    });
    if (!serverActionId) return null;

    const planned = input.hostRuntime.createPlan({
      context: input.context,
      serverActionId,
      toolId: input.toolId ?? `tool.action.${operation === "delete" ? "archive" : operation}`,
      description: `Pipeline host plan for: ${input.utterance}`,
      payload: {
        entityType,
        entityId: input.context.selectedObjectId,
        pipelineMetadata: {
          memoryEntryIds: input.memoryContext.entries.map((entry) => entry.id),
          knowledgeCitationIds: input.knowledgeCitationIds,
        },
      },
      entityType,
      entityId: input.context.selectedObjectId,
      conversationId: null,
    });
    if (!planned.ok) return null;
    return planned.plan;
  }
}
