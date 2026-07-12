import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const reportingContextResolver = defineModuleResolver({
  moduleId: "reporting",
  displayName: "Reporting",
  summary: "Explain reports, improve wording, summarize sections, and draft executive summaries.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "improve_wording",
      kind: "suggest",
      labelId: "improveWording",
      label: "Improve wording",
      utteranceTemplate: "Improve professional wording for report section {{object}}.",
      requiresSelection: true,
    },
    {
      id: "summarize_sections",
      kind: "summarize",
      labelId: "summarizeSections",
      label: "Summarize sections",
      utteranceTemplate: "Summarize reporting sections related to {{object}}.",
    },
    {
      id: "generate_executive_summary",
      kind: "generate",
      labelId: "generateExecutiveSummary",
      label: "Generate executive summary",
      utteranceTemplate: "Generate an executive summary for reporting package {{object}}.",
    },
  ],
  suggestions: [
    "Explain this report section.",
    "Improve wording for professional clarity.",
    "Generate an executive summary.",
  ],
  relatedObjectTypes: ["report_section", "report_package"],
});
