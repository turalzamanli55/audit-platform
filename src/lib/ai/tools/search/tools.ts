import { defineAiTool } from "@/lib/ai/tools/utils";
import { readPermission } from "@/lib/ai/tools/permissions";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { TRIAL_BALANCE_PERMISSIONS } from "@/constants/trial-balance";
import type { AiToolRegistration } from "@/lib/ai/tools/types";

function searchTool(input: {
  id: string;
  name: string;
  moduleId: AiToolRegistration["definition"]["moduleId"];
  description: string;
  hints: string[];
  anyOf?: string[];
  entityType: string;
}): AiToolRegistration {
  return defineAiTool({
    id: input.id,
    name: input.name,
    moduleId: input.moduleId,
    description: input.description,
    category: "search",
    accessMode: "READ",
    permissions: readPermission(input.anyOf),
    estimatedLatencyMs: 40,
    estimatedCost: "low",
    riskLevel: "low",
    sideEffects: ["read"],
    requiresConfirmation: false,
    intentHints: input.hints,
    plannerIntents: ["search"],
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: {
        query: { type: "string", description: "Search query." },
        limit: { type: "number" },
      },
    },
    execute: ({ args, executionMode }) => {
      const query = String(args.query ?? "");
      const limit = typeof args.limit === "number" ? args.limit : 10;
      return {
        status: executionMode === "dry_run" ? "dry_run" : "success",
        success: true,
        summary:
          executionMode === "dry_run"
            ? `Dry run: would search ${input.entityType} for "${query}".`
            : `Search plan prepared for ${input.entityType}.`,
        details: {
          entityType: input.entityType,
          query,
          limit,
          repositoryCall: null,
          note: "Search tools never query repositories directly. Host/adapters fulfill later.",
        },
        affectedObjects: [],
        warnings: [],
        errors: [],
        references: [{ type: "search", id: input.entityType, label: input.name }],
        nextActions: [],
      };
    },
  });
}

export const SEARCH_AI_TOOLS: readonly AiToolRegistration[] = [
  searchTool({
    id: "tool.search.companies",
    name: "Search Companies",
    moduleId: "companies",
    description: "Plan a company search — does not query the company repository.",
    hints: ["search companies", "find company"],
    anyOf: [COMPANY_PERMISSIONS.READ],
    entityType: "companies",
  }),
  searchTool({
    id: "tool.search.engagements",
    name: "Search Engagements",
    moduleId: "engagements",
    description: "Plan an engagement search — does not query the engagement repository.",
    hints: ["search engagements", "find engagement"],
    anyOf: [ENGAGEMENT_PERMISSIONS.READ],
    entityType: "engagements",
  }),
  searchTool({
    id: "tool.search.trial_balance",
    name: "Search Trial Balance",
    moduleId: "trial-balance",
    description: "Plan a trial balance account search — no repository call.",
    hints: ["search trial balance", "find account"],
    anyOf: [TRIAL_BALANCE_PERMISSIONS.READ],
    entityType: "trial_balance",
  }),
  searchTool({
    id: "tool.search.documents",
    name: "Search Documents",
    moduleId: "*",
    description: "Plan a document search against knowledge/document contracts.",
    hints: ["search documents", "find document"],
    entityType: "documents",
  }),
  searchTool({
    id: "tool.search.standards",
    name: "Search Standards",
    moduleId: "*",
    description: "Plan a standards search (ISA/IFRS/IAS) via knowledge graph contracts.",
    hints: ["search standards", "find isa", "find ifrs"],
    entityType: "standards",
  }),
  searchTool({
    id: "tool.search.workflows",
    name: "Search Workflows",
    moduleId: "*",
    description: "Plan a workflow step search — no workflow mutation.",
    hints: ["search workflows", "find workflow"],
    entityType: "workflows",
  }),
  searchTool({
    id: "tool.search.help",
    name: "Search Help",
    moduleId: "*",
    description: "Plan a help article search — documentation contracts only.",
    hints: ["search help", "find help", "help article"],
    entityType: "help",
  }),
];
