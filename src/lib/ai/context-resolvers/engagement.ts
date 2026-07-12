import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const engagementContextResolver = defineModuleResolver({
  moduleId: "engagements",
  displayName: "Engagement",
  summary: "Explain engagement status, blockers, progress, and next steps.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "show_blockers",
      kind: "analyze",
      labelId: "showBlockers",
      label: "Show blockers",
      utteranceTemplate: "Show blockers for engagement {{object}}.",
    },
    {
      id: "predict_completion",
      kind: "analyze",
      labelId: "predictCompletion",
      label: "Predict completion",
      utteranceTemplate: "Predict completion outlook for engagement {{object}} based on workflow state.",
    },
    {
      id: "suggest_next",
      kind: "suggest",
      labelId: "suggestNext",
      label: "Suggest next step",
      utteranceTemplate: "Suggest the next professional step for engagement {{object}}.",
    },
  ],
  suggestions: [
    "Summarize engagement progress.",
    "Show blockers and open risks.",
    "Suggest the next workflow step.",
  ],
  relatedObjectTypes: ["engagement", "workflow", "module"],
  workflowHints: ["planning", "materiality", "risk", "fieldwork", "review", "completion", "reporting"],
});
