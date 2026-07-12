import {
  AiHostActionRegistry,
  createPopulatedHostActionRegistry,
} from "@/lib/ai/host/registry";
import { AiHostExecutionPlanner } from "@/lib/ai/host/planner";
import { AiHostApprovalEngine } from "@/lib/ai/host/approval";
import { AiHostExecutionQueue } from "@/lib/ai/host/queue";
import { AiHostJobStore } from "@/lib/ai/host/jobs";
import { AiHostHistoryStore } from "@/lib/ai/host/history";
import { AiHostTelemetry } from "@/lib/ai/host/telemetry";
import { AiHostExecutor } from "@/lib/ai/host/executor";
import { AiHostSecurityEngine } from "@/lib/ai/host/security";
import { AiHostValidationEngine } from "@/lib/ai/host/validation";
import {
  AI_HOST_VERSION,
  type AiHostApprovalDecision,
  type AiHostExecuteRequest,
  type AiHostExecutionPlan,
  type AiHostExecutionResult,
  type AiHostPlanRequest,
  type AiHostTelemetrySnapshot,
} from "@/lib/ai/host/types";
import { createHostError } from "@/lib/ai/host/utils";

/**
 * Enterprise Host Execution Runtime — Human-in-the-Loop facade.
 */
export class AiHostExecutionRuntime {
  readonly version = AI_HOST_VERSION;
  readonly registry: AiHostActionRegistry;
  readonly planner: AiHostExecutionPlanner;
  readonly approval: AiHostApprovalEngine;
  readonly queue: AiHostExecutionQueue;
  readonly jobs: AiHostJobStore;
  readonly history: AiHostHistoryStore;
  readonly telemetry: AiHostTelemetry;
  readonly executor: AiHostExecutor;
  readonly security: AiHostSecurityEngine;
  readonly validation: AiHostValidationEngine;

  constructor(registry: AiHostActionRegistry = createPopulatedHostActionRegistry()) {
    this.registry = registry;
    this.planner = new AiHostExecutionPlanner(registry);
    this.approval = new AiHostApprovalEngine();
    this.queue = new AiHostExecutionQueue();
    this.jobs = new AiHostJobStore();
    this.history = new AiHostHistoryStore();
    this.telemetry = new AiHostTelemetry();
    this.executor = new AiHostExecutor(
      registry,
      this.queue,
      this.jobs,
      this.history,
      this.telemetry,
    );
    this.security = new AiHostSecurityEngine();
    this.validation = new AiHostValidationEngine();
  }

  createPlan(
    request: AiHostPlanRequest,
  ): { ok: true; plan: AiHostExecutionPlan } | { ok: false; error: ReturnType<typeof createHostError> } {
    const planned = this.planner.plan(request);
    if (!planned.ok) return planned;
    const permission = this.security.evaluatePermission(
      request.context,
      planned.plan.permission,
    );
    if (!permission.allowed) {
      return { ok: false, error: permission.error };
    }
    const enqueued = this.queue.enqueue(planned.plan);
    this.jobs.createFromPlan(enqueued);
    this.telemetry.observePlanCreated(
      enqueued.riskLevel,
      enqueued.approvalState === "auto_approved",
    );
    return { ok: true, plan: enqueued };
  }

  decide(
    decision: AiHostApprovalDecision,
  ): { ok: true; plan: AiHostExecutionPlan } | { ok: false; error: ReturnType<typeof createHostError> } {
    const existing = this.queue.get(decision.planId);
    if (!existing) {
      return { ok: false, error: createHostError("plan_not_found", "Execution plan not found.") };
    }
    const decided = this.approval.decide(existing, decision);
    if (!decided.ok) return decided;
    const updated = this.queue.update(decided.plan);
    this.jobs.sync(updated);
    if (decision.decision === "approve") this.telemetry.observeApproval("approved");
    if (decision.decision === "reject") this.telemetry.observeApproval("rejected");
    if (decision.decision === "cancel") this.telemetry.observeApproval("cancelled");
    return { ok: true, plan: updated };
  }

  async execute(request: AiHostExecuteRequest): Promise<AiHostExecutionResult> {
    return this.executor.execute(request);
  }

  getPlan(planId: string): AiHostExecutionPlan | undefined {
    return this.queue.get(planId);
  }

  listPending(workspaceId?: string | null): AiHostExecutionPlan[] {
    return this.queue.list({ queueState: "pending", workspaceId, limit: 50 });
  }

  telemetrySnapshot(): AiHostTelemetrySnapshot {
    return this.telemetry.snapshot();
  }

  stats() {
    return {
      version: this.version,
      actionCount: this.registry.list().length,
      pending: this.queue.list({ queueState: "pending" }).length,
      telemetry: this.telemetrySnapshot(),
    };
  }
}

let singleton: AiHostExecutionRuntime | null = null;

export function getAiHostExecutionRuntime(): AiHostExecutionRuntime {
  if (!singleton) singleton = new AiHostExecutionRuntime();
  return singleton;
}

export function bootstrapAiHostExecutionRuntime(
  registry?: AiHostActionRegistry,
): AiHostExecutionRuntime {
  const runtime = new AiHostExecutionRuntime(registry ?? createPopulatedHostActionRegistry());
  singleton = runtime;
  return runtime;
}
