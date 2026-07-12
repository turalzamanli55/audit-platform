import type { AiToolRegistry } from "@/lib/ai/tools/registry";
import type { AiToolExecuteRequest, AiToolResult } from "@/lib/ai/tools/types";
import { AiToolPermissionEngine } from "@/lib/ai/tools/permissions";
import { AiToolValidationEngine } from "@/lib/ai/tools/validation";
import { AiToolConfirmationEngine } from "@/lib/ai/tools/validation/confirmation-engine";
import { AiToolHistoryStore } from "@/lib/ai/tools/history";
import { AiToolTelemetry } from "@/lib/ai/tools/telemetry";
import { mapToolFailure } from "@/lib/ai/tools/results";

/**
 * Tool Executor — validates, authorizes, confirms, executes handlers, records telemetry.
 * Never exposes repositories or server actions directly.
 * Default execution mode is dry_run.
 */
export class AiToolExecutor {
  readonly permissions = new AiToolPermissionEngine();
  readonly validation = new AiToolValidationEngine();
  readonly confirmation = new AiToolConfirmationEngine();
  readonly history = new AiToolHistoryStore();
  readonly telemetry = new AiToolTelemetry();

  constructor(private readonly registry: AiToolRegistry) {}

  execute(request: AiToolExecuteRequest): AiToolResult {
    const startedAt = new Date().toISOString();
    const startedMs = Date.now();
    const executionMode = request.executionMode ?? "dry_run";
    const args = request.args ?? {};

    const registration = this.registry.findTool(request.toolId);
    if (!registration) {
      const result = mapToolFailure(request.toolId, "unknown_tool", `Unknown tool: ${request.toolId}`, {
        status: "failed",
        executionMode,
        durationMs: Date.now() - startedMs,
      });
      this.telemetry.observe(result);
      this.history.record(request, result, startedAt);
      return result;
    }

    const tool = registration.definition;
    const permission = this.permissions.evaluate(request.context, tool, args);
    if (!permission.allowed) {
      const result = mapToolFailure(tool.id, permission.code, permission.message, {
        status: "denied",
        executionMode,
        durationMs: Date.now() - startedMs,
      });
      this.telemetry.observe(result);
      this.history.record(request, result, startedAt);
      return result;
    }

    const validated = this.validation.validate(tool, args, request.context);
    if (!validated.ok) {
      const result = mapToolFailure(tool.id, "validation_failed", "Tool input validation failed.", {
        status: "validation_failed",
        executionMode,
        durationMs: Date.now() - startedMs,
        details: { issues: validated.issues },
        errors: validated.issues.map((issue) => ({ code: issue.code, message: issue.message })),
      });
      this.telemetry.observe(result);
      this.history.record(request, result, startedAt);
      return result;
    }

    if (this.confirmation.requiresConfirmation(tool)) {
      const confirmed =
        request.confirmed === true &&
        typeof request.confirmationToken === "string" &&
        this.confirmation.consume(request.confirmationToken, tool.id);
      if (!confirmed) {
        const token = this.confirmation.issue(tool.id, args);
        const result: AiToolResult = {
          toolId: tool.id,
          status: "confirmation_required",
          success: false,
          summary: `Confirmation required before executing ${tool.name}.`,
          details: {
            riskLevel: tool.riskLevel,
            sideEffects: tool.sideEffects,
            accessMode: tool.accessMode,
          },
          affectedObjects: [],
          warnings: ["Dangerous or privileged tool — confirm explicitly to proceed."],
          errors: [],
          durationMs: Date.now() - startedMs,
          references: [],
          nextActions: [{ label: "Confirm and retry", toolId: tool.id }],
          executionMode,
          confirmationToken: token,
          producedAt: new Date().toISOString(),
        };
        this.telemetry.observe(result);
        this.history.record(request, result, startedAt);
        return result;
      }
    }

    try {
      const result = registration.handler({
        tool,
        args,
        context: request.context,
        executionMode,
        confirmed: request.confirmed,
        confirmationToken: request.confirmationToken,
        utterance: request.utterance,
        planner: request.planner ?? null,
        skillId: request.skillId ?? null,
      });
      const finalized: AiToolResult = {
        ...result,
        durationMs: result.durationMs || Date.now() - startedMs,
        executionMode,
      };
      this.telemetry.observe(finalized);
      this.history.record(request, finalized, startedAt);
      return finalized;
    } catch (error) {
      const result = mapToolFailure(
        tool.id,
        "handler_error",
        "Tool handler failed with a structured runtime error.",
        {
          status: "failed",
          executionMode,
          durationMs: Date.now() - startedMs,
          details: {
            message: error instanceof Error ? error.message : "Unknown handler failure",
          },
        },
      );
      this.telemetry.observe(result);
      this.history.record(request, result, startedAt);
      return result;
    }
  }
}
