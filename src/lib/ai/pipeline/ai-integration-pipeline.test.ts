import { describe, expect, it } from "vitest";
import {
  AI_PIPELINE_GRAPH,
  AiIntegrationPipeline,
  bootstrapAiFoundation,
  collectAiRuntimeContext,
} from "@/lib/ai";

describe("Enterprise AI Integration Pipeline", () => {
  it("exposes the canonical pipeline graph", () => {
    expect(AI_PIPELINE_GRAPH.length).toBeGreaterThanOrEqual(12);
    expect(AI_PIPELINE_GRAPH[0]?.from).toBe("conversation");
    expect(AI_PIPELINE_GRAPH.at(-1)?.to).toBe("structured_response");
  });

  it("runs the full integration pipeline through existing layers", () => {
    const boot = bootstrapAiFoundation();
    const context = collectAiRuntimeContext({
      route: "/en/app/companies",
      moduleId: "companies",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: ["companies.read"],
    });

    const result = boot.core.runPipeline({
      utterance: "Explain company archive policy",
      contextInput: context,
      surface: "workspace",
      debug: true,
    });

    expect(result.preview.planner.intent).toBeTruthy();
    expect(result.preview.prompt.memory).toBeDefined();
    expect(result.preview.prompt.workspaceContext).toBeTruthy();
    expect(result.trace.steps.length).toBeGreaterThan(0);
    expect(result.observability.pipelineLatencyMs).toBeGreaterThanOrEqual(0);
    expect(result.memoryContext.entries).toBeDefined();
    expect(result.debug?.pipeline.includes("memory_resolver")).toBe(true);
  });

  it("shares the same pipeline between previewTurn and runPipeline", () => {
    const boot = bootstrapAiFoundation();
    const contextInput = collectAiRuntimeContext({
      route: "/en/app/planning",
      moduleId: "planning",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: [],
    });

    const preview = boot.core.previewTurn(contextInput, {
      utterance: "Summarize planning workflow",
    });
    const pipeline = boot.core.runPipeline({
      utterance: "Summarize planning workflow",
      contextInput,
      surface: "workspace",
    });

    expect(preview.planner.intent).toBe(pipeline.preview.planner.intent);
    expect(preview.pipeline?.trace.executionId).toBeTruthy();
  });

  it("creates host execution plans for mutation utterances", () => {
    const boot = bootstrapAiFoundation();
    const result = boot.core.runPipeline({
      utterance: "Create a new company",
      contextInput: collectAiRuntimeContext({
        route: "/en/app/companies",
        moduleId: "companies",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
        permissionCodes: ["companies.create"],
      }),
      surface: "everywhere",
    });

    expect(result.hostExecutionPlan?.serverActionId).toBe("company.create");
    expect(result.streamMetadata.toolPlans).toBeDefined();
  });

  it("injects memory into orchestrator prompt assembly", () => {
    const boot = bootstrapAiFoundation();
    boot.core.memoryEngine.remember(
      collectAiRuntimeContext({
        route: "/en/app/companies",
        moduleId: "companies",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
      }),
      {
        key: "preferred_language",
        level: "preference",
        category: "language",
        label: "Language",
        value: "en",
      },
    );

    const result = boot.core.runPipeline({
      utterance: "Explain materiality",
      contextInput: collectAiRuntimeContext({
        route: "/en/app/companies",
        moduleId: "companies",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
      }),
      surface: "workspace",
    });

    expect(result.preview.prompt.memoryContext?.preferences.language).toBe("en");
  });
});
