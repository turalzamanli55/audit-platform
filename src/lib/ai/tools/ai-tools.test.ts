import { describe, expect, it } from "vitest";
import {
  AI_TOOL_CATALOG,
  AiToolRuntime,
  bootstrapAiFoundation,
  bootstrapAiToolRuntime,
  collectAiRuntimeContext,
} from "@/lib/ai";

describe("Enterprise Tool Runtime", () => {
  it("registers unique tools across navigation, search, workflow, repository, and action catalogs", () => {
    const ids = AI_TOOL_CATALOG.map((entry) => entry.definition.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(50);

    const categories = new Set(AI_TOOL_CATALOG.map((entry) => entry.definition.category));
    expect(categories.has("navigation")).toBe(true);
    expect(categories.has("search")).toBe(true);
    expect(categories.has("workflow")).toBe(true);
    expect(categories.has("repository")).toBe(true);
  });

  it("exposes LLM-safe definitions without repository or server action bindings", () => {
    const runtime = bootstrapAiToolRuntime();
    const defs = runtime.listLlmDefinitions();
    expect(defs.length).toBe(runtime.registry.count());
    expect(defs[0]).toHaveProperty("inputSchema");
    expect(JSON.stringify(defs)).not.toMatch(/Repository\(|serverAction|supabase/i);
  });

  it("defaults to dry_run and never calls repositories", () => {
    const runtime = new AiToolRuntime();
    const context = collectAiRuntimeContext({
      route: "/en/app/dashboard",
      moduleId: "dashboard",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: [],
    });

    const result = runtime.execute({
      toolId: "tool.navigation.open_dashboard",
      context,
      args: {},
    });

    expect(result.executionMode).toBe("dry_run");
    expect(result.status).toBe("dry_run");
    expect(result.success).toBe(true);
    expect(result.details.executed).toBe(false);
  });

  it("requires confirmation for dangerous action tools", () => {
    const runtime = bootstrapAiToolRuntime();
    const context = collectAiRuntimeContext({
      route: "/en/app/companies",
      moduleId: "companies",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: [],
    });

    const first = runtime.execute({
      toolId: "tool.action.delete",
      context,
      args: { entityType: "company", entityId: "c1" },
      executionMode: "live",
    });
    expect(first.status).toBe("confirmation_required");
    expect(first.confirmationToken).toBeTruthy();

    const second = runtime.execute({
      toolId: "tool.action.delete",
      context,
      args: { entityType: "company", entityId: "c1" },
      executionMode: "live",
      confirmed: true,
      confirmationToken: first.confirmationToken,
    });
    expect(second.status).toBe("success");
    expect(second.details.serverAction).toBeNull();
  });

  it("denies tools without permissions and records telemetry/history", () => {
    const runtime = bootstrapAiToolRuntime();
    const context = collectAiRuntimeContext({
      route: "/en/app/companies",
      moduleId: "companies",
      locale: "en",
      userId: "user-1",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: [],
    });

    const denied = runtime.execute({
      toolId: "tool.search.companies",
      context,
      args: { query: "acme" },
    });
    expect(denied.status).toBe("denied");

    const telemetry = runtime.telemetry();
    expect(telemetry.totalExecutions).toBeGreaterThan(0);
    expect(telemetry.permissionFailures).toBeGreaterThan(0);
    expect(runtime.executor.history.list({ toolId: "tool.search.companies" }).length).toBeGreaterThan(0);
  });

  it("wires tool runtime into foundation bootstrap and previewTurn", () => {
    const boot = bootstrapAiFoundation();
    expect(boot.toolCount).toBe(AI_TOOL_CATALOG.length);

    const preview = boot.core.previewTurn(
      {
        route: "/en/app/materiality",
        moduleId: "materiality",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
        permissionCodes: ["materiality.read"],
      },
      { utterance: "open materiality" },
    );

    expect(preview.toolResolution?.selected?.tool.category).toBe("navigation");
    expect(preview.availableTools?.length).toBeGreaterThan(40);
    expect(preview.providerAvailable).toBe(false);
  });
});
