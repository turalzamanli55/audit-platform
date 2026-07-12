import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const planningContextResolver = defineModuleResolver({
  moduleId: "planning",
  displayName: "Planning",
  summary: "Explain ISA requirements, checklists, gaps, and planning summaries.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_isa",
      kind: "explain",
      labelId: "explainIsa",
      label: "Explain ISA requirement",
      utteranceTemplate: "Explain the ISA requirement related to {{object}} in planning.",
    },
    {
      id: "suggest_improvements",
      kind: "suggest",
      labelId: "suggestImprovements",
      label: "Suggest planning improvements",
      utteranceTemplate: "Suggest planning improvements for {{object}}.",
    },
    {
      id: "review_checklist",
      kind: "review",
      labelId: "reviewChecklist",
      label: "Review checklist",
      utteranceTemplate: "Review the planning checklist and highlight missing items for {{object}}.",
    },
    {
      id: "find_missing_planning",
      kind: "review",
      labelId: "findMissingPlanning",
      label: "Find missing planning",
      utteranceTemplate: "Find missing planning content for {{object}}.",
    },
    {
      id: "generate_planning_summary",
      kind: "generate",
      labelId: "generatePlanningSummary",
      label: "Generate planning summary",
      utteranceTemplate: "Generate a professional planning summary for {{object}}.",
    },
  ],
  suggestions: [
    "Explain the ISA requirement for this planning item.",
    "Find missing planning content.",
    "Generate a planning summary.",
  ],
  relatedObjectTypes: ["planning_item", "checklist", "isa_reference"],
  knowledgeHints: ["ISA planning", "audit strategy"],
});
