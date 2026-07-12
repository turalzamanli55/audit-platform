import type {
  AiHostApprovalDecision,
  AiHostApprovalState,
  AiHostExecutionPlan,
  AiHostRiskLevel,
} from "@/lib/ai/host/types";
import { AiHostSecurityEngine } from "@/lib/ai/host/security";
import { createHostError, isExpired } from "@/lib/ai/host/utils";

export type AiHostApprovalPolicy = {
  /** When true, low-risk plans may auto-approve. */
  allowLowAutoExecute: boolean;
};

/**
 * Approval Engine — Human-in-the-Loop gates by risk level.
 */
export class AiHostApprovalEngine {
  private readonly security = new AiHostSecurityEngine();

  constructor(private readonly policy: AiHostApprovalPolicy = { allowLowAutoExecute: true }) {}

  requiredApprovalState(risk: AiHostRiskLevel): AiHostApprovalState {
    switch (risk) {
      case "low":
        return this.policy.allowLowAutoExecute ? "auto_approved" : "user_approval";
      case "medium":
        return "user_approval";
      case "high":
        return "manager_approval";
      case "critical":
        return "administrator_approval";
      default:
        return "user_approval";
    }
  }

  requiresApproval(risk: AiHostRiskLevel): boolean {
    return this.requiredApprovalState(risk) !== "auto_approved";
  }

  applyInitialApproval(plan: AiHostExecutionPlan): AiHostExecutionPlan {
    const state = this.requiredApprovalState(plan.riskLevel);
    return {
      ...plan,
      approvalState: state,
      requiresApproval: state !== "auto_approved",
      queueState: state === "auto_approved" ? "approved" : "pending",
      approvedBy: state === "auto_approved" ? plan.requestedBy : null,
      updatedAt: new Date().toISOString(),
    };
  }

  decide(
    plan: AiHostExecutionPlan,
    decision: AiHostApprovalDecision,
  ):
    | { ok: true; plan: AiHostExecutionPlan }
    | { ok: false; error: ReturnType<typeof createHostError> } {
    if (isExpired(plan.expiresAt)) {
      return {
        ok: false,
        error: createHostError("expired", "Execution plan has expired."),
      };
    }

    if (plan.queueState === "succeeded" || plan.queueState === "executing") {
      return {
        ok: false,
        error: createHostError("invalid_state", "Plan can no longer accept approval decisions."),
      };
    }

    if (decision.decision === "cancel") {
      return {
        ok: true,
        plan: {
          ...plan,
          approvalState: "cancelled",
          queueState: "cancelled",
          updatedAt: new Date().toISOString(),
        },
      };
    }

    if (decision.decision === "reject") {
      return {
        ok: true,
        plan: {
          ...plan,
          approvalState: "rejected",
          queueState: "cancelled",
          approvedBy: decision.actorUserId,
          updatedAt: new Date().toISOString(),
        },
      };
    }

    const gate = this.security.canApprove(plan.riskLevel, decision.actorRoles ?? []);
    if (!gate.allowed) {
      return {
        ok: false,
        error: createHostError(
          "approval_insufficient",
          `Risk ${plan.riskLevel} requires ${gate.required} approval.`,
          { required: gate.required },
        ),
      };
    }

    return {
      ok: true,
      plan: {
        ...plan,
        approvalState: "approved",
        queueState: "approved",
        approvedBy: decision.actorUserId,
        updatedAt: new Date().toISOString(),
      },
    };
  }
}
