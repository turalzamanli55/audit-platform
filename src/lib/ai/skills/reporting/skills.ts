import { REPORTING_PERMISSIONS } from "@/constants/reporting";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const REPORTING_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "reporting.explain",
    name: "Explain Reporting",
    moduleId: "reporting",
    description: "Explain reporting module purpose and workflow.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission([REPORTING_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["explain reporting", "what is reporting"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    buildContext: ({ knowledge }) => ({
      title: "Explain Reporting",
      description: knowledge?.purpose ?? "Audit reporting workspace.",
      structuredContext: { focus: "reporting_explanation" },
    }),
  }),
  defineAiSkill({
    id: "reporting.status",
    name: "Reporting Status",
    moduleId: "reporting",
    description: "Structured reporting status context.",
    category: "workflow",
    capabilities: ["status"],
    permission: workspaceReadPermission([REPORTING_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["reporting status", "report status"],
    plannerIntents: ["answer"],
    priority: 75,
    buildContext: ({ context, knowledge }) => ({
      title: "Reporting Status",
      description: "Status envelope for reporting package.",
      structuredContext: {
        focus: "reporting_status",
        engagementId: context.engagementId,
        workflowStatus: context.workflowStatus,
        sections: knowledge?.navigation.sections ?? [],
      },
    }),
  }),
  defineAiSkill({
    id: "reporting.missing_sections",
    name: "Missing Sections",
    moduleId: "reporting",
    description: "Structured missing reporting sections context.",
    category: "validation",
    capabilities: ["validate", "list"],
    permission: workspaceReadPermission([REPORTING_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["missing sections", "missing report sections", "incomplete report"],
    plannerIntents: ["search", "suggest"],
    priority: 78,
    buildContext: ({ knowledge }) => ({
      title: "Missing Sections",
      severity: "warning",
      description: "Missing sections checklist envelope.",
      structuredContext: {
        focus: "reporting_missing_sections",
        sectionCatalog: knowledge?.navigation.sections ?? [],
      },
    }),
  }),
  defineAiSkill({
    id: "reporting.recommendations",
    name: "Recommendations",
    moduleId: "reporting",
    description: "Structured reporting recommendations context.",
    category: "recommendation",
    capabilities: ["recommend"],
    permission: workspaceReadPermission([REPORTING_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["reporting recommendations", "report recommendations"],
    plannerIntents: ["suggest"],
    priority: 65,
    buildContext: () => ({
      title: "Recommendations",
      description: "Recommendation envelope for reporting completion path.",
      structuredContext: {
        focus: "reporting_recommendations",
        recommendationKinds: ["complete_section", "resolve_review_note", "attach_exhibit"],
      },
    }),
  }),
];
