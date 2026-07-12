import { AI_MODULES, type AiModuleId } from "@/lib/ai/constants";
import { AI_MODULE_CATALOG } from "@/lib/ai/knowledge/module-catalog";
import { defineAiTool } from "@/lib/ai/tools/utils";
import { readPermission } from "@/lib/ai/tools/permissions";
import type { AiToolRegistration } from "@/lib/ai/tools/types";

const NAV_MODULES: Array<{ moduleId: AiModuleId; name: string; hints: string[] }> = [
  { moduleId: "dashboard", name: "Open Dashboard", hints: ["open dashboard", "go to dashboard"] },
  { moduleId: "companies", name: "Open Company", hints: ["open company", "go to company"] },
  { moduleId: "engagements", name: "Open Engagement", hints: ["open engagement", "go to engagement"] },
  { moduleId: "planning", name: "Open Planning", hints: ["open planning", "go to planning"] },
  { moduleId: "materiality", name: "Open Materiality", hints: ["open materiality", "go to materiality"] },
  { moduleId: "risk-assessment", name: "Open Risk", hints: ["open risk", "open risk assessment"] },
  { moduleId: "fieldwork", name: "Open Fieldwork", hints: ["open fieldwork", "go to fieldwork"] },
  { moduleId: "review", name: "Open Review", hints: ["open review", "go to review"] },
  { moduleId: "completion", name: "Open Completion", hints: ["open completion", "go to completion"] },
  { moduleId: "reporting", name: "Open Reporting", hints: ["open reporting", "go to reporting"] },
  { moduleId: "opinion", name: "Open Opinion", hints: ["open opinion", "go to opinion"] },
  { moduleId: "trial-balance", name: "Open Trial Balance", hints: ["open trial balance", "go to trial balance"] },
  {
    moduleId: "financial-statements",
    name: "Open Financial Statements",
    hints: ["open financial statements", "open statements"],
  },
  { moduleId: "uaie", name: "Open UAIE", hints: ["open uaie", "go to uaie"] },
  {
    moduleId: "import-intelligence",
    name: "Open Import Intelligence",
    hints: ["open import intelligence", "go to import intelligence"],
  },
];

function moduleHref(moduleId: AiModuleId): string {
  return AI_MODULE_CATALOG.find((module) => module.id === moduleId)?.navigation.basePath ?? `/app/${moduleId}`;
}

export const NAVIGATION_AI_TOOLS: readonly AiToolRegistration[] = [
  defineAiTool({
    id: "tool.navigation.open_module",
    name: "Open Module",
    moduleId: "*",
    description: "Open a registered platform module — returns navigation instruction only.",
    category: "navigation",
    accessMode: "READ",
    permissions: readPermission(),
    estimatedLatencyMs: 20,
    estimatedCost: "free",
    riskLevel: "low",
    sideEffects: ["navigate"],
    requiresConfirmation: false,
    intentHints: ["open module", "go to module", "navigate module"],
    plannerIntents: ["navigate", "open_module"],
    instructionKind: "open_module",
    inputSchema: {
      type: "object",
      required: ["moduleId"],
      properties: {
        moduleId: { type: "string", description: "Target module id." },
        href: { type: "string" },
      },
    },
    execute: ({ args, executionMode }) => {
      const moduleId = String(args.moduleId ?? "");
      const allowed = (AI_MODULES as readonly string[]).includes(moduleId);
      if (!allowed) {
        return {
          status: "validation_failed",
          success: false,
          summary: `Unknown module "${moduleId}".`,
          details: {},
          affectedObjects: [],
          warnings: [],
          errors: [{ code: "unknown_module", message: `Module ${moduleId} is not registered.` }],
          references: [],
          nextActions: [],
        };
      }
      const href = typeof args.href === "string" ? args.href : moduleHref(moduleId as AiModuleId);
      return {
        status: executionMode === "dry_run" ? "dry_run" : "success",
        success: true,
        summary:
          executionMode === "dry_run"
            ? `Dry run: would open module ${moduleId}.`
            : `Navigation instruction prepared for module ${moduleId}.`,
        details: {
          instruction: { type: "open_module", moduleId, href },
          executed: false,
          note: "Host must apply navigation. Tool Runtime never routes itself.",
        },
        affectedObjects: [{ type: "module", id: moduleId }],
        warnings: [],
        errors: [],
        references: [{ type: "module", id: moduleId, label: moduleId }],
        nextActions: [],
      };
    },
  }),
  ...NAV_MODULES.map((item) =>
    defineAiTool({
      id: `tool.navigation.open_${item.moduleId.replace(/-/g, "_")}`,
      name: item.name,
      moduleId: item.moduleId,
      description: `${item.name} — returns navigation instruction only.`,
      category: "navigation",
      accessMode: "READ",
      permissions: readPermission(),
      estimatedLatencyMs: 15,
      estimatedCost: "free",
      riskLevel: "low",
      sideEffects: ["navigate"],
      requiresConfirmation: false,
      intentHints: item.hints,
      plannerIntents: ["navigate", "open_module"],
      instructionKind: "open_module",
      execute: ({ executionMode, context, args }) => {
        const href =
          typeof args.href === "string" ? args.href : moduleHref(item.moduleId);
        return {
          status: executionMode === "dry_run" ? "dry_run" : "success",
          success: true,
          summary:
            executionMode === "dry_run"
              ? `Dry run: would open ${item.moduleId}.`
              : `Navigation instruction prepared for ${item.moduleId}.`,
          details: {
            instruction: { type: "open_module", moduleId: item.moduleId, href },
            route: context.route,
            executed: false,
          },
          affectedObjects: [{ type: "module", id: item.moduleId }],
          warnings: [],
          errors: [],
          references: [{ type: "route", id: href, label: href }],
          nextActions: [],
        };
      },
    }),
  ),
];
