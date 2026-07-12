"use server";

import "server-only";

import { bootstrapAiHostExecutionRuntime } from "@/lib/ai/host/runtime";
import { bindLiveHostActionInvokers } from "@/lib/ai/host/registry/server-bindings";
import type {
  AiHostApprovalDecision,
  AiHostExecuteRequest,
  AiHostExecutionPlan,
  AiHostExecutionResult,
  AiHostPlanRequest,
} from "@/lib/ai/host/types";

let ready: ReturnType<typeof bootstrapAiHostExecutionRuntime> | null = null;

async function getRuntime() {
  if (!ready) {
    ready = bootstrapAiHostExecutionRuntime();
    await bindLiveHostActionInvokers(ready.registry);
  }
  return ready;
}

export type HostPlanActionResult =
  | { ok: true; plan: AiHostExecutionPlan }
  | { ok: false; code: string; message: string };

export async function createHostExecutionPlanAction(
  request: AiHostPlanRequest,
): Promise<HostPlanActionResult> {
  try {
    const runtime = await getRuntime();
    const result = runtime.createPlan(request);
    if (!result.ok) {
      return { ok: false, code: result.error.code, message: result.error.message };
    }
    return { ok: true, plan: result.plan };
  } catch (error) {
    return {
      ok: false,
      code: "host_plan_failed",
      message: error instanceof Error ? error.message : "Failed to create execution plan.",
    };
  }
}

export async function decideHostExecutionPlanAction(
  decision: AiHostApprovalDecision,
): Promise<HostPlanActionResult> {
  try {
    const runtime = await getRuntime();
    const result = runtime.decide(decision);
    if (!result.ok) {
      return { ok: false, code: result.error.code, message: result.error.message };
    }
    return { ok: true, plan: result.plan };
  } catch (error) {
    return {
      ok: false,
      code: "host_decision_failed",
      message: error instanceof Error ? error.message : "Failed to apply approval decision.",
    };
  }
}

export type HostExecuteActionResult =
  | { ok: true; result: AiHostExecutionResult; plan: AiHostExecutionPlan | undefined }
  | { ok: false; code: string; message: string };

export async function executeHostExecutionPlanAction(
  request: AiHostExecuteRequest,
): Promise<HostExecuteActionResult> {
  try {
    const runtime = await getRuntime();
    const result = await runtime.execute(request);
    return { ok: true, result, plan: runtime.getPlan(request.planId) };
  } catch (error) {
    return {
      ok: false,
      code: "host_execute_failed",
      message: error instanceof Error ? error.message : "Host execution failed.",
    };
  }
}

export async function listHostPendingPlansAction(
  workspaceId?: string | null,
): Promise<AiHostExecutionPlan[]> {
  const runtime = await getRuntime();
  return runtime.listPending(workspaceId);
}
