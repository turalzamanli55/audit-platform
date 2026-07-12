import { describe, expect, it } from "vitest";
import {
  AI_HOST_ACTION_CATALOG,
  AiHostActionRegistry,
  AiHostApprovalEngine,
  AiHostExecutionRuntime,
  assertQueueTransition,
  bootstrapAiHostExecutionRuntime,
  collectAiRuntimeContext,
  detectHostMutationOperation,
  isHostMutationSuggestion,
} from "@/lib/ai";

function context(permissions: string[] = ["companies.create", "companies.update", "companies.archive"]) {
  return collectAiRuntimeContext({
    route: "/en/app/companies",
    moduleId: "companies",
    locale: "en",
    userId: "user-1",
    workspaceId: "ws-1",
    organizationId: "org-1",
    permissionCodes: permissions,
    roleSlugs: ["manager"],
  });
}

describe("Enterprise Host Execution Layer", () => {
  it("registers the full host action catalog without duplicates", () => {
    const ids = AI_HOST_ACTION_CATALOG.map((entry) => entry.id);
    const serverIds = AI_HOST_ACTION_CATALOG.map((entry) => entry.serverActionId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(serverIds).size).toBe(serverIds.length);
    expect(ids.length).toBeGreaterThanOrEqual(24);
    expect(serverIds).toContain("company.create");
    expect(serverIds).toContain("opinion.approve");
    expect(serverIds).toContain("uaie.import");
  });

  it("maps risk levels to approval gates", () => {
    const engine = new AiHostApprovalEngine({ allowLowAutoExecute: true });
    expect(engine.requiredApprovalState("low")).toBe("auto_approved");
    expect(engine.requiredApprovalState("medium")).toBe("user_approval");
    expect(engine.requiredApprovalState("high")).toBe("manager_approval");
    expect(engine.requiredApprovalState("critical")).toBe("administrator_approval");
    expect(engine.requiresApproval("low")).toBe(false);
    expect(engine.requiresApproval("critical")).toBe(true);
  });

  it("creates an execution plan and never executes repositories", () => {
    const runtime = bootstrapAiHostExecutionRuntime();
    const planned = runtime.createPlan({
      context: context(),
      serverActionId: "company.create",
      payload: { legalName: "Acme" },
      entityType: "company",
    });
    expect(planned.ok).toBe(true);
    if (!planned.ok) return;
    expect(planned.plan.serverActionId).toBe("company.create");
    expect(planned.plan.riskLevel).toBe("medium");
    expect(planned.plan.requiresApproval).toBe(true);
    expect(planned.plan.queueState).toBe("pending");
    expect(planned.plan.approvalState).toBe("user_approval");
    expect(planned.plan.undoAvailable).toBe(true);
  });

  it("enforces queue transitions", () => {
    expect(assertQueueTransition("pending", "approved").ok).toBe(true);
    expect(assertQueueTransition("approved", "executing").ok).toBe(true);
    expect(assertQueueTransition("pending", "executing").ok).toBe(false);
    expect(assertQueueTransition("succeeded", "approved").ok).toBe(false);
  });

  it("refuses execution when invoker is unbound", async () => {
    const runtime = new AiHostExecutionRuntime();
    const planned = runtime.createPlan({
      context: context(),
      serverActionId: "company.create",
      payload: { legalName: "Acme" },
    });
    expect(planned.ok).toBe(true);
    if (!planned.ok) return;

    const approved = runtime.decide({
      planId: planned.plan.id,
      decision: "approve",
      actorUserId: "user-1",
      actorRoles: ["manager"],
    });
    expect(approved.ok).toBe(true);
    if (!approved.ok) return;

    const result = await runtime.execute({
      planId: approved.plan.id,
      context: context(),
      actorUserId: "user-1",
    });
    expect(result.success).toBe(false);
    expect(result.errors[0]?.code).toBe("invoker_unbound");
    expect(runtime.history.list({ planId: planned.plan.id }).length).toBe(1);
  });

  it("approves then executes through a mock registered invoker only", async () => {
    const registry = new AiHostActionRegistry();
    let invoked = false;
    registry.bindInvoker("company.create", async ({ payload }) => {
      invoked = true;
      return {
        ok: true,
        summary: "Mock create company",
        affectedEntities: [{ type: "company", id: "c-1" }],
        data: { companyId: "c-1", payload },
      };
    });
    const runtime = new AiHostExecutionRuntime(registry);
    const planned = runtime.createPlan({
      context: context(),
      serverActionId: "company.create",
      payload: { legalName: "Acme" },
    });
    expect(planned.ok).toBe(true);
    if (!planned.ok) return;

    const approved = runtime.decide({
      planId: planned.plan.id,
      decision: "approve",
      actorUserId: "user-1",
      actorRoles: ["user"],
    });
    expect(approved.ok).toBe(true);
    if (!approved.ok) return;

    const result = await runtime.execute({
      planId: approved.plan.id,
      context: context(),
      actorUserId: "user-1",
    });
    expect(invoked).toBe(true);
    expect(result.success).toBe(true);
    expect(result.queueState).toBe("succeeded");
    expect(result.affectedEntities[0]?.id).toBe("c-1");
  });

  it("blocks high-risk approval without manager role", () => {
    const runtime = bootstrapAiHostExecutionRuntime();
    const planned = runtime.createPlan({
      context: collectAiRuntimeContext({
        route: "/en/app/companies",
        moduleId: "companies",
        locale: "en",
        userId: "user-1",
        workspaceId: "ws-1",
        organizationId: "org-1",
        companyId: "c-1",
        permissionCodes: ["companies.archive"],
        roleSlugs: ["staff"],
      }),
      serverActionId: "company.archive",
      payload: { companyId: "c-1" },
      entityType: "company",
      entityId: "c-1",
    });
    expect(planned.ok).toBe(true);
    if (!planned.ok) return;
    expect(planned.plan.riskLevel).toBe("high");
    expect(planned.plan.approvalState).toBe("manager_approval");

    const denied = runtime.decide({
      planId: planned.plan.id,
      decision: "approve",
      actorUserId: "user-1",
      actorRoles: ["staff"],
    });
    expect(denied.ok).toBe(false);
  });

  it("detects mutation suggestions for AI Everywhere Execution Drawer", () => {
    expect(detectHostMutationOperation("Create a company")).toBe("create");
    expect(detectHostMutationOperation("Please archive this engagement")).toBe("archive");
    expect(detectHostMutationOperation("Approve the review")).toBe("approve");
    expect(isHostMutationSuggestion({ utterance: "explain materiality" })).toBe(false);
    expect(
      isHostMutationSuggestion({
        utterance: "what is materiality",
        plannerIntent: "call_registered_action",
      }),
    ).toBe(true);
  });
});
