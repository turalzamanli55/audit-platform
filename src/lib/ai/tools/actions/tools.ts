import { defineAiTool } from "@/lib/ai/tools/utils";
import { writePermission } from "@/lib/ai/tools/permissions";
import type { AiToolRegistration, AiToolRiskLevel, AiToolSideEffect } from "@/lib/ai/tools/types";

const ACTION_OPS: Array<{
  op: string;
  name: string;
  risk: AiToolRiskLevel;
  sideEffect: AiToolSideEffect;
  confirm: boolean;
  hints: string[];
}> = [
  { op: "create", name: "Create", risk: "medium", sideEffect: "write", confirm: false, hints: ["create"] },
  { op: "update", name: "Update", risk: "medium", sideEffect: "write", confirm: false, hints: ["update", "edit"] },
  { op: "delete", name: "Delete", risk: "critical", sideEffect: "delete", confirm: true, hints: ["delete", "remove"] },
  { op: "archive", name: "Archive", risk: "high", sideEffect: "archive", confirm: true, hints: ["archive"] },
  { op: "restore", name: "Restore", risk: "high", sideEffect: "write", confirm: true, hints: ["restore"] },
  { op: "approve", name: "Approve", risk: "high", sideEffect: "approve", confirm: true, hints: ["approve"] },
  { op: "reject", name: "Reject", risk: "high", sideEffect: "write", confirm: true, hints: ["reject"] },
  { op: "submit", name: "Submit", risk: "medium", sideEffect: "write", confirm: false, hints: ["submit"] },
  { op: "return", name: "Return", risk: "medium", sideEffect: "write", confirm: false, hints: ["return"] },
  { op: "assign", name: "Assign", risk: "medium", sideEffect: "assign", confirm: false, hints: ["assign"] },
  { op: "complete", name: "Complete", risk: "medium", sideEffect: "write", confirm: false, hints: ["complete"] },
  { op: "validate", name: "Validate", risk: "low", sideEffect: "read", confirm: false, hints: ["validate"] },
];

/**
 * Action tools — wrappers that plan mutations.
 * Never call server actions or repositories.
 */
export const ACTION_AI_TOOLS: readonly AiToolRegistration[] = ACTION_OPS.map((item) =>
  defineAiTool({
    id: `tool.action.${item.op}`,
    name: item.name,
    moduleId: "*",
    description: `${item.name} action wrapper — plans a governed mutation without executing server actions.`,
    category: "audit",
    accessMode: item.confirm ? "WRITE" : item.op === "validate" ? "READ" : "WRITE",
    permissions: writePermission(),
    estimatedLatencyMs: 30,
    estimatedCost: "low",
    riskLevel: item.risk,
    sideEffects: [item.sideEffect],
    requiresConfirmation: item.confirm,
    intentHints: item.hints,
    plannerIntents: ["call_registered_action", "suggest"],
    inputSchema: {
      type: "object",
      properties: {
        entityType: { type: "string" },
        entityId: { type: "string" },
        payload: { type: "object" },
      },
    },
    execute: ({ args, executionMode, tool }) => {
      const entityType = typeof args.entityType === "string" ? args.entityType : "unknown";
      const entityId = typeof args.entityId === "string" ? args.entityId : null;
      return {
        status: executionMode === "dry_run" ? "dry_run" : "success",
        success: true,
        summary:
          executionMode === "dry_run"
            ? `Dry run: would ${item.op} ${entityType}${entityId ? `:${entityId}` : ""}.`
            : `${item.name} plan prepared — server action not invoked.`,
        details: {
          operation: item.op,
          entityType,
          entityId,
          payload: args.payload ?? null,
          serverAction: null,
          repository: null,
          requiresConfirmation: tool.requiresConfirmation,
          note: "Action tools never execute server actions. Host adapters may fulfill later.",
        },
        affectedObjects: entityId ? [{ type: entityType, id: entityId }] : [],
        warnings: item.confirm ? ["Destructive or privileged operation."] : [],
        errors: [],
        references: [],
        nextActions: [],
      };
    },
  }),
);
