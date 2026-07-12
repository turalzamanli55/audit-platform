import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const completionContextResolver = defineModuleResolver({
  moduleId: "completion",
  displayName: "Completion",
  summary: "Explain outstanding items, completion summaries, and checklists.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_outstanding",
      kind: "explain",
      labelId: "explainOutstanding",
      label: "Explain outstanding items",
      utteranceTemplate: "Explain outstanding completion items for {{object}}.",
    },
    {
      id: "generate_completion_summary",
      kind: "generate",
      labelId: "generateCompletionSummary",
      label: "Generate completion summary",
      utteranceTemplate: "Generate a completion summary for {{object}}.",
    },
    {
      id: "review_completion_checklist",
      kind: "review",
      labelId: "reviewCompletionChecklist",
      label: "Review checklist",
      utteranceTemplate: "Review the completion checklist for {{object}}.",
    },
  ],
  suggestions: [
    "Explain outstanding completion items.",
    "Generate a completion summary.",
    "Review the completion checklist.",
  ],
  relatedObjectTypes: ["completion_item", "checklist"],
});
