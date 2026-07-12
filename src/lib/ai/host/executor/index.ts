import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiHostActionRegistry } from "@/lib/ai/host/registry";
import type { AiHostExecutionQueue } from "@/lib/ai/host/queue";
import { assertQueueTransition } from "@/lib/ai/host/queue";
import type { AiHostJobStore } from "@/lib/ai/host/jobs";
import type { AiHostHistoryStore } from "@/lib/ai/host/history";
import type { AiHostTelemetry } from "@/lib/ai/host/telemetry";
import { AiHostSecurityEngine } from "@/lib/ai/host/security";
import { AiHostValidationEngine } from "@/lib/ai/host/validation";
import { createHostError, isExpired } from "@/lib/ai/host/utils";
import type {
  AiHostExecuteRequest,
  AiHostExecutionResult,
} from "@/lib/ai/host/types";

/**
 * Host Executor — invokes ONLY registered server-action bindings after approval.
 * Never repositories. Never database clients. Never bypasses Approval Engine.
 */
export class AiHostExecutor {
  private readonly security = new AiHostSecurityEngine();
  private readonly validation = new AiHostValidationEngine();

  constructor(
    private readonly registry: AiHostActionRegistry,
    private readonly queue: AiHostExecutionQueue,
    private readonly jobs: AiHostJobStore,
    private readonly history: AiHostHistoryStore,
    private readonly telemetry: AiHostTelemetry,
  ) {}

  async execute(request: AiHostExecuteRequest): Promise<AiHostExecutionResult> {
    const started = Date.now();
    let plan = this.queue.require(request.planId);

    const planValidation = this.validation.validatePlan(plan);
    if (!planValidation.ok) {
      return this.fail(plan, planValidation.error.message, started, [planValidation.error]);
    }

    if (isExpired(plan.expiresAt)) {
      plan = this.queue.update({
        ...plan,
        approvalState: "expired",
        queueState: "cancelled",
      });
      return this.fail(plan, "Execution plan expired.", started, [
        createHostError("expired", "Execution plan expired."),
      ]);
    }

    if (plan.queueState !== "approved" && plan.approvalState !== "auto_approved") {
      return this.fail(plan, "Plan is not approved for execution.", started, [
        createHostError("not_approved", "Approval Engine has not approved this plan."),
      ]);
    }

    const permission = this.security.evaluatePermission(request.context, plan.permission);
    if (!permission.allowed) {
      return this.fail(plan, permission.error.message, started, [permission.error]);
    }

    const scope = this.security.assertTenantScope(request.context, plan);
    if (!scope.ok) {
      return this.fail(plan, scope.error.message, started, [scope.error]);
    }

    const transition = assertQueueTransition(
      plan.queueState === "approved" || plan.approvalState === "auto_approved"
        ? "approved"
        : plan.queueState,
      "executing",
    );
    if (!transition.ok) {
      return this.fail(plan, transition.error.message, started, [transition.error]);
    }

    plan = this.queue.update({
      ...plan,
      queueState: "executing",
      executedBy: request.actorUserId,
    });
    this.jobs.sync(plan);

    const binding = this.registry.get(plan.serverActionId);
    if (!binding) {
      return this.fail(plan, "Server action binding missing.", started, [
        createHostError("action_not_registered", "Server action is not registered."),
      ]);
    }

    if (!binding.invoke) {
      // Structured deferral — binding metadata present, live invoker not attached (e.g. client/runtime without server bindings).
      plan = this.queue.update({ ...plan, queueState: "failed" });
      const result: AiHostExecutionResult = {
        planId: plan.id,
        queueState: "failed",
        approvalState: plan.approvalState,
        success: false,
        summary:
          "Host Execution Layer refused to run: server action invoker is not bound in this runtime. AI never calls actions directly.",
        durationMs: Date.now() - started,
        affectedEntities: [],
        errors: [
          createHostError(
            "invoker_unbound",
            "Registered server action has no invoker in this process. Bind invokers on the server Host runtime only.",
          ),
        ],
        undo: plan.undo,
        producedAt: new Date().toISOString(),
      };
      this.history.record(plan, result);
      this.telemetry.observeExecution(result, plan.serverActionId);
      this.jobs.sync(plan, result.errors[0]?.message ?? null);
      return result;
    }

    try {
      const invoked = await binding.invoke({
        plan,
        context: request.context,
        payload: plan.payload,
      });
      plan = this.queue.update({
        ...plan,
        queueState: invoked.ok ? "succeeded" : "failed",
      });
      const result: AiHostExecutionResult = {
        planId: plan.id,
        queueState: plan.queueState,
        approvalState: plan.approvalState,
        success: invoked.ok,
        summary: invoked.summary,
        durationMs: Date.now() - started,
        affectedEntities: invoked.affectedEntities,
        errors: invoked.errors ?? [],
        undo: plan.undo,
        producedAt: new Date().toISOString(),
      };
      this.history.record(plan, result);
      this.telemetry.observeExecution(result, plan.serverActionId);
      this.jobs.sync(plan, invoked.ok ? null : invoked.summary);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Host execution failed.";
      return this.fail(plan, message, started, [
        createHostError("execution_failed", message),
      ]);
    }
  }

  private fail(
    plan: ReturnType<AiHostExecutionQueue["require"]>,
    summary: string,
    started: number,
    errors: ReturnType<typeof createHostError>[],
  ): AiHostExecutionResult {
    const updated = this.queue.update({
      ...plan,
      queueState: plan.queueState === "cancelled" ? "cancelled" : "failed",
    });
    const result: AiHostExecutionResult = {
      planId: updated.id,
      queueState: updated.queueState,
      approvalState: updated.approvalState,
      success: false,
      summary,
      durationMs: Date.now() - started,
      affectedEntities: [],
      errors,
      undo: updated.undo,
      producedAt: new Date().toISOString(),
    };
    this.history.record(updated, result);
    this.telemetry.observeExecution(result, updated.serverActionId);
    this.jobs.sync(updated, summary);
    return result;
  }
}

export type { AiRuntimeContext };
