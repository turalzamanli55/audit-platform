import type { AiToolDefinition } from "@/lib/ai/tools/types";
import type { AiRuntimeContext } from "@/lib/ai/types/context";

export type AiToolValidationIssue = {
  code: string;
  message: string;
  field?: string;
};

export type AiToolValidationResult =
  | { ok: true }
  | { ok: false; issues: AiToolValidationIssue[] };

/**
 * Tool validation engine — input, permissions context, required objects, dependencies.
 */
export class AiToolValidationEngine {
  validate(
    tool: AiToolDefinition,
    args: Record<string, unknown>,
    context: AiRuntimeContext,
  ): AiToolValidationResult {
    const issues: AiToolValidationIssue[] = [];
    const required = tool.inputSchema.required ?? [];

    for (const key of required) {
      const value = args[key];
      if (value === undefined || value === null || value === "") {
        issues.push({
          code: "missing_required_field",
          message: `Missing required argument "${key}".`,
          field: key,
        });
      }
    }

    for (const [key, schema] of Object.entries(tool.inputSchema.properties)) {
      if (!(key in args) || args[key] === undefined || args[key] === null) continue;
      const value = args[key];
      const actual =
        value === null
          ? "null"
          : Array.isArray(value)
            ? "array"
            : typeof value;
      if (schema.type !== "null" && actual !== schema.type && !(schema.type === "object" && actual === "object")) {
        issues.push({
          code: "invalid_field_type",
          message: `Argument "${key}" expected ${schema.type}, received ${actual}.`,
          field: key,
        });
      }
    }

    if (tool.permissions.requireCompany && !context.companyId && !args.companyId && !args.slug) {
      issues.push({
        code: "missing_company_context",
        message: "Company context or companyId/slug is required.",
      });
    }

    if (
      tool.permissions.requireEngagement &&
      !context.engagementId &&
      !args.engagementId &&
      !args.slug
    ) {
      issues.push({
        code: "missing_engagement_context",
        message: "Engagement context or engagementId/slug is required.",
      });
    }

    if (tool.category === "workflow" && !context.moduleId && !args.moduleId) {
      issues.push({
        code: "missing_workflow_module",
        message: "Workflow tools require a current module or moduleId argument.",
      });
    }

    if (issues.length > 0) return { ok: false, issues };
    return { ok: true };
  }
}

export { AiToolConfirmationEngine } from "@/lib/ai/tools/validation/confirmation-engine";
