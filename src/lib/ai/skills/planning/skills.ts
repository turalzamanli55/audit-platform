import { PLANNING_PERMISSIONS } from "@/constants/planning";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const PLANNING_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "planning.explain",
    name: "Explain Planning",
    moduleId: "planning",
    description: "Explain planning module purpose and workflow.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission([PLANNING_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["explain planning", "what is planning", "planning overview"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    relatedActionIds: ["platform.open_module"],
    buildContext: ({ knowledge }) => ({
      title: "Explain Planning",
      description: knowledge?.purpose ?? "Engagement planning workspace.",
      structuredContext: { focus: "planning_explanation", workflow: knowledge?.workflow ?? [] },
    }),
  }),
  defineAiSkill({
    id: "planning.missing_items",
    name: "Missing Planning Items",
    moduleId: "planning",
    description: "Structured missing-items checklist context for planning.",
    category: "validation",
    capabilities: ["validate", "list"],
    permission: workspaceReadPermission([PLANNING_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["missing planning", "missing items", "planning gaps"],
    plannerIntents: ["suggest", "search"],
    priority: 75,
    buildContext: ({ knowledge }) => ({
      title: "Missing Planning Items",
      severity: "warning",
      description: "Checklist envelope for incomplete planning artifacts — no mutation.",
      structuredContext: {
        focus: "planning_missing_items",
        checklistAxes: knowledge?.inputs ?? ["scope", "team", "materiality_link", "risk_link"],
      },
    }),
  }),
  defineAiSkill({
    id: "planning.readiness",
    name: "Planning Readiness",
    moduleId: "planning",
    description: "Structured planning readiness assessment context.",
    category: "planning",
    capabilities: ["status", "validate"],
    permission: workspaceReadPermission([PLANNING_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["planning readiness", "ready for fieldwork", "planning complete"],
    plannerIntents: ["answer", "suggest"],
    priority: 80,
    buildContext: ({ knowledge, context }) => ({
      title: "Planning Readiness",
      description: "Readiness envelope for planning exit criteria.",
      structuredContext: {
        focus: "planning_readiness",
        workflowStatus: context.workflowStatus,
        exitCriteria: knowledge?.outputs ?? [],
      },
    }),
  }),
  defineAiSkill({
    id: "planning.summary",
    name: "Planning Summary",
    moduleId: "planning",
    description: "Structured planning summary context.",
    category: "analysis",
    capabilities: ["summarize"],
    permission: workspaceReadPermission([PLANNING_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["planning summary", "summarize planning"],
    plannerIntents: ["answer", "explain"],
    priority: 65,
    buildContext: ({ knowledge, context }) => ({
      title: "Planning Summary",
      description: "Summary envelope for planning state.",
      structuredContext: {
        focus: "planning_summary",
        engagementId: context.engagementId,
        sections: knowledge?.navigation.sections ?? [],
      },
    }),
  }),
];
