import { FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const FINANCIAL_STATEMENTS_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "financial-statements.explain",
    name: "Explain Statements",
    moduleId: "financial-statements",
    description: "Explain financial statements module purpose.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission([FINANCIAL_STATEMENTS_PERMISSIONS.READ], {
      requireEngagement: false,
    }),
    intentHints: ["explain statements", "explain financial statements", "what are fs"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    buildContext: ({ knowledge }) => ({
      title: "Explain Statements",
      description: knowledge?.purpose ?? "Financial statements package workspace.",
      structuredContext: { focus: "fs_explanation" },
    }),
  }),
  defineAiSkill({
    id: "financial-statements.status",
    name: "Statement Status",
    moduleId: "financial-statements",
    description: "Structured financial statement status context.",
    category: "workflow",
    capabilities: ["status"],
    permission: workspaceReadPermission([FINANCIAL_STATEMENTS_PERMISSIONS.READ], {
      requireEngagement: false,
    }),
    intentHints: ["statement status", "fs status", "financial statements status"],
    plannerIntents: ["answer"],
    priority: 75,
    buildContext: ({ context }) => ({
      title: "Statement Status",
      description: "Package status envelope.",
      structuredContext: {
        focus: "fs_status",
        engagementId: context.engagementId,
        workflowStatus: context.workflowStatus,
      },
    }),
  }),
  defineAiSkill({
    id: "financial-statements.missing_accounts",
    name: "Missing Accounts",
    moduleId: "financial-statements",
    description: "Structured missing accounts context.",
    category: "validation",
    capabilities: ["validate", "list"],
    permission: workspaceReadPermission([FINANCIAL_STATEMENTS_PERMISSIONS.READ], {
      requireEngagement: false,
    }),
    intentHints: ["missing accounts", "missing fs accounts"],
    plannerIntents: ["search", "suggest"],
    priority: 78,
    buildContext: () => ({
      title: "Missing Accounts",
      severity: "warning",
      description: "Missing accounts checklist envelope.",
      structuredContext: {
        focus: "fs_missing_accounts",
        statementKinds: ["balance_sheet", "income_statement", "cash_flow", "equity"],
      },
    }),
  }),
  defineAiSkill({
    id: "financial-statements.balance_validation",
    name: "Balance Validation",
    moduleId: "financial-statements",
    description: "Structured balance validation context.",
    category: "accounting",
    capabilities: ["validate"],
    permission: workspaceReadPermission([FINANCIAL_STATEMENTS_PERMISSIONS.READ], {
      requireEngagement: false,
    }),
    intentHints: ["balance validation", "validate balances", "fs validation"],
    plannerIntents: ["answer", "suggest"],
    priority: 80,
    buildContext: () => ({
      title: "Balance Validation",
      description: "Validation axes envelope — no ledger writes.",
      structuredContext: {
        focus: "fs_balance_validation",
        checks: ["tie_out", "cross_cast", "comparative", "disclosure_link"],
      },
    }),
  }),
];
