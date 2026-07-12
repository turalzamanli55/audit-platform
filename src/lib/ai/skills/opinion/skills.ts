import { OPINION_PERMISSIONS } from "@/constants/opinion";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const OPINION_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "opinion.status",
    name: "Opinion Status",
    moduleId: "opinion",
    description: "Structured audit opinion status context.",
    category: "workflow",
    capabilities: ["status"],
    permission: workspaceReadPermission([OPINION_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["opinion status", "audit opinion status"],
    plannerIntents: ["answer"],
    priority: 75,
    buildContext: ({ context }) => ({
      title: "Opinion Status",
      description: "Opinion status envelope — no opinion mutation.",
      structuredContext: {
        focus: "opinion_status",
        engagementId: context.engagementId,
        workflowStatus: context.workflowStatus,
      },
    }),
  }),
  defineAiSkill({
    id: "opinion.types",
    name: "Opinion Types",
    moduleId: "opinion",
    description: "Explain available opinion types.",
    category: "knowledge",
    capabilities: ["explain", "list"],
    permission: workspaceReadPermission([OPINION_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["opinion types", "types of opinion", "unqualified qualified"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    buildContext: () => ({
      title: "Opinion Types",
      description: "Opinion type taxonomy for professional selection.",
      structuredContext: {
        focus: "opinion_types",
        types: ["unmodified", "qualified", "adverse", "disclaimer"],
      },
    }),
  }),
  defineAiSkill({
    id: "opinion.recommendation",
    name: "Opinion Recommendation",
    moduleId: "opinion",
    description: "Structured opinion recommendation context — never decides.",
    category: "recommendation",
    capabilities: ["recommend"],
    permission: workspaceReadPermission([OPINION_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["opinion recommendation", "recommend opinion", "suggested opinion"],
    plannerIntents: ["suggest"],
    priority: 80,
    buildContext: ({ context }) => ({
      title: "Opinion Recommendation",
      severity: "warning",
      description: "Recommendation envelope assisting judgment — never authoritative.",
      confidence: 0.55,
      structuredContext: {
        focus: "opinion_recommendation",
        engagementId: context.engagementId,
        principle: "AI assists professional judgment and does not replace it.",
      },
    }),
  }),
];
