import type { AiModuleId } from "@/lib/ai/constants";
import type {
  AiHostActionRegistry,
} from "@/lib/ai/host/registry";
import type {
  AiHostEstimatedChange,
  AiHostExecutionPlan,
  AiHostPlanRequest,
  AiHostRiskLevel,
} from "@/lib/ai/host/types";
import { mapToolRiskToHost } from "@/lib/ai/host/types";
import { AiHostApprovalEngine } from "@/lib/ai/host/approval";
import { AiHostValidationEngine } from "@/lib/ai/host/validation";
import { createHostError, createHostPlanId, defaultExpiryIso } from "@/lib/ai/host/utils";

/**
 * Host Execution Planner — turns tool intents into Execution Plans.
 * Never executes anything.
 */
export class AiHostExecutionPlanner {
  private readonly approval = new AiHostApprovalEngine();
  private readonly validation = new AiHostValidationEngine();

  constructor(private readonly registry: AiHostActionRegistry) {}

  plan(
    request: AiHostPlanRequest,
  ): { ok: true; plan: AiHostExecutionPlan } | { ok: false; error: ReturnType<typeof createHostError> } {
    const validated = this.validation.validatePlanRequest(request);
    if (!validated.ok) return validated;

    const binding = this.resolveBinding(request);
    if (!binding) {
      return {
        ok: false,
        error: createHostError(
          "action_not_registered",
          "No registered host server action matches this tool intent.",
          {
            toolId: request.toolId ?? null,
            serverActionId: request.serverActionId ?? null,
          },
        ),
      };
    }

    const risk = mapToolRiskToHost(
      (request.riskLevel as AiHostRiskLevel | undefined) ??
        (request.toolResult
          ? ((request.toolResult.details.riskLevel as AiHostRiskLevel | undefined) ??
            binding.riskLevel)
          : binding.riskLevel),
    );

    const entityType =
      request.entityType ??
      (typeof request.payload?.entityType === "string"
        ? request.payload.entityType
        : binding.entityTypes[0] ?? "entity");
    const entityId =
      request.entityId ??
      (typeof request.payload?.entityId === "string" ? request.payload.entityId : null);

    const estimatedChanges: AiHostEstimatedChange[] = [
      {
        description: `${binding.title} will be submitted through the Host Execution Layer.`,
        after: request.payload ?? null,
      },
    ];

    const now = new Date().toISOString();
    const draft: AiHostExecutionPlan = {
      id: createHostPlanId(),
      title: request.title ?? binding.title,
      description: request.description ?? binding.description,
      toolId: request.toolId ?? request.toolResult?.toolId ?? null,
      serverActionId: binding.serverActionId,
      permission: binding.permission,
      riskLevel: risk,
      requiresApproval: true,
      estimatedChanges,
      affectedModules: [binding.moduleId as AiModuleId | "*"],
      affectedEntities: entityId
        ? [{ type: entityType, id: entityId, label: request.entityLabel ?? undefined }]
        : [],
      undoAvailable: binding.undoAvailable,
      undo: {
        available: binding.undoAvailable,
        strategy: binding.compensationStrategy,
        compensatingActionId: binding.undoAvailable ? `${binding.serverActionId}.undo` : null,
        windowMs: binding.undoAvailable ? 15 * 60 * 1000 : null,
        notes: binding.undoAvailable
          ? "Undo availability depends on compensating server action support."
          : "No automatic undo for this action.",
      },
      payload: {
        ...(request.payload ?? {}),
        entityType,
        entityId,
      },
      approvalState: "user_approval",
      queueState: "pending",
      requestedBy: request.context.userId,
      approvedBy: null,
      executedBy: null,
      workspaceId: request.context.workspaceId,
      organizationId: request.context.organizationId,
      conversationId: request.conversationId ?? null,
      createdAt: now,
      updatedAt: now,
      expiresAt: defaultExpiryIso(risk),
      toolResultSummary: request.toolResult?.summary ?? null,
    };

    const plan = this.approval.applyInitialApproval(draft);
    const planValidation = this.validation.validatePlan(plan);
    if (!planValidation.ok) return planValidation;
    return { ok: true, plan };
  }

  private resolveBinding(request: AiHostPlanRequest) {
    if (request.serverActionId) {
      return this.registry.get(request.serverActionId) ?? null;
    }
    if (request.toolId) {
      const byHint = this.registry.findByToolHint(request.toolId);
      if (byHint) {
        const entityType =
          request.entityType ??
          (typeof request.payload?.entityType === "string" ? request.payload.entityType : null);
        const operation = request.toolId.replace("tool.action.", "");
        if (entityType) {
          const precise = this.registry.findByEntityAndOperation(entityType, operation);
          if (precise) return precise;
        }
        return byHint;
      }
    }
    if (request.toolResult) {
      const op =
        typeof request.toolResult.details.operation === "string"
          ? request.toolResult.details.operation
          : null;
      const entityType =
        typeof request.toolResult.details.entityType === "string"
          ? request.toolResult.details.entityType
          : request.entityType;
      if (op && entityType) {
        return this.registry.findByEntityAndOperation(entityType, op) ?? null;
      }
      return this.registry.findByToolHint(request.toolResult.toolId) ?? null;
    }
    return null;
  }
}
