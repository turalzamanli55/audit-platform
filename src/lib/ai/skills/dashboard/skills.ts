import { defineAiSkill } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const DASHBOARD_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "dashboard.explain",
    name: "Explain Dashboard",
    moduleId: "dashboard",
    description: "Explain the purpose and structure of the workspace dashboard.",
    category: "explanation",
    capabilities: ["explain", "summarize"],
    intentHints: ["explain dashboard", "what is dashboard", "dashboard overview"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    relatedActionIds: ["platform.open_module"],
    buildContext: ({ knowledge, context }) => ({
      title: "Explain Dashboard",
      description: knowledge?.purpose ?? "Workspace command center for KPIs and navigation.",
      structuredContext: {
        focus: "dashboard_explanation",
        sections: knowledge?.navigation.sections ?? ["overview"],
        kpisAvailable: true,
        currentRoute: context.route,
      },
    }),
  }),
  defineAiSkill({
    id: "dashboard.open_widget",
    name: "Open Dashboard Widget",
    moduleId: "dashboard",
    description: "Identify dashboard widgets the user may open — does not navigate.",
    category: "navigation",
    capabilities: ["navigate", "list"],
    intentHints: ["open widget", "dashboard widget", "open kpi"],
    plannerIntents: ["navigate", "open_module"],
    priority: 60,
    relatedActionIds: ["platform.navigate", "platform.highlight_component"],
    buildContext: ({ payload }) => ({
      title: "Open Dashboard Widget",
      description: "Structured widget targets for host navigation — not executed here.",
      structuredContext: {
        focus: "dashboard_widget",
        widgetId: typeof payload?.widgetId === "string" ? payload.widgetId : null,
        candidateWidgets: ["kpi", "activity", "tasks", "calendar", "ai"],
      },
      recommendedActions: [
        {
          label: "Highlight widget",
          kind: "highlight_component",
          actionId: "platform.highlight_component",
          estimatedResult: "Would highlight a dashboard widget.",
        },
      ],
    }),
  }),
  defineAiSkill({
    id: "dashboard.summarize",
    name: "Summarize Dashboard",
    moduleId: "dashboard",
    description: "Produce a structured dashboard summary context object.",
    category: "analysis",
    capabilities: ["summarize", "status"],
    intentHints: ["summarize dashboard", "dashboard summary", "workspace summary"],
    plannerIntents: ["answer", "suggest"],
    priority: 65,
    buildContext: ({ knowledge, context }) => ({
      title: "Summarize Dashboard",
      description: "Structured summary envelope for the current workspace dashboard.",
      structuredContext: {
        focus: "dashboard_summary",
        workflow: knowledge?.workflow ?? [],
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        attentionAreas: ["open_tasks", "deadlines", "recent_activity"],
      },
    }),
  }),
];
