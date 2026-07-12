import { createAiId } from "@/lib/ai/utils/id";
import type {
  AiToolDefinition,
  AiToolHandler,
  AiToolHandlerInput,
  AiToolJsonSchema,
  AiToolRegistration,
  AiToolResult,
  AiToolStatus,
} from "@/lib/ai/tools/types";

export function createEmptyToolResult(
  toolId: string,
  status: AiToolStatus,
  summary: string,
  options?: Partial<AiToolResult>,
): AiToolResult {
  return {
    toolId,
    status,
    success: status === "success" || status === "dry_run",
    summary,
    details: {},
    affectedObjects: [],
    warnings: [],
    errors: [],
    durationMs: 0,
    references: [],
    nextActions: [],
    executionMode: "dry_run",
    producedAt: new Date().toISOString(),
    ...options,
  };
}

export const DEFAULT_TOOL_INPUT_SCHEMA: AiToolJsonSchema = {
  type: "object",
  properties: {
    targetId: { type: "string", description: "Optional target entity id." },
    href: { type: "string", description: "Optional navigation href." },
    query: { type: "string", description: "Optional search query." },
  },
};

export const DEFAULT_TOOL_OUTPUT_SCHEMA: AiToolJsonSchema = {
  type: "object",
  required: ["status", "success", "summary"],
  properties: {
    status: { type: "string" },
    success: { type: "boolean" },
    summary: { type: "string" },
    details: { type: "object" },
  },
};

export type DefineAiToolInput = Omit<AiToolDefinition, "inputSchema" | "outputSchema"> & {
  inputSchema?: AiToolJsonSchema;
  outputSchema?: AiToolJsonSchema;
  /**
   * Produces structured tool outcome.
   * Must not call repositories, server actions, or LLMs.
   */
  execute: (input: AiToolHandlerInput) => Omit<AiToolResult, "toolId" | "durationMs" | "producedAt" | "executionMode"> & {
    durationMs?: number;
    producedAt?: string;
    executionMode?: AiToolResult["executionMode"];
  };
};

export function defineAiTool(input: DefineAiToolInput): AiToolRegistration {
  const definition: AiToolDefinition = {
    id: input.id,
    name: input.name,
    moduleId: input.moduleId,
    description: input.description,
    category: input.category,
    accessMode: input.accessMode,
    permissions: input.permissions,
    inputSchema: input.inputSchema ?? DEFAULT_TOOL_INPUT_SCHEMA,
    outputSchema: input.outputSchema ?? DEFAULT_TOOL_OUTPUT_SCHEMA,
    estimatedLatencyMs: input.estimatedLatencyMs,
    estimatedCost: input.estimatedCost,
    riskLevel: input.riskLevel,
    sideEffects: input.sideEffects,
    requiresConfirmation: input.requiresConfirmation,
    intentHints: input.intentHints,
    plannerIntents: input.plannerIntents,
    instructionKind: input.instructionKind,
  };

  const handler: AiToolHandler = (execution) => {
    const started = Date.now();
    const partial = input.execute(execution);
    return {
      toolId: definition.id,
      durationMs: partial.durationMs ?? Date.now() - started,
      producedAt: partial.producedAt ?? new Date().toISOString(),
      executionMode: partial.executionMode ?? execution.executionMode,
      status: partial.status,
      success: partial.success,
      summary: partial.summary,
      details: partial.details,
      affectedObjects: partial.affectedObjects,
      warnings: partial.warnings,
      errors: partial.errors,
      references: partial.references,
      nextActions: partial.nextActions,
      confirmationToken: partial.confirmationToken,
    };
  };

  return { definition, handler };
}

export function createConfirmationToken(toolId: string): string {
  return createAiId(`confirm_${toolId.replace(/[^a-z0-9]+/gi, "_")}`);
}

export function asStringArg(args: Record<string, unknown>, key: string): string | null {
  const value = args[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
