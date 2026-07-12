import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const opinionContextResolver = defineModuleResolver({
  moduleId: "opinion",
  displayName: "Opinion",
  summary: "Explain opinions, compare opinion types, and check consistency.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "compare_opinion_types",
      kind: "compare",
      labelId: "compareOpinionTypes",
      label: "Compare opinion types",
      utteranceTemplate: "Compare opinion types relevant to {{object}}.",
    },
    {
      id: "check_consistency",
      kind: "review",
      labelId: "checkConsistency",
      label: "Check consistency",
      utteranceTemplate: "Check consistency of opinion {{object}} with engagement evidence and reporting.",
    },
  ],
  suggestions: [
    "Explain this opinion draft.",
    "Compare opinion types.",
    "Check consistency with reporting.",
  ],
  relatedObjectTypes: ["opinion_package", "opinion_section"],
  knowledgeHints: ["unmodified opinion", "qualified opinion", "emphasis of matter"],
});
