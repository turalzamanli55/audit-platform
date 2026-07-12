/**
 * Enterprise Tool Runtime — type contracts.
 * LLM receives tool definitions only. Never repositories, server actions, or DB clients.
 */

import type { AiModuleId, AiPlannerIntent } from "@/lib/ai/constants";
import type { AiActionPermissionRequirement } from "@/lib/ai/types/actions";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";

export const AI_TOOL_CATEGORIES = [
  "navigation",
  "workspace",
  "workflow",
  "repository",
  "search",
  "validation",
  "reporting",
  "import",
  "audit",
  "accounting",
  "knowledge",
  "settings",
] as const;

export type AiToolCategory = (typeof AI_TOOL_CATEGORIES)[number];

export const AI_TOOL_ACCESS_MODES = ["READ", "WRITE", "ADMIN", "SYSTEM"] as const;
export type AiToolAccessMode = (typeof AI_TOOL_ACCESS_MODES)[number];

export const AI_TOOL_RISK_LEVELS = ["low", "medium", "high", "critical"] as const;
export type AiToolRiskLevel = (typeof AI_TOOL_RISK_LEVELS)[number];

export const AI_TOOL_EXECUTION_MODES = ["dry_run", "live"] as const;
export type AiToolExecutionMode = (typeof AI_TOOL_EXECUTION_MODES)[number];

export type AiToolJsonSchema = {
  type: "object";
  required?: string[];
  properties: Record<
    string,
    {
      type: "string" | "number" | "boolean" | "array" | "object" | "null";
      description?: string;
      items?: { type: string };
    }
  >;
};

export type AiToolSideEffect =
  | "none"
  | "navigate"
  | "read"
  | "write"
  | "delete"
  | "archive"
  | "approve"
  | "assign"
  | "workflow"
  | "system";

export type AiToolDefinition = {
  id: string;
  name: string;
  moduleId: AiModuleId | "*";
  description: string;
  category: AiToolCategory;
  accessMode: AiToolAccessMode;
  permissions: AiActionPermissionRequirement;
  inputSchema: AiToolJsonSchema;
  outputSchema: AiToolJsonSchema;
  estimatedLatencyMs: number;
  estimatedCost: "free" | "low" | "medium" | "high";
  riskLevel: AiToolRiskLevel;
  sideEffects: readonly AiToolSideEffect[];
  requiresConfirmation: boolean;
  intentHints: readonly string[];
  plannerIntents?: readonly AiPlannerIntent[];
  /** Optional Action Registry / host instruction kind. */
  instructionKind?: string;
};

export type AiToolLlmDefinition = {
  id: string;
  name: string;
  description: string;
  category: AiToolCategory;
  accessMode: AiToolAccessMode;
  inputSchema: AiToolJsonSchema;
  requiresConfirmation: boolean;
  riskLevel: AiToolRiskLevel;
};

export type AiToolStatus = "success" | "failed" | "denied" | "validation_failed" | "confirmation_required" | "dry_run";

export type AiToolResult = {
  toolId: string;
  status: AiToolStatus;
  success: boolean;
  summary: string;
  details: Record<string, unknown>;
  affectedObjects: Array<{ type: string; id: string; label?: string }>;
  warnings: string[];
  errors: Array<{ code: string; message: string }>;
  durationMs: number;
  references: Array<{ type: string; id: string; label: string }>;
  nextActions: Array<{ label: string; toolId?: string; actionId?: string }>;
  executionMode: AiToolExecutionMode;
  confirmationToken?: string;
  producedAt: string;
};

export type AiToolHandlerInput = {
  tool: AiToolDefinition;
  args: Record<string, unknown>;
  context: AiRuntimeContext;
  executionMode: AiToolExecutionMode;
  confirmed?: boolean;
  confirmationToken?: string;
  utterance?: string;
  planner?: AiPlannerDecision | null;
  skillId?: string | null;
};

export type AiToolHandler = (input: AiToolHandlerInput) => AiToolResult;

export type AiToolRegistration = {
  definition: AiToolDefinition;
  handler: AiToolHandler;
};

export type AiToolResolveRequest = {
  context: AiRuntimeContext;
  utterance?: string;
  planner?: AiPlannerDecision | null;
  skillId?: string | null;
  category?: AiToolCategory;
  moduleIds?: AiModuleId[];
  limit?: number;
};

export type AiToolResolveMatch = {
  tool: AiToolDefinition;
  score: number;
  reasons: string[];
};

export type AiToolResolveResult = {
  matches: AiToolResolveMatch[];
  selected: AiToolResolveMatch | null;
  resolvedAt: string;
};

export type AiToolExecuteRequest = {
  toolId: string;
  args?: Record<string, unknown>;
  context: AiRuntimeContext;
  executionMode?: AiToolExecutionMode;
  confirmed?: boolean;
  confirmationToken?: string;
  utterance?: string;
  planner?: AiPlannerDecision | null;
  skillId?: string | null;
  sessionId?: string | null;
  conversationId?: string | null;
  userId?: string | null;
};

export type AiToolHistoryRecord = {
  id: string;
  userId: string | null;
  sessionId: string | null;
  conversationId: string | null;
  toolId: string;
  arguments: Record<string, unknown>;
  startedAt: string;
  durationMs: number;
  status: AiToolStatus;
  resultSummary: string;
  executionMode: AiToolExecutionMode;
};

export type AiToolTelemetrySnapshot = {
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  permissionFailures: number;
  validationFailures: number;
  confirmationRequests: number;
  averageDurationMs: number;
  successRate: number;
  failureRate: number;
};
