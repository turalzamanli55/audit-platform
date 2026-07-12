import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const fieldworkContextResolver = defineModuleResolver({
  moduleId: "fieldwork",
  displayName: "Fieldwork",
  summary: "Explain procedures, evidence, findings, and workpaper review.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_procedure",
      kind: "explain",
      labelId: "explainProcedure",
      label: "Explain procedure",
      utteranceTemplate: "Explain fieldwork procedure {{object}}.",
      requiresSelection: true,
    },
    {
      id: "summarize_evidence",
      kind: "summarize",
      labelId: "summarizeEvidence",
      label: "Summarize evidence",
      utteranceTemplate: "Summarize evidence for {{object}}.",
      requiresSelection: true,
    },
    {
      id: "explain_findings",
      kind: "explain",
      labelId: "explainFindings",
      label: "Explain findings",
      utteranceTemplate: "Explain findings related to {{object}}.",
    },
    {
      id: "suggest_next_procedures",
      kind: "suggest",
      labelId: "suggestNextProcedures",
      label: "Suggest next procedures",
      utteranceTemplate: "Suggest next fieldwork procedures after {{object}}.",
    },
    {
      id: "review_workpapers",
      kind: "review",
      labelId: "reviewWorkpapers",
      label: "Review workpapers",
      utteranceTemplate: "Review workpapers for {{object}} and highlight review points.",
    },
  ],
  suggestions: [
    "Explain this procedure.",
    "Summarize evidence and findings.",
    "Suggest next fieldwork procedures.",
  ],
  relatedObjectTypes: ["procedure", "evidence", "finding", "workpaper"],
});
