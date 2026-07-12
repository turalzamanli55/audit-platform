import { defineAiTool } from "@/lib/ai/tools/utils";
import { readPermission } from "@/lib/ai/tools/permissions";
import type { AiToolRegistration } from "@/lib/ai/tools/types";

function workflowTool(input: {
  id: string;
  name: string;
  description: string;
  hints: string[];
  focus: string;
  instructionKind?: string;
}): AiToolRegistration {
  return defineAiTool({
    id: input.id,
    name: input.name,
    moduleId: "*",
    description: input.description,
    category: "workflow",
    accessMode: "READ",
    permissions: readPermission(),
    estimatedLatencyMs: 25,
    estimatedCost: "free",
    riskLevel: "low",
    sideEffects: input.instructionKind === "continue_workflow" ? ["workflow"] : ["none"],
    requiresConfirmation: false,
    intentHints: input.hints,
    plannerIntents: ["suggest", "answer", "explain", "call_registered_action"],
    instructionKind: input.instructionKind,
    execute: ({ context, executionMode, args }) => {
      const moduleId = String(args.moduleId ?? context.moduleId ?? "dashboard");
      return {
        status: executionMode === "dry_run" ? "dry_run" : "success",
        success: true,
        summary:
          executionMode === "dry_run"
            ? `Dry run: ${input.name} for module ${moduleId}.`
            : `${input.name} envelope prepared for ${moduleId}.`,
        details: {
          focus: input.focus,
          moduleId,
          workflowId: context.workflowId,
          workflowStatus: context.workflowStatus,
          instruction: input.instructionKind
            ? { type: input.instructionKind, moduleId }
            : null,
          executed: false,
        },
        affectedObjects: [{ type: "module", id: moduleId }],
        warnings: [],
        errors: [],
        references: [{ type: "workflow", id: context.workflowId ?? moduleId, label: input.name }],
        nextActions: input.instructionKind
          ? [{ label: "Continue via Action Registry", actionId: "platform.continue_workflow" }]
          : [],
      };
    },
  });
}

export const WORKFLOW_AI_TOOLS: readonly AiToolRegistration[] = [
  workflowTool({
    id: "tool.workflow.show_next_step",
    name: "Show Next Step",
    description: "Describe the next workflow step — does not advance state.",
    hints: ["next step", "show next step", "what next"],
    focus: "next_step",
  }),
  workflowTool({
    id: "tool.workflow.show_previous_step",
    name: "Show Previous Step",
    description: "Describe the previous workflow step — does not rewind state.",
    hints: ["previous step", "show previous step"],
    focus: "previous_step",
  }),
  workflowTool({
    id: "tool.workflow.continue",
    name: "Continue Workflow",
    description: "Prepare continue-workflow instruction — host/Action Registry applies it.",
    hints: ["continue workflow", "advance workflow"],
    focus: "continue_workflow",
    instructionKind: "continue_workflow",
  }),
  workflowTool({
    id: "tool.workflow.explain_current_step",
    name: "Explain Current Step",
    description: "Explain the current workflow step from context.",
    hints: ["explain current step", "current step"],
    focus: "explain_current_step",
  }),
  workflowTool({
    id: "tool.workflow.progress",
    name: "Workflow Progress",
    description: "Structured workflow progress envelope.",
    hints: ["workflow progress", "progress"],
    focus: "workflow_progress",
  }),
];
