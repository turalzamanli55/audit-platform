import { describe, expect, it } from "vitest";
import {
  bootstrapAiFoundation,
  bootstrapAiOrchestrator,
  collectAiRuntimeContext,
  AiOrchestratorEngine,
  AiOrchestratorIntentAnalyzer,
  AiOrchestratorStrategySelector,
  AiOrchestratorStateMachine,
} from "@/lib/ai";

function sampleContext() {
  return collectAiRuntimeContext({
    route: "/en/app/engagements/demo",
    moduleId: "engagements",
    locale: "en",
    userId: "user-1",
    workspaceId: "ws-1",
    organizationId: "org-1",
    permissionCodes: [],
  });
}

describe("Enterprise AI Orchestrator", () => {
  it("analyzes intents including mixed and domain signals", () => {
    const analyzer = new AiOrchestratorIntentAnalyzer();
    const intent = analyzer.analyze({
      utterance: "Analyze this engagement and validate materiality",
      context: sampleContext(),
    });
    expect(["analysis", "validation", "audit", "mixed"]).toContain(intent.primary);
    expect(intent.confidence).toBeGreaterThan(0.4);
    expect(intent.signals.length).toBeGreaterThan(0);
  });

  it("selects deep/audit strategies for analysis intents", () => {
    const selector = new AiOrchestratorStrategySelector();
    const profile = selector.resolve({
      primary: "analysis",
      secondary: ["audit"],
      confidence: 0.9,
      rationale: "test",
      signals: [],
      mixed: false,
    });
    expect(profile.id).toBe("deep");
    expect(profile.includeModuleSweep).toBe(true);
    expect(profile.moduleSweep.length).toBeGreaterThan(3);
  });

  it("enforces state machine transitions", () => {
    const machine = new AiOrchestratorStateMachine();
    expect(machine.transition("planning").ok).toBe(true);
    expect(machine.transition("completed").ok).toBe(true);
    expect(machine.transition("executing").ok).toBe(false);
  });

  it("builds multi-step engagement analysis plans without repositories", () => {
    const boot = bootstrapAiFoundation();
    const orchestrator = boot.core.orchestrator;
    const result = orchestrator.run({
      utterance: "Analyze this engagement.",
      context: sampleContext(),
      strategy: "audit",
      planOnly: true,
    });

    expect(result.success).toBe(true);
    expect(result.strategy).toBe("audit");
    const kinds = result.plan.steps.map((step) => step.kind);
    expect(kinds).toContain("load_module_context");
    expect(kinds).toContain("merge_context");
    expect(kinds).toContain("resolve_skill");
    expect(kinds).toContain("resolve_knowledge");
    expect(kinds).toContain("resolve_tools");
    expect(kinds).toContain("build_prompt");
    expect(kinds).toContain("invoke_llm");
    expect(JSON.stringify(result)).not.toMatch(/supabase|Repository\(|serverAction\s*:/i);
  });

  it("runs full orchestration with deferred LLM and structured result", () => {
    const boot = bootstrapAiFoundation();
    const result = boot.core.orchestrate({
      utterance: "Explain the next workflow step",
      context: sampleContext(),
      strategy: "simple",
    });

    expect(result.state).toBe("completed");
    expect(result.success).toBe(true);
    expect(result.prompt).not.toBeNull();
    expect(result.llmInvocation.providerInvoked).toBe(false);
    expect(result.llmInvocation.status).toBe("deferred");
    expect(result.availableTools.length).toBeGreaterThan(0);
    expect(result.usage.stepsExecuted).toBeGreaterThan(0);
    expect(boot.core.orchestrator.telemetrySnapshot().totalExecutions).toBeGreaterThan(0);
    expect(boot.core.orchestrator.history.list().length).toBeGreaterThan(0);
  });

  it("wires orchestrator into previewTurn", () => {
    const boot = bootstrapAiFoundation();
    expect(boot.orchestratorVersion).toBeDefined();

    const preview = boot.core.previewTurn(
      {
        route: "/en/app/materiality",
        moduleId: "materiality",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
        permissionCodes: [],
      },
      { utterance: "Explain materiality" },
    );

    expect(preview.orchestration).toBeDefined();
    expect(preview.orchestration?.success).toBe(true);
    expect(preview.prompt).toBeDefined();
    expect(preview.planner).toBeDefined();
  });

  it("bootstrapAiOrchestrator constructs an engine", () => {
    const boot = bootstrapAiFoundation();
    const engine = bootstrapAiOrchestrator({
      planner: boot.core.planner,
      promptBuilder: boot.core.promptBuilder,
      knowledgeEngine: boot.core.knowledgeEngine,
      skillResolver: boot.core.skillResolver,
      skillExecutor: boot.core.skillExecutor,
      knowledgeGraph: boot.core.knowledgeGraph,
      toolRuntime: boot.core.toolRuntime,
      llmPlatform: boot.core.llmPlatform,
    });
    expect(engine).toBeInstanceOf(AiOrchestratorEngine);
    expect(engine.version).toBeTruthy();
  });
});
