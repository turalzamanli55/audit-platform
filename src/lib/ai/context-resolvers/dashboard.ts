import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const dashboardContextResolver = defineModuleResolver({
  moduleId: "dashboard",
  displayName: "Dashboard",
  summary: "Explains KPIs, charts, deadlines, notifications, and open work.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_kpis",
      kind: "explain",
      labelId: "explainKpis",
      label: "Explain KPIs",
      utteranceTemplate: "Explain the current dashboard KPIs and what they mean for audit progress.",
    },
    {
      id: "explain_deadlines",
      kind: "explain",
      labelId: "explainDeadlines",
      label: "Explain deadlines",
      utteranceTemplate: "Explain upcoming deadlines and open work on the dashboard.",
    },
  ],
  suggestions: [
    "Explain current KPIs and open work.",
    "What deadlines need attention this week?",
    "Summarize notifications and recommended next actions.",
  ],
  relatedObjectTypes: ["kpi", "notification", "deadline", "open_work"],
  knowledgeHints: ["dashboard overview", "engagement pipeline"],
  workflowHints: ["prioritize open work", "review notifications"],
});
