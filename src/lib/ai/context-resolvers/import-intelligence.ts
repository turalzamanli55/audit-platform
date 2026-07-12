import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const importIntelligenceContextResolver = defineModuleResolver({
  moduleId: "import-intelligence",
  displayName: "Import Intelligence",
  summary: "Explain unknown words, synonyms, mapping suggestions, and ERP context.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_unknown_words",
      kind: "explain",
      labelId: "explainUnknownWords",
      label: "Explain unknown words",
      utteranceTemplate: "Explain unknown words for {{object}}.",
      requiresSelection: true,
    },
    {
      id: "explain_synonym",
      kind: "explain",
      labelId: "explainSynonym",
      label: "Explain synonym",
      utteranceTemplate: "Explain synonym mapping for {{object}}.",
      requiresSelection: true,
    },
    {
      id: "suggest_import_mapping",
      kind: "suggest",
      labelId: "suggestImportMapping",
      label: "Suggest mapping",
      utteranceTemplate: "Suggest import mapping for {{object}}.",
      requiresSelection: true,
    },
    {
      id: "explain_erp",
      kind: "explain",
      labelId: "explainErp",
      label: "Explain ERP",
      utteranceTemplate: "Explain ERP context for {{object}}.",
    },
  ],
  suggestions: [
    "Explain this unknown word.",
    "Explain the synonym relationship.",
    "Suggest mapping for this import term.",
  ],
  relatedObjectTypes: ["dictionary_term", "synonym", "erp_profile"],
});
