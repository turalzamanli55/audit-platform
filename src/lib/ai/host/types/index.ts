/**
 * Enterprise Host Execution Layer — type contracts.
 * AI never executes repositories or server actions directly.
 * Host plans → Approval → registered Server Action bindings only.
 */

import type { AiModuleId } from "@/lib/ai/constants";
import type { AiActionPermissionRequirement } from "@/lib/ai/types/actions";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiToolRiskLevel, AiToolResult } from "@/lib/ai/tools/types";

export const AI_HOST_VERSION = "1.0.0" as const;

export const AI_HOST_RISK_LEVELS = ["low", "medium", "high", "critical"] as const;
export type AiHostRiskLevel = (typeof AI_HOST_RISK_LEVELS)[number];

export const AI_HOST_APPROVAL_STATES = [
  "auto_approved",
  "user_approval",
  "manager_approval",
  "administrator_approval",
  "approved",
  "rejected",
  "expired",
  "cancelled",
] as const;
export type AiHostApprovalState = (typeof AI_HOST_APPROVAL_STATES)[number];

export const AI_HOST_QUEUE_STATES = [
  "pending",
  "approved",
  "executing",
  "succeeded",
  "failed",
  "cancelled",
] as const;
export type AiHostQueueState = (typeof AI_HOST_QUEUE_STATES)[number];

export const AI_HOST_COMPENSATION_STRATEGIES = [
  "none",
  "restore",
  "manual",
  "compensating_action",
] as const;
export type AiHostCompensationStrategy = (typeof AI_HOST_COMPENSATION_STRATEGIES)[number];

export type AiHostError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type AiHostAffectedEntity = {
  type: string;
  id: string;
  label?: string;
};

export type AiHostEstimatedChange = {
  field?: string;
  description: string;
  before?: unknown;
  after?: unknown;
};

export type AiHostUndoMetadata = {
  available: boolean;
  strategy: AiHostCompensationStrategy;
  compensatingActionId?: string | null;
  windowMs?: number | null;
  notes?: string | null;
};

export type AiHostExecutionPlan = {
  id: string;
  title: string;
  description: string;
  toolId: string | null;
  serverActionId: string;
  permission: AiActionPermissionRequirement;
  riskLevel: AiHostRiskLevel;
  requiresApproval: boolean;
  estimatedChanges: AiHostEstimatedChange[];
  affectedModules: Array<AiModuleId | "*">;
  affectedEntities: AiHostAffectedEntity[];
  undoAvailable: boolean;
  undo: AiHostUndoMetadata;
  payload: Record<string, unknown>;
  approvalState: AiHostApprovalState;
  queueState: AiHostQueueState;
  requestedBy: string | null;
  approvedBy: string | null;
  executedBy: string | null;
  workspaceId: string | null;
  organizationId: string | null;
  conversationId: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  toolResultSummary?: string | null;
};

export type AiHostActionDefinition = {
  id: string;
  title: string;
  description: string;
  serverActionId: string;
  moduleId: AiModuleId | "*";
  riskLevel: AiHostRiskLevel;
  permission: AiActionPermissionRequirement;
  undoAvailable: boolean;
  compensationStrategy: AiHostCompensationStrategy;
  toolIdHints: readonly string[];
  entityTypes: readonly string[];
};

export type AiHostInvokeInput = {
  plan: AiHostExecutionPlan;
  context: AiRuntimeContext;
  payload: Record<string, unknown>;
};

export type AiHostInvokeResult = {
  ok: boolean;
  summary: string;
  affectedEntities: AiHostAffectedEntity[];
  data?: Record<string, unknown>;
  errors?: AiHostError[];
};

/** Server-only invoker — never exposed to LLM or UI as a callable without approval. */
export type AiHostActionInvoker = (input: AiHostInvokeInput) => Promise<AiHostInvokeResult>;

export type AiHostActionBinding = AiHostActionDefinition & {
  invoke: AiHostActionInvoker | null;
};

export type AiHostPlanRequest = {
  context: AiRuntimeContext;
  toolId?: string | null;
  toolResult?: AiToolResult | null;
  serverActionId?: string | null;
  title?: string;
  description?: string;
  payload?: Record<string, unknown>;
  entityType?: string | null;
  entityId?: string | null;
  entityLabel?: string | null;
  conversationId?: string | null;
  riskLevel?: AiHostRiskLevel | AiToolRiskLevel;
};

export type AiHostApprovalDecision = {
  planId: string;
  decision: "approve" | "reject" | "cancel";
  actorUserId: string;
  actorRoles?: string[];
  note?: string;
};

export type AiHostExecuteRequest = {
  planId: string;
  context: AiRuntimeContext;
  actorUserId: string;
};

export type AiHostExecutionResult = {
  planId: string;
  queueState: AiHostQueueState;
  approvalState: AiHostApprovalState;
  success: boolean;
  summary: string;
  durationMs: number;
  affectedEntities: AiHostAffectedEntity[];
  errors: AiHostError[];
  undo: AiHostUndoMetadata;
  producedAt: string;
};

export type AiHostHistoryRecord = {
  id: string;
  planId: string;
  serverActionId: string;
  toolId: string | null;
  requestedBy: string | null;
  approvedBy: string | null;
  executedBy: string | null;
  riskLevel: AiHostRiskLevel;
  approvalState: AiHostApprovalState;
  queueState: AiHostQueueState;
  durationMs: number;
  success: boolean;
  summary: string;
  errors: AiHostError[];
  workspaceId: string | null;
  organizationId: string | null;
  recordedAt: string;
};

export type AiHostTelemetrySnapshot = {
  totalPlans: number;
  pendingCount: number;
  approvedCount: number;
  executedCount: number;
  succeededCount: number;
  failedCount: number;
  cancelledCount: number;
  rejectedCount: number;
  autoApprovedCount: number;
  averageDurationMs: number;
  byRiskLevel: Record<AiHostRiskLevel, number>;
  byServerAction: Record<string, number>;
};

export function mapToolRiskToHost(risk: AiToolRiskLevel | AiHostRiskLevel): AiHostRiskLevel {
  return risk;
}
