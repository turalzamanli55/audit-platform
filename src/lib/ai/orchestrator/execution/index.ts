import type { AiPlanner } from "@/lib/ai/planner/ai-planner";
import type { AiPromptBuilder } from "@/lib/ai/prompts/ai-prompt-builder";
import type { AiKnowledgeEngine } from "@/lib/ai/knowledge/ai-knowledge-engine";
import type { AiSkillResolver, AiSkillExecutor } from "@/lib/ai/skills";
import type { KnowledgeGraphEngine } from "@/lib/ai/knowledge-graph";
import type { AiToolRuntime } from "@/lib/ai/tools";
import type { LlmPlatform } from "@/lib/ai/providers/llm-platform";
import type { AiOrchestratorStep } from "@/lib/ai/orchestrator/types";
import type { AiOrchestratorBuiltContext } from "@/lib/ai/orchestrator/context";
import type { AiOrchestratorStrategyProfile } from "@/lib/ai/orchestrator/strategy";
import { createOrchestratorError } from "@/lib/ai/orchestrator/utils";
import type { PipelineStepHandler } from "@/lib/ai/orchestrator/pipeline";

export type AiOrchestratorExecutionDeps = {
  planner: AiPlanner;
  promptBuilder: AiPromptBuilder;
  knowledgeEngine: AiKnowledgeEngine;
  skillResolver: AiSkillResolver;
  skillExecutor: AiSkillExecutor;
  knowledgeGraph: KnowledgeGraphEngine;
  toolRuntime: AiToolRuntime;
  llmPlatform: LlmPlatform;
};

/**
 * Execution binders — invoke existing platform engines only.
 * Never repositories. Never server actions. Never vendor SDKs.
 */
export class AiOrchestratorExecutionBinder {
  constructor(private readonly deps: AiOrchestratorExecutionDeps) {}

  createHandler(input: {
    ctx: AiOrchestratorBuiltContext;
    strategy: AiOrchestratorStrategyProfile;
  }): PipelineStepHandler {
    const { ctx, strategy } = input;
    const deps = this.deps;

    return (step: AiOrchestratorStep) => {
      switch (step.kind) {
        case "analyze_intent": {
          return {
            status: "succeeded",
            output: {
              intent: ctx.intent,
              strategy: strategy.id,
            },
          };
        }
        case "load_module_context": {
          const moduleId = step.moduleId;
          if (!moduleId || moduleId === "*") {
            return {
              status: "failed",
              error: createOrchestratorError(
                "missing_module",
                "Module context step requires a module id.",
                { stepId: step.id },
              ),
            };
          }
          deps.knowledgeGraph.resolve(ctx.runtime);
          const retrieval = deps.knowledgeGraph.retrieve({
            query: step.knowledgeQuery ?? `${ctx.utterance} ${moduleId}`,
            context: ctx.runtime,
            limit: Math.min(8, strategy.maxKnowledgeLimit),
          });
          return {
            status: "succeeded",
            output: {
              moduleId,
              hitCount: retrieval.hits.length,
              nodeIds: retrieval.hits.slice(0, 8).map((hit) => hit.node.id),
              repositoryCall: null,
              serverAction: null,
            },
          };
        }
        case "merge_context": {
          return {
            status: "succeeded",
            output: {
              moduleCount: ctx.moduleSweepOutputs.length,
              modules: ctx.moduleSweepOutputs.map((entry) => entry.moduleId ?? null),
              merged: true,
            },
          };
        }
        case "resolve_skill": {
          const resolution = deps.skillResolver.resolve({
            context: ctx.runtime,
            utterance: ctx.utterance,
            planner: ctx.planner ?? undefined,
            limit: strategy.maxSkillLimit,
            memoryContext: ctx.memoryContext,
            knowledgeContext: ctx.knowledgeGraphContext,
            workspaceContext: ctx.workspaceResolution,
          });
          ctx.skillResolution = resolution;
          let skillResult = null;
          if (resolution.selected) {
            const executed = deps.skillExecutor.execute({
              skillId: resolution.selected.skill.id,
              context: ctx.runtime,
              utterance: ctx.utterance,
              planner: ctx.planner ?? undefined,
            });
            if (executed.ok) {
              skillResult = executed.result;
              ctx.skillResult = skillResult;
            }
          }
          return {
            status: "succeeded",
            output: {
              selectedSkillId: resolution.selected?.skill.id ?? null,
              candidateCount: resolution.matches.length,
              skillResultId: skillResult?.skillId ?? null,
            },
          };
        }
        case "resolve_knowledge": {
          deps.knowledgeGraph.resolve(ctx.runtime);
          const memoryKeywords =
            ctx.memoryContext?.entries.flatMap((entry) => entry.keywords).slice(0, 12) ?? [];
          const retrieval = deps.knowledgeGraph.retrieve({
            query: step.knowledgeQuery ?? ctx.utterance,
            context: ctx.runtime,
            limit: strategy.maxKnowledgeLimit,
            plannerIntent: ctx.planner?.intent ?? null,
            memoryKeywords,
            moduleIds: ctx.workspaceResolution?.moduleId
              ? [ctx.workspaceResolution.moduleId]
              : ctx.runtime.moduleId
                ? [ctx.runtime.moduleId]
                : undefined,
          });
          const built = deps.knowledgeGraph.buildContext({
            query: step.knowledgeQuery ?? ctx.utterance,
            context: ctx.runtime,
            limit: strategy.maxKnowledgeLimit,
            plannerIntent: ctx.planner?.intent ?? null,
            memoryKeywords,
            moduleIds: ctx.runtime.moduleId ? [ctx.runtime.moduleId] : undefined,
          });
          ctx.knowledgeRetrieval = retrieval;
          ctx.knowledgeGraphContext = built;
          return {
            status: "succeeded",
            output: {
              hitCount: retrieval.hits.length,
              nodeIds: retrieval.hits.map((hit) => hit.node.id),
            },
          };
        }
        case "resolve_tools": {
          const resolution = deps.toolRuntime.resolve({
            context: ctx.runtime,
            utterance: ctx.utterance,
            planner: ctx.planner ?? undefined,
            skillId: ctx.skillResolution?.selected?.skill.id ?? null,
            limit: strategy.maxToolLimit,
            knowledgeReferences:
              ctx.knowledgeGraphContext?.citations.map((citation) => citation.nodeId) ??
              ctx.knowledgeRetrieval?.hits.map((hit) => hit.node.id) ??
              [],
            memoryContext: ctx.memoryContext,
            workspaceContext: ctx.workspaceResolution,
          });
          ctx.toolResolution = resolution;
          ctx.availableTools = deps.toolRuntime.listLlmDefinitions();
          return {
            status: "succeeded",
            output: {
              selectedToolId: resolution.selected?.tool.id ?? null,
              candidateCount: resolution.matches.length,
              availableToolCount: ctx.availableTools.length,
              repositoryCall: null,
              serverAction: null,
            },
          };
        }
        case "build_prompt": {
          const modules = deps.knowledgeEngine.listModules();
          const relevant = ctx.planner?.targetModuleId
            ? modules.filter(
                (module) =>
                  module.id === ctx.planner?.targetModuleId ||
                  module.relatedModules.includes(
                    ctx.planner?.targetModuleId as (typeof module.relatedModules)[number],
                  ),
              )
            : modules.filter((module) => module.id === ctx.runtime.moduleId).concat(modules.slice(0, 3));
          ctx.moduleKnowledge =
            relevant.length > 0 ? relevant : modules.slice(0, 5);

          const prompt = deps.promptBuilder.build({
            userUtterance: ctx.utterance,
            context: ctx.runtime,
            knowledge: ctx.moduleKnowledge,
            conversation: ctx.conversation,
            memory: ctx.memory,
            planner: ctx.planner,
            skillContext: ctx.skillResult?.structuredContext ?? null,
            knowledgeGraphContext: ctx.knowledgeGraphContext,
            availableTools: ctx.availableTools,
            workspaceContext: ctx.workspaceResolution,
            memoryContext: ctx.memoryContext,
            tools: ctx.toolResolution?.matches.map((match) => match.tool.id) ?? [],
          });
          return {
            status: "succeeded",
            output: { prompt },
          };
        }
                case "invoke_llm": {
          const defaultProvider = deps.llmPlatform.defaultProvider();
          const configured = defaultProvider.id !== "none";
          return {
            status: "succeeded",
            output: {
              llmInvocation: {
                status: configured ? "deferred" : "deferred",
                reason: configured
                  ? `Provider "${defaultProvider.id}" is configured on LLM Platform. Live calls use platform server endpoints (never UI / business modules).`
                  : "LLM Platform default provider is not configured.",
                providerInvoked: false,
              },
            },
          };
        }
        case "collect_result": {
          return {
            status: "succeeded",
            output: {
              collected: true,
              skillId: ctx.skillResult?.skillId ?? null,
              toolId: ctx.toolResolution?.selected?.tool.id ?? null,
              hasPrompt: true,
            },
          };
        }
        default: {
          return {
            status: "failed",
            error: createOrchestratorError(
              "unknown_step_kind",
              `Unknown orchestration step kind.`,
              { stepId: step.id },
            ),
          };
        }
      }
    };
  }
}
