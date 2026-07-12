import { describe, expect, it } from "vitest";
import {
  AI_ACTION_DEFINITIONS,
  AI_MODULE_CATALOG,
  AiActionRegistry,
  AiCopilotCore,
  AiPlanner,
  bootstrapAiFoundation,
  collectAiRuntimeContext,
} from "@/lib/ai";

describe("Enterprise AI Foundation", () => {
  it("registers all platform modules and actions", () => {
    const boot = bootstrapAiFoundation();
    expect(boot.moduleCount).toBe(AI_MODULE_CATALOG.length);
    expect(boot.actionCount).toBe(AI_ACTION_DEFINITIONS.length);
    expect(boot.moduleCount).toBeGreaterThanOrEqual(18);
    expect(boot.actionCount).toBeGreaterThanOrEqual(10);
  });

  it("collects runtime context without provider calls", () => {
    const context = collectAiRuntimeContext({
      route: "/en/app/dashboard",
      moduleId: "dashboard",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: ["engagement.read"],
    });
    expect(context.workspaceId).toBe("ws-1");
    expect(context.collectedAt).toBeTruthy();
  });

  it("plans module open intents", () => {
    const planner = new AiPlanner();
    const context = collectAiRuntimeContext({
      route: "/en/app/dashboard",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
    });
    const decision = planner.plan({
      utterance: "open materiality",
      context,
      availableModules: [...AI_MODULE_CATALOG],
      availableActionIds: AI_ACTION_DEFINITIONS.map((action) => action.id),
    });
    expect(decision.intent).toBe("open_module");
    expect(decision.suggestedActionId).toBe("platform.open_module");
  });

  it("denies actions without permissions and allows when granted", () => {
    const registry = new AiActionRegistry();
    const base = collectAiRuntimeContext({
      route: "/en/app/companies",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: [],
    });
    const denied = registry.execute({
      actionId: "platform.open_company",
      payload: { companyId: "c1", slug: "acme" },
      context: base,
    });
    expect(denied.ok).toBe(false);

    const allowed = registry.execute({
      actionId: "platform.open_company",
      payload: { companyId: "c1", slug: "acme" },
      context: { ...base, permissionCodes: ["company.read"] },
    });
    expect(allowed.ok).toBe(true);
    if (allowed.ok) {
      expect(allowed.instruction.type).toBe("open_entity");
    }
  });

  it("builds a turn preview with null provider", () => {
    const core = new AiCopilotCore();
    const preview = core.previewTurn(
      {
        route: "/en/app/engagements/demo",
        moduleId: "engagements",
        locale: "az",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
        permissionCodes: ["engagement.read"],
      },
      { utterance: "explain planning status" },
    );
    expect(preview.providerAvailable).toBe(false);
    expect(preview.prompt.systemDirectives.length).toBeGreaterThan(0);
    expect(preview.prompt.context.locale).toBe("az");
  });

  it("resets conversation when workspace changes", () => {
    const core = new AiCopilotCore();
    core.previewTurn(
      {
        route: "/en/app/dashboard",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
      },
      { utterance: "hello" },
    );
    const first = core.conversationManager.getSession()?.conversationId;
    core.previewTurn(
      {
        route: "/en/app/dashboard",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-2",
        organizationId: "org-1",
      },
      { utterance: "hello again" },
    );
    const second = core.conversationManager.getSession()?.conversationId;
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);
  });
});
