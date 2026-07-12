import { TRIAL_BALANCE_PERMISSIONS } from "@/constants/trial-balance";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const TRIAL_BALANCE_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "trial-balance.explain",
    name: "Explain Trial Balance",
    moduleId: "trial-balance",
    description: "Explain trial balance module purpose.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission([TRIAL_BALANCE_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["explain trial balance", "what is trial balance"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    buildContext: ({ knowledge }) => ({
      title: "Explain Trial Balance",
      description: knowledge?.purpose ?? "Trial balance workspace.",
      structuredContext: { focus: "tb_explanation" },
    }),
  }),
  defineAiSkill({
    id: "trial-balance.account_summary",
    name: "Account Summary",
    moduleId: "trial-balance",
    description: "Structured trial balance account summary context.",
    category: "accounting",
    capabilities: ["summarize", "list"],
    permission: workspaceReadPermission([TRIAL_BALANCE_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["account summary", "tb accounts", "trial balance accounts"],
    plannerIntents: ["answer"],
    priority: 65,
    buildContext: ({ context }) => ({
      title: "Account Summary",
      description: "Account summary envelope.",
      structuredContext: {
        focus: "tb_account_summary",
        engagementId: context.engagementId,
        groupings: ["assets", "liabilities", "equity", "income", "expenses"],
      },
    }),
  }),
  defineAiSkill({
    id: "trial-balance.adjustment_summary",
    name: "Adjustment Summary",
    moduleId: "trial-balance",
    description: "Structured adjustment summary context.",
    category: "accounting",
    capabilities: ["summarize"],
    permission: workspaceReadPermission([TRIAL_BALANCE_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["adjustment summary", "tb adjustments", "journal adjustments"],
    plannerIntents: ["answer"],
    priority: 68,
    buildContext: () => ({
      title: "Adjustment Summary",
      description: "Adjustment envelope — no journal posting.",
      structuredContext: {
        focus: "tb_adjustment_summary",
        adjustmentKinds: ["proposed", "posted", "waived"],
      },
    }),
  }),
  defineAiSkill({
    id: "trial-balance.validation_summary",
    name: "Validation Summary",
    moduleId: "trial-balance",
    description: "Structured trial balance validation context.",
    category: "validation",
    capabilities: ["validate", "status"],
    permission: workspaceReadPermission([TRIAL_BALANCE_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["validation summary", "tb validation", "validate trial balance"],
    plannerIntents: ["answer", "suggest"],
    priority: 80,
    buildContext: () => ({
      title: "Validation Summary",
      description: "Validation checks envelope.",
      structuredContext: {
        focus: "tb_validation_summary",
        checks: ["debits_equal_credits", "mapping_complete", "orphan_accounts"],
      },
    }),
  }),
];
