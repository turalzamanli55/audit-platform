import { createAiId } from "@/lib/ai/utils/id";
import type { AiModuleId } from "@/lib/ai/constants";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";
import type { AiOrchestratorIntent, AiOrchestratorExecutionPlan } from "@/lib/ai/orchestrator/types";
import type { AiOrchestratorStrategyProfile } from "@/lib/ai/orchestrator/strategy";
import { AiOrchestratorStepFactory } from "@/lib/ai/orchestrator/steps";

/**
 * Step Planner — materializes ordered orchestration steps from a strategy profile.
 */
export class AiOrchestratorStepPlanner {
  private readonly factory = new AiOrchestratorStepFactory();

  plan(input: {
    utterance: string;
    intent: AiOrchestratorIntent;
    strategy: AiOrchestratorStrategyProfile;
    planner: AiPlannerDecision | null;
    maxRetries: number;
  }): AiOrchestratorExecutionPlan {
    const steps = [];
    let order = 1;
    const mode = input.strategy.pipelineMode;

    const intentStep = this.factory.create({
      order: order++,
      kind: "analyze_intent",
      description: "Confirm orchestration intent analysis.",
      expectedOutput: "intent",
      pipelineMode: "sequential",
      retryLimit: 0,
    });
    steps.push(intentStep);

    const moduleSteps = [];
    if (input.strategy.includeModuleSweep) {
      for (const moduleId of input.strategy.moduleSweep) {
        const step = this.factory.create({
          order: order++,
          kind: "load_module_context",
          description: `Resolve structured context signals for module ${moduleId}.`,
          dependencies: [intentStep.id],
          moduleId: moduleId as AiModuleId,
          knowledgeQuery: `${input.utterance} ${moduleId}`,
          expectedOutput: `module_context:${moduleId}`,
          pipelineMode: mode === "parallel" ? "parallel" : "sequential",
          retryLimit: input.maxRetries,
        });
        moduleSteps.push(step);
        steps.push(step);
      }
    }

    const mergeDeps =
      moduleSteps.length > 0 ? moduleSteps.map((s) => s.id) : [intentStep.id];

    const mergeStep =
      moduleSteps.length > 0
        ? this.factory.create({
            order: order++,
            kind: "merge_context",
            description: "Merge module context resolution outputs.",
            dependencies: mergeDeps,
            expectedOutput: "merged_context",
            pipelineMode: "sequential",
          })
        : null;
    if (mergeStep) steps.push(mergeStep);

    const resolveAnchor = mergeStep?.id ?? intentStep.id;

    const skillStep = this.factory.create({
      order: order++,
      kind: "resolve_skill",
      description: "Resolve Skills Engine candidates for this turn.",
      dependencies: [resolveAnchor],
      expectedOutput: "skill_resolution",
      pipelineMode: mode === "parallel" ? "parallel" : "sequential",
      retryLimit: input.maxRetries,
    });
    steps.push(skillStep);

    const knowledgeStep = this.factory.create({
      order: order++,
      kind: "resolve_knowledge",
      description: "Resolve Knowledge Graph retrieval and context.",
      dependencies: mode === "parallel" ? [resolveAnchor] : [skillStep.id],
      knowledgeQuery: input.utterance,
      expectedOutput: "knowledge_context",
      pipelineMode: mode === "parallel" ? "parallel" : "sequential",
      retryLimit: input.maxRetries,
    });
    steps.push(knowledgeStep);

    const toolsStep = this.factory.create({
      order: order++,
      kind: "resolve_tools",
      description: "Resolve Tool Runtime candidates (definitions only for LLM).",
      dependencies: mode === "parallel" ? [resolveAnchor] : [knowledgeStep.id],
      expectedOutput: "tool_resolution",
      pipelineMode: mode === "conditional" ? "conditional" : mode === "parallel" ? "parallel" : "sequential",
      retryLimit: input.maxRetries,
      conditionalOn:
        mode === "conditional"
          ? { stepId: skillStep.id, statusIn: ["succeeded", "skipped"] }
          : undefined,
    });
    steps.push(toolsStep);

    const promptDeps =
      mode === "parallel"
        ? [skillStep.id, knowledgeStep.id, toolsStep.id]
        : [toolsStep.id];

    const promptStep = this.factory.create({
      order: order++,
      kind: "build_prompt",
      description: "Assemble provider-agnostic prompt object.",
      dependencies: promptDeps,
      expectedOutput: "prompt",
      pipelineMode: "sequential",
    });
    steps.push(promptStep);

    const llmStep = this.factory.create({
      order: order++,
      kind: "invoke_llm",
      description: "LLM Platform invocation reserved for later wiring.",
      dependencies: [promptStep.id],
      expectedOutput: "llm_deferred",
      pipelineMode: "sequential",
    });
    steps.push(llmStep);

    const collectStep = this.factory.create({
      order: order++,
      kind: "collect_result",
      description: "Collect structured orchestration response.",
      dependencies: [llmStep.id],
      expectedOutput: "orchestrator_result",
      pipelineMode: "sequential",
    });
    steps.push(collectStep);

    return {
      id: createAiId("orch_plan"),
      strategy: input.strategy.id,
      intent: input.intent,
      planner: input.planner,
      steps,
      pipelineMode: input.strategy.pipelineMode,
      createdAt: new Date().toISOString(),
    };
  }
}

/**
 * Execution Planner — selects strategy profile and produces a multi-step plan.
 */
export class AiOrchestratorExecutionPlanner {
  private readonly stepPlanner = new AiOrchestratorStepPlanner();

  build(input: {
    utterance: string;
    intent: AiOrchestratorIntent;
    strategy: AiOrchestratorStrategyProfile;
    planner: AiPlannerDecision | null;
    maxRetries?: number;
  }): AiOrchestratorExecutionPlan {
    return this.stepPlanner.plan({
      utterance: input.utterance,
      intent: input.intent,
      strategy: input.strategy,
      planner: input.planner,
      maxRetries: input.maxRetries ?? 1,
    });
  }
}
