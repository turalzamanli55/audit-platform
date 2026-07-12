import { createAiId } from "@/lib/ai/utils/id";
import type { AiConversationMessage } from "@/lib/ai/types/conversation";
import type { AiMemoryEntry } from "@/lib/ai/types/memory";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";
import type { AiPromptObject } from "@/lib/ai/types/prompts";
import { AiOrchestratorIntentAnalyzer } from "@/lib/ai/orchestrator/intent";
import { AiOrchestratorStrategySelector } from "@/lib/ai/orchestrator/strategy";
import { AiOrchestratorExecutionPlanner } from "@/lib/ai/orchestrator/planner";
import { AiOrchestratorStateMachine } from "@/lib/ai/orchestrator/state";
import { AiOrchestratorPipeline } from "@/lib/ai/orchestrator/pipeline";
import { AiOrchestratorContextBuilder } from "@/lib/ai/orchestrator/context";
import { AiOrchestratorExecutionBinder } from "@/lib/ai/orchestrator/execution";
import type { AiOrchestratorExecutionDeps } from "@/lib/ai/orchestrator/execution";
import { AiOrchestratorHistoryStore } from "@/lib/ai/orchestrator/history";
import { AiOrchestratorTelemetry } from "@/lib/ai/orchestrator/telemetry";
import { buildOrchestratorResult, mapOrchestratorFailure } from "@/lib/ai/orchestrator/results";
import { createOrchestratorError, cloneStep } from "@/lib/ai/orchestrator/utils";
import {
  AI_ORCHESTRATOR_VERSION,
  type AiOrchestratorRequest,
  type AiOrchestratorResult,
  type AiOrchestratorRuntimeSnapshot,
  type AiOrchestratorLlmInvocation,
} from "@/lib/ai/orchestrator/types";

export type AiOrchestratorEngineDeps = AiOrchestratorExecutionDeps & {
  conversation?: AiConversationMessage[];
  memory?: AiMemoryEntry[];
};

/**
 * Enterprise AI Orchestrator Engine — brain of the AI platform.
 * Coordinates Planner, Skills, Knowledge Graph, Tool Runtime, Prompt Builder, LLM Platform.
 * Contains no business logic.
 */
export class AiOrchestratorEngine {
  readonly version = AI_ORCHESTRATOR_VERSION;
  readonly intentAnalyzer = new AiOrchestratorIntentAnalyzer();
  readonly strategies = new AiOrchestratorStrategySelector();
  readonly executionPlanner = new AiOrchestratorExecutionPlanner();
  readonly pipeline = new AiOrchestratorPipeline();
  readonly contextBuilder = new AiOrchestratorContextBuilder();
  readonly history = new AiOrchestratorHistoryStore();
  readonly telemetry = new AiOrchestratorTelemetry();

  private readonly binder: AiOrchestratorExecutionBinder;
  private readonly defaultConversation: AiConversationMessage[];
  private readonly defaultMemory: AiMemoryEntry[];
  private lastSnapshot: AiOrchestratorRuntimeSnapshot | null = null;

  constructor(private readonly deps: AiOrchestratorEngineDeps) {
    this.binder = new AiOrchestratorExecutionBinder(deps);
    this.defaultConversation = deps.conversation ?? [];
    this.defaultMemory = deps.memory ?? [];
  }

  snapshot(): AiOrchestratorRuntimeSnapshot | null {
    return this.lastSnapshot;
  }

  telemetrySnapshot() {
    return this.telemetry.snapshot();
  }

  /**
   * Analyze → plan → resolve skills/knowledge/tools → build prompt → defer LLM → collect.
   */
  run(request: AiOrchestratorRequest): AiOrchestratorResult {
    const startedMs = Date.now();
    const executionId = createAiId("orch_exec");
    const machine = new AiOrchestratorStateMachine();
    const now = () => new Date().toISOString();

    this.lastSnapshot = {
      executionId,
      state: machine.current,
      plan: null,
      currentStepId: null,
      startedAt: now(),
      updatedAt: now(),
    };

    try {
      let planner: AiPlannerDecision | null = request.planner ?? null;
      if (!planner) {
        const modules = this.deps.knowledgeEngine.listModules();
        planner = this.deps.planner.plan({
          utterance: request.utterance,
          context: request.context,
          availableModules: modules,
          availableActionIds: [],
        });
      }

      const intent = this.intentAnalyzer.analyze({
        utterance: request.utterance,
        context: request.context,
        planner,
      });

      const strategy = this.strategies.resolve(intent, request.strategy);
      const planning = machine.transition("planning");
      if (!planning.ok) {
        return this.failEarly({
          executionId,
          machine,
          intent,
          strategyId: strategy.id,
          startedMs,
          error: planning.error,
          request,
        });
      }
      this.touch(executionId, machine.current, null, null);

      const plan = this.executionPlanner.build({
        utterance: request.utterance,
        intent,
        strategy,
        planner,
        maxRetries: request.maxRetries ?? 1,
      });
      this.touch(executionId, machine.current, plan, null);

      if (request.planOnly) {
        machine.force("completed");
        const result = buildOrchestratorResult({
          executionId,
          state: "completed",
          success: true,
          summary: "Execution plan created (plan-only mode).",
          intent,
          strategy: strategy.id,
          plan,
          steps: plan.steps.map(cloneStep),
          skillResolution: null,
          skillResult: null,
          knowledgeRetrieval: null,
          knowledgeGraphContext: null,
          toolResolution: null,
          availableTools: [],
          prompt: null,
          llmInvocation: {
            status: "skipped",
            reason: "Plan-only mode — LLM not invoked.",
            providerInvoked: false,
          },
          usage: {
            skills: [],
            knowledgeNodeIds: [],
            tools: [],
            stepsExecuted: 0,
            stepsSkipped: 0,
            retries: 0,
          },
          warnings: ["plan_only"],
          errors: [],
          durationMs: Date.now() - startedMs,
        });
        this.history.record(request, result);
        this.telemetry.observe(result);
        this.touch(executionId, machine.current, plan, null);
        return result;
      }

      const resolving = machine.transition("resolving");
      if (!resolving.ok) {
        return this.failEarly({
          executionId,
          machine,
          intent,
          strategyId: strategy.id,
          startedMs,
          error: resolving.error,
          request,
          plan,
        });
      }

      const ctx = this.contextBuilder.createEmpty({
        utterance: request.utterance,
        runtime: request.context,
        planner,
        conversation: request.conversation ?? this.defaultConversation,
        memory: request.memory ?? this.defaultMemory,
      });
      ctx.intent = intent;
      ctx.strategy = strategy.id;

      const executing = machine.transition("executing");
      if (!executing.ok) {
        return this.failEarly({
          executionId,
          machine,
          intent,
          strategyId: strategy.id,
          startedMs,
          error: executing.error,
          request,
          plan,
        });
      }

      const steps = plan.steps.map(cloneStep);
      const handler = this.binder.createHandler({ ctx, strategy });

      const pipelineResult = this.pipeline.run(steps, (step) => {
        this.touch(executionId, machine.current, plan, step.id);
        const outcome = handler(step);
        if (outcome.status === "succeeded" || outcome.status === "skipped") {
          // Merge outputs into context as steps complete for downstream handlers.
          step.output = outcome.output ?? null;
          this.contextBuilder.recordStepOutput(ctx, step);
          if (step.kind === "merge_context" && outcome.status === "succeeded") {
            step.output = this.contextBuilder.mergeModuleSweep(ctx);
            outcome.output = step.output;
          }
        }
        return outcome;
      }, {
        cancelRequested: request.cancelRequested === true,
      });

      if (pipelineResult.cancelled) {
        machine.force("cancelled");
      } else if (pipelineResult.steps.some((s) => s.status === "failed")) {
        machine.force("failed");
      } else {
        machine.force("completed");
      }

      const promptOutput = pipelineResult.steps.find((s) => s.kind === "build_prompt")?.output;
      const prompt =
        promptOutput && typeof promptOutput === "object" && "prompt" in promptOutput
          ? (promptOutput.prompt as AiPromptObject)
          : null;

      const llmStepOutput = pipelineResult.steps.find((s) => s.kind === "invoke_llm")?.output;
      const llmInvocation: AiOrchestratorLlmInvocation =
        llmStepOutput &&
        typeof llmStepOutput === "object" &&
        "llmInvocation" in llmStepOutput
          ? (llmStepOutput.llmInvocation as AiOrchestratorLlmInvocation)
          : {
              status: "deferred",
              reason: "LLM Platform invocation is reserved for later wiring.",
              providerInvoked: false,
            };

      const errors = pipelineResult.steps
        .filter((s) => s.error)
        .map((s) => s.error!);

      const usage = {
        skills: ctx.skillResult?.skillId
          ? [ctx.skillResult.skillId]
          : ctx.skillResolution?.selected
            ? [ctx.skillResolution.selected.skill.id]
            : [],
        knowledgeNodeIds: ctx.knowledgeRetrieval?.hits.map((hit) => hit.node.id) ?? [],
        tools: ctx.toolResolution?.selected
          ? [ctx.toolResolution.selected.tool.id]
          : [],
        stepsExecuted: pipelineResult.steps.filter((s) => s.status === "succeeded").length,
        stepsSkipped: pipelineResult.steps.filter((s) => s.status === "skipped").length,
        retries: pipelineResult.retries,
      };

      const success = machine.current === "completed";
      const result = buildOrchestratorResult({
        executionId,
        state: machine.current,
        success,
        summary: success
          ? `Orchestration completed via ${strategy.id} strategy (${intent.primary}).`
          : `Orchestration ${machine.current}.`,
        intent,
        strategy: strategy.id,
        plan: { ...plan, steps: pipelineResult.steps },
        steps: pipelineResult.steps,
        skillResolution: ctx.skillResolution,
        skillResult: ctx.skillResult,
        knowledgeRetrieval: ctx.knowledgeRetrieval,
        knowledgeGraphContext: ctx.knowledgeGraphContext,
        toolResolution: ctx.toolResolution,
        availableTools: ctx.availableTools,
        prompt,
        llmInvocation,
        usage,
        warnings: success ? [] : ["orchestration_incomplete"],
        errors,
        durationMs: Date.now() - startedMs,
      });

      this.history.record(request, result);
      this.telemetry.observe(result);
      this.touch(executionId, machine.current, result.plan, null);
      return result;
    } catch (error) {
      machine.force("failed");
      const fallbackIntent = {
        primary: "question" as const,
        secondary: [],
        confidence: 0,
        rationale: "Orchestrator caught unexpected failure.",
        signals: ["exception"],
        mixed: false,
      };
      const emptyPlan = this.executionPlanner.build({
        utterance: request.utterance,
        intent: fallbackIntent,
        strategy: this.strategies.profile("simple"),
        planner: null,
        maxRetries: 0,
      });
      const result = mapOrchestratorFailure({
        executionId,
        state: "failed",
        summary: "Orchestrator returned a structured failure.",
        intent: fallbackIntent,
        strategy: "simple",
        plan: emptyPlan,
        steps: emptyPlan.steps,
        errors: [
          createOrchestratorError(
            "orchestrator_exception",
            error instanceof Error ? error.message : "Unknown orchestrator failure.",
          ),
        ],
        durationMs: Date.now() - startedMs,
      });
      this.history.record(request, result);
      this.telemetry.observe(result);
      return result;
    }
  }

  private touch(
    executionId: string,
    state: AiOrchestratorRuntimeSnapshot["state"],
    plan: AiOrchestratorRuntimeSnapshot["plan"],
    currentStepId: string | null,
  ): void {
    this.lastSnapshot = {
      executionId,
      state,
      plan,
      currentStepId,
      startedAt: this.lastSnapshot?.startedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private failEarly(input: {
    executionId: string;
    machine: AiOrchestratorStateMachine;
    intent: AiOrchestratorResult["intent"];
    strategyId: AiOrchestratorResult["strategy"];
    startedMs: number;
    error: ReturnType<typeof createOrchestratorError>;
    request: AiOrchestratorRequest;
    plan?: AiOrchestratorResult["plan"];
  }): AiOrchestratorResult {
    input.machine.force("failed");
    const plan =
      input.plan ??
      this.executionPlanner.build({
        utterance: input.request.utterance,
        intent: input.intent,
        strategy: this.strategies.profile(input.strategyId),
        planner: input.request.planner ?? null,
        maxRetries: 0,
      });
    const result = mapOrchestratorFailure({
      executionId: input.executionId,
      state: "failed",
      summary: input.error.message,
      intent: input.intent,
      strategy: input.strategyId,
      plan,
      steps: plan.steps,
      errors: [input.error],
      durationMs: Date.now() - input.startedMs,
    });
    this.history.record(input.request, result);
    this.telemetry.observe(result);
    this.touch(input.executionId, "failed", plan, null);
    return result;
  }
}

export function bootstrapAiOrchestrator(
  deps: AiOrchestratorEngineDeps,
): AiOrchestratorEngine {
  return new AiOrchestratorEngine(deps);
}
