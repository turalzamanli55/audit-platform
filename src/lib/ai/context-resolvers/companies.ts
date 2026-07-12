import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const companiesContextResolver = defineModuleResolver({
  moduleId: "companies",
  displayName: "Companies",
  summary: "Explain company profiles, risks, gaps, and missing information.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "show_risks",
      kind: "analyze",
      labelId: "showRisks",
      label: "Show risks",
      utteranceTemplate: "Show key risks for company {{object}}.",
      requiresSelection: true,
    },
    {
      id: "generate_profile",
      kind: "generate",
      labelId: "generateProfile",
      label: "Generate profile",
      utteranceTemplate: "Generate a structured company profile summary for {{object}}.",
      requiresSelection: true,
    },
    {
      id: "find_missing",
      kind: "review",
      labelId: "findMissing",
      label: "Find missing information",
      utteranceTemplate: "Find missing information for company {{object}}.",
      requiresSelection: true,
    },
  ],
  suggestions: [
    "Explain company {{object}}.",
    "Show risks for this company.",
    "Find missing company information.",
  ],
  relatedObjectTypes: ["company", "engagement"],
  knowledgeHints: ["company master data", "engagement linkage"],
});
