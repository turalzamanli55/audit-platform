"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import type {
  AiHostApprovalState,
  AiHostExecutionPlan,
  AiHostExecutionResult,
  AiHostRiskLevel,
} from "@/lib/ai/host/types";
import {
  decideHostExecutionPlanAction,
  executeHostExecutionPlanAction,
} from "@/lib/actions/ai/host-execution-actions";
import type { AiRuntimeContext } from "@/lib/ai/types/context";

function riskVariant(risk: AiHostRiskLevel): "success" | "info" | "warning" | "destructive" {
  switch (risk) {
    case "low":
      return "success";
    case "medium":
      return "info";
    case "high":
      return "warning";
    case "critical":
      return "destructive";
  }
}

function approvalLabel(state: AiHostApprovalState): string {
  return state.replaceAll("_", " ");
}

export type AiHostExecutionDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: AiHostExecutionPlan | null;
  context: AiRuntimeContext | null;
  onPlanUpdated?: (plan: AiHostExecutionPlan) => void;
  onExecuted?: (result: AiHostExecutionResult) => void;
};

/**
 * Premium Execution Drawer — Human-in-the-Loop surface.
 * Never executes repositories; only Approval Engine + Host server actions.
 */
export function AiHostExecutionDrawer({
  open,
  onOpenChange,
  plan,
  context,
  onPlanUpdated,
  onExecuted,
}: AiHostExecutionDrawerProps) {
  const [pending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AiHostExecutionResult | null>(null);

  const canApprove =
    plan &&
    (plan.queueState === "pending" ||
      plan.approvalState === "user_approval" ||
      plan.approvalState === "manager_approval" ||
      plan.approvalState === "administrator_approval");

  const canExecute =
    plan &&
    (plan.queueState === "approved" || plan.approvalState === "auto_approved") &&
    plan.queueState !== "succeeded" &&
    plan.queueState !== "failed" &&
    plan.queueState !== "cancelled" &&
    plan.queueState !== "executing";

  const canCancel =
    plan &&
    plan.queueState !== "succeeded" &&
    plan.queueState !== "cancelled" &&
    plan.queueState !== "executing";

  const actorUserId = context?.userId ?? "session-user";
  const actorRoles = context?.roleSlugs ?? [];

  const approve = useCallback(() => {
    if (!plan) return;
    startTransition(async () => {
      setStatusMessage(null);
      const result = await decideHostExecutionPlanAction({
        planId: plan.id,
        decision: "approve",
        actorUserId,
        actorRoles,
      });
      if (!result.ok) {
        setStatusMessage(result.message);
        return;
      }
      onPlanUpdated?.(result.plan);
      setStatusMessage("Plan approved. Ready to execute.");
    });
  }, [plan, actorUserId, actorRoles, onPlanUpdated]);

  const reject = useCallback(() => {
    if (!plan) return;
    startTransition(async () => {
      setStatusMessage(null);
      const result = await decideHostExecutionPlanAction({
        planId: plan.id,
        decision: "reject",
        actorUserId,
        actorRoles,
      });
      if (!result.ok) {
        setStatusMessage(result.message);
        return;
      }
      onPlanUpdated?.(result.plan);
      setStatusMessage("Plan rejected.");
    });
  }, [plan, actorUserId, actorRoles, onPlanUpdated]);

  const cancel = useCallback(() => {
    if (!plan) return;
    startTransition(async () => {
      setStatusMessage(null);
      const result = await decideHostExecutionPlanAction({
        planId: plan.id,
        decision: "cancel",
        actorUserId,
        actorRoles,
      });
      if (!result.ok) {
        setStatusMessage(result.message);
        return;
      }
      onPlanUpdated?.(result.plan);
      setStatusMessage("Plan cancelled.");
    });
  }, [plan, actorUserId, actorRoles, onPlanUpdated]);

  const execute = useCallback(() => {
    if (!plan || !context) return;
    startTransition(async () => {
      setStatusMessage(null);
      const result = await executeHostExecutionPlanAction({
        planId: plan.id,
        context,
        actorUserId,
      });
      if (!result.ok) {
        setStatusMessage(result.message);
        return;
      }
      if (result.plan) onPlanUpdated?.(result.plan);
      setLastResult(result.result);
      onExecuted?.(result.result);
      setStatusMessage(result.result.summary);
    });
  }, [plan, context, actorUserId, onPlanUpdated, onExecuted]);

  const affected = useMemo(() => plan?.affectedEntities ?? [], [plan]);

  return (
    <Sheet
      open={open && Boolean(plan)}
      onOpenChange={onOpenChange}
      title="Execution Plan"
      description="Human-in-the-Loop host execution — AI never runs this directly."
      side="right"
    >
      {!plan ? null : (
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={riskVariant(plan.riskLevel)} size="sm">
                Risk: {plan.riskLevel}
              </Badge>
              <Badge variant="outline" size="sm">
                {approvalLabel(plan.approvalState)}
              </Badge>
              <Badge variant="secondary" size="sm">
                Queue: {plan.queueState}
              </Badge>
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {plan.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </header>

          <section className="space-y-2" aria-label="Plan summary">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Plan summary
            </h4>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-border/40 py-2">
                <dt className="text-muted-foreground">Server action</dt>
                <dd className="font-medium text-foreground">{plan.serverActionId}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border/40 py-2">
                <dt className="text-muted-foreground">Permission</dt>
                <dd className="text-right font-medium text-foreground">
                  {(plan.permission.anyOf ?? plan.permission.allOf ?? ["—"]).join(", ")}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border/40 py-2">
                <dt className="text-muted-foreground">Undo</dt>
                <dd className="font-medium text-foreground">
                  {plan.undoAvailable ? `Available (${plan.undo.strategy})` : "Not available"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-2" aria-label="Affected objects">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Affected objects
            </h4>
            {affected.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Modules: {plan.affectedModules.join(", ") || "—"}
              </p>
            ) : (
              <ul className="space-y-1.5">
                {affected.map((entity) => (
                  <li
                    key={`${entity.type}:${entity.id}`}
                    className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{entity.label ?? entity.id}</span>
                    <span className="ml-2 text-muted-foreground">{entity.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-2" aria-label="Estimated changes">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Estimated changes
            </h4>
            <ul className="space-y-2">
              {plan.estimatedChanges.map((change, index) => (
                <li
                  key={`${change.description}-${index}`}
                  className="text-sm leading-relaxed text-foreground"
                >
                  {change.description}
                </li>
              ))}
            </ul>
          </section>

          {statusMessage ? (
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                lastResult?.success === false
                  ? "border-destructive/30 bg-destructive/5 text-destructive"
                  : "border-border/60 bg-muted/40 text-foreground",
              )}
              role="status"
            >
              {statusMessage}
            </p>
          ) : null}

          <div className="sticky bottom-0 mt-auto flex flex-wrap gap-2 border-t border-border/50 bg-card pt-4">
            {canApprove ? (
              <Button type="button" size="sm" disabled={pending} onClick={approve}>
                Approve
              </Button>
            ) : null}
            {canExecute ? (
              <Button type="button" size="sm" disabled={pending || !context} onClick={execute}>
                Execute
              </Button>
            ) : null}
            {canApprove ? (
              <Button type="button" size="sm" variant="outline" disabled={pending} onClick={reject}>
                Reject
              </Button>
            ) : null}
            {canCancel ? (
              <Button type="button" size="sm" variant="ghost" disabled={pending} onClick={cancel}>
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </Sheet>
  );
}
