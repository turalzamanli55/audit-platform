import { describe, expect, it } from "vitest";
import {
  AI_SKILL_CATALOG,
  AiSkillExecutor,
  AiSkillRegistry,
  AiSkillResolver,
  bootstrapAiFoundation,
  collectAiRuntimeContext,
  createPopulatedAiSkillRegistry,
} from "@/lib/ai";
import { AiKnowledgeEngine } from "@/lib/ai/knowledge/ai-knowledge-engine";

describe("Enterprise AI Skills Engine", () => {
  it("registers unique skills across platform modules", () => {
    const ids = AI_SKILL_CATALOG.map((entry) => entry.definition.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(60);

    const modules = new Set(AI_SKILL_CATALOG.map((entry) => entry.definition.moduleId));
    expect(modules.has("dashboard")).toBe(true);
    expect(modules.has("uaie")).toBe(true);
    expect(modules.has("import-intelligence")).toBe(true);
    expect(modules.has("materiality")).toBe(true);
  });

  it("bootstraps skill count into the foundation", () => {
    const boot = bootstrapAiFoundation();
    expect(boot.skillCount).toBe(AI_SKILL_CATALOG.length);
    expect(boot.core.skillRegistry.count()).toBe(AI_SKILL_CATALOG.length);
  });

  it("resolves skills from module context and utterance without LLM calls", () => {
    const registry = createPopulatedAiSkillRegistry();
    const resolver = new AiSkillResolver(registry);
    const context = collectAiRuntimeContext({
      route: "/en/app/engagements/demo/materiality",
      moduleId: "materiality",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: ["materiality.read"],
    });

    const resolved = resolver.resolve({
      context,
      utterance: "explain materiality threshold",
      limit: 3,
    });

    expect(resolved.selected).toBeTruthy();
    expect(resolved.selected?.skill.moduleId).toBe("materiality");
    expect(resolved.selected?.skill.id).toMatch(/^materiality\./);
  });

  it("executes skills into structured objects with knowledge and context", () => {
    const registry = createPopulatedAiSkillRegistry();
    const executor = new AiSkillExecutor(registry, new AiKnowledgeEngine());
    const context = collectAiRuntimeContext({
      route: "/en/app/dashboard",
      moduleId: "dashboard",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: [],
    });

    const result = executor.execute({
      skillId: "dashboard.explain",
      context,
      utterance: "explain dashboard",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result.title).toBeTruthy();
      expect(result.result.structuredContext.skillId).toBe("dashboard.explain");
      expect(result.result.knowledge?.id).toBe("dashboard");
      expect(result.result.context.workspaceId).toBe("ws-1");
      expect(result.result.recommendedActions.length).toBeGreaterThan(0);
    }
  });

  it("denies skill execution without permissions", () => {
    const registry = new AiSkillRegistry();
    registry.registerAll(AI_SKILL_CATALOG);
    const executor = new AiSkillExecutor(registry, new AiKnowledgeEngine());
    const context = collectAiRuntimeContext({
      route: "/en/app/companies",
      moduleId: "companies",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: [],
    });

    const denied = executor.execute({
      skillId: "companies.analyze",
      context,
    });
    expect(denied.ok).toBe(false);
  });

  it("previewTurn selects a skill and never marks provider available by default", () => {
    const boot = bootstrapAiFoundation();
    const preview = boot.core.previewTurn(
      {
        route: "/en/app/import-intelligence",
        moduleId: "import-intelligence",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
        permissionCodes: ["uaie.read"],
      },
      { utterance: "dictionary health" },
    );

    expect(preview.providerAvailable).toBe(false);
    expect(preview.skillResolution?.selected?.skill.id).toBe(
      "import-intelligence.dictionary_health",
    );
    expect(preview.skillResult?.structuredContext.focus).toBe("dictionary_health");
  });
});
