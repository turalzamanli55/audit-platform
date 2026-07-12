import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const reviewContextResolver = defineModuleResolver({
  moduleId: "review",
  displayName: "Review",
  summary: "Explain review notes, draft responses, resolutions, and history.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_review_notes",
      kind: "explain",
      labelId: "explainReviewNotes",
      label: "Explain review notes",
      utteranceTemplate: "Explain review notes for {{object}}.",
      requiresSelection: true,
    },
    {
      id: "draft_response",
      kind: "generate",
      labelId: "draftResponse",
      label: "Draft response",
      utteranceTemplate: "Draft a professional response to review notes on {{object}}.",
      requiresSelection: true,
    },
    {
      id: "suggest_resolution",
      kind: "suggest",
      labelId: "suggestResolution",
      label: "Suggest resolution",
      utteranceTemplate: "Suggest a resolution path for review item {{object}}.",
      requiresSelection: true,
    },
    {
      id: "summarize_review_history",
      kind: "summarize",
      labelId: "summarizeReviewHistory",
      label: "Summarize review history",
      utteranceTemplate: "Summarize review history for {{object}}.",
    },
  ],
  suggestions: [
    "Explain these review notes.",
    "Draft a response to the reviewer.",
    "Summarize review history.",
  ],
  relatedObjectTypes: ["review_item", "review_note", "comment"],
});
